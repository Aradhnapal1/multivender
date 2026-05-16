<?php include 'header.php'; ?>


<!-- Breadcrumb Section Start -->
<section class="breadcrumb-section">
    <div class="custom-container">
        <div class="breadcrumb-contain">
            <h2 id="categoryTitle">Shop </h2>
            <nav>
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <a href="index.php">
                            <i class="ri-home-3-fill"></i>
                        </a>
                    </li>
                    <li class="breadcrumb-item active" id="categoryBreadcrumbLabel">Shop </li>
                </ol>
            </nav>
        </div>
    </div>
</section>
<!-- Breadcrumb Section End -->

<!-- Category Spotlight: brands / colors / sizes scoped to this category -->
<style>
    .category-spotlight { margin-top: 16px; }
    .category-spotlight .spotlight-block {
        background: #fff;
        border: 1px solid #eee;
        border-radius: 10px;
        padding: 16px 18px;
        margin-bottom: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,.03);
    }
    .category-spotlight .spotlight-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 12px 0;
        color: #222;
    }
    .category-spotlight .spotlight-strip {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
    }
    .category-spotlight .brand-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 14px;
        background: #f7f9fc;
        border: 1px solid #e5e9f0;
        border-radius: 30px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        transition: all .15s ease;
    }
    .category-spotlight .brand-chip:hover,
    .category-spotlight .brand-chip.active {
        background: #0f3460;
        color: #fff;
        border-color: #0f3460;
    }
    .category-spotlight .brand-chip img {
        width: 28px;
        height: 28px;
        object-fit: contain;
        border-radius: 50%;
        background: #fff;
        border: 1px solid #eee;
    }
    .category-spotlight .color-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px 6px 6px;
        background: #fff;
        border: 1px solid #e5e9f0;
        border-radius: 30px;
        cursor: pointer;
        font-size: 13px;
        transition: all .15s ease;
    }
    .category-spotlight .color-chip:hover,
    .category-spotlight .color-chip.active {
        border-color: #0f3460;
        box-shadow: 0 0 0 2px rgba(15,52,96,.12);
    }
    .category-spotlight .color-swatch {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        border: 1px solid #ddd;
    }
    .category-spotlight .size-chip {
        display: inline-block;
        min-width: 44px;
        text-align: center;
        padding: 8px 14px;
        background: #fff;
        border: 1px solid #e5e9f0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: #333;
        transition: all .15s ease;
    }
    .category-spotlight .size-chip:hover,
    .category-spotlight .size-chip.active {
        background: #0f3460;
        color: #fff;
        border-color: #0f3460;
    }
    .category-spotlight .spotlight-empty {
        color: #999;
        font-size: 13px;
    }
</style>
<section class="category-spotlight" id="categorySpotlight" style="display: none;">
    <div class="custom-container">
        <div class="spotlight-block" id="brandSpotlightBlock" style="display: none;">
            <h3 class="spotlight-title">Shop by Brand</h3>
            <div class="spotlight-strip" id="brandSpotlightStrip"></div>
        </div>
        <div class="spotlight-block" id="colorSpotlightBlock" style="display: none;">
            <h3 class="spotlight-title">Shop by Color</h3>
            <div class="spotlight-strip" id="colorSpotlightStrip"></div>
        </div>
        <div class="spotlight-block" id="sizeSpotlightBlock" style="display: none;">
            <h3 class="spotlight-title">Shop by Size</h3>
            <div class="spotlight-strip" id="sizeSpotlightStrip"></div>
        </div>
    </div>
</section>
<!-- Category Spotlight End -->

