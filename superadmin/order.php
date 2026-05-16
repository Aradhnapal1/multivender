<?php include 'header.php'; ?>

<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Order</h4>


                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>

                        <li class="breadcrumb-item"><a href="order">Order</a></li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-xl-8">
                                <form
                                    class="row gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
                                    <div class="col-auto">
                                        <label for="inputPassword2" class="visually-hidden">Search</label>
                                        <input type="search" class="form-control" id="inputPassword2"
                                            placeholder="Search...">
                                    </div>
                                    <div class="col-auto">
                                        <div class="d-flex align-items-center">
                                            <label for="status-select" class="me-2">Status</label>
                                            <select class="form-select" id="status-select">
                                                <option selected>Choose...</option>
                                                <option value="1">Paid</option>
                                                <option value="2">Awaiting Authorization</option>
                                                <option value="3">Payment failed</option>
                                                <option value="4">Cash On Delivery</option>
                                                <option value="5">Fulfilled</option>
                                                <option value="6">Unfulfilled</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- <div class="col-xl-4">
                                <div class="d-flex justify-content-end align-items-center mt-xl-0 mt-2">
                                    <button type="button" class="btn btn-danger me-2"><i
                                            class="mdi mdi-basket me-1"></i> Add New Order</button>
                                    <div>
                                        <button type="button" class="btn btn-white border"><i
                                                class="mdi mdi-filter-outline me-1"></i>Filter</button>
                                    </div>
                                </div>
                            </div> -->
                            <!-- end col-->
                        </div>
                    </div> <!-- end card-body-->

                    <div class="table-responsive">
                        <table class="table table-centered table-nowrap mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th >
                                        S.No
                                    </th>
                                    <th>Order ID</th>
                                    <th>Customer Name</th>
                                    <!-- <th>Product Name</th> -->
                                    <th>Date</th>
                                    <th>Total</th>
                                    <th>Payment Status</th>
                                    <th>Order Status</th>
                                    <th>Order Detail</th>
                                    <th>Invoice</th>
                                    <!-- <th>Pdf</th> -->
                                </tr>
                            </thead>
                            <tbody id="allorder">
                                <!-- <tr>
                                    <td>
                                       1
                                    </td>
                                    <td><a href="apps-ecommerce-orders-details.html"
                                            class="text-body fw-bold">#CD2302</a> </td>
                                    <td>
                                        <div class="d-flex align-items-center gap-2">

                                            <div>
                                                <h5 class="mb-0">John Bushmill</h5>
                                                <a href="#" class="text-muted fs-6 mb-0">john_Bushmill@gmail.com</a>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        August 05 2018
                                        <h6 class="text-muted mb-0">2:20pm</h6>
                                    </td>

                                    <td>
                                        $176.41
                                    </td>
                                    <td>
                                        Mastercard
                                    </td>
                                    <td>
                                        <span class="badge bg-info-subtle text-info fs-6 fw-semibold">Shiped</span>
                                    </td>
                                    <td class="table-action">

                                        <a href="javascript:void(0);" class="action-icon"> <i
                                                class="mdi mdi-square-edit-outline"></i></a>

                                    </td>
                                    <td class="table-action">

                                        <a href="javascript:void(0);" class="action-icon"> <i
                                                class="mdi mdi-delete"></i></a>
                                    </td>
                                </tr> -->



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