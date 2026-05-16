<?php
/**
 * Global Page Preloader (shared across public, superadmin and vendor panels).
 *
 * Usage: include this file immediately after the opening <body> tag.
 *   <?php include __DIR__ . '/preloader.php'; ?>           // root
 *   <?php include __DIR__ . '/../preloader.php'; ?>        // subfolder
 *
 * Behaviour:
 *   - Shows on every page load.
 *   - Auto-hides on DOMContentLoaded unless a page sets
 *     `window.pdHoldPreloader = true` BEFORE DOMContentLoaded fires.
 *   - Pages doing async population (e.g. product-detail) should set the
 *     hold flag and call `window.hideGlobalPreloader()` when content is
 *     ready.
 *   - Hard safety cap of 4s — the loader never blocks longer than this.
 */
?>
<style>
    #gpPreloader {
        position: fixed; inset: 0; z-index: 99999;
        background: #ffffff;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 22px;
        transition: opacity .3s ease, visibility .3s ease;
    }
    #gpPreloader.is-hidden { opacity: 0; visibility: hidden; pointer-events: none; }

    .gp-loader-ring { width: 72px; height: 72px; position: relative; }
    .gp-loader-ring::before,
    .gp-loader-ring::after {
        content: ""; position: absolute; inset: 0;
        border-radius: 50%; border: 4px solid transparent;
    }
    .gp-loader-ring::before {
        border-top-color: #0da487;
        border-right-color: #0da487;
        animation: gpSpin 1s linear infinite;
    }
    .gp-loader-ring::after {
        inset: 10px;
        border-top-color: #f8b400;
        border-left-color: #f8b400;
        animation: gpSpin 1.4s linear infinite reverse;
    }
    @keyframes gpSpin { to { transform: rotate(360deg); } }

    .gp-loader-brand { font-size: 18px; font-weight: 700; color: #222; letter-spacing: .3px; }
    .gp-loader-brand span { color: #0da487; }
    .gp-loader-msg { font-size: 13px; color: #777; margin-top: -10px; }
    .gp-loader-dots { display: inline-flex; gap: 4px; margin-left: 4px; }
    .gp-loader-dots i {
        width: 4px; height: 4px; border-radius: 50%; background: #0da487;
        animation: gpBlink 1.2s infinite ease-in-out both;
    }
    .gp-loader-dots i:nth-child(2) { animation-delay: .15s; }
    .gp-loader-dots i:nth-child(3) { animation-delay: .3s; }
    @keyframes gpBlink {
        0%, 80%, 100% { opacity: .2; transform: scale(.8); }
        40% { opacity: 1; transform: scale(1); }
    }
</style>
<div id="gpPreloader" aria-hidden="true">
    <div class="gp-loader-brand">Hyper<span>Scripts</span></div>
    <div class="gp-loader-ring" role="status" aria-label="Loading"></div>
    <div class="gp-loader-msg">
        Loading, please wait<span class="gp-loader-dots"><i></i><i></i><i></i></span>
    </div>
</div>
<script>
    (function () {
        var MAX_WAIT_MS = 4000;
        var hidden = false;

        function hideGlobalPreloader() {
            if (hidden) return;
            hidden = true;
            var el = document.getElementById('gpPreloader');
            if (!el) return;
            el.classList.add('is-hidden');
            setTimeout(function () {
                if (el && el.parentNode) el.parentNode.removeChild(el);
            }, 350);
        }

        window.hideGlobalPreloader = hideGlobalPreloader;
        window.hideProductDetailPreloader = hideGlobalPreloader;

        document.addEventListener('DOMContentLoaded', function () {
            if (window.pdHoldPreloader) return;
            requestAnimationFrame(function () {
                setTimeout(hideGlobalPreloader, 50);
            });
        });

        setTimeout(hideGlobalPreloader, MAX_WAIT_MS);
    })();
</script>
