<?php include 'header.php'; ?>

<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Invoice</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="">Invoice</a></li>
                    </ol>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body" id="invoiceBody"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
const BASE = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");
const orderId = new URLSearchParams(window.location.search).get("id");

async function loadInvoice() {
    const res = await fetch(`${BASE}/api/orders/my-orders`, {
        headers: { Authorization: "Bearer " + localStorage.getItem("vendorToken") },
    });
    const result = await res.json();
    const orders = result?.data?.data || result?.data || result?.orders || [];
    const o = orders.find((x) => (x.orderId || x.id) === orderId);
    if (!o) return;

    const a = o.address || {};
    const items = o.items || [];
    let rows = "";
    let subTotal = 0;

    items.forEach((it, i) => {
        const total = (Number(it.price) || 0) * (Number(it.quantity) || 0);
        subTotal += total;
        rows += `
            <tr>
                <td>${i + 1}</td>
                <td><b>${it.productName || "-"}</b></td>
                <td>${it.quantity || 0}</td>
                <td>₹${it.price || 0}</td>
                <td class="text-end">₹${total.toFixed(2)}</td>
            </tr>`;
    });

    document.getElementById("invoiceBody").innerHTML = `
        <div class="clearfix">
            <div class="float-start mb-3"><img src="assets/img/logo.png" alt="logo" height="32"></div>
            <div class="float-end"><h4 class="m-0 d-print-none">Invoice</h4></div>
        </div>
        <div class="row">
            <div class="col-sm-8">
                <p><b>Hello, ${a.fullName || "Customer"}</b></p>
                <p class="text-muted fs-13">Order invoice details.</p>
            </div>
            <div class="col-sm-4">
                <p class="fs-13"><strong>Order Date:</strong> <span class="float-end">${new Date(o.createdAt).toLocaleDateString()}</span></p>
                <p class="fs-13"><strong>Order Status:</strong> <span class="float-end">${o.orderStatus || "-"}</span></p>
                <p class="fs-13"><strong>Order ID:</strong> <span class="float-end">${o.orderId || o.id || "-"}</span></p>
            </div>
        </div>
        <div class="row mt-4">
            <div class="col-6">
                <h6 class="fs-14">Billing Address</h6>
                <address>${a.fullName || ""}<br>${a.addressLine1 || ""} ${a.addressLine2 || ""}<br>${a.city || ""}, ${a.state || ""} - ${a.postalCode || ""}<br><abbr title="Phone">P:</abbr> ${a.phoneNumber || ""}</address>
            </div>
            <div class="col-6">
                <h6 class="fs-14">Shipping Address</h6>
                <address>${a.fullName || ""}<br>${a.addressLine1 || ""} ${a.addressLine2 || ""}<br>${a.city || ""}, ${a.state || ""} - ${a.postalCode || ""}<br><abbr title="Phone">P:</abbr> ${a.phoneNumber || ""}</address>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-sm table-centered table-hover table-borderless mb-0 mt-3">
                <thead class="border-top border-bottom bg-light-subtle border-light">
                    <tr><th>#</th><th>Item</th><th>Quantity</th><th>Unit Cost</th><th class="text-end">Total</th></tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        <div class="row mt-3">
            <div class="col-sm-6"></div>
            <div class="col-sm-6">
                <div class="float-end mt-3 mt-sm-0">
                    <p><b>Sub-total:</b> <span class="float-end">₹${subTotal.toFixed(2)}</span></p>
                    <p><b>Shipping:</b> <span class="float-end">₹0.00</span></p>
                    <h3>₹${Number(o.totalAmount || 0).toFixed(2)}</h3>
                </div>
            </div>
        </div>
        <div class="d-print-none mt-4 text-end">
            <a href="javascript:window.print()" class="btn btn-primary"><i class="mdi mdi-printer"></i> Print</a>
        </div>`;
}

loadInvoice();
</script>

<?php include 'footer.php'; ?>
