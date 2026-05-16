<?php include 'header.php'; ?>
<?php $orderId = $_GET['id'] ?? ''; ?>


<div class="container-fluid ">
    <div class="row">
        <div class="col-12">
            <div class="d-flex justify-content-between align-items-center py-2">
                <h4>Orders Details</h4>


                <ol class="breadcrumb d-lg-flex d-none mb-0">
                    <li class="breadcrumb-item"><a href="index">Home</a></li>
                    <li class="breadcrumb-item"><a href="order">Order</a></li>

                    <li class="breadcrumb-item"><a href="">Orders Details</a></li>
                </ol>
            </div>
        </div>
    </div>

    <!-- Heading -->
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 id="orderHeading">Order ID - #<?php echo $orderId; ?></h4>
        <a href="order.php" class="btn btn-secondary">← Back to Orders</a>
    </div>

    <div class="row g-3">

        <!-- Box 1: Order Details -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm" >
                <h5 class="mb-3">Order Details</h5>
                <div id="orderDetails">Loading order...</div>
            </div>
        </div>

        <!-- Box 2: Delivery Address -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Delivery Address</h5>
                <div id="deliveryAddress">Loading address...</div>
            </div>
        </div>

        <!-- Box 3: Customer Details -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Customer Details</h5>
                <div id="customerDetails">Loading customer...</div>
            </div>
        </div>

        <!-- Box 4: Status Update + History -->
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Update Order Status</h5>

                <!--
                    Values MUST match the backend enum in BusinessLayer/DataBaseLayer
                    (PLACED, CONFIRMED, SHIPPED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED).
                    Labels below are just the human-friendly text.
                -->
                <select id="statusSelect" class="form-select mb-2">
                    <option value="">Select Status</option>
                    <option value="PLACED">Placed</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                <button id="statusUpdateBtn" class="btn btn-primary mb-2" type="button">Update</button>
                <div id="statusUpdateMessage" class="small mb-3"></div>

                <h6>Status History</h6>
                <div id="statusHistory" class="small text-muted">Loading...</div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Order Items</h5>
                <div id="orderItems"></div>
            </div>
        </div>

    </div>
</div>


<style>

    .card{
        height: 100%;
    }
</style>


