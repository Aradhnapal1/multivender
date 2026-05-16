const getBlog = "https://api.workarya.com/api/blogs";
const imageBaseUrl = "https://api.workarya.com";
const blogDetails = "https://api.workarya.com/api/blogs/"; // Append blog ID for details
console.log("[blog.js] v=6 loaded on", window.location.href);

function blogImageUrl(path) {
  const fallback = "./assets/images/inner-page/blog/1.jpg";
  if (typeof window.resolveApiMediaUrl === "function") {
    return window.resolveApiMediaUrl(path, fallback);
  }
  if (!path) return fallback;
  const s = String(path).trim();
  if (/^https?:\/\//i.test(s)) return s;
  return imageBaseUrl + (s.startsWith("/") ? s : "/" + s);
}

const getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);

const formatBlogDate = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date)) return isoString;
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
};

// Pick the first usable image field from a blog object (API field names vary).
const pickBlogImage = (blog) => {
    if (!blog || typeof blog !== "object") return "";
    const candidates = [
        blog.image,
        blog.Image,
        blog.imageUrl,
        blog.image_url,
        blog.mainImage,
        blog.mainimage,
        blog.main_image,
        blog.thumbnail,
        blog.thumbnail_url,
        blog.cover,
        blog.cover_image,
        blog.featured_image,
        blog.featuredImage,
        blog.banner,
    ];
    for (const c of candidates) {
        if (typeof c === "string" && c.trim()) return c.trim();
    }
    return "";
};

const fillBlogDetail = (blog) => {
    if (!blog) return;

    console.log("[blog-detail] rendering blog:", blog);

    const mainImageEl = document.querySelector("#blog-detail-image img");
    const titleEl = document.getElementById("blog-detail-title");
    const metaEl = document.getElementById("blog-meta");
    const contentEl = document.getElementById("blog-detail-content");

    if (mainImageEl) {
        const rawImage = pickBlogImage(blog);
        const resolved = blogImageUrl(rawImage);
        console.log("[blog-detail] image:", { rawImage, resolved });
        mainImageEl.src = resolved;
        mainImageEl.alt = blog.title || "Blog Image";
        // Fallback if the actual image URL fails to load (broken / 404).
        mainImageEl.onerror = function () {
            if (mainImageEl.dataset.fallbackApplied === "1") return;
            mainImageEl.dataset.fallbackApplied = "1";
            mainImageEl.src = "./assets/images/inner-page/blog/1.jpg";
        };
    } else {
        console.warn("[blog-detail] #blog-detail-image img not found");
    }

    if (titleEl) titleEl.textContent = blog.title || "No Title";

    if (metaEl) {
        const publishedDate = formatBlogDate(blog.created_at || blog.updated_at);
        const category = (blog.tags && blog.tags.length && blog.tags[0]) || "Blog";

        metaEl.innerHTML = `
            <li>${category}</li>
            <li>Published on ${publishedDate}</li>
            <li>
                <form>
                    <input class="form-check-input" type="checkbox" id="checkBox">
                    <label for="checkBox" class="form-label">12 Appreciations</label>
                </form>
            </li>
        `;
    }

    if (contentEl) {
        let body = (blog.content || blog.description || "").trim();
        if (!body) body = "No description available.";

        contentEl.innerHTML = `<p>${body.replace(/\r\n|\n|\r/g, "<br>")}</p>`;
    }
};

// Extract the blog object from any response shape the API might send.
const normalizeBlogDetailPayload = (payload) => {
    if (!payload) return null;
    // Common envelopes: { data: { data: {...} } } / { data: {...} } / direct object
    const candidates = [
        payload?.data?.data,
        payload?.data?.blog,
        payload?.data,
        payload?.blog,
        payload?.result,
        payload,
    ];
    for (const c of candidates) {
        if (c && typeof c === "object" && !Array.isArray(c) && (c.title || c.id || c.image)) {
            return c;
        }
    }
    return null;
};

