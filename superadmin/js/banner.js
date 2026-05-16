// ====================== COMMON SETUP ======================
const BASE = "https://api.workarya.com";

function getToken() {
    return localStorage.getItem("superadminToken");
}

function getBannerPlacement(banner) {
    const raw = banner?.placement ?? banner?.position ?? banner?.section ?? banner?.showIn ?? banner?.bannerPlacement;
    const normalized = String(raw || "").toLowerCase().trim();
    if (["top", "middle", "bottom"].includes(normalized)) return normalized;

    // Fallback for older records where placement may be saved in title accidentally.
    const titleGuess = String(banner?.title || "").toLowerCase().trim();
    if (["top", "middle", "bottom"].includes(titleGuess)) return titleGuess;
    return "top";
}

function getBannerActive(banner) {
    return Boolean(banner?.isActive ?? banner?.is_active ?? banner?.active);
}

function getBannerId(banner) {
    return banner?.id ?? banner?._id ?? "";
}

// ====================== BANNER LIST PAGE ======================
async function loadBanners() {
    if (!document.getElementById("allbanner")) return; // Safety: only run on list page

    try {
        const token = getToken();
        if (!token) return;

        const res = await fetch(`${BASE}/api/banner/list`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to load banners");

        const banners = await res.json();
        const tbody = document.getElementById("allbanner");
        tbody.innerHTML = "";

        banners.forEach((b, index) => {
            const bannerId = getBannerId(b);
            const isActive = getBannerActive(b);
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>
                        <img src="${window.resolveApiMediaUrl ? window.resolveApiMediaUrl(b.image) : (BASE + b.image)}" height="48" class="rounded me-3" alt="Banner"/>
                    </td>
                    <td>
                        <p class="m-0 font-16">${b.link ?? "-"}</p>
                    </td>
                    <td>
                        <span class="badge ${getBannerPlacement(b) === 'middle' ? 'bg-success-subtle text-success' : 'bg-light text-muted'} p-1">
                            ${getBannerPlacement(b) === "middle" ? "Yes" : "No"}
                        </span>
                    </td>
                    <td>
                        <span class="badge ${getBannerPlacement(b) === 'bottom' ? 'bg-success-subtle text-success' : 'bg-light text-muted'} p-1">
                            ${getBannerPlacement(b) === "bottom" ? "Yes" : "No"}
                        </span>
                    </td>
                    <td>${b.title}</td>
                    <td>
                        <span class="badge ${isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} p-1">
                            ${isActive ? "Published" : "Unpublished"}
                        </span>
                    </td>
                    <td class="table-action">
                        <a href="edit-banner.php?id=${bannerId}" class="action-icon">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </a>
                    </td>
                    <td class="table-action">
                        <a href="javascript:void(0);" class="action-icon delete-banner" data-id="${bannerId}">
                            <i class="mdi mdi-delete"></i>
                        </a>
                    </td>
                </tr>
            `;
        });

    } catch (err) {
        console.error("Load Banners Error:", err);
        Swal.fire("Error", "Failed to load banners", "error");
    }
}

// ====================== DELETE BANNER ======================
document.addEventListener("click", async function (e) {
    const deleteBtn = e.target.closest(".delete-banner");
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    const token = getToken();

    const confirmDelete = await Swal.fire({
        title: "Delete Banner?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete"
    });

    if (!confirmDelete.isConfirmed) return;

    try {
        const res = await fetch(`${BASE}/api/banner/delete/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();
        console.log("DELETE RAW:", text);

        let result = {};
        try { result = JSON.parse(text); } catch (e) {}

        if (res.ok || result.success === true || result.status === true) {
            Swal.fire("Deleted!", "Banner removed successfully", "success");
            loadBanners(); // Refresh list
        } else {
            throw new Error(result.message || "Delete failed");
        }
    } catch (err) {
        console.error("Delete Error:", err);
        Swal.fire("Error", err.message || "Delete failed", "error");
    }
});

// ====================== ADD BANNER ======================
document.addEventListener("click", async function (e) {
    if (!e.target.closest("#addBannerBtn")) return;

    const token = getToken();
    const title = document.getElementById("bannerName").value.trim();
    const link = document.getElementById("bannerDescription").value.trim();
    const placement = document.getElementById("bannerPlacement")?.value || "top";
    const imageFile = document.getElementById("bannerImage").files[0];
    const isActive = document.getElementById("isActive").checked;

    if (!title || !imageFile) {
        Swal.fire("Error", "Title and Image are required", "error");
        return;
    }

    const fd = new FormData();
    fd.append("Title", title);
    fd.append("Link", link);
    fd.append("Placement", placement);
    fd.append("placement", placement);
    fd.append("Position", placement);
    fd.append("Image", imageFile);
    fd.append("IsActive", isActive);
    fd.append("is_active", isActive ? "true" : "false");

    try {
        const res = await fetch(`${BASE}/api/banner/create`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd
        });

        if (!res.ok) throw new Error();

        Swal.fire("Success", "Banner added successfully", "success")
            .then(() => {
                window.location.href = "banner.php";
            });

    } catch (err) {
        Swal.fire("Error", "Failed to create banner", "error");
    }
});

// ====================== EDIT BANNER PAGE ======================
let bannerId = null;

function initEditPage() {
    if (!document.getElementById("editBannerBtn")) return; // Only run on edit page

    const urlParams = new URLSearchParams(window.location.search);
    bannerId = urlParams.get("id");

    if (!bannerId) {
        Swal.fire({
            title: "Error",
            text: "Banner ID not found in URL!",
            icon: "error"
        });
        return;
    }

    loadBannerForEdit();
}

async function loadBannerForEdit() {
    const token = getToken();
    if (!token) {
        Swal.fire("Error", "Token not found. Please login again.", "error");
        return;
    }

    try {
        const res = await fetch(`${BASE}/api/banner/list`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error();

        const banners = await res.json();
        const banner = banners.find(b => String(getBannerId(b)) === String(bannerId));

        if (!banner) {
            Swal.fire("Error", "Banner not found", "error");
            return;
        }

        // Fill form
        document.getElementById("bannerName").value = banner.title || "";
        document.getElementById("bannerDescription").value = banner.link || "";
        const placementSelect = document.getElementById("bannerPlacement");
        if (placementSelect) {
            placementSelect.value = getBannerPlacement(banner);
        }

        const isActiveCheckbox = document.getElementById("isActive");
        if (isActiveCheckbox) isActiveCheckbox.checked = getBannerActive(banner);

        const toggleLabel = document.getElementById("toggleLabel");
        if (toggleLabel) toggleLabel.textContent = getBannerActive(banner) ? "Active" : "Inactive";

        // Show existing image preview
        if (banner.image) {
            const preview = document.getElementById("previewImage");
            const placeholder = document.getElementById("placeholderText");
            if (preview) {
                preview.src = window.resolveApiMediaUrl ? window.resolveApiMediaUrl(banner.image) : (BASE + banner.image);
                preview.style.display = "block";
            }
            if (placeholder) placeholder.style.display = "none";
        }

    } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load banner details", "error");
    }
}

// ====================== UPDATE BANNER ======================
document.addEventListener("click", async function (e) {
    if (!e.target.closest("#editBannerBtn")) return;

    if (!bannerId) {
        Swal.fire("Error", "Banner ID is missing", "error");
        return;
    }

    const token = getToken();
    const title = document.getElementById("bannerName").value.trim();
    const link = document.getElementById("bannerDescription").value.trim();
    const placement = document.getElementById("bannerPlacement")?.value || "top";
    const imageFile = document.getElementById("bannerImage").files[0];
    const isActive = document.getElementById("isActive").checked;

    if (!title) {
        Swal.fire("Error", "Banner Name is required", "error");
        return;
    }

    function buildUpdateFormData() {
        const fd = new FormData();
        fd.append("id", bannerId);
        fd.append("Id", bannerId);
        fd.append("bannerId", bannerId);
        fd.append("BannerId", bannerId);
        fd.append("Title", title);
        fd.append("title", title);
        fd.append("Link", link || "");
        fd.append("link", link || "");
        fd.append("Placement", placement);
        fd.append("placement", placement);
        fd.append("Position", placement);
        fd.append("IsActive", isActive ? "true" : "false");
        fd.append("isActive", isActive ? "true" : "false");
        fd.append("is_active", isActive ? "true" : "false");
        if (imageFile) fd.append("Image", imageFile);
        return fd;
    }

    async function tryUpdate(method, url) {
        const res = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json"
            },
            body: buildUpdateFormData()
        });

        const text = await res.text();
        let json = {};
        try { json = JSON.parse(text); } catch (_) {}
        const ok = res.ok || json.success === true || json.status === true || json.Success === true;
        return { ok, res, text, json };
    }

    try {
        // Some backends support PUT, some still use POST for multipart updates.
        let attempt = await tryUpdate("PUT", `${BASE}/api/banner/update`);
        if (!attempt.ok) {
            attempt = await tryUpdate("POST", `${BASE}/api/banner/update`);
        }
        if (!attempt.ok) {
            attempt = await tryUpdate("POST", `${BASE}/api/banner/update/${bannerId}`);
        }

        console.log("UPDATE ATTEMPT RESULT:", attempt.res.status, attempt.text);

        if (attempt.ok) {
            Swal.fire("Success", "Banner updated successfully", "success").then(() => {
                window.location.href = "banner.php";
            });
            return;
        }

        const serverMsg =
            attempt.json?.message ||
            attempt.json?.Message ||
            attempt.json?.error ||
            attempt.text ||
            `Update failed (${attempt.res.status})`;
        throw new Error(serverMsg);
    } catch (err) {
        console.error("Update Error:", err);
        Swal.fire("Error", String(err.message || "Failed to update banner"), "error");
    }
});

// ====================== INITIALIZE EVERYTHING ======================
document.addEventListener("DOMContentLoaded", function () {
    loadBanners();   // Works only on list page
    initEditPage();  // Works only on edit page
});