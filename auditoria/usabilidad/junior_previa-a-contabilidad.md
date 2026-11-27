# Revisión junior simulada: formación previa, Fundamentos, Datos maestros y Contabilidad básica

Leo como junior sin contabilidad ni ERP, en orden de pantalla (volcado `volcado-final/00-02` y código de la formación previa), lo que corrigieron los informes `maestros-contabilidad.md` y `previa-fundamentos.md`. Todo con Edit, cadena a cadena. JSON válidos; `comprobar_estructura.py`: 0 errores estructurales, 0 avisos.

## Datos maestros (módulo 1)

| Página | Resultado | Cita y por qué me pierdo | Gravedad | Qué arreglé |
|---|---|---|---|---|
| Página del módulo · frase | Se entiende | «Los datos maestros son las fichas básicas…» ya dice qué es el módulo y por qué empieza por la empresa | — | — |
| Lo básico › «Qué son los datos básicos» | Se entiende | Tabla de códigos en orden de creación; me queda claro que solo creo S/TS aquí | — | — |
| Lo básico › «Cómo moverte por el ERP» | Se entiende | Remite bien a Fundamentos sin repetir | — | — |
| Bloque 1 › partes 2 y 4 · De memoria | Arreglado | El paso dice «sección «Datos fiscales»» y la pregunta de justo debajo «En el bloque «Datos fiscales»». Pienso que me mandan a otro bloque del curso | 2 | Las 3 preguntas pasan a «sección» (Datos fiscales, Datos, Datos auxiliares / Datos contables) |
| Bloque 1 · Demo real › problema 1 | Arreglado | «Asigna un plan contable… en los Datos contables de la empresa», pero dos partes antes me dijeron que el plan está en la sección «Datos». ¿Dónde lo busco? | 2 | → «en la sección «Datos» de la ficha de la empresa» |
| Bloque 2 › «Crear el banco propio» · paso 4 | Arreglado | «mira «Si algo sale mal…»»: no hay nada con ese nombre; el apartado se llama «Si algo falla» y está en Demo real | 2 | → «mira «Si algo falla», en la pestaña Demo real» |
| Bloque 2 · resto (tercero, empresa, ejercicio) | Se entiende | Ya no nombra C{INI}/T{INI} como si existieran | — | — |

## Contabilidad básica (módulo 2)

| Página | Resultado | Cita y por qué me pierdo | Gravedad | Qué arreglé |
|---|---|---|---|---|
| Página del módulo · frase | Arreglado | «preparas lo que necesitan (tu cuenta, tus datos básicos…)»: ¿quiénes lo necesitan? Y el cliente no lo necesitan los asientos | 1 | → «preparas lo imprescindible (…)» |
| Recorrido › «Consultas» | Arreglado | «aprendes» dice «extracto» y el recorrido «mayor de cuentas»: parecen dos cosas distintas | 1 | d → «Lo compruebas en el extracto de cada cuenta y en los saldos» (el ejemplo sigue mostrando la pantalla «Mayor de cuentas») |
| Lo básico › «Cómo moverte por el ERP» · aviso | Arreglado | La explicación 2 dice que la ficha se abre con el número de fila y que el código subrayado abre un menú, pero la solución del aviso dice «abre el registro con el enlace del código». Se contradicen | 2 | → «abre el registro con su número de fila» |
| Bloques 1, 5, 15, 21 · De memoria | Arreglado | «bloque «Información general»», «bloque «Tesorería»», «bloque Debe/Haber», «bloque «Códigos auxiliares»»: el paso dice «sección» y la pregunta «bloque» | 2 | Las 4 preguntas pasan a «sección» |
| Bloque 26 «Registrar los saldos iniciales» · concepto | Arreglado | «lo verás en «Cerrar el ejercicio de tu empresa»»: no encuentro ese título; el bloque real está en otro módulo y se llama más largo | 2 | → «lo verás en Contabilidad avanzada y cierre, bloque «Cerrar el ejercicio de tu empresa: regularizar y preparar el cierre»» |
| Bloques 3, 4, 6, 8-19 (corregidos) | Se entiende | Remisiones a bloques anteriores comprobadas con `grep` y en orden | — | — |

## Fundamentos (módulo 0)

| Página | Resultado | Cita y por qué me pierdo | Gravedad | Qué arreglé |
|---|---|---|---|---|
| Página del módulo · frase y aprendes | Se entiende | — | — | — |
| Bloque 1 · concepto | Se entiende | «En la formación previa viste qué es un ERP…» conecta con la previa | — | — |
| Bloque 2 › «Situar las cuentas» · explicaciones 3-4 | Se entiende | «En este repaso ya han salido 100 Capital social y 472…» | — | — |
| Bloque 3 › «Ver cómo encaja el curso» · explicación 2 | Arreglado | «Tu empresa del caso es S{INI}… En la demo grabas dentro de la empresa 0»: el bloque 1 me dijo que el caso va en la 0 y S{INI} solo es para practicar. ¿En cuál grabo? | 2 | → «Tu empresa de práctica es S{INI} y la creas en Maestros, pero las operaciones del caso las grabas en la empresa 0 «Deister Software» de la demo» |
| Bloque 3 › explicaciones 3-4 | Se entiende | — | — | — |

## Formación previa

| Página | Resultado | Cita y por qué me pierdo | Gravedad | Qué arreglé |
|---|---|---|---|---|
| Portada «Antes de empezar con Axional» | Arreglado | «Fundamentos ya no repite esta teoría»: el «ya no» suena a una versión anterior que yo no conozco | 1 | → «Fundamentos no repite esta teoría» |
| Contabilidad › «Cómo usar esta guía» | Arreglado | «La guía «Qué es un ERP» (apartado 2) lo explica»: el capítulo 2 de esa guía es «Por qué una empresa necesita un ERP»; el buscador está en el capítulo 3 | 2 | → «(capítulo 3, «Primeros pasos en Axional»)» |
| Contabilidad › remisiones «capítulo 12» (efecto) | Se entiende | El capítulo 12 «Un caso real en Axional ICON» explica el efecto | — | — |
| ERP › remisiones «capítulo 15» (efecto) y «apartado» por «bloque» | Se entiende | El capítulo 15 es «Cobros y pagos: la cartera de efectos» | — | — |
| GuiaPrevia · «El examen se corrige solo» | Se entiende | — | — | — |

## Dudas funcionales (no tocadas)

- Contabilidad › Bloque 4 dice que el cambio sin guardar se marca con «barra vertical azul oscuro»; Bloque 15 dice «barra roja». Puede ser distinto en ficha y panel lateral: no lo sé.
- Botón «Añadir…»: «rojo» en Maestros y «azul oscuro» en Contabilidad (ya apuntado por el corrector).
- Maestros › Bloque 2 › banco: el paso 4 sitúa «Cuenta» en la sección «Información complementaria», donde la tabla de campos pone la Entidad financiera.

## Recuento

- Páginas revisadas: 24 (Maestros 7, Contabilidad 6 grupos, Fundamentos 5, previa 5, más la frase de Contabilidad).
- Confirmadas («se entiende»): 13.
- Arregladas: 11 páginas, 16 cadenas (maestros.json 5, icon-contabilidad.json 6, portadaDatos.ts 2, fundamentos.json 1, contabilidad.ts 1, Formacion.tsx 1).
- Pendientes: 3 dudas funcionales.
