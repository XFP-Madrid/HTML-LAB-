/* HTML LAB: navegación, renderizado seguro y estado educativo local. */
(() => {
  'use strict';
  const data = window.HTMLLabData;
  if (!data) return;
  const { tags, sessions } = data;
  const $ = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  const total = Object.keys(tags).length;
  const state = { session: 1, tag: '!doctype', query: '', highlight: true, view: 'split', comparing: false, explored: new Set(), theme: '', lastCode: '' };
  const storageKey = 'html-lab-v1';
  let toastTimer;
  let searchTimer;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const displayName = (id) => id === '!doctype' ? '<!DOCTYPE html>' : id === 'placeholder' ? 'placeholder' : `<${id}>`;
  const normalize = (text) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[<>]/g, '').trim();
  function node(name, text, className) {
    const result = document.createElement(name);
    if (text !== undefined && text !== null) result.textContent = text;
    if (className) result.className = className;
    return result;
  }
  function button(text, onClick, className) {
    const result = node('button', text, className);
    result.type = 'button';
    result.addEventListener('click', onClick);
    return result;
  }
  function announce(message) {
    clearTimeout(toastTimer);
    $('#app-status').textContent = message;
    toastTimer = setTimeout(() => { $('#app-status').textContent = ''; }, 4200);
  }
  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify({ explored: [...state.explored], theme: state.theme })); }
    catch (_) { /* file:// o políticas del navegador pueden impedir la persistencia. */ }
  }
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (Array.isArray(saved.explored)) state.explored = new Set(saved.explored.filter(id => Object.hasOwn(tags, id)));
      if (['light','dark'].includes(saved.theme)) state.theme = saved.theme;
    } catch (_) { /* Un dato antiguo no debe impedir usar la aplicación. */ }
  }
  function applyTheme() {
    const theme = state.theme || (systemTheme.matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    $('#theme-toggle').setAttribute('aria-label', `Activar modo ${theme === 'light' ? 'oscuro' : 'claro'}`);
    $('#theme-toggle').title = `Modo ${theme === 'light' ? 'claro' : 'oscuro'} · Pulsa para cambiar`;
  }
  function renderProgress() {
    const count = state.explored.size;
    const percent = Math.round(count / total * 100);
    $('#progress-percent').replaceChildren(document.createTextNode(percent), node('span','%'));
    $('#total-progress').value = percent;
    $('#progress-label').textContent = `${count} de ${total} fichas exploradas`;
    all('.session-button').forEach((b, index) => {
      const ids = sessions[index].ids;
      const done = ids.filter(id => state.explored.has(id)).length;
      b.querySelector('.session-completion').textContent = `${done}/${ids.length}`;
      b.setAttribute('aria-label', `Sesión ${index + 1}: ${sessions[index].short}. ${done} de ${ids.length} exploradas`);
    });
    const explored = state.explored.has(state.tag);
    $('#mark-explored').setAttribute('aria-pressed', String(explored));
    $('#mark-explored').replaceChildren(node('span', explored ? '✓' : '○'), document.createTextNode(explored ? ' Explorada' : ' Marcar explorada'));
  }
  function buildNavigation() {
    sessions.forEach((session, index) => {
      const b = button('', () => selectSession(index + 1), 'session-button');
      b.append(node('span', String(index + 1).padStart(2,'0'), 'session-number'), node('span',session.short,'session-name'), node('span','', 'session-completion'));
      $('#session-nav').append(b);
    });
  }
  function selectSession(number, tagId, updateHash = true) {
    state.session = number;
    state.comparing = false;
    state.query = '';
    $('#tag-search').value = '';
    $('#clear-search').hidden = true;
    $('#comparison-section').hidden = true;
    $('#learning-workspace').hidden = false;
    $('#session-guide').hidden = false;
    $('#session-guide').open = false;
    const session = sessions[number - 1];
    $('#session-eyebrow').textContent = `SESIÓN ${String(number).padStart(2,'0')} / 10 · APRENDE HACIENDO`;
    $('#session-title').textContent = session.title;
    $('#session-description').textContent = session.description;
    $('#session-category').textContent = session.category;
    $('#session-count').textContent = `${session.ids.length} fichas para explorar`;
    $('#guide-title').textContent = session.guide;
    all('.session-button').forEach((b, i) => {
      if (i + 1 === number) b.setAttribute('aria-current','step');
      else b.removeAttribute('aria-current');
    });
    renderGuide(number);
    const selected = tagId && session.ids.includes(tagId) ? tagId : session.ids[0];
    state.tag = selected;
    renderTags();
    showTag(selected, false);
    renderNativeDemos();
    if (updateHash) setHash(`sesion-${number}`);
  }
  function setHash(hash) {
    // replaceState puede estar limitado en algunos contextos file://.
    try { history.replaceState(null, '', `#${hash}`); } catch (_) { /* La navegación interna sigue funcionando. */ }
  }
  function searchTags() {
    state.query = normalize($('#tag-search').value);
    $('#clear-search').hidden = !state.query;
    if (state.comparing && state.query) {
      state.comparing = false;
      $('#comparison-section').hidden = true;
      $('#learning-workspace').hidden = false;
      $('#session-guide').hidden = false;
      renderNativeDemos();
    }
    renderTags();
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => announce(`${filteredTags().length} fichas encontradas${state.query ? ' en todas las sesiones' : ''}.`), 350);
  }
  function filteredTags() {
    if (!state.query) return sessions[state.session - 1].ids;
    return Object.keys(tags).filter(id => {
      const t = tags[id];
      const text = [id, t.summary,t.what,t.purpose,t.category,t.kind || '',t.related.join(' '),(t.attrs || []).join(' '),t.when].join(' ');
      return normalize(text).includes(state.query);
    });
  }
  function renderTags() {
    const ids = filteredTags();
    $('#tag-list').replaceChildren();
    $('#tag-count').textContent = ids.length;
    $('#tag-list-title').textContent = state.query ? 'Resultados de búsqueda' : 'Explora las etiquetas';
    $('#tag-list-help').textContent = state.query ? 'Buscando en las diez sesiones.' : 'Selecciona una para empezar.';
    $('#no-results').hidden = ids.length > 0;
    ids.forEach(id => {
      const t = tags[id];
      const b = button('', () => {
        if (state.query) {
          const destination = sessions[state.session - 1].ids.includes(id) ? state.session : t.session;
          selectSession(destination,id);
          announce(`Abierta ${displayName(id)} en la sesión ${destination}.`);
        } else showTag(id,true);
      },'tag-button');
      b.setAttribute('aria-pressed',String(id === state.tag));
      b.append(node('code',displayName(id)),node('small',t.summary),node('small',`${t.kind || t.category}${state.query ? ` · S${t.session}` : ''}`,'tag-kind'));
      if (state.explored.has(id)) { const check = node('span','✓','explored-check'); check.setAttribute('aria-label','Explorada'); b.append(check); }
      $('#tag-list').append(b);
    });
  }
  function goToTag(id) {
    if (!tags[id]) return;
    if (!sessions[state.session - 1].ids.includes(id)) selectSession(tags[id].session,id);
    else showTag(id,true);
    $('#tag-title').focus({preventScroll:true});
    $('#tag-detail').scrollIntoView({block:'start',behavior:'auto'});
  }
  function showTag(id, focus) {
    const tag = tags[id];
    if (!tag) return;
    state.tag = id;
    $('#detail-category').textContent = `${tag.kind || tag.category} · FICHA DE APRENDIZAJE`;
    $('#tag-title').textContent = displayName(id);
    const fields = { summary:'summary',what:'what',purpose:'purpose',when:'when',syntax:'syntax',benefit:'benefit',caution:'caution',accessibility:'accessibility' };
    Object.entries(fields).forEach(([element,property]) => { $(`#tag-${element}`).textContent = tag[property]; });
    $('#code-editor').value = tag.code;
    $('#tag-attributes').replaceChildren();
    const attrs = tag.attrs || [];
    $('#attributes-section').hidden = !attrs.length;
    attrs.forEach(attr => $('#tag-attributes').append(node('dt',attr),node('dd',data.attributes[attr])));
    $('#related-tags').replaceChildren(...tag.related.filter(related => tags[related]).map(related => button(`${displayName(related)} ↗`,() => goToTag(related))));
    const ids = sessions[state.session - 1].ids;
    $('#current-position').textContent = `FICHA ${ids.indexOf(id) + 1} DE ${ids.length} · SESIÓN ${String(state.session).padStart(2,'0')}`;
    $('#table-control').hidden = state.session !== 6;
    renderTags();
    renderProgress();
    runExample(false);
    renderStructure();
    setHash(`sesion-${state.session}/${encodeURIComponent(id)}`);
    if (focus) {
      $('#tag-title').focus({preventScroll:true});
      if (window.innerWidth < 901) $('#tag-detail').scrollIntoView({block:'start',behavior:'auto'});
    }
  }

  // El editor nunca interpreta HTML del estudiante en el DOM de la aplicación.
  // Reconstruimos un subconjunto explícito: tokens desconocidos no generan marcado,
  // valores siempre entre comillas y escapados; no hay URL libre ni atributo on*.
  // Una segunda barrera (sandbox sin permisos + CSP) se aplica a cada iframe.
  const allowedTags = new Set(('header nav main section article aside footer div address h1 h2 h3 h4 h5 h6 p br hr strong em b i u s small mark sub sup blockquote q pre code abbr cite time del ins dfn kbd samp var wbr bdi bdo span a img figure figcaption picture source ul ol li dl dt dd menu table caption thead tbody tfoot tr th td colgroup col form label input textarea button select option optgroup fieldset legend datalist output progress meter audio video track details summary dialog noscript ruby rt rp data template').split(' '));
  const allowedAttributes = new Set(('id class lang dir title alt width height name type value placeholder required disabled readonly checked selected min max step maxlength minlength pattern for autocomplete multiple rows cols size scope rowspan colspan headers span start reversed datetime cite label list low high optimum controls preload kind srclang default open wrap').split(' '));
  const rawOmitted = new Set(['script','style','title','head']);
  const voidTags = new Set(['br','hr','wbr','img','source','col','input','track']);
  const escapeText = (value) => value.replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const escapeAttr = (value) => value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const localImage = () => data.notebookImage || '';
  function sanitizeExample(source) {
    source = String(source).slice(0,50000);
    let output = '';
    let position = 0;
    let skip = '';
    let restricted = false;
    // Un token solo se acepta completo; un '<' suelto se convierte en texto.
    const tokens = /<!--[\s\S]*?(?:-->|$)|<![^>]*>|<\/?([A-Za-z][A-Za-z0-9:-]*)(\s+(?:[^"'<>]|"[^"]*"|'[^']*')*)?\s*\/?\s*>/g;
    let match;
    while ((match = tokens.exec(source))) {
      if (!skip) output += escapeText(source.slice(position,match.index));
      position = tokens.lastIndex;
      const full = match[0];
      const tag = (match[1] || '').toLowerCase();
      const closing = full.startsWith('</');
      if (skip) { if (closing && tag === skip) skip = ''; continue; }
      if (!tag) continue;
      if (rawOmitted.has(tag)) { if (!closing) skip = tag; restricted = true; continue; }
      if (['html','body'].includes(tag)) continue;
      if (!allowedTags.has(tag)) {
        restricted = true;
        if (!closing && ['iframe','embed'].includes(tag)) output += '<p>[Documento incrustado: contenido externo desactivado en el editor]</p>';
        continue;
      }
      if (closing) { if (!voidTags.has(tag)) output += `</${tag}>`; continue; }
      let attributes = '';
      let hasSafeHref = false;
      const attrTokens = /([^\s=\/'"<>`]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g;
      const seen = new Set();
      let attr;
      while ((attr = attrTokens.exec(match[2] || ''))) {
        const key = attr[1].toLowerCase();
        let value = attr[2] ?? attr[3] ?? attr[4] ?? '';
        if (seen.has(key)) continue;
        seen.add(key);
        if (key === 'href' && tag === 'a' && /^#[A-Za-z][\w-]*$/.test(value)) {
          // about:srcdoc evita que una ancla herede la URL del documento padre.
          attributes += ` href="about:srcdoc${escapeAttr(value)}"`;
          hasSafeHref = true;
        } else if (['src','srcset','poster'].includes(key) && value === 'assets/cuaderno.png' && ['img','source','video'].includes(tag)) {
          if (localImage()) attributes += ` ${key}="${localImage()}"`;
        } else if (allowedAttributes.has(key) || /^aria-(label|labelledby|describedby|hidden)$/.test(key)) {
          if (key === 'type' && tag === 'input' && value.toLowerCase() === 'image') value = 'button';
          if (key === 'autocomplete') value = 'off';
          if (['width','height'].includes(key)) value = String(Math.min(1200,Math.max(1,Number(value)||240)));
          attributes += ` ${key}="${escapeAttr(value)}"`;
        } else { restricted = true; }
      }
      if (tag === 'a' && !hasSafeHref) attributes += ' role="link" aria-disabled="true" title="Destino externo desactivado en esta demostración"';
      if (tag === 'form') attributes += ' action="about:blank" autocomplete="off"';
      output += `<${tag}${attributes}>`;
    }
    if (!skip) output += escapeText(source.slice(position));
    return { html:output, restricted };
  }
  const previewCSS = `html{color-scheme:light}body{font:14px/1.6 Georgia,serif;color:#203439;background:#fff;margin:22px;overflow-wrap:anywhere}img,video,audio{max-width:100%;height:auto}pre{white-space:pre-wrap}input,select,textarea,button{max-width:100%;font:13px system-ui;box-sizing:border-box}table{border-collapse:collapse;width:100%}caption{padding:6px;font-weight:bold}th,td{padding:6px}a[aria-disabled]{color:#386d94;text-decoration:underline;cursor:not-allowed}dialog{position:relative;margin:0;padding:14px;border:1px solid #8aa9a5;max-width:90%}h1{font-size:26px}h2{font-size:21px}h3{font-size:17px}textarea{vertical-align:top}fieldset{min-width:0}input[type=radio],input[type=checkbox]{accent-color:#12756c}*{box-sizing:border-box}`;
  function safeDocument(source, extraCSS = '') {
    const clean = sanitizeExample(source);
    // CSP va antes de cualquier fragmento editable. Sin scripts, formularios,
    // conexiones, documentos secundarios, objetos, fuentes ni recursos remotos.
    const csp = "default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src data:; media-src 'none'; connect-src 'none'; frame-src 'none'; object-src 'none'; form-action 'none'; base-uri 'none'";
    return { srcdoc:`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta http-equiv="Content-Security-Policy" content="${csp}"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Demostración HTML aislada</title><style>${previewCSS}${extraCSS}</style></head><body>${clean.html}</body></html>`, restricted:clean.restricted };
  }
  function runExample(userAction) {
    const source = $('#code-editor').value;
    const borders = state.session === 6 && $('#table-borders').checked ? 'th,td{border:1px solid #8fa6a8}' : '';
    const result = safeDocument(source,borders);
    $('#example-preview').srcdoc = result.srcdoc;
    state.lastCode = source;
    const tagNote = tags[state.tag].previewNote;
    const noVisual = ['!doctype','html','head','body','title','meta','link','script','style','template','source','track'].includes(state.tag);
    $('#preview-notice').textContent = tagNote || (noVisual ? 'Este elemento configura o agrupa contenido; puede no dibujar nada por sí solo. Observa el ejemplo y su estructura.' : result.restricted ? 'Vista segura: los recursos externos, scripts, estilos editados y envíos están desactivados. Las anclas internas sí funcionan.' : 'Un espacio para probar: los cambios se quedan en este ejemplo. Los formularios no se envían.');
    if (userAction) announce('Ejemplo actualizado. Observa el resultado en la vista previa.');
  }
  function renderStructure() {
    const semanticTags = sessions[1].ids;
    const selected = tags[state.tag];
    const isDocument = state.session === 1;
    let source = selected.code;
    let css = '';
    $('#structure-picker').replaceChildren();
    if (semanticTags.includes(state.tag)) {
      source = data.semanticExample;
      css = 'body{font:12px/1.5 system-ui;margin:16px}header,nav,main,section,article,aside,footer,div,address{padding:12px;margin:8px 0;border:1px solid #dce5e5;border-radius:6px}main{display:grid;grid-template-columns:2fr 1fr;gap:12px}main>section,main>aside{margin:0}h1{font-size:21px;margin:0}h2{font-size:16px;margin:0}h3{font-size:14px}p{margin:7px 0}header{background:#f0f5f3}aside{background:#faf4ed}footer{background:#f6f7f7}@media(max-width:400px){main{grid-template-columns:1fr}}';
      $('#structure-description').textContent = `${displayName(state.tag)} en una página completa. El contorno y el rótulo indican su zona exacta; los colores son ayudas didácticas añadidas con CSS.`;
      semanticTags.forEach(id => $('#structure-picker').append(button(displayName(id),() => goToTag(id))));
    } else if (isDocument) {
      source = '<div class="doc-map"><p>DOCUMENTO · &lt;!DOCTYPE html&gt;</p><div class="map-html"><b>&lt;html lang="es"&gt;</b><section class="map-head"><h2>&lt;head&gt; · Metadatos</h2><p>&lt;meta&gt; · codificación</p><p>&lt;title&gt; · pestaña</p><p>&lt;link&gt; / &lt;style&gt; · estilos</p><p>&lt;script&gt; · comportamiento</p></section><section class="map-body"><h2>&lt;body&gt; · Contenido de la página</h2><header class="map-header"><h3>&lt;header&gt; · Introducción visible</h3><p>Mi primera página</p></header><p>Hola, HTML. Aquí está el contenido.</p></section></div></div>';
      const mapClass = {html:'.map-html',head:'.map-head',body:'.map-body','!doctype':'.doc-map'}[state.tag] || '.map-head';
      css = 'body{font:12px/1.6 system-ui}section,.map-html,.doc-map{border:1px solid #c9d9d7;border-radius:8px;padding:13px;margin:10px 0}h2{font-size:15px}h3{font-size:13px}.map-head{background:#f2f1fb}.map-body{background:#eaf5ef}.map-header{border:1px dashed #83a49e;padding:10px}';
      if (state.highlight) css += `${mapClass}{outline:2px solid #13756b;outline-offset:3px}`;
      $('#structure-description').textContent = 'Mapa didáctico: head configura; body contiene; header introduce dentro de body. El documento real está en la guía de la sesión.';
    } else {
      $('#structure-description').textContent = `El contorno identifica ${displayName(state.tag)} dentro del ejemplo. Los elementos sin representación propia pueden no mostrar un contorno visible.`;
    }
    if (state.highlight && !isDocument && allowedTags.has(state.tag)) {
      css += `${state.tag}{outline:2px solid #14796d;outline-offset:2px;background-color:#e7f5ec}`;
      if (semanticTags.includes(state.tag)) css += `${state.tag}::before{content:'<${state.tag}> · zona seleccionada';display:block;font:10px/1.5 monospace;color:#095b50;margin-bottom:6px}`;
    }
    if (state.session === 6) css += 'th,td{border:1px solid #a8bcba}';
    $('#structure-preview').srcdoc = safeDocument(source,css).srcdoc;
    $('#highlight-toggle').setAttribute('aria-pressed',String(state.highlight));
    $('#highlight-toggle').textContent = state.highlight ? 'Quitar resaltado' : 'Resaltar elemento';
  }
  function renderGuide(number) {
    const container = $('#guide-content');
    container.replaceChildren();
    const paragraph = (text) => container.append(node('p',text));
    const code = (text) => { const pre = node('pre',null,'guide-code'); pre.append(node('code',text)); container.append(pre); };
    if (number === 1) {
      paragraph('Empieza por este documento completo. La declaración activa el modo estándar; html engloba el documento; head reúne los metadatos y body contiene lo que aparece en la página.');
      const map = node('div',null,'anatomy');
      [['<head>','Metadatos: title nombra la pestaña, meta configura la codificación. No es la cabecera visible.'],['<body>','Contenido de la página: títulos, párrafos, imágenes… Un header puede introducir este contenido.']].forEach(([title,text]) => { const part = node('div'); part.append(node('code',title),node('span',text)); map.append(part); });
      container.append(map); code(data.documentExample);
      paragraph('Algunas etiquetas de apertura o cierre, como las de html, head, body, p o li, pueden omitirse solo en los contextos previstos por las reglas de HTML. Para aprender, escríbelas explícitamente. Los elementos vacíos, como meta e img, no tienen etiqueta de cierre; una barra final no convierte en vacío un elemento normal.');
    } else if (number === 2) {
      paragraph('Escoge por función: main contiene lo principal; section agrupa un tema; article es una pieza con sentido propio; div agrupa sin añadir significado. No hay una única estructura obligatoria para todas las páginas.');
      paragraph('header y footer pueden pertenecer a la página o a un artículo. nav identifica navegación importante, no cualquier lista. Un footer no es solo una caja colocada abajo. html incluye head y body; header está dentro del contenido de body.');
      paragraph('Abre «Estructura resaltada» bajo el editor: verás una página completa y podrás seleccionar sus regiones. Los bordes y la disposición son CSS didáctico; las etiquetas semánticas no producen por sí solas ese diseño. La semántica facilita comprensión y accesibilidad, pero no garantiza posicionamiento SEO.');
    } else if (number === 3) {
      paragraph('Elige h1–h6 por la jerarquía del contenido, no por el tamaño de la letra. Una organización habitual es un h1 principal, h2 para secciones y h3 para sus apartados. CSS puede cambiar sus tamaños.');
      paragraph('strong y em aportan importancia y énfasis; b e i tienen otros usos semánticos y siguen siendo válidos. La negrita o la cursiva predeterminadas no hacen que sus significados sean equivalentes.');
      paragraph('Un párrafo expresa una idea; br conserva un salto de línea que forma parte del contenido. Un bloque y un elemento en línea no son categorías semánticas: su presentación puede cambiar con CSS, aunque sus reglas de anidamiento sigan siendo distintas.');
    } else if (number === 4) {
      paragraph('Una ruta relativa, como imagenes/aula.png, parte de la ubicación del archivo HTML. ../ sube un directorio. Una URL absoluta incluye esquema y dominio, como https://example.com/guia. /imagenes/aula.png parte de la raíz del sitio; en file:// no equivale a la carpeta del proyecto.');
      code('<a href="otra-pagina.html">Otra página local</a>\n<a href="#tema">Ir al tema</a>\n<h2 id="tema">El tema</h2>\n<a href="https://example.com/" target="_blank" rel="noopener">Referencia (nueva pestaña)</a>\n<a href="guia.pdf" download>Descargar guía</a>');
      paragraph('Los destinos externos del código son ejemplos para leer: el editor los desactiva. La imagen assets/cuaderno.png sí está incluida. alt debe transmitir su función en contexto; alt="" es apropiado si es puramente decorativa.');
    } else if (number === 5) {
      paragraph('¿Cambiar el orden cambiaría el significado? Usa ol. Si no, usa ul. Para términos y descripciones utiliza dl, dt y dd. Las sublistas se colocan dentro del li al que pertenecen.');
      code('<ul>\n  <li>Herramientas\n    <ul>\n      <li>Editor</li>\n      <li>Navegador</li>\n    </ul>\n  </li>\n</ul>');
      paragraph('menu puede expresar una lista de comandos; no es obligatorio para un menú de navegación ni programa los botones. Un nav con una lista de enlaces es una estructura habitual para navegar.');
    } else if (number === 6) {
      paragraph('Las tablas relacionan datos, no distribuyen toda la página. Empieza con caption y encabezados th; scope="col" describe una columna y scope="row" una fila. Activa o desactiva los bordes bajo el editor.');
      code('<table>\n  <caption>Prácticas por turno</caption>\n  <thead><tr><th scope="col">Turno</th><th scope="col">Módulo</th><th scope="col">Horas</th></tr></thead>\n  <tbody>\n    <tr><th scope="rowgroup" rowspan="2">Mañana</th><td>HTML</td><td>3</td></tr>\n    <tr><td>CSS</td><td>2</td></tr>\n  </tbody>\n  <tfoot><tr><th scope="row" colspan="2">Total</th><td>5</td></tr></tfoot>\n</table>');
      paragraph('rowspan amplía una celda por filas y colspan por columnas. En tablas de relaciones complejas, un td puede usar headers="curso horas" para referenciar th con id="curso" e id="horas". Prioriza estructuras simples que puedan leerse sin depender del color.');
    } else if (number === 7) {
      paragraph('label identifica el campo para la persona; id permite asociarlo; name identifica el dato al enviarlo. placeholder es una pista, no una etiqueta y no sustituye a label.');
      paragraph('submit intenta enviar tras validar; reset devuelve los valores iniciales; button no hace nada hasta que se le asocia una acción. required="false" sigue activando required, porque es un atributo booleano: quítalo para desactivarlo.');
      paragraph('Prueba el formulario guiado al final de la sesión. Usa datos inventados. La aplicación intercepta sus envíos y no lee, transmite ni guarda esos valores. Los ejemplos del editor tienen el envío bloqueado mediante aislamiento.');
    } else if (number === 8) {
      paragraph('audio y video son reproductores; source ofrece alternativas; track relaciona pistas de texto temporizadas. No hay grabaciones ni vídeos en este proyecto: los ejemplos explican la estructura y no simulan una reproducción.');
      paragraph('Añade transcripciones y subtítulos adecuados. iframe incrusta otro documento; object y embed dependen del recurso y del soporte del navegador. No son funciones como geolocalización, WebGL o Canvas, que quedan fuera de este curso.');
      paragraph('Este iframe controlado sí contiene otro documento local: tiene un título, no permite scripts ni formularios y no carga recursos externos. En un sitio real, incrustar servicios de terceros también afecta a la privacidad.');
      const frame = node('iframe'); frame.title = 'Ejemplo controlado de documento incrustado'; frame.setAttribute('sandbox',''); frame.referrerPolicy = 'no-referrer'; frame.srcdoc = safeDocument('<h2>Hola desde otro documento</h2><p>Este texto pertenece a un iframe aislado.</p>').srcdoc; frame.style.height = '145px'; container.append(frame);
    } else if (number === 9) {
      paragraph('details y summary permiten desplegar contenido sin JavaScript. button también es nativo, pero una acción personalizada requiere programación. La prueba guiada abre dialog mediante showModal() y proporciona cierre con botón y Escape.');
      paragraph('noscript es una alternativa cuando los scripts están desactivados. No detecta por sí solo que un archivo JavaScript tenga errores.');
    } else {
      paragraph('ruby, rt, rp, data y template siguen siendo elementos válidos para funciones específicas. En cambio, los siguientes elementos históricos no deben utilizarse en HTML moderno. b, i, s, u y small no son obsoletos: tienen significados concretos.');
      container.append(node('h3','Etiquetas obsoletas o que debes evitar'));
      const list = node('ul',null,'obsolete-list');
      data.obsolete.forEach(([tag,text]) => { const li = node('li'); li.append(node('code',`<${tag}> `),document.createTextNode(text)); list.append(li); }); container.append(list);
      container.append(node('h3','No son etiquetas'));
      const grid = node('div',null,'concept-grid');
      data.concepts.forEach(([title,text]) => { const item = node('div'); item.append(node('h3',title),node('p',text)); grid.append(item); }); container.append(grid);
    }
  }
  const placeholderInfo = { name:'placeholder',purpose:'Ofrecer una pista breve en un campo vacío.',what:'Es un atributo de ciertos controles, no un elemento ni una etiqueta.',visual:'Texto tenue dentro del campo vacío; desaparece al escribir.',when:'Como ejemplo de formato, junto a un label visible.',caution:'No lo uses como único nombre del control: desaparece y puede tener poco contraste.',code:'<label for="alias">Alias</label>\n<input id="alias" placeholder="Ej.: Alex">' };
  const sharedExamples = {
    main:'<main>\n  <h1>Noticias del aula</h1>\n  <p>Hoy aprendemos HTML.</p>\n</main>',
    section:'<section>\n  <h2>Noticias del aula</h2>\n  <p>Hoy aprendemos HTML.</p>\n</section>',
    article:'<article>\n  <h2>Noticias del aula</h2>\n  <p>Hoy aprendemos HTML.</p>\n</article>',
    div:'<div>\n  <h2>Noticias del aula</h2>\n  <p>Hoy aprendemos HTML.</p>\n</div>'
  };
  function buildComparisons() {
    const selectIds = [...Object.keys(tags),'placeholder'];
    ['#compare-a','#compare-b'].forEach(selector => selectIds.forEach(id => { const option = node('option',displayName(id)); option.value = id; $(selector).append(option); }));
    data.comparisons.forEach((comparison,index) => {
      const b = button(comparison.title,() => renderComparison(comparison.ids,comparison.tip,index)); b.setAttribute('aria-pressed','false'); $('#comparison-presets').append(b);
    });
  }
  function showComparisons() {
    state.comparing = true;
    $('#learning-workspace').hidden = true;
    $('#comparison-section').hidden = false;
    $('#session-guide').hidden = true;
    $('#native-demos').hidden = true;
    renderComparison(data.comparisons[0].ids,data.comparisons[0].tip,0);
    $('#comparison-title').focus({preventScroll:true});
    $('#comparison-section').scrollIntoView({block:'start'});
    setHash('comparar');
  }
  function renderComparison(ids,tip,preset = -1) {
    all('#comparison-presets button').forEach((b,index) => b.setAttribute('aria-pressed',String(index === preset)));
    $('#compare-a').value = ids[0]; $('#compare-b').value = ids[1];
    $('#comparison-tip').textContent = `${tip} CSS puede cambiar tamaño, color, disposición y otros detalles visuales; no cambia la semántica del elemento.`;
    const documentComparison = ids.every(id => ['head','header','body'].includes(id));
    $('#comparison-document').hidden = !documentComparison;
    $('#comparison-document').textContent = documentComparison ? '<!DOCTYPE html>\n<html lang="es">\n  <head>\n    <meta charset="UTF-8">\n    <title>El cuaderno del aula</title>\n  </head>\n  <body>\n    <header>\n      <h1>El cuaderno del aula</h1>\n      <p>La introducción de nuestra página.</p>\n    </header>\n    <main><p>El contenido principal.</p></main>\n  </body>\n</html>' : '';
    $('#comparison-panels').replaceChildren();
    ids.forEach(id => {
      const tag = id === 'placeholder' ? placeholderInfo : tags[id];
      const card = node('article',null,'comparison-card');
      card.append(node('h3',displayName(id)));
      const dl = node('dl');
      [['Finalidad',tag.purpose],['Significado',tag.what],['Aspecto predeterminado',tag.visual || 'Depende del navegador y de su contexto.'],['Cuándo elegirlo',tag.when],['Error frecuente',tag.caution]].forEach(([label,text]) => dl.append(node('dt',label),node('dd',text)));
      card.append(dl);
      const sameContent = ids.every(item => ['main','section','article','div'].includes(item));
      const example = sameContent ? sharedExamples[id] : tag.code;
      const pre = node('pre'); pre.append(node('code',example)); card.append(pre);
      const frame = node('iframe'); frame.title = `Resultado de ${displayName(id)}`; frame.setAttribute('sandbox',''); frame.referrerPolicy = 'no-referrer'; frame.srcdoc = safeDocument(example).srcdoc; card.append(frame);
      $('#comparison-panels').append(card);
    });
  }
  function renderNativeDemos() {
    const forms = state.session === 7;
    const interactions = state.session === 9;
    $('#native-demos').hidden = !(forms || interactions) || state.comparing;
    $('#form-demo-wrap').hidden = !forms;
    $('#dialog-demo-wrap').hidden = !interactions;
    $('#native-title').textContent = forms ? 'Un formulario de verdad' : 'Pruébalo con el navegador';
  }
  async function copyExample() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Sin API de portapapeles');
      await navigator.clipboard.writeText($('#code-editor').value);
      announce('Ejemplo copiado.');
    } catch (_) {
      // La selección funciona también abriendo el archivo directamente.
      setView('split');
      const editor = $('#code-editor'); editor.focus(); editor.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch (_) { /* Usar Ctrl+C. */ }
      announce(copied ? 'Ejemplo copiado.' : 'Código seleccionado. Pulsa Ctrl+C (o ⌘C) para copiar.');
    }
  }
  function setView(view) {
    state.view = view;
    $('#lab-panes').dataset.view = view;
    all('[data-view]').filter(b => b.tagName === 'BUTTON').forEach(b => b.setAttribute('aria-pressed',String(b.dataset.view === view)));
  }
  function buildCoverage() {
    const container = $('#coverage-content');
    container.append(node('p',`${total} fichas únicas: ${total - 1} elementos HTML y la declaración DOCTYPE. source y button aparecen en dos sesiones; su progreso se comparte.`));
    sessions.forEach((session,index) => { container.append(node('h3',`${index+1}. ${session.short}`),node('p',session.ids.map(displayName).join(' · '))); });
    container.append(node('h3','Historia y conceptos'),node('p','Solo como ejemplos históricos que debes evitar: <font>, <center>, <marquee>, <big> y <strike>. La guía de la sesión 10 explica sus sustituciones.'),node('p','La categoría «No son etiquetas» cubre atributos, comentarios, selectores y propiedades CSS, JavaScript y entidades. placeholder tiene además su comparación con label.'));
    container.append(node('h3','Referencias para ampliar'),node('p','El contenido distingue las funciones descritas por el estándar HTML y las notas de uso de MDN. Estos enlaces requieren Internet; el laboratorio funciona sin abrirlos.'));
    [['Estándar HTML · WHATWG','https://html.spec.whatwg.org/multipage/'],['Elementos HTML · MDN','https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements'],['Aislamiento de srcdoc · MDN','https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc']].forEach(([label,url]) => { const a = node('a',label); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; container.append(a); });
    container.append(node('h3','Cómo funciona tu progreso'),node('p','Solo se guardan la preferencia de tema y los identificadores de fichas exploradas, en este navegador. Si el almacenamiento local no está disponible, el progreso dura mientras la página está abierta. No se guardan los ejemplos editados ni los campos del formulario.'));
    const reset = button('Restablecer el progreso',() => { state.explored.clear(); persist(); renderProgress(); renderTags(); announce('Progreso restablecido. Puedes empezar de nuevo.'); },'secondary'); container.append(reset);
  }
  function bindEvents() {
    $('#tag-search').addEventListener('input', searchTags);
    const clear = () => { $('#tag-search').value=''; searchTags(); $('#tag-search').focus(); };
    $('#clear-search').addEventListener('click',clear); $('#reset-search').addEventListener('click',clear);
    $('#theme-toggle').addEventListener('click',() => { state.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; applyTheme(); persist(); });
    systemTheme.addEventListener('change',() => { if (!state.theme) applyTheme(); });
    $('#mark-explored').addEventListener('click',() => {
      if (state.explored.has(state.tag)) state.explored.delete(state.tag); else state.explored.add(state.tag);
      persist(); renderProgress(); renderTags(); announce(`${displayName(state.tag)} ${state.explored.has(state.tag) ? 'marcada como explorada' : 'pendiente de explorar'}.`);
    });
    $('#next-tag').addEventListener('click',() => { const ids = sessions[state.session-1].ids; const index = ids.indexOf(state.tag); if(index+1<ids.length) showTag(ids[index+1],true); else selectSession(state.session===10?1:state.session+1); });
    $('#run-code').addEventListener('click',() => runExample(true));
    $('#code-editor').addEventListener('keydown',event => { if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); runExample(true); } });
    $('#reset-code').addEventListener('click',() => { $('#code-editor').value=tags[state.tag].code; runExample(false); announce('Ejemplo original restablecido.'); });
    $('#copy-code').addEventListener('click',copyExample);
    all('button[data-view]').forEach(b => b.addEventListener('click',() => setView(b.dataset.view)));
    $('#table-borders').addEventListener('change',() => runExample(false));
    $('#highlight-toggle').addEventListener('click',() => { state.highlight=!state.highlight; renderStructure(); });
    $('#isolate-example').addEventListener('click',() => { runExample(false); $('#isolated-preview').srcdoc=$('#example-preview').srcdoc; $('#isolated-dialog').showModal(); });
    all('[data-close-dialog]').forEach(b => b.addEventListener('click',() => document.getElementById(b.dataset.closeDialog).close()));
    $('#open-comparisons').addEventListener('click',showComparisons);
    $('#return-session').addEventListener('click',() => { selectSession(state.session,state.tag); $('#session-title').scrollIntoView({block:'start'}); });
    $('#comparison-form').addEventListener('submit',event => {
      event.preventDefault();
      const ids = [$('#compare-a').value,$('#compare-b').value];
      if (ids[0] === ids[1]) { announce('Elige dos opciones distintas para comparar.'); return; }
      const preset = data.comparisons.findIndex(item => item.ids.length===2 && item.ids.every(id=>ids.includes(id)));
      renderComparison(ids,preset>=0?data.comparisons[preset].tip:'Compara su función antes de elegir. El parecido visual no las hace intercambiables.',preset);
    });
    $('#demo-form').addEventListener('submit',event => { event.preventDefault(); $('#form-status').textContent='Prueba correcta: los campos cumplen la validación HTML. No se ha enviado ni guardado ningún dato.'; });
    $('#demo-form').addEventListener('invalid',() => { $('#form-status').textContent='Revisa el campo señalado por el navegador. Completa los obligatorios y respeta el formato indicado.'; },true);
    $('#demo-form').addEventListener('reset',() => { $('#form-status').textContent='Valores iniciales restablecidos. No se ha guardado ningún dato.'; });
    $('#form-help').addEventListener('click',() => { $('#form-status').textContent='Escribe un alias de al menos 2 caracteres, un correo como alumna@example.com, una contraseña ficticia de al menos 8 caracteres y marca la casilla obligatoria.'; });
    $('#show-demo-dialog').addEventListener('click',() => $('#demo-dialog').showModal());
    $('#show-coverage').addEventListener('click',() => $('#coverage-dialog').showModal());
    window.addEventListener('hashchange',route);
  }
  function route() {
    if (location.hash === '#comparar') { showComparisons(); return; }
    // Un enlace de salto accesible no debe reiniciar la sesión seleccionada.
    if (location.hash === '#main-content' && $('#tag-title').textContent) return;
    const match = /^#sesion-(\d+)(?:\/([^/]+))?$/.exec(location.hash);
    const number = match ? Number(match[1]) : 1;
    let id;
    try { id=match?.[2] ? decodeURIComponent(match[2]) : undefined; } catch (_) { id=undefined; }
    selectSession(number>=1&&number<=10?number:1,id,false);
  }
  restore(); applyTheme(); buildNavigation(); buildComparisons(); buildCoverage(); bindEvents(); route();
})();
