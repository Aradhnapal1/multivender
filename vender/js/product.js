const API_BASE = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");
const PRODUCT_INSERT = `${API_BASE}/api/products/insert`;
const PRODUCT_UPDATE_BASE = `${API_BASE}/api/products/update`;
const PRODUCT_DETAIL_BASE = `${API_BASE}/api/products/detail`;
const PRODUCT_IMPORT = `${API_BASE}/api/products/upload-excel`;
const PRODUCT_EXPORT = `${API_BASE}/api/products/export`;

let categoryTree = [];

function authToken() {
  return localStorage.getItem("vendorToken");
}

function getVendorIdFromToken() {
  const token = authToken();
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return (
      payload.UserId ||
      payload.userId ||
      payload.NameIdentifier ||
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      payload.VendorId ||
      payload.vendorId ||
      payload.vendorid ||
      ""
    );
  } catch {
    return "";
  }
}

function getVendorEmailFromToken() {
  const token = authToken();
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return (
      payload.Email ||
      payload.email ||
      payload.UserEmail ||
      payload.userEmail ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ||
      ""
    );
  } catch {
    return "";
  }
}

function getVendorFullNameFromToken() {
  const token = authToken();
  if (!token) return "";
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const firstName = payload.FirstName || payload.firstName || "";
    const lastName = payload.LastName || payload.lastName || "";
    return `${firstName} ${lastName}`.trim();
  } catch {
    return "";
  }
}

