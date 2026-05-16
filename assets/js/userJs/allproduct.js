const BASE = window.BASE || "https://api.workarya.com";

let qvName, qvDesc, qvPrice, qvImages, qvIndex, qvMainImg, qvThumbs, qvColors, qvSizes, quickModal;
let currentFilters = null;


window.applyFilters = function (filters) {
    currentFilters = filters;
    loadProducts(1, 50);
};

/** Single product: GET /api/products/detail/{id} (same response shape as live API). */
function productsDetailUrl(productId) {
  return `${BASE}/api/products/detail/${encodeURIComponent(productId)}`;
}

/**
 * GET /api/products/list — query params aligned with backend:
 * Search / q, repeated categoryIds, repeated brandIds (also single brandId/categoryId from URL).
 */
function getScopeContext() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    urlParams,
    searchVal: urlParams.get("Search") || urlParams.get("search") || "",
    qVal: urlParams.get("q") || "",
    categoryIdQuery: urlParams.get("categoryId") || "",
    brandIdQuery: urlParams.get("brandId") || "",
  };
}

function buildProductsListUrl(page, limit) {
  // includeTotal=true lets the backend return the overall match count so we can
  // render an accurate pager. The count query is gated on the server so it only
  // runs when explicitly requested — on very large catalogs we can drop this
  // flag and rely purely on `hasMore` / `nextCursor` (cursor pagination).
  let url = `${BASE}/api/products/list?page=${page}&pageSize=${limit}&includeTotal=true`;
  const { searchVal, qVal, categoryIdQuery, brandIdQuery } = getScopeContext();

  if (searchVal) {
    url += `&Search=${encodeURIComponent(searchVal)}`;
  } else if (qVal) {
    url += `&q=${encodeURIComponent(qVal)}`;
  }

  // Dedupe lists so duplicate IDs don't hit the API.
  const categoryIds = new Set();
  const brandIds = new Set();
  const colorIds = new Set();
  const colorNames = new Set();
  const sizeIds = new Set();
  const sizeNames = new Set();

  // URL scope (category-first): these are the starting set.
  if (categoryIdQuery) categoryIds.add(categoryIdQuery);
  if (brandIdQuery) brandIds.add(brandIdQuery);

  // Sidebar filter picks broaden / narrow the scope:
  // - Within the same dimension → OR (union of values)
  // - Across dimensions → AND (applied together by the API)
  if (currentFilters) {
    if (currentFilters.categories?.length > 0) {
      currentFilters.categories.forEach((c) => {
        if (c && c.id) categoryIds.add(String(c.id));
      });
    }
    if (currentFilters.brands?.length > 0) {
      currentFilters.brands.forEach((b) => {
        if (b && b.id) brandIds.add(String(b.id));
      });
    }
    if (currentFilters.colors?.length > 0) {
      currentFilters.colors.forEach((col) => {
        if (col && col.id) colorIds.add(String(col.id));
        if (col && col.name) colorNames.add(String(col.name));
      });
    }
    if (currentFilters.sizes?.length > 0) {
      currentFilters.sizes.forEach((s) => {
        if (s && s.id) sizeIds.add(String(s.id));
        if (s && s.name) sizeNames.add(String(s.name));
      });
    }
  }

  categoryIds.forEach((id) => { url += `&categoryIds=${encodeURIComponent(id)}`; });
  brandIds.forEach((id) => { url += `&brandIds=${encodeURIComponent(id)}`; });
  colorIds.forEach((id) => { url += `&colorIds=${encodeURIComponent(id)}`; });
  colorNames.forEach((n) => { url += `&colors=${encodeURIComponent(n)}`; });
  sizeIds.forEach((id) => { url += `&sizeIds=${encodeURIComponent(id)}`; });
  sizeNames.forEach((n) => { url += `&sizes=${encodeURIComponent(n)}`; });

  if (currentFilters?.price) {
    const { min, max } = currentFilters.price;
    url += `&minPrice=${encodeURIComponent(min)}&maxPrice=${encodeURIComponent(max)}`;
  }

  return url;
}

async function fetchProductDetail(productId) {
  const res = await fetch(productsDetailUrl(productId));
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const json = await res.json();
  if (!json.success || json.data == null) {
    return null;
  }
  return json.data.data || json.data;
}

/* ----------------------------------------------------------------------
 * Product detail: early kickoff + session cache.
 * We start the network request the moment this script parses (before
 * DOMContentLoaded) so the preloader disappears as soon as the response
 * arrives. A short-lived sessionStorage cache also lets repeat views paint
 * instantly while a background refetch keeps things up-to-date.
 * ------------------------------------------------------------------- */
const PD_CACHE_PREFIX = "pdCache:";
const PD_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function readProductCache(id) {
  try {
    const raw = sessionStorage.getItem(PD_CACHE_PREFIX + id);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || !entry.ts || Date.now() - entry.ts > PD_CACHE_TTL_MS) return null;
    return entry.data || null;
  } catch (_) {
    return null;
  }
}

