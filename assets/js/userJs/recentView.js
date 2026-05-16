document.addEventListener("DOMContentLoaded", function () {
    loadRecentProducts();
});

async function loadRecentProducts() {
    const recentViewProduct = document.getElementById("recentViewProduct");

    if (!recentViewProduct) return;

    const API_URL = "https://api.workarya.com/api/recent";
    const BASE_URL = "https://api.workarya.com";
    const userToken = localStorage.getItem("userToken");

    try {
        const headers = {
            "Content-Type": "application/json"
        };

        // Agar token hai to bhejo, nahi hai to bhi API call chale
        if (userToken) {
            headers["Authorization"] = `Bearer ${userToken}`;
        }

        const response = await fetch(API_URL, {
            method: "GET",
            headers: headers
        });

        const result = await response.json();

        console.log("Recent Products API Response:", result);

        if (!result.success || !result.data || result.data.length === 0) {
            recentViewProduct.innerHTML = `
                <li>
                    <div class="text-center w-100 py-3">
                        <h6 class="mb-0">No recent products found</h6>
                    </div>
                </li>
            `;
            return;
        }

        let html = "";

        result.data.forEach(product => {
            const productId = product.productId || "";
            const productName = product.name || "Product Name";
            const productPrice = product.salePrice ? `$${parseFloat(product.salePrice).toFixed(2)}` : "$0.00";
            const discountPrice = product.originalPrice ? `$${parseFloat(product.originalPrice).toFixed(2)}` : "$0.00";
            const productImage = window.resolveApiMediaUrl
                ? window.resolveApiMediaUrl(product.image, "assets/images/product/3.png")
                : (product.image ? `${BASE_URL}${product.image}` : "assets/images/product/3.png");

            html += `
                <li>
                    <div class="vertical-product-box">
                        <a href="product-detail.php?id=${productId}" class="product-image">
                            <img src="${productImage}" class="img-fluid" alt="${productName}">
                        </a>
                        <div class="product-content">
                            <a href="product-detail.php?id=${productId}">
                                <h5 class="name title-color">${productName}</h5>
                            </a>
                            <h5 class="price">${productPrice} <del>${discountPrice}</del></h5>
                            <button class="btn cart-btn" onclick="goToProductDetail('${productId}')">
                                <i class="ri-shopping-cart-line"></i>
                                <span>Add to cart</span>
                            </button>
                        </div>
                    </div>
                </li>
            `;
        });

        recentViewProduct.innerHTML = html;

    } catch (error) {
        console.error("Error loading recent products:", error);
        recentViewProduct.innerHTML = `
            <li>
                <div class="text-center w-100 py-3">
                    <h6 class="mb-0 text-danger">Failed to load recent products</h6>
                </div>
            </li>
        `;
    }
}

// Add to cart button pe फिलहाल detail page pe redirect
function goToProductDetail(productId) {
    window.location.href = `product-detail.php?id=${productId}`;
}
