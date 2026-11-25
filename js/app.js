import {getJSON,getNow,safeURL,sendMessage,loadMotionLibraries} from './api.js';
import {startSculpture} from './sculpture.js';
import {startConstellation} from './constellation.js';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const intro=document.querySelector('#intro-sequence');
let introSeen=false;
if(intro&&!reduced.matches){
  try{
    introSeen=sessionStorage.getItem('portfolio-intro-seen')==='true';
    if(!introSeen)sessionStorage.setItem('portfolio-intro-seen','true');
  }catch(error){console.warn('The intro could not be remembered for this browser session.',error);}
}
if(intro&&!reduced.matches&&!introSeen){
  const skip=intro.querySelector('#intro-skip');
  let finished=false;
  const finish=()=>{
    if(finished)return;
    finished=true;
    clearTimeout(introTimer);
    intro.classList.add('is-exiting');
    window.removeEventListener('keydown',onIntroKey);
    window.setTimeout(()=>{intro.hidden=true;},750);
  };
  const onIntroKey=event=>{if(event.key==='Escape')finish();};
  const introTimer=window.setTimeout(finish,2300);
  skip.addEventListener('click',finish);
  window.addEventListener('keydown',onIntroKey);
  intro.hidden=false;
  requestAnimationFrame(()=>intro.classList.add('is-active'));
}

document.querySelectorAll('[data-film-track]').forEach(track=>{
  const video=track.querySelector('.scroll-film');
  if(!video)return;
  let queued=false,pendingTime=null;
  const updateControls=()=>{
    video.controls=false;
    if(reduced.matches)video.pause();
    else schedule();
  };
  const applyPendingTime=()=>{
    if(pendingTime===null||video.seeking||!video.paused)return;
    const time=pendingTime;
    pendingTime=null;
    if(Math.abs(video.currentTime-time)>.04)video.currentTime=time;
  };
  const scrub=()=>{
    queued=false;
    if(reduced.matches||!Number.isFinite(video.duration)||video.duration<=0||!video.paused)return;
    const trackTop=track.getBoundingClientRect().top+scrollY;
    const travel=Math.max(1,track.offsetHeight-innerHeight*.65);
    const start=trackTop-innerHeight*.2;
    const progress=Math.max(0,Math.min(1,(scrollY-start)/travel));
    pendingTime=progress*video.duration;
    applyPendingTime();
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(scrub);}};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  video.addEventListener('loadedmetadata',schedule);
  video.addEventListener('seeked',applyPendingTime);
  video.addEventListener('play',schedule);
  video.addEventListener('pause',schedule);
  reduced.addEventListener('change',updateControls);
  updateControls();
});
const sculpture=document.querySelector('#sculpture');if(sculpture)startSculpture(sculpture,reduced);
const constellation=document.querySelector('#constellation');if(constellation)startConstellation(constellation,reduced);

const revealTargets=[...document.querySelectorAll('.about-portrait, .intro-section > div, .section-heading > h2, .section-heading > p, .work-intro, .work-item, .code-section > div, .syntax-top, .syntax-stage > h2, .journey-entry, .beyond-section h2, .team-photo, .beyond-links > a, .now-section > *, .contact-top, .contact-section h2, .contact-bottom')];
if(revealTargets.length&&!reduced.matches&&'IntersectionObserver' in window){
  document.documentElement.classList.add('has-scroll-reveals');
  const revealObserverTargets=new Map();
  let projectOrder=0;
  revealTargets.forEach(target=>{
    target.classList.add('scroll-reveal');
    if(target.matches('.section-heading > h2, .syntax-stage > h2, .beyond-section h2, .contact-section h2'))target.classList.add('scroll-headline');
    if(target.matches('.work-item'))target.style.setProperty('--reveal-delay',`${projectOrder++*80}ms`);
    const observerTarget=target.classList.contains('scroll-headline')?target.parentElement:target;
    const targets=revealObserverTargets.get(observerTarget)||[];
    targets.push(target);
    revealObserverTargets.set(observerTarget,targets);
  });
  const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){revealObserverTargets.get(entry.target).forEach(target=>target.classList.add('is-revealed'));revealObserver.unobserve(entry.target);}
  }),{threshold:0,rootMargin:'0px 0px -5% 0px'});
  revealObserverTargets.forEach((targets,target)=>revealObserver.observe(target));
}

const workItems=[...document.querySelectorAll('.work-item')];
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const positions=new Map(workItems.map(item=>[item,item.getBoundingClientRect()]));
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===button.dataset.filter)));
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
  if(!reduced.matches&&'IntersectionObserver' in window){
    const focusObserver=new IntersectionObserver(([entry])=>syntaxSection.classList.toggle('is-in-view',entry.isIntersecting),{threshold:.18});
    focusObserver.observe(syntaxSection);
  }
  const stage=syntaxSection.querySelector('.syntax-stage');
  let syntaxFrame=0,nextX=0,nextY=0;
  function paintSyntax(){syntaxFrame=0;stage.style.setProperty('--syntax-x',`${nextX}px`);stage.style.setProperty('--syntax-y',`${nextY}px`);}
  stage.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const bounds=stage.getBoundingClientRect();nextX=(event.clientX-bounds.left-bounds.width/2)*.025;nextY=(event.clientY-bounds.top-bounds.height/2)*.04;if(!syntaxFrame)syntaxFrame=requestAnimationFrame(paintSyntax);});
  stage.addEventListener('pointerleave',()=>{nextX=nextY=0;if(!syntaxFrame)syntaxFrame=requestAnimationFrame(paintSyntax);});
}

document.querySelectorAll('[data-gallery]').forEach(gallery=>{
  const slides=[...gallery.querySelectorAll('.journey-slide')],count=gallery.querySelector('.gallery-count');
  let current=0;
  const show=index=>{
    current=(index+slides.length)%slides.length;
    slides.forEach((slide,i)=>{const active=i===current;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',String(!active));});
    count.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  };
  gallery.querySelector('[data-gallery-prev]').addEventListener('click',()=>show(current-1));
  gallery.querySelector('[data-gallery-next]').addEventListener('click',()=>show(current+1));
});

const surpriseTrigger=document.querySelector('#open-surprise');
const surpriseDialog=document.querySelector('#surprise-dialog');
const surpriseVideo=document.querySelector('#surprise-video');
const surpriseClose=document.querySelector('#close-surprise');
if(surpriseTrigger&&surpriseDialog&&surpriseVideo){
  let returnFocus;
  surpriseTrigger.addEventListener('click',()=>{
    returnFocus=document.activeElement;
    surpriseDialog.showModal();
    const video=document.createElement('iframe');
    video.title='Rick Astley music video';
    video.src='https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&playsinline=1&rel=0';
    video.allow='autoplay; encrypted-media; picture-in-picture';
    video.referrerPolicy='strict-origin-when-cross-origin';
    video.allowFullscreen=true;
    surpriseVideo.replaceChildren(video);
  });
  surpriseClose?.addEventListener('click',()=>surpriseDialog.close());
  surpriseDialog.addEventListener('click',event=>{if(event.target===surpriseDialog)surpriseDialog.close();});
  surpriseDialog.addEventListener('close',()=>{
    surpriseVideo.replaceChildren();
    returnFocus?.focus();
  });
}