<!-- Shop Section Start -->
<section class="section-t-space shop-section">
    <div class="custom-container">
        <div class="offcanvas-button">
            <button class="btn" data-bs-toggle="offcanvas" data-bs-target="#filterOffcanvas">
                <i class="ri-equalizer-line"></i>
                <span>Filter</span>
            </button>
        </div>
        <div class="show-button show-button-2">
            <div class="top-filter-menu">
                <div class="category-dropdown dropdown-box">
                    <h3 class="text-content h5">Sort By :</h3>
                    <div class="dropdown">
                        <button class="dropdown-toggle" type="button" id="dropdownMenuButton1"
                            data-bs-toggle="dropdown">
                            <span>Most Popular</span>
                            <i class="ri-arrow-down-s-line"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <a class="dropdown-item" id="pop" href="#!">Popularity</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="low" href="#!">Low - High
                                    Price</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="high" href="#!">High - Low
                                    Price</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="rating" href="#!">Average
                                    Rating</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="aToz" href="#!">A - Z Order</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="zToa" href="#!">Z - A Order</a>
                            </li>
                            <li>
                                <a class="dropdown-item" id="off" href="#!">% Off - Hight To
                                    Low</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="grid-option d-none d-md-block">
                    <ul>
                        <li class="two-grid">
                            <button class="btn">
                               <i class="fa-solid fa-grip"></i>
                            </button>
                        </li>
                        <li class="three-grid">
                            <button class="btn">
                                <!-- <svg>
                                    <use
                                        xlink:href="https://themes.pixelstrap.net/kartify/assets/svg/grid-option.svg#gridThree">
                                    </use>
                                </svg> -->
                                <i class="fa-solid fa-table-cells"></i>
                            </button>
                        </li>
                        <li class="grid-btn">
                            <button class="btn">
                                <i class="fa-solid fa-border-all"></i>
                            </button>
                        </li>
                        <li class="five-grid d-xxl-inline-block d-none active">
                            <button class="btn">
                               <i class="fa-solid fa-table-cells-large"></i>
                            </button>
                        </li>
                        <li class="list-btn">
                            <button class="btn">
                                 <i class="fa-solid fa-square"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div id="selectedFiltersContainer" class="selected-filters-wrapper mb-3 d-flex flex-wrap gap-2"></div>
        <div class="row g-sm-4 g-3 product-list-section row-cols-xxl-5 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2"
            id="productsContainer">
            <div class="col">
                <div class="product-box-4-main">
                    <div class="select-option-box">
                        <div class="select-box">
                            <div>
                                <div class="color-box">
                                    <h4 class="h5">Colors</h4>
                                    <ul class="color-list">
                                        <li>
                                            <a href="#!" style="background-color: #f4c266;"></a>
                                        </li>
                                        <li>
                                            <a href="#!" style="background-color: #e7e597;"></a>
                                        </li>
                                        <li>
                                            <a href="#!" style="background-color: #6aa473;"></a>
                                        </li>
                                    </ul>
                                </div>

                                <div class="size-box">
                                    <h4 class="h5">Sizes</h4>
                                    <ul class="size-list">
                                        <li>
                                            <a href="#!">xs</a>
                                        </li>
                                        <li>
                                            <a href="#!">s</a>
                                        </li>
                                        <li>
                                            <a href="#!">m</a>
                                        </li>
                                        <li>
                                            <a href="#!">l</a>
                                        </li>
                                        <li>
                                            <a href="#!">xl</a>
                                        </li>
                                    </ul>
                                </div>

                                <button class="btn add-cart-btn">add to cart</button>
                                <button class="close-btn btn" onclick="closeSidebar()">
                                    <i class="ri-close-line"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="productMain product-box-4 pro-bg-white">
                        <div class="product-image">
                            <a href="">
                                <img src="./assets/images/product/106.png" class="img-fluid productImage" alt="">
                            </a>
                            <div class="quick-view-button-box">
                                <button class="btn view-btn" data-bs-target="#quickViewModal"
                                    data-bs-toggle="modal">Quick View</button>
                            </div>
                        </div>
                        <div class="product-content">
                            <h5 class="sub-name productName">Apple Product</h5>
                            <a href="" class="name">
                                <h5>Apple iPhone 13 (128GB)</h5>
                            </a>
                            <ul class="rating">
                                <li>
                                    <i class="ri-star-fill fill"></i>
                                </li>
                                <li>
                                    <i class="ri-star-fill fill"></i>
                                </li>
                                <li>
                                    <i class="ri-star-fill fill"></i>
                                </li>
                                <li>
                                    <i class="ri-star-fill fill"></i>
                                </li>
                                <li>
                                    <i class="ri-star-fill fill"></i>
                                </li>
                            </ul>
                            <p class="product-details">The Apple iPhone 13 features a durable ceramic shield front
                                and a
                                super retina XDR display for vibrant visuals. Powered by the A15 Bionic chip, it
                                delivers lightning-fast performance and impressive battery life. Its advanced
                                dual-camera system captures stunning photos and 4K videos.</p>
                            <h5 class="price">$1920.00 <del>$2100.00</del></h5>
                            <div class="option-box">
                                <button class="btn select-btn">Select Options</button>
                                <ul class="option-list">
                                    <li>
                                        <a href="#!" class="wishlistProduct">
                                            <i class="ri-heart-3-line"></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#!">
                                            <i class="ri-repeat-2-line"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>


        <nav class="custom-pagination">
            <ul class="pagination justify-content-center">
                <li class="page-item disabled">
                    <a class="page-link" href="#!">
                        <i class="ri-arrow-left-s-line"></i>
                    </a>
                </li>
                <li class="page-item active">
                    <a class="page-link" href="#!">
                        <span>1</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#!">
                        <span>2</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#!">
                        <span>3</span>
                    </a>
                </li>
                <li class="page-item">
                    <a class="page-link" href="#!">
                        <i class="ri-arrow-right-s-line"></i>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</section>
