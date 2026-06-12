const fs = require("fs");
const { scanFiles } = require("./scanner");
const { parseFile } = require("./parser");
const { optimize } = require("./optimizer");
const { generateCSS } = require("./generator");
const { rewriteFiles } = require("./rewriter");
const { calculateMetrics, printMetrics } = require("./metrics");
const {
  generateSafelist,
  generateTailwindConfigSafelist,
} = require("./safelist");
const { loadConfig } = require("./config");
const {
  loadCache,
  saveCache,
  hasFileChanged,
} = require("./cache");

function run(patterns) {
  const config = loadConfig();
  const cache = loadCache();

  const files = scanFiles(patterns, config.ignorePatterns);

  const changed = files.some(({ file, code }) =>
    hasFileChanged(file, code, cache)
  );

  if (!changed) {
    return { skipped: true };
  }

  let allClasses = [];
  const parsedFiles = [];

  files.forEach(({ file, code }) => {
    const parsed = parseFile(code, {
      typescript: /\.[cm]?tsx?$/.test(file),
    });

    parsedFiles.push({
      file,
      ast: parsed.ast,
      classNodes: parsed.classNodes,
    });

    parsed.classNodes.forEach(n => {
      allClasses.push(n.value);
    });
  });

  const { classLists, aliases } = optimize(allClasses, config);
  
  const optimizedStrings = classLists.map(l => l.join(" "));
  
  const metrics = calculateMetrics(
    allClasses,
    optimizedStrings,
    aliases
  );
  
  if (config.debug) {
    printMetrics(metrics);
  }

  const rewritten = rewriteFiles(parsedFiles, classLists);

  const css = generateCSS(aliases);

  const safelist = generateSafelist(allClasses);
  const safelistConfig = generateTailwindConfigSafelist(safelist);

  saveCache(cache);

  return {
    rewritten,
    css,
    aliases,
    safelist,
    safelistConfig,
  };
}

module.exports = { run };
