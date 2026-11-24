/**
 * Enlaces entre los ejercicios y el vídeo tutorial de compras.
 * Lo mantiene el agente del vídeo; los componentes de ejercicio solo lo leen.
 */
export interface MomentoVideo {
  /** Serie de vídeo (ver videoSeries.ts); sin ella es el vídeo de compras */
  serie?: string;
  capitulo: number;      // 1-10
  t: number;             // segundo dentro del vídeo completo
  tCap: number;          // segundo dentro del clip del capítulo
  titulo: string;        // qué se explica en ese momento («Alta del proveedor»)
  /** Segundo del clip en que acaba el momento: el reproductor se para ahí y ofrece seguir viendo */
  fin?: number;
}

export interface CapituloVideo {
  n: number;
  titulo: string;
  inicio: number;        // segundo de inicio en el vídeo completo
  duracion: number;      // segundos
  url: string;           // URL del clip del capítulo (vacía si aún no está subido)
  poster?: string;       // miniatura (ruta pública)
  escenas: { t: number; titulo: string }[]; // t relativo al capítulo
}

/** Clips de la Release «video-v1» de GitHub. Tiempos medidos sobre el guion renderizado (±1 s). */
export const CAPITULOS: CapituloVideo[] = [
  {
    "n": 1,
    "titulo": "Bienvenida: el módulo de compras",
    "inicio": 0,
    "duracion": 461,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap01.mp4",
    "poster": "video/cap01.jpg",
    "escenas": [
      {
        "t": 0,
        "titulo": "Presentación"
      },
      {
        "t": 28,
        "titulo": "Qué es un ERP"
      },
      {
        "t": 54,
        "titulo": "Para qué sirve el módulo de compras"
      },
      {
        "t": 82,
        "titulo": "El ciclo de compra"
      },
      {
        "t": 114,
        "titulo": "Docflow: el rastro de cada compra"
      },
      {
        "t": 134,
        "titulo": "El ciclo puede empezar antes"
      },
      {
        "t": 167,
        "titulo": "La barra superior"
      },
      {
        "t": 201,
        "titulo": "El buscador"
      },
      {
        "t": 232,
        "titulo": "El menú lateral"
      },
      {
        "t": 254,
        "titulo": "Recorrido por Compras: el ciclo"
      },
      {
        "t": 293,
        "titulo": "Recorrido por Compras: el resto"
      },
      {
        "t": 336,
        "titulo": "Dentro de un bloque"
      },
      {
        "t": 376,
        "titulo": "Qué vamos a ver: el módulo"
      },
      {
        "t": 394,
        "titulo": "Qué vamos a ver: los bloques"
      }
    ]
  },
  {
    "n": 2,
    "titulo": "Los maestros: el proveedor y el artículo",
    "inicio": 461,
    "duracion": 601,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap02.mp4",
    "poster": "video/cap02.jpg",
    "escenas": [
      {
        "t": 13,
        "titulo": "Qué es un maestro"
      },
      {
        "t": 60,
        "titulo": "Qué contiene la ficha de un proveedor"
      },
      {
        "t": 110,
        "titulo": "Cuatro palabras que vas a ver"
      },
      {
        "t": 143,
        "titulo": "Alta del tercero"
      },
      {
        "t": 232,
        "titulo": "La dirección del tercero"
      },
      {
        "t": 284,
        "titulo": "Forma de pago y validación"
      },
      {
        "t": 342,
        "titulo": "Alta del proveedor"
      },
      {
        "t": 440,
        "titulo": "Qué es un artículo"
      },
      {
        "t": 493,
        "titulo": "Consulta del artículo"
      },
      {
        "t": 549,
        "titulo": "Comprueba antes de seguir"
      },
      {
        "t": 569,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 3,
    "titulo": "Los precios: listas y grupos de precios",
    "inicio": 1062,
    "duracion": 305,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap03.mp4",
    "poster": "video/cap03.jpg",
    "escenas": [
      {
        "t": 10,
        "titulo": "Qué es una lista de precios"
      },
      {
        "t": 57,
        "titulo": "Un ejemplo con descuento"
      },
      {
        "t": 82,
        "titulo": "Del proveedor al precio"
      },
      {
        "t": 120,
        "titulo": "La lista COM"
      },
      {
        "t": 167,
        "titulo": "La línea del rodamiento"
      },
      {
        "t": 221,
        "titulo": "El grupo de precios 00001"
      },
      {
        "t": 259,
        "titulo": "Si un precio no aparece"
      },
      {
        "t": 276,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 4,
    "titulo": "Cómo se numeran y clasifican los documentos",
    "inicio": 1368,
    "duracion": 903,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap04.mp4",
    "poster": "video/cap04.jpg",
    "escenas": [
      {
        "t": 8,
        "titulo": "Seis ideas sobre los documentos"
      },
      {
        "t": 46,
        "titulo": "El tipo de documento"
      },
      {
        "t": 95,
        "titulo": "Numerador y máscara de serie"
      },
      {
        "t": 157,
        "titulo": "La rotura"
      },
      {
        "t": 202,
        "titulo": "El control cronológico"
      },
      {
        "t": 245,
        "titulo": "La numeración legal de las facturas"
      },
      {
        "t": 274,
        "titulo": "Numerador de documentos"
      },
      {
        "t": 322,
        "titulo": "El numerador del pedido de compra"
      },
      {
        "t": 384,
        "titulo": "Series fiscales"
      },
      {
        "t": 440,
        "titulo": "El contador de la serie fiscal"
      },
      {
        "t": 481,
        "titulo": "Tipos de pedido"
      },
      {
        "t": 520,
        "titulo": "Tipo PC: identificación"
      },
      {
        "t": 570,
        "titulo": "Tipo PC: impuestos y valoración"
      },
      {
        "t": 606,
        "titulo": "Tipo PC: el tipo de albarán"
      },
      {
        "t": 666,
        "titulo": "Tipo PC: campos a ocultar y Docflow"
      },
      {
        "t": 719,
        "titulo": "Tipo de albarán ACPC"
      },
      {
        "t": 760,
        "titulo": "Tipo de factura FCOA"
      },
      {
        "t": 837,
        "titulo": "Antes de generar albaranes"
      },
      {
        "t": 857,
        "titulo": "Qué has aprendido"
      }
    ]
  },
  {
    "n": 5,
    "titulo": "El pedido de compra",
    "inicio": 2271,
    "duracion": 741,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap05.mp4",
    "poster": "video/cap05.jpg",
    "escenas": [
      {
        "t": 7,
        "titulo": "Qué es un pedido"
      },
      {
        "t": 37,
        "titulo": "Qué datos lleva un pedido"
      },
      {
        "t": 74,
        "titulo": "La lista de pedidos"
      },
      {
        "t": 110,
        "titulo": "Crea un pedido nuevo"
      },
      {
        "t": 136,
        "titulo": "Empresa, delegación y departamento"
      },
      {
        "t": 178,
        "titulo": "Fecha, número y proveedor"
      },
      {
        "t": 229,
        "titulo": "Moneda y condiciones de pago"
      },
      {
        "t": 269,
        "titulo": "Quién recibe y quién factura"
      },
      {
        "t": 305,
        "titulo": "Entrega, importes y almacén"
      },
      {
        "t": 392,
        "titulo": "Guarda el pedido"
      },
      {
        "t": 423,
        "titulo": "Tu pedido en la lista"
      },
      {
        "t": 447,
        "titulo": "Qué es una línea de pedido"
      },
      {
        "t": 476,
        "titulo": "El fichero de líneas"
      },
      {
        "t": 513,
        "titulo": "Importa las líneas"
      },
      {
        "t": 567,
        "titulo": "Comprueba la línea"
      },
      {
        "t": 601,
        "titulo": "De la línea al total del pedido"
      },
      {
        "t": 631,
        "titulo": "Qué significa validar"
      },
      {
        "t": 660,
        "titulo": "Valida el pedido"
      },
      {
        "t": 687,
        "titulo": "Comprueba antes de seguir"
      },
      {
        "t": 705,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 6,
    "titulo": "El albarán: recibir la mercancía",
    "inicio": 3011,
    "duracion": 554,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap06.mp4",
    "poster": "video/cap06.jpg",
    "escenas": [
      {
        "t": 8,
        "titulo": "Qué es un albarán"
      },
      {
        "t": 42,
        "titulo": "El albarán nace del pedido"
      },
      {
        "t": 70,
        "titulo": "Abre el proceso de generar albaranes"
      },
      {
        "t": 101,
        "titulo": "Filtra por tipo de pedido y proveedor"
      },
      {
        "t": 133,
        "titulo": "Elige el pedido y su línea"
      },
      {
        "t": 169,
        "titulo": "Genera el albarán"
      },
      {
        "t": 196,
        "titulo": "La cabecera del albarán"
      },
      {
        "t": 257,
        "titulo": "Las líneas del albarán"
      },
      {
        "t": 285,
        "titulo": "¿Y si llega menos cantidad?"
      },
      {
        "t": 312,
        "titulo": "Validar el albarán"
      },
      {
        "t": 350,
        "titulo": "Contabilizar: apuntar en la contabilidad"
      },
      {
        "t": 403,
        "titulo": "Mira el asiento antes de contabilizar"
      },
      {
        "t": 447,
        "titulo": "Contabiliza el albarán"
      },
      {
        "t": 490,
        "titulo": "Comprueba el estado del pedido"
      },
      {
        "t": 511,
        "titulo": "Antes de seguir"
      },
      {
        "t": 525,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 7,
    "titulo": "La factura del proveedor",
    "inicio": 3566,
    "duracion": 387,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap07.mp4",
    "poster": "video/cap07.jpg",
    "escenas": [
      {
        "t": 7,
        "titulo": "Qué es una factura de compra"
      },
      {
        "t": 69,
        "titulo": "Las cifras de nuestra factura"
      },
      {
        "t": 103,
        "titulo": "Generar la factura desde el albarán"
      },
      {
        "t": 163,
        "titulo": "Abrir la factura creada"
      },
      {
        "t": 206,
        "titulo": "Líneas, IVA y vencimiento"
      },
      {
        "t": 256,
        "titulo": "Importe declarado y calculado"
      },
      {
        "t": 301,
        "titulo": "Validar la factura"
      },
      {
        "t": 342,
        "titulo": "Comprueba antes de seguir"
      },
      {
        "t": 356,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 8,
    "titulo": "Contabilizar: qué es un asiento",
    "inicio": 3953,
    "duracion": 495,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap08.mp4",
    "poster": "video/cap08.jpg",
    "escenas": [
      {
        "t": 8,
        "titulo": "Asiento, cuenta, debe y haber"
      },
      {
        "t": 78,
        "titulo": "El asiento del albarán"
      },
      {
        "t": 126,
        "titulo": "El asiento de la factura"
      },
      {
        "t": 275,
        "titulo": "Contabilizar la factura"
      },
      {
        "t": 327,
        "titulo": "Leer el asiento de la factura"
      },
      {
        "t": 425,
        "titulo": "Comprueba antes de seguir"
      },
      {
        "t": 460,
        "titulo": "Qué has hecho"
      }
    ]
  },
  {
    "n": 9,
    "titulo": "Docflow: seguir el rastro de una compra",
    "inicio": 4447,
    "duracion": 638,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap09.mp4",
    "poster": "video/cap09.jpg",
    "escenas": [
      {
        "t": 8,
        "titulo": "Una compra deja un rastro"
      },
      {
        "t": 50,
        "titulo": "Para qué sirve en el día a día"
      },
      {
        "t": 87,
        "titulo": "Dónde se abre Docflow"
      },
      {
        "t": 129,
        "titulo": "Abrir el Docflow desde el albarán"
      },
      {
        "t": 189,
        "titulo": "Cómo se lee: los círculos"
      },
      {
        "t": 235,
        "titulo": "Cómo se lee: las cajas"
      },
      {
        "t": 293,
        "titulo": "El Docflow desde la factura"
      },
      {
        "t": 352,
        "titulo": "Saltar de un documento a otro"
      },
      {
        "t": 394,
        "titulo": "El Docflow desde el pedido"
      },
      {
        "t": 458,
        "titulo": "Detectar lo que está pendiente"
      },
      {
        "t": 515,
        "titulo": "El Docflow del tipo de documento"
      },
      {
        "t": 577,
        "titulo": "La cadena está completa"
      },
      {
        "t": 596,
        "titulo": "Qué has aprendido"
      }
    ]
  },
  {
    "n": 10,
    "titulo": "Resumen y cierre",
    "inicio": 5085,
    "duracion": 169,
    "url": "https://github.com/oysdeister/oys/releases/download/video-v1/cap10.mp4",
    "poster": "video/cap10.jpg",
    "escenas": [
      {
        "t": 8,
        "titulo": "El circuito completo"
      },
      {
        "t": 58,
        "titulo": "Las cifras de la factura"
      },
      {
        "t": 84,
        "titulo": "Si te pierdes, tres ayudas"
      },
      {
        "t": 100,
        "titulo": "Ideas clave"
      },
      {
        "t": 127,
        "titulo": "Buenas prácticas"
      },
      {
        "t": 149,
        "titulo": "Despedida"
      }
    ]
  }
];

/** Momentos del vídeo por id de sección de ejercicio («compras-1-tercero») */
export const MOMENTOS_SECCION: Record<string, MomentoVideo[]> = {
  "compras-1-tercero": [
    {
      "capitulo": 2,
      "t": 571,
      "tCap": 110,
      "titulo": "Qué es un tercero"
    },
    {
      "capitulo": 2,
      "t": 604,
      "tCap": 143,
      "titulo": "Alta del tercero"
    }
  ],
  "compras-1-relaciones": [
    {
      "capitulo": 8,
      "t": 4159,
      "tCap": 206,
      "titulo": "La subcuenta del proveedor en el asiento"
    }
  ],
  "compras-1-direcciones": [
    {
      "capitulo": 2,
      "t": 693,
      "tCap": 232,
      "titulo": "La dirección del tercero"
    }
  ],
  "compras-1-condiciones": [
    {
      "capitulo": 2,
      "t": 761,
      "tCap": 300,
      "titulo": "Condiciones de pago del tercero"
    },
    {
      "capitulo": 2,
      "t": 745,
      "tCap": 284,
      "titulo": "Validar el tercero"
    }
  ],
  "compras-1-lista": [
    {
      "capitulo": 3,
      "t": 1072,
      "tCap": 10,
      "titulo": "Qué es una lista de precios"
    },
    {
      "capitulo": 3,
      "t": 1182,
      "tCap": 120,
      "titulo": "La lista COM"
    },
    {
      "capitulo": 3,
      "t": 1229,
      "tCap": 167,
      "titulo": "La línea de precio del artículo"
    }
  ],
  "compras-1-grupo": [
    {
      "capitulo": 3,
      "t": 1144,
      "tCap": 82,
      "titulo": "Del proveedor al precio"
    },
    {
      "capitulo": 3,
      "t": 1283,
      "tCap": 221,
      "titulo": "El grupo de precios"
    }
  ],
  "compras-1-proveedor": [
    {
      "capitulo": 2,
      "t": 521,
      "tCap": 60,
      "titulo": "Qué contiene la ficha de un proveedor"
    },
    {
      "capitulo": 2,
      "t": 803,
      "tCap": 342,
      "titulo": "Alta del proveedor"
    }
  ],
  "compras-tipos-numerador": [
    {
      "capitulo": 4,
      "t": 1463,
      "tCap": 95,
      "titulo": "Numerador y máscara de serie"
    },
    {
      "capitulo": 4,
      "t": 1525,
      "tCap": 157,
      "titulo": "La rotura"
    },
    {
      "capitulo": 4,
      "t": 1642,
      "tCap": 274,
      "titulo": "Numerador de documentos"
    }
  ],
  "compras-3-tip-oferta": [
    {
      "capitulo": 4,
      "t": 1414,
      "tCap": 46,
      "titulo": "Qué es el tipo de documento",
      "fin": 95
    }
  ],
  "compras-2-tip-factura": [
    {
      "capitulo": 4,
      "t": 1613,
      "tCap": 245,
      "titulo": "La numeración legal de las facturas"
    },
    {
      "capitulo": 4,
      "t": 2128,
      "tCap": 760,
      "titulo": "El tipo de factura"
    }
  ],
  "compras-2-albaran": [
    {
      "capitulo": 6,
      "t": 3019,
      "tCap": 8,
      "titulo": "Qué es un albarán"
    },
    {
      "capitulo": 6,
      "t": 3053,
      "tCap": 42,
      "titulo": "El albarán nace del pedido"
    },
    {
      "capitulo": 6,
      "t": 3207,
      "tCap": 196,
      "titulo": "La cabecera del albarán"
    },
    {
      "capitulo": 6,
      "t": 3323,
      "tCap": 312,
      "titulo": "Validar el albarán"
    },
    {
      "capitulo": 6,
      "t": 3501,
      "tCap": 490,
      "titulo": "El pedido queda servido"
    }
  ],
  "compras-2-factura": [
    {
      "capitulo": 7,
      "t": 3573,
      "tCap": 7,
      "titulo": "Qué es una factura de compra"
    },
    {
      "capitulo": 7,
      "t": 3669,
      "tCap": 103,
      "titulo": "Generar la factura"
    },
    {
      "capitulo": 7,
      "t": 3867,
      "tCap": 301,
      "titulo": "Validar la factura"
    }
  ],
  "compras-2-conformar": [
    {
      "capitulo": 7,
      "t": 3669,
      "tCap": 103,
      "titulo": "La factura nace del albarán"
    },
    {
      "capitulo": 7,
      "t": 3822,
      "tCap": 256,
      "titulo": "Importe declarado frente a calculado"
    }
  ],
  "compras-2-contabilizar": [
    {
      "capitulo": 6,
      "t": 3458,
      "tCap": 447,
      "titulo": "Contabilizar el albarán"
    },
    {
      "capitulo": 8,
      "t": 4228,
      "tCap": 275,
      "titulo": "Contabilizar la factura"
    },
    {
      "capitulo": 8,
      "t": 4280,
      "tCap": 327,
      "titulo": "Leer el asiento de la factura"
    }
  ],
  "compras-3-oferta": [
    {
      "capitulo": 1,
      "t": 134,
      "tCap": 134,
      "titulo": "El ciclo puede empezar antes: la oferta",
      "fin": 167
    }
  ],
  "compras-3-tip-pedido": [
    {
      "capitulo": 4,
      "t": 1690,
      "tCap": 322,
      "titulo": "El numerador del pedido"
    },
    {
      "capitulo": 4,
      "t": 1849,
      "tCap": 481,
      "titulo": "Los tipos de pedido"
    },
    {
      "capitulo": 4,
      "t": 1888,
      "tCap": 520,
      "titulo": "El tipo de pedido por dentro"
    }
  ],
  "compras-3-pedido": [
    {
      "capitulo": 5,
      "t": 2278,
      "tCap": 7,
      "titulo": "Qué es un pedido"
    },
    {
      "capitulo": 5,
      "t": 2381,
      "tCap": 110,
      "titulo": "Crear el pedido"
    },
    {
      "capitulo": 5,
      "t": 2784,
      "tCap": 513,
      "titulo": "Las líneas del pedido"
    },
    {
      "capitulo": 5,
      "t": 2931,
      "tCap": 660,
      "titulo": "Validar el pedido"
    }
  ],
  "compras-3-tip-albaran-origen": [
    {
      "capitulo": 4,
      "t": 1974,
      "tCap": 606,
      "titulo": "El tipo de albarán dentro del pedido"
    },
    {
      "capitulo": 4,
      "t": 2087,
      "tCap": 719,
      "titulo": "El tipo de albarán"
    }
  ],
  "maestros-1-terceros": [
    {
      "capitulo": 2,
      "t": 604,
      "tCap": 143,
      "titulo": "Alta del tercero"
    },
    {
      "capitulo": 2,
      "t": 745,
      "tCap": 284,
      "titulo": "Validar el tercero"
    }
  ],
  "maestros-1-plazos": [
    {
      "capitulo": 2,
      "t": 775,
      "tCap": 314,
      "titulo": "Plazo de pago del tercero"
    }
  ],
  "maestros-1-tipos-efecto": [
    {
      "capitulo": 2,
      "t": 767,
      "tCap": 306,
      "titulo": "Tipo de efecto del tercero"
    }
  ],
  "maestros-1-cuentas-perfil": [
    {
      "capitulo": 8,
      "t": 3995,
      "tCap": 42,
      "titulo": "Qué es una cuenta contable"
    },
    {
      "capitulo": 8,
      "t": 4159,
      "tCap": 206,
      "titulo": "La subcuenta del proveedor"
    }
  ],
  "maestros-2-articulos-log": [
    {
      "capitulo": 2,
      "t": 901,
      "tCap": 440,
      "titulo": "Qué es un artículo"
    },
    {
      "capitulo": 2,
      "t": 954,
      "tCap": 493,
      "titulo": "La ficha del artículo"
    }
  ],
  "asientos-2-lineas": [
    {
      "capitulo": 8,
      "t": 4006,
      "tCap": 53,
      "titulo": "El debe y el haber"
    },
    {
      "capitulo": 8,
      "t": 4280,
      "tCap": 327,
      "titulo": "Leer las líneas de un asiento"
    }
  ],
  "asientos-3-cuadre": [
    {
      "capitulo": 8,
      "t": 4021,
      "tCap": 68,
      "titulo": "La regla de oro: el asiento cuadra"
    },
    {
      "capitulo": 8,
      "t": 4362,
      "tCap": 409,
      "titulo": "Comprobar el cuadre"
    }
  ],
  "carteras-1-plazo": [
    {
      "capitulo": 2,
      "t": 775,
      "tCap": 314,
      "titulo": "Plazo de pago del tercero"
    }
  ],
  "carteras-1-tipo-efecto": [
    {
      "capitulo": 2,
      "t": 767,
      "tCap": 306,
      "titulo": "Tipo de efecto del tercero"
    }
  ],
  "carteras-1-tercero": [
    {
      "capitulo": 2,
      "t": 761,
      "tCap": 300,
      "titulo": "Condiciones de pago del tercero"
    }
  ],
  "carteras-1-factura-compra": [
    {
      "capitulo": 7,
      "t": 3806,
      "tCap": 240,
      "titulo": "El vencimiento de la factura de compra"
    }
  ]
};

/** Momentos del vídeo por id de ejercicio («compras-2») */
export const MOMENTOS_EJERCICIO: Record<string, MomentoVideo[]> = {
  "compras-1": [
    {
      "capitulo": 2,
      "t": 604,
      "tCap": 143,
      "titulo": "Alta del tercero"
    },
    {
      "capitulo": 2,
      "t": 693,
      "tCap": 232,
      "titulo": "La dirección del tercero"
    },
    {
      "capitulo": 2,
      "t": 761,
      "tCap": 300,
      "titulo": "Condiciones de pago"
    },
    {
      "capitulo": 2,
      "t": 803,
      "tCap": 342,
      "titulo": "Alta del proveedor"
    },
    {
      "capitulo": 2,
      "t": 901,
      "tCap": 440,
      "titulo": "Qué es un artículo"
    }
  ],
  "compras-precios": [
    {
      "capitulo": 3,
      "t": 1182,
      "tCap": 120,
      "titulo": "La lista de precios"
    },
    {
      "capitulo": 3,
      "t": 1283,
      "tCap": 221,
      "titulo": "El grupo de precios"
    }
  ],
  "compras-tipos": [
    {
      "capitulo": 4,
      "t": 1463,
      "tCap": 95,
      "titulo": "Numerador y máscara de serie"
    },
    {
      "capitulo": 4,
      "t": 1849,
      "tCap": 481,
      "titulo": "Los tipos de pedido"
    },
    {
      "capitulo": 4,
      "t": 2087,
      "tCap": 719,
      "titulo": "El tipo de albarán"
    },
    {
      "capitulo": 4,
      "t": 2128,
      "tCap": 760,
      "titulo": "El tipo de factura"
    }
  ],
  "compras-3": [
    {
      "capitulo": 1,
      "t": 134,
      "tCap": 134,
      "titulo": "El ciclo puede empezar antes: la oferta",
      "fin": 167
    },
    {
      "capitulo": 5,
      "t": 2381,
      "tCap": 110,
      "titulo": "Crear el pedido"
    },
    {
      "capitulo": 5,
      "t": 2931,
      "tCap": 660,
      "titulo": "Validar el pedido"
    }
  ],
  "compras-2": [
    {
      "capitulo": 6,
      "t": 3053,
      "tCap": 42,
      "titulo": "El albarán nace del pedido"
    },
    {
      "capitulo": 6,
      "t": 3207,
      "tCap": 196,
      "titulo": "La cabecera del albarán"
    },
    {
      "capitulo": 6,
      "t": 3323,
      "tCap": 312,
      "titulo": "Validar el albarán"
    }
  ],
  "compras-factura": [
    {
      "capitulo": 7,
      "t": 3669,
      "tCap": 103,
      "titulo": "Generar la factura"
    },
    {
      "capitulo": 7,
      "t": 3822,
      "tCap": 256,
      "titulo": "Importe declarado frente a calculado"
    },
    {
      "capitulo": 8,
      "t": 4228,
      "tCap": 275,
      "titulo": "Contabilizar la factura"
    },
    {
      "capitulo": 9,
      "t": 4841,
      "tCap": 394,
      "titulo": "Docflow: el rastro de la compra"
    }
  ],
  "maestros-1": [
    {
      "capitulo": 2,
      "t": 604,
      "tCap": 143,
      "titulo": "Alta del tercero"
    },
    {
      "capitulo": 2,
      "t": 767,
      "tCap": 306,
      "titulo": "Tipo de efecto y plazo de pago"
    },
    {
      "capitulo": 8,
      "t": 3995,
      "tCap": 42,
      "titulo": "Qué es una cuenta contable"
    }
  ],
  "maestros-2": [
    {
      "capitulo": 2,
      "t": 954,
      "tCap": 493,
      "titulo": "La ficha del artículo"
    }
  ],
  "asientos-2": [
    {
      "capitulo": 8,
      "t": 4006,
      "tCap": 53,
      "titulo": "El debe y el haber"
    },
    {
      "capitulo": 8,
      "t": 4280,
      "tCap": 327,
      "titulo": "Leer las líneas de un asiento"
    }
  ],
  "asientos-3": [
    {
      "capitulo": 8,
      "t": 4021,
      "tCap": 68,
      "titulo": "La regla de oro: el asiento cuadra"
    },
    {
      "capitulo": 8,
      "t": 4362,
      "tCap": 409,
      "titulo": "Comprobar el cuadre"
    }
  ],
  "carteras-1": [
    {
      "capitulo": 2,
      "t": 761,
      "tCap": 300,
      "titulo": "Condiciones de pago del tercero"
    },
    {
      "capitulo": 7,
      "t": 3806,
      "tCap": 240,
      "titulo": "El vencimiento de la factura de compra"
    }
  ]
};

/** Vídeo de presentación de un módulo: va en «Antes de empezar» de su página, antes de los bloques */
export const MOMENTOS_MODULO: Record<string, MomentoVideo[]> = {
  "compras": [
    {
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Bienvenida: el módulo de compras"
    }
  ]
};

export function momentosDeSeccion(id: string): MomentoVideo[] {
  return MOMENTOS_SECCION[id] ?? [];
}

export function momentosDeEjercicio(id: string): MomentoVideo[] {
  return MOMENTOS_EJERCICIO[id] ?? [];
}

/** Ruta interna de la app que abre el reproductor en ese momento */
export function rutaMomento(m: MomentoVideo) {
  return `/video/${m.capitulo}?t=${Math.round(m.tCap)}`;
}
