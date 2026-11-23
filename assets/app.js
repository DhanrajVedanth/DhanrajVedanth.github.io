import { technicalDiagram } from './technical.js';
import { PROFILE, CASES, CATEGORIES, ARCHIVE, TIMELINE } from './data.js';
import { DIAGRAMS } from './diagrams.js';

const root=document.querySelector('#app');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const attr=esc;
const linkFor=id=>`#/work/${id}`;
let route=''; let mobileOpen=false; let filter='All systems'; let query='';
let view={diagramIndex:0,nodeId:null,step:0,zoom:1,panX:0,panY:0};
let autoplay=null;
const stopAutoplay=()=>{if(autoplay){clearInterval(autoplay);autoplay=null}};
const getCase=id=>CASES.find(c=>c.id===id);
const btn=(href,label,secondary=false)=>`<a class="btn ${secondary?'btn-secondary':'btn-primary'}" href="${attr(href)}">${label}</a>`;

function nav(active){return `<a class="skip" href="#/" data-skip-main>Skip to main content</a>
<header class="nav-wrap"><div class="shell nav">
 <a class="mark" href="#/" aria-label="Dhanraj home"><span>Dhanraj Raghunathan</span></a>
 <button class="nav-mobile-toggle" aria-label="Toggle navigation" aria-expanded="${mobileOpen}" type="button">☰</button>
 <nav class="nav-right ${mobileOpen?'open':''}" aria-label="Primary navigation">
  <a class="nav-link ${active==='home'?'active':''}" href="#/">Home</a>
  <a class="nav-link ${active==='work'?'active':''}" href="#/work">Case studies</a>
  <a class="nav-link ${active==='approach'?'active':''}" href="#/approach">Approach</a>
  <a class="nav-link ${active==='archive'?'active':''}" href="#/archive">Archive</a>
  <a class="nav-resume" href="./resume.pdf" download>Résumé</a>
 </nav>
</div></header>`}
function foot(){return `<footer class="foot"><div class="shell foot-inner"><p>Dhanraj Vedanth Raghunathan</p><nav class="foot-links" aria-label="Footer"><a href="${attr(PROFILE.github)}">GitHub</a><a href="${attr(PROFILE.linkedin)}">LinkedIn</a></nav></div></footer>`}
function layout(active,body){return nav(active)+`<main id="main-content" tabindex="-1">${body}</main>`+foot()}
const tagRow=tags=>`<div class="tag-row">${tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div>`;
function caseCard(c){return `<a class="case-card" href="${linkFor(c.id)}">
  <div><h3>${esc(c.name)}</h3><p>${esc(c.subtitle)}</p></div>
  <span class="case-category">${esc(c.category)}</span><span class="case-arrow" aria-hidden="true">↗</span>
</a>`}
function pageHome(){
 const featured=['agent-platform','billing','troubleshooting','release-testing'].map(getCase);
 return layout('home',`<section class="home-intro shell">
   <p class="profile-role">Principal Engineer · San Francisco Bay Area</p>
   <h1>Dhanraj Vedanth<br>Raghunathan</h1>
   <p class="home-summary">I build distributed cloud services and the AI agents that work with them. My work has ranged from cloud billing and network upgrades to tools that help support engineers investigate incidents.</p>
   <div class="home-links"><a href="./resume.pdf">Résumé (PDF)</a><a href="${attr(PROFILE.github)}">GitHub</a><a href="${attr(PROFILE.linkedin)}">LinkedIn</a></div>
 </section>
 <section class="shell home-work" aria-labelledby="selected-work"><div class="work-heading"><h2 id="selected-work">Selected work</h2><a href="#/work">All case studies →</a></div>
 <div class="case-list">${featured.map(caseCard).join('')}</div></section>`)
}
function approachCards(){return [
 ['01 / PROVENANCE','Evidence over confidence','A useful agent report distinguishes what was observed from what is inferred. Logs, tool results and data contracts matter more than fluent explanations.'],
 ['02 / DETERMINISM','Keep critical logic in code','Money, permissions, access scope, retry semantics and release verdicts belong in explicit software contracts—not statistical guesses.'],
 ['03 / RESILIENCE','Design for partial failure','Deadlines, queues, regional isolation and recovery are not edge cases. They are the normal environment of distributed systems.']
 ].map(([,t,d])=>`<article class="approach-card"><h3>${esc(t)}</h3><p>${esc(d)}</p></article>`).join('')}