function writeProductCache(id, data) {
  try {
    sessionStorage.setItem(
      PD_CACHE_PREFIX + id,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch (_) { /* storage full or blocked — ignore */ }
}

// Kick off fetch immediately when on product-detail page (no wait for DOMContentLoaded).
if (
  typeof window !== "undefined" &&
  window.location &&
  window.location.pathname.includes("product-detail")
) {
  (function () {
    try {
      const params = new URLSearchParams(window.location.search);
      const earlyId = params.get("id");
      if (!earlyId) return;
      window.__pdEarlyId = earlyId;
      window.__pdCached = readProductCache(earlyId);
      window.__pdFetchPromise = fetchProductDetail(earlyId).catch((e) => {
        console.warn("Early product fetch failed:", e);
        return null;
      });
    } catch (_) { /* ignore */ }
  })();
}



document.addEventListener("DOMContentLoaded", () => {
  // Initialize quick view modal elements
  qvName = document.getElementById("qvName");
  qvDesc = document.getElementById("qvDesc");
  qvPrice = document.getElementById("qvPrice");
  qvMainImg = document.getElementById("qvMainImg");
  qvThumbs = document.getElementById("qvThumbs");
  qvColors = document.getElementById("qvColors");
  qvSizes = document.getElementById("qvSizes");
  
  // Initialize modal
  const el = document.getElementById("quickViewModal");
  if (el) {
    quickModal = new bootstrap.Modal(el);
    el.addEventListener("hidden.bs.modal", () => {
      document.body.classList.remove("modal-open");
      document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
    });
  }
  
  loadProducts(1, 50);
});


function closeSidebar() {
  document
    .querySelectorAll(".select-option-box")
    .forEach((b) => b.classList.remove("show"));
}

function openOptions(btn) {
  const card = btn.closest(".col");
  const box = card.querySelector(".select-option-box");
  box.classList.add("show");
}
// Quick View Function - Fetches full product data and populates modal
async function openQuickView(productId) {
  try {
    console.log("Fetching product detail for quick view:", productsDetailUrl(productId));
    const p = await fetchProductDetail(productId);
    if (!p || !p.name) {
      console.warn("Product not found for quick view:", productId);
      return;
    }

    console.log("Found product for quick view:", p);

    // Populate all product details in quick view modal
    if (qvName) qvName.innerText = p.name || "";
    if (qvDesc) qvDesc.innerText = getProductDescription(p);
    const qvCategory = document.getElementById("qvCategory");
    if (qvCategory) qvCategory.innerText = getProductCategory(p) || "N/A";
    const qvPricing = getProductPrice(p);
    if (qvPrice) {
      qvPrice.innerHTML = `₹${qvPricing.finalPrice} ${qvPricing.hasDiscount ? `<del>₹${qvPricing.strikePrice}</del>` : ""}`;
    }

    // Images
    qvImages = getProductImages(p);
    qvIndex = 0;

    if (qvMainImg && qvImages.length > 0) {
      qvMainImg.src = toImageUrl(qvImages[qvIndex]);
    }

    // Thumbnails
    if (qvThumbs) {
      qvThumbs.innerHTML = "";
      qvImages.forEach((src, i) => {
        qvThumbs.innerHTML += `
          <div class="swiper-slide">
            <div class="image-box">
              <img src="${toImageUrl(src)}" class="thumb-img" data-i="${i}" style="cursor:pointer">
            </div>
          </div>`;
      });

      // Add click handlers for thumbnails
      setTimeout(() => {
        document.querySelectorAll(".thumb-img").forEach((img) => {
          img.onclick = () => {
            qvIndex = +img.dataset.i;
            if (qvMainImg) qvMainImg.src = img.src;
          };
        });
      }, 50);
    }

    // Colors
    if (qvColors) {
      qvColors.innerHTML = "";
      const colors = getProductColors(p);
      if (colors.length > 0) {
        colors.forEach((c) => {
          qvColors.innerHTML += `
            <div style="width:30px;height:30px;border-radius:50%;
                        background:${c};border:1px solid #ccc;cursor:pointer;margin:2px;"></div>`;
        });
      } else {
        qvColors.innerHTML = `<span class="text-muted">No color</span>`;
      }
    }

    // Sizes
    if (qvSizes) {
      qvSizes.innerHTML = "";
      const sizes = getProductSizes(p);
      if (sizes.length > 0) {
        sizes.forEach((s) => {
          qvSizes.innerHTML += `
            <div class="px-3 py-1 border" style="cursor:pointer;margin:2px;">${s}</div>`;
        });
      } else {
        qvSizes.innerHTML = `<span class="text-muted">No size</span>`;
      }
    }

    // Configure Quick View Add to Cart button (Overriding footer.php defaults)
    const quickViewModalEl = document.getElementById("quickViewModal");
    if (quickViewModalEl) {
      const addBtn = quickViewModalEl.querySelector(".buy-btn");
      if (addBtn) {
        addBtn.removeAttribute("onclick"); // Remove existing redirect to cart.html
        addBtn.classList.add("qv-add-cart-btn");
        addBtn.setAttribute("data-id", p._id || p.id);
        addBtn.setAttribute("data-price", qvPricing.finalPrice || 0);
      }
    }

    // Show modal
    if (quickModal) {
      quickModal.show();
    }

  } catch (error) {
    console.error("Error loading quick view:", error);
  }
}



// individual product buy now  ****************************************

function toImageUrl(path) {
  if (typeof window.resolveApiMediaUrl === "function") {
    return window.resolveApiMediaUrl(path);
  }
  if (!path || typeof path !== "string") return "assets/images/product/placeholder.png";
  var t = path.trim();
  return /^https?:\/\//i.test(t) ? t : BASE + (t.startsWith("/") ? t : "/" + t);
}

function getProductImages(product) {
  const mainImage = product.mainImage || product.mainimage;
  const galleryImages = product.galleryImages || product.galleryimages || [];
  return [mainImage, ...galleryImages].filter(Boolean);
}

function normalizeToArray(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  if (value && typeof value === "object") {
    const values = Object.values(value).filter((v) => typeof v === "string" && v.trim());
    return values.map((v) => v.trim());
  }
  return [];
}

function getProductPrice(product) {
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const regular = toNum(product.price ?? product.Price);
  const discountCandidate = toNum(
    product.discountPrice ?? product.discountprice,
  );

  let effectiveDiscount = discountCandidate;
  if (regular > 0 && discountCandidate > regular) {
    effectiveDiscount = regular;
  }

  const hasRealDiscount =
    regular > 0 && effectiveDiscount > 0 && effectiveDiscount < regular;

  const finalPrice =
    hasRealDiscount ? effectiveDiscount : effectiveDiscount > 0
      ? effectiveDiscount
      : regular;

  return {
    regular,
    discount: effectiveDiscount,
    finalPrice,
    hasDiscount: hasRealDiscount,
    strikePrice: hasRealDiscount ? regular : 0,
  };
}

function getProductDescription(product) {
  return product.shortDescription || product.shortdescription || "";
}

function getProductCategory(product) {
  return product.categoryName || product.categoryname || "";
}

function getProductColors(product) {
  return normalizeToArray(product.colors?.map?.((c) => c.name || c) || product.colors || product.colorname);
}

function getProductSizes(product) {
  return normalizeToArray(product.sizes?.map?.((s) => s.name || s) || product.sizes || product.sizename);
}

// Proceed to Checkout Function
async function proceedToCheckout() {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    localStorage.setItem(
      "postLoginRedirect",
      `${window.location.pathname}${window.location.search}`,
    );
    localStorage.setItem("postLoginAction", "checkout");
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: "Login Required",
        text: "Please login to proceed to checkout.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel"
      }).then((result) => {
        if (result.isConfirmed) {
          const authModalEl = document.getElementById('authenticationModal');
          if (authModalEl) {
            const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
            authModal.show();
          }
        }
      });
    } else {
      alert("Login Required. Please login.");
    }
    return;
  }

  const currentCoupon = localStorage.getItem("appliedCoupon") || "";
  const payload = { couponCode: currentCoupon };

  try {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const response = await fetch(`${BASE}/api/orders/checkout`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Checkout API Response:", data);

    if (response.ok && data.success === true) {
      // Pass data to checkout.php via URL
      const encodedData = encodeURIComponent(JSON.stringify(data));
      window.location.href = `checkout.php?checkoutData=${encodedData}`;
    } else {
      if (typeof Swal !== 'undefined') {
        Swal.fire("Failed", data.message || "Unable to proceed to checkout.", "error");
      } else {
        alert(data.message || "Unable to proceed to checkout.");
      }
    }
  } catch (err) {
    console.error("Checkout error:", err);
    if (typeof Swal !== 'undefined') {
      Swal.fire("Error", "Something went wrong. Please try again later.", "error");
    } else {
      alert("Something went wrong. Please try again later.");
    }
  }
}


