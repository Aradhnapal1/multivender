<!DOCTYPE html>
<html lang="en">

<!-- Mirrored from themes.getappui.com/techui/layouts/index.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 03 Feb 2026 07:40:06 GMT -->

<head>
    <meta charset="utf-8" />
    <title>Multivender</title>
    <script src="../assets/js/media-url.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Performance: warm up API connection so first fetch is fast -->
    <link rel="preconnect" href="https://api.workarya.com" crossorigin>
    <link rel="dns-prefetch" href="https://api.workarya.com">
    <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
    <meta content="GetAppui" name="author" />

    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/favicon.webp">
    <script src="js/login.js"></script>
    <script src="js/color.js"></script>
    <script src="js/size.js"></script>
    <script src="./js/catugery.js"></script>
    <script src="./js/brand.js"></script>
    <script src="./js/vender-detail.js"></script>
    <script src="./js/product.js?v=12"></script>
    <script src="./js/pincode.js"></script>
    <script src="./js/coupon.js"></script>
    <script src="./js/all-article.js"></script>
    <script src="./js/order.js?v=2"></script>
    <script src="./js/dashboard.js?v=5"></script>
    <style id="vendor-status-styles"></style>
    <script>
        // Check if the vendor is logged in; if no token, redirect to login page
        const token = localStorage.getItem("vendorToken");
        const rawCurrentPage = window.location.pathname.split("/").pop().toLowerCase();
        function normalizePage(page) {
            return (page || "").toLowerCase().replace(/\.php$/, "");
        }
        const currentPage = normalizePage(rawCurrentPage);
        const publicPages = [
            "login",
            "auth-login",
            "auth-register",
            "auth-forgotpw",
            "auth-lock-screen",
            "auth-logout",
            "logout"
        ];
        if (!token) {
            if (!publicPages.includes(currentPage)) {
                window.location.href = "login.php";
            }
        } else {
            try {
                // Decode JWT Payload safely
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(atob(base64));
                
                // Hide non-essential menus if status is not 'approved'
                if (payload.Status !== 'approved') {
                    document.getElementById('vendor-status-styles').innerHTML = `
                        #menu-dashboard,
                        #menu-ecommerce,
                        #menu-order,
                        #menu-pincode,
                        #menu-blogs,
                        #menu-enqueries,
                        #menu-rating,
                        #menu-invoice {
                            display: none !important;
                        }
                    `;
                }

                // Set user name and initials dynamically when DOM is ready
                document.addEventListener("DOMContentLoaded", function() {
                    const firstName = payload.FirstName || payload.firstName || payload.name || "Vendor";
                    const lastName = payload.LastName || payload.lastName || "";
                    const fullName = `${firstName} ${lastName}`.trim();
                    const initials = (firstName.charAt(0) + (lastName.charAt(0) || "")).toUpperCase();

                    const vendorNameEl = document.getElementById("vendor-name");
                    if (vendorNameEl) {
                        vendorNameEl.innerHTML = `${fullName} <i class="mdi mdi-chevron-down"></i>`;
                    }

                    const vendorAvatarEl = document.getElementById("vendor-avatar");
                    if (vendorAvatarEl) {
                        vendorAvatarEl.innerText = initials;
                    }
                });
            } catch (e) {
                console.error("Error decoding token:", e);
            }
        }
    </script>


    <!-- Theme Config Js -->


    <!-- Font Family -->
    <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&amp;display=swap" rel="stylesheet">
    <script type="module" crossorigin src="assets/app-22784e3d.js"></script>
    <script type="module" crossorigin src="assets/apexcharts.common-a0fc19b4.js"></script>
    <script type="module" crossorigin src="assets/world-7ff4c208.js"></script>
    <script type="module" crossorigin src="assets/dashboard.init-69152f8b.js"></script>
    <link rel="stylesheet" href="assets/app-0f19a312.css">
    <link rel="stylesheet" href="assets/world-bcd2ab8c.css">
    <link rel="stylesheet" href="https://cdn.materialdesignicons.com/7.4.47/css/materialdesignicons.min.css">
    <script src="https://unpkg.com/feather-icons"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

    <!-- Font Family -->
    <script type="module" crossorigin src="assets/quill.snow-71ebf701.js"></script>
    <script type="module" crossorigin src="assets/dropify.min-7eced412.js"></script>
    <script type="module" crossorigin src="assets/product-create.init-c3b189cb.js"></script>
    <link rel="stylesheet" href="assets/app-0f19a312.css">
    <link rel="stylesheet" href="assets/quill-fe58e407.css">
    <link rel="stylesheet" href="assets/dropify-1a8a5c67.css">
    


</head>

