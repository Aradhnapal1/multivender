const uploadExcel = "https://api.workarya.com/api/products/upload-excel";

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("superadminToken");

    const uploadBtn = document.getElementById("uploadExcelBtn"); // button outside form
    const fileInput = document.getElementById("excelFile");
    const form = document.getElementById("uploadExcelForm"); // actual form

    if (!uploadBtn) {
        console.error("Upload button not found");
        return;
    }

    if (!fileInput) {
        console.error("File input not found");
        return;
    }

    uploadBtn.addEventListener("click", async function (e) {
        e.preventDefault();

        console.log("Upload Button Clicked ✅");

        const file = fileInput.files[0];

        // Token check
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Unauthorized ❌",
                text: "Token not found. Please login again."
            });
            return;
        }

        // File check
        if (!file) {
            Swal.fire({
                icon: "warning",
                title: "No File Selected ⚠️",
                text: "Please select an Excel file first."
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(uploadExcel, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            let data;
            try {
                data = await response.json();
            } catch {
                data = { message: "Invalid server response" };
            }

            console.log("API Response:", data);

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Excel File Uploaded Successfully 🎉",
                    text: data.message || "Upload completed successfully."
                });

                // reset only if form exists
                if (form) {
                    form.reset();
                } else {
                    fileInput.value = "";
                }

            } else {
                Swal.fire({
                    icon: "error",
                    title: "Upload Failed ❌",
                    text: data.message || "An error occurred while uploading the file."
                });
            }

        } catch (error) {
            console.error("Upload Error:", error);
            Swal.fire({
                icon: "error",
                title: "Server Error ❌",
                text: error.message || "Something went wrong"
            });
        }
    });
});
