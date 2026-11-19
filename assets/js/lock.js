(()=>{
const S=document.currentScript.src,base=S.slice(0,S.indexOf('assets/js/lock.js')),ss=sessionStorage,FB=window.FB_CONFIG;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sha=async s=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode('M0372|'+s)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const load=u=>new Promise((r,j)=>{const s=document.createElement('script');s.src=u;s.onload=r;s.onerror=j;document.head.appendChild(s)});
const V='https://www.gstatic.com/firebasejs/10.12.2/';let fbp=null;
const initFB=()=>fbp||(fbp=(async()=>{await load(V+'firebase-app-compat.js');await Promise.all([load(V+'firebase-auth-compat.js'),load(V+'firebase-database-compat.js')]);
firebase.initializeApp(FB);await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);return firebase})());
const jcfg=async()=>(await fetch(base+'assets/data/exam.json?t='+Date.now(),{cache:'no-store'})).json();
const Exam={fb:!!FB,
async cfg(){if(FB){const f=await initFB();return(await f.database().ref('exam').get()).val()||{}}return jcfg()},
watch(cb){if(FB)initFB().then(f=>f.database().ref('exam').on('value',s=>cb(s.val()||{}))).catch(()=>{});
else{const t=()=>jcfg().then(cb).catch(()=>{});t();setInterval(t,60000)}},
async who(){if(FB){const f=await initFB();const u=await new Promise(r=>{const o=f.auth().onAuthStateChanged(x=>{o();r(x)})});return u?u.email.split('@')[0]:''}
return ss.getItem('prof')==='1'?(ss.getItem('profuser')||'professor'):''},
async login(u,p){u=u.trim().toLowerCase();try{if(FB){const f=await initFB();await f.auth().signInWithEmailAndPassword(u+'@m0372.app',p)}
else{const c=await jcfg();if(!(c.teachers&&c.teachers[u]&&c.teachers[u]===await sha(u+'|'+p)))return false}}catch(e){return false}
ss.setItem('prof','1');ss.setItem('profuser',u);return true},
async logout(){ss.removeItem('prof');ss.removeItem('profuser');if(FB){const f=await initFB();await f.auth().signOut()}},
async save(o){if(!FB)throw new Error('Firebase no configurat');const f=await initFB();await f.database().ref('exam').set(o)}};
window.Exam=Exam;
const b=document.body,type=b.dataset.lock;let first=true;
const cut=setTimeout(()=>{b.style.visibility='visible'},5000);
async function apply(cfg){const who=await Exam.who();
const locked=!!type&&!!cfg.locked&&(type=='teoria'||!!cfg.blockEditor);
let bar=document.getElementById('pbar');
if(who){if(!bar){bar=document.createElement('div');bar.id='pbar';bar.className='pbar';b.prepend(bar)}
bar.innerHTML='🎓 Mode professor ('+esc(who)+')'+(locked?' · <b>bloqueig actiu</b>: els alumnes no veuen aquesta pàgina':'')+' · <a href="'+base+'professor.html">Panell</a>'}
else if(bar)bar.remove();
const show=locked&&!who,mn=document.querySelector('main'),h=document.querySelector('.hero'),lb=document.getElementById('lockbox');
if(lb)lb.remove();if(mn)mn.hidden=show;if(h)h.style.display=show?'none':'';
if(show&&mn)mn.insertAdjacentHTML('beforebegin','<div id="lockbox" class="lockbox"><span class="c">🔒</span><h2>'+(type=='editor'?'Editor SQL':'Teoria')+' bloquejat</h2><p>'+esc(cfg.message||'Aquest apartat no està disponible durant l’examen.')+'</p><a class="btn" href="'+base+'inici.html">⌂ Inici</a></div>');
if(first){first=false;clearTimeout(cut);b.style.visibility='visible'}}
Exam.watch(apply);
})();
