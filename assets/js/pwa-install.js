(function () {
  "use strict";

  function basePath() {
    var path = window.location.pathname || "/";
    var i = path.lastIndexOf("/");
    return i >= 0 ? path.slice(0, i + 1) : "/";
  }

  function assetUrl(rel) {
    return new URL(rel, window.location.origin + basePath()).pathname;
  }

  function isPwaHomePage() {
    var el = document.documentElement;
    return el && el.getAttribute("data-pwa-home") === "1";
  }

  function isStandalone() {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true
    );
  }

  function isIosUa() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent || "");
  }

  function pullDeferredFromEarlyCapture() {
    if (window.__deferredPwaInstallPrompt) {
      deferredPrompt = window.__deferredPwaInstallPrompt;
    }
  }

  var deferredPrompt = null;

  function registerSw() {
    if (!("serviceWorker" in navigator)) return;
    if (!window.isSecureContext) {
      if (
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
      ) {
        console.warn(
          "[PWA] HTTPS required for install. Open the site over https://"
        );
      }
    }
    var root = window.location.origin + basePath();
    var swHref = new URL("sw.js", root).href;
    var scope = new URL(".", root).href;
    navigator.serviceWorker
      .register(swHref, { scope: scope })
      .then(function (reg) {
        console.info("[PWA] Service worker registered:", reg.scope);
        return reg.update();
      })
      .catch(function (err) {
        console.warn("[PWA] Service worker registration failed:", err);
      });
  }

  function configureModalChromeDefault(modal) {
    pullDeferredFromEarlyCapture();
    var title = modal.querySelector(".pwa-install-title");
    var sub = modal.querySelector(".pwa-install-sub");
    var installBtn = modal.querySelector('[data-pwa-action="install"]');
    var secondary = modal.querySelector(".pwa-install-btn-secondary");
    if (title) title.textContent = "Install HyperScripts";
    if (sub) sub.textContent = "Get quick access from your home screen.";
    if (installBtn) {
      installBtn.textContent = "Install app";
      installBtn.setAttribute("data-pwa-action", "install");
      installBtn.disabled = false;
      installBtn.classList.remove("is-disabled");
    }
    if (secondary) {
      secondary.style.display = "";
      secondary.textContent = "Not now";
    }
  }

  function configureModalIos(modal) {
    var title = modal.querySelector(".pwa-install-title");
    var sub = modal.querySelector(".pwa-install-sub");
    var installBtn = modal.querySelector(
      '[data-pwa-action="install"], [data-pwa-action="ios-gotit"]'
    );
    var secondary = modal.querySelector(".pwa-install-btn-secondary");
    if (title) title.textContent = "Add HyperScripts to Home Screen";
    if (sub)
      sub.textContent =
        "Tap Share, then “Add to Home Screen” to install this app.";
    if (installBtn) {
      installBtn.textContent = "Got it";
      installBtn.setAttribute("data-pwa-action", "ios-gotit");
      installBtn.disabled = false;
      installBtn.classList.remove("is-disabled");
    }
    if (secondary) secondary.style.display = "none";
  }

  function configureModalWaiting(modal) {
    var title = modal.querySelector(".pwa-install-title");
    var sub = modal.querySelector(".pwa-install-sub");
    var installBtn = modal.querySelector(
      ".pwa-install-actions .pwa-install-btn:not(.pwa-install-btn-secondary)"
    );
    var secondary = modal.querySelector(".pwa-install-btn-secondary");
    if (title) title.textContent = "Install HyperScripts";
    if (sub) sub.textContent = "Checking if this site can be installed…";
    if (installBtn) {
      installBtn.textContent = "Please wait…";
      installBtn.setAttribute("data-pwa-action", "install");
      installBtn.disabled = true;
    }
    if (secondary) secondary.style.display = "none";
  }

  function configureModalNoPromptHint(modal) {
    pullDeferredFromEarlyCapture();
    var title = modal.querySelector(".pwa-install-title");
    var sub = modal.querySelector(".pwa-install-sub");
    var installBtn = modal.querySelector(
      ".pwa-install-actions .pwa-install-btn:not(.pwa-install-btn-secondary)"
    );
    var secondary = modal.querySelector(".pwa-install-btn-secondary");
    if (title) title.textContent = "Install HyperScripts";
    if (sub) {
      if (
        !window.isSecureContext &&
        location.hostname !== "localhost" &&
        location.hostname !== "127.0.0.1"
      ) {
        sub.textContent =
          "Install needs HTTPS. Enable SSL on your domain, then reload and try again.";
      } else {
        sub.textContent =
          "Chrome: look at the right side of the address bar for the install (⊕ or computer) icon. Or open the menu (⋮) → Save and share → Install HyperScripts. If nothing appears, reload the page once after the site fully loads.";
      }
    }
    if (installBtn) {
      installBtn.textContent = "OK";
      installBtn.setAttribute("data-pwa-action", "ios-gotit");
      installBtn.disabled = false;
    }
    if (secondary) secondary.style.display = "none";
  }

  function ensureModal() {
    var el = document.getElementById("pwa-install-modal");
    if (el) return el;
    el = document.createElement("div");
    el.id = "pwa-install-modal";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "pwa-install-title");
    el.innerHTML =
      '<div class="pwa-install-overlay" data-pwa-action="dismiss"></div>' +
      '<div class="pwa-install-dialog">' +
      '<button type="button" class="pwa-install-dialog-close" data-pwa-action="dismiss" aria-label="Close">&times;</button>' +
      '<div class="pwa-install-icon"><img src="' +
      assetUrl("assets/images/img/logo.png") +
      '" alt="" width="40" height="40" /></div>' +
      '<p class="pwa-install-title" id="pwa-install-title">Install HyperScripts</p>' +
      '<p class="pwa-install-sub">Get quick access from your home screen.</p>' +
      '<div class="pwa-install-actions">' +
      '<button type="button" class="pwa-install-btn" data-pwa-action="install">Install app</button>' +
      '<button type="button" class="pwa-install-btn pwa-install-btn-secondary" data-pwa-action="dismiss">Not now</button>' +
      "</div>" +
      "</div>";

    document.documentElement.appendChild(el);

    el.addEventListener("click", function (ev) {
      var raw = ev.target;
      var t =
        raw && raw.closest ? raw.closest("[data-pwa-action]") : null;
      if (!t) return;
      var action = t.getAttribute("data-pwa-action");
      if (action === "install") {
        pullDeferredFromEarlyCapture();
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.finally(function () {
          deferredPrompt = null;
          window.__deferredPwaInstallPrompt = null;
          hideModal(el);
        });
      } else if (action === "dismiss") {
        hideModal(el);
      } else if (action === "ios-gotit") {
        hideModal(el);
      }
    });

    return el;
  }

  function showModal(modal) {
    document.body.classList.add("pwa-install-modal-open");
    requestAnimationFrame(function () {
      modal.classList.add("is-visible");
      modal.setAttribute("aria-hidden", "false");
    });
  }

  function hideModal(modal) {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("pwa-install-modal-open");
  }

  function tryAutoOpenHomeInstallModal() {
    if (isStandalone()) return;
    pullDeferredFromEarlyCapture();
    if (!deferredPrompt || !isPwaHomePage()) return;
    var existing = document.getElementById("pwa-install-modal");
    if (existing && existing.classList.contains("is-visible")) return;
    var modal = ensureModal();
    configureModalChromeDefault(modal);
    showModal(modal);
  }

  window.addEventListener("hyperscripts:pwa-bip", tryAutoOpenHomeInstallModal);
  document.addEventListener("DOMContentLoaded", function () {
    pullDeferredFromEarlyCapture();
    tryAutoOpenHomeInstallModal();
  });

  window.addEventListener("appinstalled", function () {
    deferredPrompt = null;
    window.__deferredPwaInstallPrompt = null;
    var modal = document.getElementById("pwa-install-modal");
    if (modal) hideModal(modal);
    updateInstallTriggersVisibility();
  });

  function updateInstallTriggersVisibility() {
    var hide = isStandalone();
    document
      .querySelectorAll(".pwa-header-install-wrap, .pwa-mobile-install-item")
      .forEach(function (n) {
        n.style.display = hide ? "none" : "";
      });
  }

  function waitForInstallPrompt(maxMs) {
    return new Promise(function (resolve) {
      pullDeferredFromEarlyCapture();
      if (deferredPrompt) {
        resolve(true);
        return;
      }
      var start = Date.now();
      var iv = setInterval(function () {
        pullDeferredFromEarlyCapture();
        if (deferredPrompt) {
          clearInterval(iv);
          resolve(true);
        } else if (Date.now() - start >= maxMs) {
          clearInterval(iv);
          resolve(false);
        }
      }, 120);
    });
  }

  window.openPwaInstallModal = function () {
    if (isStandalone()) return;
    pullDeferredFromEarlyCapture();
    var modal = ensureModal();
    if (isIosUa()) {
      configureModalIos(modal);
      showModal(modal);
      return;
    }
    if (deferredPrompt) {
      configureModalChromeDefault(modal);
      showModal(modal);
      return;
    }
    configureModalWaiting(modal);
    showModal(modal);
    var done = function () {
      pullDeferredFromEarlyCapture();
      if (deferredPrompt) {
        configureModalChromeDefault(modal);
      } else {
        configureModalNoPromptHint(modal);
      }
    };
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(function (reg) {
          return reg.update();
        })
        .catch(function () {})
        .then(function () {
          return waitForInstallPrompt(8000);
        })
        .then(function () {
          done();
        });
    } else {
      waitForInstallPrompt(8000).then(done);
    }
  };

  function bindHeaderInstallTriggers() {
    document.querySelectorAll(".pwa-header-install-trigger").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        window.openPwaInstallModal();
      });
    });
    updateInstallTriggersVisibility();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registerSw);
    document.addEventListener("DOMContentLoaded", bindHeaderInstallTriggers);
  } else {
    registerSw();
    bindHeaderInstallTriggers();
  }

  window.addEventListener("pageshow", function () {
    if (typeof updateInstallTriggersVisibility === "function") {
      updateInstallTriggersVisibility();
    }
  });

  function initIosHint() {
    if (isStandalone()) return;
    if (!isPwaHomePage()) return;
    try {
      if (sessionStorage.getItem("pwaIosHintShown")) return;
      sessionStorage.setItem("pwaIosHintShown", "1");
    } catch (e) {}
    var modal = ensureModal();
    configureModalIos(modal);
    showModal(modal);
  }

  if (isPwaHomePage() && !isStandalone() && isIosUa()) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initIosHint, { once: true });
    } else {
      initIosHint();
    }
  }
})();
