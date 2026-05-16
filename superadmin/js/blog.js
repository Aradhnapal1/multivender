// ############################################# GET ALL BLOGS ###########################################

function normalizeBlogsPayload(payload) {
  return payload?.data?.data || payload?.data || payload?.blogs || payload || [];
}

function blogImagePath(blog) {
  if (!blog || typeof blog !== "object") return "";
  return (
    blog.image ||
    blog.Image ||
    blog.imageUrl ||
    blog.imageurl ||
    blog.mainImage ||
    blog.mainimage ||
    ""
  );
}

function toBlogImageUrl(path) {
  if (!path) return "https://via.placeholder.com/48";
  if (typeof window.resolveApiMediaUrl === "function") {
    return window.resolveApiMediaUrl(path);
  }
  return /^https?:\/\//i.test(path) ? path : `https://api.workarya.com${path}`;
}

function normalizeBlogDetailPayload(payload) {
  return payload?.data?.data || payload?.data || payload || null;
}


async function loadBlogs() {
  try {
    const res = await fetch("https://api.workarya.com/api/blogs");
    const raw = await res.json();
    const blogs = normalizeBlogsPayload(raw);

    console.log("BLOG API:", blogs);

    const tbody = document.getElementById("allBlogs");
    tbody.innerHTML = "";

    blogs.forEach((blog, index) => {
      const row = `
        <tr>
          <td>${index + 1}</td>

          <td>
            <img 
              src="${toBlogImageUrl(blogImagePath(blog))}"
              height="48"
              width="48"
              class="rounded"
              style="object-fit:cover"
              onerror="this.src='https://via.placeholder.com/48'"
            />
          </td>

          <td>
            <p class="m-0 font-16">${blog.title || blog.Title || "-"}</p>
          </td>

          <td>
            ${truncateWords(blog.description || blog.content || "", 10)}
          </td>

          <td>
            <span class="badge ${
              (blog.is_active ?? blog.isActive)
                ? "bg-success-subtle text-success"
                : "bg-danger-subtle text-danger"
            } p-1">
              ${(blog.is_active ?? blog.isActive) ? "Active" : "Inactive"}
            </span>
          </td>

          <td>
            <i 
              class="mdi mdi-square-edit-outline fs-4 text-primary"
              style="cursor:pointer"
              onclick="editBlog('${blog.id || blog._id}')"
            ></i>
          </td>

          <td>
            <i 
              class="mdi mdi-delete fs-4 text-danger"
              style="cursor:pointer"
              onclick="deleteBlog('${blog.id || blog._id}')"
            ></i>
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", row);
    });
  } catch (err) {
    console.error("Blog load error:", err);
  }
}

loadBlogs();


// ############################################# End GET ALL BLOGS ###########################################





// #############################################Start  delete  BLOGS ###########################################




async function deleteBlog(id) {
  const token = localStorage.getItem("superadminToken");

  const confirm = await Swal.fire({
    title: "Delete this blog?",
    text: "Are you sure you want to delete this blog?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
  });

  if (!confirm.isConfirmed) return;

  try {
    const res = await fetch(
      `https://api.workarya.com/api/blogs/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // or "token": token
        },
      }
    );

    if (!res.ok) throw new Error();

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Blog deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });

    loadBlogs(); // refresh table
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Delete failed",
      text: "Please check console or token.",
    });
    console.error(err);
  }
}

// ############################################# END DELETE BLOG ###########################################





// ############################################# Start Add BLOG ###########################################
// ############################################# ADD BLOG ###########################################



