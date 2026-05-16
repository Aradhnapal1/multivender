const API_ROOT = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");

function byId(id) {
  return document.getElementById(id);
}

function getData(payload) {
  if (!payload) return null;
  if (payload.data !== undefined && payload.data !== null) return getData(payload.data);
  if (payload.Data !== undefined && payload.Data !== null) return getData(payload.Data);
  if (payload.result !== undefined && payload.result !== null) return getData(payload.result);
  if (payload.Result !== undefined && payload.Result !== null) return getData(payload.Result);
  return payload;
}

function asList(payload) {
  const rows = getData(payload);
  return Array.isArray(rows) ? rows : rows ? [rows] : [];
}

function setText(id, value) {
  const el = byId(id);
  if (el) el.textContent = value || "-";
}

function setHtml(id, value) {
  const el = byId(id);
  if (el) el.innerHTML = value || "-";
}

function link(url) {
  if (!url) return "-";
  return `<a href="${url}" target="_blank" rel="noopener noreferrer">View</a>`;
}

function resolveUrl(value) {
  function deepFindUrl(input, depth) {
    if (!input || depth > 5) return "";
    if (typeof input === "string") {
      const s = input.trim();
      if (!s || s === "[object Object]") return "";
      return s;
    }
    if (Array.isArray(input)) {
      for (const item of input) {
        const found = deepFindUrl(item, depth + 1);
        if (found) return found;
      }
      return "";
    }
    if (typeof input === "object") {
      const preferredKeys = [
        "url", "Url", "value", "Value", "path", "Path",
        "fileUrl", "FileUrl", "documentUrl", "DocumentUrl",
        "src", "Src", "location", "Location"
      ];
      for (const key of preferredKeys) {
        if (input[key] !== undefined && input[key] !== null) {
          const found = deepFindUrl(input[key], depth + 1);
          if (found) return found;
        }
      }
      for (const key of Object.keys(input)) {
        const found = deepFindUrl(input[key], depth + 1);
        if (found) return found;
      }
    }
    return "";
  }

  let resolved = value;
  if (resolved && typeof resolved === "object") {
    resolved = deepFindUrl(resolved, 0);
  }
  const raw = String(resolved || "").trim();
  if (!raw || raw === "[object Object]") return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const root = API_ROOT.replace(/\/$/, "");
  return raw.startsWith("/") ? root + raw : `${root}/${raw.replace(/^\/+/, "")}`;
}

function pickChequeUrl(bank) {
  if (!bank) return "";
  const directCandidates = [
    bank.cancelledChequeImage,
    bank.CancelledChequeImage,
    bank.cancelledChequeImageUrl,
    bank.CancelledChequeImageUrl
  ];
  for (const item of directCandidates) {
    const resolved = resolveUrl(item);
    if (resolved) return resolved;
  }

  // Fallback: scan bank object for cheque/check/cancel related keys.
  const queue = [bank];
  const seen = new Set();
  while (queue.length) {
    const node = queue.shift();
    if (!node || typeof node !== "object" || seen.has(node)) continue;
    seen.add(node);
    const entries = Object.entries(node);
    for (const [key, value] of entries) {
      if (/cheque|check|cancel/i.test(key)) {
        const resolved = resolveUrl(value);
        if (resolved) return resolved;
      }
      // also allow generic URL-like values when key contains image/file/document
      if (/image|file|document|url/i.test(key)) {
        const resolved = resolveUrl(value);
        if (resolved) return resolved;
      }
      if (value && typeof value === "object") queue.push(value);
    }
  }
  return "";
}

function docPreview(url) {
  const href = resolveUrl(url);
  if (!href) return "-";
  const isImage = /\.(png|jpg|jpeg|gif|webp|svg)(\?.*)?$/i.test(href);
  const viewBtn = `<button type="button" class="btn btn-sm btn-outline-primary doc-image-preview" data-src="${href}"><i class="mdi mdi-eye-outline"></i> View</button>`;
  if (!isImage) return viewBtn;
  return `${viewBtn}<br><img src="${href}" alt="document" class="doc-image-preview" data-src="${href}" style="max-width:120px;max-height:90px;border:1px solid #ddd;border-radius:4px;margin-top:6px;cursor:pointer;">`;
}

document.addEventListener("click", function (event) {
  const trigger = event.target.closest(".doc-image-preview");
  if (!trigger) return;
  event.preventDefault();
  const src = trigger.getAttribute("data-src");
  if (!src) return;
  if (window.Swal) {
    Swal.fire({
      title: "Document Preview",
      imageUrl: src,
      imageAlt: "Document image",
      showCloseButton: true,
      showConfirmButton: false,
      width: 700
    });
    return;
  }
  window.open(src, "_blank", "noopener,noreferrer");
});

