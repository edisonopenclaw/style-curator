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

// === TRENDING ===
function renderTrending(){
  const el=document.getElementById('trending');if(!el||!T||!T.length)return;
  el.innerHTML=`
    <div class="section-label">Trending Today</div>
    <div class="trending-row">${T.map(t=>`
      <div class="trending-card" onclick="openTrending('${t.id}')">
        <img class="trending-img" src="${t.image}" loading="lazy">
        <div class="trending-body">
          <div class="trending-title">${t.title}</div>
          <div class="trending-meta">${t.source} · ${t.tags.slice(0,2).join(', ')}</div>
        </div>
      </div>
    `).join('')}</div>
  `;
}
function openTrending(id){
  const t=T.find(x=>x.id===id);if(!t)return;
  document.getElementById('mGallery').innerHTML=`<img src="${t.image}" style="width:100%;height:280px;object-fit:cover;display:block">`;
  document.getElementById('mContent').innerHTML=`
    <h2>${t.title}</h2>
    <div style="font-size:13px;color:var(--text-3);margin-bottom:16px">${t.source} · ${t.date}</div>
    <div class="modal-desc">${t.desc}</div>
    <div class="modal-label">Tags</div>
    <div class="modal-tags">${t.tags.map(x=>`<span>${x}</span>`).join('')}</div>
  `;
  document.getElementById('overlay').classList.add('active');
}

// === CREATOR PROFILES ===
function renderCreators(){
  const el=document.getElementById('creators');if(!el||!C||!C.length)return;
  el.innerHTML=`
    <div class="section-label">Creators</div>
    <div class="creators-row">${C.map(c=>`
      <div class="creator-chip" onclick="openCreator('${c.id}')">
        <div class="chip-mosaic">${c.images.slice(0,4).map(i=>`<img src="${i}" loading="lazy">`).join('')}</div>
        <div class="chip-body">
          <img class="chip-avatar" src="${c.avatar}" alt="${c.name}">
          <div class="chip-info">
            <div class="chip-name">${c.name}</div>
            <div class="chip-handle">${c.handle}</div>
          </div>
        </div>
      </div>
    `).join('')}</div>
  `;
}
function openCreator(id){
  const c=C.find(x=>x.id===id);if(!c)return;
  // Get full image set from D (compare departments) if available
  const dept=D[id];
  const allImgs=dept?Object.values(dept.boards).flatMap(b=>b.images):[];
  document.getElementById('mGallery').innerHTML='';
  document.getElementById('mContent').innerHTML=`
    <div class="creator-modal-header">
      <img class="creator-modal-avatar" src="${c.avatar}" alt="${c.name}">
      <div>
        <h2 style="margin-bottom:4px">${c.name}</h2>
        <a href="${c.url}" target="_blank" style="color:var(--accent);font-size:14px;text-decoration:none;font-weight:500">${c.handle}</a>
      </div>
    </div>
    <div class="modal-desc">${c.bio}</div>
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:24px">
      <a href="${c.url}" target="_blank" style="padding:8px 20px;background:rgba(74,222,128,0.1);border:1px solid var(--accent);color:var(--accent);border-radius:var(--radius-xs);font-size:13px;font-weight:600;text-decoration:none">View on X ↗</a>
      <button onclick="closeModal();nav('test')" style="padding:8px 20px;background:var(--surface-2);border:1px solid var(--border);color:var(--text-2);border-radius:var(--radius-xs);font-size:13px;font-weight:500;cursor:pointer;font-family:var(--font)">Rate their art →</button>
    </div>
    <div class="modal-label">${allImgs.length} Works</div>
    <div class="creator-works">${allImgs.map((img,i)=>{
      const sref=img.sref||'';
      const srefHtml=sref?`<div class="work-sref"><span>${sref}</span><span class="card-copy" onclick="event.stopPropagation();cc('${sref}',this)">Copy</span></div>`:'';
      return`<div class="work-card">
        <img src="${img.file}" loading="lazy">
        <div class="work-info">
          <div class="work-label">${img.label}</div>
          ${srefHtml}
          <div class="work-tags">${img.tags.slice(0,3).map(t=>`<span>${t}</span>`).join('')}</div>
        </div>
      </div>`;
    }).join('')}</div>
  `;
  document.getElementById('overlay').classList.add('active');
}