function resolveMedia(url) {
  if (window.resolveApiMediaUrl) return window.resolveApiMediaUrl(url);
  if (!url) return "https://via.placeholder.com/48";
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

function truncateWords(text, wordLimit = 10) {
  if (!text) return "";
  const cleanText = String(text).replace(/<[^>]*>/g, "");
  const words = cleanText.split(" ");
  if (words.length <= wordLimit) return cleanText;
  return `${words.slice(0, wordLimit).join(" ")}...`;
}

function normalizeArrayPayload(payload) {
  return payload?.data?.data || payload?.data || payload?.items || payload || [];
}

function isProductOwnedByVendor(product, vendorId, vendorEmail, vendorFullName) {
  if (!vendorId && !vendorEmail && !vendorFullName) return false;
  const ownerId =
    product.vendorId ||
    product.VendorId ||
    product.vendorid ||
    product.sellerId ||
    product.SellerId ||
    product.sellerid ||
    product.userId ||
    product.UserId ||
    product.userid ||
    product.createdByVendorId ||
    product.CreatedByVendorId ||
    product.createdById ||
    product.CreatedById ||
    product.createdBy ||
    product.CreatedBy ||
    "";
  if (ownerId && vendorId && String(ownerId).trim() === String(vendorId).trim()) return true;

  const ownerEmail = (
    product.vendorEmail ||
    product.VendorEmail ||
    product.venderEmail ||
    product.email ||
    product.Email ||
    product.createdBy ||
    product.CreatedBy ||
    product.createdByEmail ||
    product.CreatedByEmail ||
    product.userEmail ||
    product.UserEmail ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase();

  if (ownerEmail && vendorEmail && ownerEmail === vendorEmail.toLowerCase()) return true;

  const createdByName = (
    product.createdbyname ||
    product.createdByName ||
    product.CreatedByName ||
    ""
  )
    .toString()
    .trim()
    .toLowerCase();
  if (createdByName && vendorFullName && createdByName === vendorFullName.toLowerCase()) return true;

  return false;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const raw = await res.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = { message: raw };
  }
  if (!res.ok) {
    throw new Error(data?.message || `${res.status} ${res.statusText}`);
  }
  return data;
}

function setSelectOptions(selectId, list, labelKey = "name") {
  const el = document.getElementById(selectId);
  if (!el) return;
  const current = el.value;
  el.innerHTML = `<option value="">Select</option>`;
  list.forEach((item) => {
    const id = item.id || item._id;
    if (!id) return;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = item[labelKey] || item.Name || "-";
    el.appendChild(opt);
  });
  if (current) el.value = current;
}

function getNodeId(node) {
  return node?.id || node?._id || "";
}

function syncSelectedCategoryFields(pathIds) {
  const categoryIdInput = document.getElementById("CategoryId");
  const subCategoryIdInput = document.getElementById("SubCategoryId");
  const cleanPath = (pathIds || []).filter(Boolean);
  const rootId = cleanPath[0] || "";
  const deepestId = cleanPath.length > 1 ? cleanPath[cleanPath.length - 1] : "";
  if (categoryIdInput) categoryIdInput.value = rootId;
  if (subCategoryIdInput) subCategoryIdInput.value = deepestId;
}

function renderCategoryLevelSelect(levelIndex, nodes, selectedId = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-3";

  const label = document.createElement("label");
  label.className = "form-label";
  label.textContent = levelIndex === 0 ? "Category" : `Category Level ${levelIndex + 1}`;

  const select = document.createElement("select");
  select.className = "form-select dynamic-category-level";
  select.dataset.level = String(levelIndex);
  select.innerHTML = `<option value="">Select ${levelIndex === 0 ? "Category" : "Sub Category"}</option>`;

  (nodes || []).forEach((node) => {
    const id = getNodeId(node);
    if (!id) return;
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = node.name || "-";
    if (selectedId && selectedId === id) opt.selected = true;
    select.appendChild(opt);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  return wrapper;
}

function renderCategoryLevels(selectedPath = []) {
  const container = document.getElementById("CategoryLevelsContainer");
  if (!container) return;
  container.innerHTML = "";

  let nodesAtLevel = categoryTree || [];
  const path = [];
  let level = 0;

  while (nodesAtLevel && nodesAtLevel.length > 0) {
    const selectedAtLevel = selectedPath[level] || "";
    const block = renderCategoryLevelSelect(level, nodesAtLevel, selectedAtLevel);
    container.appendChild(block);

    const selectedNode = nodesAtLevel.find((n) => getNodeId(n) === selectedAtLevel) || null;
    if (!selectedNode) break;

    path.push(getNodeId(selectedNode));
    nodesAtLevel = selectedNode.children || [];
    level += 1;
  }

  syncSelectedCategoryFields(path);

  container.querySelectorAll(".dynamic-category-level").forEach((select) => {
    select.addEventListener("change", (e) => {
      const changedLevel = Number(e.target.dataset.level || 0);
      const selects = Array.from(container.querySelectorAll(".dynamic-category-level"));
      const nextPath = selects.slice(0, changedLevel + 1).map((s) => s.value).filter(Boolean);
      renderCategoryLevels(nextPath);
    });
  });
}

function findCategoryPathToId(nodes, targetId, trail = []) {
  for (let i = 0; i < (nodes || []).length; i += 1) {
    const n = nodes[i];
    const id = getNodeId(n);
    const nextTrail = [...trail, id];
    if (id === targetId) return nextTrail;
    if (n.children?.length) {
      const found = findCategoryPathToId(n.children, targetId, nextTrail);
      if (found.length) return found;
    }
  }
  return [];
}

async function loadProductFormOptions() {
  const token = authToken();
  if (!token) return;

  const headers = { Authorization: `Bearer ${token}` };
  const [brandsRes, categoriesRes, colorsRes, sizesRes] = await Promise.all([
    fetchJson(`${API_BASE}/api/brands/list`, { headers }),
    fetchJson(`${API_BASE}/api/category/list`, { headers }),
    fetchJson(`${API_BASE}/api/colors/get`, { headers }),
    fetchJson(`${API_BASE}/api/size/get`, { headers }),
  ]);

  setSelectOptions("BrandId", normalizeArrayPayload(brandsRes));
  categoryTree = normalizeArrayPayload(categoriesRes);
  renderCategoryLevels([]);
  setSelectOptions("ColorId", normalizeArrayPayload(colorsRes));
  setSelectOptions("SizeId", normalizeArrayPayload(sizesRes));
}

function toBool(elId, fallback = false) {
  const el = document.getElementById(elId);
  return el ? !!el.checked : fallback;
}

function numberValue(elId, fallback = 0) {
  const v = document.getElementById(elId)?.value;
  if (v === "" || v == null) return fallback;
  const n = Number(v);
  return Number.isNaN(n) ? fallback : n;
}

function textValue(elId) {
  return (document.getElementById(elId)?.value || "").trim();
}

function normalizeId(v) {
  return typeof v === "string" ? v : "";
}

function syncSalesStatusDisplay() {
  const activeEl = document.getElementById("IsActive");
  const displayEl = document.getElementById("SalesStatusDisplay");
  if (!activeEl || !displayEl) return;
  displayEl.textContent = activeEl.checked ? "Active" : "Inactive";
}

function isSalesStatusActive(v, fallback = true) {
  if (v == null || v === "") return fallback;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  const status = String(v).trim().toLowerCase();
  if (["inactive", "false", "0", "off", "disabled"].includes(status)) return false;
  if (["active", "true", "1", "on", "enabled"].includes(status)) return true;
  return fallback;
}

function buildProductFormData() {
  const fd = new FormData();
  fd.append("Name", textValue("name"));
  fd.append("ShortDescription", textValue("ShortDescription"));
  fd.append("Description", textValue("Description"));
  fd.append("CategoryId", textValue("CategoryId"));
  if (textValue("SubCategoryId")) fd.append("SubCategoryId", textValue("SubCategoryId"));
  fd.append("BrandId", textValue("BrandId"));
  if (textValue("ColorId")) fd.append("ColorId", textValue("ColorId"));
  if (textValue("SizeId")) fd.append("SizeId", textValue("SizeId"));

  fd.append("Price", numberValue("Price", 0));
  fd.append("DiscountPrice", numberValue("DiscountPrice", 0));
  fd.append("CostPrice", numberValue("CostPrice", 0));
  fd.append("TaxPercentage", numberValue("TaxPercentage", 0));
  fd.append("StockQuantity", numberValue("StockQuantity", 0));
  fd.append("MinStockQuantity", numberValue("MinStockQuantity", 0));

  fd.append("Sku", textValue("Sku"));
  fd.append("Weight", numberValue("Weight", 0));
  fd.append("Length", numberValue("Length", 0));
  fd.append("Width", numberValue("Width", 0));
  fd.append("Height", numberValue("Height", 0));
  fd.append("MetaTitle", textValue("MetaTitle"));
  fd.append("MetaDescription", textValue("MetaDescription"));
  fd.append("MetaKeywords", textValue("MetaKeywords"));
  const salesStatus = toBool("IsActive", true) ? "active" : "inactive";
  fd.append("SalesStatus", salesStatus);
  fd.append("sales_status", salesStatus);

  fd.append("TrackInventory", toBool("TrackInventory", true));
  fd.append("IsActive", toBool("IsActive", true));
  fd.append("IsFeatured", toBool("IsFeatured", false));

  const mainImage = document.getElementById("MainImage")?.files?.[0];
  if (mainImage) fd.append("MainImage", mainImage);

  const gallery = document.getElementById("GalleryImages")?.files || [];
  for (let i = 0; i < gallery.length; i += 1) {
    fd.append("GalleryImages", gallery[i]);
  }

  return fd;
}

function validateProductForm() {
  if (!textValue("name")) return "Product name is required";
  if (!textValue("CategoryId")) return "Category is required";
  if (!textValue("BrandId")) return "Brand is required";
  if (numberValue("Price", 0) <= 0) return "Price must be greater than 0";
  return null;
}

window.submitProduct = async function submitProduct() {
  const token = authToken();
  if (!token) {
    Swal.fire({ icon: "warning", title: "Please login first" });
    return;
  }
  const validationError = validateProductForm();
  if (validationError) {
    Swal.fire({ icon: "warning", title: validationError });
    return;
  }

  try {
    Swal.fire({ title: "Creating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await fetchJson(PRODUCT_INSERT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: buildProductFormData(),
    });
    await Swal.fire({
      icon: "success",
      title: "Product created",
      text: data?.message || "Created successfully",
    });
    window.location.href = "product.php";
  } catch (err) {
    Swal.fire({ icon: "error", title: "Create failed", text: err.message });
  }
};

window.submitProductUpdate = async function submitProductUpdate() {
  const token = authToken();
  const productId = new URLSearchParams(window.location.search).get("id") || textValue("ProductId");
  if (!token || !productId) {
    Swal.fire({ icon: "warning", title: "Missing token or product id" });
    return;
  }
  const validationError = validateProductForm();
  if (validationError) {
    Swal.fire({ icon: "warning", title: validationError });
    return;
  }

  try {
    Swal.fire({ title: "Updating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const data = await fetchJson(`${PRODUCT_UPDATE_BASE}/${encodeURIComponent(productId)}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: buildProductFormData(),
    });
    await Swal.fire({
      icon: "success",
      title: "Product updated",
      text: data?.message || "Updated successfully",
    });
    window.location.href = "product.php";
  } catch (err) {
    Swal.fire({ icon: "error", title: "Update failed", text: err.message });
  }
};

async function loadProductForEdit() {
  const marker = document.getElementById("productEditPage");
  if (!marker) return;

  const productId = new URLSearchParams(window.location.search).get("id");
  if (!productId) return;

  const token = authToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const detail = await fetchJson(`${PRODUCT_DETAIL_BASE}/${encodeURIComponent(productId)}`, { headers });
  const p = detail?.data?.data || detail?.data || detail;

  document.getElementById("ProductId").value = p.id || "";
  document.getElementById("name").value = p.name || "";
  document.getElementById("ShortDescription").value = p.shortdescription || p.shortDescription || "";
  document.getElementById("Description").value = p.description || "";
  document.getElementById("BrandId").value = normalizeId(p.brandid || p.brandId || "");
  const categoryId = normalizeId(p.categoryid || p.categoryId || "");
  const subCategoryId = normalizeId(p.subcategoryid || p.subCategoryId || "");
  const targetCategoryId = subCategoryId || categoryId;
  const categoryPath = targetCategoryId ? findCategoryPathToId(categoryTree, targetCategoryId) : [];
  renderCategoryLevels(categoryPath);
  document.getElementById("ColorId").value = normalizeId(p.colorid || p.colorId || "");
  document.getElementById("SizeId").value = normalizeId(p.sizeid || p.sizeId || "");
  document.getElementById("Price").value = p.price ?? "";
  document.getElementById("DiscountPrice").value = p.discountprice ?? p.discountPrice ?? "";
  document.getElementById("CostPrice").value = p.costprice ?? p.costPrice ?? "";
  document.getElementById("TaxPercentage").value = p.taxpercentage ?? p.taxPercentage ?? 0;
  document.getElementById("Sku").value = p.sku || "";
  document.getElementById("StockQuantity").value = p.stockquantity ?? p.stockQuantity ?? 0;
  document.getElementById("MinStockQuantity").value = p.minstockquantity ?? p.minStockQuantity ?? 0;
  document.getElementById("Weight").value = p.weight ?? "";
  document.getElementById("Length").value = p.length ?? "";
  document.getElementById("Width").value = p.width ?? "";
  document.getElementById("Height").value = p.height ?? "";
  document.getElementById("MetaTitle").value = p.metatitle || "";
  document.getElementById("MetaDescription").value = p.metadescription || "";
  document.getElementById("MetaKeywords").value = p.metakeywords || "";
  document.getElementById("TrackInventory").checked = !!(p.trackinventory ?? p.trackInventory);
  const rawSalesStatus = p.sales_status ?? p.salesStatus ?? p.salesstatus;
  const activeFallback = !!(p.isactive ?? p.isActive);
  document.getElementById("IsActive").checked = isSalesStatusActive(rawSalesStatus, activeFallback);
  syncSalesStatusDisplay();
  document.getElementById("IsFeatured").checked = !!(p.isfeatured ?? p.isFeatured);

  const mainPrev = document.getElementById("existingMainImage");
  if (mainPrev && (p.mainimage || p.mainImage)) {
    mainPrev.src = resolveMedia(p.mainimage || p.mainImage);
    mainPrev.style.display = "block";
  }

  const galleryWrap = document.getElementById("existingGalleryImages");
  if (galleryWrap) {
    galleryWrap.innerHTML = "";
    const gallery = p.galleryimages || p.galleryImages || [];
    gallery.forEach((img) => {
      const el = document.createElement("img");
      el.src = resolveMedia(img);
      el.style.cssText = "width:70px;height:70px;object-fit:cover;border-radius:6px;margin:4px;";
      galleryWrap.appendChild(el);
    });
  }
}

// =============================================================================
//  Filter + bulk-update + pagination + search (vendor scope)
// =============================================================================

// Full working set after ownership filtering (vendor's own products).
let allLoadedProducts = [];
// Rows visible in the table after filter + search are applied.
let filteredProducts = [];
// Filter rules collected from the modal; applied as AND-combined predicates.
let activeFilters = [];
// IDs of rows the user has ticked via the checkbox column.
const selectedIds = new Set();

// Pagination state. `pageSize === Infinity` means "show all".
let currentPage = 1;
let pageSize = 50;
// Top-of-table search box — matches across name/SKU/category/brand.
let searchQuery = "";

function normalizeProductForView(p) {
  return {
    raw: p,
    id: p.id || p._id || "",
    name: (p.name || p.productName || "").toString(),
    sku: (p.sku || p.SKU || "").toString(),
    price: Number(p.price ?? 0),
    discountPrice: Number(p.discountPrice ?? p.discountprice ?? 0),
    stockQuantity: Number(p.stockQuantity ?? p.stockquantity ?? 0),
    isActive: !!(p.isActive ?? p.isactive),
    isFeatured: !!(p.isFeatured ?? p.isfeatured),
    categoryName: (p.categoryName || p.categoryname || "").toString(),
    brandName: (p.brandName || p.brandname || "").toString(),
  };
}

// Bootstrap is bundled as an ES module in the Hyper theme, so `window.bootstrap`
// isn't reliably available. Fall back to clicking any element with the
// Bootstrap dismiss attribute so closing always works.
function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (window.bootstrap?.Modal?.getInstance) {
    window.bootstrap.Modal.getInstance(modal)?.hide();
    return;
  }
  const closer = modal.querySelector("[data-bs-dismiss='modal']");
  if (closer) { closer.click(); return; }
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
}

// ===== Filter field catalog + operators =====

const FILTER_FIELDS = [
  { key: "price",         label: "Price",          type: "number" },
  { key: "discountPrice", label: "Discount Price", type: "number" },
  { key: "stockQuantity", label: "Stock Quantity", type: "number" },
  { key: "name",          label: "Name",           type: "text"   },
  { key: "sku",           label: "SKU",            type: "text"   },
  { key: "categoryName",  label: "Category",       type: "text"   },
  { key: "brandName",     label: "Brand",          type: "text"   },
  { key: "isActive",      label: "Status",         type: "bool"   },
  { key: "isFeatured",    label: "Featured",       type: "bool"   },
];

function operatorsForType(type) {
  if (type === "number") {
    return [
      { key: "eq", label: "Equal to" },
      { key: "neq", label: "Not equal to" },
      { key: "gt", label: "Greater than (>)" },
      { key: "gte", label: "Greater or equal (≥)" },
      { key: "lt", label: "Less than (<)" },
      { key: "lte", label: "Less or equal (≤)" },
      { key: "between", label: "Between" },
    ];
  }
  if (type === "text") {
    return [
      { key: "contains", label: "Contains" },
      { key: "eq", label: "Equal to" },
      { key: "neq", label: "Not equal to" },
      { key: "starts", label: "Starts with" },
      { key: "ends", label: "Ends with" },
    ];
  }
  return [{ key: "eq", label: "Is" }];
}

function buildValueInput(wrap, type, op) {
  wrap.innerHTML = "";
  if (type === "bool") {
    wrap.innerHTML = `<select class="form-select form-select-sm filter-value">
      <option value="true">Active / Yes</option>
      <option value="false">Inactive / No</option>
    </select>`;
    return;
  }
  if (type === "number") {
    if (op === "between") {
      wrap.innerHTML = `
        <input type="number" class="form-control form-control-sm filter-value" placeholder="Min" />
        <span class="mx-1 small text-muted">to</span>
        <input type="number" class="form-control form-control-sm filter-value-2" placeholder="Max" />`;
      return;
    }
    wrap.innerHTML = `<input type="number" class="form-control form-control-sm filter-value" placeholder="Value" />`;
    return;
  }
  wrap.innerHTML = `<input type="text" class="form-control form-control-sm filter-value" placeholder="Text" />`;
}

function addFilterRow(prefill) {
  const host = document.getElementById("filterRows");
  if (!host) return;

  const row = document.createElement("div");
  row.className = "row g-2 align-items-center filter-row mb-2";
  row.innerHTML = `
    <div class="col-md-4">
      <label class="small text-muted mb-1">Field</label>
      <select class="form-select form-select-sm filter-field">
        ${FILTER_FIELDS.map(f => `<option value="${f.key}">${f.label}</option>`).join("")}
      </select>
    </div>
    <div class="col-md-3">
      <label class="small text-muted mb-1">Operator</label>
      <select class="form-select form-select-sm filter-operator"></select>
    </div>
    <div class="col-md-4">
      <label class="small text-muted mb-1">Value</label>
      <div class="d-flex align-items-center filter-value-wrap"></div>
    </div>
    <div class="col-md-1 text-end">
      <button type="button" class="btn btn-sm btn-outline-danger remove-filter-row" title="Remove">
        <i class="mdi mdi-close"></i>
      </button>
    </div>`;
  host.appendChild(row);

  const fieldSel = row.querySelector(".filter-field");
  const opSel = row.querySelector(".filter-operator");
  const valueWrap = row.querySelector(".filter-value-wrap");

  function rebuildOperators(preserveOp) {
    const f = FILTER_FIELDS.find(x => x.key === fieldSel.value);
    const ops = operatorsForType(f?.type || "text");
    opSel.innerHTML = ops.map(o => `<option value="${o.key}">${o.label}</option>`).join("");
    if (preserveOp && ops.some(o => o.key === preserveOp)) opSel.value = preserveOp;
    buildValueInput(valueWrap, f?.type || "text", opSel.value);
  }
  fieldSel.addEventListener("change", () => rebuildOperators());
  opSel.addEventListener("change", () => {
    const f = FILTER_FIELDS.find(x => x.key === fieldSel.value);
    buildValueInput(valueWrap, f?.type || "text", opSel.value);
  });
  row.querySelector(".remove-filter-row").addEventListener("click", () => row.remove());

  if (prefill) {
    fieldSel.value = prefill.field || FILTER_FIELDS[0].key;
    rebuildOperators(prefill.op);
    if (prefill.value != null) {
      const v1 = row.querySelector(".filter-value");
      if (v1) v1.value = prefill.value;
    }
    if (prefill.value2 != null) {
      const v2 = row.querySelector(".filter-value-2");
      if (v2) v2.value = prefill.value2;
    }
  } else {
    rebuildOperators();
  }
}

function collectActiveFilters() {
  const rows = document.querySelectorAll("#filterRows .filter-row");
  const out = [];
  rows.forEach(row => {
    const field = row.querySelector(".filter-field")?.value;
    const op = row.querySelector(".filter-operator")?.value;
    if (!field || !op) return;
    const valEl = row.querySelector(".filter-value");
    const val2El = row.querySelector(".filter-value-2");
    const value = valEl?.value ?? "";
    const value2 = val2El?.value ?? "";
    const f = FILTER_FIELDS.find(x => x.key === field);
    if (value === "" && !(f?.type === "bool")) return;
    out.push({ field, op, type: f?.type || "text", value, value2 });
  });
  return out;
}

function filterMatches(product, rule) {
  const v = product[rule.field];
  if (rule.type === "bool") return Boolean(v) === (rule.value === "true");
  if (rule.type === "number") {
    const n = Number(v);
    const a = Number(rule.value);
    const b = Number(rule.value2);
    switch (rule.op) {
      case "eq": return n === a;
      case "neq": return n !== a;
      case "gt": return n > a;
      case "gte": return n >= a;
      case "lt": return n < a;
      case "lte": return n <= a;
      case "between": return n >= Math.min(a, b) && n <= Math.max(a, b);
    }
    return true;
  }
  const s = String(v ?? "").toLowerCase();
  const q = String(rule.value ?? "").toLowerCase();
  switch (rule.op) {
    case "contains": return s.includes(q);
    case "eq": return s === q;
    case "neq": return s !== q;
    case "starts": return s.startsWith(q);
    case "ends": return s.endsWith(q);
  }
  return true;
}

function applyActiveFilters() {
  let list = allLoadedProducts;
  if (activeFilters.length) {
    list = list.filter(p => activeFilters.every(r => filterMatches(p, r)));
  }
  const q = searchQuery.trim().toLowerCase();
  if (q) {
    list = list.filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.sku || "").toLowerCase().includes(q) ||
      (p.categoryName || "").toLowerCase().includes(q) ||
      (p.brandName || "").toLowerCase().includes(q)
    );
  }
  filteredProducts = list;
  currentPage = 1;
  updateFilterSummary();
  renderProductRows();
}

