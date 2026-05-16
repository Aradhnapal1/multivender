// register.js - handles the registration form submission and API interaction for user registration.
document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registerForm");
    
   
    


    form.addEventListener("submit", async function (e) {
        // alert("Submit Event Triggered");
        e.preventDefault();

        console.log("Form Submitted ✅");
        

        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const email = document.getElementById("emailaddress").value;
        const password = document.getElementById("password").value;
        const phone = document.getElementById("phone").value;
        const checkbox = document.getElementById("checkbox-signUp");

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
            formData.append("firstname", firstname);
            formData.append("lastname", lastname);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("phone", phone);
            formData.append("role", "USER");

            // API call
            const response = await fetch("https://api.workarya.com/register", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            console.log("API Response:", data);

            if (data.success === true) {
                Swal.fire({
                    icon: "success",
                    title: "User Registered Successfully 🎉"
                })
                // .then(() => {
                //     window.location.href = "login.php"; 
                // });

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

// login.js - handles the login form submission and API interaction for user authentication.
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("password", password);

            const response = await fetch("https://api.workarya.com/api/login", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (data.success === true) {
                // ✅ Token save in localStorage
                localStorage.setItem("userToken", data.token || data.data?.token || data.data);

                // ✅ Optional: user info bhi save kar sakte ho
                if (data.user) {
                    localStorage.setItem("userData", JSON.stringify(data.user));
                }

                Swal.fire({
                    icon: "success",
                    title: "Login Successful 🎉",
                    text: data.message || "Welcome back!"
                }).then(() => {
                    const action = localStorage.getItem("postLoginAction");
                    const redirect = localStorage.getItem("postLoginRedirect");
                    localStorage.removeItem("postLoginAction");
                    localStorage.removeItem("postLoginRedirect");

                    if (action === "checkout" && redirect) {
                        const joiner = redirect.includes("?") ? "&" : "?";
                        window.location.href = `${redirect}${joiner}postLoginCheckout=1`;
                        return;
                    }

                    if (redirect) {
                        window.location.href = redirect;
                        return;
                    }

                    window.location.href = "index.php";
                });

            } else {
                Swal.fire({
                    icon: "error",
                    title: data.message || "Login Failed"
                });
            }

        } catch (error) {
            console.error("Error:", error);

            Swal.fire({
                icon: "error",
                title: "Something went wrong",
                text: "Please try again later."
            });
        }
    });
});



