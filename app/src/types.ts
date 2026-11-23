export interface Hotspot {
  x: number;
  y: number;
  w: number;
  h: number;
  etiqueta: string;
}

export interface Paso {
  texto: string;
  /** Consigna de «De memoria»: una sola acción (qué pulsar y para qué, con contexto). Si falta, se usa «texto». */
  pregunta?: string;
  detalle?: string;
  imagen?: string;
  hotspot?: Hotspot;
}

export interface Aviso {
  tipo: 'problema' | 'solucion' | 'nota';
  texto: string;
}

export interface Campo {
  campo: string;
  significado: string;
  ejemplo: string;
}

export interface Seccion {
  id: string;
  titulo: string;
  paraQueSirve: string;
  ruta: string[] | null;
  explicacion: string[];
  campos: Campo[];
  pasos: Paso[];
  avisos: Aviso[];
  /** El vídeo de la parte enseña todos sus momentos en lista (parte hecha solo de vídeo, como «Moverte por Axional») */
  videoIndice?: boolean;
}

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export interface Ejercicio {
  id: string;
  numero: number;
  titulo: string;
  objetivo: string;
  concepto: string;
  duracionMin: number;
  secciones: Seccion[];
  test: Pregunta[];
  checklist: string[];
  problemas: { problema: string; solucion: string }[];
  /** «Qué has aprendido»: 3–5 frases de lo que el alumno ha hecho en el bloque; sale al final del último paso */
  aprendido?: string[];
}

export interface Modulo {
  id: string;
  titulo: string;
  sesion: string;
  resumen: string;
  circuito: string[];
  navegacion?: Seccion[];
  ejercicios: Ejercicio[];
  datosSimulador?: Record<string, unknown>;
}
