<?php include 'header.php'; ?>

<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Invoice</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="order.php">Orders</a></li>
                        <li class="breadcrumb-item active">Invoice</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body" id="invoiceBody">

                        <!-- Loading state -->
                        <div id="invoiceLoading" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status"></div>
                            <p class="text-muted mt-3 mb-0">Loading invoice…</p>
                        </div>

                        <!-- Error state -->
                        <div id="invoiceError" class="alert alert-danger d-none" role="alert"></div>

                        <!-- Invoice content (hidden until data is loaded) -->
                        <div id="invoiceContent" class="d-none">

                            <!-- Invoice Logo -->
                            <div class="clearfix">
                                <div class="float-start mb-3">
                                    <img src="assets/img/logo.png" alt="logo" height="32">
                                </div>
                                <div class="float-end">
                                    <h4 class="m-0 d-print-none">Invoice</h4>
                                </div>
                            </div>

                            <!-- Invoice Detail -->
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="mt-3">
                                        <p><b>Hello, <span id="invCustomerName">—</span></b></p>
                                        <p class="text-muted fs-13">
                                            Please find below a breakdown for this order. If you have any questions about the payment or delivery, feel free to contact us.
                                        </p>
                                    </div>
                                </div>
                                <div class="col-sm-4 offset-sm-2">
                                    <div class="mt-3 float-sm-end">
                                        <p class="fs-13"><strong>Order Date:</strong>
                                            <span class="float-end" id="invOrderDate">—</span>
                                        </p>
                                        <p class="fs-13"><strong>Order Status:</strong>
                                            <span id="invOrderStatus" class="badge bg-secondary float-end">—</span>
                                        </p>
                                        <p class="fs-13"><strong>Payment:</strong>
                                            <span id="invPaymentStatus" class="float-end">—</span>
                                        </p>
                                        <p class="fs-13"><strong>Method:</strong>
                                            <span id="invPaymentMethod" class="float-end">—</span>
                                        </p>
                                        <p class="fs-13"><strong>Order ID:</strong>
                                            <span class="float-end" id="invOrderId">—</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="row mt-4">
                                <div class="col-6">
                                    <h6 class="fs-14">Billing Address</h6>
                                    <address id="invBillingAddress">—</address>
                                </div>
                                <div class="col-6">
                                    <h6 class="fs-14">Shipping Address</h6>
                                    <address id="invShippingAddress">—</address>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-12">
                                    <div class="table-responsive">
                                        <table class="table table-sm table-centered table-hover table-borderless mb-0 mt-3">
                                            <thead class="border-top border-bottom bg-light-subtle border-light">
                                                <tr>
                                                    <th style="width:40px">#</th>
                                                    <th>Item</th>
                                                    <th class="text-center">Quantity</th>
                                                    <th class="text-end">Unit Cost</th>
                                                    <th class="text-end">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody id="invItemsBody">
                                                <tr><td colspan="5" class="text-center text-muted py-4">No items</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="clearfix pt-3">
                                        <h6 class="text-muted fs-14">Notes:</h6>
                                        <small>
                                            All accounts are to be paid within 7 days of the invoice date.
                                            Payments can be made by credit card, direct bank transfer or cash on delivery as
                                            per the selected payment method.
                                        </small>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="float-end mt-3 mt-sm-0" id="invTotalsBox">
                                        <p><b>Sub-total:</b> <span class="float-end" id="invSubtotal">₹0.00</span></p>
                                        <p><b>Discount:</b> <span class="float-end text-success" id="invDiscount">-₹0.00</span></p>
                                        <p><b>Items:</b> <span class="float-end" id="invItemCount">0</span></p>
                                        <h3 id="invGrandTotal">₹0.00</h3>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>

                            <div class="d-print-none mt-4">
                                <div class="text-end">
                                    <a href="order.php" class="btn btn-light">
                                        <i class="mdi mdi-arrow-left"></i> Back
                                    </a>
                                    <a href="javascript:window.print()" class="btn btn-primary">
                                        <i class="mdi mdi-printer"></i> Print
                                    </a>
                                </div>
                            </div>

                        </div>
                        <!-- end invoice content -->

                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<style>
    @media print {
        .left-side-menu, .navbar-custom, .topbar, .breadcrumb, .card { box-shadow: none !important; }
        .content-page { margin-left: 0 !important; padding: 0 !important; }
        body { background: #fff !important; }
    }
</style>

<script>
(function () {
    const API_BASE = "https://api.workarya.com";
    const orderId = new URLSearchParams(window.location.search).get("id");

    const loadingEl = document.getElementById("invoiceLoading");
    const errorEl = document.getElementById("invoiceError");
    const contentEl = document.getElementById("invoiceContent");

    function showError(msg) {
        if (loadingEl) loadingEl.classList.add("d-none");
        if (contentEl) contentEl.classList.add("d-none");
        if (errorEl) {
            errorEl.textContent = msg || "Unable to load invoice";
            errorEl.classList.remove("d-none");
        }
    }

    function showContent() {
        if (loadingEl) loadingEl.classList.add("d-none");
        if (errorEl) errorEl.classList.add("d-none");
        if (contentEl) contentEl.classList.remove("d-none");
    }

    function escapeHtml(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function formatMoney(n) {
        const v = Number(n || 0);
        return "₹" + v.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatDate(d) {
        if (!d) return "—";
        try {
            const dt = new Date(d);
            if (isNaN(dt.getTime())) return "—";
            return dt.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
        } catch (_) { return "—"; }
    }

    function statusBadge(status) {
        const s = (status || "").toUpperCase();
        if (s === "DELIVERED") return "badge bg-success float-end";
        if (s === "CANCELLED" || s === "CANCELED") return "badge bg-danger float-end";
        if (s === "SHIPPED" || s === "OUT_FOR_DELIVERY") return "badge bg-info text-dark float-end";
        if (s === "CONFIRMED") return "badge bg-primary float-end";
        return "badge bg-secondary float-end";
    }

    function prettyStatus(s) {
        if (!s) return "—";
        return String(s).replace(/_/g, " ").toLowerCase()
            .replace(/\b\w/g, c => c.toUpperCase());
    }

    function resolveImage(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (window.resolveApiMediaUrl) return window.resolveApiMediaUrl(path);
        return API_BASE + (path.startsWith("/") ? path : "/" + path);
    }

    function addressHtml(a) {
        if (!a) return "—";
        const name  = a.name || a.fullName || a.FullName || "—";
        const phone = a.phone || a.phoneNumber || a.PhoneNumber || "";
        const line1 = a.addressLine1 || a.AddressLine1 || "";
        const line2 = a.addressLine2 || a.AddressLine2 || "";
        const city  = a.city || a.City || "";
        const state = a.state || a.State || "";
        const pin   = a.pincode || a.postalCode || a.PostalCode || "";

        return `
            <strong>${escapeHtml(name)}</strong><br>
            ${escapeHtml(line1)}${line2 ? " " + escapeHtml(line2) : ""}<br>
            ${escapeHtml([city, state].filter(Boolean).join(", "))}${pin ? " - " + escapeHtml(pin) : ""}<br>
            ${phone ? '<abbr title="Phone">P:</abbr> ' + escapeHtml(phone) : ""}
        `;
    }

    function render(order) {
        const a = order.address || order.Address || {};
        const items = order.items || order.Items || [];

        document.getElementById("invCustomerName").textContent = a.name || a.fullName || "Customer";
        document.getElementById("invOrderId").textContent = order.orderId || order.id || "—";
        document.getElementById("invOrderDate").textContent = formatDate(order.createdAt);

        const orderStatusEl = document.getElementById("invOrderStatus");
        orderStatusEl.textContent = prettyStatus(order.orderStatus);
        orderStatusEl.className = statusBadge(order.orderStatus);

        document.getElementById("invPaymentStatus").textContent = prettyStatus(order.paymentStatus);
        document.getElementById("invPaymentMethod").textContent = (order.paymentMethod || "—").toUpperCase();

        document.getElementById("invBillingAddress").innerHTML = addressHtml(a);
        document.getElementById("invShippingAddress").innerHTML = addressHtml(a);

        let subtotal = 0;
        let itemCount = 0;
        const rows = items.map((it, i) => {
            const qty   = Number(it.quantity || it.Quantity || 0);
            const price = Number(it.price || it.Price || 0);
            const line  = qty * price;
            subtotal += line;
            itemCount += qty;
            const img = resolveImage(it.productImage || it.ProductImage || it.image || it.Image);
            return `
                <tr>
                    <td>${i + 1}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            ${img ? `<img src="${img}" width="40" height="40" style="object-fit:cover;border-radius:6px" onerror="this.style.display='none'"/>` : ""}
                            <div>
                                <b>${escapeHtml(it.productName || it.ProductName || "Item")}</b>
                                ${it.vendorName ? `<br><small class="text-muted">Vendor: ${escapeHtml(it.vendorName)}</small>` : ""}
                            </div>
                        </div>
                    </td>
                    <td class="text-center">${qty}</td>
                    <td class="text-end">${formatMoney(price)}</td>
                    <td class="text-end">${formatMoney(line)}</td>
                </tr>`;
        }).join("");

        document.getElementById("invItemsBody").innerHTML = rows ||
            `<tr><td colspan="5" class="text-center text-muted py-4">No items</td></tr>`;

        // Prefer backend-provided totals; fall back to calculated values.
        const discount = Number(order.discount || 0);
        const grandTotal = Number(
            order.finalAmount != null ? order.finalAmount :
            (order.totalAmount != null ? order.totalAmount : (subtotal - discount))
        );

        document.getElementById("invSubtotal").textContent = formatMoney(subtotal || order.totalAmount || 0);
        document.getElementById("invDiscount").textContent = "-" + formatMoney(discount);
        document.getElementById("invItemCount").textContent = itemCount;
        document.getElementById("invGrandTotal").textContent = formatMoney(grandTotal);

        document.title = `Invoice #${order.orderId || order.id || ""}`;
        showContent();
    }

    async function loadInvoice() {
        if (!orderId) {
            showError("Missing order ID in URL.");
            return;
        }

        // NOTE: order.js caches a *normalized* order object in sessionStorage
        // that strips address lines + item price/qty, so the cache is only
        // useful here if it still has those fields. Otherwise always fetch.
        try {
            const cached = sessionStorage.getItem("superadminSelectedOrder");
            if (cached) {
                const o = JSON.parse(cached);
                const cachedId = o?.orderId || o?.id;
                const a = o?.address || {};
                const firstItem = (o?.items && o.items[0]) || {};
                const hasFullAddress = !!(a.addressLine1 || a.city || a.pincode || a.postalCode);
                const hasItemPricing = firstItem.price != null || firstItem.quantity != null;
                if (cachedId &&
                    String(cachedId).toLowerCase() === String(orderId).toLowerCase() &&
                    Array.isArray(o.items) &&
                    hasFullAddress && hasItemPricing) {
                    render(o);
                    return;
                }
            }
        } catch (_) {}

        const token = localStorage.getItem("superadminToken");
        if (!token) {
            showError("Login required. Please sign in to the admin panel.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/orders/my-orders`, {
                headers: { Authorization: "Bearer " + token }
            });

            if (!res.ok) {
                showError(`Failed to load order (HTTP ${res.status}).`);
                return;
            }

            const payload = await res.json();
            const orders =
                payload?.data?.data ||
                (Array.isArray(payload?.data) ? payload.data : null) ||
                payload?.orders ||
                [];

            const needle = String(orderId).trim().toLowerCase();
            const order = orders.find(x => {
                const id = String(x?.orderId || x?.id || "").trim().toLowerCase();
                return id === needle;
            });

            if (!order) {
                showError("Order not found.");
                return;
            }

            render(order);
        } catch (err) {
            console.error("Invoice load error:", err);
            showError("Unable to load invoice. Please try again.");
        }
    }

    loadInvoice();
})();
</script>

<?php include 'footer.php'; ?>
