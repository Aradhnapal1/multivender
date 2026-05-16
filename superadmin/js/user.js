document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
  try {
    const token = localStorage.getItem("superadminToken");

    const res = await fetch("https://api.workarya.com/users", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    

    const result = await res.json();
    if (!result.success) return;

    const tbody = document.getElementById("alluser");
    tbody.innerHTML = "";

    result.data.forEach((u, i) => {
      const statusBadge = u.isActive
        ? `<span class="badge badge-soft-success">Active</span>`
        : `<span class="badge badge-soft-danger">Inactive</span>`;

      tbody.innerHTML += `
        <tr>
          <td>${i + 1}</td>
          <td>${u.firstName} ${u.lastName}</td>
          <td>${u.email}</td>
          <td>${u.phoneNumber || "-"}</td>
       
          <td>${new Date(u.createDate).toLocaleDateString()}</td>
          <td>${statusBadge}</td>

        </tr>
      `;
    });

  } catch (err) {
    console.error("Users load error:", err);
  }
}