<!-- Shop Section End -->

<!-- News-letter Section Start -->
<section class="section-block-space newsletter-section">
    <div class="custom-container">
        <div class="newsletter-box">
            <img src="https://themes.pixelstrap.net/kartify/assets/images/newsletter/1.svg" class="newsletter-1" alt="">
            <img src="https://themes.pixelstrap.net/kartify/assets/images/newsletter/2.svg" class="newsletter-2" alt="">
            <img src="https://themes.pixelstrap.net/kartify/assets/images/newsletter/3.svg" class="newsletter-3" alt="">
            <div class="row g-3">
                <div class="col-xl-6">
                    <div class="newsletter-content">
                        <svg>
                            <use
                                xlink:href="https://themes.pixelstrap.net/kartify/assets/images/newsletter/newsletter-icon.svg#newsletter">
                            </use>
                        </svg>
                        <div>
                            <h3>Subscribe to our newsletter</h3>
                            <h4>Get all the latest information on Events, sales and Offers</h4>
                        </div>
                    </div>
                </div>
                <div class="col-xl-6">
                    <form class="newsletter-form">
                        <div class="input-group">
                            <input type="text" class="form-control" placeholder="Enter Your E-mail Address">
                            <button class="input-group-text btn newsletter-form-button">Subscribe Now!</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- News-letter Section End -->
