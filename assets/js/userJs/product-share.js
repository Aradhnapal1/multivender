/**
 * Product page sharing: current URL + social intents, and #shareProductModal (footer).
 */
(function () {
  "use strict";

  function pageShareUrl() {
    return String(window.location.href || "").split("#")[0];
  }

  function shareTitle() {
    var el =
      document.querySelector(".right-box-contain .name") ||
      document.querySelector("h1.name") ||
      document.querySelector("[data-product-share-title]");
    var t = el && el.textContent ? el.textContent.trim() : "";
    if (!t && el && el.getAttribute("data-product-share-title")) {
      t = el.getAttribute("data-product-share-title").trim();
    }
    return t || document.title || "Product";
  }

  function buildShareUrl(network, url, text) {
    var u = encodeURIComponent(url);
    var t = encodeURIComponent(text);
    switch (network) {
      case "facebook":
        return "https://www.facebook.com/sharer/sharer.php?u=" + u;
      case "twitter":
        return "https://twitter.com/intent/tweet?url=" + u + "&text=" + t;
      case "pinterest":
        return "https://www.pinterest.com/pin/create/button/?url=" + u + "&description=" + t;
      case "whatsapp":
        return "https://api.whatsapp.com/send?text=" + encodeURIComponent(text + " " + url);
      case "instagram":
        return null;
      default:
        return null;
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }).catch(function () {
        return legacyCopy(text);
      });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function toastCopied() {
    if (typeof Swal !== "undefined") {
      Swal.fire({
        icon: "success",
        title: "Copied",
        text: "Link is on your clipboard.",
        timer: 1600,
        showConfirmButton: false,
      });
    } else {
      window.alert("Link copied to clipboard.");
    }
  }

  function syncModalUrl() {
    var inp = document.getElementById("shareProductPageUrl");
    if (inp) inp.value = pageShareUrl();
  }

  function handleShareClick(e) {
    var a = e.target.closest("a[data-share-network]");
    if (!a) return;

    var net = a.getAttribute("data-share-network");
    if (!net) return;

    e.preventDefault();
    e.stopPropagation();

    var url = pageShareUrl();
    var text = shareTitle();

    if (net === "instagram") {
      copyText(text + "\n" + url).then(function (ok) {
        if (ok) toastCopied();
        else if (typeof Swal !== "undefined") {
          Swal.fire({ icon: "error", title: "Copy failed", text: "Select the link in the share box and copy manually." });
        } else {
          window.alert("Could not copy automatically.");
        }
      });
      return;
    }

    var built = buildShareUrl(net, url, text);
    if (built) {
      var win = window.open(built, "_blank", "noopener,noreferrer");
      if (!win && typeof Swal !== "undefined") {
        Swal.fire({
          icon: "info",
          title: "Allow pop-ups",
          text: "Your browser blocked the share window. Allow pop-ups for this site and try again.",
        });
      }
    }
  }

  document.addEventListener("click", handleShareClick, true);

  function initShareUi() {
    syncModalUrl();

    var modal = document.getElementById("shareProductModal");
    if (modal) {
      modal.addEventListener("show.bs.modal", syncModalUrl);
    }

    var copyBtn = document.getElementById("shareProductCopyBtn");
    if (copyBtn && !copyBtn.dataset.shareBound) {
      copyBtn.dataset.shareBound = "1";
      copyBtn.addEventListener("click", function () {
        var inp = document.getElementById("shareProductPageUrl");
        var v = inp && inp.value ? inp.value : pageShareUrl();
        copyText(v).then(function (ok) {
          if (ok) toastCopied();
        });
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initShareUi);
  } else {
    initShareUi();
  }
})();
