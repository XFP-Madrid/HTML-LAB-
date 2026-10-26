/* Contenido docente independiente de la interfaz. */
'use strict';
window.AdvancedCourse = [
  {
    id: 'fundamentos', title: 'HTML actual, con criterio', short: 'Las capas de la web', category: 'BASE CONCEPTUAL', icon: '</>', duration: '25–35 min', tags: ['Semántica', 'Accesibilidad', 'Living Standard'],
    intro: 'Una página sólida empieza por asignar el trabajo correcto a cada tecnología. El marcado describe; CSS presenta; JavaScript programa el comportamiento.',
    objectives: ['Distinguir HTML, CSS y APIs del navegador.', 'Elegir elementos por su significado.', 'Comprobar una página con el teclado.'],
    concepts: [
      ['Un estándar que evoluciona', 'HTML se desarrolla como Living Standard. «HTML5» sigue siendo una expresión habitual, pero no designa todas las capacidades actuales del navegador. Aprende elementos y APIs concretas y comprueba su compatibilidad.'],
      ['El significado antes que la apariencia', 'main identifica el contenido principal; section agrupa contenido temático, normalmente con un encabezado; article representa una pieza autónoma. Un div es un contenedor genérico. Que dos elementos se vean igual no significa que comuniquen lo mismo.'],
      ['Accesibilidad desde la estructura', 'El idioma del documento, los encabezados ordenados, los nombres de controles y el foco visible ayudan a comprender y recorrer una página. Un botón nativo ofrece interacción con teclado; un div con un clic no adquiere automáticamente ese comportamiento.']
    ],
    distinction: 'Una etiqueta es parte del marcado. Una API es una interfaz de programación. Por ejemplo, canvas crea la superficie; getContext("2d") proporciona las operaciones para dibujar en ella.',
    snippets: { HTML: '<!DOCTYPE html>\n<html lang="es">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Mi cuaderno de prácticas</title>\n</head>\n<body>\n  <main>\n    <h1>Cuaderno de prácticas</h1>\n    <section aria-labelledby="objetivo">\n      <h2 id="objetivo">Objetivo de hoy</h2>\n      <p>Dar significado al contenido.</p>\n      <details>\n        <summary>Una pista</summary>\n        <p>Elige la etiqueta por su función.</p>\n      </details>\n    </section>\n  </main>\n</body>\n</html>', JavaScript: '// El navegador ofrece la API DOM.\nconst titulo = document.querySelector("h1");\n// textContent inserta texto, sin interpretarlo como HTML.\ntitulo.textContent = "Mi primera práctica";' },
    snippetNote: 'El laboratorio ejecuta el HTML editable en una vista aislada. Los ejemplos JavaScript son de lectura.',
    mistakes: ['Usar h1…h6 solo por su tamaño visual.', 'Elegir section como sustituto universal de div.', 'Afirmar que geolocalización o Web Workers son etiquetas HTML.'],
    reflection: 'Si eliminas todo el CSS, ¿el contenido conserva un orden comprensible?',
    references: [['HTML Living Standard · WHATWG', 'https://html.spec.whatwg.org/'], ['Elementos HTML · MDN', 'https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements']],
    labTitle: 'Edita la estructura, observa el significado', labDescription: 'Cambia el título y el contenido de la sección. Abre details y recorre el resultado con el teclado.',
    challenge: ['Añade una segunda sección con su h2.', 'Incluye una lista de tres objetivos.', 'Comprueba el orden de encabezados y la interacción con details.'],
    solution: 'Debe quedar un h1 que identifica la página y dos secciones con h2. La lista utiliza ul y li. details se abre con su summary sin JavaScript. El tamaño de un título se cambia con CSS, no alterando su nivel semántico.',
    quiz: [
      ['¿Qué describe mejor a HTML?', ['Define estructura y significado.', 'Calcula la ubicación del dispositivo.', 'Ejecuta tareas en segundo plano.'], 0, 'HTML es un lenguaje de marcado. La geolocalización y los Workers son APIs que se utilizan con JavaScript.'],
      ['¿Cuándo elegirías article?', ['Para cualquier bloque con un borde.', 'Para una pieza de contenido con sentido autónomo.', 'Siempre que necesites dos columnas.'], 1, 'article expresa autonomía del contenido; los bordes y las columnas corresponden a la presentación.'],
      ['¿Qué ofrece un button nativo?', ['Una base de semántica e interacción con teclado.', 'El código del servidor.', 'Acceso automático a la ubicación.'], 0, 'El control nativo incorpora semántica, foco y activación. Su acción específica puede requerir JavaScript.']
    ]
  },
  {
    id: 'formularios', title: 'Formularios que orientan', short: 'Validación y controles', category: 'HTML EN ACCIÓN', icon: 'Aa', duration: '35–45 min', tags: ['input', 'Constraint Validation', 'UX'],
    intro: 'Un formulario útil explica qué necesita, ofrece controles adecuados y ayuda a corregir los errores. La validación del navegador es el primer nivel de ayuda.',
    objectives: ['Relacionar label con su control.', 'Aplicar required, min, max y step.', 'Interpretar validity sin confundir validación con seguridad.'],
    concepts: [
      ['Escoge el tipo de dato', 'email comprueba una forma de dirección, no que la cuenta exista. date usa un valor normalizado de fecha, aunque el control cambie con el navegador. number expresa cantidades; códigos postales y teléfonos suelen necesitar texto, no operaciones numéricas.'],
      ['Restricciones declarativas', 'required pide un valor; min y max acotan números o fechas; step define el incremento admisible. minlength y maxlength restringen la longitud del texto. El navegador expone estados como valueMissing, typeMismatch y rangeOverflow.'],
      ['Ayuda inmediata, validación completa', 'checkValidity() devuelve si las restricciones se cumplen y dispara invalid en los controles inválidos; reportValidity() también presenta ayuda al usuario. La validación del cliente se puede eludir: una aplicación real debe validar también en el servidor.']
    ],
    distinction: 'El control range existe por HTML. Mostrar al instante su valor dentro de output requiere escuchar el evento input con JavaScript. Un correo con formato válido no es una identidad verificada.',
    snippets: { HTML: '<form id="practica">\n  <label for="correo">Correo de prueba</label>\n  <input id="correo" name="correo" type="email" required>\n  <label for="horas">Horas de estudio</label>\n  <input id="horas" name="horas" type="number"\n         min="1" max="12" step="1" required>\n  <button>Comprobar</button>\n</form>\n<p id="resultado" role="status"></p>', JavaScript: 'const formulario = document.querySelector("#practica");\nformulario.addEventListener("submit", (evento) => {\n  evento.preventDefault(); // Práctica local: no se envía.\n  // El navegador comprueba antes del evento submit.\n  const datos = new FormData(formulario);\n  document.querySelector("#resultado").textContent =\n    `Práctica válida: ${datos.get("horas")} horas.`;\n});' },
    snippetNote: 'Prueba valores inventados. La práctica muestra un resumen local y no realiza ninguna petición.',
    mistakes: ['Usar placeholder como único nombre del campo.', 'Insertar entradas del usuario mediante innerHTML.', 'Considerar la validación del navegador una protección del servidor.'],
    reflection: '¿Por qué una dirección como persona@example.com puede superar type="email" sin demostrar que existe?',
    references: [['Validación de restricciones · MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Constraint_validation'], ['Elemento input · MDN', 'https://developer.mozilla.org/es/docs/Web/HTML/Reference/Elements/input']],
    labTitle: 'Un formulario con un inspector visible', labDescription: 'Provoca errores a propósito. Observa cómo cambian las restricciones antes de enviar la práctica.',
    challenge: ['Introduce un correo sin arroba y 13 horas; intenta validar.', 'Corrige el correo, prueba 2,5 horas y observa stepMismatch.', 'Completa los campos pendientes y genera un resumen válido.'],
    solution: 'El correo mal formado produce typeMismatch; 13 supera max y produce rangeOverflow; 2,5 no encaja en step="1" y produce stepMismatch. Una ficha válida usa correo con formato admisible, horas enteras de 1 a 12, fecha, alias de 2 a 24 caracteres y la casilla marcada.',
    quiz: [
      ['¿Qué garantiza type="email"?', ['Que la cuenta pertenece al estudiante.', 'Que el valor satisface el formato admitido por el control.', 'Que el mensaje se entregará.'], 1, 'El tipo email valida sintaxis, no existencia, propiedad ni entrega.'],
      ['Con min="1", max="12" y step="1", ¿qué ocurre con 2.5?', ['Se acepta siempre.', 'Se convierte automáticamente en 3.', 'No cumple el incremento permitido.'], 2, 'El valor produce stepMismatch porque no encaja en los pasos enteros a partir del mínimo.'],
      ['En una aplicación real, ¿dónde deben validarse los datos?', ['Solo en el navegador.', 'También en el servidor.', 'Solo con CSS.'], 1, 'La validación de cliente mejora la experiencia; el servidor debe validar lo que recibe.']
    ]
  },
  {
    id: 'canvas', title: 'Dibujar sobre píxeles', short: 'Canvas e interacción', category: 'GRÁFICOS', icon: '↗', duration: '35–45 min', tags: ['canvas', 'Pointer Events', 'requestAnimationFrame'],
    intro: 'Canvas es una superficie de dibujo. Comprende la relación entre tamaño visual, coordenadas y resolución antes de trazar o animar.',
    objectives: ['Diferenciar el elemento canvas de su API 2D.', 'Convertir coordenadas del puntero al lienzo.', 'Iniciar y detener una animación de manera controlada.'],
    concepts: [
      ['Un mapa de píxeles', 'canvas no convierte cada trazo en un elemento del DOM. getContext("2d") devuelve el contexto de dibujo. Debes proporcionar alternativas textuales o controles accesibles para explicar y operar el contenido. SVG es otra opción cuando necesitas objetos vectoriales con estructura.'],
      ['Dos tamaños y una escala', 'width y height definen el mapa de bits; CSS define el tamaño mostrado. Si difieren, el dibujo se escala. En pantallas de alta densidad se puede ajustar el mapa de bits según devicePixelRatio y transformar el contexto para dibujar con unidades CSS. Cambiar width o height borra el lienzo y reinicia su estado.'],
      ['Eventos y fotogramas', 'Pointer Events unifica ratón, lápiz y tacto. getBoundingClientRect() permite transformar clientX/clientY a coordenadas locales. requestAnimationFrame() pide un próximo fotograma; no es un bucle automático. Guarda su identificador y usa cancelAnimationFrame() para detenerlo.']
    ],
    distinction: 'canvas aporta el elemento; la API Canvas 2D dibuja; Pointer Events recibe la interacción; requestAnimationFrame coordina la actualización con el navegador.',
    snippets: { HTML: '<canvas id="lienzo" width="800" height="300"\n        aria-label="Ejemplo: un rectángulo violeta">\n  Ejemplo de dibujo: un rectángulo violeta.\n</canvas>\n<button id="dibujar">Dibujar ejemplo</button>', JavaScript: 'const lienzo = document.querySelector("#lienzo");\nconst ctx = lienzo.getContext("2d");\ndocument.querySelector("#dibujar").addEventListener("click", () => {\n  if (!ctx) return;\n  ctx.clearRect(0, 0, lienzo.width, lienzo.height);\n  ctx.fillStyle = "#6658d3";\n  ctx.fillRect(60, 50, 200, 100);\n});\n// Sin transformar el contexto, una coordenada X sería:\n// (evento.clientX - rect.left) * lienzo.width / rect.width' },
    snippetNote: 'El laboratorio ajusta la resolución a la pantalla y conserva los trazos como datos para redibujarlos al cambiar de tamaño.',
    mistakes: ['Usar coordenadas de la ventana sin restar la posición del lienzo.', 'Cambiar width en cada fotograma y perder todo el contenido.', 'Crear varios bucles de animación o dejar uno activo al salir.'],
    reflection: '¿Por qué duplicar el ancho CSS de un canvas puede hacer que el dibujo se vea borroso?',
    references: [['Canvas API · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API'], ['Pointer Events · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Using_Pointer_Events']],
    labTitle: 'Un lienzo que responde a diferentes entradas', labDescription: 'Dibuja con el puntero, usa flechas y espacio o carga el ejemplo. La animación es opcional y dispone de pausa.',
    challenge: ['Dibuja con dos colores y dos grosores.', 'Usa el teclado para mover el cursor y marcar un punto.', 'Inicia y detén la animación; cambia de unidad y comprueba que se detiene.'],
    solution: 'Los trazos deben seguir al puntero, incluso tras redimensionar. El teclado y el botón de ejemplo ofrecen otras formas de interacción. Solo existe una animación activa; se cancela al pausar, ocultar la pestaña o abandonar la práctica.',
    quiz: [
      ['¿Qué hace getContext("2d")?', ['Crea una etiqueta SVG.', 'Obtiene el contexto para dibujar en dos dimensiones.', 'Descarga una imagen.'], 1, 'El contexto 2D ofrece métodos como fillRect, lineTo o clearRect.'],
      ['¿Qué sucede al asignar canvas.width?', ['Solo cambia CSS.', 'Se conservan siempre los píxeles.', 'Se reinicia el mapa de bits y el estado del contexto.'], 2, 'Redimensionar el mapa de bits borra el dibujo; conserva los datos necesarios para reconstruirlo.'],
      ['¿Cómo detienes una petición de animación pendiente?', ['Con cancelAnimationFrame(id).', 'Ocultando cualquier botón.', 'Con stopCanvas().'], 0, 'Guarda el identificador devuelto por requestAnimationFrame y cancélalo explícitamente.']
    ]
  },
  {
    id: 'geolocalizacion', title: 'De las coordenadas al mapa', short: 'Geolocalización y Google Maps', category: 'APIs DEL DISPOSITIVO', icon: '◎', duration: '30–40 min', tags: ['Permisos', 'Latitud / longitud', 'Google Maps'],
    intro: 'Obtener una posición y representarla en un mapa son dos tareas diferentes. Aquí practicarás ambas, empezando por coordenadas públicas de ejemplo.',
    objectives: ['Interpretar latitud, longitud y precisión.', 'Gestionar permiso y errores de geolocalización.', 'Crear un enlace oficial a Google Maps sin clave API.'],
    concepts: [
      ['¿De dónde sale la posición?', 'navigator.geolocation solicita la posición al navegador, que se apoya en los servicios del dispositivo y del sistema. Estos pueden combinar GNSS/GPS, redes Wi-Fi y otras señales. La página no calcula por sí misma la posición ni conoce necesariamente qué fuente se utilizó.'],
      ['Coordenadas y una estimación', 'La latitud va de −90 a 90 grados; la longitud, de −180 a 180. En el orden latitud,longitud, los valores negativos indican sur y oeste. coords.accuracy expresa una estimación de precisión horizontal en metros, con un nivel de confianza del 95 % según la especificación; no una localización exacta garantizada.'],
      ['Permiso primero, mapa después', 'getCurrentPosition necesita un contexto seguro y permiso; también puede fallar por indisponibilidad o tiempo de espera. El navegador puede recurrir a servicios de ubicación en red. El enlace de Google Maps representa las coordenadas elegidas: al abrirlo, se envían a Google. Maps URLs no requiere clave API.']
    ],
    distinction: 'Geolocation API obtiene la estimación de posición. Google Maps muestra una ubicación. Abrir un mapa no demuestra que esa posición proceda del dispositivo: también puede ser un ejemplo fijo.',
    snippets: { HTML: '<button id="ubicar">Solicitar ubicación</button>\n<p id="estado" role="status"></p>\n<a id="mapa" hidden target="_blank"\n   rel="noopener noreferrer">Ver en Google Maps</a>', JavaScript: 'const estado = document.querySelector("#estado");\nconst mapa = document.querySelector("#mapa");\ndocument.querySelector("#ubicar").addEventListener("click", () => {\n  if (!isSecureContext || !("geolocation" in navigator)) {\n    estado.textContent = "Geolocalización no disponible en este contexto.";\n    return;\n  }\n  navigator.geolocation.getCurrentPosition(({ coords }) => {\n    const punto = `${coords.latitude},${coords.longitude}`;\n    mapa.href = "https://www.google.com/maps/search/?api=1&query="\n      + encodeURIComponent(punto);\n    mapa.hidden = false;\n    estado.textContent = `Precisión estimada: ${coords.accuracy} m.`;\n  }, (error) => {\n    const mensajes = { 1: "Permiso denegado", 2: "Posición no disponible",\n                       3: "Tiempo de espera agotado" };\n    estado.textContent = mensajes[error.code] || "No se pudo obtener la posición";\n  }, { timeout: 10000, maximumAge: 0, enableHighAccuracy: false });\n});' },
    snippetNote: 'El vínculo usa la interfaz oficial Maps URLs. La ubicación real es opcional. Para uso docente estable, sirve el material en HTTPS o localhost; el tratamiento de file:// depende del navegador.',
    mistakes: ['Confundir permiso denegado con falta de conexión.', 'Presentar las coordenadas como exactas.', 'Solicitar ubicación al cargar la página o guardarla sin necesidad.', 'Confundir enableHighAccuracy con una garantía de uso de GPS.'],
    reflection: '¿Puedes enseñar el funcionamiento de un mapa sin pedir la ubicación real de ningún estudiante?',
    references: [['Geolocation API · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API'], ['Geolocation · W3C', 'https://www.w3.org/TR/geolocation/'], ['Maps URLs · Google', 'https://developers.google.com/maps/documentation/urls/get-started']],
    labTitle: 'Visualiza una posición en Google Maps', labDescription: 'Elige una ciudad de ejemplo y observa el enlace. Si lo deseas, solicita la ubicación del dispositivo; después decide si abres el mapa.',
    challenge: ['Selecciona dos ciudades y compara el signo de sus longitudes.', 'Abre una de las posiciones públicas en Google Maps.', 'Simula los tres errores y explica qué harías en cada caso.'],
    solution: 'Madrid y Sevilla tienen longitud oeste negativa; Barcelona, este positiva. El enlace cambia el parámetro query con latitud,longitud. Ante permiso denegado se respeta la decisión y se ofrece el ejemplo; ante indisponibilidad se revisan los servicios; ante timeout se puede reintentar. No es necesario usar datos personales.',
    quiz: [
      ['¿Quién proporciona las coordenadas solicitadas por la página?', ['El elemento HTML map.', 'El navegador mediante los servicios de ubicación disponibles.', 'Siempre un cálculo escrito en HTML.'], 1, 'La API delega en el navegador y en los servicios de ubicación del dispositivo.'],
      ['¿Qué representa accuracy?', ['Un zoom de Google Maps.', 'La distancia hasta Madrid.', 'Una estimación de precisión horizontal en metros.'], 2, 'Es una estimación de la precisión de la posición, no una certeza absoluta.'],
      ['¿Cuándo envía esta práctica las coordenadas a Google Maps?', ['Al abrir explícitamente el enlace del mapa.', 'Al escribir el título de la página.', 'Cada segundo aunque no uses el mapa.'], 0, 'La aplicación no incrusta ni carga Maps automáticamente. Abrir su enlace comunica la consulta a Google. El proveedor de ubicación del navegador es un servicio distinto.']
    ]
  },
  {
    id: 'multimedia', title: 'Multimedia con alternativas', short: 'Audio, vídeo y subtítulos', category: 'CONTENIDO RICO', icon: '▷', duration: '25–35 min', tags: ['video / audio', 'track', 'Accesibilidad'],
    intro: 'Los controles nativos ofrecen reproducción sin construir un reproductor desde cero. El contenido debe seguir siendo comprensible cuando no se ve o no se oye.',
    objectives: ['Usar controles nativos y recursos locales.', 'Relacionar track con un archivo WebVTT.', 'Tratar play() como una operación que puede fallar.'],
    concepts: [
      ['El navegador ya incluye un reproductor', 'audio y video aceptan controls, preload y otras opciones. source permite proponer recursos con su tipo MIME. La compatibilidad depende del contenedor y del códec; la extensión por sí sola no garantiza reproducción. preload es una indicación, no una orden de descarga.'],
      ['Alternativas equivalentes', 'track enlaza pistas temporizadas como subtítulos en formato WebVTT. Una transcripción facilita estudiar el contenido fuera del tiempo de reproducción. Para información visual relevante también se necesita una descripción apropiada. Este vídeo es silencioso y dispone de una descripción completa.'],
      ['Control programado responsable', 'play() devuelve una promesa que puede rechazarse por políticas de reproducción o problemas del recurso. pause() detiene la reproducción; currentTime y playbackRate permiten observar o modificarla. Iniciar tras una acción del usuario es preferible a depender del autoplay.']
    ],
    distinction: 'controls crea los controles nativos por HTML. Un botón externo que llama a play() usa JavaScript y la API HTMLMediaElement. Escribir una transcripción no activa por sí mismo una pista de subtítulos.',
    snippets: { HTML: '<video controls preload="metadata" playsinline>\n  <source src="assets/tres-capas.webm" type="video/webm">\n  <track kind="captions" src="assets/subtitulos.vtt"\n         srclang="es" label="Español" default>\n  Tu navegador no puede mostrar este vídeo.\n</video>\n<p>Descripción: HTML estructura; CSS presenta;\n   JavaScript y las APIs aportan comportamiento.</p>', JavaScript: 'const video = document.querySelector("video");\nasync function reproducir() {\n  try {\n    await video.play();\n  } catch (error) {\n    // Mostrar una alternativa y un mensaje comprensible.\n    document.querySelector("#estado").textContent =\n      "No se pudo reproducir. Usa los controles o la descripción.";\n  }\n}\n// Enlaza la función al clic de un botón.' },
    snippetNote: 'Los medios del laboratorio son originales y locales. Algunos navegadores restringen pistas VTT desde file://; en localhost o HTTPS se sirven con su MIME correcto.',
    mistakes: ['Confiar en autoplay con sonido.', 'Confundir subtítulos con una transcripción completa.', 'Usar únicamente un servicio externo para una práctica que debe funcionar sin conexión.'],
    reflection: '¿Puede estudiar esta explicación alguien que ha desactivado el sonido o no puede ver el vídeo?',
    references: [['Elemento video · MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video'], ['WebVTT · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/WebVTT_API']],
    labTitle: 'Tres capas, tres formas de acceder al contenido', labDescription: 'Reproduce un clip local, cambia su velocidad y compara la pista de texto con la descripción. El audio contiene tres notas, no locución.',
    challenge: ['Reproduce y pausa el vídeo desde ambos tipos de controles.', 'Activa los subtítulos si tu navegador los ofrece.', 'Consulta la descripción y escucha las tres notas del audio.'],
    solution: 'El vídeo explica las mismas tres capas que la descripción textual. La pista temporizada sigue cada parte del clip; la descripción permanece disponible. El audio contiene tres notas ascendentes y no aporta información necesaria que falte en el texto.',
    quiz: [
      ['¿Qué activa controls?', ['Una descarga obligatoria.', 'Los controles nativos del reproductor.', 'La cámara del dispositivo.'], 1, 'controls solicita la interfaz de reproducción del navegador.'],
      ['¿Qué formato usa esta pista track?', ['WebVTT.', 'JSON obligatorio.', 'Una imagen PNG.'], 0, 'WebVTT almacena texto con tiempos de inicio y fin.'],
      ['¿Por qué hay que atender el rechazo de play()?', ['Porque siempre descarga JavaScript.', 'Porque todos los vídeos están dañados.', 'Porque la reproducción puede ser bloqueada o fallar.'], 2, 'La promesa permite reaccionar ante políticas del navegador, formatos incompatibles o errores del recurso.']
    ]
  },
  {
    id: 'storage', title: 'Guardar sin perder el control', short: 'Almacenamiento web', category: 'ESTADO LOCAL', icon: '▣', duration: '30–40 min', tags: ['localStorage', 'sessionStorage', 'Origen'],
    intro: 'Guardar un dato implica decidir qué conservar, cuánto tiempo y con qué ámbito. Esta práctica usa preferencias de estudio y claves identificables.',
    objectives: ['Distinguir la vida de localStorage y sessionStorage.', 'Guardar y recuperar cadenas con claves propias.', 'Gestionar restricciones y borrado selectivo.'],
    concepts: [
      ['Mismo origen, distinto ciclo de vida', 'localStorage pertenece al origen y puede conservarse entre sesiones. sessionStorage se separa por origen y sesión de pestaña; sobrevive a recargas. Al cerrar la sesión de pestaña normalmente termina, aunque la restauración de sesiones puede recuperarla. Ninguno sustituye a una base de datos compartida.'],
      ['Un almacén de cadenas', 'setItem(clave, valor), getItem(clave) y removeItem(clave) trabajan con cadenas. Para objetos se utiliza JSON.stringify y JSON.parse, validando lo recuperado. El usuario, las cuotas o las políticas de privacidad pueden impedir el acceso: utiliza try/catch.'],
      ['Borrar solo lo que te pertenece', 'clear() elimina todas las claves del almacén de ese origen, incluidas las de otras prácticas. Esta unidad borra únicamente su clave. No guardes contraseñas, ubicación o información sensible como si este almacenamiento fuera secreto. En file:// su comportamiento no está definido de forma uniforme.']
    ],
    distinction: 'Persistente no significa permanente. El usuario, el navegador o la navegación privada pueden eliminar o limitar los datos. sessionStorage tampoco se limita a la duración de una carga de página.',
    snippets: { HTML: '<label for="tema">Tema que quiero repasar</label>\n<select id="tema">\n  <option value="semantica">Semántica</option>\n  <option value="formularios">Formularios</option>\n</select>\n<button id="guardar">Guardar preferencia</button>\n<p id="estado" role="status"></p>', JavaScript: 'const clave = "mi-curso:tema";\ndocument.querySelector("#guardar").addEventListener("click", () => {\n  try {\n    localStorage.setItem(clave, document.querySelector("#tema").value);\n    document.querySelector("#estado").textContent = "Guardado";\n  } catch (error) {\n    document.querySelector("#estado").textContent =\n      "Este navegador no permite guardar ahora.";\n  }\n});\n// Leer: localStorage.getItem(clave)\n// Borrar solo este dato: localStorage.removeItem(clave)' },
    snippetNote: 'La práctica distingue el dato guardado del valor que está seleccionado en pantalla. Pulsa «Leer» después de cambiar el selector para comprobarlo.',
    mistakes: ['Usar clear() para borrar una sola preferencia.', 'Esperar que un objeto se guarde sin serializarlo.', 'Suponer que el almacenamiento siempre está disponible.'],
    reflection: '¿Qué debería mostrar la aplicación si el navegador impide guardar la preferencia?',
    references: [['localStorage · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage'], ['sessionStorage · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage']],
    labTitle: 'Dos almacenes, dos decisiones', labDescription: 'Guarda una preferencia en cada almacén, cambia el selector y lee el dato. Recarga para comprobar que ambos sobreviven a la recarga.',
    challenge: ['Guarda «Semántica» en localStorage y «En progreso» en sessionStorage.', 'Cambia los selectores sin guardar y después pulsa Leer.', 'Borra únicamente la preferencia local y comprueba que la de sesión permanece.'],
    solution: 'Leer devuelve el último valor guardado, aunque el selector haya cambiado. Borrar una clave local no afecta al almacén de sesión ni al progreso del curso. Si falla el acceso, la aplicación informa del problema y no afirma que haya guardado.',
    quiz: [
      ['¿Qué tipo de valor almacena Web Storage directamente?', ['Cadenas de texto.', 'Elementos DOM vivos.', 'Archivos ejecutables.'], 0, 'Los valores se almacenan como cadenas; los objetos requieren serialización.'],
      ['¿Qué suele ocurrir con sessionStorage al recargar la misma pestaña?', ['Se borra siempre.', 'Se conserva durante la sesión de esa pestaña.', 'Se comparte con todos los sitios.'], 1, 'La recarga no finaliza la sesión de pestaña.'],
      ['¿Cómo eliminas solo la preferencia del ejercicio?', ['Con clear().', 'Borrando el historial completo.', 'Con removeItem(claveDelEjercicio).'], 2, 'removeItem afecta solo a la clave indicada. clear puede borrar datos de otras actividades del mismo origen.']
    ]
  },
  {
    id: 'dragdrop', title: 'Mover también con el teclado', short: 'Arrastrar y soltar', category: 'INTERACCIÓN', icon: '⤨', duration: '30–40 min', tags: ['Drag and Drop', 'dataTransfer', 'Alternativas'],
    intro: 'Una interacción visual puede ser útil, pero debe ofrecer otras formas de completar la misma tarea. Clasifica conceptos arrastrando o usando controles nativos.',
    objectives: ['Reconocer dragstart, dragover y drop.', 'Transportar identificadores con dataTransfer.', 'Diseñar una alternativa accesible al arrastre.'],
    concepts: [
      ['Una secuencia de eventos', 'draggable="true" hace arrastrable un elemento. dragstart prepara los datos; el destino cancela dragover con preventDefault para admitir la operación; drop procesa lo recibido. Estas acciones utilizan la API de arrastrar y soltar.'],
      ['Datos, no confianza automática', 'dataTransfer transporta datos en formatos identificados. En esta práctica viaja un identificador de tarjeta, no HTML. El destino solo admite identificadores conocidos y zonas válidas. No insertes sin comprobar texto o marcado recibido del exterior.'],
      ['La misma tarea por otra vía', 'Arrastrar puede resultar difícil con teclado, lectores de pantalla o ciertos dispositivos táctiles. Cada tarjeta ofrece un selector de destino y un botón Mover. Ambos caminos actualizan el mismo estado y anuncian el resultado.']
    ],
    distinction: 'draggable no implementa por sí solo una clasificación completa ni la hace accesible. El comportamiento depende de eventos, datos validados y una alternativa operable.',
    snippets: { HTML: '<div id="tarjeta-html" draggable="true">button</div>\n<section id="destino" aria-label="HTML">\n  <h2>HTML</h2>\n</section>\n<!-- Añade también controles para mover con teclado. -->', JavaScript: 'const tarjeta = document.querySelector("#tarjeta-html");\nconst destino = document.querySelector("#destino");\ntarjeta.addEventListener("dragstart", (e) => {\n  e.dataTransfer.setData("text/plain", tarjeta.id);\n});\ndestino.addEventListener("dragover", (e) => e.preventDefault());\ndestino.addEventListener("drop", (e) => {\n  e.preventDefault();\n  const id = e.dataTransfer.getData("text/plain");\n  if (id === "tarjeta-html") destino.append(tarjeta);\n});' },
    snippetNote: 'El ejemplo muestra la secuencia mínima. El laboratorio añade validación de identificadores, anuncios y controles alternativos.',
    mistakes: ['Olvidar preventDefault en dragover.', 'Insertar directamente como HTML los datos recibidos.', 'Ofrecer arrastre como única forma de completar una actividad.'],
    reflection: '¿Cómo realizarías esta clasificación si no pudieras mantener pulsado el ratón?',
    references: [['HTML Drag and Drop API · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API'], ['Drag and drop · WHATWG', 'https://html.spec.whatwg.org/multipage/dnd.html']],
    labTitle: 'Clasifica las piezas de una web', labDescription: 'Sitúa cada tarjeta en HTML, CSS o JavaScript + API. Puedes arrastrar o elegir un destino y pulsar Mover.',
    challenge: ['Clasifica las seis tarjetas sin utilizar el arrastre.', 'Comprueba el resultado y corrige los errores.', 'Restablece y prueba una tarjeta mediante arrastre, si tu dispositivo lo permite.'],
    solution: 'HTML: button y required. CSS: display: grid y color. JavaScript + API: getCurrentPosition() y localStorage.setItem(). required es un atributo HTML; setItem es un método de una API, llamado con JavaScript.',
    quiz: [
      ['¿Qué almacena dataTransfer en esta práctica?', ['Una contraseña.', 'Un identificador de tarjeta conocido.', 'La página completa.'], 1, 'El identificador se valida antes de mover la tarjeta.'],
      ['¿Para qué se cancela dragover con preventDefault?', ['Para indicar que el destino admite soltar.', 'Para borrar todas las tarjetas.', 'Para cerrar el navegador.'], 0, 'El destino necesita admitir la operación de soltar.'],
      ['¿Qué mejora la accesibilidad de la actividad?', ['Ocultar el foco.', 'Exigir un ratón.', 'Ofrecer selector de destino y botón Mover.'], 2, 'La alternativa permite completar la misma tarea mediante controles nativos.']
    ]
  },
  {
    id: 'workers', title: 'Calcular sin bloquear la interfaz', short: 'Web Workers', category: 'CONCURRENCIA', icon: '⟳', duration: '35–45 min', tags: ['Worker', 'postMessage', 'Cancelación'],
    intro: 'Una tarea intensiva puede impedir que la interfaz responda si ocupa el hilo principal. Un Worker permite ejecutar trabajo en otro contexto y comunicarse por mensajes.',
    objectives: ['Explicar la separación entre Worker e interfaz.', 'Intercambiar progreso y resultados mediante mensajes.', 'Cancelar una tarea y liberar sus recursos.'],
    concepts: [
      ['Otro contexto de ejecución', 'Un Dedicated Worker ejecuta JavaScript fuera del hilo principal. No accede directamente al DOM: no puede usar document.querySelector para cambiar un botón. No garantiza que toda tarea termine antes; su ventaja es separar el cálculo de la respuesta de la interfaz.'],
      ['Comunicación explícita', 'postMessage envía mensajes y el evento message recibe data. Los datos normalmente se copian mediante el algoritmo de clonación estructurada; algunos objetos se pueden transferir. La interfaz presenta el progreso y el resultado que comunica el Worker.'],
      ['Un ciclo de vida controlado', 'Crear, iniciar, informar, terminar y liberar. terminate() detiene el Worker desde la página. Si se utiliza un Blob con código propio, revoca su URL al finalizar. Atiende errores y evita iniciar varias tareas cuando solo necesitas una. El código de esta práctica es fijo y no ejecuta entradas del estudiante.']
    ],
    distinction: 'Un Worker no es una etiqueta HTML ni un temporizador. Ejecuta JavaScript en otro contexto; el hilo principal sigue siendo responsable de la interfaz.',
    snippets: { HTML: '<button id="iniciar">Calcular</button>\n<button id="cancelar">Cancelar</button>\n<output id="resultado"></output>\n<!-- app.js y worker.js son archivos separados en este ejemplo. -->', JavaScript: '// worker.js\nself.onmessage = ({ data: limite }) => {\n  let suma = 0;\n  for (let i = 1; i <= limite; i++) suma += Math.sqrt(i);\n  self.postMessage(suma);\n};\n\n// app.js (servido desde el mismo origen)\nlet worker;\ndocument.querySelector("#iniciar").onclick = () => {\n  if (worker) worker.terminate();\n  worker = new Worker("worker.js");\n  worker.onmessage = ({ data }) => {\n    document.querySelector("#resultado").textContent = data;\n    worker.terminate();\n    worker = null;\n  };\n  worker.onerror = () => {\n    document.querySelector("#resultado").textContent = "Error de cálculo";\n    worker.terminate(); worker = null;\n  };\n  worker.postMessage(1000000);\n};\ndocument.querySelector("#cancelar").onclick = () => {\n  worker?.terminate(); worker = null;\n};' },
    snippetNote: 'El ejemplo didáctico separa dos archivos. Para facilitar el uso local, este laboratorio crea el Worker desde un Blob con código fijo y añade progreso y limpieza de recursos.',
    mistakes: ['Intentar modificar el DOM dentro del Worker.', 'Confundir concurrencia con una mejora garantizada de tiempo.', 'No cancelar tareas ni liberar URLs de Blob.'],
    reflection: '¿Qué puede seguir haciendo la interfaz mientras otra parte calcula millones de raíces cuadradas?',
    references: [['Uso de Web Workers · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers'], ['Worker.terminate · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Worker/terminate']],
    labTitle: 'Un cálculo y una interfaz independiente', labDescription: 'Calcula una suma de raíces cuadradas y pulsa el contador durante la tarea. El tiempo depende del equipo y no es una comparación de rendimiento entre navegadores.',
    challenge: ['Inicia el cálculo y usa el contador de la interfaz.', 'Prueba la carga mayor y cancela antes de terminar, si da tiempo.', 'Reinicia y espera el resultado. Observa el progreso.'],
    solution: 'El contador pertenece al hilo principal y continúa respondiendo. El Worker calcula y envía mensajes. Cancelar termina la tarea; no produce un resultado completo. En equipos rápidos puede finalizar antes de pulsar Cancelar: eso no indica un error.',
    quiz: [
      ['¿Puede un Dedicated Worker modificar el DOM directamente?', ['Sí, con document siempre disponible.', 'No; debe comunicar el resultado a la página.', 'Solo si el botón es azul.'], 1, 'La página recibe el mensaje y actualiza el DOM desde el hilo principal.'],
      ['¿Cómo se intercambian datos con el Worker?', ['Con postMessage y eventos message.', 'Con una etiqueta worker.', 'Reescribiendo todo el HTML.'], 0, 'La comunicación se hace mediante mensajes.'],
      ['¿Qué hace terminate()?', ['Guarda automáticamente el resultado.', 'Acelera el cálculo.', 'Detiene el Worker.'], 2, 'La terminación detiene la tarea; la página debe actualizar su estado y liberar los recursos asociados.']
    ]
  },
  {
    id: 'interaccion', title: 'Interacción nativa, menos código', short: 'Details, dialog y popover', category: 'HTML ACTUAL', icon: '⋯', duration: '25–35 min', tags: ['details', 'dialog', 'popover'],
    intro: 'Los elementos y atributos nativos resuelven patrones habituales de interacción. Elige entre contenido desplegable, un diálogo modal y un panel no modal.',
    objectives: ['Distinguir details, dialog y popover.', 'Probar cierre, foco y teclado.', 'Detectar soporte y ofrecer una alternativa.'],
    concepts: [
      ['details: una revelación en el flujo', 'details agrupa contenido que se puede desplegar mediante summary. El atributo open refleja el estado abierto. No necesita JavaScript para su interacción básica y mantiene el contenido en el flujo del documento.'],
      ['dialog: una tarea en primer plano', 'showModal() abre un dialog modal en la capa superior y hace inerte el resto del documento mientras permanece abierto. Un formulario method="dialog" permite cerrarlo. Proporciona un nombre accesible, un cierre visible y un destino de foco apropiado; comprueba Escape y la vuelta del foco.'],
      ['popover: información no modal', 'popover es un atributo global, no una etiqueta. Un botón con popovertarget puede alternar un panel sin JavaScript propio. El modo auto permite cierre ligero, como un clic exterior o Escape. No vuelve inerte el resto de la página. Detecta soporte para conservar una alternativa en navegadores antiguos.']
    ],
    distinction: 'Un popover no equivale a un diálogo modal. Para una breve ayuda usa un panel; para una decisión que requiere atención exclusiva, considera un diálogo y diseña cuidadosamente el foco.',
    snippets: { HTML: '<details>\n  <summary>Ver una pista</summary>\n  <p>Primero identifica el tipo de interacción.</p>\n</details>\n\n<button popovertarget="ayuda">Ayuda contextual</button>\n<div id="ayuda" popover>\n  Soy un panel no modal.\n  <button popovertarget="ayuda" popovertargetaction="hide">Cerrar</button>\n</div>\n\n<button id="abrir">Abrir diálogo</button>\n<dialog id="dialogo" aria-labelledby="titulo">\n  <h2 id="titulo">Revisa tu práctica</h2>\n  <form method="dialog"><button>Entendido</button></form>\n</dialog>', JavaScript: 'const dialogo = document.querySelector("#dialogo");\ndocument.querySelector("#abrir").addEventListener("click", () => {\n  if (typeof dialogo.showModal === "function") dialogo.showModal();\n  else document.querySelector("#alternativa").hidden = false;\n});\n// Detección de popover:\nconst admitePopover = "showPopover" in HTMLElement.prototype;\n// Si no existe, muestra la ayuda como contenido normal.' },
    snippetNote: 'El ejemplo JavaScript presupone un bloque #alternativa para navegadores sin dialog. El laboratorio incorpora esa alternativa y comprueba popover antes de usarlo.',
    mistakes: ['Inventar un elemento <popover>.', 'Usar un panel no modal como si bloqueara el resto de la página.', 'Ocultar el cierre o ignorar dónde queda el foco.'],
    reflection: '¿Cuál de estos tres patrones usarías para una pista opcional que no interrumpa la lectura?',
    references: [['dialog · MDN', 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog'], ['Popover API · MDN', 'https://developer.mozilla.org/en-US/docs/Web/API/Popover_API'], ['Popover · WHATWG', 'https://html.spec.whatwg.org/multipage/popover.html']],
    labTitle: 'Compara tres patrones de interacción', labDescription: 'Prueba los controles con teclado. Observa dónde aparece el contenido y si puedes interactuar con el resto de la página.',
    challenge: ['Abre details con el teclado y observa el flujo de la página.', 'Abre el diálogo y ciérralo con Escape o el botón.', 'Abre el popover, pulsa fuera y compara su comportamiento con el diálogo.'],
    solution: 'details despliega contenido en el flujo. showModal abre una interacción modal con el resto del documento inerte. El popover auto flota sin bloquear la página y permite cierre ligero. El foco del diálogo debe volver al control que lo abrió.',
    quiz: [
      ['¿Qué es popover en HTML?', ['Una etiqueta obligatoria dentro de head.', 'Un atributo global.', 'Una librería externa obligatoria.'], 1, 'Se aplica a un elemento existente, por ejemplo un div.'],
      ['¿Qué caracteriza a showModal()?', ['Abre un diálogo modal y deja inerte el resto del documento.', 'Siempre abre otra pestaña.', 'Solo cambia el color de fondo.'], 0, 'La modalidad cambia la interacción disponible y exige cuidar el foco.'],
      ['¿Qué funciona básicamente sin JavaScript propio?', ['Un cálculo en Worker.', 'Obtener ubicación real.', 'details con summary.'], 2, 'El navegador implementa el despliegue nativo de details.']
    ]
  }
];
window.AdvancedGlossary = [
  ['API', 'Interfaz que ofrece operaciones y datos a un programa. Las APIs web permiten interactuar con capacidades del navegador.'],
  ['Contexto seguro', 'Entorno que el navegador considera confiable, normalmente HTTPS y ciertos orígenes locales como localhost. Algunas APIs lo exigen.'],
  ['DOM', 'Representación del documento como objetos que JavaScript puede consultar y modificar.'],
  ['Evento', 'Notificación de algo que ha sucedido, como un clic, una entrada o un mensaje recibido.'],
  ['Foco', 'Elemento que recibe la interacción del teclado. Debe ser perceptible y recorrer los controles con un orden lógico.'],
  ['Mejora progresiva', 'Partir de un contenido útil y añadir capacidades cuando el navegador las admite.'],
  ['Origen', 'Combinación de esquema, host y puerto. Delimita muchas operaciones de acceso y almacenamiento.'],
  ['Permiso', 'Autorización del usuario y del navegador para acceder a una capacidad. Puede denegarse o revocarse.'],
  ['Promesa', 'Objeto que representa el resultado futuro de una operación, que puede resolverse o rechazarse.'],
  ['Semántica', 'Significado que aporta el elemento a la estructura y función del contenido.'],
  ['WebVTT', 'Formato de texto con marcas temporales para subtítulos y otras pistas.'],
  ['Worker', 'Contexto de ejecución de JavaScript separado del hilo principal, comunicado mediante mensajes.']
];
