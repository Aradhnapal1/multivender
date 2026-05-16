
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("superadminToken");
    if (!token) return;

    const BASE_URL = "https://api.workarya.com/api/pincode";

    // ==============================================================
    // 1. List Pincodes & Delete
    // ==============================================================
    const pincodeTable = document.getElementById("allPincodes");
    if (pincodeTable) {
        loadPincodes();
    }

    async function loadPincodes() {
        pincodeTable.innerHTML = `<tr><td colspan="8" class="text-center">Loading pincodes...</td></tr>`;
        try {
            const res = await fetch(`${BASE_URL}/list`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const json = await res.json();
            let data = [];
            
            if (json.success && json.data) data = json.data;
            else if (Array.isArray(json)) data = json;
            
            pincodeTable.innerHTML = "";
            if (data.length === 0) {
                pincodeTable.innerHTML = `<tr><td colspan="8" class="text-center">No pincodes found.</td></tr>`;
                return;
            }
            
            data.forEach((item, index) => {
                const serviceableBadge = item.isServiceable 
                    ? `<span class="badge bg-success-subtle text-success p-1">Yes</span>` 
                    : `<span class="badge bg-danger-subtle text-danger p-1">No</span>`;
                    
                pincodeTable.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.pincode}</td>
                        <td>${item.state}</td>
                        <td>${item.city}</td>
                        <td>${serviceableBadge}</td>
                        <td>${item.deliveryDays || 0}</td>
                        <td class="table-action"><a href="edit-pincode.php?id=${item.id}" class="action-icon"><i class="mdi mdi-square-edit-outline"></i></a></td>
                        <td class="table-action"><a href="javascript:void(0);" onclick="deletePincode('${item.id}')" class="action-icon"><i class="mdi mdi-trash-can text-danger"></i></a></td>
                    </tr>
                `;
            });
        } catch (e) {
            console.error("Error loading pincodes:", e);
            pincodeTable.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Failed to load pincodes.</td></tr>`;
        }
    }

    window.deletePincode = async function (id) {
        const confirmDel = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
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
                    Swal.fire("Deleted!", "Pincode deleted successfully.", "success");
                    loadPincodes();
                } else {
                    Swal.fire("Error", data.message || "Failed to delete pincode", "error");
                }
            } catch (e) {
                console.error(e);
                Swal.fire("Error", "Something went wrong.", "error");
            }
        }
    };

    // ==============================================================
    // 2. Add Pincode Logic
    // ==============================================================
    const addBtn = document.getElementById("addPincodeBtn");
    if (addBtn) {
        addBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitPincodeForm("POST", `${BASE_URL}/add`, addBtn, "Add Pincode");
        });
    }

    // ==============================================================
    // 3. Edit Pincode Logic
    // ==============================================================
    const editBtn = document.getElementById("editPincodeBtn");
    if (editBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            // Load existing item details
            fetch(`${BASE_URL}/list`, { headers: { "Authorization": `Bearer ${token}` } })
                .then(r => r.json())
                .then(json => {
                    const data = json.data || json || [];
                    const item = data.find(d => d.id === id);
                    if (item) {
                        document.getElementById("pincodeValue").value = item.pincode;
                        document.getElementById("cityName").value = item.city;
                        document.getElementById("stateName").value = item.state;
                        document.getElementById("deliveryDays").value = item.deliveryDays;
                        document.getElementById("isServiceable").checked = item.isServiceable;
                        document.getElementById("toggleLabel").textContent = item.isServiceable ? "Serviceable" : "Not Serviceable";
                    }
                });
        }

        editBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitPincodeForm("PUT", `${BASE_URL}/update/${id}`, editBtn, "Update Pincode");
        });
    }

    // Reusable Form Submit Handler (used by both Add & Edit)
    async function submitPincodeForm(method, url, btnElement, originalBtnText) {
        btnElement.disabled = true;
        btnElement.textContent = "Saving...";
        
        const payload = {
            pincode: document.getElementById("pincodeValue").value.trim(),
            city: document.getElementById("cityName").value.trim(),
            state: document.getElementById("stateName").value.trim(),
            deliveryDays: parseInt(document.getElementById("deliveryDays").value) || 0,
            isServiceable: document.getElementById("isServiceable").checked
        };

        if (!payload.pincode || !payload.city || !payload.state) {
            Swal.fire("Warning", "Please fill all required fields", "warning");
            btnElement.disabled = false;
            btnElement.textContent = originalBtnText;
            return;
        }

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
                await Swal.fire("Success", `Pincode successfully ${method === 'POST' ? 'added' : 'updated'}`, "success");
                window.location.href = "pincode.php";
            } else {
                Swal.fire("Error", data.message || "Failed to save pincode", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong while saving", "error");
        } finally {
            btnElement.disabled = false;
            btnElement.textContent = originalBtnText;
        }
    }

    // ==============================================================
    // 4. Input Toggle label listener
    // ==============================================================
    const toggle = document.getElementById("isServiceable");
    const label = document.getElementById("toggleLabel");
    if (toggle && label) {
        toggle.addEventListener("change", function () {
            label.textContent = this.checked ? "Serviceable" : "Not Serviceable";
        });
    }
});