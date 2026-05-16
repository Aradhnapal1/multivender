const VENDOR_DASHBOARD_API_BASE = "https://api.workarya.com";

function vendorDashboardToken() {
  return localStorage.getItem("vendorToken");
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function renderVendorTrend(trend) {
  const el = document.querySelector("#balance_overview");
  if (!el || typeof ApexCharts === "undefined") return;
  const labels = (trend || []).map((x) => x.month || "-");
  const data = (trend || []).map((x) => Number(x.revenue || 0));

  el.innerHTML = "";
  const chart = new ApexCharts(el, {
    chart: { type: "area", height: 300, toolbar: { show: false } },
    series: [{ name: "Revenue", data }],
    xaxis: { categories: labels },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    colors: ["#3980c0"],
  });
  chart.render();
}

function updateVendorParamTable(data) {
  const rows = Array.from(document.querySelectorAll(".table-responsive.pt-2 tbody tr"));
  if (!rows.length) return;
  const mapped = [
    { label: "Products", today: data.totalProducts ?? 0, total: data.totalProducts ?? 0, percent: "100%" },
    { label: "Orders", today: data.totalOrders ?? 0, total: data.totalOrders ?? 0, percent: "100%" },
    { label: "Items Sold", today: data.totalItemsSold ?? 0, total: data.totalItemsSold ?? 0, percent: "100%" },
    { label: "Revenue", today: formatCurrency(data.totalRevenue), total: formatCurrency(data.totalRevenue), percent: "100%" },
  ];
  mapped.forEach((item, index) => {
    if (!rows[index]) return;
    const cells = rows[index].querySelectorAll("th, td");
    if (cells[0]) cells[0].textContent = item.label;
    if (cells[1]) cells[1].textContent = item.today;
    if (cells[2]) cells[2].textContent = item.total;
    if (cells[4]) cells[4].textContent = item.percent;
  });
}

async function loadVendorDashboard() {
  if (!document.getElementById("balance_overview")) return;
  const token = vendorDashboardToken();
  if (!token) return;

  try {
    const res = await fetch(`${VENDOR_DASHBOARD_API_BASE}/api/dashboard/vendor`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    const data = json?.data || {};

    setText("vdTotalRevenue", formatCurrency(data.totalRevenue));
    setText("vdTotalItemsSold", String(data.totalItemsSold ?? 0));
    setText("vdRevenueCard", formatCurrency(data.totalRevenue));
    setText("vdTotalProducts", String(data.totalProducts ?? 0));
    setText("vdTotalOrders", String(data.totalOrders ?? 0));
    renderVendorTrend(data.trend || []);
    updateVendorParamTable(data);
  } catch (e) {
    console.error("Vendor dashboard load error:", e);
  }
}

document.addEventListener("DOMContentLoaded", loadVendorDashboard);