document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("addBlogBtn").addEventListener("click", async () => {
    const token = localStorage.getItem("superadminToken");

    const title = document.getElementById("blogName").value.trim();
    const content = document.getElementById("blogDescription").value.trim();
    const imageFile = document.getElementById("blogImage").files[0];
    const status = document.getElementById("isActive").checked;

    if (!title || !content || !imageFile) {
      Swal.fire({ icon: "warning", title: "All fields required" });
      return;
    }

    const formData = new FormData();

    // ✅ EXACT API FIELD NAMES
    formData.append("Title", title);
    formData.append("Content", content);
    formData.append("Image", imageFile);
    formData.append("Status", status);

    // Optional fields (send empty if you don’t have inputs)
    formData.append("Tags", "");
    formData.append("MetaTitle", title);
    formData.append("Description", content);
    formData.append("MetaDescription", content);

    try {
      const res = await fetch(
        "https://api.workarya.com/api/blogs/add",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!res.ok) throw new Error(await res.text());

     Swal.fire({
  icon: "success",
  title: "Blog added successfully",
  timer: 1200,
  showConfirmButton: false,
}).then(() => {
  window.location.href = "all-blogs.php";
});

      document.getElementById("addBlogForm").reset();
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Add failed" });
    }
  });
});


// ############################################# END ADD BLOG ###########################################








// ############################################# Start Edit BLOG ###########################################
function editBlog(id) {
  window.location.href = `edit-blog.php?id=${id}`;
}






document.addEventListener("DOMContentLoaded", async () => {
  const blogId = new URLSearchParams(window.location.search).get("id");

  if (!blogId) return;

  try {
    // Prefer detail endpoint for edit prefill
    let blog = null;
    const detailRes = await fetch(`https://api.workarya.com/api/blogs/${encodeURIComponent(blogId)}`);
    if (detailRes.ok) {
      const detailRaw = await detailRes.json();
      blog = normalizeBlogDetailPayload(detailRaw);
    }

    // Fallback to list endpoint for older API responses
    if (!blog) {
      const res = await fetch("https://api.workarya.com/api/blogs");
      const raw = await res.json();
      const blogs = normalizeBlogsPayload(raw);
      blog = blogs.find((b) => String(b.id || b._id) === String(blogId)) || null;
    }
    if (!blog) return;

    console.log("Prefill blog:", blog);

    // Prefill fields (same keys you used in table)
    document.getElementById("blogName").value = blog.title || blog.Title || "";
    document.getElementById("blogDescription").value = blog.description || blog.content || "";
    document.getElementById("isActive").checked = !!(blog.is_active ?? blog.isActive);

    const imgPath = blogImagePath(blog);
    if (imgPath) {
      const img = document.getElementById("previewImage");
      img.src = toBlogImageUrl(imgPath);
      img.style.display = "block";
      document.getElementById("placeholderText").style.display = "none";
    }

  } catch (err) {
    console.error("Prefill error:", err);
  }
});



document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("editBlogBtn");
  const token = localStorage.getItem("superadminToken");
  const blogId = new URLSearchParams(window.location.search).get("id");

  btn.addEventListener("click", async () => {
    const title = document.getElementById("blogName").value.trim();
    const content = document.getElementById("blogDescription").value.trim();
    const imageFile = document.getElementById("blogImage").files[0];
    const status = document.getElementById("isActive").checked;

    if (!title || !content) {
      Swal.fire({ icon: "warning", title: "Fill required fields" });
      return;
    }

    const formData = new FormData();
    formData.append("Title", title);
    formData.append("Content", content);
    formData.append("Status", status);
    formData.append("Tags", "");
    formData.append("MetaTitle", title);
    formData.append("Description", content);
    formData.append("MetaDescription", content);
    if (imageFile) formData.append("Image", imageFile);

    try {
      const res = await fetch(
        `https://api.workarya.com/api/blogs/${blogId}`,
        {
          method: "PUT",
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        }
      );

      // The backend returns 200 OK with {success:false, message} on logical failures
      // (for example "Blog not found"), so we must inspect the body — not just res.ok.
      let data = {};
      try { data = await res.json(); } catch (_) {}

      if (!res.ok || data.success === false) {
        const msg = data.message || `Update failed (status ${res.status})`;
        console.error("Blog update failed:", msg, data);
        Swal.fire({ icon: "error", title: "Update failed", text: msg });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Blog updated",
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "all-blogs.php";
      });

    } catch (e) {
      console.error(e);
      Swal.fire({ icon: "error", title: "Update failed", text: e?.message || "" });
    }
  });
});




// ############################################# end Edit BLOG ###########################################
