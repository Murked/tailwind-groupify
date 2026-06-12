const { normalize } = require("./utils");
const { buildFrequencyMap, selectGroups } = require("./apriori");

function scoreGroup(group) {
  return group.classes.length * group.count;
}

function optimize(classStrings, config) {
  const classPrefix = config.classPrefix || "twg-";
  let classLists = classStrings.map(str =>
    normalize(str, config.preserveOrder)
  );

  const freq = buildFrequencyMap(
    classLists,
    config.maxCombinationSize
  );

  let groups = selectGroups(freq, config.minOccurrences);

  groups = groups.filter(
    g => g.classes.length >= config.minGroupSize
  );

  groups.sort((a, b) => scoreGroup(b) - scoreGroup(a));

  const aliases = {};
  let aliasIndex = 0;

  for (const group of groups) {
    const alias = `${classPrefix}${aliasIndex}`;
    let usageCount = 0;

    const newLists = classLists.map(list => {
      const hasAll = group.classes.every(c => list.includes(c));

      if (hasAll) {
        usageCount++;

        const filtered = list.filter(c => !group.classes.includes(c));

        return [...filtered, alias];
      }

      return list;
    });

    if (usageCount >= config.minOccurrences) {
      aliases[alias] = group.classes;
      classLists = newLists;
      aliasIndex++;
    }
  }

  return {
    classLists,
    aliases,
  };
}

module.exports = { optimize };