<script>
(function () {
    const ORDER_BASE_URL = "https://api.workarya.com";
    const currentOrderId = "<?php echo $orderId; ?>";
    const normalizedOrderId = (currentOrderId || "").trim().toLowerCase();
    const orderDetailsEl = document.getElementById("orderDetails");
    const deliveryAddressEl = document.getElementById("deliveryAddress");
    const customerDetailsEl = document.getElementById("customerDetails");
    const orderItemsEl = document.getElementById("orderItems");

    function showState(message) {
        orderDetailsEl.innerHTML = message;
        deliveryAddressEl.innerHTML = message;
        customerDetailsEl.innerHTML = message;
        orderItemsEl.innerHTML = message;
    }

    function renderOrder(order) {
        const a = order.address || {};
        const addressName = a.fullName || a.FullName || a.name || a.Name || "";
        const addressPhone = a.phoneNumber || a.PhoneNumber || a.phone || a.Phone || "";
        const addressPincode = a.postalCode || a.PostalCode || a.pincode || a.Pincode || "";

        document.getElementById("orderHeading").innerText = "Order Detail - " + (order.orderId || order.id || "-");
        orderDetailsEl.innerHTML = `
      <p><strong>Order ID:</strong> ${order.orderId || order.id || "-"}</p>
      <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Order Status:</strong> ${order.orderStatus || "-"}</p>
      <p><strong>Payment Status:</strong> ${order.paymentStatus || "-"}</p>
      <p><strong>Order Total:</strong> ₹${order.totalAmount ?? order.total ?? 0}</p>`;

        deliveryAddressEl.innerHTML = `
      <p><strong>Name:</strong> ${addressName}</p>
      <p><strong>Mobile:</strong> ${addressPhone}</p>
      <p><strong>Address:</strong> ${a.addressLine1 || ""} ${a.addressLine2 || ""}</p>
      <p><strong>City:</strong> ${a.city || ""}</p>
      <p><strong>State:</strong> ${a.state || ""}</p>
      <p><strong>Post Code:</strong> ${addressPincode}</p>`;

        customerDetailsEl.innerHTML = `
      <p><strong>Name:</strong> ${addressName}</p>
      <p><strong>Mobile:</strong> ${addressPhone}</p>
      <p><strong>City:</strong> ${a.city || ""}</p>
      <p><strong>State:</strong> ${a.state || ""}</p>`;

        const itemsHtml = (order.items || []).map((it) => `
            <div class="border rounded p-2 mb-2 d-flex gap-2">
                <img src="${window.resolveApiMediaUrl ? window.resolveApiMediaUrl(it.productImage || it.image) : (ORDER_BASE_URL + (it.productImage || ""))}"
                    width="60" height="60" style="object-fit:cover;border-radius:6px"/>
                <div>
                    <p class="m-0"><strong>${it.productName || "-"}</strong></p>
                    <p class="m-0">Qty: ${it.quantity || 0}</p>
                    <p class="m-0">Price: ₹${it.price || 0}</p>
                </div>
            </div>`).join("");

        orderItemsEl.innerHTML = itemsHtml || "No items";
    }

    async function loadOrderDetail() {
        try {
            const token = localStorage.getItem("superadminToken");
            if (!token) {
                showState("Login required");
                return;
            }

            const res = await fetch(`${ORDER_BASE_URL}/api/orders/my-orders`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) {
                showState("Failed to load order");
                return;
            }

            const result = await res.json();
            const orders = result?.data?.data || result?.data || result?.orders || [];
            const order = orders.find((x) => ((x.orderId || x.id || "").trim().toLowerCase()) === normalizedOrderId);

            if (!order) {
                showState("Order not found");
                return;
            }

            renderOrder(order);

            // Pre-select the current status so the dropdown reflects reality on load.
            const currentStatus = (order.orderStatus || "").toUpperCase();
            const select = document.getElementById("statusSelect");
            if (select && currentStatus) {
                const opt = Array.from(select.options).find(o => o.value === currentStatus);
                if (opt) select.value = currentStatus;
            }

            // DELIVERED / CANCELLED are terminal states in the backend — lock the UI
            // so admins don't submit a request the API will just reject.
            if (currentStatus === "DELIVERED" || currentStatus === "CANCELLED") {
                const btn = document.getElementById("statusUpdateBtn");
                if (btn) btn.disabled = true;
                if (select) select.disabled = true;
                const msg = document.getElementById("statusUpdateMessage");
                if (msg) {
                    msg.textContent = `Order is ${currentStatus.toLowerCase()} — status can't be changed further.`;
                    msg.className = "small mb-3 text-muted";
                }
            }

            await loadStatusHistory();
        } catch (error) {
            console.error("Superadmin order detail error:", error);
            showState("Unable to load order details");
        }
    }

    // =================================================================
    // Status history + update (calls the already-built backend API)
    // -----------------------------------------------------------------
    //   POST /api/orders/update-order-status  body: { OrderId, Status }
    //   GET  /api/orders/track-order/{orderId}
    // =================================================================

    function statusBadgeClass(status) {
        const s = (status || "").toUpperCase();
        if (s === "DELIVERED") return "badge bg-success";
        if (s === "CANCELLED") return "badge bg-danger";
        if (s === "SHIPPED" || s === "OUT_FOR_DELIVERY") return "badge bg-info text-dark";
        if (s === "CONFIRMED") return "badge bg-primary";
        return "badge bg-secondary";
    }

    function formatStatusLabel(status) {
        if (!status) return "";
        return String(status)
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    async function loadStatusHistory() {
        const historyEl = document.getElementById("statusHistory");
        if (!historyEl) return;

        try {
            const token = localStorage.getItem("superadminToken");
            const res = await fetch(`${ORDER_BASE_URL}/api/orders/track-order/${encodeURIComponent(currentOrderId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const raw = await res.json();
            if (!res.ok || raw?.success === false) {
                historyEl.innerHTML = `<div class="text-muted">${raw?.message || "Could not load history"}</div>`;
                return;
            }

            // Backend returns PascalCase; some proxies lowercase the keys — accept both.
            const tracking = raw?.tracking || raw?.Tracking || [];

            if (!tracking.length) {
                historyEl.innerHTML = `<div class="text-muted">No status updates yet.</div>`;
                return;
            }

            historyEl.innerHTML = tracking.map(item => {
                const s = item.Status || item.status || "";
                const t = item.Time || item.time || item.CreatedAt || "";
                const when = t ? new Date(t).toLocaleString() : "";
                return `
                    <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                        <span class="${statusBadgeClass(s)}">${formatStatusLabel(s)}</span>
                        <span class="text-muted ms-2">${when}</span>
                    </div>`;
            }).join("");
        } catch (err) {
            console.error("[status-history] failed", err);
            historyEl.innerHTML = `<div class="text-danger">Could not load history</div>`;
        }
    }

    async function updateOrderStatus() {
        const select = document.getElementById("statusSelect");
        const btn = document.getElementById("statusUpdateBtn");
        const msg = document.getElementById("statusUpdateMessage");
        if (!select || !btn) return;

        const status = select.value;
        if (!status) {
            msg.textContent = "Please choose a status.";
            msg.className = "small mb-3 text-danger";
            return;
        }

        const token = localStorage.getItem("superadminToken");
        if (!token) {
            msg.textContent = "Session expired. Please log in again.";
            msg.className = "small mb-3 text-danger";
            return;
        }

        btn.disabled = true;
        msg.textContent = "Updating...";
        msg.className = "small mb-3 text-muted";

        try {
            const res = await fetch(`${ORDER_BASE_URL}/api/orders/update-order-status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                // Match backend DTO casing (OrderId / Status). UpdatedByEmail is set
                // server-side from the JWT so we don't send it here.
                body: JSON.stringify({ OrderId: currentOrderId, Status: status })
            });

            let data = {};
            try { data = await res.json(); } catch (_) {}

            if (!res.ok || data?.success === false) {
                msg.textContent = data?.message || `Update failed (HTTP ${res.status}).`;
                msg.className = "small mb-3 text-danger";
                return;
            }

            msg.textContent = data?.message || "Status updated.";
            msg.className = "small mb-3 text-success";

            // Reflect the new status in the left-side Order Details block and refresh
            // the history table without requiring a full page reload.
            const orderStatusP = Array.from(orderDetailsEl.querySelectorAll("p"))
                .find(p => /order status/i.test(p.textContent || ""));
            if (orderStatusP) {
                orderStatusP.innerHTML = `<strong>Order Status:</strong> ${formatStatusLabel(status)}`;
            }

            if (status === "DELIVERED" || status === "CANCELLED") {
                btn.disabled = true;
                select.disabled = true;
            }

            await loadStatusHistory();
        } catch (err) {
            console.error("[update-status] failed", err);
            msg.textContent = "Network error. Please try again.";
            msg.className = "small mb-3 text-danger";
        } finally {
            // Re-enable only if not terminal
            const finalStatus = select.value;
            if (finalStatus !== "DELIVERED" && finalStatus !== "CANCELLED") {
                btn.disabled = false;
            }
        }
    }

    document.getElementById("statusUpdateBtn")?.addEventListener("click", updateOrderStatus);

    loadOrderDetail();
})();
</script>