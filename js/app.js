import {getJSON,getNow,safeURL,sendMessage,loadMotionLibraries} from './api.js';
import {startSculpture} from './sculpture.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const sculpture=document.querySelector('#sculpture');if(sculpture)startSculpture(sculpture,reduced);

const workItems=[...document.querySelectorAll('.work-item')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const positions=new Map(workItems.map(item=>[item,item.getBoundingClientRect()]));
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  document.querySelector('.work-gallery').classList.toggle('is-filtered',button.dataset.filter!=='All');
  let count=0;
  workItems.forEach(item=>{item.hidden=button.dataset.filter!=='All'&&!item.dataset.categories.split(' ').includes(button.dataset.filter);if(!item.hidden)count++;});
  const status=document.querySelector('#project-count');if(status)status.textContent=`${count} project${count===1?'':'s'}`;
  if(!reduced.matches)workItems.filter(i=>!i.hidden).forEach(item=>{const old=positions.get(item),next=item.getBoundingClientRect();if(old.height)item.animate([{transform:`translate(${old.left-next.left}px,${old.top-next.top}px)`,opacity:.6},{transform:'translate(0,0)',opacity:1}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'});});
}));

const journey=document.querySelector('.journey-layout');
if(journey){
  const groups=[...document.querySelectorAll('[data-year]')],yearDisplay=document.querySelector('.active-year'),bar=document.querySelector('.journey-progress>span');
  let geometry=[],top=0,bottom=0,queued=false;
  function measure(){geometry=groups.map(group=>({year:group.dataset.year,top:group.getBoundingClientRect().top+scrollY}));top=journey.getBoundingClientRect().top+scrollY;bottom=top+journey.offsetHeight-innerHeight*.5;update();}
  function update(){queued=false;const position=scrollY+innerHeight*.35;let current=geometry[0]?.year;for(const group of geometry)if(position>=group.top)current=group.year;
    if(current && yearDisplay.textContent!==current){yearDisplay.textContent=current;if(!reduced.matches)yearDisplay.animate([{opacity:.2,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});}
    document.querySelectorAll('.year-link').forEach(link=>{const active=link.getAttribute('href')==='#year-'+current;link.classList.toggle('is-active',active);if(active)link.setAttribute('aria-current','true');else link.removeAttribute('aria-current');});
    bar.style.transform=`scaleX(${Math.max(0,Math.min(1,(position-top)/Math.max(1,bottom-top)))})`;
  }
  window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update);}},{passive:true});
  new ResizeObserver(measure).observe(document.body);document.fonts.ready.then(measure);measure();
  const entries=new IntersectionObserver(items=>items.forEach(item=>item.target.classList.toggle('is-current',item.isIntersecting)),{rootMargin:'-15% 0px -30% 0px'});document.querySelectorAll('.journey-entry').forEach(entry=>entries.observe(entry));
}

const time=document.querySelector('#local-time');if(time)time.textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'2-digit',minute:'2-digit'}).format(new Date())+' IST';
let lenis;
function motion(){lenis?.destroy();lenis=null;if(reduced.matches)return;if(window.Lenis)lenis=new Lenis({duration:.8,smoothWheel:true,syncTouch:false,anchors:true,autoRaf:true});}
function initMotion(){if(!reduced.matches)setTimeout(()=>loadMotionLibraries().then(motion).catch(()=>{}),1800);}
if(document.readyState==='complete')initMotion();else window.addEventListener('load',initMotion,{once:true});reduced.addEventListener('change',motion);

const [profile,github]=await Promise.all([getJSON('data/profile.json',{}),getJSON('data/github.json',{repos:[]})]);
const nowMount=document.querySelector('#now-content');
if(nowMount){const now=await getNow(profile.nowCsvUrl);if(now.items?.length){nowMount.replaceChildren();const item=now.items[0],title=document.createElement('strong'),status=document.createElement('p');title.textContent=item.title;status.textContent=item.status;nowMount.append(title,status);}}
const latest=document.querySelector('#latest-commit');if(latest&&github.latestCommit){latest.href=safeURL(github.latestCommit.url)||profile.github;latest.querySelector('span').textContent=`Latest public commit · ${github.latestCommit.repo}`;latest.querySelector('strong').textContent=github.latestCommit.message;}
const formMount=document.querySelector('#contact-form-mount');
if(formMount && profile.contactEndpoint && safeURL(profile.contactEndpoint)){
  formMount.innerHTML='<form class="contact-form"><label for="sender-name">Name</label><input id="sender-name" name="name" autocomplete="name" required maxlength="100"><label for="sender-email">Email</label><input id="sender-email" name="email" type="email" autocomplete="email" required maxlength="254"><label for="sender-message">Message</label><textarea id="sender-message" name="message" required minlength="10" maxlength="4000"></textarea><div class="honeypot" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div><p class="small">Your name, email and message are sent to my private inbox spreadsheet so I can reply.</p><button type="submit">Send message</button><p class="form-status" role="status"></p></form>';
  const form=formMount.querySelector('form');form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button'),status=form.querySelector('.form-status');button.disabled=true;button.textContent='Sending message…';status.textContent='';try{await sendMessage(profile.contactEndpoint,Object.fromEntries(new FormData(form)));status.dataset.error='false';status.textContent='Message sent. Thanks for getting in touch.';form.reset();}catch(error){status.dataset.error='true';status.textContent=error.message;}finally{button.disabled=false;button.textContent='Send message';}});
}

const syntaxSection=document.querySelector('.syntax-section');
if(syntaxSection){
  const stage=syntaxSection.querySelector('.syntax-stage'),toggle=syntaxSection.querySelector('#syntax-toggle');
  let syntaxFrame=0,nextX=0,nextY=0;
  toggle.addEventListener('click',()=>{const active=toggle.getAttribute('aria-pressed')!=='true';toggle.setAttribute('aria-pressed',String(active));syntaxSection.classList.toggle('is-exploring',active);toggle.firstChild.textContent=active?'Back to the thought ':'Explore the code ';});
  function paintSyntax(){syntaxFrame=0;stage.style.setProperty('--syntax-x',`${nextX}px`);stage.style.setProperty('--syntax-y',`${nextY}px`);}
  stage.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const bounds=stage.getBoundingClientRect();nextX=(event.clientX-bounds.left-bounds.width/2)*.025;nextY=(event.clientY-bounds.top-bounds.height/2)*.04;if(!syntaxFrame)syntaxFrame=requestAnimationFrame(paintSyntax);});
  stage.addEventListener('pointerleave',()=>{nextX=nextY=0;if(!syntaxFrame)syntaxFrame=requestAnimationFrame(paintSyntax);});
}
