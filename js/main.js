const words=['OBSERVE.','DESIGN.','PROTOTYPE.','ITERATE.','IMPACT.'];
let i=0;const el=document.getElementById('rotating');
setInterval(()=>{i=(i+1)%words.length;el.style.opacity=0;setTimeout(()=>{el.textContent=words[i];el.style.opacity=1;},250)},2000);
