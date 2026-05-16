<?php include 'header.php'; ?>
<div class="content">
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Edit Article</h4>
                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Edit Article</li>
                    </ol>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-body">
                        <form id="editArticleForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="articleTitle">Title <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="articleTitle" placeholder="Enter article title" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="articleImage">Image (Leave empty to keep existing)</label>
                                    <input type="file" class="form-control" id="articleImage" accept="image/*">
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label" for="articleDescription">Description <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="articleDescription" rows="2" placeholder="Enter article description" required></textarea>
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">Content <span class="text-danger">*</span></label>
                                    <div id="snow-editor" style="height: 200px;"></div>
                                </div>
                                <div class="col-md-12 text-center mt-3 mb-3">
                                    <img id="previewImage" src="" alt="Preview" style="display:none; max-height: 150px; margin: 0 auto; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button type="button" class="btn btn-dark" id="editArticleBtn">Update Article</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php include 'footer.php'; ?>