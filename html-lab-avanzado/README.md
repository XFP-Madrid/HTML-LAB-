# HTML LAB · Ampliación

Material de estudio para Lenguaje de Marcas en Formación Profesional. Continúa el laboratorio de etiquetas anterior con nueve unidades sobre HTML actual y APIs del navegador. Edición: octubre de 2026.

## Abrir el material

Descomprime el paquete completo y abre `index.html` en la carpeta `html-lab-avanzado`. El enlace lateral permite volver al laboratorio anterior. Conserva la estructura de carpetas para que funcionen ambos accesos.

La aplicación utiliza HTML, CSS y JavaScript locales, sin instalaciones, bibliotecas remotas ni pasos de compilación. El archivo `GUIA-DE-ESTUDIO.html` ofrece todo el contenido teórico, los ejemplos, las actividades, las respuestas razonadas y las fuentes sin necesitar JavaScript. Puede imprimirse o guardarse como PDF desde el navegador. El botón «Imprimir guía» de la aplicación prepara el mismo contenido completo.

La mayoría de las actividades funciona al abrir los archivos directamente. Para obtener un comportamiento consistente de las APIs, sirve el material mediante HTTPS o un servidor local en `localhost`/`127.0.0.1`. Si ya utilizas un servidor de aula o una extensión de servidor local en tu editor, abre desde él la carpeta completa. No se incluye ni se requiere un servidor para leer la guía.

## Recorrido docente

| Unidad | Contenido y actividad |
| --- | --- |
| 1. Las capas de la web | HTML Living Standard, semántica y accesibilidad. Editor HTML aislado. |
| 2. Validación y controles | Tipos de input, restricciones nativas, inspector de estados y resumen local. |
| 3. Canvas e interacción | Contexto 2D, resolución, Pointer Events, teclado y animación cancelable. |
| 4. Geolocalización y Google Maps | Coordenadas públicas, ubicación opcional, precisión y errores. |
| 5. Audio, vídeo y subtítulos | Controles nativos, reproducción programada, WebVTT y alternativas textuales. |
| 6. Almacenamiento web | localStorage, sessionStorage, lectura y borrado selectivo. |
| 7. Arrastrar y soltar | Clasificación mediante Drag and Drop o selector y botón. |
| 8. Web Workers | Cálculo real en otro contexto, mensajes, progreso y cancelación. |
| 9. Details, dialog y popover | Despliegue, modalidad, foco y compatibilidad. |

Cada unidad contiene tres conceptos explicados, objetivos, una distinción importante, ejemplos comentados, errores frecuentes, una pregunta de reflexión, un reto de tres pasos y tres preguntas de autoevaluación con explicación. El recorrido completo se estima en 4,5–6 horas, ajustable al grupo. Las marcas de progreso son una ayuda para estudiar; no constituyen una evaluación oficial.

Sugerencia para clase: pide una predicción antes de ejecutar cada práctica y una explicación después. En la actividad de ubicación utiliza primero ciudades de ejemplo; la posición personal no es necesaria para alcanzar los objetivos. Para evaluar, solicita evidencias del proceso y una justificación de las decisiones, además del resultado del cuestionario.

## Google Maps y ubicación

La aplicación utiliza el formato oficial `https://www.google.com/maps/search/?api=1&query=LATITUD%2CLONGITUD`. Este enlace no necesita clave API y abre la ubicación en Google Maps. El mapa no se incrusta ni se carga automáticamente; la ilustración de la ficha está identificada como tal.

El selector ofrece Madrid, Barcelona y Sevilla con coordenadas públicas aproximadas. La ubicación real se solicita únicamente al pulsar su botón, mediante `navigator.geolocation.getCurrentPosition`. Necesita un contexto seguro, disponibilidad del servicio y permiso del usuario o de la política del navegador. La aplicación muestra permiso denegado, posición no disponible y tiempo agotado, además de simulaciones para practicar sin cambiar permisos.

El navegador y los servicios del dispositivo obtienen la posición; el HTML no la calcula. Pueden intervenir GNSS/GPS, Wi-Fi y otras señales. La API no identifica necesariamente qué fuente se utilizó. El proveedor de ubicación del navegador puede usar servicios de red. La aplicación no guarda coordenadas. Al abrir explícitamente Google Maps se envían a Google las coordenadas que muestra el enlace.

