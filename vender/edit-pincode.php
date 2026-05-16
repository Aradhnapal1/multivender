<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">
        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Edit Pincode</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Edit Pincode</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Details</h4>
                        <p class="mb-0 text-muted">Update pincode delivery area details...</p>
                    </div>
                    <div class="card-body">
                        <form id="editPincodeForm">
                            <div class="mb-3">
                                <label class="form-label" for="pincodeValue">Pincode <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="pincodeValue" placeholder="Enter Pincode" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="cityName">City <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="cityName" placeholder="Enter City" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="stateName">State <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="stateName" placeholder="Enter State" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label" for="deliveryDays">Delivery Days <span class="text-danger">*</span></label>
                                <input type="number" class="form-control" id="deliveryDays" placeholder="Enter Delivery Days" required>
                            </div>
                            <div class="form-check form-switch mt-3">
                                <input class="form-check-input" type="checkbox" id="isServiceable" checked>
                                <label class="form-check-label" id="toggleLabel" for="isServiceable">Serviceable</label>
                            </div>
                        </form>
                        <style>
                            .form-check-input { accent-color: black; }
                            .form-check-input:checked { background-color: black; border-color: black; }
                            .form-check-input:focus { box-shadow: none; }
                        </style>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end mb-3">
                <button type="button" class="btn btn-dark" id="editPincodeBtn">Update Pincode</button>
            </div>
        </div><!-- end row -->
    </div> <!-- container -->
</div> <!-- content -->

<?php include 'footer.php'; ?>