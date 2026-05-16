async function subcategoryget() {
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

    const tbody = document.getElementById("allsubcategory");
    tbody.innerHTML = "";

    const categories = data.data || data;

    let count = 1;

 categories.forEach((category) => {

  // ✅ ONLY show if children exist
  if (category.children && category.children.length > 0) {

    category.children.forEach((child) => {

      const row = `
        <tr>
          <td>${count++}</td>

          <td>
            <img src="${category.logo || "https://via.placeholder.com/48"}"
                 class="rounded" height="48" />
          </td>

          <td>${category.name}</td> <!-- Parent -->
          <td>${child.name}</td> <!-- Subcategory -->

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

  // ❌ REMOVE THIS BLOCK COMPLETELY
  /*
  else {
    // REMOVE THIS
  }
  */

});

  } catch (error) {
    console.error("Error:", error);
  }
}

subcategoryget();





// ****************************************** END GET  API *******************************************




// ****************************************** ADD API START ********************************************

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS Loaded ✅");

  loadParentCategories();

  // IMAGE PREVIEW
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

  // TOGGLE TEXT
  const toggle = document.getElementById("isActive");
  const label = document.getElementById("toggleLabel");

  toggle.addEventListener("change", function () {
    label.textContent = this.checked ? "Active" : "Inactive";
  });

  // 🔥 BUTTON CLICK
  const btn = document.getElementById("addsubCategoryBtn");

  btn.addEventListener("click", async () => {
    console.log("Button Clicked ✅");

    try {
      const token = localStorage.getItem("superadminToken");

      if (!token) {
        alert("Login required");
        return;
      }

      const name = document.getElementById("subcategoryName").value.trim();
      const parentId = document.getElementById("parentId").value;
      const isActive = document.getElementById("isActive").checked;
      const file = document.getElementById("brandImage").files[0];

      // VALIDATION
      if (!name) {
        alert("Enter subcategory name");
        return;
      }

      if (!parentId) {
        alert("Select parent category");
        return;
      }

      // 🔥 UNIQUE SLUG (IMPORTANT FIX)
      const slug =
        name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]+/g, "") +
        "-" +
        Date.now();

      console.log("Slug 👉", slug);

      // FORM DATA
      const formData = new FormData();
      formData.append("category_name", name);
      formData.append("parent_id", parentId);
      formData.append("CategoryStatus", isActive);
      formData.append("slug", slug); // 🔥 FIX

      if (file) {
        formData.append("category_image", file);
      }

      // API CALL
      const res = await fetch(
        "https://api.workarya.com/api/category/insert",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      console.log("Response 👉", data);

      const apiData = data?.value || data;

      if (!res.ok || apiData.status === false) {
        throw new Error(apiData.message || "Failed to add");
      }

      alert("Subcategory added successfully ✅");

      // redirect
      window.location.href = "sub-category.php";

    } catch (err) {
      console.error(err);

      if (err.message.includes("duplicate")) {
        alert("Duplicate category (slug already exists) ❌");
      } else {
        alert(err.message);
      }
    }
  });
});


// 🔥 LOAD DROPDOWN
async function loadParentCategories() {
  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch(
      "https://api.workarya.com/api/category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    const categories = data.data || data;

    const select = document.getElementById("parentId");

    select.innerHTML = `<option value="">Select Category</option>`;

    categories.forEach((cat) => {
      const option = `<option value="${cat.id}">${cat.name}</option>`;
      select.insertAdjacentHTML("beforeend", option);
    });

  } catch (err) {
    console.error(err);
  }
}
