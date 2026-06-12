const { parseFile } = require("../src/parser");
const { loadConfig } = require("../src/config");
const { rewriteParsedFile } = require("../src/rewriter");
const { buildLookup } = require("../src/build");
const { createOverlay } = require("./overlay");
const { globalState, resetState } = require("./state");

const VIRTUAL_CSS_ID = "virtual:tw-groupify.css";
const RESOLVED_VIRTUAL_CSS_ID = "\0" + VIRTUAL_CSS_ID;

function buildState(config, include) {
  resetState();
  const state = buildLookup(include, config);

  globalState.allClasses = state.allClasses;
  globalState.aliases = state.aliases;
  globalState.css = state.css;
  globalState.classLookup = state.classLookup;
}

function tailwindGroupify(options = {}) {
  let config;
  const include = options.include || ["src/**/*.{jsx,tsx}"];

  return {
    name: "tailwind-groupify",
    enforce: "pre",

    configResolved() {
      config = { ...loadConfig(), ...options };
    },

    buildStart() {
      buildState(config, include);
    },

    resolveId(id) {
      if (id === VIRTUAL_CSS_ID) {
        return RESOLVED_VIRTUAL_CSS_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_CSS_ID) {
        return globalState.css || "";
      }
    },

    transform(code, id) {
      if (!id.endsWith(".jsx") && !id.endsWith(".tsx")) return;
      if (!globalState.classLookup.size) return;

      const parsed = parseFile(code, {
        typescript: /\.[cm]?tsx?$/.test(id),
      });

      if (!parsed.classNodes.length) return;

      const transformed = rewriteParsedFile(parsed, globalState.classLookup);

      if (!transformed) return;

      return {
        code: transformed,
        map: null,
      };
    },
    
    transformIndexHtml(html) {
      if (process.env.NODE_ENV !== "development") return;
    
      return {
        html,
        tags: [
          {
            tag: "script",
            injectTo: "body",
            children: createOverlay(globalState.aliases),
          },
        ],
      };
    },

    handleHotUpdate() {
      buildState(config, include);
    },
  };
}

module.exports = tailwindGroupify;
