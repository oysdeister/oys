/*
  Formación previa «Antes de empezar con Axional»: dos guías de cultura general
  (contabilidad y ERP), cada una con su examen.
  Aquí van los tipos del contenido, los datos fijos de las dos guías y el progreso
  (capítulos leídos e intentos de examen), guardado en localStorage «oys-previa-v1».
*/
import { useSyncExternalStore } from 'react';

export type SlugPrevia = 'contabilidad' | 'erp';

export interface CapituloPrevio {
  id: string; // c0, c1… cg (glosario), cf (fuentes)
  num: string; // «Capítulo 3» o «Anexo»
  nav: string; // número corto del índice: «3», «G», «F»
  navTitulo: string; // título corto del índice
  titulo: string; // HTML
  lead: string; // HTML (puede ir vacío)
  html: string; // HTML del capítulo; {{IMG}} = carpeta de imágenes
}

export interface GuiaPreviaDatos {
  slug: SlugPrevia;
  titulo: string;
  navTitulo: string;
  kicker: string;
  heroHtml: string[];
  capitulos: CapituloPrevio[];
}

export interface InfoGuia {
  slug: SlugPrevia;
  orden: number;
  titulo: string; // título del apartado en la formación previa
  guia: string; // título original de la guía
  resumen: string;
  capitulos: string[]; // ids de los capítulos numerados (los anexos no cuentan)
  lectura: string;
  examen: string;
}

export const GUIAS: Record<SlugPrevia, InfoGuia> = {
  contabilidad: {
    slug: 'contabilidad',
    orden: 1,
    titulo: 'Conceptos de contabilidad general',
    guia: 'Contabilidad desde cero',
    resumen:
      'Ganar dinero y tener dinero, ingresos y gastos, cobros y pagos, balance, pérdidas y ganancias, cuentas del PGC, partida doble, amortización, cierres y ratios. Con ejemplos sencillos y pantallas reales del ERP.',
    capitulos: Array.from({ length: 17 }, (_, i) => `c${i}`),
    lectura: 'unos 80 min de lectura, más los ejercicios',
    examen: '25 preguntas y 6 ejercicios con cifras · 42 puntos',
  },
  erp: {
    slug: 'erp',
    orden: 2,
    titulo: 'Qué es un ERP',
    guia: 'Introducción al ERP y al módulo de finanzas',
    resumen:
      'Qué es un ERP y por qué se usa, el mapa de módulos de Axional, datos maestros, circuitos de compras y ventas, del documento al asiento y cada parte del módulo de finanzas.',
    capitulos: Array.from({ length: 24 }, (_, i) => `c${i}`),
    lectura: 'unos 80 min de lectura; pensada para digerirla en una jornada',
    examen: '25 preguntas y 6 ejercicios con cifras · 41 puntos',
  },
};

export const ORDEN_GUIAS: SlugPrevia[] = ['contabilidad', 'erp'];

export function esSlugPrevia(s: string | undefined): s is SlugPrevia {
  return s === 'contabilidad' || s === 'erp';
}

/** Carga el contenido de una guía bajo demanda (no engorda el arranque) */
export function cargarGuia(slug: SlugPrevia): Promise<GuiaPreviaDatos> {
  return slug === 'contabilidad'
    ? import('../content/previa/contabilidad').then((m) => m.default)
    : import('../content/previa/erp').then((m) => m.default);
}

/** Sustituye {{IMG}} por la carpeta pública de imágenes (el sitio vive en /oys/) */
export function conImagenes(html: string): string {
  return html.split('{{IMG}}').join(`${import.meta.env.BASE_URL}img/previa`);
}

/* ---------------- progreso ---------------- */

export interface IntentoPrevio {
  pct: number;
  pts: number;
  tot: number;
  aprobado: boolean;
  fecha: string; // ISO
  codigo: string;
}

export interface EstadoExamenPrevio {
  intentos: number;
  mejor: IntentoPrevio | null;
  ultimo: IntentoPrevio | null;
}

export interface EstadoPrevia {
  version: 1;
  leidos: Record<SlugPrevia, string[]>;
  examenes: Record<SlugPrevia, EstadoExamenPrevio>;
}

const CLAVE = 'oys-previa-v1';

function vacio(): EstadoPrevia {
  const ex = (): EstadoExamenPrevio => ({ intentos: 0, mejor: null, ultimo: null });
  return { version: 1, leidos: { contabilidad: [], erp: [] }, examenes: { contabilidad: ex(), erp: ex() } };
}

function leer(): EstadoPrevia {
  const v = vacio();
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return v;
    const p = JSON.parse(raw) as Partial<EstadoPrevia>;
    for (const g of ORDEN_GUIAS) {
      const l = p.leidos?.[g];
      if (Array.isArray(l)) v.leidos[g] = l.filter((x) => typeof x === 'string');
      const e = p.examenes?.[g];
      if (e && typeof e === 'object') v.examenes[g] = { ...v.examenes[g], ...e };
    }
  } catch {
    /* sin almacenamiento o dato roto: se empieza de cero */
  }
  return v;
}

let estado: EstadoPrevia = leer();
const oyentes = new Set<() => void>();

function guardar(n: EstadoPrevia) {
  estado = n;
  try {
    localStorage.setItem(CLAVE, JSON.stringify(n));
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
  oyentes.forEach((f) => f());
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE) {
      estado = leer();
      oyentes.forEach((f) => f());
    }
  });
}

export function usePrevia(): EstadoPrevia {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f);
      return () => oyentes.delete(f);
    },
    () => estado,
  );
}

export function marcarLeido(slug: SlugPrevia, capId: string) {
  if (estado.leidos[slug].includes(capId)) return;
  guardar({ ...estado, leidos: { ...estado.leidos, [slug]: [...estado.leidos[slug], capId] } });
}

export function registrarIntento(slug: SlugPrevia, intento: IntentoPrevio) {
  const prev = estado.examenes[slug];
  const mejor = !prev.mejor || intento.pct > prev.mejor.pct ? intento : prev.mejor;
  guardar({
    ...estado,
    examenes: { ...estado.examenes, [slug]: { intentos: prev.intentos + 1, mejor, ultimo: intento } },
  });
}

/** Capítulos numerados leídos de una guía */
export function leidosDe(e: EstadoPrevia, slug: SlugPrevia): number {
  const ids = new Set(GUIAS[slug].capitulos);
  return e.leidos[slug].filter((c) => ids.has(c)).length;
}

export function fmtPct(n: number): string {
  return n.toLocaleString('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
