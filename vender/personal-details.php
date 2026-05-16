<?php include 'header.php'; ?>

<div class="content">
    <!-- Start Content-->
    <div class="container-fluid">

        <!-- start page title -->
        <div class="row">
            <div class="col-12">
                <div class="d-flex justify-content-between align-items-center py-2">
                    <h4>Personal Details</h4>

                    <ol class="breadcrumb d-lg-flex d-none mb-0">
                        <li class="breadcrumb-item"><a href="index">Home</a></li>
                        <li class="breadcrumb-item active">Personal Details</li>
                    </ol>
                </div>
            </div>
        </div>
        <!-- end page title -->

        <div class="row">
            <div class="col-xl-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-1">Personal Information</h4>
                        <p class="mb-0 text-muted">Update your personal details, address, and profile image here.</p>
                    </div>
                    <div class="card-body">
                        <form id="personalDetailsForm">
                            <div class="row">
                                <h5 class="mb-2">Basic Info</h5>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="fullName">Full Name <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="fullName" name="fullName" placeholder="Enter your full name" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="email">Email Address <span class="text-danger">*</span></label>
                                    <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <label class="form-label" for="mobileNumber">Mobile Number <span class="text-danger">*</span></label>
                                    <input type="tel" class="form-control" id="mobileNumber" name="mobileNumber" placeholder="Enter mobile number" required>
                                </div>

                                <h5 class="mt-3 mb-2">Address Details</h5>
                                <div class="col-12 mb-3">
                                    <label class="form-label" for="address">Address <span class="text-danger">*</span></label>
                                    <textarea class="form-control" id="address" name="address" rows="2" placeholder="Enter full address" required></textarea>
                                </div>
                                <!-- <div class="col-md-3 mb-3">
                                    <label class="form-label" for="country">Country <span class="text-danger">*</span></label>
                                    <select class="form-select" id="country" name="country" required>
                                        <option value="">Select Country</option>
                                    </select>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label" for="state">State <span class="text-danger">*</span></label>
                                    <select class="form-select" id="state" name="state" required>
                                        <option value="">Select State</option>
                                    </select>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label" for="city">City <span class="text-danger">*</span></label>
                                    <select class="form-select" id="city" name="city" required>
                                        <option value="">Select City</option>
                                    </select>
                                </div>
                                <div class="col-md-3 mb-3">
                                    <label class="form-label" for="pincode">Pincode <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="pincode" name="pincode" placeholder="Enter pincode" required>
                                </div> -->

                                <h5 class="mt-3 mb-2">Profile Image</h5>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label" for="profileImage">Upload Image</label>
                                    <input type="file" class="form-control" id="profileImage" name="profileImage" accept="image/*">
                                </div>
                            </div>
                            <div class="d-flex justify-content-end mt-3">
                                <button type="button" class="btn btn-dark" id="savePersonalDetailsBtn">Save Details</button>
                            </div>
                        </form>
                        
                        <script>
                            // Dynamic Country, State, City Fetching
                            document.addEventListener("DOMContentLoaded", () => {
                                const countrySelect = document.getElementById("country");
                                const stateSelect = document.getElementById("state");
                                const citySelect = document.getElementById("city");
                                if (!countrySelect || !stateSelect || !citySelect) return;

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