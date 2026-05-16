// Get category list, render table, handle delete, and manage add category form with dynamic dropdowns and image preview.
if (!window.categoryPageInitialized) {
    window.categoryPageInitialized = true;

    document.addEventListener("DOMContentLoaded", function () {
        const token = localStorage.getItem("superadminToken") || localStorage.getItem("vendorToken") || "";
        const categoryTableBody = document.getElementById("allcategory");

        if (!categoryTableBody) return;

        const BASE_URL = "https://api.workarya.com/api/category";
        const IMAGE_BASE_URL = "https://api.workarya.com/uploads/";

        // =========================
        // LOAD CATEGORY LIST
        // =========================
        async function loadCategories() {
            categoryTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center">Loading categories...</td>
                </tr>
            `;

            try {
                const response = await fetch(`${BASE_URL}/list`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });

                const result = await response.json();
                console.log("Category List Response:", result);

                if (!result.success || !result.data || result.data.length === 0) {
                    categoryTableBody.innerHTML = `
                        <tr>
                            <td colspan="8" class="text-center text-danger">No category data found</td>
                        </tr>
                    `;
                    return;
                }

                renderCategoryRows(result.data);
            } catch (error) {
                console.error("Category Load Error:", error);
                categoryTableBody.innerHTML = `
                    <tr>
                        <td colspan="8" class="text-center text-danger">Failed to load categories</td>
                    </tr>
                `;
            }
        }

        // =========================
        // RENDER TABLE ROWS
        // =========================
        function renderCategoryRows(categories) {
            let rows = [];
            let serial = 1;

            categories.forEach(category => {
                // 1. Main Category
                rows.push(createRow(serial++, {
                    category: category.name,
                    subCategory: "--",
                    childCategory: "--",
                    image: category.image,
                    isActive: category.isActive,
                    id: category.id,
                    hasChildren: category.children?.length > 0
                }));

                if (category.children && category.children.length > 0) {
                    category.children.forEach(subCategory => {
                        // 2. Main + SubCategory
                        rows.push(createRow(serial++, {
                            category: category.name,
                            subCategory: subCategory.name,
                            childCategory: "--",
                            image: subCategory.image || category.image,
                            isActive: subCategory.isActive,
                            id: subCategory.id,
                            hasChildren: subCategory.children?.length > 0
                        }));

                        if (subCategory.children && subCategory.children.length > 0) {
                            subCategory.children.forEach(child => {
                                // 3. Main + SubCategory + Child
                                rows.push(createRow(serial++, {
                                    category: category.name,
                                    subCategory: subCategory.name,
                                    childCategory: child.name,
                                    image: child.image || subCategory.image || category.image,
                                    isActive: child.isActive,
                                    id: child.id,
                                    hasChildren: child.children?.length > 0
                                }));

                                if (child.children && child.children.length > 0) {
                                    child.children.forEach(lastChild => {
                                        // 4. Shifted Row
                                        rows.push(createRow(serial++, {
                                            category: category.name,
                                            subCategory: child.name,
                                            childCategory: lastChild.name,
                                            image: lastChild.image || child.image || category.image,
                                            isActive: lastChild.isActive,
                                            id: lastChild.id,
                                            hasChildren: lastChild.children?.length > 0
                                        }));
                                    });
                                }
                            });
                        }
                    });
                }
            });

            categoryTableBody.innerHTML = rows.length
                ? rows.join("")
                : `
                    <tr>
                        <td colspan="8" class="text-center">No categories found</td>
                    </tr>
                `;

            attachDeleteEvents();
        }

        // =========================
        // CREATE ROW
        // =========================
        function createRow(itemNo, item) {
            const imageUrl = item.image
                ? `${IMAGE_BASE_URL}${item.image}`
                : "assets/images/products/img-1.png";

            const statusBadge = item.isActive
                ? `<span class="badge bg-success-subtle text-success p-1">Published</span>`
                : `<span class="badge bg-danger-subtle text-danger p-1">Inactive</span>`;

            const displayName =
                item.childCategory !== "--"
                    ? item.childCategory
                    : item.subCategory !== "--"
                    ? item.subCategory
                    : item.category;

            return `
                <tr>
                    <td>${itemNo}</td>

                  

                    <td>${item.category || "--"}</td>
                    <td>${item.subCategory || "--"}</td>
                    <td>${item.childCategory || "--"}</td>

                    <td>${statusBadge}</td>

                    <td class="table-action">
                        <a href="edit-category.php?id=${item.id}" class="action-icon">
                            <i class="mdi mdi-square-edit-outline"></i>
                        </a>
                    </td>

                    <td class="table-action">
                        <a href="javascript:void(0);" 
                           class="action-icon delete-category-btn" 
                           data-id="${item.id}" 
                           data-name="${displayName}"
                           data-has-children="${item.hasChildren}">
                            <i class="mdi mdi-trash-can text-danger"></i>
                        </a>
                    </td>
                </tr>
            `;
        }

        // =========================
        // DELETE BUTTON EVENTS
        // =========================
        function attachDeleteEvents() {
            document.querySelectorAll(".delete-category-btn").forEach(button => {
                button.onclick = async function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    const categoryId = this.getAttribute("data-id");
                    const categoryName = this.getAttribute("data-name");
                    const hasChildren = this.getAttribute("data-has-children") === "true";

                    if (hasChildren) {
                        Swal.fire({
                            icon: "warning",
                            title: "Cannot Delete",
                            text: `First delete child categories of "${categoryName}"`,
                            confirmButtonText: "OK"
                        });
                        return;
                    }

                    const confirmDelete = await Swal.fire({
                        title: "Are you sure?",
                        text: `You want to delete "${categoryName}"`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#6c757d",
                        confirmButtonText: "Yes, Delete it!"
                    });

                    if (confirmDelete.isConfirmed) {
                        deleteCategory(categoryId);
                    }
                };
            });
        }

        // =========================
        // DELETE CATEGORY
        // =========================
        async function deleteCategory(categoryId) {
            try {
                const response = await fetch(`${BASE_URL}/delete/${categoryId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { "Authorization": `Bearer ${token}` } : {})
                    }
                });

                const result = await response.json();
                console.log("Delete Response:", result);

                const deleteSuccess =
                    result?.value?.status === true ||
                    result?.status === true ||
                    result?.success === true;

                const deleteMessage =
                    result?.value?.message ||
                    result?.message ||
                    "Category deleted successfully";

                if (response.ok && deleteSuccess) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: deleteMessage,
                        timer: 1500,
                        showConfirmButton: false
                    });

                    loadCategories();
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Delete Failed",
                        text: deleteMessage || "Unable to delete category"
                    });
                }
            } catch (error) {
                console.error("Delete Error:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Something went wrong while deleting category"
                });
            }
        }

        // INITIAL LOAD
        loadCategories();
    });
}




