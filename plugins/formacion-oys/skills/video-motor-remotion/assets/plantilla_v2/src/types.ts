// Formato del guion (ver GUION_FORMATO.md)

export type Word = { w: string; o: number; d: number }; // palabra, offset ms, duración ms
export type TimingEntry = { durMs: number; hash?: string; words: Word[] };
export type Timing = Record<string, TimingEntry>;

/** Momento de aparición: «t» (segundos desde el inicio de la escena) o «clave»
 *  (palabra o frase de la locución; se busca en orden, después de la anterior). */
export type Cuando = { t?: number; clave?: string };

export type Rect = { x: number; y: number; w: number; h: number };

export type Transicion = 'auto' | 'fade' | 'slide' | 'slide-arriba' | 'wipe' | 'zoom' | 'luz' | 'vuelo' | 'ninguna';

type Base = {
  id: string;
  narracion?: string;
  voz?: string;
  rate?: string;
  /** antetítulo pequeño (sustituye al de por defecto del tipo) */
  etiqueta?: string;
  /** duración fija en s (si no hay narración o para forzarla) */
  duracion?: number;
  /** colchón en s tras la locución (sobrescribe config.colchon) */
  colchon?: number;
  /** pausa de respiro extra en s al final de la escena */
  pausa?: number;
  /** transición de ENTRADA a esta escena */
  transicion?: Transicion;
  /** silencios insertados en la locución para esperar a la imagen: en «s» (s de la voz original) se añaden «ms» de silencio */
  huecos?: { s: number; ms: number }[];
  /** recorte de vídeo origen para tools/clips.py */
  clip?: { src: string; inicio: number; fin: number };
};

export type Portada = Base & { tipo: 'portada'; titulo: string; subtitulo?: string };
export type Capitulo = Base & { tipo: 'capitulo'; numero?: number; titulo: string; subtitulo?: string };

export type FlujoNodo = Cuando & {
  id: string;
  titulo: string;
  subtitulo?: string;
  icono?: string;
  /** código de documento que se ve en la tarjeta, p. ej. «PED-0142» */
  codigo?: string;
  /** importe con contador animado */
  importe?: number;
  divisa?: string;
};
export type Flujo = Base & {
  tipo: 'flujo';
  titulo?: string;
  nodos: FlujoNodo[];
  enlaces?: { de: string; a: string; texto?: string }[];
};

export type Lado = 'derecha' | 'izquierda' | 'arriba' | 'abajo';
/** Recuadro con etiqueta numerada (cian). «hasta»: s de escena en que desaparece (por defecto, cuando llega el siguiente). */
export type Callout = Cuando & { rect: Rect; texto: string; lado?: Lado; hasta?: number };
/** Resaltado de un campo o zona (ámbar), con etiqueta opcional sin número. «hasta» en s de escena (por defecto +3 s). */
export type Resalte = Cuando & { rect: Rect; etiqueta?: string; lado?: Lado; hasta?: number; oscurece?: boolean };
/** Zoom 2D (dolly) hacia «rect»; sin rect vuelve al plano general. */
export type Zoom = Cuando & { rect?: Rect; dur?: number; giro?: { x?: number; y?: number } };
export type Pantalla = Base & {
  tipo: 'pantalla';
  titulo?: string;
  url?: string;
  /** fichero en public/ (por defecto clips/<id>.mp4) */
  video?: string;
  /** imagen fija en public/ (PNG/JPG); si se indica, sustituye al vídeo */
  imagen?: string;
  /** sistema de coordenadas del vídeo (por defecto 3200×1800 = viewport 1600×900 CSS a 2×) */
  tamano?: { w: number; h: number };
  recorte?: Rect;
  /** s de escena en que arranca el clip (antes se congela el primer fotograma) */
  clipDesde?: number;
  /** duración del clip en s (después se congela el último fotograma) */
  clipDur?: number;
  velocidad?: number;
  zooms?: Zoom[];
  callouts?: Callout[];
  resaltes?: Resalte[];
  /** anillo pulsante breve sobre un punto (clic); «hasta» en s de escena (por defecto +1,2 s) */
  foco?: (Cuando & { x: number; y: number; hasta?: number })[];
  /** parches que tapan un texto del vídeo (p. ej. un error) con un rectángulo del color de fondo y un texto limpio.
   *  Coordenadas de vídeo; desde/hasta en s de escena; tamano = cuerpo de letra en px de vídeo. */
  tapas?: Tapa[];
};
export type Tapa = {
  rect: Rect;
  texto?: string;
  desde?: number;
  hasta?: number;
  fondo?: string;
  color?: string;
  tamano?: number;
  espaciado?: string;
  peso?: number;
  /** margen izquierdo del texto dentro del rect, px de vídeo */
  margen?: number;
  /** desplazamiento vertical del texto, px de vídeo */
  dy?: number;
};