// individual product buy now  end ****************************************

// Stock helpers — respects <c>trackInventory === false</c> (unlimited / not tracked)
function getSellableUnits(p) {
  if (!p || typeof p !== "object") return 0;
  const track = p.trackInventory ?? p.trackinventory;
  if (track === false) return Number.POSITIVE_INFINITY;
  const n = Number(p.stockQuantity ?? p.stockquantity ?? 0);
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

function isProductOutOfStock(p) {
  return getSellableUnits(p) <= 0;
}

// Add to Cart Function
async function addToCart(productId, quantity = 1, price) {
  try {
    const payload = {
      productId: productId,
      quantity: quantity,
      price: price
    };

    console.log("Adding to cart with payload:", payload);

    const headers = {
      'Content-Type': 'application/json',
    };
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const response = await fetch(`${BASE}/api/cart/add`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload)
    });

    let data = {};
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch {
      data = {};
    }

    if (!response.ok) {
      const msg = data?.message || data?.Message || `Server error (${response.status})`;
      if (typeof Swal !== "undefined") {
        Swal.fire({ icon: "error", title: "Cannot add to cart", text: String(msg) });
      } else {
        alert(String(msg));
      }
      return false;
    }
    console.log("Add to cart response:", data);

    if (data.success === false) {
      const msg = data.message || "Could not add to cart.";
      if (typeof Swal !== "undefined") {
        Swal.fire({ icon: "warning", title: "Cannot add", text: msg, confirmButtonText: "OK" });
      } else {
        alert(msg);
      }
      return false;
    }

    if (data.success === true || data.Success === true) {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Product added to cart successfully!",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        alert("Product added to cart successfully!");
      }
      if (typeof refreshAllCarts === "function") {
        refreshAllCarts();
      } else if (typeof loadOffcanvasCart === "function") {
        loadOffcanvasCart();
      }
      return true;
    }

    if (typeof Swal !== "undefined") {
      Swal.fire({ icon: "error", title: "Error!", text: "Error adding to cart" });
    } else {
      alert("Error adding to cart");
    }
    return false;

  } catch (error) {
    console.error("Error adding to cart:", error);
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Error adding to cart: ' + error.message,
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK'
      });
    } else {
      alert("Error adding to cart: " + error.message);
    }
    return false; // Return failure
  }
}

// Smoothly bring the product grid (or a nearby anchor) into view after a
// pagination-triggered reload, leaving a small top offset for the sticky
// header so the first row isn't hidden behind it.
function scrollToProductsTop(container) {
  if (!container) return;
  const anchor = container.closest('.shop-section, section, .container, .row') || container;
  const rect = anchor.getBoundingClientRect();
  const top = rect.top + window.pageYOffset - 120;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

async function loadProducts(page = 1, limit = 50) {
  const container = document.getElementById("productsContainer");
  if (!container) return;

  // On any page >1 request, scroll the product grid into view so the user
  // can see the newly-loaded page without having to scroll manually.
  if (page > 1) {
    scrollToProductsTop(container);
  }

  container.innerHTML = `
    <div class="col-12 d-flex justify-content-center align-items-center py-5 w-100">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
  `;

  let url = buildProductsListUrl(page, limit);

  try {
      const res = await fetch(url);
      const json = await res.json();

      // Handle both the old flat shape (`{data: [...]}`) and the new cursor-paginated
      // shape (`{data: {data: [...], total, hasMore, nextCursor}}`).
      const payload = json?.data;
      const products = Array.isArray(payload) ? payload : (payload?.data || []);
      const totalProducts = Number(payload?.total ?? 0) || 0;
      const hasMore = !!payload?.hasMore;

      // Prefer the server's total when it was supplied (includeTotal=true). When
      // the backend skips the count (for speed on huge catalogs), fall back to
      // `hasMore`: show current page + an extra "phantom" page so the Next arrow
      // stays active. This gracefully degrades to cursor-style pagination.
      let totalPages;
      if (totalProducts > 0) {
          totalPages = Math.max(1, Math.ceil(totalProducts / limit));
      } else if (hasMore) {
          totalPages = page + 1; // at least one more page exists
      } else {
          totalPages = page; // this is the last page
      }

      // If the page we asked for is out of range (e.g. after a filter change
      // shrank the result set), fall back to page 1. Only applies when we have
      // an authoritative total — with `hasMore`-only mode we can't detect this.
      if (totalProducts > 0 && page > totalPages && totalPages > 0) {
          return loadProducts(1, limit);
      }

      container.innerHTML = "";

      if (products.length === 0) {
          container.innerHTML = `<div class="col-12 text-center py-5 w-100"><h4 class="text-muted">No products found matching your filters.</h4></div>`;
      } else {
          products.forEach((p) => {
              container.insertAdjacentHTML("beforeend", cardHTML(p));
          });
          bindCardEvents();
      }

  renderPagination(totalPages, page, limit);
  } catch (error) {
      console.error("Error loading products:", error);
      container.innerHTML = `<div class="col-12 text-center text-danger py-5 w-100"><h4>Error loading products. Please try again.</h4></div>`;
  }
}

function renderPagination(totalPages, currentPage, limit = 50) {
  const paginationNav = document.querySelector(".custom-pagination .pagination");
  if (!paginationNav) return;

  paginationNav.innerHTML = "";

  // Hide the pager entirely when there's nothing to page through.
  if (!totalPages || totalPages <= 1) {
    return;
  }

  // Previous button
  const prevLi = document.createElement("li");
  prevLi.className = `page-item ${currentPage === 1 ? "disabled" : ""}`;
  prevLi.innerHTML = `<a class="page-link" href="#!"><i class="ri-arrow-left-s-line"></i></a>`;
  if (currentPage > 1) {
    prevLi.addEventListener("click", () => loadProducts(currentPage - 1, limit));
  }
  paginationNav.appendChild(prevLi);

  // Page numbers (windowed to avoid rendering huge lists for large catalogs).
  const windowSize = 7;
  let start = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);

  for (let i = start; i <= end; i++) {
    const pageLi = document.createElement("li");
    pageLi.className = `page-item ${i === currentPage ? "active" : ""}`;
    pageLi.innerHTML = `<a class="page-link" href="#!"><span>${i}</span></a>`;
    pageLi.addEventListener("click", () => loadProducts(i, limit));
    paginationNav.appendChild(pageLi);
  }

  // Next button
  const nextLi = document.createElement("li");
  nextLi.className = `page-item ${currentPage === totalPages ? "disabled" : ""}`;
  nextLi.innerHTML = `<a class="page-link" href="#!"><i class="ri-arrow-right-s-line"></i></a>`;
  if (currentPage < totalPages) {
    nextLi.addEventListener("click", () => loadProducts(currentPage + 1, limit));
  }
  paginationNav.appendChild(nextLi);
}