async function getJson(url, token) {
  const res = await fetch(url, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  const raw = await res.text();
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function loadVendorProfile() {
  const token = localStorage.getItem("superadminToken");
  const vendorId = new URLSearchParams(window.location.search).get("id");
  if (!vendorId) return;

  try {
    const [vendorsPayload, businessPayload, bankPayload] = await Promise.all([
      getJson(`${API_ROOT}/admin-vendors`, token),
      getJson(`${API_ROOT}/api/vendor/business/list`, token),
      getJson(`${API_ROOT}/api/bank/get/${encodeURIComponent(vendorId)}`, token),
    ]);

    const vendors = asList(vendorsPayload);
    const businessList = asList(businessPayload);
    let banks = asList(bankPayload);
    if (!banks.length) {
      const bankListPayload = await getJson(`${API_ROOT}/api/bank/get`, token);
      banks = asList(bankListPayload);
    }

    const vendor =
      vendors.find((v) => String(v.id || v.vendorId) === String(vendorId)) || null;
    const business =
      businessList.find((b) => String(b.vendorId) === String(vendorId)) || null;
    let bank =
      banks.find((b) => String(b.vendorId || b.VendorId || b.userId || b.UserId) === String(vendorId))
      || (banks.length === 1 ? banks[0] : null);

    // Some API variants return cheque image only in list endpoint; merge it when missing.
    const currentChequeUrl = pickChequeUrl(bank);
    if (bank && !currentChequeUrl) {
      const bankListPayload = await getJson(`${API_ROOT}/api/bank/get`, token);
      const fullBanks = asList(bankListPayload);
      const match = fullBanks.find((b) => String(b.vendorId || b.VendorId || b.userId || b.UserId) === String(vendorId));
      if (match) {
        bank = Object.assign({}, match, bank);
      }
    }

    if (vendor) {
      const fullName = `${vendor.firstName || ""} ${vendor.lastName || ""}`.trim() || vendor.name || "-";
      setText("vendorNameHeading", fullName);
      setText("vendorRoleHeading", "Authorised Brand Seller");
      setText(
        "vendorLocationHeading",
        `${vendor.city || ""}${vendor.city && vendor.state ? ", " : ""}${vendor.state || ""}` || "-",
      );
      const profileImgEl = byId("vendorProfileImage");
      if (profileImgEl && vendor.profileImage) {
        profileImgEl.src = resolveUrl(vendor.profileImage);
      }

      setText("personalName", fullName);
      setText("personalEmail", vendor.email || "-");
      setText("personalPhone", vendor.phoneNumber || vendor.phone || "-");
      setText("personalCountry", vendor.country || "-");
      setText("personalState", vendor.state || "-");
      setText("personalCity", vendor.city || "-");
      setText("personalPincode", vendor.pinCode || vendor.pincode || "-");
      setText("personalAddress", vendor.address || vendor.addressLine1 || "-");
    }

    if (business) {
      setText("businessName", business.businessName);
      setText("businessType", business.businessType);
      setText("businessCategory", business.businessCategory);
      setText("businessDescription", business.businessDescription);
      setText("gstNumber", business.gstNumber);
      setText("panNumber", business.panNumber);
      setText("cinNumber", business.cinNumber);
      setText("udyamNumber", business.udyamRegistrationNumber);
      setText("addressLine1", business.addressLine1);
      setText("addressLine2", business.addressLine2);
      setText("city", business.city);
      setText("state", business.state);
      setText("country", business.country);
      setText("pincode", business.pincode);
      setText("businessEmail", business.businessEmail);
      setText("businessPhone", business.businessPhone);
      setText("alternatePhone", business.alternatePhone);
      setHtml("websiteUrl", link(business.websiteUrl));
      setHtml("gstDoc", docPreview(business.gstDocumentUrl));
      setHtml("panDoc", docPreview(business.panDocumentUrl));
      setHtml("cinDoc", docPreview(business.cinCertificateUrl));
      setHtml("aadharDoc", docPreview(business.aadharDocumentUrl));
      setHtml("addressProofDoc", docPreview(business.addressProofImageUrl));
      setHtml("logoUrl", docPreview(business.businessLogoUrl));
      setText("isVerified", business.isVerified ? "Yes" : "No");
      setHtml(
        "isActive",
        business.isActive
          ? '<span class="badge bg-success">Active</span>'
          : '<span class="badge bg-danger">Inactive</span>',
      );
      setText("vendorStatus", business.vendorStatus || "-");
      setText("adminReviewMessage", business.adminReviewMessage || "-");
      setText("reviewedBy", business.reviewedBy || "-");
      setText("reviewedAt", business.reviewedAt || "-");
    }

    if (bank) {
      setText("accHolder", bank.accountHolderName || bank.AccountHolderName);
      setText("bankName", bank.bankName || bank.BankName);
      setText("accNumber", bank.accountNumber || bank.AccountNumber);
      setText("branchName", bank.branchName || bank.BranchName);
      setText("confirmAccNumber", bank.accountNumber || bank.AccountNumber);
      setText("ifsc", bank.ifscCode || bank.IFSCCode);
      const chequeUrl = pickChequeUrl(bank);
      if (chequeUrl) {
        setHtml("cancelCheck", docPreview(chequeUrl));
      } else {
        setHtml("cancelCheck", '<span class="text-muted">No cheque image URL in API response</span>');
        console.log("Bank payload without cheque URL:", bank);
      }
    } else {
      setText("accHolder", "No bank data found");
    }
  } catch (err) {
    console.error("Vendor profile load error:", err);
  }
}

window.addEventListener("load", loadVendorProfile);
