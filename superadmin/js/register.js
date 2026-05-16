document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        console.log("Form Submitted ✅");

        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("emailaddress").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const role = document.getElementById("role").value;

        const checkbox = document.getElementById("checkbox-signUp");

        if (!checkbox.checked) {
            Swal.fire({
                icon: "warning",
                title: "Please accept Terms & Conditions"
            });
            return;
        }

        if (!role) {
            Swal.fire({
                icon: "warning",
                title: "Please select a role"
            });
            return;
        }

        try {
            // FormData create
            const formData = new FormData();
            formData.append("firstname", firstname);
            formData.append("lastname", lastname);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("role", role.toUpperCase()); // ✅ role added dynamically ("USER", "ADMIN", "SUPERADMIN")

            // ✅ Determine API URL based on role
            let apiUrl = "https://api.workarya.com/register";
            if (role === "admin" || role === "vendor") {
                apiUrl = "https://api.workarya.com/admin-vendors";
            }

            // API call
            const response = await fetch(apiUrl, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            console.log("API Response:", data);

            if (data.success === true) {
                Swal.fire({
                    icon: "success",
                    title: "User Registered Successfully 🎉"
                }).then(() => {
                    window.location.href = "index.php"; // ✅ redirect here
                });

                form.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.message || "Registration Failed"
                });
            }

        } catch (error) {
            console.error("Error:", error);

            Swal.fire({
                icon: "error",
                title: "Server Error"
            });
        }

    });

});
