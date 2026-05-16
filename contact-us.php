<?php include 'header.php'; ?>


    <!-- Breadcrumb Section Start -->
    <section class="breadcrumb-section">
        <div class="custom-container">
            <div class="breadcrumb-contain">
                <h2>Contact us</h2>
                <nav>
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="index">
                                <i class="ri-home-3-fill"></i>
                            </a>
                        </li>
                        <li class="breadcrumb-item active">Contact</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- Contact Box Section Start -->
    <div class="contact-section section-t-space">
        <div class="custom-container">
            <div class="contact-main-box">
                <div class="row g-sm-4 g-3">
                    <div class="col-xxl-3 col-lg-4 col-md-5">
                        <div class="contact-wrapper">
                            <h3>Contact us</h3>
                            <p class="contact-desc">
                                Have any questions or need assistance? Our team is here to help! Reach out to us
                                anytime, and we'll get back to you ASAP.
                            </p>
                            <p>support@hyperscripts.com</p>
                            <p>520-245-2465</p>
                            <h2 class="contact-title">CONTACT</h2>
                        </div>
                    </div>
                    <div class="col-xxl-9 col-lg-8 col-md-7">
                        <form class="contact-right-box" id="contactEnquiryForm" novalidate>
                            <h3>TALK WIH US</h3>
                            <p><span>"</span><span class="txt-danger-color">&nbsp;*&nbsp;</span><span>"</span><span
                                    class="ps-1">indicates required fields</span></p>
                            <div class="row g-md-4 g-3">
                                <div class="col-12 theme-form">
                                    <label for="contactUsName" class="form-label">Name
                                        <span class="txt-danger-color">*</span>
                                    </label>
                                    <input type="text" class="form-control" id="contactUsName" placeholder="First name" required>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-6 theme-form">
                                    <label for="contactUsEmail" class="form-label">Email
                                        <span class="txt-danger-color">*</span>
                                    </label>
                                    <input type="email" class="form-control" id="contactUsEmail"
                                        placeholder="example@domain.com" required>
                                </div>
                                <div class="col-lg-6 col-md-12 col-sm-6 theme-form">
                                    <label for="contactUsPhone" class="form-label">Phone
                                        <span class="txt-danger-color">*</span>
                                    </label>
                                    <input type="tel" class="form-control" id="contactUsPhone"
                                        placeholder="Phone number" required>
                                </div>
                                <div class="col-12 theme-form">
                                    <label class="form-label">Select a topic
                                        <span class="txt-danger-color">*</span>
                                    </label>
                                    <select class="form-select" id="contactUsTopic" required>
                                        <option value="" disabled selected>Select a topic</option>
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Order Support">Order Support</option>
                                        <option value="Product Question">Product Question</option>
                                        <option value="Returns & Refunds">Returns & Refunds</option>
                                        <option value="Partnership">Partnership</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div class="col-12 theme-form">
                                    <label for="contactUsHelpMessage" class="form-label">How can we help?
                                        <span class="txt-danger-color">*</span>
                                    </label>
                                    <textarea class="form-control" rows="12" id="contactUsHelpMessage"
                                        placeholder="Description" required></textarea>
                                </div>
                                <div class="col-auto">
                                    <button type="submit" class="btn theme-bg-color text-white">Send message</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Contact Box Section End -->

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

    <script src="assets/js/userJs/contact-enquiry.js?v=1"></script>
    <?php include 'footer.php'; ?>
