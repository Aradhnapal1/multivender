/**=====================
   Category Hide & Show JS
==========================**/
// The legacy `.categoryButton` has been replaced by the global
// "Shop By Categories" offcanvas in header.php. These toggles only run
// when the old button is still present on the page.
document.addEventListener("DOMContentLoaded", function () {
    const btn = document.querySelector(".categoryButton");
    if (!btn) return;

    btn.addEventListener("click", function () {
        const homeSection = document.querySelector(".home-section");
        if (!homeSection) return;
        const left = homeSection.querySelector(".custom-xxl-3");
        const right = homeSection.querySelector(".col-12, .custom-xxl-9");

        if (left && right) {
            if (left.style.display === "none") {
                left.style.display = "";
                right.classList.remove("col-12");
                right.classList.add("custom-xxl-9");
            } else {
                left.style.display = "none";
                right.classList.remove("custom-xxl-9");
                right.classList.add("col-12");
            }
        }
    });

    btn.addEventListener("click", function () {
        const homeSection = document.querySelector(".home-section");
        if (!homeSection) return;
        const left = homeSection.querySelector(".custom-col-xxl-3");
        const right = homeSection.querySelector(".col-12, .custom-col-xxl-9");

        if (left && right) {
            if (left.style.display === "none") {
                left.style.display = "";
                right.classList.remove("col-12");
                right.classList.add("custom-col-xxl-9");
            } else {
                left.style.display = "none";
                right.classList.remove("custom-col-xxl-9");
                right.classList.add("col-12");
            }
        }
    });

    btn.addEventListener("click", function () {
        const productBanner = document.querySelector(".product-banner-section");
        if (!productBanner) return;
        const left = productBanner.querySelector(".custom-col-xxl-3");
        const right = productBanner.querySelector(".col-12, .custom-col-xxl-9");

        if (left && right) {
            if (left.style.display === "none") {
                left.style.display = "";
                right.classList.remove("col-12");
                right.classList.add("custom-col-xxl-9");
            } else {
                left.style.display = "none";
                right.classList.remove("custom-col-xxl-9");
                right.classList.add("col-12");
            }
        }
    });
});