function cardHTML(p) {
  const id = p._id || p.id;
  const img = p.images?.[0] || p.mainImage || p.mainimage || "assets/images/product/placeholder.png";
  const pricing = getProductPrice(p);
  const oos = isProductOutOfStock(p);
  const addCartMarkup = oos
    ? `<button type="button" class="btn add-cart-btn" disabled data-id="${id}">Out of stock</button>`
    : `<button class="btn add-cart-btn" data-id="${id}">add to cart</button>`;

  return `
  <div class="col">
    <div class="product-box-4-main">

      <div class="select-option-box">
        <div class="select-box">
          <div>
            <div class="color-box">
              <h4 class="h5">Colors</h4>
              <ul class="color-list">
                <li><a href="#!" style="background-color:#f4c266;"></a></li>
                <li><a href="#!" style="background-color:#e7e597;"></a></li>
                <li><a href="#!" style="background-color:#6aa473;"></a></li>
              </ul>
            </div>

            <div class="size-box">
              <h4 class="h5">Sizes</h4>
              <ul class="size-list">
                <li><a href="#!">xs</a></li>
                <li><a href="#!">s</a></li>
                <li><a href="#!">m</a></li>
                <li><a href="#!">l</a></li>
                <li><a href="#!">xl</a></li>
              </ul>
            </div>

            ${addCartMarkup}
            <button class="close-btn btn" onclick="closeSidebar()">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="productMain product-box-4 pro-bg-white">
        <div class="product-image">
          <a href="product-detail.php?id=${id}">
            <img src="${toImageUrl(img)}" class="img-fluid productImage" alt="">
          </a>

          <div class="quick-view-button-box">
            <button class="btn view-btn quickViewBtn" data-id="${id}">
              Quick View
            </button>
          </div>
        </div>

        <div class="product-content">
          <h5 class="sub-name productName">${p.brandName || p.brandname || ""}</h5>

          <a href="product-detail.php?id=${id}" class="name">
            <h5>${p.name}</h5>
          </a>

          <ul class="rating">
            <li><i class="ri-star-fill fill"></i></li>
            <li><i class="ri-star-fill fill"></i></li>
            <li><i class="ri-star-fill fill"></i></li>
            <li><i class="ri-star-fill fill"></i></li>
            <li><i class="ri-star-fill fill"></i></li>
          </ul>

          

          <h5 class="price">
            ₹${pricing.finalPrice}
            ${pricing.hasDiscount ? `<del>₹${pricing.strikePrice}</del>` : ""}
          </h5>

          <div class="option-box">
            <button class="btn select-btn" data-id="${id}" onclick="openOptions(this)">Select Options</button>
            <ul class="option-list">
              <li>
               <a class="wishlistProduct" data-id="${id}" style="cursor:pointer">
  <i class="ri-heart-3-line"></i>
</a>
              </li>
              <li>
                <a class="compareProduct" data-id="${id}" style="cursor:pointer" title="Add to compare">
                  <i class="ri-repeat-2-line"></i>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  </div>`;
}

function bindCardEvents() {
  const container = document.getElementById("productsContainer");
  
  if (!container) {
    console.warn("Products container not found");
    return;
  }

  // Prevent duplicate event bindings if loadProducts is called multiple times
  if (container.dataset.eventsBound) return;
  container.dataset.eventsBound = "true";

  // Use event delegation for all button clicks
  container.addEventListener("click", (e) => {
    // Select Options button
    if (e.target.closest(".select-btn")) {
      const btn = e.target.closest(".select-btn");
      const card = btn.closest(".col");
      const id = btn.dataset.id;
      openOptions(card, id);
    }

    // Quick View button
    if (e.target.closest(".view-btn")) {
      const btn = e.target.closest(".view-btn");
      const id = btn.dataset.id;
      openQuickView(id);
    }

    // Add to Cart button
    if (e.target.closest(".add-cart-btn")) {
      e.preventDefault();
      const btn = e.target.closest(".add-cart-btn");
      const card = btn.closest(".col") || btn.closest(".select-box");
      const productId = btn.getAttribute("data-id");
      
      if (!card) {
        console.error("Product card not found");
        return;
      }

      // Get price from the card
      const priceEl = card.closest(".col")?.querySelector(".price") || 
                      card.querySelector(".price") ||
                      card.closest(".product-box-4-main")?.querySelector(".price");
      
      let price = 0;
      if (priceEl) {
        const priceText = priceEl.innerText;
        const priceMatch = priceText.match(/[\d.]+/);
        price = priceMatch ? parseFloat(priceMatch[0]) : 0;
      }

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      addToCart(productId, 1, price);
    }
  });
}

