const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { parseFile } = require("../src/parser");
const { optimize } = require("../src/optimizer");
const { generateCSS } = require("../src/generator");
const { rewriteParsedFile } = require("../src/rewriter");
const { scanFiles } = require("../src/scanner");
const { normalize } = require("../src/utils");
const vitePlugin = require("../vite/plugin");
const withNextGroupify = require("../next/plugin");
const nextLoader = require("../next/loader");

test("parses static TSX className values", () => {
  const code = `type Props = { active: boolean };
export function Demo(props: Props) {
  return <div className="flex items-center p-4" data-active={props.active} />;
}`;

  const parsed = parseFile(code, { typescript: true });

  assert.equal(parsed.classNodes.length, 1);
  assert.equal(parsed.classNodes[0].value, "flex items-center p-4");
});

test("ignores dynamic className values", () => {
  const code = `export function Demo({ active }) {
  return <div className={\`p-4 \${active ? "bg-red-500" : ""}\`} />;
}`;

  const parsed = parseFile(code);

  assert.equal(parsed.classNodes.length, 0);
});

test("uses configurable readable aliases", () => {
  const result = optimize([
    "flex items-center justify-center p-4",
    "flex items-center justify-center p-2",
  ], {
    minGroupSize: 2,
    minOccurrences: 2,
    maxCombinationSize: 3,
    preserveOrder: true,
    classPrefix: "twg-",
  });

  assert.deepEqual(Object.keys(result.aliases), ["twg-0"]);
  assert.match(generateCSS(result.aliases), /^\.twg-0 \{/);
});

test("normalizes empty class strings without fake classes", () => {
  assert.deepEqual(normalize("   "), []);
});

test("rewrites files from a precomputed class lookup", () => {
  const parsed = parseFile(`export function Demo() {
  return <div className="flex items-center justify-center p-4" />;
}`);
  const lookup = new Map([
    ["flex items-center justify-center p-4", "p-4 twg-0"],
  ]);

  const output = rewriteParsedFile(parsed, lookup);

  assert.match(output, /className="p-4 twg-0"/);
});

test("does not rewrite when no precomputed alias exists", () => {
  const parsed = parseFile(`export function Demo() {
  return <div className="flex items-center p-4" />;
}`);

  const output = rewriteParsedFile(parsed, new Map());

  assert.equal(output, null);
});

test("scanner applies ignore patterns", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "twg-"));
  const keep = path.join(root, "keep.jsx");
  const skip = path.join(root, "skip.jsx");

  fs.writeFileSync(keep, "export default <div />;", "utf8");
  fs.writeFileSync(skip, "export default <span />;", "utf8");

  const files = scanFiles([
    path.join(root, "*.jsx").replace(/\\/g, "/"),
  ], [
    path.join(root, "skip.jsx").replace(/\\/g, "/"),
  ]);

  assert.deepEqual(files.map(file => path.basename(file.file)), ["keep.jsx"]);
});

test("vite plugin precomputes CSS and transforms modules", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "twg-vite-"));
  const one = path.join(root, "one.jsx");
  const two = path.join(root, "two.jsx");

  fs.writeFileSync(one, `export function One() {
  return <div className="flex items-center justify-center p-4" />;
}`, "utf8");
  fs.writeFileSync(two, `export function Two() {
  return <div className="flex items-center justify-center p-2" />;
}`, "utf8");

  const plugin = vitePlugin({
    include: [path.join(root, "*.jsx").replace(/\\/g, "/")],
  });

  plugin.configResolved();
  plugin.buildStart();

  const css = plugin.load("\0virtual:tw-groupify.css");
  const result = plugin.transform(fs.readFileSync(one, "utf8"), one);

  assert.match(css, /\.twg-0 \{/);
  assert.match(result.code, /className="p-4 twg-0"/);
});

test("next plugin emits CSS and passes lookup to loader", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "twg-next-"));
  const one = path.join(root, "one.jsx");
  const two = path.join(root, "two.jsx");

  fs.writeFileSync(one, `export function One() {
  return <div className="flex items-center justify-center p-4" />;
}`, "utf8");
  fs.writeFileSync(two, `export function Two() {
  return <div className="flex items-center justify-center p-2" />;
}`, "utf8");

  const nextConfig = withNextGroupify({}, {
    include: [path.join(root, "*.jsx").replace(/\\/g, "/")],
    cssOutput: "generated/tw-groupify.css",
  });
  const webpackConfig = nextConfig.webpack({ module: { rules: [] } }, { dir: root });
  const rule = webpackConfig.module.rules[0];
  const css = fs.readFileSync(path.join(root, "generated", "tw-groupify.css"), "utf8");
  const output = nextLoader.call({
    getOptions: () => rule.use[0].options,
    resourcePath: one,
  }, fs.readFileSync(one, "utf8"));

  assert.match(css, /\.twg-0 \{/);
  assert.match(output, /className="p-4 twg-0"/);
});
