const ENQUIRY_API = "https://api.workarya.com/api/enquiry/create-inquery";

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactEnquiryForm");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const name = document.getElementById("contactUsName")?.value.trim() || "";
        const email = document.getElementById("contactUsEmail")?.value.trim() || "";
        const phone = document.getElementById("contactUsPhone")?.value.trim() || "";
        const topicEl = document.getElementById("contactUsTopic");
        const topic = topicEl?.value?.trim() || "";
        const message = document.getElementById("contactUsHelpMessage")?.value.trim() || "";
        const submitBtn = form.querySelector('button[type="submit"]');

        if (!name || !email || !phone || !topic || !message) {
            if (typeof Swal !== "undefined") {
                Swal.fire("Required fields", "Please fill in all required fields.", "warning");
            } else {
                alert("Please fill in all required fields.");
            }
            return;
        }

        // API expects multipart/form-data (like Postman) with `subject` key.
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("subject", topic);
        formData.append("message", message);
        formData.append("status", "NEW");

        const originalText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sending...";
        }

        try {
            const userToken = localStorage.getItem("userToken");
            const headers = {};
            if (userToken) headers["Authorization"] = `Bearer ${userToken}`;

            const res = await fetch(ENQUIRY_API, {
                method: "POST",
                headers,
                body: formData
            });

            const data = await res.json().catch(() => ({}));

            if (res.ok && (data.success !== false)) {
                form.reset();
                if (typeof Swal !== "undefined") {
                    Swal.fire("Thank you!", data.message || "Your enquiry has been submitted successfully.", "success");
                } else if (typeof Toastify !== "undefined") {
                    Toastify({
                        text: data.message || "Enquiry submitted successfully.",
                        duration: 4000,
                        gravity: "top",
                        position: "right",
                        backgroundColor: "#28a745"
                    }).showToast();
                } else {
                    alert(data.message || "Enquiry submitted successfully.");
                }
            } else {
                const errMsg = data.message || data.error || "Failed to submit enquiry. Please try again.";
                if (typeof Swal !== "undefined") {
                    Swal.fire("Error", errMsg, "error");
                } else {
                    alert(errMsg);
                }
            }
        } catch (err) {
            console.error("Enquiry submit error:", err);
            if (typeof Swal !== "undefined") {
                Swal.fire("Error", "Network error. Please try again later.", "error");
            } else {
                alert("Network error. Please try again later.");
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText || "Send message";
            }
        }
    });
});
