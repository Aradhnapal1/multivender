// Home page category slider (Shop by Categories).
// This file must never throw when the category section is missing.
const FALLBACK_IMG = "assets/images/product/placeholder.png";

document.addEventListener("DOMContentLoaded", loadCategories);

async function loadCategories() {
    try {
        const res = await fetch(`https://api.workarya.com/api/category/list`);
        const result = await res.json();

        if (!result.success) {
            console.log("API call failed");
            return;
        }

        const wrapper = document.getElementById("categoryWrapper");
        if (!wrapper) return;
        wrapper.innerHTML = "";

        const categories = Array.isArray(result)
            ? result
            : (Array.isArray(result?.data?.data)
                ? result.data.data
                : (Array.isArray(result?.data)
                    ? result.data
                    : []));

        // Only active top-level parents (children presence ignored)
        const parents = categories.filter((c) => {
            if (!c) return false;
            const active = c.isActive === true || c.isActive === 1 || c.isActive === "true";
            const isTopLevel = c.parentId == null || c.parentId === "";
            return active && isTopLevel;
        });

        console.log("=== Active Parent Categories ===");
        parents.forEach(cat => {
            console.log("Name:", cat.name, "Slug:", cat.slug);

            const catId = cat._id || cat.id;
            const imgSrc = typeof window.resolveApiMediaUrl === "function"
                ? window.resolveApiMediaUrl(cat.image, FALLBACK_IMG)
                : (cat.image ? `https://api.workarya.com/${cat.image}` : FALLBACK_IMG);

            // alert(img)

            const slide = `
                <div class="swiper-slide">
                    <a href="shop.php?categoryId=${catId}" class="category-box">
                        <img src="${imgSrc}" class="img-fluid" alt="${cat.name}">
                        <h4>${cat.name}</h4>
                    </a>
                </div>
            `;
            wrapper.insertAdjacentHTML("beforeend", slide);
        });

        initCategorySwiper();

    } catch (err) {
        console.error("Error fetching categories:", err);
    }
}

function initCategorySwiper() {
    if (typeof Swiper === "undefined") return;
    new Swiper(".category-box-slide", {
        slidesPerView: 6,
        spaceBetween: 15,
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        breakpoints: {
            0: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            992: { slidesPerView: 5 },
            1200: { slidesPerView: 6 }
        }
    });
}
