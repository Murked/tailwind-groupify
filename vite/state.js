let globalState = {
  allClasses: [],
  aliases: {},
  classLookup: new Map(),
  css: "",
};

function resetState() {
  globalState.allClasses = [];
  globalState.aliases = {};
  globalState.classLookup.clear();
  globalState.css = "";
}

module.exports = {
  globalState,
  resetState,
};