Fuente de la integración: [Maps URLs, documentación oficial de Google](https://developers.google.com/maps/documentation/urls/get-started). Precisión y permisos: [Geolocation, W3C](https://www.w3.org/TR/geolocation/).

## Recursos locales y compatibilidad

- `assets/tres-capas.webm`: vídeo original silencioso de unos seis segundos. Presenta HTML, CSS y JavaScript + APIs. Dispone de descripción textual completa.
- `assets/subtitulos.vtt`: pista temporal en español. Algunos navegadores restringen la carga desde `file://`; sí puede servirse con MIME `text/vtt` desde un servidor local o HTTPS.
- `assets/tres-notas.wav`: audio original de tres segundos con tres notas ascendentes. Se describe en texto; no contiene voz.
- El soporte de vídeo depende del códec y el navegador. La lectura del contenido no depende de reproducirlo.
- Web Storage puede estar bloqueado o limitado, y su comportamiento con `file://` depende del navegador. Se informa del fallo sin afirmar que se haya guardado.
- El Worker utiliza un Blob con código fijo del laboratorio. Si las políticas del navegador lo impiden, se ofrece un mensaje y sigue disponible el ejemplo de código. No se ejecuta JavaScript escrito por estudiantes.
- `dialog` y `popover` se detectan antes de usar sus APIs; hay alternativas de lectura para navegadores sin soporte.
- Google Maps y las referencias externas necesitan Internet. El resto de los recursos está incluido. No hay analítica ni formularios con envío remoto.

## Datos y controles

El progreso, mejores puntuaciones, última unidad y tema visual se guardan en `lm-lab-extension:course:v1`. Si falla el almacenamiento, el estado se conserva en memoria durante la página actual y se avisa al usuario.

La práctica de almacenamiento utiliza únicamente `lm-lab-extension:demo:local` y `lm-lab-extension:demo:session`. Cada botón Eliminar borra su propia clave. Restablecer progreso afecta a las marcas y puntuaciones de esta ampliación. Nunca se utiliza `localStorage.clear()` ni `sessionStorage.clear()`.

Los datos ficticios del formulario y la ubicación no se persisten. El HTML editable se reconstruye con una lista limitada de elementos, sin scripts, estilos editados, recursos externos, eventos o envíos. El resultado se muestra en un iframe con sandbox opaco y una política CSP restrictiva. No es un editor general de JavaScript.

Canvas utiliza coordenadas normalizadas, resolución ajustada a la pantalla, entrada con puntero y alternativa de teclado. Respeta la preferencia de movimiento reducido. La animación se detiene al salir o al ocultar la pestaña. Un Worker se cancela al abandonar su práctica; se termina y se revoca su URL al finalizar o cancelar. Los reproductores se pausan al salir.

## Estructura para mantenimiento

- `index.html`: estructura de la interfaz y de las prácticas.
- `css/styles.css`: diseño adaptable, temas claro/oscuro e impresión.
- `js/course.js`: unidades, ejemplos, cuestionarios, soluciones y referencias.
- `js/app.js`: navegación, búsqueda, progreso, autoevaluación y guía imprimible.
- `js/labs.js`: comportamiento de las nueve prácticas.
- `GUIA-DE-ESTUDIO.html`: copia independiente de lectura e impresión. Al cambiar el contenido, actualiza también esta guía.
- `checks/`: evidencias y utilidades de verificación de desarrollo; no es necesario para usar el curso.

La interfaz ofrece navegación por teclado, foco visible, pestañas con flechas, controles nativos, estados anunciados y alternativa al arrastre. Esto no sustituye una auditoría de accesibilidad en todos los dispositivos y lectores de pantalla.

## Verificación realizada

Se ejecutaron 69 comprobaciones en el navegador de desarrollo sobre las nueve unidades: contenido, 27 respuestas correctas y respuestas erróneas, búsqueda, aislamiento del editor, restricciones del formulario, Canvas con teclado, cancelación de animación, almacenamiento selectivo, enlaces de Maps, errores y respuestas simuladas de Geolocation, clasificación accesible, ejecución/cancelación real de Worker, diálogo, popover, carga de vídeo/audio/VTT y ausencia de desbordamiento en vistas de 390, 800 y 1440 píxeles.

La geolocalización se verificó con un proveedor simulado de datos públicos; no se solicitó la ubicación real del dispositivo. No se afirma compatibilidad comprobada en todos los navegadores. El archivo de resultados y las capturas se conservan en `checks/` dentro del proyecto de trabajo.

Las fuentes de cada unidad enlazan WHATWG, W3C, MDN y Google. Los textos y medios de esta ampliación se han preparado para este material; no se ha copiado el contenido del sitio de referencia ni se ha modificado el HTML aportado como ejemplo.
