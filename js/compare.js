// === DEPTS ===
function buildDepts(){
  const c=document.getElementById('depts');c.innerHTML='';
  Object.entries(D).forEach(([dk,d])=>{
    let chips='';
    Object.entries(d.boards).forEach(([bk,b])=>{
      const n=getTR(dk,bk);
      const badge=n>0?` <span style="font-size:11px;color:var(--text-3)">${n}</span>`:'';
      chips+=`<div class="board-chip" onclick="startBoard('${dk}','${bk}')"><span>${b.icon}</span>${b.name}${badge}</div>`;
    });
    c.innerHTML+=`<div class="dept-card"><div class="dept-top"><div class="dept-emoji">${d.icon}</div><div class="dept-meta"><h3>${d.name}</h3><p>${d.desc}</p></div></div><div class="board-chips">${chips}</div></div>`;
  });
}

// === A/B ENGINE ===
let cD=null,cB=null,pool=[],pi=0,rr=[];
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function mkP(imgs){const s=shuf(imgs);const p=[];for(let i=0;i<s.length-1;i+=2)p.push([s[i],s[i+1]]);return p;}
function getTR(d,b){const v=JSON.parse(localStorage.getItem(`sc_ratings_${d}_${b}`)||'0');return typeof v==='number'?v:0;}
function addR(d,b,n){localStorage.setItem(`sc_ratings_${d}_${b}`,JSON.stringify(getTR(d,b)+n));}

function startBoard(dk,bk){
  cD=dk;cB=bk;const b=D[dk].boards[bk];
  pool=mkP(b.images);pi=0;rr=[];
  document.getElementById('arenaTitle').textContent=`${b.icon} ${b.name}`;
  document.getElementById('arenaSub').textContent=D[dk].name;
  updC();
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-arena').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('nav-test').classList.add('active');
  loadR();
}
function updC(){
  const t=getTR(cD,cB)+rr.length;
  document.getElementById('sC').textContent=rr.length;
  document.getElementById('tC').textContent=t;
  document.getElementById('pF').style.width=Math.min(100,Math.round(t/200*100))+'%';
}
function loadR(){
  if(pi>=pool.length){pool=mkP(D[cD].boards[cB].images);pi=0;}
  const[a,b]=pool[pi];
  document.getElementById('imgA').src=a.file;
  document.getElementById('imgB').src=b.file;
}
function pick(c){
  const[a,b]=pool[pi];
  rr.push({round:rr.length+1,a:a.label,b:b.label,choice:c,winnerTags:c==='A'?a.tags:c==='B'?b.tags:c==='both'?[...a.tags,...b.tags]:[],loserTags:c==='A'?b.tags:c==='B'?a.tags:[],winnerFiles:c==='A'?[a.file]:c==='B'?[b.file]:c==='both'?[a.file,b.file]:[],loserFiles:c==='A'?[b.file]:c==='B'?[a.file]:c==='both'?[]:[a.file,b.file]});
  pi++;updC();loadR();
  document.getElementById('undoBtn').classList.remove('hidden');
}
function undo(){if(!rr.length)return;rr.pop();if(pi>0)pi--;updC();loadR();if(!rr.length)document.getElementById('undoBtn').classList.add('hidden');}
function finish(){if(!rr.length){nav('test');return;}showRes();}

function showRes(){
  const dept=D[cD],board=dept.boards[cB];
  addR(cD,cB,rr.length);const tot=getTR(cD,cB);
  document.getElementById('resTitle').textContent=`${board.icon} ${board.name} — Style DNA`;
  const wg=document.getElementById('wG');wg.innerHTML='';
  rr.flatMap(r=>r.winnerFiles).forEach(f=>{const i=document.createElement('img');i.src=f;wg.appendChild(i);});
  const lg=document.getElementById('lG');lg.innerHTML='';
  rr.flatMap(r=>r.loserFiles).forEach(f=>{const i=document.createElement('img');i.src=f;lg.appendChild(i);});
  const ts={};
  rr.forEach(r=>{r.winnerTags.forEach(t=>{ts[t]=(ts[t]||0)+1;});r.loserTags.forEach(t=>{ts[t]=(ts[t]||0)-0.5;});});
  const sorted=Object.entries(ts).sort((a,b)=>b[1]-a[1]);
  const top=sorted.filter(([,v])=>v>0).slice(0,15);
  const bot=sorted.filter(([,v])=>v<0).slice(-10);
  let s=`${dept.name} · ${board.name} · ${rr.length} ratings (${tot}/200 total)\n\n`;
  s+='TOP:\n';top.forEach(([t,v])=>{s+=`  ${t}: ${'█'.repeat(Math.round(v*2))} (${v.toFixed(1)})\n`;});
  s+='\nREJECTED:\n';bot.forEach(([t,v])=>{s+=`  ${t}: (${v.toFixed(1)})\n`;});
  document.getElementById('resData').textContent=s;
  window.__r={department:cD,deptName:dept.name,board:cB,boardId:board.boardId,boardName:board.name,sessionRatings:rr.length,totalRatings:tot,results:rr,tagScores:Object.fromEntries(sorted),summary:s};
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById('screen-results').classList.add('active');
  document.getElementById('doneW').innerHTML='<button onclick="submitToLux()">Done — Send to Lux</button>';
  document.getElementById('saveStatus').innerHTML='';
  const ap={...window.__r,timestamp:new Date().toISOString(),submitted:false};
  localStorage.setItem(`sc_${cD}_${cB}_latest`,JSON.stringify(ap));
  const all=JSON.parse(localStorage.getItem('sc_history')||'[]');
  all.unshift(ap);localStorage.setItem('sc_history',JSON.stringify(all.slice(0,50)));
}

async function submitToLux(){
  const el=document.getElementById('saveStatus'),btn=document.getElementById('doneW');
  el.innerHTML='<div class="save-msg save-pending">Sending to Lux...</div>';
  btn.innerHTML='<div style="color:var(--text-3);font-size:14px;">Sending...</div>';
  const p={...window.__r,timestamp:new Date().toISOString(),submitted:true};
  localStorage.setItem(`sc_${cD}_${cB}_latest`,JSON.stringify(p));
  let binId=null;
  try{const r=await fetch('https://api.jsonbin.io/v3/b',{method:'POST',headers:{'Content-Type':'application/json','X-Bin-Private':'false'},body:JSON.stringify(p)});if(r.ok){const d=await r.json();binId=d.metadata.id;}}catch(e){}
  const inbox=JSON.parse(localStorage.getItem('sc_inbox')||'[]');
  inbox.unshift({binId,department:cD,board:cB,timestamp:p.timestamp});
  localStorage.setItem('sc_inbox',JSON.stringify(inbox.slice(0,20)));
  el.innerHTML='<div class="save-msg save-ok">✓ Sent to Lux — analysis incoming</div>';
  btn.innerHTML='<div style="color:var(--green);font-size:15px;font-weight:600;">✓ Submitted</div>';
}
function copyRes(){navigator.clipboard.writeText(JSON.stringify(window.__r,null,2)).then(()=>{});}
