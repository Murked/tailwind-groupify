# ⚡ tailwind-groupify

> Automatically extract repeated [TailwindCSS](https://tailwindcss.com) utility combinations into shared generated classes, reducing HTML/JSX size and keeping large codebases easier to maintain - with zero runtime cost.

Large Tailwind codebases often repeat the same utility combinations hundreds of times:

- `flex items-center justify-center`
- `grid gap-4`
- `text-sm font-medium`

tailwind-groupify detects these patterns across your project, extracts them into generated classes using `@apply`, and rewrites your markup automatically.

### Benefits

- Deduplicates repeated utility classes
- Reduces HTML and JSX output size
- Extracts shared utility patterns across files
- Generates reusable classes at build time
- Adds zero runtime overhead

Turn this:

```jsx
<div className="flex items-center justify-center p-4 bg-red-500" />
<div className="flex items-center justify-center p-2 bg-blue-500" />
```

Into this:

```jsx
<div className="p-4 bg-red-500 twg-0" />
<div className="p-2 bg-blue-500 twg-0" />
```

With generated CSS:

```css
.twg-0 {
  @apply flex items-center justify-center;
}
```

---

## 🚀 Why use tailwind-groupify?

* 📦 Reduce HTML + JSX size
* 🔁 Deduplicate repeated Tailwind patterns
* ⚡ Zero runtime cost
* 🧠 Works across your entire codebase
* 🧼 Keep repeated utility patterns easier to manage

---

## ✨ Features

* 🔍 AST-based analysis (safe transforms)
* 🧩 Multi-file pattern extraction
* 🔥 Pair + triple grouping (Apriori-lite)
* ⚡ Incremental builds (fast)
* 🧠 Tailwind-aware (`@apply`)
* 🛡️ Order-safe mode (important!)
* ⚙️ Configurable thresholds
* 🏷️ Configurable generated class prefix
* ⚡ Vite plugin
* ▲ Next.js plugin

> Status: early release. Use on a branch first and review generated diffs before adopting in production.

---

## 📦 Install

```bash
npm install tailwind-groupify
```

---

# ⚡ Vite Usage

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import twGroupify from "tailwind-groupify/vite";

export default defineConfig({
  plugins: [
    react(),
    twGroupify({
      include: ["src/**/*.{jsx,tsx}"],
    }),
  ],
});
```

### Import generated CSS

```js
import "virtual:tw-groupify.css";
```

---

# ▲ Next.js Usage

### next.config.js

```js
const withTWGroupify = require("tailwind-groupify/next");

module.exports = withTWGroupify({}, {
  include: ["src/**/*.{jsx,tsx}"],
  cssOutput: "tw-groupify.css",
});
```

Then import the generated CSS once from your app entry point:

```js
import "../tw-groupify.css";
```

---

# ⚙️ Configuration

Create `tw-groupify.config.js`:

```js
module.exports = {
  minGroupSize: 2,
  minOccurrences: 2,
  maxCombinationSize: 3,
  classPrefix: "twg-",

  // Important when Tailwind utility order matters.
  preserveOrder: true,

  // Optional glob ignores used by the CLI and Vite plugin.
  ignorePatterns: [],

  // optional
  debug: false,
};
```

---

# 🧪 Examples

## Basic Deduplication

### Input

```jsx
<div className="flex items-center justify-center p-4" />
<div className="flex items-center justify-center p-2" />
```

### Output

```jsx
<div className="p-4 twg-0" />
<div className="p-2 twg-0" />
```

---

## Works Across Files

```jsx
// Button.jsx
<button className="flex items-center justify-center px-4 py-2" />

// Card.jsx
<div className="flex items-center justify-center p-6" />
```

→ Shared group extracted globally.

---

## Dynamic Classes

```jsx
<div className={`p-4 ${active ? "bg-red-500" : ""}`} />
```

→ Left unchanged. Dynamic class expressions are skipped so runtime behavior is not changed.

---

## Order Safety

```jsx
<div className="hover:bg-red-500 bg-blue-500" />
```

With:

```js
preserveOrder: true
```

→ Preserves utility order while selecting repeated groups. Review generated diffs when classes intentionally conflict.

---

# 📊 Metrics

When enabled, shows:

* Total class strings analyzed
* Groups extracted
* Bytes saved (approx)
* Compression ratio

---

# 🧠 How it works

1. Parse JSX/TSX using AST
2. Extract className strings
3. Find frequent class combinations
4. Replace with short aliases
5. Generate CSS using `@apply`

---

# ⚠️ Limitations

* Dynamic classNames are skipped
* Tailwind order matters (use `preserveOrder`)
* Turbopack support is experimental

---

# 🛣️ Roadmap

* Dev overlay
* Analyzer UI
* Next.js Turbopack support
* Source maps

---

# 🤝 Contributing

PRs welcome!

---

# 📄 License

MIT
