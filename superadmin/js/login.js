// ****************************************************************LOGIN API ****************************************************************
// POST https://api.workarya.com/api/login — do NOT send application/json (API rejects it).
// Supports: multipart/form-data (FormData) and application/x-www-form-urlencoded.

const API_LOGIN_URL = "https://api.workarya.com/api/login";

function looksLikeJwt(str) {
  return (
    typeof str === "string" &&
    str.length > 40 &&
    str.split(".").length === 3
  );
}

/** Many backends return the JWT as data.data (string) or data.token, etc. */
function pickLoginToken(payload) {
  if (!payload || typeof payload !== "object") return null;

  const direct = [
    payload.token,
    payload.accessToken,
    payload.jwt,
    payload.jwtToken,
    payload.Data?.Token,
    payload.result
  ];
  for (let i = 0; i < direct.length; i++) {
    if (looksLikeJwt(direct[i])) return direct[i];
  }

  const d = payload.data ?? payload.Data;
  if (looksLikeJwt(d)) return d;
  if (d && typeof d === "object") {
    const nested = [
      d.token,
      d.accessToken,
      d.jwt,
      d.jwtToken,
      d.Token,
      d.access_token
    ];
    for (let j = 0; j < nested.length; j++) {
      if (looksLikeJwt(nested[j])) return nested[j];
    }
  }
  return null;
}

async function loginApi() {
  const email = document.getElementById("emailaddress").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    Swal.fire({
      icon: "warning",
      title: "Please enter email and password"
    });
    return;
  }

  const tryPost = async (body, isUrlEncoded) => {
    const headers = {};
    if (isUrlEncoded) {
      headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    }
    return fetch(API_LOGIN_URL, {
      method: "POST",
      headers,
      body,
      credentials: "omit"
    });
  };

  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  const params = new URLSearchParams();
  params.set("email", email);
  params.set("password", password);

  try {
    let res = await tryPost(formData, false);
    let raw = await res.text();

    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      if (looksLikeJwt(raw)) {
        data = { success: true, token: raw };
      } else {
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: res.ok
            ? "Unexpected response from server."
            : `${res.status} ${raw.slice(0, 160)}`
        });
        return;
      }
    }

    let token = pickLoginToken(data);
    let ok =
      data.success === true ||
      data.status === true ||
      data.Status === true;

    if (ok && !token) {
      res = await tryPost(params, true);
      raw = await res.text();
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        if (looksLikeJwt(raw)) {
          data = { success: true, token: raw };
        } else {
          Swal.fire({
            icon: "error",
            title: "Login response missing token",
            text: raw.slice(0, 200)
          });
          return;
        }
      }
      token = pickLoginToken(data);
      ok =
        data.success === true ||
        data.status === true ||
        data.Status === true;
    }

    console.log("Login Response 👉", data);

    if (token && !ok) {
      ok = true;
    }

    if (ok && token) {
      localStorage.setItem("superadminToken", token);

      Swal.fire({
        icon: "success",
        title: "Login Successful ✅",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "index.php";
      }, 1500);
      return;
    }

    if (ok && !token) {
      Swal.fire({
        icon: "error",
        title: "Login response missing token",
        text: "The server returned success but no JWT was found. Check the Network tab response body."
      });
      console.error("Login payload (no token):", data);
      return;
    }

    Swal.fire({
      icon: "error",
      title: data.message || data.Message || "Invalid Email or Password ❌"
    });
  } catch (err) {
    console.error(err);
    const msg =
      err && String(err.message).includes("fetch")
        ? "Cannot reach login API (CORS/network). Open DevTools → Console/Network."
        : (err && err.message) || "Unknown error";
    Swal.fire({
      icon: "error",
      title: "Login request failed",
      text: msg
    });
  }
}



// ****************************************************************LOGOUT ****************************************************************