<!-- Product Filter Offcanvas Start -->
<div class="offcanvas offcanvas-start product-filter-offcanvas" id="filterOffcanvas">
    <div class="offcanvas-header">
        <h4 class="offcanvas-title">Product Filter</h4>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        <div class="left-box">
            <div class="shop-left-sidebar">
                <div class="filter-category-2" id="filterCategory2Container" style="display: none;">
                    <div class="filter-title">
                        <h2>Filters</h2>
                        <a href="javascript:void(0)" onclick="clearAllFilters()">Clear All</a>
                    </div>
                    <ul id="sidebarSelectedFilters">
                    </ul>
                </div>

               <div class="accordion custom-accordion-2" id="shopFilterAccordion">
    
    <!-- Categories -->
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true" aria-controls="panelsStayOpen-collapseTwo">
                <span>Categories</span>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse show" data-bs-parent="#shopFilterAccordion">
            <div class="accordion-body">
                <div class="search-box">
                    <input type="search" class="form-control" id="search" placeholder="Search ..">
                    <button class="search-button btn">
                        <i class="ri-search-2-line"></i>
                    </button>
                </div>

                <ul class="category-list custom-padding custom-height" id="filterCategoryList">
                    <li>
                        <div class="form-check category-list-box">
                            <input class="checkbox_animated" type="checkbox" id="fruit">
                            <label class="form-check-label" for="fruit">
                                <span class="name">T-Shirts & Polos</span>
                                <span class="number">(15)</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Price -->
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                <span>Price</span>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse" data-bs-parent="#shopFilterAccordion">
            <div class="accordion-body">
                <div class="price-range-slider">
                    <div class="slider-container">
                        <div class="range-slider">
                            <div class="range-fill"></div>
                            <input type="range" id="minRange" min="0" max="100000" value="1000" step="100">
                            <input type="range" id="maxRange" min="0" max="100000" value="9000" step="100">
                        </div>
                        <div class="price-values">
                            <span id="min-price">₹1000</span>
                            <span class="dash">-</span>
                            <span id="max-price">₹9000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Color -->
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                <span>Color</span>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseFour" class="accordion-collapse collapse" data-bs-parent="#shopFilterAccordion">
            <div class="accordion-body">
                <ul class="color-box-list" id="filterColorList">
                    <li>
                        <button class="color-1 btn"></button>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Size (New) -->
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseSize" aria-expanded="false" aria-controls="panelsStayOpen-collapseSize">
                <span>Size</span>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseSize" class="accordion-collapse collapse" data-bs-parent="#shopFilterAccordion">
            <div class="accordion-body">
                <ul class="category-list custom-padding custom-height" id="filterSizeList">
                </ul>
            </div>
        </div>
    </div>

    <!-- Brand (New) -->
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseBrand" aria-expanded="false" aria-controls="panelsStayOpen-collapseBrand">
                <span>Brand</span>
            </button>
        </h2>
        <div id="panelsStayOpen-collapseBrand" class="accordion-collapse collapse" data-bs-parent="#shopFilterAccordion">
            <div class="accordion-body">
                <div class="search-box">
                    <input type="search" class="form-control" id="brand-search" placeholder="Search brands..">
                    <button class="search-button btn">
                        <i class="ri-search-2-line"></i>
                    </button>
                </div>

                <ul class="category-list custom-padding custom-height" id="filterBrandList">
                </ul>
            </div>
        </div>
    </div>

</div>
            </div>
        </div>
    </div>
</div>
<!-- Product Filter Offcanvas End -->

