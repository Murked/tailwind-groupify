function createOverlay(aliases) {
  return `
    const div = document.createElement("div");
    div.style.position = "fixed";
    div.style.bottom = "10px";
    div.style.right = "10px";
    div.style.background = "#111";
    div.style.color = "#0f0";
    div.style.padding = "10px";
    div.style.fontSize = "12px";
    div.style.zIndex = 9999;
    div.style.maxHeight = "200px";
    div.style.overflow = "auto";

    div.innerHTML = "<b>TW Groupify</b><br/>" + 
      ${JSON.stringify(Object.entries(aliases))}
        .map(([k,v]) => k + " → " + v.join(" "))
        .join("<br/>");

    document.body.appendChild(div);
  `;
}

module.exports = { createOverlay };