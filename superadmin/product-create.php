<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Product Create</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="">Product Create</a></li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Details</h4>
                        <p class="mb-0 text-muted">Title, short description, image...</p>
                    </div>
                    <div class="card-body">

                        <form action="#" id="product-form">   <!-- Form 1 -->
                            <div class="mb-3">
                                <label class="form-label" for="name">Product Name</label>
                                <input type="text" class="form-control" id="name" name="name"
                                    placeholder="Product Name" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="ShortDescription">Short Description</label>
                                <input type="text" class="form-control" id="ShortDescription" name="ShortDescription"
                                    placeholder="Short Description">
                            </div>

                            <div class="mb-3">
                                <label class="form-label" for="Description">Description</label>
                                <textarea class="form-control" id="Description" name="Description" rows="8" placeholder="Long description"></textarea>
                            </div>

                            <div class="mb-3">
                                <h4 class="mt-0">Main Image</h4>
                                <input type="file" id="MainImage" name="MainImage" data-plugins="dropify" data-height="300" accept="image/*" />
                            </div>

                            <div class="mb-3">
                                <h4 class="mt-0">Gallery Images</h4>
                                <input type="file" id="GalleryImages" name="GalleryImages[]" data-plugins="dropify" data-height="150" multiple accept="image/*" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Properties</h4>
                        <p class="mb-0 text-muted">Additional functions and attributes...</p>
                    </div>
                    <div class="card-body">
                        <form action="#" id="properties-form">   <!-- Form 2 -->
                            <div class="row">
                                <div class="col-xl-6">
                                    <div class="mb-3">
                                        <label class="form-label" for="Sku">SKU</label>
                                        <input type="text" class="form-control" id="Sku" placeholder="SKU code">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="StockQuantity">Stock Quantity</label>
                                        <input type="number" id="StockQuantity" name="StockQuantity" class="form-control" placeholder="0" value="0">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="MinStockQuantity">Min Stock Quantity</label>
                                        <input type="number" id="MinStockQuantity" name="MinStockQuantity" class="form-control" value="0">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="ColorId">Color</label>
                                        <select class="form-select" id="ColorId" name="ColorId">
                                            <option value="">Select Color</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-xl-6">
                                    <div class="mb-3">
                                        <label class="form-label" for="BrandId">Brand</label>
                                        <select class="form-select" id="BrandId" name="BrandId">
                                            <!-- Populate dynamically from DB -->
                                            <option value="">Select Brand</option>
                                        </select>
                                    </div>

                                    <input type="hidden" id="CategoryId" name="CategoryId">
                                    <input type="hidden" id="SubCategoryId" name="SubCategoryId">
                                    <div id="CategoryLevelsContainer"></div>

                                    <div class="mb-3">
                                        <label class="form-label" for="SizeId">Size</label>
                                        <select class="form-select" id="SizeId" name="SizeId">
                                            <option value="">Select Size</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="mb-3">
                                        <label class="form-label" for="MetaTitle">Meta Title</label>
                                        <input type="text" class="form-control" id="MetaTitle" name="MetaTitle">
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="MetaDescription">Meta Description</label>
                                        <textarea class="form-control" id="MetaDescription" name="MetaDescription" rows="2"></textarea>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label" for="MetaKeywords">Meta Keywords</label>
                                        <input type="text" class="form-control" id="MetaKeywords" name="MetaKeywords" placeholder="keyword1, keyword2">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="Weight">Weight (kg)</label>
                                        <input type="text" class="form-control" id="Weight" name="Weight" placeholder="0.00">
                                    </div>

                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label" for="Length">Length</label>
                                                <input type="text" class="form-control" id="Length" name="Length">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label" for="Width">Width</label>
                                                <input type="text" class="form-control" id="Width" name="Width">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="mb-3">
                                                <label class="form-label" for="Height">Height</label>
                                                <input type="text" class="form-control" id="Height" name="Height">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-4">
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="TrackInventory" checked>
                                                <label class="form-check-label" for="TrackInventory">Track Inventory</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="IsActive" checked>
                                                <label class="form-check-label" for="IsActive">Sales Status (<span id="SalesStatusDisplay">Active</span>)</label>
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <div class="form-check mb-2">
                                                <input type="checkbox" class="form-check-input" id="IsFeatured">
                                                <label class="form-check-label" for="IsFeatured">Featured</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Pricing Card -->
                <div class="col-12 mt-3">
                    <div class="card">
                        <div class="card-header">
                            <h4 class="card-title mb-1">Pricing</h4>
                            <p class="mb-0 text-muted">Price related inputs</p>
                        </div>
                        <div class="card-body">
                            <form action="#" id="pricing-form">   <!-- Form 3 -->
                                <div class="mb-3">
                                    <label for="Price" class="form-label">Regular Price</label>
                                    <input type="text" id="Price" name="Price" class="form-control" placeholder="$ 0.00" required>
                                </div>
                                <div class="mb-3">
                                    <label for="DiscountPrice" class="form-label">Discount / Sales Price</label>
                                    <input type="text" id="DiscountPrice" name="DiscountPrice" class="form-control" placeholder="$ 0.00">
                                </div>
                                <div class="mb-3">
                                    <label for="CostPrice" class="form-label">Cost Price</label>
                                    <input type="text" id="CostPrice" name="CostPrice" class="form-control" placeholder="$ 0.00">
                                </div>
                                <div class="mb-3">
                                    <label for="TaxPercentage" class="form-label">Tax Percentage (%)</label>
                                    <input type="number" id="TaxPercentage" name="TaxPercentage" class="form-control" step="0.01" value="0">
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end mt-3 mb-3">
                    <button type="button" onclick="submitProduct()" class="btn btn-dark">Create Product</button>
                </div>
            </div>
        </div><!-- end row -->
    </div> <!-- container -->

</div> <!-- content -->

<?php include 'footer.php'; ?>