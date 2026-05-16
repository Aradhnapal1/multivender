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

                        <li class="breadcrumb-item"><a href="#">Profile</a></li>
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
                        <!-- <div>
                                        <img src="assets/small-6-cd90fef9.png" alt="" width="100%" height="400"
                                            class="object-fit-cover rounded">
                                    </div> -->

                        <div class="w-100">
                            <div class="d-flex justify-content-between mb-4 ms-2">
                                <div>
                                    <img id="vendorProfileImage" src="assets/images/product/placeholder.png"
                                        alt="Vendor profile image" width="150" class="img-thumbnail rounded-circle">
                                </div>

                            </div>

                            <div class="d-flex justify-content-between w-100">
                                <div>
                                    <h3 class="mb-2 mt-0" id="vendorNameHeading">Vendor Name</h3>
                                    <p class="mb-0 font-16" id="vendorRoleHeading">Authorised Brand Seller</p>
                                    <p class="font-16 mb-4" id="vendorLocationHeading">-</p>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title mb-3">SELLER INFORMATION</h5>
                                    <P class="mb-3 d-none d-md-block">Hi! I am a good Authorised Brand Seller , always
                                        willing to learn new skills. I am friendly, helpful and polite, have a good
                                        sense of humour. I am able to work independently in busy environments and also
                                        within a team setting. I am outgoing and tactful, and able to listen effectively
                                        when solving problems.
                                        I am a punctual and motivated individual who is able to work in a busy
                                        environment and produce high standards of work. I am an excellent team worker
                                        and am able to take instructions from all levels and build up good working
                                        relationships with all colleagues. I am flexible, reliable and possess excellent
                                        time keeping skills.
                                    </P>

                                    <ul class="list-unstyled">
                                        <li class="mb-2"><b>Full Name : </b><span class="ms-1 text-muted">Daniel R.
                                                Moulton </span></li>
                                        <li class="mb-2"><b>Mobile :</b> <span class="ms-1 text-muted">(+45) 23 323
                                                343544 </span></li>
                                        <li class="mb-2"><b>Email :</b> <a href="#"
                                                class="ms-1 text-muted">DanielRMoulton@armyspy.com </a></li>
                                        <li class="mb-2"><b>Location : </b><span class="ms-1 text-muted">United
                                                Stat</span></li>
                                        <li class="mb-2"><b>Languages :</b> <span class="ms-1 text-muted"> English ,
                                                Spanish , French</span></li>
                                    </ul>

                                </div>
                            </div>  -->

                <div class="card">
                    <div class="card-body">
                        <div class="profile-content">
                            <ul class="nav nav-pills bg-light nav-justified gap-0 mb-4 overflow-hidden rounded"
                                role="tablist">
                                <li class="nav-item" role="presentation"><a class="nav-link rounded-0 active"
                                        data-bs-toggle="tab" data-bs-target="#aboutme" type="button" role="tab"
                                        aria-controls="home" aria-selected="true" href="#aboutme">Personal Detail</a>
                                </li>
                                <li class="nav-item" role="presentation"><a class="nav-link rounded-0"
                                        data-bs-toggle="tab" data-bs-target="#businessdetail" type="button" role="tab"
                                        aria-controls="home" aria-selected="false" href="#edit-profile"
                                        tabindex="-1">Business Detail</a></li>
                                <li class="nav-item" role="presentation"><a class="nav-link rounded-0"
                                        data-bs-toggle="tab" data-bs-target="#projects" type="button" role="tab"
                                        aria-controls="home" aria-selected="false" href="#projects" tabindex="-1">Bank
                                        Detail</a></li>
                            </ul>

                            <div class="tab-content m-0">
                                <div class="tab-pane active" id="aboutme" role="tabpanel" aria-labelledby="home-tab"
                                    tabindex="0">
                                    <div class="profile-desk">




                                        <h5 class="mt-4 fs-17 text-dark">Personal Information</h5>
                                        <table class="table table-sm mb-0 border-top">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Name</th>
                                                    <td id="personalName">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td id="personalEmail">-</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Phone</th>
                                                    <td class="ng-binding" id="personalPhone">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Country</th>
                                                    <td id="personalCountry">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">State</th>
                                                    <td id="personalState">-</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">City</th>
                                                    <td id="personalCity">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Pincode</th>
                                                    <td id="personalPincode">-</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Address</th>
                                                    <td id="personalAddress">-</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div> <!-- end profile-desk -->
                                </div>



                                <div id="businessdetail" class="tab-pane" role="tabpanel">
                                    <div class="row m-t-10">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                               <table class="table table-sm mb-0 border-top">
    <tbody>
        <tr><th>Business Name</th><td id="businessName"></td></tr>
        <tr><th>Business Type</th><td id="businessType"></td></tr>
        <tr><th>Business Category</th><td id="businessCategory"></td></tr>
        <tr><th>Business Description</th><td id="businessDescription"></td></tr>
        <tr><th>GST Number</th><td id="gstNumber"></td></tr>
        <tr><th>PAN Number</th><td id="panNumber"></td></tr>
        <tr><th>CIN Number</th><td id="cinNumber"></td></tr>
        <tr><th>Udyam Registration Number</th><td id="udyamNumber"></td></tr>
        <tr><th>Address Line 1</th><td id="addressLine1"></td></tr>
        <tr><th>Address Line 2</th><td id="addressLine2"></td></tr>
        <tr><th>City</th><td id="city"></td></tr>
        <tr><th>State</th><td id="state"></td></tr>
        <tr><th>Country</th><td id="country"></td></tr>
        <tr><th>Pin Code</th><td id="pincode"></td></tr>
        <tr><th>Business Email</th><td id="businessEmail"></td></tr>
        <tr><th>Business Phone</th><td id="businessPhone"></td></tr>
        <tr><th>Alternate Phone</th><td id="alternatePhone"></td></tr>
        <tr><th>Website Url</th><td id="websiteUrl"></td></tr>
        <tr><th>GST Document Url</th><td id="gstDoc"></td></tr>
        <tr><th>PAN Document Url</th><td id="panDoc"></td></tr>
        <tr><th>CIN Certificate Url</th><td id="cinDoc"></td></tr>
        <tr><th>Aadhar Document Url</th><td id="aadharDoc"></td></tr>
        <tr><th>Address Proof Image Url</th><td id="addressProofDoc"></td></tr>
        <tr><th>Business Logo Url</th><td id="logoUrl"></td></tr>
        <tr><th>Verified</th><td id="isVerified"></td></tr>
        <tr><th>Status</th><td id="isActive"></td></tr>
        <tr><th>Vendor Status</th><td id="vendorStatus"></td></tr>
        <tr><th>Admin Review Message</th><td id="adminReviewMessage"></td></tr>
        <tr><th>Reviewed By</th><td id="reviewedBy"></td></tr>
        <tr><th>Reviewed At</th><td id="reviewedAt"></td></tr>
    </tbody>
</table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- profile -->
                                <div id="projects" class="tab-pane" role="tabpanel">
                                    <div class="row m-t-10">
                                        <div class="col-md-12">
                                            <div class="table-responsive">
                                                <h5 class=" fs-17 text-dark">Bank Details</h5>

                                                <table class="table table-sm mb-0 border-top">
                                                    <table class="table table-sm mb-0 border-top">
                                                        <tbody>
                                                            <tr>
                                                                <th>Account Holder Name</th>
                                                                <td id="accHolder"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Bank Name</th>
                                                                <td id="bankName"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Account Number</th>
                                                                <td id="accNumber"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Branch</th>
                                                                <td id="branchName"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Confirm Account Number</th>
                                                                <td id="confirmAccNumber"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>IFSC Code</th>
                                                                <td id="ifsc"></td>
                                                            </tr>
                                                            <tr>
                                                                <th>Cancel Check</th>
                                                                <td id="cancelCheck"></td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </table>
                                            </div>
                                        </div>
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

</div> <!-- content -->


<?php include 'footer.php'; ?>