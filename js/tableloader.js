// =====================================================
// BASIC HELPERS
// =====================================================
function $(selector, scope = document) {
  return scope.querySelector(selector);
}

function $all(selector, scope = document) {
  return Array.from(scope.querySelectorAll(selector));
}

// =====================================================
// CSV PARSER + LOADER
// =====================================================
function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  return lines.map(line =>
    line.split(",").map(cell => cell.trim().replace(/^"|"$/g, ""))
  );
}

async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();
  return parseCSV(text);
}

// =====================================================
// TABLE BUILDERS
// =====================================================
function buildTable(containerId, rows) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = "<table><tbody>";

  rows.forEach(row => {
    html += "<tr>" + row.map(cell => `<td>${cell}</td>`).join("") + "</tr>";
  });

  html += "</tbody></table>";
  container.innerHTML = html;
}

async function buildPlayersTable() {
  const rows = await loadCSV("data/players.csv");
  buildTable("players-table", rows);
}

async function buildHostsTable() {
  const rows = await loadCSV("data/hosts.csv");
  buildTable("hosts-table", rows);
}

async function buildStructureTable() {
  const rows = await loadCSV("data/structure.csv");
  buildTable("structure-table", rows);
}

async function buildResults2025() {
  const rows = await loadCSV("data/results-2025.csv");
  buildTable("results-table-2025", rows);
}

async function buildResults2026() {
  const rows = await loadCSV("data/results-2026.csv");
  buildTable("results-table-2026", rows);
}

async function buildLeaderboard2025() {
  const rows = await loadCSV("data/leaderboard2025.csv");
  buildTable("leaderboard-table-2025", rows);
}

async function buildLeaderboard2026() {
  const rows = await loadCSV("data/leaderboard2026.csv");
  buildTable("leaderboard-table-2026", rows);
}

// =====================================================
// ELEMENT REFERENCES
// =====================================================
const sidebar = $('.sidebar');
const hamburger = $('.hamburger');

const globalNav = $('.global-nav');
const globalNavLinks = $all('.global-nav .nav-link');

const seasonButtons = $all('.season-btn');
const seasonNavs = $all('.season-nav');
const seasonNavLinks = $all('.season-nav .nav-link');

const allSections = $all('.content-section');

// =====================================================
// SIDEBAR TOGGLE (MOBILE)
// =====================================================
if (hamburger) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  const insideSidebar = sidebar.contains(e.target);
  const onHamburger = hamburger && hamburger.contains(e.target);

  if (!insideSidebar && !onHamburger) {
    sidebar.classList.remove('open');
  }
});

// =====================================================
// SECTION SHOW/HIDE
// =====================================================
function showSectionById(id) {
  allSections.forEach(sec => {
    sec.classList.toggle('active', sec.id === id);
  });
}

// =====================================================
// GLOBAL NAVIGATION
// =====================================================
globalNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    globalNavLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    seasonNavLinks.forEach(l => l.classList.remove('active'));

    const targetId = link.dataset.target;
    showSectionById(targetId);

    globalNav.classList.add('active');
    seasonNavs.forEach(nav => nav.classList.remove('active'));

    sidebar.classList.add('open');
  });
});

// =====================================================
// SEASON SWITCHER (2025 / 2026)
// =====================================================
seasonButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const season = btn.dataset.season;

    seasonButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    seasonNavs.forEach(nav => {
      nav.classList.toggle('active', nav.classList.contains(`season-${season}`));
    });

    globalNav.classList.remove('active');
    globalNavLinks.forEach(l => l.classList.remove('active'));

    const defaultSectionId = season === '2025' ? 's2025-blog' : 's2026-blog';
    showSectionById(defaultSectionId);

    seasonNavLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.target === defaultSectionId);
    });

    sidebar.classList.add('open');
  });
});

// =====================================================
// SEASON NAV LINKS
// =====================================================
seasonNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    const parentNav = link.closest('.season-nav');
    const siblings = $all('.nav-link', parentNav);

    siblings.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    const targetId = link.dataset.target;
    showSectionById(targetId);

    sidebar.classList.add('open');
  });
});

// =====================================================
// INITIALISATION
// =====================================================
showSectionById('global-intro');
globalNav.classList.add('active');
globalNavLinks[0].classList.add('active');

seasonNavs.forEach(nav => nav.classList.remove('active'));

buildPlayersTable();
buildHostsTable();
buildStructureTable();
buildResults2025();
buildResults2026();
buildLeaderboard2025();
buildLeaderboard2026();
