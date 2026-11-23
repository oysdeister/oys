/**
 * Un vídeo corto por tabla de finanzas (para qué sirve y cómo se parametriza), Release «video-tablas-fin-v1».
 * Cada capítulo es un vídeo suelto: «nuevo» (Remotion, pantallas reales de la demo, voz y callouts) o
 * «mejorado» (trozo de una sesión de los ponentes de Deister, recortado al ERP, nítido y con subtítulos).
 * Su momento va el primero en la sección que explica la tabla (tarjeta «Mira primero el vídeo»).
 * Generado por _fuente/gen_video_tablas.py desde _fuente/video_tablas.json: no editar a mano.
 */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieTablasFin {
  id: string;
  titulo: string;
  corto: string;
  intro?: string;
  porTabla: true;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}

export const SERIES_TABLAS_FIN: SerieTablasFin[] = [
  {
    "id": "tab-tesoreria",
    "titulo": "Vídeos por tabla: Tesorería",
    "corto": "Tablas de tesorería",
    "porTabla": true as const,
    "modulos": [
      "tesoreria"
    ],
    "intro": "Un vídeo corto por tabla: para qué sirve y cómo se parametriza, con pantallas reales.",
    "capitulos": [
      {
        "n": 1,
        "titulo": "Comisiones del banco",
        "inicio": 0,
        "duracion": 128,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-comisiones-banco.mp4",
        "poster": "video/tablas/tes-comisiones-banco.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Para qué sirve"
          },
          {
            "t": 31,
            "titulo": "La pestaña Comisiones del banco"
          },
          {
            "t": 70,
            "titulo": "Importe, tipo y vigencia"
          },
          {
            "t": 109,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 2,
        "titulo": "Flujos financieros",
        "inicio": 0,
        "duracion": 120,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-flujos-financieros.mp4",
        "poster": "video/tablas/tes-flujos-financieros.jpg",
        "escenas": [
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 28,
            "titulo": "La lista de flujos"
          },
          {
            "t": 58,
            "titulo": "La ficha del flujo"
          },
          {
            "t": 104,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 3,
        "titulo": "Operaciones financieras",
        "inicio": 0,
        "duracion": 124,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-operaciones-financieras.mp4",
        "poster": "video/tablas/tes-operaciones-financieras.jpg",
        "escenas": [
          {
            "t": 5,
            "titulo": "Para qué sirve"
          },
          {
            "t": 29,
            "titulo": "La lista de operaciones"
          },
          {
            "t": 58,
            "titulo": "Ficha y parámetros de conciliación"
          },
          {
            "t": 107,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 4,
        "titulo": "Parámetros de tesorería",
        "inicio": 0,
        "duracion": 110,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-parametros-tesoreria.mp4",
        "poster": "video/tablas/tes-parametros-tesoreria.jpg",
        "escenas": [
          {
            "t": 5,
            "titulo": "Para qué sirve"
          },
          {
            "t": 26,
            "titulo": "Información general"
          },
          {
            "t": 62,
            "titulo": "Indicadores"
          },
          {
            "t": 94,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 5,
        "titulo": "Conceptos comunes",
        "inicio": 0,
        "duracion": 117,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-conceptos-comunes.mp4",
        "poster": "video/tablas/tes-conceptos-comunes.jpg",
        "escenas": [
          {
            "t": 4,
            "titulo": "Para qué sirven"
          },
          {
            "t": 34,
            "titulo": "La lista de conceptos"
          },
          {
            "t": 58,
            "titulo": "La ficha de un concepto"
          },
          {
            "t": 99,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 6,
        "titulo": "Conceptos propios",
        "inicio": 0,
        "duracion": 127,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-conceptos-propios.mp4",
        "poster": "video/tablas/tes-conceptos-propios.jpg",
        "escenas": [
          {
            "t": 4,
            "titulo": "Para qué sirven"
          },
          {
            "t": 29,
            "titulo": "Conceptos del banco"
          },
          {
            "t": 76,
            "titulo": "Operaciones a conciliar"
          },
          {
            "t": 112,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 7,
        "titulo": "Definición de cajas",
        "inicio": 0,
        "duracion": 92,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/tes-definicion-cajas.mp4",
        "poster": "video/tablas/tes-definicion-cajas.jpg",
        "escenas": [
          {
            "t": 5,
            "titulo": "Para qué sirve"
          },
          {
            "t": 28,
            "titulo": "La ficha de la caja"
          },
          {
            "t": 77,
            "titulo": "Resumen"
          }
        ]
      }
    ]
  }
];

export const MOMENTOS_SECCION_TABLAS_FIN: Record<string, MomentoVideo[]> = {
  "tesoreria-1-comisiones": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Comisiones del banco"
    }
  ],
  "asientos-14-comision": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Comisiones del banco"
    }
  ],
  "tesoreria-2-flujo": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Flujos financieros"
    }
  ],
  "tesoreria-2-operacion": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Operaciones financieras"
    }
  ],
  "tesoreria-2-conciliacion": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Operaciones financieras"
    }
  ],
  "tesoreria-2-parametros": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 4,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Parámetros de tesorería"
    }
  ],
  "tesoreria-4-comunes": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 5,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Conceptos comunes"
    }
  ],
  "tesoreria-4-propios": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 6,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Conceptos propios"
    }
  ],
  "tesoreria-6-configuracion": [
    {
      "serie": "tab-tesoreria",
      "capitulo": 7,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Definición de cajas"
    }
  ]
};
