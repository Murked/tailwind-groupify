const generate = require("@babel/generator").default;
const t = require("@babel/types");

function rewriteFiles(filesData, optimizedLists) {
  let index = 0;

  const outputs = [];

  for (const fileData of filesData) {
    const { ast, classNodes } = fileData;

    classNodes.forEach((node) => {
      const newClasses = optimizedLists[index++];

      const newValue = Array.isArray(newClasses)
        ? newClasses.join(" ")
        : newClasses;

      node.path.node.value = t.stringLiteral(newValue);
    });

    const output = generate(ast).code;

    outputs.push({
      file: fileData.file,
      code: output,
    });
  }

  return outputs;
}

function rewriteParsedFile(parsed, classLookup) {
  let changed = false;

  parsed.classNodes.forEach((node) => {
    const mapped = classLookup.get(node.value);

    if (!mapped) return;

    node.path.node.value = t.stringLiteral(mapped);
    changed = true;
  });

  if (!changed) return null;

  return generate(parsed.ast).code;
}

module.exports = { rewriteFiles, rewriteParsedFile };
