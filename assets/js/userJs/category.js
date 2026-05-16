const API_URL = "https://api.workarya.com/api/category/list";

async function loadCategories() {
    const homeListEl = document.getElementById("categoryList");
    const headerListEl = document.getElementById("headerCategoryList");
    if (!homeListEl && !headerListEl) return;

    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        const categories = Array.isArray(data?.data) ? data.data.filter(c => c && c.isActive !== false) : [];

        if (homeListEl) {
            homeListEl.innerHTML = "";
            categories.forEach(cat => renderHomeCategory(cat, homeListEl));
        }

        if (headerListEl) {
            headerListEl.innerHTML = "";
            if (categories.length === 0) {
                headerListEl.innerHTML = '<li class="text-center text-muted small py-3">No categories found</li>';
            } else {
                // Render with the same hover-flyout style used on the home page.
                categories.forEach(cat => renderHeaderCategory(cat, headerListEl));
            }
            setupHeaderMegaDesktopFlyouts();
        }
    } catch (err) {
        console.error("Failed to load categories:", err);
        if (headerListEl) {
            headerListEl.innerHTML = '<li class="text-center text-muted small py-3">Failed to load categories</li>';
            setupHeaderMegaDesktopFlyouts();
        }
    }
}

// Original hover-flyout style rendering for the homepage sidebar (index.php).
function renderHomeCategory(cat, parentUl) {
    const li = document.createElement("li");
    const catId = cat._id || cat.id || "";
    const a = document.createElement("a");
    a.href = `shop.php?categoryId=${encodeURIComponent(catId)}`;
    a.classList.add("sub-category-box");

    const h5 = document.createElement("h5");
    h5.textContent = cat.name;
    a.appendChild(h5);

    if (cat.isNew) {
        const span = document.createElement("span");
        span.classList.add("success-bg-color");
        span.textContent = "New";
        h5.appendChild(span);
    }

    li.appendChild(a);

    if (cat.children && cat.children.length > 0) {
        const nestedUl = document.createElement("ul");
        nestedUl.classList.add("sub-menu-list");
        cat.children.forEach(child => renderHomeCategory(child, nestedUl));
        li.appendChild(nestedUl);
    }

    parentUl.appendChild(li);
}

// Header mega: desktop click + .open; mobile tap in header.php.
function renderHeaderCategory(cat, parentUl) {
    const li = document.createElement("li");
    const catId = cat._id || cat.id || "";
    const hasChildren = Array.isArray(cat.children) && cat.children.length > 0;

    const a = document.createElement("a");
    a.href = `shop.php?categoryId=${encodeURIComponent(catId)}`;
    a.classList.add("sub-category-box");
    if (hasChildren) a.setAttribute("data-has-children", "true");

    const h5 = document.createElement("h5");
    h5.textContent = cat.name;

    if (cat.isNew) {
        const span = document.createElement("span");
        span.classList.add("success-bg-color");
        span.textContent = "New";
        h5.appendChild(span);
    }

    a.appendChild(h5);

    if (hasChildren) {
        const icon = document.createElement("i");
        icon.className = "ri-arrow-right-s-line chevron";
        a.appendChild(icon);
    }

    li.appendChild(a);

    if (hasChildren) {
        const nestedUl = document.createElement("ul");
        nestedUl.classList.add("sub-menu-list");
        cat.children.forEach(child => renderHeaderCategory(child, nestedUl));
        li.appendChild(nestedUl);
    }

    parentUl.appendChild(li);
}

/**
 * Desktop: first-level ULs in #headerCategoryFlyoutsRoot (CSS top:0). Root panels open on hover
 * (pointerenter); nested/child columns use li:hover > ul like index. Click still toggles root row.
 */
