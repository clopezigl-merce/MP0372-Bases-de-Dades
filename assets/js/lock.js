(async()=>{
const S=document.currentScript.src,base=S.slice(0,S.indexOf('assets/js/lock.js'));
const b=document.body,type=b.dataset.lock,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let cfg={};
try{const c=new AbortController();setTimeout(()=>c.abort(),3000);
cfg=await(await fetch(base+'assets/data/exam.json?t='+Date.now(),{cache:'no-store',signal:c.signal})).json()}catch(e){}
const locked=type&&((type=='teoria'&&cfg.locked)||(type=='editor'&&cfg.blockEditor));
if(sessionStorage.getItem('prof')==='1'){const d=document.createElement('div');d.className='pbar';
d.innerHTML='🎓 Mode professor'+(sessionStorage.getItem('profuser')?' ('+esc(sessionStorage.getItem('profuser'))+')':'')+(locked?' · <b>bloqueig actiu</b>: els alumnes no veuen aquesta pàgina':'')+' · <a href="'+base+'professor.html">Panell</a>';b.prepend(d)}
else if(locked){const h=document.querySelector('.hero');if(h)h.remove();
const mn=document.querySelector('main');mn.hidden=true;mn.insertAdjacentHTML('beforebegin','<div class="lockbox"><span class="c">🔒</span><h2>'+(type=='editor'?'Editor SQL':'Teoria')+' bloquejat</h2><p>'+esc(cfg.message||'Aquest apartat no està disponible durant l’examen.')+'</p><a class="btn" href="'+base+'index.html">⌂ Inici</a></div>')}
b.style.visibility='visible';
if(type)setInterval(async()=>{try{const n=await(await fetch(base+'assets/data/exam.json?t='+Date.now(),{cache:'no-store'})).json();
if(!!n.locked!==!!cfg.locked||!!n.blockEditor!==!!cfg.blockEditor)location.reload()}catch(e){}},60000);
})();