const renderRecentPosts = (blogs, currentId) => {
    const sideRecent = document.getElementById("blog-recent-sidebar");
    const relatedSlider = document.getElementById("related-blog-slider");

    if (!blogs || !blogs.length) {
        if (sideRecent) sideRecent.innerHTML = `<p>No recent posts found.</p>`;
        if (relatedSlider) relatedSlider.innerHTML = `<p>No recent posts found.</p>`;
        return;
    }

    const sorted = blogs
        .slice()
        .filter((item) => item.id !== currentId)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const top4 = sorted.slice(0, 4);

    if (sideRecent) {
        sideRecent.innerHTML = top4
            .map((bg) => {
                const link = `blog-detail.php?id=${encodeURIComponent(bg.id)}`;
                const image = blogImageUrl(bg.image);
                const date = formatBlogDate(bg.created_at);
                return `
                    <div class="recent-box">
                        <a href="${link}" class="recent-image">
                            <img src="${image}" class="img-fluid" alt="${bg.title || "Recent"}">
                        </a>
                        <div class="recent-detail">
                            <a href="${link}">
                                <h3 class="recent-name">${bg.title || "Untitled"}</h3>
                            </a>
                            <p>${date || "Unknown date"}</p>
                        </div>
                    </div>
                `;
            })
            .join("");
    }

    if (relatedSlider) {
        relatedSlider.innerHTML = top4
            .map((bg) => {
                const link = `blog-detail.php?id=${encodeURIComponent(bg.id)}`;
                const image = blogImageUrl(bg.image);
                const title = bg.title || "Untitled";
                const date = formatBlogDate(bg.created_at);
                const description = (bg.description || bg.content || "").replace(/<[^>]*>/g, "").slice(0, 120) + "...";

                return `
                    <div class="swiper-slide">
                        <div class="blog-box h-100 sticky-blog-box">
                            <div class="blog-image">
                                <a href="${link}">
                                    <img src="${image}" class="img-fluid" alt="${title}">
                                </a>
                                <i class="ri-pushpin-fill pinned"></i>
                            </div>
                            <div class="blog-contain">
                                <a href="${link}">
                                    <h3>${title}</h3>
                                    <i class="ri-arrow-right-up-line"></i>
                                </a>
                                <p class="blog-desc">${description}</p>
                            </div>
                        </div>
                    </div>
                `;
            })
            .join("");
    }
};

// Guard so we never run twice (DOMContentLoaded + inline trigger).
let __blogDetailRan = false;

const renderBlogDetailPage = async () => {
    if (__blogDetailRan) return;
    const path = window.location.pathname.toLowerCase();
    if (!path.includes("blog-detail")) {
        console.log("[blog-detail] skip: not on blog-detail page, path=", path);
        return;
    }
    __blogDetailRan = true;

    // Prefer ?id=<uuid>. For backward compatibility, if a ?slug= is present,
    // look up the blog by matching id/slug against the full blog list.
    let id = getQueryParam("id");
    const slug = getQueryParam("slug");
    console.log("[blog-detail] query params:", { id, slug });

    let blogData = null;

    // Fallback: resolve legacy slug URLs to an actual blog id by scanning the list.
    if (!id && slug) {
        try {
            const response = await fetch(getBlog);
            const data = await response.json();
            const blogList = Array.isArray(data) ? data : data.data || [];
            const match = blogList.find((item) => item.slug === slug || item.id === slug);
            if (match && match.id) id = match.id;
            console.log("[blog-detail] resolved slug→id:", id);
        } catch (error) {
            console.error("[blog-detail] error resolving slug to id:", error);
        }
    }

    if (id) {
        const url = `${blogDetails}${encodeURIComponent(id)}`;
        console.log("[blog-detail] fetching:", url);
        try {
            const response = await fetch(url);
            console.log("[blog-detail] response status:", response.status);
            if (response.ok) {
                const raw = await response.json();
                console.log("[blog-detail] raw response:", raw);
                blogData = normalizeBlogDetailPayload(raw);
                console.log("[blog-detail] normalized blogData:", blogData);
            }
        } catch (error) {
            console.error("[blog-detail] fetch error:", error);
        }
    }

    if (!blogData) {
        console.error("[blog-detail] Blog not found", { id, slug });
        return;
    }

    fillBlogDetail(blogData);

    try {
        const response = await fetch(getBlog);
        const data = await response.json();
        const blogList = Array.isArray(data) ? data : data.data || [];
        renderRecentPosts(blogList, blogData.id);
    } catch (error) {
        console.error("Error fetching recent blogs:", error);
    }
};

