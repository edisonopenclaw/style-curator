// === LIBRARY ===
let af=new Set();
function buildFilters(){
  const f=document.getElementById('filters');
  ['cinematic','dark','surreal','abstract','minimal','typography','3d','fog','cosmic','neon','ui','noir'].forEach(t=>{
    f.innerHTML+=`<div class="pill" data-t="${t}" onclick="tf('${t}')">${t}</div>`;
  });
}
function tf(t){if(af.has(t))af.delete(t);else af.add(t);document.querySelectorAll('.pill').forEach(e=>e.classList.toggle('active',af.has(e.dataset.t)));render();}
function render(){
  const q=document.getElementById('q').value.toLowerCase().trim();
  let f=S;
  if(q)f=f.filter(s=>s.name.toLowerCase().includes(q)||s.desc.toLowerCase().includes(q)||s.sref.includes(q)||s.tags.some(t=>t.includes(q)));
  if(af.size)f=f.filter(s=>[...af].some(x=>s.tags.includes(x)));
  const g=document.getElementById('grid');
  if(!f.length){g.innerHTML='<div class="empty-state"><span class="big">⌕</span>No styles found.</div>';return;}
  g.innerHTML=f.map(s=>{
    const eng=s.engines.map(e=>{const l={midjourney:'MJ',sd:'SD',flux:'Flux',dalle:'DALL·E'}[e]||e;const c={midjourney:'e-mj',sd:'e-sd',flux:'e-flux',dalle:'e-dalle'}[e]||'';return`<span class="engine ${c}">${l}</span>`;}).join('');
    return`<div class="style-card" onclick="openS('${s.id}')"><div class="card-mosaic">${s.images.slice(0,4).map(i=>`<img src="${i}" loading="lazy">`).join('')}</div><div class="card-body"><div class="card-name">${s.name}</div><div class="card-code"><span>${s.sref}</span><span class="card-copy" onclick="event.stopPropagation();cc('${s.sref}',this)">Copy</span></div><div class="card-tags">${s.tags.slice(0,4).map(t=>`<span>${t}</span>`).join('')}</div><div class="card-engines">${eng}</div></div></div>`;
  }).join('');
}
function cc(c,el){navigator.clipboard.writeText(c).then(()=>{el.textContent='✓';setTimeout(()=>el.textContent='Copy',1200);});}
function openS(id){
  const s=S.find(x=>x.id===id);if(!s)return;
  const eng=s.engines.map(e=>{const l={midjourney:'MJ',sd:'SD',flux:'Flux',dalle:'DALL·E'}[e]||e;const c={midjourney:'e-mj',sd:'e-sd',flux:'e-flux',dalle:'e-dalle'}[e]||'';return`<span class="engine ${c}">${l}</span>`;}).join('');
  document.getElementById('mGallery').innerHTML=s.images.map(i=>`<img src="${i}" loading="lazy">`).join('');
  document.getElementById('mContent').innerHTML=`
    <h2>${s.name}</h2>
    <div class="modal-sref"><span>${s.sref}</span><button onclick="cc('${s.sref}',this)">Copy Code</button></div>
    <div class="modal-desc">${s.desc}</div>
    <div class="modal-label">Tags</div>
    <div class="modal-tags">${s.tags.map(t=>`<span>${t}</span>`).join('')}</div>
    <div class="modal-label">Compatible Engines</div>
    <div class="modal-engines">${eng}</div>
    <div class="modal-label">Example Prompt</div>
    <div class="modal-prompt-wrap"><span class="modal-prompt-copy" onclick="navigator.clipboard.writeText('${s.prompt}').then(()=>{this.textContent='✓';setTimeout(()=>this.textContent='Copy',1200);})">Copy</span><pre>${s.prompt}</pre></div>
  `;
  document.getElementById('overlay').classList.add('active');
}
function closeModal(){document.getElementById('overlay').classList.remove('active');}
function updStats(){document.getElementById('sN').textContent=S.length;const t=new Set();S.forEach(s=>s.tags.forEach(x=>t.add(x)));document.getElementById('sT').textContent=t.size;}
