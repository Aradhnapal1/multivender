document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("superadminToken");
    if (!token) return;

    const BASE_URL = "https://api.workarya.com/api/coupon";

    // ==============================================================
    // 1. List Coupons & Delete
    // ==============================================================
    const couponTable = document.getElementById("allCoupons");
    if (couponTable) {
        loadCoupons();
    }

    async function loadCoupons() {
        couponTable.innerHTML = `<tr><td colspan="6" class="text-center">Loading coupons...</td></tr>`;
        try {
            const res = await fetch(`${BASE_URL}/list`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const json = await res.json();
            let data = [];
            
            if (json.success && json.data) data = json.data;
            else if (Array.isArray(json)) data = json;
            
            couponTable.innerHTML = "";
            if (data.length === 0) {
                couponTable.innerHTML = `<tr><td colspan="6" class="text-center">No coupons found.</td></tr>`;
                return;
            }
            
            data.forEach((item, index) => {
                couponTable.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td><span class="badge bg-dark px-2 py-1">${item.code}</span></td>
                        <td class="text-capitalize">${item.type || item.discountType || 'N/A'}</td>
                        <td>${item.value || item.discountValue || 0}</td>
                        <td class="table-action"><a href="edit-coupon.php?id=${item.id}" class="action-icon"><i class="mdi mdi-square-edit-outline"></i></a></td>
                        <td class="table-action"><a href="javascript:void(0);" onclick="deleteCoupon('${item.id}')" class="action-icon"><i class="mdi mdi-trash-can text-danger"></i></a></td>
                    </tr>
                `;
            });
        } catch (e) {
            console.error("Error loading coupons:", e);
            couponTable.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Failed to load coupons.</td></tr>`;
        }
    }

    window.deleteCoupon = async function (id) {
        const confirmDel = await Swal.fire({
            title: "Are you sure?",
            text: "This coupon will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Delete it!"
        });

        if (confirmDel.isConfirmed) {
            try {
                const res = await fetch(`${BASE_URL}/delete/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    Swal.fire("Deleted!", "Coupon deleted successfully.", "success");
                    loadCoupons();
                } else {
                    Swal.fire("Error", data.message || "Failed to delete coupon", "error");
                }
            } catch (e) {
                console.error(e);
                Swal.fire("Error", "Something went wrong.", "error");
            }
        }
    };

    // ==============================================================
    // 2. Add Coupon Logic
    // ==============================================================
    const addBtn = document.getElementById("addCouponBtn");
    if (addBtn) {
        addBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitCouponForm("POST", `${BASE_URL}/add`, addBtn, "Add Coupon");
        });
    }

    // ==============================================================
    // 3. Edit Coupon Logic
    // ==============================================================
    const editBtn = document.getElementById("editCouponBtn");
    if (editBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            // Load existing details from List endpoint based on id
            fetch(`${BASE_URL}/list`, { headers: { "Authorization": `Bearer ${token}` } })
                .then(r => r.json())
                .then(json => {
                    const data = json.data || json || [];
                    const item = data.find(d => d.id === id);
                    if (item) {
                        document.getElementById("couponCode").value = item.code || '';
                        document.getElementById("description").value = item.description || '';
                        document.getElementById("discountType").value = item.type || item.discountType || 'percentage';
                        document.getElementById("discountValue").value = item.value || item.discountValue || '';
                        document.getElementById("minOrderAmount").value = item.minOrderAmount || '';
                        document.getElementById("maxDiscountAmount").value = item.maxDiscountAmount || '';
                        document.getElementById("usageLimit").value = item.usageLimit || '';
                        
                        if (item.startDate) document.getElementById("startDate").value = item.startDate.substring(0, 16);
                        if (item.endDate) document.getElementById("endDate").value = item.endDate.substring(0, 16);
                        
                        if (item.applicableOn && item.applicableOn !== "all") {
                            document.getElementById("applicableOn").value = item.applicableOn;
                        }
                    }
                });
        }

        editBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitCouponForm("PUT", `${BASE_URL}/update/${id}`, editBtn, "Update Coupon");
        });
    }

    // Reusable Form Submit Logic
    async function submitCouponForm(method, url, btnElement, originalBtnText) {
        const applicableOnValue = document.getElementById("applicableOn").value.trim();
        
        let startD = document.getElementById("startDate").value;
        if (startD && startD.length === 16) startD += ":00"; // Append seconds to match ISO format
        
        let endD = document.getElementById("endDate").value;
        if (endD && endD.length === 16) endD += ":00"; // Append seconds

        const payload = {
            code: document.getElementById("couponCode").value.trim(),
            description: document.getElementById("description").value.trim(),
            discountType: document.getElementById("discountType").value,
            discountValue: parseFloat(document.getElementById("discountValue").value) || 0,
            minOrderAmount: parseFloat(document.getElementById("minOrderAmount").value) || 0,
            maxDiscountAmount: parseFloat(document.getElementById("maxDiscountAmount").value) || 0,
            usageLimit: parseInt(document.getElementById("usageLimit").value) || 0,
            startDate: startD,
            endDate: endD,
            applicableOn: applicableOnValue ? applicableOnValue : "all",
            productIds: []
        };

        if (!payload.code || !payload.discountValue || !payload.startDate || !payload.endDate) {
            Swal.fire("Warning", "Please fill in all required fields.", "warning");
            return;
        }

        btnElement.disabled = true;
        btnElement.textContent = "Saving...";

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            
            const data = await res.json();
            
            if (res.ok) {
                await Swal.fire("Success", `Coupon successfully ${method === 'POST' ? 'added' : 'updated'}`, "success");
                window.location.href = "coupon.php";
            } else {
                Swal.fire("Error", data.message || "Failed to save coupon", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong while saving", "error");
        } finally {
            btnElement.disabled = false;
            btnElement.textContent = originalBtnText;
        }
    }
});