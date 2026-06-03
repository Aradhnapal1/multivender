const ENQUIRY_API = "https://api.workarya.com/api/enquiry/all-enquery";

function getEnquiryId(item) {
    return item?.id || item?._id || "";
}

function getAuthHeaders() {
    const token = localStorage.getItem("superadminToken");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
}

function parseEnquiryList(json) {
    if (Array.isArray(json)) return json;
    if (Array.isArray(json?.data)) return json.data;
    if (Array.isArray(json?.data?.data)) return json.data.data;
    return [];
}

function statusBadge(status) {
    const s = (status || "NEW").toUpperCase();
    let cls = "bg-secondary-subtle text-secondary";
    if (s === "NEW") cls = "bg-info-subtle text-info";
    else if (s === "RESOLVED" || s === "CLOSED") cls = "bg-success-subtle text-success";
    else if (s === "IN_PROGRESS" || s === "PENDING") cls = "bg-warning-subtle text-warning";
    return `<span class="badge ${cls} p-1">${s}</span>`;
}

function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

async function loadEnquiries() {
    const tbody = document.getElementById("allEnquiries");
    if (!tbody) return;

    const token = localStorage.getItem("superadminToken");
    if (!token) {
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Please log in as super admin.</td></tr>`;
        return;
    }

    tbody.innerHTML = `<tr><td colspan="8" class="text-center">Loading enquiries...</td></tr>`;

    try {
        const res = await fetch(ENQUIRY_API, { headers: getAuthHeaders() });
        const json = await res.json().catch(() => ({}));
        const list = parseEnquiryList(json);

        tbody.innerHTML = "";
        if (!list.length) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center">No enquiries found.</td></tr>`;
            return;
        }

        list.forEach((item, index) => {
            const id = getEnquiryId(item);
            const created = item.createdAt || item.createDate || item.created_at || "";
            const dateStr = created ? new Date(created).toLocaleString() : "-";

            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${escapeHtml(item.name)}</td>
                    <td>${escapeHtml(item.email)}</td>
                    <td>${escapeHtml(item.phone)}</td>
                    <td>${escapeHtml(item.topic)}</td>
                    <td class="text-truncate" style="max-width:200px;" title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</td>
                    <td>${statusBadge(item.status)}</td>
                    <td class="table-action text-nowrap">
                        <a href="javascript:void(0);" class="action-icon me-1" title="View" onclick="viewEnquiry('${id}')">
                            <i class="mdi mdi-eye-outline text-primary"></i>
                        </a>
                        <a href="javascript:void(0);" class="action-icon" title="Delete" onclick="deleteEnquiry('${id}')">
                            <i class="mdi mdi-trash-can text-danger"></i>
                        </a>
                    </td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Enquiry load error:", err);
        tbody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Failed to load enquiries.</td></tr>`;
    }
}

window.viewEnquiry = async function (id) {
    if (!id) return;
    const token = localStorage.getItem("superadminToken");
    if (!token) return;

    const modalEl = document.getElementById("enquiryDetailModal");
    const bodyEl = document.getElementById("enquiryDetailBody");
    if (!modalEl || !bodyEl) return;

    bodyEl.innerHTML = `<p class="text-center text-muted mb-0">Loading...</p>`;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();

    try {
        const res = await fetch(`https://api.workarya.com/api/enquiry/get-by-id/${encodeURIComponent(id)}`, {
            headers: getAuthHeaders()
        });
        const json = await res.json().catch(() => ({}));
        const item = json?.data || json;

        if (!res.ok || !item || typeof item !== "object") {
            bodyEl.innerHTML = `<p class="text-danger mb-0">${escapeHtml(json.message || "Failed to load enquiry details.")}</p>`;
            return;
        }

        const created = item.createdAt || item.createDate || item.created_at || "";
        bodyEl.innerHTML = `
            <dl class="row mb-0">
                <dt class="col-sm-3">Name</dt><dd class="col-sm-9">${escapeHtml(item.name)}</dd>
                <dt class="col-sm-3">Email</dt><dd class="col-sm-9"><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></dd>
                <dt class="col-sm-3">Phone</dt><dd class="col-sm-9">${escapeHtml(item.phone)}</dd>
                <dt class="col-sm-3">Topic</dt><dd class="col-sm-9">${escapeHtml(item.topic)}</dd>
                <dt class="col-sm-3">Status</dt><dd class="col-sm-9">${statusBadge(item.status)}</dd>
                <dt class="col-sm-3">Date</dt><dd class="col-sm-9">${created ? new Date(created).toLocaleString() : "-"}</dd>
                <dt class="col-sm-3">Message</dt><dd class="col-sm-9">${escapeHtml(item.message)}</dd>
            </dl>
        `;
    } catch (err) {
        console.error("Enquiry detail error:", err);
        bodyEl.innerHTML = `<p class="text-danger mb-0">Something went wrong.</p>`;
    }
};

window.deleteEnquiry = async function (id) {
    if (!id) return;

    const confirmDel = await Swal.fire({
        title: "Delete enquiry?",
        text: "This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#6c757d",
        confirmButtonText: "Yes, delete"
    });

    if (!confirmDel.isConfirmed) return;

    try {
        const res = await fetch(`https://api.workarya.com/api/enquiry/delete-enquiry/${encodeURIComponent(id)}`, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
            Swal.fire("Deleted", data.message || "Enquiry deleted successfully.", "success");
            loadEnquiries();
        } else {
            Swal.fire("Error", data.message || "Failed to delete enquiry.", "error");
        }
    } catch (err) {
        console.error("Enquiry delete error:", err);
        Swal.fire("Error", "Something went wrong.", "error");
    }
};

document.addEventListener("DOMContentLoaded", loadEnquiries);
