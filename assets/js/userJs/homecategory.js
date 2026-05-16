{/* <script> */}
// const FALLBACK_IMG = "https://api.workarya.com/"; 
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
        wrapper.innerHTML = "";

        // Only active top-level parents (children presence ignored)
        const parents = result.data.filter(c => c.isActive && c.parentId === null);

        console.log("=== Active Parent Categories ===");
        parents.forEach(cat => {
            console.log("Name:", cat.name, "Slug:", cat.slug);

            const img = cat.image ? cat.image : FALLBACK_IMG;
            // alert(img)

            const catId = cat._id || cat.id;
            const slide = `
                <div class="swiper-slide">
                    <a href="shop.php?categoryId=${catId}" class="category-box">
                        <img src="https://api.workarya.com/${img}" class="img-fluid" alt="${cat.name}">
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
