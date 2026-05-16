const token = localStorage.getItem("superadminToken");
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("resetPassword");
    form.addEventListener("submit",async function(e){
        e.preventDefault();

        console.log("Form Submitted ✅");
        const email = document.getElementById("emailaddress").value;
        const password = document.getElementById("password").value;
        const checkbox = document.getElementById("checkbox-remember");

        if (!checkbox.checked) {
            Swal.fire({
                icon: "warning",
                title: "Please accept Terms & Conditions"
            });
            return;
        }

        try {
           
            // FormData create
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);


            const response = await fetch("https://api.workarya.com/api/resetpasswordadmin", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            console.log("API Response:", data);

            if (data.success === true) {
                Swal.fire({
                    icon: "success",
                    title: "Password Reset Successfully 🎉"
                });

                form.reset();
            } else {
                Swal.fire({
                    icon: "error",
                    title: data.message || "Password Reset Failed"
                });
            }
            
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Server Error"
            });
            
        }
    })
})
