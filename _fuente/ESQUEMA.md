# Esquema JSON de un módulo

Un fichero por manual: `src/content/<slug>.json`. Todo en castellano de España, tuteo, lenguaje llano para un junior.

```ts
interface Modulo {
  id: string;                 // slug: compras | ventas | maestros | asientos | parametrizacion | carteras
  titulo: string;             // «Gestión de compras»
  sesion: string;             // «Sesión 7» si el manual lo dice, si no ""
  resumen: string;            // 2-3 frases: qué aprendes en el módulo
  circuito: string[];         // pasos del circuito de negocio del módulo, en orden (para el mapa animado), 3-7 piezas cortas
  navegacion?: Seccion[];     // apartado general «Cómo moverse por…» si existe (mismo formato que las secciones)
  ejercicios: Ejercicio[];    // TODOS los ejercicios del manual, en orden, sin inventar ninguno
  datosSimulador?: object;    // ver instrucciones de cada manual
}

interface Ejercicio {
  id: string;                 // «compras-1»
  numero: number;
  titulo: string;             // título del manual sin «Ejercicio N.»
  objetivo: string;           // 1 frase: qué tendrás hecho al terminar
  concepto: string;           // 1-2 párrafos llanos: el concepto de negocio y por qué importa
  duracionMin: number;        // estimación realista
  secciones: Seccion[];       // cada apartado del ejercicio en el manual, en orden
  test: Pregunta[];           // 4-5 preguntas de comprensión basadas SOLO en el manual
  checklist: string[];        // «hazlo tú en la demo real»: 6-15 comprobaciones concretas y verificables
  problemas: { problema: string; solucion: string }[];  // de los recuadros PROBLEMA/SOLUCIÓN (y otros errores típicos que el manual cite)
}

interface Seccion {
  id: string;                 // «compras-1-tercero»
  titulo: string;
  paraQueSirve: string;       // recuadro «¿Para qué sirve?» reescrito llano
  ruta: string[] | null;      // ruta de menú, p.ej. ["Gestión","Compras","Albaranes"]
  explicacion: string[];      // párrafos de explicación del manual (resumidos sin perder datos)
  campos: { campo: string; significado: string; ejemplo: string }[];   // tablas de campos, completas
  pasos: Paso[];              // pasos guiados, en orden
  avisos: { tipo: "problema" | "solucion" | "nota"; texto: string }[];
}

interface Paso {
  texto: string;              // instrucción imperativa corta: «Pulsa + Nuevo en la barra superior»
  detalle?: string;           // explicación opcional de qué pasa al hacerlo
  imagen?: string;            // nombre exacto del fichero, p.ej. «compras-014.jpg»
  hotspot?: {                 // SOLO si la imagen muestra el elemento a pulsar o el campo a rellenar
    x: number; y: number; w: number; h: number;   // rectángulo en % (0-100) del ancho/alto de la imagen, esquina superior izquierda
    etiqueta: string;         // rótulo literal del elemento en la captura («+ Nuevo», «Generar albaranes»)
  };
}

interface Pregunta { pregunta: string; opciones: string[]; correcta: number; explicacion: string; }
```

## Reglas

- **Iniciales**: el manual usa CL (Carlos López). Cambia las iniciales de los códigos por el token `{INI}`: `TCL` → `T{INI}`, `TFCL` → `TF{INI}`, `GCL` → `G{INI}`. Los nombres de ejemplo («Tercero Carlos López») → «Tercero {INI}». No toques códigos que no lleven las iniciales del alumno (cuentas, series del sistema, etc.).
- **Sin comparaciones**: no menciones «versión anterior», «versión nueva», «antes/ahora», «ERP antiguo». Los recuadros «CAMBIO» se reescriben como explicación normal de cómo funciona (van a `explicacion` o a `avisos` tipo «nota»).
- **Cifras y rótulos literales**: copia exactos importes, cuentas, códigos, porcentajes, nombres de botones y campos. No inventes cifras.
- **Imágenes**: cada `[IMG:x]` del manual va a un paso (o a un paso de solo lectura «Fíjate en…» si es una captura de resultado). Excluye la portada/logos decorativos. No repitas una imagen salvo que haga falta.
- **Hotspots**: abre la imagen con Read y mide el rectángulo del elemento que hay que pulsar. Que sea generoso (añade ~1-2 % de margen) y que la `etiqueta` sea el texto visible. Si la captura es un resultado o no hay un punto claro, omite el hotspot.
- No inventes ejercicios ni pasos que no estén en el manual. Puedes partir un párrafo largo en varios pasos.
- JSON válido (comprueba con `python3 -c "import json;json.load(open('…'))"`).
