const { readFileSync } = require("fs");
const { join: joinPath } = require("path");
const { parse } = require("csv-parse/sync");

function parseCSVSync(filePath) {
  const text = readFileSync(joinPath(__dirname, filePath)).toString();
  const records = parse(text, {
    columns: true,
    skip_empty_lines: true,
  });

  // will hold parsed CSV data
  let csvData = {};

  // get headings (e.g. "Topics, Processes, Binaries")
  const headings = Object.keys(records[0]);

  // create an empty array for each one
  headings.forEach((key) => (csvData[key] = []));

  // for each row, push words to csvData
  records.forEach((row) => {
    Object.keys(row).forEach((key) => {
      if (row[key] && row[key] !== "") {
        csvData[key].push(row[key]);
      }
    });
  });

  // return parsed info
  return csvData;
}

module.exports = parseCSVSync;
