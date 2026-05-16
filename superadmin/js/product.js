const API_BASE = "https://api.workarya.com";
const PRODUCT_INSERT = `${API_BASE}/api/products/insert`;
const PRODUCT_UPDATE_BASE = `${API_BASE}/api/products/update`;
const PRODUCT_DETAIL_BASE = `${API_BASE}/api/products/detail`;

let categoryTree = [];

function authToken() {
  return localStorage.getItem("superadminToken");
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

function pickVendorName(product) {
  return (
    product.vendorName ||
    product.VendorName ||
    product.venderName ||
    product.sellerName ||
    product.SellerName ||
    product.shopName ||
    product.businessName ||
    product.BusinessName ||
    product.createdByName ||
    product.CreatedByName ||
    product.createdBy ||
    product.CreatedBy ||
    product.vendorEmail ||
    product.VendorEmail ||
    "-"
  );
}

async function loadCreatorNameMap(token) {
  try {
    const res = await fetch(`${API_BASE}/admin-vendors`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const json = await res.json();
    const list = json?.data || [];
    const map = {};
    list.forEach((v) => {
      const id = (v?.id || v?.Id || v?.vendorId || v?.VendorId || v?.userId || v?.UserId || "").toString().trim();
      if (!id) return;
      const fullName = `${v?.firstName || ""} ${v?.lastName || ""}`.trim();
      map[id] = fullName || v?.email || id;
    });
    return map;
  } catch {
    return {};
  }
}

function pickCreatedById(product) {
  return (
    product.createdById ||
    product.CreatedById ||
    product.createdBy ||
    product.CreatedBy ||
    product.vendorId ||
    product.VendorId ||
    product.vendorid ||
    product.userId ||
    product.UserId ||
    product.userid ||
    product.sellerId ||
    product.SellerId ||
    ""
  )
    .toString()
    .trim();
}

function pickCreatedByName(product, creatorMap) {
  const apiName =
    product.createdbyname ||
    product.createdByName ||
    product.CreatedByName ||
    "";
  if (apiName && apiName.toString().trim()) return apiName.toString().trim();

  const createdById = pickCreatedById(product);
  if (createdById && creatorMap[createdById]) return creatorMap[createdById];
  const directName = pickVendorName(product);
  if (directName && directName !== "-" && directName !== createdById) return directName;
  return createdById || "-";
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

function flattenCategoryNodes(nodes, bucket = [], parent = null) {
  (nodes || []).forEach((n) => {
    bucket.push({
      id: n.id || n._id,
      name: n.name,
      parentId: parent ? (parent.id || parent._id) : null,
      raw: n,
    });
    if (n.children?.length) flattenCategoryNodes(n.children, bucket, n);
  });
  return bucket;
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

    const selectedNode =
      nodesAtLevel.find((n) => getNodeId(n) === selectedAtLevel) || null;
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
      const nextPath = selects
        .slice(0, changedLevel + 1)
        .map((s) => s.value)
        .filter(Boolean);
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

// ===== Bulk edit + filter state =====
// `allLoadedProducts` keeps every product returned by the API so Reset can
// restore the view without re-fetching. `activeFilters` is the UI state used
// to compute `filteredProducts` on render. `selectedIds` tracks checkboxes
// (survives re-render so users can page through and tick items.)
let allLoadedProducts = [];
let filteredProducts = [];
let activeFilters = [];
const selectedIds = new Set();

// Client-side pagination state. `pageSize === Infinity` means "show all".
let currentPage = 1;
let pageSize = 50;

// Quick search box above the table — matches across name, SKU, category, brand.
let searchQuery = "";

// Some admin pages load Bootstrap as an ES module (window.bootstrap undefined)
// so this helper closes a modal in a way that works in both setups.
function closeModalById(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  if (window.bootstrap?.Modal?.getInstance) {
    window.bootstrap.Modal.getInstance(modal)?.hide();
    return;
  }
  // Fallback: click any element inside the modal that already has the
  // data-bs-dismiss hook — Bootstrap's own delegate listener will handle it.
  const closer = modal.querySelector("[data-bs-dismiss='modal']");
  if (closer) {
    closer.click();
    return;
  }
  // Last-ditch manual close so the UI never gets stuck with a live backdrop.
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  document.body.classList.remove("modal-open");
  document.body.style.removeProperty("overflow");
  document.body.style.removeProperty("padding-right");
  document.querySelectorAll(".modal-backdrop").forEach(b => b.remove());
}

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

// ===== Filtering =====

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
      { key: "eq",      label: "Equal to" },
      { key: "neq",     label: "Not equal to" },
      { key: "gt",      label: "Greater than (>)" },
      { key: "gte",     label: "Greater or equal (≥)" },
      { key: "lt",      label: "Less than (<)" },
      { key: "lte",     label: "Less or equal (≤)" },
      { key: "between", label: "Between" },
    ];
  }
  if (type === "text") {
    return [
      { key: "contains", label: "Contains" },
      { key: "eq",       label: "Equal to" },
      { key: "neq",      label: "Not equal to" },
      { key: "starts",   label: "Starts with" },
      { key: "ends",     label: "Ends with" },
    ];
  }
  return [{ key: "eq", label: "Equal to" }];
}

function addFilterRow(prefill) {
  const host = document.getElementById("filterRows");
  if (!host) return;

  const row = document.createElement("div");
  row.className = "row g-2 align-items-end mb-2 filter-row";
  row.innerHTML = `
    <div class="col-md-3">
      <label class="form-label small mb-1">Field</label>
      <select class="form-select form-select-sm filter-field">
        <option value="">Select field</option>
        ${FILTER_FIELDS.map(f => `<option value="${f.key}">${f.label}</option>`).join("")}
      </select>
    </div>
    <div class="col-md-3">
      <label class="form-label small mb-1">Operator</label>
      <select class="form-select form-select-sm filter-operator" disabled>
        <option value="">Select operator</option>
      </select>
    </div>
    <div class="col-md-5 filter-value-wrap">
      <label class="form-label small mb-1">Value</label>
      <input type="text" class="form-control form-control-sm filter-value" disabled>
    </div>
    <div class="col-md-1">
      <button type="button" class="btn btn-sm btn-outline-danger w-100 remove-filter-row" title="Remove">
        <i class="mdi mdi-close"></i>
      </button>
    </div>
  `;
  host.appendChild(row);

  const fieldSel = row.querySelector(".filter-field");
  const opSel = row.querySelector(".filter-operator");
  const valWrap = row.querySelector(".filter-value-wrap");

  fieldSel.addEventListener("change", () => {
    const f = FILTER_FIELDS.find(x => x.key === fieldSel.value);
    opSel.innerHTML = '<option value="">Select operator</option>';
    opSel.disabled = !f;
    if (!f) return;
    operatorsForType(f.type).forEach(o => {
      opSel.insertAdjacentHTML("beforeend", `<option value="${o.key}">${o.label}</option>`);
    });
    buildValueInput(valWrap, f.type, "");
  });

  opSel.addEventListener("change", () => {
    const f = FILTER_FIELDS.find(x => x.key === fieldSel.value);
    if (!f) return;
    buildValueInput(valWrap, f.type, opSel.value);
  });

  row.querySelector(".remove-filter-row").addEventListener("click", () => row.remove());

  if (prefill) {
    fieldSel.value = prefill.field;
    fieldSel.dispatchEvent(new Event("change"));
    opSel.value = prefill.op;
    opSel.dispatchEvent(new Event("change"));
    const inputs = valWrap.querySelectorAll("input,select");
    if (inputs[0]) inputs[0].value = prefill.value ?? "";
    if (inputs[1] && prefill.value2 != null) inputs[1].value = prefill.value2;
  }
}

function buildValueInput(wrap, type, op) {
  const label = '<label class="form-label small mb-1">Value</label>';
  if (!type || !op) {
    wrap.innerHTML = `${label}<input type="text" class="form-control form-control-sm filter-value" disabled>`;
    return;
  }
  if (type === "bool") {
    wrap.innerHTML = `
      ${label}
      <select class="form-select form-select-sm filter-value">
        <option value="true">Yes / Active</option>
        <option value="false">No / Inactive</option>
      </select>`;
    return;
  }
  if (type === "number" && op === "between") {
    wrap.innerHTML = `
      ${label}
      <div class="d-flex gap-1">
        <input type="number" step="any" class="form-control form-control-sm filter-value" placeholder="From">
        <input type="number" step="any" class="form-control form-control-sm filter-value-2" placeholder="To">
      </div>`;
    return;
  }
  const inputType = type === "number" ? "number" : "text";
  const step = type === "number" ? 'step="any"' : "";
  wrap.innerHTML = `${label}<input type="${inputType}" ${step} class="form-control form-control-sm filter-value" placeholder="Enter value">`;
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
  if (rule.type === "bool") {
    return Boolean(v) === (rule.value === "true");
  }
  if (rule.type === "number") {
    const n = Number(v);
    const a = Number(rule.value);
    const b = Number(rule.value2);
    switch (rule.op) {
      case "eq":      return n === a;
      case "neq":     return n !== a;
      case "gt":      return n > a;
      case "gte":     return n >= a;
      case "lt":      return n < a;
      case "lte":     return n <= a;
      case "between": return n >= Math.min(a, b) && n <= Math.max(a, b);
    }
    return true;
  }
  const s = String(v ?? "").toLowerCase();
  const q = String(rule.value ?? "").toLowerCase();
  switch (rule.op) {
    case "contains": return s.includes(q);
    case "eq":       return s === q;
    case "neq":      return s !== q;
    case "starts":   return s.startsWith(q);
    case "ends":     return s.endsWith(q);
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
  currentPage = 1; // filter/search changed → jump back to first page
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

// ===== Pagination helpers =====

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
    if (!n) {
      info.textContent = "0 products";
    } else if (!isFinite(pageSize)) {
      info.textContent = `Showing all ${n} products`;
    } else {
      const start = (currentPage - 1) * pageSize + 1;
      const end = Math.min(n, currentPage * pageSize);
      info.textContent = `${start}–${end} of ${n}`;
    }
  }
  if (!host) return;

  const pages = totalPages();
  if (!isFinite(pageSize) || pages <= 1) {
    host.innerHTML = "";
    return;
  }

  // Build a compact page list: first, last, current ±2, with ellipses.
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
  // Scroll the table header into view so users see the new page start.
  document.querySelector(".table-responsive")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ===== Render =====

function renderProductRows() {
  const tbody = document.getElementById("allproduct");
  if (!tbody) return;

  // Clamp current page in case the filter shrank the list.
  const pages = totalPages();
  if (currentPage > pages) currentPage = pages;

  if (!filteredProducts.length) {
    tbody.innerHTML = `<tr><td colspan="14" class="text-center text-muted py-4">No products match the current filter.</td></tr>`;
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
        <td>${truncateWords(p.__creatorName || "-", 4)}</td>
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

// Walk cursor-based pagination end to end. Backend returns { data:[...], hasMore, nextCursor },
// so we keep paging until the server says there's nothing left (or we hit the hard cap).
// This gives the admin every product instead of just the first 50.
async function fetchAllProductsFromApi(token) {
  const HARD_CAP = 10000; // safety guard so we never lock the browser
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

    // Backend envelope: { success, data: { data:[…], hasMore, nextCursor, … } }.
    // Older non-cursor endpoints returned a bare array, so handle both shapes.
    const payload = res?.data ?? res;

    if (Array.isArray(payload)) {
      // Non-cursor endpoint: got everything in one shot.
      out.push(...payload);
      break;
    }

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

  tbody.innerHTML = `<tr><td colspan="14" class="text-center text-muted py-4">
    <div class="spinner-border spinner-border-sm me-2" role="status"></div>Loading products…
  </td></tr>`;

  try {
    const token = authToken();
    const products = await fetchAllProductsFromApi(token);
    const creatorMap = await loadCreatorNameMap(token);

    allLoadedProducts = products.map(p => {
      const raw = { ...p, __creatorName: pickCreatedByName(p, creatorMap) };
      const view = normalizeProductForView(raw);
      view.raw = raw;
      return view;
    });

    applyActiveFilters();
  } catch (error) {
    console.error("Error:", error);
    tbody.innerHTML = `<tr><td colspan="14" class="text-center text-danger py-4">Failed to load products.</td></tr>`;
  }
}

// ===== Event wiring =====

function wireBulkAndFilterUi() {
  // Filter modal — opened by Bootstrap via data-bs-toggle. We hook into its
  // `show.bs.modal` event so a blank condition row is always ready to fill.
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
    // Validate each row so a half-filled condition doesn't silently get dropped.
    const rows = document.querySelectorAll("#filterRows .filter-row");
    let incomplete = 0;
    rows.forEach(row => {
      const field = row.querySelector(".filter-field")?.value;
      const op = row.querySelector(".filter-operator")?.value;
      const val = row.querySelector(".filter-value")?.value ?? "";
      const type = FILTER_FIELDS.find(f => f.key === field)?.type;
      if (!field || !op) { incomplete++; return; }
      if (type !== "bool" && val === "") incomplete++;
    });

    activeFilters = collectActiveFilters();

    if (!activeFilters.length && rows.length) {
      if (typeof Swal !== "undefined") {
        Swal.fire({ icon: "warning", title: "Fill at least one condition",
          text: "Pick a field, an operator and a value before clicking Apply." });
      } else {
        alert("Please pick a field, operator and value before clicking Apply.");
      }
      return;
    }

    applyActiveFilters();
    closeModalById("filterModal");

    if (typeof Swal !== "undefined" && activeFilters.length) {
      Swal.fire({
        toast: true, position: "top-end", icon: "success", showConfirmButton: false,
        timer: 1400,
        title: `${filteredProducts.length} of ${allLoadedProducts.length} products match`,
      });
    }
  });

  // Page-size dropdown + click-to-page links.
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

  // Top-of-table search — debounced so we don't re-render on every keystroke.
  let searchTimer = null;
  document.getElementById("productSearchInput")?.addEventListener("input", (e) => {
    clearTimeout(searchTimer);
    const v = e.target.value || "";
    searchTimer = setTimeout(() => {
      searchQuery = v;
      applyActiveFilters();
    }, 180);
  });

  // Row + select-all checkboxes (event delegation so re-render is cheap)
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
      // Only toggle rows visible on the current page — matches what the user sees.
      getPageSlice().forEach(p => turnOn ? selectedIds.add(p.id) : selectedIds.delete(p.id));
      renderProductRows();
    }
  });

  // Bulk update modal — Bootstrap handles open via data-bs-toggle on the button.
  // We just reset the form every time it's about to open so stale values don't linger.
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

  // Export → if any rows are checked, export just those; otherwise export every
  // product currently in the filtered/search view so the CSV matches what the
  // admin sees on screen.
  document.getElementById("exportProductsBtn")?.addEventListener("click", exportProductsCsv);
}

