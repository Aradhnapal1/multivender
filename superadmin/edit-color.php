<?php include 'header.php'; ?>
<!-- ========== Topbar End ========== -->
<div class="content">

    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Edit Color </h4>


                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>

                        <li class="breadcrumb-item"><a href=""> Edit Color </a></li>
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

                        <form action="#" id="editColorForm">

                            <!-- Color Name -->
                            <div class="mb-3">
                                <label class="form-label" for="colorName">Color Name</label>
                                <input type="text" class="form-control" id="colorName" name="colorName"
                                    placeholder="Color Name">
                            </div>






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
                <button type="button" class="btn btn-dark" id="editColorBtn">
                    Edit Color
                </button>
            </div>



        </div><!-- end row -->
    </div> <!-- container -->

</div> <!-- content -->


<?php include 'footer.php'; ?>