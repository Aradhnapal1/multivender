document.addEventListener('DOMContentLoaded', () => {
    const BASE_URL = 'https://api.workarya.com';
    let selectedFilters = {
        categories: [],
        brands: [],
        sizes: [],
        colors: [],
        price: null
    };

    // Read category/brand/search scope from URL (category-first listing).
    const urlParams = new URLSearchParams(window.location.search);
    const scopedCategoryId = (urlParams.get('categoryId') || '').trim();
    const scopedBrandId = (urlParams.get('brandId') || '').trim();
    const scopedSearch = (urlParams.get('Search') || urlParams.get('search') || urlParams.get('q') || '').trim();
    const hasScope = Boolean(scopedCategoryId || scopedBrandId || scopedSearch);

    // APIs
    const API_ENDPOINTS = {
        categories: `${BASE_URL}/api/category/list`,
        brands: `${BASE_URL}/api/brands/list`,
        colors: `${BASE_URL}/api/colors/get`,
        sizes: `${BASE_URL}/api/size/get`
    };

    // DOM Elements
    const categoryListEl = document.getElementById('filterCategoryList');
    const brandListEl = document.getElementById('filterBrandList');
    const sizeListEl = document.getElementById('filterSizeList');
    const colorListEl = document.getElementById('filterColorList');

    // Categories filter stays visible so users can broaden the set by
    // adding sibling categories (union / OR within the Categories dimension).
    const minRange = document.getElementById('minRange');
    const maxRange = document.getElementById('maxRange');
    const minPriceEl = document.getElementById('min-price');
    const maxPriceEl = document.getElementById('max-price');
    const selectedFiltersContainer = document.getElementById('selectedFiltersContainer');
    const filterCategory2Container = document.getElementById('filterCategory2Container');
    const sidebarSelectedFilters = document.getElementById('sidebarSelectedFilters');

    async function fetchApi(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    function getColorCode(colorName) {
        const ctx = document.createElement("canvas").getContext("2d");
        ctx.fillStyle = colorName.toLowerCase();
        return ctx.fillStyle; 
    }

    function renderSelectedFilters() {
        if (!selectedFiltersContainer && !sidebarSelectedFilters) return;
        
        if (selectedFiltersContainer) selectedFiltersContainer.innerHTML = '';
        if (sidebarSelectedFilters) sidebarSelectedFilters.innerHTML = '';
        
        let hasFilters = false;

        const createBadge = (type, value, id) => {
            hasFilters = true;
            if (selectedFiltersContainer) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-light text-dark border d-flex align-items-center py-2 px-3 m-1';
                badge.style.fontSize = '14px';
                badge.innerHTML = `${value} <i class="ri-close-line ms-2" style="cursor:pointer; font-size:16px;" onclick="removeFilter('${type}', '${id}')"></i>`;
                selectedFiltersContainer.appendChild(badge);
            }
            if (sidebarSelectedFilters) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="javascript:void(0)" onclick="removeFilter('${type}', '${id}')">${value} <i class="ri-close-line ms-2"></i></a>`;
                sidebarSelectedFilters.appendChild(li);
            }
        };

        // Render the URL's search term as a removable chip, so users know it's
        // still narrowing results alongside their sidebar filters.
        const activeSearch = (new URLSearchParams(window.location.search)).get('Search')
            || (new URLSearchParams(window.location.search)).get('search')
            || (new URLSearchParams(window.location.search)).get('q')
            || '';
        if (activeSearch) {
            hasFilters = true;
            const label = `Search: "${activeSearch}"`;
            if (selectedFiltersContainer) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-light text-dark border d-flex align-items-center py-2 px-3 m-1';
                badge.style.fontSize = '14px';
                badge.innerHTML = `${label} <i class="ri-close-line ms-2" style="cursor:pointer; font-size:16px;" onclick="clearSearchFilter()"></i>`;
                selectedFiltersContainer.appendChild(badge);
            }
            if (sidebarSelectedFilters) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="javascript:void(0)" onclick="clearSearchFilter()">${label} <i class="ri-close-line ms-2"></i></a>`;
                sidebarSelectedFilters.appendChild(li);
            }
        }

        selectedFilters.categories.forEach(item => createBadge('categories', item.name, item.id));
        selectedFilters.brands.forEach(item => createBadge('brands', item.name, item.id));
        selectedFilters.sizes.forEach(item => createBadge('sizes', item.name, item.id));
        selectedFilters.colors.forEach(item => createBadge('colors', item.name, item.id));

        if (selectedFilters.price) {
            hasFilters = true;
            if (selectedFiltersContainer) {
                const badge = document.createElement('span');
                badge.className = 'badge bg-light text-dark border d-flex align-items-center py-2 px-3 m-1';
                badge.style.fontSize = '14px';
                badge.innerHTML = `₹${selectedFilters.price.min} - ₹${selectedFilters.price.max} <i class="ri-close-line ms-2" style="cursor:pointer; font-size:16px;" onclick="resetPriceFilter()"></i>`;
                selectedFiltersContainer.appendChild(badge);
            }
            if (sidebarSelectedFilters) {
                const li = document.createElement('li');
                li.innerHTML = `<a href="javascript:void(0)" onclick="resetPriceFilter()">₹${selectedFilters.price.min} - ₹${selectedFilters.price.max} <i class="ri-close-line ms-2"></i></a>`;
                sidebarSelectedFilters.appendChild(li);
            }
        }

        if (hasFilters) {
            if (filterCategory2Container) filterCategory2Container.style.display = 'block';
            if (selectedFiltersContainer) {
                const clearAll = document.createElement('a');
                clearAll.href = 'javascript:void(0)';
                clearAll.className = 'text-danger ms-2 fw-bold text-decoration-underline align-self-center m-1';
                clearAll.innerText = 'Clear All';
                clearAll.onclick = clearAllFilters;
                selectedFiltersContainer.appendChild(clearAll);
            }
        } else {
            if (filterCategory2Container) filterCategory2Container.style.display = 'none';
        }

        if (typeof window.applyFilters === 'function') {
            window.applyFilters(selectedFilters);
        }
    }

    window.removeFilter = function (type, id) {
        selectedFilters[type] = selectedFilters[type].filter(item => item.id !== id);
        
        const checkbox = document.getElementById(`filter-${type}-${id}`);
        if (checkbox) checkbox.checked = false;
        
        if (type === 'colors') {
            const btn = document.getElementById(`filter-color-${id}`);
            if (btn) btn.classList.remove('active', 'border-dark');
        }

        renderSelectedFilters();
    };

    // Remove the `search`/`Search`/`q` query param from the URL without a full
    // reload, then re-fetch so current sidebar filters apply on their own.
    window.clearSearchFilter = function () {
        const params = new URLSearchParams(window.location.search);
        let changed = false;
        ['search', 'Search', 'q'].forEach((key) => {
            if (params.has(key)) { params.delete(key); changed = true; }
        });
        if (!changed) return;

        // Stay on shop.php — without any scope we just show the full catalog.
        const newQuery = params.toString();
        const newUrl = `${window.location.pathname}${newQuery ? `?${newQuery}` : ''}`;
        window.history.replaceState({}, '', newUrl);

        // Sync the visible search input and re-run the listing + filter loaders.
        const searchInput = document.querySelector('header input[type="search"], #navSearch, .search-input');
        if (searchInput) searchInput.value = '';
        renderSelectedFilters();
    };

    window.resetPriceFilter = function () {
        if (minRange && maxRange) {
            minRange.value = 1000;
            maxRange.value = 9000;
            updatePriceDisplay();
            selectedFilters.price = null;
            renderSelectedFilters();
        }
    };

    window.clearAllFilters = function () {
        selectedFilters = { categories: [], brands: [], sizes: [], colors: [], price: null };

        document.querySelectorAll('.filter-checkbox').forEach(cb => cb.checked = false);
        document.querySelectorAll('.filter-color-btn').forEach(btn => btn.classList.remove('active', 'border-dark'));

        if (minRange && maxRange) {
            minRange.value = 1000;
            maxRange.value = 9000;
            updatePriceDisplay();
        }

        // Strip any URL scope (search / brandId / categoryId) but stay on the
        // same page — shop.php now renders the full catalog when no scope is
        // present instead of redirecting away.
        const params = new URLSearchParams(window.location.search);
        ['search', 'Search', 'q', 'brandId', 'categoryId'].forEach((key) => {
            if (params.has(key)) params.delete(key);
        });
        const nextQuery = params.toString();
        const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`;
        window.history.replaceState({}, '', nextUrl);

        const searchInput = document.querySelector('header input[type="search"], #navSearch, .search-input');
        if (searchInput) searchInput.value = '';

        renderSelectedFilters();
    };

    function handleCheckboxChange(e, type, id, name) {
        if (e.target.checked) {
            selectedFilters[type].push({ id, name });
        } else {
            selectedFilters[type] = selectedFilters[type].filter(item => item.id !== id);
        }
        renderSelectedFilters();
    }

    // Produce a resolved media URL for a category/brand asset.
    function resolveMedia(value) {
        if (!value) return '';
        if (typeof window.resolveApiMediaUrl === 'function') {
            return window.resolveApiMediaUrl(value);
        }
        const src = String(value);
        if (/^https?:\/\//i.test(src)) return src;
        const clean = src.replace(/^\/+/, '');
        if (clean.startsWith('multivendor/')) return `${BASE_URL}/${clean}`;
        if (/^(uploads|products|blogs|brands|categories)\//i.test(clean)) {
            return `${BASE_URL}/multivendor/${clean}`;
        }
        return `${BASE_URL}/${clean}`;
    }

    function buildCategoryItem(cat, depth) {
        const id = cat._id || cat.id;
        const image = cat.image || cat.logo || '';
        const hasImage = Boolean(image);
        const isParent = Array.isArray(cat.children) && cat.children.length > 0;
        const indentPx = depth * 14;

        const li = document.createElement('li');
        li.innerHTML = `
            <div class="form-check category-list-box d-flex align-items-center" style="padding-left:${indentPx}px;">
                <input class="checkbox_animated filter-checkbox me-2" type="checkbox" id="filter-categories-${id}">
                <label class="form-check-label d-flex align-items-center gap-2 flex-grow-1" for="filter-categories-${id}">
                    ${hasImage
                        ? `<img src="${resolveMedia(image)}" alt="${cat.name}" class="filter-cat-img" style="width:26px;height:26px;object-fit:cover;border-radius:4px;border:1px solid #eee;">`
                        : `<span class="filter-cat-img" style="width:26px;height:26px;border-radius:4px;border:1px solid #eee;background:#f7f7f7;display:inline-block;"></span>`}
                    <span class="name ${isParent ? 'fw-semibold' : ''}">${cat.name}</span>
                </label>
            </div>
        `;
        li.querySelector('input').addEventListener('change', (e) => handleCheckboxChange(e, 'categories', id, cat.name));
        return li;
    }

    function appendCategoryTree(cats, parentEl, depth = 0) {
        cats.forEach(c => {
            parentEl.appendChild(buildCategoryItem(c, depth));
            if (Array.isArray(c.children) && c.children.length > 0) {
                appendCategoryTree(c.children, parentEl, depth + 1);
            }
        });
    }

    async function loadCategories() {
        if (!categoryListEl) return;

        const categoriesData = await fetchApi(API_ENDPOINTS.categories);
        let categories = [];
        if (Array.isArray(categoriesData)) categories = categoriesData;
        else if (categoriesData && Array.isArray(categoriesData.data)) categories = categoriesData.data;

        categoryListEl.innerHTML = '';

        // Render the full tree so parent categories (with their image) are
        // visible alongside leaves; ticking a parent filters everything under
        // it on the backend because each category is sent as its own id.
        appendCategoryTree(categories, categoryListEl, 0);
    }

    // ---------------------------------------------------------------
    // Scope-aware brand/size/color loaders: when a category is locked,
    // we derive filter options from the actual products in that category
    // so users only see relevant filters.
    // ---------------------------------------------------------------
    async function fetchScopedProducts() {
        const params = new URLSearchParams();
        params.set('page', '1');
        params.set('pageSize', '200');
        if (scopedCategoryId) params.append('categoryIds', scopedCategoryId);
        if (scopedBrandId) params.append('brandIds', scopedBrandId);
        if (scopedSearch) params.set('Search', scopedSearch);

        try {
            const res = await fetch(`${BASE_URL}/api/products/list?${params.toString()}`);
            if (!res.ok) return [];
            const json = await res.json();
            return json?.data?.data || json?.data || [];
        } catch (err) {
            console.error('Scoped products fetch failed:', err);
            return [];
        }
    }

    function uniqueByKey(items, keyFn) {
        const seen = new Map();
        items.forEach(item => {
            const key = keyFn(item);
            if (key && !seen.has(key)) seen.set(key, item);
        });
        return Array.from(seen.values());
    }

    function extractBrands(products) {
        return uniqueByKey(
            products
                .map(p => ({
                    id: p.brandId || p.brandid || p.brand?.id || p.brand?._id || '',
                    name: p.brandName || p.brandname || p.brand?.name || '',
                }))
                .filter(b => b.id && b.name),
            b => String(b.id),
        );
    }

    function extractColors(products) {
        const list = [];
        products.forEach(p => {
            const raw = p.colors || p.color || [];
            if (Array.isArray(raw)) {
                raw.forEach(c => {
                    if (typeof c === 'string' && c.trim()) {
                        list.push({ id: c.trim().toLowerCase(), name: c.trim() });
                    } else if (c && typeof c === 'object') {
                        const id = c.id || c._id || c.colorId || c.name;
                        const name = c.name || c.colorName || id;
                        if (id && name) list.push({ id: String(id), name: String(name) });
                    }
                });
            } else if (typeof raw === 'string' && raw.trim()) {
                raw.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
                    list.push({ id: name.toLowerCase(), name });
                });
            }
        });
        return uniqueByKey(list, c => String(c.id).toLowerCase());
    }

    function extractSizes(products) {
        const list = [];
        products.forEach(p => {
            const raw = p.sizes || p.size || [];
            if (Array.isArray(raw)) {
                raw.forEach(s => {
                    if (typeof s === 'string' && s.trim()) {
                        list.push({ id: s.trim().toLowerCase(), name: s.trim() });
                    } else if (s && typeof s === 'object') {
                        const id = s.id || s._id || s.sizeId || s.name;
                        const name = s.name || s.sizeName || id;
                        if (id && name) list.push({ id: String(id), name: String(name) });
                    }
                });
            } else if (typeof raw === 'string' && raw.trim()) {
                raw.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
                    list.push({ id: name.toLowerCase(), name });
                });
            }
        });
        return uniqueByKey(list, s => String(s.id).toLowerCase());
    }

    function renderBrandList(brands) {
        if (!brandListEl) return;
        brandListEl.innerHTML = '';
        if (!brands.length) {
            brandListEl.innerHTML = '<li class="text-muted small px-2">No brands available</li>';
            return;
        }
        brands.forEach(brand => {
            const id = brand.id;
            const hasLogo = Boolean(brand.logo);
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="form-check category-list-box d-flex align-items-center">
                    <input class="checkbox_animated filter-checkbox me-2" type="checkbox" id="filter-brands-${id}">
                    <label class="form-check-label d-flex align-items-center gap-2 flex-grow-1" for="filter-brands-${id}">
                        ${hasLogo
                            ? `<img src="${resolveMedia(brand.logo)}" alt="${brand.name}" class="filter-brand-img" style="width:26px;height:26px;object-fit:contain;border-radius:4px;border:1px solid #eee;background:#fff;">`
                            : `<span class="filter-brand-img" style="width:26px;height:26px;border-radius:4px;border:1px solid #eee;background:#f7f7f7;display:inline-block;"></span>`}
                        <span class="name">${brand.name}</span>
                    </label>
                </div>
            `;
            brandListEl.appendChild(li);
            li.querySelector('input').addEventListener('change', (e) => handleCheckboxChange(e, 'brands', id, brand.name));
        });
    }

    function renderSizeList(sizes) {
        if (!sizeListEl) return;
        sizeListEl.innerHTML = '';
        if (!sizes.length) {
            sizeListEl.innerHTML = '<li class="text-muted small px-2">No sizes available</li>';
            return;
        }
        sizes.forEach(size => {
            const id = size.id;
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="form-check category-list-box">
                    <input class="checkbox_animated filter-checkbox" type="checkbox" id="filter-sizes-${id}">
                    <label class="form-check-label" for="filter-sizes-${id}">
                        <span class="name">${size.name}</span>
                    </label>
                </div>
            `;
            sizeListEl.appendChild(li);
            li.querySelector('input').addEventListener('change', (e) => handleCheckboxChange(e, 'sizes', id, size.name));
        });
    }

    function renderColorList(colors) {
        if (!colorListEl) return;
        colorListEl.innerHTML = '';
        if (!colors.length) {
            colorListEl.innerHTML = '<li class="text-muted small px-2">No colors available</li>';
            return;
        }
        colors.forEach(color => {
            const id = color.id;
            const colorCode = getColorCode(color.name);
            const li = document.createElement('li');
            li.style.display = 'inline-block';
            li.style.margin = '2px';
            li.innerHTML = `
                <button class="btn filter-color-btn" id="filter-color-${id}" title="${color.name}" style="background-color: ${colorCode}; width:30px; height:30px; border-radius:50%; border: 1px solid #ccc;"></button>
            `;
            colorListEl.appendChild(li);

            li.querySelector('button').addEventListener('click', (e) => {
                const btn = e.target;
                const isSelected = selectedFilters.colors.some(c => c.id === id);

                if (isSelected) {
                    selectedFilters.colors = selectedFilters.colors.filter(c => c.id !== id);
                    btn.classList.remove('active', 'border-dark');
                    btn.style.border = '1px solid #ccc';
                } else {
                    selectedFilters.colors.push({ id: id, name: color.name });
                    btn.classList.add('active', 'border-dark');
                    btn.style.border = '2px solid #000';
                }
                renderSelectedFilters();
            });
        });
    }

    // Cache global brand list so we can map ids -> logos when the scoped
    // brand list (derived from scoped products) doesn't carry a logo field.
    let globalBrandsCache = null;
    async function getGlobalBrands() {
        if (globalBrandsCache) return globalBrandsCache;
        const brandsData = await fetchApi(API_ENDPOINTS.brands);
        let brands = [];
        if (Array.isArray(brandsData)) brands = brandsData;
        else if (brandsData && Array.isArray(brandsData.data)) brands = brandsData.data;
        globalBrandsCache = brands
            .map(b => ({
                id: String(b._id || b.id || ''),
                name: b.name,
                logo: b.logo || b.image || b.logoUrl || '',
            }))
            .filter(b => b.id && b.name);
        return globalBrandsCache;
    }

    async function loadBrandsFromGlobal() {
        if (!brandListEl) return;
        const brands = await getGlobalBrands();
        renderBrandList(brands);
    }

    async function loadSizesFromGlobal() {
        if (!sizeListEl) return;
        const sizesData = await fetchApi(API_ENDPOINTS.sizes);
        let sizes = [];
        if (Array.isArray(sizesData)) sizes = sizesData;
        else if (sizesData && Array.isArray(sizesData.data)) sizes = sizesData.data;
        renderSizeList(sizes.map(s => ({ id: s._id || s.id, name: s.name })).filter(s => s.id && s.name));
    }

    async function loadColorsFromGlobal() {
        if (!colorListEl) return;
        const colorsData = await fetchApi(API_ENDPOINTS.colors);
        let colors = [];
        if (Array.isArray(colorsData)) colors = colorsData;
        else if (colorsData && Array.isArray(colorsData.data)) colors = colorsData.data;
        renderColorList(colors.map(c => ({ id: c._id || c.id, name: c.name })).filter(c => c.id && c.name));
    }

    async function loadScopedFilters() {
        const placeholderMsg = '<li class="text-muted small px-2">Loading...</li>';
        if (brandListEl) brandListEl.innerHTML = placeholderMsg;
        if (sizeListEl) sizeListEl.innerHTML = placeholderMsg;
        if (colorListEl) colorListEl.innerHTML = placeholderMsg;

        const [products, globalBrands] = await Promise.all([
            fetchScopedProducts(),
            getGlobalBrands(),
        ]);

        // Enrich scoped brands with logos from the global brand list.
        const logoById = new Map(globalBrands.map(b => [String(b.id), b.logo]));
        const scopedBrands = extractBrands(products).map(b => ({
            ...b,
            logo: logoById.get(String(b.id)) || '',
        }));

        renderBrandList(scopedBrands);
        renderSizeList(extractSizes(products));
        renderColorList(extractColors(products));
    }

    function updatePriceDisplay(e) {
        if (!minRange || !maxRange || !minPriceEl || !maxPriceEl) return;
        
        let minVal = parseInt(minRange.value);
        let maxVal = parseInt(maxRange.value);
        
        if (minVal > maxVal) {
            let tmp = minVal;
            minVal = maxVal;
            maxVal = tmp;
        }
        
        minPriceEl.innerText = `₹${minVal}`;
        maxPriceEl.innerText = `₹${maxVal}`;
        
        if (e) { // Only set filter if triggered by user change event
            selectedFilters.price = { min: minVal, max: maxVal };
            renderSelectedFilters();
        }
    }

    if (minRange && maxRange) {
        // Input runs on drag to update numbers visually smoothly
        minRange.addEventListener('input', () => updatePriceDisplay());
        maxRange.addEventListener('input', () => updatePriceDisplay());
        
        // Change triggers when the user releases the mouse (executes API call)
        minRange.addEventListener('change', (e) => updatePriceDisplay(e));
        maxRange.addEventListener('change', (e) => updatePriceDisplay(e));
        
        // Initial setup
        updatePriceDisplay();
    }

    // Initialize filter lists.
    // - With a URL scope (category/brand/search): derive options from the
    //   scoped product set so only relevant options appear.
    // - Without scope: fall back to global lists (e.g. search page usage).
    loadCategories();
    if (hasScope) {
        loadScopedFilters();
    } else {
        loadBrandsFromGlobal();
        loadSizesFromGlobal();
        loadColorsFromGlobal();
    }

    // Render chips immediately so the URL's search term is visible as a
    // removable filter even before any sidebar interaction.
    renderSelectedFilters();

    // Category / brand list search (filter sidebar)
    function wireFilterListSearch(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);
        if (!input || !list) return;

        const run = () => {
            const q = input.value.trim().toLowerCase();
            list.querySelectorAll(':scope > li').forEach((li) => {
                const nameEl = li.querySelector('.name');
                const t = (nameEl ? nameEl.textContent : li.textContent || '').toLowerCase();
                li.style.display = !q || t.includes(q) ? '' : 'none';
            });
        };

        input.addEventListener('input', run);
        input.addEventListener('search', run);
        const box = input.closest('.search-box');
        const btn = box && box.querySelector('.search-button');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                run();
            });
        }
    }

    wireFilterListSearch('search', 'filterCategoryList');
    wireFilterListSearch('brand-search', 'filterBrandList');
});