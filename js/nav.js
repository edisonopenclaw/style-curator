// === NAV ===
function nav(n){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(i=>i.classList.remove('active'));
  document.getElementById(`screen-${n}`).classList.add('active');
  document.getElementById(`nav-${n}`).classList.add('active');
  document.getElementById('undoBtn').classList.add('hidden');
  if(n==='test')buildDepts();
  if(n==='history')buildHist();
  if(n==='library'){renderCreators();renderTrending();render();updStats();}
}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){if(document.getElementById('overlay').classList.contains('active')){closeModal();return;}finish();return;}
  if(e.key==='z'||e.key==='Z'){undo();return;}
  if(!cB||!document.getElementById('screen-arena').classList.contains('active'))return;
  if(e.key==='ArrowLeft')pick('A');
  else if(e.key==='ArrowRight')pick('B');
  else if(e.key==='ArrowUp'){e.preventDefault();pick('both');}
  else if(e.key==='ArrowDown'){e.preventDefault();pick('skip');}
});

// HERO PILLS
function buildHeroPills(){
  const el=document.getElementById('heroPills');if(!el)return;
  const pills=['dark cinematic','surreal','neon noir','ethereal','retro','moody','abstract','illustration','cyberpunk','minimal'];
  el.innerHTML=pills.map(p=>`<span class="hero-pill" onclick="document.getElementById('q').value='${p}';render()">${p}</span>`).join('');
}

// INIT
buildHeroPills();buildFilters();renderCreators();renderTrending();render();updStats();
