<?php include 'header.php'; ?>

<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Profile</h4>


                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
              

                        <li class="breadcrumb-item"><a href="">Profile</a></li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->
        <!-- start page title -->

        <div class="row">
            <div class="col-12">
                <div class="card overflow-hidden">
                    <div class="card-body">
                        <div>
                            <img src="assets/small-6-cd90fef9.png" alt="" width="100%" height="400"
                                class="object-fit-cover rounded">
                        </div>

                        <div class="w-100">
                            <div class="d-flex justify-content-between mb-4 ms-2">
                                <div>
                                    <img id="vendorProfileImage" src="assets/images/product/placeholder.png" alt="Profile image" width="150"
                                        class="img-thumbnail rounded-circle" style="margin-top: -60px;">
                                </div>
                                <div class="d-flex align-items-start gap-2 mt-2">
                                    <a href="personal-details.php" class="btn btn-primary text-center mb-1"><span class="mdi mdi-account-edit me-1"></span>Edit Profile</a>
                                    <a id="vendorWebsiteBtn" href="javascript:void(0)" class="btn btn-dark mb-1 disabled" target="_blank" rel="noopener noreferrer">Visit Website</a>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between w-100">
                                <div>
                                    <h3 id="vendorProfileName" class="mb-2 mt-0">Vendor</h3>
                                    <p id="vendorProfileRole" class="mb-0 font-16">Authorized Brand Seller</p>
                                    <p id="vendorProfileLocation" class="font-16 mb-4">-</p>

                                    <h4 class="mb-2">Follow On:</h4>
                                    <ul class="social-list list-inline mb-3">
                                        <li class="list-inline-item">
                                            <a class="social-list-item border border-2 border-primary btn btn-soft-primary font-16 rounded-2 " title="" data-bs-toggle="tooltip" data-bs-placement="top" href="#" data-bs-title="Facebook"><i class="mdi mdi-facebook"></i></a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-list-item border border-2 border-info btn btn-soft-info font-16 rounded-2" title="" data-bs-toggle="tooltip" data-bs-placement="top" href="#" data-bs-title="Twitter"><i class="mdi mdi-twitter"></i></a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-list-item border border-2 border-primary btn btn-soft-primary font-16 rounded-2" title="" data-bs-toggle="tooltip" data-bs-placement="top" href="#" data-bs-title="LinkedIn"><i class="mdi mdi-linkedin"></i></a>
                                        </li>
                                        <li class="list-inline-item">
                                            <a class="social-list-item border border-2 border-danger btn btn-soft-danger font-16 rounded-2" title="" data-bs-toggle="tooltip" data-bs-placement="top" href="#" data-bs-title="Message"><i class="mdi mdi-email-open-outline"></i></a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title mb-3">SELLER INFORMATION</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2"><b>Full Name : </b><span id="vendorInfoName" class="ms-1 text-muted">-</span></li>
                            <li class="mb-2"><b>Mobile :</b> <span id="vendorInfoMobile" class="ms-1 text-muted">-</span></li>
                            <li class="mb-2"><b>Email :</b> <a id="vendorInfoEmail" href="javascript:void(0)" class="ms-1 text-muted">-</a></li>
                            <li class="mb-2"><b>Location : </b><span id="vendorInfoLocation" class="ms-1 text-muted">-</span></li>
                           
                        </ul>
                    </div>
                </div> <!-- end card -->

                <div class="card">
                    <div class="card-body">
                        <div class="profile-content">
                            <ul class="nav nav-pills bg-light nav-justified gap-0 mb-4 overflow-hidden rounded" role="tablist">
                                <li class="nav-item" role="presentation"><a class="nav-link rounded-0 active" data-bs-toggle="tab" data-bs-target="#aboutme" type="button" role="tab" aria-controls="home" aria-selected="true" href="#aboutme">About</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link rounded-0" data-bs-toggle="tab" data-bs-target="#edit-profile" type="button" role="tab" aria-controls="home" aria-selected="false" href="#edit-profile" tabindex="-1">Settings</a></li>
                            </ul>

                            <div class="tab-content m-0">
                                <div class="tab-pane active" id="aboutme" role="tabpanel" aria-labelledby="home-tab" tabindex="0">
                                    <div class="profile-desk">
                                        <h5 id="vendorAboutName" class="text-uppercase fs-17 text-dark">Vendor</h5>
                                        <div id="vendorAboutDesignation" class="designation mb-4">VENDOR PROFILE</div>
                                        <p id="vendorAboutDescription" class="text-muted fs-16">Your business and bank information is shown here based on profile data.</p>

                                        <h5 class="mt-4 fs-17 text-dark">Contact Information</h5>
                                        <table class="table table-sm mb-0 border-top">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Url</th>
                                                    <td>
                                                        <a id="vendorContactWebsite" href="javascript:void(0)" class="ng-binding">
                                                            -
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td>
                                                        <a id="vendorContactEmail" href="javascript:void(0)" class="ng-binding">
                                                            -
                                                        </a>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Phone</th>
                                                    <td id="vendorContactPhone" class="ng-binding">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Bank</th>
                                                    <td id="vendorContactBank" class="ng-binding">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Account Holder</th>
                                                    <td id="vendorContactAccountHolder" class="ng-binding">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Account Number</th>
                                                    <td id="vendorContactAccountNumber" class="ng-binding">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">IFSC</th>
                                                    <td id="vendorContactIfsc" class="ng-binding">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Branch</th>
                                                    <td id="vendorContactBranch" class="ng-binding">-</td>
                                                </tr>

                                            </tbody>
                                        </table>
                                    </div> <!-- end profile-desk -->
                                </div> <!-- about-me -->

                                <!-- settings -->
                                <div id="edit-profile" class="tab-pane" role="tabpanel">
                                    <div class="user-profile-content">
                                        <form id="vendorPasswordForm">
                                            <div class="row row-cols-sm-2 row-cols-1">
                                                <div class="mb-2">
                                                    <label class="form-label" for="FullName">First
                                                        Name</label>
                                                    <input type="text" value="John Doe" id="FirstName" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label" for="Lastname">last Name</label>
                                                    <input type="text" value="john" id="Lastname" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label" for="Email">Email</label>
                                                    <input type="email" value="first.last@example.com" id="Email" class="form-control" readonly>
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label" for="oldpassword">Current Password</label>
                                                    <input type="password" value="" id="oldpassword" class="form-control">
                                                </div>
                                                
                                                <div class="mb-3">
                                                    <label class="form-label" for="Password">Password</label>
                                                    <input type="password" placeholder="6 - 15 Characters" id="Password" class="form-control">
                                                </div>
                                                <div class="mb-3">
                                                    <label class="form-label" for="RePassword">Re-Password</label>
                                                    <input type="password" placeholder="6 - 15 Characters" id="RePassword" class="form-control">
                                                </div>
                                                
                                            </div>
                                            <button id="vendorPasswordSaveBtn" class="btn btn-primary" type="submit"><i class="ri-save-line me-1 fs-16 lh-1"></i> Save</button>
                                        </form>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div> <!-- end card body -->
                </div>
            </div>
        </div>
        <!-- end row -->

    </div> <!-- container -->

</div> 
<!-- content -->
<?php include 'footer.php'; ?>