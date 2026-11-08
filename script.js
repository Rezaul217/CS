
// =====================================
// LOGIN SESSION + LOGOUT
// =====================================

function logoutPortal() {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("loginDate");
    window.location.replace("login.html");
}

document.addEventListener("DOMContentLoaded", function () {
    const userElement = document.getElementById("loggedUser");
    const currentUser = localStorage.getItem("user");

    if (userElement && currentUser) {
        userElement.textContent = "USER: " + currentUser;
    }
});

const API_URL = "https://script.google.com/macros/s/AKfycbwarxNIXnu1OwcqV5wFoiVIYwTNplvsEiz5Krgl0sbemLIuy1PuNPU7W2-f-p1TbwC46g/exec";


// =====================================
// BRANDS
// =====================================

const BRANDS = [
    { name: "DARAZPLAY", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/Dp-2-300x64.png" },
    { name: "KV8", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/kv8-300x64.png" },
    { name: "HEYBAJI", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/HB-300x64.png" },
    { name: "JEETBANGLA", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/jb-300x64.png" },
    { name: "JEETWAY", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/JWAY-300x64.png" },
    { name: "SUPERBAJI", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/SB-2-300x64.png" },
    { name: "SBJ66", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/SBJ66-300x64.png" },
    { name: "BETJDB", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/bjd-300x64.png" },
    { name: "BN88", logo: "https://heyvipwin.com/wp-content/uploads/2026/03/bn88-300x64.png" },
    { name: "BDVEGAS", logo: "https://heyvipwin.com/wp-content/uploads/2026/06/New-bdvegas-300x64.png" },
    { name: "CPC88", logo: "https://heyvipwin.com/wp-content/uploads/2026/06/CPC88-300x64.png" },
    { name: "DESHI777", logo: "https://heyvipwin.com/wp-content/uploads/2026/06/New-Deshi777-300x64.png" }
];


// =====================================
// PAYMENT METHODS
// =====================================

const PAYMENT_METHODS = [
    "Autopay",
    "JustPay",
    "EXMerchantPay",
    "SMEXPAY",
    "SmartPay",
    "SMSmartPay",
    "Sendmoney",
    "Cashthru",
    "MerchantPay"
];


// =====================================
// GLOBAL VARIABLES
// =====================================

let currentBrand = "S10";
let requestNumber = 0;

let agentSummaryLoaded = false;
let agentSummaryLoading = false;
let agentSummaryRequestNumber = 0;

let livePendingRequestNumber = 0;

let dailyReportReferences = {};
let dailyReportReferenceLoaded = false;
let dailyReportReferenceLoading = false;
let dailyReportReferenceRequestNumber = 0;

const ALL_BRAND_VALUE = "ALL_BRAND";
const ALL_BRAND_LABEL = "ALL Brand";

const DAILY_REPORT_FIELDS = [
    { id: "major", title: "🎯 Major Issues" },
    { id: "cs", title: "👥 CS Related Issues" },
    { id: "paymentManual", title: "🏦 Payment Issues (Manual Add/Edit)" },
    { id: "system", title: "🖥 System Minor Bugs Issues" },
    { id: "domain", title: "🌐 Domain-Related Issues" },
    { id: "provider", title: "📶 Provider Issues" }
];


// =====================================
// INITIALIZE DASHBOARD
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    createBrandButtons();
    restoreTheme();
    showBrand("S10");

});


// =====================================
// COMMON ELEMENT HELPER
// =====================================

function setElementDisplay(id, display) {

    const element = document.getElementById(id);

    if (element) {
        element.style.display = display;
    }

}


// =====================================
// CREATE BRAND BUTTONS
// =====================================

function createBrandButtons() {

    const slider = document.getElementById("brandSlider");

    if (!slider) return;

    slider.innerHTML = "";

    BRANDS.forEach(brand => {

        const button = document.createElement("button");

        button.className = "brand-btn";
        button.title = brand.name;

        button.innerHTML = `
            <img src="${brand.logo}" alt="${brand.name}">
        `;

        button.onclick = function () {
            showBrand(brand.name);
        };

        slider.appendChild(button);

    });

}


// =====================================
// SHOW BRAND DASHBOARD
// =====================================

function showBrand(brand) {
    setElementDisplay("allSheetSearchPage", "none");


    if (
        brand !== "S10" &&
        !BRANDS.some(item => item.name === brand)
    ) {
        return;
    }

    hideDailyReportPages();

    currentBrand = brand;

    setElementDisplay("brandPageHeading", "flex");
    setElementDisplay("brandTablesSection", "grid");

    const dashboardCards = document.querySelector(".dashboard-cards");

    if (dashboardCards) {
        dashboardCards.style.display = "grid";
    }

    setElementDisplay("referenceSection", "block");

    const referenceContent = document.getElementById("referenceContent");

    if (referenceContent) {
        referenceContent.innerHTML = "Loading References...";
    }

    setElementDisplay("brandBreak", "block");
    setElementDisplay("agentSummaryPage", "none");
    setElementDisplay("livePendingPage", "none");

    ["agentSummaryButton", "livePendingButton"].forEach(id => {

        const button = document.getElementById(id);

        if (button) {
            button.classList.remove("active");
        }

    });

    document.body.setAttribute("data-brand", brand);

    const title = document.getElementById("pageTitle");
    const logo = document.getElementById("pageLogo");

    if (brand === "S10") {

        if (title) {
            title.textContent = "S10 All OVER";
            title.style.display = "block";
        }

        if (logo) {
            logo.style.display = "none";
        }

    } else {

        const selectedBrand = BRANDS.find(item => item.name === brand);

        if (!selectedBrand) return;

        if (title) {
            title.style.display = "none";
        }

        if (logo) {
            logo.src = selectedBrand.logo;
            logo.style.display = "block";
        }

    }

    updateActiveButton(brand);
    loadSheetData(brand);

}


// =====================================
// ACTIVE BRAND BUTTON
// =====================================

function updateActiveButton(brand) {

    document.querySelectorAll(".brand-slider .brand-btn")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.title === brand
            );

        });

    const s10Button = document.querySelector(
        ".brand-navigation > .brand-btn"
    );

    if (s10Button) {
        s10Button.classList.toggle("active", brand === "S10");
    }

}


// =====================================
// LOAD GOOGLE SHEET DATA
// =====================================

function loadSheetData(brand) {

    const thisRequest = ++requestNumber;

    setText("videoRecords", "...");
    setText("refundRecords", "...");

    setHTML("videoTable", `
        <tr><td colspan="2">Loading...</td></tr>
    `);

    setHTML("refundTable", `
        <tr><td colspan="2">Loading...</td></tr>
    `);

    setHTML("videoTotal", "");
    setHTML("refundTotal", "");

    if (brand === "S10") {

        const agentBody = document.getElementById("agentSummaryTable");

        if (agentBody && !agentSummaryLoaded) {
            agentBody.innerHTML = `
                <tr><td colspan="15">Loading Agent Summary...</td></tr>
            `;
        }

    }

    const callbackName = "handleSheetData_" + thisRequest;

    window[callbackName] = function (data) {

        if (thisRequest !== requestNumber) {
            delete window[callbackName];
            return;
        }

        if (!data || !data.success) {

            showError(data?.message || "Unable to load data.");

            delete window[callbackName];
            return;

        }

        renderDashboard(data);

        if (brand === "S10") {

            renderAgentSummary(data.agentSummary || []);

            agentSummaryLoaded = true;
            agentSummaryLoading = false;

        }

        delete window[callbackName];

    };

    const oldScript = document.getElementById("sheetDataRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "sheetDataRequest";

    script.src =
        API_URL +
        "?brand=" + encodeURIComponent(brand) +
        "&callback=" + callbackName +
        "&_=" + Date.now();

    script.onerror = function () {

        if (thisRequest === requestNumber) {
            showError("Google Sheet connection failed.");
        }

        delete window[callbackName];
        script.remove();

    };

    script.onload = function () {
        script.remove();
    };

    document.body.appendChild(script);

}


// =====================================
// SMALL DOM HELPERS
// =====================================

function setText(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }

}


function setHTML(id, value) {

    const element = document.getElementById(id);

    if (element) {
        element.innerHTML = value;
    }

}


// =====================================
// RENDER DASHBOARD
// =====================================

function renderDashboard(data) {

    if (
        data.brand === "S10" &&
        data.references &&
        typeof data.references === "object"
    ) {

        dailyReportReferences = data.references;

        dailyReportReferenceLoaded = true;
        dailyReportReferenceLoading = false;

    }

    const videoTotal = (data.video || []).reduce(
        (sum, count) => sum + Number(count || 0),
        0
    );

    const refundTotal = (data.refund || []).reduce(
        (sum, count) => sum + Number(count || 0),
        0
    );

    setText("videoRecords", videoTotal.toLocaleString());
    setText("refundRecords", refundTotal.toLocaleString());

    renderTable("videoTable", "videoTotal", data.video || []);
    renderTable("refundTable", "refundTotal", data.refund || []);

    renderReferences(
        data.references || {},
        data.brand || currentBrand
    );

}


// =====================================
// LOAD AGENT SUMMARY DATA
// =====================================

function loadAgentSummaryData() {

    if (agentSummaryLoaded || agentSummaryLoading) {
        return;
    }

    agentSummaryLoading = true;

    const tbody = document.getElementById("agentSummaryTable");

    if (tbody) {
        tbody.innerHTML = `
            <tr><td colspan="15">Loading Agent Summary...</td></tr>
        `;
    }

    const thisRequest = ++agentSummaryRequestNumber;
    const callbackName = "handleAgentSummary_" + thisRequest;

    window[callbackName] = function (data) {

        if (thisRequest !== agentSummaryRequestNumber) {
            delete window[callbackName];
            return;
        }

        agentSummaryLoading = false;

        if (!data || !data.success) {

            showAgentSummaryError(
                data?.message || "Unable to load Agent Summary."
            );

            delete window[callbackName];
            return;

        }

        renderAgentSummary(data.agentSummary || []);

        agentSummaryLoaded = true;

        delete window[callbackName];

    };

    const oldScript = document.getElementById("agentSummaryRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "agentSummaryRequest";

    script.src =
        API_URL +
        "?brand=S10" +
        "&callback=" + callbackName +
        "&_=" + Date.now();

    script.onerror = function () {

        agentSummaryLoading = false;

        showAgentSummaryError("Google Sheet connection failed.");

        delete window[callbackName];
        script.remove();

    };

    script.onload = function () {
        script.remove();
    };

    document.body.appendChild(script);

}


// =====================================
// RENDER AGENT SUMMARY TABLE
// =====================================

function renderAgentSummary(data) {

    const tbody = document.getElementById("agentSummaryTable");

    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="16">No CS-PROVIDE VIDEO Agent Records Found</td>
            </tr>
        `;

        const countLabel = document.getElementById("agentSummaryCount");
        if (countLabel) countLabel.textContent = "0 agents";

        return;

    }

    const sortedData = [...data].sort((a, b) => {

        const difference =
            Number(b.total || 0) - Number(a.total || 0);

        if (difference !== 0) return difference;

        return String(a.agentNumber || "").localeCompare(
            String(b.agentNumber || "")
        );

    });

    tbody.innerHTML = sortedData.map(item => {

        const agentNumber = escapeHTML(item.agentNumber || "");
        const total = Number(item.total) || 0;

        // Reference IDs should be provided by the Google Apps Script from Sheet Column K.
        // Normalize values and remove duplicates for each agent.
        const rawReferenceIds = item.referenceIds ?? item.referenceId ?? item.references ?? [];
        const referenceList = (Array.isArray(rawReferenceIds)
            ? rawReferenceIds
            : String(rawReferenceIds || "").split(/[\\n,;|]+/))
            .map(value => String(value ?? "").trim())
            .filter(Boolean);
        const uniqueReferenceIds = [...new Set(referenceList)];
        const referenceCell = escapeHTML(uniqueReferenceIds.join(", ") || "-");

        const channelCounts = item.channels || {};
        const brandCounts = item.brands || {};

        const channelNames = PAYMENT_METHODS
            .filter(method => Number(channelCounts[method] || 0) > 0)
            .join(", ");

        const channelCell = `
            <td class="channel-name">
                <strong>${escapeHTML(channelNames || "-")}</strong>
            </td>
        `;

        const brandCells = BRANDS.map(brand => {

            const count = Number(brandCounts[brand.name] || 0);

            return `<td>${count.toLocaleString()}</td>`;

        }).join("");

        return `
            <tr>
                ${channelCell}

                <td><strong>${agentNumber}</strong></td>

                <td class="agent-reference-id"><strong>${referenceCell}</strong></td>

                <td class="agent-total">
                    <strong>${total.toLocaleString()}</strong>
                </td>

                ${brandCells}
            </tr>
        `;

    }).join("");

    // Apply an existing search after refreshing the table data.
    filterAgentSummary();

}


// =====================================
// AGENT SUMMARY SEARCH & FILTER
// =====================================

function filterAgentSummary() {

    const tbody = document.getElementById("agentSummaryTable");
    const searchInput = document.getElementById("agentSummarySearch");
    const countLabel = document.getElementById("agentSummaryCount");

    if (!tbody) return;

    const query = (searchInput?.value || "").trim().toLowerCase();
    const rows = Array.from(tbody.querySelectorAll("tr"));
    const table = tbody.closest("table");
    const headers = table
        ? Array.from(table.querySelectorAll("thead th")).map(th => th.textContent.trim().toLowerCase())
        : [];

    let totalRows = 0;
    let visibleRows = 0;

    rows.forEach(row => {

        // Ignore status/error rows which contain a single spanning cell.
        const cells = row.querySelectorAll("td");
        if (cells.length !== 16) {
            row.style.display = "";
            return;
        }

        totalRows++;

        const searchableText = [
            cells[0]?.textContent || "", // Channel Name
            cells[1]?.textContent || "", // Agent Number
            cells[2]?.textContent || ""  // Reference ID
        ].join(" ").toLowerCase();

        let matches = !query || searchableText.includes(query);

        // A brand search returns agents who have a count in that brand.
        if (query && !matches) {
            const matchingBrandIndexes = headers
                .map((header, index) => ({ header, index }))
                .filter(item => item.index >= 4 && item.header.includes(query));

            matches = matchingBrandIndexes.some(item => {
                const count = Number(cells[item.index]?.textContent.replace(/,/g, "")) || 0;
                return count > 0;
            });
        }

        row.style.display = matches ? "" : "none";
        if (matches) visibleRows++;

    });

    let emptyRow = document.getElementById("agentSummaryNoResults");

    if (query && totalRows > 0 && visibleRows === 0) {
        if (!emptyRow) {
            emptyRow = document.createElement("tr");
            emptyRow.id = "agentSummaryNoResults";
            emptyRow.innerHTML = '<td colspan="16">No matching agent found.</td>';
            tbody.appendChild(emptyRow);
        }
        emptyRow.style.display = "";
    } else if (emptyRow) {
        emptyRow.remove();
    }

    if (countLabel) {
        countLabel.textContent = query
            ? `${visibleRows} of ${totalRows} agents`
            : `${totalRows} agents`;
    }

}


function clearAgentSummarySearch() {

    const searchInput = document.getElementById("agentSummarySearch");
    if (!searchInput) return;

    searchInput.value = "";
    filterAgentSummary();
    searchInput.focus();

}


// =====================================
// RENDER BRAND WISE REFERENCES
// =====================================

function renderReferences(referenceData, selectedBrand) {

    const container = document.getElementById("referenceContent");

    if (!container) return;

    const brandsToShow = selectedBrand === "S10"
        ? BRANDS.map(brand => brand.name)
        : [selectedBrand];

    container.innerHTML = brandsToShow.map(brand => {

        const brandData = referenceData[brand] || {
            video: [],
            refund: []
        };

        return `
            <div class="reference-brand-block">

                ${
                    selectedBrand === "S10"
                        ? `<h2 class="reference-brand-title">${escapeHTML(brand)}</h2>`
                        : ""
                }

                <div class="reference-columns">

                    <div class="table-card">
                        <div class="table-title video-title">
                            CS-PROVIDE VIDEO
                        </div>

                        <div class="reference-list">
                            ${formatReferences(brandData.video)}
                        </div>
                    </div>

                    <div class="table-card">
                        <div class="table-title refund-title">
                            CS-REFUND
                        </div>

                        <div class="reference-list">
                            ${formatReferences(brandData.refund)}
                        </div>
                    </div>

                </div>
            </div>
        `;

    }).join("");

}


// =====================================
// FORMAT REFERENCES
// =====================================

function formatReferences(references) {

    if (!Array.isArray(references) || references.length === 0) {

        return `
            <span class="reference-empty">No Reference Found</span>
        `;

    }

    return references.map(reference => {

        return `
            <span class="reference-item">
                • <code>${escapeHTML(reference)}</code>
            </span>
        `;

    }).join("");

}


// =====================================
// AGENT SUMMARY ERROR
// =====================================

function showAgentSummaryError(message) {

    const tbody = document.getElementById("agentSummaryTable");

    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="16">${escapeHTML(message)}</td>
        </tr>
    `;

}


// =====================================
// LOAD LIVE PENDING DATA
// =====================================

function loadLivePendingData() {

    const thisRequest = ++livePendingRequestNumber;

    const container = document.getElementById("livePendingTables");

    if (!container) return;

    container.innerHTML = "Loading Live Pending...";

    const callbackName = "handleLivePending_" + thisRequest;

    window[callbackName] = function (data) {

        if (thisRequest !== livePendingRequestNumber) {
            delete window[callbackName];
            return;
        }

        if (!data || !data.success) {

            container.innerHTML = `
                <p>
                    ${escapeHTML(
                        data?.message || "Unable to load Live Pending data."
                    )}
                </p>
            `;

            delete window[callbackName];
            return;

        }

        renderLivePendingTable(data.livePendingSummary || []);

        delete window[callbackName];

    };

    const oldScript = document.getElementById("livePendingRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "livePendingRequest";

    script.src =
        API_URL +
        "?brand=S10" +
        "&callback=" + callbackName +
        "&_=" + Date.now();

    script.onerror = function () {

        if (thisRequest === livePendingRequestNumber) {
            container.innerHTML = `<p>Google Sheet connection failed.</p>`;
        }

        delete window[callbackName];
        script.remove();

    };

    script.onload = function () {
        script.remove();
    };

    document.body.appendChild(script);

}


// =====================================
// RENDER SUPER10 + BRAND WISE TABLES
// =====================================

function renderLivePendingTable(data) {

    const container = document.getElementById("livePendingTables");

    if (!container) return;

    if (!Array.isArray(data) || data.length === 0) {

        container.innerHTML = `<p>No Live Pending Records Found</p>`;

        return;

    }

    const sortedData = BRANDS.map(brand => {
        return data.find(item => item.brand === brand.name);
    }).filter(Boolean);


    let grandTotalPending = 0;
    let grandTotalBlank = 0;
    let grandTotalPG = 0;
    let grandTotalRefund = 0;
    let grandTotalVideo = 0;
    let grandTotalWrongWallet = 0;


    // =====================================
    // SUPER10 ALL BRAND SUMMARY
    // =====================================

    const summaryRows = sortedData.map(item => {

        const brandName = escapeHTML(item.brand || "");

        const total = Number(item.totalPending) || 0;
        const blank = Number(item.blank) || 0;
        const pg = Number(item.pgProcessing) || 0;
        const refund = Number(item.csRefund) || 0;
        const video = Number(item.csProvideVideo) || 0;
        const wrongWallet = Number(item.csWrongWallet) || 0;

        grandTotalPending += total;
        grandTotalBlank += blank;
        grandTotalPG += pg;
        grandTotalRefund += refund;
        grandTotalVideo += video;
        grandTotalWrongWallet += wrongWallet;

        return `
            <tr>
                <td class="pending-brand-name"><strong>${brandName}</strong></td>
                <td class="pending-total">${total.toLocaleString()}</td>
                <td>${blank.toLocaleString()}</td>
                <td>${pg.toLocaleString()}</td>
                <td>${refund.toLocaleString()}</td>
                <td>${video.toLocaleString()}</td>
                <td>${wrongWallet.toLocaleString()}</td>
            </tr>
        `;

    }).join("");


    const tableHeaders = `
        <tr>
            <th>Brand /<br>Payment Method</th>
            <th>Total<br>Pending</th>
            <th>Blank</th>
            <th>PG-<br>Processing</th>
            <th>CS-<br>Refund</th>
            <th>CS-<br>Provide Video</th>
            <th>CS-Wrong <br>walletdeposit / <br>invalidDeposit</th>
        </tr>
    `;


    const super10Summary = `
        <div class="live-pending-brand-block super10-summary-block">

            <h2 class="live-pending-brand-title">
                SUPER10 ALL BRAND
            </h2>

            <div class="live-pending-table-wrapper">

                <table class="live-pending-table">

                    <thead>${tableHeaders}</thead>

                    <tbody>${summaryRows}</tbody>

                    <tfoot>
                        <tr>
                            <td><strong>TOTAL</strong></td>
                            <td>${grandTotalPending.toLocaleString()}</td>
                            <td>${grandTotalBlank.toLocaleString()}</td>
                            <td>${grandTotalPG.toLocaleString()}</td>
                            <td>${grandTotalRefund.toLocaleString()}</td>
                            <td>${grandTotalVideo.toLocaleString()}</td>
                            <td>${grandTotalWrongWallet.toLocaleString()}</td>
                        </tr>
                    </tfoot>

                </table>

            </div>
        </div>
    `;


    // =====================================
    // BRAND WISE PAYMENT METHOD TABLES
    // =====================================

    const brandTables = sortedData.map(item => {

        const brandName = escapeHTML(item.brand || "");
        const methods = item.methods || {};

        let totalPending = 0;
        let totalBlank = 0;
        let totalPG = 0;
        let totalRefund = 0;
        let totalVideo = 0;
        let totalWrongWallet = 0;


        const rows = PAYMENT_METHODS.map(method => {

            const methodData = methods[method] || {};

            const total = Number(methodData.totalPending) || 0;
            const blank = Number(methodData.blank) || 0;
            const pg = Number(methodData.pgProcessing) || 0;
            const refund = Number(methodData.csRefund) || 0;
            const video = Number(methodData.csProvideVideo) || 0;
            const wrongWallet = Number(methodData.csWrongWallet) || 0;

            totalPending += total;
            totalBlank += blank;
            totalPG += pg;
            totalRefund += refund;
            totalVideo += video;
            totalWrongWallet += wrongWallet;

            return `
                <tr>
                    <td><strong>${escapeHTML(method)}</strong></td>
                    <td class="pending-total">${total.toLocaleString()}</td>
                    <td>${blank.toLocaleString()}</td>
                    <td>${pg.toLocaleString()}</td>
                    <td>${refund.toLocaleString()}</td>
                    <td>${video.toLocaleString()}</td>
                    <td>${wrongWallet.toLocaleString()}</td>
                </tr>
            `;

        }).join("");


        return `
            <div class="live-pending-brand-block">

                <h2 class="live-pending-brand-title">${brandName}</h2>

                <div class="live-pending-table-wrapper">

                    <table class="live-pending-table">

                        <thead>${tableHeaders}</thead>

                        <tbody>${rows}</tbody>

                        <tfoot>
                            <tr>
                                <td><strong>TOTAL</strong></td>
                                <td>${totalPending.toLocaleString()}</td>
                                <td>${totalBlank.toLocaleString()}</td>
                                <td>${totalPG.toLocaleString()}</td>
                                <td>${totalRefund.toLocaleString()}</td>
                                <td>${totalVideo.toLocaleString()}</td>
                                <td>${totalWrongWallet.toLocaleString()}</td>
                            </tr>
                        </tfoot>

                    </table>

                </div>
            </div>
        `;

    }).join("");


    container.innerHTML = super10Summary + brandTables;

}

// =====================================
// RENDER PAYMENT METHOD TABLE
// =====================================

function renderTable(bodyId, totalId, values) {

    const tbody = document.getElementById(bodyId);
    const tfoot = document.getElementById(totalId);

    if (!tbody || !tfoot) return;

    let total = 0;

    tbody.innerHTML = PAYMENT_METHODS.map((method, index) => {

        const count = Number(values[index]) || 0;

        total += count;

        return `
            <tr>
                <td><strong>${escapeHTML(method)}</strong></td>
                <td>${count.toLocaleString()}</td>
            </tr>
        `;

    }).join("");

    tfoot.innerHTML = `
        <tr>
            <td>Total</td>
            <td>${total.toLocaleString()}</td>
        </tr>
    `;

}


// =====================================
// ERROR HANDLING
// =====================================

function showError(message) {

    setText("videoRecords", "Error");
    setText("refundRecords", "Error");

    const safeMessage = escapeHTML(message);

    setHTML("videoTable", `
        <tr><td colspan="2">${safeMessage}</td></tr>
    `);

    setHTML("refundTable", `
        <tr><td colspan="2">${safeMessage}</td></tr>
    `);

    setHTML("videoTotal", "");
    setHTML("refundTotal", "");

    setHTML("referenceContent", `
        <div class="reference-empty">${safeMessage}</div>
    `);

}


// =====================================
// HTML ESCAPE
// =====================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// =====================================
// SEARCH ALL 12 BRAND SHEETS + BACKUP
// =====================================

let allSheetSearchRequest = 0;

function showAllSheetSearch() {
    hideAllDashboardPages();
    setElementDisplay("allSheetSearchPage", "block");

    ["agentSummaryButton", "livePendingButton", "sheetSearchButton"].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.classList.toggle("active", id === "sheetSearchButton");
    });

    document.querySelectorAll(".brand-btn").forEach(button => button.classList.remove("active"));
    setSheetSearchStatus("Ready to search", false);
}

function refreshAllSheetSearch() {
    const input = document.getElementById("allSheetSearchInput");
    if (input && input.value.trim()) {
        searchAllSheets();
    } else {
        checkAllSheetsLive();
    }
}

function checkAllSheetsLive() {
    const input = document.getElementById("allSheetSearchInput");
    if (input) input.value = "";
    searchAllSheets(true);
}

function setSheetSearchStatus(message, isError) {
    const status = document.getElementById("sheetLiveStatus");
    if (!status) return;
    status.innerHTML = `<span class="sheet-status-dot ${isError ? 'offline' : ''}"></span>${escapeHTML(message)}`;
}

function searchAllSheets(statusOnly) {
    const input = document.getElementById("allSheetSearchInput");
    const query = (input?.value || "").trim();
    if (!statusOnly && !query) {
        setSheetSearchStatus("Enter a search word first", true);
        if (input) input.focus();
        return;
    }

    const tbody = document.getElementById("allSheetSearchResults");
    if (tbody) tbody.innerHTML = `<tr><td colspan="10">Checking live Google Sheets...</td></tr>`;
    setSheetSearchStatus("Connecting to Google Sheets…", false);
    const count = document.getElementById("sheetSearchResultCount");
    if (count) count.textContent = "Searching…";

    const requestId = ++allSheetSearchRequest;
    const callbackName = "handleAllSheetSearch_" + requestId;
    let callbackReceived = false;
    let searchTimeout = null;

    window[callbackName] = function(data) {
        callbackReceived = true;
        if (searchTimeout) clearTimeout(searchTimeout);
        if (requestId !== allSheetSearchRequest) { delete window[callbackName]; return; }
        if (!data || !data.success) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="10">${escapeHTML(data?.message || "Search failed")}</td></tr>`;
            setSheetSearchStatus("Connection failed", true);
            if (count) count.textContent = "Search failed";
            delete window[callbackName];
            return;
        }

        const results = data.results || [];
        if (tbody) {
            if (statusOnly) {
                tbody.innerHTML = `<tr><td colspan="10">Live check completed across 12 brand sheets + BackuP. Enter a word to search records.</td></tr>`;
            } else if (!results.length) {
                tbody.innerHTML = `<tr><td colspan="10">No matches found for “${escapeHTML(query)}”.</td></tr>`;
            } else {
                tbody.innerHTML = results.map(item => `
                    <tr>
                        <td>
                            <strong>${escapeHTML(item.brand || "—")}</strong>
                            ${String(item.sourceSheet || "").toUpperCase() === "BACKUP"
                                ? '<span class="backup-result-label">BACKUP</span>'
                                : ""}
                        </td>
                        <td>${escapeHTML(item.paymentMethod || "—")}</td>
                        <td>${escapeHTML(item.agentNumber || "—")}</td>
                        <td>${escapeHTML(item.username || "—")}</td>
                        <td>${escapeHTML(item.pgStatus || item.status || "Blank")}</td>
                        <td>${escapeHTML(item.cashOutNumber || "—")}</td>
                        <td class="search-reference-cell">${escapeHTML(item.referenceId || item.reference || "—")}</td>
                        <td>${escapeHTML(item.amount || "—")}</td>
                        <td>${escapeHTML(item.cartId || "—")}</td>
                        <td>${escapeHTML(item.paymentStatus || "—")}</td>
                    </tr>`).join("");
            }
        }

        const timestamp = data.checkedAt || data.timestamp
            ? new Date(data.checkedAt || data.timestamp).toLocaleString()
            : new Date().toLocaleString();
        const checkedSheets = Number(
            data.connectedSheets ?? data.sheetsChecked ?? data.scannedSheets ?? 0
        );
        const missingSheets = Number(data.missingSheets ?? Math.max(0, 13 - checkedSheets));

        if (count) count.textContent = statusOnly
            ? `Live check: ${checkedSheets}/13 sheets connected`
            : `${results.length} result(s)${data.truncated ? " — first 300 shown" : ""}`;

        const updated = document.getElementById("sheetSearchUpdatedAt");
        if (updated) updated.textContent = `Last live check: ${timestamp}`;

        setSheetSearchStatus(
            missingSheets > 0
                ? `PARTIAL • ${checkedSheets}/13 connected • ${missingSheets} missing`
                : `LIVE • ${checkedSheets}/13 sheets checked`,
            missingSheets > 0
        );
        delete window[callbackName];
    };

    const oldScript = document.getElementById("allSheetSearchRequestScript");
    if (oldScript) oldScript.remove();
    const script = document.createElement("script");
    script.id = "allSheetSearchRequestScript";
    script.src = API_URL + "?action=search" +
        "&q=" + encodeURIComponent(statusOnly ? "" : query) +
        "&statusOnly=" + (statusOnly ? "1" : "0") +
        "&callback=" + callbackName + "&_=" + Date.now();
    script.onerror = function() {
        if (searchTimeout) clearTimeout(searchTimeout);
        if (requestId === allSheetSearchRequest) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="10">Google Sheet connection failed. Check Apps Script deployment access and confirm the latest search code is deployed.</td></tr>`;
            setSheetSearchStatus("Connection failed", true);
            if (count) count.textContent = "Connection failed";
        }
        delete window[callbackName];
        script.remove();
    };

    // JSONP can finish loading without calling the expected callback
    // when the deployed Apps Script version is outdated or misconfigured.
    searchTimeout = setTimeout(function() {
        if (!callbackReceived && requestId === allSheetSearchRequest) {
            if (tbody) tbody.innerHTML = `<tr><td colspan="10">No response from the Search API. Redeploy the Apps Script Web App and check that access is set to the intended users.</td></tr>`;
            setSheetSearchStatus("Search API did not respond", true);
            if (count) count.textContent = "No API response";
            delete window[callbackName];
            script.remove();
        }
    }, 20000);

    script.onload = function() {
        script.remove();
        // The callback normally runs before onload. If not, the timeout above
        // reports the missing JSONP response instead of leaving the page loading.
    };
    document.body.appendChild(script);
}

// =====================================
// DARK / LIGHT THEME
// =====================================

function toggleTheme() {

    const currentTheme =
        document.body.getAttribute("data-theme") || "dark";

    const newTheme =
        currentTheme === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", newTheme);

    localStorage.setItem("dashboardTheme", newTheme);

    updateThemeButton();

}


// =====================================
// RESTORE SAVED THEME
// =====================================

function restoreTheme() {

    const savedTheme =
        localStorage.getItem("dashboardTheme") || "dark";

    document.body.setAttribute("data-theme", savedTheme);

    updateThemeButton();

}


// =====================================
// UPDATE THEME BUTTON
// =====================================

function updateThemeButton() {

    const theme =
        document.body.getAttribute("data-theme") || "dark";

    const button = document.getElementById("themeToggle");

    if (!button) return;

    button.textContent =
        theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";

}


// =====================================
// OPEN AGENT SUMMARY SEPARATE PAGE
// =====================================

function showAgentSummary() {
    setElementDisplay("allSheetSearchPage", "none");


    hideDailyReportPages();

    setElementDisplay("brandPageHeading", "none");
    setElementDisplay("brandTablesSection", "none");
    setElementDisplay("referenceSection", "none");
    setElementDisplay("brandBreak", "none");

    const dashboardCards = document.querySelector(".dashboard-cards");

    if (dashboardCards) {
        dashboardCards.style.display = "none";
    }

    setElementDisplay("livePendingPage", "none");
    setElementDisplay("agentSummaryPage", "block");

    const agentButton = document.getElementById("agentSummaryButton");

    if (agentButton) {
        agentButton.classList.add("active");
    }

    const pendingButton = document.getElementById("livePendingButton");

    if (pendingButton) {
        pendingButton.classList.remove("active");
    }

    document.querySelectorAll(".brand-btn").forEach(button => {
        button.classList.remove("active");
    });

    agentSummaryLoaded = false;
    agentSummaryLoading = false;

    loadAgentSummaryData();

}


// =====================================
// OPEN LIVE PENDING SEPARATE PAGE
// =====================================

function showLivePending() {
    setElementDisplay("allSheetSearchPage", "none");


    hideDailyReportPages();

    setElementDisplay("brandPageHeading", "none");
    setElementDisplay("brandTablesSection", "none");
    setElementDisplay("referenceSection", "none");
    setElementDisplay("brandBreak", "none");

    const dashboardCards = document.querySelector(".dashboard-cards");

    if (dashboardCards) {
        dashboardCards.style.display = "none";
    }

    setElementDisplay("agentSummaryPage", "none");
    setElementDisplay("livePendingPage", "block");

    const pendingButton = document.getElementById("livePendingButton");

    if (pendingButton) {
        pendingButton.classList.add("active");
    }

    const agentButton = document.getElementById("agentSummaryButton");

    if (agentButton) {
        agentButton.classList.remove("active");
    }

    document.querySelectorAll(".brand-btn").forEach(button => {
        button.classList.remove("active");
    });

    loadLivePendingData();

}


// =====================================
// DAILY REPORT NAVIGATION
// =====================================

function hideDailyReportPages() {

    setElementDisplay("dailyReportEditPage", "none");
    setElementDisplay("dailyReportFinalPage", "none");

    const editButton = document.getElementById("dailyReportEditButton");
    const finalButton = document.getElementById("dailyReportFinalButton");

    if (editButton) {
        editButton.classList.remove("active");
    }

    if (finalButton) {
        finalButton.classList.remove("active");
    }

}


// =====================================
// HIDE ALL OTHER DASHBOARD PAGES
// =====================================

function hideAllDashboardPages() {
    setElementDisplay("allSheetSearchPage", "none");


    setElementDisplay("brandPageHeading", "none");
    setElementDisplay("brandTablesSection", "none");
    setElementDisplay("referenceSection", "none");
    setElementDisplay("brandBreak", "none");

    const dashboardCards = document.querySelector(".dashboard-cards");

    if (dashboardCards) {
        dashboardCards.style.display = "none";
    }

    setElementDisplay("agentSummaryPage", "none");
    setElementDisplay("livePendingPage", "none");

    const agentButton = document.getElementById("agentSummaryButton");
    const pendingButton = document.getElementById("livePendingButton");

    if (agentButton) {
        agentButton.classList.remove("active");
    }

    if (pendingButton) {
        pendingButton.classList.remove("active");
    }

    hideDailyReportPages();

}


// =====================================
// DAILY REPORT EDIT PAGE
// =====================================

function showDailyReportEdit() {

    hideAllDashboardPages();

    setElementDisplay("dailyReportEditPage", "block");

    const editButton = document.getElementById("dailyReportEditButton");

    if (editButton) {
        editButton.classList.add("active");
    }

    document.querySelectorAll(".brand-btn").forEach(button => {
        button.classList.remove("active");
    });

    initializeDailyReport();
    renderDailyReportEditor();

}


// =====================================
// INITIALIZE DAILY REPORT DROPDOWNS
// =====================================

function initializeDailyReport() {

    const editBrand = document.getElementById("editReportBrand");
    const finalBrand = document.getElementById("finalReportBrand");

    const options = [
        `<option value="${ALL_BRAND_VALUE}">${ALL_BRAND_LABEL}</option>`,
        ...BRANDS.map(brand =>
            `<option value="${brand.name}">${brand.name}</option>`
        )
    ].join("");

    if (editBrand) {

        const previousValue = editBrand.value;

        if (editBrand.options.length !== BRANDS.length + 1) {
            editBrand.innerHTML = options;
        }

        editBrand.value =
            previousValue &&
            [...editBrand.options].some(option => option.value === previousValue)
                ? previousValue
                : ALL_BRAND_VALUE;

        editBrand.onchange = renderDailyReportEditor;

    }

    if (finalBrand) {

        const previousValue = finalBrand.value;

        if (finalBrand.options.length !== BRANDS.length + 1) {
            finalBrand.innerHTML = options;
        }

        finalBrand.value =
            previousValue &&
            [...finalBrand.options].some(option => option.value === previousValue)
                ? previousValue
                : ALL_BRAND_VALUE;

        finalBrand.onchange = renderDailyReportPreview;

    }

    const editShift = document.getElementById("editReportShift");

    if (editShift) {
        editShift.onchange = renderDailyReportEditor;
    }

    const finalShift = document.getElementById("finalReportShift");

    if (finalShift) {
        finalShift.onchange = renderDailyReportPreview;
    }

}


// =====================================
// LOCAL DATE KEY
// =====================================

function getLocalDateKey() {

    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// =====================================
// LOCAL STORAGE KEY
// =====================================

function getDailyReportKey(brand, shift) {

    return `S10_DAILY_REPORT_${getLocalDateKey()}_${brand}_${shift}`;

}


// =====================================
// GET SAVED REPORT
// =====================================

function getDailyReportData(brand, shift) {

    try {

        return JSON.parse(
            localStorage.getItem(getDailyReportKey(brand, shift))
        ) || {};

    } catch (error) {

        return {};

    }

}


// =====================================
// SAVE REPORT
// ALL BRAND = UPDATE ALL 12 BRANDS
// SPECIFIC BRAND = UPDATE ONLY SELECTED BRAND
// =====================================

function saveDailyReportField(field, value) {

    const brandElement = document.getElementById("editReportBrand");
    const shiftElement = document.getElementById("editReportShift");

    if (!brandElement || !shiftElement) return;

    const brand = brandElement.value;
    const shift = shiftElement.value;

    // Load current report data
    const data = getDailyReportData(brand, shift);

    // Update the edited field
    data[field] = value;

    try {

        // Save selected report first
        localStorage.setItem(
            getDailyReportKey(brand, shift),
            JSON.stringify(data)
        );

        // =====================================
        // ALL BRAND SAVE LOGIC
        // Replace all 12 brand reports
        // with the ALL Brand report data
        // =====================================

        if (brand === ALL_BRAND_VALUE) {

            BRANDS.forEach(item => {

                localStorage.setItem(
                    getDailyReportKey(item.name, shift),
                    JSON.stringify(data)
                );

            });

        }

        const status = document.getElementById("dailyReportSaveStatus");

        if (status) {

            status.textContent =
                brand === ALL_BRAND_VALUE
                    ? "✓ ALL Brand Saved — All 12 Brands Updated"
                    : `✓ ${brand} Auto Saved`;

        }

        // Update Final Page preview automatically
        renderDailyReportPreview();

    } catch (error) {

        const status = document.getElementById("dailyReportSaveStatus");

        if (status) {
            status.textContent = "Save Failed — Browser Storage Full";
        }

    }

}


// =====================================
// RENDER DAILY REPORT EDITOR
// =====================================

function renderDailyReportEditor() {

    const brandElement = document.getElementById("editReportBrand");
    const shiftElement = document.getElementById("editReportShift");
    const fieldsContainer = document.getElementById("dailyReportEditFields");

    if (!brandElement || !shiftElement || !fieldsContainer) return;

    const brand = brandElement.value;
    const shift = shiftElement.value;

    const saved = getDailyReportData(brand, shift);

    const brandTitle =
        brand === ALL_BRAND_VALUE ? ALL_BRAND_LABEL : brand;

    fieldsContainer.innerHTML = `

        <div class="daily-report-brand-label">
            Editing Report: <strong>${escapeHTML(brandTitle)}</strong>
        </div>

        ${DAILY_REPORT_FIELDS.map(field => `

            <div class="daily-report-edit-card">

                <h3>${field.title}</h3>

                <textarea
                    data-report-field="${field.id}"
                    placeholder="Write ${field.title}..."
                    oninput="saveDailyReportField('${field.id}', this.value)"
                >${escapeHTML(saved[field.id] || "")}</textarea>

            </div>

        `).join("")}

    `;

    const status = document.getElementById("dailyReportSaveStatus");

    if (status) {
        status.textContent =
            brand === ALL_BRAND_VALUE
                ? "Auto Save Enabled — Saving ALL 12 Brands"
                : `Auto Save Enabled — ${brand}`;
    }

}


// =====================================
// DAILY REPORT FINAL PAGE
// =====================================

function showDailyReportFinal() {

    hideAllDashboardPages();

    setElementDisplay("dailyReportFinalPage", "block");

    const finalButton = document.getElementById("dailyReportFinalButton");

    if (finalButton) {
        finalButton.classList.add("active");
    }

    document.querySelectorAll(".brand-btn").forEach(button => {
        button.classList.remove("active");
    });

    initializeDailyReport();
    loadDailyReportReferences();
    renderDailyReportPreview();

}


// =====================================
// LOAD ALL BRAND PAYMENT REFERENCES
// =====================================

function loadDailyReportReferences() {

    if (dailyReportReferenceLoaded) {
        renderDailyReportPreview();
        return;
    }

    if (dailyReportReferenceLoading) {
        return;
    }

    dailyReportReferenceLoading = true;

    const thisRequest = ++dailyReportReferenceRequestNumber;
    const callbackName = "handleDailyReportReferences_" + thisRequest;

    window[callbackName] = function (data) {

        if (thisRequest !== dailyReportReferenceRequestNumber) {
            delete window[callbackName];
            return;
        }

        dailyReportReferenceLoading = false;

        if (!data || !data.success) {

            setText(
                "dailyReportPreview",
                data?.message || "Unable to load Payment References."
            );

            delete window[callbackName];
            return;

        }

        dailyReportReferences = data.references || {};
        dailyReportReferenceLoaded = true;

        renderDailyReportPreview();

        delete window[callbackName];

    };

    const oldScript = document.getElementById("dailyReportReferenceRequest");

    if (oldScript) {
        oldScript.remove();
    }

    const script = document.createElement("script");

    script.id = "dailyReportReferenceRequest";

    script.src =
        API_URL +
        "?brand=S10&callback=" +
        callbackName +
        "&_=" + Date.now();

    script.onerror = function () {

        if (thisRequest === dailyReportReferenceRequestNumber) {

            dailyReportReferenceLoading = false;

            setText(
                "dailyReportPreview",
                "Google Sheet connection failed while loading Payment References."
            );

        }

        delete window[callbackName];
        script.remove();

    };

    script.onload = function () {
        script.remove();
    };

    document.body.appendChild(script);

}


// =====================================
// DAY / NIGHT DEFAULT TEXT
// =====================================

function getShiftWord(shift) {

    return shift === "Day" ? "Today" : "Tonight";

}


// =====================================
// NORMALIZE REFERENCE ARRAY
// =====================================

function normalizeReferenceArray(value) {

    if (Array.isArray(value)) {
        return value;
    }

    if (value === null || value === undefined || value === "") {
        return [];
    }

    return [value];

}


// =====================================
// GET PAYMENT REFERENCES
// =====================================

function getPaymentReferences(brand) {

    if (brand !== ALL_BRAND_VALUE) {

        const brandData = dailyReportReferences[brand] || {};

        return {
            video: normalizeReferenceArray(brandData.video),
            refund: normalizeReferenceArray(brandData.refund)
        };

    }

    const allVideo = [];
    const allRefund = [];

    BRANDS.forEach(item => {

        const brandData = dailyReportReferences[item.name] || {};

        normalizeReferenceArray(brandData.video).forEach(reference => {
            allVideo.push(`${item.name}: ${reference}`);
        });

        normalizeReferenceArray(brandData.refund).forEach(reference => {
            allRefund.push(`${item.name}: ${reference}`);
        });

    });

    return {
        video: allVideo,
        refund: allRefund
    };

}


// =====================================
// PAYMENT ISSUE GENERATOR
// =====================================

function generatePaymentReport(brand, shift) {

    if (!dailyReportReferenceLoaded) {
        return "Loading Payment References...";
    }

    const references = getPaymentReferences(brand);

    const video = references.video;
    const refund = references.refund;

    const issues = [];

    // CS-Provide Video Issue
    if (video.length >= 13) {

        issues.push(
            `➡️CS-Provide Video Issue Reference: ${video.map(ref => `\`${ref}\``).join(" • ")}`
        );

    }

    // CS-Refund Issue
    if (refund.length >= 15) {

        issues.push(
            `➡️CS-Refund Issue Reference: ${refund.map(ref => `\`${ref}\``).join(" • ")}`
        );

    }

    if (issues.length === 0) {
        return `• No Payment Issues Reported ${getShiftWord(shift)}.`;
    }

    let remark = "";

    if (video.length >= 13 && refund.length >= 15) {

        remark = "➡️Remark: A significant number of Video Verification and Refund cases remain pending. We urgently request that all outstanding cases be reviewed and processed with the highest priority to minimize player waiting times, prevent further delays, and ensure a satisfactory customer experience.";

    } else if (video.length >= 13 && refund.length < 15) {

        remark = "➡️Remark: A significant number of Video Verification cases remain pending, resulting in repeated player follow-ups and increased waiting times. We strongly request that all outstanding cases be reviewed and processed with the highest priority to minimize delays and ensure a better customer experience.";

    }

    return [remark, ...issues].filter(Boolean).join("\n\n");

}

// =====================================
// COMBINE AUTOMATIC + MANUAL PAYMENT
// =====================================

function generateCombinedPaymentReport(brand, shift, saved) {
    const automaticPayment = generatePaymentReport(brand, shift);
    const manualPayment = String(saved.paymentManual || "").trim();

    const noPaymentMessage =
        `• No Payment Issues Reported ${getShiftWord(shift)}.`;

    const hasAutomatic =
        automaticPayment !== noPaymentMessage &&
        !automaticPayment.startsWith("Loading Payment References");

    // Manual first, Automatic second
    if (manualPayment && hasAutomatic) {
        return manualPayment + "\n\n" + automaticPayment;
    }

    if (manualPayment) {
        return manualPayment;
    }

    return automaticPayment;
}

// =====================================
// INDENT REPORT CONTENT
// PRESERVE MONOSPACE CODE BLOCK
// =====================================

function indentReportContent(content) {

    const indent = "                            ";

    let insideCodeBlock = false;

    return String(content)
        .split("\n")
        .map(line => {

            if (line.trim().startsWith("```")) {

                insideCodeBlock = !insideCodeBlock;

                return line;

            }

            if (insideCodeBlock) {
                return line;
            }

            return indent + line;

        })
        .join("\n");

}


