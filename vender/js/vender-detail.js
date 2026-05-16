document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("vendorToken");
    const API_BASE = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");

    const personalForm = document.getElementById("personalDetailsForm");
    const businessForm = document.getElementById("businessProfileForm");
    const bankForm = document.getElementById("bankDetailsForm");

    const personalSaveBtn = document.getElementById("savePersonalDetailsBtn");
    const businessSaveBtn = document.getElementById("saveBusinessProfileBtn");
    const bankSaveBtn = document.getElementById("saveBankDetailsBtn");
    const vendorPasswordForm = document.getElementById("vendorPasswordForm");
    const vendorPasswordSaveBtn = document.getElementById("vendorPasswordSaveBtn");

    let cachedProfile = null;
    let cachedBusiness = null;
    let cachedBank = null;

    function authHeaders(extraHeaders) {
        return Object.assign(
            {
                Authorization: "Bearer " + token
            },
            extraHeaders || {}
        );
    }

    function getData(payload) {
        if (!payload) return null;
        if (payload.data !== undefined && payload.data !== null) return getData(payload.data);
        if (payload.Data !== undefined && payload.Data !== null) return getData(payload.Data);
        if (payload.result !== undefined && payload.result !== null) return getData(payload.result);
        if (payload.Result !== undefined && payload.Result !== null) return getData(payload.Result);
        return payload;
    }

    function firstRow(entity) {
        if (Array.isArray(entity)) return entity[0] || null;
        return entity;
    }

    function hasEntityId(entity) {
        const row = firstRow(entity);
        if (!row) return false;
        return !!(row.id || row.vendorId);
    }

    function showMessage(title, text, icon) {
        if (window.Swal) {
            Swal.fire({
                title: title,
                text: text,
                icon: icon || "info"
            });
            return;
        }
        alert(text);
    }

    function showValidationError(form, entityName) {
        if (!form) return;
        var invalidField = form.querySelector(":invalid");
        var fieldLabel = "";
        if (invalidField) {
            var fieldId = invalidField.id;
            var label = fieldId ? document.querySelector('label[for="' + fieldId + '"]') : null;
            fieldLabel = label ? label.textContent.replace(/\*/g, "").trim() : "";
            invalidField.focus();
        }
        var message = fieldLabel
            ? ("Please complete the required field: " + fieldLabel + ".")
            : ("Please complete all required " + entityName + " fields.");
        showMessage("Validation Error", message, "warning");
        form.reportValidity();
    }

    async function showSuccessAndRedirect(title, text, redirectUrl) {
        if (window.Swal) {
            await Swal.fire({
                title: title,
                text: text,
                icon: "success",
                confirmButtonText: "OK"
            });
        } else {
            alert(text);
        }
        window.location.href = redirectUrl;
    }

    async function safeJson(response) {
        try {
            return await response.json();
        } catch (error) {
            return null;
        }
    }

    async function fetchJson(url, options) {
        const response = await fetch(url, options || {});
        const payload = await safeJson(response);
        if (!response.ok) {
            const nestedMessage = payload && payload.data && (payload.data.message || payload.data.error)
                ? (payload.data.message || payload.data.error)
                : "";
            const message = payload && (payload.message || payload.error || nestedMessage)
                ? (payload.message || payload.error || nestedMessage)
                : ("Request failed with status " + response.status + ".");
            throw new Error(message);
        }
        return payload;
    }

    function splitName(fullName) {
        const name = (fullName || "").trim();
        if (!name) return { firstName: "", lastName: "" };
        const parts = name.split(/\s+/);
        return {
            firstName: parts.shift() || "",
            lastName: parts.join(" ")
        };
    }

    function getInputValue(id) {
        var el = document.getElementById(id);
        return el ? String(el.value || "").trim() : "";
    }

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null) {
            el.value = value;
            el.dispatchEvent(new Event("change", { bubbles: true }));
        }
    }

    function normalizeMediaUrl(value) {
        function deepFindUrl(input, depth) {
            if (!input || depth > 5) return "";
            if (typeof input === "string") {
                var s = input.trim();
                if (!s || s === "[object Object]") return "";
                return s;
            }
            if (Array.isArray(input)) {
                for (var i = 0; i < input.length; i++) {
                    var arrFound = deepFindUrl(input[i], depth + 1);
                    if (arrFound) return arrFound;
                }
                return "";
            }
            if (typeof input === "object") {
                var preferredKeys = [
                    "url", "Url", "value", "Value", "path", "Path",
                    "fileUrl", "FileUrl", "documentUrl", "DocumentUrl",
                    "src", "Src", "location", "Location"
                ];
                for (var k = 0; k < preferredKeys.length; k++) {
                    var key = preferredKeys[k];
                    if (input[key] !== undefined && input[key] !== null) {
                        var found = deepFindUrl(input[key], depth + 1);
                        if (found) return found;
                    }
                }
                var allKeys = Object.keys(input);
                for (var j = 0; j < allKeys.length; j++) {
                    var fallbackFound = deepFindUrl(input[allKeys[j]], depth + 1);
                    if (fallbackFound) return fallbackFound;
                }
            }
            return "";
        }

        var normalizedInput = value;
        if (normalizedInput && typeof normalizedInput === "object") {
            normalizedInput = deepFindUrl(normalizedInput, 0);
        }
        var raw = (normalizedInput || "").toString().trim();
        if (!raw || raw === "[object Object]") return "";
        if (/^https?:\/\//i.test(raw) || raw.indexOf("//") === 0) {
            return raw.indexOf("//") === 0 ? ("https:" + raw) : raw;
        }
        var base = API_BASE.replace(/\/$/, "");
        return base + (raw.indexOf("/") === 0 ? raw : ("/" + raw.replace(/^\/+/, "")));
    }

    function isImageUrl(url) {
        return /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(url || "");
    }

    function clearExistingFilePreview(inputId) {
        var input = document.getElementById(inputId);
        if (!input || !input.parentNode) return;
        var existing = input.parentNode.querySelector('[data-existing-preview-for="' + inputId + '"]');
        if (existing) existing.remove();
    }

    function renderExistingFilePreview(inputId, fileUrl, labelText) {
        var input = document.getElementById(inputId);
        var url = normalizeMediaUrl(fileUrl);
        if (!input || !input.parentNode) return;
        clearExistingFilePreview(inputId);
        if (!url) return;

        var wrapper = document.createElement("div");
        wrapper.setAttribute("data-existing-preview-for", inputId);
        wrapper.className = "mt-2";

        var link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "small text-primary d-inline-block";
        link.textContent = labelText || "View existing file";
        wrapper.appendChild(link);

        if (isImageUrl(url)) {
            var img = document.createElement("img");
            img.src = url;
            img.alt = "Existing file";
            img.style.maxWidth = "140px";
            img.style.maxHeight = "100px";
            img.style.display = "block";
            img.style.marginTop = "6px";
            img.style.objectFit = "cover";
            img.style.border = "1px solid #ddd";
            img.style.borderRadius = "6px";
            wrapper.appendChild(img);
        }

        input.parentNode.appendChild(wrapper);
        input.required = false;
    }

    async function loadProfile() {
        if (!token) return null;
        const payload = await fetchJson(API_BASE + "/vendor/profile", {
            method: "GET",
            headers: authHeaders()
        });
        cachedProfile = getData(payload);
        return cachedProfile;
    }

    async function loadBusiness() {
        if (!token) return null;
        const payload = await fetchJson(API_BASE + "/api/vendor/business/get", {
            method: "GET",
            headers: authHeaders()
        });
        cachedBusiness = getData(payload);
        return cachedBusiness;
    }

    async function loadBank(vendorId) {
        if (!token || !vendorId) return null;
        function pickChequeUrl(row) {
            if (!row) return "";
            return (
                row.cancelledChequeImage ||
                row.CancelledChequeImage ||
                row.cancelledChequeImageUrl ||
                row.CancelledChequeImageUrl ||
                ""
            );
        }
        let payload = null;
        try {
            payload = await fetchJson(API_BASE + "/api/bank/get/" + encodeURIComponent(vendorId), {
                method: "GET",
                headers: authHeaders()
            });
            cachedBank = getData(payload);

            // If detail endpoint omits cheque image, enrich from list endpoint.
            if (cachedBank && !pickChequeUrl(firstRow(cachedBank))) {
                const listPayload = await fetchJson(API_BASE + "/api/bank/get", {
                    method: "GET",
                    headers: authHeaders()
                });
                const listData = getData(listPayload);
                const rows = Array.isArray(listData) ? listData : (listData ? [listData] : []);
                const match = rows.find(function (row) {
                    const rowVendorId = row && (row.vendorId || row.VendorId || row.userId || row.UserId);
                    return String(rowVendorId || "") === String(vendorId);
                });
                if (match) {
                    cachedBank = Object.assign({}, match, firstRow(cachedBank));
                }
            }
        } catch (error) {
            // Fallback for API variants that expose /api/bank/get only.
            payload = await fetchJson(API_BASE + "/api/bank/get", {
                method: "GET",
                headers: authHeaders()
            });
            const bankData = getData(payload);
            const rows = Array.isArray(bankData) ? bankData : (bankData ? [bankData] : []);
            cachedBank = rows.find(function (row) {
                const rowVendorId = row && (row.vendorId || row.VendorId || row.userId || row.UserId);
                return String(rowVendorId || "") === String(vendorId);
            }) || firstRow(rows) || null;
        }
        return cachedBank;
    }

    function hydratePersonalForm(profile) {
        const row = firstRow(profile);
        if (!row || !personalForm) return;
        setValue("fullName", [row.firstName, row.lastName].filter(Boolean).join(" ").trim());
        setValue("email", row.email || "");
        setValue("mobileNumber", row.phoneNumber || "");
        setValue("address", row.address || "");
        renderExistingFilePreview("profileImage", row.profileImage, "View existing profile image");
    }

    async function hydrateBusinessForm(business) {
        const row = firstRow(business);
        if (!row || !businessForm) return;
        setValue("businessName", row.businessName || "");
        setValue("businessPhone", row.businessPhone || "");
        setValue("alternatePhone", row.alternatePhone || "");
        setValue("businessEmail", row.businessEmail || "");
        setValue("businessWebsite", row.websiteUrl || "");
        setValue("businessType", row.businessType || "");
        setValue("businessCategory", row.businessCategory || "");
        setValue("businessDescription", row.businessDescription || "");
        setValue("businessAddress", row.addressLine1 || "");
        setValue("businessAddressLine2", row.addressLine2 || "");
        setValue("businessCountry", row.country || "");
        // Wait so country/state/city dropdowns can populate from existing DOM listeners.
        await new Promise(function (resolve) { setTimeout(resolve, 350); });
        setValue("businessState", row.state || "");
        await new Promise(function (resolve) { setTimeout(resolve, 350); });
        setValue("businessCity", row.city || "");
        setValue("businessPincode", row.pincode || "");
        setValue("gstNumber", row.gstNumber || "");
        setValue("panNumber", row.panNumber || "");
        setValue("cinNumber", row.cinNumber || "");
        setValue("udyamRegistrationNumber", row.udyamRegistrationNumber || "");
        if (row.addressProofImageUrl) {
            var addressProofSelect = document.getElementById("addressProofType");
            if (addressProofSelect) {
                var apiAddressProofType = (row.addressProofType || "").trim();
                if (!apiAddressProofType) {
                    apiAddressProofType = "Already Uploaded";
                }
                var existingOption = Array.from(addressProofSelect.options || []).find(function (opt) {
                    return (opt.value || "").toLowerCase() === apiAddressProofType.toLowerCase();
                });
                if (!existingOption) {
                    var option = document.createElement("option");
                    option.value = apiAddressProofType;
                    option.textContent = apiAddressProofType;
                    addressProofSelect.appendChild(option);
                }
                setValue("addressProofType", apiAddressProofType);
                addressProofSelect.required = false;
            }
        }
        renderExistingFilePreview("gstPdf", row.gstDocumentUrl, "View existing GST document");
        renderExistingFilePreview("panImage", row.panDocumentUrl, "View existing PAN document");
        renderExistingFilePreview("cinCertificate", row.cinCertificateUrl, "View existing CIN certificate");
        renderExistingFilePreview("aadharImage", row.aadharDocumentUrl, "View existing Aadhar document");
        renderExistingFilePreview("addressProofImage", row.addressProofImageUrl, "View existing address proof");
        renderExistingFilePreview("businessLogo", row.businessLogoUrl, "View existing business logo");
    }

    function hydrateBankForm(bank) {
        const row = firstRow(bank);
        if (!row || !bankForm) return;
        setValue("accountHolderName", row.accountHolderName || row.AccountHolderName || "");
        setValue("bankName", row.bankName || row.BankName || "");
        setValue("accountNumber", row.accountNumber || row.AccountNumber || "");
        setValue("ifscCode", row.ifscCode || row.IFSCCode || "");
        setValue("branchName", row.branchName || row.BranchName || "");
        var chequeUrl =
            row.cancelledChequeImage ||
            row.CancelledChequeImage ||
            row.cancelledChequeImageUrl ||
            row.CancelledChequeImageUrl ||
            "";
        renderExistingFilePreview(
            "cancelledCheque",
            chequeUrl,
            "View existing cancelled cheque"
        );
    }

    function setText(id, value) {
        var el = document.getElementById(id);
        if (!el) return;
        el.textContent = value || "-";
    }

    function setLink(id, url, textFallback) {
        var el = document.getElementById(id);
        if (!el) return;
        var href = normalizeMediaUrl(url);
        if (!url) {
            el.textContent = textFallback || "-";
            el.setAttribute("href", "javascript:void(0)");
            el.classList.add("disabled");
            return;
        }
        el.textContent = url;
        el.setAttribute("href", href);
        el.classList.remove("disabled");
    }

    function hydrateProfilePage(profile, business, bank) {
        var profileRow = firstRow(profile);
        if (!profileRow) return;
        var businessRow = firstRow(business) || {};
        var bankRow = firstRow(bank) || {};
        var fullName = [profileRow.firstName, profileRow.lastName].filter(Boolean).join(" ").trim() || "Vendor";
        var location = [businessRow.city, businessRow.state, businessRow.country].filter(Boolean).join(", ");

        setText("vendorProfileName", fullName);
        setText("vendorProfileRole", "Authorized Brand Seller");
        setText("vendorProfileLocation", location || profileRow.address || "-");
        setText("vendorInfoName", fullName);
        setText("vendorInfoMobile", profileRow.phoneNumber || "-");
        setText("vendorInfoLocation", location || profileRow.address || "-");

        var emailLink = document.getElementById("vendorInfoEmail");
        if (emailLink) {
            var email = profileRow.email || "";
            emailLink.textContent = email || "-";
            emailLink.setAttribute("href", email ? ("mailto:" + email) : "javascript:void(0)");
        }

        var profileImage = document.getElementById("vendorProfileImage");
        if (profileImage && profileRow.profileImage) {
            profileImage.src = normalizeMediaUrl(profileRow.profileImage);
        }

        setValue("FirstName", profileRow.firstName || "");
        setValue("Lastname", profileRow.lastName || "");
        setValue("Email", profileRow.email || "");

        setText("vendorAboutName", fullName);
        setText("vendorAboutDesignation", (businessRow.businessType || "VENDOR PROFILE").toUpperCase());
        setText("vendorAboutDescription", businessRow.businessDescription || "Business description not available.");
        setLink("vendorContactWebsite", businessRow.websiteUrl, "-");
        setLink("vendorWebsiteBtn", businessRow.websiteUrl, "Visit Website");

        var contactEmail = document.getElementById("vendorContactEmail");
        if (contactEmail) {
            var businessEmail = businessRow.businessEmail || profileRow.email || "";
            contactEmail.textContent = businessEmail || "-";
            contactEmail.setAttribute("href", businessEmail ? ("mailto:" + businessEmail) : "javascript:void(0)");
        }

        setText("vendorContactPhone", businessRow.businessPhone || profileRow.phoneNumber || "-");
        setText("vendorContactBank", bankRow.bankName || bankRow.BankName || "-");
        setText("vendorContactAccountHolder", bankRow.accountHolderName || bankRow.AccountHolderName || "-");
        setText("vendorContactAccountNumber", bankRow.accountNumber || bankRow.AccountNumber || "-");
        setText("vendorContactIfsc", bankRow.ifscCode || bankRow.IFSCCode || "-");
        setText("vendorContactBranch", bankRow.branchName || bankRow.BranchName || "-");
    }

    function applyCompletionFlags(profile, business, bank) {
        if (hasEntityId(profile)) {
            sessionStorage.setItem("vendorPersonalDetailsDone", "true");
        }
        if (hasEntityId(business)) {
            sessionStorage.setItem("vendorBusinessDetailsDone", "true");
        }
        if (hasEntityId(bank)) {
            sessionStorage.setItem("vendorBankDetailsDone", "true");
        }
    }

    async function initData() {
        if (!token) return;
        try {
            const profile = await loadProfile();
            hydratePersonalForm(profile);
            let business = null;
            let bank = null;
            try {
                business = await loadBusiness();
                await hydrateBusinessForm(business);
            } catch (businessError) {
                // Business can be missing during onboarding.
                business = null;
            }
            try {
                const profileRow = firstRow(profile);
                const vendorId = profileRow && profileRow.vendorId ? profileRow.vendorId : "";
                bank = await loadBank(vendorId);
                hydrateBankForm(bank);
            } catch (bankError) {
                // Bank can be missing during onboarding.
                bank = null;
            }
            hydrateProfilePage(profile, business, bank);
            applyCompletionFlags(profile, business, bank);
        } catch (error) {
            console.error("Failed to load vendor onboarding data:", error);
        }
    }

    if (personalSaveBtn && personalForm) {
        personalSaveBtn.addEventListener("click", async function () {
            if (!personalForm.checkValidity()) {
                showValidationError(personalForm, "personal");
                return;
            }
            if (!token) {
                showMessage("Unauthorized", "Please login again.", "error");
                return;
            }
            const nameParts = splitName(document.getElementById("fullName").value);
            const payload = {
                email: document.getElementById("email").value.trim(),
                firstName: nameParts.firstName,
                lastName: nameParts.lastName,
                phoneNumber: document.getElementById("mobileNumber").value.trim(),
                address: document.getElementById("address").value.trim()
            };
            const profileImageInput = document.getElementById("profileImage");
            const profileImageFile = profileImageInput && profileImageInput.files && profileImageInput.files[0]
                ? profileImageInput.files[0]
                : null;
            try {
                personalSaveBtn.disabled = true;
                if (profileImageFile) {
                    const formData = new FormData();
                    formData.append("email", payload.email);
                    formData.append("firstName", payload.firstName);
                    formData.append("lastName", payload.lastName);
                    formData.append("phoneNumber", payload.phoneNumber);
                    formData.append("address", payload.address);
                    // Send both key variants for API compatibility.
                    formData.append("profileImage", profileImageFile);
                    formData.append("ProfileImage", profileImageFile);
                    formData.append("profileImageName", profileImageFile.name);
                    await fetchJson(API_BASE + "/vendor/profile", {
                        method: "PUT",
                        headers: authHeaders(),
                        body: formData
                    });
                } else {
                    await fetchJson(API_BASE + "/vendor/profile", {
                        method: "PUT",
                        headers: authHeaders({ "Content-Type": "application/json" }),
                        body: JSON.stringify(payload)
                    });
                }
                sessionStorage.setItem("vendorPersonalDetailsDone", "true");
                await showSuccessAndRedirect("Success", "Personal details saved successfully.", "business-profile.php");
            } catch (error) {
                showMessage("Failed", error.message || "Unable to update profile.", "error");
            } finally {
                personalSaveBtn.disabled = false;
            }
        });
    }

    if (businessSaveBtn && businessForm) {
        businessSaveBtn.addEventListener("click", async function () {
            if (!businessForm.checkValidity()) {
                showValidationError(businessForm, "business");
                return;
            }
            if (!token) {
                showMessage("Unauthorized", "Please login again.", "error");
                return;
            }
            if (!cachedProfile) {
                try {
                    await loadProfile();
                } catch (error) {
                    showMessage("Failed", "Unable to read profile before saving business.", "error");
                    return;
                }
            }
            try {
                businessSaveBtn.disabled = true;
                const profileRow = firstRow(cachedProfile);
                const businessRow = firstRow(cachedBusiness);
                const vendorId = profileRow && profileRow.vendorId ? profileRow.vendorId : "";
                const businessId = businessRow && businessRow.id ? businessRow.id : "";

                const businessFormData = new FormData();
                if (businessId) {
                    businessFormData.append("id", businessId);
                }
                businessFormData.append("vendorId", vendorId);
                businessFormData.append("businessName", document.getElementById("businessName").value.trim());
                businessFormData.append("businessPhone", document.getElementById("businessPhone").value.trim());
                businessFormData.append("alternatePhone", document.getElementById("alternatePhone") ? document.getElementById("alternatePhone").value.trim() : "");
                businessFormData.append("businessEmail", document.getElementById("businessEmail").value.trim());
                businessFormData.append("websiteUrl", document.getElementById("businessWebsite").value.trim());
                businessFormData.append("addressLine1", document.getElementById("businessAddress").value.trim());
                businessFormData.append("addressLine2", document.getElementById("businessAddressLine2") ? document.getElementById("businessAddressLine2").value.trim() : "");
                businessFormData.append("city", document.getElementById("businessCity").value.trim());
                businessFormData.append("state", document.getElementById("businessState").value.trim());
                businessFormData.append("country", document.getElementById("businessCountry").value.trim());
                businessFormData.append("pincode", document.getElementById("businessPincode").value.trim());
                businessFormData.append("businessType", document.getElementById("businessType") ? document.getElementById("businessType").value.trim() : "");
                businessFormData.append("businessCategory", document.getElementById("businessCategory") ? document.getElementById("businessCategory").value.trim() : "");
                businessFormData.append("businessDescription", document.getElementById("businessDescription") ? document.getElementById("businessDescription").value.trim() : "");
                businessFormData.append("gstNumber", document.getElementById("gstNumber").value.trim());
                businessFormData.append("panNumber", document.getElementById("panNumber").value.trim());
                businessFormData.append("cinNumber", document.getElementById("cinNumber") ? document.getElementById("cinNumber").value.trim() : "");
                businessFormData.append("udyamRegistrationNumber", document.getElementById("udyamRegistrationNumber") ? document.getElementById("udyamRegistrationNumber").value.trim() : "");

                const gstFile = document.getElementById("gstPdf") && document.getElementById("gstPdf").files[0]
                    ? document.getElementById("gstPdf").files[0]
                    : null;
                const panFile = document.getElementById("panImage") && document.getElementById("panImage").files[0]
                    ? document.getElementById("panImage").files[0]
                    : null;
                const aadharInput = document.getElementById("aadharImage");
                const aadharFiles = aadharInput && aadharInput.files ? Array.from(aadharInput.files) : [];
                const addressProofFile = document.getElementById("addressProofImage") && document.getElementById("addressProofImage").files[0]
                    ? document.getElementById("addressProofImage").files[0]
                    : null;
                const cinCertificateFile = document.getElementById("cinCertificate") && document.getElementById("cinCertificate").files[0]
                    ? document.getElementById("cinCertificate").files[0]
                    : null;
                const businessLogoFile = document.getElementById("businessLogo") && document.getElementById("businessLogo").files[0]
                    ? document.getElementById("businessLogo").files[0]
                    : null;

                if (gstFile) businessFormData.append("gstDocument", gstFile);
                if (panFile) businessFormData.append("panDocument", panFile);
                if (aadharFiles.length > 0) {
                    aadharFiles.forEach(function (file) {
                        businessFormData.append("aadharDocument", file);
                    });
                }
                if (addressProofFile) businessFormData.append("addressProofImage", addressProofFile);
                if (cinCertificateFile) businessFormData.append("cinCertificate", cinCertificateFile);
                if (businessLogoFile) businessFormData.append("businessLogo", businessLogoFile);

                // Some API versions require URL fields even on update when files are unchanged.
                if (!gstFile && businessRow && businessRow.gstDocumentUrl) {
                    businessFormData.append("gstDocumentUrl", businessRow.gstDocumentUrl);
                }
                if (!panFile && businessRow && businessRow.panDocumentUrl) {
                    businessFormData.append("panDocumentUrl", businessRow.panDocumentUrl);
                }
                if (aadharFiles.length === 0 && businessRow && businessRow.aadharDocumentUrl) {
                    businessFormData.append("aadharDocumentUrl", businessRow.aadharDocumentUrl);
                }
                if (!addressProofFile && businessRow && businessRow.addressProofImageUrl) {
                    businessFormData.append("addressProofImageUrl", businessRow.addressProofImageUrl);
                }
                if (!cinCertificateFile && businessRow && businessRow.cinCertificateUrl) {
                    businessFormData.append("cinCertificateUrl", businessRow.cinCertificateUrl);
                }
                if (!businessLogoFile && businessRow && businessRow.businessLogoUrl) {
                    businessFormData.append("businessLogoUrl", businessRow.businessLogoUrl);
                }

                await fetchJson(API_BASE + "/api/vendor/business/insert", {
                    method: "POST",
                    headers: authHeaders(),
                    body: businessFormData
                });
                sessionStorage.setItem("vendorBusinessDetailsDone", "true");
                await showSuccessAndRedirect("Success", "Business details saved successfully.", "bank-details.php");
            } catch (error) {
                showMessage("Failed", error.message || "Unable to save business profile.", "error");
            } finally {
                businessSaveBtn.disabled = false;
            }
        });
    }

    if (bankSaveBtn && bankForm) {
        bankSaveBtn.addEventListener("click", async function () {
            if (!bankForm.checkValidity()) {
                showValidationError(bankForm, "bank");
                return;
            }
            if (!token) {
                showMessage("Unauthorized", "Please login again.", "error");
                return;
            }
            if (!cachedProfile) {
                try {
                    await loadProfile();
                } catch (error) {
                    showMessage("Failed", "Unable to read profile before saving bank.", "error");
                    return;
                }
            }
            const payload = {
                vendorId: (firstRow(cachedProfile) && firstRow(cachedProfile).vendorId) ? firstRow(cachedProfile).vendorId : "",
                accountHolderName: document.getElementById("accountHolderName").value.trim(),
                bankName: document.getElementById("bankName").value.trim(),
                accountNumber: document.getElementById("accountNumber").value.trim(),
                ifscCode: document.getElementById("ifscCode").value.trim(),
                branchName: document.getElementById("branchName").value.trim(),
                accountType: document.getElementById("accountType") ? document.getElementById("accountType").value.trim() : "",
                cancelledChequeImage: document.getElementById("cancelledCheque") && document.getElementById("cancelledCheque").files[0]
                    ? document.getElementById("cancelledCheque").files[0].name
                    : ""
            };
            try {
                bankSaveBtn.disabled = true;
                var bankRow = firstRow(cachedBank);
                var chequeFile = document.getElementById("cancelledCheque") && document.getElementById("cancelledCheque").files[0]
                    ? document.getElementById("cancelledCheque").files[0]
                    : null;

                // Send multipart for both add/update paths for better backend compatibility.
                var bankFormData = new FormData();
                bankFormData.append("vendorId", payload.vendorId);
                bankFormData.append("accountHolderName", payload.accountHolderName);
                bankFormData.append("bankName", payload.bankName);
                bankFormData.append("accountNumber", payload.accountNumber);
                bankFormData.append("ifscCode", payload.ifscCode);
                bankFormData.append("branchName", payload.branchName);
                if (payload.accountType) bankFormData.append("accountType", payload.accountType);
                if (bankRow && bankRow.isActive !== undefined && bankRow.isActive !== null) {
                    bankFormData.append("isActive", String(bankRow.isActive));
                }

                if (chequeFile) {
                    bankFormData.append("cancelledChequeImage", chequeFile);
                } else if (bankRow && (bankRow.cancelledChequeImage || bankRow.CancelledChequeImage)) {
                    bankFormData.append("cancelledChequeImageUrl", bankRow.cancelledChequeImage || bankRow.CancelledChequeImage);
                }

                await fetchJson(API_BASE + "/api/bank/add", {
                    method: "POST",
                    headers: authHeaders(),
                    body: bankFormData
                });
                sessionStorage.setItem("vendorBankDetailsDone", "true");
                await showSuccessAndRedirect("Success", "Bank details saved successfully.", "index.php");
            } catch (error) {
                showMessage("Failed", error.message || "Unable to save bank details.", "error");
            } finally {
                bankSaveBtn.disabled = false;
            }
        });
    }

    if (vendorPasswordForm && vendorPasswordSaveBtn) {
        vendorPasswordForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            if (!token) {
                showMessage("Unauthorized", "Please login again.", "error");
                return;
            }
            var currentPassword = getInputValue("oldpassword");
            var newPassword = getInputValue("Password");
            var confirmPassword = getInputValue("RePassword");

            if (!currentPassword || !newPassword || !confirmPassword) {
                showMessage("Validation Error", "Please fill current, new and confirm password.", "warning");
                return;
            }
            if (newPassword.length < 6) {
                showMessage("Validation Error", "New password must be at least 6 characters.", "warning");
                return;
            }
            if (newPassword !== confirmPassword) {
                showMessage("Validation Error", "New password and re-password do not match.", "warning");
                return;
            }

            var formData = new FormData();
            formData.append("currentPassword", currentPassword);
            formData.append("newPassword", newPassword);
            formData.append("confirmPassword", confirmPassword);
            try {
                vendorPasswordSaveBtn.disabled = true;
                await fetchJson(API_BASE + "/api/vendor/change-password", {
                    method: "POST",
                    headers: authHeaders(),
                    body: formData
                });
                showMessage("Success", "Password changed successfully.", "success");
                vendorPasswordForm.reset();
            } catch (error) {
                showMessage("Failed", error.message || "Unable to change password.", "error");
            } finally {
                vendorPasswordSaveBtn.disabled = false;
            }
        });
    }

    initData();
});