<script>
(function () {
    const API_BASE = 'https://api.workarya.com';
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = (urlParams.get('categoryId') || '').trim();
    const brandIdParam = (urlParams.get('brandId') || '').trim();
    const searchParam = (urlParams.get('Search') || urlParams.get('search') || urlParams.get('q') || '').trim();

    const spotlightSection = document.getElementById('categorySpotlight');
    if (!spotlightSection) return;
    if (!categoryId && !brandIdParam && !searchParam) return;

    const titleEl = document.getElementById('categoryTitle');
    const crumbEl = document.getElementById('categoryBreadcrumbLabel');
    const brandBlock = document.getElementById('brandSpotlightBlock');
    const brandStrip = document.getElementById('brandSpotlightStrip');
    const colorBlock = document.getElementById('colorSpotlightBlock');
    const colorStrip = document.getElementById('colorSpotlightStrip');
    const sizeBlock = document.getElementById('sizeSpotlightBlock');
    const sizeStrip = document.getElementById('sizeSpotlightStrip');

    function resolveMedia(src) {
        if (!src) return '';
        if (typeof window.resolveApiMediaUrl === 'function') return window.resolveApiMediaUrl(src);
        const s = String(src);
        if (/^https?:\/\//i.test(s)) return s;
        const clean = s.replace(/^\/+/, '');
        if (clean.startsWith('multivendor/')) return `${API_BASE}/${clean}`;
        return `${API_BASE}/${clean}`;
    }

    function colorCode(name) {
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.fillStyle = (name || '').toLowerCase();
        return ctx.fillStyle;
    }

    // Fetch the category's products and meta.
    async function loadSpotlight() {
        try {
            // Category name (for title/breadcrumb) — best-effort.
            if (categoryId) {
                try {
                    const catRes = await fetch(`${API_BASE}/api/category/list`);
                    if (catRes.ok) {
                        const catJson = await catRes.json();
                        const all = Array.isArray(catJson?.data) ? catJson.data : [];
                        const flat = [];
                        const walk = (list) => list.forEach(c => { flat.push(c); if (Array.isArray(c.children)) walk(c.children); });
                        walk(all);
                        const match = flat.find(c => String(c._id || c.id) === String(categoryId));
                        if (match && match.name) {
                            if (titleEl) titleEl.textContent = match.name;
                            if (crumbEl) crumbEl.textContent = match.name;
                            document.title = `${match.name} | Shop`;
                        }
                    }
                } catch (_) { /* non-fatal */ }
            }

            const params = new URLSearchParams();
            params.set('page', '1');
            params.set('pageSize', '200');
            if (categoryId) params.append('categoryIds', categoryId);
            if (brandIdParam) params.append('brandIds', brandIdParam);
            if (searchParam) params.set('Search', searchParam);

            const res = await fetch(`${API_BASE}/api/products/list?${params.toString()}`);
            if (!res.ok) return;
            const json = await res.json();
            const products = json?.data?.data || json?.data || [];
            if (!Array.isArray(products) || products.length === 0) return;

            spotlightSection.style.display = '';

            renderBrands(products);
            renderColors(products);
            renderSizes(products);
        } catch (err) {
            console.error('Category spotlight load failed:', err);
        }
    }

    function uniqueBy(list, keyFn) {
        const seen = new Map();
        list.forEach(item => {
            const key = keyFn(item);
            if (key && !seen.has(key)) seen.set(key, item);
        });
        return Array.from(seen.values());
    }

    function renderBrands(products) {
        const brands = uniqueBy(
            products
                .map(p => ({
                    id: p.brandId || p.brandid || p.brand?.id || p.brand?._id || '',
                    name: p.brandName || p.brandname || p.brand?.name || '',
                    logo: p.brandLogo || p.brandlogo || p.brand?.logo || p.brand?.image || '',
                }))
                .filter(b => b.id && b.name),
            b => String(b.id),
        );
        if (!brands.length) return;
        brandBlock.style.display = '';
        brandStrip.innerHTML = '';
        brands.forEach(b => {
            const chip = document.createElement('span');
            chip.className = 'brand-chip';
            chip.dataset.brandId = b.id;
            chip.dataset.brandName = b.name;
            const inner = b.logo
                ? `<img src="${resolveMedia(b.logo)}" alt="${b.name}" onerror="this.remove()"><span>${b.name}</span>`
                : `<span>${b.name}</span>`;
            chip.innerHTML = inner;
            chip.addEventListener('click', () => applyBrand(b));
            brandStrip.appendChild(chip);
        });
    }

    function renderColors(products) {
        const rawList = [];
        products.forEach(p => {
            const raw = p.colors || p.color || [];
            if (Array.isArray(raw)) {
                raw.forEach(c => {
                    if (typeof c === 'string' && c.trim()) {
                        rawList.push({ id: c.trim().toLowerCase(), name: c.trim() });
                    } else if (c && typeof c === 'object') {
                        const id = c.id || c._id || c.colorId || c.name;
                        const name = c.name || c.colorName || id;
                        if (id && name) rawList.push({ id: String(id), name: String(name) });
                    }
                });
            } else if (typeof raw === 'string' && raw.trim()) {
                raw.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
                    rawList.push({ id: name.toLowerCase(), name });
                });
            }
        });
        const colors = uniqueBy(rawList, c => String(c.id).toLowerCase());
        if (!colors.length) return;
        colorBlock.style.display = '';
        colorStrip.innerHTML = '';
        colors.forEach(c => {
            const chip = document.createElement('span');
            chip.className = 'color-chip';
            chip.dataset.colorId = c.id;
            chip.dataset.colorName = c.name;
            chip.innerHTML = `<span class="color-swatch" style="background:${colorCode(c.name)}"></span><span>${c.name}</span>`;
            chip.addEventListener('click', () => applyColor(c, chip));
            colorStrip.appendChild(chip);
        });
    }

    function renderSizes(products) {
        const rawList = [];
        products.forEach(p => {
            const raw = p.sizes || p.size || [];
            if (Array.isArray(raw)) {
                raw.forEach(s => {
                    if (typeof s === 'string' && s.trim()) {
                        rawList.push({ id: s.trim().toLowerCase(), name: s.trim() });
                    } else if (s && typeof s === 'object') {
                        const id = s.id || s._id || s.sizeId || s.name;
                        const name = s.name || s.sizeName || id;
                        if (id && name) rawList.push({ id: String(id), name: String(name) });
                    }
                });
            } else if (typeof raw === 'string' && raw.trim()) {
                raw.split(',').map(s => s.trim()).filter(Boolean).forEach(name => {
                    rawList.push({ id: name.toLowerCase(), name });
                });
            }
        });
        const sizes = uniqueBy(rawList, s => String(s.id).toLowerCase());
        if (!sizes.length) return;
        sizeBlock.style.display = '';
        sizeStrip.innerHTML = '';
        sizes.forEach(s => {
            const chip = document.createElement('span');
            chip.className = 'size-chip';
            chip.dataset.sizeId = s.id;
            chip.dataset.sizeName = s.name;
            chip.textContent = s.name;
            chip.addEventListener('click', () => applySize(s, chip));
            sizeStrip.appendChild(chip);
        });
    }

    // Clicking a spotlight chip drives the sidebar filters (which in turn
    // trigger allproduct.js loadProducts via window.applyFilters).
    function applyBrand(brand) {
        // Highlight on the strip
        brandStrip.querySelectorAll('.brand-chip.active').forEach(el => el.classList.remove('active'));
        const thisChip = brandStrip.querySelector(`.brand-chip[data-brand-id="${CSS.escape(String(brand.id))}"]`);
        if (thisChip) thisChip.classList.add('active');

        // Drive the sidebar checkbox (ensures productFilter.js state stays in sync)
        const cb = document.getElementById(`filter-brands-${brand.id}`);
        if (cb) {
            if (!cb.checked) cb.click();
        } else {
            // If productFilter hasn't loaded options yet, fall back to direct URL navigation
            window.location.href = `shop.php?categoryId=${encodeURIComponent(categoryId)}&brandId=${encodeURIComponent(brand.id)}`;
        }
        scrollToProducts();
    }

    function applyColor(color, chip) {
        const btn = document.getElementById(`filter-color-${color.id}`);
        if (btn) {
            btn.click();
            chip.classList.toggle('active', btn.classList.contains('active'));
        } else {
            chip.classList.toggle('active');
        }
        scrollToProducts();
    }

    function applySize(size, chip) {
        const cb = document.getElementById(`filter-sizes-${size.id}`);
        if (cb) {
            cb.click();
            chip.classList.toggle('active', cb.checked);
        } else {
            chip.classList.toggle('active');
        }
        scrollToProducts();
    }

    function scrollToProducts() {
        const target = document.getElementById('productsContainer');
        if (target) {
            const top = target.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    }

    loadSpotlight();
})();
</script>

