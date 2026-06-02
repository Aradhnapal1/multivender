// ==================== CONFIG ====================
// API host: media-url.js sets window.BASE before this file runs
const CART_API_ROOT = window.BASE || "https://api.workarya.com";

function isCartItemZeroPriced(item) {
  const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
  const total = Number(item.total);
  const unit =
    item.price != null ? Number(item.price)
    : item.currentPrice != null ? Number(item.currentPrice)
    : Number.isFinite(total) ? total / qty
    : NaN;
  return !Number.isFinite(unit) || unit <= 0;
}

function setOffcanvasCartFooterVisible(show) {
  const el = document.getElementById("offcanvasCartFooterActions");
  if (el) el.style.display = show ? "" : "none";
}

function setCartPageChromeVisible(hasItems) {
  const clearBtn = document.getElementById("cartPageClearBtn");
  const proceed = document.getElementById("proceedToCheckoutBtn");
  if (clearBtn) clearBtn.style.display = hasItems ? "" : "none";
  if (proceed) proceed.style.display = hasItems ? "" : "none";
}

const API = {
  applyCoupon: `${CART_API_ROOT}/api/coupon/apply`,
  list: `${CART_API_ROOT}/api/cart/list`,
  updateQuantity: `${CART_API_ROOT}/api/cart/update-quantity`,
  remove: `${CART_API_ROOT}/api/cart/remove`,
  clear: `${CART_API_ROOT}/api/cart/clear`
};

function openLoginModal() {
  const authModalEl = document.getElementById("authenticationModal");
  if (authModalEl && typeof bootstrap !== "undefined") {
    const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
    authModal.show();
  } else {
    window.location.href = "login.php";
  }
}

function isUserNotFoundMessage(message) {
  return typeof message === "string" && message.toLowerCase().includes("user not found");
}

// ==================== HEADERS ====================
function getHeaders() {
  const token = localStorage.getItem("userToken");
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// ==================== GLOBAL STATE ====================
let currentCartData = { items: [], subTotal: 0, couponCode: "" };

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
  // Pre-fill the coupon code input if one is stored
  const savedCoupon = localStorage.getItem("appliedCoupon");
  const couponInput = document.getElementById("couponCodeInput");
  if (savedCoupon && couponInput) {
    couponInput.value = savedCoupon;
  }

  initMainCart();
  loadOffcanvasCart();
});

// ==================== MAIN CART ====================
async function initMainCart(coupon = null) {
  try {
    const activeCoupon = coupon !== null ? coupon : (localStorage.getItem("appliedCoupon") || "");
    const res = await fetch(API.list, { 
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ couponCode: activeCoupon })
    });
    const data = await res.json();
    // Store the latest cart data globally
    currentCartData = data;

    const items = data.items || [];
    renderMainCart(items);
    setCartPageChromeVisible(items.length > 0);
    updateCartSummary(data);   // Update summary box
  } catch (err) {
    console.error("Main cart load error:", err);
  }
}

