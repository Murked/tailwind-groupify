function normalize(str, preserveOrder = true) {
  const parts = str.trim().split(/\s+/).filter(Boolean);

  return preserveOrder ? parts : parts.sort();
}

function combinations(arr, size) {
  const result = [];

  function helper(start, combo) {
    if (combo.length === size) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      helper(i + 1, combo);
      combo.pop();
    }
  }

  helper(0, []);
  return result;
}

module.exports = { normalize, combinations };