// =====================================
// GENERATE FINAL REPORT
// =====================================

function generateDailyReportText() {

    const brandElement = document.getElementById("finalReportBrand");
    const shiftElement = document.getElementById("finalReportShift");

    if (!brandElement || !shiftElement) {
        return "Daily Report controls are missing.";
    }

    const brand = brandElement.value;
    const shift = shiftElement.value;

    const saved = getDailyReportData(brand, shift);


// =====================================
// REPORT DATE
// =====================================

const reportDate = new Date();

// Night Shift হলে আগের দিনের তারিখ
if (shift === "Night") {
    reportDate.setDate(reportDate.getDate() - 1);
}

const date = reportDate.toLocaleDateString("en-GB");

    const dayWord = getShiftWord(shift);

    const shiftTitle =
    shift === "Day"
        ? "**🎆 DAY SHIFT DAILY REPORT 🎆**"
        : "**🎆 NIGHT SHIFT DAILY REPORT 🎆**";

const sections = [

    {
        id: "major",
        title: "**🎯 1) Major Issues:**",
        fallback: `• No Major Issues Reported ${dayWord}.`
    },

    {
        id: "cs",
        title: "**👥 2) CS Related Issues:**",
        fallback: `• No CS Related Issues Reported ${dayWord}.`
    },

{
    id: "payment",
    title: "**🏦 3) Payment Issues:**",
    content: generateCombinedPaymentReport(brand, shift, saved)
},

    {
        id: "system",
        title: "**🖥 4) System Minor Bugs Issues:**",
        fallback: `• No System Minor Bug Issues ${dayWord}.`
    },

    {
        id: "domain",
        title: "**🌐 5) Domain-Related Issues:**",
        fallback: `• No Domain Issues Reported ${dayWord}.`
    },

    {
        id: "provider",
        title: "**📶 6) Provider Issues:**",
        fallback: `• No Provider Issues Reported ${dayWord}.`
    }

];

const report = [

    shiftTitle,

    `🗓 **Date:** ** ${date}**           ✍️ **Reported By:** **🍃Rezaul🍃** `,

    "",

    ...sections.flatMap(section => {

        const content =
            saved[section.id] && saved[section.id].trim() !== ""
                ? saved[section.id]
                : section.content || section.fallback;

        return [
            section.title,
            indentReportContent(content),
            ""
        ];

    })

];

return report.join("\n").trim();

}