// Add category page JS *************************
document.addEventListener("DOMContentLoaded", function () {

    // ==================== CONFIG ====================
    const BASE_URL = "https://api.workarya.com/api/category";
    const IMAGE_BASE_URL = "https://api.workarya.com/uploads/";
    let token = localStorage.getItem('vendorToken') || '';
    let allCategories = [];

    // ==================== LOAD CATEGORIES ====================
    async function loadCategories() {
        try {
            const res = await fetch("https://api.workarya.com/api/category/list", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const json = await res.json();
            console.log("Category List Response:", json);

            allCategories = json.data || json || [];
        } catch (err) {
            console.error("Load Categories Error:", err);
        }
    }

    // ==================== FIND CATEGORY RECURSIVELY ====================
    function findCategoryById(id, cats = allCategories) {
        for (let cat of cats) {
            if (String(cat.id) === String(id)) return cat;

            if (cat.children && cat.children.length > 0) {
                const found = findCategoryById(id, cat.children);
                if (found) return found;
            }
        }
        return null;
    }

    function getCategoryIdFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('id');
    }

    function getParentPath(categoryId, cats = allCategories, path = []) {
        for (let cat of cats) {
            if (String(cat.id) === String(categoryId)) {
                return path;
            }
            if (cat.children && cat.children.length > 0) {
                const result = getParentPath(categoryId, cat.children, [...path, cat.id]);
                if (result) return result;
            }
        }
        return null;
    }

    function fillSubcategoryPath(parentId) {
        const isSubcategoryCheckbox = document.getElementById('isSubcategory');
        if (!isSubcategoryCheckbox) return;

        const container = document.getElementById('dynamicParentContainer');
        if (!container) return;

        isSubcategoryCheckbox.checked = true;
        createDynamicDropdowns();

        const path = getParentPath(parentId) || [];
        path.forEach((value, level) => {
            const select = container.querySelector(`select[data-level="${level}"]`);
            if (select) {
                select.value = value;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        const finalLevel = path.length;
        const finalSelect = container.querySelector(`select[data-level="${finalLevel}"]`);
        if (finalSelect) {
            finalSelect.value = parentId;
            finalSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    async function loadCategoryForEdit() {
        const categoryId = getCategoryIdFromUrl();
        if (!categoryId) return;

        const category = findCategoryById(categoryId);
        if (!category) {
            console.error('Category not found for edit id', categoryId);
            return;
        }

        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) pageTitle.textContent = 'Edit Category';

        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) submitBtn.textContent = 'Update Category';

        document.getElementById('categoryId').value = categoryId;
        document.getElementById('categoryName').value = category.name || '';
        document.getElementById('isActive').checked = !!category.isActive;

        if (category.image) {
            preview.src = `${IMAGE_BASE_URL}${category.image}`;
            preview.style.display = 'block';
            placeholder.style.display = 'none';
        }

        const parentId = category.parent_id || category.parentId || '';
        if (parentId) {
            fillSubcategoryPath(parentId);
        }
    }

    // ==================== DYNAMIC DROPDOWNS ====================
    function createDynamicDropdowns() {
        const container = document.getElementById('dynamicParentContainer');
        container.innerHTML = '';

        const rootCategories = allCategories.filter(cat => !cat.parentId || cat.parentId === 0 || cat.parent_id === 0 || cat.parent_id == null);

        function addDropdown(levelCats, level = 0, selectedId = null) {
            if (!levelCats || levelCats.length === 0) return;

            const div = document.createElement('div');
            div.className = 'dynamic-select mb-3';
            div.setAttribute('data-level', level);

            const label = document.createElement('label');
            label.className = 'form-label';
            label.textContent = level === 0
                ? 'Select Root Category'
                : `Select Sub Category (Level ${level})`;

            div.appendChild(label);

            const select = document.createElement('select');
            select.className = 'form-select';
            select.setAttribute('data-level', level);

            // Default option
            const defaultOpt = document.createElement('option');
            defaultOpt.value = '';
            defaultOpt.textContent = '-- Select Category --';
            select.appendChild(defaultOpt);

            // Add options
            levelCats.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = cat.name;
                if (String(cat.id) === String(selectedId)) opt.selected = true;
                select.appendChild(opt);
            });

            // On change
            select.addEventListener('change', function () {
                const selectedValue = this.value;
                const currentLevel = parseInt(this.getAttribute('data-level'));

                // Remove all dropdowns after current level
                const allDropdowns = container.querySelectorAll('.dynamic-select');
                allDropdowns.forEach(drop => {
                    const dropLevel = parseInt(drop.getAttribute('data-level'));
                    if (dropLevel > currentLevel) {
                        drop.remove();
                    }
                });

                if (!selectedValue) return;

                const selectedCat = findCategoryById(selectedValue);

                if (selectedCat && selectedCat.children && selectedCat.children.length > 0) {
                    addDropdown(selectedCat.children, currentLevel + 1);
                }
            });

            div.appendChild(select);
            container.appendChild(div);
        }

        addDropdown(rootCategories, 0);
    }

    // ==================== SUBCATEGORY CHECKBOX ====================
    const isSubcategoryCheckbox = document.getElementById('isSubcategory');
    if (isSubcategoryCheckbox) {
        isSubcategoryCheckbox.addEventListener('change', function () {
            const container = document.getElementById('dynamicParentContainer');

            if (this.checked) {
                createDynamicDropdowns();
            } else {
                container.innerHTML = '';
            }
        });
    }

    // ==================== IMAGE PREVIEW ====================
    const fileInput = document.getElementById("categoryImage");
    const preview = document.getElementById("previewImage");
    const placeholder = document.getElementById("placeholderText");

    if (fileInput) {
        fileInput.addEventListener("change", function () {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                    preview.style.display = "block";
                    placeholder.style.display = "none";
                };
                reader.readAsDataURL(file);
            } else {
                preview.src = "";
                preview.style.display = "none";
                placeholder.style.display = "block";
            }
        });
    }

    // ==================== FORM SUBMIT ====================
    const addCategoryForm = document.getElementById('addCategoryForm');

    async function submitCategory(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const isEditMode = !!document.getElementById('categoryId')?.value;
        submitBtn.disabled = true;
        submitBtn.textContent = isEditMode ? 'Updating...' : 'Adding...';

        const formData = new FormData();
        formData.append('category_name', document.getElementById('categoryName').value.trim());
        formData.append('category_status', document.getElementById('isActive').checked);

        let parentId = '';
        const allSelects = document.querySelectorAll('#dynamicParentContainer select');
        if (allSelects.length > 0) {
            for (let i = allSelects.length - 1; i >= 0; i--) {
                if (allSelects[i].value) {
                    parentId = allSelects[i].value;
                    break;
                }
            }
        }
        formData.append('parent_id', parentId);

        const imageFile = document.getElementById('categoryImage').files[0];
        if (imageFile) {
            formData.append('category_image', imageFile);
        }

        const categoryId = document.getElementById('categoryId')?.value;
        const url = isEditMode
            ? `https://api.workarya.com/api/category/update/${categoryId}`
            : 'https://api.workarya.com/api/category/insert';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: formData
            });

            const result = await res.json();
            const apiSuccess = result?.value?.success === true || result?.success === true;
            const apiMessage = result?.value?.message || result?.message || (isEditMode ? 'Category updated successfully!' : 'Category added successfully!');

            if (res.ok && apiSuccess) {
                Swal.fire({
                    title: 'Success!',
                    text: apiMessage,
                    icon: 'success',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });

                if (isEditMode) {
                    setTimeout(() => {
                        window.location.href = 'category.php';
                    }, 3000);
                } else {
                    this.reset();
                    preview.src = '';
                    preview.style.display = 'none';
                    placeholder.style.display = 'block';
                    document.getElementById('dynamicParentContainer').innerHTML = '';
                    document.getElementById('isSubcategory').checked = false;
                    await loadCategories();
                }
            } else {
                Swal.fire({
                    title: 'Failed',
                    text: apiMessage || (isEditMode ? 'Failed to update category' : 'Failed to add category'),
                    icon: 'error'
                });
            }
        } catch (err) {
            console.error('Category submission error:', err);
            Swal.fire({
                title: 'Error',
                text: 'Something went wrong!',
                icon: 'error'
            });
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = isEditMode ? 'Update Category' : 'Add Category';
        }
    }

    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', submitCategory);
    }

    // ==================== INIT ====================
    (async function initialLoad() {
        if (!token) {
            alert("Token not found. Please login again.");
            return;
        }

        await loadCategories();

        const editCategoryId = getCategoryIdFromUrl();
        if (editCategoryId) {
            await loadCategoryForEdit();
        }
    })();

});



