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


async function viewEnquiry(id) {

    const modal = new bootstrap.Modal(
        document.getElementById('enquiryDetailModal')
    );

    document.getElementById("enquiryDetailBody").innerHTML =
        '<p class="text-muted">Loading...</p>';

    modal.show();

    try {

        const token = localStorage.getItem("superadminToken");

        const response = await fetch(
            `https://api.workarya.com/api/enquiry/get-by-id/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        console.log("Status:", response.status);

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const result = await response.json();

        console.log("API Response:", result);

        // Agar API { data: {...} } return karti hai
        const data = result.data || result;

        document.getElementById("enquiryDetailBody").innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-2">
                    <strong>Name:</strong> ${data.name || '-'}
                </div>

                <div class="col-md-6 mb-2">
                    <strong>Email:</strong> ${data.email || '-'}
                </div>
                <div class="col-md-6 mb-2">
                    <strong>Topic:</strong> ${data.topic || '-'}
                </div>


                <div class="col-md-6 mb-2">
                    <strong>Phone:</strong> ${data.phone || '-'}
                </div>

                <div class="col-12">
                    <strong>Message:</strong><br>
                    ${data.message || '-'}
                </div>
            </div>
        `;

    } catch (error) {

        console.error("API Error:", error);

        document.getElementById("enquiryDetailBody").innerHTML = `
            <div class="alert alert-danger">
                ${error.message}
            </div>
        `;
    }
}
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
