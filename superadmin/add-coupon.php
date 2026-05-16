<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">
        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Add Coupon</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Add Coupon</li>
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
                        <p class="mb-0 text-muted">Create a new discount coupon.</p>
                    </div>
                    <div class="card-body">
                        <form id="addCouponForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="couponCode">Coupon Code <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="couponCode" placeholder="Enter Coupon Code (e.g. SAVE12)" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="discountType">Discount Type <span class="text-danger">*</span></label>
                                    <select class="form-select" id="discountType" required>
                                        <option value="percentage">Percentage</option>
                                        <option value="fixed">Fixed</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="discountValue">Discount Value <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="discountValue" placeholder="Enter Discount Value" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="minOrderAmount">Min Order Amount <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="minOrderAmount" placeholder="Min Order Amount" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="maxDiscountAmount">Max Discount Amount <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="maxDiscountAmount" placeholder="Max Discount Amount" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="usageLimit">Usage Limit <span class="text-danger">*</span></label>
                                    <input type="number" class="form-control" id="usageLimit" placeholder="E.g. 100" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="startDate">Start Date <span class="text-danger">*</span></label>
                                    <input type="datetime-local" class="form-control" id="startDate" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="endDate">End Date <span class="text-danger">*</span></label>
                                    <input type="datetime-local" class="form-control" id="endDate" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="applicableOn">Applicable Product (Optional)</label>
                                    <input type="text" class="form-control" id="applicableOn" placeholder="Enter product name or leave empty for ALL">
                                    <small class="text-muted">If left blank, it automatically applies to "all".</small>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="description">Description <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="description" rows="2" placeholder="Enter description..." required></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <div class="d-flex justify-content-end mb-3">
                <button type="button" class="btn btn-dark" id="addCouponBtn">
                    Add Coupon
                </button>
            </div>

        </div><!-- end row -->
    </div> <!-- container -->
</div> <!-- content -->

<?php include 'footer.php'; ?>