function pageExplore(){const items=CASES.filter(c=>(filter==='All systems'||c.category===filter)&&(`${c.name} ${c.subtitle} ${c.category}`.toLowerCase().includes(query.toLowerCase())));
return layout('work',`<section class="page-hero"><div class="shell"><h1>Case studies</h1><p>Engineering decisions and illustrative designs from cloud platforms and AI agent work.</p></div></section>
<section class="section" style="padding-top:34px"><div class="shell"><div class="explore-controls"><input id="case-search" class="search" type="search" autocomplete="off" value="${attr(query)}" placeholder="Search systems / technologies…" aria-label="Search case studies"/><div class="filters">${CATEGORIES.map(c=>`<button class="filter ${filter===c?'active':''}" type="button" data-filter="${attr(c)}" aria-pressed="${filter===c}">${esc(c)}</button>`).join('')}</div></div>
<p class="results-count">${items.length} case stud${items.length===1?'y':'ies'}</p><div class="case-grid" id="results-grid">${items.map(c=>caseCard(c)).join('')||'<div class="empty">No matching systems. Try a different term.</div>'}</div></div></section>`)}
function pageApproach(){return layout('approach',`<section class="page-hero"><div class="shell"><h1>Engineering approach</h1></div></section>
<section class="section"><div class="shell"><div class="section-header"><div><h2>How I design systems</h2></div></div><div class="approach-grid">${approachCards()}</div></div></section>
<section class="section section-dark"><div class="shell"><div class="section-header"><div><h2>Experience</h2></div><p>Cloud resource lifecycle and billing provided the domain depth to design AI systems that interact safely with real infrastructure.</p></div><div class="timeline">${TIMELINE.map(t=>`<article class="timeline-item"><span class="mono">${esc(t.year)}</span><div><h3>${esc(t.title)}</h3><strong>${esc(t.company)}</strong><p>${esc(t.desc)}</p></div></article>`).join('')}</div><div class="about-callout"><div><h3>Deepen the technical context</h3><p>The case studies explain the architecture, system boundaries and reasoning behind these career milestones.</p></div>${btn('#/work','Browse systems ↗')}</div></div></section>`)}
function pageArchive(){return layout('archive',`<section class="page-hero"><div class="shell"><h1>Earlier projects</h1><p>Earlier academic and independent projects—operating systems, virtualization, networking, and automation. These are distinct from the professional architecture studies.</p></div></section><section class="section"><div class="shell"><p class="warning">Some links currently point to the public legacy GitHub account while repository migration is being completed. They remain readable.</p><div class="archive-grid">${ARCHIVE.map(a=>`<a class="archive-card" target="_blank" rel="noopener noreferrer" href="${attr(a.link)}"><span class="micro">${esc(a.type)}</span><h3>${esc(a.name)}</h3><p>${esc(a.description)}</p><span class="link-arrow">VIEW SOURCE ↗</span></a>`).join('')}</div></div></section>`)}
function page404(){return layout('',`<section class="page-hero"><div class="shell"><h1>Page not found</h1>${btn('#/work','Back to case studies ↗')}</div></section>`)}
function caseHero(c){return `<section class="page-hero case-hero"><div class="shell"><div class="breadcrumb"><a href="#/work">← Case studies</a></div><h1>${esc(c.name)}</h1><p class="case-summary">${esc(c.subtitle)}</p><a class="link-arrow" href="${linkFor(c.id)}" data-scroll-diagram>Jump to diagram ↓</a></div></section>`}
function pageCase(c){
 const next=CASES[(CASES.indexOf(c)+1)%CASES.length];
 return layout('work',caseHero(c)+`<div class="shell detail-wrap">
 <div class="detail-two"><article class="detail-card"><h2>The problem</h2><p>${esc(c.problem)}</p></article><article class="detail-card"><h2>My role</h2><p>${esc(c.role)}</p><p>${esc(c.outcome)}</p></article></div>
 <section class="section-section" id="architecture-section"><h2>Illustrative architecture</h2><p class="intro">Select a component to see what it does, or step through the workflow.</p><div id="diagram-root" class="diagram-wrap"></div></section>
 <section class="section-section"><h2>Design decisions</h2><div class="decision-grid">${c.decisions.map(d=>`<article class="decision"><h3>${esc(d.title)}</h3><p>${esc(d.body)}</p></article>`).join('')}</div></section>
 
 <div class="case-next"><a href="${linkFor(next.id)}">Next case study · ${esc(next.name)} →</a></div></div>`)
}
function routeNow(){const hash=decodeURIComponent(location.hash.replace(/^#/,''));if(!hash||hash==='/')return {page:'home'};if(hash==='/work')return {page:'work'};if(hash==='/approach')return {page:'approach'};if(hash==='/archive')return {page:'archive'};const m=hash.match(/^\/work\/([a-z0-9-]+)$/);if(m){const c=getCase(m[1]);return c?{page:'case',c}:{page:'404'}}return {page:'404'}}
function render(){stopAutoplay();mobileOpen=false;const current=routeNow();const nextRoute=location.hash||'#/';if(route!==nextRoute){view={diagramIndex:0,nodeId:null,step:0,zoom:1,panX:0,panY:0};route=nextRoute;window.scrollTo({top:0,behavior:'instant'})}
 document.title=`${current.page==='case'?current.c.name+' · ':current.page==='home'?'':current.page.charAt(0).toUpperCase()+current.page.slice(1)+' · '}Dhanraj Raghunathan — Engineering Systems`;
 root.innerHTML= current.page==='home'?pageHome():current.page==='work'?pageExplore():current.page==='approach'?pageApproach():current.page==='archive'?pageArchive():current.page==='case'?pageCase(current.c):page404();
 root.querySelector('[data-skip-main]')?.addEventListener('click',ev=>{ev.preventDefault();root.querySelector('#main-content')?.focus()});
 root.querySelector('.nav-mobile-toggle')?.addEventListener('click',()=>{mobileOpen=!mobileOpen;const nav=root.querySelector('.nav-right');nav.classList.toggle('open',mobileOpen);root.querySelector('.nav-mobile-toggle').setAttribute('aria-expanded',String(mobileOpen))});
 if(current.page==='work')wireExplore();if(current.page==='case'){renderDiagram(current.c);root.querySelector('[data-scroll-diagram]')?.addEventListener('click',event=>{event.preventDefault();document.getElementById('architecture-section')?.scrollIntoView({behavior:'smooth'})})}}
function wireExplore(){const search=root.querySelector('#case-search');search?.addEventListener('input',e=>{query=e.target.value;updateExplore()});root.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;updateExplore()}))}
function updateExplore(){const items=CASES.filter(c=>(filter==='All systems'||c.category===filter)&&(`${c.name} ${c.subtitle} ${c.category}`.toLowerCase().includes(query.toLowerCase())));const results=root.querySelector('#results-grid');if(results) results.innerHTML=items.map(c=>caseCard(c)).join('')||'<div class="empty">No matching systems. Try a different term.</div>';const count=root.querySelector('.results-count');if(count)count.textContent=`${items.length} case stud${items.length===1?'y':'ies'}`;root.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}

