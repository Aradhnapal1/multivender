<?php
include 'header.php';

$serverPlacementBanners = [];
$bannerApiUrl = 'https://api.workarya.com/api/banner/list';

if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $bannerApiUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 8,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response !== false && $status >= 200 && $status < 300) {
        $decoded = json_decode($response, true);
        if (is_array($decoded)) {
            if (isset($decoded['data']['data']) && is_array($decoded['data']['data'])) {
                $serverPlacementBanners = $decoded['data']['data'];
            } elseif (isset($decoded['data']) && is_array($decoded['data'])) {
                $serverPlacementBanners = $decoded['data'];
            } else {
                $serverPlacementBanners = array_values(array_filter($decoded, 'is_array'));
            }
        }
    }
}
?>

<!-- ================================================================= -->
<!-- MOGLIX-STYLE HOMEPAGE (Dynamic) -->
<!-- ================================================================= -->

<style>
    /* ---------- Shared ---------- */
    .mog-section { margin-top: 20px; }
    .mog-strip-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
    .mog-strip-header h3 {
        font-size: 16px; font-weight: 700; letter-spacing: .4px;
        text-transform: uppercase; margin: 0; color: #1a1a1a;
    }
    .mog-strip-header .view-all {
        font-size: 12px; font-weight: 700; letter-spacing: .5px;
        background: #ff5722; color: #fff !important; padding: 5px 14px;
        border-radius: 3px; text-decoration: none !important;
    }
    .mog-strip-header .view-all:hover { background: #e64a19; }

    /* ---------- Top Category Strip ---------- */
    .mog-cat-strip {
        background: #fff; padding: 14px 0; border-bottom: 1px solid #eee;
        overflow-x: auto; white-space: nowrap;
    }
    .mog-cat-strip::-webkit-scrollbar { height: 4px; }
    .mog-cat-strip::-webkit-scrollbar-thumb { background: #ddd; border-radius:2px; }
    .mog-cat-strip .mog-cat-pill {
        display: inline-flex; flex-direction: column; align-items: center;
        justify-content: center; width: 110px; text-align: center;
        text-decoration: none; color: #333; font-size: 12px; font-weight: 500;
        vertical-align: top; padding: 4px 6px; white-space: normal;
    }
    .mog-cat-strip .mog-cat-pill img {
        width: 40px; height: 40px; object-fit: contain; margin-bottom: 6px;
    }
    .mog-cat-strip .mog-cat-pill:hover { color: #ff5722; }

    /* ---------- Hero Carousel ---------- */
    .mog-hero .swiper-slide img {
        width: 100%; height: auto; display: block; border-radius: 6px;
    }
    .mog-hero .swiper-button-next, .mog-hero .swiper-button-prev {
        color: #fff; background: rgba(0,0,0,.35); width: 36px; height: 36px;
        border-radius: 50%;
    }
    .mog-hero .swiper-button-next:after, .mog-hero .swiper-button-prev:after {
        font-size: 16px; font-weight: bold;
    }

    /* ---------- Promo Tile Rows ---------- */
    .mog-promo-tile {
        display: block; border-radius: 6px; overflow: hidden;
        border: 1px solid #eee; background: #fff;
    }
    .mog-promo-tile img { width: 100%; height: auto; display: block; }

    /* ---------- Product Strip ---------- */
    .mog-prod-strip { background: #fff; border: 1px solid #eee; border-radius: 6px; padding: 14px 18px; }
    .mog-prod-strip .swiper { padding: 4px; }
    .mog-prod-card {
        border: 1px solid #eee; border-radius: 6px; background: #fff;
        transition: box-shadow .15s ease, transform .15s ease;
        overflow: hidden; height: 100%;
    }
    .mog-prod-card:hover { box-shadow: 0 4px 14px rgba(0,0,0,.08); transform: translateY(-2px); }
    .mog-prod-card .img-wrap { aspect-ratio: 1/1; background: #fafafa; display:flex; align-items:center; justify-content:center; }
    .mog-prod-card .img-wrap img { max-width: 100%; max-height: 100%; object-fit: contain; }
    .mog-prod-card .body { padding: 10px 12px; }
    .mog-prod-card .rating-row { display:inline-flex; align-items:center; gap:3px; background:#2f7b3f; color:#fff; padding:1px 5px; border-radius:3px; font-size:11px; font-weight:600; margin-bottom:4px; }
    .mog-prod-card .rating-row i { font-size:11px; }
    .mog-prod-card .rev-count { color:#666; font-size:11px; margin-left:6px; }
    .mog-prod-card .pname {
        font-size:13px; color:#333; line-height:1.3; height:34px;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden; margin:4px 0 8px;
    }
    .mog-prod-card .pname:hover { color:#ff5722; }
    .mog-prod-card .price { font-size:16px; font-weight:700; color:#1a1a1a; }
    .mog-prod-card .price del { font-size:12px; color:#999; font-weight:400; margin-left:6px; }
    .mog-prod-card .offer { display:inline-block; color:#2f7b3f; font-size:11px; font-weight:700; margin-left:6px; }

    /* ---------- Per-Category Section ---------- */
    .mog-cat-section { background:#fff; border:1px solid #eee; border-radius:6px; padding:14px 18px; }
    .mog-cat-section .section-head {
        display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;
    }
    .mog-cat-section .section-head h3 {
        font-size:15px; font-weight:700; margin:0; color:#1a1a1a;
        letter-spacing:.4px; text-transform:uppercase;
    }
    .mog-cat-section .section-head .view-all {
        font-size:11px; font-weight:700; background:#ff5722; color:#fff !important;
        padding:4px 12px; border-radius:3px; text-decoration:none !important;
    }
    .mog-cat-section .inner-row {
        display:grid; grid-template-columns:240px 1fr; gap:14px;
    }
    @media (max-width: 991px) { .mog-cat-section .inner-row { grid-template-columns: 1fr; } }

    .mog-cat-left { background:#fafafa; border-radius:6px; padding:10px; }
    .mog-cat-left h6 { font-size:11px; font-weight:700; color:#666; text-transform:uppercase; margin:4px 0 8px 4px; }
    .mog-brand-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px; margin-bottom:10px; }
    .mog-brand-chip {
        background:#fff; border:1px solid #eee; border-radius:4px;
        height:44px; display:flex; align-items:center; justify-content:center;
        padding:4px; text-decoration:none;
    }
    .mog-brand-chip img { max-width:70%; max-height:70%; object-fit:contain; }
    .mog-brand-chip span { font-size:12px; font-weight:600; color:#333; }

    .mog-subcat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:6px; padding-top:6px; }
    @media (max-width:991px){ .mog-subcat-grid { grid-template-columns:repeat(4,1fr); } }
    @media (max-width:575px){ .mog-subcat-grid { grid-template-columns:repeat(2,1fr); } }
    .mog-subcat-tile {
        background:#fff; border:1px solid #eee; border-radius:4px;
        padding:8px 4px; text-align:center; text-decoration:none; color:#333;
    }
    .mog-subcat-tile img { width:100%; aspect-ratio:1/1; object-fit:cover; border-radius:3px; margin-bottom:4px; }
    .mog-subcat-tile .s-name { font-size:11px; font-weight:500; line-height:1.2; display:block; }
    .mog-subcat-tile .s-cta { font-size:10px; color:#ff5722; font-weight:600; }

    .mog-cat-right { overflow:hidden; }

    /* ---------- Brand Store Grid ---------- */
    .mog-brand-store-grid {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 10px;
    }
    @media (max-width: 991px) { .mog-brand-store-grid { grid-template-columns: repeat(5, 1fr); } }
    @media (max-width: 575px) { .mog-brand-store-grid { grid-template-columns: repeat(3, 1fr); } }
    .mog-brand-store-tile {
        background: #fff; border: 1px solid #eee; border-radius: 6px;
        aspect-ratio: 1/1; display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        padding: 8px; text-decoration: none; text-align: center;
        transition: box-shadow .15s ease, transform .15s ease;
    }
    .mog-brand-store-tile:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); transform: translateY(-2px); }
    .mog-brand-store-tile img { max-width: 70%; max-height: 55%; object-fit: contain; margin-bottom: 6px; }
    .mog-brand-store-tile .b-name { font-size: 11px; font-weight: 600; color: #333; line-height: 1.1; }

    /* ---------- SEO Block ---------- */
    .mog-seo { background:#fff; border:1px solid #eee; border-radius:6px; padding:20px; font-size:13px; color:#555; line-height:1.6; }
    .mog-seo h3 { font-size:16px; color:#1a1a1a; font-weight:700; margin-bottom:10px; }
    .mog-seo h4 { font-size:14px; color:#1a1a1a; font-weight:700; margin-top:14px; margin-bottom:6px; }
    .mog-seo a { color: #ff5722; text-decoration:none; }
    .mog-seo a:hover { text-decoration:underline; }

    .mog-placement-banner img {
        width: 100%;
        display: block;
        border-radius: 6px;
    }
</style>

<!-- Home Hero Section Start (classic layout jdnfjdfdf) -->
<style>
    .category-menu-list {
        position: relative;
        border: 1px solid #ddd;
        background: #fff;
        height: 450px;
        display: flex;
    }
    .sub-menu-list {
        list-style: none; margin: 0; padding: 0;
    }
    #categoryList {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
    }
    #categoryList::-webkit-scrollbar { width: 4px; }
    #categoryList::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
    .sub-menu-list li { position: static; }
    .sub-menu-list li a {
        display: flex; align-items: center; padding: 10px;
        background: #fff; border-bottom: 1px solid #ddd;
        text-decoration: none; color: #333; white-space: nowrap;
        height: 45px;
        box-sizing: border-box;
    }
    .sub-menu-list li a:hover,
    .sub-menu-list li a.active-hover { background: #f4f7fb; color: #0f3460; }
    .sub-menu-list li a h5 { margin-left: 8px; font-size: 14px; font-weight: 500; margin-bottom: 0; }
    .success-bg-color {
        background: #28a745; color: #fff; padding: 2px 5px;
        font-size: 10px; margin-left: 5px; border-radius: 3px;
    }
    .index-flyouts-root {
        position: absolute; top: 0; left: 100%; width: 100%; height: 100%;
        z-index: 999; pointer-events: none;
    }
    .index-flyouts-root > ul {
        display: none; position: absolute; top: 0; width: 100%; height: 100%;
        background: #fff; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        overflow-y: auto; overflow-x: hidden; pointer-events: auto;
    }
    .index-flyouts-root > ul.active-flyout { display: block; }
    .index-flyouts-root > ul::-webkit-scrollbar { width: 4px; }
    .index-flyouts-root > ul::-webkit-scrollbar-thumb { background: #ddd; border-radius: 2px; }
    /* Hide original nested uls */
    #categoryList ul.sub-menu-list { display: none !important; }
</style>
<section class="home-section">
    <div class="custom-container">
        <div class="row g-0 custom-home-row">
            <div class="custom-xxl-3">
                <div class="category-full-box offcanvas" id="categoryCanvas">
                    <div class="category-header">
                        <h5>Category</h5>
                        <button class="btn-close lead" type="button" data-bs-dismiss="offcanvas">
                            <i class="ri-close-fill"></i>
                        </button>
                    </div>
                    <div class="category-menu-list" id="categoryMenu">
                        <ul class="sub-menu-list" id="categoryList"></ul>
                    </div>
                </div>
            </div>
            <div class="custom-xxl-9">
                <div class="row g-0">
                    <div class="col-xl-8 col-12">
                        <a href="shop.php" class="banner-box b-left">
                            <img id="mogTopBannerMain" src="assets/images/banner/1.jpg" class="img-fluid ratio-8x5" alt="">
                        </a>
                    </div>
                    <div class="col-4 d-xl-block d-none">
                        <div class="row m-0 h-100">
                            <div class="col-12 p-0">
                                <a href="shop.php" class="banner-box">
                                    <img id="mogTopBannerRight1" src="assets/images/banner/2.jpg" class="img-fluid ratio-8x5" alt="">
                                </a>
                            </div>
                            <div class="col-12 p-0">
                                <a href="shop.php" class="banner-box">
                                    <img id="mogTopBannerRight2" src="assets/images/banner/3.jpg" class="img-fluid ratio-8x5" alt="">
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row g-0 ratio_82">
                    <div class="col-lg-3 col-sm-6 h-100">
                        <a href="shop.php" class="banner-box">
                            <img id="mogTopBannerGrid1" src="assets/images/banner/4.jpg" alt="" class="bg-img">
                        </a>
                    </div>
                    <div class="col-lg-3 col-sm-6 h-100">
                        <a href="shop.php" class="banner-box">
                            <img id="mogTopBannerGrid2" src="assets/images/banner/5.jpg" alt="" class="bg-img">
                        </a>
                    </div>
                    <div class="col-lg-3 col-sm-6 h-100">
                        <a href="shop.php" class="banner-box">
                            <img id="mogTopBannerGrid3" src="assets/images/banner/6.jpg" alt="" class="bg-img">
                        </a>
                    </div>
                    <div class="col-lg-3 col-sm-6 h-100">
                        <a href="shop.php" class="banner-box">
                            <img id="mogTopBannerGrid4" src="assets/images/banner/7.jpg" alt="" class="bg-img">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const menuContainer = document.getElementById('categoryMenu');
    const catList = document.getElementById('categoryList');
    if (!menuContainer || !catList) return;

    const flyoutRoot = document.createElement('div');
    flyoutRoot.className = 'index-flyouts-root';
    menuContainer.appendChild(flyoutRoot);

    const flyouts = new Map();
    let flyoutIdCounter = 0;

    const observer = new MutationObserver(() => {
        const nestedUls = catList.querySelectorAll('ul.sub-menu-list');
        nestedUls.forEach(ul => {
            const parentLi = ul.parentElement;
            if (!parentLi.dataset.flyoutId) {
                const flyoutId = 'flyout-' + (++flyoutIdCounter);
                parentLi.dataset.flyoutId = flyoutId;
                
                let depth = 2;
                const parentUl = parentLi.parentElement;
                if (parentUl && parentUl.id !== 'categoryList' && parentUl.dataset.depth) {
                    depth = parseInt(parentUl.dataset.depth) + 1;
                }
                
                flyoutRoot.appendChild(ul);
                ul.style.left = ((depth - 2) * 100) + '%';
                ul.dataset.flyoutId = flyoutId;
                ul.dataset.depth = depth;
                flyouts.set(flyoutId, ul);
            }
        });
    });
    observer.observe(catList, { childList: true, subtree: true });

    let activeFlyouts = [];
    function hideFlyoutsFromDepth(depth) {
        activeFlyouts = activeFlyouts.filter(flyout => {
            if (flyout.depth >= depth) {
                const ul = flyouts.get(flyout.id);
                if (ul) ul.classList.remove('active-flyout');
                const li = document.querySelector(`li[data-flyout-id="${flyout.id}"]`);
                if (li) {
                    const a = li.querySelector('a');
                    if (a) a.classList.remove('active-hover');
                }
                return false;
            }
            return true;
        });
    }
    function showFlyout(flyoutId, depth) {
        if (activeFlyouts.some(f => f.id === flyoutId)) return;
        hideFlyoutsFromDepth(depth);
        const ul = flyouts.get(flyoutId);
        if (ul) {
            ul.classList.add('active-flyout');
            activeFlyouts.push({ id: flyoutId, depth: depth });
            const li = document.querySelector(`li[data-flyout-id="${flyoutId}"]`);
            if (li) {
                const a = li.querySelector('a');
                if (a) a.classList.add('active-hover');
            }
        }
    }
    menuContainer.addEventListener('mouseover', (e) => {
        const li = e.target.closest('li');
        if (li) {
            const parentUl = li.parentElement;
            const liDepth = parentUl.id === 'categoryList' ? 1 : parseInt(parentUl.dataset.depth || 1);
            const flyoutId = li.dataset.flyoutId;
            if (flyoutId) showFlyout(flyoutId, liDepth + 1);
            else hideFlyoutsFromDepth(liDepth + 1);
        }
    });
    menuContainer.addEventListener('mouseleave', () => hideFlyoutsFromDepth(1));
});
</script>
</section>
<!-- Home Hero Section End -->

<!-- BEST SELLERS -->
<section class="mog-section">
    <div class="custom-container">
        <div class="mog-prod-strip">
            <div class="mog-strip-header">
                <h3>Best Sellers</h3>
                <a href="shop.php" class="view-all">VIEW ALL</a>
            </div>
            <div class="swiper mog-swiper-products">
                <div class="swiper-wrapper" id="mogBestSellers"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
</section>

<!-- Middle Placement Banner -->
<section class="mog-section" id="mogMiddlePlacementSection" style="display:none;">
    <div class="custom-container">
        <div class="mog-placement-banner" id="mogMiddlePlacementBanner"></div>
    </div>
</section>

<!-- DEALS OF THE DAY (Flash Sale) -->
<section class="mog-section" id="mogDealsSection" style="display:none;">
    <div class="custom-container">
        <div class="mog-prod-strip">
            <div class="mog-strip-header">
                <h3>Deals of the Day</h3>
                <a href="shop.php" class="view-all">VIEW ALL</a>
            </div>
            <div class="swiper mog-swiper-products">
                <div class="swiper-wrapper" id="mogDealsWrap"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
</section>

<!-- TOP BRAND STORE (all brand logos grid) -->
<section class="mog-section" id="mogBrandStoreSection" style="display:none;">
    <div class="custom-container">
        <div class="mog-prod-strip">
            <div class="mog-strip-header">
                <h3>Shop By Top Brands</h3>
                <a href="shop.php" class="view-all">VIEW ALL</a>
            </div>
            <div class="mog-brand-store-grid" id="mogBrandStoreGrid"></div>
        </div>
    </div>
</section>

<!-- Per-Category Sections -->
<div id="mogCategorySections"></div>

<!-- Per-Brand Product Sections -->
<div id="mogBrandSections"></div>

<!-- Bottom Placement Banner (Above Featured Arrivals) -->
<section class="mog-section" id="mogBottomPlacementSection" style="display:none;">
    <div class="custom-container">
        <div class="mog-placement-banner" id="mogBottomPlacementBanner"></div>
    </div>
</section>

<!-- FEATURED ARRIVALS -->
<section class="mog-section">
    <div class="custom-container">
        <div class="mog-prod-strip">
            <div class="mog-strip-header">
                <h3>Featured Arrivals</h3>
                <a href="shop.php" class="view-all">VIEW ALL</a>
            </div>
            <div class="swiper mog-swiper-products">
                <div class="swiper-wrapper" id="mogFeaturedArrivals"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
</section>

<!-- SEO Block -->
<section class="mog-section">
    <div class="custom-container">
        <div class="mog-seo">
            <h3>Your Trusted E-commerce Online Shopping Site for Industrial Products</h3>
            <p>We are a leading online shopping destination for a wide range of industrial, office, and home products.
                Our catalog spans tools, electricals, hardware, safety gear, appliances, and more - delivered fast with genuine quality.
                Explore our huge category selection across <a href="shop.php">industrial products</a> and save big on bulk orders.</p>

            <h4>Browse our Top Selling Categories</h4>
            <p id="mogSeoCategories" class="text-muted">Loading top categories...</p>

            <h4>Popular Searches</h4>
            <p>Safety Shoes | Power Tools | Hand Tools | Industrial Tools | Office Chairs |
                Laser Printers | Monitors | LED Bulbs | CCTV Cameras | Gardening Tools | Solar Panels |
                UPS Batteries | Water Pumps | Diesel Generators</p>
        </div>
    </div>
</section>

<script>
(function () {
    const API_BASE = "https://api.workarya.com";
    const HOME_PRODUCTS_LIMIT = 10;
    const SERVER_PLACEMENT_BANNERS = <?php echo json_encode($serverPlacementBanners, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); ?>;
    const toArray = (v) => (Array.isArray(v) ? v : []);

    function resolveMedia(value, fallback) {
        if (!value) return fallback || "assets/images/product/placeholder.png";
        if (typeof window.resolveApiMediaUrl === "function") return window.resolveApiMediaUrl(value);
        const src = String(value);
        if (/^https?:\/\//i.test(src)) return src;
        const clean = src.replace(/^\/+/, "");
        if (clean.startsWith("multivendor/")) return `${API_BASE}/${clean}`;
        if (/^(uploads|products|blogs|brands|categories)\//i.test(clean)) {
            return `${API_BASE}/multivendor/${clean}`;
        }
        return `${API_BASE}/${clean}`;
    }

    function formatPrice(n) {
        const num = Number(n || 0);
        return `₹${num.toLocaleString('en-IN')}`;
    }

    function safe(v) {
        return String(v ?? '').replace(/[<>]/g, (c) => c === '<' ? '&lt;' : '&gt;');
    }

    function isBannerActive(b) {
        return Boolean(b?.isActive ?? b?.is_active ?? b?.active);
    }

    function getBannerPlacement(b) {
        const raw = b?.placement ?? b?.position ?? b?.section ?? b?.showIn ?? b?.bannerPlacement;
        const normalized = String(raw || "").toLowerCase().trim();
        if (["top", "middle", "bottom"].includes(normalized)) return normalized;
        return "top";
    }

    function productUrl(p) {
        const id = p?.id || p?._id || '';
        return id ? `product-detail.php?id=${encodeURIComponent(id)}` : 'product-detail.php';
    }

    function categoryUrl(id) {
        return id ? `shop.php?categoryId=${encodeURIComponent(id)}` : 'shop.php';
    }

    function brandUrl(id) {
        return id ? `shop.php?brandId=${encodeURIComponent(id)}` : 'shop.php';
    }

    function productCardHtml(p) {
        const name = safe(p.name || 'Product');
        const price = Number(p.price || 0);
        const discount = Number(p.discountPrice ?? p.discountprice ?? 0);
        const hasDiscount = discount > 0 && discount < price;
        const finalPrice = hasDiscount ? discount : (price || discount);
        const offPct = hasDiscount ? Math.round(((price - discount) / price) * 100) : 0;
        const image = resolveMedia(p.mainImage || p.mainimage);

        return `
            <a href="${productUrl(p)}" class="mog-prod-card d-block text-decoration-none">
                <div class="img-wrap">
                    <img src="${image}" alt="${name}" loading="lazy">
                </div>
                <div class="body">
                    <div class="rating-row"><i class="ri-star-fill"></i> 4.0</div>
                    <span class="rev-count">(0 reviews)</span>
                    <div class="pname">${name}</div>
                    <div class="price">
                        ${formatPrice(finalPrice)}
                        ${hasDiscount ? `<del>${formatPrice(price)}</del><span class="offer">${offPct}% OFF</span>` : ''}
                    </div>
                </div>
            </a>`;
    }

    function initProductsSwiper(el) {
        if (!el || typeof Swiper === 'undefined') return;
        if (el.swiper) el.swiper.destroy(true, true);
        new Swiper(el, {
            slidesPerView: 2,
            spaceBetween: 10,
            navigation: {
                nextEl: el.querySelector('.swiper-button-next'),
                prevEl: el.querySelector('.swiper-button-prev'),
            },
            breakpoints: {
                576: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                992: { slidesPerView: 5 },
                1200: { slidesPerView: 6 },
            },
        });
    }

    function renderCategoryStrip(categories) {
        const strip = document.getElementById('mogCatStrip');
        if (!strip) return;
        const parents = categories.filter((c) => !c.parentId).slice(0, 14);
        if (!parents.length) {
            strip.innerHTML = '<span class="text-muted small px-3">No categories available.</span>';
            return;
        }
        strip.innerHTML = parents.map((c) => `
            <a class="mog-cat-pill" href="${categoryUrl(c.id)}">
                <img src="${resolveMedia(c.image, 'assets/images/category/1.png')}" alt="${safe(c.name)}">
                <span>${safe(c.name)}</span>
            </a>
        `).join('');
    }

    function renderHero(banners) {
        const wrap = document.getElementById('mogHeroBanners');
        if (!wrap) return;
        const picks = toArray(banners).slice(0, 5);
        if (!picks.length) {
            // Fallback to kartify default banner if no banners configured.
            wrap.innerHTML = `
                <div class="swiper-slide"><a href="shop.php"><img src="assets/images/banner/1.jpg" alt="Shop"></a></div>`;
        } else {
            wrap.innerHTML = picks.map((b) => {
                const link = b.link || 'shop.php';
                const img = resolveMedia(b.image);
                const title = safe(b.title || 'Banner');
                return `
                    <div class="swiper-slide">
                        <a href="${link}"><img src="${img}" alt="${title}"></a>
                    </div>`;
            }).join('');
        }
        if (typeof Swiper !== 'undefined') {
            const el = document.getElementById('mogHeroSwiper');
            if (el && el.swiper) el.swiper.destroy(true, true);
            new Swiper('#mogHeroSwiper', {
                loop: picks.length > 1,
                autoplay: picks.length > 1 ? { delay: 4000, disableOnInteraction: false } : false,
                pagination: { el: '.mog-hero .swiper-pagination', clickable: true },
                navigation: { nextEl: '.mog-hero .swiper-button-next', prevEl: '.mog-hero .swiper-button-prev' },
            });
        }
    }

    function renderPromoRows(banners) {
        const banArr = toArray(banners).filter(isBannerActive);

        // 4-tile row uses banner slots 5..8 (after the 5 hero banners).
        const tiles = banArr.slice(5, 9);
        const row = document.getElementById('mogPromoRow');
        if (row && tiles.length) {
            const anchors = row.querySelectorAll('.mog-promo-tile');
            tiles.forEach((banner, i) => {
                if (!anchors[i]) return;
                if (banner.link) anchors[i].href = banner.link;
                const img = anchors[i].querySelector('img');
                if (img && banner.image) img.src = resolveMedia(banner.image);
            });
        }

    }

    async function fetchPlacementBanners() {
        const serverList = toArray(SERVER_PLACEMENT_BANNERS);
        if (serverList.length) return serverList;

        try {
            const res = await fetch(`${API_BASE}/api/banner/list`);
            if (!res.ok) return [];
            const json = await res.json();
            return toArray(json?.data?.data || json?.data || json);
        } catch (err) {
            console.warn('Placement banners fetch failed:', err);
            return [];
        }
    }

    function renderPlacementBanner(placement, banner) {
        const section = document.getElementById(
            placement === "middle" ? "mogMiddlePlacementSection" : "mogBottomPlacementSection"
        );
        const host = document.getElementById(
            placement === "middle" ? "mogMiddlePlacementBanner" : "mogBottomPlacementBanner"
        );
        if (!section || !host) return;

        if (!banner?.image) {
            section.style.display = "none";
            host.innerHTML = "";
            return;
        }

        section.style.display = "";
        host.innerHTML = `<img src="${resolveMedia(banner.image)}" alt="${safe(banner.title || placement)}" loading="lazy">`;
    }

    function renderTopBannersFromList(banners) {
        const topBanners = toArray(banners)
            .filter((b) => isBannerActive(b) && getBannerPlacement(b) === "top")
            .slice(0, 7);
        if (!topBanners.length) return;

        const targetIds = [
            "mogTopBannerMain",
            "mogTopBannerRight1",
            "mogTopBannerRight2",
            "mogTopBannerGrid1",
            "mogTopBannerGrid2",
            "mogTopBannerGrid3",
            "mogTopBannerGrid4",
        ];

        topBanners.forEach((banner, idx) => {
            const img = document.getElementById(targetIds[idx]);
            if (!img) return;
            img.src = resolveMedia(banner.image);
            img.alt = safe(banner.title || `Top Banner ${idx + 1}`);
        });
    }

    function renderProductRow(containerId, products) {
        const wrap = document.getElementById(containerId);
        if (!wrap) return;
        const list = toArray(products);
        if (!list.length) {
            wrap.innerHTML = `<div class="swiper-slide"><p class="text-muted small">No products yet.</p></div>`;
            return;
        }
        wrap.innerHTML = list.map((p) => `
            <div class="swiper-slide">${productCardHtml(p)}</div>
        `).join('');
        initProductsSwiper(wrap.closest('.swiper'));
    }

    function isProductSalesActive(p) {
        // Strict rule requested: only sales_status=active should be shown.
        const salesRaw = p?.sales_status ?? p?.salesStatus ?? p?.salesstatus;
        if (salesRaw == null || salesRaw === "") return false;
        const normalized = String(salesRaw).trim().toLowerCase();
        return normalized === "active";
    }

    function isProductRowActive(p) {
        const raw = p?.isactive ?? p?.isActive;
        if (raw == null || raw === "") return false;
        if (typeof raw === "boolean") return raw;
        if (typeof raw === "number") return raw !== 0;
        const normalized = String(raw).trim().toLowerCase();
        return ["true", "1", "yes", "on", "active"].includes(normalized);
    }

    function isProductFeatured(p) {
        const raw = p?.isfeatured ?? p?.isFeatured;
        if (raw == null || raw === "") return false;
        if (typeof raw === "boolean") return raw;
        if (typeof raw === "number") return raw !== 0;
        const normalized = String(raw).trim().toLowerCase();
        return ["true", "1", "yes", "on"].includes(normalized);
    }

    function productIdOf(p) {
        return String(p?.id || p?._id || "");
    }

    function isQualifiedHomeProduct(p) {
        return isProductFeatured(p) && isProductSalesActive(p) && isProductRowActive(p);
    }

    async function fetchHomepageProductsFallback(maxItems = 400) {
        try {
            const out = [];
            let cursor = "";
            const pageSize = 100;

            while (out.length < maxItems) {
                const qs = new URLSearchParams();
                qs.set("pageSize", String(pageSize));
                if (cursor) qs.set("cursor", cursor);

                const res = await fetch(`${API_BASE}/api/products/list?${qs.toString()}`);
                if (!res.ok) break;
                const json = await res.json();
                const payload = json?.data ?? json;
                const batch = toArray(payload?.data || payload?.items || payload);
                if (!batch.length) break;

                out.push(...batch);

                const hasMore = Boolean(payload?.hasMore);
                const nextCursor = String(payload?.nextCursor || "");
                if (!hasMore || !nextCursor || nextCursor === cursor) break;
                cursor = nextCursor;
            }

            return out.slice(0, maxItems);
        } catch (err) {
            console.warn("Fallback product fetch failed:", err);
            return [];
        }
    }

    async function fetchHomeIsFeaturedSections(limit = HOME_PRODUCTS_LIMIT) {
        try {
            const res = await fetch(`${API_BASE}/api/products/home-isfeatured-sections?limit=${encodeURIComponent(limit)}`);
            if (!res.ok) return null;
            const json = await res.json();
            const payload = json?.data || {};
            return {
                bestSellers: toArray(payload.bestSellers),
                featuredArrivals: toArray(payload.featuredArrivals),
            };
        } catch (err) {
            console.warn("home-isfeatured-sections fetch failed:", err);
            return null;
        }
    }

    async function fetchCategoryProducts(categoryId, limit = 12) {
        try {
            const res = await fetch(`${API_BASE}/api/products/list?page=1&pageSize=${limit}&categoryIds=${encodeURIComponent(categoryId)}`);
            if (!res.ok) return [];
            const json = await res.json();
            return json?.data?.data || json?.data || [];
        } catch (err) {
            console.warn('Category products fetch failed:', err);
            return [];
        }
    }

    function buildCategorySection(parent, children, brands, products) {
        const subTiles = children.slice(0, 4).map((c) => `
            <a href="${categoryUrl(c.id)}" class="mog-subcat-tile">
                <img src="${resolveMedia(c.image, 'assets/images/category/1.png')}" alt="${safe(c.name)}">
                <span class="s-name">${safe(c.name)}</span>
                <span class="s-cta">Explore Now</span>
            </a>
        `).join('');

        const brandChips = brands.slice(0, 4).map((b) => `
            <a href="${brandUrl(b.id)}" class="mog-brand-chip" title="${safe(b.name)}">
                ${b.logo ? `<img src="${resolveMedia(b.logo)}" alt="${safe(b.name)}">` : `<span>${safe(b.name)}</span>`}
            </a>
        `).join('');

        const wrapperId = `mogCatRow-${parent.id}`;
        const prodCards = products.map((p) => `
            <div class="swiper-slide">${productCardHtml(p)}</div>
        `).join('');

        return `
            <section class="mog-section">
                <div class="custom-container">
                    <div class="mog-cat-section">
                        <div class="section-head">
                            <h3>${safe(parent.name)}</h3>
                            <a href="${categoryUrl(parent.id)}" class="view-all">VIEW ALL</a>
                        </div>
                        <div class="inner-row">
                            <div class="mog-cat-left">
                                ${brandChips ? `<h6>Top Brands &amp; Related Categories</h6><div class="mog-brand-grid">${brandChips}</div>` : ''}
                                ${subTiles ? `<div class="mog-subcat-grid">${subTiles}</div>` : ''}
                            </div>
                            <div class="mog-cat-right">
                                <div class="swiper mog-swiper-products">
                                    <div class="swiper-wrapper" id="${wrapperId}">${prodCards}</div>
                                    <div class="swiper-button-prev"></div>
                                    <div class="swiper-button-next"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    async function renderCategorySections(categories, brands) {
        const host = document.getElementById('mogCategorySections');
        if (!host) return;

        const parents = categories.filter((c) => !c.parentId);
        // Render ALL parent categories (was previously limited to 8).
        if (!parents.length) { host.innerHTML = ''; return; }

        // Fetch products per category in parallel, but keep only those that actually have products.
        const productSets = await Promise.all(parents.map((p) => fetchCategoryProducts(p.id, 12)));

        const rendered = [];
        parents.forEach((parent, idx) => {
            const products = productSets[idx] || [];
            if (!products.length) return; // skip empty categories to keep page clean
            const children = categories.filter((c) => String(c.parentId || '') === String(parent.id));
            const bStart = (idx * 4) % Math.max(brands.length, 1);
            const bSlice = brands.length ? brands.slice(bStart, bStart + 4) : [];
            rendered.push({ parent, html: buildCategorySection(parent, children, bSlice, products) });
        });

        host.innerHTML = rendered.map((r) => r.html).join('');
        rendered.forEach(({ parent }) => {
            const wrap = document.getElementById(`mogCatRow-${parent.id}`);
            if (wrap) initProductsSwiper(wrap.closest('.swiper'));
        });
    }

    // ---- NEW: Top Brand Store grid (all brand logos) ----
    function renderBrandStore(brands) {
        const section = document.getElementById('mogBrandStoreSection');
        const grid = document.getElementById('mogBrandStoreGrid');
        if (!section || !grid) return;
        const list = toArray(brands).slice(0, 24);
        if (!list.length) { section.style.display = 'none'; return; }
        section.style.display = '';
        grid.innerHTML = list.map((b) => `
            <a href="${brandUrl(b.id)}" class="mog-brand-store-tile" title="${safe(b.name)}">
                ${b.logo ? `<img src="${resolveMedia(b.logo)}" alt="${safe(b.name)}">` : ''}
                <span class="b-name">${safe(b.name || 'Brand')}</span>
            </a>
        `).join('');
    }

    // ---- NEW: Fetch products for a specific brand ----
    async function fetchBrandProducts(brandId, limit = 12) {
        try {
            const res = await fetch(`${API_BASE}/api/products/list?page=1&pageSize=${limit}&brandIds=${encodeURIComponent(brandId)}`);
            if (!res.ok) return [];
            const json = await res.json();
            return json?.data?.data || json?.data || [];
        } catch (err) {
            console.warn('Brand products fetch failed:', err);
            return [];
        }
    }

    function buildBrandSection(brand, products) {
        const wrapperId = `mogBrandRow-${brand.id}`;
        const prodCards = products.map((p) => `
            <div class="swiper-slide">${productCardHtml(p)}</div>
        `).join('');
        return `
            <section class="mog-section">
                <div class="custom-container">
                    <div class="mog-prod-strip">
                        <div class="mog-strip-header">
                            <h3>
                                ${brand.logo ? `<img src="${resolveMedia(brand.logo)}" alt="${safe(brand.name)}" style="height:28px;width:auto;object-fit:contain;margin-right:8px;vertical-align:middle;">` : ''}
                                ${safe(brand.name)} Store
                            </h3>
                            <a href="${brandUrl(brand.id)}" class="view-all">VIEW ALL</a>
                        </div>
                        <div class="swiper mog-swiper-products">
                            <div class="swiper-wrapper" id="${wrapperId}">${prodCards}</div>
                            <div class="swiper-button-prev"></div>
                            <div class="swiper-button-next"></div>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    async function renderBrandSections(brands) {
        const host = document.getElementById('mogBrandSections');
        if (!host) return;
        const list = toArray(brands).slice(0, 8); // top 8 brands get their own product strip
        if (!list.length) { host.innerHTML = ''; return; }

        const productSets = await Promise.all(list.map((b) => fetchBrandProducts(b.id, 12)));
        const rendered = [];
        list.forEach((brand, idx) => {
            const products = productSets[idx] || [];
            if (!products.length) return;
            rendered.push({ brand, html: buildBrandSection(brand, products) });
        });

        host.innerHTML = rendered.map((r) => r.html).join('');
        rendered.forEach(({ brand }) => {
            const wrap = document.getElementById(`mogBrandRow-${brand.id}`);
            if (wrap) initProductsSwiper(wrap.closest('.swiper'));
        });
    }

    // ---- NEW: Deals of the Day (flash sale / discounted) ----
    function renderDeals(data) {
        const section = document.getElementById('mogDealsSection');
        const wrap = document.getElementById('mogDealsWrap');
        if (!section || !wrap) return;
        let list = toArray(data.flashSaleProducts);
        if (!list.length) {
            // fallback: take discounted products from featured/latest
            const pool = [...toArray(data.featuredProducts), ...toArray(data.latestProducts)];
            list = pool.filter((p) => {
                const d = Number(p.discountPrice ?? p.discountprice ?? 0);
                const pr = Number(p.price || 0);
                return d > 0 && d < pr;
            }).slice(0, 12);
        }
        if (!list.length) { section.style.display = 'none'; return; }
        section.style.display = '';
        wrap.innerHTML = list.map((p) => `<div class="swiper-slide">${productCardHtml(p)}</div>`).join('');
        initProductsSwiper(wrap.closest('.swiper'));
    }

    function renderSeoCategories(categories) {
        const el = document.getElementById('mogSeoCategories');
        if (!el) return;
        const parents = categories.filter((c) => !c.parentId).slice(0, 20);
        if (!parents.length) { el.textContent = ''; return; }
        el.innerHTML = parents.map((c) => `<a href="${categoryUrl(c.id)}">${safe(c.name)}</a>`).join(' | ');
    }

    async function init() {
        const placementBanners = await fetchPlacementBanners();
        const activePlacementBanners = placementBanners.filter(isBannerActive);
        const middleBanner = activePlacementBanners.find((b) => getBannerPlacement(b) === "middle");
        const bottomBanner = activePlacementBanners.find((b) => getBannerPlacement(b) === "bottom");

        renderTopBannersFromList(activePlacementBanners);
        renderPlacementBanner("middle", middleBanner);
        renderPlacementBanner("bottom", bottomBanner);

        try {
            const res = await fetch(`${API_BASE}/api/home/display`);
            const json = await res.json();
            const data = json?.data || {};

            const categories = toArray(data.categories);
            const brands = toArray(data.brands);
            const banners = toArray(data.banners);

            // Hero banners + top category strip are rendered by the classic
            // static hero layout above + category.js (populates #categoryList).
            let bestSellerList = [];
            let featuredArrivalList = [];

            const sectionsApi = await fetchHomeIsFeaturedSections(HOME_PRODUCTS_LIMIT);
            if (sectionsApi) {
                bestSellerList = sectionsApi.bestSellers;
                featuredArrivalList = sectionsApi.featuredArrivals;
            }

            // Safety fallback if API is unavailable.
            if (!bestSellerList.length && !featuredArrivalList.length) {
                let bestSellers = toArray(data.featuredProducts).filter(isQualifiedHomeProduct);
                let featuredArrivals = toArray(data.latestProducts).filter(isQualifiedHomeProduct);
                if (!bestSellers.length || !featuredArrivals.length) {
                    const fallbackProducts = await fetchHomepageProductsFallback(400);
                    if (!bestSellers.length) bestSellers = fallbackProducts.filter(isQualifiedHomeProduct);
                    if (!featuredArrivals.length) featuredArrivals = fallbackProducts.filter(isQualifiedHomeProduct);
                }
                const mergedQualified = [...bestSellers, ...featuredArrivals];
                const uniqueMap = new Map();
                mergedQualified.forEach((p) => {
                    const id = productIdOf(p);
                    if (!id || uniqueMap.has(id)) return;
                    uniqueMap.set(id, p);
                });
                const qualifiedList = Array.from(uniqueMap.values());
                bestSellerList = qualifiedList.slice(0, HOME_PRODUCTS_LIMIT);
                featuredArrivalList = qualifiedList.slice(HOME_PRODUCTS_LIMIT, HOME_PRODUCTS_LIMIT * 2);
            }

            renderProductRow('mogBestSellers', bestSellerList);
            renderPromoRows(banners);
            renderDeals(data);
            renderBrandStore(brands);
            renderProductRow('mogFeaturedArrivals', featuredArrivalList);
            renderSeoCategories(categories);

            // Category strips fetch their own scoped products (uses pageSize up to 12 each).
            renderCategorySections(categories, brands);
            // Per-brand product strips for top brands.
            renderBrandSections(brands);
        } catch (err) {
            console.error('Home dynamic mapping failed:', err);
        }
    }

    document.addEventListener('DOMContentLoaded', init);
})();
</script>

<?php include 'footer.php'; ?>
