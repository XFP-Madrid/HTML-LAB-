'use strict';
(() => {
  const { $, escape, say } = window.AdvancedLab;
  const initialHTML = window.AdvancedCourse[0].snippets.HTML;
  $('html-editor').value = initialHTML;
  function renderHTML() {
    // Un template es inerte. Se reconstruye un árbol permitido sin URLs ni eventos.
    const template = document.createElement('template');
    template.innerHTML = $('html-editor').value.slice(0,20000);
    const allowed = new Set('main header footer nav section article aside h1 h2 h3 h4 h5 h6 p ul ol li dl dt dd strong em b i small mark code pre blockquote br hr details summary span div figure figcaption abbr time'.split(' '));
    const discard = new Set('script style link meta title iframe object embed svg math template img video audio source track input form button select textarea base'.split(' '));
    const fragment = document.createElement('div');
    function copy(node, parent) {
      if(node.nodeType===Node.TEXT_NODE){parent.append(document.createTextNode(node.textContent));return;}
      if(node.nodeType!==Node.ELEMENT_NODE || discard.has(node.localName))return;
      let target=parent;
      if(allowed.has(node.localName)){
        target=document.createElement(node.localName);
        if(node.hasAttribute('id') && /^[\w-]{1,70}$/.test(node.id))target.id=node.id;
        if(node.hasAttribute('aria-labelledby') && /^[\w -]{1,100}$/.test(node.getAttribute('aria-labelledby')))target.setAttribute('aria-labelledby',node.getAttribute('aria-labelledby'));
        if(node.localName==='details'&&node.hasAttribute('open'))target.setAttribute('open','');
        parent.append(target);
      }
      [...node.childNodes].forEach(n=>copy(n,target));
    }
    [...template.content.childNodes].forEach(n=>copy(n,fragment));
    $('html-preview').srcdoc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; form-action 'none'; base-uri 'none'"><style>body{font:15px/1.65 system-ui,sans-serif;padding:20px;color:#242c42}h1{font-size:25px}h2{font-size:19px}details{background:#f3f0fa;padding:13px;border-radius:8px}summary{cursor:pointer}code{background:#eee;padding:2px 4px}mark{background:#f5e4a3}</style></head><body>${fragment.innerHTML}</body></html>`;
  }
  $('html-run').addEventListener('click',()=>{renderHTML();say('HTML actualizado en la vista aislada.');});
  $('html-reset').addEventListener('click',()=>{$('html-editor').value=initialHTML;renderHTML();say('Ejemplo restablecido.');});renderHTML();
  const semantic={main:'main identifica el contenido principal de la página. Evita varios main visibles a la vez.',section:'section agrupa contenido temático, normalmente identificado por un encabezado. No es un contenedor para cualquier estilo.',article:'article representa una pieza autónoma, como una noticia o entrada. Puede contener sus propias secciones.'};
  document.querySelectorAll('[data-semantic]').forEach(b=>b.addEventListener('click',()=>{$('semantic-answer').textContent=semantic[b.dataset.semantic];}));

  const form=$('practice-form');
  const labels={alias:'Alias',email:'Correo',hours:'Horas',date:'Fecha',confirm:'Datos ficticios'};
  function inspectForm(){
    $('range-output').value=`${$('form-range').value} %`;
    $('validity-inspector').innerHTML=Object.entries(labels).map(([name,label])=>{
      const field=form.elements.namedItem(name),v=field.validity;
      let message=v.valueMissing?'valueMissing':v.typeMismatch?'typeMismatch':v.rangeUnderflow?'rangeUnderflow':v.rangeOverflow?'rangeOverflow':v.stepMismatch?'stepMismatch':v.tooShort?'tooShort':v.badInput?'badInput':'válido';
      // minlength puede no evaluarse al asignar valores por programa; aquí se enseña también el criterio.
      if(name==='alias'&&field.value.length===1)message='Mínimo: 2 caracteres';
      return `<div class="validity-row"><span>${label}</span><code class="${message==='válido'?'valid':'invalid'}">${escape(message)}</code></div>`;
    }).join('');
  }
  form.addEventListener('input',inspectForm);form.addEventListener('change',inspectForm);
  form.addEventListener('invalid',()=>{$('form-result').textContent='Hay restricciones pendientes. Revisa el control señalado y el inspector.';inspectForm();},true);
  form.addEventListener('reset',()=>{setTimeout(()=>{inspectForm();$('form-result').textContent='Formulario restablecido. No se han guardado datos.';},0);});
  form.addEventListener('submit',e=>{
    e.preventDefault();inspectForm();
    if(form.elements.alias.value.trim().length<2){$('form-result').textContent='El alias necesita al menos dos caracteres distintos de espacios.';form.elements.alias.focus();return;}
    if(!form.reportValidity())return;
    const d=new FormData(form);
    $('form-result').textContent=`Práctica válida: ${d.get('alias')}, ${d.get('hours')} h, fecha ${d.get('date')}. Confianza: ${d.get('level')} %. Resumen local; no se ha enviado ni guardado.`;
    $('form-result').style.borderLeftColor=d.get('color');
  });inspectForm();

  // Canvas: puntos normalizados y un único fotograma pendiente.
  const canvas=$('drawing-board'),ctx=canvas.getContext('2d');
  let paths=[],drawing=false,activePointer=null,frame=0,animate=false,canvasWidth=900,canvasHeight=360,keyboardPoint={x:.5,y:.5},showCursor=false;
  function activeCanvas(){return window.AdvancedLab.current?.id==='canvas' && window.AdvancedLab.tab==='lab';}
  function draw(time=0){
    if(!ctx)return;
    ctx.clearRect(0,0,canvasWidth,canvasHeight);ctx.fillStyle='#fbfaf7';ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.strokeStyle='#e7e5ed';ctx.lineWidth=1;
    for(let x=20;x<canvasWidth;x+=25){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvasHeight);ctx.stroke();}
    for(let y=20;y<canvasHeight;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvasWidth,y);ctx.stroke();}
    paths.forEach(p=>{ctx.strokeStyle=p.color;ctx.fillStyle=p.color;ctx.lineWidth=p.size;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();p.points.forEach((v,i)=>{const x=v.x*canvasWidth,y=v.y*canvasHeight;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});if(p.points.length===1){ctx.arc(p.points[0].x*canvasWidth,p.points[0].y*canvasHeight,p.size/2,0,Math.PI*2);ctx.fill();}else ctx.stroke();});
    if(showCursor){ctx.strokeStyle='#28324a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(keyboardPoint.x*canvasWidth,keyboardPoint.y*canvasHeight,10,0,Math.PI*2);ctx.stroke();}
    if(animate){const x=30+(canvasWidth-60)*((Math.sin(time/850)+1)/2);ctx.fillStyle='#db8d45';ctx.beginPath();ctx.arc(x,canvasHeight*.5,17,0,Math.PI*2);ctx.fill();}
  }
  function resizeCanvas(){if(!activeCanvas()||!ctx)return;const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;canvasWidth=r.width;canvasHeight=r.height;const dpr=Math.min(window.devicePixelRatio||1,3);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function loop(time){frame=0;if(!animate)return;draw(time);frame=requestAnimationFrame(loop);}
  function stopAnimation(message){animate=false;if(frame)cancelAnimationFrame(frame);frame=0;$('canvas-animate').textContent='Iniciar animación';$('canvas-animate').setAttribute('aria-pressed','false');draw();if(message)$('canvas-status').textContent=message;}
  function point(e){const r=canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};}
  canvas.addEventListener('pointerdown',e=>{if(!ctx||!e.isPrimary||(e.pointerType==='mouse'&&e.button!==0))return;e.preventDefault();canvas.focus();stopAnimation();drawing=true;activePointer=e.pointerId;canvas.setPointerCapture(e.pointerId);paths.push({color:$('brush-color').value,size:Number($('brush-size').value),points:[point(e)]});if(paths.length>300)paths.shift();draw();});
  canvas.addEventListener('pointermove',e=>{if(!drawing||e.pointerId!==activePointer)return;const p=paths[paths.length-1];if(p.points.length<4000)p.points.push(point(e));draw();});
  function finishDraw(){if(!drawing)return;drawing=false;activePointer=null;$('canvas-status').textContent=`${paths.length} trazos en el lienzo. Los puntos se conservan al cambiar de tamaño.`;}
  ['pointerup','pointercancel','lostpointercapture'].forEach(type=>canvas.addEventListener(type,finishDraw));
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))return;e.preventDefault();stopAnimation();showCursor=true;
    if(e.key==='ArrowUp')keyboardPoint.y=Math.max(.03,keyboardPoint.y-.03);
    if(e.key==='ArrowDown')keyboardPoint.y=Math.min(.97,keyboardPoint.y+.03);
    if(e.key==='ArrowLeft')keyboardPoint.x=Math.max(.03,keyboardPoint.x-.03);
    if(e.key==='ArrowRight')keyboardPoint.x=Math.min(.97,keyboardPoint.x+.03);
    if(e.key===' ')paths.push({color:$('brush-color').value,size:Number($('brush-size').value),points:[{...keyboardPoint}]});
    draw();$('canvas-status').textContent=`Cursor: ${Math.round(keyboardPoint.x*100)} % horizontal, ${Math.round(keyboardPoint.y*100)} % vertical.${e.key===' '?' Punto añadido.':''}`;
  });
  $('canvas-preset').addEventListener('click',()=>{stopAnimation();paths=[{color:'#6658d3',size:6,points:[{x:.15,y:.7},{x:.15,y:.3},{x:.35,y:.3},{x:.35,y:.7},{x:.15,y:.7}]},{color:'#298269',size:6,points:[{x:.46,y:.7},{x:.6,y:.3},{x:.74,y:.7},{x:.46,y:.7}]}];draw();$('canvas-status').textContent='Ejemplo: un cuadrado violeta y un triángulo verde. Dos trazos creados con controles accesibles.';});
  $('canvas-clear').addEventListener('click',()=>{stopAnimation();paths=[];showCursor=false;draw();$('canvas-status').textContent='Lienzo limpio.';});
  $('canvas-animate').addEventListener('click',()=>{
    if(animate){stopAnimation('Animación detenida.');return;}
    if(!ctx)return;
    if(matchMedia('(prefers-reduced-motion: reduce)').matches){$('canvas-status').textContent='Tu preferencia de movimiento reducido está activa. Se mantiene el ejemplo estático.';return;}
    animate=true;$('canvas-animate').textContent='Detener animación';$('canvas-animate').setAttribute('aria-pressed','true');$('canvas-status').textContent='Animación activa: un círculo naranja se desplaza horizontalmente.';frame=requestAnimationFrame(loop);
  });
  if(typeof ResizeObserver==='function')new ResizeObserver(resizeCanvas).observe(canvas);else window.addEventListener('resize',resizeCanvas);
  if(!ctx){$('canvas-status').textContent='Este navegador no ofrece contexto Canvas 2D. Consulta los ejemplos de código.';['canvas-preset','canvas-clear','canvas-animate'].forEach(id=>$(id).disabled=true);}

  const places={madrid:{name:'Madrid · Puerta del Sol',lat:40.4168,lon:-3.7038},barcelona:{name:'Barcelona · Plaça de Catalunya',lat:41.387,lon:2.1701},sevilla:{name:'Sevilla · Plaza de España',lat:37.3772,lon:-5.9869}};
  const geoErrors={1:'Permiso denegado. Respeta la decisión y continúa con una ciudad de ejemplo. El permiso también puede estar bloqueado por la política del navegador.',2:'Posición no disponible. Los servicios del dispositivo no han podido obtenerla. Comprueba su disponibilidad o usa el ejemplo.',3:'Tiempo de espera agotado. No se recibió una posición dentro del plazo. Puedes reintentar o usar el ejemplo.'};
  let geoToken=0,geoPending=false;
  function coordinates(lat,lon,accuracy,name,real){
    $('geo-lat').textContent=lat.toFixed(6);$('geo-lon').textContent=lon.toFixed(6);$('geo-accuracy').textContent=real?`${Math.round(accuracy)} m (estimación)`:'Dato de ejemplo';$('geo-mode').textContent=real?'DISPOSITIVO · POSICIÓN ESTIMADA':'EJEMPLO · COORDENADAS PÚBLICAS';$('map-location').textContent=name;
    $('maps-link').href=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lat},${lon}`)}`;
  }
  function geoExample(){geoToken++;geoPending=false;$('geo-real').disabled=false;const p=places[$('geo-place').value]||places.madrid;coordinates(p.lat,p.lon,null,p.name,false);$('geo-status').textContent='Coordenadas públicas de ejemplo. No se ha solicitado una nueva ubicación.';}
  $('geo-place').addEventListener('change',geoExample);$('geo-reset').addEventListener('click',geoExample);
  document.querySelectorAll('[data-geo-error]').forEach(b=>b.addEventListener('click',()=>{geoExample();$('geo-status').textContent=`SIMULACIÓN · ${geoErrors[b.dataset.geoError]} Los permisos reales no han cambiado.`;}));
  $('geo-real').addEventListener('click',()=>{
    if(!window.isSecureContext){$('geo-status').textContent='La geolocalización requiere un contexto seguro. Usa HTTPS o localhost, o continúa con las coordenadas de ejemplo.';return;}
    if(!navigator.geolocation){$('geo-status').textContent='Este navegador no ofrece geolocalización. Continúa con una ciudad de ejemplo.';return;}
    const token=++geoToken;geoPending=true;$('geo-real').disabled=true;$('geo-status').textContent='Esperando el permiso y la posición del navegador. Puedes volver al ejemplo.';
    function finish(){if(token!==geoToken)return false;geoPending=false;$('geo-real').disabled=false;return true;}
    try { navigator.geolocation.getCurrentPosition(position=>{
      if(!finish())return;const c=position.coords;
      if(!Number.isFinite(c.latitude)||!Number.isFinite(c.longitude)||Math.abs(c.latitude)>90||Math.abs(c.longitude)>180){$('geo-status').textContent='El navegador no devolvió coordenadas válidas.';return;}
      coordinates(c.latitude,c.longitude,c.accuracy,'Ubicación estimada del dispositivo',true);$('geo-status').textContent='Posición recibida. La aplicación no la guarda. Elige si deseas enviarla a Google al abrir el mapa.';
    },error=>{if(finish())$('geo-status').textContent=geoErrors[error.code]||'No se pudo obtener la posición. Puedes continuar con el ejemplo.';},{enableHighAccuracy:false,timeout:10000,maximumAge:0}); }
    catch(_){if(finish())$('geo-status').textContent='El navegador ha bloqueado la solicitud. Continúa con el ejemplo.';}
  });

  const video=$('lesson-video'),audio=$('lesson-audio');
  $('video-play').addEventListener('click',async()=>{try{await video.play();}catch(_){$('video-status').textContent='No se pudo reproducir. Usa los controles nativos o consulta la descripción.';}});
  $('video-pause').addEventListener('click',()=>video.pause());
  $('video-speed').addEventListener('change',()=>{video.playbackRate=Number($('video-speed').value);});
  video.addEventListener('play',()=>{$('video-status').textContent='Reproduciendo el vídeo local.';});
  video.addEventListener('pause',()=>{$('video-status').textContent='Vídeo en pausa.';});
  video.addEventListener('ended',()=>{$('video-status').textContent='Vídeo finalizado: HTML estructura, CSS presenta y JavaScript aporta comportamiento.';});
  video.addEventListener('error',()=>{$('video-status').textContent='No se pudo cargar el vídeo en este navegador. La descripción contiene la misma explicación.';});
  $('video-track').addEventListener('error',()=>{$('video-status').textContent='La pista VTT no se pudo cargar. Consulta la descripción; prueba localhost si abriste un archivo local.';});

  document.querySelectorAll('[data-storage]').forEach(b=>b.addEventListener('click',()=>{
    const [type,action]=b.dataset.storage.split(':'),key=`lm-lab-extension:demo:${type}`,output=$(`${type}-result`),select=$(`${type}-choice`);
    try{
      const storage=type==='local'?window.localStorage:window.sessionStorage;
      if(action==='save'){storage.setItem(key,select.value);output.textContent=`Guardado: ${select.selectedOptions[0].textContent}.`;}
      if(action==='read'){const value=storage.getItem(key),option=[...select.options].find(o=>o.value===value);output.textContent=value===null?'No hay un valor guardado en esta clave.':`Valor guardado: ${option?option.textContent:value.slice(0,80)}.`;}
      if(action==='remove'){storage.removeItem(key);output.textContent='Esta clave se ha eliminado. Las demás se conservan.';}
    }catch(_){output.textContent='Almacenamiento no disponible. No se ha podido completar la operación. Revisa las restricciones del navegador o prueba desde localhost.';}
  }));

  const cards=[{id:'button',text:'<button>',zone:'html'},{id:'required',text:'required',zone:'html'},{id:'grid',text:'display: grid',zone:'css'},{id:'color',text:'color: #6658d3',zone:'css'},{id:'position',text:'getCurrentPosition()',zone:'api'},{id:'setitem',text:'localStorage.setItem()',zone:'api'}];
  const zones={pending:'Por clasificar',html:'HTML',css:'CSS',api:'JavaScript / Web API'};
  function renderDrag(){Object.keys(zones).forEach(z=>$(`zone-${z}`).replaceChildren());cards.forEach(c=>{const li=document.createElement('li');li.className='drag-card';li.id=`card-${c.id}`;li.draggable=true;li.dataset.card=c.id;li.innerHTML=`<code>${escape(c.text)}</code><div><label><span class="sr-only">Destino de ${escape(c.text)}</span><select data-destination="${c.id}">${Object.entries(zones).map(([v,n])=>`<option value="${v}">${n}</option>`).join('')}</select></label><button class="outline-button" data-move="${c.id}" aria-label="Mover ${escape(c.text)}">Mover</button></div>`;$('zone-pending').append(li);});$('pending-count').textContent='6';}
  function moveCard(id,zone,keyboard){const card=cards.find(c=>c.id===id);if(!card||!Object.hasOwn(zones,zone))return;const node=$(`card-${id}`);$(`zone-${zone}`).append(node);node.querySelector('select').value=zone;node.classList.remove('correct','incorrect');$('pending-count').textContent=$('zone-pending').children.length;$('drag-status').textContent=`${card.text} se ha movido a ${zones[zone]}.`;if(keyboard)node.querySelector('button').focus();}
  $('drag-board').addEventListener('click',e=>{const b=e.target.closest('[data-move]');if(b){const id=b.dataset.move;moveCard(id,$(`card-${id}`).querySelector('select').value,true);}});
  $('drag-board').addEventListener('dragstart',e=>{if(e.target.closest('select,button')){e.preventDefault();return;}const c=e.target.closest('[data-card]');if(c&&e.dataTransfer){e.dataTransfer.setData('text/plain',c.dataset.card);e.dataTransfer.effectAllowed='move';}});
  document.querySelectorAll('[data-zone]').forEach(zone=>{
    zone.addEventListener('dragover',e=>{e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move';zone.classList.add('drag-over');});
    zone.addEventListener('dragleave',e=>{if(!zone.contains(e.relatedTarget))zone.classList.remove('drag-over');});
    zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('drag-over');moveCard(e.dataTransfer?.getData('text/plain'),zone.dataset.zone,false);});
  });
  $('drag-check').addEventListener('click',()=>{let correct=0;cards.forEach(c=>{const el=$(`card-${c.id}`),ok=el.parentElement.id===`zone-${c.zone}`;if(ok)correct++;el.classList.toggle('correct',ok);el.classList.toggle('incorrect',!ok);});$('drag-status').textContent=`${correct} de 6 tarjetas bien clasificadas. ${correct===6?'Todas las piezas están en su capa.':'Revisa las tarjetas señaladas. Consulta el criterio de logro si necesitas ayuda.'}`;});
  $('drag-reset').addEventListener('click',()=>{renderDrag();$('drag-status').textContent='Seis tarjetas por clasificar.';});renderDrag();

  // Función propia serializada: ningún código escrito por el usuario llega al Worker.
  function workerProgram(){self.onmessage=({data:limit})=>{if(![1000000,30000000,100000000].includes(limit)){throw new Error('Carga no admitida');}let sum=0,i=1;function chunk(){const end=Math.min(i+250000,limit+1);for(;i<end;i++)sum+=Math.sqrt(i);self.postMessage({progress:Math.round((i-1)/limit*100)});if(i<=limit)setTimeout(chunk,0);else self.postMessage({done:true,result:sum});}chunk();};}
  let worker=null,workerURL=null,started=0;
  function releaseWorker(){if(worker)worker.terminate();worker=null;if(workerURL)URL.revokeObjectURL(workerURL);workerURL=null;$('worker-start').disabled=false;$('worker-cancel').disabled=true;}
  function cancelWorker(message){if(!worker)return;releaseWorker();$('worker-status').textContent=message||'Tarea cancelada. No se ha producido un resultado completo.';$('worker-result').textContent='Cálculo cancelado.';}
  $('worker-start').addEventListener('click',()=>{
    if(worker)return;
    if(typeof Worker!=='function'||typeof URL.createObjectURL!=='function'){$('worker-status').textContent='Web Workers no disponible. Consulta el ejemplo de código.';return;}
    const limit=Number($('worker-size').value);if(![1000000,30000000,100000000].includes(limit))return;
    try{
      workerURL=URL.createObjectURL(new Blob([`(${workerProgram.toString()})()`],{type:'text/javascript'}));worker=new Worker(workerURL);started=performance.now();
      $('worker-start').disabled=true;$('worker-cancel').disabled=false;$('worker-progress').value=0;$('worker-percent').textContent='0 %';$('worker-result').textContent='Calculando…';$('worker-status').textContent='Worker activo. Puedes usar el contador o cancelar la tarea.';
      worker.onmessage=({data})=>{if(data.progress!==undefined){$('worker-progress').value=data.progress;$('worker-percent').textContent=`${data.progress} %`;}if(data.done){$('worker-result').textContent=`Suma ≈ ${data.result.toLocaleString('es-ES',{maximumFractionDigits:3})}`;$('worker-status').textContent=`Tarea finalizada en ${((performance.now()-started)/1000).toFixed(2)} s (incluye planificación por bloques). Worker terminado y URL liberada.`;releaseWorker();}};
      worker.onerror=e=>{e.preventDefault();releaseWorker();$('worker-result').textContent='No se obtuvo un resultado.';$('worker-status').textContent='El navegador no pudo ejecutar el Worker. Prueba desde localhost y consulta el código de la unidad.';};
      worker.postMessage(limit);
    }catch(_){releaseWorker();$('worker-status').textContent='No se pudo iniciar el Worker en este contexto. Consulta el ejemplo de código.';}
  });
  $('worker-cancel').addEventListener('click',()=>cancelWorker());let counter=0;$('response-button').addEventListener('click',()=>{$('response-counter').textContent=++counter;});

  $('show-dialog').addEventListener('click',()=>{if(typeof $('study-dialog').showModal==='function')$('study-dialog').showModal();else $('dialog-fallback').hidden=false;});
  if(!('showPopover' in HTMLElement.prototype)){
    $('native-popover').removeAttribute('popover');$('native-popover').hidden=true;$('popover-fallback').hidden=false;$('popover-button').removeAttribute('popovertarget');$('popover-button').setAttribute('aria-expanded','false');
    $('popover-button').addEventListener('click',()=>{const p=$('native-popover');p.hidden=!p.hidden;$('popover-button').setAttribute('aria-expanded',String(!p.hidden));});
    $('native-popover').querySelector('button').addEventListener('click',()=>{$('native-popover').hidden=true;$('popover-button').setAttribute('aria-expanded','false');$('popover-button').focus();});
  }
  function changeLab({id,tab}){
    if(id==='canvas'&&tab==='lab')requestAnimationFrame(resizeCanvas);else{finishDraw();if(animate)stopAnimation('Animación detenida al salir de la práctica.');}
    if(id!=='workers'||tab!=='lab')cancelWorker('Tarea cancelada al salir de la práctica.');
    if(id!=='multimedia'||tab!=='lab'){video.pause();audio.pause();}
    if((id!=='geolocalizacion'||tab!=='lab')&&geoPending)geoExample();
    if(id!=='interaccion'||tab!=='lab'){const p=$('native-popover');if(typeof p.hidePopover==='function'&&p.matches(':popover-open'))p.hidePopover();}
  }
  window.addEventListener('labchange',e=>changeLab(e.detail));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){if(animate)stopAnimation('Animación detenida al ocultar la pestaña.');video.pause();audio.pause();}});
  window.addEventListener('pagehide',()=>{stopAnimation();releaseWorker();geoToken++;});
  changeLab({id:window.AdvancedLab.current?.id,tab:window.AdvancedLab.tab});
})();
