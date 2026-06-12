function virtualCSSPlugin(getCSS) {
  const VIRTUAL_ID = "virtual:tw-groupify.css";
  const RESOLVED = "\0" + VIRTUAL_ID;

  return {
    name: "tw-groupify-virtual-css",

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED;
    },

    load(id) {
      if (id === RESOLVED) {
        return getCSS();
      }
    },
  };
}

module.exports = virtualCSSPlugin;