function setupHeaderMegaDesktopFlyouts() {
    const mega = document.getElementById("headerCategoryMega");
    const list = document.getElementById("headerCategoryList");
    const port = document.getElementById("headerCategoryFlyoutsRoot");
    const inner = mega && mega.querySelector(".header-category-mega-inner");
    if (!mega || !list || !port || !inner) return;

    let listenersBound = false;
    let resizeTimer = null;

    function isDesktop() {
        return window.matchMedia("(min-width: 768px)").matches;
    }

    function clearPortFlyoutStyles() {
        port.querySelectorAll(":scope > ul.sub-menu-list").forEach((u) => {
            u.style.top = "";
        });
    }

    function demoteAllFlyouts() {
        list.querySelectorAll(":scope > li.header-root-item-active").forEach((el) => el.classList.remove("header-root-item-active"));
        port.querySelectorAll("li.open").forEach((el) => el.classList.remove("open"));
        port.querySelectorAll(":scope > ul.sub-menu-list[data-header-flyout-cat]").forEach((ul) => {
            const cid = ul.getAttribute("data-header-flyout-cat");
            if (!cid) return;
            const li = list.querySelector(`li[data-header-flyout-cat="${cid}"]`);
            if (li) {
                li.appendChild(ul);
                li.removeAttribute("data-header-flyout-cat");
            }
            ul.removeAttribute("data-header-flyout-cat");
            ul.classList.remove("header-flyout-active");
            ul.style.top = "";
        });
    }

    function activateFlyoutForLi(li) {
        if (!li || !li.hasAttribute("data-header-flyout-cat")) return;
        const cid = li.getAttribute("data-header-flyout-cat");
        clearPortFlyoutStyles();
        port.querySelectorAll(":scope > ul.sub-menu-list").forEach((u) => {
            const on = u.getAttribute("data-header-flyout-cat") === cid;
            u.classList.toggle("header-flyout-active", on);
        });
    }

    function syncDesktopFlyouts() {
        demoteAllFlyouts();
        if (!isDesktop()) return;

        list.querySelectorAll(":scope > li").forEach((li) => {
            if (li.classList.contains("text-center")) return;
            const sub = li.querySelector(":scope > ul.sub-menu-list");
            if (!sub) return;
            const a = li.querySelector(":scope > a[href*='categoryId=']");
            if (!a) return;
            const href = a.getAttribute("href") || "";
            const m = href.match(/categoryId=([^&]+)/);
            const cid = m ? decodeURIComponent(m[1]) : "";
            if (!cid) return;
            li.setAttribute("data-header-flyout-cat", cid);
            sub.setAttribute("data-header-flyout-cat", cid);
            port.appendChild(sub);
        });
    }

    function onListPointerOver(e) {
        if (!isDesktop()) return;
        const li = e.target.closest("#headerCategoryList > li");
        if (!li || !list.contains(li) || !li.hasAttribute("data-header-flyout-cat")) return;
        list.querySelectorAll(":scope > li.header-root-item-active").forEach((x) => {
            if (x !== li) x.classList.remove("header-root-item-active");
        });
        li.classList.add("header-root-item-active");
        activateFlyoutForLi(li);
    }

    function onInnerPointerLeave(e) {
        if (!isDesktop()) return;
        const related = e.relatedTarget;
        if (related && inner.contains(related)) return;
        port.querySelectorAll(":scope > ul.sub-menu-list").forEach((u) => u.classList.remove("header-flyout-active"));
        list.querySelectorAll(":scope > li.header-root-item-active").forEach((x) => x.classList.remove("header-root-item-active"));
        clearPortFlyoutStyles();
    }

    function onInnerClick(e) {
        if (!isDesktop()) return;
        const anchor = e.target.closest('a[data-has-children="true"]');
        if (!anchor) return;

        const li = anchor.closest("li");
        if (!li || !inner.contains(li)) return;

        if (li.closest("#headerCategoryList")) {
            if (!li.hasAttribute("data-header-flyout-cat")) return;
            e.preventDefault();
            e.stopPropagation();
            const cid = li.getAttribute("data-header-flyout-cat");
            const current = port.querySelector("ul.sub-menu-list.header-flyout-active");
            if (current && current.getAttribute("data-header-flyout-cat") === cid) {
                current.classList.remove("header-flyout-active");
                li.classList.remove("header-root-item-active");
                clearPortFlyoutStyles();
                return;
            }
            list.querySelectorAll(":scope > li.header-root-item-active").forEach((x) => x.classList.remove("header-root-item-active"));
            port.querySelectorAll("li.open").forEach((x) => x.classList.remove("open"));
            li.classList.add("header-root-item-active");
            activateFlyoutForLi(li);
        }
    }

    if (!listenersBound) {
        listenersBound = true;
        list.addEventListener("pointerover", onListPointerOver);
        inner.addEventListener("pointerleave", onInnerPointerLeave);
        inner.addEventListener("click", onInnerClick);
        window.addEventListener(
            "resize",
            function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(syncDesktopFlyouts, 120);
            },
            { passive: true }
        );
    }

    syncDesktopFlyouts();
}

document.addEventListener("DOMContentLoaded", loadCategories);










// ==================================================== INDEX PAGE CATEOGY SLIDER ====================================================
