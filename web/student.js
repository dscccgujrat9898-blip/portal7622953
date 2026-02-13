import { KEYS, loadJSON, defaultBrand, defaultMenu, loadText } from "./api.js";

const nav = document.getElementById("nav");
const navMore = document.getElementById("navMore");
const view = document.getElementById("view");
const viewTitle = document.getElementById("viewTitle");
const viewSub = document.getElementById("viewSub");
const status = document.getElementById("status");

const brandName = document.getElementById("brandName");
const brandTag = document.getElementById("brandTag");
const brandLogo = document.getElementById("brandLogo");

document.getElementById("goHome").onclick = () => render("home");
document.getElementById("btnLogout").onclick = () => alert("Student logout placeholder (Phase-2 login)");

// apply branding
function applyBrand(){
  const b = loadJSON(KEYS.BRAND, defaultBrand());
  brandName.textContent = b.portalName || "DS Students Portal";
  brandTag.textContent = b.tagline || "";
  document.documentElement.style.setProperty("--brand", b.primary || "#2563eb");
  document.documentElement.style.setProperty("--brand2", b.primary || "#1d4ed8");

  if(b.logoDataUrl){
    brandLogo.src = b.logoDataUrl;
    brandLogo.style.display = "block";
  }else{
    brandLogo.style.display = "none";
  }
}
applyBrand();

function setTitle(t, s){
  viewTitle.textContent = t;
  viewSub.textContent = s || "";
}

function renderNav(activeId){
  const menu = loadJSON(KEYS.PORTAL_MENU, defaultMenu());

  const studentItems = menu.filter(x => (x.visibility ?? "student")==="student" && !x.more).filter(x=>x.visible!==false);
  const moreItems = menu.filter(x => (x.visibility ?? "student")==="student" && x.more).filter(x=>x.visible!==false);

  nav.innerHTML="";
  studentItems.forEach(it=>{
    const b = document.createElement("button");
    b.className = it.id===activeId ? "active" : "";
    b.innerHTML = `<span>${it.label}</span><span class="badge">↵</span>`;
    b.onclick = () => render(it.id, it);
    nav.appendChild(b);
  });

  navMore.innerHTML="";
  moreItems.forEach(it=>{
    const b = document.createElement("button");
    b.innerHTML = `<span>${it.label}</span><span class="badge">↗</span>`;
    b.onclick = () => render(it.id, it);
    navMore.appendChild(b);
  });

  // always show back-to-home in more
  const homeBtn = document.createElement("button");
  homeBtn.innerHTML = `<span>Back to Home</span><span class="badge">🏠</span>`;
  homeBtn.onclick = () => render("home");
  navMore.appendChild(homeBtn);
}

function apiReady(){
  // student never sees api, but portal can show "configured" or not
  return !!loadText(KEYS.API_URL,"");
}

function render(id, item){
  renderNav(id);

  // safe status
  status.textContent = apiReady() ? "READY" : "OFFLINE";
  status.className = "badge " + (apiReady() ? "ok" : "warn");

  // main pages
  if(id==="home"){
    setTitle("Dashboard", "Welcome");
    view.innerHTML = `
      <div class="notice">
        <div style="font-weight:900">${escapeHtml(loadJSON(KEYS.BRAND, defaultBrand()).bannerText || "Welcome!")}</div>
        <div class="p" style="margin:6px 0 0">
          ${apiReady() ? "Portal configured ✅" : "Portal not configured yet. Please contact admin."}
        </div>
      </div>

      <div class="hr"></div>

      <div class="grid3">
        <div class="kv"><div><div class="muted">Active Exams</div><div style="font-weight:900">—</div></div><span class="badge">Phase-2</span></div>
        <div class="kv"><div><div class="muted">New Notes</div><div style="font-weight:900">—</div></div><span class="badge">Phase-2</span></div>
        <div class="kv"><div><div class="muted">Certificates</div><div style="font-weight:900">—</div></div><span class="badge">Phase-2</span></div>
      </div>
    `;
    return;
  }

  // dynamic added pages
  const type = item?.type || "internal";
  if(type==="internal"){
    setTitle(item?.label || "Page", "Content will be connected in Phase-2");
    view.innerHTML = `
      <div class="notice">
        <div style="font-weight:900">${escapeHtml(item?.label || "Page")}</div>
        <div class="p" style="margin:6px 0 0">This is a placeholder internal page. Admin can connect content later.</div>
      </div>
    `;
    return;
  }

  if(type==="embed"){
    setTitle(item?.label || "Embedded", "Embedded content");
    view.innerHTML = `
      <div class="notice">
        <div class="muted">Embedded URL:</div>
        <div style="font-weight:800; word-break:break-all">${escapeHtml(item?.url || "")}</div>
      </div>
      <div style="height:12px"></div>
      <div class="card" style="overflow:hidden; border-radius:16px; border:1px solid var(--line)">
        <iframe src="${escapeAttr(item?.url || "")}" style="width:100%; height:70vh; border:0"></iframe>
      </div>
    `;
    return;
  }

  if(type==="link"){
    setTitle(item?.label || "Link", "Opens in new tab");
    view.innerHTML = `
      <div class="notice">
        <div style="font-weight:900">${escapeHtml(item?.label || "Link")}</div>
        <div class="p" style="margin:6px 0 0">Click to open:</div>
        <div style="margin-top:10px" class="row">
          <a class="btn primary" target="_blank" href="${escapeAttr(item?.url || "#")}">Open Link ↗</a>
        </div>
      </div>
    `;
    return;
  }

  setTitle("Page", "");
  view.innerHTML = `<div class="notice">Page not available.</div>`;
}

render("home");

function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(str){
  return escapeHtml(str).replaceAll("`","&#096;");
}
