function generateCSS(aliases) {
  let css = "";

  for (const alias in aliases) {
    const classes = aliases[alias].join(" ");

    css += `.${alias} {\n  @apply ${classes};\n}\n\n`;
  }

  return css;
}

module.exports = { generateCSS };