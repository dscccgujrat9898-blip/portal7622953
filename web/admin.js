import { KEYS, loadJSON, saveJSON, loadText, saveText, defaultBrand, defaultMenu } from "./api.js";

const nav = document.getElementById("nav");
const navMore = document.getElementById("navMore");
const view = document.getElementById("view");
const viewTitle = document.getElementById("viewTitle");
const viewSub = document.getElementById("viewSub");
const status = document.getElementById("status");

const modal = document.getElementById("modal");
const btnApi = document.getElementById("btnApi");
const closeModal = document.getElementById("closeModal");
const apiUrl = document.getElementById("apiUrl");
const adminToken = document.getElementById("adminToken");
const saveApi = document.getElementById("saveApi");
const clearApi = document.getElementById("clearApi");

document.getElementById("openStudent").onclick = () => {
  // same folder
  const u = new URL(location.href);
  u.pathname = u.pathname.replace(/admin\.html$/i, "student.html");
  window.open(u.toString(), "_blank");
};
document.getElementById("goHome").onclick = () => render("home");
document.getElementById("btnLogout").onclick = () => {
  localStorage.removeItem(KEYS.ADMIN_TOKEN);
  alert("Logged out (admin token cleared).");
};

btnApi.onclick = () => { modal.style.display="flex"; };
closeModal.onclick = () => { modal.style.display="none"; };

saveApi.onclick = () => {
  const u = apiUrl.value.trim();
  const t = adminToken.value.trim();
  if(!u || !t) return alert("API URL + Admin Token required");
  saveText(KEYS.API_URL, u);
  saveText(KEYS.ADMIN_TOKEN, t);
  modal.style.display="none";
  alert("Saved ✅");
};
clearApi.onclick = () => {
  localStorage.removeItem(KEYS.API_URL);
  localStorage.removeItem(KEYS.ADMIN_TOKEN);
  apiUrl.value = "";
  adminToken.value = "";
  alert("Cleared");
};

function ensure(){
  const brand = loadJSON(KEYS.BRAND, null) ?? defaultBrand();
  saveJSON(KEYS.BRAND, brand);

  const menu = loadJSON(KEYS.PORTAL_MENU, null) ?? defaultMenu();
  saveJSON(KEYS.PORTAL_MENU, menu);

  // preload modal values
  apiUrl.value = loadText(KEYS.API_URL, "");
  adminToken.value = loadText(KEYS.ADMIN_TOKEN, "");

  // show status
  status.textContent = "READY";
}
ensure();

function setTitle(t, s){
  viewTitle.textContent = t;
  viewSub.textContent = s || "";
}

function renderNav(activeId){
  const menu = loadJSON(KEYS.PORTAL_MENU, defaultMenu());

  // admin left menu (fixed)
  const adminItems = [
    {id:"home", label:"Admin Home"},
    {id:"branding", label:"Branding & UI"},
    {id:"portal", label:"Portal Builder"},
    {id:"students", label:"Students"},
    {id:"courses", label:"Courses"},
    {id:"subjects", label:"Subjects"},
    {id:"exams", label:"Exams"},
    {id:"notes", label:"Notes/Documents"},
    {id:"results", label:"Results Control"},
    {id:"cert", label:"Certificates"},
    {id:"admission", label:"Admission Builder"},
  ];

  nav.innerHTML = "";
  for(const it of adminItems){
    const b = document.createElement("button");
    b.className = it.id===activeId ? "active" : "";
    b.innerHTML = `<span>${it.label}</span><span class="badge">↵</span>`;
    b.onclick = () => render(it.id);
    nav.appendChild(b);
  }

  // admin more: private tools links (placeholders)
  navMore.innerHTML = "";
  const more = [
    {label:"Poster Maker (admin-only)", url:"#"},
    {label:"Receipt/Slip (admin-only)", url:"#"},
    {label:"Internal Tool Link", url:"#"},
  ];
  for(const m of more){
    const b = document.createElement("button");
    b.innerHTML = `<span>${m.label}</span><span class="badge">🔒</span>`;
    b.onclick = () => alert("Phase-1 placeholder. Portal Builder से real link add करेंगे.");
    navMore.appendChild(b);
  }
}

