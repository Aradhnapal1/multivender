<?php include 'header.php'; ?>


<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Dashboard</h4>


                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <!-- <li class="breadcrumb-item"><a href="javascript: void(0);">Menu</a></li> -->

                        <li class="breadcrumb-item"><a href="javascript: void(0);">Dashboard</a></li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xxl-6">
                <div class="card bg-soft-primary">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-8">
                                <div class="d-flex flex-column h-100">
                                    <div class="flex-grow-1">
                                        <h3 class="fw-medium text-capitalize mt-0 mb-2">Check Account Status
                                        </h3>
                                        <p class="font-18">Your account status and activity.</p>
                                    </div><!-- end d-flex -->

                                    <div class="flex-shrink-0">
                                        <div class="row h-100">
                                            <div class="col-sm-6">
                                                <div class="card border-0 bg-soft-warning mb-0">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <h4 class="mt-0 mb-0">Total Revenue</h4>
                                                            <a class="avatar-xs bg-white rounded font-18 d-flex text-black align-items-center justify-content-center"
                                                                href="#">
                                                                <i class="mdi mdi-arrow-top-right"></i>
                                                            </a>
                                                        </div>
                                                        <h2 class="mb-0" id="sdTotalRevenue">₹0</h2>
                                                    </div>
                                                </div>
                                            </div><!-- end col -->
                                            <div class="col-sm-6">
                                                <div class="card border-0 bg-soft-success mb-0">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <h4 class="mt-0 mb-0">Total Vendors</h4>
                                                            <a class="avatar-xs bg-white rounded font-18 d-flex text-black align-items-center justify-content-center"
                                                                href="#">
                                                                <i class="mdi mdi-arrow-top-right"></i>
                                                            </a>
                                                        </div>
                                                        <h2 class="mb-0" id="sdTotalVendors">0</h2>
                                                    </div><!-- end card-body -->
                                                </div><!-- end card -->
                                            </div><!-- end col -->
                                        </div><!-- end row -->
                                    </div>
                                </div>
                            </div><!-- end col -->

                            <div class="col-md-4">
                                <div class="d-flex align-items-center justify-content-center h-100 w-100 mt-4 mt-md-0">
                                    <img alt="" class="img-fluid" src="assets/hero-dashboard-1915640c.png">
                                </div>
                            </div><!-- end col -->
                        </div>
                    </div> <!-- end card-body-->
                </div> <!-- end card-->
            </div> <!-- end col-->

            <div class="col-xxl-6">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="my-0">Total Revenue</h4>
                                    <i class="mdi mdi-chevron-right text-primary font-20"></i>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <h2 class="mb-2 mt-0" id="sdRevenueCard">₹0</h2>
                                        <p class="mb-0"><span class="badge bg-success-subtle text-success">25.42%</span>
                                            vs selected period</p>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-end">
                                            <div data-colors="#ffc107" id="total_profit"></div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- end card-body -->
                        </div><!-- end card -->

                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="my-0">Total Users</h4>
                                    <i class="mdi mdi-chevron-right text-primary font-20"></i>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <h2 class="mb-2 mt-0" id="sdTotalUsers">0</h2>
                                        <p class="mb-0"><span class="badge bg-success-subtle text-success">30.32%</span>
                                            vs last month</p>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-end">
                                            <div data-colors="#198754" id="new_customers"></div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- end card-body -->
                        </div><!-- end card -->
                    </div><!-- end row -->

                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="my-0">Total Products</h4>
                                    <i class="mdi mdi-chevron-right text-primary font-20"></i>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <h2 class="mb-2 mt-0" id="sdTotalProducts">0</h2>
                                        <p class="mb-0"><span
                                                class="badge bg-danger-subtle text-danger rounded">5%</span>
                                            listed products</p>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-end">
                                            <div data-colors="#fa6374" id="running_project"></div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- end card-body -->
                        </div><!-- end card -->
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="my-0">Total Orders</h4>
                                    <i class="mdi mdi-chevron-right text-primary font-20"></i>
                                </div>

                                <div class="row">
                                    <div class="col-6">
                                        <h2 class="mb-2 mt-0" id="sdTotalOrders">0</h2>
                                        <p class="mb-0"><span class="badge bg-success-subtle text-success">12.92%</span>
                                            platform orders</p>
                                    </div>
                                    <div class="col-6">
                                        <div class="text-end">
                                            <div data-colors="#0dcaf0" id="expense_total"></div>
                                        </div>
                                    </div>
                                </div>
                            </div><!-- end card-body -->
                        </div><!-- end card-body -->
                    </div><!-- end row -->
                </div><!-- end row -->
            </div><!-- end col -->
        </div>
        <!-- end row -->
        <div class="row">
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="text-muted mb-2">Total Brands</h5>
                        <h3 class="mb-0" id="sdTotalBrands">0</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="text-muted mb-2">Total Categories</h5>
                        <h3 class="mb-0" id="sdTotalCategories">0</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="text-muted mb-2">Total Colors</h5>
                        <h3 class="mb-0" id="sdTotalColors">0</h3>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card">
                    <div class="card-body">
                        <h5 class="text-muted mb-2">Total Sizes</h5>
                        <h3 class="mb-0" id="sdTotalSizes">0</h3>
                    </div>
                </div>
            </div>
        </div>
        <!-- end row -->

      

     
    </div>
    <!-- end row -->

</div>
<!-- container -->


<?php include 'footer.php'; ?>