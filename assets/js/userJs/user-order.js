const API_BASE = "https://api.workarya.com";
const USER_ORDERS = `${API_BASE}/api/orders/my-orders`;

function orderProductImageSrc(raw) {
  if (!raw) return "assets/images/product/1.png";
  if (typeof window.resolveApiMediaUrl === "function") {
    return window.resolveApiMediaUrl(raw);
  }
  const s = String(raw).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const base = API_BASE.replace(/\/$/, "");
  return s.startsWith("/") ? base + s : `${base}/${s}`;
}

// ----------------------------------------------------------------------------
// Orders pagination (client-side)
// ----------------------------------------------------------------------------
// The backend currently returns the user's full order list sorted newest first,
// so we paginate in the browser. 10 rows per page gives page 1 == "latest 10";
// additional pages reveal older orders. If the list later grows huge we can
// switch this to a server-side ?page=&pageSize= fetch without changing the UI.
const ORDERS_PER_PAGE = 10;

let allOrders = [];
let currentOrderPage = 1;

document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {
  const tableBody = document.getElementById("order-table-body");
  if (!tableBody) return;

  const token = localStorage.getItem("userToken");
  if (!token) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Login required</td></tr>`;
    hideOrderPagination();
    return;
  }

  try {
    const res = await fetch(USER_ORDERS, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await res.json();
    const orders = normalizeOrdersResponse(result);

    // Newest first — defensive sort in case the API ever changes ordering.
    orders.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

    allOrders = orders;

    if (!orders.length) {
      tableBody.innerHTML = `<tr><td colspan="8" class="text-center">No orders found</td></tr>`;
      hideOrderPagination();
      return;
    }

    currentOrderPage = 1;
    renderOrdersPage(currentOrderPage);
  } catch (e) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading orders</td></tr>`;
    hideOrderPagination();
  }
}

function renderOrdersPage(page) {
  const tableBody = document.getElementById("order-table-body");
  if (!tableBody) return;

  const total = allOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / ORDERS_PER_PAGE));
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  currentOrderPage = page;

  const start = (page - 1) * ORDERS_PER_PAGE;
  const end = Math.min(start + ORDERS_PER_PAGE, total);
  const slice = allOrders.slice(start, end);

  tableBody.innerHTML = slice.map((order) => {
    const firstItem = order.items?.[0];
    const thumb = orderProductImageSrc(firstItem?.productImage);
    return `
      <tr>
        <td>#${order.orderId.slice(0, 8)}</td>
        <td class="text-center">
          <img src="${thumb}" alt="" width="48" height="48" class="rounded border" style="object-fit:cover">
        </td>
        <td>${firstItem?.productName || "No Product"}</td>
        <td>${formatDate(order.createdAt)}</td>
        <td><span class="${getStatusClass(order.orderStatus)}">${formatStatusLabel(order.orderStatus)}</span></td>
        <td>${order.paymentStatus}</td>
        <td>₹${order.finalAmount}</td>
        <td>
          <a href="order-tracking.php?orderId=${order.orderId}"
             class="btn btn-sm theme-bg-color text-light"
             style="padding: 5px 10px; font-size: 14px; border-radius: 5px;">
            Track Order
          </a>
        </td>
      </tr>`;
  }).join("");

  renderOrderPagination(totalPages, page, total, start + 1, end);
}

function renderOrderPagination(totalPages, page, total, from, to) {
  const wrap = document.getElementById("orderPaginationWrap");
  const list = document.getElementById("orderPagination");
  const summary = document.getElementById("orderPaginationSummary");
  if (!wrap || !list) return;

  // Hide pagination if there's only one page — keeps the UI clean when the user
  // has 10 or fewer orders.
  if (totalPages <= 1) {
    hideOrderPagination();
    if (summary) summary.textContent = `Showing ${total} order${total === 1 ? "" : "s"}`;
    if (summary && wrap) {
      wrap.style.cssText = "display:flex !important;";
      list.innerHTML = "";
    }
    return;
  }

  wrap.style.cssText = "display:flex !important;";
  if (summary) {
    summary.textContent = `Showing ${from}–${to} of ${total} orders`;
  }

  // Keep the visible page numbers compact: current +/- 2, with ellipses.
  const windowSize = 2;
  const pages = [];
  const add = (p) => pages.push(p);

  add(1);
  if (page - windowSize > 2) add("…");
  for (let p = Math.max(2, page - windowSize); p <= Math.min(totalPages - 1, page + windowSize); p++) {
    add(p);
  }
  if (page + windowSize < totalPages - 1) add("…");
  if (totalPages > 1) add(totalPages);

  const item = (label, p, disabled, active) => `
    <li class="page-item ${disabled ? "disabled" : ""} ${active ? "active" : ""}">
      ${
        typeof p === "number" && !disabled
          ? `<a class="page-link" href="#" data-page="${p}">${label}</a>`
          : `<span class="page-link">${label}</span>`
      }
    </li>`;

  let html = "";
  html += item("« Prev", page - 1, page === 1, false);
  pages.forEach((p) => {
    if (p === "…") html += item("…", null, true, false);
    else html += item(String(p), p, false, p === page);
  });
  html += item("Next »", page + 1, page === totalPages, false);

  list.innerHTML = html;
}

