function estimateSize(str) {
  return Buffer.byteLength(str, "utf-8");
}

function calculateMetrics(original, optimized, aliases) {
  const originalSize = estimateSize(original.join(" "));
  const optimizedSize = estimateSize(optimized.join(" "));

  const saved = originalSize - optimizedSize;
  const ratio = ((saved / originalSize) * 100).toFixed(2);

  return {
    originalSize,
    optimizedSize,
    bytesSaved: saved,
    compressionRatio: ratio + "%",
    groups: Object.keys(aliases).length,
  };
}

function printMetrics(metrics) {
  console.log("\nTailwind Groupify Metrics:");
  console.log("--------------------------------");
  console.log(`Original size:   ${metrics.originalSize} bytes`);
  console.log(`Optimized size:  ${metrics.optimizedSize} bytes`);
  console.log(`Saved:           ${metrics.bytesSaved} bytes`);
  console.log(`Compression:     ${metrics.compressionRatio}`);
  console.log(`Groups created:  ${metrics.groups}`);
  console.log("--------------------------------\n");
}

module.exports = {
  calculateMetrics,
  printMetrics,
};
