document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("vendorToken");
    if (!token) return;

    const BASE_URL = "https://api.workarya.com/api/artical";
    const IMAGE_BASE_URL = "https://api.workarya.com";

    // ==============================================================
    // 1. List Articles & Delete
    // ==============================================================
    const articleTable = document.getElementById("allArticleTableBody");
    if (articleTable) {
        loadArticles();
    }

    async function loadArticles() {
        articleTable.innerHTML = `<tr><td colspan="7" class="text-center">Loading articles...</td></tr>`;
        try {
            const res = await fetch(`${BASE_URL}/get-all`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const json = await res.json();
            let data = [];
            
            if (json.success && json.data) data = json.data;
            else if (Array.isArray(json)) data = json;
            else if (json.data) data = json.data;
            else data = json;

            articleTable.innerHTML = "";
            if (!Array.isArray(data) || data.length === 0) {
                articleTable.innerHTML = `<tr><td colspan="7" class="text-center">No articles found.</td></tr>`;
                return;
            }
            
            data.forEach((item, index) => {
                const imgUrl = item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : IMAGE_BASE_URL + item.imageUrl) : "assets/images/product/placeholder.png";
                
                articleTable.innerHTML += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <img src="${imgUrl}" class="rounded" height="50" width="50" style="object-fit: cover;" alt="Article Image">
                        </td>
                        <td>${item.title || '--'}</td>
                        <td>${item.slug || '--'}</td>
                        <td>${item.description ? item.description.substring(0, 45) + '...' : '--'}</td>
                        <td class="table-action"><a href="edit-artical.php?id=${item.id}" class="action-icon"><i class="mdi mdi-square-edit-outline fs-3 text-primary"></i></a></td>
                        <td class="table-action"><a href="javascript:void(0);" onclick="deleteArticle('${item.id}')" class="action-icon"><i class="mdi mdi-trash-can text-danger fs-3"></i></a></td>
                    </tr>
                `;
            });
        } catch (e) {
            console.error("Error loading articles:", e);
            articleTable.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Failed to load articles.</td></tr>`;
        }
    }

    window.deleteArticle = async function (id) {
        const confirmDel = await Swal.fire({
            title: "Are you sure?",
            text: "This article will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Yes, Delete it!"
        });

        if (confirmDel.isConfirmed) {
            try {
                const res = await fetch(`${BASE_URL}/delete/${id}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                });
                const data = await res.json();
                if (res.ok) {
                    Swal.fire("Deleted!", "Article deleted successfully.", "success");
                    loadArticles();
                } else {
                    Swal.fire("Error", data.message || "Failed to delete article", "error");
                }
            } catch (e) {
                console.error(e);
                Swal.fire("Error", "Something went wrong.", "error");
            }
        }
    };

    // ==============================================================
    // 2. Form Data Handling (Image Preview & Quill setup)
    // ==============================================================
    let quillEditor;
    const snowEditor = document.getElementById('snow-editor');
    if (snowEditor) {
        try { 
            if (typeof Quill !== 'undefined') {
                quillEditor = new Quill('#snow-editor', { theme: 'snow' }); 
            }
        } catch(e) { console.warn("Quill initialization failed:", e); }
    }

    const fileInput = document.getElementById("articleImage");
    const previewImage = document.getElementById("previewImage");
    if (fileInput && previewImage) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImage.src = e.target.result;
                    previewImage.style.display = "block";
                };
                reader.readAsDataURL(file);
            } else {
                previewImage.src = "";
                previewImage.style.display = "none";
            }
        });
    }

    // ==============================================================
    // 3. Add Article Logic
    // ==============================================================
    const addBtn = document.getElementById("addArticleBtn");
    if (addBtn) {
        addBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitArticleForm("POST", `${BASE_URL}/add`, addBtn, "Add Article");
        });
    }

    // ==============================================================
    // 4. Edit Article Logic
    // ==============================================================
    const editBtn = document.getElementById("editArticleBtn");
    if (editBtn) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        
        if (id) {
            fetch(`${BASE_URL}/get-all`, { headers: { "Authorization": `Bearer ${token}` } })
                .then(r => r.json())
                .then(json => {
                    let data = [];
                    if (json.success && json.data) data = json.data;
                    else if (Array.isArray(json)) data = json;
                    else if (json.data) data = json.data;
                    else data = json;
                    
                    const item = data.find(d => String(d.id) === String(id));
                    if (item) {
                        document.getElementById("articleTitle").value = item.title || "";
                        document.getElementById("articleDescription").value = item.description || "";
                        
                        const qlEditor = document.querySelector('#snow-editor .ql-editor');
                        if (qlEditor) {
                            qlEditor.innerHTML = item.content || "";
                        } else if (quillEditor) {
                            quillEditor.root.innerHTML = item.content || "";
                        }
                        
                        if (item.imageUrl && previewImage) {
                            previewImage.src = item.imageUrl.startsWith('http') ? item.imageUrl : IMAGE_BASE_URL + item.imageUrl;
                            previewImage.style.display = "block";
                        }
                    }
                }).catch(err => console.error("Error loading article details", err));
        }

        editBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            await submitArticleForm("PUT", `${BASE_URL}/update/${id}`, editBtn, "Update Article");
        });
    }

    // Reusable Form Submit Handler (used by both Add & Edit)
    async function submitArticleForm(method, url, btnElement, originalBtnText) {
        const title = document.getElementById("articleTitle").value.trim();
        const description = document.getElementById("articleDescription").value.trim();
        const qlEditor = document.querySelector('#snow-editor .ql-editor');
        const content = qlEditor ? qlEditor.innerHTML.trim() : (quillEditor ? quillEditor.root.innerHTML.trim() : "");
        const imageFile = document.getElementById("articleImage").files[0];

        if (!title || !description || !content || content === "<p><br></p>" || content === "") {
            Swal.fire("Warning", "Please fill all required fields (Title, Description, Content)", "warning");
            return;
        }

        if (method === "POST" && !imageFile) {
            Swal.fire("Warning", "Please upload an image for the article", "warning");
            return;
        }

        btnElement.disabled = true;
        btnElement.textContent = "Saving...";
        
        const formData = new FormData();
        formData.append("Title", title);
        formData.append("Description", description);
        formData.append("Content", content);
        if (imageFile) {
            formData.append("image", imageFile); 
        }

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            
            const data = await res.json();
            
            if (res.ok && (data.success || data.status || (data.message && data.message.toLowerCase().includes('success')))) {
                await Swal.fire("Success", `Article successfully ${method === 'POST' ? 'added' : 'updated'}`, "success");
                window.location.href = "all-article.php";
            } else {
                Swal.fire("Error", data.message || "Failed to save article", "error");
            }
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "Something went wrong while saving", "error");
        } finally {
            btnElement.disabled = false;
            btnElement.textContent = originalBtnText;
        }
    }
});