export type ConceptoItem = Cuando & { titulo: string; texto?: string; icono?: string };
export type Conceptos = Base & { tipo: 'conceptos'; titulo?: string; subtitulo?: string; items: ConceptoItem[]; disposicion?: 'rejilla' | 'lista' };

export type EstructuraNodo = Cuando & { titulo: string; subtitulo?: string; detalle?: string; icono?: string; hijos?: EstructuraNodo[] };
export type Estructura = Base & { tipo: 'estructura'; titulo?: string; raiz: EstructuraNodo; ramas: EstructuraNodo[] };

export type Tip = Base & { tipo: 'tip' | 'cuidado'; titulo?: string; texto: string };

export type FilaComparativa = Cuando & { aspecto?: string; antes: string; ahora: string; marca?: 'mejora' | 'nuevo' | 'igual' | 'eliminado' | 'cambio' };
export type Comparativa = Base & {
  tipo: 'comparativa';
  titulo?: string;
  etiquetas?: { antes?: string; ahora?: string };
  filas: FilaComparativa[];
};

export type Resumen = Base & { tipo: 'resumen'; titulo?: string; items: (Cuando & { texto: string })[] };
export type PasoCalculo = Cuando & { etiqueta: string; porcentaje?: number; importe?: number };
export type Calculo = Base & {
  tipo: 'calculo';
  titulo?: string;
  base: { etiqueta: string; valor: number };
  pasos: PasoCalculo[];
  resultado?: string;
  divisa?: string;
  decimales?: number;
};

export type Cierre = Base & { tipo: 'cierre'; titulo: string; subtitulo?: string; siguientes?: string[] };

export type Escena = Portada | Capitulo | Flujo | Pantalla | Conceptos | Estructura | Tip | Comparativa | Resumen | Calculo | Cierre;

export type Config = {
  voz?: string;
  rate?: string;
  /** s antes de que empiece la voz */
  entrada?: number;
  /** s de margen tras la voz */
  colchon?: number;
  /** pausa de respiro en s antes de cada capítulo */
  pausaCapitulo?: number;
  /** duración de las transiciones, s */
  transicion?: number;
  subtitulos?: boolean;
  /** marca de la empresa: texto (barra superior y copyright) y logotipo (mosca, portada, cierre) */
  marca?: string | Marca;
};

export type Marca = {
  /** fichero en public/, p. ej. «brand/oys_logo_light.png» (versión para fondo oscuro) */
  logo?: string;
  /** nombre de la empresa */
  texto?: string;
  /** por defecto «© <año> <texto>» */
  copyright?: string;
  /** tamaño del PNG en px (544×332 por defecto) */
  ancho?: number;
  alto?: number;
  /** caja del texto dentro del PNG (px): lo de fuera se trata como «trazo» y se dibuja con un barrido */
  zonaTexto?: Rect;
  /** centro (%) y ángulo inicial (grados) del barrido que dibuja el trazo */
  centroTrazo?: { x: number; y: number };
  inicioTrazo?: number;
  /** false = sin mosca en la esquina */
  mosca?: boolean;
};

export type Guion = { titulo?: string; config?: Config; escenas: Escena[] };

/** capitulo: si se indica (1, 2…), solo se renderiza ese capítulo */
export type TutorialProps = { guion: Guion; timing: Timing; capitulo?: number };
