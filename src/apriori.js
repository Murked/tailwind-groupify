const { combinations } = require("./utils");

function buildFrequencyMap(classLists, maxSize = 3) {
  const freq = new Map();

  for (const list of classLists) {
    for (let size = 2; size <= maxSize; size++) {
      const combos = combinations(list, size);

      combos.forEach(combo => {
        const key = combo.join(" ");
        freq.set(key, (freq.get(key) || 0) + 1);
      });
    }
  }

  return freq;
}

function selectGroups(freqMap, minCount = 2) {
  const groups = [];

  for (const [key, count] of freqMap.entries()) {
    if (count >= minCount) {
      groups.push({
        classes: key.split(" "),
        count,
      });
    }
  }

  // Rank by impact
  groups.sort((a, b) => {
    return (b.classes.length * b.count) - (a.classes.length * a.count);
  });

  return groups;
}

module.exports = { buildFrequencyMap, selectGroups };