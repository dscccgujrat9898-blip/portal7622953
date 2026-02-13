export function saveConfig(key, val){
  localStorage.setItem(key, val || "");
}
export function loadConfig(key, fallback=""){
  return localStorage.getItem(key) || fallback;
}

function jsonp(url){
  return new Promise((resolve, reject)=>{
    const cb = "__cb_" + Math.random().toString(36).slice(2);
    const script = document.createElement("script");
    const timeout = setTimeout(()=>{
      cleanup();
      reject(new Error("JSONP timeout"));
    }, 15000);

    function cleanup(){
      clearTimeout(timeout);
      delete window[cb];
      if(script && script.parentNode) script.parentNode.removeChild(script);
    }

    window[cb] = (data)=>{
      cleanup();
      resolve(data);
    };

    const sep = url.includes("?") ? "&" : "?";
    script.src = url + sep + "callback=" + cb;
    script.onerror = ()=>{
      cleanup();
      reject(new Error("JSONP load failed"));
    };
    document.body.appendChild(script);
  });
}

export function apiClient(baseUrl){
  const base = (baseUrl||"").replace(/\/+$/,""); // trim trailing slash
  return {
    async get(op, params={}){
      const u = new URL(base);
      u.searchParams.set("op", op);
      Object.keys(params||{}).forEach(k=> u.searchParams.set(k, params[k]));
      return await jsonp(u.toString()); // CORS-free
    },
    async post(op, body={}){
      // no-cors: request will go, but response can't be read
      const payload = JSON.stringify({ op, ...body });
      await fetch(base, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: payload
      });
      return { ok:true, note:"no-cors write sent" };
    }
  };
}
