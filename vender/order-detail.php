<?php include 'header.php'; ?>
<?php $orderId = $_GET['id'] ?? ''; ?>

<div class="container-fluid">
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

    <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 id="orderHeading">Order ID - #<?php echo $orderId; ?></h4>
        <a href="order.php" class="btn btn-secondary">← Back to Orders</a>
    </div>

    <div class="row g-3">
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Order Details</h5>
                <div id="orderDetails"></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Delivery Address</h5>
                <div id="deliveryAddress"></div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card p-3 shadow-sm">
                <h5 class="mb-3">Customer Details</h5>
                <div id="customerDetails"></div>
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

<script>
const BASE = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");
const orderId = "<?php echo $orderId; ?>";

async function loadOrderDetail() {
    try {
        const res = await fetch(`${BASE}/api/orders/my-orders`, {
            headers: { "Authorization": "Bearer " + localStorage.getItem("vendorToken") }
        });
        const result = await res.json();
        const orders = result?.data?.data || result?.data || result?.orders || [];
        const o = orders.find(x => (x.orderId || x.id) === orderId);
        if (!o) {
            document.getElementById("orderDetails").innerHTML = "Order not found";
            return;
        }

        const a = o.address || {};
        const addressName = a.fullName || a.FullName || a.name || a.Name || "";
        const addressPhone = a.phoneNumber || a.PhoneNumber || a.phone || a.Phone || "";
        const addressPincode = a.postalCode || a.PostalCode || a.pincode || a.Pincode || "";
        document.getElementById("orderHeading").innerText = "Order Detail - " + (o.orderId || o.id || "-");
        document.getElementById("orderDetails").innerHTML = `
            <p><strong>Order ID:</strong> ${o.orderId || o.id || "-"}</p>
            <p><strong>Order Date:</strong> ${new Date(o.createdAt).toLocaleString()}</p>
            <p><strong>Order Status:</strong> ${o.orderStatus || "-"}</p>
            <p><strong>Payment Status:</strong> ${o.paymentStatus || "-"}</p>
            <p><strong>Order Total:</strong> ₹${o.totalAmount || 0}</p>`;

        document.getElementById("deliveryAddress").innerHTML = `
            <p><strong>Name:</strong> ${addressName}</p>
            <p><strong>Mobile:</strong> ${addressPhone}</p>
            <p><strong>Address:</strong> ${a.addressLine1 || ""} ${a.addressLine2 || ""}</p>
            <p><strong>City:</strong> ${a.city || ""}</p>
            <p><strong>State:</strong> ${a.state || ""}</p>
            <p><strong>Post Code:</strong> ${addressPincode}</p>`;

        document.getElementById("customerDetails").innerHTML = `
            <p><strong>Name:</strong> ${addressName}</p>
            <p><strong>Mobile:</strong> ${addressPhone}</p>
            <p><strong>City:</strong> ${a.city || ""}</p>
            <p><strong>State:</strong> ${a.state || ""}</p>`;

        const itemsHtml = (o.items || []).map(it => `
            <div class="border rounded p-2 mb-2 d-flex gap-2">
                <img src="${window.resolveApiMediaUrl ? window.resolveApiMediaUrl(it.productImage || it.image) : (BASE + (it.productImage || ""))}"
                    width="60" height="60" style="object-fit:cover;border-radius:6px"/>
                <div>
                    <p class="m-0"><strong>${it.productName || "-"}</strong></p>
                    <p class="m-0">Qty: ${it.quantity || 0}</p>
                    <p class="m-0">Price: ₹${it.price || 0}</p>
                </div>
            </div>`).join("");
        document.getElementById("orderItems").innerHTML = itemsHtml || "No items";
    } catch (e) {
        console.error(e);
    }
}

loadOrderDetail();
</script>

<?php include 'footer.php'; ?>
