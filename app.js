const $=s=>document.querySelector(s),fmt=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const R=[],add=(n,c,cap,f,z,o)=>R.push({i:R.length,n,c,cap,f,z,d:60+(R.length*53)%380,...o});
for(let k=1;k<=4;k++)add('Auditorium '+k,'Auditorium',120,['Projector','Whiteboard','Power outlets','Video conferencing'],'Block A',{t:'aud'});
for(let k=1;k<=8;k++)add('Tech Lab 6-0'+k,'Technology lab',30,['Power outlets','Projector'],'Tech Labs',{t:'lab'});
for(let k=1;k<=6;k++)add('Discussion Room '+k,'Library discussion room',6,['Whiteboard','Power outlets','Video conferencing'],'Library',{t:'disc'});
for(let k=1;k<=3;k++)add('Presentation Room '+k+' @ Cyber range','Meeting room',12,['Projector','Whiteboard','Power outlets','Video conferencing'],'Cyber range',{t:'meet'});
add('B-04-01','Laboratory',24,['Whiteboard','Power outlets'],'Block B',{t:'lab'});
['S-05-01 (Studio 1)','S-05-03 (Architecture Studio)','S-07-01 (Studio 3)'].forEach(n=>add(n,'Studio',20,['Whiteboard','Power outlets','Quiet study'],'Block B',{t:'studio'}));
add('Library Open Study Area','Library · open study',60,['Quiet study','Power outlets'],'Library',{t:'lib',lib:'s'});
add('Library Computer Zone','Library · computer area',24,['Power outlets'],'Library',{t:'lib',lib:'c'});
const seats={s:22,c:7},TOT={s:60,c:24};
const STU={1:[[540,660],[780,900]],2:[[510,630],[900,1020]],3:[[600,720],[840,960]],4:[[510,630],[900,960]],5:[[540,720]]};
const FACS=['Whiteboard','Projector','Power outlets','Quiet study','Video conferencing'];
const TYPES=[['all','All'],['lib','Library'],['disc','Discussion'],['lab','Labs'],['aud','Auditorium']];
const dow=new Date().getDay();
const S={day:dow>0&&dow<6?dow:1,t:660,dur:90,ppl:2,fac:new Set(),type:'all'};
const V={};
const cap=r=>r.lib?seats[r.lib]:r.cap;
function busy(r,day,m){if(day==0||day==6||r.lib||m<510||m>=1020)return false;const s=Math.floor((m-510)/120);return r.t=='disc'?(r.i+day+Math.floor(m/60))%7==0:(r.i*3+day*2+s)%4==0}
function conflict(r,day,t,d){if(t<480||t+d>1320)return true;for(let m=t;m<t+d;m+=30)if(busy(r,day,m))return true;return false}
function stuBusy(day,t,d){return(STU[day]||[]).some(([a,b])=>t<b&&t+d>a)}
function typeOk(r){const y=S.type;return y=='all'||(y=='lib'?(r.t=='lib'||r.t=='disc'):r.t==y)}
function pass(r,day,t){return typeOk(r)&&cap(r)>=S.ppl&&[...S.fac].every(f=>r.f.includes(f))&&!conflict(r,day,t,S.dur)}
function score(r,day,t){const c=Math.max(8,25-Math.round(Math.max(0,cap(r)-S.ppl)*.25)),f=S.fac.size?25:18,s=stuBusy(day,t,S.dur)?6:25,p=Math.max(5,25-Math.round(r.d/18));return{total:c+f+s+p,parts:[['Capacity',c],['Facilities',f],['Class gap',s],['Distance',p]]}}
function nextFree(r){for(let k=0;k<7;k++){const day=(S.day+k)%7;for(let m=k?480:Math.max(480,S.t);m+S.dur<=1320;m+=30)if(!conflict(r,day,m,S.dur))return DAYS[day]+' '+fmt(m)}return null}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),2600)}
function chips(el,items,isOn,fn){$(el).innerHTML=items.map(([v,l])=>`<button type="button" class="pill ${isOn(v)?'on':''}" data-v="${v}">${l}</button>`).join('');$(el).onclick=e=>{const b=e.target.closest('button');if(b)fn(b.dataset.v)}}
function sync(){
chips('#days',[1,2,3,4,5,6,0].map(d=>[d,DAYS[d]]),v=>S.day==v,v=>{S.day=+v;sync()});
chips('#durs',[30,60,90,120,180].map(d=>[d,d<60?d+'m':d/60+'h'+(d%60?'30':'')]).map(([v,l])=>[v,v==90?'1.5h':l]),v=>S.dur==v,v=>{S.dur=+v;sync()});
chips('#types',TYPES,v=>S.type==v,v=>{S.type=v;sync()});
chips('#facs',FACS.map(f=>[f,f]),v=>S.fac.has(v),v=>{S.fac.has(v)?S.fac.delete(v):S.fac.add(v);sync()});
$('#time').value=S.t;$('#tl').textContent=fmt(S.t)+'–'+fmt(S.t+S.dur);$('#ppl').value=S.ppl;$('#when').textContent=DAYS[S.day]+' '+fmt(S.t);render()}
function render(){
const hits=new Set(),list=[];
R.forEach(r=>{if(pass(r,S.day,S.t)){const sc=score(r,S.day,S.t);list.push({r,sc});hits.add(r.i)}});
list.sort((a,b)=>b.sc.total-a.sc.total);
const zones={};R.forEach(r=>(zones[r.z]=zones[r.z]||[]).push(r));
$('#map').innerHTML=Object.entries(zones).map(([z,rs])=>`<div class="zone"><h4>${z.toUpperCase()}</h4><div class="tiles">${rs.map(r=>{const b=conflict(r,S.day,S.t,S.dur);return`<div class="tile ${hits.has(r.i)?'hit':b?'busy':'free'}" title="${r.n}" data-i="${r.i}" style="cursor:pointer">${r.i+1}</div>`}).join('')}</div></div>`).join('');
$('#map').onclick=e=>{const t=e.target.closest('.tile');if(t)open(+t.dataset.i)};
const gapOk=!stuBusy(S.day,S.t,S.dur);
let h=list.slice(0,6).map(({r,sc},i)=>`<div class="card ${i?'':'top'}" style="animation-delay:${i*70}ms" data-i="${r.i}"><div><h3>${r.n}${i?'':' <span class="tag">BEST MATCH</span>'}</h3><div class="meta">${r.c} · ${r.lib?seats[r.lib]+' seats free (simulated)':'up to '+r.cap+' people'} · ~${r.d} m away (demo)</div><div class="tags"><span class="tag">Fits ${S.ppl}</span><span class="tag">${S.dur} min clear</span>${gapOk?'<span class="tag">Fits your class gap</span>':''}${[...S.fac].slice(0,2).map(f=>`<span class="tag">${f}</span>`).join('')}</div></div><div class="ring" style="--s:${sc.total}"><b>${sc.total}</b></div></div>`).join('');
if(!list.length){let alts='';for(let m=S.t+30,n=0;m+S.dur<=1320&&n<3;m+=30){const b=R.filter(r=>pass(r,S.day,m)).sort((a,b)=>score(b,S.day,m).total-score(a,S.day,m).total)[0];if(b){n++;alts+=`<div class="alt"><span><b>${b.n}</b><br><small style="color:var(--mut)">${DAYS[S.day]} ${fmt(m)}–${fmt(m+S.dur)}</small></span><button class="btn" onclick="S.t=${m};sync()">Use this time</button></div>`}}h=`<div class="none"><h3 style="margin:0">No space matches this time</h3><p style="color:var(--mut)">Your group size, facilities or class clash rule everything out.</p>${alts||'<p>No later slot today. Try fewer facilities or another day.</p>'}</div>`}
$('#res').innerHTML=h;$('#res').onclick=e=>{const c=e.target.closest('.card');if(c)open(+c.dataset.i)};
}
function open(i){const r=R[i],sc=score(r,S.day,S.t),v=V[r.n];
let bar='';for(let m=480;m<1320;m+=30)bar+=`<i class="${conflict(r,S.day,m,30)?'b':''}" title="${fmt(m)}"></i>`;
$('#sheet').innerHTML=`<button class="btn ghost" onclick="closeD()" style="float:right">✕</button><div class="eyebrow">${r.z.toUpperCase()}</div><h2 style="font-size:30px">${r.n}</h2><p class="sub">${r.c} · ${r.lib?seats[r.lib]+' of '+TOT[r.lib]+' seats free (simulated)':'up to '+r.cap+' people'}</p><div class="tags">${r.f.map(f=>`<span class="tag">${f}</span>`).join('')}</div>
<div class="lbl">${DAYS[S.day].toUpperCase()} · 08:00 TO 22:00 <span>green = free · red = class</span></div><div class="bar">${bar}</div>
<p class="sub">${r.lib?'Seat count only. No class timetable.':'Next free slot for '+S.dur+' min: <b style="color:var(--fg)">'+(nextFree(r)||'none in 7 days')+'</b>'}</p>
<div class="lbl">WHY THIS SCORE · ${sc.total}/100</div>${sc.parts.map(([n,x])=>`<div class="sc"><span>${n}</span><div><i style="width:${x*4}%"></i></div><b>${x}/25</b></div>`).join('')}
<div class="lbl">IS IT REALLY FREE? <span>local demo only</span></div><div class="row"><button class="pill" onclick="ver(${i},'free')">Still free</button><button class="pill" onclick="ver(${i},'occupied')">Occupied</button></div>
<p class="sub" id="vs">${v?'Reported '+v.s+' · just now (this browser only)':'A timetable can’t prove a room is empty. Student reports could close that gap.'}</p>`;
$('#dr').classList.add('on')}
function ver(i,s){V[R[i].n]={s};$('#vs').textContent='Reported '+s+' · just now (this browser only)';toast('Thanks, report saved in this demo')}
function closeD(){$('#dr').classList.remove('on')}
$('#dr').onclick=e=>{if(e.target.id=='dr')closeD()};addEventListener('keydown',e=>e.key=='Escape'&&closeD());
function gap(){for(let k=0;k<5;k++){const day=((S.day-1+k)%5)+1;for(let m=(k?480:Math.max(480,Math.ceil(S.t/30)*30));m+S.dur<=1320;m+=30)if(!stuBusy(day,m,S.dur)){S.day=day;S.t=m;sync();toast('Gap found: '+DAYS[day]+' '+fmt(m)+'–'+fmt(m+S.dur));$('#res').scrollIntoView({behavior:'smooth',block:'center'});return}}toast('No gap this long. Try a shorter duration.')}
function ask(text){const l=text.toLowerCase();let m;
if(m=l.match(/(\d+)\s*(?:people|pax|persons?|students|of us)|for\s+(\d+)(?!\s*(?:h|m))/))S.ppl=Math.min(100,+(m[1]||m[2]));
if(m=l.match(/(\d+(?:\.\d+)?)[-\s]?(hours?|hrs?|hr|minutes?|mins?|min)\b/))S.dur=Math.max(30,Math.min(360,Math.round(+m[1]*(/^h/.test(m[2])?60:1)/30)*30));
if(m=l.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/)){let h=+m[1]%12+(m[3]=='pm'?12:0);S.t=Math.max(480,Math.min(1260,h*60+(+m[2]||0)))}
DAYS.forEach((d,i)=>{if(new RegExp('\\b'+['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][i]).test(l))S.day=i});
S.fac=new Set();if(/whiteboard/.test(l))S.fac.add('Whiteboard');if(/projector|present/.test(l))S.fac.add('Projector');if(/power|charg|plug/.test(l))S.fac.add('Power outlets');if(/video|zoom/.test(l))S.fac.add('Video conferencing');if(/quiet|silent/.test(l))S.fac.add('Quiet study');
S.type=/discussion/.test(l)?'disc':/library|seat/.test(l)?'lib':/auditorium/.test(l)?'aud':/\blab/.test(l)?'lab':'all';
sync();if(/gap|between classes/.test(l))gap();else $('#res').scrollIntoView({behavior:'smooth',block:'center'})}
$('#askf').onsubmit=e=>{e.preventDefault();ask($('#ask').value)};
$('#time').oninput=e=>{S.t=+e.target.value;sync()};
$('#ppl').innerHTML=[1,2,4,6,10,20,50,100].map(n=>`<option value="${n}">${n}+ people</option>`).join('');$('#ppl').onchange=e=>{S.ppl=+e.target.value;sync()};
$('#gap').onclick=gap;
function demo(){location.hash='finder';const q='I have 90 minutes, need a quiet place for 4 people with a whiteboard';let i=0;$('#ask').value='';const h=setInterval(()=>{$('#ask').value=q.slice(0,++i);if(i>=q.length){clearInterval(h);setTimeout(()=>ask(q),400)}},28)}
// heatmap, tick, counters, motion
let hm='<span></span>'+Array.from({length:14},(_,k)=>`<span>${8+k}</span>`).join('');
[1,2,3,4,5].forEach(d=>{hm+=`<span>${DAYS[d]}</span>`;for(let k=0;k<14;k++){const rs=R.filter(r=>!r.lib),u=rs.filter(r=>busy(r,d,(8+k)*60+10)).length/rs.length;hm+=`<i style="--a:${(.08+u*2.2).toFixed(2)}" title="${Math.round(u*100)}% in use"></i>`}});
$('#heat').innerHTML=hm;
$('#nSpaces').textContent=R.length;
const tk=['NO MORE WALKING AROUND','FIND THE ROOM THAT FITS','EXPLAINABLE MATCHING','NEXT FREE SLOT, ALWAYS','AGGREGATE COUNTS ONLY · PRIVACY FIRST'].join('  ✦  ')+'  ✦  ';$('#tick').innerHTML=tk.repeat(4);
function seatsTick(){['s','c'].forEach(k=>seats[k]=Math.max(0,Math.min(TOT[k],seats[k]+(Math.random()<.5?-1:1))));$('#seatsChip').textContent=seats.s+seats.c;}
seatsTick();setInterval(()=>{seatsTick();if(!$('#dr').classList.contains('on'))render()},5000);
$('#h1').innerHTML=$('#h1').innerHTML.replace(/(<span[^>]*>.*?<\/span>)|([^\s<]+)/g,(a,sp,w)=>`<span class="w"><b style="animation-delay:${(h1i=(window.h1i||0)+1)*.09}s">${sp||w}</b></span>`);
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('in')),{threshold:.15});document.querySelectorAll('.rv').forEach(e=>io.observe(e));
const gl=$('#glow');addEventListener('pointermove',e=>{gl.style.transform=`translate(${e.clientX}px,${e.clientY}px)`});
document.addEventListener('pointermove',e=>{const c=e.target.closest&&e.target.closest('.card');if(!c)return;const b=c.getBoundingClientRect();c.style.setProperty('--ry',((e.clientX-b.left)/b.width-.5)*5+'deg');c.style.setProperty('--rx',(.5-(e.clientY-b.top)/b.height)*4+'deg')});
sync();
