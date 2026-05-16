<?php include 'header.php'; ?>
<div class="content" id="productEditPage">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Product Edit</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="product.php">Products</a></li>
                        <li class="breadcrumb-item active">Edit</li>
                    </ol>
                </div>
            </div>
        </div>

        <input type="hidden" id="ProductId">

        <div class="row">
            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Details</h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label class="form-label" for="name">Product Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Product Name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="ShortDescription">Short Description</label>
                            <input type="text" class="form-control" id="ShortDescription" placeholder="Short Description">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="Description">Description</label>
                            <textarea class="form-control" id="Description" rows="8" placeholder="Long description"></textarea>
                        </div>

                        <div class="mb-2">
                            <label class="form-label">Current Main Image</label><br>
                            <img id="existingMainImage" src="" alt="Main" style="display:none;max-width:180px;border-radius:8px;">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="MainImage">Replace Main Image</label>
                            <input type="file" id="MainImage" data-plugins="dropify" data-height="260" accept="image/*">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Current Gallery Images</label>
                            <div id="existingGalleryImages"></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="GalleryImages">Add/Replace Gallery Images</label>
                            <input type="file" id="GalleryImages" data-plugins="dropify" data-height="120" multiple accept="image/*">
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-xl-6">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Properties</h4>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label" for="Sku">SKU</label>
                                    <input type="text" class="form-control" id="Sku" placeholder="SKU code">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="StockQuantity">Stock Quantity</label>
                                    <input type="number" id="StockQuantity" class="form-control" value="0">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="MinStockQuantity">Min Stock Quantity</label>
                                    <input type="number" id="MinStockQuantity" class="form-control" value="0">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="ColorId">Color</label>
                                    <select class="form-select" id="ColorId">
                                        <option value="">Select Color</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label" for="SizeId">Size</label>
                                    <select class="form-select" id="SizeId">
                                        <option value="">Select Size</option>
                                    </select>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="mb-3">
                                    <label class="form-label" for="BrandId">Brand</label>
                                    <select class="form-select" id="BrandId">
                                        <option value="">Select Brand</option>
                                    </select>
                                </div>
                                <input type="hidden" id="CategoryId">
                                <input type="hidden" id="SubCategoryId">
                                <div id="CategoryLevelsContainer"></div>
                                <div class="mb-3">
                                    <label class="form-label" for="Weight">Weight</label>
                                    <input type="number" step="0.01" class="form-control" id="Weight">
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label" for="Length">Length</label>
                                    <input type="number" step="0.01" class="form-control" id="Length">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label" for="Width">Width</label>
                                    <input type="number" step="0.01" class="form-control" id="Width">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="mb-3">
                                    <label class="form-label" for="Height">Height</label>
                                    <input type="number" step="0.01" class="form-control" id="Height">
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label" for="MetaTitle">Meta Title</label>
                            <input type="text" class="form-control" id="MetaTitle">
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="MetaDescription">Meta Description</label>
                            <textarea class="form-control" id="MetaDescription" rows="2"></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label" for="MetaKeywords">Meta Keywords</label>
                            <input type="text" class="form-control" id="MetaKeywords" placeholder="keyword1, keyword2">
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="form-check mb-2">
                                    <input type="checkbox" class="form-check-input" id="TrackInventory">
                                    <label class="form-check-label" for="TrackInventory">Track Inventory</label>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check mb-2">
                                    <input type="checkbox" class="form-check-input" id="IsActive">
                                    <label class="form-check-label" for="IsActive">Sales Status (<span id="SalesStatusDisplay">Inactive</span>)</label>
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

                <div class="card mt-3">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Pricing</h4>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <label for="Price" class="form-label">Regular Price</label>
                            <input type="number" id="Price" class="form-control" step="0.01" required>
                        </div>
                        <div class="mb-3">
                            <label for="DiscountPrice" class="form-label">Discount Price</label>
                            <input type="number" id="DiscountPrice" class="form-control" step="0.01">
                        </div>
                        <div class="mb-3">
                            <label for="CostPrice" class="form-label">Cost Price</label>
                            <input type="number" id="CostPrice" class="form-control" step="0.01">
                        </div>
                        <div class="mb-3">
                            <label for="TaxPercentage" class="form-label">Tax Percentage (%)</label>
                            <input type="number" id="TaxPercentage" class="form-control" step="0.01" value="0">
                        </div>
                    </div>
                </div>

                <div class="d-flex justify-content-end mb-3">
                    <button type="button" onclick="submitProductUpdate()" class="btn btn-dark">Update Product</button>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include 'footer.php'; ?>