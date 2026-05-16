<?php include 'header.php'; ?>
            <!-- ========== Topbar End ========== -->
            <div class="content">

                <!-- Start Content-->
                <div class="container-fluid">

                    <!-- start page title -->
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center py-2">
                                <h4>Coupons</h4>


                                <ol class="breadcrumb d-lg-flex d-none mb-0">
                                    <li class="breadcrumb-item"><a href="index">Home</a></li>

                                    <li class="breadcrumb-item"><a href="">Coupon</a></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <!-- end page title -->

                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <a href="add-coupon.php" class="btn btn-dark"><i class="mdi mdi-plus-circle me-2"></i>  Add Coupon</a>
                                        </div>
                                        <div class="col-sm-7">
                                            <div class="text-sm-end">
                                                <button type="button" class="btn btn-success me-1"><i class="mdi mdi-cog-outline"></i></button>
                                                <button type="button" class="btn btn-light me-1">Import</button>
                                                <button type="button" class="btn btn-light">Export</button>
                                            </div>
                                        </div><!-- end col-->
                                    </div>
                                </div><!-- end card-body-->

                                <div class="table-responsive">
                                    <table class="table table-centered w-100 nowrap mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th>S.No</th>
                                                <th>Coupon Name</th>
                                                <th>Coupon Type</th>
                                                <th>Amount</th>
                                                <th>Edit</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody id="allCoupons">
                                            <!-- Dynamic Content Rendered via JS -->
                                        </tbody>
                                    </table>
                                </div>
                            </div> <!-- end card-->
                        </div> <!-- end col -->
                    </div>
                    <!-- end row -->

                </div> <!-- container -->

            </div> <!-- content -->

            <?php include 'footer.php'; ?>