// Open Options Function - Fetches product data and populates select options
async function openOptions(card, productId) {
  const box = card?.querySelector(".select-option-box");
  if (!box) return;

  // Show immediately for instant UI feedback
  box.classList.add("show");

  const colorsList = card.querySelector(".color-list");
  const sizesList = card.querySelector(".size-list");

  if (colorsList) colorsList.innerHTML = "<li>Loading colors...</li>";
  if (sizesList) sizesList.innerHTML = "<li>Loading sizes...</li>";

  if (!productId) {
    if (colorsList) colorsList.innerHTML = "<li>No colors available</li>";
    if (sizesList) sizesList.innerHTML = "<li>No sizes available</li>";
    return;
  }

  try {
    console.log("Fetching product detail for select options:", productsDetailUrl(productId));
    const p = await fetchProductDetail(productId);
    if (!p || !p.name) {
      console.warn("Product not found for select options:", productId);
      if (colorsList) colorsList.innerHTML = "<li>No colors available</li>";
      if (sizesList) sizesList.innerHTML = "<li>No sizes available</li>";
      return;
    }

    console.log("Found product for select options:", p);

    if (colorsList) {
      const colors = getProductColors(p);
      if (colors.length > 0) {
        colorsList.innerHTML = colors
          .map((c) => `<li><a href='#!' style='background-color:${c};'></a></li>`)
          .join("");
      } else {
        colorsList.innerHTML = "<li>No colors available</li>";
      }
    }

    if (sizesList) {
      const sizes = getProductSizes(p);
      if (sizes.length > 0) {
        sizesList.innerHTML = sizes
          .map((s) => `<li><a href='#!'>${s}</a></li>`)
          .join("");
      } else {
        sizesList.innerHTML = "<li>No sizes available</li>";
      }
    }

    const addCartBtn = card.querySelector(".add-cart-btn");
    if (addCartBtn) {
      addCartBtn.setAttribute("data-id", productId);
    }

  } catch (error) {
    console.error("Error loading select options:", error);
    if (colorsList) colorsList.innerHTML = "<li>Error loading colors</li>";
    if (sizesList) sizesList.innerHTML = "<li>Error loading sizes</li>";
  }
}

// Product Detail Page Script

// <script>
{
  /* const BASE = "https://api.workarya.com"; */
}

// ==================== RECENT VIEWS API ====================
async function addToRecentViews(productId) {
  if (!productId) return;

  try {
    const userToken = localStorage.getItem("userToken");
    const headers = {
      'Content-Type': 'application/json',
    };

    if (userToken) {
      headers['Authorization'] = `Bearer ${userToken}`;
    }

    const response = await fetch(`${BASE}/api/recent/add/${productId}`, {
      method: 'POST',
      headers: headers,
    });

    const data = await response.json();

    console.log("Recent view API response:", data);

    if (response.ok && (data.success || data.message?.toLowerCase().includes("success"))) {
      console.log(`Product ${productId} added to recent views successfully`);

      // Optional: Show success message (can be removed if you don't want alert every time)
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Recent View Updated',
          text: 'Product added to Recently Viewed',
          toast: true,
          position: 'bottom-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      } else {
        console.log("Product added to recently viewed");
      }
    } else {
      console.warn("Recent view API did not return success:", data.message || data);
    }

  } catch (error) {
    console.error("Error adding to recent views:", error);
    // Silent fail - don't disturb user experience
  }
}