const ITEMS_PER_PAGE = 8;

const createBlogCardHTML = (blog) => {
    const blogImage = blogImageUrl(blog.image);

    const blogTitle = blog.title || "No Title";

    const blogDescription = (blog.description || blog.content || "No description available")
        .replace(/<[^>]*>/g, "")
        .replace(/\r\n|\n|\r/g, " ")
        .trim()
        .slice(0, 180) + "...";

    const blogUrl = blog.id ? `blog-detail.php?id=${encodeURIComponent(blog.id)}` : "#";

    return `
        <div class="col-sm-6">
            <div class="blog-box h-100 sticky-blog-box">
                <div class="blog-image">
                    <a href="${blogUrl}">
                        <img src="${blogImage}" class="img-fluid blog-api-image" alt="${blogTitle}" loading="lazy">
                    </a>
                    <i class="ri-pushpin-fill pinned"></i>
                </div>
                <div class="blog-contain">
                    <a href="${blogUrl}" class="d-flex justify-content-between align-items-start gap-2 text-decoration-none">
                        <h3>${blogTitle}</h3>
                        <i class="ri-arrow-right-up-line"></i>
                    </a>
                    <p class="blog-desc">${blogDescription}</p>
                </div>
            </div>
        </div>
    `;
};

const renderBlogPagination = (totalPages, currentPage) => {
    const paginationNav = document.getElementById("blogPagination");
    if (!paginationNav) return;

    if (totalPages <= 1) {
        paginationNav.style.display = "none";
        return;
    }

    const buildPageItem = (page, label, disabled = false, active = false) => {
        if (disabled) {
            return `<li class="page-item disabled"><span class="page-link">${label}</span></li>`;
        }
        const url = new URL(window.location.href);
        url.searchParams.set("page", page);
        return `<li class="page-item ${active ? "active" : ""}"><a class="page-link" href="${url.pathname + url.search}">${label}</a></li>`;
    };

    const list = [];
    list.push(buildPageItem(Math.max(1, currentPage - 1), '<i class="ri-arrow-left-s-line"></i>', currentPage === 1));

    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        list.push(buildPageItem(1, 1));
    }
    if (startPage > 2) {
        list.push('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }

    for (let i = startPage; i <= endPage; i++) {
        list.push(buildPageItem(i, i, false, i === currentPage));
    }

    if (endPage < totalPages - 1) {
        list.push('<li class="page-item disabled"><span class="page-link">...</span></li>');
    }
    if (endPage < totalPages) {
        list.push(buildPageItem(totalPages, totalPages));
    }

    list.push(buildPageItem(Math.min(totalPages, currentPage + 1), '<i class="ri-arrow-right-s-line"></i>', currentPage === totalPages));

    const ul = paginationNav.querySelector(".pagination");
    if (ul) {
        ul.innerHTML = list.join("");
    }
    paginationNav.style.display = "";
};

const renderBlogListingPage = async () => {
    const blogSection = document.getElementById("blogSection");
    if (!blogSection) return;

    const sidebarRecent = document.getElementById("blogRecentSidebar");

    try {
        const response = await fetch(getBlog);
        const data = await response.json();
        const blogs = Array.isArray(data) ? data : data.data || [];

        if (!blogs.length) {
            blogSection.innerHTML = `
                <div class="col-12 text-center">
                    <p>No blogs available.</p>
                </div>
            `;
            return;
        }

        const sortedBlogs = blogs.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        if (sidebarRecent) {
            sidebarRecent.innerHTML = sortedBlogs.slice(0, 4).map((blog) => {
                const link = `blog-detail.php?id=${encodeURIComponent(blog.id)}`;
                const img = blogImageUrl(blog.image);
                return `
                    <div class="recent-box">
                        <a href="${link}" class="recent-image">
                            <img src="${img}" class="img-fluid" alt="${blog.title || "No title"}">
                        </a>
                        <div class="recent-detail">
                            <a href="${link}"><h3 class="recent-name">${blog.title || "Untitled"}</h3></a>
                            <p>${formatBlogDate(blog.created_at)}</p>
                        </div>
                    </div>
                `;
            }).join("");
        }

        const currentPage = Math.max(1, parseInt(getQueryParam("page"), 10) || 1);
        const totalPages = Math.max(1, Math.ceil(sortedBlogs.length / ITEMS_PER_PAGE));
        const pageIndex = Math.min(currentPage, totalPages);
        const pageBlogs = sortedBlogs.slice((pageIndex - 1) * ITEMS_PER_PAGE, pageIndex * ITEMS_PER_PAGE);

        blogSection.innerHTML = pageBlogs.map((blog) => createBlogCardHTML(blog)).join("");

        renderBlogPagination(totalPages, pageIndex);
    } catch (error) {
        console.error("Error fetching blog data:", error);
        blogSection.innerHTML = `
            <div class="col-12 text-center">
                <p>Failed to load blogs.</p>
            </div>
        `;
    }
};

document.addEventListener("DOMContentLoaded", async function () { if (false) {
    const blogSection = document.getElementById("blogSection");

    if (blogSection) {
        try {
            const response = await fetch(getBlog);
            const data = await response.json();

            console.log(data, "blog data from api");

            const blogs = Array.isArray(data) ? data : data.data || [];

            blogSection.innerHTML = "";

            blogs.forEach((blog) => {
                const blogImage = blogImageUrl(blog.image);

                const blogTitle = blog.title || "No Title";

                const blogDescription = (blog.description || blog.content || "No description available")
                    .replace(/<[^>]*>/g, "")
                    .replace(/\r\n|\n|\r/g, " ")
                    .trim()
                    .slice(0, 180) + "...";

                const blogUrl = blog.id ? `blog-detail.php?id=${encodeURIComponent(blog.id)}` : "#";

                const blogCard = `
                    <div class="col-sm-6">
                        <div class="blog-box h-100 sticky-blog-box">
                            <div class="blog-image">
                                <a href="${blogUrl}">
                                    <img src="${blogImage}" class="img-fluid blog-api-image" alt="${blogTitle}" loading="lazy">
                                </a>
                                <i class="ri-pushpin-fill pinned"></i>
                            </div>

                            <div class="blog-contain">
                                <a href="${blogUrl}" class="d-flex justify-content-between align-items-start gap-2 text-decoration-none">
                                    <h3>${blogTitle}</h3>
                                    <i class="ri-arrow-right-up-line"></i>
                                </a>

                                <p class="blog-desc">${blogDescription}</p>
                            </div>
                        </div>
                    </div>
                `;

                blogSection.innerHTML += blogCard;
            });

        } catch (error) {
            console.error("Error fetching blog data:", error);
            blogSection.innerHTML = `
                <div class="col-12 text-center">
                    <p>Failed to load blogs.</p>
                </div>
            `;
        }
    }

} });

document.addEventListener("DOMContentLoaded", async function () {
    await renderBlogListingPage();
    await renderBlogDetailPage();
});

// =============================================================================
// Blog Comments (dynamic)
// -----------------------------------------------------------------------------
// The detail page ships with empty placeholders (`#blogCommentsList`,
// `#blogCommentForm`, etc.). This block calls /api/blogs/{id}/comments to
// populate the list and wires up posting + reply flow. Guests can comment too;
// they just submit without a bearer token.
// =============================================================================
(function () {
    const commentsBase = (blogId) => `${blogDetails}${encodeURIComponent(blogId)}/comments`;

    // Escape user-supplied strings before injecting into HTML. Keep this minimal
    // (entity-encode the big five) — no markdown / link parsing on purpose.
    function escapeHtml(str) {
        if (str == null) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function timeAgo(iso) {
        if (!iso) return "";
        const d = new Date(iso);
        if (isNaN(d)) return "";
        const diff = (Date.now() - d.getTime()) / 1000;
        if (diff < 60) return "just now";
        if (diff < 3600) return Math.floor(diff / 60) + " min ago";
        if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";
        if (diff < 2592000) return Math.floor(diff / 86400) + " day" + (diff >= 172800 ? "s" : "") + " ago";
        return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    }

    function initialsAvatar(name) {
        const n = (name || "?").trim();
        const initials = n.split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join("") || "?";
        // Inline SVG avatar — zero network calls and works offline.
        const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
            <rect width='64' height='64' rx='32' fill='#0da487'/>
            <text x='50%' y='50%' dy='.35em' text-anchor='middle' fill='#fff'
                font-family='Inter,Arial,sans-serif' font-size='24' font-weight='600'>${escapeHtml(initials)}</text>
        </svg>`;
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }

    function renderStars(rating) {
        const r = Math.max(0, Math.min(5, Number(rating) || 0));
        let html = `<div class="product-rating"><ul class="rating">`;
        for (let i = 1; i <= 5; i++) {
            html += `<li class="${i <= r ? "theme-color" : ""}"><i class="ri-star-${i <= r ? "fill" : "line"}"></i></li>`;
        }
        html += `</ul></div>`;
        return html;
    }

    function buildCommentItem(c, isReply) {
        const name = escapeHtml(c.name || "Anonymous");
        const avatar = initialsAvatar(c.name);
        return `
            <li data-comment-id="${escapeHtml(c.id)}"${isReply ? "" : ""}>
                <div class="people-box">
                    <div>
                        <div class="people-image">
                            <img src="${avatar}" class="img-fluid" alt="${name}">
                        </div>
                    </div>
                    <div class="people-comment">
                        <div class="name">
                            <a href="#!">${name}</a>
                            ${c.rating ? renderStars(c.rating) : ""}
                        </div>
                        <div class="date-time">
                            <h4 class="text-content h6">${escapeHtml(timeAgo(c.createdAt))}</h4>
                        </div>
                        <div class="reply">
                            <p>${escapeHtml(c.body).replace(/\n/g, "<br>")}</p>
                        </div>
                        ${isReply ? "" : `
                            <ul class="share-box">
                                <li>
                                    <a href="#!" class="blog-comment-reply"
                                       data-parent-id="${escapeHtml(c.id)}"
                                       data-parent-name="${name}">
                                        <i class="ri-reply-line"></i>
                                        <span>Reply</span>
                                    </a>
                                </li>
                            </ul>`}
                    </div>
                </div>
                ${isReply ? "" : `<ul class="review-list reply-review-list" data-replies-for="${escapeHtml(c.id)}"></ul>`}
            </li>
        `;
    }

    function renderComments(comments) {
        const list = document.getElementById("blogCommentsList");
        const empty = document.getElementById("blogCommentsEmpty");
        const count = document.getElementById("blogCommentsCount");
        if (!list) return;

        list.innerHTML = "";
        if (!comments || comments.length === 0) {
            if (empty) empty.style.display = "block";
            if (count) count.textContent = "(0)";
            return;
        }
        if (empty) empty.style.display = "none";
        if (count) count.textContent = `(${comments.length})`;

        // Group by parent_id so we can render replies nested under their parent.
        const parents = comments.filter(c => !c.parentId);
        const repliesByParent = {};
        for (const c of comments) {
            if (c.parentId) {
                (repliesByParent[c.parentId] = repliesByParent[c.parentId] || []).push(c);
            }
        }

        for (const p of parents) {
            list.insertAdjacentHTML("beforeend", buildCommentItem(p, false));
            const replies = repliesByParent[p.id] || [];
            if (replies.length) {
                const replyList = list.querySelector(`ul[data-replies-for="${CSS.escape(p.id)}"]`);
                if (replyList) {
                    for (const r of replies) {
                        replyList.insertAdjacentHTML("beforeend", buildCommentItem(r, true));
                    }
                }
            }
        }
    }

    async function loadComments(blogId) {
        try {
            const res = await fetch(commentsBase(blogId), { cache: "no-store" });
            const raw = await res.json();
            const list = Array.isArray(raw?.data) ? raw.data
                       : Array.isArray(raw) ? raw
                       : [];
            renderComments(list);
        } catch (err) {
            console.error("[blog-comments] load failed", err);
            const empty = document.getElementById("blogCommentsEmpty");
            const loading = document.getElementById("blogCommentsLoading");
            if (loading) loading.remove();
            if (empty) {
                empty.style.display = "block";
                empty.textContent = "Could not load comments. Please refresh and try again.";
            }
        }
    }

    function setStatus(msg, type) {
        const s = document.getElementById("blogCommentStatus");
        if (!s) return;
        s.textContent = msg || "";
        s.className = "ms-3 small " + (type === "error" ? "text-danger" : type === "success" ? "text-success" : "text-muted");
    }

    function wireRatingPicker() {
        const wrap = document.getElementById("blogCommentRating");
        if (!wrap || wrap.dataset.wired) return;
        wrap.dataset.wired = "1";

        let current = 0;
        const stars = wrap.querySelectorAll("li");

        function paint(value) {
            stars.forEach(li => {
                const v = Number(li.getAttribute("data-rating"));
                const active = v <= value;
                li.classList.toggle("theme-color", active);
                const i = li.querySelector("i");
                if (i) {
                    i.classList.toggle("ri-star-fill", active);
                    i.classList.toggle("ri-star-line", !active);
                }
            });
        }

        stars.forEach(li => {
            li.addEventListener("mouseenter", () => paint(Number(li.getAttribute("data-rating"))));
            li.addEventListener("mouseleave", () => paint(current));
            li.addEventListener("click", () => {
                current = Number(li.getAttribute("data-rating"));
                wrap.dataset.value = String(current);
                paint(current);
            });
        });
    }

    function resetReplyState() {
        const parent = document.getElementById("blogCommentParentId");
        const replyingTo = document.getElementById("blogReplyingTo");
        const title = document.getElementById("blogCommentFormTitle");
        if (parent) parent.value = "";
        if (replyingTo) replyingTo.style.display = "none";
        if (title) title.textContent = "Leave a reply";
    }

    function wireReplyClicks() {
        const list = document.getElementById("blogCommentsList");
        if (!list || list.dataset.replyWired) return;
        list.dataset.replyWired = "1";

        list.addEventListener("click", (e) => {
            const btn = e.target.closest(".blog-comment-reply");
            if (!btn) return;
            e.preventDefault();
            const parentId = btn.getAttribute("data-parent-id");
            const parentName = btn.getAttribute("data-parent-name");

            document.getElementById("blogCommentParentId").value = parentId || "";
            const replyingTo = document.getElementById("blogReplyingTo");
            if (replyingTo) {
                replyingTo.style.display = "block";
                const strong = replyingTo.querySelector("strong");
                if (strong) strong.textContent = parentName || "a comment";
            }
            const title = document.getElementById("blogCommentFormTitle");
            if (title) title.textContent = "Post your reply";

            const body = document.getElementById("blogCommentBody");
            if (body) body.focus({ preventScroll: false });
            document.getElementById("blogCommentForm")?.scrollIntoView({ behavior: "smooth", block: "center" });
        });

        const cancel = document.getElementById("blogCancelReply");
        if (cancel) {
            cancel.addEventListener("click", (e) => {
                e.preventDefault();
                resetReplyState();
            });
        }
    }

    function wireSubmit(blogId) {
        const form = document.getElementById("blogCommentForm");
        if (!form || form.dataset.wired) return;
        form.dataset.wired = "1";

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("blogCommentName").value.trim();
            const email = document.getElementById("blogCommentEmail").value.trim();
            const body = document.getElementById("blogCommentBody").value.trim();
            const parentId = document.getElementById("blogCommentParentId").value || null;
            const ratingRaw = document.getElementById("blogCommentRating")?.dataset?.value;
            const rating = ratingRaw ? Number(ratingRaw) : null;

            if (!name || !body) {
                setStatus("Please provide your name and a comment.", "error");
                return;
            }
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setStatus("Please enter a valid email or leave it blank.", "error");
                return;
            }

            const submitBtn = document.getElementById("blogCommentSubmit");
            submitBtn.disabled = true;
            setStatus("Posting your comment...");

            try {
                const token = localStorage.getItem("userToken");
                const headers = { "Content-Type": "application/json" };
                if (token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(commentsBase(blogId), {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        name,
                        email: email || null,
                        body,
                        rating: rating || null,
                        parentId
                    })
                });

                let data = {};
                try { data = await res.json(); } catch (_) {}

                if (!res.ok || data?.success === false) {
                    setStatus(data?.message || "Could not post comment. Try again.", "error");
                    return;
                }

                setStatus("Thanks! Your comment was posted.", "success");
                form.reset();
                document.getElementById("blogCommentParentId").value = "";
                const ratingWrap = document.getElementById("blogCommentRating");
                if (ratingWrap) {
                    delete ratingWrap.dataset.value;
                    ratingWrap.querySelectorAll("li").forEach(li => {
                        li.classList.remove("theme-color");
                        const i = li.querySelector("i");
                        if (i) { i.classList.remove("ri-star-fill"); i.classList.add("ri-star-line"); }
                    });
                }
                resetReplyState();
                await loadComments(blogId);
            } catch (err) {
                console.error("[blog-comments] post failed", err);
                setStatus("Network error. Please try again.", "error");
            } finally {
                submitBtn.disabled = false;
                setTimeout(() => setStatus(""), 4000);
            }
        });
    }

    async function initBlogComments() {
        const path = window.location.pathname.toLowerCase();
        if (!path.includes("blog-detail")) return;
        if (!document.getElementById("blogCommentsList")) return; // HTML not present

        // We need the resolved blog id. For ?id=<uuid> URLs this is trivial; for
        // ?slug=<slug> legacy URLs we wait for renderBlogDetailPage to resolve
        // and stash the id in the page via the main image data attribute, or we
        // re-resolve slug → id here as a fallback.
        let id = getQueryParam("id");
        const slug = getQueryParam("slug");

        if (!id && slug) {
            try {
                const response = await fetch(getBlog);
                const data = await response.json();
                const blogList = Array.isArray(data) ? data : data.data || [];
                const match = blogList.find((item) => item.slug === slug || item.id === slug);
                if (match && match.id) id = match.id;
            } catch (err) {
                console.error("[blog-comments] slug→id resolve failed", err);
            }
        }

        if (!id) {
            const empty = document.getElementById("blogCommentsEmpty");
            const loading = document.getElementById("blogCommentsLoading");
            if (loading) loading.remove();
            if (empty) {
                empty.style.display = "block";
                empty.textContent = "Blog not found — comments cannot be loaded.";
            }
            return;
        }

        wireRatingPicker();
        wireReplyClicks();
        wireSubmit(id);
        await loadComments(id);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initBlogComments);
    } else {
        initBlogComments();
    }
})();
