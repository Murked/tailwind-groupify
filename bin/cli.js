#!/usr/bin/env node

const fs = require("fs");
const { run } = require("../src/index");

const patterns = process.argv.slice(2);

if (!patterns.length) {
  console.log("Usage: tw-groupify 'src/**/*.jsx'");
  process.exit(1);
}

const result = run(patterns);

if (result.skipped) {
  console.log("No changes detected (cache hit)");
  process.exit(0);
}

result.rewritten.forEach(({ file, code }) => {
  fs.writeFileSync(file, code, "utf-8");
});

fs.writeFileSync("tw-groupify.css", result.css);
fs.writeFileSync("tw-safelist.js", result.safelistConfig);

console.log("\nDone with incremental build");
