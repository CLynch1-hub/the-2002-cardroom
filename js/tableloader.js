// Simple CSV parser
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line =>
    line.split(",").map(cell => cell.trim().replace(/^"|"$/g, ""))
  );
}

// Generic table loader
function createTable(containerId, csvPath) {
  fetch(csvPath)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      if (!rows.length) return;

      const container = document.getElementById(containerId);
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Header row
      const headerRow = document.createElement("tr");
      rows[0].forEach(col => {
        const th = document.createElement("