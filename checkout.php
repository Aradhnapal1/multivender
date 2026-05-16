<?php include 'header.php'; ?>


<!-- Breadcrumb Section Start -->
<section class="breadcrumb-section">
    <div class="custom-container">
        <div class="breadcrumb-contain">
            <h2>Checkout</h2>
            <nav>
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item">
                        <a href="index">
                            <i class="ri-home-3-fill"></i>
                        </a>
                    </li>
                    <li class="breadcrumb-item active">Checkout</li>
                </ol>
            </nav>
        </div>
    </div>
</section>
<!-- Breadcrumb Section End -->

<!-- Return login section start -->
<section class="return-login-section section-t-space">
    <div class="custom-container">
        <div class="return-box" id="returnLoginBox">
            <h3>Returning customer?</h3>
            <button class="btn" data-bs-toggle="modal" data-bs-target="#authenticationModal">Click here to
                Login</button>
        </div>
    </div>
</section>
<!-- Return login section end -->

<!-- Checkout Section Start -->
<section class="checkout-section-new section-t-space">
    <div class="custom-container">
        <div class="row g-sm-4 g-3">
            <div class="col-xl-7 col-lg-6">
                <div class="checkout-left-box">
                    <div class="billing-box checkbox-bg-color">
                        <div class="checkout-title">
                            <h4>Billing details</h4>
                        </div>

                        <form class="row g-sm-4 g-3 needs-validation theme-form" novalidate id="checkoutAddressForm">

                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="fullName" class="form-label">Full Name <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="fullName" placeholder="Enter your full name"
                                    required>
                                <div class="invalid-feedback" id="fullNameError"></div>
                            </div>

                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="phoneNumber" class="form-label">Phone Number <span
                                        class="text-danger">*</span></label>
                                <input type="tel" class="form-control" id="phoneNumber" placeholder="9876543210"
                                    maxlength="10" required>
                                <div class="invalid-feedback" id="phoneNumberError"></div>
                            </div>

                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="city" class="form-label">City <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="city" placeholder="Enter city" required>
                                <div class="invalid-feedback" id="cityError"></div>
                            </div>

                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="state" class="form-label">State / Province <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="state" placeholder="Enter state" required>
                                <div class="invalid-feedback" id="stateError"></div>
                            </div>

                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="postalCode" class="form-label">ZIP / Postal Code <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="postalCode" placeholder="560001"
                                    maxlength="6" required>
                                <div class="invalid-feedback" id="postalCodeError"></div>
                            </div>

                            <!-- Country Dropdown -->
                            <div class="col-xl-6 col-lg-12 col-sm-6">
                                <label for="country" class="form-label">Country <span
                                        class="text-danger">*</span></label>
                                <select class="form-select" id="country" required>
                                    <option value="">Select Country</option>
                                    <option value="India" selected>India</option>
                                    <option value="United States">United States</option>
                                    <option value="United Kingdom">United Kingdom</option>
                                    <option value="Canada">Canada</option>
                                    <option value="Australia">Australia</option>
                                    <option value="Germany">Germany</option>
                                    <option value="France">France</option>
                                    <option value="Japan">Japan</option>
                                    <option value="China">China</option>
                                </select>
                                <div class="invalid-feedback" id="countryError"></div>
                            </div>

                            <!-- Address Type -->
                            <div class="col-12">
                                <label for="addressType" class="form-label">Address Type <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="addressType"
                                    placeholder="Home / Office / Work / Other" value="Home" required>
                                <div class="invalid-feedback" id="addressTypeError"></div>
                            </div>

                            <div class="col-12">
                                <label for="addressLine1" class="form-label">Street Address <span
                                        class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="addressLine1"
                                    placeholder="House no, Street name" required>
                                <div class="invalid-feedback" id="addressLine1Error"></div>
                            </div>

                            <div class="col-12">
                                <label for="addressLine2" class="form-label">Apartment / Landmark (Optional)</label>
                                <input type="text" class="form-control" id="addressLine2"
                                    placeholder="Near Metro Station, etc.">
                            </div>

                            <!-- Save Button -->
                            <div class="col-12 mt-4">
                                <button type="button" id="saveAddressBtn"
                                    class="btn theme-bg-color text-white rounded-pill w-100 py-3 fw-bold">
                                    Save Address
                                </button>
                            </div>

                        </form>
                        <div class="checkout-title mt-4">
                            <h4>Saved Addresses</h4>
                        </div>
                        <div class="accordion checkout-payment-accordion mb-4" id="savedAddressAccordion">
                            <!-- Addresses will be loaded dynamically -->
                            <div id="addressListContainer">
                                <!-- Loading -->
                                <div class="text-center py-4" id="addressLoading">
                                    <div class="spinner-border text-primary" role="status"></div>
                                    <p class="mt-2 mb-0">Loading saved addresses...</p>
                                </div>
                            </div>
                        </div>

                        <!-- Add New Address Button -->
                        <div class="mt-3">
                            <button class="btn btn-outline-success w-100" data-bs-toggle="modal"
                                data-bs-target="#addAddressModal">
                                <i class="ri-add-line"></i> Add New Address
                            </button>
                        </div>


                    </div>
                </div>
            </div>
            <div class="col-xl-5 col-lg-6">
                <div class="checkout-right-box checkbox-bg-color">
                    <div class="checkout-title">
                        <h4>Your order</h4>
                    </div>
                    <div class="table-responsive">
                        <table class="table order-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody id="checkoutProduct">
                                <tr>
                                    <td>
                                        <div class="checkout-product-box">
                                            <a href="product-circle.html" class="product-image">
                                                <img src="../assets/images/product/30.png" class="img-fluid" alt="">
                                            </a>
                                            <div class="product-contain">
                                                <a href="product-color.html">
                                                    <h5>Canon EOS 1500D DSLR Camera Body + 18-55 mm <span>x2</span>
                                                    </h5>
                                                </a>
                                                <ul class="product-category-list">
                                                    <li>Brand: <span>Canon</span></li>
                                                    <li>Color: <span>Starlight</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>$152.36</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkout-product-box">
                                            <a href="product-circle.html" class="product-image">
                                                <img src="../assets/images/product/24.png" class="img-fluid" alt="">
                                            </a>
                                            <div class="product-contain">
                                                <a href="product-color.html">
                                                    <h5>Refurb macbook air space gray m1 202009 <span>x1</span></h5>
                                                </a>
                                                <ul class="product-category-list">
                                                    <li>Brand: <span>Apple</span></li>
                                                    <li>Storage: <span>1TB</span></li>
                                                    <li>Color: <span>Dark Gray</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>$32.45</td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="checkout-product-box">
                                            <a href="product-circle.html" class="product-image">
                                                <img src="../assets/images/product/26.png" class="img-fluid" alt="">
                                            </a>
                                            <div class="product-contain">
                                                <a href="product-color.html">
                                                    <h5>EvoFox Game Box 32 GB with Asphalt 8 <span>x4</span></h5>
                                                </a>
                                                <ul class="product-category-list">
                                                    <li>Brand: <span>EvoFox</span></li>
                                                    <li>Color: <span>Light Gray</span></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                    <td>$1025.35</td>
                                </tr>
                                <tr class="price-tb">
                                    <td>Subtotal</td>
                                    <td id="subtotalAmount">$1210.16</td>
                                </tr>
                                <tr class="price-tb">
                                    <td>Tax</td>
                                    <td id="discountAmount">$0.00</td>
                                </tr>
                                <tr class="price-tb">
                                    <td>Total</td>
                                    <td id="totalAmount">$1210.16</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="accordion checkout-payment-accordion section-t-space-2" id="paymentAccordion">

                        <!-- 1. Cash on Delivery (COD) -->
                        <div class="accordion-item">
                            <div class="accordion-header" data-bs-toggle="collapse" data-bs-target="#collapseCOD">
                                <div class="form-check">
                                    <input class="form-check-input" name="paymentMethod" type="radio" id="cod" checked>
                                    <label class="form-check-label" for="cod">
                                        <span class="circle"></span>
                                        Cash on Delivery (COD)
                                    </label>
                                </div>
                            </div>
                            <div id="collapseCOD" class="accordion-collapse collapse show"
                                data-bs-parent="#paymentAccordion">
                                <div class="accordion-body">
                                    <p class="mb-0">
                                        <i class="ri-check-line text-success"></i>
                                        Pay cash when your order is delivered.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- 2. Razorpay -->
                        <div class="accordion-item">
                            <div class="accordion-header collapsed" data-bs-toggle="collapse"
                                data-bs-target="#collapseRazorpay">
                                <div class="form-check">
                                    <input class="form-check-input" name="paymentMethod" type="radio" id="razorpay">
                                    <label class="form-check-label" for="razorpay">
                                        <span class="circle"></span>
                                        Pay with Razorpay 
                                    </label>
                                </div>
                            </div>
                            <div id="collapseRazorpay" class="accordion-collapse collapse"
                                data-bs-parent="#paymentAccordion">
                                <div class="accordion-body">
                                    <p class="mb-0">
                                        <i class="ri-check-line text-success"></i>
                                        Secure payment via Razorpay. Supports all major payment methods.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="section-t-space-2">
                        <div class="checkout-information">
                            <p>Your personal data will be used to process your order, support your experience
                                throughout this website, and for other purposes described in our <a href="#!">privacy
                                    policy</a>.</p>
                            <div class="form-check theme-checkbox">
                                <input class="form-check-input checkbox_animated" type="checkbox" name="information"
                                    id="details">
                                <label class="form-check-label" for="details">I Have Read And Agree To The Website
                                    Terms And Conditions <span>*</span></label>
                            </div>
                        </div>
                    </div>

                    <div class="section-t-space-2">
                        <button id="placeOrderBtn" class="btn theme-bg-color text-white rounded-pill w-100">Place
                            Order</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- Checkout Section End -->



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
<script>
    document.addEventListener("DOMContentLoaded", function () {
        var returnLoginBox = document.getElementById("returnLoginBox");
        var userToken = localStorage.getItem("userToken");
        if (returnLoginBox && userToken) {
            returnLoginBox.style.display = "none";
        }
    });
</script>
<!-- <script src="assets/js/userJs/checkout.js"></script> -->