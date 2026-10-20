const V='steam-juegos-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./games/catalog.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{c.put(r,x.clone());return x;}))));return;}
  if(u.origin!==location.origin)return;
  if(/\/games\/[^/]+\.enc$/.test(u.pathname)){
    e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x;}))));return;}
  e.respondWith(fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put(r,y));return x;}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
