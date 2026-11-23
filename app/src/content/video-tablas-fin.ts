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
  },
  {
    "id": "tab-cartera",
    "titulo": "Vídeos por tabla: Cartera, cobros y pagos",
    "corto": "Tablas de cartera",
    "porTabla": true as const,
    "modulos": [
      "carteras"
    ],
    "intro": "Un vídeo corto por tabla: para qué sirve y cómo se parametriza, con pantallas reales.",
    "capitulos": [
      {
        "n": 1,
        "titulo": "Plazos de pago",
        "inicio": 0,
        "duracion": 144,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/car-plazos-pago.mp4",
        "poster": "video/tablas/car-plazos-pago.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 34,
            "titulo": "Lista de plazos"
          },
          {
            "t": 73,
            "titulo": "Ficha de CA1"
          },
          {
            "t": 122,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 2,
        "titulo": "Bancos propios y cajas",
        "inicio": 0,
        "duracion": 136,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/car-bancos-propios-cajas.mp4",
        "poster": "video/tablas/car-bancos-propios-cajas.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 37,
            "titulo": "Lista de bancos propios"
          },
          {
            "t": 72,
            "titulo": "Ficha de CAPT_BCO"
          },
          {
            "t": 115,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 3,
        "titulo": "Remesas por cuenta",
        "inicio": 0,
        "duracion": 124,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/car-remesas-por-cuenta.mp4",
        "poster": "video/tablas/car-remesas-por-cuenta.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 37,
            "titulo": "BBVA_CA › Remesas por cuenta"
          },
          {
            "t": 76,
            "titulo": "BBVA_CA › Líneas financieras"
          },
          {
            "t": 103,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 4,
        "titulo": "Tipos de efecto",
        "inicio": 0,
        "duracion": 105,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/mej-tipos-efecto.mp4",
        "poster": "video/tablas/mej-tipos-efecto.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Tipos de efecto (sesión de Deister)"
          }
        ]
      },
      {
        "n": 5,
        "titulo": "Estados de efecto",
        "inicio": 0,
        "duracion": 217,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/mej-estados-efecto.mp4",
        "poster": "video/tablas/mej-estados-efecto.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Estados de efecto (sesión de Deister)"
          }
        ]
      },
      {
        "n": 6,
        "titulo": "Acciones sobre efectos",
        "inicio": 0,
        "duracion": 231,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/mej-acciones-efecto.mp4",
        "poster": "video/tablas/mej-acciones-efecto.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Acciones sobre efectos (sesión de Deister)"
          }
        ]
      }
    ]
  },
  {
    "id": "tab-activos",
    "titulo": "Vídeos por tabla: Activos fijos",
    "corto": "Tablas de activos",
    "porTabla": true as const,
    "modulos": [
      "icon-activos"
    ],
    "intro": "Un vídeo corto por tabla: para qué sirve y cómo se parametriza, con pantallas reales.",
    "capitulos": [
      {
        "n": 1,
        "titulo": "Bienes",
        "inicio": 0,
        "duracion": 130,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/act-bienes.mp4",
        "poster": "video/tablas/act-bienes.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 3,
            "titulo": "Para qué sirve"
          },
          {
            "t": 35,
            "titulo": "Lista de bienes"
          },
          {
            "t": 64,
            "titulo": "Ficha de CAPASC"
          },
          {
            "t": 111,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 2,
        "titulo": "Valores de amortización",
        "inicio": 0,
        "duracion": 112,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/act-valores-amortizacion.mp4",
        "poster": "video/tablas/act-valores-amortizacion.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 33,
            "titulo": "Componente CAPASC 0000001"
          },
          {
            "t": 58,
            "titulo": "Valores de los componentes"
          },
          {
            "t": 94,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 3,
        "titulo": "Grupos contables y fiscales del activo",
        "inicio": 0,
        "duracion": 228,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/mej-grupos-activo.mp4",
        "poster": "video/tablas/mej-grupos-activo.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Grupos contables y fiscales del activo (sesión de Deister)"
          }
        ]
      }
    ]
  },
  {
    "id": "tab-contabilidad",
    "titulo": "Vídeos por tabla: Contabilidad general",
    "corto": "Tablas de contabilidad",
    "porTabla": true as const,
    "modulos": [
      "icon-contabilidad"
    ],
    "intro": "Un vídeo corto por tabla: para qué sirve y cómo se parametriza, con pantallas reales.",
    "capitulos": [
      {
        "n": 1,
        "titulo": "Cuentas contables",
        "inicio": 0,
        "duracion": 131,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-cuentas-contables.mp4",
        "poster": "video/tablas/con-cuentas-contables.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 30,
            "titulo": "Lista filtro Cuenta 629*"
          },
          {
            "t": 60,
            "titulo": "Ficha 62999.00000"
          },
          {
            "t": 114,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 2,
        "titulo": "Grupos auxiliares",
        "inicio": 0,
        "duracion": 98,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-grupos-auxiliares.mp4",
        "poster": "video/tablas/con-grupos-auxiliares.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 25,
            "titulo": "Lista ECEMP y TERCER; se abre ECEMP"
          },
          {
            "t": 42,
            "titulo": "Ficha Grupo auxiliar"
          },
          {
            "t": 79,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 3,
        "titulo": "Proyectos",
        "inicio": 0,
        "duracion": 98,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-proyectos.mp4",
        "poster": "video/tablas/con-proyectos.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 27,
            "titulo": "Lista 0 GENERAL"
          },
          {
            "t": 44,
            "titulo": "Ficha EC1"
          },
          {
            "t": 81,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 4,
        "titulo": "Secciones",
        "inicio": 0,
        "duracion": 89,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-secciones.mp4",
        "poster": "video/tablas/con-secciones.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 4,
            "titulo": "Para qué sirve"
          },
          {
            "t": 23,
            "titulo": "Lista 0 General"
          },
          {
            "t": 38,
            "titulo": "Ficha ECADM"
          },
          {
            "t": 73,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 5,
        "titulo": "Numeradores de justificantes",
        "inicio": 0,
        "duracion": 115,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-numeradores-justificantes.mp4",
        "poster": "video/tablas/con-numeradores-justificantes.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 5,
            "titulo": "Para qué sirve"
          },
          {
            "t": 31,
            "titulo": "Lista Tabla origen"
          },
          {
            "t": 55,
            "titulo": "Ficha EA"
          },
          {
            "t": 96,
            "titulo": "Resumen"
          }
        ]
      },
      {
        "n": 6,
        "titulo": "Plantillas de contabilización",
        "inicio": 0,
        "duracion": 112,
        "url": "https://github.com/oysdeister/oys/releases/download/video-tablas-fin-v1/con-plantillas-contabilizacion.mp4",
        "poster": "video/tablas/con-plantillas-contabilizacion.jpg",
        "escenas": [
          {
            "t": 0,
            "titulo": "Título"
          },
          {
            "t": 5,
            "titulo": "Para qué sirve"
          },
          {
            "t": 30,
            "titulo": "Lista Tabla origen; fila 4 «Facturas de compra v20"
          },
          {
            "t": 57,
            "titulo": "Ficha ccomfach"
          },
          {
            "t": 92,
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
  ],
  "carteras-1-plazo": [
    {
      "serie": "tab-cartera",
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Plazos de pago"
    }
  ],
  "carteras-3-banco": [
    {
      "serie": "tab-cartera",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Bancos propios y cajas"
    }
  ],
  "carteras-3-caja": [
    {
      "serie": "tab-cartera",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Bancos propios y cajas"
    }
  ],
  "tesoreria-1-banco": [
    {
      "serie": "tab-cartera",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Bancos propios y cajas"
    }
  ],
  "carteras-5-remesa-banco": [
    {
      "serie": "tab-cartera",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Remesas por cuenta"
    }
  ],
  "icon-cartera-v-5-remesas-por-cuenta": [
    {
      "serie": "tab-cartera",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Remesas por cuenta"
    }
  ],
  "icon-cartera-v-4-tipos": [
    {
      "serie": "tab-cartera",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Remesas por cuenta"
    }
  ],
  "icon-activos-1-bien": [
    {
      "serie": "tab-activos",
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Bienes"
    }
  ],
  "icon-activos-2-sistemas": [
    {
      "serie": "tab-activos",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Valores de amortización"
    }
  ],
  "parametrizacion-1-cuenta": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Cuentas contables"
    }
  ],
  "parametrizacion-3-grupo": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 2,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Grupos auxiliares"
    }
  ],
  "parametrizacion-5-proyecto": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Proyectos"
    }
  ],
  "parametrizacion-6-seccion": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 4,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Secciones"
    }
  ],
  "asientos-2-numerador": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 5,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Numeradores de justificantes"
    }
  ],
  "icon-contabilidad-1-plantillas": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 6,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Plantillas de contabilización"
    }
  ],
  "parametrizacion-icon-2-plantillas-permiso": [
    {
      "serie": "tab-contabilidad",
      "capitulo": 6,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo: Plantillas de contabilización"
    }
  ],
  "carteras-1-tipo-efecto": [
    {
      "serie": "tab-cartera",
      "capitulo": 4,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo de los ponentes, mejorado: Tipos de efecto"
    }
  ],
  "icon-cartera-1-estados": [
    {
      "serie": "tab-cartera",
      "capitulo": 5,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo de los ponentes, mejorado: Estados de efecto"
    }
  ],
  "carteras-5-estados": [
    {
      "serie": "tab-cartera",
      "capitulo": 5,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo de los ponentes, mejorado: Estados de efecto"
    }
  ],
  "icon-cartera-1-acciones": [
    {
      "serie": "tab-cartera",
      "capitulo": 6,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo de los ponentes, mejorado: Acciones sobre efectos"
    }
  ],
  "icon-activos-1-config": [
    {
      "serie": "tab-activos",
      "capitulo": 3,
      "t": 0,
      "tCap": 0,
      "titulo": "Vídeo de los ponentes, mejorado: Grupos contables y fiscales del activo"
    }
  ]
};
