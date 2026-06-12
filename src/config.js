const fs = require("fs");

const defaultConfig = {
  minGroupSize: 2,
  minOccurrences: 2,
  maxCombinationSize: 3,
  classPrefix: "twg-",
  ignorePatterns: [],
  preserveOrder: true,
  debug: false,
};

function loadConfig() {
  const path = "tw-groupify.config.js";

  if (fs.existsSync(path)) {
    const userConfig = require(process.cwd() + "/" + path);
    return { ...defaultConfig, ...userConfig };
  }

  return defaultConfig;
}

module.exports = { loadConfig };
