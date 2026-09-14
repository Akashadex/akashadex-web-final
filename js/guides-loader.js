/**
 * Akashadex — Dynamic Guides Auto-Discovery & Interactive Engine
 * Renders full-background image cards with collapsible category pills (+ More genres).
 */

(function () {
  'use strict';

  // DOM Elements
  const searchInput = document.getElementById('guideSearchInput');
  const categoryPillsContainer = document.getElementById('categoryFilters');
  const sortSelect = document.getElementById('guideSortSelect');
  const guidesCountBadge = document.getElementById('guidesCountBadge');
  const guidesGrid = document.getElementById('guidesGrid');

  if (!guidesGrid) return;

  // Data State
  let allGuides = [];
  let currentCategory = 'All';
  let searchQuery = '';
  let currentSort = 'newest';
  let isCategoriesExpanded = false;
  const MAX_VISIBLE_PILLS = 5; // Display main genres + '+' expander button

  const defaultImages = [
    '/images/card-social-security.png',
    '/images/card-medicare.png',
    '/images/card-spousal.png',
    '/images/card-taxes.png',
    '/images/guide-thumb-4.jpg',
    '/images/guide-thumb-1.jpg'
  ];

  /**
   * Main Initialization Procedure
   */
  async function initGuidesEngine() {
    try {
      const manifestGuides = await fetchGuidesJson();
      const sitemapUrls = await discoverFromSitemap();

      const map = new Map();
      manifestGuides.forEach(g => map.set(g.url, g));

      for (let i = 0; i < sitemapUrls.length; i++) {
        const url = sitemapUrls[i];
        if (!map.has(url)) {
          const parsed = await parseGuideHtml(url, i);
          if (parsed) map.set(url, parsed);
        }
      }

      allGuides = Array.from(map.values());

      if (allGuides.length === 0) {
        allGuides = getFallbackGuides();
      }
    } catch (e) {
      console.warn('Guides loader fallback activated:', e);
      allGuides = getFallbackGuides();
    }

    renderCategoryPills();
    setupEventListeners();
    updateAndRender();
  }

  /**
   * Fetch guides.json manifest
   */
  async function fetchGuidesJson() {
    try {
      const res = await fetch('/guides/guides.json?v=' + Date.now());
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Error fetching guides.json', e);
    }
    return [];
  }

  /**
   * Discover guides from sitemap.xml
   */
  async function discoverFromSitemap() {
    const urls = [];
    try {
      const res = await fetch('/sitemap.xml');
      if (res.ok) {
        const text = await res.text();
        const xml = new DOMParser().parseFromString(text, 'text/xml');
        xml.querySelectorAll('loc').forEach(loc => {
          const val = loc.textContent.trim();
          if (val.includes('/guides/') && val.endsWith('.html') && !val.endsWith('/guides/index.html') && !val.endsWith('/guides/')) {
            try {
              urls.push(new URL(val).pathname);
            } catch {
              urls.push(val);
            }
          }
        });
      }
    } catch (e) {
      console.warn('Sitemap discovery error', e);
    }
    return urls;
  }

  /**
   * Parse HTML metadata for newly discovered guides
   */
  async function parseGuideHtml(url, index) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');

      const title = doc.querySelector('meta[property="og:title"]')?.content ||
                    doc.querySelector('h1')?.textContent.trim() ||
                    'Research Guide';

      const description = doc.querySelector('meta[name="description"]')?.content ||
                          doc.querySelector('p')?.textContent.trim() ||
                          'In-depth evidence-based guide.';

      const category = doc.querySelector('.kicker')?.textContent.trim() || 'Research';
      const image = doc.querySelector('meta[property="og:image"]')?.content || defaultImages[index % defaultImages.length];

      return {
        url: url,
        title: title,
        description: description,
        category: category,
        image: image,
        date: 'SEP 2026',
        readTime: '6 MIN READ'
      };
    } catch (e) {
      return null;
    }
  }

  function getFallbackGuides() {
    return [
      {
        url: '/guides/2027-social-security-cola.html',
        title: 'Social Security COLA 2027',
        description: "How much could your check actually increase? What's confirmed, what's still a projection, and how to calculate your number.",
        category: 'Retirement & Benefits',
        image: '/images/card-social-security.png',
        date: 'SEP 2026',
        readTime: '6 MIN READ'
      },
      {
        url: '/guides/2027-medicare-part-b-premiums.html',
        title: 'Medicare Part B Explained',
        description: 'Why your premium is higher, what it actually covers, and how it impacts your out-of-pocket costs.',
        category: 'Healthcare',
        image: '/images/card-medicare.png',
        date: 'SEP 2026',
        readTime: '5 MIN READ'
      },
      {
        url: '/guides/building-an-emergency-fund.html',
        title: 'Building an Emergency Fund',
        description: 'How much you really need, where to keep it, and simple steps to get started (even on a tight budget).',
        category: 'Personal Finance',
        image: '/images/card-spousal.png',
        date: 'AUG 2026',
        readTime: '5 MIN READ'
      },
      {
        url: '/guides/2027-tax-brackets-inflation-adjustments.html',
        title: 'Understanding Taxes 2027',
        description: 'Key changes, what to expect, and simple ways to keep more of your money.',
        category: 'Tax & Finance',
        image: '/images/card-taxes.png',
        date: 'AUG 2026',
        readTime: '7 MIN READ'
      },
      {
        url: '/guides/beginners-guide-to-python.html',
        title: "Beginner's Guide to Python",
        description: 'From setup to your first program — a practical, step-by-step introduction to Python for real-world use.',
        category: 'Technology',
        image: '/images/guide-thumb-4.jpg',
        date: 'AUG 2026',
        readTime: '6 MIN READ'
      },
      {
        url: '/guides/healthy-habits-better-living.html',
        title: 'Healthy Habits, Better Living',
        description: 'Small changes that actually stick — for more energy, better focus, and long-term health.',
        category: 'Lifestyle',
        image: '/images/guide-thumb-1.jpg',
        date: 'JUL 2026',
        readTime: '6 MIN READ'
      }
    ];
  }

  /**
   * Render Category Filters with '+' button to reveal extra genres
   */
  function renderCategoryPills() {
    if (!categoryPillsContainer) return;

    const uniqueCategories = new Set();
    allGuides.forEach(g => {
      if (g.category) uniqueCategories.add(g.category);
    });

    const allCategories = ['All', ...Array.from(uniqueCategories)];
    
    // Split into initial visible categories and hidden extra categories
    const initialCategories = allCategories.slice(0, MAX_VISIBLE_PILLS + 1); // 'All' + MAX_VISIBLE_PILLS
    const extraCategories = allCategories.slice(MAX_VISIBLE_PILLS + 1);

    let html = '';

    allCategories.forEach((cat, index) => {
      const isHidden = index > MAX_VISIBLE_PILLS && !isCategoriesExpanded ? 'style="display:none;"' : '';
      const isActive = cat === currentCategory ? 'active' : '';
      const extraClass = index > MAX_VISIBLE_PILLS ? 'extra-cat-pill' : '';
      html += `<button class="cat-pill ${isActive} ${extraClass}" data-category="${escapeHtml(cat)}" ${isHidden}>${escapeHtml(cat)}</button>`;
    });

    // Append '+' Expander Button if there are extra genres
    if (extraCategories.length > 0) {
      const btnText = isCategoriesExpanded ? '− Less' : `+ ${extraCategories.length} More`;
      const btnClass = isCategoriesExpanded ? 'expanded' : '';
      html += `<button class="cat-pill expand-genres-btn ${btnClass}" id="expandGenresBtn" title="Toggle all genres">${escapeHtml(btnText)}</button>`;
    }

    categoryPillsContainer.innerHTML = html;

    // Attach pill click handlers
    categoryPillsContainer.querySelectorAll('.cat-pill[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        categoryPillsContainer.querySelectorAll('.cat-pill[data-category]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateAndRender();
      });
    });

    // Attach expander button click handler
    const expandBtn = document.getElementById('expandGenresBtn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        isCategoriesExpanded = !isCategoriesExpanded;
        renderCategoryPills();
      });
    }
  }

  /**
   * Setup Search and Sort Listeners
   */
  function setupEventListeners() {
    // Read URL 'q' query parameter if coming from search form
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');
    if (initialQuery) {
      searchQuery = initialQuery.toLowerCase().trim();
      if (searchInput) searchInput.value = initialQuery;
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        updateAndRender();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        updateAndRender();
      });
    }
  }

  /**
   * Update state and re-render grid
   */
  function updateAndRender() {
    let filtered = allGuides;

    if (currentCategory !== 'All') {
      filtered = filtered.filter(g => (g.category || '').toLowerCase() === currentCategory.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(g => {
        return (g.title || '').toLowerCase().includes(searchQuery) ||
               (g.description || '').toLowerCase().includes(searchQuery) ||
               (g.category || '').toLowerCase().includes(searchQuery);
      });
    }

    filtered.sort((a, b) => {
      if (currentSort === 'newest') return 0;
      if (currentSort === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    if (guidesCountBadge) {
      const totalCategories = new Set(allGuides.map(g => g.category)).size;
      guidesCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'guide' : 'guides'} · ${totalCategories} categories`;
    }

    renderGridCards(filtered);
  }

  /**
   * Render Full Overlay Image Cards
   */
  function renderGridCards(guides) {
    if (guides.length === 0) {
      guidesGrid.innerHTML = `
        <div class="empty-guides-box">
          <h3>No research guides found</h3>
          <p>Try searching for a different keyword or select another category.</p>
        </div>
      `;
      return;
    }

    guidesGrid.innerHTML = guides.map((g, idx) => `
      <a href="${escapeHtml(g.url)}" class="guide-overlay-card">
        <div class="card-bg-wrap">
          <img src="${escapeHtml(g.image || defaultImages[idx % defaultImages.length])}" alt="${escapeHtml(g.title)}" loading="lazy">
          <div class="card-gradient-overlay"></div>
        </div>
        <div class="card-inner-content">
          <div class="card-top-row">
            <span class="card-category-pill">${escapeHtml(g.category || 'RESEARCH')}</span>
          </div>
          <div class="card-middle-content">
            <h3 class="card-title-text">${escapeHtml(g.title)}</h3>
            <p class="card-desc-text">${escapeHtml(g.description)}</p>
          </div>
          <div class="card-bottom-row">
            <div class="card-meta-info">
              <span>${escapeHtml(g.date || 'SEP 2026')}</span>
              <span class="meta-sep">·</span>
              <span>${escapeHtml(g.readTime || '6 MIN READ')}</span>
            </div>
            <div class="card-arrow-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </a>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    // Unescape double encoded entities first
    const decoded = String(str).replace(/&amp;/g, '&');
    return decoded
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuidesEngine);
  } else {
    initGuidesEngine();
  }
})();
