// =============================================== PLACE ORDER LOGIC ===============================================

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

function getUserEmailForOrder() {
  try {
    const fromStorage = JSON.parse(localStorage.getItem("userData") || "{}");
    if (fromStorage && typeof fromStorage.email === "string" && fromStorage.email.trim()) {
      return fromStorage.email.trim();
    }
  } catch (_) {}

  try {
    const token = localStorage.getItem("userToken");
    if (!token) return "";
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window.atob(base64).split("").map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join("")
    );
    const payload = JSON.parse(jsonPayload);
    return (payload.email || payload.sub || "").trim();
  } catch (_) {
    return "";
  }
}

function isCheckoutCartItemZeroPriced(item) {
  const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
  const total = Number(item.total);
  const unit =
    item.price != null ? Number(item.price)
    : item.currentPrice != null ? Number(item.currentPrice)
    : Number.isFinite(total) ? total / qty
    : NaN;
  return !Number.isFinite(unit) || unit <= 0;
}

async function postPaymentClientEvent(payload) {
  try {
    const userToken = localStorage.getItem("userToken");
    if (!userToken) return;
    await fetch("https://api.workarya.com/api/orders/payment-client-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify(
        Object.assign(
          {
            eventType: "CLIENT_CHECKOUT",
            userAgent: navigator.userAgent || "",
          },
          payload || {}
        )
      ),
    });
  } catch (_) {
    /* non-blocking */
  }
}

function wireCheckoutOfflineLogger() {
  if (!document.getElementById("placeOrderBtn")) return;
  window.addEventListener("offline", function () {
    if (!window.__checkoutPaymentActive) return;
    const ctx = window.__checkoutPaymentCtx || {};
    postPaymentClientEvent({
      eventType: "OFFLINE_DURING_PAYMENT",
      orderId: ctx.orderId || "",
      razorpayOrderId: ctx.razorpayOrderId || "",
      note: "Browser reported offline during Razorpay/checkout",
    });
  });
}

document.addEventListener("DOMContentLoaded", wireCheckoutOfflineLogger);

