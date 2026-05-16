/**=====================
 *   Compare Notify JS
 * ---------------------
 * Mirrors the wishlist flow: anonymous users are identified by IP server-side,
 * authenticated users by bearer-token-derived email. Entries sync between the
 * compare page (`compare.php` -> #compareContainer) and the header badge.
 *
 * Endpoints (all under the same host as the rest of the API):
 *   POST   /api/compare/add/{productId}
 *   GET    /api/compare/list
 *   DELETE /api/compare/delete/{productId}
 *   DELETE /api/compare/clear
 ==========================**/
(function () {
    const BASE_URL = "https://api.workarya.com";
    const MAX_ITEMS = 4;
    const PLACEHOLDER_IMAGE = "assets/images/product/placeholder.png";

    function authHeaders() {
        const token = localStorage.getItem("userToken");
        const headers = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;
        return headers;
    }

    function resolveImage(img) {
        if (!img) return PLACEHOLDER_IMAGE;
        if (typeof window.resolveApiMediaUrl === "function") {
            try { return window.resolveApiMediaUrl(img) || img; } catch (_) {}
        }
        if (/^https?:/i.test(img)) return img;
        return BASE_URL + (img.startsWith("/") ? img : "/" + img);
    }

    function money(v) {
        const n = Number(v);
        if (!isFinite(n)) return "0";
        return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
    }

    function updateCountBadges(count) {
        const selectors = [
            "#compareCount span",
            ".compareCount span",
            "#compareCount",
            ".compareCount",
            ".compare-qty"
        ];
        document.querySelectorAll(selectors.join(",")).forEach(el => {
            if (el.textContent && el.textContent.includes("(")) {
                el.textContent = `(${count})`;
            } else {
                el.textContent = String(count);
            }
        });
    }

    function syncIconState(items) {
        const ids = new Set(items.map(i => {
            const p = i.product || i;
            return String(p.productId || p._id || p.id || i.productId || "");
        }));
        document.querySelectorAll(".compareProduct").forEach(icon => {
            const id = icon.getAttribute("data-id");
            const inCompare = ids.has(String(id));
            icon.classList.toggle("show", inCompare);
            const i = icon.querySelector("i");
            if (i) {
                if (inCompare) {
                    i.style.color = "#ff5151";
                } else {
                    i.style.color = "";
                }
            }
        });
    }

    // Translate server/infrastructure errors into something a shopper understands.
    // Raw Postgres messages like `42P01: relation "compare" does not exist` should
    // never reach the UI — we log the detail and surface a generic friendly notice.
    function friendlyMessage(rawMessage, fallback) {
        const msg = (rawMessage || "").toString();
        if (!msg) return fallback;
        if (/relation\s+".+"\s+does not exist/i.test(msg) || /42P01/i.test(msg)) {
            return "Compare service is not ready yet. Please try again in a few minutes.";
        }
        if (/\b42\d{3}\b/i.test(msg) || /syntax error/i.test(msg)) {
            return "Something went wrong on our end. Please try again shortly.";
        }
        if (/timeout|network|failed to fetch/i.test(msg)) {
            return "Network issue, please check your connection and retry.";
        }
        return msg;
    }

    window.loadCompare = async function () {
        try {
            const res = await fetch(`${BASE_URL}/api/compare/list`, { headers: authHeaders() });
            let data = {};
            try { data = await res.json(); } catch (_) {}

            // Backend unavailable or table missing: keep the UI quiet and reset state.
            if (!res.ok || data?.success === false) {
                console.warn("Compare list failed:", data?.message || res.statusText);
                updateCountBadges(0);
                const c = document.getElementById("compareContainer");
                if (c) renderCompareTable([], c);
                syncIconState([]);
                return [];
            }

            const items = Array.isArray(data?.data)
                ? data.data
                : Array.isArray(data?.items)
                    ? data.items
                    : (Array.isArray(data) ? data : []);

            updateCountBadges(items.length);

            const container = document.getElementById("compareContainer");
            if (container) {
                renderCompareTable(items, container);
            }

            syncIconState(items);
            return items;
        } catch (err) {
            console.error("Error loading compare list:", err);
            updateCountBadges(0);
            const c = document.getElementById("compareContainer");
            if (c) renderCompareTable([], c);
            return [];
        }
    };

    window.addToCompare = async function (productId, iconEl) {
        if (!productId) return { success: false };
        try {
            const res = await fetch(`${BASE_URL}/api/compare/add/${productId}`, {
                method: "POST",
                headers: authHeaders()
            });
            let data = {};
            try { data = await res.json(); } catch (_) {}

            if (res.ok && data.success !== false) {
                showComparePopup(data.message || "Product added to compare", true);
                if (iconEl) {
                    iconEl.classList.add("show");
                    const i = iconEl.querySelector("i");
                    if (i) i.style.color = "#ff5151";
                }
                loadCompare();
                return { success: true };
            }

            // Log the raw backend message for debugging but show a clean one to the user.
            console.warn("Compare add failed:", data?.message || res.statusText);
            showComparePopup(friendlyMessage(data?.message, "Could not add to compare"), false);
            return { success: false, message: data?.message };
        } catch (err) {
            console.error("Compare add error:", err);
            showComparePopup(friendlyMessage(err?.message, "Could not add to compare"), false);
            return { success: false };
        }
    };

    window.removeFromCompare = async function (productId) {
        if (!productId) return;
        try {
            const res = await fetch(`${BASE_URL}/api/compare/delete/${productId}`, {
                method: "DELETE",
                headers: authHeaders()
            });
            if (res.ok) {
                showComparePopup("Removed from compare", true);
                loadCompare();
            }
        } catch (err) {
            console.error("Compare remove error:", err);
        }
    };

    window.clearCompare = async function () {
        try {
            const res = await fetch(`${BASE_URL}/api/compare/clear`, {
                method: "DELETE",
                headers: authHeaders()
            });
            if (res.ok) {
                loadCompare();
            }
        } catch (err) {
            console.error("Compare clear error:", err);
        }
    };

    function renderCompareTable(items, container) {
        if (!items || items.length === 0) {
            container.innerHTML = `
                <div class="text-center py-5 w-100">
                    <h4 class="text-muted mb-2">No products in compare list.</h4>
                    <p class="text-muted mb-3">Click the compare icon on any product card to add it here.</p>
                    <a href="shop.php" class="btn btn-primary">Continue Shopping</a>
                </div>`;
            return;
        }

        // Build a comparison table dynamically from the product fields we have.
        const rows = [
            {
                label: "Images",
                render: p => {
                    const id = p.productId || p.id;
                    const img = resolveImage(p.image || p.mainImage);
                    const price = Number(p.discountprice || p.price || 0);
                    return `
                        <div class="compare-image">
                            <button class="close-compare" onclick="removeFromCompare('${id}')" title="Remove">
                                <i class="ri-close-line"></i>
                            </button>
                            <a href="product-detail.php?id=${id}">
                                <img src="${img}" class="img-fluid" alt="${(p.name || '')}" onerror="this.onerror=null;this.src='${PLACEHOLDER_IMAGE}'">
                            </a>
                        </div>
                        <a href="product-detail.php?id=${id}">
                            <h3 class="title-color">${p.name || 'Product'}</h3>
                        </a>
                        <button onclick="compareAddToCart('${id}', ${price})" class="btn cart-button">Add To Cart</button>
                    `;
                }
            },
            { label: "Brand",    get: p => p.brandName || '-' },
            { label: "Category", get: p => p.categoryName || '-' },
            { label: "Price",    get: p => `<span class="price text-content">₹${money(p.discountprice || p.price)}</span>` },
            { label: "MRP",      get: p => `<span class="text-content">₹${money(p.price)}</span>` },
            { label: "SKU",      get: p => p.sku || '-' },
            { label: "Color",    get: p => p.colorName || '-' },
            { label: "Size",     get: p => p.sizeName || '-' },
            { label: "Availability", get: p => (Number(p.stockQuantity) > 0 ? 'In Stock' : 'Out of Stock') },
            { label: "Short Description", get: p => (p.shortDescription || '-').toString().slice(0, 180) }
        ];

        const productCells = items.map(item => item.product || item);

        const tableHtml = `
            <div class="table-responsive compare-table">
                <table class="table">
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <th>${row.label}</th>
                                ${productCells.map(p => `
                                    <td class="${row.label === 'Images' ? 'compare-details-box' : 'text-content'}">
                                        ${row.render ? row.render(p) : row.get(p)}
                                    </td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <div class="text-end mt-3">
                <button class="btn btn-outline-danger" onclick="clearCompare()">
                    <i class="ri-delete-bin-line me-1"></i> Clear All
                </button>
            </div>
        `;

        container.innerHTML = tableHtml;
    }

    window.compareAddToCart = async function (productId, price) {
        if (typeof window.addToCart === "function") {
            await window.addToCart(productId, 1, price);
        } else {
            window.location.href = `product-detail.php?id=${productId}`;
        }
    };

    // ---------- Small toast popup (same visual vibe as wishlist) ----------
    function ensurePopup() {
        let box = document.getElementById("compareAlertBox");
        if (box) return box;
        box = document.createElement("div");
        box.id = "compareAlertBox";
        box.className = "compare-alert-box";
        box.style.cssText = [
            "position:fixed", "top:90px", "right:20px", "background:#fff",
            "border-radius:8px", "box-shadow:0 10px 30px rgba(0,0,0,0.15)",
            "padding:14px 18px", "min-width:260px", "z-index:2147483647",
            "display:none", "font-family:inherit", "font-size:14px",
            "border-left:4px solid #0da487", "color:#222", "transition:opacity .2s ease"
        ].join(";");
        document.body.appendChild(box);
        return box;
    }

    function showComparePopup(message, isSuccess) {
        const box = ensurePopup();
        box.style.borderLeftColor = isSuccess ? "#0da487" : "#dc3545";
        box.innerHTML = `
            <strong style="display:block;margin-bottom:2px;">${isSuccess ? "Compare" : "Info"}</strong>
            <span>${message}</span>
        `;
        box.style.display = "block";
        box.style.opacity = "1";
        clearTimeout(box._hideTimer);
        box._hideTimer = setTimeout(() => {
            box.style.opacity = "0";
            setTimeout(() => { box.style.display = "none"; }, 200);
        }, 2200);
    }

    // ---------- Delegated click for any .compareProduct icon/button ----------
    document.addEventListener("click", async function (e) {
        const icon = e.target.closest(".compareProduct");
        if (!icon) return;
        e.preventDefault();

        const productId = icon.getAttribute("data-id");
        if (!productId) {
            console.warn("Compare: missing data-id on compare button");
            return;
        }

        // Toggle behaviour: if already compared, clicking removes.
        if (icon.classList.contains("show")) {
            await removeFromCompare(productId);
        } else {
            await addToCompare(productId, icon);
        }
    });

    // ---------- Kick off on load ----------
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => loadCompare());
    } else {
        loadCompare();
    }

    // Expose max items for pages that want to show/hide the "add more" CTA.
    window.COMPARE_MAX_ITEMS = MAX_ITEMS;
})();
