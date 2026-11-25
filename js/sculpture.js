// An illustrative neural network, not a trained model or project result.
export function startSculpture(canvas, reduced) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width=0, height=0, frame=0, visible=true, x=0, y=0, targetX=0, targetY=0, pulseStart=-Infinity;
  const stage=canvas.closest('.hero-stage'), button=document.querySelector('#send-signal');
  const layers=[4,7,7,4,2];
  const nodes=layers.flatMap((count,layer)=>Array.from({length:count},(_,i)=>({layer,position:[(layer-2)*.8,(i-(count-1)/2)*.35,Math.sin(i*2.4+layer)*.4]})));
  function easeToward(current, target) {
    return current + (target - current) * .08;
  }
  function sendSignal() {
    pulseStart = performance.now();
    schedule();
  }
  function project(node) {
    const [a,b,c]=node.position, angle=x*.7-.28, tilt=y*.5;
    const px=a*Math.cos(angle)+c*Math.sin(angle), z=c*Math.cos(angle)-a*Math.sin(angle);
    const py=b*Math.cos(tilt)-z*Math.sin(tilt), depth=4/(4+z*.3);
    const scale=Math.min(width/4.5,height/3.3);
    return {x:width*.5+px*scale*depth,y:height*.47+py*scale*depth,layer:node.layer};
  }
  function draw(now) {
    frame=0;
    if(!visible) return;
    x=reduced.matches?0:easeToward(x,targetX);y=reduced.matches?0:easeToward(y,targetY);
    ctx.clearRect(0,0,width,height);
    const points=nodes.map(project), phase=(now-pulseStart)/1500;
    const pulsing=!reduced.matches&&phase>=0&&phase<1;
    for(const a of points) for(const b of points) if(b.layer===a.layer+1){
      ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle='rgba(191,204,181,.19)';ctx.lineWidth=.8;ctx.stroke();
      const local=phase*5-a.layer;
      if(pulsing&&local>=0&&local<=1){ctx.beginPath();ctx.arc(a.x+(b.x-a.x)*local,a.y+(b.y-a.y)*local,1.8,0,Math.PI*2);ctx.fillStyle='#b9e9ba';ctx.fill();}
    }
    for(const p of points){const lit=pulsing&&Math.abs(phase*5-p.layer)<.22;ctx.beginPath();ctx.arc(p.x,p.y,lit?6:4,0,Math.PI*2);ctx.fillStyle=lit?'#b9e9ba':'#101110';ctx.fill();ctx.strokeStyle=lit?'#b9e9ba':'#8e9b85';ctx.lineWidth=1.1;ctx.stroke();}
    ctx.font='12px Geist, sans-serif';ctx.fillStyle='#a0a49b';ctx.textAlign='center';
    if(width>450) ['Input','Hidden layers','Output'].forEach((label,i)=>{const p=project({position:[(i-1)*1.6,1.55,0]});ctx.fillText(label,p.x,p.y);});
    if(pulsing||Math.abs(x-targetX)+Math.abs(y-targetY)>.002&&!reduced.matches)schedule();
  }
  function schedule(){if(!frame&&visible)frame=requestAnimationFrame(draw);}
  function resize(){const r=canvas.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);schedule();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(canvas);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)schedule();else {cancelAnimationFrame(frame);frame=0;}});intersection.observe(canvas);
  function move(e){if(reduced.matches||e.pointerType==='touch')return;const r=stage.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*2;targetY=((e.clientY-r.top)/r.height-.5)*2;schedule();}
  function leave(){targetX=0;targetY=0;schedule();}
  function preference(){x=y=targetX=targetY=0;pulseStart=-Infinity;schedule();}
  const pulseTimer=window.setInterval(()=>{if(visible&&!document.hidden&&!reduced.matches)sendSignal();},11000);
  stage.addEventListener('pointermove',move);stage.addEventListener('pointerleave',leave);button?.addEventListener('click',sendSignal);reduced.addEventListener('change',preference);
  resize();
  return ()=>{clearInterval(pulseTimer);resizeObserver.disconnect();intersection.disconnect();cancelAnimationFrame(frame);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);button?.removeEventListener('click',sendSignal);reduced.removeEventListener('change',preference);};
}
