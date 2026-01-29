// ----------------------------------------------------
// CSV PARSER
// ----------------------------------------------------
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line =>
    line.split(",").map(cell => cell.trim().replace(/^"|"$/g, ""))
  );
}

// ----------------------------------------------------
// GENERIC TABLE LOADER
// ----------------------------------------------------
function createTable(containerId, csvPath) {
  fetch(csvPath)
    .then(res => res.text())
    .then(text => {
      const rows = parseCSV(text);
      if (!rows.length) return;

      const container = document.getElementById(containerId);
      if (!container) return;

      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      // Header row
      const headerRow = document.createElement("tr");
      rows[0].forEach(col => {
        const th = document.createElement("th");
        th.textContent = col;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);

      // Body rows
      rows.slice(1).forEach(row => {
        if (row.length === 1 && row[0] === "") return;

        const tr = document.createElement("tr");
        row.forEach((cell, i) => {
          const td = document.createElement("td");
          td.textContent = cell;
          td.setAttribute("data-label", rows[0][i] || "");
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      table.appendChild(thead);
      table.appendChild(tbody);
      container.innerHTML = "";
      container.appendChild(table);
    })
    .catch(err => console.error("Error loading CSV:", csvPath, err));
}

// ----------------------------------------------------
// SIDEBAR NAVIGATION (CONTENT SECTIONS)
// ----------------------------------------------------
function setupNav() {
  const buttons = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".content-section");

  buttons.forEach(btn => {
    const target = btn.getAttribute("data-target");
    if (!target) return;

    btn.addEventListener("click", () => {
      // Update active button
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show matching content section
      sections.forEach(sec => {
        sec.classList.toggle("active", sec.id === target);
      });

      // Close mobile menu if open
      const openNav = document.querySelector(".sidebar-nav.open");
      if (openNav) openNav.classList.remove("open");

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// ----------------------------------------------------
// SEASON SWITCHER (TOGGLES SIDEBAR MENUS)
// ----------------------------------------------------
function setupSeasonSwitcher() {
  const seasonButtons = document.querySelectorAll(".season-btn");
  const seasonMenus = document.querySelectorAll(".season-nav");

  seasonButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const season = btn.dataset.season;

      // Update active season button
      seasonButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Show correct sidebar menu
      seasonMenus.forEach(menu => {
        menu.classList.toggle("active", menu.classList.contains(`season-${season}`));
      });
    });
  });
}

// ----------------------------------------------------
// HAMBURGER MENU
// ----------------------------------------------------
function setupHamburger() {
  const hamburger = document.querySelector(".hamburger");
  const activeMenu = () => document.querySelector(".sidebar-nav.active");

  hamburger.addEventListener("click", () => {
    const menu = activeMenu();
    if (menu) menu.classList.toggle("open");
  });
}

// ----------------------------------------------------
// INITIALISE ON LOAD
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setupHamburger();
  setupSeasonSwitcher();
  setupNav();

  // Load CSV tables
  createTable("structure-table", "data/Game Structure.csv");
  createTable("hosts-table", "data/Hosts.csv");
  createTable("players-table", "data/Poker Players.csv");

  createTable("results-table-2025", "data/Player Results-2025.csv");
  createTable("leaderboard-table-2025", "data/Leaderboard-2025.csv");

  createTable("results-table-2026", "data/Player Results-2026.csv");
  createTable("leaderboard-table-2026", "data/Leaderboard-2026.csv");
});
