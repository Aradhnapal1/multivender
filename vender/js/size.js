// ****************************************** GET ALL SIZE  START ******************************************
const BASE_URL = "https://api.workarya.com/api";

async function loadSizes() {
  try {
    const token = localStorage.getItem("vendorToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      `${BASE_URL}/size/get`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    console.log("Size API:", data); // ✅ check response

    const tbody = document.getElementById("allsize");
    tbody.innerHTML = "";

    // agar response direct array hai
    const sizes = data.data || data;

    sizes.forEach((size, index) => {
      const row = `
                <tr>
                     <td>${index + 1}</td> <!-- ✅ S.No -->                  
                    <td>${size.name}</td>
                    <td>${size.description}</td>             
                    <td onclick="editSize('${size._id || size.id}')" style="cursor: pointer;">
                        <i class="mdi mdi-square-edit-outline text-dark fs-3"></i>
                    </td>

                  <td onclick="deleteSize('${size.id}')" style="cursor: pointer;">
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

loadSizes();
//   <td>${size.description && typeof size.description === "object" ? JSON.stringify(size.description) : size.description || "N/A"}</td>

// ****************************************** GET ALL SIZE  END ******************************************

// ******************************************* DELETE SIZE START ******************************************
async function deleteSize(id) {
  const token = localStorage.getItem("vendorToken");

  if (!token) {
    Swal.fire("Error", "Please login first", "error");
    return;
  }

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This size will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch(
      `${BASE_URL}/size/delete-size-permanent/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (res.ok) {
      await Swal.fire("Deleted!", "Size deleted successfully.", "success");
      location.reload(); // or call getAllSize() if you want to refresh table without reload
    } else {
      Swal.fire("Error", data.message || "Failed to delete size", "error");
    }
  } catch (error) {
    console.error("Error deleting size:", error);
    Swal.fire(
      "Error",
      "An error occurred while deleting the size. Please try again.",
      "error",
    );
  }
}

// ******************************************* DELETE SIZE END ******************************************




// ********************************************** ADD SIZE START ******************************************

// ********************************************** ADD SIZE START ******************************************
document.addEventListener("DOMContentLoaded", () => {

  console.log("JS Loaded ✅");

  const toggle = document.getElementById("isActive");
  const label = document.getElementById("toggleLabel");

  toggle.addEventListener("change", function () {
    label.textContent = this.checked ? "Active" : "Inactive";
  });

  document.addEventListener("click", async function (e) {

    if (e.target.closest("#addSizeBtn")) {

      try {
        const token = localStorage.getItem("vendorToken");

        if (!token) {
          Swal.fire("Error", "Please login first ❌", "error");
          return;
        }

        const name = document.getElementById("sizeName").value.trim();
        const description = document.getElementById("sizeDescription").value.trim();
        const isActive = document.getElementById("isActive").checked;

        if (!name) {
          Swal.fire("Error", "Size Name required ❌", "error");
          return;
        }

        const payload = {
          name: name,
          description: description,
          isActive: isActive,
          isDeleted: false
        };

        const res = await fetch(
          `${BASE_URL}/size/add`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        const data = await res.json();

        if (res.ok) {
          Swal.fire({
            title: "Success ✅",
            text: "Size added successfully",
            icon: "success",
            confirmButtonText: "OK"
          }).then(() => {
            window.location.href = "size.php"; 
          });

        } else {
          Swal.fire("Error", data.message || "Failed ❌", "error");
        }

      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Something went wrong ❌", "error");
      }

    }

  });

});

// ********************************************** ADD SIZE END ******************************************





// *********************************************** EDIT SIZE START **************************************

function editSize(id) {
  localStorage.setItem("editSizeId", id); // ✅ store ID
  window.location.href = "edit-size.php";
}

// **************************************** SIZE PREFILL ****************************************

document.addEventListener("DOMContentLoaded", async () => {

  const token = localStorage.getItem("vendorToken");
  const sizeId = localStorage.getItem("editSizeId");

  console.log("Edit Size ID 👉", sizeId);

  const checkbox = document.getElementById("isActive");
  const label = document.getElementById("toggleLabel");

  // ===================== TOGGLE LIVE =====================
  checkbox.addEventListener("change", () => {
    label.textContent = checkbox.checked ? "Active" : "Inactive";
  });


  // ===================== PREFILL =====================
  if (sizeId) {
    try {
      const res = await fetch(
        `${BASE_URL}/size/get`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      const sizes = data.data || data;

      const size = sizes.find(
        (item) => item.id == sizeId || item._id == sizeId
      );

      console.log("Selected Size 👉", size);

      if (!size) return;

      // ✅ PREFILL INPUT
      document.getElementById("sizeName").value = size.name || "";

      // ✅ PREFILL TEXTAREA
      document.getElementById("sizeDescription").value =
        size.description || "";

      // ✅ PREFILL CHECKBOX
      const isActiveValue =
        size.isActive === true || size.isActive === "true";

      checkbox.checked = isActiveValue;

      // ✅ LABEL FIX
      label.textContent = isActiveValue ? "Active" : "Inactive";

    } catch (error) {
      console.error("Prefill error:", error);
    }
  }

  // ===================== UPDATE =====================
  document.getElementById("addEditBtn").addEventListener("click", async () => {
    try {

      if (!token) {
        Swal.fire("Error", "Please login first ❌", "error");
        return;
      }

      if (!sizeId) {
        Swal.fire("Error", "Size ID missing ❌", "error");
        return;
      }

      const name = document.getElementById("sizeName").value.trim();
      const description = document.getElementById("sizeDescription").value.trim();
      const isActive = checkbox.checked;

      if (!name) {
        Swal.fire("Error", "Size name required ❌", "error");
        return;
      }

      const payload = {
        name,
        description,
        isActive,
        isDeleted: false
      };

      console.log("Update Payload 👉", payload);

      const res = await fetch(
       `${BASE_URL}/size/update/${sizeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          title: "Updated!",
          text: "Size updated successfully.",
          icon: "success",
        }).then(() => {
          localStorage.removeItem("editSizeId"); // ✅ clear ID
          window.location.href = "size.php";
        });
      } else {
        Swal.fire("Error", data.message || "Update failed", "error");
      }

    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  });

});