// =====================================
// RENDER FINAL PREVIEW
// =====================================

function renderDailyReportPreview() {

    const preview = document.getElementById("dailyReportPreview");

    if (!preview) return;

    preview.textContent = generateDailyReportText();

}


// =====================================
// COPY FINAL REPORT
// =====================================

async function copyDailyReport() {

    const text = generateDailyReportText();

    const btn = document.getElementById("copyDailyReportBtn");

    if (!text || text.trim() === "" || !btn) return;

    const originalText = "📋 COPY TEXT";

    try {

        if (!navigator.clipboard || !window.isSecureContext) {
            throw new Error("Clipboard unavailable");
        }

        await navigator.clipboard.writeText(text);

        btn.textContent = "✅ COPIED!";

        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);

    } catch (error) {

        btn.textContent = "❌ COPY FAILED";

        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);

    }

}




// =====================================
// COPY FALLBACK
// =====================================

function copyDailyReportFallback(text) {

    const textarea = document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    textarea.setAttribute("readonly", "");

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let copied = false;

    try {
        copied = document.execCommand("copy");
    } catch (error) {
        copied = false;
    }

    textarea.remove();

    return copied;

}


// =====================================
// DOWNLOAD AGENT SUMMARY AS CSV
// =====================================

function downloadAgentSummaryCSV() {

    const table = document.querySelector(".agent-summary-table");
    const tbody = document.getElementById("agentSummaryTable");
    const button = document.getElementById("downloadAgentSummaryCSV");

    if (!table || !tbody) {
        alert("Agent Summary table not found.");
        return;
    }

    const rows = tbody.querySelectorAll("tr");

    // Check if data is available
    if (
        rows.length === 0 ||
        rows[0].querySelectorAll("td").length < 16
    ) {
        alert("No Agent Summary data available to download.");
        return;
    }

    // Get table headers
    const headers = Array.from(
        table.querySelectorAll("thead th")
    ).map(th => th.textContent.trim());

    // Get Agent Summary data
    const csvRows = [headers];

    rows.forEach(row => {

        const cells = Array.from(row.querySelectorAll("td"));

        if (cells.length !== headers.length) return;
        if (row.style.display === "none") return;

        const rowData = cells.map(cell =>
            cell.textContent.trim().replace(/\s+/g, " ")
        );

        csvRows.push(rowData);

    });

    if (csvRows.length <= 1) {
        alert("No Agent Summary records found.");
        return;
    }

    // Escape CSV values
    const escapeCSV = value => {

        const text = String(value ?? "");

        return `"${text.replace(/"/g, '""')}"`;

    };

    const csvContent = csvRows
        .map(row => row.map(escapeCSV).join(","))
        .join("\r\n");

    // UTF-8 BOM for Excel and Google Sheets
    const BOM = "\uFEFF";

    const blob = new Blob(
        [BOM + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const today = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `S10_Agent_Summary_${today}.csv`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);

    // Button feedback
    if (button) {

        const originalText = button.textContent;

        button.textContent = "✅ DOWNLOADED";

        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);

    }

}