function updateFilterSummary() {
  const wrap = document.getElementById("filterSummary");
  const chips = document.getElementById("filterChips");
  if (!wrap || !chips) return;
  if (!activeFilters.length) {
    wrap.style.display = "none";
    chips.innerHTML = "";
    return;
  }
  wrap.style.display = "flex";
  chips.innerHTML = activeFilters.map(r => {
    const fLabel = (FILTER_FIELDS.find(f => f.key === r.field) || {}).label || r.field;
    const opLabel = (operatorsForType(r.type).find(o => o.key === r.op) || {}).label || r.op;
    const v = r.op === "between" ? `${r.value} – ${r.value2}` : r.value;
    return `<span class="badge bg-light text-dark border">${fLabel} ${opLabel} <b>${v}</b></span>`;
  }).join(" ");
}

// ===== Selection =====

function updateBulkButton() {
  const btn = document.getElementById("openBulkUpdateBtn");
  const count = document.getElementById("bulkSelectedCount");
  if (count) count.textContent = String(selectedIds.size);
  if (btn) btn.classList.toggle("d-none", selectedIds.size === 0);

  const selectAll = document.getElementById("selectAllRows");
  if (selectAll) {
    const pageIds = getPageSlice().map(p => p.id);
    selectAll.checked = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
    selectAll.indeterminate = !selectAll.checked && pageIds.some(id => selectedIds.has(id));
  }
}

