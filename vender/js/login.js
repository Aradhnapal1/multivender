// ****************************************************************LOGIN API ****************************************************************
async function getOnboardingTargetPage(token) {
const apiBase = (window.API_BASE_URL || window.BASE || "https://api.workarya.com").replace(/\/$/, "");
const headers = { Authorization: "Bearer " + token };

function pickData(payload) {
if (!payload) return null;
if (Array.isArray(payload)) return payload;
if (payload.data !== undefined && payload.data !== null) return pickData(payload.data);
if (payload.result !== undefined && payload.result !== null) return pickData(payload.result);
return payload;
}

function firstRow(entity) {
if (Array.isArray(entity)) return entity[0] || null;
return entity;
}

function hasId(entity) {
const row = firstRow(entity);
if (!row) return false;
return !!(row.id || row.vendorId);
}

async function safeGet(url) {
try {
const response = await fetch(url, { method: "GET", headers: headers });
if (!response.ok) return null;
const payload = await response.json();
return pickData(payload);
} catch (error) {
return null;
}
}

const profile = await safeGet(apiBase + "/vendor/profile");
if (!hasId(profile)) {
return "personal-details.php";
}

const business = await safeGet(apiBase + "/api/vendor/business/get");
if (!hasId(business)) {
return "business-profile.php";
}

const profileRow = firstRow(profile);
const vendorId = profileRow && profileRow.vendorId ? profileRow.vendorId : "";
const bank = await safeGet(apiBase + "/api/bank/get/" + encodeURIComponent(vendorId));
if (!hasId(bank)) {
return "bank-details.php";
}

return "index.php";
}

function loginApi(){

let email = document.getElementById("emailaddress").value;
let password = document.getElementById("password").value;

if(email === "" || password === ""){
alert("Please enter email and password");
return;
}

let formData = new FormData();
formData.append("email", email);
formData.append("password", password);

fetch("https://api.workarya.com/api/login",{
method:"POST",
body:formData
})

.then(response => response.json())
.then(async data => {

console.log(data);

if(data.status === true || data.success === true){

alert("Login Successful");

// superadmin token save
localStorage.setItem("vendorToken", data.token);

// Reset flags; they will be rehydrated from API status below.
sessionStorage.removeItem("vendorPersonalDetailsDone");
sessionStorage.removeItem("vendorBusinessDetailsDone");
sessionStorage.removeItem("vendorBankDetailsDone");

// login flag
// localStorage.setItem("adminLogin", "true");


// redirect
const targetPage = await getOnboardingTargetPage(data.token);
if (targetPage === "index.php") {
sessionStorage.setItem("vendorPersonalDetailsDone", "true");
sessionStorage.setItem("vendorBusinessDetailsDone", "true");
sessionStorage.setItem("vendorBankDetailsDone", "true");
} else if (targetPage === "business-profile.php") {
sessionStorage.setItem("vendorPersonalDetailsDone", "true");
} else if (targetPage === "bank-details.php") {
sessionStorage.setItem("vendorPersonalDetailsDone", "true");
sessionStorage.setItem("vendorBusinessDetailsDone", "true");
}
window.location.href = targetPage;

}else{

alert("Invalid Email or Password");

}

})
.catch(error => {

console.log(error);
alert("API Error");

});

}

// ****************************************************************LOGOUT ****************************************************************

document.addEventListener("DOMContentLoaded", function () {
    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function (e) {
            e.preventDefault();

            localStorage.removeItem("vendorToken");
            sessionStorage.removeItem("vendorPersonalDetailsDone");
            sessionStorage.removeItem("vendorBusinessDetailsDone");
            sessionStorage.removeItem("vendorBankDetailsDone");

            window.location.href = "login.php";
        });
    } else {
        console.log("Logout button not found ❌");
    }
});
