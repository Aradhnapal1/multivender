<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Rating &amp; Reviews</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Rating</li>
                    </ol>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <div class="row align-items-center g-2">
                            <div class="col-sm-6">
                                <h5 class="mb-0">All Customer Reviews</h5>
                                <small class="text-muted" id="ratingSummary">Loading…</small>
                            </div>
                            <div class="col-sm-6">
                                <div class="d-flex gap-2 justify-content-sm-end">
                                    <div class="position-relative" style="max-width: 260px; width: 100%;">
                                        <input type="text" id="ratingSearch" class="form-control form-control-sm"
                                            placeholder="Search product, email or comment…">
                                    </div>
                                    <select id="ratingFilter" class="form-select form-select-sm" style="max-width: 140px;">
                                        <option value="">All ratings</option>
                                        <option value="5">5 ★</option>
                                        <option value="4">4 ★</option>
                                        <option value="3">3 ★</option>
                                        <option value="2">2 ★</option>
                                        <option value="1">1 ★</option>
                                    </select>
                                    <button type="button" id="ratingRefresh" class="btn btn-sm btn-light" title="Refresh">
                                        <i class="mdi mdi-refresh"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-centered w-100 nowrap mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 60px;">#</th>
                                    <th>Product</th>
                                    <th>User</th>
                                    <th>Review</th>
                                    <th style="min-width: 130px;">Rating</th>
                                    <th>Date</th>
                                    <th style="width: 70px;">Action</th>
                                </tr>
                            </thead>
                            <tbody id="ratingTableBody">
                                <tr>
                                    <td colspan="7" class="text-center py-5">
                                        <div class="spinner-border text-primary" role="status"></div>
                                        <p class="text-muted mt-2 mb-0">Loading reviews…</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>
</div>

