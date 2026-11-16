export interface Hotspot {
  x: number;
  y: number;
  w: number;
  h: number;
  etiqueta: string;
}

export interface Paso {
  texto: string;
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
