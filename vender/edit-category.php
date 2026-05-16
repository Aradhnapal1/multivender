<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">
        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4 id="pageTitle">Category</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item"><a href="" id="breadcrumbTitle">Category</a></li>
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
                        <p class="mb-0 text-muted">Title, short description, image...</p>
                    </div>
                    <div class="card-body">
                        <form id="addCategoryForm" enctype="multipart/form-data">
                            <input type="hidden" id="categoryId" value="">

                            <div class="mb-3">
                                <label class="form-label" for="categoryName">Category Name <span class="text-danger">*</span></label>
                                <input type="text" class="form-control" id="categoryName" placeholder="Enter category name" required>
                            </div>

                            <div class="form-check mb-3">
                                <input class="form-check-input" type="checkbox" id="isSubcategory">
                                <label class="form-check-label" for="isSubcategory">Add as Subcategory</label>
                            </div>

                            <div id="dynamicParentContainer" class="mb-3"></div>

                            <div class="mb-3">
                                <h4>Category Image</h4>
                                <div id="imageBox" class="image-box">
                                    <span id="placeholderText">Click to upload image</span>
                                    <img id="previewImage" src="" alt="Preview" />
                                    <input type="file" id="categoryImage" name="image" accept="image/*" />
                                </div>
                            </div>

                            <div class="form-check form-switch mt-3">
                                <input class="form-check-input" type="checkbox" id="isActive" checked>
                                <label class="form-check-label" for="isActive">Active</label>
                            </div>

                            <button type="submit" id="submitBtn" class="btn btn-primary mt-4">Add Category</button>
                        </form>

                        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

                        <style>
                            .image-box {
                                position: relative;
                                width: 100%;
                                height: 220px;
                                border: 2px dashed #ccc;
                                border-radius: 10px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                overflow: hidden;
                                background: #fafafa;
                            }

                            .image-box input {
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                opacity: 0;
                                cursor: pointer;
                            }

                            .image-box img {
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                                display: none;
                            }

                            #placeholderText {
                                color: #888;
                                font-size: 15px;
                            }

                            .dynamic-select {
                                margin-bottom: 15px;
                            }
                        </style>

                    </div>
                </div>
            </div>
            <!-- <div class="d-flex justify-content-end mb-3">
                <a href="category.php" class="btn btn-secondary">Back to Categories</a>
            </div> -->
        </div>
    </div>
</div>

<?php include 'footer.php'; ?>