// ===== Pagination =====

function totalPages() {
  if (!filteredProducts.length) return 1;
  if (!isFinite(pageSize)) return 1;
  return Math.max(1, Math.ceil(filteredProducts.length / pageSize));
}

function getPageSlice() {
  if (!isFinite(pageSize)) return filteredProducts;
  const start = (currentPage - 1) * pageSize;
  return filteredProducts.slice(start, start + pageSize);
}

function renderPagination() {
  const info = document.getElementById("pageInfo");
  const host = document.getElementById("pageLinks");
  if (info) {
    const n = filteredProducts.length;
    if (!n) info.textContent = "0 products";
    else if (!isFinite(pageSize)) info.textContent = `Showing all ${n} products`;
    else {
      const start = (currentPage - 1) * pageSize + 1;
      const end = Math.min(n, currentPage * pageSize);
      info.textContent = `${start}–${end} of ${n}`;
    }
  }
  if (!host) return;

  const pages = totalPages();
  if (!isFinite(pageSize) || pages <= 1) { host.innerHTML = ""; return; }

  const want = new Set([1, pages, currentPage, currentPage - 1, currentPage + 1, currentPage - 2, currentPage + 2]);
  const nums = [...want].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b);

  const parts = [];
  parts.push(`<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
    <a class="page-link" href="javascript:void(0)" data-page="${currentPage - 1}">Prev</a></li>`);
  let prev = 0;
  for (const n of nums) {
    if (n - prev > 1) parts.push(`<li class="page-item disabled"><span class="page-link">…</span></li>`);
    parts.push(`<li class="page-item ${n === currentPage ? "active" : ""}">
      <a class="page-link" href="javascript:void(0)" data-page="${n}">${n}</a></li>`);
    prev = n;
  }
  parts.push(`<li class="page-item ${currentPage === pages ? "disabled" : ""}">
    <a class="page-link" href="javascript:void(0)" data-page="${currentPage + 1}">Next</a></li>`);
  host.innerHTML = parts.join("");
}

