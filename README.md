# HTML LAB

Laboratorio de HTML para estudiantes de DAM y DAW. Diez sesiones, 106 fichas únicas (105 elementos y la declaración DOCTYPE), 19 comparaciones guiadas y un editor con vista previa aislada. Todo el contenido de la aplicación está en español.

## Ampliación del material

La carpeta `html-lab-avanzado` añade nueve unidades sobre HTML actual y APIs del navegador, con laboratorios, 27 preguntas razonadas y guía imprimible. Incluye geolocalización con Google Maps, Canvas, formularios, multimedia local, almacenamiento, arrastrar y soltar, Web Workers y elementos de interacción nativa. El menú del laboratorio incorpora un acceso a esta ampliación; ambos materiales conservan su recorrido propio. Consulta `html-lab-avanzado/README.md` para los requisitos de las APIs y el uso de ubicación opcional.

`HTML-LAB-COMPLETO.zip` reúne el laboratorio original y la ampliación. `HTML-LAB.zip` conserva el paquete de la edición anterior.

## Abrir la aplicación

Abre **index.html** con doble clic en un navegador moderno. Mantén a su lado las carpetas `css`, `js` y `assets`. Si utilizas el ZIP, extrae primero todo su contenido.

No necesitas conexión, instalación, servidor, cuentas, paquetes ni compilación. La aplicación utiliza exclusivamente HTML, CSS y JavaScript nativo. Los enlaces de referencia son opcionales y sí necesitan Internet.

## Archivos

```text
index.html                 Interfaz y demostraciones nativas
css/
  styles.css               Presentación, temas y adaptación a pantallas
js/
  content.js               Catálogo centralizado, ejemplos y relaciones
  app.js                   Navegación, progreso, editor y aislamiento
assets/
  cuaderno.png             Ilustración local para los ejemplos
README.md                  Instrucciones, cobertura y límites
checks/
  check.html               Página opcional de comprobaciones
  check.js                 Pruebas de integración del navegador
  resultados.txt           Resultado de las pruebas ejecutadas
  vista-escritorio.png      Captura de la aplicación en funcionamiento
```

`content.js` se separa de `app.js` para poder revisar y ampliar las fichas sin mezclarlas con la lógica. También contiene una copia de la imagen como datos PNG: permite mostrarla dentro del iframe aislado sin permisos de lectura del sistema de archivos ni solicitudes de red. El PNG original permanece en `assets` para que los ejemplos copiados puedan usar su ruta local.

Los archivos de `checks` son opcionales. No participan en el funcionamiento de la aplicación. Los materiales originales del proyecto no se han modificado ni se incluyen en el ZIP.

## Uso

1. Elige una sesión en el menú y abre su guía inicial.
2. Selecciona una etiqueta y consulta su función, sintaxis, usos, ventajas, errores y accesibilidad.
3. Cambia el ejemplo HTML y pulsa **Ejecutar**. También puedes utilizar Ctrl+Intro o ⌘+Intro.
4. Alterna código y vista previa, copia el ejemplo, restablécelo o amplíalo.
5. Abre **Estructura resaltada** para localizar el elemento en contexto. En la sesión 2 verás una página semántica completa.
6. Marca la ficha como **Explorada** y consulta **No confundas estas etiquetas** para contrastar conceptos.

El buscador recorre todas las sesiones y tiene en cuenta nombre, descripción, categoría, conceptos, atributos y relaciones. No distingue mayúsculas ni tildes. Al abrir un resultado cambia a la sesión correspondiente.

El modo inicial sigue la preferencia del sistema. El botón de tema permite cambiarlo. El navegador guarda únicamente el tema elegido y los identificadores de fichas exploradas; si bloquea el almacenamiento local, la aplicación conserva el progreso mientras está abierta. Puedes restablecer el progreso desde **Ver cobertura y referencias**.

## Cobertura por sesión

| Sesión | Elementos y declaraciones |
| --- | --- |
| 1. Anatomía | `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, `<title>`, `<meta>`, `<link>`, `<script>`, `<style>` |
| 2. Estructura y semántica | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<div>`, `<address>` |
| 3. Texto | `<h1>`, `<h2>`, `<h3>`, `<h4>`, `<h5>`, `<h6>`, `<p>`, `<br>`, `<hr>`, `<strong>`, `<em>`, `<b>`, `<i>`, `<u>`, `<s>`, `<small>`, `<mark>`, `<sub>`, `<sup>`, `<blockquote>`, `<q>`, `<pre>`, `<code>`, `<abbr>`, `<cite>`, `<time>`, `<del>`, `<ins>`, `<dfn>`, `<kbd>`, `<samp>`, `<var>`, `<wbr>`, `<bdi>`, `<bdo>`, `<span>` |
| 4. Enlaces e imágenes | `<a>`, `<img>`, `<figure>`, `<figcaption>`, `<picture>`, `<source>` |
| 5. Listas | `<ul>`, `<ol>`, `<li>`, `<dl>`, `<dt>`, `<dd>`, `<menu>` |
| 6. Tablas | `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>`, `<colgroup>`, `<col>` |
| 7. Formularios | `<form>`, `<label>`, `<input>`, `<textarea>`, `<button>`, `<select>`, `<option>`, `<optgroup>`, `<fieldset>`, `<legend>`, `<datalist>`, `<output>`, `<progress>`, `<meter>` |
| 8. Multimedia | `<audio>`, `<video>`, `<source>`, `<track>`, `<iframe>`, `<embed>`, `<object>` |
| 9. Interacción | `<details>`, `<summary>`, `<dialog>`, `<button>`, `<noscript>` |
| 10. Casos especiales | `<ruby>`, `<rt>`, `<rp>`, `<data>`, `<template>` |

