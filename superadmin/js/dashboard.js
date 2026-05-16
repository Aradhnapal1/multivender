const SUPERADMIN_DASHBOARD_API = "https://api.workarya.com/api/dashboard/superadmin";

let superadminRevenueChart = null;

function superadminDashboardToken() {
  return localStorage.getItem("superadminToken");
}

function formatCurrency(value) {
  const num = Number(value || 0);
  return `₹${num.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function parseDashboardPayload(json) {
  if (!json || typeof json !== "object") return null;
  if (json.data && typeof json.data === "object" && !Array.isArray(json.data)) {
    return json.data;
  }
  return json;
}

function destroyRevenueChart() {
  if (superadminRevenueChart && typeof superadminRevenueChart.destroy === "function") {
    try {
      superadminRevenueChart.destroy();
    } catch (e) {
      /* ignore */
    }
  }
  superadminRevenueChart = null;
}

function renderSuperadminTrend(trend) {
  const el = document.getElementById("balance_overview");
  if (!el) return;

  const labels = (trend || []).map((x) => x.month || "-");
  const data = (trend || []).map((x) => Number(x.revenue || 0));

  destroyRevenueChart();
  el.innerHTML = "";

  if (typeof ApexCharts === "undefined") return;

  superadminRevenueChart = new ApexCharts(el, {
    chart: { type: "area", height: 390, toolbar: { show: false } },
    series: [{ name: "Revenue (INR)", data }],
    xaxis: { categories: labels },
    yaxis: {
      labels: {
        formatter: (val) => formatCurrency(val),
      },
    },
    stroke: { curve: "smooth", width: 3 },
    dataLabels: { enabled: false },
    colors: ["#3980c0"],
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 0.4, opacityFrom: 0.45, opacityTo: 0.05 },
    },
    tooltip: {
      y: { formatter: (val) => formatCurrency(val) },
    },
  });
  superadminRevenueChart.render();
}

function updateSuperadminParamTable(data) {
  const tbody = document.querySelector(".table-responsive.pt-2 tbody");
  if (!tbody) return;

  const rows = [
    { label: "Products", today: data.totalProducts ?? 0, total: data.totalProducts ?? 0 },
    { label: "Brands", today: data.totalBrands ?? 0, total: data.totalBrands ?? 0 },
    { label: "Categories", today: data.totalCategories ?? 0, total: data.totalCategories ?? 0 },
    {
      label: "Colors / Sizes",
      today: `${data.totalColors ?? 0} / ${data.totalSizes ?? 0}`,
      total: `${data.totalColors ?? 0} / ${data.totalSizes ?? 0}`,
    },
  ];

  tbody.innerHTML = rows
    .map(
      (item) => `
    <tr>
      <th>${item.label}</th>
      <td>${item.today}</td>
      <td>${item.total}</td>
      <td>
        <div class="progress progress-sm">
          <div class="progress-bar bg-info" role="progressbar" style="width: 100%"></div>
        </div>
      </td>
      <td class="text-end">100%</td>
    </tr>`
    )
    .join("");
}

async function loadSuperadminDashboard() {
  if (window.__superadminDashboardLoaded) return;
  if (!document.getElementById("sdTotalRevenue")) return;

  const token = superadminDashboardToken();
  if (!token) return;

  try {
    const res = await fetch(SUPERADMIN_DASHBOARD_API, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Dashboard API error:", res.status, json);
      return;
    }

    const data = parseDashboardPayload(json);
    if (!data) return;

    setText("sdTotalRevenue", formatCurrency(data.totalRevenue));
    setText("sdTotalVendors", String(data.totalVendors ?? 0));
    setText("sdTotalUsers", String(data.totalUsers ?? 0));
    setText("sdRevenueCard", formatCurrency(data.totalRevenue));
    setText("sdTotalProducts", String(data.totalProducts ?? 0));
    setText("sdTotalOrders", String(data.totalOrders ?? 0));
    setText("sdTotalBrands", String(data.totalBrands ?? 0));
    setText("sdTotalCategories", String(data.totalCategories ?? 0));
    setText("sdTotalColors", String(data.totalColors ?? 0));
    setText("sdTotalSizes", String(data.totalSizes ?? 0));

    const trend = Array.isArray(data.trend) ? data.trend : [];
    renderSuperadminTrend(trend);
    updateSuperadminParamTable(data);

    if (trend.length) {
      const latest = trend[trend.length - 1];
      setText("sdTrendLatest", `${latest.month || ""}: ${formatCurrency(latest.revenue)}`);
    }

    window.__superadminDashboardLoaded = true;
  } catch (e) {
    console.error("Superadmin dashboard load error:", e);
  }
}

function scheduleDashboardLoad() {
  if (!document.getElementById("sdTotalRevenue")) return;
  setTimeout(loadSuperadminDashboard, 400);
}

if (document.readyState === "complete") {
  scheduleDashboardLoad();
} else {
  window.addEventListener("load", scheduleDashboardLoad);
}