<!-- ================================================================
     Shop toolbar: "Most Popular" sort dropdown + grid-layout selector.
     These were static HTML placeholders — this IIFE wires them to the
     live product grid rendered by allproduct.js (#productsContainer).
     =============================================================== -->
<script>
(function () {
    const gridContainer = document.getElementById('productsContainer');
    if (!gridContainer) return;

    /* --------------------------- SORT -------------------------------- */
    // We sort the currently-loaded page on the client. This keeps the
    // backend contract simple (pagination-only) while giving instant
    // feedback for the seven standard sort options. For a "global" sort
    // across the full catalogue we'd add ?sort=... to the API; until
    // then, sorting a 50-item page is fine for shop browsing.
    const SORT_STRATEGIES = {
        pop:    { label: 'Most Popular',        cmp: (a, b) => popularityScore(b) - popularityScore(a) },
        low:    { label: 'Low - High Price',    cmp: (a, b) => priceOf(a) - priceOf(b) },
        high:   { label: 'High - Low Price',    cmp: (a, b) => priceOf(b) - priceOf(a) },
        rating: { label: 'Average Rating',      cmp: (a, b) => ratingOf(b) - ratingOf(a) },
        aToz:   { label: 'A - Z Order',         cmp: (a, b) => nameOf(a).localeCompare(nameOf(b)) },
        zToa:   { label: 'Z - A Order',         cmp: (a, b) => nameOf(b).localeCompare(nameOf(a)) },
        off:    { label: '% Off - High to Low', cmp: (a, b) => discountPctOf(b) - discountPctOf(a) },
    };

    function priceOf(p) {
        const dp = Number(p.discountPrice ?? p.discountprice ?? 0);
        const pr = Number(p.price ?? 0);
        return dp > 0 && dp < pr ? dp : pr;
    }
    function nameOf(p) { return String(p.name || '').toLowerCase(); }
    function ratingOf(p) { return Number(p.rating ?? p.averageRating ?? p.averagerating ?? 0) || 0; }
    function discountPctOf(p) {
        const dp = Number(p.discountPrice ?? p.discountprice ?? 0);
        const pr = Number(p.price ?? 0);
        if (!pr || dp <= 0 || dp >= pr) return 0;
        return ((pr - dp) / pr) * 100;
    }
    // Popularity proxy: featured flag first, then stock movement, then recency.
    function popularityScore(p) {
        const featured = (p.isFeatured ?? p.isfeatured) ? 1000 : 0;
        const stock = Number(p.stockQuantity ?? p.stockquantity ?? 0) || 0;
        const createdTs = Date.parse(p.createdTime ?? p.createdtime ?? p.createdDate ?? p.createddate ?? 0) || 0;
        return featured + (100 - Math.min(stock, 100)) + (createdTs / 1e12);
    }

    // Read the currently rendered cards back from the DOM, apply the
    // comparator, and write them back. We cache the original order so
    // "Most Popular" can be restored after other sorts.
    let originalOrder = null;
    function snapshotOrder() {
        if (!originalOrder) {
            originalOrder = Array.from(gridContainer.children).map((el) => el);
        }
    }
    function sortGrid(sortKey) {
        const strategy = SORT_STRATEGIES[sortKey];
        if (!strategy) return;
        snapshotOrder();

        // Skip sort UX when we only have the placeholder/empty-state element.
        const cards = Array.from(gridContainer.querySelectorAll('.col'));
        if (cards.length < 2) return;

        // Pull product data from the "Select Options" button's data-id + card DOM.
        const enriched = cards.map((card) => ({ card, product: extractProductFromCard(card) }));
        enriched.sort((a, b) => strategy.cmp(a.product, b.product));

        // Re-append in sorted order (preserves event listeners on the cards).
        enriched.forEach(({ card }) => gridContainer.appendChild(card));
    }

    // Build a lightweight product object from the rendered card so our
    // comparators can work without a second round-trip to the API.
    function extractProductFromCard(card) {
        const priceEl = card.querySelector('.price');
        const nameEl = card.querySelector('.name h5');
        const priceText = priceEl ? priceEl.textContent : '';
        const priceMatch = priceText.match(/₹?\s*([\d,]+(?:\.\d+)?)/);
        const strikeMatch = priceText.match(/<del>[^<]*<\/del>/);
        const delEl = priceEl?.querySelector('del');
        const price = delEl ? Number(delEl.textContent.replace(/[^\d.]/g, '')) : (priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : 0);
        const discountPrice = priceMatch ? Number(priceMatch[1].replace(/,/g, '')) : 0;
        return {
            name: nameEl ? nameEl.textContent.trim() : '',
            price,
            discountPrice: delEl ? discountPrice : 0,
            isFeatured: card.querySelector('.product-label-flag') ? true : false,
            stockQuantity: 0,
            rating: 5, // rendered card shows 5 static stars today
        };
    }

    const sortLabel = document.querySelector('#dropdownMenuButton1 span');
    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach((item) => {
        const key = item.id;
        if (!key || !SORT_STRATEGIES[key]) return;
        item.addEventListener('click', (evt) => {
            evt.preventDefault();
            if (sortLabel) sortLabel.textContent = SORT_STRATEGIES[key].label;
            sortGrid(key);
        });
    });

    /* ----------------------- GRID LAYOUT ----------------------------- */
    // The toolbar offers 2 / 3 / 4 / 5-column grids + a list view. Each
    // maps to a specific set of row-cols-* classes we already generate
    // in shop.php. We swap them out on click and remember the choice
    // in localStorage so it survives page reloads.
    const GRID_PRESETS = {
        'two-grid':   { cls: 'row g-sm-4 g-3 product-list-section row-cols-xxl-2 row-cols-xl-2 row-cols-lg-2 row-cols-md-2 row-cols-2',      mode: 'grid' },
        'three-grid': { cls: 'row g-sm-4 g-3 product-list-section row-cols-xxl-3 row-cols-xl-3 row-cols-lg-3 row-cols-md-3 row-cols-2',      mode: 'grid' },
        'grid-btn':   { cls: 'row g-sm-4 g-3 product-list-section row-cols-xxl-4 row-cols-xl-4 row-cols-lg-3 row-cols-md-3 row-cols-2',      mode: 'grid' },
        'five-grid':  { cls: 'row g-sm-4 g-3 product-list-section row-cols-xxl-5 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2',      mode: 'grid' },
        'list-btn':   { cls: 'row g-sm-4 g-3 product-list-section product-list-view row-cols-1',                                             mode: 'list' },
    };

    function applyGridPreset(key) {
        const preset = GRID_PRESETS[key];
        if (!preset) return;
        gridContainer.className = preset.cls;
        gridContainer.dataset.viewMode = preset.mode;

        document.querySelectorAll('.grid-option li').forEach((li) => li.classList.remove('active'));
        const li = document.querySelector(`.grid-option li.${key}`);
        if (li) li.classList.add('active');

        try { localStorage.setItem('shopGridPreset', key); } catch (_) { /* private mode */ }
    }

    document.querySelectorAll('.grid-option li').forEach((li) => {
        const key = Array.from(li.classList).find((c) => GRID_PRESETS[c]);
        if (!key) return;
        li.addEventListener('click', (evt) => {
            evt.preventDefault();
            applyGridPreset(key);
        });
    });

    // Restore the user's saved preference if any.
    try {
        const saved = localStorage.getItem('shopGridPreset');
        if (saved && GRID_PRESETS[saved]) applyGridPreset(saved);
    } catch (_) { /* ignore */ }

    /* ------------------ Minimal list-view styling -------------------- */
    // The list-view layout needs a single CSS tweak so cards expand to
    // the full row width. We inject it once here to avoid editing the
    // global stylesheet.
    if (!document.getElementById('shopListViewStyle')) {
        const style = document.createElement('style');
        style.id = 'shopListViewStyle';
        style.textContent = `
            #productsContainer.product-list-view .product-box-4-main .productMain { display: flex; gap: 20px; align-items: center; }
            #productsContainer.product-list-view .product-box-4-main .product-image { flex: 0 0 220px; max-width: 220px; }
            #productsContainer.product-list-view .product-box-4-main .product-content { flex: 1 1 auto; padding: 12px 0; }
        `;
        document.head.appendChild(style);
    }

    /* --------- Re-apply sort when the grid re-renders (filters, pagination) ---------- */
    // allproduct.js wipes #productsContainer.innerHTML before each load.
    // A MutationObserver lets us forget the stale snapshot so the next
    // sort works on the freshly-loaded page.
    new MutationObserver((records) => {
        for (const r of records) {
            if (r.type === 'childList' && (r.addedNodes.length || r.removedNodes.length)) {
                originalOrder = null;
                return;
            }
        }
    }).observe(gridContainer, { childList: true });
})();
</script>

<?php include 'footer.php'; ?>