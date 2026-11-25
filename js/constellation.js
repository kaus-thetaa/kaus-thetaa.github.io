export function startConstellation(canvas,reduced){
  const context=canvas.getContext('2d');
  if(!context)return;
  const stage=canvas.closest('.constellation-stage');
  const nodes=[...stage.querySelectorAll('.constellation-node')];
  const pulseButton=stage.querySelector('#network-pulse');
  let width=0,height=0,frame=0,visible=false,pointer=null,pulseStart=-Infinity;
  let positions=[],edges=[],pulsePath=[];

  function measure(){
    const bounds=stage.getBoundingClientRect();
    width=bounds.width;
    height=bounds.height;
    nodes.forEach(node=>{node.style.setProperty('--node-dx','0px');node.style.setProperty('--node-dy','0px');});
    positions=nodes.map(node=>{
      const rect=node.getBoundingClientRect();
      return{x:rect.left-bounds.left+rect.width/2,y:rect.top-bounds.top+rect.height/2,dx:0,dy:0};
    });
    const pairs=new Set();
    positions.forEach((point,index)=>{
      const nearest=positions.map((candidate,candidateIndex)=>({candidateIndex,distance:Math.hypot(candidate.x-point.x,candidate.y-point.y)}))
        .filter(item=>item.candidateIndex!==index)
        .sort((a,b)=>a.distance-b.distance)
        .slice(0,2);
      nearest.forEach(item=>pairs.add([Math.min(index,item.candidateIndex),Math.max(index,item.candidateIndex)].join(':')));
      if(positions.length>1){
        const next=(index+1)%positions.length;
        pairs.add([Math.min(index,next),Math.max(index,next)].join(':'));
      }
    });
    edges=[...pairs].map(pair=>pair.split(':').map(Number));
    pulsePath=nodes.map((_,index)=>index);
    if(pulsePath.length>1)pulsePath.push(0);
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    schedule();
  }

  function signal(){
    if(reduced.matches)return;
    pulseStart=performance.now();
    schedule();
  }

  function draw(now){
    frame=0;
    if(!visible)return;
    context.clearRect(0,0,width,height);
    let moving=false;
    const points=positions.map((point,index)=>{
      let targetX=0,targetY=0;
      if(pointer&&!reduced.matches){
        const dx=point.x-pointer.x,dy=point.y-pointer.y,distance=Math.hypot(dx,dy)||1;
        const force=Math.max(0,1-distance/300)*18;
        targetX=dx/distance*force;
        targetY=dy/distance*force;
      }
      point.dx+=(targetX-point.dx)*.1;
      point.dy+=(targetY-point.dy)*.1;
      if(Math.abs(targetX-point.dx)+Math.abs(targetY-point.dy)>.25)moving=true;
      const x=point.x+point.dx,y=point.y+point.dy;
      nodes[index].style.setProperty('--node-dx',`${point.dx.toFixed(2)}px`);
      nodes[index].style.setProperty('--node-dy',`${point.dy.toFixed(2)}px`);
      return{x,y};
    });
    const phase=reduced.matches?1:(now-pulseStart)/1900;
    const pulsing=pulsePath.length>1&&phase>=0&&phase<1;
    context.lineWidth=.8;
    edges.forEach(([from,to])=>{
      const a=points[from],b=points[to];
      context.beginPath();
      context.moveTo(a.x,a.y);
      context.quadraticCurveTo((a.x+b.x)/2,(a.y+b.y)/2-12,b.x,b.y);
      context.strokeStyle='rgba(185,201,171,.24)';
      context.stroke();
    });
    if(pulsing){
      const step=phase*(pulsePath.length-1);
      const edge=Math.min(pulsePath.length-2,Math.floor(step));
      const amount=step-edge;
      const a=points[pulsePath[edge]],b=points[pulsePath[edge+1]];
      const x=a.x+(b.x-a.x)*amount,y=a.y+(b.y-a.y)*amount;
      context.beginPath();
      context.arc(x,y,3,0,Math.PI*2);
      context.fillStyle='#b9e9ba';
      context.shadowColor='#b9e9ba';
      context.shadowBlur=14;
      context.fill();
      context.shadowBlur=0;
    }
    points.forEach((point,index)=>{
      context.beginPath();
      context.arc(point.x,point.y,2.4,0,Math.PI*2);
      context.fillStyle=pulsing&&pulsePath.includes(index)?'#d8e6cc':'#99aa8e';
      context.fill();
    });
    if(moving||pulsing)schedule();
  }

  function schedule(){if(!frame&&visible)frame=requestAnimationFrame(draw);}
  function move(event){
    if(reduced.matches||event.pointerType==='touch')return;
    const bounds=stage.getBoundingClientRect();
    pointer={x:event.clientX-bounds.left,y:event.clientY-bounds.top};
    schedule();
  }
  function leave(){pointer=null;schedule();}
  function visibility(){visible=!document.hidden&&stage.getBoundingClientRect().bottom>0&&stage.getBoundingClientRect().top<innerHeight;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}}
  function preference(){if(reduced.matches){pointer=null;pulseStart=-Infinity;}schedule();}

  const resizeObserver=new ResizeObserver(measure);
  const intersection=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&!document.hidden;if(visible)schedule();else{cancelAnimationFrame(frame);frame=0;}});
  resizeObserver.observe(stage);
  intersection.observe(stage);
  stage.addEventListener('pointermove',move);
  stage.addEventListener('pointerleave',leave);
  pulseButton?.addEventListener('click',signal);
  document.addEventListener('visibilitychange',visibility);
  reduced.addEventListener('change',preference);
  const pulseTimer=window.setInterval(()=>{if(visible&&!document.hidden&&!reduced.matches)signal();},11000);
  measure();
  return()=>{
    clearInterval(pulseTimer);
    resizeObserver.disconnect();
    intersection.disconnect();
    cancelAnimationFrame(frame);
    stage.removeEventListener('pointermove',move);
    stage.removeEventListener('pointerleave',leave);
    pulseButton?.removeEventListener('click',signal);
    document.removeEventListener('visibilitychange',visibility);
    reduced.removeEventListener('change',preference);
  };
}
