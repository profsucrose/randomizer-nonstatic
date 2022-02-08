// hooks
import useSWR from "swr";

// types
import { RandomizerInfo } from "../interfaces/randomizer";
import { hashString } from "../utils/hash";

// utils
import { listDirectoryFetcher } from "../utils/lists";

// names of lists
const listNames = __LIST_NAMES_TEXT__.split("\n");

export default function useLists() {
  const { data, error } = useSWR(listNames, fetchMultipleLists);

  return {
    data,
    loading: typeof data === "undefined",
    error,
  };
}

async function fetchMultipleLists(...fileNames: string[]) {
  // get text value from each
  const f = async (name: string) => {
    const req = await listDirectoryFetcher(name + ".txt");
    const items = (await req.text()).trim().split("\n");

    // split text by carriage return to generate word list
    return {
      name,
      items,
      id: hashString(name + JSON.stringify(items)),
    } as RandomizerInfo;
  };

  return await Promise.all(fileNames.map(f));
}