document.addEventListener("DOMContentLoaded", function () {
  const placeOrderBtn = document.getElementById("placeOrderBtn");

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", async function () {
      const userToken = localStorage.getItem("userToken");
      if (!userToken) {
        Swal.fire({ title: "Login Required", text: "Please login to place your order", icon: "warning" });
        return;
      }

      // 1. Selected Address
      const selectedAddressRadio = document.querySelector('input[name="selectedAddressRadio"]:checked');
      if (!selectedAddressRadio) {
        Swal.fire({ title: "Address Required", text: "Please select a delivery address", icon: "error" });
        return;
      }

      let addressId = selectedAddressRadio.value || selectedAddressRadio.getAttribute("data-address-id");
      if (!addressId || addressId === "on") {
        Swal.fire("Error", "Please select a valid address", "error");
        return;
      }

      // 2. Selected Payment Method
      const selectedPaymentRadio = document.querySelector('input[name="paymentMethod"]:checked');
      if (!selectedPaymentRadio) {
        Swal.fire({ title: "Payment Method Required", text: "Please select COD or Razorpay", icon: "error" });
        return;
      }

      const paymentMethod = selectedPaymentRadio.id === "cod" ? "COD" : "RAZORPAY";

      // 3. Get Checkout Data
      const urlParams = new URLSearchParams(window.location.search);
      const checkoutDataStr = urlParams.get("checkoutData");

      if (!checkoutDataStr) {
        Swal.fire({ title: "Error", text: "Checkout data not found.", icon: "error" });
        return;
      }

      let checkoutData;
      try {
        checkoutData = JSON.parse(decodeURIComponent(checkoutDataStr));
      } catch (e) {
        Swal.fire("Error", "Invalid checkout data", "error");
        return;
      }

      const cartItems = Array.isArray(checkoutData.cartItems) ? checkoutData.cartItems : [];
      if (cartItems.length === 0) {
        Swal.fire({ title: "Cart is empty", text: "Please select item.", icon: "warning" });
        return;
      }

      if (cartItems.some(isCheckoutCartItemZeroPriced)) {
        Swal.fire({
          title: "Invalid price",
          text: "One or more items have no valid price (₹0). Remove them before placing the order.",
          icon: "warning",
        });
        return;
      }

      // 4. Build Items Array
      const itemsArray = cartItems.map((item) => ({
        productId: item.productId,
        quantity: parseInt(item.quantity) || 1,
      }));

      if (itemsArray.length === 0) {
        Swal.fire({ title: "Cart is empty", text: "Please select item.", icon: "warning" });
        return;
      }

      // 5. Final Order Payload
      const userEmail = getUserEmailForOrder();
      const orderPayload = {
        addressId: addressId,
        paymentMethod: paymentMethod,
        couponCode: checkoutData.couponCode || null,
        email: userEmail || null,
        items: itemsArray,
      };

      console.log("✅ Final Order Payload:", orderPayload);

      // Button Loading State
      const originalText = placeOrderBtn.innerHTML;
      placeOrderBtn.disabled = true;
      placeOrderBtn.innerHTML = `Placing Order... <span class="spinner-border spinner-border-sm"></span>`;

      try {
        const response = await fetch("https://api.workarya.com/api/orders/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
          body: JSON.stringify(orderPayload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to create order");
        }

        // ==================== SUCCESS ====================
        if (paymentMethod === "RAZORPAY") {
          if (typeof window.Razorpay === "undefined") {
            Swal.fire("Error", "Razorpay script not loaded. Please refresh.", "error");
            resetButton();
            return;
          }

          if (!result.razorpayOrderId) {
            Swal.fire("Error", "Razorpay Order ID not received from server.", "error");
            resetButton();
            return;
          }

          const options = {
            key: "rzp_test_vMtcxwl3LM65wN",
            amount: result.amount || Math.round((checkoutData.finalAmount || 0) * 100),
            currency: "INR",
            name: "E-Commerce Multivendor",
            description: "Order Payment",
            order_id: result.razorpayOrderId,           // ← Important: Using razorpayOrderId from backend
            handler: async function (response) {
              window.__checkoutPaymentActive = false;
              window.__checkoutPaymentCtx = null;
              // Payment successful → Verify with backend
              await verifyRazorpayPayment(response, result.orderId || result._id, userToken);
            },
            modal: {
              ondismiss: function () {
                window.__checkoutPaymentActive = false;
                window.__checkoutPaymentCtx = null;
                resetButton();
              }
            },
            prefill: {
              email: checkoutData.email || "",
              contact: checkoutData.phone || ""
            },
            theme: {
              color: "#4a4fea"
            },
            method: {
              card: true,
              netbanking: true,
              wallet: true,
              upi: true,
              emi: true,
            },
          };

          const rzp = new window.Razorpay(options);

          rzp.on('payment.failed', function (response) {
            window.__checkoutPaymentActive = false;
            window.__checkoutPaymentCtx = null;
            Swal.fire("Payment Failed", response.error.description || "Payment failed", "error");
            resetButton();
          });

          window.__checkoutPaymentCtx = {
            orderId: String(result.orderId || result.OrderId || result._id || ""),
            razorpayOrderId: result.razorpayOrderId || "",
          };
          window.__checkoutPaymentActive = true;
          rzp.open();

        } else {
          // COD Success
          handleOrderSuccess();
        }

      } catch (error) {
        console.error("Order Error:", error);
        if (isUserNotFoundMessage(error.message)) {
          localStorage.removeItem("userToken");
          Swal.fire({
            title: "Please login",
            text: "User not found. Please login.",
            icon: "warning",
          }).then(() => {
            openLoginModal();
          });
          return;
        }
        Swal.fire({
          title: "Order Failed",
          text: error.message || "Something went wrong while placing order",
          icon: "error",
        });
      } finally {
        if (paymentMethod !== "RAZORPAY") {
          resetButton();
        }
      }

      // Helper function to reset button
      function resetButton() {
        window.__checkoutPaymentActive = false;
        window.__checkoutPaymentCtx = null;
        placeOrderBtn.disabled = false;
        placeOrderBtn.innerHTML = originalText;
      }
    });
  }

  loadSavedAddresses();
});