// ===== Export =====

// RFC 4180 style: wrap in quotes and double-up any embedded quote. Trim newlines
// because a raw CR/LF inside a cell breaks Excel's parser.
function csvEscape(value) {
  const s = value == null ? "" : String(value).replace(/\r?\n|\r/g, " ").trim();
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportProductsCsv() {
  // Priority: explicit selection > current filtered view > everything loaded.
  let rows;
  let source;
  if (selectedIds.size > 0) {
    rows = filteredProducts.filter(p => selectedIds.has(p.id));
    // If the user selected rows that aren't in the current filter (possible
    // across pages), fall back to allLoadedProducts so we still honour selection.
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
    "S.No", "Product ID", "Name", "SKU", "Vendor",
    "Category", "Brand", "Price", "Discount Price",
    "Stock Quantity", "Status", "Featured",
  ];

  const lines = [headers.map(csvEscape).join(",")];
  rows.forEach((v, i) => {
    const p = v.raw || {};
    lines.push([
      i + 1,
      v.id,
      v.name,
      v.sku,
      p.__creatorName || "",
      v.categoryName,
      v.brandName,
      v.price,
      v.discountPrice,
      v.stockQuantity,
      v.isActive ? "Active" : "Inactive",
      v.isFeatured ? "Yes" : "No",
    ].map(csvEscape).join(","));
  });

  // BOM so Excel auto-detects UTF-8 (rupee/accented characters stay readable).
  const csv = "\uFEFF" + lines.join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `products-${source}-${rows.length}-${stamp}.csv`;
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
  const priceVal          = document.getElementById("bulkPrice")?.value;
  const discountVal       = document.getElementById("bulkDiscountPrice")?.value;
  const stockVal          = document.getElementById("bulkStockQuantity")?.value;
  const activeVal         = document.getElementById("bulkIsActive")?.value;
  const featuredVal       = document.getElementById("bulkIsFeatured")?.value;

  if (priceVal !== "" && priceVal != null)          body.price = Number(priceVal);
  if (discountVal !== "" && discountVal != null)    body.discountPrice = Number(discountVal);
  if (stockVal !== "" && stockVal != null)          body.stockQuantity = parseInt(stockVal, 10);
  if (activeVal !== "")                             body.isActive = activeVal === "true";
  if (featuredVal !== "")                           body.isFeatured = featuredVal === "true";

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
  // Filter/bulk-update UI only exists on the listing page; the wiring is safe
  // to call on pages that don't have those buttons (it no-ops).
  wireBulkAndFilterUi();
  loadProduct();
});
