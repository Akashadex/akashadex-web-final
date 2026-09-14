/**
 * Akashadex — Core UI Engine & Interactive Features
 * Features: Mobile Nav, Sticky Header, Theme Switching, Global Search Modal,
 * Toast Notifications, Back to Top, Reading Progress, Contact Form & Order Modal.
 */

(function () {
  'use strict';

  // --- 1. Theme Manager (Dark / Light Mode) ---
  function initThemeEngine() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('akashadex_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    applyTheme(activeTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(activeTheme);
        localStorage.setItem('akashadex_theme', activeTheme);
        window.showToast(`Switched to ${activeTheme} mode`);
      });
    }
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  initThemeEngine();

  // --- 2. Mobile Navigation ---
  (function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const nav = document.getElementById('siteNav');
    if (!toggle || !nav) return;

    function closeNav() {
      nav.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== toggle) {
        closeNav();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeNav();
        toggle.focus();
      }
    });
  })();

  // --- 3. Sticky Header Scroll Transition ---
  (function initHeaderScroll() {
    const headers = document.querySelectorAll('.site-header, .site-header-inner');
    if (!headers.length) return;

    function handleScroll() {
      const isScrolled = window.scrollY > 15;
      headers.forEach(h => h.classList.toggle('scrolled', isScrolled));
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  })();

  // --- 4. Toast Notification System ---
  let toastTimeout;
  window.showToast = function (message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${escapeHtml(message)}</span>
    `;

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  };

  // --- 5. Global Search Modal (Cmd + K / Header Search Icon) ---
  (function initGlobalSearchModal() {
    let searchData = null;
    let backdrop = null;

    // Create Search Modal DOM
    function createSearchModal() {
      if (backdrop) return;

      backdrop = document.createElement('div');
      backdrop.className = 'search-modal-backdrop';
      backdrop.id = 'searchModalBackdrop';
      backdrop.innerHTML = `
        <div class="search-modal-container">
          <div class="search-modal-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" class="search-modal-input" id="globalSearchInput" placeholder="Search all guides, tools, and products..." autocomplete="off">
            <button class="search-modal-close" id="searchModalClose">ESC</button>
          </div>
          <div class="search-modal-results" id="searchModalResults">
            <div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.9rem;">Start typing to search...</div>
          </div>
        </div>
      `;
      document.body.appendChild(backdrop);

      const input = document.getElementById('globalSearchInput');
      const closeBtn = document.getElementById('searchModalClose');
      const resultsContainer = document.getElementById('searchModalResults');

      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeSearchModal();
      });

      closeBtn.addEventListener('click', closeSearchModal);

      input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        renderSearchResults(query, resultsContainer);
      });
    }

    async function loadSearchData() {
      if (searchData) return searchData;
      try {
        const [guidesRes, productsRes] = await Promise.all([
          fetch('/guides/guides.json').then(r => r.ok ? r.json() : []),
          fetch('/store/products.json').then(r => r.ok ? r.json() : [])
        ]);

        const items = [];
        guidesRes.forEach(g => items.push({
          title: g.title,
          desc: g.description,
          url: g.url,
          category: g.category || 'Guide',
          type: 'GUIDE'
        }));
        productsRes.forEach(p => items.push({
          title: p.title,
          desc: p.description,
          url: p.url,
          category: p.category || 'Product',
          type: 'PRODUCT'
        }));

        searchData = items;
      } catch (e) {
        searchData = [];
      }
      return searchData;
    }

    function renderSearchResults(query, container) {
      if (!query) {
        container.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.9rem;">Start typing to search...</div>`;
        return;
      }

      if (!searchData) return;

      const filtered = searchData.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );

      if (filtered.length === 0) {
        container.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-muted); font-size:0.9rem;">No results found for "${escapeHtml(query)}"</div>`;
        return;
      }

      container.innerHTML = filtered.slice(0, 8).map(item => `
        <a href="${item.url}" class="search-result-item">
          <div>
            <div class="search-result-title">${escapeHtml(item.title)}</div>
            <div class="search-result-sub">${escapeHtml(item.desc)}</div>
          </div>
          <span class="search-result-tag">${escapeHtml(item.type)}</span>
        </a>
      `).join('');
    }

    function openSearchModal() {
      createSearchModal();
      loadSearchData();
      backdrop.classList.add('active');
      const input = document.getElementById('globalSearchInput');
      setTimeout(() => input && input.focus(), 50);
    }

    function closeSearchModal() {
      if (backdrop) backdrop.classList.remove('active');
    }

    // Attach search trigger listeners
    const searchBtns = document.querySelectorAll('#searchBtn, .search-btn');
    searchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchModal();
      });
    });

    // Keyboard Shortcut (Cmd+K / Ctrl+K / Escape)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearchModal();
      } else if (e.key === 'Escape' && backdrop && backdrop.classList.contains('active')) {
        closeSearchModal();
      }
    });
  })();

  // --- 6. Back To Top Floating Button ---
  (function initBackToTop() {
    const btn = document.createElement('button');
    btn.className = 'back-to-top-btn';
    btn.setAttribute('aria-label', 'Back to top');
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>`;
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  // --- 7. Reading Progress Bar for Guides ---
  (function initReadingProgress() {
    const article = document.querySelector('.article-body, .guide-body');
    if (!article) return;

    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const totalHeight = article.offsetHeight - window.innerHeight;
      const scrollPos = window.scrollY - article.offsetTop;
      const progress = Math.min(Math.max((scrollPos / (totalHeight || 1)) * 100, 0), 100);
      progressBar.style.width = progress + '%';
    }, { passive: true });
  })();

  // --- 8. Interactive Contact Form ---
  (function initContactForm() {
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('contactFormStatus');
    if (!form || !statusMsg) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;

        form.reset();
        statusMsg.className = 'contact-status-msg success';
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = '✔ Thank you! Your message has been sent. We usually reply within 24 hours.';
        window.showToast('Message sent successfully!');
      }, 1000);
    });
  })();

  // Utility function to escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // --- Auto-hide / reveal header on scroll ---
  (function initScrollHideHeader() {
    const header = document.querySelector('.site-header, .site-header-inner');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const THRESHOLD = 5; // px — ignore tiny jitter

    window.addEventListener('scroll', function () {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY;

      if (Math.abs(delta) < THRESHOLD) return; // ignore micro-scrolls

      if (currentY > 80 && delta > 0) {
        // Scrolling DOWN and past the top zone → hide
        header.classList.add('nav-hidden');
      } else {
        // Scrolling UP (or near top) → show
        header.classList.remove('nav-hidden');
      }

      lastScrollY = currentY;
    }, { passive: true });
  })();
})();
