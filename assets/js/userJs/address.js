document.addEventListener("DOMContentLoaded", function () {

    const saveBtn = document.getElementById("saveAddressBtn");

    saveBtn.addEventListener("click", async function () {

        // 1. Form Validation
        if (!validateAddressForm()) {
            Swal.fire({
                title: "Validation Error",
                text: "Please fill all required fields correctly",
                icon: "error"
            });
            return;
        }

        // 2. Get User Token
        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
            Swal.fire({
                title: "Login Required",
                text: "Please login to save address",
                icon: "warning"
            });
            return;
        }

        // 3. Prepare Payload
        const payload = {
            fullName: document.getElementById("fullName").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim(),
            addressLine1: document.getElementById("addressLine1").value.trim(),
            addressLine2: document.getElementById("addressLine2").value.trim() || "",
            city: document.getElementById("city").value.trim(),
            state: document.getElementById("state").value.trim(),
            country: document.getElementById("country").value,
            postalCode: document.getElementById("postalCode").value.trim(),
            addressType: document.getElementById("addressType").value.trim(),
            isDefault: true
        };

        // Disable button + loading
        saveBtn.disabled = true;
        saveBtn.innerHTML = 'Saving... <span class="spinner-border spinner-border-sm"></span>';

        try {
            // ==================== 1. ADD ADDRESS API ====================
            const addResponse = await fetch(`https://api.workarya.com/api/address/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + userToken
                },
                body: JSON.stringify(payload)
            });

            if (!addResponse.ok) {
                const errorText = await addResponse.text();
                throw new Error(errorText || "Failed to save address");
            }

            const result = await addResponse.json();

            // ==================== 2. REFRESH ADDRESS LIST ====================
            await loadSavedAddresses();   // ← This will call the list API again

            // ✅ Success Message
            Swal.fire({
                title: "Address Saved!",
                text: "Your address has been saved successfully.",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                timerProgressBar: true
            });

            // Reset Form
            clearAddressFormFields();

        } catch (error) {
            console.error("API Error:", error);

            Swal.fire({
                title: "Failed",
                text: error.message || "Something went wrong. Please try again.",
                icon: "error"
            });
        } finally {
            // Reset button
            saveBtn.disabled = false;
            saveBtn.innerHTML = "Save Address";
        }
    });
});

// ====================== VALIDATION ======================
function validateAddressForm() {
    let isValid = true;
    clearAllErrors();

    const fields = ["fullName", "phoneNumber", "city", "state", "postalCode", "country", "addressType", "addressLine1"];

    fields.forEach(field => {
        const value = document.getElementById(field).value.trim();
        if (value === "") {
            showError(field + "Error", "This field is required");
            isValid = false;
        }
    });

    // Phone validation
    const phone = document.getElementById("phoneNumber").value.trim();
    if (!/^[6-9]\d{9}$/.test(phone)) {
        showError("phoneNumberError", "Enter valid 10-digit mobile number");
        isValid = false;
    }

    return isValid;
}

// ====================== CLEAR FORM FIELDS ======================
function clearAddressFormFields() {
    document.getElementById("fullName").value = "";
    document.getElementById("phoneNumber").value = "";
    document.getElementById("addressLine1").value = "";
    document.getElementById("addressLine2").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("postalCode").value = "";
    document.getElementById("addressType").value = "";

    // Optional: Reset country to default
    // document.getElementById("country").value = "India";

    clearAllErrors();
}

// ====================== ERROR FUNCTIONS ======================
function showError(errorId, message) {
    const el = document.getElementById(errorId);
    if (el) {
        el.textContent = message;
        el.style.display = "block";
    }
}

function clearAllErrors() {
    document.querySelectorAll('.invalid-feedback').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// ================================================ LOAD SAVED ADDRESSES ================================================



async function loadSavedAddresses() {
    const container = document.getElementById("addressListContainer");
    const loadingEl = document.getElementById("addressLoading");

    const userToken = localStorage.getItem("userToken");
    if (!userToken) {
        container.innerHTML = `<p class="text-danger text-center py-3">Please login to view addresses.</p>`;
        return;
    }

    // Show loading while fetching
    if (loadingEl) loadingEl.style.display = "block";

    try {
        const response = await fetch("https://api.workarya.com/api/address/list", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + userToken
            }
        });

        if (!response.ok) {
            throw new Error("Failed to load addresses");
        }

        const addresses = await response.json();

        if (loadingEl) loadingEl.style.display = "none";

        if (!addresses || addresses.length === 0) {
            container.innerHTML = `<p class="text-muted text-center py-4">No saved addresses found.</p>`;
            return;
        }

        let html = '';

        addresses.forEach((addr, index) => {
            const collapseId = `savedAddr${index}`;
            const radioId = `addressRadio${index}`;
            const isFirst = index === 0;
            const actualId = addr._id || addr.id;

            const fullAddress = [
                addr.addressLine1,
                addr.addressLine2
            ].filter(Boolean).join(", ");

            html += `
                <div class="accordion-item">
                    <div class="accordion-header ${isFirst ? '' : 'collapsed'}" 
                         data-bs-toggle="collapse" 
                         data-bs-target="#${collapseId}">
                        <div class="form-check">
                            <input class="form-check-input" 
                                   name="selectedAddressRadio" 
                                   type="radio" 
                                   id="${radioId}" 
                                   value="${actualId}"
                                   data-address-id="${actualId}"
                                   ${isFirst ? 'checked' : ''}>
                            <label class="form-check-label" for="${radioId}">
                                <span class="circle"></span> 
                                ${addr.addressType || 'Home'}
                            </label>
                        </div>
                    </div>
                    
                    <div id="${collapseId}" 
                         class="accordion-collapse collapse ${isFirst ? 'show' : ''}" 
                         data-bs-parent="#savedAddressAccordion">
                        <div class="accordion-body">
                            <h5 class="fw-bold mb-2">${addr.fullName}</h5>
                            <p class="mb-1">
                                <i class="ri-map-pin-line"></i> ${fullAddress}
                            </p>
                            <p class="mb-1">
                                ${addr.city}, ${addr.state} - ${addr.postalCode}, ${addr.country}
                            </p>
                            <p class="mb-0">
                                <i class="ri-phone-line"></i> Phone: ${addr.phoneNumber}
                            </p>
                            
                            <div class="mt-3 pt-2 border-top">
                                <button class="btn btn-sm btn-outline-primary edit-btn" 
                                        data-id="${addr.id}">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        container.innerHTML = html;

    } catch (error) {
        console.error("Error loading addresses:", error);
        if (loadingEl) loadingEl.style.display = "none";
        container.innerHTML = `
            <p class="text-danger text-center py-4">
                Failed to load addresses.<br>
                <small>Please try again later.</small>
            </p>`;
    }
}

// ====================== Initial Load ======================
document.addEventListener("DOMContentLoaded", function () {
    loadSavedAddresses();
});