`source` y `button` se reutilizan en dos sesiones: hay 108 ubicaciones, pero 106 fichas únicas. La declaración DOCTYPE se identifica expresamente como declaración, no como elemento HTML.

La guía de la sesión 10 incluye **Etiquetas obsoletas o que debes evitar**: `font`, `center`, `marquee`, `big` y `strike`, con sus sustituciones. No se presentan como opciones recomendadas.

La categoría **No son etiquetas** explica atributos (`class`, `id`, `href`, `src`, `alt`, `style`, `title`), comentarios, selectores y propiedades CSS, JavaScript y entidades (`&amp;`, `&lt;`, `&copy;`). `placeholder` aparece además en su comparación específica con `label`. Las fichas correspondientes incluyen todos los atributos solicitados en el enunciado.

## Comparaciones

Las 19 comparaciones guiadas son: header/head/body; main/section/article/div; strong/b/em/i; a/button; p/br/div; header/body; main/div; article/section; div/span; strong/b; em/i; br/p; ol/ul; label/placeholder; th/td; head/header; article/div; nav/ul; footer/div.

También puedes elegir libremente dos fichas. Cada panel muestra finalidad, significado, aspecto predeterminado, criterio de elección, error frecuente, código y resultado. Las comparaciones de head/header/body incluyen su posición en un documento completo. Las de main/section/article/div utilizan el mismo contenido con distintas estructuras.

## Aislamiento y límites del laboratorio

- El texto del editor nunca se inserta mediante `innerHTML` en la aplicación. Un normalizador conservador reconstruye únicamente elementos y atributos permitidos y escapa los valores.
- Cada demostración usa `iframe` con `srcdoc`, `sandbox` vacío y una política CSP que bloquea scripts, red, recursos multimedia, objetos, subdocumentos y envíos. No se conceden permisos de scripts ni de mismo origen.
- Se eliminan manejadores de eventos, estilos editados, URLs libres y metadatos de navegación. Las anclas internas se conservan como `about:srcdoc#id`. Solo la imagen PNG incluida puede convertirse en un recurso de datos.
- Los formularios editables tienen el envío bloqueado. La demostración guiada de la sesión 7 usa validación HTML y cancela el envío; no guarda ni transmite valores. Usa siempre datos inventados al practicar.
- El editor está orientado a fragmentos sencillos de HTML. No es un validador completo del estándar ni un entorno para ejecutar CSS o JavaScript. El navegador puede reparar anidamientos erróneos del alumno.
- `script`, `style` y referencias a archivos se explican como sintaxis, pero no se ejecutan ni se cargan desde el editor. Las fichas que no generan contenido visible lo explican.
- `iframe`, `embed` y `object` editables no cargan documentos. La sesión 8 incluye una incrustación local controlada para observar un iframe real.
- No se incluyen grabaciones, vídeos, subtítulos o PDF de ejemplo. Las fichas multimedia explican esta ausencia y muestran la estructura y los controles. La imagen del cuaderno sí se incluye.
- El botón **Ampliar** abre un diálogo con otro iframe restringido; el ejemplo mantiene su aislamiento. La prueba modal de la sesión 9 usa JavaScript local, cierre visible y Escape.
- El portapapeles puede estar limitado al abrir archivos locales. En ese caso se utiliza una alternativa de copia o se selecciona el código para copiarlo con Ctrl+C/⌘+C.

## Pruebas realizadas

El 25 de octubre de 2026 se ejecutaron **41 comprobaciones automáticas, todas correctas**, en el navegador Chromium integrado. Se recorrieron las 108 ubicaciones de las fichas, se verificaron las 19 comparaciones, búsqueda, tema, progreso, editor, tablas, formularios, diálogos, cobertura y 12 entradas adversarias.

La adaptación se comprobó en marcos de 1440, 800 y 390 píxeles; los anchos de contenido observados, descontadas las barras de desplazamiento, fueron 1425, 785 y 375 píxeles. No hubo desbordamiento horizontal del documento en las diez sesiones. Se inspeccionó también la presentación de escritorio y móvil.

Se comprobaron manualmente la copia, un desplegable dentro del iframe, una ancla interna y el cierre con Escape con devolución del foco. La consola de la pestaña principal no mostraba errores al revisarla. El registro del servidor temporal no recibió ninguna petición al destino de prueba de seguridad.

La verificación utilizó una vista HTTP local temporal y restringida a los archivos de la aplicación. El navegador integrado no permite automatizar direcciones `file://`, por lo que **no se afirma haber probado directamente esa apertura**. La aplicación no usa módulos, `fetch`, APIs, fuentes remotas ni dependencias que exijan servidor. Su entrada de uso es `index.html` y el servidor de pruebas no forma parte de la entrega.

No se han realizado auditorías con lectores de pantalla ni pruebas en Safari, Firefox o todos los dispositivos. La página opcional `checks/check.html` requiere acceso al DOM de sus marcos; algunos navegadores restringen ese acceso bajo `file://`, lo que afecta a las comprobaciones, no a la aplicación.

El informe completo está en `checks/resultados.txt`.

## Referencias

- [HTML Living Standard · WHATWG](https://html.spec.whatwg.org/multipage/)
- [Semántica de texto · WHATWG](https://html.spec.whatwg.org/dev/text-level-semantics.html)
- [Metadatos del documento · WHATWG](https://html.spec.whatwg.org/multipage/semantics.html)
- [Referencia de elementos HTML · MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements)
- [El elemento header · MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/header)
- [Seguridad de srcdoc · MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement/srcdoc)
- [El elemento iframe · MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)

Estas referencias permiten ampliar el contenido; no se cargan para ejecutar HTML LAB.
