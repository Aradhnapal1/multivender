/**=====================
    Wishlist Notify Js
==========================**/
document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "https://api.workarya.com";
    let fadeOutTimeout;

    window.loadWishlist = async function() {
        // Wishlist works for guests too (server keys by IP), so we still call the
        // API when there is no bearer token. Only attach Authorization when we have one.
        const userToken = localStorage.getItem("userToken");
        const headers = {};
        if (userToken) headers["Authorization"] = `Bearer ${userToken}`;

        try {
            const response = await fetch(`${BASE_URL}/api/user/list`, { headers });
            const data = await response.json();
            // The API returns {success, data:[...]} on success and {success:false, message}
            // on failure. Guard the downstream code so we never try to iterate a string.
            let items = [];
            if (Array.isArray(data)) {
                items = data;
            } else if (Array.isArray(data?.data)) {
                items = data.data;
            } else if (Array.isArray(data?.items)) {
                items = data.items;
            } else if (data?.success === false) {
                console.warn("Wishlist fetch failed:", data.message);
            }
            
            // Update wishlist count in header badges
            const countElements = document.querySelectorAll('#wishlistCount span, .wishlistCount span, #wishlistCount, .wishlistCount, .wishlist-qty');
            countElements.forEach(el => {
                if (el.textContent.includes('(')) {
                    el.textContent = `(${items.length})`;
                } else {
                    el.textContent = items.length;
                }
            });

            // Update container in wishlist.php if we are on that page
            const container = document.getElementById('wishlistContainer');
            if (container) {
                renderWishlistItems(items, container);
            }

            // Update offcanvas wishlist sidebar
            const offcanvasList = document.getElementById('offcanvasWishlistList');
            if (offcanvasList) {
                renderOffcanvasWishlistItems(items, offcanvasList);
            }

            // Synchronize heart icons globally so they turn red if the product is in the wishlist
            document.querySelectorAll('.wishlistProduct').forEach(icon => {
                const id = icon.getAttribute('data-id');
                const inWishlist = items.some(item => {
                    const p = item.product || item;
                    return (p._id === id || p.id === id || item.productId === id);
                });
                
                const iTag = icon.querySelector('i');
                if (inWishlist) {
                    icon.classList.add('show');
                    if(iTag) {
                        iTag.classList.replace('ri-heart-3-line', 'ri-heart-3-fill');
                        iTag.style.color = 'red';
                    }
                } else {
                    icon.classList.remove('show');
                    if(iTag) {
                        iTag.classList.replace('ri-heart-3-fill', 'ri-heart-3-line');
                        iTag.style.color = '';
                    }
                }
            });
        } catch (err) {
            console.error("Error loading wishlist:", err);
        }
    };

    window.wishlistAddToCart = async function(productId, quantity, price) {
        if (typeof addToCart === 'function') {
            const success = await addToCart(productId, quantity, price);
            if (success) {
                // Remove from wishlist automatically after successful cart addition
                await removeFromWishlist(productId);
            }
        }
    };

    function renderWishlistItems(items, container) {
        if (!items || items.length === 0) {
            container.innerHTML = `<div class="col-12 text-center py-5 w-100"><h4 class="text-muted">Your wishlist is empty.</h4></div>`;
            return;
        }

        container.innerHTML = items.map(item => {
            const p = item.product || item; 
            const id = p.productId || p._id || p.id;
            const img = p.image || p.images?.[0] || p.mainImage || '../assets/images/product/placeholder.png';
            const name = p.name || 'Product Name';
            const price = p.discountprice || p.discountPrice || p.price || 0;
            const originalPrice = p.price || 0;
            const brand = p.brandName || "";
            const imageSrc = img.startsWith('http') ? img : BASE_URL + (img.startsWith('/') ? img : '/' + img);

            return `
                <div class="col">
                    <div class="product-box-4-main">
                        <div class="select-option-box">
                            <div class="select-box">
                                <div>
                                    <div class="color-box">
                                        <h4 class="h5">Colors</h4>
                                        <ul class="color-list">
                                            <li><a href="#!" style="background-color:#f4c266;"></a></li>
                                            <li><a href="#!" style="background-color:#e7e597;"></a></li>
                                            <li><a href="#!" style="background-color:#6aa473;"></a></li>
                                        </ul>
                                    </div>
                                    <div class="size-box">
                                        <h4 class="h5">Sizes</h4>
                                        <ul class="size-list">
                                            <li><a href="#!">xs</a></li>
                                            <li><a href="#!">s</a></li>
                                            <li><a href="#!">m</a></li>
                                            <li><a href="#!">l</a></li>
                                            <li><a href="#!">xl</a></li>
                                        </ul>
                                    </div>
                                    <button class="btn add-cart-btn" onclick="wishlistAddToCart('${id}', 1, ${price})">add to cart</button>
                                    <button class="close-btn btn" onclick="closeSidebar()">
                                        <i class="ri-close-line"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="productMain product-box-4 pro-bg-white">
                            <div class="product-image">
                                <a href="product-detail.php?id=${id}">
                                    <img src="${imageSrc}" class="img-fluid productImage" alt="">
                                </a>
                                <div class="quick-view-button-box">
                                    <button class="btn view-btn quickViewBtn" onclick="openQuickView('${id}')">Quick View</button>
                                </div>
                            </div>
                            <div class="product-content">
                                <h5 class="sub-name productName">${brand}</h5>
                                <a href="product-detail.php?id=${id}" class="name">
                                    <h5>${name}</h5>
                                </a>
                                <ul class="rating">
                                    <li><i class="ri-star-fill fill"></i></li>
                                    <li><i class="ri-star-fill fill"></i></li>
                                    <li><i class="ri-star-fill fill"></i></li>
                                    <li><i class="ri-star-fill fill"></i></li>
                                    <li><i class="ri-star-fill fill"></i></li>
                                </ul>
                                <h5 class="price">₹${price} ${price < originalPrice ? `<del>₹${originalPrice}</del>` : ""}</h5>
                                <div class="option-box">
                                    <button class="btn select-btn" onclick="openOptions(this.closest('.col'), '${id}')">Select Options</button>
                                    <ul class="option-list">
                                        <li>
                                            <a class="wishlistProduct show" data-id="${id}" style="cursor:pointer">
                                                <i class="ri-heart-3-fill" style="color:red;"></i>
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
            `;
        }).join('');
    }

    function renderOffcanvasWishlistItems(items, container) {
        if (!items || items.length === 0) {
            container.innerHTML = `<li class="w-100 text-center py-4"><h5 class="text-muted">Your wishlist is empty.</h5></li>`;
            return;
        }

        container.innerHTML = items.map(item => {
            const p = item.product || item; 
            const id = p.productId || p._id || p.id;
            const img = p.image || p.images?.[0] || p.mainImage || '../assets/images/product/placeholder.png';
            const name = p.name || 'Product Name';
            const price = p.discountprice || p.discountPrice || p.price || 0;
            const originalPrice = p.price || 0;
            const imageSrc = img.startsWith('http') ? img : BASE_URL + (img.startsWith('/') ? img : '/' + img);

            return `
                <li>
                    <div class="vertical-product-box">
                        <a href="product-detail.php?id=${id}" class="product-image">
                            <img src="${imageSrc}" class="img-fluid" alt="${name}">
                        </a>
                        <div class="product-content">
                            <a href="product-detail.php?id=${id}">
                                <h5 class="name title-color">${name}</h5>
                            </a>
                            <h5 class="price">₹${price} ${originalPrice > price ? `<del>₹${originalPrice}</del>` : ''}</h5>
                            <button class="btn cart-btn" onclick="wishlistAddToCart('${id}', 1, ${price})" data-bs-target="#cartOffcanvas" data-bs-toggle="offcanvas">
                                <span>Move to cart</span>
                            </button>
                        </div>
                        <button class="btn wishlist-btn" onclick="removeFromWishlist('${id}')">
                            <i class="ri-delete-bin-line"></i>
                        </button>
                    </div>
                </li>
            `;
        }).join('');
    }

    window.removeFromWishlist = async function (productId) {
        const userToken = localStorage.getItem("userToken");
        if (!userToken) return;
        try {
            const response = await fetch(`${BASE_URL}/api/user/delete/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
            if (response.ok) loadWishlist(); // reload list and counts
        } catch (err) {
            console.error("Error removing from wishlist:", err);
        }
    };

    // Use event delegation so dynamically generated products also work
    document.addEventListener('click', async (e) => {
        const icon = e.target.closest('.wishlistProduct');
        if (!icon) return;
        
        e.preventDefault();

        const productId = icon.getAttribute('data-id');
        if (!productId) {
            console.warn("Product ID not found on this wishlist button.");
            return;
        }

        const userToken = localStorage.getItem("userToken");
        if (!userToken) {
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: "Login Required",
                    text: "Please login to add items to your wishlist.",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "Login",
                    cancelButtonText: "Cancel"
                }).then((result) => {
                    if (result.isConfirmed) {
                        const authModalEl = document.getElementById('authenticationModal');
                        if (authModalEl) {
                            const authModal = bootstrap.Modal.getOrCreateInstance(authModalEl);
                            authModal.show();
                        }
                    }
                });
            } else {
                alert("Please login to add to wishlist");
            }
            return;
        }

        // Check if we need to Add or Delete based on current UI state
        const isCurrentlyAdded = icon.classList.contains('show');
        const apiUrl = isCurrentlyAdded 
            ? `${BASE_URL}/api/user/delete/${productId}`
            : `${BASE_URL}/api/user/add/${productId}`;
        const apiMethod = isCurrentlyAdded ? 'DELETE' : 'POST';

        try {
            const response = await fetch(apiUrl, {
                method: apiMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userToken}`
                }
            });

            let data;
            if (!response.ok && apiMethod === 'POST' && (response.status === 405 || response.status === 404)) {
                const getResponse = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    }
                });
                data = await getResponse.json();
            } else {
                data = await response.json();
            }

            if ((response.ok || data.success) && !data.error) {
                // Toggle icon visual state
                const isAdded = !isCurrentlyAdded;
                icon.classList.toggle('show', isAdded);
                
                const iTag = icon.querySelector('i');
                if (iTag) {
                    if (isAdded) {
                        iTag.classList.replace('ri-heart-3-line', 'ri-heart-3-fill');
                        iTag.style.color = 'red';
                    } else {
                        iTag.classList.replace('ri-heart-3-fill', 'ri-heart-3-line');
                        iTag.style.color = '';
                    }
                }

                // Extract product info for popup
                const productBox = icon.closest('.productMain') || icon.closest('.product-box-4-main');
                const productImageEl = productBox ? productBox.querySelector('.productImage') : null;
                const productNameEl = productBox ? (productBox.querySelector('.productName') || productBox.querySelector('.name')) : null;

                const productImage = productImageEl ? (productImageEl.src || productImageEl.getAttribute('src')) : '../assets/images/product/placeholder.png';
                const productName = productNameEl ? productNameEl.textContent.trim() : 'Product';

                // Show sidebar alert popup
                showWishlistPopup(productImage, productName, isAdded, icon);

                // Re-fetch wishlist to update counts anywhere else on the page
                if (typeof loadWishlist === 'function') {
                    loadWishlist();
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire("Failed", data.message || "Could not update wishlist", "error");
                } else {
                    alert(data.message || "Could not update wishlist");
                }
            }
        } catch (err) {
            console.error("Wishlist API Error:", err);
        }
    });

    function showWishlistPopup(imgSrc, name, isAdded, iconNode) {
        const alertBox = document.getElementById('alertBox');
        const alertMessage = document.getElementById('alertMessage');
        const progressBar = document.getElementById('progressBar');
        const removeButton = alertBox ? alertBox.querySelector('.remove-wishlist') : null;

        if (!alertBox || !alertMessage || !progressBar) return;

        const message = isAdded ? 'Product added successfully' : 'Product removed successfully';

        alertMessage.innerHTML = `
            <h4>${message}</h4>
            <div class="alert-image d-flex align-items-center mt-2">
                <img src="${imgSrc}" alt="Product" class="img-fluid" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"/>
                <h5 class="ms-3 mb-0">${name}</h5>
            </div>
        `;

        alertBox.classList.toggle('added', isAdded);
        alertBox.classList.toggle('removed', !isAdded);

        alertBox.style.display = 'block';
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateY(-20px)';

        let opacity = 0;
        let translateY = -20;
        const fadeIn = setInterval(() => {
            if (opacity < 1) {
                opacity += 0.05;
                translateY += 1;
                alertBox.style.opacity = opacity.toFixed(2);
                alertBox.style.transform = `translateY(${translateY}px)`;
            } else {
                clearInterval(fadeIn);
            }
        }, 16);

        progressBar.offsetWidth; // Trigger reflow
        progressBar.style.animation = 'progressBarAnimation 2.5s linear forwards';

        clearTimeout(fadeOutTimeout);
        function startFadeOut() {
            fadeOutTimeout = setTimeout(() => {
                let opacityOut = 1;
                let translateOut = 0;
                const fadeOut = setInterval(() => {
                    if (opacityOut > 0) {
                        opacityOut -= 0.05;
                        translateOut -= 1;
                        alertBox.style.opacity = opacityOut.toFixed(2);
                        alertBox.style.transform = `translateY(${translateOut}px)`;
                    } else {
                        clearInterval(fadeOut);
                        alertBox.style.display = 'none';
                    }
                }, 16);
            }, 2500);
        }

        startFadeOut();

        alertBox.onmouseenter = () => clearTimeout(fadeOutTimeout);
        alertBox.onmouseleave = startFadeOut;

        if (removeButton) {
            removeButton.textContent = isAdded ? 'Remove Wishlist' : 'Add to Wishlist';
            removeButton.onclick = () => {
                alertBox.style.display = 'none';
                if (iconNode) iconNode.click(); // Quick revert by triggering the icon again
            };
        }
    }

    // Hide the notification early if they decide to add to cart directly from it
    const addCartButton = document.querySelector('.alert-box .add-cart-btn');
    if (addCartButton) {
        addCartButton.addEventListener('click', () => {
            const alertBox = document.getElementById('alertBox');
            if (alertBox) {
                alertBox.style.display = 'none';
            }
        });
    }
    
    // Load the wishlist and update the badge counts the moment the DOM loads
    loadWishlist();
});
