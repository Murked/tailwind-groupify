const { scanFiles } = require("./scanner");
const { parseFile } = require("./parser");
const { optimize } = require("./optimizer");
const { generateCSS } = require("./generator");

function buildLookup(patterns, config) {
  const allClasses = [];
  const files = scanFiles(patterns, config.ignorePatterns);

  for (const { file, code } of files) {
    const parsed = parseFile(code, {
      typescript: /\.[cm]?tsx?$/.test(file),
    });

    allClasses.push(...parsed.classNodes.map(n => n.value));
  }

  if (!allClasses.length) {
    return {
      aliases: {},
      css: "",
      classLookup: new Map(),
      allClasses,
    };
  }

  const result = optimize(allClasses, config);
  const classLookup = new Map();

  result.classLists.forEach((list, i) => {
    classLookup.set(allClasses[i], list.join(" "));
  });

  return {
    aliases: result.aliases,
    css: generateCSS(result.aliases),
    classLookup,
    allClasses,
  };
}

module.exports = { buildLookup };
