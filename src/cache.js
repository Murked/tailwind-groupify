const fs = require("fs");
const crypto = require("crypto");

const CACHE_FILE = ".tw-groupify-cache.json";

function hash(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function hasFileChanged(file, content, cache) {
  const h = hash(content);

  if (cache[file] !== h) {
    cache[file] = h;
    return true;
  }

  return false;
}

module.exports = {
  loadCache,
  saveCache,
  hasFileChanged,
};