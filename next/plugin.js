const fs = require("fs");
const path = require("path");

const { buildLookup } = require("../src/build");
const { loadConfig } = require("../src/config");

function withTailwindGroupify(nextConfig = {}, pluginOptions = {}) {
  return {
    ...nextConfig,

    webpack(config, context = {}) {
      const root = context.dir || process.cwd();
      const include = pluginOptions.include || ["src/**/*.{jsx,tsx}"];
      const cssOutput = pluginOptions.cssOutput || "tw-groupify.css";
      const groupifyConfig = { ...loadConfig(), ...pluginOptions };
      const state = buildLookup(include, groupifyConfig);
      const cssPath = path.resolve(root, cssOutput);

      fs.mkdirSync(path.dirname(cssPath), { recursive: true });
      fs.writeFileSync(cssPath, state.css, "utf8");

      config.module.rules.push({
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve("./loader.js"),
            options: {
              classLookup: Array.from(state.classLookup.entries()),
            },
          },
        ],
      });

      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, context);
      }

      return config;
    },
  };
}

module.exports = withTailwindGroupify;
