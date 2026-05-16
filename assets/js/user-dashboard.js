/* User dashboard: mobile sidebar + quick links to tabs */
(function () {
  "use strict";

  function wireDashboardTiles() {
    document
      .querySelectorAll(".dashboard-setting li[data-class]")
      .forEach(function (item) {
        item.addEventListener("click", function (e) {
          var link = e.target.closest("a.personal-detail");
          if (link) e.preventDefault();
          var dataClass = item.getAttribute("data-class");
          if (!dataClass) return;
          var btn = document.querySelector(
            'button[data-bs-target="#' + dataClass + '"]'
          );
          if (btn) btn.click();
        });
      });
  }

  function ensureBgOverlay() {
    var el = document.querySelector(".bg-overlay");
    if (el) return el;
    el = document.createElement("div");
    el.className = "bg-overlay";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  }

  function wireMobileSidebar() {
    var sidebar = document.querySelector(".dashboard-left-sidebar");
    var showBtn = document.querySelector(".left-dashboard-show");
    var closeBtn = document.querySelector(".dashboard-left-sidebar .sidebar-close");
    if (!sidebar || !showBtn) return;

    var bgOverlay = ensureBgOverlay();

    function openSidebar() {
      sidebar.classList.add("show");
      bgOverlay.classList.add("show");
    }

    function closeSidebar() {
      sidebar.classList.remove("show");
      bgOverlay.classList.remove("show");
    }

    showBtn.addEventListener("click", openSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
    bgOverlay.addEventListener("click", closeSidebar);

    document.querySelectorAll("#pills-tab button[data-bs-target]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 991.98px)").matches) {
          closeSidebar();
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wireDashboardTiles();
    wireMobileSidebar();
  });
})();
