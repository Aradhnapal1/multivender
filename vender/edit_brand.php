<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Edit Brand </h4>


                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>


                        <li class="breadcrumb-item"><a href=""> Edit Brand </a></li>
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

                        <form action="#" id="addBrandForm">

                            <!-- Product Name -->
                            <div class="mb-3">
                                <label class="form-label" for="brandName">Product Name</label>
                                <input type="text" class="form-control" id="brandName" name="brandName"
                                    placeholder="Product Name">
                            </div>

                            <!-- Content -->
                            <div class="mb-3">
                                <label class="form-label" for="brandDescription">Description</label>
                                <textarea class="form-control" id="brandDescription" name="brandDescription" rows="4"
                                    placeholder="Brand Description">

    </textarea>
                            </div>
                            <!-- <div class="mb-3">
                                <h4 class="mt-0">Content</h4>
                                <div class="mb-2">
                                    <div id="snow-editor" style="height: 300px;">
                                        <h3>Write Something Here</h3>
                                    </div>
                                </div>
                            </div> -->

                            <!-- Image -->
                            <!-- <div class="mb-3">
                                <h4 class="mt-0">Images</h4>
                                <input type="file" id="brandImage" name="image" />
                            </div> -->
                            <div class="mb-3">
                                <h4 class="mt-0">Images</h4>

                                <div id="imageBox" class="image-box">
                                    <span id="placeholderText">Click to upload image</span>
                                    <img id="previewImage" src="" />
                                    <input type="file" id="brandImage" name="image" accept="image/*" />
                                </div>
                            </div>
                            <style>
                                .image-box {
                                    position: relative;
                                    width: 100%;
                                    height: 200px;
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
                                    /* 🔥 IMPORTANT */
                                    display: none;
                                }

                                #placeholderText {
                                    color: #888;
                                    font-size: 14px;
                                }
                            </style>
                            <script>
                                const fileInput = document.getElementById("brandImage");
                                const preview = document.getElementById("previewImage");
                                const placeholder = document.getElementById("placeholderText");

                                fileInput.addEventListener("change", function () {
                                    const file = this.files[0];

                                    if (file) {
                                        const reader = new FileReader();

                                        reader.onload = function (e) {
                                            preview.src = e.target.result;
                                            preview.style.display = "block";
                                            placeholder.style.display = "none";
                                        };

                                        reader.readAsDataURL(file);
                                    }
                                });
                            </script>
                            <!-- <div class="mb-3">
                                <h4 class="mt-0">Images</h4>

                                <input type="file" data-plugins="dropify" data-height="300" />
                            </div> -->

                            <!-- Toggle -->
                            <div class="form-check form-switch mt-3">
                                <input class="form-check-input" type="checkbox" id="isActive" checked>
                                <label class="form-check-label" id="toggleLabel" for="isActive">
                                    Active
                                </label>
                            </div>

                        </form>


                        <script>
                            const toggle = document.getElementById("isActive");
                            const label = document.getElementById("toggleLabel");

                            toggle.addEventListener("change", function () {
                                label.textContent = this.checked ? "Active" : "Inactive";
                            });
                            const style = document.createElement("style");
                            style.innerHTML = `
.form-check-input {
    accent-color: black;
}
.form-check-input:checked {
    background-color: black;
    border-color: black;
}
.form-check-input:focus {
    box-shadow: none;
}`;
                            document.head.appendChild(style);

                        </script>

                    </div>

                </div>
            </div>
            <div class="d-flex justify-content-end mb-3">
                <!-- IMPORTANT: type="button" -->
                <button type="button" class="btn btn-dark" id="editBrandBtn">
                    Edit Brand
                </button>
            </div>



        </div><!-- end row -->
    </div> <!-- container -->

</div> <!-- content -->


<?php include 'footer.php'; ?>