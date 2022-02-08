const { join: joinPath } = require("path");
const { readFileSync } = require("fs");
const { DefinePlugin } = require("webpack");

// Thanks https://stackoverflow.com/a/38401256
let fullCommitHash = require("child_process")
  .execSync("git rev-parse HEAD")
  .toString()
  .trim();

const listNamesText = readFileSync(
  joinPath(__dirname, "./public/lists/all.txt")
).toString();

module.exports = function override(config) {
  // add git commit hash
  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    new DefinePlugin({
      __COMMIT_HASH__: JSON.stringify(fullCommitHash),
      __LIST_NAMES_TEXT__: JSON.stringify(listNamesText),
    })
  );

  return config;
};
