/** Vídeos de las sesiones de formación de finanzas, troceados en capítulos (Release «video-finanzas-v1»).
 * Generado por montaje.py a partir del análisis de cada vídeo (transcripción + fotogramas). */
import type { CapituloVideo, MomentoVideo } from './videoMapa';

export interface SerieFin {
  id: string;
  titulo: string;
  corto: string;
  intro?: string;
  /** Módulos de la plataforma en cuya página se muestra */
  modulos: string[];
  capitulos: CapituloVideo[];
}

export const SERIES_FIN: SerieFin[] = [
  {
    "id": "fin-icon1",
    "titulo": "Sesión de finanzas 1: de la factura a la remesa",
    "corto": "Sesión 1",
    "intro": "Contabilizas una factura, creas facturas directas y preparas la primera remesa.",
    "modulos": [
      "icon-contabilidad",
      "icon-cartera",
      "maestros"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Contabilizar una factura de gestión",
        "inicio": 0,
        "duracion": 148,
        "escenas": [
          {
            "t": 0,
            "titulo": "Factura de compra con origen albarán"
          },
          {
            "t": 17,
            "titulo": "Módulos de gestión y de finanzas"
          },
          {
            "t": 44,
            "titulo": "Contabilizar la factura"
          },
          {
            "t": 74,
            "titulo": "Se generan tres cosas"
          },
          {
            "t": 91,
            "titulo": "El asiento contable y su cuadre"
          },
          {
            "t": 103,
            "titulo": "La cartera de efectos"
          },
          {
            "t": 123,
            "titulo": "Los registros fiscales (IVA)"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Maestro de empresas (cempresa)",
        "inicio": 148,
        "duracion": 456,
        "escenas": [
          {
            "t": 4,
            "titulo": "Entrar al maestro de empresas"
          },
          {
            "t": 35,
            "titulo": "Parametrizar antes de facturar y remesar"
          },
          {
            "t": 87,
            "titulo": "Tercero de ejemplo: Sorbitos Café"
          },
          {
            "t": 113,
            "titulo": "Fecha de inicio, moneda y nombre"
          },
          {
            "t": 219,
            "titulo": "Crear el ejercicio contable 2026"
          },
          {
            "t": 241,
            "titulo": "Crear el banco propio"
          },
          {
            "t": 325,
            "titulo": "Cuenta contable 57.9 de bancos"
          },
          {
            "t": 426,
            "titulo": "Excel de práctica para tu empresa"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Factura directa de compra (FC)",
        "inicio": 604,
        "duracion": 201,
        "escenas": [
          {
            "t": 0,
            "titulo": "Facturas directas desde finanzas"
          },
          {
            "t": 33,
            "titulo": "Tipo FC, empresa y proveedor"
          },
          {
            "t": 89,
            "titulo": "Datos financieros y cuenta obligatoria"
          },
          {
            "t": 103,
            "titulo": "Número de factura y factura proveedor"
          },
          {
            "t": 151,
            "titulo": "Validar: importe total y de factura"
          },
          {
            "t": 162,
            "titulo": "Contabilizar la factura"
          },
          {
            "t": 184,
            "titulo": "Detalle de impuestos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Factura directa de venta (FB) y su error",
        "inicio": 805,
        "duracion": 230,
        "escenas": [
          {
            "t": 0,
            "titulo": "Factura de ventas: tipo FB"
          },
          {
            "t": 56,
            "titulo": "No deja validar la factura"
          },
          {
            "t": 227,
            "titulo": "Error del entorno: lo revisa sistemas"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Rectificativa frente a sustitutiva",
        "inicio": 1092,
        "duracion": 230,
        "escenas": [
          {
            "t": 3,
            "titulo": "La rectificativa corrige sin anular"
          },
          {
            "t": 22,
            "titulo": "En España queda registro de todo"
          },
          {
            "t": 48,
            "titulo": "La sustitutiva anula la inicial"
          },
          {
            "t": 71,
            "titulo": "Diferencia entre las dos"
          },
          {
            "t": 100,
            "titulo": "Gestión y finanzas en el cliente"
          },
          {
            "t": 188,
            "titulo": "¿Va vinculada al flujo original?"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Remesas: qué son y cómo se configuran",
        "inicio": 1326,
        "duracion": 220,
        "escenas": [
          {
            "t": 0,
            "titulo": "Remesa: cobrar o pagar facturas"
          },
          {
            "t": 106,
            "titulo": "Ruta de Cobros y Pagos"
          },
          {
            "t": 123,
            "titulo": "Crear la remesa: empresa y cuenta"
          },
          {
            "t": 142,
            "titulo": "Clase Pagar o Cobrar"
          },
          {
            "t": 156,
            "titulo": "Remesas por cuenta en bancos propios"
          },
          {
            "t": 177,
            "titulo": "Añadir cobro y pago con tesorería"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Remesar una factura y repaso final",
        "inicio": 1546,
        "duracion": 530,
        "escenas": [
          {
            "t": 15,
            "titulo": "Filtrar los efectos por tercero"
          },
          {
            "t": 38,
            "titulo": "No carga ningún efecto"
          },
          {
            "t": 81,
            "titulo": "Efecto cheque frente a remesa transferencia"
          },
          {
            "t": 124,
            "titulo": "Probamos con otra factura"
          },
          {
            "t": 304,
            "titulo": "La factura debe jalar su efecto"
          },
          {
            "t": 383,
            "titulo": "Repaso: la cartera de efectos"
          },
          {
            "t": 442,
            "titulo": "Repaso: contabilizar genera tres cosas"
          },
          {
            "t": 477,
            "titulo": "El asiento contable siempre cuadra"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon1-cap07.jpg"
      }
    ]
  },
  {
    "id": "fin-icon11",
    "titulo": "Sesión de finanzas 2: remesas paso a paso",
    "corto": "Sesión 2",
    "intro": "Recorres una remesa completa y aprendes por qué una factura no contabiliza o no remesa.",
    "modulos": [
      "icon-cartera",
      "icon-contabilidad"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "El circuito: de la factura al banco",
        "inicio": 0,
        "duracion": 237,
        "escenas": [
          {
            "t": 0,
            "titulo": "¿Qué es un asiento contable?"
          },
          {
            "t": 56,
            "titulo": "Ejemplo: compra de un portátil"
          },
          {
            "t": 99,
            "titulo": "La factura genera asiento, cartera y fiscal"
          },
          {
            "t": 118,
            "titulo": "Remesa: cobros y pagos"
          },
          {
            "t": 137,
            "titulo": "Extracto bancario"
          },
          {
            "t": 173,
            "titulo": "Conciliación bancaria"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Contabilizar la factura de compra",
        "inicio": 239,
        "duracion": 126,
        "escenas": [
          {
            "t": 0,
            "titulo": "Factura de compra origen albarán"
          },
          {
            "t": 16,
            "titulo": "Pulsar Contabilizar"
          },
          {
            "t": 23,
            "titulo": "El asiento contable generado"
          },
          {
            "t": 46,
            "titulo": "Cartera de efectos: la deuda de 1.815"
          },
          {
            "t": 106,
            "titulo": "Clase Pagar y tipo de efecto TF"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Importe cero y tipos de remesa",
        "inicio": 365,
        "duracion": 192,
        "escenas": [
          {
            "t": 0,
            "titulo": "Pasamos a remesar la factura"
          },
          {
            "t": 17,
            "titulo": "Facturas con importe cero"
          },
          {
            "t": 43,
            "titulo": "Sin cartera de efectos no hay remesa"
          },
          {
            "t": 86,
            "titulo": "Nueva remesa: empresa y cuenta"
          },
          {
            "t": 133,
            "titulo": "Tipo de remesa en la empresa"
          },
          {
            "t": 141,
            "titulo": "Remesas por cuenta"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Crear la remesa y evolucionar su estado",
        "inicio": 557,
        "duracion": 129,
        "escenas": [
          {
            "t": 0,
            "titulo": "Selección de efectos"
          },
          {
            "t": 18,
            "titulo": "Filtrar por proveedor"
          },
          {
            "t": 52,
            "titulo": "Agregar el efecto a la remesa"
          },
          {
            "t": 69,
            "titulo": "Evolucionar estado"
          },
          {
            "t": 79,
            "titulo": "Se genera tesorería"
          },
          {
            "t": 91,
            "titulo": "Asiento contable de la remesa"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Rectificativas y sustitutivas",
        "inicio": 686,
        "duracion": 114,
        "escenas": [
          {
            "t": 0,
            "titulo": "Dudas tras la remesa"
          },
          {
            "t": 11,
            "titulo": "Factura rectificativa y sustitutiva"
          },
          {
            "t": 75,
            "titulo": "Objetivo: llegar a remesar"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Periodos contables cerrados",
        "inicio": 885,
        "duracion": 65,
        "escenas": [
          {
            "t": 0,
            "titulo": "Ejercicio 2026 en la empresa"
          },
          {
            "t": 26,
            "titulo": "Enero a junio cerrados: empieza en julio"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Remesar varias facturas",
        "inicio": 1035,
        "duracion": 185,
        "escenas": [
          {
            "t": 0,
            "titulo": "Ruta Finanzas, Cobros y Pagos, Remesas"
          },
          {
            "t": 10,
            "titulo": "Facturas disponibles y varios terceros"
          },
          {
            "t": 67,
            "titulo": "Circuito completo: asiento, cartera, remesa"
          },
          {
            "t": 149,
            "titulo": "Pasar a provisional y cambiar el efecto a TF"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap07.jpg"
      },
      {
        "n": 8,
        "titulo": "Errores al contabilizar y mezclar efectos",
        "inicio": 1220,
        "duracion": 220,
        "escenas": [
          {
            "t": 0,
            "titulo": "Error de tipo de documento y asiento"
          },
          {
            "t": 33,
            "titulo": "Asientos EPC en compras y FB en ventas"
          },
          {
            "t": 47,
            "titulo": "Domiciliación bancaria no informada"
          },
          {
            "t": 111,
            "titulo": "Dos efectos del mismo tipo sí"
          },
          {
            "t": 120,
            "titulo": "Mezclar cheque y TF no evoluciona"
          },
          {
            "t": 216,
            "titulo": "Probar cobros y pagos con varios efectos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon11-cap08.jpg"
      }
    ]
  },
  {
    "id": "fin-icon2",
    "titulo": "Sesión de finanzas 3: extracto y conciliación",
    "corto": "Sesión 3",
    "intro": "Del extracto bancario a la conciliación y la contabilización del cobro o el pago.",
    "modulos": [
      "icon-cartera"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Extracto y conciliación bancaria",
        "inicio": 13,
        "duracion": 165,
        "escenas": [
          {
            "t": 0,
            "titulo": "El circuito de tesorería"
          },
          {
            "t": 16,
            "titulo": "Qué es un extracto bancario"
          },
          {
            "t": 65,
            "titulo": "Qué es una conciliación"
          },
          {
            "t": 122,
            "titulo": "Diferencia entre extracto y conciliación"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon2-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Crear el extracto de una remesa de pago",
        "inicio": 178,
        "duracion": 327,
        "escenas": [
          {
            "t": 8,
            "titulo": "Ruta de Extractos bancarios"
          },
          {
            "t": 55,
            "titulo": "Empresa y fecha de operación"
          },
          {
            "t": 94,
            "titulo": "Conceptos 04 y 13"
          },
          {
            "t": 122,
            "titulo": "Importe 1524,60 y signo del banco"
          },
          {
            "t": 294,
            "titulo": "Guardar y conciliación automática"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon2-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Conciliar y contabilizar el pago",
        "inicio": 505,
        "duracion": 265,
        "escenas": [
          {
            "t": 3,
            "titulo": "Ruta de Conciliación bancaria"
          },
          {
            "t": 40,
            "titulo": "Filtros: empresa, cuenta y fechas"
          },
          {
            "t": 72,
            "titulo": "Extracto y tesorería pendientes"
          },
          {
            "t": 142,
            "titulo": "Conciliar tesorería"
          },
          {
            "t": 162,
            "titulo": "Contabilizar y apuntes neteados"
          },
          {
            "t": 216,
            "titulo": "Gestión de origen y efectos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon2-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Extracto y conciliación de un cobro",
        "inicio": 770,
        "duracion": 365,
        "escenas": [
          {
            "t": 0,
            "titulo": "Remesa de clase cobrar"
          },
          {
            "t": 109,
            "titulo": "Empresa y conceptos"
          },
          {
            "t": 155,
            "titulo": "Importe 5082 en negativo"
          },
          {
            "t": 277,
            "titulo": "Conciliar 5082"
          },
          {
            "t": 340,
            "titulo": "Contabilizar el cobro"
          }
        ],
        "url": "",
        "poster": "video/finanzas/icon2-cap04.jpg"
      }
    ]
  },
  {
    "id": "fin-maestros",
    "titulo": "Maestros contables",
    "corto": "Maestros",
    "intro": "Planes y cuentas, mnemotécnicos, empresas y la ficha del tercero.",
    "modulos": [
      "maestros"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Introducción y planes contables",
        "inicio": 30,
        "duracion": 179,
        "escenas": [
          {
            "t": 0,
            "titulo": "Menú Finanzas y punto de partida"
          },
          {
            "t": 62,
            "titulo": "Pantalla de planes contables"
          },
          {
            "t": 76,
            "titulo": "Qué es un plan contable"
          },
          {
            "t": 133,
            "titulo": "Planes por país"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Cuentas contables e indicadores",
        "inicio": 209,
        "duracion": 345,
        "escenas": [
          {
            "t": 0,
            "titulo": "Dónde se crean las cuentas"
          },
          {
            "t": 46,
            "titulo": "Cuenta 10200 Capital"
          },
          {
            "t": 64,
            "titulo": "El punto y el código de tercero"
          },
          {
            "t": 159,
            "titulo": "Debe/haber, terceros y costes"
          },
          {
            "t": 215,
            "titulo": "Impuestos y cartera"
          },
          {
            "t": 290,
            "titulo": "Periodificable"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Mnemotécnicos de cuentas",
        "inicio": 554,
        "duracion": 165,
        "escenas": [
          {
            "t": 1,
            "titulo": "Tabla de mnemotécnicos"
          },
          {
            "t": 12,
            "titulo": "Códigos no contables"
          },
          {
            "t": 95,
            "titulo": "Cabecera y líneas con plan y cuenta"
          },
          {
            "t": 127,
            "titulo": "Otras tablas piden mnemotécnico"
          },
          {
            "t": 157,
            "titulo": "Resumen: plan, cuentas y mnemotécnicos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Maestro de empresas y vínculo a tercero",
        "inicio": 720,
        "duracion": 284,
        "escenas": [
          {
            "t": 0,
            "titulo": "Abrir el maestro de empresas"
          },
          {
            "t": 38,
            "titulo": "Concepto multiempresa"
          },
          {
            "t": 70,
            "titulo": "Código, nombre y fecha de inicio"
          },
          {
            "t": 126,
            "titulo": "Identificación fiscal y zona impositiva"
          },
          {
            "t": 156,
            "titulo": "Vínculo empresa-tercero"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Datos contables y ficha del tercero",
        "inicio": 1004,
        "duracion": 466,
        "escenas": [
          {
            "t": 0,
            "titulo": "Plan contable de la empresa"
          },
          {
            "t": 82,
            "titulo": "Moneda funcional euro"
          },
          {
            "t": 149,
            "titulo": "Cuentas de cierres y calendario"
          },
          {
            "t": 212,
            "titulo": "Ficha del tercero y datos fiscales"
          },
          {
            "t": 350,
            "titulo": "Tipo de tercero 100"
          },
          {
            "t": 400,
            "titulo": "Tabla c_tipo_ter y mnemotécnicos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Direcciones, bancos y condiciones",
        "inicio": 1471,
        "duracion": 436,
        "escenas": [
          {
            "t": 0,
            "titulo": "Workflow de validación"
          },
          {
            "t": 98,
            "titulo": "Formulario y tablas hijas"
          },
          {
            "t": 132,
            "titulo": "Direcciones y zona impositiva"
          },
          {
            "t": 168,
            "titulo": "Datos bancarios"
          },
          {
            "t": 220,
            "titulo": "Condiciones comerciales"
          },
          {
            "t": 271,
            "titulo": "Estados de cartera"
          },
          {
            "t": 398,
            "titulo": "Formas de pago"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Interfaz de VNext y alta rápida",
        "inicio": 1908,
        "duracion": 281,
        "escenas": [
          {
            "t": 0,
            "titulo": "Presentación de la interfaz"
          },
          {
            "t": 19,
            "titulo": "De pestañas a links"
          },
          {
            "t": 37,
            "titulo": "Vista previa de tablas relacionadas"
          },
          {
            "t": 80,
            "titulo": "Alta sin salir del formulario"
          },
          {
            "t": 117,
            "titulo": "Autocompletado en factura"
          },
          {
            "t": 126,
            "titulo": "Un tercero por empresa"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap07.jpg"
      },
      {
        "n": 8,
        "titulo": "Relaciones contables del tercero",
        "inicio": 2195,
        "duracion": 451,
        "escenas": [
          {
            "t": 0,
            "titulo": "Terminación de la cuenta"
          },
          {
            "t": 50,
            "titulo": "Nueva relación contable y fallo"
          },
          {
            "t": 129,
            "titulo": "Tercero FEDA 00074"
          },
          {
            "t": 154,
            "titulo": "El código tras el punto es el tercero"
          },
          {
            "t": 274,
            "titulo": "Proveedor o cliente según la cuenta"
          },
          {
            "t": 301,
            "titulo": "Preguntas sobre la normativa contable"
          }
        ],
        "url": "",
        "poster": "video/finanzas/maestros-cap08.jpg"
      }
    ]
  },
  {
    "id": "fin-tax-intro",
    "titulo": "Impuestos: conceptos básicos",
    "corto": "Conceptos",
    "intro": "Qué es un impuesto, cómo se clasifica y cómo se liquida el IVA.",
    "modulos": [
      "icon-impuestos"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Historia e impuestos directos e indirectos",
        "inicio": 254,
        "duracion": 557,
        "escenas": [
          {
            "t": 0,
            "titulo": "Arranque de la sesión"
          },
          {
            "t": 47,
            "titulo": "Los impuestos en la Antigüedad"
          },
          {
            "t": 166,
            "titulo": "Origen romano: el fiscus"
          },
          {
            "t": 298,
            "titulo": "Tax Freedom Day"
          },
          {
            "t": 352,
            "titulo": "Impuestos directos e indirectos"
          },
          {
            "t": 503,
            "titulo": "IGV, IVA y GST, impuestos equivalentes"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Jurisdicción fiscal y doble imposición",
        "inicio": 811,
        "duracion": 365,
        "escenas": [
          {
            "t": 0,
            "titulo": "Estatal, regional y municipal"
          },
          {
            "t": 71,
            "titulo": "SUNAT, DIAN y agencia tributaria"
          },
          {
            "t": 166,
            "titulo": "Doble imposición"
          },
          {
            "t": 235,
            "titulo": "Operación sujeta o no sujeta"
          },
          {
            "t": 316,
            "titulo": "Afecta o inafecta"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Tipos de gravamen y exenciones",
        "inicio": 1176,
        "duracion": 282,
        "escenas": [
          {
            "t": 0,
            "titulo": "¿Qué porcentaje aplico?"
          },
          {
            "t": 15,
            "titulo": "Exonerado o exento: sujeta al 0 %"
          },
          {
            "t": 106,
            "titulo": "Tipo normal del impuesto"
          },
          {
            "t": 184,
            "titulo": "Tipos reducidos y superreducidos"
          },
          {
            "t": 225,
            "titulo": "Tipo normal y gravámenes de lujo"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Zonas fiscales y tipos de persona",
        "inicio": 1458,
        "duracion": 579,
        "escenas": [
          {
            "t": 0,
            "titulo": "Repaso: jurisdicción, tipo y porcentaje"
          },
          {
            "t": 69,
            "titulo": "Zona de origen y zona de destino"
          },
          {
            "t": 127,
            "titulo": "Exportación y operación local"
          },
          {
            "t": 273,
            "titulo": "Importación y aranceles"
          },
          {
            "t": 320,
            "titulo": "Persona física y persona jurídica"
          },
          {
            "t": 441,
            "titulo": "Identificación fiscal: DNI, RUC, NIF"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Bienes, servicios y excepciones",
        "inicio": 2037,
        "duracion": 320,
        "escenas": [
          {
            "t": 0,
            "titulo": "¿Qué es lo que se vende?"
          },
          {
            "t": 23,
            "titulo": "Bienes tangibles y servicios"
          },
          {
            "t": 109,
            "titulo": "Excepciones por rubro"
          },
          {
            "t": 145,
            "titulo": "Excepciones por ubicación"
          },
          {
            "t": 286,
            "titulo": "Excepciones por interés del legislador"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Régimen fiscal y mecanismos de recaudación",
        "inicio": 2357,
        "duracion": 394,
        "escenas": [
          {
            "t": 59,
            "titulo": "El cuadrilátero fiscal"
          },
          {
            "t": 103,
            "titulo": "Régimen fiscal o tax scheme"
          },
          {
            "t": 120,
            "titulo": "Regímenes según el tamaño"
          },
          {
            "t": 263,
            "titulo": "Informalidad tributaria"
          },
          {
            "t": 302,
            "titulo": "Los tres mecanismos de recaudación"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Percepción y retención",
        "inicio": 2751,
        "duracion": 303,
        "escenas": [
          {
            "t": 12,
            "titulo": "Percepción o recargo"
          },
          {
            "t": 47,
            "titulo": "Ejemplo: 10 cajas a 2 soles"
          },
          {
            "t": 104,
            "titulo": "2 % adicional de percepción"
          },
          {
            "t": 175,
            "titulo": "Retención: el caso inverso"
          },
          {
            "t": 244,
            "titulo": "Pago neto: 224,2"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap07.jpg"
      },
      {
        "n": 8,
        "titulo": "Detracción o split payment",
        "inicio": 3054,
        "duracion": 283,
        "escenas": [
          {
            "t": 0,
            "titulo": "Tercer mecanismo: la detracción"
          },
          {
            "t": 56,
            "titulo": "Reservar el pago del impuesto"
          },
          {
            "t": 106,
            "titulo": "Cuenta normal y cuenta fiscal"
          },
          {
            "t": 153,
            "titulo": "Split: 212 y 24"
          },
          {
            "t": 193,
            "titulo": "Autodetracción"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap08.jpg"
      },
      {
        "n": 9,
        "titulo": "Liquidación de IVA y cierre",
        "inicio": 3337,
        "duracion": 338,
        "escenas": [
          {
            "t": 0,
            "titulo": "Facturas de compra y de venta"
          },
          {
            "t": 76,
            "titulo": "IVA cobrado menos IVA pagado"
          },
          {
            "t": 118,
            "titulo": "Ejemplo: 472 cobrado"
          },
          {
            "t": 162,
            "titulo": "Crédito fiscal"
          },
          {
            "t": 201,
            "titulo": "Síntesis y próxima sesión"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-intro-cap09.jpg"
      }
    ]
  },
  {
    "id": "fin-tax-tablas",
    "titulo": "Impuestos: tablas maestras",
    "corto": "Tablas",
    "intro": "Las tablas que deciden qué impuesto lleva cada línea de una factura.",
    "modulos": [
      "icon-impuestos"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Registro fiscal, periodos y agencias",
        "inicio": 0,
        "duracion": 504,
        "escenas": [
          {
            "t": 0,
            "titulo": "Impuestos en cabecera y líneas"
          },
          {
            "t": 117,
            "titulo": "Operación fiscal y tipo de impuesto"
          },
          {
            "t": 227,
            "titulo": "Capítulos, grupos y líneas de declaración"
          },
          {
            "t": 286,
            "titulo": "Periodos fiscales y agencias tributarias"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Origen del dato y mapa de maestros",
        "inicio": 504,
        "duracion": 453,
        "escenas": [
          {
            "t": 0,
            "titulo": "De dónde llegan los datos fiscales"
          },
          {
            "t": 99,
            "titulo": "Operaciones, tipos y clases"
          },
          {
            "t": 198,
            "titulo": "Claves de artículo, tercero y documento"
          },
          {
            "t": 229,
            "titulo": "Zonas fiscales"
          },
          {
            "t": 399,
            "titulo": "Bienes inmuebles y grupos de IVA"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Datos fiscales de empresa y tercero",
        "inicio": 957,
        "duracion": 317,
        "escenas": [
          {
            "t": 0,
            "titulo": "Identificación fiscal de la empresa"
          },
          {
            "t": 51,
            "titulo": "NIF, país y tipo en el tercero"
          },
          {
            "t": 213,
            "titulo": "Esquemas y regímenes del tercero"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Reglas de asignación en el ERP",
        "inicio": 1290,
        "duracion": 410,
        "escenas": [
          {
            "t": 0,
            "titulo": "Entrada al menú Impuestos › Maestros"
          },
          {
            "t": 88,
            "titulo": "La regla 1137 y sus condiciones"
          },
          {
            "t": 251,
            "titulo": "Zona fiscal en la empresa"
          },
          {
            "t": 318,
            "titulo": "Zona fiscal en las direcciones del tercero"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Artículo, factura y regla 2586",
        "inicio": 1700,
        "duracion": 490,
        "escenas": [
          {
            "t": 0,
            "titulo": "Clave fiscal BOG del artículo"
          },
          {
            "t": 104,
            "titulo": "Factura de compra de ejemplo"
          },
          {
            "t": 142,
            "titulo": "Impuestos por documento y regla 2586"
          },
          {
            "t": 326,
            "titulo": "Tipo de impuesto: porcentaje y base"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Probar la regla: cambio de zona",
        "inicio": 2190,
        "duracion": 360,
        "escenas": [
          {
            "t": 0,
            "titulo": "Por qué se aplica la regla 2586"
          },
          {
            "t": 58,
            "titulo": "Cambiar la zona del tercero a ESCO"
          },
          {
            "t": 120,
            "titulo": "Nueva factura de compra FC"
          },
          {
            "t": 240,
            "titulo": "Validar y leer la regla 1477"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Reglas por línea y por documento",
        "inicio": 2550,
        "duracion": 420,
        "escenas": [
          {
            "t": 0,
            "titulo": "Qué pasa si falta una regla"
          },
          {
            "t": 43,
            "titulo": "Artículo con clave fiscal SOR"
          },
          {
            "t": 208,
            "titulo": "Reglas 1477 y 1479 en la factura"
          },
          {
            "t": 280,
            "titulo": "Impuestos por línea y resumen"
          },
          {
            "t": 363,
            "titulo": "Destino a las tablas de declaración"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap07.jpg"
      },
      {
        "n": 8,
        "titulo": "Variantes de Perú y preguntas",
        "inicio": 2970,
        "duracion": 297,
        "escenas": [
          {
            "t": 0,
            "titulo": "Claves de documento SUNAT"
          },
          {
            "t": 60,
            "titulo": "Régimen del tercero y tipo de RUC"
          },
          {
            "t": 208,
            "titulo": "Zonas fiscales en empresa y tercero"
          }
        ],
        "url": "",
        "poster": "video/finanzas/tax-tablas-cap08.jpg"
      }
    ]
  },
  {
    "id": "fin-cobros",
    "titulo": "Cartera de cobros y pagos",
    "corto": "Cartera",
    "intro": "Tipos de efecto, estados y cómo se paga o se gestiona un efecto.",
    "modulos": [
      "icon-cartera"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Datos del tercero y de la factura",
        "inicio": 0,
        "duracion": 392,
        "escenas": [
          {
            "t": 0,
            "titulo": "Objetivo: parametrizar la cartera"
          },
          {
            "t": 14,
            "titulo": "Factura de compra y datos financieros"
          },
          {
            "t": 97,
            "titulo": "Ficha del tercero: datos bancarios"
          },
          {
            "t": 177,
            "titulo": "El perceptor"
          },
          {
            "t": 239,
            "titulo": "Condiciones comerciales del tercero"
          },
          {
            "t": 330,
            "titulo": "Qué es un tipo de efecto"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "Maestro de tipos de efecto",
        "inicio": 393,
        "duracion": 270,
        "escenas": [
          {
            "t": 0,
            "titulo": "Vuelta a la factura"
          },
          {
            "t": 34,
            "titulo": "Ruta: Cobros y pagos › Maestros › Efectos"
          },
          {
            "t": 45,
            "titulo": "Tipos: los medios de pago"
          },
          {
            "t": 77,
            "titulo": "Clase, estado inicial y riesgo"
          },
          {
            "t": 138,
            "titulo": "Maestro de estados"
          },
          {
            "t": 173,
            "titulo": "Ejemplo: transferencia pendiente"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Caducidad y estados ordenado/propuesto",
        "inicio": 664,
        "duracion": 165,
        "escenas": [
          {
            "t": 0,
            "titulo": "El indicador de caducidad"
          },
          {
            "t": 64,
            "titulo": "Pagado caduca, pendiente no"
          },
          {
            "t": 73,
            "titulo": "Valores ordenado y propuesto"
          },
          {
            "t": 113,
            "titulo": "Evitar que dos usuarios gestionen lo mismo"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Estados iniciales por tipo de efecto",
        "inicio": 829,
        "duracion": 124,
        "escenas": [
          {
            "t": 0,
            "titulo": "Conexión entre tipos y estados"
          },
          {
            "t": 51,
            "titulo": "Filtrar las transferencias de pago"
          },
          {
            "t": 56,
            "titulo": "Bloqueado y pendiente para TF"
          },
          {
            "t": 84,
            "titulo": "Lo que ve el tercero al elegir TF"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "De la factura a la cartera de efectos",
        "inicio": 953,
        "duracion": 311,
        "escenas": [
          {
            "t": 0,
            "titulo": "Factura de compras contabilizada"
          },
          {
            "t": 33,
            "titulo": "Descontabilizar y pestañas que cambian"
          },
          {
            "t": 61,
            "titulo": "Cartera de efectos y Movimientos"
          },
          {
            "t": 86,
            "titulo": "Ficha del efecto: importes e impuestos"
          },
          {
            "t": 225,
            "titulo": "Vencimientos: 2 de mayo + 90 días"
          },
          {
            "t": 282,
            "titulo": "Por qué parametrizar antes"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Pago individual y su histórico",
        "inicio": 1264,
        "duracion": 381,
        "escenas": [
          {
            "t": 0,
            "titulo": "Botones según el tipo de efecto"
          },
          {
            "t": 68,
            "titulo": "Pago directo en efectivo (PEFE)"
          },
          {
            "t": 104,
            "titulo": "Formulario de evolución de estados"
          },
          {
            "t": 233,
            "titulo": "Resultado: efectivo, pagado, caducado"
          },
          {
            "t": 271,
            "titulo": "Retroceder el pago"
          },
          {
            "t": 334,
            "titulo": "Pestaña Histórico"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Maestro de acciones: la acción PEFE",
        "inicio": 1645,
        "duracion": 279,
        "escenas": [
          {
            "t": 0,
            "titulo": "De dónde salen los botones"
          },
          {
            "t": 49,
            "titulo": "Ruta: Maestros › Acciones"
          },
          {
            "t": 60,
            "titulo": "Filtrar clase pago y código PEFE"
          },
          {
            "t": 86,
            "titulo": "Estado final, efecto final y asiento"
          },
          {
            "t": 146,
            "titulo": "Individual, masiva, remesa y diferencias"
          },
          {
            "t": 172,
            "titulo": "Campos editables al ejecutar"
          },
          {
            "t": 217,
            "titulo": "Estados de origen de la acción"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap07.jpg"
      },
      {
        "n": 8,
        "titulo": "Gestión masiva de efectos",
        "inicio": 1924,
        "duracion": 446,
        "escenas": [
          {
            "t": 0,
            "titulo": "Ruta a Gestiones sobre la cartera"
          },
          {
            "t": 27,
            "titulo": "Nueva gestión: cabecera"
          },
          {
            "t": 95,
            "titulo": "Selección de efectos"
          },
          {
            "t": 196,
            "titulo": "Agregar efectos y cerrar la gestión"
          },
          {
            "t": 266,
            "titulo": "Resultado en la cartera"
          },
          {
            "t": 282,
            "titulo": "Retroceder desde la gestión"
          },
          {
            "t": 441,
            "titulo": "Problema con varios efectos"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap08.jpg"
      },
      {
        "n": 9,
        "titulo": "Cierre y próximos temas",
        "inicio": 2370,
        "duracion": 166,
        "escenas": [
          {
            "t": 0,
            "titulo": "Repaso de la gestión masiva"
          },
          {
            "t": 76,
            "titulo": "Asimilar la cartera"
          },
          {
            "t": 99,
            "titulo": "Próximas casuísticas: devoluciones y comisiones"
          }
        ],
        "url": "",
        "poster": "video/finanzas/cobros-cap09.jpg"
      }
    ]
  },
  {
    "id": "fin-asientos",
    "titulo": "Contabilización y activos fijos",
    "corto": "Activos",
    "intro": "Qué asientos genera cada documento y cómo nace un activo fijo.",
    "modulos": [
      "icon-activos"
    ],
    "capitulos": [
      {
        "n": 1,
        "titulo": "Tipologías y huella contable",
        "inicio": 0,
        "duracion": 186,
        "escenas": [
          {
            "t": 0,
            "titulo": "Repaso de tipologías de compras y ventas"
          },
          {
            "t": 46,
            "titulo": "Tipología de albarán en Compras"
          },
          {
            "t": 95,
            "titulo": "Pestaña Contabilización"
          },
          {
            "t": 118,
            "titulo": "Asientos fijos, no facturados y provisión"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap01.jpg"
      },
      {
        "n": 2,
        "titulo": "El indicador Generar inmovilizado",
        "inicio": 187,
        "duracion": 178,
        "escenas": [
          {
            "t": 0,
            "titulo": "Qué hace el indicador"
          },
          {
            "t": 60,
            "titulo": "Al validar o al contabilizar"
          },
          {
            "t": 120,
            "titulo": "Circuito provisional, validada, contabilizada"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap02.jpg"
      },
      {
        "n": 3,
        "titulo": "Factura de activos paso a paso",
        "inicio": 366,
        "duracion": 250,
        "escenas": [
          {
            "t": 0,
            "titulo": "Albarán y factura de activos"
          },
          {
            "t": 58,
            "titulo": "Tipología de la factura"
          },
          {
            "t": 120,
            "titulo": "Circuito solicitud-pedido-albarán-factura"
          },
          {
            "t": 240,
            "titulo": "Se habilita la pestaña Componentes"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap03.jpg"
      },
      {
        "n": 4,
        "titulo": "Cómo se genera la ficha de activo",
        "inicio": 617,
        "duracion": 228,
        "escenas": [
          {
            "t": 0,
            "titulo": "De Componentes a Activos permanentes"
          },
          {
            "t": 41,
            "titulo": "Requisito en la tipología"
          },
          {
            "t": 101,
            "titulo": "Familia del artículo"
          },
          {
            "t": 129,
            "titulo": "Código de bien y serie"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap04.jpg"
      },
      {
        "n": 5,
        "titulo": "Bienes, grupo contable y fiscal",
        "inicio": 846,
        "duracion": 473,
        "escenas": [
          {
            "t": 0,
            "titulo": "Bienes, elementos y componentes"
          },
          {
            "t": 72,
            "titulo": "Grupo contable: seis cuentas"
          },
          {
            "t": 251,
            "titulo": "Grupo fiscal y años"
          },
          {
            "t": 299,
            "titulo": "Estados del activo"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap05.jpg"
      },
      {
        "n": 6,
        "titulo": "Componentes y depreciación",
        "inicio": 1320,
        "duracion": 252,
        "escenas": [
          {
            "t": 0,
            "titulo": "Datos de adquisición"
          },
          {
            "t": 77,
            "titulo": "Inicio de depreciación"
          },
          {
            "t": 122,
            "titulo": "Proyección de depreciación"
          },
          {
            "t": 168,
            "titulo": "Totales por elemento"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap06.jpg"
      },
      {
        "n": 7,
        "titulo": "Integración y dudas",
        "inicio": 1573,
        "duracion": 312,
        "escenas": [
          {
            "t": 0,
            "titulo": "Trazabilidad hasta la factura"
          },
          {
            "t": 66,
            "titulo": "Duda: servicio de instalación"
          },
          {
            "t": 236,
            "titulo": "Otros indicadores y cierre"
          }
        ],
        "url": "",
        "poster": "video/finanzas/asientos-cap07.jpg"
      }
    ]
  }
];

export const MOMENTOS_SECCION_FIN: Record<string, MomentoVideo[]> = {
  "icon-contabilidad-v-1-factura-origen": [
    {
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Factura de compra con origen albarán",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 1,
      "t": 17,
      "tCap": 17,
      "titulo": "Módulos de gestión y de finanzas",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-1-contabilizar": [
    {
      "capitulo": 1,
      "t": 44,
      "tCap": 44,
      "titulo": "Contabilizar la factura",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 1,
      "t": 74,
      "tCap": 74,
      "titulo": "Se generan tres cosas",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-1-asiento": [
    {
      "capitulo": 1,
      "t": 91,
      "tCap": 91,
      "titulo": "El asiento contable y su cuadre",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-1-cartera-fiscales": [
    {
      "capitulo": 1,
      "t": 103,
      "tCap": 103,
      "titulo": "La cartera de efectos",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 1,
      "t": 123,
      "tCap": 123,
      "titulo": "Los registros fiscales",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-1-cartera": [
    {
      "capitulo": 2,
      "t": 285,
      "tCap": 46,
      "titulo": "La cartera de efectos: deuda de 1.815",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 2,
      "t": 345,
      "tCap": 106,
      "titulo": "Clase Pagar y tipo TF",
      "serie": "fin-icon11"
    }
  ],
  "icon-contabilidad-v-2-fc": [
    {
      "capitulo": 3,
      "t": 637,
      "tCap": 33,
      "titulo": "Tipo FC, empresa y proveedor",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 3,
      "t": 693,
      "tCap": 89,
      "titulo": "Datos financieros y cuenta obligatoria",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-2-contabilizar-fc": [
    {
      "capitulo": 3,
      "t": 755,
      "tCap": 151,
      "titulo": "Validar: importe total y de factura",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 3,
      "t": 788,
      "tCap": 184,
      "titulo": "Detalle de impuestos",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-2-fb": [
    {
      "capitulo": 4,
      "t": 805,
      "tCap": 0,
      "titulo": "Factura de ventas: tipo FB",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 4,
      "t": 861,
      "tCap": 56,
      "titulo": "No deja validar la factura",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-3-rectificativa": [
    {
      "capitulo": 5,
      "t": 1095,
      "tCap": 3,
      "titulo": "La rectificativa corrige sin anular",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 5,
      "t": 1114,
      "tCap": 22,
      "titulo": "En España queda registro de todo",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-3-sustitutiva": [
    {
      "capitulo": 5,
      "t": 1140,
      "tCap": 48,
      "titulo": "La sustitutiva anula la inicial",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 5,
      "t": 1163,
      "tCap": 71,
      "titulo": "Diferencia entre las dos",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-4-importe-0": [
    {
      "capitulo": 3,
      "t": 382,
      "tCap": 17,
      "titulo": "Facturas de importe cero",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 3,
      "t": 408,
      "tCap": 43,
      "titulo": "Cartera vacía tras contabilizar",
      "serie": "fin-icon11"
    }
  ],
  "icon-contabilidad-v-4-periodos": [
    {
      "capitulo": 6,
      "t": 885,
      "tCap": 0,
      "titulo": "Ejercicio y periodos cerrados",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 6,
      "t": 911,
      "tCap": 26,
      "titulo": "Enero a junio cerrados",
      "serie": "fin-icon11"
    }
  ],
  "icon-contabilidad-v-4-origen-pedido": [
    {
      "capitulo": 7,
      "t": 1184,
      "tCap": 149,
      "titulo": "Pasar a provisional y cambiar a TF",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 8,
      "t": 1253,
      "tCap": 33,
      "titulo": "Asientos EPC y FB",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-1-factura": [
    {
      "capitulo": 5,
      "t": 953,
      "tCap": 0,
      "titulo": "Factura de compras contabilizada",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 5,
      "t": 986,
      "tCap": 33,
      "titulo": "Descontabilizar y pestañas",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-1-cartera": [
    {
      "capitulo": 5,
      "t": 1014,
      "tCap": 61,
      "titulo": "Cartera de efectos desde la factura",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 5,
      "t": 1039,
      "tCap": 86,
      "titulo": "Ficha del efecto",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-1-vencimientos": [
    {
      "capitulo": 5,
      "t": 1178,
      "tCap": 225,
      "titulo": "Vencimientos: 2 de mayo + 90 días",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-2-boton": [
    {
      "capitulo": 6,
      "t": 1264,
      "tCap": 0,
      "titulo": "Botones según el tipo de efecto",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 6,
      "t": 1368,
      "tCap": 104,
      "titulo": "Formulario Evolución de estados",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-2-resultado": [
    {
      "capitulo": 6,
      "t": 1497,
      "tCap": 233,
      "titulo": "Resultado: efectivo, pagado, caducidad Sí",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 6,
      "t": 1598,
      "tCap": 334,
      "titulo": "Pestaña Histórico",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-3-cabecera": [
    {
      "capitulo": 8,
      "t": 1924,
      "tCap": 0,
      "titulo": "Ruta a Gestiones sobre la cartera",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 1951,
      "tCap": 27,
      "titulo": "Nueva gestión",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-3-seleccion": [
    {
      "capitulo": 8,
      "t": 2019,
      "tCap": 95,
      "titulo": "Selección de efectos",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 2120,
      "tCap": 196,
      "titulo": "Marcar el documento de 118,50 USD",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-3-cierre": [
    {
      "capitulo": 8,
      "t": 2165,
      "tCap": 241,
      "titulo": "Agregar efectos y cerrar",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 2206,
      "tCap": 282,
      "titulo": "Sin retroceso individual",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 2365,
      "tCap": 441,
      "titulo": "Error con varios efectos",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-4-empresa": [
    {
      "capitulo": 3,
      "t": 498,
      "tCap": 133,
      "titulo": "Tipo de remesa parametrizado en la empresa",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-4-tipos": [
    {
      "capitulo": 3,
      "t": 506,
      "tCap": 141,
      "titulo": "Remesas por cuenta",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-5-remesas-por-cuenta": [
    {
      "capitulo": 6,
      "t": 1482,
      "tCap": 156,
      "titulo": "Remesas por cuenta en bancos propios",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 6,
      "t": 1503,
      "tCap": 177,
      "titulo": "Añadir cobro y pago con tesorería",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-v-5-crear-remesa": [
    {
      "capitulo": 6,
      "t": 1449,
      "tCap": 123,
      "titulo": "Crear la remesa: empresa y cuenta",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 6,
      "t": 1468,
      "tCap": 142,
      "titulo": "Clase Pagar o Cobrar",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-v-5-seleccion-efectos": [
    {
      "capitulo": 7,
      "t": 1561,
      "tCap": 15,
      "titulo": "Filtrar los efectos por tercero",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 7,
      "t": 1627,
      "tCap": 81,
      "titulo": "Efecto cheque frente a remesa transferencia",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-v-5-agregar": [
    {
      "capitulo": 4,
      "t": 557,
      "tCap": 0,
      "titulo": "Selección de efectos",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 4,
      "t": 609,
      "tCap": 52,
      "titulo": "Agregar el efecto a la remesa",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-6-evolucionar": [
    {
      "capitulo": 4,
      "t": 626,
      "tCap": 69,
      "titulo": "Evolucionar estado",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-6-asiento-tesoreria": [
    {
      "capitulo": 4,
      "t": 636,
      "tCap": 79,
      "titulo": "Se genera la tesorería",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 4,
      "t": 648,
      "tCap": 91,
      "titulo": "Asiento contable de 1.815",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-6-extracto": [
    {
      "capitulo": 1,
      "t": 137,
      "tCap": 137,
      "titulo": "Extracto bancario",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 1,
      "t": 173,
      "tCap": 173,
      "titulo": "Conciliación bancaria",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-7-domiciliacion": [
    {
      "capitulo": 8,
      "t": 1267,
      "tCap": 47,
      "titulo": "Domiciliación bancaria no informada",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 8,
      "t": 1340,
      "tCap": 120,
      "titulo": "Mezclar cheque y TF",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-7-tipos-efecto": [
    {
      "capitulo": 8,
      "t": 1267,
      "tCap": 47,
      "titulo": "Domiciliación bancaria no informada",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 8,
      "t": 1340,
      "tCap": 120,
      "titulo": "Mezclar cheque y TF",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-8-conceptos": [
    {
      "capitulo": 1,
      "t": 29,
      "tCap": 16,
      "titulo": "Qué es el extracto",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 1,
      "t": 110,
      "tCap": 97,
      "titulo": "Qué es la conciliación",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-8-circuito": [
    {
      "capitulo": 1,
      "t": 13,
      "tCap": 0,
      "titulo": "El circuito de tesorería",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-9-alta-extracto": [
    {
      "capitulo": 2,
      "t": 186,
      "tCap": 8,
      "titulo": "Ruta y alta del extracto",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 2,
      "t": 300,
      "tCap": 122,
      "titulo": "Importe y signo",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-10-filtros": [
    {
      "capitulo": 3,
      "t": 508,
      "tCap": 3,
      "titulo": "Ruta y filtros",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 3,
      "t": 576,
      "tCap": 71,
      "titulo": "Ejecutar",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-10-conciliar-contabilizar": [
    {
      "capitulo": 3,
      "t": 647,
      "tCap": 142,
      "titulo": "Conciliar tesorería",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 3,
      "t": 675,
      "tCap": 170,
      "titulo": "Contabilizar",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-11-extracto-cobro": [
    {
      "capitulo": 4,
      "t": 879,
      "tCap": 109,
      "titulo": "Extracto de cobro",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 4,
      "t": 1025,
      "tCap": 255,
      "titulo": "Importe negativo",
      "serie": "fin-icon2"
    }
  ],
  "icon-impuestos-v-1-empresa": [
    {
      "capitulo": 3,
      "t": 957,
      "tCap": 0,
      "titulo": "Identificación fiscal de la empresa",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1541,
      "tCap": 251,
      "titulo": "Zona fiscal de la empresa en el ERP",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-1-tercero": [
    {
      "capitulo": 3,
      "t": 1008,
      "tCap": 51,
      "titulo": "NIF, país y tipo del tercero",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1646,
      "tCap": 356,
      "titulo": "Zona fiscal en direcciones del tercero",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-1-articulo": [
    {
      "capitulo": 2,
      "t": 702,
      "tCap": 198,
      "titulo": "Claves fiscales de artículo",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 1733,
      "tCap": 33,
      "titulo": "Clave fiscal BOG del artículo",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-2-factura-impuestos": [
    {
      "capitulo": 5,
      "t": 1804,
      "tCap": 104,
      "titulo": "Factura de compra de ejemplo",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 1842,
      "tCap": 142,
      "titulo": "Pestaña Impuestos por documento",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-2-regla-2586": [
    {
      "capitulo": 5,
      "t": 1920,
      "tCap": 220,
      "titulo": "Regla 2586",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 1988,
      "tCap": 288,
      "titulo": "Código de operación",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-2-tipo-impuesto": [
    {
      "capitulo": 5,
      "t": 2026,
      "tCap": 326,
      "titulo": "Tipo de impuesto ES IVA 21 %",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 2074,
      "tCap": 374,
      "titulo": "Base de cálculo",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-3-preparar-prueba": [
    {
      "capitulo": 6,
      "t": 2248,
      "tCap": 58,
      "titulo": "Cambiar la zona del tercero",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 6,
      "t": 2310,
      "tCap": 120,
      "titulo": "Nueva factura de compra FC",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-3-validar-bog": [
    {
      "capitulo": 6,
      "t": 2430,
      "tCap": 240,
      "titulo": "Validar y leer la regla 1477",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 7,
      "t": 2550,
      "tCap": 0,
      "titulo": "Qué pasa si falta una regla",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-3-segunda-linea": [
    {
      "capitulo": 7,
      "t": 2650,
      "tCap": 100,
      "titulo": "Segunda línea con otra clave",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 7,
      "t": 2758,
      "tCap": 208,
      "titulo": "Reglas 1477 y 1479 por línea",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-activos-v-1-contabilizacion": [
    {
      "capitulo": 1,
      "t": 125,
      "tCap": 125,
      "titulo": "Abrir la pestaña Contabilización",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-1-asientos-contables": [
    {
      "capitulo": 1,
      "t": 120,
      "tCap": 120,
      "titulo": "Tipos de asiento del albarán",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-1-indicador-inmovilizado": [
    {
      "capitulo": 2,
      "t": 190,
      "tCap": 3,
      "titulo": "Indicador Generar inmovilizado",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-2-tipologia-factura": [
    {
      "capitulo": 3,
      "t": 470,
      "tCap": 104,
      "titulo": "Abrir la tipología de factura de activos",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-2-opciones-indicador": [
    {
      "capitulo": 3,
      "t": 490,
      "tCap": 124,
      "titulo": "Opciones del indicador Generar inmovilizado",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-2-circuito-estados": [
    {
      "capitulo": 3,
      "t": 520,
      "tCap": 154,
      "titulo": "Circuito provisional, validada y contabilizada",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-3-circuito-docflow": [
    {
      "capitulo": 3,
      "t": 540,
      "tCap": 174,
      "titulo": "Circuito documental de la factura de activos",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-3-validar-contabilizar": [
    {
      "capitulo": 3,
      "t": 570,
      "tCap": 204,
      "titulo": "Validar y contabilizar la factura",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-3-pestana-componentes": [
    {
      "capitulo": 3,
      "t": 610,
      "tCap": 244,
      "titulo": "Pestaña Componentes habilitada",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-4-abrir-articulo-familia": [
    {
      "capitulo": 4,
      "t": 705,
      "tCap": 88,
      "titulo": "Abrir el artículo y su familia",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-4-codigo-bien-serie": [
    {
      "capitulo": 4,
      "t": 750,
      "tCap": 133,
      "titulo": "Código de bien y serie obligatorios",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-4-requisito-creacion": [
    {
      "capitulo": 4,
      "t": 800,
      "tCap": 183,
      "titulo": "Requisito conjunto para crear ficha",
      "serie": "fin-asientos"
    }
  ],
  "maestros-v-1-planes-contables": [
    {
      "capitulo": 1,
      "t": 92,
      "tCap": 62,
      "titulo": "Pantalla de planes contables",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 1,
      "t": 163,
      "tCap": 133,
      "titulo": "Planes por país",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-1-cuentas-contables": [
    {
      "capitulo": 2,
      "t": 255,
      "tCap": 46,
      "titulo": "Cuenta 10200 Capital",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 2,
      "t": 368,
      "tCap": 159,
      "titulo": "Indicadores de la cuenta",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-2-concepto": [
    {
      "capitulo": 3,
      "t": 566,
      "tCap": 12,
      "titulo": "Códigos no contables",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 3,
      "t": 649,
      "tCap": 95,
      "titulo": "Cabecera y líneas con plan y cuenta",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-2-uso": [
    {
      "capitulo": 3,
      "t": 681,
      "tCap": 127,
      "titulo": "Otras tablas piden mnemotécnico",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 3,
      "t": 711,
      "tCap": 157,
      "titulo": "Resumen: plan, cuentas y mnemotécnicos",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-3-cabecera": [
    {
      "capitulo": 4,
      "t": 790,
      "tCap": 70,
      "titulo": "Código, nombre y fecha de inicio",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 4,
      "t": 846,
      "tCap": 126,
      "titulo": "Identificación fiscal",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-3-vinculo": [
    {
      "capitulo": 4,
      "t": 876,
      "tCap": 156,
      "titulo": "Vínculo empresa-tercero",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-3-datos-contables": [
    {
      "capitulo": 5,
      "t": 1004,
      "tCap": 0,
      "titulo": "Plan contable de la empresa",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 5,
      "t": 1086,
      "tCap": 82,
      "titulo": "Moneda funcional euro",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-4-alta-empresa": [
    {
      "capitulo": 2,
      "t": 152,
      "tCap": 4,
      "titulo": "Entrar al maestro de empresas",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 2,
      "t": 261,
      "tCap": 113,
      "titulo": "Fecha de inicio, moneda y nombre",
      "serie": "fin-icon1"
    }
  ],
  "maestros-v-4-ejercicio": [
    {
      "capitulo": 2,
      "t": 367,
      "tCap": 219,
      "titulo": "Crear el ejercicio contable 2026",
      "serie": "fin-icon1"
    }
  ],
  "maestros-v-4-banco-propio": [
    {
      "capitulo": 2,
      "t": 389,
      "tCap": 241,
      "titulo": "Crear el banco propio",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 2,
      "t": 473,
      "tCap": 325,
      "titulo": "Cuenta contable 57.9 de bancos",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-1-vision": [
    {
      "capitulo": 2,
      "t": 427,
      "tCap": 34,
      "titulo": "Maestro de tipos de efecto",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 2,
      "t": 470,
      "tCap": 77,
      "titulo": "Clase, estado inicial y riesgo",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-1-estados": [
    {
      "capitulo": 2,
      "t": 531,
      "tCap": 138,
      "titulo": "Maestro de estados",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 3,
      "t": 664,
      "tCap": 0,
      "titulo": "El indicador de caducidad",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 3,
      "t": 737,
      "tCap": 73,
      "titulo": "Ordenado y propuesto",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 4,
      "t": 829,
      "tCap": 0,
      "titulo": "Estados iniciales por tipo",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 4,
      "t": 885,
      "tCap": 56,
      "titulo": "Bloqueado y pendiente para la transferencia",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-1-acciones": [
    {
      "capitulo": 7,
      "t": 1675,
      "tCap": 30,
      "titulo": "De dónde salen los botones",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 7,
      "t": 1731,
      "tCap": 86,
      "titulo": "Configuración de PEFE",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 7,
      "t": 1817,
      "tCap": 172,
      "titulo": "Campos editables",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 7,
      "t": 1862,
      "tCap": 217,
      "titulo": "Estados de origen",
      "serie": "fin-cobros"
    }
  ],
  "icon-impuestos-2-registro": [
    {
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Impuestos en cabecera y líneas",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 1,
      "t": 117,
      "tCap": 117,
      "titulo": "Operación fiscal y tipo de impuesto",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 2,
      "t": 504,
      "tCap": 0,
      "titulo": "Origen de los datos fiscales",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 2,
      "t": 603,
      "tCap": 99,
      "titulo": "Mapa de maestros",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-1-reglas-agencia": [
    {
      "capitulo": 1,
      "t": 286,
      "tCap": 286,
      "titulo": "Periodos fiscales y agencias tributarias",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1382,
      "tCap": 92,
      "titulo": "Reglas de asignación en el menú",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1452,
      "tCap": 162,
      "titulo": "La regla 1137 y sus condiciones",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-activos-1-bien": [
    {
      "capitulo": 5,
      "t": 890,
      "tCap": 44,
      "titulo": "Abrir Bienes y revisar el grupo de inmovilizado",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 5,
      "t": 970,
      "tCap": 124,
      "titulo": "Grupo contable y paquete de seis cuentas",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 5,
      "t": 1100,
      "tCap": 254,
      "titulo": "Grupo fiscal, serie y estado",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-1-elemento": [
    {
      "capitulo": 5,
      "t": 1250,
      "tCap": 404,
      "titulo": "Jerarquía bienes → elementos → componentes",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 6,
      "t": 1490,
      "tCap": 170,
      "titulo": "Totales del elemento y trazabilidad",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-1-componente": [
    {
      "capitulo": 6,
      "t": 1330,
      "tCap": 10,
      "titulo": "Datos de adquisición del componente",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 6,
      "t": 1400,
      "tCap": 80,
      "titulo": "Fecha de inicio de depreciación y proyección",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 7,
      "t": 1640,
      "tCap": 67,
      "titulo": "Duda: servicios de instalación",
      "serie": "fin-asientos"
    }
  ],
  "maestros-1-terceros": [
    {
      "capitulo": 5,
      "t": 1216,
      "tCap": 212,
      "titulo": "Ficha del tercero y datos fiscales",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 5,
      "t": 1404,
      "tCap": 400,
      "titulo": "Tipo de tercero c_tipo_ter",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 6,
      "t": 1603,
      "tCap": 132,
      "titulo": "Direcciones y zona impositiva",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 6,
      "t": 1639,
      "tCap": 168,
      "titulo": "Datos bancarios",
      "serie": "fin-maestros"
    }
  ],
  "maestros-1-plazos": [
    {
      "capitulo": 6,
      "t": 1691,
      "tCap": 220,
      "titulo": "Condiciones comerciales",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 7,
      "t": 1927,
      "tCap": 19,
      "titulo": "De pestañas a links",
      "serie": "fin-maestros"
    }
  ],
  "maestros-1-cuentas-perfil": [
    {
      "capitulo": 8,
      "t": 2245,
      "tCap": 50,
      "titulo": "Nueva relación contable y fallo",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 8,
      "t": 2324,
      "tCap": 129,
      "titulo": "Tercero FEDA 00074",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 8,
      "t": 2349,
      "tCap": 154,
      "titulo": "El código tras el punto",
      "serie": "fin-maestros"
    }
  ]
};

export const MOMENTOS_EJERCICIO_FIN: Record<string, MomentoVideo[]> = {
  "icon-contabilidad-v-1": [
    {
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Factura de compra con origen albarán",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 1,
      "t": 17,
      "tCap": 17,
      "titulo": "Módulos de gestión y de finanzas",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 1,
      "t": 44,
      "tCap": 44,
      "titulo": "Contabilizar la factura",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-2": [
    {
      "capitulo": 3,
      "t": 637,
      "tCap": 33,
      "titulo": "Tipo FC, empresa y proveedor",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 3,
      "t": 693,
      "tCap": 89,
      "titulo": "Datos financieros y cuenta obligatoria",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 3,
      "t": 755,
      "tCap": 151,
      "titulo": "Validar: importe total y de factura",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-3": [
    {
      "capitulo": 5,
      "t": 1095,
      "tCap": 3,
      "titulo": "La rectificativa corrige sin anular",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 5,
      "t": 1114,
      "tCap": 22,
      "titulo": "En España queda registro de todo",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 5,
      "t": 1140,
      "tCap": 48,
      "titulo": "La sustitutiva anula la inicial",
      "serie": "fin-icon1"
    }
  ],
  "icon-contabilidad-v-4": [
    {
      "capitulo": 3,
      "t": 382,
      "tCap": 17,
      "titulo": "Facturas de importe cero",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 3,
      "t": 408,
      "tCap": 43,
      "titulo": "Cartera vacía tras contabilizar",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 6,
      "t": 885,
      "tCap": 0,
      "titulo": "Ejercicio y periodos cerrados",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-1": [
    {
      "capitulo": 5,
      "t": 953,
      "tCap": 0,
      "titulo": "Factura de compras contabilizada",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 5,
      "t": 986,
      "tCap": 33,
      "titulo": "Descontabilizar y pestañas",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 5,
      "t": 1014,
      "tCap": 61,
      "titulo": "Cartera de efectos desde la factura",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-2": [
    {
      "capitulo": 6,
      "t": 1264,
      "tCap": 0,
      "titulo": "Botones según el tipo de efecto",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 6,
      "t": 1368,
      "tCap": 104,
      "titulo": "Formulario Evolución de estados",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 6,
      "t": 1497,
      "tCap": 233,
      "titulo": "Resultado: efectivo, pagado, caducidad Sí",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-3": [
    {
      "capitulo": 8,
      "t": 1924,
      "tCap": 0,
      "titulo": "Ruta a Gestiones sobre la cartera",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 1951,
      "tCap": 27,
      "titulo": "Nueva gestión",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 8,
      "t": 2019,
      "tCap": 95,
      "titulo": "Selección de efectos",
      "serie": "fin-cobros"
    }
  ],
  "icon-cartera-v-4": [
    {
      "capitulo": 3,
      "t": 498,
      "tCap": 133,
      "titulo": "Tipo de remesa parametrizado en la empresa",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 3,
      "t": 506,
      "tCap": 141,
      "titulo": "Remesas por cuenta",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-5": [
    {
      "capitulo": 6,
      "t": 1482,
      "tCap": 156,
      "titulo": "Remesas por cuenta en bancos propios",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 6,
      "t": 1503,
      "tCap": 177,
      "titulo": "Añadir cobro y pago con tesorería",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 6,
      "t": 1449,
      "tCap": 123,
      "titulo": "Crear la remesa: empresa y cuenta",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-v-6": [
    {
      "capitulo": 4,
      "t": 626,
      "tCap": 69,
      "titulo": "Evolucionar estado",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 4,
      "t": 636,
      "tCap": 79,
      "titulo": "Se genera la tesorería",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 4,
      "t": 648,
      "tCap": 91,
      "titulo": "Asiento contable de 1.815",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-7": [
    {
      "capitulo": 8,
      "t": 1267,
      "tCap": 47,
      "titulo": "Domiciliación bancaria no informada",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 8,
      "t": 1340,
      "tCap": 120,
      "titulo": "Mezclar cheque y TF",
      "serie": "fin-icon11"
    },
    {
      "capitulo": 8,
      "t": 1267,
      "tCap": 47,
      "titulo": "Domiciliación bancaria no informada",
      "serie": "fin-icon11"
    }
  ],
  "icon-cartera-v-8": [
    {
      "capitulo": 1,
      "t": 29,
      "tCap": 16,
      "titulo": "Qué es el extracto",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 1,
      "t": 110,
      "tCap": 97,
      "titulo": "Qué es la conciliación",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 1,
      "t": 13,
      "tCap": 0,
      "titulo": "El circuito de tesorería",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-9": [
    {
      "capitulo": 2,
      "t": 186,
      "tCap": 8,
      "titulo": "Ruta y alta del extracto",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 2,
      "t": 300,
      "tCap": 122,
      "titulo": "Importe y signo",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-10": [
    {
      "capitulo": 3,
      "t": 508,
      "tCap": 3,
      "titulo": "Ruta y filtros",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 3,
      "t": 576,
      "tCap": 71,
      "titulo": "Ejecutar",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 3,
      "t": 647,
      "tCap": 142,
      "titulo": "Conciliar tesorería",
      "serie": "fin-icon2"
    }
  ],
  "icon-cartera-v-11": [
    {
      "capitulo": 4,
      "t": 879,
      "tCap": 109,
      "titulo": "Extracto de cobro",
      "serie": "fin-icon2"
    },
    {
      "capitulo": 4,
      "t": 1025,
      "tCap": 255,
      "titulo": "Importe negativo",
      "serie": "fin-icon2"
    }
  ],
  "icon-impuestos-v-1": [
    {
      "capitulo": 3,
      "t": 957,
      "tCap": 0,
      "titulo": "Identificación fiscal de la empresa",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1541,
      "tCap": 251,
      "titulo": "Zona fiscal de la empresa en el ERP",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 3,
      "t": 1008,
      "tCap": 51,
      "titulo": "NIF, país y tipo del tercero",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-2": [
    {
      "capitulo": 5,
      "t": 1804,
      "tCap": 104,
      "titulo": "Factura de compra de ejemplo",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 1842,
      "tCap": 142,
      "titulo": "Pestaña Impuestos por documento",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 5,
      "t": 1920,
      "tCap": 220,
      "titulo": "Regla 2586",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-v-3": [
    {
      "capitulo": 6,
      "t": 2248,
      "tCap": 58,
      "titulo": "Cambiar la zona del tercero",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 6,
      "t": 2310,
      "tCap": 120,
      "titulo": "Nueva factura de compra FC",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 6,
      "t": 2430,
      "tCap": 240,
      "titulo": "Validar y leer la regla 1477",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-activos-v-1": [
    {
      "capitulo": 1,
      "t": 125,
      "tCap": 125,
      "titulo": "Abrir la pestaña Contabilización",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 1,
      "t": 120,
      "tCap": 120,
      "titulo": "Tipos de asiento del albarán",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 2,
      "t": 190,
      "tCap": 3,
      "titulo": "Indicador Generar inmovilizado",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-2": [
    {
      "capitulo": 3,
      "t": 470,
      "tCap": 104,
      "titulo": "Abrir la tipología de factura de activos",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 3,
      "t": 490,
      "tCap": 124,
      "titulo": "Opciones del indicador Generar inmovilizado",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 3,
      "t": 520,
      "tCap": 154,
      "titulo": "Circuito provisional, validada y contabilizada",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-3": [
    {
      "capitulo": 3,
      "t": 540,
      "tCap": 174,
      "titulo": "Circuito documental de la factura de activos",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 3,
      "t": 570,
      "tCap": 204,
      "titulo": "Validar y contabilizar la factura",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 3,
      "t": 610,
      "tCap": 244,
      "titulo": "Pestaña Componentes habilitada",
      "serie": "fin-asientos"
    }
  ],
  "icon-activos-v-4": [
    {
      "capitulo": 4,
      "t": 705,
      "tCap": 88,
      "titulo": "Abrir el artículo y su familia",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 4,
      "t": 750,
      "tCap": 133,
      "titulo": "Código de bien y serie obligatorios",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 4,
      "t": 800,
      "tCap": 183,
      "titulo": "Requisito conjunto para crear ficha",
      "serie": "fin-asientos"
    }
  ],
  "maestros-v-1": [
    {
      "capitulo": 1,
      "t": 92,
      "tCap": 62,
      "titulo": "Pantalla de planes contables",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 1,
      "t": 163,
      "tCap": 133,
      "titulo": "Planes por país",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 2,
      "t": 255,
      "tCap": 46,
      "titulo": "Cuenta 10200 Capital",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-2": [
    {
      "capitulo": 3,
      "t": 566,
      "tCap": 12,
      "titulo": "Códigos no contables",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 3,
      "t": 649,
      "tCap": 95,
      "titulo": "Cabecera y líneas con plan y cuenta",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 3,
      "t": 681,
      "tCap": 127,
      "titulo": "Otras tablas piden mnemotécnico",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-3": [
    {
      "capitulo": 4,
      "t": 790,
      "tCap": 70,
      "titulo": "Código, nombre y fecha de inicio",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 4,
      "t": 846,
      "tCap": 126,
      "titulo": "Identificación fiscal",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 4,
      "t": 876,
      "tCap": 156,
      "titulo": "Vínculo empresa-tercero",
      "serie": "fin-maestros"
    }
  ],
  "maestros-v-4": [
    {
      "capitulo": 2,
      "t": 152,
      "tCap": 4,
      "titulo": "Entrar al maestro de empresas",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 2,
      "t": 261,
      "tCap": 113,
      "titulo": "Fecha de inicio, moneda y nombre",
      "serie": "fin-icon1"
    },
    {
      "capitulo": 2,
      "t": 367,
      "tCap": 219,
      "titulo": "Crear el ejercicio contable 2026",
      "serie": "fin-icon1"
    }
  ],
  "icon-cartera-1": [
    {
      "capitulo": 2,
      "t": 427,
      "tCap": 34,
      "titulo": "Maestro de tipos de efecto",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 2,
      "t": 470,
      "tCap": 77,
      "titulo": "Clase, estado inicial y riesgo",
      "serie": "fin-cobros"
    },
    {
      "capitulo": 2,
      "t": 531,
      "tCap": 138,
      "titulo": "Maestro de estados",
      "serie": "fin-cobros"
    }
  ],
  "icon-impuestos-2": [
    {
      "capitulo": 1,
      "t": 0,
      "tCap": 0,
      "titulo": "Impuestos en cabecera y líneas",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 1,
      "t": 117,
      "tCap": 117,
      "titulo": "Operación fiscal y tipo de impuesto",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 2,
      "t": 504,
      "tCap": 0,
      "titulo": "Origen de los datos fiscales",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-impuestos-1": [
    {
      "capitulo": 1,
      "t": 286,
      "tCap": 286,
      "titulo": "Periodos fiscales y agencias tributarias",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1382,
      "tCap": 92,
      "titulo": "Reglas de asignación en el menú",
      "serie": "fin-tax-tablas"
    },
    {
      "capitulo": 4,
      "t": 1452,
      "tCap": 162,
      "titulo": "La regla 1137 y sus condiciones",
      "serie": "fin-tax-tablas"
    }
  ],
  "icon-activos-1": [
    {
      "capitulo": 5,
      "t": 890,
      "tCap": 44,
      "titulo": "Abrir Bienes y revisar el grupo de inmovilizado",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 5,
      "t": 970,
      "tCap": 124,
      "titulo": "Grupo contable y paquete de seis cuentas",
      "serie": "fin-asientos"
    },
    {
      "capitulo": 5,
      "t": 1100,
      "tCap": 254,
      "titulo": "Grupo fiscal, serie y estado",
      "serie": "fin-asientos"
    }
  ],
  "maestros-1": [
    {
      "capitulo": 5,
      "t": 1216,
      "tCap": 212,
      "titulo": "Ficha del tercero y datos fiscales",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 5,
      "t": 1404,
      "tCap": 400,
      "titulo": "Tipo de tercero c_tipo_ter",
      "serie": "fin-maestros"
    },
    {
      "capitulo": 6,
      "t": 1603,
      "tCap": 132,
      "titulo": "Direcciones y zona impositiva",
      "serie": "fin-maestros"
    }
  ]
};
