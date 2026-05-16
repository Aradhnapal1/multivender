<?php include 'header.php'; ?>

<script>
(function () {
    try {
        if (!localStorage.getItem('userToken')) {
            window.location.replace('login.php');
        }
    } catch (e) {
        window.location.replace('login.php');
    }
})();
</script>


    <!-- Breadcrumb Section Start -->
    <section class="breadcrumb-section">
        <div class="custom-container">
            <div class="breadcrumb-contain">
                <h2>User Dashboard</h2>
                <nav>
                    <ol class="breadcrumb mb-0">
                        <li class="breadcrumb-item">
                            <a href="index">
                                <i class="ri-home-3-fill"></i>
                            </a>
                        </li>
                        <li class="breadcrumb-item active">User Dashboard</li>
                    </ol>
                </nav>
            </div>
        </div>
    </section>
    <!-- Breadcrumb Section End -->

    <!-- User Dashboard Section Start -->
    <section class="user-dashboard-section section-t-space section-b-space">
        <div class="custom-container">
            <div class="row">
                <div class="col-xxl-3 col-lg-4">
                    <div class="dashboard-left-sidebar">
                        <button class="sidebar-close d-flex d-lg-none">
                            <i class="ri-close-line"></i>
                        </button>
                        <div class="profile-box">
                            <div class="profile-contain">
                                <!-- <div class="profile-image">
                                    <img src="../assets/images/review/1.jpg" class="img-fluid update_img" alt="" id="userProfileImage">
                                </div> -->

                                <div class="profile-name">
                                    <h3 id="userFullName"></h3>
                                    <h4 id="userEmail" class="text-content"></h4>
                                </div>
                            </div>
                        </div>

                        <ul class="nav nav-pills user-nav-pills" id="pills-tab">
                            <li class="nav-item">
                                <button class="nav-link active" id="pills-dashboard-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-dashboard" type="button"><i class="ri-home-2-line"></i>
                                    Dashboard</button>

                                    
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="pills-order-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-order" type="button"><i
                                        class="ri-shopping-basket-line"></i>Order</button>
                            </li>
                            <!-- <li class="nav-item">
                                <button class="nav-link" id="pills-card-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-card" type="button"><i class="ri-bank-card-line"></i> Saved
                                    Card</button>
                            </li> -->
                            <li class="nav-item">
                                <button class="nav-link" id="pills-address-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-address" type="button"><i
                                        class="ri-map-pin-line"></i>Address</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-profile" type="button"><i class="ri-user-3-line"></i>
                                    Profile</button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="pills-security-tab" data-bs-toggle="pill"
                                    data-bs-target="#pills-security" type="button"><i
                                        class="ri-shield-line"></i>Privacy</button>
                            </li>
                        </ul>
                        <div class="logout-box">
                            <button type="button" class="nav-link logout-btn theme-bg-color text-light"><i
                                    class="ri-logout-box-line"></i>Log Out</button>
                        </div>
                    </div>
                </div>

                <div class="col-xxl-9 col-lg-8">
                    <button class="btn left-dashboard-show btn-bg-theme btn-md mb-4 d-lg-none">Show Menu</button>
                    <div class="tab-content dashboard-right-sidebar" id="pills-tabContent">
                        <div class="tab-pane fade active show" id="pills-dashboard">
                            <div class="dashboard-home dashboard-bg-box">
                                <div class="title d-block">
                                    <h3 id="welcomeUserName"></h3>
                                    <p class="mt-2 fw-normal">From your My Account Dashboard you have the ability to
                                        view a snapshot of your recent account activity and update your account
                                        information. Select a link below to view or edit information.</p>
                                </div>

                                <ul class="dashboard-setting">
                                    <li data-class="pills-order">
                                        <a href="#!" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#order">
                                                </use>
                                            </svg>
                                            
                                            <h4>Orders</h4>
                                            <p>Verify the status of your order.</p>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="wishlist.php" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#wishlist">
                                                </use>
                                            </svg>
                                            <h4>Wishlist</h4>
                                            <p>Every one of your carefully chosen product assortments</p>
                                        </a>
                                    </li>
                                    <!-- <li data-class="pills-card">
                                        <a href="#!" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#saveCard">
                                                </use>
                                            </svg>
                                            <h4>Saved Card</h4>
                                            <p>Keep your credit cards handy for a quicker checkout.</p>
                                        </a>
                                    </li> -->
                                    <li data-class="pills-address">
                                        <a href="#!" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#address">
                                                </use>
                                            </svg>
                                            <h4>Address</h4>
                                            <p>Keep track of addresses for a smooth checkout</p>
                                        </a>
                                    </li>
                                    <li data-class="pills-profile">
                                        <a href="#!" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#profile">
                                                </use>
                                            </svg>
                                            <h4>Profile</h4>
                                            <p>Modify the information on your profile.</p>
                                        </a>
                                    </li>
                                    <li data-class="pills-security">
                                        <a href="#!" class="personal-detail">
                                            <svg>
                                                <use
                                                    xlink:href="https://themes.pixelstrap.net/kartify/assets/images/inner-page/user-dashboard/home.svg#privacy">
                                                </use>
                                            </svg>
                                            <h4>Privacy</h4>
                                            <p>Check your order status</p>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="pills-order">
                            <div class="dashboard-order dashboard-bg-box">
                                <div class="title d-block">
                                    <h3>My Orders History</h3>
                                    <p class="mt-2 fw-normal">Check the status of your orders, manage returns, and
                                        discover similar products. You can view your order history and details below.
                                    </p>
                                </div>

                                <div class="order-contain">
                                    <div class="table-responsive dashboard-order-table">
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th class="text-center">Image</th>
                                                    <th>Product name</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                    <th>Payment</th>
                                                    <th>Price</th>
                                                    <th>Track Order</th>
                                                </tr>
                                            </thead>
                                            <tbody id="order-table-body">
                                            </tbody>
                                        </table>
                                    </div>

                                    <!-- Pagination (populated by user-order.js, 10 orders per page) -->
                                    <div class="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2"
                                         id="orderPaginationWrap" style="display:none !important;">
                                        <div class="small text-muted" id="orderPaginationSummary"></div>
                                        <nav aria-label="Orders pagination">
                                            <ul class="pagination pagination-sm mb-0" id="orderPagination"></ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="pills-address">
                            <div class="dashboard-address dashboard-bg-box">
                                <div class="title address-title dashboard-title justify-content-between flex-wrap">
                                    <h3>My Address Book</h3>
                                    <!-- <button class="btn theme-bg-color text-white">
                                        <i class="ri-add-line"></i>Add New Address</button> -->
                                </div>

                                <div class="row g-sm-4 g-3" id="addressContainer">
                                    <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                                        <div class="address-box">
                                            <div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="jack"
                                                        id="flexRadioDefault2" checked>
                                                </div>

                                                <div class="label">
                                                    <label>Home</label>
                                                </div>

                                                <div class="table-responsive address-table">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <td colspan="3">Cameron Williamson</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Address</td>
                                                                <td>:</td>
                                                                <td>
                                                                    <p>8424 James Lane South San Francisco, CA 94080
                                                                    </p>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>Pin Code</td>
                                                                <td>:</td>
                                                                <td>+380</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Phone</td>
                                                                <td>:</td>
                                                                <td>+1 202-555-0123</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div class="button-group">
                                                <button class="btn btn-sm add-button w-100"><i
                                                        class="ri-edit-box-line"></i>Edit</button>
                                                <button class="btn btn-sm add-button w-100"><i
                                                        class="ri-delete-bin-5-line"></i>Remove</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xxl-4 col-xl-6 col-lg-12 col-md-6">
                                        <div class="address-box">
                                            <div>
                                                <div class="form-check">
                                                    <input class="form-check-input" type="radio" name="jack"
                                                        id="flexRadioDefault3">
                                                </div>

                                                <div class="label">
                                                    <label>Office</label>
                                                </div>

                                                <div class="table-responsive address-table">
                                                    <table class="table">
                                                        <tbody>
                                                            <tr>
                                                                <td colspan="3">Kathryn E. Willingham</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Address</td>
                                                                <td>:</td>
                                                                <td>
                                                                    <p>2072 Romrog Way Cheyenne, WY 82007</p>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>Pin Code</td>
                                                                <td>:</td>
                                                                <td>+36</td>
                                                            </tr>

                                                            <tr>
                                                                <td>Phone</td>
                                                                <td>:</td>
                                                                <td>+ 365-799-8564</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            <div class="button-group">
                                                <button class="btn btn-sm add-button w-100"><i
                                                        class="ri-edit-box-line"></i>Edit</button>
                                                <button class="btn btn-sm add-button w-100"><i
                                                        class="ri-delete-bin-5-line"></i>Remove</button>
                                            </div>
                                        </div>
                                    </div>

                                  
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="pills-card">
                            <div class="dashboard-card dashboard-bg-box">
                                <div class="title card-title justify-content-between">
                                    <h3>My Card Details</h3>
                                    <button class="btn theme-bg-color text-white">
                                        <i class="me-1 ri-add-line"></i>
                                        Add New Card</button>
                                </div>

                                <div class="row g-4">
                                    <div class="col-xxl-4 col-xl-6 col-lg-12 col-sm-6">
                                        <div class="payment-card-detail">
                                            <div class="card-details">
                                                <div class="top-box">
                                                    <img src="../assets/images/inner-page/user-dashboard/chip.png"
                                                        class="img-fluid card-chip" alt="">
                                                    <div class="bank-name">
                                                        <img src="../assets/images/inner-page/bank/3.png"
                                                            class="img-fluid bank-img" alt="">
                                                        <span>Marshall</span>
                                                    </div>
                                                </div>
                                                <div class="card-number">
                                                    <h4>25## - #### - #### - ##48</h4>
                                                </div>

                                                <div class="name-detail">
                                                    <div class="name">
                                                        <h5>Card Holder</h5>
                                                        <h6>Cameron Williamson</h6>
                                                    </div>
                                                    <div class="name">
                                                        <h5>Expires</h5>
                                                        <h6>03/2030</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="edit-card">
                                                <button class="btn"><i class="ri-edit-box-line"></i>edit</button>
                                                <button class="btn" data-bs-target="#deleteCard"
                                                    data-bs-toggle="modal"><i class="ri-delete-bin-5-line"></i>
                                                    delete</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xxl-4 col-xl-6 col-lg-12 col-sm-6">
                                        <div class="payment-card-detail">
                                            <div class="card-details card-visa">
                                                <div class="top-box">
                                                    <img src="../assets/images/inner-page/user-dashboard/chip.png"
                                                        class="img-fluid card-chip" alt="">
                                                    <div class="bank-name">
                                                        <img src="../assets/images/inner-page/bank/2.png"
                                                            class="img-fluid bank-img" alt="">
                                                        <span>Summerlin</span>
                                                    </div>
                                                </div>
                                                <div class="card-number">
                                                    <h4>69## - #### - #### - ##96</h4>
                                                </div>

                                                <div class="name-detail">
                                                    <div class="name">
                                                        <h5>Card Holder</h5>
                                                        <h6>Itzayana Norman</h6>
                                                    </div>
                                                    <div class="name">
                                                        <h5>Expires</h5>
                                                        <h6>10/2033</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="edit-card">
                                                <button class="btn"><i class="ri-edit-box-line"></i>edit</button>
                                                <button class="btn" data-bs-target="#deleteCard"
                                                    data-bs-toggle="modal"><i class="ri-delete-bin-5-line"></i>
                                                    delete</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-xxl-4 col-xl-6 col-lg-12 col-sm-6">
                                        <div class="payment-card-detail">
                                            <div class="card-details debit-card">
                                                <div class="top-box">
                                                    <img src="../assets/images/inner-page/user-dashboard/chip.png"
                                                        class="img-fluid card-chip" alt="">
                                                    <div class="bank-name">
                                                        <img src="../assets/images/inner-page/bank/1.png"
                                                            class="img-fluid bank-img" alt="">
                                                        <span>Auburn</span>
                                                    </div>
                                                </div>
                                                <div class="card-number">
                                                    <h4>15## - #### - #### - ##75</h4>
                                                </div>

                                                <div class="name-detail">
                                                    <div class="name">
                                                        <h5>Card Holder</h5>
                                                        <h6>Fatima Aguirre</h6>
                                                    </div>
                                                    <div class="name">
                                                        <h5>Expires</h5>
                                                        <h6>09/2028</h6>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="edit-card">
                                                <button class="btn"><i class="ri-edit-box-line"></i>edit</button>
                                                <button class="btn" data-bs-target="#deleteCard"
                                                    data-bs-toggle="modal"><i class="ri-delete-bin-5-line"></i>
                                                    delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="pills-profile">
                            <div class="dashboard-profile dashboard-bg-box">
                                <div class="title">
                                    <h3>Account Setting</h3>
                                </div>

                                <div class="profile-title">
                                    <h4>Profile Picture</h4>
                                </div>

                                <div class="profile-box">
                                    <div class="profile-image">
                                        <div class="profile-icon">
                                            <input id="file" type="file" onchange="loadFile(event)">
                                            <i class="ri-edit-2-line"></i>
                                        </div>
                                        <img src="../assets/images/review/1.jpg" class="img-fluid" id="output" alt="">
                                    </div>
                                    <div class="profile-content flex-grow-1">
                                        <h4 class="notifi-wishlist">Your Picture</h4>
                                        <h5 class="text-muted mb-1">Allowed: JPEG, PNG, GIF — max <strong>4 MB</strong>. Recommended <strong>square</strong> image up to <strong>2048×2048</strong> pixels.</h5>
                                        <p id="profileImageUploadHint" class="small text-warning mb-2" style="display:none;"></p>
                                        <a id="profileImageOpenLink" href="#" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-secondary align-items-center gap-1" style="display:none;" title="Open current picture in a new tab">
                                            <i class="ri-external-link-line"></i> Open picture
                                        </a>
                                    </div>
                                </div>

                                <form class="profile-form" id="profileForm" novalidate>
                                    <div class="profile-title">
                                        <h4>Account Information</h4>
                                    </div>
                                    <div class="row g-sm-4 g-3">
                                        <div class="col-sm-6">
                                            <div class="theme-form">
                                                <label for="fname" class="form-label">First Name</label>
                                                <input placeholder="Enter First Name" type="text"
                                                    class="form-control" id="fname" maxlength="100">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="theme-form">
                                                <label for="lname" class="form-label">Last Name</label>
                                                <input placeholder="Enter Last Name" type="text"
                                                    class="form-control" id="lname" maxlength="100">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="theme-form">
                                                <label for="phone" class="form-label">Phone</label>
                                                <input type="tel" class="form-control" id="phone" maxlength="40" placeholder="Enter Phone">
                                            </div>
                                        </div>
                                        <div class="col-sm-6">
                                            <div class="theme-form">
                                                <label for="date" class="form-label">Birthday</label>
                                                <input type="date" class="form-control" id="date">
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="from-button-group d-flex gap-sm-3 gap-2 justify-content-end align-items-center">
                                                <span id="profileFormStatus" class="small text-muted me-auto"></span>
                                                <button type="button" id="profileCancelBtn"
                                                    class="btn d-inline-block bg-light text-dark rounded-2">Cancel</button>
                                                <button type="submit" id="profileSaveBtn"
                                                    class="btn d-inline-block theme-bg-color text-light rounded-2">Save
                                                    Changes</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="pills-security">
                            <div class="dashboard-privacy dashboard-bg-box">
                                <div class="profile-title">
                                    <h4>Email Address</h4>
                                    <p>Modify the e-mail associated with your account. Your account is currently
                                        <a href="#!" id="currentEmailLink">—</a>
                                    </p>
                                </div>

                                <form class="profile-form" id="changeEmailForm" novalidate>
                                    <div class="row g-sm-4 g-3">
                                        <div class="col-12">
                                            <div class="theme-form custom-width">
                                                <label for="email" class="form-label">New Email Address</label>
                                                <input placeholder="you@example.com" type="email"
                                                    class="form-control" id="email" autocomplete="email" required>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="theme-form custom-width">
                                                <label for="emailCurrentPassword" class="form-label">Current Password</label>
                                                <input placeholder="Enter your current password" type="password"
                                                    class="form-control" id="emailCurrentPassword"
                                                    autocomplete="current-password" required>
                                                <span class="suggestion-text">For your security, confirm your password to change the email.</span>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="from-button-group d-flex gap-sm-3 gap-2 align-items-center flex-wrap">
                                                <button type="submit" id="changeEmailSubmit"
                                                    class="btn d-inline-block theme-bg-color text-light rounded-2">Save
                                                    Changes</button>
                                                <button type="button" id="changeEmailCancel"
                                                    class="btn d-inline-block gray-bg-color rounded-2">Cancel</button>
                                                <span id="changeEmailStatus" class="small"></span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div class="dashboard-privacy dashboard-bg-box">
                                <div class="profile-title">
                                    <h4>Change Password</h4>
                                    <p>Enter your current password and a new one. You'll stay signed in after the
                                        change.</p>
                                </div>

                                <form class="profile-form" id="changePasswordForm" novalidate>
                                    <div class="row g-sm-4 g-3">
                                        <div class="col-12">
                                            <div class="theme-form custom-width">
                                                <label for="pass" class="form-label">Old Password</label>
                                                <input placeholder="Enter Old Password" type="password"
                                                    class="form-control" id="pass" autocomplete="current-password" required>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="theme-form custom-width">
                                                <label for="pass1" class="form-label">New Password</label>
                                                <input placeholder="Enter New Password" type="password"
                                                    class="form-control" id="pass1" autocomplete="new-password" required>
                                                <span class="suggestion-text">At least 8 characters including a
                                                    lowercase letter, an uppercase letter, and a number.</span>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <div class="theme-form custom-width">
                                                <label for="pass2" class="form-label">Confirm New Password</label>
                                                <input placeholder="Confirm New Password" type="password"
                                                    class="form-control" id="pass2" autocomplete="new-password" required>
                                                <span class="suggestion-text">Must match the new password above.</span>
                                            </div>
                                        </div>


                                        <div class="col-12">
                                            <div class="from-button-group d-flex gap-sm-3 gap-2 align-items-center flex-wrap">
                                                <button type="submit" id="changePasswordSubmit"
                                                    class="btn d-inline-block theme-bg-color text-light rounded-2">Save
                                                    Changes</button>
                                                <button type="button" id="changePasswordCancel"
                                                    class="btn d-inline-block gray-bg-color rounded-2">Cancel</button>
                                                <span id="changePasswordStatus" class="small"></span>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div class="dashboard-bg-box delete-account-box">
                                <div class="profile-title">
                                    <h4>Danger Zone</h4>
                                    <p>Deleting your account will</p>
                                </div>

                                <ul class="delete-detail-link">
                                    <li>Delete your profile and all of your authentication associations permanently.
                                    </li>
                                    <li>Delete anything you have ever written, including articles, bookmarks, comments,
                                        and more, permanently.</li>
                                    <li>Let anyone to be able to access your username.</li>
                                </ul>

                                <ul class="delete-detail-link mt-3 gap-0 p-0">
                                    <li class="d-inline-block">Important: There is no way to undo the deletion of your
                                        account. Please get in touch.</li>
                                    <li class="d-inline-block"> Send inquiries to <a href="#!"
                                            class="d-inline-block text-danger">support@blockthemeexample.com.</a></li>
                                </ul>

                                <button class="btn btn-danger mt-3 rounded-2" data-bs-toggle="modal"
                                    data-bs-target="#delete-account">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- User Dashboard Section End -->

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

    <script>
        document.addEventListener("DOMContentLoaded", function() {
            let user = null;
            const userDataStr = localStorage.getItem("userData");
            if (userDataStr) {
                try {
                    user = JSON.parse(userDataStr);
                } catch(e) {}
            }
            
            const token = localStorage.getItem('userToken');
            if (!user && token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));
                    user = JSON.parse(jsonPayload);
                } catch (e) {
                    console.error("Could not parse token");
                }
            }

            if (user) {
                const firstName = user.firstname || user.firstName || user.name || "User";
                const lastName = user.lastname || user.lastName || "";
                const fullName = (firstName + " " + lastName).trim();
                const email = user.email || "";
                
                const userFullNameEl = document.getElementById("userFullName");
                const userEmailEl = document.getElementById("userEmail");
                const welcomeUserNameEl = document.getElementById("welcomeUserName");
                
                if (userFullNameEl) userFullNameEl.textContent = fullName;
                if (userEmailEl) userEmailEl.textContent = email;
                if (welcomeUserNameEl) welcomeUserNameEl.textContent = "Welcome Back, " + fullName;

                const profileImg = user.image || user.profileImage || user.profilePic || user.avatar;
                const userProfileImageEl = document.getElementById("userProfileImage");
                if (userProfileImageEl && profileImg && profileImg.trim() !== "") {
                    if(profileImg.startsWith('http')) {
                        userProfileImageEl.src = profileImg;
                    } else if (profileImg.startsWith('/')) {
                        userProfileImageEl.src = 'https://api.workarya.com' + profileImg;
                    } else {
                        userProfileImageEl.src = 'https://api.workarya.com/' + profileImg;
                    }
                }
            }

            // =================================================================
            // Profile tab: load current values, save on submit, upload avatar
            // -----------------------------------------------------------------
            // Backend endpoints (all require Bearer token):
            //   GET  /api/user/profile
            //   PUT  /api/user/profile            (JSON text fields)
            //   POST /api/user/profile/image      (multipart image)
            // =================================================================
            (function wireProfileForm() {
                const API_BASE = "https://api.workarya.com";
                const form = document.getElementById("profileForm");
                if (!form) return;

                const fname = document.getElementById("fname");
                const lname = document.getElementById("lname");
                const phone = document.getElementById("phone");
                const date  = document.getElementById("date");
                const statusEl = document.getElementById("profileFormStatus");
                const saveBtn = document.getElementById("profileSaveBtn");
                const cancelBtn = document.getElementById("profileCancelBtn");
                const fileInput = document.getElementById("file");
                const outputImg = document.getElementById("output");
                const avatarImgs = [outputImg, document.getElementById("userProfileImage")].filter(Boolean);
                const profileImageOpenLink = document.getElementById("profileImageOpenLink");
                const profileImageUploadHint = document.getElementById("profileImageUploadHint");

                function setProfileImageOpenLink(url) {
                    if (!profileImageOpenLink) return;
                    if (url) {
                        profileImageOpenLink.href = url;
                        profileImageOpenLink.style.display = "inline-flex";
                    } else {
                        profileImageOpenLink.removeAttribute("href");
                        profileImageOpenLink.style.display = "none";
                    }
                }

                function showImageHint(msg) {
                    if (!profileImageUploadHint) return;
                    if (msg) {
                        profileImageUploadHint.textContent = msg;
                        profileImageUploadHint.style.display = "block";
                    } else {
                        profileImageUploadHint.textContent = "";
                        profileImageUploadHint.style.display = "none";
                    }
                }

                const token = localStorage.getItem("userToken");
                if (!token) {
                    setStatus("Please log in to edit your profile.", "error");
                    saveBtn && (saveBtn.disabled = true);
                    return;
                }

                // Snapshot used for the Cancel button — revert the form to the values
                // we fetched from the server, not the ones the user half-typed.
                let pristine = { firstName: "", lastName: "", phone: "", dateOfBirth: "" };

                function setStatus(msg, type) {
                    if (!statusEl) return;
                    statusEl.textContent = msg || "";
                    statusEl.className = "small me-auto " + (
                        type === "error" ? "text-danger" :
                        type === "success" ? "text-success" : "text-muted"
                    );
                }

                function absoluteImageUrl(path) {
                    if (!path) return null;
                    const s = String(path).trim();
                    if (/^https?:\/\//i.test(s)) return s;
                    return API_BASE + (s.startsWith("/") ? s : "/" + s);
                }

                function applyProfile(p) {
                    if (!p) return;
                    fname.value = p.firstName || "";
                    lname.value = p.lastName  || "";
                    phone.value = p.phone     || "";
                    // API gives an ISO datetime; HTML date input wants yyyy-MM-dd.
                    date.value = p.dateOfBirth ? String(p.dateOfBirth).slice(0, 10) : "";

                    pristine = {
                        firstName: fname.value,
                        lastName:  lname.value,
                        phone:     phone.value,
                        dateOfBirth: date.value
                    };

                    const url = absoluteImageUrl(p.profileImage);
                    if (url) {
                        avatarImgs.forEach(img => { img.src = url; });
                        setProfileImageOpenLink(url);
                    } else {
                        setProfileImageOpenLink("");
                    }

                    // Keep the sidebar name / welcome banner in sync with saved data.
                    const fullName = ((p.firstName || "") + " " + (p.lastName || "")).trim();
                    const userFullNameEl = document.getElementById("userFullName");
                    const userEmailEl = document.getElementById("userEmail");
                    const welcomeUserNameEl = document.getElementById("welcomeUserName");
                    if (userFullNameEl && fullName) userFullNameEl.textContent = fullName;
                    if (welcomeUserNameEl && fullName) welcomeUserNameEl.textContent = "Welcome Back, " + fullName;

                    const profileEmail = (p.email || p.Email || p.userEmail || "").trim();
                    if (userEmailEl) userEmailEl.textContent = profileEmail;
                    const currentEmailLink = document.getElementById("currentEmailLink");
                    if (currentEmailLink) {
                        if (profileEmail) {
                            currentEmailLink.textContent = profileEmail;
                            currentEmailLink.setAttribute("href", "mailto:" + profileEmail);
                        } else {
                            currentEmailLink.textContent = "—";
                            currentEmailLink.removeAttribute("href");
                        }
                    }

                    // Refresh the localStorage snapshot so other pages see the change.
                    try {
                        const existing = JSON.parse(localStorage.getItem("userData") || "{}");
                        const merged = Object.assign({}, existing, {
                            firstname: p.firstName, firstName: p.firstName,
                            lastname: p.lastName,   lastName: p.lastName,
                            phone: p.phone,
                            email: profileEmail || existing.email || "",
                            dateOfBirth: p.dateOfBirth,
                            profileImage: p.profileImage || existing.profileImage,
                            image: p.profileImage || existing.image
                        });
                        localStorage.setItem("userData", JSON.stringify(merged));
                    } catch (_) {}
                }

                async function loadProfile() {
                    try {
                        const res = await fetch(`${API_BASE}/api/user/profile`, {
                            headers: { "Authorization": `Bearer ${token}` },
                            cache: "no-store"
                        });
                        const raw = await res.json();
                        if (!res.ok || raw?.Success === false || raw?.success === false) {
                            setStatus(raw?.Message || raw?.message || "Could not load profile.", "error");
                            return;
                        }
                        const data = raw?.Data || raw?.data || raw;
                        applyProfile(data);
                    } catch (err) {
                        console.error("[profile] load failed", err);
                        setStatus("Network error loading profile.", "error");
                    }
                }

                form.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    setStatus("Saving...");
                    saveBtn.disabled = true;

                    const payload = {
                        firstName: fname.value.trim(),
                        lastName:  lname.value.trim(),
                        phone:     phone.value.trim(),
                        // Send DOB only when the user actually entered one — null leaves it
                        // untouched on the server thanks to COALESCE in the UPDATE.
                        dateOfBirth: date.value ? date.value : null
                    };

                    try {
                        const res = await fetch(`${API_BASE}/api/user/profile`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify(payload)
                        });
                        const raw = await res.json();
                        if (!res.ok || raw?.Success === false || raw?.success === false) {
                            setStatus(raw?.Message || raw?.message || "Could not save changes.", "error");
                            return;
                        }
                        const data = raw?.Data || raw?.data || raw;
                        applyProfile(data);
                        setStatus("Profile saved successfully.", "success");
                        if (window.Swal) {
                            Swal.fire({ icon: "success", title: "Profile updated", timer: 1500, showConfirmButton: false });
                        }
                    } catch (err) {
                        console.error("[profile] save failed", err);
                        setStatus("Network error while saving.", "error");
                    } finally {
                        saveBtn.disabled = false;
                        setTimeout(() => { if (statusEl && statusEl.classList.contains("text-success")) setStatus(""); }, 3000);
                    }
                });

                cancelBtn?.addEventListener("click", () => {
                    fname.value = pristine.firstName;
                    lname.value = pristine.lastName;
                    phone.value = pristine.phone;
                    date.value  = pristine.dateOfBirth;
                    setStatus("Changes discarded.", "muted");
                });

                // Avatar upload — adds to the existing `loadFile(event)` handler which
                // only previews locally; this one actually uploads the file and updates
                // the DB.
                fileInput?.addEventListener("change", async (e) => {
                    const file = e.target.files && e.target.files[0];
                    if (!file) return;

                    showImageHint("");

                    if (file.size > 4 * 1024 * 1024) {
                        setStatus("Image is larger than 4 MB. Please use a file under 4 MB.", "error");
                        showImageHint("File must be 4 MB or smaller.");
                        e.target.value = "";
                        return;
                    }

                    try {
                        if (typeof createImageBitmap === "function") {
                            const bmp = await createImageBitmap(file);
                            const w = bmp.width, h = bmp.height;
                            try { bmp.close(); } catch (_) {}
                            if (w > 2048 || h > 2048) {
                                setStatus("Image dimensions are too large. Please use an image up to 2048×2048 pixels.", "error");
                                showImageHint("Your image is " + w + "×" + h + " px. Resize to max 2048×2048 before uploading.");
                                e.target.value = "";
                                return;
                            }
                        }
                    } catch (_) {
                        /* If bitmap read fails, continue — server may still accept */
                    }

                    const fd = new FormData();
                    fd.append("Image", file);

                    setStatus("Uploading picture...");
                    try {
                        const res = await fetch(`${API_BASE}/api/user/profile/image`, {
                            method: "POST",
                            headers: { "Authorization": `Bearer ${token}` },
                            body: fd
                        });
                        const raw = await res.json();
                        if (!res.ok || raw?.Success === false || raw?.success === false) {
                            setStatus(raw?.Message || raw?.message || "Upload failed.", "error");
                            return;
                        }
                        const path = (raw?.Data || raw?.data || {}).profileImage;
                        if (path) {
                            const url = absoluteImageUrl(path);
                            avatarImgs.forEach(img => { img.src = url; });
                            setProfileImageOpenLink(url);
                            try {
                                const existing = JSON.parse(localStorage.getItem("userData") || "{}");
                                existing.profileImage = path;
                                existing.image = path;
                                localStorage.setItem("userData", JSON.stringify(existing));
                            } catch (_) {}
                        }
                        setStatus("Profile picture updated.", "success");
                    } catch (err) {
                        console.error("[profile] image upload failed", err);
                        setStatus("Network error during upload.", "error");
                    }
                });

                loadProfile();
            })();

            // ===== Change Email / Change Password =====
            (function wireSecurityForms() {
                const token = () => localStorage.getItem("userToken");
                const API = "https://api.workarya.com/api";

                function setStatus(el, msg, type) {
                    if (!el) return;
                    el.textContent = msg || "";
                    el.classList.remove("text-success", "text-danger", "text-muted");
                    if (type === "success") el.classList.add("text-success");
                    else if (type === "error") el.classList.add("text-danger");
                    else el.classList.add("text-muted");
                }

                function refreshCurrentEmail(email) {
                    const link = document.getElementById("currentEmailLink");
                    if (!link) return;
                    const e = email || (() => {
                        try { return JSON.parse(localStorage.getItem("userData") || "{}").email || ""; }
                        catch (_) { return ""; }
                    })();
                    if (e) {
                        link.textContent = e;
                        link.setAttribute("href", "mailto:" + e);
                    } else {
                        link.textContent = "—";
                        link.removeAttribute("href");
                    }
                }
                refreshCurrentEmail();

                // ---- Change Email ----
                const emailForm = document.getElementById("changeEmailForm");
                const emailInput = document.getElementById("email");
                const emailPwd = document.getElementById("emailCurrentPassword");
                const emailBtn = document.getElementById("changeEmailSubmit");
                const emailStatus = document.getElementById("changeEmailStatus");
                const emailCancel = document.getElementById("changeEmailCancel");

                emailCancel?.addEventListener("click", () => {
                    if (emailInput) emailInput.value = "";
                    if (emailPwd) emailPwd.value = "";
                    setStatus(emailStatus, "", "muted");
                });

                emailForm?.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const t = token();
                    if (!t) { setStatus(emailStatus, "Please sign in again.", "error"); return; }

                    const newEmail = (emailInput?.value || "").trim();
                    const currentPassword = emailPwd?.value || "";
                    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                        setStatus(emailStatus, "Please enter a valid email address.", "error");
                        return;
                    }
                    if (!currentPassword) {
                        setStatus(emailStatus, "Please enter your current password.", "error");
                        return;
                    }

                    emailBtn.disabled = true;
                    setStatus(emailStatus, "Updating email…", "muted");
                    try {
                        const res = await fetch(API + "/account/change-email", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + t
                            },
                            body: JSON.stringify({ newEmail, currentPassword })
                        });
                        let data = {};
                        try { data = await res.json(); } catch (_) {}
                        if (!res.ok || data.success === false) {
                            setStatus(emailStatus, data.message || `Update failed (${res.status}).`, "error");
                            return;
                        }

                        // Persist refreshed token + email so subsequent requests work.
                        if (data.token) localStorage.setItem("userToken", data.token);
                        try {
                            const existing = JSON.parse(localStorage.getItem("userData") || "{}");
                            existing.email = data.email || newEmail;
                            localStorage.setItem("userData", JSON.stringify(existing));
                        } catch (_) {}

                        refreshCurrentEmail(data.email || newEmail);
                        if (emailInput) emailInput.value = "";
                        if (emailPwd) emailPwd.value = "";
                        setStatus(emailStatus, "Email updated successfully.", "success");
                        if (typeof Swal !== "undefined") {
                            Swal.fire({ icon: "success", title: "Email updated", text: "Your email has been updated.", timer: 1500, showConfirmButton: false });
                        }
                    } catch (err) {
                        console.error("[account] change-email failed", err);
                        setStatus(emailStatus, "Network error. Please try again.", "error");
                    } finally {
                        emailBtn.disabled = false;
                    }
                });

                // ---- Change Password ----
                const pwdForm = document.getElementById("changePasswordForm");
                const oldPwd = document.getElementById("pass");
                const newPwd = document.getElementById("pass1");
                const confirmPwd = document.getElementById("pass2");
                const pwdBtn = document.getElementById("changePasswordSubmit");
                const pwdStatus = document.getElementById("changePasswordStatus");
                const pwdCancel = document.getElementById("changePasswordCancel");

                pwdCancel?.addEventListener("click", () => {
                    [oldPwd, newPwd, confirmPwd].forEach(x => { if (x) x.value = ""; });
                    setStatus(pwdStatus, "", "muted");
                });

                pwdForm?.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const t = token();
                    if (!t) { setStatus(pwdStatus, "Please sign in again.", "error"); return; }

                    const currentPassword = oldPwd?.value || "";
                    const newPassword = newPwd?.value || "";
                    const confirmPassword = confirmPwd?.value || "";

                    if (!currentPassword || !newPassword || !confirmPassword) {
                        setStatus(pwdStatus, "All password fields are required.", "error");
                        return;
                    }
                    if (newPassword.length < 8) {
                        setStatus(pwdStatus, "New password must be at least 8 characters.", "error");
                        return;
                    }
                    if (newPassword !== confirmPassword) {
                        setStatus(pwdStatus, "New password and confirmation do not match.", "error");
                        return;
                    }
                    if (newPassword === currentPassword) {
                        setStatus(pwdStatus, "New password must differ from the current password.", "error");
                        return;
                    }

                    pwdBtn.disabled = true;
                    setStatus(pwdStatus, "Updating password…", "muted");
                    try {
                        const res = await fetch(API + "/account/change-password", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Bearer " + t
                            },
                            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
                        });
                        let data = {};
                        try { data = await res.json(); } catch (_) {}
                        if (!res.ok || data.success === false) {
                            setStatus(pwdStatus, data.message || `Update failed (${res.status}).`, "error");
                            return;
                        }

                        [oldPwd, newPwd, confirmPwd].forEach(x => { if (x) x.value = ""; });
                        setStatus(pwdStatus, "Password updated successfully.", "success");
                        if (typeof Swal !== "undefined") {
                            Swal.fire({ icon: "success", title: "Password updated", text: "Your password has been changed.", timer: 1500, showConfirmButton: false });
                        }
                    } catch (err) {
                        console.error("[account] change-password failed", err);
                        setStatus(pwdStatus, "Network error. Please try again.", "error");
                    } finally {
                        pwdBtn.disabled = false;
                    }
                });
            })();
        });
    </script>

    <script src="assets/js/image-change.js?v=2"></script>
    <script src="assets/js/user-dashboard.js?v=2" defer></script>

    <?php include 'footer.php'; ?>
