/**
 * React implementation of the approved RoboNav 360° scroll storyboard.
 * Scroll progress drives all motion, so scrolling backwards reverses the spin.
 * Buttons navigate into the EXISTING React simulator/experiment pages.
 */
export default function setupStory(host, navigate) {
  const root = host.querySelector('#rn-story-wrap');
  if (!root) return () => {};
  const stage = root.querySelector('#stage');
  const robot = root.querySelector('#robotAnchor');
  const rotor = root.querySelector('#robotRotor');
  const orbit = root.querySelector('#orbit');
  const twirl = root.querySelector('#twirlLabel');
  const hint = root.querySelector('#scrollHint');
  const bar = root.querySelector('#progress');
  const counter = root.querySelector('#counter');
  const scenes = [...root.querySelectorAll('.scene')];
  const grid = root.querySelector('#gridbox');

  // Render the illustrative grid only. Search results come from Python.
  if (grid && !grid.children.length) {
    for (let i = 0; i < 72; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      if ([17, 18, 30, 42, 43, 55, 56].includes(i)) cell.classList.add('wall');
      if ([26, 27, 28, 40, 52, 53, 54, 66, 67, 68].includes(i)) cell.classList.add('route');
      if (i === 24) cell.classList.add('start');
      if (i === 69) cell.classList.add('goal');
      grid.appendChild(cell);
    }
  }

  // Full unwrapped 360-degree yaw from 23° to 383°.
  const points = [
    { p: 0, x: .76, y: .52, yaw: -12, roll: -8, size: 1.02 },
    { p: .16, x: .64, y: .53, yaw: -9, roll: -5, size: .98 },
    { p: .29, x: .26, y: .56, yaw: 9, roll: 5, size: .95 },
    { p: .40, x: .27, y: .56, yaw: 15, roll: 5, size: .95 },
    { p: .50, x: .50, y: .50, yaw: 23, roll: 0, size: 1.15 },
    { p: .68, x: .50, y: .50, yaw: 383, roll: 0, size: 1.15 },
    { p: .78, x: .70, y: .48, yaw: 389, roll: -8, size: 1.05 },
    { p: 1, x: .79, y: .58, yaw: 369, roll: 5, size: .94 }
  ];
  const clamp = x => Math.max(0, Math.min(1, x));
  const smooth = x => x*x*(3-2*x);
  function pose(p) {
    const index = Math.max(0, points.findIndex((v,i) => i>0 && p <= v.p)-1);
    const a=points[index], b=points[Math.min(index+1,points.length-1)];
    const t=smooth(clamp((p-a.p)/Math.max(.0001,b.p-a.p)));
    return {
      x: a.x+(b.x-a.x)*t, y: a.y+(b.y-a.y)*t,
      yaw: a.yaw+(b.yaw-a.yaw)*t, roll: a.roll+(b.roll-a.roll)*t,
      size: a.size+(b.size-a.size)*t
    };
  }

  let frame=0;
  let pending=false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function render() {
    pending=false;
    const rect = root.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // A sticky stage can scroll out of view on mobile Chrome when nested in
    // a Shadow DOM. Pin it to the viewport while the story is active.
    // At the end, put the stage at the bottom of the story so the NEXT
    // React sections appear normally instead of a large blank screen.
    if (rect.bottom <= viewportHeight + 1) {
      stage.style.position = 'absolute';
      stage.style.top = 'auto';
      stage.style.bottom = '0';
    } else if (rect.top > 0) {
      stage.style.position = 'absolute';
      stage.style.top = '0';
      stage.style.bottom = 'auto';
    } else {
      stage.style.position = 'fixed';
      stage.style.top = '0';
      stage.style.bottom = 'auto';
    }
    root.classList.add('story-ready');
    // The cinematic homepage starts at viewport top (no old React navbar).
    const range = Math.max(1, root.offsetHeight - window.innerHeight);
    const p = clamp(-rect.top / range);
    const motion=pose(reduced?0:p);
    robot.style.left=(motion.x*100)+'%';
    robot.style.top=(motion.y*100)+'%';
    robot.style.transform='translate(-50%,-50%) scale('+motion.size+')';
    rotor.style.transform='rotateY('+motion.yaw+'deg) rotateZ('+motion.roll+'deg)';
    const activeScene=p<.16?0:p<.43?1:p<.69?2:p<.85?3:4;
    scenes.forEach((scene,i)=>{
      const visible=i===activeScene;
      scene.style.opacity=visible?'1':'0';
      scene.classList.toggle('on',visible);
      scene.setAttribute('aria-hidden',String(!visible));
      scene.querySelectorAll('[data-target],[data-scroll]').forEach(b=>{
        b.tabIndex=visible?0:-1;
        if(b.tagName==='SPAN') b.setAttribute('role','button');
      });
    });
    const spin=clamp((p-.48)/.23);
    const glow=Math.sin(Math.PI*spin);
    orbit.style.opacity=reduced?'0':String(glow*.82);
    twirl.style.opacity=reduced?'0':String(glow);
    orbit.style.transform='translate(-50%,-50%) rotateX(66deg) rotateZ('+(spin*360)+'deg) scale('+(.6+glow*.4)+')';
    if (hint) hint.style.opacity=String(1-smooth(clamp(p*10)));
    if (bar) bar.style.width=(p*100)+'%';
    if (counter) counter.textContent=String(activeScene+1).padStart(2,'0')+' / 05';
  }
  function schedule() {
    if (pending) return;
    pending=true;
    frame=requestAnimationFrame(render);
  }
  function click(event) {
    const target=event.target instanceof Element?event.target.closest('[data-target],[data-scroll]'):null;
    if (!target) return;
    if (target.dataset.target) {
      const routes={Simulator:'/simulator',Experiments:'/lab','Algorithm Comparison':'/comparison',Home:'/'};
      navigate(routes[target.dataset.target] || '/simulator');
      window.scrollTo(0,0);
    } else {
      const progress=clamp(Number(target.dataset.scroll));
      const top=window.scrollY+root.getBoundingClientRect().top;
      const range=Math.max(1,root.offsetHeight-window.innerHeight);
      window.scrollTo({top:top+progress*range,behavior:'smooth'});
    }
  }
  function keydown(event) {
    if (!['Enter',' '].includes(event.key)) return;
    if (!(event.target instanceof Element)) return;
    if (!event.target.closest('[data-target],[data-scroll]')) return;
    event.preventDefault();
    click(event);
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  host.addEventListener('click',click);
  host.addEventListener('keydown',keydown);
  render();
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('scroll',schedule);
    window.removeEventListener('resize',schedule);
    host.removeEventListener('click',click);
    host.removeEventListener('keydown',keydown);
  };
}