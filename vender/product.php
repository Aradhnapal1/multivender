<?php include 'header.php'; ?>
<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Product</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="">Product</a></li>
                    </ol>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-header">
                        <div class="row align-items-center g-2">
                            <div class="col-md-4">
                                <a href="product-create.php" class="btn btn-dark"><i
                                        class="mdi mdi-plus-circle me-2"></i> Add Products</a>
                            </div>
                            <div class="col-md-8">
                                <div class="d-flex flex-wrap gap-1 justify-content-md-end">
                                    <button type="button" class="btn btn-primary" id="openFilterBtn"
                                        data-bs-toggle="modal" data-bs-target="#filterModal">
                                        <i class="mdi mdi-filter-variant me-1"></i> Filter
                                    </button>
                                    <button type="button" class="btn btn-warning text-dark d-none" id="openBulkUpdateBtn"
                                        data-bs-toggle="modal" data-bs-target="#bulkUpdateModal">
                                        <i class="mdi mdi-pencil-box-multiple-outline me-1"></i>
                                        Bulk Update <span class="badge bg-dark ms-1" id="bulkSelectedCount">0</span>
                                    </button>
                                    <button type="button" class="btn btn-light" data-bs-toggle="modal" data-bs-target="#importModal">Import</button>
                                    <button type="button" class="btn btn-light" id="exportProductsBtn">
                                        <i class="mdi mdi-download-outline me-1"></i>Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="mt-2 small text-muted d-flex flex-wrap gap-2" id="filterSummary" style="display:none !important;">
                            <span class="fw-semibold">Active filters:</span>
                            <span id="filterChips"></span>
                            <a href="javascript:void(0)" id="clearFiltersLink" class="text-danger">Clear</a>
                        </div>

                        <div class="mt-3 d-flex flex-wrap align-items-center justify-content-between gap-2">
                            <div class="d-flex align-items-center gap-2 flex-grow-1" style="max-width: 360px;">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text bg-white"><i class="mdi mdi-magnify"></i></span>
                                    <input type="search" id="productSearchInput" class="form-control"
                                        placeholder="Search name, SKU, category, brand…">
                                </div>
                            </div>

                            <div class="d-flex align-items-center gap-2">
                                <label class="small text-muted mb-0" for="pageSizeSelect">Show</label>
                                <select id="pageSizeSelect" class="form-select form-select-sm" style="width:auto;">
                                    <option value="25">25</option>
                                    <option value="50" selected>50</option>
                                    <option value="100">100</option>
                                    <option value="250">250</option>
                                    <option value="all">All</option>
                                </select>
                                <span class="small text-muted" id="pageInfo"></span>
                            </div>

                            <nav>
                                <ul class="pagination pagination-sm mb-0" id="pageLinks"></ul>
                            </nav>
                        </div>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-centered w-100 nowrap mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th style="width: 36px;">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="selectAllRows">
                                        </div>
                                    </th>
                                    <th>S.No</th>
                                    <th>Product</th>
                                    <th>Short Description</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Brand</th>
                                    <th>Discount Price</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody id="allproduct"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="importModal" tabindex="-1" aria-labelledby="importModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="importModalLabel">Import Products</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="importForm">
                    <div class="mb-3">
                        <label for="excelFile" class="form-label">Upload Excel Sheet</label>
                        <input class="form-control" type="file" id="excelFile" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" required>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-primary" id="uploadExcelBtn">Upload</button>
            </div>
        </div>
    </div>
</div>

<!-- Filter Modal -->
<div class="modal fade" id="filterModal" tabindex="-1" aria-labelledby="filterModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="filterModalLabel">Filter Products</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <p class="text-muted small mb-2">
                    Add one or more conditions. All conditions are combined with <b>AND</b>.
                    For ranges, use <b>greater than</b> / <b>less than</b> (or <b>between</b>) on the Price, Discount Price or Quantity fields.
                </p>
                <div id="filterRows"></div>
                <button type="button" class="btn btn-sm btn-outline-primary mt-2" id="addFilterRowBtn">
                    <i class="mdi mdi-plus"></i> Add Condition
                </button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light me-auto" id="resetFilterBtn">Reset</button>
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" id="applyFilterBtn">Apply</button>
            </div>
        </div>
    </div>
</div>

<!-- Bulk Update Modal -->
<div class="modal fade" id="bulkUpdateModal" tabindex="-1" aria-labelledby="bulkUpdateModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="bulkUpdateModalLabel">Bulk Update Products</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info small mb-3" id="bulkUpdateInfo">
                    This will update <b><span id="bulkUpdateTargetCount">0</span></b> of your product(s).
                </div>
                <div class="row g-3">
                    <div class="col-md-6">
                        <label class="form-label">New Price (₹)</label>
                        <input type="number" class="form-control" id="bulkPrice" placeholder="Leave blank to skip" step="0.01" min="0">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">New Discount Price (₹)</label>
                        <input type="number" class="form-control" id="bulkDiscountPrice" placeholder="Leave blank to skip" step="0.01" min="0">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">New Stock Quantity</label>
                        <input type="number" class="form-control" id="bulkStockQuantity" placeholder="Leave blank to skip" step="1" min="0">
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Status</label>
                        <select class="form-select" id="bulkIsActive">
                            <option value="">-- Don't change --</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Featured</label>
                        <select class="form-select" id="bulkIsFeatured">
                            <option value="">-- Don't change --</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
                <div class="form-check mt-3">
                    <input class="form-check-input" type="checkbox" id="bulkApplyToAllFiltered">
                    <label class="form-check-label small" for="bulkApplyToAllFiltered">
                        Apply to <b>all filtered</b> products (ignore row selection, use every product matching the current filter)
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" id="runBulkUpdateBtn">Apply Bulk Update</button>
            </div>
        </div>
    </div>
</div>

<?php include 'footer.php'; ?>
