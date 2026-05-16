
<?php include 'header.php'; ?>
            <!-- ========== Topbar End ========== -->
            <div class="content">

                <!-- Start Content-->
                <div class="container-fluid">

                    <!-- start page title -->
                    <div class="row">
                        <div class="col-12">
                            <div class="d-flex justify-content-between align-items-center py-2">
                                <h4>All Enquiry</h4>


                                <ol class="breadcrumb d-lg-flex d-none mb-0">
                                    <li class="breadcrumb-item"><a href="index">Home</a></li>

                                    <li class="breadcrumb-item"><a href="">Enquiry</a></li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    <!-- end page title -->

                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-header">
                                    <div class="row">
                                        <div class="col-sm-5">
                                            <a href="javascript:void(0);" class="btn btn-danger"><i
                                                    class="mdi mdi-plus-circle me-2"></i> Add Enquiry</a>
                                        </div>
                                        <div class="col-sm-7">
                                            <div class="text-sm-end">
                                                <button type="button" class="btn btn-success me-1"><i
                                                        class="mdi mdi-cog-outline"></i></button>
                                                <button type="button" class="btn btn-light me-1">Import</button>
                                                <button type="button" class="btn btn-light">Export</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-centered w-100 nowrap mb-0">
                                        <thead class="table-light">
                                            <tr>
                                                <th class="all" style="width: 20px;">
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input"
                                                            id="customCheck1">
                                                        <label class="form-check-label"
                                                            for="customCheck1">&nbsp;</label>
                                                    </div>
                                                </th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone No.</th>
                                                <th>Subject</th>
                                                <th>Massage</th>
                                                <th>Status</th>
                                                
                                                <th>File</th>
                                                <!-- <th style="width: 120px;">Action</th> -->
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div class="form-check">
                                                        <input type="checkbox" class="form-check-input"
                                                            id="customCheck2">
                                                        <label class="form-check-label"
                                                            for="customCheck2">&nbsp;</label>
                                                    </div>
                                                </td>
                                                <td>
                                                    xyz

                                                </td>
                                                <td>
                                                    xyz@gmail.com
                                                </td>
                                                <td>
                                                    9876543210
                                                </td>

                                                <td>
                                                    Subject 1
                                                </td>

                                                <td>
                                                    This is sample massage.
                                                </td>
                                                <td>
                                                    <span
                                                        class="badge bg-success-subtle text-success p-1">Published</span>
                                                </td>
                                                <td>
                                                    <a href="javascript:void(0);">document.pdf</a>
                                                </td>

                                              
                                               
                                            </tr>



                                        </tbody>
                                    </table>
                                </div>
                            </div> <!-- end card-->
                        </div> <!-- end col -->
                    </div>
                    <!-- end row -->

                </div> <!-- container -->

            </div> <!-- content -->

            
            <?php include 'footer.php'; ?>