function renderMainCart(items) {
  const tbody = document.getElementById("cartTableBody");
  const countSpan = document.querySelector("#cartCount span");
  if (!tbody) return;

  tbody.innerHTML = "";
  countSpan.textContent = `(${items.length})`;

  items.forEach((item) => {
    const rowHTML = `
      <tr class="table-row" data-product-id="${item.productId}">
        <td>
          <div class="cart-box">
            <div class="cart-image">
              <a href="product.html?id=${item.productId}">
                <img src="${window.resolveApiMediaUrl(item.productImage || item.image)}" class="img-fluid" alt="${item.productName}">
              </a>
            </div>
            <div class="cart-contain">
              <a href="product.html?id=${item.productId}">
                <h3>${item.productName}</h3>
              </a>
            </div>
          </div>
        </td>
        <td>
          <div class="quantity-box qty-container quantity-box-2">
            <button class="btn qty-btn-minus" data-id="${item.productId}"><i class="ri-subtract-line"></i></button>
            <input type="number" disabled class="quantity form-control input-qty" value="${item.quantity}">
            <button class="btn qty-btn-plus" data-id="${item.productId}"><i class="ri-add-line"></i></button>
          </div>
        </td>
        <td>
          <button class="remove-row btn" data-id="${item.productId}">
            <i class="ri-delete-bin-7-line"></i>
          </button>
        </td>
        <td>
          <h4 class="h5 row-total">₹${item.total}</h4>
        </td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", rowHTML);
  });
}

// ==================== CART SUMMARY BOX ====================
function updateCartSummary(data) {
  const subTotalEl = document.querySelector(".summery-contain ul li:nth-child(1) .price");
  const couponDiscountEl = document.querySelector(".summery-contain ul li:nth-child(2) .price");
  const shippingEl = document.querySelector(".summery-contain ul li:nth-child(3) .price");
  const finalTotalEl = document.querySelector(".summery-total .price");

  if (subTotalEl) subTotalEl.textContent = `₹${(data.subTotal || 0).toFixed(2)}`;
  if (couponDiscountEl) couponDiscountEl.textContent = `(-) ₹${(data.discount || 0).toFixed(2)}`;
  
  // Shipping - assuming it's not coming from API yet, keeping static or set to 0
  if (shippingEl) shippingEl.textContent = "₹0.00";

  if (finalTotalEl) finalTotalEl.textContent = `₹${(data.finalTotal || data.subTotal || 0).toFixed(2)}`;
}

function safeNumber(n, fallback = 0) {
  const x = Number(n);
  return Number.isFinite(x) ? x : fallback;
}

function getCurrentCartItem(productId) {
  if (!currentCartData || !Array.isArray(currentCartData.items)) return null;
  const pid = String(productId);
  return currentCartData.items.find((it) => String(it.productId) === pid) || null;
}

function getUnitPriceFromItem(item) {
  if (!item) return 0;
  const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
  if (item.total != null && qty > 0) return safeNumber(item.total) / qty;
  if (item.price != null) return safeNumber(item.price);
  if (item.currentPrice != null) return safeNumber(item.currentPrice);
  return 0;
}

function optimisticallyUpdateQuantityUI(productId, action) {
  const productIdStr = String(productId);
  const safeAttrVal = productIdStr.replace(/"/g, "");
  const row = document.querySelector(`#cartTableBody .table-row[data-product-id="${safeAttrVal}"]`);
  const offcanvasItem = document.querySelector(`#offcanvasCartList .vertical-product-box[data-id="${safeAttrVal}"]`);

  const mainQtyInput = row?.querySelector(".input-qty");
  const mainRowTotalEl = row?.querySelector(".row-total");

  const offcanvasQtyInput = offcanvasItem?.querySelector(".input-qty");
  const offcanvasPriceEl = offcanvasItem?.querySelector(".product-content .price");

  const currentItem = getCurrentCartItem(productIdStr);

  // Prefer API data, fall back to DOM math
  const currentQty = safeNumber(mainQtyInput?.value, currentItem?.quantity) || 1;
  const unitPrice = getUnitPriceFromItem(currentItem) || (() => {
    if (mainRowTotalEl && mainRowTotalEl.textContent) {
      const rowTotal = safeNumber(mainRowTotalEl.textContent.replace(/[^\d.]/g, ""));
      return currentQty > 0 ? rowTotal / currentQty : 0;
    }
    return 0;
  })();

  const nextQty = action === "ADD" ? currentQty + 1 : Math.max(1, currentQty - 1);
  const nextTotal = unitPrice * nextQty;

  if (mainQtyInput) mainQtyInput.value = nextQty;
  if (mainRowTotalEl && unitPrice > 0) mainRowTotalEl.textContent = `₹${nextTotal.toFixed(2)}`;

  if (offcanvasQtyInput) offcanvasQtyInput.value = nextQty;
  if (offcanvasPriceEl && unitPrice > 0) offcanvasPriceEl.textContent = `₹${nextTotal.toFixed(2)}`;

  // Update global state (best effort) so subsequent UI uses correct numbers.
  if (currentItem) {
    currentItem.quantity = nextQty;
    currentItem.total = nextTotal;
  }

  // Recompute totals from UI/global state (best effort).
  const items = Array.isArray(currentCartData.items) ? currentCartData.items : [];
  let newSubTotal = items.reduce((sum, it) => sum + safeNumber(it.total), 0);
  if (!newSubTotal) {
    const domTotals = Array.from(document.querySelectorAll("#cartTableBody .row-total"))
      .map((el) => safeNumber(el.textContent.replace(/[^\d.]/g, "")))
      .filter((n) => Number.isFinite(n));
    newSubTotal = domTotals.reduce((sum, n) => sum + n, 0);
  }
  const newDiscount = safeNumber(currentCartData.discount, 0);
  const newFinalTotal = newSubTotal - newDiscount;
  currentCartData.subTotal = newSubTotal;
  currentCartData.finalTotal = newFinalTotal;
  currentCartData.discount = newDiscount;

  updateCartSummary({
    subTotal: newSubTotal,
    discount: newDiscount,
    finalTotal: newFinalTotal,
  });

  const countSpan = document.querySelector("#cartCount span");
  if (countSpan) {
    let itemCount = items.reduce((sum, it) => sum + Math.max(0, parseInt(it.quantity, 10) || 0), 0);
    if (!itemCount) {
      const qtyInputs = Array.from(document.querySelectorAll("#cartTableBody .input-qty"));
      itemCount = qtyInputs.reduce((sum, el) => sum + Math.max(0, parseInt(el.value, 10) || 0), 0);
    }
    countSpan.textContent = `(${itemCount})`;
  }

  const offcanvasSubtotal = document.getElementById("offcanvasSubtotal");
  if (offcanvasSubtotal && unitPrice >= 0) {
    offcanvasSubtotal.textContent = `₹${newSubTotal.toFixed(2)}`;
  }
}

// ==================== CORE FUNCTIONS ====================
async function updateQuantity(productId, action) {
  try {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
      // Guest cart: backend auth may reject the request; still update UI immediately.
      optimisticallyUpdateQuantityUI(productId, action);
      return;
    }

    const headers = getHeaders();
    const res = await fetch(API.updateQuantity, {
      method: "POST",
      headers,
      body: JSON.stringify({ productId, action })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.success === false) {
      console.error("Quantity update rejected:", data);
      // Best-effort fallback (so the user sees the click take effect).
      optimisticallyUpdateQuantityUI(productId, action);
      Swal.fire("Error", data.message || data.title || "Failed to update quantity", "error");
      return;
    }
    await refreshAllCarts();
  } catch (err) {
    console.error("Quantity update failed:", err);
    optimisticallyUpdateQuantityUI(productId, action);
    Swal.fire("Error", "Failed to update quantity", "error");
  }
}

async function removeCartItem(productId) {
  const result = await Swal.fire({
    title: "Remove item?",
    text: "This product will be removed from your cart.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, remove it"
  });

  if (!result.isConfirmed) return;

  try {
    const headers = getHeaders();
    const res = await fetch(API.remove, {
      method: "DELETE",
      headers,
      body: JSON.stringify({ productId })
    });

    if (res.ok) {
      // Clear the coupon code locally if the entire cart is cleared
      localStorage.removeItem("appliedCoupon");
      
      Swal.fire({
        icon: "success",
        title: "Item removed!",
        timer: 1200,
        showConfirmButton: false
      });
      await refreshAllCarts();
    } else {
      Swal.fire("Failed", "Unable to remove item", "error");
    }
  } catch (err) {
    Swal.fire("Error", "Something went wrong", "error");
  }
}

async function clearCart() {
  const result = await Swal.fire({
    title: "Clear entire cart?",
    text: "All items will be removed.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, clear it"
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(API.clear, {
      method: "DELETE",
      headers: getHeaders()
    });

    if (res.ok) {
      Swal.fire({
        icon: "success",
        title: "Cart Cleared!",
        timer: 1500,
        showConfirmButton: false
      });
      await refreshAllCarts();
    }
  } catch (err) {
    Swal.fire("Error", "Something went wrong", "error");
  }
}

async function refreshAllCarts() {
  await initMainCart();        // This will also update summary
  await loadOffcanvasCart();
}

// ==================== COUPON CODE LOGIC (NEW) ====================
async function applyCoupon() {
  const couponInput = document.getElementById("couponCodeInput");
  const couponCode = couponInput.value.trim();

  if (!couponCode) {
    Swal.fire("Error", "Please enter a coupon code.", "error");
    return;
  }

  if (!currentCartData || currentCartData.items.length === 0) {
    Swal.fire("Error", "Your cart is empty. Add items before applying a coupon.", "error");
    return;
  }

  // API 1: Validate Coupon
  try {
    const applyPayload = {
      couponCode: couponCode,
      cartAmount: currentCartData.subTotal,
      productIds: currentCartData.items.map(item => item.productId)
    };

    const applyRes = await fetch(API.applyCoupon, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(applyPayload)
    });

    const applyData = await applyRes.json();

    if (!applyData.success) {
      throw new Error(applyData.message || "Invalid or expired coupon code.");
    }

    // API 2: If validation is successful, save it locally and refresh the cart
    localStorage.setItem("appliedCoupon", couponCode);
    await initMainCart(couponCode);
    Swal.fire("Success!", "Coupon applied successfully.", "success");

  } catch (err) {
    Swal.fire("Error", err.message, "error");
  }
}



// offcanvas checkout code ********************************************

// ==================== PROCEED TO CHECKOUT ====================
async function proceedToCheckout() {
  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
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
          openLoginModal();
        }
      });
    } else {
      alert("Login Required. Please login.");
    }
    return;
  }

  const currentItems = Array.isArray(currentCartData.items) ? currentCartData.items : [];
  if (currentItems.length === 0) {
    if (typeof Swal !== "undefined") {
      Swal.fire("Cart is empty", "Please select item.", "warning");
    } else {
      alert("Please select item.");
    }
    return;
  }

  const zeroItems = currentItems.filter(isCartItemZeroPriced);
  if (zeroItems.length > 0) {
    if (typeof Swal !== "undefined") {
      Swal.fire(
        "Invalid price",
        "One or more items in your cart have no valid price (₹0). Remove them or contact support before checkout.",
        "warning"
      );
    } else {
      alert("Cannot checkout: cart contains items with zero price.");
    }
    return;
  }

  const currentCoupon = localStorage.getItem("appliedCoupon") || "";
  const payload = { couponCode: currentCoupon };

  try {
    const response = await fetch(`${CART_API_ROOT}/api/orders/checkout`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("Checkout API Response:", data);

    if (response.ok && data.success === true) {
      // Pass data to checkout.php via URL
      const encodedData = encodeURIComponent(JSON.stringify(data));
      window.location.href = `checkout.php?checkoutData=${encodedData}`;
    } else {
      if (isUserNotFoundMessage(data.message)) {
        localStorage.removeItem("userToken");
        Swal.fire("Please login", "User not found. Please login.", "warning").then(() => {
          openLoginModal();
        });
        return;
      }
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


// offcanvas checkout code end  ********************************************

// ==================== OFFCANVAS CART ====================
async function loadOffcanvasCart() {
  try {
    const activeCoupon = localStorage.getItem("appliedCoupon") || "";
    const res = await fetch(API.list, { 
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ couponCode: activeCoupon })
    });
    const data = await res.json();
    const items = data.items || [];
    renderOffcanvasCart(items);
  } catch (err) {
    console.error("Offcanvas cart load error:", err);
  }
}

function renderOffcanvasCart(items) {
  const list = document.getElementById("offcanvasCartList");
  const subtotalEl = document.getElementById("offcanvasSubtotal");
  const countEl = document.getElementById("cartCount");

  if (!list) return;

  list.innerHTML = "";
  let subtotal = 0;

  items.forEach(item => {
    const itemTotal = item.total || item.currentPrice || (item.price * item.quantity);
    subtotal += itemTotal;

    const li = `
      <li class="vertical-product-box" data-id="${item.productId}" data-unit-price="${item.price || item.currentPrice}">
        <a href="product.html?id=${item.productId}" class="product-image">
          <img src="${window.resolveApiMediaUrl(item.productImage || item.image)}" class="img-fluid" alt="${item.productName}">
        </a>
        
        <div class="product-content">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="name">${item.productName}</h5>
            
            <!-- DELETE ICON - Top Right -->
            <button class="btn btn-trash remove-item" data-id="${item.productId}" style="color: #dc3545; font-size: 18px; padding: 4px;">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
          
          <h5 class="price">₹${itemTotal}</h5>

          <div class="quantity-box qty-container d-flex align-items-center gap-2 mt-2">
            <button class="btn qty-btn-minus" data-id="${item.productId}">
              <i class="ri-subtract-line"></i>
            </button>

            <input type="number" disabled 
                   class="quantity form-control input-qty text-center" 
                   value="${item.quantity}" 
                   style="width: 20px;">

            <button class="btn qty-btn-plus" data-id="${item.productId}">
              <i class="ri-add-line"></i>
            </button>
          </div>
        </div>
      </li>
    `;

    list.insertAdjacentHTML("beforeend", li);
  });

  subtotalEl.textContent = "₹" + subtotal.toFixed(2);
  if (countEl) countEl.textContent = items.length;
  setOffcanvasCartFooterVisible(items.length > 0);
}

// ==================== GLOBAL CLICK HANDLER ====================
document.addEventListener("click", async (e) => {
  const plusBtn = e.target.closest(".qty-btn-plus");
  const minusBtn = e.target.closest(".qty-btn-minus");
  const trashBtn = e.target.closest(".btn-trash");
  const removeRowBtn = e.target.closest(".remove-row");

  if (plusBtn || minusBtn) {
    e.preventDefault();
    e.stopPropagation();
    const btn = plusBtn || minusBtn;
    const productId = btn.dataset.id;
    const action = plusBtn ? "ADD" : "REMOVE";
    await updateQuantity(productId, action);
    return;
  }

  if (trashBtn) {
    const productId = trashBtn.dataset.id;
    await removeCartItem(productId);
    return;
  }

  if (removeRowBtn) {
    const productId = removeRowBtn.dataset.id;
    await removeCartItem(productId);
    return;
  }

  if (e.target.closest(".clear-btn")) {
    await clearCart();
  }

  // APPLY COUPON BUTTON (NEW)
  if (e.target.closest("#applyCouponBtn")) {
    e.preventDefault();
    await applyCoupon();
  }

  // PROCEED TO CHECKOUT BUTTON
  if (e.target.closest("#proceedToCheckoutBtn")) {
    e.preventDefault();
    await proceedToCheckout();
  }

  // CHECK OUT BUTTON (from offcanvas)
  if (e.target.closest(".check-out-button")) {
    e.preventDefault();
    await proceedToCheckout();
  }
});



