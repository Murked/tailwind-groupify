function generateSafelist(originalClassStrings) {
  const set = new Set();

  originalClassStrings.forEach((str) => {
    str.split(/\s+/).forEach((c) => {
      if (c.trim()) set.add(c);
    });
  });

  return Array.from(set);
}

function generateTailwindConfigSafelist(safelist) {
  return `
/** Add this to your tailwind.config.js */
module.exports = {
  safelist: ${JSON.stringify(safelist, null, 2)}
}
`;
}

module.exports = {
  generateSafelist,
  generateTailwindConfigSafelist,
};
