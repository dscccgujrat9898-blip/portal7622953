export const KEYS = {
  BRAND: "DSP_BRAND",
  API_URL: "DSP_API_URL",
  ADMIN_TOKEN: "DSP_ADMIN_TOKEN",
  PORTAL_MENU: "DSP_PORTAL_MENU"
};

export function loadJSON(key, fallback){
  try{
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  }catch(e){
    return fallback;
  }
}
export function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadText(key, fallback=""){
  const v = localStorage.getItem(key);
  return v ?? fallback;
}
export function saveText(key, value){
  localStorage.setItem(key, value);
}

export function defaultBrand(){
  return {
    portalName: "DS Students Portal",
    tagline: "Learn • Practice • Achieve",
    logoDataUrl: "",         // base64
    bannerText: "Welcome to DS Students Portal",
    primary: "#2563eb"
  };
}

export function defaultMenu(){
  // Student menu items (admin controlled)
  return [
    {id:"home", label:"Dashboard", type:"internal", visible:true},
    {id:"courses", label:"My Courses", type:"internal", visible:true},
    {id:"subjects", label:"Subjects", type:"internal", visible:true},
    {id:"notes", label:"Notes Library", type:"internal", visible:true},
    {id:"exams", label:"Quizzes / Exams", type:"internal", visible:true},
    {id:"admission", label:"Admission Form", type:"internal", visible:true},
    {id:"history", label:"History / Attempts", type:"internal", visible:true},
    {id:"certs", label:"Certificates & Marksheet", type:"internal", visible:true},
    {id:"support", label:"Support Center", type:"internal", visible:true},
    {id:"settings", label:"Settings", type:"internal", visible:true}
  ];
}
