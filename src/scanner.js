const glob = require("glob");
const fs = require("fs");

function scanFiles(patterns, ignorePatterns = []) {
  const files = patterns.flatMap((pattern) => glob.sync(pattern, {
    ignore: ignorePatterns,
  }));

  return files.map((file) => ({
    file,
    code: fs.readFileSync(file, "utf-8"),
  }));
}

module.exports = { scanFiles };
