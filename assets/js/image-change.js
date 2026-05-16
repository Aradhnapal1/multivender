/*=====================
    Image Change js
==========================*/
var loadFile = function (event) {
    var file = event.target.files[0];
    if (!file) return;

    var allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

    if (!allowedTypes.includes(file.type)) {
        alert("Only JPEG, JPG, PNG, and GIF files are allowed.");
        event.target.value = "";
        return;
    }

    var hintEl = document.getElementById("profileImageUploadHint");
    function showHint(msg) {
        if (hintEl) {
            hintEl.textContent = msg || "";
            hintEl.style.display = msg ? "block" : "none";
        } else if (msg) {
            alert(msg);
        }
    }

    if (file.size > 4 * 1024 * 1024) {
        showHint("File must be 4 MB or smaller.");
        alert("File size exceeds 4 MB. Please choose a smaller file.");
        event.target.value = "";
        return;
    }

    (async function () {
        if (typeof createImageBitmap === "function") {
            try {
                var bmp = await createImageBitmap(file);
                var w = bmp.width;
                var h = bmp.height;
                try { bmp.close(); } catch (e) {}
                if (w > 2048 || h > 2048) {
                    showHint("Your image is " + w + "×" + h + " px. Resize to max 2048×2048 before uploading.");
                    alert("Image is too large. Please use at most 2048×2048 pixels.");
                    event.target.value = "";
                    return;
                }
            } catch (e) {
                /* continue to preview */
            }
        }

        var image = document.getElementById("output");
        if (image) {
            image.src = URL.createObjectURL(file);
        }
    })();
};