<script>
(function () {
    const API_BASE = "https://api.workarya.com";
    const token = () => localStorage.getItem("superadminToken");

    const tbody = document.getElementById("ratingTableBody");
    const summaryEl = document.getElementById("ratingSummary");
    const searchEl = document.getElementById("ratingSearch");
    const filterEl = document.getElementById("ratingFilter");
    const refreshBtn = document.getElementById("ratingRefresh");

    let allReviews = [];

    function escapeHtml(s) {
        return String(s == null ? "" : s)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
    }

    function formatDate(d) {
        if (!d) return "—";
        try {
            const dt = new Date(d);
            if (isNaN(dt.getTime())) return "—";
            return dt.toLocaleString("en-IN", {
                day: "2-digit", month: "short", year: "numeric",
                hour: "2-digit", minute: "2-digit"
            });
        } catch (_) { return "—"; }
    }

    function resolveImage(path) {
        if (!path) return "";
        if (/^https?:\/\//i.test(path)) return path;
        if (window.resolveApiMediaUrl) return window.resolveApiMediaUrl(path);
        return API_BASE + (path.startsWith("/") ? path : "/" + path);
    }

    function renderStars(n) {
        const rating = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
        let html = '<span class="text-warning" style="letter-spacing:2px;">';
        for (let i = 0; i < 5; i++) {
            html += i < rating ? '★' : '<span class="text-muted">★</span>';
        }
        html += '</span>';
        html += ` <small class="text-muted ms-1">(${rating})</small>`;
        return html;
    }

    function showEmpty(msg) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-5">${escapeHtml(msg)}</td></tr>`;
    }

    function render(list) {
        if (!list.length) {
            showEmpty("No reviews match your filter.");
            return;
        }

        tbody.innerHTML = list.map((r, idx) => {
            const img = resolveImage(r.productImage);
            const rating = Number(r.rating) || 0;
            return `
                <tr data-id="${escapeHtml(r.id)}">
                    <td>${idx + 1}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            ${img ? `<img src="${img}" width="40" height="40" style="object-fit:cover;border-radius:6px" onerror="this.style.display='none'"/>` : ''}
                            <div class="fw-semibold" style="max-width:240px; white-space:normal;">
                                ${escapeHtml(r.productName || "(deleted product)")}
                            </div>
                        </div>
                    </td>
                    <td class="text-muted">${escapeHtml(r.email || "—")}</td>
                    <td style="max-width:320px; white-space:normal;">
                        ${r.comment ? escapeHtml(r.comment) : '<span class="text-muted fst-italic">No comment</span>'}
                    </td>
                    <td>${renderStars(rating)}</td>
                    <td class="small text-muted">${formatDate(r.createdAt)}</td>
                    <td class="table-action">
                        <a href="javascript:void(0);" class="action-icon text-danger"
                           title="Delete review"
                           onclick="window.__deleteReview('${escapeHtml(r.id)}')">
                            <i class="mdi mdi-trash-can"></i>
                        </a>
                    </td>
                </tr>`;
        }).join("");
    }

    function applyFilters() {
        const q = (searchEl.value || "").trim().toLowerCase();
        const star = filterEl.value;
        let list = allReviews.slice();

        if (star) list = list.filter(r => String(Math.round(Number(r.rating) || 0)) === star);
        if (q) {
            list = list.filter(r =>
                (r.productName || "").toLowerCase().includes(q) ||
                (r.email || "").toLowerCase().includes(q) ||
                (r.comment || "").toLowerCase().includes(q)
            );
        }

        summaryEl.textContent = `Showing ${list.length} of ${allReviews.length} review${allReviews.length === 1 ? "" : "s"}`;
        render(list);
    }

    async function loadReviews() {
        const t = token();
        if (!t) {
            showEmpty("Login required. Please sign in to the admin panel.");
            summaryEl.textContent = "";
            return;
        }

        tbody.innerHTML = `
            <tr><td colspan="7" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="text-muted mt-2 mb-0">Loading reviews…</p>
            </td></tr>`;
        summaryEl.textContent = "Loading…";

        try {
            const res = await fetch(`${API_BASE}/api/review/all`, {
                headers: { Authorization: "Bearer " + t }
            });

            if (res.status === 401) {
                showEmpty("Session expired. Please sign in again.");
                summaryEl.textContent = "";
                return;
            }
            if (!res.ok) {
                showEmpty(`Failed to load reviews (HTTP ${res.status}).`);
                summaryEl.textContent = "";
                return;
            }

            const payload = await res.json();
            const data =
                (Array.isArray(payload) && payload) ||
                (Array.isArray(payload?.data) && payload.data) ||
                (Array.isArray(payload?.data?.data) && payload.data.data) ||
                [];

            allReviews = data;
            applyFilters();
        } catch (err) {
            console.error("rating load error:", err);
            showEmpty("Unable to load reviews. Please try again.");
            summaryEl.textContent = "";
        }
    }

    window.__deleteReview = async function (reviewId) {
        if (!reviewId) return;
        const ok = typeof Swal !== "undefined"
            ? (await Swal.fire({
                title: "Delete this review?",
                text: "This cannot be undone.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete",
                confirmButtonColor: "#d33"
              })).isConfirmed
            : confirm("Delete this review? This cannot be undone.");
        if (!ok) return;

        const t = token();
        if (!t) {
            if (typeof Swal !== "undefined") Swal.fire("Login required", "Please sign in again.", "warning");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/review/admin/delete/${encodeURIComponent(reviewId)}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + t }
            });
            let data = {};
            try { data = await res.json(); } catch (_) {}

            if (!res.ok || data.success === false) {
                if (typeof Swal !== "undefined") {
                    Swal.fire("Delete failed", data.message || `HTTP ${res.status}`, "error");
                } else {
                    alert(data.message || "Delete failed");
                }
                return;
            }

            allReviews = allReviews.filter(r => String(r.id) !== String(reviewId));
            applyFilters();

            if (typeof Swal !== "undefined") {
                Swal.fire({ icon: "success", title: "Deleted", timer: 1200, showConfirmButton: false });
            }
        } catch (err) {
            console.error("delete review error:", err);
            if (typeof Swal !== "undefined") Swal.fire("Error", "Network error. Please try again.", "error");
        }
    };

    searchEl.addEventListener("input", applyFilters);
    filterEl.addEventListener("change", applyFilters);
    refreshBtn.addEventListener("click", loadReviews);

    loadReviews();
})();
</script>

<?php include 'footer.php'; ?>
