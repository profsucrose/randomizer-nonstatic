const { execSync } = require("child_process");
const { DefinePlugin } = require("webpack");
const parseCSVSync = require("./parse_csv");

module.exports = function override(config) {
  console.log(getCommandOutputSync("git remote -v"));

  // parse word list csv (synchronous)
  const parsedLists = parseCSVSync("./lists/lists.csv");

  const fullCommitHash = getCommandOutputSync("git rev-parse HEAD");
  const repoUrl = getCommandOutputSync("git remote get-url origin");

  // add my extras
  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    new DefinePlugin({
      __COMMIT_HASH__: fullCommitHash,
      __REPOSITORY_URL__: repoUrl,
      __RANDOMIZER_LISTS__: JSON.stringify(parsedLists),
    })
  );

  return config;
};

function getCommandOutputSync(command) {
  return JSON.stringify(execSync(command).toString().trim());
}
