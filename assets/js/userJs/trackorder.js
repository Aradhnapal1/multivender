const TRACK_ORDER_API_ROOT = window.BASE || "https://api.workarya.com";

document.addEventListener("DOMContentLoaded", () => {
    // ✅ run only on tracking page
    if (!location.pathname.includes("order-tracking")) return;
    init();
});

// ===== INIT =====
async function init() {
    try {
        const orderId = new URLSearchParams(location.search).get("orderId");
        const token = localStorage.getItem("userToken");

        if (!orderId || !token) return;

        const res = await fetch(
            `${TRACK_ORDER_API_ROOT}/api/orders/order-details/${orderId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();
        console.log("ORDER DETAILS =>", data);

        if (!data.success || !data.order) return;

        render(data.order);

    } catch (err) {
        console.error(err);
    }
}

// ===== RENDER =====
function render(order) {

    set("orderNumber", "#" + order.orderId.slice(0, 8));
    set("orderDate", format(order.createdAt));
    set("orderDateSmall", format(order.createdAt));
    set("orderIdSmall", "#" + order.orderId.slice(0, 8));

    set("customerEmail", getEmailFromToken() || "N/A");

    const badge = document.getElementById("paymentBadge");
    const status = order.paymentStatus || "PAID";
    badge.textContent = status;
    badge.className = "badge " + (status === "PAID" ? "bg-success" : "bg-warning");

    const a = order.address || {};
    const addr = `${a.addressLine1 || ""}, ${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`;

    set("billingAddress", addr);
    set("billingPhone", "Phone: " + (a.phone || "-"));
    set("shippingAddress", addr);
    set("shippingPhone", "Phone: " + (a.phone || "-"));

    // ✅ items key fix
    const items = order.items || order.orderItems || [];

    const tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    let total = 0, qty = 0;

    items.forEach(item => {
        const sub = Number(item.price) * Number(item.quantity);
        total += sub;
        qty += Number(item.quantity);

        tbody.innerHTML += `
        <tr>
            <td class="d-flex align-items-center gap-2">
                <img src="${window.resolveApiMediaUrl(item.productImage || item.image)}" width="50" height="50"
                     style="object-fit:cover;border-radius:6px">
                <span>${item.productName}</span>
            </td>
            <td>₹${money(item.price)}</td>
            <td>${item.quantity}</td>
            <td>₹${money(sub)}</td>
        </tr>`;
    });

    set("itemCount", `(${qty} items)`);
    set("subTotalAmount", "₹" + money(total));
    set("deliveryAmount", "₹" + money(order.deliveryCharge || 0));
    set("totalPaid", "₹" + money(order.finalAmount));

    const invoiceBtn = document.getElementById("downloadInvoice");
    if (invoiceBtn) {
        invoiceBtn.onclick = () => downloadInvoice(order);
    }
}

async function downloadInvoice(order) {
    try {
        const { jsPDF } = window.jspdf || {};
        if (!jsPDF) throw new Error("jsPDF library not available");

        const doc = new jsPDF({ unit: "pt", format: "a4" });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 40;
        let y = margin;

        const logoDataUrl = await loadImageAsDataUrl("assets/images/img/logo1.png", 0.1);
        if (logoDataUrl) {
            // Draw a faint centered watermark in the background
            const watermarkWidth = pageWidth * 0.8;
            const watermarkHeight = watermarkWidth * 0.25;
            const watermarkX = (pageWidth - watermarkWidth) / 2;
            const watermarkY = (pageHeight - watermarkHeight) / 2;
            doc.addImage(logoDataUrl, "PNG", watermarkX, watermarkY, watermarkWidth, watermarkHeight, undefined, "NONE", 0);

            // Draw the visible logo in the header centered
            const logoVisibleUrl = await loadImageAsDataUrl("assets/images/img/logo1.png", 1);
            if (logoVisibleUrl) {
                const logoWidth = 140;
                const logoHeight = 35;
                const logoX = (pageWidth - logoWidth) / 2;
                doc.addImage(logoVisibleUrl, "PNG", logoX, y, logoWidth, logoHeight);
            }
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        
        const titleX = margin;
        const titleY = y + 30;
        doc.text("INVOICE", titleX, titleY);

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        // doc.text("Invoice", pageWidth - margin, titleY, { align: "right" });

        y += logoDataUrl ? 60 : 30;
        doc.setLineWidth(0.5);
        doc.line(margin, y, pageWidth - margin, y);
        y += 24;

        doc.setFontSize(10);
        doc.text(`Invoice Number: ${order.orderId || "N/A"}`, margin, y);
        doc.text(`Order Date: ${format(order.createdAt)}`, pageWidth - margin, y, { align: "right" });

        y += 18;
        doc.setFont("helvetica", "bold");
        doc.text("Billing / Shipping Address", margin, y);
        y += 16;
        doc.setFont("helvetica", "normal");

        const a = order.address || {};
        const addressLines = [
            a.addressLine1 || "",
            `${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`,
            `Phone: ${a.phone || "-"}`,
            `Email: ${getEmailFromToken() || "N/A"}`,
        ].filter(Boolean);

        addressLines.forEach(line => {
            doc.text(line, margin, y);
            y += 14;
        });

        y += 12;
        doc.setFont("helvetica", "bold");
        doc.text("Order Items", margin, y);
        y += 16;

        doc.setFontSize(10);
        doc.text("Item", margin, y);
        doc.text("Qty", 330, y);
        doc.text("Rate", 430, y, { align: "right" });
        doc.text("Total", pageWidth - margin - 80, y, { align: "right" });

        y += 12;
        doc.line(margin, y, pageWidth - margin, y);
        y += 18;
        doc.setFont("helvetica", "normal");

        const items = order.items || order.orderItems || [];
        let total = 0;
        const totalsX = pageWidth - margin - 80;

        items.forEach(item => {
            const itemName = item.productName || item.name || "Product";
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const subtotal = quantity * price;
            total += subtotal;

            doc.text(itemName, margin, y, { maxWidth: 260 });
            doc.text(`${quantity}`, 330, y);
            doc.text(`${money(price)}`, 430, y, { align: "right" });
            doc.text(`${money(subtotal)}`, totalsX, y, { align: "right" });
            y += 16;

            if (y > 760) {
                doc.addPage();
                y = margin;
            }
        });

        y += 12;
        doc.line(margin, y, pageWidth - margin, y);
        y += 20;

        doc.setFont("helvetica", "bold");
        doc.text(`Subtotal: ${money(total)}`, totalsX, y, { align: "right" });
        y += 16;
        doc.text(`Delivery: ${money(order.deliveryCharge || 0)}`, totalsX, y, { align: "right" });
        y += 18;
        doc.text(`Total Paid: ${money(order.finalAmount || total + (order.deliveryCharge || 0))}`, totalsX, y, { align: "right" });

        y += 30;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text("Thank you for shopping with Hyperscripts.", margin, y);

        const filename = `invoice-${order.orderId?.slice(0, 8) || "order"}.pdf`;
        doc.save(filename);
    } catch (err) {
        console.error("Invoice download failed:", err);
        alert("Unable to generate invoice PDF. Please try again.");
    }
}

async function loadImageAsDataUrl(url, opacity = 1) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.globalAlpha = opacity;
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => resolve(null);
        img.src = url;
    });
}





// ===== JWT EMAIL =====
function getEmailFromToken() {
    try {
        const t = localStorage.getItem("userToken");
        const p = JSON.parse(atob(t.split(".")[1]));
        return p.email || p.sub;
    } catch {
        return null;
    }
}

// ===== HELPERS =====
function set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function money(n) {
    return Number(n || 0).toLocaleString("en-IN");
}

function format(d) {
    return new Date(d).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}





