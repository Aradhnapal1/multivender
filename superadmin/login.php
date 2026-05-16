<!DOCTYPE html>
<html lang="en">

<!-- Mirrored from themes.getappui.com/techui/layouts/auth-login.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 03 Feb 2026 07:41:00 GMT -->

<head>
    <meta charset="utf-8" />
    <title> Hyperscripts | Log In </title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
    <meta content="GetAppui" name="author" />

    <!-- App favicon -->
    <link rel="shortcut icon" href="assets/img/favicon.webp">

    <!-- Theme Config Js -->


    <!-- Font Family -->
    <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,300,400&amp;display=swap" rel="stylesheet">
    <script type="module" crossorigin src="assets/app-22784e3d.js"></script>
    <link rel="stylesheet" href="assets/app-0f19a312.css">
    <link rel="stylesheet" href="https://cdn.materialdesignicons.com/7.4.47/css/materialdesignicons.min.css">
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="js/login.js?v=5"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body class="authentication-bg">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-10">
                <div class="card">
                    <div class="row g-0 align-items-center justify-content-center">
                        <div class="col-xl-5 col-lg-6">
                            <div class="d-flex flex-column p-4">
                                <div class="flex-shrink-0">
                                    <div class="auth-brand mb-5">

                                    
                                        <a href="index.php" class="logo-dark">
                                            <span><img src="assets/img/logo.png" alt="" height="32"></span>
                                        </a>
                                        <a href="index.php" class="logo-light">
                                            <span><img src="assets/img/logo.png" alt="" height="32"></span>
                                        </a>
                                    </div>
                                </div>



                                <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                                    <div class="w-100">
                                        <div class="">
                                            <h4 class="font-20">Sign In</h4>
                                            <p class="text-muted mb-3">Enter your email address and password to access
                                                account.</p>
                                        </div>

                                        <form class="mb-3">

                                            <div class="form-group mb-3">
                                                <label class="form-label">Email address</label>
                                                <input class="form-control" type="email" id="emailaddress"
                                                    placeholder="Enter your email" required>
                                            </div>

                                            <div class="mb-3">
                                                <label class="form-label">Password</label>
                                                <input type="password" id="password" class="form-control"
                                                    placeholder="Enter your password" required>
                                            </div>

                                            <div class="form-group mb-0 text-center">
                                                <button id="loginBtn" class="btn btn-dark w-100" type="button"
                                                    onclick="loginApi()">
                                                    <i class="mdi mdi-login me-1"></i> Log In
                                                </button>
                                            </div>

                                        </form>


                                        <div class="text-center mt-4">
                                            <!-- <p class="text-muted font-18">Sign in with</p> -->
                                            <div class="d-flex gap-2 justify-content-center mt-3">
                                                <a href="javascript: void(0);"
                                                    class="btn btn-sm btn-soft-primary font-16"><i
                                                        class="mdi mdi-facebook"></i></a>
                                                <a href="javascript: void(0);"
                                                    class="btn btn-sm btn-soft-danger font-16"><i
                                                        class="mdi mdi-instagram"></i></a>
                                                <a href="javascript: void(0);"
                                                    class="btn btn-sm btn-soft-info font-16"><i
                                                        class="mdi mdi-twitter"></i></a>
                                                <a href="javascript: void(0);"
                                                    class="btn btn-sm btn-soft-dark font-16"><i
                                                        class="mdi mdi-github"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div> <!-- end card-body -->

                        </div>
                        <div class="col-xl-7 col-lg-6  d-none d-lg-block">
                            <div class="login-img">
                                <div class="img-light">
                                    <img src="assets/login-5ee99bc5.svg" alt="" class="img-fluid">
                                </div>
                                <div class="img-dark">
                                    <img src="assets/login-dark-5dbf652b.svg" alt="" class="img-fluid">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- end card -->
                <!-- <p class="text-muted text-center font-16 mb-5">Don't have an account? <a href="register.php"
                        class="text-dark ms-1">Sign Up</a></p> -->

            </div> <!-- end col -->
        </div>
        <!-- end row -->
    </div>
    <!-- end container -->

    <footer class="footer footer-alt fw-medium bg-transparent">
        <span class="text-muted">
            <script>document.write(new Date().getFullYear())</script> © Hyperscripts 
        </span>
    </footer>

    <!-- Vendor js -->
    <!--<script src="assets/js/vendor.min.js"></script>-->

    <!-- App js -->


    <script src="../../../getappui.com/app/newsletter/index.js"></script>
</body>


<!-- Mirrored from themes.getappui.com/techui/layouts/auth-login.html by HTTrack Website Copier/3.x [XR&CO'2014], Tue, 03 Feb 2026 07:41:00 GMT -->

</html>