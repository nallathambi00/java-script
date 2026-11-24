function formatProductsForDisplay(products) {
  if (!Array.isArray(products)) return [];

  return products.map(product => {
    const totalValue = product.price * product.stock;
    const isLowStock = product.stock <= product.safetyStock;
    const shortage = isLowStock ? Math.max(0, product.safetyStock - product.stock) : 0;
    let statusText = "適正";

    if (product.stock === 0) {
      statusText = "在庫切れ";
    } else if (isLowStock) {
      statusText = "要補充";
    }

    return {
      ...product,
      totalValue,
      isLowStock,
      statusText,
      shortage
    };
  });
}

function filterLowStockProducts(products) {
  if (!Array.isArray(products)) return [];

  return products.filter(product => product.stock <= product.safetyStock);
}

function calculateTotalStock(products) {
  if (!Array.isArray(products)) return 0;

  return products.reduce((total, product) => total + product.stock, 0);
}

function calculateTotalValue(products) {
  if (!Array.isArray(products)) return 0;

  return products.reduce((total, product) => total + (product.price * product.stock), 0);
}

function searchProducts(products, keyword) {
  if (!Array.isArray(products)) return [];
  if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
    return products;
  }

  const normalizedKeyword = keyword.trim().toLowerCase();
  return products.filter(product => {
    const name = String(product.name ?? "").toLowerCase();
    const category = String(product.category ?? "").toLowerCase();
    return name.includes(normalizedKeyword) || category.includes(normalizedKeyword);
  });
}

function sortProducts(products, sortKey = "id", order = "asc") {
  if (!Array.isArray(products)) return [];

  const direction = order === "desc" ? -1 : 1;
  return [...products].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (typeof aValue === "string" || typeof bValue === "string") {
      return String(aValue ?? "").localeCompare(String(bValue ?? ""), "ja") * direction;
    }

    return ((aValue ?? 0) - (bValue ?? 0)) * direction;
  });
}

const state = {
  filterMode: "all",
  searchQuery: "",
  sortOption: "default"
};

function formatCurrency(num) {
  if (typeof num !== "number" || isNaN(num)) return "0";
  return num.toLocaleString("ja-JP");
}

function updateSummaryCards() {
  const totalItemsEl = document.getElementById("metric-total-items");
  const totalStockEl = document.getElementById("metric-total-stock");
  const totalValueEl = document.getElementById("metric-total-value");
  const lowStockEl = document.getElementById("metric-low-stock");
  const counterAllEl = document.getElementById("counter-all");
  const counterLowEl = document.getElementById("counter-low");

  const totalItems = PRODUCTS.length;
  const totalStock = calculateTotalStock(PRODUCTS);
  const totalValue = calculateTotalValue(PRODUCTS);
  const lowStockItems = filterLowStockProducts(PRODUCTS);
  const lowStockCount = lowStockItems.length;

  if (totalItemsEl) totalItemsEl.textContent = totalItems;
  if (totalStockEl) totalStockEl.textContent = totalStock.toLocaleString("ja-JP");
  if (totalValueEl) totalValueEl.textContent = formatCurrency(totalValue);
  if (lowStockEl) lowStockEl.textContent = lowStockCount;

  if (counterAllEl) counterAllEl.textContent = totalItems;
  if (counterLowEl) counterLowEl.textContent = lowStockCount;
}

function renderTable(displayProducts) {
  const tbody = document.getElementById("stock-table-body");
  const currentViewCountEl = document.getElementById("current-view-count");
  const totalViewCountEl = document.getElementById("total-view-count");

  if (!tbody) return;

  if (currentViewCountEl) currentViewCountEl.textContent = displayProducts.length;
  if (totalViewCountEl) totalViewCountEl.textContent = PRODUCTS.length;

  if (displayProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; padding: 48px 16px; color: #94a3b8;">
          該当する商品が見つかりませんでした。
        </td>
      </tr>
    `;
    return;
  }

  const rowsHTML = displayProducts.map(p => {
    let badgeClass = "badge-normal";
    if (p.stock === 0) {
      badgeClass = "badge-out";
    } else if (p.isLowStock) {
      badgeClass = "badge-low";
    }

    const barWidthPercent = Math.min(100, Math.round((p.stock / 30) * 100));
    let barColor = "#047857";
    if (p.stock === 0) barColor = "#b91c1c";
    else if (p.isLowStock) barColor = "#b45309";

    return `
      <tr>
        <td class="col-id">#${p.id}</td>
        <td class="col-product-name">${p.name}</td>
        <td><span class="category-tag">${p.category}</span></td>
        <td class="col-number">¥${formatCurrency(p.price)}</td>
        <td class="col-number">
          <div class="stock-meter-container">
            <div class="stock-bar-bg" title="現在庫: ${p.stock} / 基準: ${p.safetyStock}">
              <div class="stock-bar-fill" style="width: ${barWidthPercent}%; background-color: ${barColor};"></div>
            </div>
            <strong>${p.stock}</strong> / <span style="color: #94a3b8;">${p.safetyStock}</span>
          </div>
        </td>
        <td class="col-number" style="font-weight: 600;">¥${formatCurrency(p.totalValue)}</td>
        <td style="text-align: center;">
          <span class="status-badge ${badgeClass}">
            ${p.statusText}
          </span>
        </td>
      </tr>
    `;
  }).join("");

  tbody.innerHTML = rowsHTML;
}

function renderApp() {
  let result = [...PRODUCTS];
  if (state.filterMode === "low") {
    result = filterLowStockProducts(result);
  }
  if (state.searchQuery) {
    result = searchProducts(result, state.searchQuery);
  }
  if (state.sortOption !== "default") {
    const [key, order] = state.sortOption.split("-");
    result = sortProducts(result, key, order);
  }

  const displayProducts = formatProductsForDisplay(result);
  updateSummaryCards();
  renderTable(displayProducts);
}

function setupEventListeners() {
  const btnAll = document.getElementById("btn-filter-all");
  const btnLow = document.getElementById("btn-filter-low");
  const searchInput = document.getElementById("search-input");
  const sortSelect = document.getElementById("sort-select");

  if (btnAll) {
    btnAll.addEventListener("click", () => {
      state.filterMode = "all";
      btnAll.classList.add("active");
      if (btnLow) btnLow.classList.remove("active");
      renderApp();
    });
  }

  if (btnLow) {
    btnLow.addEventListener("click", () => {
      state.filterMode = "low";
      btnLow.classList.add("active");
      if (btnAll) btnAll.classList.remove("active");
      renderApp();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderApp();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortOption = e.target.value;
      renderApp();
    });
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    renderApp();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatProductsForDisplay,
    filterLowStockProducts,
    calculateTotalStock,
    calculateTotalValue,
    searchProducts,
    sortProducts
  };
}