const palettes={user:['#25374b','#6f9ac4'],app:['#193345','#73b9d2'],agent:['#263b39','#93d0b1'],service:['#1d3047','#6d9fc9'],platform:['#1e3b3c','#90ccb6'],control:['#333925','#d3f56c'],data:['#2b2f4b','#b3a4f4'],infra:['#352e32','#e7b88f'],artifact:['#31374c','#a8b5d6']};
const glyphs={user:'H',app:'A',agent:'AI',service:'S',platform:'P',control:'✓',data:'D',infra:'C',artifact:'◆'};
const dimX=1280,dimY=640;
function wNode(n){return n.x>990?176:205}
function anchor(n,axis){const w=wNode(n),h=80;return axis==='center'?{x:n.x+w/2,y:n.y+h/2}:{x:n.x,y:n.y,w,h}}
function pathEdge(a,b){const A=anchor(a,'center'),B=anchor(b,'center'),aw=wNode(a),bw=wNode(b);const dx=B.x-A.x,dy=B.y-A.y;
 if(Math.abs(dx)>Math.abs(dy)*.7){const right=dx>0, sx=A.x+(right?aw/2:-aw/2),sy=A.y, ex=B.x-(right?bw/2:-bw/2),ey=B.y;const k=Math.max(55,Math.abs(ex-sx)*.47);return `M ${sx} ${sy} C ${sx+(right?k:-k)} ${sy},${ex-(right?k:-k)} ${ey},${ex} ${ey}`}
 const down=dy>0, sx=A.x,sy=A.y+(down?40:-40),ex=B.x,ey=B.y-(down?40:-40),k=Math.max(40,Math.abs(ey-sy)*.4);return `M ${sx} ${sy} C ${sx} ${sy+(down?k:-k)},${ex} ${ey-(down?k:-k)},${ex} ${ey}`}
