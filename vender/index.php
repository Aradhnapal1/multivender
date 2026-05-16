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

                        <li class="breadcrumb-item"><a href="">Dashboard</a></li>
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
                                                        <h2 class="mb-0" id="vdTotalRevenue">₹0</h2>
                                                    </div>
                                                </div>
                                            </div><!-- end col -->
                                            <div class="col-sm-6">
                                                <div class="card border-0 bg-soft-success mb-0">
                                                    <div class="card-body">
                                                        <div class="d-flex justify-content-between align-items-center">
                                                            <h4 class="mt-0 mb-0">Items Sold</h4>
                                                            <a class="avatar-xs bg-white rounded font-18 d-flex text-black align-items-center justify-content-center"
                                                                href="#">
                                                                <i class="mdi mdi-arrow-top-right"></i>
                                                            </a>
                                                        </div>
                                                        <h2 class="mb-0" id="vdItemsSold">0</h2>
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
                                        <h2 class="mb-2 mt-0" id="vdRevenueCard">₹0</h2>
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
                                    <h4 class="my-0">Total Items Sold</h4>
                                    <i class="mdi mdi-chevron-right text-primary font-20"></i>
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <h2 class="mb-2 mt-0" id="vdTotalItemsSold">0</h2>
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
                                        <h2 class="mb-2 mt-0" id="vdTotalProducts">0</h2>
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
                                        <h2 class="mb-2 mt-0" id="vdTotalOrders">0</h2>
                                        <p class="mb-0"><span class="badge bg-success-subtle text-success">12.92%</span>
                                            received orders</p>
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
            <div class="col-xl-8">
                <div class="card">
                    <div class="card-header align-items-center d-flex">
                        <h4 class="card-title mb-0 flex-grow-1">Revenue Overview (INR)</h4>
                        <div class="flex-shrink-0">
                            <div class="dropdown z-3">
                                <a aria-expanded="false" class="dropdown-toggle arrow-none card-drop"
                                    data-bs-toggle="dropdown" href="#">
                                    <i class="mdi mdi-dots-vertical lh-sm"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Sales Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Export Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Profit</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Action</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="apex-charts mb-1" data-colors="#3980c0, #0dcaf0" dir="ltr" id="balance_overview">
                        </div>

                        <div class="bg-soft-primary rounded">
                            <div class="row text-center">
                                <div class="col-12 col-sm-6 col-md-3">
                                    <p class="text-muted font-16 text-dark mt-3"><i class="mdi mdi-circle-double"></i>
                                        Current Week</p>
                                    <h3 class="mb-3 mt-2">
                                        <span>$1705.54</span>
                                    </h3>
                                </div>
                                <div class="col-12 col-sm-6 col-md-3">
                                    <p class="text-muted font-16 text-dark mt-3"><i class="mdi mdi-circle-double"></i>
                                        Previous Week</p>
                                    <h3 class="mb-3 mt-2">
                                        <span>$6,523.25 <i class="ri-corner-right-up-fill text-success"></i></span>
                                    </h3>
                                </div>
                                <div class="col-12 col-sm-6 col-md-3">
                                    <p class="text-muted font-16 text-dark mt-3"><i class="mdi mdi-circle-double"></i>
                                        Conversation</p>
                                    <h3 class="mb-3 mt-2">
                                        <span>8.27%</span>
                                    </h3>
                                </div>
                                <div class="col-12 col-sm-6 col-md-3">
                                    <p class="text-muted font-16 text-dark mt-3"><i class="mdi mdi-circle-double"></i>
                                        Customers</p>
                                    <h3 class="mb-3 mt-2">
                                        <span>69k <i class="ri-corner-right-down-line text-danger"></i></span>
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><!-- end card -->
            </div><!-- end col -->

            <div class="col-xl-4">
                <div class="card overflow-hidden">
                    <div class="card-header align-items-center d-flex">
                        <h4 class="card-title mb-0 flex-grow-1">Live Users By Country</h4>
                        <div class="flex-shrink-0">
                            <div class="dropdown z-3">
                                <a aria-expanded="false" class="dropdown-toggle arrow-none card-drop"
                                    data-bs-toggle="dropdown" href="#">
                                    <i class="mdi mdi-dots-vertical lh-sm"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Sales Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Export Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Profit</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Action</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="card-body">
                        <div id="world-map-markers" style="height: 310px;"></div>
                    </div><!-- end card-body -->

                    <div class="table-responsive pt-2">
                        <table class="table table-sm table-borderless table-centered align-middle table-nowrap mb-0">
                            <thead class="text-muted table-light">
                                <tr>
                                    <th>Parameters</th>
                                    <th>Today</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th class="text-end">Percent</th>
                                </tr>
                            </thead><!-- end thead -->
                            <tbody class="border-0">
                                <tr>
                                    <th>Duration (Secs)</th>
                                    <td>0-45</td>
                                    <td>45000</td>
                                    <td>
                                        <div class="progress progress-sm">
                                            <div aria-label="Basic example" aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="83" class="progress-bar" role="progressbar"
                                                style="width: 83%">
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end">83 %</td>
                                </tr>
                                <tr>
                                    <th style="width: 30%;">Sessions</th>
                                    <td>242</td>
                                    <td>2,903</td>
                                    <td>
                                        <div class="progress progress-sm">
                                            <div aria-label="Basic example" aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="88" class="progress-bar bg-success" role="progressbar"
                                                style="width: 88%">
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end">88 %</td>
                                </tr>
                                <tr>
                                    <th style="width: 30%;">Views</th>
                                    <td>192</td>
                                    <td>5,942</td>
                                    <td>
                                        <div class="progress progress-sm">
                                            <div aria-label="Basic example" aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="77" class="progress-bar bg-info" role="progressbar"
                                                style="width: 77%">
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end">77 %</td>
                                </tr>
                                <tr>
                                    <th style="width: 30%;">User</th>
                                    <td>162</td>
                                    <td>5,942</td>
                                    <td>
                                        <div class="progress progress-sm">
                                            <div aria-label="Basic example" aria-valuemax="100" aria-valuemin="0"
                                                aria-valuenow="42" class="progress-bar bg-danger" role="progressbar"
                                                style="width: 42%">
                                            </div>
                                        </div>
                                    </td>
                                    <td class="text-end">42 %</td>
                                </tr>
                            </tbody><!-- end tbody -->
                        </table><!-- end table -->
                    </div>
                </div>
            </div>
        </div>
        <!-- end row -->

        <div class="row">
            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header align-items-center d-flex">
                        <h4 class="card-title mb-0 flex-grow-1">Earning Reports</h4>
                        <div class="flex-shrink-0">
                            <div class="dropdown z-3">
                                <a aria-expanded="false" class="dropdown-toggle arrow-none card-drop"
                                    data-bs-toggle="dropdown" href="#">
                                    <i class="mdi mdi-dots-vertical lh-sm"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Sales Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Export Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Profit</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Action</a>
                                </div>
                            </div>
                        </div>
                    </div><!-- end card-header -->

                    <div class="card-body pb-0">
                        <div class="row text-center">
                            <div class="col-6">
                                <p class="text-muted mb-1">This Year</p>
                                <h3 class="mt-0 font-20">$120,254 <span
                                        class="badge bg-success-subtle text-success font-11">+15%</span>
                                </h3>
                            </div>

                            <div class="col-6">
                                <p class="text-muted mb-1">Last Year</p>
                                <h3 class="mt-0 font-20">$98,741 <span
                                        class="badge bg-danger-subtle text-danger font-11">-5%</span></h3>
                            </div>
                        </div>
                        <div class="">
                            <div data-colors="#0dcaf0, #3980c0" id="earning_report"></div>
                        </div>

                    </div>
                </div>
            </div>


            <div class="col-xl-6">
                <div class="card overflow-hidden">
                    <div class="card-header align-items-center d-flex">
                        <h4 class="card-title mb-0 flex-grow-1">Recent Customers</h4>
                        <div class="flex-shrink-0">
                            <div class="dropdown z-3">
                                <a aria-expanded="false" class="dropdown-toggle arrow-none card-drop"
                                    data-bs-toggle="dropdown" href="#">
                                    <i class="mdi mdi-dots-vertical lh-sm"></i>
                                </a>
                                <div class="dropdown-menu dropdown-menu-animated dropdown-menu-end">
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Sales Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Export Report</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Profit</a>
                                    <!-- item-->
                                    <a class="dropdown-item" href="javascript:void(0);">Action</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-hover table-borderless table-centered mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>User ID</th>
                                    <th>Basic Info</th>
                                    <th>Phone</th>
                                    <th>Location</th>
                                    <th>Created Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>


                            <tbody>
                                <tr>
                                    <th scope="row">#0121</th>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="assets/avatar-2-55872111.jpg" title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">George
                                                    Lanes</a></p>
                                            <span class="font-13">george@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        606-467-7601
                                    </td>

                                    <td>
                                        New York
                                    </td>

                                    <td>
                                        2018/04/28
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">#0120</th>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="assets/avatar-3-e534a0e8.jpg" title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">Morgan
                                                    Fuller</a></p>
                                            <span class="font-13">morgan@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        407-748-6878
                                    </td>

                                    <td>
                                        England
                                    </td>

                                    <td>
                                        2018/04/27
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">#0119</th>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="data:image/jpeg;base64,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"
                                            title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">Charlie
                                                    Daly</a></p>
                                            <span class="font-13">charlie@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        918-766-5946
                                    </td>

                                    <td>
                                        Canada
                                    </td>

                                    <td>
                                        2018/04/27
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">#0118</td>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="assets/avatar-5-601bc792.jpg" title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">Skye
                                                    Saunders</a></p>
                                            <span class="font-13">skye@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        302-232-1376
                                    </td>

                                    <td>
                                        France
                                    </td>

                                    <td>
                                        2018/04/26
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">#0117</td>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="data:image/jpeg;base64,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"
                                            title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">Jodie
                                                    Townsend</a></p>
                                            <span class="font-13">jodie@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        251-661-5962
                                    </td>

                                    <td>
                                        Tokyo
                                    </td>

                                    <td>
                                        2017/11/28
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">#0117</td>
                                    <td>
                                        <img alt="contact-img" class="rounded-circle float-start me-2" height="36"
                                            src="data:image/jpeg;base64,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"
                                            title="contact-img" />
                                        <div class="overflow-hidden">
                                            <p class="mb-0 font-weight-medium"><a href="javascript: void(0);">Jodie
                                                    Townsend</a></p>
                                            <span class="font-13">jodie@examples.com</span>
                                        </div>
                                    </td>

                                    <td>
                                        251-661-5962
                                    </td>

                                    <td>
                                        Tokyo
                                    </td>

                                    <td>
                                        2017/11/28
                                    </td>

                                    <td>
                                        <div class="btn-group dropdown">
                                            <a aria-expanded="false"
                                                class="dropdown-toggle arrow-none btn btn-light btn-sm"
                                                data-bs-toggle="dropdown" href="javascript: void(0);"><i
                                                    class="mdi mdi-dots-horizontal"></i></a>
                                            <div class="dropdown-menu dropdown-menu-right">
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-pencil me-1 text-muted"></i>Edit
                                                    Contact</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-delete me-1 text-muted"></i>Remove</a>
                                                <a class="dropdown-item" href="#"><i
                                                        class="mdi mdi-email me-1 text-muted"></i>Send
                                                    Email</a>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- end row -->

</div>
<!-- container -->


<?php include 'footer.php'; ?>