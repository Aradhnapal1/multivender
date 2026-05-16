/**
 * Normalizes product/blog/media paths from the API.
 * If the value is already absolute (http/https) or protocol-relative (//), returns as-is.
 * Otherwise prefixes API_BASE.
 */
(function () {
  var API_BASE_URL = "https://api.workarya.com";

  function resolveApiMediaUrl(path, fallback) {
    if (path == null || path === "") {
      return fallback != null ? fallback : "assets/images/product/placeholder.png";
    }
    var s = String(path).trim();
    if (/^https?:\/\//i.test(s)) return s;
    if (s.startsWith("//")) return "https:" + s;
    var base = API_BASE_URL.replace(/\/$/, "");
    var rel = s.startsWith("/") ? s : "/" + s.replace(/^\/+/, "");
    return base + rel;
  }

  window.API_BASE_URL = API_BASE_URL;
  window.BASE = API_BASE_URL;
  window.resolveApiMediaUrl = resolveApiMediaUrl;
})();
