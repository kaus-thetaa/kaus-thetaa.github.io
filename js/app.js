import {getJSON, getNow, safeURL, sendMessage, loadMotionLibraries} from './api.js';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const arrow = '<svg class="external" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M4 4h8v8"/></svg>';
function diagram(project) {
  const labels = project.diagram;
  const shape = project.media === 'race' ? '<path d="M62 100C40 30 208 19 216 87S135 110 153 167 47 232 48 176 86 165 62 100Z" stroke="#657d6c" stroke-width="22" fill="none"/><path d="M62 100C40 30 208 19 216 87S135 110 153 167 47 232 48 176 86 165 62 100Z" stroke="#b4c0b6" stroke-width="1" stroke-dasharray="4 6" fill="none"/><circle cx="60" cy="94" r="5" fill="#dad8ce"/>' : '<circle cx="132" cy="132" r="80" fill="none" stroke="#33483b"/><circle cx="132" cy="132" r="56" fill="none" stroke="#78917e" stroke-dasharray="2 6"/><path d="M132 40v44m0 96v44M40 132h44m96 0h44" stroke="#78917e"/><rect x="100" y="100" width="64" height="64" rx="3" fill="#141e18" stroke="#8ca493"/><path d="M115 132h34m-17-17v34" stroke="#bac8bf"/>';
  return `<svg viewBox="0 0 264 304" role="img" aria-label="${escapeHTML(project.title)} conceptual system diagram"><g>${shape}</g><g fill="#a1b2a6" font-family="Arial,sans-serif" font-size="9" text-anchor="middle"><text x="132" y="264">${escapeHTML(labels[0])} / ${escapeHTML(labels[1])}</text><text x="132" y="282">${escapeHTML(labels[2])} / ${escapeHTML(labels[3])}</text></g></svg>`;
}
const [profile, projectData, github] = await Promise.all([getJSON('data/profile.json',{}), getJSON('data/projects.json',{projects:[]}), getJSON('data/github.json',{repos:[]})]);
const projects = projectData.projects.filter(p => p.confirmed && !JSON.stringify(p).includes('[verify]'));
let selected = projects[0]?.slug;
const screen = document.querySelector('#project-screen');
function selectProject(slug, animate = true) {
  const p = projects.find(p => p.slug === slug); if (!p || !screen) return; selected = slug;
  document.querySelectorAll('[data-project]').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.project===slug)));
  screen.innerHTML = `<div class="project-content"><span class="project-type">${p.category.map(escapeHTML).join(' / ')}</span><h3>${escapeHTML(p.title)}</h3><p class="project-subtitle">${escapeHTML(p.subtitle)}</p><p class="project-description">${escapeHTML(p.built)}</p><p class="project-result">${escapeHTML(p.result)}</p><ul class="stack-tags">${p.stack.map(s=>`<li>${escapeHTML(s)}</li>`).join('')}</ul><a class="button" href="/projects/${encodeURIComponent(p.slug)}/">Explore project ${arrow}</a></div><div class="project-visual">${diagram(p)}</div>`;
  document.querySelector('#project-position').textContent = `${String(projects.indexOf(p)+1).padStart(2,'0')} / ${String(projects.length).padStart(2,'0')}`;
  const repo = github.repos?.find(r=>r.name===p.repo);
  document.querySelector('#repo-update').textContent = repo?.pushed_at ? `Repository updated ${new Date(repo.pushed_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}` : 'Source code available';
  if (animate && !reduced.matches) screen.animate([{opacity:.35},{opacity:1}],{duration:220,easing:'ease-in-out'});
}
if (screen && projects.length) {
  selectProject(selected,false);
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>selectProject(button.dataset.project)));
  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter; const buttons=[...document.querySelectorAll('[data-project]')]; const positions=new Map(buttons.map(b=>[b,b.getBoundingClientRect()]));
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    const visible=projects.filter(p=>filter==='All'||p.category.includes(filter));
    buttons.forEach(b=>{b.hidden=!visible.some(p=>p.slug===b.dataset.project);});
    if(!visible.some(p=>p.slug===selected)) selectProject(visible[0].slug);
    document.querySelector('#project-count').textContent=`${visible.length} project${visible.length===1?'':'s'}`;
    if(!reduced.matches) buttons.filter(b=>!b.hidden).forEach(b=>{const old=positions.get(b), next=b.getBoundingClientRect();if(old.height) b.animate([{transform:`translateY(${old.top-next.top}px)`},{transform:'translateY(0)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});});
  }));
}
const nowMount = document.querySelector('#now-content');
if (nowMount) { const now = await getNow(profile.nowCsvUrl); if(now.items?.length) { nowMount.replaceChildren(); for(const item of now.items.slice(0,3)){ const div=document.createElement('div'); const title=document.createElement(safeURL(item.link)?'a':'strong');title.textContent=item.title;if(title.tagName==='A'){title.href=safeURL(item.link);title.rel='noopener';}const status=document.createElement('p');status.textContent=item.status;div.append(title,status);nowMount.append(div); } } }
const latest = document.querySelector('#latest-commit');
if(latest && github.latestCommit){ latest.href=safeURL(github.latestCommit.url)||profile.github;latest.querySelector('span').textContent=`Latest public commit · ${github.latestCommit.repo}`;latest.querySelector('strong').textContent=github.latestCommit.message; }
const time = document.querySelector('#local-time');if(time) time.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date())+' IST';
let lenis;
function motion(){
  lenis?.destroy();lenis=null;if(reduced.matches)return;
  if(window.Lenis){lenis=new window.Lenis({duration:.85,smoothWheel:true,syncTouch:false,anchors:true,autoRaf:true});}
  if(window.gsap && window.ScrollTrigger && document.querySelector('.hud')){gsap.registerPlugin(ScrollTrigger);ScrollTrigger.getAll().forEach(t=>t.kill());gsap.fromTo('.hud-art',{opacity:.8},{opacity:1,scrollTrigger:{trigger:'.hud',start:'top 85%',end:'bottom 30%',scrub:true}});}
}
function initMotion(){if(!reduced.matches) setTimeout(()=>loadMotionLibraries().then(motion).catch(()=>{}),1800);let played=true;try{played=sessionStorage.getItem('intro-played')==='yes';sessionStorage.setItem('intro-played','yes');}catch{}
  if(!played && !reduced.matches && document.querySelector('.hud')){
    const skip=document.querySelector('.skip-intro');skip.hidden=false;const animations=[document.querySelector('.hud-art').animate([{opacity:.2},{opacity:1}],{duration:1600,easing:'cubic-bezier(.22,1,.36,1)'}),document.querySelector('.hud-reticle').animate([{transform:'scale(.96)',opacity:.1,transformOrigin:'center'},{transform:'scale(1)',opacity:1,transformOrigin:'center'}],{duration:1600,easing:'cubic-bezier(.22,1,.36,1)'})];skip.onclick=()=>{animations.forEach(a=>a.finish());skip.hidden=true;};Promise.all(animations.map(a=>a.finished)).then(()=>skip.hidden=true);
  }
}
if(document.readyState==='complete')initMotion();else window.addEventListener('load',initMotion,{once:true});reduced.addEventListener('change',motion);
const hud=document.querySelector('.hud');if(hud && matchMedia('(hover: hover) and (pointer: fine)').matches){hud.addEventListener('pointermove',e=>{if(reduced.matches)return;const rect=hud.getBoundingClientRect();hud.style.setProperty('--glass-x',`${(e.clientX-rect.left)/rect.width*3-1.5}px`);hud.style.setProperty('--glass-y',`${(e.clientY-rect.top)/rect.height*3-1.5}px`);});}
const formMount=document.querySelector('#contact-form-mount');
if(formMount && profile.contactEndpoint && safeURL(profile.contactEndpoint)){
  formMount.innerHTML='<form class="contact-form"><label for="sender-name">Name</label><input id="sender-name" name="name" autocomplete="name" required maxlength="100"><label for="sender-email">Email</label><input id="sender-email" name="email" type="email" autocomplete="email" required maxlength="254"><label for="sender-message">Message</label><textarea id="sender-message" name="message" required minlength="10" maxlength="4000"></textarea><div class="honeypot" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="muted">Your name, email and message are sent to my private inbox spreadsheet so I can reply.</p><button class="button primary" type="submit">Send message</button><p class="form-status" role="status"></p></form>';
  const form=formMount.querySelector('form');form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button'),status=form.querySelector('.form-status');button.disabled=true;button.textContent='Sending message…';status.textContent='';try{await sendMessage(profile.contactEndpoint,Object.fromEntries(new FormData(form)));status.dataset.error='false';status.textContent='Message sent. Thanks for getting in touch.';form.reset();}catch(error){status.dataset.error='true';status.textContent=error.message;}finally{button.disabled=false;button.textContent='Send message';}});
}
