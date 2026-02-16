function buildHist(){
  const l=document.getElementById('hList');
  const all=JSON.parse(localStorage.getItem('sc_history')||'[]');
  if(!all.length){l.innerHTML='<div class="history-empty">No ratings yet.</div>';return;}
  l.innerHTML='';
  all.forEach(h=>{
    const d=new Date(h.timestamp);
    l.innerHTML+=`<div class="history-card"><h4>${h.deptName||''} · ${h.boardName||''}</h4><p>${d.toLocaleDateString()} ${d.toLocaleTimeString()} · ${h.sessionRatings||0} ratings · ${h.totalRatings||'?'}/200</p></div>`;
  });
}
