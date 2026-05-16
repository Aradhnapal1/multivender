<?php include 'header.php'; ?>

<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Bank Details</h4>

                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Bank Details</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Bank Account Information</h4>
                        <p class="mb-0 text-muted">Enter your bank details for receiving payouts securely.</p>
                    </div>
                    <div class="card-body">
                        <form id="bankDetailsForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="accountHolderName">Account Holder Name</label>
                                    <input type="text" class="form-control" id="accountHolderName" name="accountHolderName" placeholder="Enter account holder name">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="bankName">Bank Name</label>
                                    <input type="text" class="form-control" id="bankName" name="bankName" placeholder="Enter bank name">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="accountNumber">Account Number</label>
                                    <input type="text" class="form-control" id="accountNumber" name="accountNumber" placeholder="Enter account number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="ifscCode">IFSC Code</label>
                                    <input type="text" class="form-control" id="ifscCode" name="ifscCode" placeholder="Enter IFSC code">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="branchName">Branch Name</label>
                                    <input type="text" class="form-control" id="branchName" name="branchName" placeholder="Enter branch name">
                                </div>
                                <!-- <div class="col-md-6 mb-3">
                                    <label class="form-label" for="accountType">Account Type</label>
                                    <select class="form-select" id="accountType" name="accountType">
                                        <option value="">Select Account Type</option>
                                        <option value="Savings">Savings</option>
                                        <option value="Current">Current</option>
                                        <option value="Overdraft">Overdraft</option>
                                    </select>
                                </div> -->
                                <div class="col-6 mb-3">
                                    <label class="form-label" for="cancelledCheque">Upload Cancelled Cheque / Passbook</label>
                                    <input type="file" class="form-control" id="cancelledCheque" name="cancelledCheque">
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button type="button" class="btn btn-dark" id="saveBankDetailsBtn">Save Bank Details</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div> <!-- end row -->
    </div> <!-- container -->
</div> <!-- content -->

 <?php include 'footer.php'; ?>