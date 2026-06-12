const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

function parseFile(code, options = {}) {
  const plugins = ["jsx"];

  if (options.typescript) {
    plugins.push("typescript");
  }

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins,
  });

  const classNodes = [];

  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name !== "className") return;

      const val = path.node.value;
      if (!val) return;

      // Only rewrite plain static className strings. Dynamic values are left
      // untouched because replacing the whole attribute would change behavior.
      if (val.type === "StringLiteral") {
        classNodes.push({
          path,
          value: val.value,
        });
      }
    },
  });

  return { ast, classNodes };
}

module.exports = { parseFile };
