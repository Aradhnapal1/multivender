<?php include 'header.php'; ?>

<!-- Breadcrumb Section Start -->
<section class="breadcrumb-section">
    <div class="custom-container">
        <div class="breadcrumb-contain">
            <h2>Order Tracking</h2>
            <nav>
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <a href="index.html">
                            <i class="ri-home-3-fill"></i>
                        </a>
                    </li>
                    <li class="breadcrumb-item active">Order</li>
                    <li class="breadcrumb-item active">Order tracking</li>
                </ol>
            </nav>
        </div>
    </div>
</section>
<!-- Breadcrumb Section End -->

<!-- Order Tracking Section Start -->
<section class="tracking-section section-t-space">
    <div class="custom-container">

        <!-- Order Header -->
        <div class="tracking-order-number">
            <h3>
                Order <span id="orderNumber">#----</span>
                <span class="badge" id="paymentBadge">----</span>
            </h3>
            <h4 id="orderDate">----</h4>
        </div>

        <div class="row g-md-4 g-3 tracking-row">

            <!-- LEFT: Products -->
            <div class="col-xl-8 col-lg-7">
                <div class="tacking-left-box">
                    <div class="order-title border-0">
                        <h4>Product Details</h4>
                    </div>

                    <div class="order-tracking-table">
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody id="productTableBody">
                                    <!-- JS will inject rows here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- RIGHT: Details + Summary -->
            <div class="col-xl-4 col-lg-5">
                <div class="tracking-right-box">

                    <!-- Order Details -->
                    <div class="order-details">
                        <div class="order-title">
                            <h4>Details</h4>
                        </div>

                        <ul class="order-details-box">
                            <li>
                                <i class="iconsax" data-icon-name="mail"></i>
                                <h5 id="customerEmail">----</h5>
                            </li>
                            <li>
                                <i class="iconsax" data-icon-name="calendar-1"></i>
                                <h5 id="orderDateSmall">----</h5>
                            </li>
                            <li>
                                <i class="iconsax" data-icon-name="hashtag"></i>
                                <h5 id="orderIdSmall">----</h5>
                            </li>
                        </ul>

                        <!-- <button class="btn proceed-btn">Invoice PDF</button> -->
                        <button id="downloadInvoice" class="btn proceed-btn">Invoice PDF</button>
                         
                         

                        <ul class="address-list">
                            <li class="address-box">
                                <h5>Billing Address:</h5>
                                <p id="billingAddress">----</p>
                                <p id="billingPhone">----</p>
                            </li>
                            <li class="address-box">
                                <h5>Shipping Address:</h5>
                                <p id="shippingAddress">----</p>
                                <p id="shippingPhone">----</p>
                            </li>
                        </ul>
                    </div>

                    <!-- Payment Summary -->
                    <div class="payment-details mt-4">
                        <div class="order-title">
                            <h4>Payment summary</h4>
                        </div>

                        <ul class="payment-summary">
                            <li>
                                <h4>Subtotal <span id="itemCount">(0 items)</span></h4>
                                <h5 id="subTotalAmount">₹0</h5>
                            </li>
                            <!-- <li>
                                <h4>Delivery <span id="deliveryAmount">₹0</span></h4>
                            </li>
                            <li>
                                <h4>Tax <span>Included</span></h4>
                                <h5>₹0</h5>
                            </li> -->
                        </ul>

                        <div class="total-price">
                            <p>Total paid by customer</p>
                            <span id="totalPaid">₹0</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</section>
<!-- Order Tracking Section End -->

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


<?php include 'footer.php'; ?>