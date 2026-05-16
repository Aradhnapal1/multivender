document.addEventListener("DOMContentLoaded", loadVendors);

async function loadVendors() {
  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch("https://api.workarya.com/admin-vendors", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    const result = await res.json();
    if (!result.success) return;

    const tbody = document.getElementById("allvender");
    tbody.innerHTML = "";

    result.data.forEach((v, i) => {
      const isApproved = v.status === "approved";

      tbody.innerHTML += `
<tr>
    <td>${i + 1}</td>
    <td>${v.firstName} ${v.lastName}</td>
    <td>${v.sourceType}</td>
    <td>${v.phoneNumber || "-"}</td>
    <td>${v.email}</td>
   
    

    <!-- STATUS CONTROL BY TOGGLE -->
    <td>
        <div class="form-check form-switch">
            <input class="form-check-input vendor-approval-toggle"
                   type="checkbox"
                   data-id="${v.id}"
                   ${isApproved ? "checked" : ""}>
            <label class="form-check-label">
                ${isApproved ? "Approved" : "Rejected"}
            </label>
        </div>
    </td>

    <td>
       <a href="vendor-profile.php?id=${v.id}" class="btn btn-sm ">
    <i class="fa fa-eye"></i> 
</a>
    </td>

   


</tr>
`;
    });
  } catch (err) {
    console.error("Error loading vendors:", err);
  }
}

document.addEventListener("change", async function (e) {
  if (!e.target.matches(".vendor-approval-toggle")) return;

  const toggle = e.target;
  const vendorId = toggle.dataset.id;
  const label = toggle.nextElementSibling;
  const token = localStorage.getItem("superadminToken");

  const isApprove = toggle.checked;
  label.textContent = "Updating...";

  try {
    let res;

    // ✅ APPROVE
    if (isApprove) {
      res = await fetch(`https://api.workarya.com/approve-vendor/${vendorId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // ✅ REJECT
    else {
      const { value: reason } = await Swal.fire({
        title: "Reject Vendor",
        input: "text",
        inputLabel: "Rejection reason",
        inputPlaceholder: "Enter reason...",
        showCancelButton: true,
        confirmButtonText: "Reject",
      });

      if (!reason) {
        toggle.checked = true;
        label.textContent = "Approved";
        return;
      }

      const fd = new FormData();
      fd.append("reason", reason);

      res = await fetch(`https://api.workarya.com/reject-vendor/${vendorId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
    }

    const result = await res.json();
    if (!result.success) throw new Error(result.message);

    label.textContent = isApprove ? "Approved" : "Rejected";

    // ✅ SUCCESS ALERT
    Swal.fire({
      icon: "success",
      title: isApprove ? "Vendor Approved" : "Vendor Rejected",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);
    toggle.checked = !isApprove;
    label.textContent = !isApprove ? "Approved" : "Rejected";

    Swal.fire({
      icon: "error",
      title: "Action Failed",
      text: "Please try again",
    });
  }
});
