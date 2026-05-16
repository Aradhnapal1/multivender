// ******************************************************GET COLORS******************************************************

async function getAllColor() {
  try {
    const token = localStorage.getItem("superadminToken");

    if (!token) {
      alert("Please login first");
      return;
    }

    const res = await fetch(
      "https://api.workarya.com/api/colors/get",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    console.log("Color API:", data); // ✅ check response

    const tbody = document.getElementById("allcolor");
    tbody.innerHTML = "";

    // agar response direct array hai
    const colors = data.data || data;

    colors.forEach((color, index) => {
      const row = `
                <tr>
                     <td>${index + 1}</td> <!-- ✅ S.No -->


                   

                    <td>${color.name}</td>

                    

                    

                    <td onclick="editColor('${color.id}')" style="cursor: pointer;">
                        <i class="mdi mdi-square-edit-outline text-primary fs-3"></i>
                    </td>

                  <td onclick="deleteColor('${color.id}')" style="cursor: pointer;">
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

getAllColor();

// *****************************************************END Get COLOR ********************************************

// *****************************************************START Delete COLOR ********************************************

async function deleteColor(colorId) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This color will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  try {
    const token = localStorage.getItem("superadminToken");

    if (!token) {
      Swal.fire("Error", "Please login first", "error");
      return;
    }

    const res = await fetch(
      `https://api.workarya.com/api/colors/delete-color/${colorId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (res.ok) {
      Swal.fire("Deleted!", "Color deleted successfully.", "success");
      getAllColor(); // refresh list
    } else {
      Swal.fire("Error", data.message || "Failed to delete color", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Something went wrong!", "error");
  }
}

// *****************************************************END Delete COLOR ********************************************

// *****************************************************START ADD COLOR ********************************************

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("addColorBtn");
  const token = localStorage.getItem("superadminToken");

  if (!btn) {
    console.error("Button not found ❌");
    return;
  }

  btn.addEventListener("click", async function (e) {
    e.preventDefault(); // 🔥 stop form reload

    console.log("Button Clicked ✅");

    if (!token) {
      alert("Token missing ❌");
      return;
    }

    const name = document.getElementById("colorName").value;
    const description = document.getElementById("description")?.value || "";
    const isActive = document.getElementById("isActive").checked;

    const payload = {
      Name: name,
      Description: description,
      IsActive: isActive,
      HexCode: "#color01", // default value, adjust as needed
      IsDeleted: false, // default value, adjust as needed
    };

    console.log("Payload:", payload);

    try {
      console.log("Calling API...");

      const res = await fetch(
        "https://api.workarya.com/api/colors/insert",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("Response Status:", res.status);

      const data = await res.json();
      console.log("API Response:", data);

      if (data.status === true || data.success === true) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Color added successfully",
          confirmButtonColor: "#000",
        });

        document.getElementById("addColorForm").reset();
        window.location.href = "color.php";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Add color failed",
        });
      }
    } catch (err) {
      console.error("Fetch Error ❌", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Something went wrong",
      });
    }
  });
});

// *****************************************************END ADD COLOR ********************************************

// *****************************************************START Edit COLOR ********************************************
function editColor(colorId) {
  window.location.href = `edit-color.php?id=${colorId}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("editColorBtn");
  const token = localStorage.getItem("superadminToken");

  if (!btn) {
    console.error("Button not found ❌");
    return;
  }

  if (!token) {
    alert("Token missing ❌");
    return;
  }

  // =========================
  // 🔥 GET ID FROM URL
  // =========================
  const colorId = new URLSearchParams(window.location.search).get("id");

  if (!colorId) {
    console.error("No ID found ❌");
    return;
  }

  console.log("Edit Color ID:", colorId);

  // =========================
  // ✅ PREFILL DATA
  // =========================
  async function loadColor() {
    try {
      const res = await fetch(
        "https://api.workarya.com/api/colors/get",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await res.json();
      console.log("GET ALL API:", data);

      const colors = data?.data?.data || data?.data || data || [];

      // 🔥 FIND SELECTED COLOR
      const color = colors.find((c) => (c.id || c.Id) == colorId);

      if (!color) {
        console.error("Color not found ❌");
        return;
      }

      console.log("Matched Color:", color);

      // ✅ PREFILL INPUTS
      document.getElementById("colorName").value =
        color.name || color.Name || "";
      document.getElementById("description").value =
        color.description || color.Description || "";
      document.getElementById("isActive").checked =
        color.isActive ?? color.IsActive ?? false;
      document.getElementById("hexCode").value =
        color.hexCode || color.HexCode || "";
      document.getElementById("isDeleted").checked =
        color.isDeleted ?? color.IsDeleted ?? false;
    } catch (err) {
      console.error("Prefill Error ❌", err);
    }
  }

  loadColor();

  // =========================
  // ✅ UPDATE COLOR
  // =========================
  btn.addEventListener("click", async function (e) {
    e.preventDefault();

    console.log("Edit Button Clicked ✅");

    const name = document.getElementById("colorName").value.trim();
    const description = document.getElementById("description")?.value || "";
    const isActive = document.getElementById("isActive").checked;

    // 🔥 BASIC VALIDATION
    if (!name) {
      Swal.fire("Error", "Color name is required", "error");
      return;
    }

    const payload = {
      Name: name,
      Description: description,
      IsActive: isActive,
      HexCode: "#color01", // (optional: change if needed)
      IsDeleted: false,
    };

    console.log("Update Payload:", payload);

    try {
      const res = await fetch(
        `https://api.workarya.com/api/colors/update-color/${colorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      console.log("Response Status:", res.status);

      const data = await res.json();
      console.log("UPDATE API:", data);

      if (data.status === true || data.success === true) {
        await Swal.fire({
          icon: "success",
          title: "Success",
          text: "Color updated successfully",
          confirmButtonColor: "#000",
        });

        document.getElementById("editColorForm").reset();
        window.location.href = "color.php";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Update failed",
        });
      }
    } catch (err) {
      console.error("Update Error ❌", err);

      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
      });
    }
  });
});

// *****************************************************END Edit COLOR ********************************************