function hideOrderPagination() {
  const wrap = document.getElementById("orderPaginationWrap");
  if (wrap) wrap.style.cssText = "display:none !important;";
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("#orderPagination a[data-page]");
  if (!link) return;
  e.preventDefault();
  const page = parseInt(link.getAttribute("data-page"), 10);
  if (!Number.isFinite(page)) return;
  renderOrdersPage(page);
  // Scroll the orders table back into view so the user sees the new page.
  document.querySelector(".dashboard-order-table")?.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("track-order-btn")) {
    const id = e.target.dataset.id;
    window.location.href = `order-tracking.php?id=${id}`;
  }
});

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(s) {
  s = (s || "").toUpperCase();
  // Terminal happy path
  if (["DELIVERED", "COMPLETED", "SUCCESS"].includes(s)) return "status-success";
  // Terminal unhappy path
  if (["CANCELED", "CANCELLED", "FAILED"].includes(s)) return "status-cancel";
  // Everything else (PLACED, CONFIRMED, SHIPPED, OUT_FOR_DELIVERY) is in-flight.
  return "status-process";
}

function formatStatusLabel(s) {
  if (!s) return "";
  return String(s)
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeOrdersResponse(result) {
  const rawOrders = result?.data?.data || result?.data || result?.orders || [];
  if (!Array.isArray(rawOrders)) return [];

  return rawOrders.map((order) => {
    const items = Array.isArray(order.items)
      ? order.items
      : Array.isArray(order.Items)
        ? order.Items
        : [];

    const normalizedItems = items.map((item) => ({
      productName: item.productName ?? item.ProductName ?? "No Product",
      productImage:
        item.productImage ??
        item.ProductImage ??
        item.image ??
        item.Image ??
        item.mainimage ??
        item.MainImage ??
        "",
    }));

    return {
      orderId: order.orderId || order.OrderId || order.id || order.Id || "",
      createdAt: order.createdAt || order.CreatedAt || "",
      orderStatus: order.orderStatus || order.OrderStatus || "",
      paymentStatus: order.paymentStatus || order.PaymentStatus || "",
      finalAmount: order.finalAmount ?? order.FinalAmount ?? order.totalAmount ?? order.TotalAmount ?? 0,
      items: normalizedItems,
    };
  });
}

// ********************************************************* user addrss ********************************************

{/* <div class="row g-sm-4 g-3" id="addressContainer">
    <!-- Address cards will be injected here -->
</div>

<script> */}
{/* <div class="row g-sm-4 g-3" id="addressContainer">
    <!-- Dynamic addresses will replace this content -->
</div>

<script> */}

const userToken = localStorage.getItem('userToken') || ''; 

async function loadAddresses() {
    const container = document.getElementById('addressContainer');
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3">Loading your addresses...</p>
        </div>`;

    if (!userToken) {
        container.innerHTML = `<p class="text-danger text-center">Please login to view addresses.</p>`;
        return;
    }

    try {
        const response = await fetch('https://api.workarya.com/api/address/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (response.status === 401) {
            container.innerHTML = `<p class="text-danger text-center">Session expired. Please login again.</p>`;
            return;
        }

        if (!response.ok) throw new Error('Failed to load addresses');

        const addresses = await response.json();   // Your API returns direct array

        container.innerHTML = '';

        if (!addresses || addresses.length === 0) {
            container.innerHTML = `<p class="text-center">No addresses found. Add a new one.</p>`;
            return;
        }

        addresses.forEach((addr) => {
            const isChecked = addr.isDefault ? 'checked' : '';

            const fullAddress = `${addr.addressLine1}, ${addr.addressLine2 ? addr.addressLine2 + ', ' : ''}${addr.city}, ${addr.state}, ${addr.country}`;

            const addressHTML = `
                <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                    <div class="address-box">
                        <div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="jack" 
                                       id="addr_${addr.id}" ${isChecked}>
                            </div>

                            <div class="label">
                                <label>${addr.addressType || 'Address'}</label>
                            </div>

                            <div class="table-responsive address-table">
                                <table class="table">
                                    <tbody>
                                        <tr>
                                            <td colspan="3">${addr.fullName}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>:</td>
                                            <td>
                                                <p>${fullAddress}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Pin Code</td>
                                            <td>:</td>
                                            <td>${addr.postalCode}</td>
                                        </tr>
                                        <tr>
                                            <td>Phone</td>
                                            <td>:</td>
                                            <td>${addr.phoneNumber}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div class="button-group">
                            <button class="btn btn-sm add-button w-100 edit-btn" data-id="${addr.id}">
                                <i class="ri-edit-box-line"></i> Edit
                            </button>
                            <button class="btn btn-sm add-button w-100 delete-btn" data-id="${addr.id}">
                                <i class="ri-delete-bin-5-line"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;

            container.innerHTML += addressHTML;
        });

        // Add event listeners for buttons
        addEventListeners();

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="text-danger text-center">Failed to load addresses. Please try again later.</p>`;
    }
}

// Event listeners for Edit & Delete
function addEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            editAddress(addressId);
        });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            if (confirm('Are you sure you want to delete this address?')) {
                deleteAddress(addressId);
            }
        });
    });
}

// Edit function (you can open modal here)
function editAddress(id) {
    alert(`Edit Address - ID: ${id}`);
    // TODO: Open edit modal and pre-fill data
}

// Delete function
async function deleteAddress(id) {
    try {
        const response = await fetch(`https://api.workarya.com/api/address/delete/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });

        if (response.ok) {
            loadAddresses(); // Refresh the list
        } else {
            alert('Failed to delete address');
        }
    } catch (err) {
        console.error(err);
        alert('Something went wrong');
    }
}

// Load addresses on page load
document.addEventListener('DOMContentLoaded', loadAddresses);