function labelLines(s){if(s.length<=22)return [s];const words=s.split(' '),lines=[''];for(const word of words){let i=lines.length-1;if((lines[i]+' '+word).trim().length>22&&lines.length<2)lines.push(word);else lines[i]=(lines[i]+' '+word).trim()}return lines.slice(0,2)}
function svgFor(diag){const focus=diag.steps[view.step]?.focus;
 const graph= `<defs><pattern id="dots" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="#547489" opacity=".23"/></pattern><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7" fill="none" stroke="#7293a1" stroke-width="1.3"/></marker></defs><rect width="1280" height="640" fill="url(#dots)"/>`;
 const edges=diag.edges.map(edge=>{const a=diag.nodes.find(n=>n.id===edge.from),b=diag.nodes.find(n=>n.id===edge.to);if(!a||!b)return '';const active=edge.from===focus||edge.to===focus;const label = edge.label ? `<text class="edge-label" x="${a.y === b.y ? (a.x + wNode(a) + b.x) / 2 : a.x + wNode(a) / 2 + 12}" y="${a.y === b.y ? a.y - 14 : (a.y + b.y + 80) / 2}" text-anchor="${a.y === b.y ? 'middle' : 'start'}">${esc(edge.label)}</text>` : '';
 return `<path class="edge ${active?'active':''}" d="${pathEdge(a,b)}" marker-end="url(#arrow)">${edge.label ? `<title>${esc(edge.label)}</title>` : ''}</path>${label}`}).join('');
 const nodes=diag.nodes.map(n=>{const [bg,stroke]=palettes[n.kind]||palettes.service;const width=wNode(n);const lines=labelLines(n.label);const title=lines.map((line,i)=>`<tspan x="${n.x+16}" dy="${i?17:0}">${esc(line)}</tspan>`).join('');const yTitle=n.y+(lines.length===1?38:29);const subY=n.y+(lines.length===1?60:68);
 return `<g class="node ${view.nodeId===n.id?'selected':''} ${focus===n.id?'focus':''}" role="button" tabindex="0" aria-label="Inspect ${attr(n.label)}" data-node="${attr(n.id)}"><title>${esc(n.detail)}</title><rect x="${n.x}" y="${n.y}" rx="12" width="${width}" height="80" fill="${bg}" stroke="${stroke}"/><rect x="${n.x+10}" y="${n.y+11}" width="26" height="17" rx="4" fill="#0b1724" opacity=".6"/><text class="node-glyph" x="${n.x+23}" y="${n.y+23}" text-anchor="middle">${esc(glyphs[n.kind]||'◆')}</text><text class="title" x="${n.x+16}" y="${yTitle}">${title}</text><text class="sub" x="${n.x+16}" y="${subY}">${esc(n.sub||n.kind)}</text></g>`}).join('');
 const transform=`translate(${view.panX} ${view.panY}) scale(${view.zoom})`;
 return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${attr(diag.title)} interactive diagram" viewBox="0 0 ${dimX} ${dimY}" preserveAspectRatio="xMidYMid meet"><g class="pan-layer" transform="${transform}">${graph}${edges}${nodes}</g></svg>`}
function renderDiagram(c){const container=root.querySelector('#diagram-root');if(!container)return;const diagrams=[technicalDiagram(c.id), ...DIAGRAMS[c.id]];const d=diagrams[view.diagramIndex]||diagrams[0];const node=d.nodes.find(n=>n.id===view.nodeId)||d.nodes[0];const current=d.steps[view.step]||d.steps[0];
 const technicalDetails = d.tradeoff ? `<section class="technical-details">
 <h4>What crosses each boundary</h4>
 <ol>${d.edges.map(edge => {
   const from = d.nodes.find(node => node.id === edge.from);
   const to = d.nodes.find(node => node.id === edge.to);
   return `<li><strong>${esc(from.label)} → ${esc(to.label)}</strong> · ${esc(edge.label)}</li>`;
 }).join('')}</ol>
 <h4>Tradeoff</h4><p>${esc(d.tradeoff)}</p>
 </section>` : '';
 container.innerHTML=`<div class="diagram-nav"><div class="diagram-tabs">${diagrams.map((g,i)=>`<button class="tab ${i===view.diagramIndex?'active':''}" type="button" data-diagram="${i}" aria-pressed="${i===view.diagramIndex}">${esc(g.title.replace(' / HLD','').replace(' / deployment',''))}</button>`).join('')}</div><div class="diagram-controls"><button class="icon-btn" type="button" data-zoom="out" title="Zoom out" aria-label="Zoom out">−</button><button class="icon-btn" type="button" data-zoom="in" title="Zoom in" aria-label="Zoom in">+</button><button class="icon-btn" type="button" data-zoom="reset" title="Reset view" aria-label="Reset view">↺</button></div></div><div class="diagram-info"><div><h3>${esc(d.title)}</h3><p>${esc(d.description)}</p></div>${d.proposed?'<span class="learning-label">PROPOSED / NOT SHIPPED</span>':''}</div><div class="diagram-board" id="diagram-board">${svgFor(d)}</div><div class="diagram-footer"><div class="node-inspector" aria-live="polite"><span class="micro">SELECTED COMPONENT / ${esc(node.kind.toUpperCase())}</span><h4>${esc(node.label)}</h4><p>${esc(node.detail)}</p></div><div class="walk-panel" aria-live="polite"><div class="walk-header"><span class="micro">GUIDED TRACE / ${view.step+1} OF ${d.steps.length}</span><strong>${esc(current.name)}</strong></div><p>${esc(current.text)}</p><div class="walk-actions"><button type="button" data-step="prev" aria-label="Previous step">← PREV</button><button type="button" data-step="next" aria-label="Next step">NEXT →</button><button type="button" data-step="play">${autoplay?'PAUSE ■':'PLAY ▷'}</button></div></div></div><div class="diagram-hint"><span>INTERACT:</span> click components to inspect · drag canvas to pan · scroll to zoom · switch architecture views · guided trace is illustrative</div>${technicalDetails}`;
 container.querySelectorAll('[data-diagram]').forEach(b=>b.addEventListener('click',()=>{stopAutoplay();view={diagramIndex:Number(b.dataset.diagram),nodeId:null,step:0,zoom:1,panX:0,panY:0};renderDiagram(c)}));
 container.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{const what=b.dataset.zoom;if(what==='reset'){view.zoom=1;view.panX=0;view.panY=0}else zoom(what==='in'?1.18:.85);renderDiagram(c)}));
 container.querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{const dir=b.dataset.step;if(dir==='play'){if(autoplay){stopAutoplay();renderDiagram(c);return}autoplay=setInterval(()=>{view.step=(view.step+1)%d.steps.length;view.nodeId=d.steps[view.step].focus;renderDiagram(c)},2100);renderDiagram(c);return}stopAutoplay();view.step=(view.step+(dir==='next'?1:-1)+d.steps.length)%d.steps.length;view.nodeId=d.steps[view.step].focus;renderDiagram(c)}));
 container.querySelectorAll('[data-node]').forEach(el=>{const activate=()=>{view.nodeId=el.dataset.node;renderDiagram(c)};el.addEventListener('click',activate);el.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();activate()}})});
 const board=container.querySelector('#diagram-board');board.addEventListener('wheel',ev=>{ev.preventDefault();zoom(ev.deltaY<0?1.09:.91);renderDiagram(c)},{passive:false});let drag=null;board.addEventListener('pointerdown',ev=>{if(ev.target.closest('.node'))return;drag={x:ev.clientX,y:ev.clientY,px:view.panX,py:view.panY};board.classList.add('dragging');board.setPointerCapture(ev.pointerId)});board.addEventListener('pointermove',ev=>{if(!drag)return;view.panX=drag.px+(ev.clientX-drag.x)*dimX/board.clientWidth;view.panY=drag.py+(ev.clientY-drag.y)*dimY/board.clientHeight;const l=board.querySelector('.pan-layer');if(l)l.setAttribute('transform',`translate(${view.panX} ${view.panY}) scale(${view.zoom})`)});const done=()=>{drag=null;board.classList.remove('dragging')};board.addEventListener('pointerup',done);board.addEventListener('pointercancel',done);
}
function zoom(factor){let z=Math.min(2.2,Math.max(.8,view.zoom*factor));if(view.zoom===1){view.panX=640*(1-z);view.panY=320*(1-z)}else{const change=z/view.zoom;view.panX=640+(view.panX-640)*change;view.panY=320+(view.panY-320)*change}view.zoom=z}
window.addEventListener('hashchange',render);render();
