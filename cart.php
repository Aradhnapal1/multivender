
<?php include 'header.php'; ?>

    <!-- Breadcrumb Section Start -->
    <section class="breadcrumb-section">
        <div class="custom-container">
            <div class="breadcrumb-contain">
                <h2>Shopping Cart</h2>
                <nav>
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="index">
                                <i class="ri-home-3-fill"></i>
                            </a>
                        </li>
                        <li class="breadcrumb-item active">Cart</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- Cart Section Start -->
    <section class="section-t-space cart-section">
        <div class="custom-container">
            <div class="quick-box">
                <p><i class="ri-error-warning-line"></i> There is a limit on these things, so please check out
                    quickly! Someone else has already ordered the identical products.</p>
                <ul class="quick-timer" id="quickClock">
                    <li class="counter">
                        <span class="minutes"></span>
                    </li>
                    <li class="counter">
                        <span class="seconds"></span>
                    </li>
                </ul>
            </div>
            <div class="row g-sm-4 g-3">
                <div class="col-xxl-9 col-xl-8 col-lg-7">
                    <div class="cart-table2">
                        <div class="table-title">
                            <h2 id="cartCount">Cart <span>(0)</span></h2>
                            <button type="button" class="clear-btn btn" id="cartPageClearBtn">
                                <span>Clear All</span>
                            </button>
                        </div>
                        <div class="table-responsive">
                            <table class="table cart-table-box">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                       <th style="text-align: center;">Quantity</th>
                                        <th>Action</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody id="cartTableBody">
                                    <tr class="table-row">
                                        <td>
                                            <div class="cart-box">
                                                <div class="cart-image">
                                                    <a href="product-color.html">
                                                        <img src="../assets/images/product/1.png" class="img-fluid"
                                                            alt="">
                                                    </a>
                                                    <i class="ri-heart-3-line"></i>
                                                    <i class="ri-heart-3-fill"></i>
                                                </div>
                                                <div class="cart-contain">
                                                    <a href="product-color.html">
                                                        <h3>Apple Watch Series 3</h3>
                                                    </a>
                                                    <span>Watch</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <h3 class="price">$202.34<del class="del-price">$300.45</del></h3>
                                        </td>
                                        <td>
                                            <div class="quantity-box qty-container quantity-box-2">
                                                <button class="btn qty-btn-minus">
                                                    <i class="ri-subtract-line"></i>
                                                </button>
                                                <input type="number" name="qty" disabled
                                                    class="quantity form-control input-qty" value="1">
                                                <button class="btn qty-btn-plus">
                                                    <i class="ri-add-line"></i>
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <button class="remove-row btn">
                                                <i class="ri-delete-bin-7-line"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <h4 class="h5">$202.34</h4>
                                        </td>
                                    </tr>
                                   
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-xxl-3 col-xl-4 col-lg-5">
                    <div class="right-summery-box">
                        <div class="summery-box">
                            <div class="summery-header">
                                <h3>Cart Total</h3>
                            </div>

                            <div class="summery-contain">
                                <ul>
                                    <li>
                                        <h4>Subtotal</h4>
                                        <h4 class="price">$125.65</h4>
                                    </li>

                                    <li>
                                        <h4>Coupon Discount</h4>
                                        <h4 class="price">(-) 0.00</h4>
                                    </li>

                                    <!-- <li>
                                        <h4>Shipping</h4>
                                        <h4 class="price text-end">$6.90</h4>
                                    </li> -->
                                    <li>
                                        <div class="accordion promo-code-accordion" id="accordionExample">
                                            <div class="accordion-item">
                                                <h2 class="accordion-header">
                                                    <button class="accordion-button" type="button"
                                                        data-bs-toggle="collapse" data-bs-target="#collapseOne">Add
                                                        promo code</button>
                                                </h2>
                                                <div id="collapseOne" class="accordion-collapse collapse show"
                                                    data-bs-parent="#accordionExample">
                                                    <div class="accordion-body">
                                                        <form onsubmit="return false;">
                                                            <div class="input-group">
                                                                <input type="text" class="form-control" id="couponCodeInput"
                                                                    placeholder="Apply code" />
                                                                <button class="input-group-text" type="button"
                                                                    id="applyCouponBtn">Apply</button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <ul class="summery-total">
                                <li class="list-total border-top-0">
                                    <h3 class="h4">Total (USD)</h3>
                                    <h4 class="price theme-color">$132.55</h4>
                                </li>
                            </ul>
                            <button type="button" id="proceedToCheckoutBtn" class="btn proceed-btn">Proceed to
                                checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- Cart Section End -->

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
                                <use xlink:href="https://themes.pixelstrap.net/kartify/assets/images/newsletter/newsletter-icon.svg#newsletter"></use>
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

   
    <?php include 'footer.php'; ?>