// Product Detail Page Script - Only run on product-detail.php
if (window.location.pathname.includes('product-detail')) {
  document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    if (!id) {
      alert("No product ID provided");
      return;
    }

    const hidePreloader = () => {
      if (typeof window.hideProductDetailPreloader === "function") {
        window.hideProductDetailPreloader();
      }
    };

    let painted = false;
    const paint = (data) => {
      if (!data || !data.name) return false;
      try {
        populateProduct(data);
        painted = true;
        hidePreloader();
        return true;
      } catch (e) {
        console.warn("populateProduct failed:", e);
        return false;
      }
    };

    // 1) Instant paint from session cache if available.
    const cached = window.__pdCached || readProductCache(id);
    if (cached) paint(cached);

    // 2) Await the network response (early-fetch started at script parse).
    try {
      const promise = window.__pdFetchPromise || fetchProductDetail(id);
      const fresh = await promise;
      if (fresh && fresh.name) {
        writeProductCache(id, fresh);
        if (!painted) {
          if (!paint(fresh)) throw new Error("Invalid product data structure");
        } else {
          // Refresh UI silently with latest data (cache was stale but valid).
          try { populateProduct(fresh); } catch (_) { /* ignore */ }
        }
      } else if (!painted) {
        throw new Error("Invalid product data structure");
      }

      // Ensure preloader is gone even if paint path was skipped.
      hidePreloader();

      // 3) Non-critical work runs in the background (no await, no blocking).
      const p = fresh || cached;
      Promise.resolve().then(() => { try { addToRecentViews(id); } catch (_) {} });
      if (typeof loadProductReviews === "function") {
        Promise.resolve().then(() => { try { loadProductReviews(id); } catch (_) {} });
      }
      if (typeof loadRelatedProducts === "function") {
        Promise.resolve().then(() => { try { loadRelatedProducts(id, 8, p); } catch (_) {} });
      }

      // Post-login checkout redirect (only runs once data is available).
      const qp = new URLSearchParams(window.location.search);
      if (qp.get("postLoginCheckout") === "1") {
        qp.delete("postLoginCheckout");
        const newQuery = qp.toString();
        const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ""}`;
        window.history.replaceState({}, "", newUrl);
        if (typeof proceedToCheckout === "function") {
          proceedToCheckout();
        }
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      hidePreloader();
      if (!painted) alert("Error loading product: " + error.message);
    }
  });
}

function stripHtml(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

function populateProduct(p) {
  console.log("Populating product with data:", p);

  const pricing = getProductPrice(p);
  const sizes = getProductSizes(p);
  const colors = getProductColors(p);

  // Images
  const images = getProductImages(p);
  console.log("Images to display:", images);
  const swiperWrapper = document.querySelector(
    ".product-original-slider .swiper-wrapper",
  );
  const thumbWrapper = document.querySelector(
    ".thumbnail-product-slider .swiper-wrapper",
  );
  if (swiperWrapper) {
    swiperWrapper.innerHTML = "";
    images.forEach((img) => {
      swiperWrapper.innerHTML += `
                                <div class="swiper-slide">
                                    <div class="slider-image">
                                        <img src="${toImageUrl(img)}" class="img-fluid" alt="">
                                    </div>
                                </div>`;
    });
    console.log("Updated main images");
  } else {
    console.warn("Main swiper wrapper not found");
  }
  if (thumbWrapper) {
    thumbWrapper.innerHTML = "";
    images.forEach((img) => {
      thumbWrapper.innerHTML += `
                                <div class="swiper-slide">
                                    <div class="sidebar-image">
                                        <img src="${toImageUrl(img)}" class="img-fluid" alt="">
                                    </div>
                                </div>`;
    });
    console.log("Updated thumbnail images");
  } else {
    console.warn("Thumbnail swiper wrapper not found");
  }

  // Reinitialize Swiper instances for proper thumbs functionality
  if (typeof Swiper !== 'undefined') {
    // Destroy existing instances if they exist
    const existingMainSwiper = document.querySelector('.product-original-slider').swiper;
    const existingThumbSwiper = document.querySelector('.thumbnail-product-slider').swiper;
    
    if (existingMainSwiper) {
      existingMainSwiper.destroy();
    }
    if (existingThumbSwiper) {
      existingThumbSwiper.destroy();
    }

    // Initialize thumbnail swiper first
    const thumbSwiper = new Swiper('.thumbnail-product-slider', {
      spaceBetween: 15,
      slidesPerView: 4,
      freeMode: true,
      watchSlidesProgress: true,
    });

    // Initialize main swiper with thumbs
    const mainSwiper = new Swiper('.product-original-slider', {
      spaceBetween: 10,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: thumbSwiper,
      },
    });

    // Add click handlers to thumbnail slides to change main image
    thumbSwiper.slides.forEach((slide, index) => {
      slide.style.cursor = 'pointer';
      slide.addEventListener('click', () => {
        mainSwiper.slideTo(index);
      });
    });

    console.log("Reinitialized Swiper instances with thumbs and click handlers");
  } else {
    console.warn("Swiper library not loaded");
  }

  // Product details
  const productNameEl = document.querySelector(".right-box-contain .name");
  if (productNameEl) {
    productNameEl.innerText = p.name;
    productNameEl.setAttribute("data-product-share-title", p.name || "");
    console.log("Updated product name to:", p.name);
  } else {
    console.warn("Product name element not found");
  }

  const priceEl = document.querySelector(".product-price");
  if (priceEl) {
    priceEl.innerHTML = `₹${pricing.finalPrice} ${pricing.hasDiscount ? `<del>₹${pricing.strikePrice}</del>` : ""}`;
    console.log("Updated price to:", `₹${pricing.finalPrice}`);
  } else {
    console.warn("Price element not found");
  }
  const descEl = document.querySelector(".product-contain p");
  if (descEl) {
    descEl.innerText = getProductDescription(p);
    console.log("Updated description");
  } else {
    console.warn("Description element not found");
  }

  // Description box
  const descriptionBoxEl = document.querySelector(".description-box p");
  if (descriptionBoxEl) {
    descriptionBoxEl.innerText = stripHtml(p.description || "");
    console.log("Updated description box");
  } else {
    console.warn("Description box element not found");
  }

  ///// SIZES
  const sizeForm = document.querySelector(
    ".select-package:not(.color-product)",
  );
  const sizeSection = sizeForm?.closest(".product-package"); // poora size block

  if (sizeForm && sizes.length > 0) {
    // show section
    if (sizeSection) sizeSection.style.display = "";

    sizeForm.innerHTML = "";
    sizes.forEach((s, i) => {
      sizeForm.insertAdjacentHTML(
        "beforeend",
        `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="flexRadioDefault" id="size${i}" ${i === 0 ? "checked" : ""}>
        <label class="form-check-label" for="size${i}">${s}</label>
      </div>
    `,
      );
    });

    console.log("Updated sizes");
  } else {
    // hide entire size block if no sizes
    if (sizeSection) sizeSection.style.display = "none";
    console.warn("No sizes for this product");
  }

  ///// COLORS
  const colorForm = document.querySelector(".color-product");
  const colorSection = colorForm?.closest(".product-package"); // poora color block

  if (colorForm && colors.length > 0) {
    // show section
    if (colorSection) colorSection.style.display = "";

    colorForm.innerHTML = "";
    colors.forEach((c, i) => {
      colorForm.insertAdjacentHTML(
        "beforeend",
        `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="colorRadio" id="color${i}" ${i === 0 ? "checked" : ""} style="background-color: ${c};">
        <label class="form-check-label bg-transparent" for="color${i}"></label>
      </div>
    `,
      );
    });

    console.log("Updated colors");
  } else {
    // hide entire color block if no colors
    if (colorSection) colorSection.style.display = "none";
    console.warn("No colors for this product");
  }
  // Description tab
  const descTabEl = document.querySelector("#description .nav-desh p");
  if (descTabEl) {
    descTabEl.innerText = stripHtml(p.description || "");
    console.log("Updated description tab");
  } else {
    console.warn("Description tab element not found");
  }

  // About Item
  const aboutList = document.querySelector(".about-item-list");
  if (aboutList) {
    aboutList.innerHTML = `
                            <li>Brand : <span>${p.brandName || p.brandname || ""}</span></li>
                            <li>Category : <span>${getProductCategory(p)}</span></li>
                            <li>Condition : <span>Brand new</span></li>
                            <li>Color : <span>${colors[0] || ""}</span></li>
                            `;
    console.log("Updated about item list");
  } else {
    console.warn("About item list not found");
  }

  // Sidebar
  const sidebarImg = document.querySelector(
    ".side-product-box .product-image img",
  );
  if (sidebarImg) {
    sidebarImg.src = toImageUrl(p.mainImage || p.mainimage);
    console.log("Updated sidebar image");
  } else {
    console.warn("Sidebar image not found");
  }
  const stockEl = document.querySelector(".stock-box span");
  if (stockEl) {
    const units = getSellableUnits(p);
    if (units === Number.POSITIVE_INFINITY) {
      stockEl.textContent = "In stock";
    } else if (units <= 0) {
      stockEl.textContent = "Out of stock";
    } else {
      stockEl.textContent = String(units);
    }
  } else {
    console.warn("Stock element not found");
  }

  // Selected Options
  const selectedOptionsEl = document.querySelector(
    ".side-product-box .product-contain h4",
  );
  if (selectedOptionsEl) {
    const firstSize = sizes[0] || "";
    const firstColor = colors[0] || "";
    selectedOptionsEl.innerText = `${firstSize}${firstSize && firstColor ? ", " : ""}${firstColor}`;
    console.log("Updated selected options to:", selectedOptionsEl.innerText);
  } else {
    console.warn("Selected options element not found");
  }

  const h4 = document.querySelector(".total-price-box h4");

  if (h4) {
    // first text node (span se pehle jo price text hota hai)
    const textNode = [...h4.childNodes].find(
      (n) => n.nodeType === Node.TEXT_NODE,
    );

    if (textNode) {
      textNode.nodeValue = `₹${pricing.finalPrice} `;
    } else {
      // agar text node na mile to naya insert kar do span se pehle
      h4.insertBefore(
        document.createTextNode(`₹${pricing.finalPrice} `),
        h4.firstChild,
      );
    }
  } else {
    console.warn("Total price element not found");
  }

  // Add button group (or Out of stock when no inventory)
  const buttonContainer = document.querySelector(".total-price-box") || document.querySelector(".side-product-box");
  if (buttonContainer) {
    const existingButtons = buttonContainer.querySelector(".button-group");
    if (existingButtons) {
      existingButtons.remove();
    }

    const oos = isProductOutOfStock(p);
    if (oos) {
      buttonContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="button-group">
          <button type="button" class="btn theme-border fw-500 w-100" disabled aria-disabled="true">Out of stock</button>
        </div>`,
      );
    } else {
      buttonContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="button-group">
        <button class="btn buy-btn-desktop theme-bg-color text-white" data-action="buy-now" data-product-id="${p.id}">Buy now</button>
        <button class="btn add-to-bag-btn buy-btn-2 theme-border fw-500" data-product-id="${p.id}" data-product-price="${pricing.finalPrice}">
          <i class="ri-shopping-bag-line"></i> Add to bag
        </button>
      </div>`,
      );
    }
  } else {
    console.warn("Button container not found");
  }

  console.log("Product population completed");
}

// Event delegation for buttons on product detail page
if (!window.cartGlobalClickBound) {
  window.cartGlobalClickBound = true;
  document.addEventListener("click", async (e) => {
    // Desktop "Add to bag" button
    if (e.target.closest(".add-to-bag-btn")) {
      e.preventDefault();
      const btn = e.target.closest(".add-to-bag-btn");
      const productId = btn.getAttribute("data-product-id");
      const price = parseFloat(btn.getAttribute("data-product-price"));

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      addToCart(productId, 1, price);
    }

    // Desktop "Buy now" button
    if (e.target.closest(".buy-btn-desktop")) {
      e.preventDefault();
      const btn = e.target.closest(".buy-btn-desktop");
      const productId = btn.getAttribute("data-product-id");

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      // Get the price from the DOM
      const priceEl = document.querySelector(".product-price");
      let price = 0;
      if (priceEl) {
        const priceText = priceEl.innerText;
        const priceMatch = priceText.match(/[\d.]+/);
        price = priceMatch ? parseFloat(priceMatch[0]) : 0;
      }

      if (price === 0) {
        console.warn("Could not extract price from page");
      }

      // First, add to cart
      const addToCartSuccess = await addToCart(productId, 1, price);
      if (addToCartSuccess) {
        // After adding to cart, proceed to checkout
        await proceedToCheckout();
      }
    }

    // Mobile buttons
    if (e.target.closest(".buy-btn-mobile") || e.target.closest(".add-to-bag-btn-mobile")) {
      e.preventDefault();
      const btn = e.target.closest(".buy-btn-mobile") || e.target.closest(".add-to-bag-btn-mobile");
      const action = btn.getAttribute("data-action");
      const urlParams = new URLSearchParams(window.location.search);
      const productId = urlParams.get("id");

      if (!productId) {
        console.error("Product ID not found in URL");
        alert("Product ID not found");
        return;
      }

      if (action === "buy-now") {
        // Redirect to checkout page with product ID
        window.location.href = `checkout.php?id=${productId}`;
      } else if (action === "add-to-cart") {
        // Get the price from the DOM
        const priceEl = document.querySelector(".product-price");
        let price = 0;
        if (priceEl) {
          const priceText = priceEl.innerText;
          const priceMatch = priceText.match(/[\d.]+/);
          price = priceMatch ? parseFloat(priceMatch[0]) : 0;
        }

        if (price === 0) {
          console.warn("Could not extract price from page");
        }

        addToCart(productId, 1, price);
      }
    }

    // Quick View "Add to bag" button
    if (e.target.closest(".qv-add-cart-btn")) {
      e.preventDefault();
      const btn = e.target.closest(".qv-add-cart-btn");
      const productId = btn.getAttribute("data-id");
      const price = parseFloat(btn.getAttribute("data-price")) || 0;

      if (!productId) {
        console.error("Product ID not found");
        return;
      }

      addToCart(productId, 1, price);
    }
  });
}

async function loadRelatedProducts(productId, limit = 8, currentProduct = null) {
  const wrapper = document.querySelector(".related-products .swiper-wrapper");
  if (!wrapper || !productId) return;

  try {
    let products = [];
    let res = await fetch(
      `${BASE}/api/products/related/${encodeURIComponent(productId)}?limit=${encodeURIComponent(limit)}`,
    );

    // Some deployments don't expose /related endpoint yet (404). Fallback to category list.
    if (res.ok) {
      const json = await res.json();
      products = json?.data?.data || json?.data || [];
    } else {
      const categoryId =
        currentProduct?.categoryid ||
        currentProduct?.categoryId ||
        currentProduct?.category?.id ||
        "";

      if (categoryId) {
        res = await fetch(
          `${BASE}/api/products/list?page=1&pageSize=${encodeURIComponent(limit + 1)}&categoryIds=${encodeURIComponent(categoryId)}`,
        );
        if (res.ok) {
          const listJson = await res.json();
          const list = listJson?.data?.data || listJson?.data || [];
          products = list.filter((x) => String(x.id || x._id) !== String(productId));
        }
      }
    }

    wrapper.innerHTML = "";

    if (!Array.isArray(products) || products.length === 0) {
      wrapper.innerHTML = `<div class="swiper-slide"><p class="text-muted">No related products found.</p></div>`;
      return;
    }

    products.slice(0, limit).forEach((p) => {
      wrapper.insertAdjacentHTML("beforeend", flashSaleCardHTML(p));
    });

    const relatedSwiperEl = document.querySelector(".related-products");
    if (relatedSwiperEl && relatedSwiperEl.swiper) {
      relatedSwiperEl.swiper.update();
    }
  } catch (err) {
    console.error("Error loading related products:", err);
    wrapper.innerHTML = `<div class="swiper-slide"><p class="text-muted">No related products found.</p></div>`;
  }
}
function shortName(name, words = 6) {
  if (!name) return "";
  const parts = name.split(" ");
  return parts.length > words
    ? parts.slice(0, words).join(" ") + "..."
    : name;
}

function flashSaleCardHTML(p) {
  const id = p._id || p.id;
  const img = p.images?.[0] || p.mainImage || p.mainimage || "assets/images/product/placeholder.png";
  const pricing = getProductPrice(p);
  const oos = isProductOutOfStock(p);
  const sq = Number(p.stockQuantity ?? p.stockquantity ?? 0);
  const cartBtn = oos
    ? `<button type="button" class="btn cart-button add-cart-btn" data-id="${id}" disabled>Out of stock</button>`
    : `<button class="btn cart-button add-cart-btn" data-id="${id}">Add to cart</button>`;

  return `
    <div class="swiper-slide">
        <div class="product-box productMain">
            <a href="product-detail.php?id=${id}" class="product-image">
                <img src="${toImageUrl(img)}" class="img-fluid productImage" alt="">
            </a>
            <div class="product-content">
                <a href="product-detail.php?id=${id}">
                    <h4 class="productName">${shortName(p.name)}</h4>
                </a>
                <h5 class="price">₹${pricing.finalPrice} ${pricing.hasDiscount ? `<del>₹${pricing.strikePrice}</del>` : ""}</h5>
                <div class="progress">
                    <div class="progress-bar" style="width: ${sq ? Math.min(100, (Math.floor(sq / 3) / (sq || 12)) * 100) : (oos ? 0 : 30)}%"></div>
                </div>
            </div>
            <div class="compare-box">
                ${cartBtn}
                <ul class="compare-list">
                    <li>
                        <a href="#!" class="wishlistProduct" data-id="${id}">
                            <i class="ri-heart-3-line"></i>
                            <span>Wishlist</span>
                        </a>
                    </li>
                    <li>
                        <a href="#!" class="compareProduct" data-id="${id}">
                            <i class="ri-repeat-2-line"></i>
                            <span>Compare</span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  `;
}


// ==========================================
// REVIEWS & RATING DYNAMIC LOGIC
// ==========================================
async function loadProductReviews(productId) {
    try {
        const res = await fetch(`${BASE}/api/review/product/${productId}`);
        const json = await res.json();
        let reviews = [];
        if (json.success && json.data) reviews = json.data;
        else if (Array.isArray(json)) reviews = json;
        else if (json.data) reviews = json.data;

        updateReviewStats(reviews);

        const reviewList = document.getElementById("productReviewsList");
        if (!reviewList) return;

        if (reviews.length === 0) {
            reviewList.innerHTML = `<li><div class="w-100 text-center py-4"><h5 class="text-muted">No reviews yet. Be the first to review!</h5></div></li>`;
            return;
        }

        let html = "";
        reviews.forEach((review, index) => {
            let name = "Anonymous";
            if (review.user && review.user.firstName) {
                name = review.user.firstName + " " + (review.user.lastName || "");
            } else if (review.email) {
                name = review.email.split('@')[0];
            }

            let starsHtml = "";
            for (let i = 1; i <= 5; i++) {
                if (i <= review.rating) {
                    starsHtml += `<li><i class="ri-star-fill fill"></i></li>`;
                } else {
                    starsHtml += `<li><i class="ri-star-line"></i></li>`;
                }
            }

            let dateStr = "Recently";
            if (review.createdAt) {
                const d = new Date(review.createdAt);
                dateStr = d.toLocaleDateString();
            }

            const avatarNum = (index % 6) + 1;

            html += `
                <li>
                    <div class="people-box">
                        <div>
                           
                        </div>
                        <div class="people-comment">
                            <div class="name">
                                <a href="#!">${name}</a>
                                <div class="product-rating">
                                    <ul class="rating">
                                        ${starsHtml}
                                    </ul>
                                </div>
                            </div>
                            <div class="date-time">
                                <h5 class="text-content h6">${dateStr}</h5>
                            </div>
                            <div class="reply">
                                <p>${review.comment || ''}</p>
                            </div>
                        </div>
                    </div>
                </li>
            `;
        });
        reviewList.innerHTML = html;
    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

function updateReviewStats(reviews) {
    const total = reviews.length;
    let sum = 0;
    const counts = {1:0, 2:0, 3:0, 4:0, 5:0};

    reviews.forEach(r => {
        const rating = parseInt(r.rating) || 0;
        sum += rating;
        if(counts[rating] !== undefined) counts[rating]++;
    });

    const avg = total > 0 ? (sum / total).toFixed(1) : 0;
    
    const avgDisplay = document.getElementById("avgRatingDisplay");
    if (avgDisplay) avgDisplay.innerHTML = `${avg} <span>/5</span>`;

    const totalDisplay = document.getElementById("totalRatingsDisplay");
    if (totalDisplay) totalDisplay.innerText = `${total} ratings`;

    const starsDisplay = document.getElementById("avgStarsDisplay");
    if (starsDisplay) {
        let starsHtml = "";
        const roundedAvg = Math.round(avg);
        for(let i=1; i<=5; i++) {
            if (i <= roundedAvg) {
                starsHtml += `<li class="theme-color"><i class="ri-star-fill fill"></i></li>`;
            } else {
                starsHtml += `<li><i class="ri-star-line"></i></li>`;
            }
        }
        starsDisplay.innerHTML = starsHtml;
    }

    for(let i=1; i<=5; i++) {
        const bar = document.getElementById(`bar${i}`);
        if (bar) {
            const pct = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
            bar.style.width = `${pct}%`;
            bar.innerText = `${pct}%`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById("addReviewForm");
    if (reviewForm) {
        const userToken = localStorage.getItem("userToken");
        const nameInput = document.getElementById("reviewName");
        const emailInput = document.getElementById("reviewEmail");

        // Auto-fill user details from decoded JWT token
        if (userToken) {
            try {
                const payload = JSON.parse(atob(userToken.split('.')[1]));
                const fullName = `${payload.FirstName || ''} ${payload.LastName || ''}`.trim();
                if (nameInput) nameInput.value = fullName || payload.email || "User";
                if (emailInput) emailInput.value = payload.email || payload.Email || "";
            } catch(e) {}
        }

        reviewForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            if (!userToken) {
                Swal.fire("Login Required", "Please login to add a review", "info");
                return;
            }

            const rating = document.getElementById("reviewRating").value;
            const comment = document.getElementById("reviewComment").value.trim();
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get("id");

            if (!productId || !rating || !comment) {
                Swal.fire("Warning", "Please provide a rating and a comment.", "warning");
                return;
            }

            const btn = document.getElementById("submitReviewBtn");
            btn.disabled = true;
            btn.textContent = "Submitting...";

            const formData = new FormData();
            formData.append("Rating", rating);
            formData.append("Comment", comment);

            try {
                const res = await fetch(`${BASE}/api/review/add/${productId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${userToken}`
                    },
                    body: formData
                });
                const data = await res.json();

                if (res.ok && (data.success || data.status || (data.message && data.message.toLowerCase().includes("success")))) {
                    Swal.fire("Success", "Review added successfully!", "success");
                    document.getElementById("reviewComment").value = "";
                    document.getElementById("reviewRating").value = "";
                    loadProductReviews(productId);
                } else {
                    Swal.fire("Error", data.message || "Failed to add review", "error");
                }
            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Something went wrong", "error");
            } finally {
                btn.disabled = false;
                btn.textContent = "Submit";
            }
        });
    }
});
