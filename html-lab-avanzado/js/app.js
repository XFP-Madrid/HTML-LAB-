'use strict';
(() => {
  const course = window.AdvancedCourse;
  const $ = (id) => document.getElementById(id);
  const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const key = 'lm-lab-extension:course:v1';
  const validIds = new Set(course.map(u => u.id));
  let saved;
  try { saved = JSON.parse(localStorage.getItem(key)); } catch (_) { /* Estado en memoria. */ }
  const state = { done: [], scores: {}, last: '', theme: '' };
  if (saved && typeof saved === 'object') {
    state.done = Array.isArray(saved.done) ? [...new Set(saved.done.filter(id => validIds.has(id)))] : [];
    for (const u of course) if (Number.isInteger(saved.scores?.[u.id]) && saved.scores[u.id] >= 0 && saved.scores[u.id] <= 3) state.scores[u.id] = saved.scores[u.id];
    state.last = validIds.has(saved.last) ? saved.last : '';
    state.theme = ['dark', 'light'].includes(saved.theme) ? saved.theme : '';
  }
  let current = null, currentTab = 'learn', snippetLanguage = 'HTML', toastTimer;
  function say(text) { $('live-status').textContent = text; $('live-status').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => { $('live-status').classList.remove('visible'); $('live-status').textContent = ''; }, 5000); }
  function persist() { try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) { say('El navegador no permite guardar. El progreso se mantiene mientras esta página siga abierta.'); } }
  function setTheme() { document.documentElement.dataset.theme = state.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); $('theme').setAttribute('aria-label', `Activar tema ${document.documentElement.dataset.theme === 'dark' ? 'claro' : 'oscuro'}`); }
  setTheme();
  function syncProgress() {
    $('side-progress').value = state.done.length;
    $('side-progress-label').textContent = `${state.done.length} de 9`;
    $('course-nav').innerHTML = course.map((u, i) => `<a class="unit-nav" href="#${u.id}" ${current?.id === u.id ? 'aria-current="page"' : ''}><span>${String(i + 1).padStart(2, '0')}</span><span>${escape(u.short)}</span><span aria-label="${state.done.includes(u.id) ? 'Estudiada' : 'Pendiente'}">${state.done.includes(u.id) ? '✓' : '○'}</span></a>`).join('');
    if (current) {
      const done = state.done.includes(current.id);
      $('mark-done').setAttribute('aria-pressed', String(done));
      $('mark-done').textContent = done ? '✓ Unidad estudiada' : '○ Marcar como estudiada';
      $('quiz-best').textContent = state.scores[current.id] === undefined ? 'Autoevaluación pendiente' : `Mejor resultado: ${state.scores[current.id]} / 3`;
    }
    renderCards();
  }
  const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  function renderCards() {
    const query = normalize($('course-search').value.trim());
    const found = course.filter(u => normalize([u.title,u.short,...u.tags,...u.concepts.flat()].join(' ')).includes(query));
    $('unit-grid').innerHTML = found.map(u => {
      const i = course.indexOf(u);
      return `<a class="unit-card" href="#${u.id}"><div class="card-top"><span class="unit-icon" aria-hidden="true">${escape(u.icon)}</span><span class="card-number">${String(i+1).padStart(2,'0')} / 09</span></div><span class="eyebrow">${escape(u.category)}</span><h3>${escape(u.short)}</h3><p>${escape(u.intro)}</p><div class="tag-row">${u.tags.slice(0,2).map(t=>`<span class="tech-pill">${escape(t)}</span>`).join('')}</div><div class="card-bottom"><span>${u.duration}</span><span>${state.done.includes(u.id) ? '✓ Estudiada' : 'Explorar →'}</span></div></a>`;
    }).join('');
    $('empty-search').hidden = found.length !== 0;
    $('search-status').textContent = query ? `${found.length} unidades encontradas.` : '';
  }
  function snippet(language) {
    snippetLanguage = language;
    $('snippet').textContent = current.snippets[language];
    $('snippet-tabs').innerHTML = Object.keys(current.snippets).map(l => `<button data-language="${l}" aria-pressed="${l === language}">${l}</button>`).join('');
  }
  function renderQuiz() {
    $('quiz-result').hidden = true;
    $('quiz-questions').innerHTML = current.quiz.map((q, qi) => `<fieldset class="quiz-question"><legend>${qi+1}. ${escape(q[0])}</legend>${q[1].map((option,oi)=>`<label class="quiz-option"><input type="radio" name="q${qi}" value="${oi}" required><span>${escape(option)}</span></label>`).join('')}<p class="quiz-explanation" id="explanation-${qi}" hidden></p></fieldset>`).join('');
  }
  function renderLesson() {
    const i = course.indexOf(current);
    $('lesson-kicker').textContent = `UNIDAD ${String(i+1).padStart(2,'0')} · ${current.category}`;
    $('lesson-title').textContent = current.title;
    $('lesson-intro').textContent = current.intro;
    $('lesson-time').textContent = `◷ ${current.duration} · Ritmo orientativo`;
    $('lesson-tags').innerHTML = current.tags.map(t=>`<span class="tech-pill">${escape(t)}</span>`).join('');
    $('concepts').innerHTML = current.concepts.map((c,n)=>`<section class="concept"><span>CONCEPTO 0${n+1}</span><h2>${escape(c[0])}</h2><p>${escape(c[1])}</p></section>`).join('');
    for (const [id, prop] of [['distinction','distinction'],['snippet-note','snippetNote'],['reflection','reflection'],['lab-title','labTitle'],['lab-description','labDescription'],['challenge-solution','solution']]) $(id).textContent = current[prop];
    for (const [id, list] of [['objectives-list',current.objectives],['mistakes-list',current.mistakes],['challenge-steps',current.challenge]]) $(id).innerHTML = list.map(s=>`<li>${escape(s)}</li>`).join('');
    $('lesson-references').innerHTML = current.references.map(([name,url])=>`<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(name)} ↗</a>`).join('');
    $('challenge-title').textContent = `Ponlo en práctica: ${current.short}`;
    $('challenge-solution').closest('details').open = false;
    $('unit-position').textContent = `${String(i+1).padStart(2,'0')} / 09`;
    $('previous-unit').disabled = i === 0;
    $('next-unit').textContent = i === course.length - 1 ? 'Volver al recorrido →' : 'Siguiente unidad →';
    document.querySelectorAll('.lab-content').forEach(el => { el.hidden = el.dataset.lab !== current.id; });
    snippet('HTML'); renderQuiz();
  }
  function route() {
    const [id, requestedTab] = location.hash.slice(1).split('/');
    const next = course.find(u => u.id === id) || null;
    const changed = next !== current;
    current = next;
    currentTab = ['learn','lab','quiz'].includes(requestedTab) ? requestedTab : 'learn';
    $('home-view').hidden = !!current; $('lesson-view').hidden = !current;
    $('breadcrumb').textContent = current ? current.short : 'Ampliación';
    document.title = `${current ? current.short : 'Más allá de las etiquetas'} · HTML LAB +`;
    if (current) {
      if (changed) { renderLesson(); state.last = current.id; persist(); }
      ['learn','lab','quiz'].forEach(t => { $(`panel-${t}`).hidden = currentTab !== t; $(`tab-${t}`).setAttribute('aria-selected', String(currentTab === t)); $(`tab-${t}`).tabIndex = currentTab === t ? 0 : -1; });
    }
    syncProgress();
    window.dispatchEvent(new CustomEvent('labchange', { detail: { id: current?.id || '', tab: currentTab } }));
    if (changed) { window.scrollTo({ top: 0 }); (current ? $('lesson-title') : $('main')).focus({preventScroll:true}); }
  }
  function tab(name) { if (current) location.hash = `${current.id}/${name}`; }
  document.querySelectorAll('[data-tab]').forEach(button => {
    button.addEventListener('click', () => tab(button.dataset.tab));
    button.addEventListener('keydown', e => {
      const tabs = [...document.querySelectorAll('[data-tab]')];
      const index = tabs.indexOf(button);
      let target;
      if (e.key === 'ArrowRight') target = tabs[(index+1)%3];
      if (e.key === 'ArrowLeft') target = tabs[(index+2)%3];
      if (e.key === 'Home') target = tabs[0];
      if (e.key === 'End') target = tabs[2];
      if (target) { e.preventDefault(); tab(target.dataset.tab); target.focus(); }
    });
  });
  document.querySelectorAll('[data-target-tab]').forEach(b=> b.addEventListener('click',()=>{tab(b.dataset.targetTab); $(`tab-${b.dataset.targetTab}`).focus();}));
  $('start-course').addEventListener('click',()=>{location.hash = state.last || course[0].id;});
  $('course-search').addEventListener('input',()=>{if(current) location.hash='inicio'; renderCards();});
  $('clear-search').addEventListener('click',()=>{ $('course-search').value=''; renderCards(); $('course-search').focus(); });
  $('theme').addEventListener('click',()=>{ state.theme=document.documentElement.dataset.theme==='dark'?'light':'dark'; setTheme();persist(); });
  $('mark-done').addEventListener('click',()=>{ if(!current)return; const id=current.id; state.done=state.done.includes(id)?state.done.filter(x=>x!==id):[...state.done,id];persist();syncProgress(); });
  $('previous-unit').addEventListener('click',()=>{const i=course.indexOf(current);if(i>0)location.hash=course[i-1].id;});
  $('next-unit').addEventListener('click',()=>{const i=course.indexOf(current);location.hash=course[i+1]?.id||'inicio';});
  $('snippet-tabs').addEventListener('click',e=>{const b=e.target.closest('[data-language]');if(b)snippet(b.dataset.language);});
  $('copy-snippet').addEventListener('click',async()=>{
    try { await navigator.clipboard.writeText(current.snippets[snippetLanguage]); say('Código copiado.'); }
    catch (_) { const selection=getSelection(), range=document.createRange();range.selectNodeContents($('snippet'));selection.removeAllRanges();selection.addRange(range);say('Código seleccionado. Usa Ctrl+C o el menú Copiar.'); }
  });
  $('quiz-form').addEventListener('submit',e=>{
    e.preventDefault(); if(!current || !$('quiz-form').reportValidity())return;
    const data=new FormData(e.currentTarget);let score=0;
    current.quiz.forEach((q,i)=>{ const correct=Number(data.get(`q${i}`))===q[2]; if(correct)score++; const explanation=$(`explanation-${i}`);explanation.hidden=false;explanation.textContent=`${correct?'Correcto.':'Para repasar.'} ${q[3]}`; explanation.className=`quiz-explanation ${correct?'correct':'incorrect'}`; document.querySelectorAll(`[name="q${i}"]`).forEach(r=>{r.closest('label').classList.toggle('correct',Number(r.value)===q[2]);r.closest('label').classList.toggle('incorrect',r.checked&&!correct);}); });
    $('quiz-result').hidden=false;$('quiz-result').textContent=`${score} de 3 respuestas correctas. ${score===3?'Has comprendido los conceptos.':'Lee las explicaciones y vuelve a intentarlo.'}`;
    state.scores[current.id]=Math.max(score,state.scores[current.id]||0);persist();syncProgress();
  });
  $('quiz-reset').addEventListener('click',()=>{renderQuiz();$('quiz-questions').querySelector('input').focus();});
  function openInfo(title, html) { $('info-title').textContent=title;$('info-content').innerHTML=html;const d=$('info-dialog');if(typeof d.showModal==='function')d.showModal();else{d.setAttribute('open','');d.scrollIntoView();}$('close-info').focus(); }
  $('close-info').addEventListener('click',()=>{const d=$('info-dialog');if(typeof d.close==='function')d.close();else d.removeAttribute('open');});
  $('open-glossary').addEventListener('click',()=>openInfo('Un vocabulario común',`<dl>${window.AdvancedGlossary.map(([t,d])=>`<dt>${escape(t)}</dt><dd>${escape(d)}</dd>`).join('')}</dl>`));
  $('about').addEventListener('click',()=>openInfo('Material para comprender y practicar','<p>Ampliación de HTML LAB para Lenguaje de Marcas en Formación Profesional. Nueve unidades, nueve prácticas y 27 preguntas con explicación. El progreso es orientativo y no equivale a una calificación académica.</p><p>HTML, CSS y JavaScript sin bibliotecas externas. Las prácticas funcionan con recursos locales. Geolocalización depende del navegador, del contexto seguro y del permiso. Google Maps y las referencias requieren Internet.</p><p>Se guardan únicamente el progreso, los mejores resultados, el tema visual y la última unidad en una clave propia. Las dos preferencias del laboratorio de almacenamiento utilizan sus propias claves. No se guardan los datos del formulario ni la ubicación.</p><p>Contenido revisado con WHATWG, W3C, MDN y documentación oficial de Google. Consulta las fuentes de cada unidad. Edición: octubre de 2026.</p><p><a href="GUIA-DE-ESTUDIO.html">Abrir guía de lectura sin JavaScript →</a></p>'));
  $('reset-progress').addEventListener('click',()=>{openInfo('Restablecer el recorrido','<p>Se eliminarán las marcas de unidades estudiadas y los resultados de esta ampliación. Las preferencias de los laboratorios y el HTML LAB anterior se conservan.</p><button id="confirm-reset" class="primary">Restablecer este progreso</button>');$('confirm-reset').addEventListener('click',()=>{state.done=[];state.scores={};state.last='';persist();syncProgress();if(current)renderQuiz();$('close-info').click();say('Progreso de la ampliación restablecido.');});});
  function printHTML() {
    return `<div class="print-cover"><p>LENGUAJE DE MARCAS · FORMACIÓN PROFESIONAL</p><h1>HTML LAB · Ampliación</h1><p>Más allá de las etiquetas</p><p>Guía de estudio · 9 unidades · 27 preguntas razonadas</p><p>Trabaja en tres pasos: comprende el concepto, experimenta en el laboratorio y comprueba lo aprendido. Los tiempos son orientativos. La guía incluye las soluciones para facilitar el estudio autónomo.</p><p>Edición: octubre de 2026. Recursos locales; las referencias y Google Maps requieren conexión. Consulta el README para las condiciones de cada API.</p><ol>${course.map(u=>`<li><a href="#guia-${u.id}">${escape(u.short)}</a></li>`).join('')}</ol></div>` + course.map((u,i)=>`<section id="guia-${u.id}"><p>UNIDAD ${i+1} · ${escape(u.category)} · ${u.duration}</p><h2>${escape(u.title)}</h2><p>${escape(u.intro)}</p><h3>Objetivos</h3><ul>${u.objectives.map(t=>`<li>${escape(t)}</li>`).join('')}</ul>${u.concepts.map(([t,p])=>`<h3>${escape(t)}</h3><p>${escape(p)}</p>`).join('')}<h3>Distingue los conceptos</h3><p>${escape(u.distinction)}</p>${Object.entries(u.snippets).map(([l,s])=>`<h3>Ejemplo ${l}</h3><pre><code>${escape(s)}</code></pre>`).join('')}<p>${escape(u.snippetNote)}</p><h3>Errores que conviene evitar</h3><ul>${u.mistakes.map(t=>`<li>${escape(t)}</li>`).join('')}</ul><h3>Reflexión</h3><p>${escape(u.reflection)}</p><h3>Práctica: ${escape(u.labTitle)}</h3><p>${escape(u.labDescription)}</p><ol>${u.challenge.map(t=>`<li>${escape(t)}</li>`).join('')}</ol><p><strong>Criterio de logro.</strong> ${escape(u.solution)}</p><h3>Autoevaluación</h3>${u.quiz.map((q,n)=>`<div class="print-question"><p><strong>${n+1}. ${escape(q[0])}</strong></p><ol type="A">${q[1].map(t=>`<li>${escape(t)}</li>`).join('')}</ol><p class="print-answer"><strong>Respuesta ${'ABC'[q[2]]}.</strong> ${escape(q[3])}</p></div>`).join('')}<h3>Fuentes</h3><ul>${u.references.map(([n,url])=>`<li><a href="${escape(url)}">${escape(n)}</a></li>`).join('')}</ul></section>`).join('') + `<section><h2>Glosario</h2><dl>${window.AdvancedGlossary.map(([t,d])=>`<dt><strong>${escape(t)}</strong></dt><dd>${escape(d)}</dd>`).join('')}</dl></section>`;
  }
  $('print-guide').innerHTML=printHTML();
  $('print').addEventListener('click',()=>window.print());
  window.AdvancedLab={ $, escape, say, printHTML, get current(){return current;}, get tab(){return currentTab;} };
  window.addEventListener('hashchange',route);route();
})();
