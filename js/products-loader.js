/**
 * Akashadex — Dynamic Products Store Loader & Interactive Engine
 * Handles real-time search, category pills with '+' expander button, and product grid rendering.
 */

(function () {
  'use strict';

  // DOM Elements
  const searchInput = document.getElementById('productSearchInput');
  const categoryFiltersContainer = document.getElementById('productCategoryFilters');
  const sortSelect = document.getElementById('productSortSelect');
  const productsCountBadge = document.getElementById('productsCountBadge');
  const productsGrid = document.getElementById('productsGrid');

  if (!productsGrid) return;

  // Data State
  let allProducts = [];
  let currentCategory = 'All';
  let searchQuery = '';
  let currentSort = 'newest';
  let isCategoriesExpanded = false;
  const MAX_VISIBLE_PILLS = 3; // Display main categories + '+' expander button

  const defaultImages = [
    '/images/card-medicare.png',
    '/images/card-spousal.png',
    '/images/card-taxes.png',
    '/images/guide-thumb-1.jpg',
    '/images/card-social-security.png',
    '/images/guide-thumb-3.jpg'
  ];

  async function initProductsEngine() {
    try {
      const res = await fetch('/store/products.json?v=' + Date.now());
      if (res.ok) {
        allProducts = await res.json();
      } else {
        allProducts = getFallbackProducts();
      }
    } catch (e) {
      console.warn('Products loader fallback activated:', e);
      allProducts = getFallbackProducts();
    }

    renderCategoryPills();
    setupEventListeners();
    updateAndRender();
  }

  function getFallbackProducts() {
    return [
      {
        id: "prod-1",
        title: "Medicare Explained",
        description: "A clear breakdown of Medicare parts, costs, and when they actually apply.",
        category: "Guides",
        price: "$12.00",
        meta: "38 pages · PDF",
        image: "/images/card-medicare.png",
        url: "/store/medicare-explained.html",
        badge: "GUIDE",
        date: "2026-09-01"
      },
      {
        id: "prod-2",
        title: "Retirement Planner Workbook",
        description: "Set your goals, run the numbers, and build a plan that fits your life.",
        category: "Workbooks",
        price: "$15.00",
        meta: "42 pages · PDF",
        image: "/images/card-spousal.png",
        badge: "WORKBOOK",
        url: "/store/retirement-planner-workbook.html",
        date: "2026-08-20"
      },
      {
        id: "prod-3",
        title: "Social Security Benefit Calculator",
        description: "Estimate your future benefits with personalized inputs and clear results.",
        category: "Tools",
        price: "$9.00",
        meta: "Web Tool · Instant Access",
        image: "/images/card-taxes.png",
        badge: "TOOL",
        url: "/store/social-security-calculator.html",
        date: "2026-08-15"
      },
      {
        id: "prod-4",
        title: "Japan Travel Guide",
        description: "Everything you need to plan, budget, and make the most of your trip.",
        category: "Guides",
        price: "$11.00",
        meta: "36 pages · PDF",
        image: "/images/guide-thumb-1.jpg",
        badge: "GUIDE",
        url: "/store/japan-travel-guide.html",
        date: "2026-07-10"
      },
      {
        id: "prod-5",
        title: "2027 Tax Optimization Checklist",
        description: "Actionable steps to streamline your tax deductions and retirement contributions.",
        category: "Checklists",
        price: "$8.00",
        meta: "12 pages · PDF",
        image: "/images/card-social-security.png",
        badge: "CHECKLIST",
        url: "/store/tax-checklist.html",
        date: "2026-06-05"
      },
      {
        id: "prod-6",
        title: "Emergency Fund Calculator",
        description: "Calculate exact liquid savings targets based on expense categories and inflation.",
        category: "Calculators",
        price: "$10.00",
        meta: "Excel & Google Sheets",
        image: "/images/guide-thumb-3.jpg",
        badge: "TOOL",
        url: "/store/emergency-fund-calculator.html",
        date: "2026-05-12"
      }
    ];
  }

  /**
   * Render Category Filters with '+' expander button
   */
  function renderCategoryPills() {
    if (!categoryFiltersContainer) return;

    const uniqueCategories = new Set();
    allProducts.forEach(p => {
      if (p.category) uniqueCategories.add(p.category);
    });

    const allCategories = ['All', ...Array.from(uniqueCategories)];
    const extraCategories = allCategories.slice(MAX_VISIBLE_PILLS + 1);

    let html = '';

    allCategories.forEach((cat, index) => {
      const isHidden = index > MAX_VISIBLE_PILLS && !isCategoriesExpanded ? 'style="display:none;"' : '';
      const isActive = cat === currentCategory ? 'active' : '';
      const extraClass = index > MAX_VISIBLE_PILLS ? 'extra-cat-pill' : '';
      html += `<button class="cat-pill ${isActive} ${extraClass}" data-category="${escapeHtml(cat)}" ${isHidden}>${escapeHtml(cat)}</button>`;
    });

    if (extraCategories.length > 0) {
      const btnText = isCategoriesExpanded ? '− Less' : `+ ${extraCategories.length} More`;
      const btnClass = isCategoriesExpanded ? 'expanded' : '';
      html += `<button class="cat-pill expand-genres-btn ${btnClass}" id="expandProductGenresBtn" title="Toggle all product categories">${escapeHtml(btnText)}</button>`;
    }

    categoryFiltersContainer.innerHTML = html;

    categoryFiltersContainer.querySelectorAll('.cat-pill[data-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.category;
        categoryFiltersContainer.querySelectorAll('.cat-pill[data-category]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        updateAndRender();
      });
    });

    const expandBtn = document.getElementById('expandProductGenresBtn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        isCategoriesExpanded = !isCategoriesExpanded;
        renderCategoryPills();
      });
    }
  }

  function setupEventListeners() {
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

  function updateAndRender() {
    let filtered = allProducts;

    if (currentCategory !== 'All') {
      filtered = filtered.filter(p => (p.category || '').toLowerCase() === currentCategory.toLowerCase());
    }

    if (searchQuery) {
      filtered = filtered.filter(p => {
        return (p.title || '').toLowerCase().includes(searchQuery) ||
               (p.description || '').toLowerCase().includes(searchQuery) ||
               (p.category || '').toLowerCase().includes(searchQuery) ||
               (p.badge || '').toLowerCase().includes(searchQuery);
      });
    }

    filtered.sort((a, b) => {
      if (currentSort === 'price-low') {
        return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
      }
      if (currentSort === 'price-high') {
        return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
      }
      if (currentSort === 'title') {
        return (a.title || '').localeCompare(b.title || '');
      }
      return 0;
    });

    if (productsCountBadge) {
      const totalCategories = new Set(allProducts.map(p => p.category)).size;
      productsCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'product' : 'products'} · ${totalCategories} categories`;
    }

    renderProductsGrid(filtered);
  }

  function renderProductsGrid(products) {
    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="empty-products-box">
          <h3>No products found</h3>
          <p>Try searching for a different keyword or select another category.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = products.map((p, idx) => `
      <div class="product-card-item">
        <div class="product-card-media">
          <img src="${escapeHtml(p.image || defaultImages[idx % defaultImages.length])}" alt="${escapeHtml(p.title)}" loading="lazy">
          <span class="product-badge-tag">${escapeHtml(p.badge || 'GUIDE')}</span>
        </div>
        <div class="product-card-content">
          <h3 class="product-card-title">${escapeHtml(p.title)}</h3>
          <p class="product-card-desc">${escapeHtml(p.description)}</p>
          <div class="product-card-meta">
            <span>📄 ${escapeHtml(p.meta)}</span>
          </div>
          <div class="product-card-footer">
            <span class="product-price">${escapeHtml(p.price)}</span>
            <a href="${escapeHtml(p.url || '#')}" class="product-view-btn">View Product &rarr;</a>
          </div>
        </div>
      </div>
    `).join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductsEngine);
  } else {
    initProductsEngine();
  }
})();