function goToPage(n) {
  const pages = totalPages();
  currentPage = Math.min(Math.max(1, Number(n) || 1), pages);
  renderProductRows();
  document.querySelector(".table-responsive")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== Render =====

function renderProductRows() {
  const tbody = document.getElementById("allproduct");
  if (!tbody) return;

  const pages = totalPages();
  if (currentPage > pages) currentPage = pages;

  if (!filteredProducts.length) {
    tbody.innerHTML = `<tr><td colspan="13" class="text-center text-muted py-4">No products match the current filter.</td></tr>`;
    renderPagination();
    updateBulkButton();
    return;
  }

  const slice = getPageSlice();
  const baseIndex = isFinite(pageSize) ? (currentPage - 1) * pageSize : 0;

  tbody.innerHTML = slice.map((v, index) => {
    const p = v.raw;
    const checked = selectedIds.has(v.id) ? "checked" : "";
    return `
      <tr>
        <td>
          <div class="form-check">
            <input type="checkbox" class="form-check-input product-check" data-id="${v.id}" ${checked}>
          </div>
        </td>
        <td>${baseIndex + index + 1}</td>
        <td class="d-flex align-items-center gap-2">
          <img src="${resolveMedia(p.mainImage || p.mainimage || p.image)}" class="rounded"
               height="48" width="48" style="object-fit:cover;"
               onerror="this.src='https://via.placeholder.com/48'"/>
          <span>${truncateWords(v.name, 5)}</span>
        </td>
        <td>${truncateWords(p.shortDescription || p.shortdescription || "", 5)}</td>
        <td>${truncateWords(p.description || "", 4)}</td>
        <td>${v.categoryName || "-"}</td>
        <td>${v.brandName || "-"}</td>
        <td>${v.discountPrice || "-"}</td>
        <td>${v.price || "-"}</td>
        <td>${v.stockQuantity || 0}</td>
        <td>
          <span class="badge ${v.isActive ? "bg-success-subtle text-success" : "bg-danger-subtle text-danger"}">
            ${v.isActive ? "Active" : "Inactive"}
          </span>
        </td>
        <td><i class="mdi mdi-square-edit-outline text-primary fs-3" style="cursor:pointer" onclick="editProduct('${v.id}')"></i></td>
        <td><i class="mdi mdi-delete text-danger fs-3" style="cursor:pointer" onclick="deleteProduct('${v.id}')"></i></td>
      </tr>`;
  }).join("");

  renderPagination();
  updateBulkButton();
}

// Walk backend cursor pagination so the vendor can see every one of their
// products even when the catalog is large. We filter by ownership locally
// because the list endpoint doesn't currently expose a vendor filter.
async function fetchAllProductsFromApi(token) {
  const HARD_CAP = 10000;
  const PAGE = 100;
  const out = [];
  let cursor = null;

  while (out.length < HARD_CAP) {
    const qs = new URLSearchParams();
    qs.set("pageSize", String(PAGE));
    if (cursor) qs.set("cursor", cursor);

    const res = await fetchJson(`${API_BASE}/api/products/list?${qs.toString()}`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const payload = res?.data ?? res;
    if (Array.isArray(payload)) { out.push(...payload); break; }

    const batch = payload?.data || payload?.items || [];
    if (batch.length) out.push(...batch);

    const hasMore = !!payload?.hasMore;
    const next = payload?.nextCursor || null;
    if (!hasMore || !next || next === cursor) break;
    cursor = next;
  }
  return out;
}

async function loadProduct() {
  const tbody = document.getElementById("allproduct");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="13" class="text-center text-muted py-4">
    <div class="spinner-border spinner-border-sm me-2" role="status"></div>Loading your products…
  </td></tr>`;

  try {
    const token = authToken();
    const vendorId = getVendorIdFromToken();
    const vendorEmail = getVendorEmailFromToken();
    const vendorFullName = getVendorFullNameFromToken();

    const rawProducts = await fetchAllProductsFromApi(token);
    const myProducts = rawProducts.filter(p => isProductOwnedByVendor(p, vendorId, vendorEmail, vendorFullName));

    allLoadedProducts = myProducts.map(p => {
      const view = normalizeProductForView(p);
      view.raw = p;
      return view;
    });

    applyActiveFilters();
  } catch (error) {
    console.error("Error:", error);
    tbody.innerHTML = `<tr><td colspan="13" class="text-center text-danger py-4">Failed to load products.</td></tr>`;
  }
}

// ===== Bulk update =====

async function runBulkUpdate() {
  const token = authToken();
  if (!token) {
    Swal.fire({ icon: "warning", title: "Login required" });
    return;
  }
  const useAll = document.getElementById("bulkApplyToAllFiltered")?.checked;
  const ids = useAll ? filteredProducts.map(p => p.id) : Array.from(selectedIds);
  if (!ids.length) {
    Swal.fire({ icon: "warning", title: "No products selected" });
    return;
  }

  const body = { productIds: ids };
  const priceVal    = document.getElementById("bulkPrice")?.value;
  const discountVal = document.getElementById("bulkDiscountPrice")?.value;
  const stockVal    = document.getElementById("bulkStockQuantity")?.value;
  const activeVal   = document.getElementById("bulkIsActive")?.value;
  const featuredVal = document.getElementById("bulkIsFeatured")?.value;

  if (priceVal !== "" && priceVal != null)       body.price = Number(priceVal);
  if (discountVal !== "" && discountVal != null) body.discountPrice = Number(discountVal);
  if (stockVal !== "" && stockVal != null)       body.stockQuantity = parseInt(stockVal, 10);
  if (activeVal !== "")                          body.isActive = activeVal === "true";
  if (featuredVal !== "")                        body.isFeatured = featuredVal === "true";

  if (Object.keys(body).length <= 1) {
    Swal.fire({ icon: "warning", title: "Nothing to update", text: "Fill at least one field." });
    return;
  }

  const confirm = await Swal.fire({
    icon: "question",
    title: `Update ${ids.length} product(s)?`,
    text: "This cannot be undone.",
    showCancelButton: true,
    confirmButtonText: "Yes, update",
  });
  if (!confirm.isConfirmed) return;

  try {
    Swal.fire({ title: "Updating...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const res = await fetchJson(`${API_BASE}/api/products/bulk-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    closeModalById("bulkUpdateModal");
    await Swal.fire({
      icon: "success",
      title: "Bulk update complete",
      text: res?.message || `Updated ${res?.updated ?? ids.length} product(s).`,
    });
    selectedIds.clear();
    await loadProduct();
  } catch (err) {
    Swal.fire({ icon: "error", title: "Bulk update failed", text: err.message });
  }
}

// ===== Export (selection-aware) =====

// RFC 4180: wrap in quotes and double-up any embedded quote.
function csvEscape(value) {
  const s = value == null ? "" : String(value).replace(/\r?\n|\r/g, " ").trim();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportProductsCsv() {
  let rows, source;
  if (selectedIds.size > 0) {
    rows = filteredProducts.filter(p => selectedIds.has(p.id));
    if (rows.length < selectedIds.size) {
      rows = allLoadedProducts.filter(p => selectedIds.has(p.id));
    }
    source = "selected";
  } else if (filteredProducts.length) {
    rows = filteredProducts;
    source = "filtered";
  } else {
    rows = allLoadedProducts;
    source = "all";
  }

  if (!rows.length) {
    Swal.fire({ icon: "info", title: "Nothing to export", text: "The product list is empty." });
    return;
  }

  const headers = [
    "S.No", "Product ID", "Name", "SKU",
    "Category", "Brand", "Price", "Discount Price",
    "Stock Quantity", "Status", "Featured",
  ];

  const lines = [headers.map(csvEscape).join(",")];
  rows.forEach((v, i) => {
    lines.push([
      i + 1,
      v.id,
      v.name,
      v.sku,
      v.categoryName,
      v.brandName,
      v.price,
      v.discountPrice,
      v.stockQuantity,
      v.isActive ? "Active" : "Inactive",
      v.isFeatured ? "Yes" : "No",
    ].map(csvEscape).join(","));
  });

  // UTF-8 BOM so Excel renders ₹ and accents correctly.
  const csv = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `my-products-${source}-${rows.length}-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  Swal.fire({
    toast: true, position: "top-end", icon: "success",
    title: `Exported ${rows.length} product(s)`,
    showConfirmButton: false, timer: 1500,
  });
}

// ===== Event wiring =====

function wireBulkAndFilterUi() {
  const filterModalEl = document.getElementById("filterModal");
  filterModalEl?.addEventListener("show.bs.modal", () => {
    const host = document.getElementById("filterRows");
    if (host && !host.children.length) addFilterRow();
  });
  document.getElementById("addFilterRowBtn")?.addEventListener("click", () => addFilterRow());
  document.getElementById("resetFilterBtn")?.addEventListener("click", () => {
    document.getElementById("filterRows").innerHTML = "";
    addFilterRow();
    activeFilters = [];
    applyActiveFilters();
  });
  document.getElementById("clearFiltersLink")?.addEventListener("click", () => {
    activeFilters = [];
    document.getElementById("filterRows").innerHTML = "";
    applyActiveFilters();
  });
  document.getElementById("applyFilterBtn")?.addEventListener("click", () => {
    const rows = document.querySelectorAll("#filterRows .filter-row");
    activeFilters = collectActiveFilters();
    if (!activeFilters.length && rows.length) {
      Swal.fire({ icon: "warning", title: "Fill at least one condition",
        text: "Pick a field, an operator and a value before clicking Apply." });
      return;
    }
    applyActiveFilters();
    closeModalById("filterModal");
    if (activeFilters.length) {
      Swal.fire({
        toast: true, position: "top-end", icon: "success", showConfirmButton: false,
        timer: 1400,
        title: `${filteredProducts.length} of ${allLoadedProducts.length} products match`,
      });
    }
  });

  document.getElementById("pageSizeSelect")?.addEventListener("change", (e) => {
    const v = e.target.value;
    pageSize = v === "all" ? Infinity : (Number(v) || 50);
    currentPage = 1;
    renderProductRows();
  });
  document.getElementById("pageLinks")?.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-page]");
    if (!a) return;
    e.preventDefault();
    goToPage(a.dataset.page);
  });

  let searchTimer = null;
  document.getElementById("productSearchInput")?.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const v = e.target.value || "";
    searchTimer = setTimeout(() => {
      searchQuery = v;
      applyActiveFilters();
    }, 180);
  });

  document.addEventListener("change", (e) => {
    const cb = e.target.closest(".product-check");
    if (cb) {
      const id = cb.dataset.id;
      if (cb.checked) selectedIds.add(id); else selectedIds.delete(id);
      updateBulkButton();
      return;
    }
    if (e.target.id === "selectAllRows") {
      const turnOn = e.target.checked;
      getPageSlice().forEach(p => turnOn ? selectedIds.add(p.id) : selectedIds.delete(p.id));
      renderProductRows();
    }
  });

  const bulkModalEl = document.getElementById("bulkUpdateModal");
  bulkModalEl?.addEventListener("show.bs.modal", () => {
    const count = document.getElementById("bulkUpdateTargetCount");
    if (count) count.textContent = String(selectedIds.size);
    ["bulkPrice", "bulkDiscountPrice", "bulkStockQuantity"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    ["bulkIsActive", "bulkIsFeatured"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });
    const all = document.getElementById("bulkApplyToAllFiltered");
    if (all) all.checked = false;
  });

  document.getElementById("bulkApplyToAllFiltered")?.addEventListener("change", (e) => {
    const count = document.getElementById("bulkUpdateTargetCount");
    if (!count) return;
    count.textContent = e.target.checked
      ? String(filteredProducts.length)
      : String(selectedIds.size);
  });

  document.getElementById("runBulkUpdateBtn")?.addEventListener("click", runBulkUpdate);
}

async function uploadProductsFile(file) {
  const token = authToken();
  if (!token) {
    Swal.fire({ icon: "warning", title: "Please login first" });
    return;
  }
  if (!file) {
    Swal.fire({ icon: "warning", title: "Please select a file first" });
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    Swal.fire({ title: "Uploading...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    const response = await fetchJson(PRODUCT_IMPORT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    await Swal.fire({
      icon: "success",
      title: "Import complete",
      text: response?.message || "Products imported successfully.",
    });
    const modalEl = document.getElementById("importModal");
    if (modalEl && window.bootstrap?.Modal) {
      const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
      modalInstance?.hide();
    }
    const fileInput = document.getElementById("excelFile");
    if (fileInput) fileInput.value = "";
    loadProduct();
  } catch (err) {
    Swal.fire({ icon: "error", title: "Import failed", text: err.message });
  }
}

// Legacy server-side export kept as a fallback option — the default Export
// button now calls `exportProductsCsv` which builds the file locally from the
// exact rows the vendor sees (selection / filter / search aware).
async function exportProducts() {
  exportProductsCsv();
}

window.editProduct = function editProduct(id) {
  window.location.href = `product-edit.php?id=${encodeURIComponent(id)}`;
};

window.deleteProduct = async function deleteProduct(id) {
  const token = authToken();
  if (!token) {
    Swal.fire({ icon: "warning", title: "Login required", text: "Please login first." });
    return;
  }
  const confirm = await Swal.fire({
    icon: "warning",
    title: "Delete permanently?",
    text: "This action cannot be undone!",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
  });
  if (!confirm.isConfirmed) return;

  try {
    Swal.fire({ title: "Deleting...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    await fetchJson(`${API_BASE}/api/products/permanent-delete-product/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await Swal.fire({ icon: "success", title: "Deleted!", text: "Product deleted successfully." });
    loadProduct();
  } catch (err) {
    Swal.fire({ icon: "error", title: "Error", text: err.message });
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  const hasCategoryUi = document.getElementById("CategoryLevelsContainer");
  if (hasCategoryUi) {
    try {
      await loadProductFormOptions();
      await loadProductForEdit();
      syncSalesStatusDisplay();
      document.getElementById("IsActive")?.addEventListener("change", syncSalesStatusDisplay);
    } catch (err) {
      console.error("Form setup error:", err);
    }
  }
  const uploadBtn = document.getElementById("uploadExcelBtn");
  const fileInput = document.getElementById("excelFile");
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener("click", (e) => {
      e.preventDefault();
      uploadProductsFile(fileInput.files?.[0]);
    });
  }

  const exportBtn = document.getElementById("exportProductsBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", (e) => {
      e.preventDefault();
      exportProductsCsv();
    });
  }

  wireBulkAndFilterUi();
  loadProduct();
});
