# Redacción: módulos 0 Fundamentos y 1 Maestros

Ficheros: `app/src/content/fundamentos.json` y `app/src/content/maestros.json`. No se ha cambiado ningún `id`, ni pasos, imágenes, hotspots, `pregunta`, opciones ni orden del test. JSON válido y `npm --prefix app run build` correcto.

## Fundamentos (prioridad alta)

### fundamentos-navegar
- `objetivo` pasa a un logro en futuro.
- `concepto`: primer párrafo con ERP (frase modelo), comparación y consecuencia. Explica {INI}, que S{INI} se crea más adelante y que se practica con las empresas de la demo. Cierra con «Dónde: «Finanzas › Maestros › Parametrización › Empresas»».
- Términos explicados en línea: pantalla, base de datos, menú, rejilla, registro, maestro, pestaña, campo obligatorio y botón de acción.
- `ruta` rellena en menú, rejilla, buscar registros y ficha. Pasos con la ruta literal con ›. Más `detalle` en cuatro pasos.
- Un problema nuevo: «no pone BBDD TUTORIAL».

### fundamentos-1
- `objetivo`: «Sabrás escribir el asiento de una compra con IVA…».
- `concepto`: contabilidad, asiento e IVA explicados con consecuencia. Caso continuo: 10 × 12,50 = 125,00 + 26,25 = 151,25. Línea «Dónde» (sin pantalla).
- Ejemplos pasan de 100/121 al caso: aportación de 3.000,00, margen 75,00, asiento de la compra (600 debe 125,00, 472 debe 26,25, 400 haber 151,25), IVA 42,00 − 26,25 = 15,75 (modelo 303).
- Plan contable: «PGE 2008» corregido a PGC (en el ERP, «PGE 2008»); cuentas del caso por grupo; aviso de que la demo lleva más dígitos y 47000 para el IVA repercutido.
- Test: la pregunta de la compra usa 125,00 y 151,25 (misma posición y misma `correcta`). Los «Compruébalo» y el resto del test siguen con otras cifras, indicado como «con otros números».
- Un problema nuevo (IVA al debe o al haber). `aprendido` y `checklist` con cifras del caso.

### fundamentos-2
- `objetivo` en futuro. `concepto` con consecuencia, contabilizar explicado y ejemplo del caso (151,25; venta de 242,00 con dos efectos de 121,00; banco 3.077,25).
- Corregido un fallo de contenido: ya no dice que solo la factura genera asiento; el albarán puede ir a una cuenta puente (40090) y la deuda nace con la factura. Pregunta 1 del test reformulada («crea la deuda con el proveedor»), mismas opciones.
- Documentos: oferta, albarán, stock y factura con frase modelo. Efecto: plazo, vencimiento y cartera, con P{INI} y los vencimientos 14-11 y 14-12. Contabilizar: plantilla contable y maestro. Banco: extracto N43; concilia con las seis líneas y 3.077,25. Cierre: regularización, apertura y 61,50.
- Mapa: tu empresa S{INI}, la demo en la empresa 0, T{INI}, C{INI} y BBVA_{INI}.
- Problemas: el del albarán corregido y uno nuevo (falta una cuenta al contabilizar).

## Maestros

### maestros-v-3 (media)
- `objetivo` con un solo logro. `concepto`: consecuencia en el primer párrafo; tercero, plan contable y PGC explicados; «ejercicios del curso» pasa a «bloques»; frase puente del caso (S{INI} se crea en el bloque siguiente, la demo graba en la empresa 0); línea «Dónde».
- Pasos sin `detalle` resueltos (vínculo y datos contables). Rutas con «» y ›. Tercero explicado, con aviso de que 0 y 00003 son de la demo y de que S{INI} se unirá a C{INI}. IVA explicado en línea.
- Dos problemas nuevos («No encuentro la pantalla», «No veo mi empresa S{INI}»). `aprendido` con el caso.

### maestros-v-4 (baja)
- Ruta con `>` cambiada a ›, en el paso y en el checklist.
- `concepto`: consecuencia, banco propio explicado, frase puente (S{INI}, empresa 0, BBVA_{INI}) y línea «Dónde».
- «Agrupación cuentas» explicada con tesorería. Cuenta contable 57200 explicada. `detalle` en los dos pasos que no lo tenían.
- Dos problemas nuevos (no deja guardar; no veo S{INI} en la lista).

## Pendiente de comprobar
- La ruta de Terceros («Finanzas › Maestros › Terceros › Registro terceros») ya estaba en el bloque; no se ha verificado en la demo.
- «Crear una empresa» se nombra en un problema como bloque siguiente; es el título actual de `maestros-v-4`.