function render(id){
  renderNav(id);

  if(id==="home"){
    setTitle("Admin Home", "Overview (Phase-1 offline demo)");
    const apiSet = !!loadText(KEYS.API_URL,"") && !!loadText(KEYS.ADMIN_TOKEN,"");
    view.innerHTML = `
      <div class="grid3">
        <div class="kv"><div><div class="muted">API</div><div style="font-weight:900">${apiSet?"Configured":"Not set"}</div></div><span class="badge ${apiSet?"ok":"warn"}">${apiSet?"OK":"SET"}</span></div>
        <div class="kv"><div><div class="muted">Students</div><div style="font-weight:900">Phase-2</div></div><span class="badge">Soon</span></div>
        <div class="kv"><div><div class="muted">Certificates</div><div style="font-weight:900">Phase-2</div></div><span class="badge">Soon</span></div>
      </div>
      <div class="hr"></div>
      <div class="notice">
        <div style="font-weight:900">Phase-1 goal</div>
        <div class="p" style="margin:6px 0 0">UI stable + no errors + Portal Builder works + Student portal sees branding + menus.</div>
      </div>
    `;
    return;
  }

  if(id==="branding"){
    setTitle("Branding & UI", "Change student banner/logo/colors from admin");
    const b = loadJSON(KEYS.BRAND, defaultBrand());
    view.innerHTML = `
      <div class="grid2">
        <div>
          <label>Portal Name</label>
          <input id="b_name" value="${escapeHtml(b.portalName)}" />
          <label>Tagline</label>
          <input id="b_tag" value="${escapeHtml(b.tagline)}" />
          <label>Banner Text</label>
          <input id="b_banner" value="${escapeHtml(b.bannerText)}" />
          <label>Primary Color</label>
          <input id="b_primary" value="${escapeHtml(b.primary)}" />
          <div class="row">
            <button class="btn primary" id="b_save">Save Branding</button>
            <button class="btn" id="b_reset">Reset</button>
          </div>
        </div>
        <div>
          <label>Logo Upload (PNG/JPG)</label>
          <input id="b_logo" type="file" accept="image/*" />
          <div class="notice" style="margin-top:10px">
            <div class="muted">Tip:</div>
            <div class="p" style="margin:0">Logo once upload → student portal top-left में auto दिखेगा.</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById("b_save").onclick = () => {
      const nb = {
        portalName: document.getElementById("b_name").value.trim() || "DS Students Portal",
        tagline: document.getElementById("b_tag").value.trim() || "",
        bannerText: document.getElementById("b_banner").value.trim() || "",
        primary: document.getElementById("b_primary").value.trim() || "#2563eb",
        logoDataUrl: b.logoDataUrl || ""
      };
      saveJSON(KEYS.BRAND, nb);
      alert("Saved ✅ (Open student page to see)");
    };
    document.getElementById("b_reset").onclick = () => {
      saveJSON(KEYS.BRAND, defaultBrand());
      alert("Reset ✅");
      render("branding");
    };

    const file = document.getElementById("b_logo");
    file.onchange = async () => {
      const f = file.files?.[0];
      if(!f) return;
      const dataUrl = await fileToDataUrl(f);
      const nb = loadJSON(KEYS.BRAND, defaultBrand());
      nb.logoDataUrl = dataUrl;
      saveJSON(KEYS.BRAND, nb);
      alert("Logo saved ✅");
    };
    return;
  }

  if(id==="portal"){
    setTitle("Portal Builder", "Add / Hide / Disable / DELETE student tabs without code");
    const menu = loadJSON(KEYS.PORTAL_MENU, defaultMenu());

    view.innerHTML = `
      <div class="grid2">
        <div class="card section" style="box-shadow:none">
          <div style="font-weight:900; font-size:16px">Add New Menu Item</div>
          <div class="row">
            <div class="field">
              <label>Label</label>
              <input id="m_label" placeholder="e.g. Live Classes" />
            </div>
            <div class="field">
              <label>Type</label>
              <select id="m_type">
                <option value="internal">Internal Page</option>
                <option value="embed">Embed Page (iframe)</option>
                <option value="link">External Link</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="field">
              <label>URL (for embed/link)</label>
              <input id="m_url" placeholder="https://..." />
            </div>
            <div class="field">
              <label>Visibility</label>
              <select id="m_vis">
                <option value="student">Student</option>
                <option value="admin">Admin only</option>
              </select>
            </div>
          </div>
          <div class="row">
            <button class="btn primary" id="m_add">Add</button>
            <button class="btn" id="m_addMore">Add to More dropdown</button>
          </div>
          <div class="notice" style="margin-top:10px">
            <div class="muted">Delete rule:</div>
            <div class="p" style="margin:0">Delete करने पर student menu से हट जाएगा. Hide = menu में नहीं दिखेगा, but link open हो सकेगा (future).</div>
          </div>
        </div>

        <div class="card section" style="box-shadow:none">
          <div style="font-weight:900; font-size:16px">Current Student Menu</div>
          <div id="menuTable"></div>
        </div>
      </div>
    `;

    const refreshTable = () => {
      const m = loadJSON(KEYS.PORTAL_MENU, defaultMenu());
      document.getElementById("menuTable").innerHTML = `
        <table class="table">
          <thead>
            <tr>
              <th>Label</th><th>Type</th><th>Visible</th><th>More</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${m.map(row => `
              <tr>
                <td><b>${escapeHtml(row.label)}</b><div class="muted" style="font-size:12px">${escapeHtml(row.id)}</div></td>
                <td>${escapeHtml(row.type || "internal")}</td>
                <td>${row.visible ? '<span class="badge ok">YES</span>' : '<span class="badge warn">HIDDEN</span>'}</td>
                <td>${row.more ? '<span class="badge">MORE</span>' : '<span class="badge">MENU</span>'}</td>
                <td class="row" style="gap:8px">
                  <button class="btn small" data-act="toggle" data-id="${row.id}">${row.visible ? "Hide" : "Show"}</button>
                  <button class="btn small" data-act="more" data-id="${row.id}">${row.more ? "To Menu" : "To More"}</button>
                  <button class="btn small danger" data-act="del" data-id="${row.id}">Delete</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;

      // bind actions
      document.querySelectorAll("[data-act]").forEach(btn=>{
        btn.onclick = () => {
          const act = btn.getAttribute("data-act");
          const id = btn.getAttribute("data-id");
          const arr = loadJSON(KEYS.PORTAL_MENU, defaultMenu());
          const i = arr.findIndex(x=>x.id===id);
          if(i<0) return;

          if(act==="toggle"){
            arr[i].visible = !arr[i].visible;
          } else if(act==="more"){
            arr[i].more = !arr[i].more;
          } else if(act==="del"){
            if(!confirm("Delete this menu item?")) return;
            arr.splice(i,1);
          }
          saveJSON(KEYS.PORTAL_MENU, arr);
          refreshTable();
        };
      });
    };

    document.getElementById("m_add").onclick = () => addMenu(false);
    document.getElementById("m_addMore").onclick = () => addMenu(true);

    function addMenu(toMore){
      const label = document.getElementById("m_label").value.trim();
      const type = document.getElementById("m_type").value;
      const url = document.getElementById("m_url").value.trim();
      const vis = document.getElementById("m_vis").value;

      if(!label) return alert("Label required");
      if((type==="embed" || type==="link") && !url) return alert("URL required for embed/link");

      const id = "m_" + label.toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,30) + "_" + Math.floor(Math.random()*999);

      const arr = loadJSON(KEYS.PORTAL_MENU, defaultMenu());
      arr.push({id, label, type, url, visible:true, more:toMore, visibility:vis});
      saveJSON(KEYS.PORTAL_MENU, arr);

      document.getElementById("m_label").value="";
      document.getElementById("m_url").value="";
      refreshTable();
      alert("Added ✅");
    }

    refreshTable();
    return;
  }

  // placeholders for next phases
  setTitle("Coming next", "Phase-2 connect with Google Sheet + Apps Script");
  view.innerHTML = `
    <div class="notice">
      <div style="font-weight:900">${escapeHtml(id)} module</div>
      <div class="p" style="margin:6px 0 0">
        Phase-1 में UI stable. Phase-2 में यह module Google Sheet schema से connect होगा.
      </div>
    </div>
  `;
}

render("home");

// helpers
function escapeHtml(str){
  return String(str ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function fileToDataUrl(file){
  return new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}