// ====================== VERIFY RAZORPAY PAYMENT ======================
async function verifyRazorpayPayment(paymentResponse, orderId, userToken) {
  try {
    const userEmail = getUserEmailForOrder();
    const verifyPayload = {
      razorpayOrderId: paymentResponse.razorpay_order_id,
      razorpayPaymentId: paymentResponse.razorpay_payment_id,
      razorpaySignature: paymentResponse.razorpay_signature,
      orderId: orderId,
      email: userEmail || null,
    };

    const response = await fetch("https://api.workarya.com/api/orders/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
      body: JSON.stringify(verifyPayload),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      localStorage.removeItem("checkoutData");
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("couponDiscount");

      Swal.fire({
        title: "🎉 Payment Successful!",
        text: "Your order has been placed successfully.",
        icon: "success",
        confirmButtonText: "View My Orders",
      }).then(() => {
        window.location.href = "order-success.php";
      });
    } else {
      if (isUserNotFoundMessage(result.message)) {
        localStorage.removeItem("userToken");
        Swal.fire("Please login", "User not found. Please login.", "warning").then(() => {
          openLoginModal();
        });
        return;
      }
      Swal.fire("Verification Failed", result.message || "Payment verification failed", "error");
    }
  } catch (err) {
    console.error("Payment Verification Error:", err);
    postPaymentClientEvent({
      eventType: "PAYMENT_VERIFY_CLIENT_ERROR",
      note: err && err.message ? String(err.message) : "verifyRazorpayPayment threw",
    });
    Swal.fire("Error", "Payment verification failed. Please contact support.", "error");
  }
}

// ====================== COD SUCCESS HANDLER ======================
function handleOrderSuccess() {
  localStorage.removeItem("checkoutData");
  localStorage.removeItem("appliedCoupon");
  localStorage.removeItem("couponDiscount");

  Swal.fire({
    title: "🎉 Order Placed Successfully!",
    text: "Thank you for your purchase.",
    icon: "success",
    confirmButtonText: "View My Orders",
  }).then(() => {
    window.location.href = "order-success.php";
  });
}

// ====================== LOAD SAVED ADDRESSES ======================
async function loadSavedAddresses() {
  const container = document.getElementById("addressListContainer");
  const loadingEl = document.getElementById("addressLoading");

  if (!container) return;

  const userToken = localStorage.getItem("userToken");
  if (!userToken) {
    container.innerHTML = `<p class="text-danger text-center py-3">Please login to view addresses.</p>`;
    return;
  }

  try {
    if (loadingEl) loadingEl.style.display = "block";

    const response = await fetch("https://api.workarya.com/api/address/list", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userToken,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch addresses");

    const addresses = await response.json();

    if (loadingEl) loadingEl.style.display = "none";

    if (!addresses || addresses.length === 0) {
      container.innerHTML = `<p class="text-muted text-center py-4">No saved addresses found.</p>`;
      return;
    }

    let html = "";
    addresses.forEach((addr, index) => {
      const collapseId = `savedAddr${index}`;
      const radioId = `addressRadio${index}`;
      const isFirst = index === 0;
      const actualId = addr._id || addr.id;

      const fullAddress = [addr.addressLine1, addr.addressLine2].filter(Boolean).join(", ");

      html += `
<div class="accordion-item mb-3">
    <h2 class="accordion-header" id="heading${actualId}">
        <button class="accordion-button ${isFirst ? "" : "collapsed"} d-flex align-items-center gap-2" 
                type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
            <input class="form-check-input" name="selectedAddressRadio" type="radio" 
                   id="${radioId}" value="${actualId}" data-address-id="${actualId}" 
                   ${isFirst ? "checked" : ""}>
            <label class="form-check-label m-0" for="${radioId}">
                ${addr.addressType || "Home"}
            </label>
        </button>
    </h2>
    <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? "show" : ""}" 
         data-bs-parent="#savedAddressAccordion">
        <div class="accordion-body">
            <h5 class="fw-bold mb-2">${addr.fullName}</h5>
            <p class="mb-1">${fullAddress}</p>
            <p class="mb-1">${addr.city}, ${addr.state} - ${addr.postalCode}</p>
            <p class="mb-0">📞 ${addr.phoneNumber}</p>
        </div>
    </div>
</div>`;
    });

    container.innerHTML = html;
  } catch (error) {
    console.error("Error loading addresses:", error);
    if (loadingEl) loadingEl.style.display = "none";
    container.innerHTML = `<p class="text-danger text-center py-4">Failed to load addresses. Please try again.</p>`;
  }
}
