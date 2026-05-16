// ==================== PROCEED TO CHECKOUT LOGIC ====================
// ==================== PROCEED TO CHECKOUT LOGIC ====================
const CHECKOUT_API_ROOT = window.BASE || "https://api.workarya.com";

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

async function getCartCheckoutBarrier() {
  try {
    const res = await fetch(`${CHECKOUT_API_ROOT}/api/cart/list`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ couponCode: localStorage.getItem("appliedCoupon") || "" })
    });

    const data = await res.json().catch(() => ({}));
    const items = Array.isArray(data.items) ? data.items : [];
    if (!items.length) return "empty";
    if (items.some(isCartItemZeroPriced)) return "zero";
    return "ok";
  } catch (err) {
    console.error("Cart check error:", err);
    return "error";
  }
}

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
          openLoginModal();
        }
      });
    } else {
      alert("Login Required. Please login.");
    }
    return;
  }

  const barrier = await getCartCheckoutBarrier();
  if (barrier !== "ok") {
    if (typeof Swal !== "undefined") {
      if (barrier === "zero") {
        Swal.fire(
          "Invalid price",
          "Your cart contains items with no valid price (₹0). Remove them before checkout.",
          "warning"
        );
      } else if (barrier === "empty") {
        Swal.fire("Cart is empty", "Please select item.", "warning");
      } else {
        Swal.fire("Error", "Could not verify your cart. Try again.", "error");
      }
    } else {
      alert(barrier === "zero" ? "Cannot checkout: zero-priced items in cart." : "Please select item.");
    }
    return;
  }

  const currentCoupon = localStorage.getItem("appliedCoupon") || "";
  const payload = { couponCode: currentCoupon };

  const proceedBtn = document.getElementById("proceedToCheckoutBtn");
  if (proceedBtn) {
    proceedBtn.disabled = true;
    proceedBtn.innerText = "Processing...";
  }

  try {
    const res = await fetch(`${CHECKOUT_API_ROOT}/api/orders/checkout`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log("Checkout API Response:", data);

    if (res.ok && data.success === true) {

      // Show full response in alert
      // alert("✅ Checkout API Full Response:\n\n" + JSON.stringify(data, null, 2));

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
    alert("Something went wrong. Please try again later.");
  } finally {
    if (proceedBtn) {
      proceedBtn.disabled = false;
      proceedBtn.innerText = "Proceed to checkout";
    }
  }
}

// ================================================
// YOUR ORDER / CHECKOUT PAGE LOGIC
// ================================================



// ================================================
// CHECKOUT PAGE - YOUR ORDER SECTION
// ================================================

document.addEventListener("DOMContentLoaded", function () {
  
  const urlParams = new URLSearchParams(window.location.search);
  const checkoutDataStr = urlParams.get("checkoutData");

  if (!checkoutDataStr) {
    console.warn("No checkout data found in URL!");
    return;
  }

  try {
    const data = JSON.parse(decodeURIComponent(checkoutDataStr));
    renderCheckoutProducts(data);
  } catch (e) {
    console.error("Error parsing checkout data:", e);
  }
});

function renderCheckoutProducts(data) {
  const tbody = document.getElementById("checkoutProduct");
  
  if (!tbody) {
    console.error("❌ checkoutProduct tbody not found!");
    return;
  }

  let html = '';
  const cartItems = Array.isArray(data.cartItems) ? data.cartItems : [];

  if (cartItems.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="2" class="text-center py-3">Please select item.</td>
      </tr>
    `;
    return;
  }

  // Render Products with Clickable Link
  cartItems.forEach(item => {
    const price = parseFloat(item.price) || 0;
    
    html += `
      <tr>
        <td>
          <div class="checkout-product-box">
            <a href="product-detail.php?id=${item.productId}" class="product-image">
              <img src="${window.resolveApiMediaUrl(item.image || item.productImage)}" class="img-fluid" alt="${item.productName}">
            </a>
            <div class="product-contain">
              <a href="product-detail.php?id=${item.productId}">
                <h5>${item.productName} <span>x${item.quantity}</span></h5>
              </a>
            </div>
          </div>
        </td>
        <td>₹${price.toLocaleString('en-IN')}</td>
      </tr>
    `;
  });

  // Price Summary
  const subtotal = parseFloat(data.totalAmount) || 0;
  const discount = parseFloat(data.discount) || 0;
  const finalAmount = parseFloat(data.finalAmount) || subtotal;

  html += `
    <tr class="price-tb">
      <td>Subtotal</td>
      <td id="subtotalAmount">₹${subtotal.toLocaleString('en-IN')}</td>
    </tr>
  `;

  if (discount > 0) {
    html += `
      <tr class="price-tb">
        <td>Discount ${data.couponCode ? `(${data.couponCode})` : ''}</td>
        <td id="discountAmount">-₹${discount.toLocaleString('en-IN')}</td>
      </tr>
    `;
  }

  html += `
    <tr class="price-tb">
      <td><strong>Total</strong></td>
      <td id="totalAmount"><strong>₹${finalAmount.toLocaleString('en-IN')}</strong></td>
    </tr>
  `;

  tbody.innerHTML = html;
  console.log("✅ Checkout table rendered successfully!");
}