<body>

    <?php include __DIR__ . '/../preloader.php'; ?>

    <!-- Begin page -->
    <div class="app-wrapper">

        <div class="app-sidenav">

            <!-- Brand Logo -->
            <div class="logo-box">
                <!-- Brand Logo Light -->
                <a href="index.php" class="logo-light">
                    <img src="assets/logo.png" alt="logo" class="logo-lg">

                </a>

                <!-- Brand Logo Dark -->
                <a href="index.php" class="logo-dark">
                    <img src="assets/logo.png" alt="dark logo" class="logo-lg">

                </a>
            </div>

            <!--- Menu -->
            <div class="h-100" data-simplebar>
                <ul class="menu">

                    <!-- <li class="menu-title">Navigation</li> -->

                    <li class="menu-item" id="menu-dashboard">
                        <a href="index.php" class="menu-link">
                            <span class="menu-icon"><i data-feather="home"></i></span>
                            <span class="menu-text"> Dashboard </span>
                            <!-- <span class="badge bg-success rounded ms-auto">01</span> -->
                        </a>
                    </li>

                    <!-- <li class="menu-title">Apps</li> -->



                    <li class="menu-item" id="menu-ecommerce">
                        <a href="#ecommerce" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="shopping-cart"></i></span>
                            <span class="menu-text"> Ecommerce </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="ecommerce">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="product.php" class="menu-link">
                                        <span class="menu-text">Products</span>
                                    </a>
                                </li>

                                <!-- <li class="menu-item">
                                    <a href="product-create.php" class="menu-link">
                                        <span class="menu-text">Product Create</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="product-edit.php" class="menu-link">
                                        <span class="menu-text">Product Edit</span>
                                    </a>
                                </li> -->
                                <!-- <li class="menu-item">
                                    <a href="apps-ecommerce-products-details.html" class="menu-link">
                                        <span class="menu-text">Product Details</span>
                                    </a>
                                </li> -->


                                <li class="menu-item">
                                    <a href="brand.php" class="menu-link">
                                        <span class="menu-text">Brand</span>
                                    </a>
                                </li>

                               
                                <li class="menu-item">
                                    <a href="category.php" class="menu-link">
                                        <span class="menu-text"> Category</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="color.php" class="menu-link">
                                        <span class="menu-text"> Color</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="size.php" class="menu-link">
                                        <span class="menu-text"> Sizes</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="coupon.php" class="menu-link">
                                        <span class="menu-text"> Coupons</span>
                                    </a>
                                </li>


                            </ul>
                        </div>
                    </li>




                    <li class="menu-item" id="menu-order">
                        <a href="#order" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="shopping-bag"></i> </span>
                            <span class="menu-text"> Order </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="order">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="order.php" class="menu-link">
                                        <span class="menu-text">Order</span>
                                    </a>
                                </li>
                               
                            </ul>
                        </div>
                    </li>
                    <li class="menu-item" id="menu-pincode">
                        <a href="#pincode" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="map-pin"></i> </span>
                            <span class="menu-text">All Pincode </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="pincode">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="pincode.php" class="menu-link">
                                        <span class="menu-text"> Pincode</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </li>
                    <li class="menu-item" id="menu-blogs">
                        <a href="#blogs" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="clipboard"></i> </span>
                            <span class="menu-text">Blogs </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="blogs">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="all-blogs.php" class="menu-link">
                                        <span class="menu-text"> All Blogs</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="all-article.php" class="menu-link">
                                        <span class="menu-text"> All Articles</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>

                    <li class="menu-item" id="menu-enqueries">
                        <a href="#enqueries" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="help-circle"></i> </span>
                            <span class="menu-text"> Enqueries </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="enqueries">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="all-enquery.php" class="menu-link">
                                        <span class="menu-text">All Enquery</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="bulk-enquery.php" class="menu-link">
                                        <span class="menu-text">Bulk Enquery</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="all-career.php" class="menu-link">
                                        <span class="menu-text">All Career</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="apps-invoice.php" class="menu-link">
                                        <span class="menu-text">All Newsletter</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>


                    <li class="menu-item" id="menu-rating">
                        <a href="#rating" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="star"></i> </span>
                            <span class="menu-text"> Rating Management </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="rating">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="rating.php" class="menu-link">
                                        <span class="menu-text">Product Reviews</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </li>
                    <li class="menu-item" id="menu-invoice">
                        <a href="#invoice" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="file-text"></i></span>
                            <span class="menu-text"> Invoice </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="invoice">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="apps-invoice-report.php" class="menu-link">
                                        <span class="menu-text">Invoice Report</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="apps-invoice.php" class="menu-link">
                                        <span class="menu-text">Invoice</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>


                    <!-- <li class="menu-title">Pages</li> -->
                    <li class="menu-item">
                        <a href="index.php" class="menu-link">
                            <span class="menu-text">Dashboard</span>
                        </a>
                    </li>
                    <li class="menu-item">
                        
                        <a href="#menuExpages" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="book"></i></span>
                            <span class="menu-text"> Profile </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="menuExpages">
                            <ul class="sub-menu">
                                
                                <li class="menu-item">
                                    <a href="profile.php" class="menu-link">
                                        <span class="menu-text">Profile</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="personal-details.php" class="menu-link">
                                        <span class="menu-text">Personal Details</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="business-profile.php" class="menu-link">
                                        <span class="menu-text">Business Profile</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="bank-details.php" class="menu-link">
                                        <span class="menu-text">Bank Details</span>
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </li>

                    <li class="menu-item">
                        <a href="#authPages" data-bs-toggle="collapse" class="menu-link">
                            <span class="menu-icon"><i data-feather="users"></i></span>
                            <span class="menu-text"> Auth Pages </span>
                            <span class="menu-arrow"></span>
                        </a>
                        <div class="collapse" id="authPages">
                            <ul class="sub-menu">
                                <li class="menu-item">
                                    <a href="login.php" class="menu-link">
                                        <span class="menu-text">Sign In</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="auth-register.php" class="menu-link">
                                        <span class="menu-text">Sign Up</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="auth-forgotpw.php" class="menu-link">
                                        <span class="menu-text">Forgot Password</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="auth-lock-screen.php" class="menu-link">
                                        <span class="menu-text">Lock Screen</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>




                </ul>
                <!--- End Menu -->
                <div class="clearfix"></div>
            </div>
        </div>
        <!-- ========== Left menu End ========== -->
        <!-- ============================================================== -->
        <!-- Start Page Content here -->
        <!-- ============================================================== -->

        <div class="content-page">

            <!-- ========== Topbar Start ========== -->
            <div class="navbar-custom">
                <div class="topbar px-2">
                    <div class="topbar-menu d-flex align-items-center gap-lg-2 gap-1">

                        <!-- Topbar Brand Logo -->
                        <div class="logo-box">
                            <!-- Brand Logo Light -->
                            <a href="index.html" class="logo-light">
                                <img src="assets/logo-light-e9fb2c1a.png" alt="logo" class="logo-lg">
                                <img src="data:image/png;base64,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"
                                    alt="small logo" class="logo-sm">
                            </a>

                            <!-- Brand Logo Dark -->
                            <a href="index.html" class="logo-dark">
                                <img src="assets/logo-dark-3d833aea.png" alt="dark logo" class="logo-lg">
                                <img src="data:image/png;base64,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"
                                    alt="small logo" class="logo-sm">
                            </a>
                        </div>

                        <!-- Sidebar Menu Toggle Button -->
                        <button class="button-toggle-menu">
                            <i class="mdi mdi-menu"></i>
                        </button>

                        <!-- Topbar Search Form -->
                        <li class="app-search dropdown d-none d-lg-block">
                            <form>
                                <input type="search" class="form-control" placeholder="Search...">
                                <span class="mdi mdi-magnify search-icon font-22"></span>
                            </form>
                        </li>
                    </div>

                    <ul class="topbar-menu d-flex align-items-center gap-3">

                        <li class="d-none d-md-inline-block">
                            <a class="nav-link" href="#" data-toggle="fullscreen">
                                <i data-feather="maximize" class="font-22"></i>
                            </a>
                        </li>

                        <li class="dropdown d-lg-none">
                            <a class="nav-link dropdown-toggle waves-effect waves-light arrow-none"
                                data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                                aria-expanded="false">
                                <i class="ri-search-line font-22"></i>
                            </a>
                            <div class="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
                                <form class="p-3">
                                    <input type="search" class="form-control" placeholder="Search ..."
                                        aria-label="Recipient's username">
                                </form>
                            </div>
                        </li>



                        <li class="d-inline-flex">
                            <div class="nav-link" id="light-dark-mode">
                                <i data-feather="moon" class="font-22"></i>
                            </div>
                        </li>

                        <li>
                            <a class="nav-link waves-effect waves-light" data-bs-toggle="offcanvas"
                                href="#theme-settings-offcanvas">
                                <i data-feather="settings" class="font-22"></i>
                            </a>
                        </li>

                        <li class="dropdown">
                            <a class="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
                                data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="false"
                                aria-expanded="false">
                                <div id="vendor-avatar" class="rounded-circle d-inline-flex align-items-center justify-content-center bg-dark text-white font-16" style="width: 32px; height: 32px; font-weight: bold;">
                                    V
                                </div>
                                <span id="vendor-name" class="ms-1 d-none d-md-inline-block">
                                    Vendor <i class="mdi mdi-chevron-down"></i>
                                </span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end profile-dropdown ">
                                <!-- item-->
                                <div class="dropdown-header noti-title">
                                    <h6 class="text-overflow m-0">Welcome !</h6>
                                </div>

                                <!-- item-->
                                <a href="pages-profile.html" class="dropdown-item notify-item">
                                    <i class="mdi mdi-account me-1"></i>
                                    <span>My Account</span>
                                </a>

                                <!-- item-->
                                <a href="javascript:void(0);" class="dropdown-item notify-item">
                                    <i class="mdi mdi-cog me-1"></i>
                                    <span>Settings</span>
                                </a>

                                <!-- item-->
                                <a href="auth-lock-screen.html" class="dropdown-item notify-item">
                                    <i class="mdi mdi-lock me-1"></i>
                                    <span>Lock Screen</span>
                                </a>

                                <div class="dropdown-divider"></div>

                                <!-- item-->
                                <a  id="logoutBtn" class="dropdown-item notify-item">
                                    <i class="mdi mdi-logout me-1"></i>
                                    <span>Logout</span>
                                </a>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!-- ========== Topbar End ========== -->