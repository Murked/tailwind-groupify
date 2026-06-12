const { parseFile } = require("../src/parser");
const { rewriteParsedFile } = require("../src/rewriter");

module.exports = function (source) {
  const options = this.getOptions ? this.getOptions() : {};
  const classLookup = new Map(options.classLookup || []);

  if (!classLookup.size) return source;

  const parsed = parseFile(source, {
    typescript: /\.[cm]?tsx?$/.test(this.resourcePath || ""),
  });

  if (!parsed.classNodes.length) return source;

  return rewriteParsedFile(parsed, classLookup) || source;
};
