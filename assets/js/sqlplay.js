const CDN='https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';
let SQL,db,vars={};const $=id=>document.getElementById(id);
const MON=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
const DAYS=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
const pad=(n,l=2)=>String(n).padStart(l,'0');
const pd=s=>{const m=/^(\d{4})-(\d{2})-(\d{2})/.exec(s==null?'':String(s));return m?new Date(Date.UTC(+m[1],m[2]-1,+m[3])):null};
const iso=d=>d.getUTCFullYear()+'-'+pad(d.getUTCMonth()+1)+'-'+pad(d.getUTCDate());
function toChar(v,f){if(v==null)return null;if(f==null)return String(v);const d=pd(v);if(!d)return String(v);
return f.replace(/YYYY|RRRR|YY|RR|MONTH|MON|MM|DAY|DY|DD|HH24|MI|SS/gi,t=>{switch(t.toUpperCase()){
case'YYYY':case'RRRR':return d.getUTCFullYear();case'YY':case'RR':return pad(d.getUTCFullYear()%100);
case'MONTH':return MONTH[d.getUTCMonth()];case'MON':return MON[d.getUTCMonth()];case'MM':return pad(d.getUTCMonth()+1);
case'DAY':return DAYS[d.getUTCDay()];case'DY':return DAYS[d.getUTCDay()].slice(0,3);case'DD':return pad(d.getUTCDate());default:return'00'}})}
function toDate(s,f){if(s==null)return null;f=f||'DD-MM-YYYY';const o=[];
const re=new RegExp('^'+f.replace(/YYYY|RRRR|YY|RR|MON|MM|DD|HH24|MI|SS|[^A-Za-z]/gi,t=>{const u=t.toUpperCase();
if(u=='YYYY'||u=='RRRR'){o.push('y');return'(\\d{4})'}if(u=='YY'||u=='RR'){o.push('yy');return'(\\d{2})'}
if(u=='MON'){o.push('mon');return'([A-Za-z]{3})'}if(u=='MM'){o.push('m');return'(\\d{1,2})'}if(u=='DD'){o.push('d');return'(\\d{1,2})'}
if(['HH24','MI','SS'].includes(u)){o.push('x');return'(\\d{1,2})'}return t.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})+'$');
const m=re.exec(String(s).trim());if(!m)throw new Error('ORA-01861: el literal no coincideix amb el format');
let y=0,mo=1,d=1;o.forEach((k,i)=>{const v=m[i+1];if(k=='y')y=+v;else if(k=='yy'){y=+v;y+=y<50?2000:1900}else if(k=='mon')mo=MON.indexOf(v.toUpperCase())+1;else if(k=='m')mo=+v;else if(k=='d')d=+v});
return y+'-'+pad(mo)+'-'+pad(d)}
function reg(){const F=(n,k,fn)=>{Object.defineProperty(fn,'length',{value:k});db.create_function(n,fn)};
F('NVL',2,(a,b)=>a==null?b:a);F('NVL2',3,(a,b,c)=>a==null?c:b);
for(let n=3;n<=9;n++)F('DECODE',n,(...a)=>{let i=1;for(;i+1<a.length;i+=2)if(a[0]===a[i])return a[i+1];return a.length%2==0?a[a.length-1]:null});
F('TO_CHAR',1,v=>toChar(v));F('TO_CHAR',2,(v,f)=>toChar(v,f));F('TO_DATE',1,s=>toDate(s));F('TO_DATE',2,(s,f)=>toDate(s,f));F('TO_NUMBER',1,v=>Number(v));
F('ADD_MONTHS',2,(d,n)=>{const x=pd(d);if(!x)return null;x.setUTCMonth(x.getUTCMonth()+n);return iso(x)});
F('MONTHS_BETWEEN',2,(a,b)=>{const x=pd(a),y=pd(b);return(x.getUTCFullYear()-y.getUTCFullYear())*12+x.getUTCMonth()-y.getUTCMonth()+(x.getUTCDate()-y.getUTCDate())/31});
F('LAST_DAY',1,d=>{const x=pd(d);return iso(new Date(Date.UTC(x.getUTCFullYear(),x.getUTCMonth()+1,0)))});
F('INITCAP',1,s=>s==null?null:String(s).toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()));
F('LPAD',3,(s,n,c)=>String(s).padStart(n,c));F('RPAD',3,(s,n,c)=>String(s).padEnd(n,c));F('POWER',2,(a,b)=>Math.pow(a,b))}
const clean=s=>s.replace(/^\s*(REM|SET)\b.*$/gmi,'').replace(/"?\bHR\b"?\./gi,'');
function pre(s){s=clean(s).replace(/^\s*UNDEFINE\s+(\w+)\s*;?/gmi,(m,v)=>{delete vars[v.toLowerCase()];return''})
.replace(/&(&?)(\w+)/g,(m,dbl,n)=>{n=n.toLowerCase();if(n in vars)return vars[n];const v=prompt('Introdueix un valor per a '+n+':');if(v===null)throw new Error('Execució cancel·lada');if(dbl)vars[n]=v;return v});
return s.replace(/\bMINUS\b/gi,'EXCEPT').replace(/\bSYSDATE\b/gi,"DATE('now')")}
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const table=r=>'<div class="tw"><table><tr>'+r.columns.map(c=>'<th>'+esc(c)+'</th>').join('')+'</tr>'+r.values.map(v=>'<tr>'+v.map(x=>'<td>'+(x===null?'<i>(null)</i>':esc(x))+'</td>').join('')+'</tr>').join('')+'</table></div><p class="m">'+r.values.length+' files</p>';
function run(sql){const r=db.exec(pre(sql));return r}
function show(el,sql){try{const r=run(sql);el.innerHTML=r.length?r.map(table).join(''):'<p class="m">Sentència executada ('+db.getRowsModified()+' files afectades).</p>'}catch(e){el.innerHTML='<p class="err">Error: '+esc(e.message)+'</p>'}}
function schema(){const q=db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name<>'dual' ORDER BY name")[0].values;
$('sch').innerHTML=q.map(([t])=>'<details><summary>'+t+'</summary><div class="m">'+db.exec('PRAGMA table_info('+t+')')[0].values.map(c=>c[1]+(c[5]?' 🔑':'')).join('<br>')+'</div></details>').join('')}
async function load(){db=new SQL.Database();reg();const t=await Promise.all(['hr-schema.sql','hr-data.sql'].map(f=>fetch((typeof BASE=='undefined'?'../':BASE)+'assets/data/'+f).then(r=>{if(!r.ok)throw new Error(f);return r.text()})));
t.forEach(x=>db.exec(clean(x)));schema()}
const G={B3:'B3 · Inici SQL',B4:'B4 · Restricció i petició de dades',B8:'B8 · Funcions de grup',B9:'B9 · JOINS',B10:'B10 · Subconsultes'};
const EX=[
['B3','Muestra todos los campos de la tabla <code>jobs</code>.','SELECT * FROM jobs'],
['B3','Muestra el nombre (<code>first_name</code>) y apellido de todos los empleados.','SELECT first_name, last_name FROM employees'],
['B4','Apellido y salario de los empleados que ganan más de 12.000.','SELECT last_name, salary FROM employees WHERE salary > 12000'],
['B4','Apellido y departamento del empleado 176.','SELECT last_name, department_id FROM employees WHERE employee_id = 176'],
['B4','Apellido y salario de quienes <b>no</b> ganan entre 5.000 y 12.000.','SELECT last_name, salary FROM employees WHERE salary NOT BETWEEN 5000 AND 12000'],
['B4','Apellido, job_id y fecha de contratación de Matos y Taylor, por fecha ascendente.',"SELECT last_name, job_id, hire_date FROM employees WHERE last_name IN ('Matos','Taylor') ORDER BY hire_date",1],
['B4','Apellido y departamento de los empleados de los departamentos 20 o 50, en orden alfabético.','SELECT last_name, department_id FROM employees WHERE department_id IN (20,50) ORDER BY last_name',1],
['B8','Máximo, mínimo, suma y media de los salarios de todos los empleados (media redondeada).','SELECT MAX(salary), MIN(salary), SUM(salary), ROUND(AVG(salary)) FROM employees'],
['B8','Número de empleados de cada <code>job_id</code>.','SELECT job_id, COUNT(*) FROM employees GROUP BY job_id'],
['B8','Los <code>job_id</code> con más de 2 empleados y cuántos tienen.','SELECT job_id, COUNT(*) FROM employees GROUP BY job_id HAVING COUNT(*) > 2'],
['B9','Apellido y nombre de departamento de cada empleado (JOIN).','SELECT e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id'],
['B9','Todos los empleados con su departamento, aunque no tengan (LEFT JOIN).','SELECT e.last_name, d.department_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id'],
['B9','Nombre de los departamentos que no tienen empleados.','SELECT d.department_name FROM departments d LEFT JOIN employees e ON e.department_id = d.department_id WHERE e.employee_id IS NULL'],
['B10','Número, apellido y salario de quienes ganan más que la media, por salario ascendente.','SELECT employee_id, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) ORDER BY salary',1],
['B10','Apellido y fecha de contratación de los contratados después de Davies, por fecha.',"SELECT last_name, hire_date FROM employees WHERE hire_date > (SELECT hire_date FROM employees WHERE last_name = 'Davies') ORDER BY hire_date",1]];
const nm=r=>r.values.map(x=>JSON.stringify(x.map(v=>typeof v=='number'?Math.round(v*100)/100:v)));
function check(ex,u,out){try{if(!/^\s*(select|with)\b/i.test(u)){out.innerHTML='<p class="err">Als exercicis només es permeten consultes SELECT.</p>';return}
const a=run(ex[2]).pop(),b=run(u).pop();if(!b){out.innerHTML='<p class="err">La consulta no retorna cap taula.</p>';return}
let m='';if(b.columns.length!=a.columns.length)m='Esperava '+a.columns.length+' columnes i en tens '+b.columns.length+'.';
else if(b.values.length!=a.values.length)m='Esperava '+a.values.length+' files i en tens '+b.values.length+'.';
else{let x=nm(a),y=nm(b);if(!ex[3]){x.sort();y.sort()}if(x.join()!=y.join())m=ex[3]?'Les dades o l’ordre no coincideixen.':'Les dades no coincideixen.'}
out.innerHTML=(m?'<p class="err">✗ '+m+' Revisa condicions i columnes.</p>':'<p class="okm">✓ Correcte!</p>')+table(b)}catch(e){out.innerHTML='<p class="err">Error: '+esc(e.message)+'</p>'}}
function build(){const c=$('ex');let last='';EX.forEach((ex,i)=>{if(ex[0]!=last){last=ex[0];c.insertAdjacentHTML('beforeend','<h3 id="'+last+'">'+G[last]+'</h3>')}
const d=document.createElement('div');d.className='xq';d.innerHTML='<p><b>'+(i+1)+'.</b> '+ex[1]+'</p><textarea rows="3" spellcheck="false" placeholder="SELECT ..."></textarea><div class="row"><button class="btn">Comprova</button><button class="btn g">Veure solució</button></div><div></div>';
const [t,[ok,sol],o]=[d.children[1],d.children[2].children,d.children[3]];ok.onclick=()=>check(ex,t.value,o);
sol.onclick=()=>{o.innerHTML='<pre>'+esc(ex[2])+'</pre>'};c.appendChild(d)})}
(async()=>{try{SQL=await initSqlJs({locateFile:f=>CDN+f});await load();if($('ex'))build();$('st').textContent='BD HR carregada ✓';
$('go').onclick=()=>show($('out'),$('sql').value);$('clr').onclick=()=>{$('sql').value='';$('out').innerHTML=''};
$('rst').onclick=async()=>{vars={};await load();$('out').innerHTML='<p class="m">Base de dades restaurada.</p>'};
$('sql').addEventListener('keydown',e=>{if(e.ctrlKey&&e.key=='Enter')show($('out'),$('sql').value)})}
catch(e){$('st').textContent='No s’ha pogut carregar: '+e.message+'. Cal obrir la pàgina des de GitHub Pages (o un servidor local) amb Internet.'}})();
