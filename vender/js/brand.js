// ******************************************************GET BRANDS******************************************************

async function loadBrands() {
  try {
    const token = localStorage.getItem("vendorToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      "https://api.workarya.com/api/brands/list",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    console.log("Brand API:", data); // ✅ check response

    const tbody = document.getElementById("brandTableBody");
    tbody.innerHTML = "";

    // agar response direct array hai
    const brands = data.data || data;

    brands.forEach((brand, index) => {
      const row = `
                <tr>
                     <td>${index + 1}</td> <!-- ✅ S.No -->


                    <td >
                        <img src="https://api.workarya.com${brand.logo || "https://via.placeholder.com/48"} "
                             class="rounded" height="78" width="78"
    style="object-fit: contain;" />
                    </td>

                    

                    <td>${brand.name}</td>

                    <td>${brand.description}</td>

                    <td>
                        <span class="badge ${
                          brand.isActive
                            ? "bg-success-subtle text-success"
                            : "bg-danger-subtle text-danger"
                        }">
                            ${brand.isActive ? "Active" : "Inactive"}
                        </span>
                    </td>

                    <td onclick="editBrand('${brand.id}')" style="cursor: pointer;">
                        <i class="mdi mdi-square-edit-outline text-primary fs-3"></i>
                    </td>

                  <td onclick="deleteBrand('${brand.id}')" style="cursor: pointer;">
                    <i class="mdi mdi-delete text-danger fs-3"></i>
                   </td>
                </tr>
            `;

      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

loadBrands();

// {/* <td
//   onclick="window.location.href='edit_brand.php?id=${brand.id}'"
//   style="cursor: pointer;"
// >
//   <i class="mdi mdi-square-edit-outline text-primary fs-3"></i>
// </td>; */}

// ******************************************************END BRAND******************************************************

// ******************************************************DELETE BRAND START *****************************************************

async function deleteBrand(id) {
  const result = await Swal.fire({
    title: "Confirm Deletion",
    text: "This brand will be permanently removed from the system.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#000",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch(
      `https://api.workarya.com/api/brands/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();
    console.log("Delete API:", data);

    if (data.status === true || data.success === true) {
      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Brand has been deleted.",
        confirmButtonColor: "#000",
      });

      loadBrands(); // reload
    } else {
      Swal.fire("Error", data.message || "Delete failed", "error");
    }
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Something went wrong", "error");
  }
}

// ******************************************************DELETE BRAND END ******************************************************

// ******************************************************ADD BRAND START ******************************************************

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("addBrandBtn");
  const token = localStorage.getItem("superadminToken");

  if (!btn) return;

  // ✅ Quill init
  let quill;
  try {
    quill = new Quill("#snow-editor", { theme: "snow" });
  } catch (e) {
    console.warn("Quill not loaded");
  }

  btn.addEventListener("click", async function () {
    const name = document.getElementById("brandName").value.trim();
    const description = quill
      ? quill.root.innerHTML
      : document.getElementById("brandDescription").value.trim();

    const isActive = document.getElementById("isActive").checked;
    const fileInput = document.getElementById("brandImage");
    const file = fileInput.files[0];

    if (!token) {
      Swal.fire({ icon: "warning", title: "Login required" });
      return;
    }

    if (!name) {
      Swal.fire({ icon: "warning", title: "Enter brand name" });
      return;
    }

    if (!file) {
      Swal.fire({ icon: "warning", title: "Select brand image" });
      return;
    }

    // ✅ FormData for file upload
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("IsActive", isActive);

    // 🔥 .NET ke liye correct key
    formData.append("logo", file);

    try {
      Swal.fire({
        title: "Uploading...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        "https://api.workarya.com/api/brands/insert",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const data = await res.json();

      if (res.ok && (data.status === true || data.success === true)) {
        await Swal.fire({
          icon: "success",
          title: "Brand added successfully",
        });

        document.getElementById("addBrandForm").reset();
        if (quill) quill.root.innerHTML = "";

        window.location.href = "brand.php";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Insert failed",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
      console.error(err);
    }
  });
});
// ******************************************************ADD BRAND END ******************************************************

// ******************************************************EDIT BRAND START ******************************************************

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("superadminToken");
  const btn = document.getElementById("editBrandBtn");

  // Agar edit page nahi hai to exit
  if (!btn) return;

  const nameInput = document.getElementById("brandName");
  const descInput = document.getElementById("brandDescription");
  const isActiveInput = document.getElementById("isActive");

  const fileInput = document.getElementById("brandImage");
  const preview = document.getElementById("previewImage");
  const placeholder = document.getElementById("placeholderText");

  // 🔥 URL se ID lo
  const urlParams = new URLSearchParams(window.location.search);
  const brandId = urlParams.get("id");

  if (!brandId) {
    console.error("No ID found ❌");
    return;
  }

  console.log("Edit ID:", brandId);

  // =========================
  // ✅ LOAD DATA (Prefill)
  // =========================
  async function loadBrand() {
    try {
      const res = await fetch(
        `https://api.workarya.com/api/brands/list/${brandId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();
      console.log("GET API:", data);

      const brand = data.data || data;

      nameInput.value = brand.name || brand.Name || "";
      descInput.value = brand.description || brand.Description || "";
      isActiveInput.checked = brand.isActive ?? brand.IsActive ?? false;

      // 🔥 Image preview
      if (brand.logo || brand.Logo) {
        preview.src = brand.logo || brand.Logo;
        preview.style.display = "block";
        placeholder.style.display = "none";
      }
    } catch (err) {
      console.error("Load Error ❌", err);
    }
  }

  loadBrand();

  // =========================
  // ✅ UPDATE API
  // =========================
  btn.addEventListener("click", async function () {
    const token = localStorage.getItem("superadminToken");
    const file = fileInput.files[0];

    if (!token) {
      Swal.fire({ icon: "warning", title: "Login required" });
      return;
    }

    const formData = new FormData();
    formData.append("Name", nameInput.value);
    formData.append("Description", descInput.value);
    formData.append("IsActive", isActiveInput.checked);

    // ✅ only if new image selected
    if (file) {
      formData.append("logo", file); // .NET binding key
    }

    try {
      Swal.fire({
        title: "Updating...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await fetch(
        `https://api.workarya.com/api/brands/update/${brandId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`, // ❗ no Content-Type
          },
          body: formData,
        },
      );

      const data = await res.json();
      console.log("UPDATE API:", data);

      if (res.ok && (data.status === true || data.success === true)) {
        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: "Brand updated successfully",
        });

        window.location.href = "brand.php";
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  });
});

function editBrand(brandId) {
  window.location.href = `edit_brand.php?id=${brandId}`;
}
// ******************************************************EDIT BRAND END ******************************************************
