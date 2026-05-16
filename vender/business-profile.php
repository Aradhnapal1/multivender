<?php include 'header.php'; ?>

<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Business Profile</h4>

                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Business Profile</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Business Information</h4>
                        <p class="mb-0 text-muted">Update your business details, contact information, and documents here.</p>
                    </div>
                    <div class="card-body">
                        <form id="businessProfileForm">
                            <div class="row">
                                <h5 class="mb-2">Business Information</h5>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessName">Business Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="businessName" name="businessName" placeholder="Enter business name" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessPhone">Business Phone <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="businessPhone" name="businessPhone" placeholder="Enter mobile number" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="alternatePhone">Alternate Phone</label>
                                    <input type="tel" class="form-control" id="alternatePhone" name="alternatePhone" placeholder="Enter alternate number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessEmail">Business Email</label>
                                    <input type="email" class="form-control" id="businessEmail" name="businessEmail" placeholder="Enter business email">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessWebsite">Business Website</label>
                                    <input type="url" class="form-control" id="businessWebsite" name="businessWebsite" placeholder="https://www.example.com">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessType">Business Type</label>
                                    <input type="text" class="form-control" id="businessType" name="businessType" placeholder="e.g. Private Limited">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessCategory">Business Category</label>
                                    <input type="text" class="form-control" id="businessCategory" name="businessCategory" placeholder="e.g. IT Services">
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label" for="businessDescription">Business Description</label>
                                    <textarea class="form-control" id="businessDescription" name="businessDescription" rows="2" placeholder="Describe your business"></textarea>
                                </div>

                                <h5 class="mt-3 mb-2">Business Address</h5>
                                <div class="col-12 mb-3">
                                    <label class="form-label" for="businessAddress">Address Line 1 <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="businessAddress" name="businessAddress" rows="2" placeholder="Enter address line 1" required></textarea>
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label" for="businessAddressLine2">Address Line 2</label>
                                    <input type="text" class="form-control" id="businessAddressLine2" name="businessAddressLine2" placeholder="Enter address line 2">
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="businessCountry">Business Country <span class="text-danger">*</span></label>
                                    <select class="form-select" id="businessCountry" name="businessCountry" required>
                                        <option value="">Select Country</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="businessState">Business State <span class="text-danger">*</span></label>
                                    <select class="form-select" id="businessState" name="businessState" required>
                                        <option value="">Select State</option>
                                    </select>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="businessCity">Business City <span class="text-danger">*</span></label>
                                    <select class="form-select" id="businessCity" name="businessCity" required>
                                        <option value="">Select City</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessPincode">Business Pincode</label>
                                    <input type="text" class="form-control" id="businessPincode" name="businessPincode" placeholder="Enter pincode">
                                </div>

                                <h5 class="mt-3 mb-2">Legal & Documents</h5>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="addressProofType">Address Proof <span class="text-danger">*</span></label>
                                    <select class="form-select" id="addressProofType" name="addressProofType" required>
                                        <option value="">Select Address Proof</option>
                                        <option value="Electricity Bill">Electricity Bill</option>
                                        <option value="Rent Agreement">Rent Agreement</option>
                                        <option value="Passport">Passport</option>
                                        <option value="Voter ID">Voter ID</option>
                                        <option value="Driving License">Driving License</option>
                                        <option value="Property Tax Receipt">Property Tax Receipt</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" id="addressProofImageLabel" for="addressProofImage">Address Proof Image <span class="text-danger">*</span></label>
                                    <input type="file" class="form-control" id="addressProofImage" name="addressProofImage" accept="image/*, .pdf" required>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="aadharNumber">Aadhar Card Number</label>
                                    <input type="text" class="form-control" id="aadharNumber" name="aadharNumber" placeholder="Enter Aadhar number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="aadharImage">Aadhar Card Image Front/Back <span class="text-danger">*</span></label>
                                    <input type="file" class="form-control" id="aadharImage" name="aadharImage" accept="image/*, .pdf" multiple required>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="gstNumber">GST Number</label>
                                    <input type="text" class="form-control" id="gstNumber" name="gstNumber" placeholder="Enter GST number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="gstPdf">GST PDF Upload <span class="text-danger">*</span></label>
                                    <input type="file" class="form-control" id="gstPdf" name="gstPdf" accept=".pdf" required>
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="panNumber">PAN Number</label>
                                    <input type="text" class="form-control" id="panNumber" name="panNumber" placeholder="Enter PAN number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="panImage">PAN Card Image</label>
                                    <input type="file" class="form-control" id="panImage" name="panImage" accept="image/*, .pdf">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="cinNumber">CIN Number</label>
                                    <input type="text" class="form-control" id="cinNumber" name="cinNumber" placeholder="Enter CIN number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="cinCertificate">CIN Certificate</label>
                                    <input type="file" class="form-control" id="cinCertificate" name="cinCertificate" accept="image/*, .pdf">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="udyamRegistrationNumber">Udyam Registration Number</label>
                                    <input type="text" class="form-control" id="udyamRegistrationNumber" name="udyamRegistrationNumber" placeholder="Enter Udyam number">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="businessLogo">Business Logo</label>
                                    <input type="file" class="form-control" id="businessLogo" name="businessLogo" accept="image/*">
                                </div>

                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="msmeDocument">MSME (Optional)</label>
                                    <input type="file" class="form-control" id="msmeDocument" name="msmeDocument" accept="image/*, .pdf">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="otherDocument">Other (Optional)</label>
                                    <input type="file" class="form-control" id="otherDocument" name="otherDocument" accept="image/*, .pdf">
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button type="button" class="btn btn-dark" id="saveBusinessProfileBtn">Save Profile</button>
                            </div>
                        </form>
                        
                        <script>
                            document.getElementById('addressProofType').addEventListener('change', function() {
                                const label = document.getElementById('addressProofImageLabel');
                                if(this.value) {
                                    label.innerHTML = this.value + ' Image/PDF <span class="text-danger">*</span>';
                                } else {
                                    label.innerHTML = 'Address Proof Image <span class="text-danger">*</span>';
                                }
                            });

                            // Dynamic Country, State, City Fetching
                            document.addEventListener("DOMContentLoaded", () => {
                                const countrySelect = document.getElementById("businessCountry");
                                const stateSelect = document.getElementById("businessState");
                                const citySelect = document.getElementById("businessCity");

                                // Load Countries
                                fetch("https://countriesnow.space/api/v0.1/countries/iso")
                                    .then(res => res.json())
                                    .then(data => {
                                        if (!data.error) {
                                            data.data.forEach(country => {
                                                const option = document.createElement("option");
                                                option.value = country.name;
                                                option.textContent = country.name;
                                                countrySelect.appendChild(option);
                                            });
                                        }
                                    }).catch(err => console.error("Error loading countries:", err));

                                // Load States when Country changes
                                countrySelect.addEventListener("change", function() {
                                    const selectedCountry = this.value;
                                    stateSelect.innerHTML = '<option value="">Select State</option>';
                                    citySelect.innerHTML = '<option value="">Select City</option>';
                                    
                                    if (selectedCountry) {
                                        fetch("https://countriesnow.space/api/v0.1/countries/states", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ country: selectedCountry })
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (!data.error && data.data.states) {
                                                data.data.states.forEach(state => {
                                                    const option = document.createElement("option");
                                                    option.value = state.name;
                                                    option.textContent = state.name;
                                                    stateSelect.appendChild(option);
                                                });
                                            }
                                        }).catch(err => console.error("Error loading states:", err));
                                    }
                                });

                                // Load Cities when State changes
                                stateSelect.addEventListener("change", function() {
                                    const selectedCountry = countrySelect.value;
                                    const selectedState = this.value;
                                    citySelect.innerHTML = '<option value="">Select City</option>';

                                    if (selectedCountry && selectedState) {
                                        fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ country: selectedCountry, state: selectedState })
                                        })
                                        .then(res => res.json())
                                        .then(data => {
                                            if (!data.error && data.data) {
                                                data.data.forEach(city => {
                                                    const option = document.createElement("option");
                                                    option.value = city;
                                                    option.textContent = city;
                                                    citySelect.appendChild(option);
                                                });
                                            }
                                        }).catch(err => console.error("Error loading cities:", err));
                                    }
                                });
                            });
                        </script>
                    </div>
                </div>
            </div>
        </div> <!-- end row -->
    </div> <!-- container -->
</div> <!-- content -->

<?php include 'footer.php'; ?>