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
// MOBILE SIDEBAR HELPERS
// =====================================================
function closeSidebarOnMobile() {
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

// =====================================================
// SIDEBAR TOGGLE (MOBILE)
// =====================================================
if (hamburger) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('open');
  });
}

document.addEventListener('click', (e) => {
  const insideSidebar = sidebar.contains(e.target);
  if (!insideSidebar) {
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

    closeSidebarOnMobile();
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

    closeSidebarOnMobile();
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

    closeSidebarOnMobile();
  });
});

// =====================================================
// INITIALISATION
// =====================================================
showSectionById('global-intro');
globalNav.classList.add('active');
globalNavLinks[0].classList.add('active');

seasonNavs.forEach(nav => nav.classList.remove('active'));
