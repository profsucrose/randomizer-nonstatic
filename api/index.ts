import { GoogleSpreadsheet } from "google-spreadsheet";
import { Redis } from "@upstash/redis";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";

console.log(
  "Connecting to Redis with environment: " + JSON.stringify(process.env)
);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const app: Express = express();

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

const doc = new GoogleSpreadsheet(GOOGLE_SHEET_ID);
doc.useApiKey(GOOGLE_API_KEY);

// Helper for getting first non-null element in array after index
// e.g. closestFirstElement([1, null, null, 2, null], 2) -> 1
const closestFirstElement = <T>(arr: T[], index: number): T =>
  arr
    .slice(0, index + 1)
    .reverse()
    .find((v) => v)!;

async function fetchSheetAsCSV() {
  // Load sheet
  await doc.loadInfo();

  // Get first (main) sheet
  const sheet = doc.sheetsByIndex[0];

  // Get rows
  const rows = await sheet.getRows();

  // For each row, assign each cell to
  // own bucket through header value
  let result: { [key: string]: string[] } = {};
  rows.forEach((row) => {
    (
      Object.entries(
        row._rawData.reduce(
          (groups: { [key: string]: string }, cell: string, index: number) => {
            if (!cell) return groups;

            const bucketName = closestFirstElement<string>(
              row._sheet.headerValues,
              index
            )!;
            return {
              ...groups,
              [bucketName]: ((groups[bucketName] || "") + " " + cell).trim(),
            };
          },
          {}
        )
      ) as [[string, string]]
    ).forEach(([name, bucket]) => {
      result = { ...result, [name]: [...(result[name] || []), bucket] };
    });
  });

  return result;
}

function generateRanges(list: List) {
  Object.entries(list).forEach(([k, cell]: [k: string, cell: string]) => {
    const exp = new RegExp(/([0-9]+)-([0-9]+)/);

    for (;;) {
      const group = exp.exec(cell);
      if (!group) break;
      const num =
        Math.floor(Math.random() * Number(group[2])) - Number(group[1]);
      cell =
        cell.substring(0, group.index) +
        num +
        cell.substring(group.index + group[0].length);
    }

    list[k] = cell;
  });

  return list;
}

function sampleLists(lists: Lists) {
  const list = Object.entries(lists).reduce(
    (list, [key, values]) => ({
      ...list,
      [key]: values[Math.floor(Math.random() * values.length)],
    }),
    {}
  );

  return generateRanges(list);
}

// Generates random 32 character string for tracking clients
const generateIdentifier = () =>
  new Array(32)
    .fill(null)
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join("");

const TIME_UNTIL_NEW = 30 * 60 * 1000; // 30 Minutes

// Tag each client with time when list was generated, and list
interface UserEntry {
  generatedAt: number;
  currentList: List;
}

type Lists = { [category: string]: string[] };
type List = { [category: string]: string };

app.use(cookieParser());

app.get("/api/list", async (req: Request, res: Response) => {
  // Get identity of client
  const identString = req.cookies["ident"];

  // If nothing stored in cookie, then generate
  // new identifier new identifier and set in cookie headers
  let ident: string;
  if (!identString) {
    ident = generateIdentifier();
    res.cookie("ident", ident);
  } else ident = identString;

  const entryKey = "entries:" + ident;

  const clientEntry: UserEntry = (await redis.get(entryKey)) as UserEntry;

  // Send request in background to update cache
  console.log("Sending update request");

  // Check if data for client is stored
  if (clientEntry) {
    let isNew = false;

    // If time delay as elapsed, update user's list
    if (TIME_UNTIL_NEW - (Date.now() - clientEntry.generatedAt) <= 0) {
      clientEntry.generatedAt = Date.now();
      clientEntry.currentList = sampleLists(await fetchSheetAsCSV());
      redis.set(entryKey, JSON.stringify(clientEntry));
      isNew = true;
    }

    // Fulfill request
    res.json({
      isNew,
      timeLeft: TIME_UNTIL_NEW - (Date.now() - clientEntry.generatedAt),
      list: clientEntry.currentList,
    });
  } else {
    // If user data is not in cache, then
    // generate new data and send to client
    const entry: UserEntry = {
      generatedAt: Date.now(),
      currentList: sampleLists(await fetchSheetAsCSV()),
    };

    redis.set(entryKey, JSON.stringify(entry));

    res.json({
      isNew: true,
      timeLeft: TIME_UNTIL_NEW,
      list: entry.currentList,
    });
  }
});

export default app;
