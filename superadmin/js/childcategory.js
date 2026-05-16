// *********************************************************GET API START *********************************************
async function childcategoryget() {
  try {
    const token = localStorage.getItem("superadminToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      "https://api.workarya.com/api/category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    console.log("Category API:", data);

    const tbody = document.getElementById("allchildcategory");
    tbody.innerHTML = "";

    const categories = data.data || data;

    let count = 1;

    categories.forEach((category) => {
      // 👉 level 1 (parent)
      if (category.children && category.children.length > 0) {
        category.children.forEach((sub) => {
          // 👉 level 2 (subcategory)
          if (sub.children && sub.children.length > 0) {
            // 👉 level 3 (child category)
            sub.children.forEach((child) => {
              const row = `
                <tr>
                  <td>${count++}</td>
                   <td>
                        <img src="${category.logo || "https://via.placeholder.com/48"}"
                             class="rounded" height="48" />
                    </td>

                  <td>${category.name}</td>
                  <td>${sub.name}</td>
                  <td>${child.name}</td>

                  <td>
                    <span class="badge ${
                      child.isActive
                        ? "bg-success-subtle text-success"
                        : "bg-danger-subtle text-danger"
                    }">
                      ${child.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td onclick="editCategory('${child.id}')" style="cursor: pointer;">
                    <i class="mdi mdi-square-edit-outline text-primary fs-3"></i>
                  </td>

                  <td onclick="deleteCategory('${child.id}')" style="cursor: pointer;">
                    <i class="mdi mdi-delete text-danger fs-3"></i>
                  </td>
                </tr>
              `;

              tbody.insertAdjacentHTML("beforeend", row);
            });
          }
        });
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

childcategoryget();

// **************************************** GET API END**************************************

// ***************************************** ADD API START ***********************************

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Loaded ✅");

  loadParentCategories();

  const parentSelect = document.getElementById("parentId");

  // 👉 Parent change → load subcategory
  parentSelect.addEventListener("change", function () {
    loadSubCategories(this.value);
  });

  // 👉 Image preview
  const fileInput = document.getElementById("brandImage");
  const preview = document.getElementById("previewImage");
  const placeholder = document.getElementById("placeholderText");

  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
      placeholder.style.display = "none";
    }
  });

  // 👉 Toggle
  const toggle = document.getElementById("isActive");
  const label = document.getElementById("toggleLabel");

  toggle.addEventListener("change", function () {
    label.textContent = this.checked ? "Active" : "Inactive";
  });

  // 🔥 BUTTON CLICK FIXED
  const btn = document.getElementById("addchildCategoryBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      console.log("Button Clicked ✅");
      addChildCategory();
    });
  } else {
    console.error("Button not found ❌");
  }
});

// ✅ LOAD PARENT CATEGORY
async function loadParentCategories() {
  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch(
      "https://api.workarya.com/api/category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    const categories = data.data || data;

    const select = document.getElementById("parentId");
    select.innerHTML = `<option value="">Select Category</option>`;

    categories.forEach((cat) => {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${cat.id}">${cat.name}</option>`,
      );
    });
  } catch (err) {
    console.error(err);
  }
}

// ✅ LOAD SUBCATEGORY
async function loadSubCategories(parentId) {
  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch(
      "https://api.workarya.com/api/category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    const categories = data.data || data;

    const subSelect = document.getElementById("subCategory");
    subSelect.innerHTML = `<option value="">Select Sub Category</option>`;

    const parent = categories.find((c) => c.id === parentId);

    if (parent && parent.children) {
      parent.children.forEach((sub) => {
        subSelect.insertAdjacentHTML(
          "beforeend",
          `<option value="${sub.id}">${sub.name}</option>`,
        );
      });
    }
  } catch (err) {
    console.error(err);
  }
}

// ✅ ADD CHILD CATEGORY
async function addChildCategory() {
  try {
    const token = localStorage.getItem("superadminToken");

    const name = document.getElementById("childcategoryName").value.trim();
    const parentId = document.getElementById("subCategory").value;
    const isActive = document.getElementById("isActive").checked;
    const file = document.getElementById("brandImage").files[0];

    if (!name) {
      alert("Enter child category name");
      return;
    }

    if (!parentId) {
      alert("Select subcategory");
      return;
    }

    // 🔥 UNIQUE SLUG FIX
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const formData = new FormData();
    formData.append("category_name", name);
    formData.append("parent_id", parentId);
    formData.append("CategoryStatus", isActive);
    formData.append("slug", slug);

    if (file) {
      formData.append("category_image", file);
    }

    const res = await fetch(
      "https://api.workarya.com/api/category/insert",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      },
    );

    const data = await res.json();
    console.log("Response 👉", data);

    if (!res.ok) throw new Error("Failed to add");

    alert("Child Category Added ✅");

    // redirect
    window.location.href = "child-category.php";
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
}

// **********************************************************END  ADD API  ***********************************

