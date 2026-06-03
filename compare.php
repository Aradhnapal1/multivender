
<?php include 'header.php'; ?>

    <!-- Breadcrumb Section Start -->
    <section class="breadcrumb-section">
        <div class="custom-container">
            <div class="breadcrumb-contain">
                <h2>Compare</h2>
                <nav>
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="index.php">
                                <i class="ri-home-3-fill"></i>
                            </a>
                        </li>
                        <li class="breadcrumb-item active">Compare</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- Compare Section Start -->
    <section class="compare-section section-t-space">
        <div class="custom-container">
            <!-- Products fetched from /api/compare/list rendered by compare-notify.js -->
            <div id="compareContainer">
                <div class="text-center py-5">
                    <div class="spinner-border text-primary" role="status" aria-hidden="true"></div>
                    <p class="mt-3 text-muted">Loading your compare list...</p>
                </div>
            </div>
        </div>
    </section>
    <!-- Compare Section End -->

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

    <!-- Re-render on every visit, not just first page load, so back/forward works. -->
    <script>
      (function () {
        function kick() { if (typeof window.loadCompare === 'function') window.loadCompare(); }
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', kick);
        } else {
          kick();
        }
      })();
    </script>
    <?php include 'footer.php'; ?>
