/**
 * El recorrido del curso (UX v5): módulo → etapas → bloques → 6 pasos.
 * Todo lo que decide «qué toca ahora» vive aquí, para que portada, barra lateral,
 * página de módulo y bloque digan siempre lo mismo.
 */
import type { Ejercicio, Modulo } from '../types';
import { MODULOS } from '../content';
import { ETAPAS, type Fase } from '../content/etapas';
import { APROBADO, ejercicioCompletado, type EstadoEjercicio, type Progreso } from './progress';
import { PRACTICAS_POR_EJERCICIO } from '../erp/practicas';

/** Los pasos de un bloque, siempre en este orden */
export const PASOS = [
  { id: 'concepto', label: 'Concepto', que: 'Lees la idea y ves las pantallas.' },
  { id: 'guiado', label: 'Guiado', que: 'Haces clic donde toca, paso a paso.' },
  { id: 'memoria', label: 'De memoria', que: 'Repites sin ayuda.' },
  { id: 'test', label: 'Test', que: 'Compruebas que lo has entendido.' },
  { id: 'erp', label: 'Práctica', que: 'Lo haces en el ERP de práctica: un ERP simulado dentro de esta web, que se corrige solo.' },
  { id: 'demo', label: 'Demo real', que: 'Lo haces en el ERP de demostración de Deister, en otra pestaña.' },
] as const;
export type PasoId = (typeof PASOS)[number]['id'];

/**
 * Pasos opcionales (decisión de Sergi): «De memoria» no cuenta para terminar el bloque
 * ni para el porcentaje, y «Te toca» la salta. El «Siguiente» tras Guiado sigue llevando a ella.
 */
export function pasoOpcional(id: PasoId) {
  return id === 'memoria';
}

/** Pasos que tiene un bloque (la práctica solo si hay una preparada) */
export function pasosDe(ej: Ejercicio) {
  const conErp = (PRACTICAS_POR_EJERCICIO[ej.id] ?? []).length > 0;
  const pasos = ej.secciones.flatMap((s) => s.pasos);
  // «De memoria» necesita pantallas con clic marcado o alguna parte con 4 pasos o más para ordenar
  const conMemoria = pasos.some((p) => p.hotspot && p.imagen) || ej.secciones.some((s) => s.pasos.length >= 4);
  const conDemo = ej.checklist.length > 0;
  return PASOS.filter((p) => (p.id !== 'erp' || conErp) && (p.id !== 'memoria' || conMemoria) && (p.id !== 'demo' || conDemo));
}

export interface Etapa {
  titulo: string;
  que: string;
  bloques: Ejercicio[];
  opcional?: boolean;
  /** «Configurar» u «Operar»; sin fase, el módulo no se divide (Fundamentos) */
  fase?: Fase;
  /** Etapa sin bloques: qué reutilizas ya configurado, y el módulo donde lo preparaste */
  nota?: string;
  enlace?: string;
}

/** Etapas del módulo con sus bloques en orden. Sin definición: una sola etapa con todos. */
export function etapasDe(m: Modulo): Etapa[] {
  const def = ETAPAS[m.id];
  const porId = new Map(m.ejercicios.map((e) => [e.id, e]));
  if (!def) return [{ titulo: '', que: '', bloques: m.ejercicios }];
  const usados = new Set<string>();
  const etapas: Etapa[] = def.map((d) => ({
    titulo: d.titulo,
    que: d.que,
    opcional: d.opcional,
    fase: d.fase,
    nota: d.nota,
    enlace: d.enlace,
    bloques: d.bloques.map((id) => porId.get(id)).filter((e): e is Ejercicio => {
      if (!e) return false;
      usados.add(e.id);
      return true;
    }),
  }));
  // Lo que no esté en ninguna etapa no se pierde: va al final
  const resto = m.ejercicios.filter((e) => !usados.has(e.id));
  if (resto.length) etapas.push({ titulo: 'Más bloques', que: '', bloques: resto });
  // Una etapa sin bloques solo se muestra si trae una nota (qué reutilizas de otro módulo)
  return etapas.filter((e) => e.bloques.length || e.nota);
}

/** Bloques del módulo en el orden del recorrido */
export function bloquesDe(m: Modulo) {
  return etapasDe(m).flatMap((e) => e.bloques);
}

/** Bloques obligatorios del módulo (sin las etapas de ampliación), en orden */
export function bloquesObligatorios(m: Modulo) {
  return etapasDe(m).filter((e) => !e.opcional).flatMap((e) => e.bloques);
}

/** ¿Es un bloque de ampliación? */
export function esOpcional(m: Modulo, id: string) {
  return etapasDe(m).some((e) => e.opcional && e.bloques.some((b) => b.id === id));
}

/** Número del bloque dentro de su módulo (1…n), según el recorrido */
export function numeroBloque(m: Modulo, id: string) {
  return bloquesDe(m).findIndex((e) => e.id === id) + 1;
}

/** Todos los bloques del curso en orden */
export function todosBloques() {
  return MODULOS.flatMap((m) => bloquesDe(m).map((ejercicio) => ({ modulo: m, ejercicio })));
}

/* ---------- Todo abierto por defecto (decisión de Sergi). ?libre=0 activa el modo guiado con cierres; ?libre=1 lo quita ---------- */
const CLAVE_LIBRE = 'oys-libre';
export function modoLibre() {
  try {
    return localStorage.getItem(CLAVE_LIBRE) !== '0';
  } catch {
    return true;
  }
}
export function fijarModoLibre(si: boolean) {
  try {
    if (si) localStorage.removeItem(CLAVE_LIBRE);
    else localStorage.setItem(CLAVE_LIBRE, '0');
  } catch {
    /* sin almacenamiento */
  }
}

function empezado(e?: EstadoEjercicio) {
  return !!e && (e.pasos.length > 0 || e.guiado || e.test !== null || e.demo.length > 0);
}

/**
 * Un bloque se abre cuando el anterior del mismo módulo está hecho (guiado + test aprobado).
 * El primero siempre está abierto, y uno ya empezado no se vuelve a cerrar.
 */
export function bloqueAbierto(p: Progreso, m: Modulo, id: string) {
  if (modoLibre()) return true;
  if (empezado(p.ejercicios[id])) return true;
  const lista = bloquesObligatorios(m);
  // La ampliación se abre al terminar los obligatorios
  if (esOpcional(m, id)) return lista.every((e) => ejercicioCompletado(p.ejercicios[e.id]));
  const k = lista.findIndex((e) => e.id === id);
  if (k <= 0) return true;
  return ejercicioCompletado(p.ejercicios[lista[k - 1].id]);
}

/** Bloque que toca ahora en el módulo (el primero sin terminar), o undefined si está todo hecho */
export function bloqueQueToca(p: Progreso, m: Modulo) {
  return bloquesObligatorios(m).find((e) => !ejercicioCompletado(p.ejercicios[e.id]));
}

/** Qué pasos están hechos en un bloque */
export function pasosHechos(p: Progreso, ej: Ejercicio, notasErp: Record<string, { nota: number } | undefined>): Record<PasoId, boolean> {
  const e = p.ejercicios[ej.id];
  const practicas = PRACTICAS_POR_EJERCICIO[ej.id] ?? [];
  return {
    concepto: empezado(e),
    guiado: !!e?.guiado,
    // Opcional: se da por hecha al pasar al Test (así no se queda pendiente); el progreso guardado no cambia
    memoria: !!e?.guiado && (e?.test ?? null) !== null,
    test: (e?.test ?? 0) >= APROBADO,
    erp: practicas.length > 0 && practicas.every((x) => (notasErp[x]?.nota ?? 0) >= 1),
    demo: ej.checklist.length > 0 && (e?.demo.length ?? 0) >= ej.checklist.length,
  };
}

/** Paso por el que seguir un bloque */
export function pasoQueToca(p: Progreso, ej: Ejercicio, notasErp: Record<string, { nota: number } | undefined>): PasoId {
  const h = pasosHechos(p, ej, notasErp);
  const lista = pasosDe(ej);
  if (!h.concepto) return 'concepto';
  return (lista.find((x) => x.id !== 'concepto' && !pasoOpcional(x.id) && !h[x.id])?.id ?? lista[lista.length - 1].id) as PasoId;
}

/* ---------- Fases del módulo: Configurar / Operar / Para saber más ---------- */
export type FaseId = Fase | 'saber';

/** Cómo se presenta cada fase (selector de la página de módulo y menú lateral) */
export const FASE_UI: Record<FaseId, { titulo: string; corto: string; icono: string }> = {
  configurar: { titulo: 'Configurar', corto: 'Dejas el ERP preparado: maestros, códigos y parámetros.', icono: 'engranaje' },
  operar: { titulo: 'Operar', corto: 'Trabajas el día a día: documentos, asientos, cobros y pagos.', icono: 'rayo' },
  saber: { titulo: 'Para saber más', corto: 'Ampliación opcional: no bloquea el avance.', icono: 'libro' },
};

export interface GrupoFase {
  id: FaseId;
  etapas: Etapa[];
  /** Bloques de la fase (sin las etapas que solo traen una nota) */
  bloques: Ejercicio[];
}

/**
 * Las etapas del módulo agrupadas por fase, en el orden Configurar, Operar, Para saber más.
 * Las ampliaciones (opcional) van a «Para saber más»; lo que no tiene fase se suma a la última fase obligatoria.
 */
export function fasesDe(m: Modulo): GrupoFase[] {
  const mapa: Record<FaseId, Etapa[]> = { configurar: [], operar: [], saber: [] };
  let ultima: Fase = 'operar';
  for (const e of etapasDe(m)) {
    if (e.opcional) mapa.saber.push(e);
    else {
      if (e.fase) ultima = e.fase;
      mapa[e.fase ?? ultima].push(e);
    }
  }
  return (['configurar', 'operar', 'saber'] as FaseId[])
    .filter((id) => mapa[id].length > 0)
    .map((id) => ({ id, etapas: mapa[id], bloques: mapa[id].flatMap((e) => e.bloques) }));
}

/** ¿El módulo tiene las dos fases (Configurar y Operar)? Solo entonces hay selector de fases */
export function conSelectorDeFases(grupos: GrupoFase[]) {
  return grupos.some((g) => g.id === 'configurar' && g.bloques.length + g.etapas.length > 0) && grupos.some((g) => g.id === 'operar');
}

export function esFaseId(x: unknown): x is FaseId {
  return x === 'configurar' || x === 'operar' || x === 'saber';
}

/** Fase a la que pertenece un bloque */
export function faseDeBloque(m: Modulo, id: string): FaseId | undefined {
  return fasesDe(m).find((g) => g.bloques.some((b) => b.id === id))?.id;
}

const CLAVE_FASE = 'oys-fase:';
export function faseGuardada(moduloId: string): FaseId | undefined {
  try {
    const v = localStorage.getItem(CLAVE_FASE + moduloId);
    return esFaseId(v) ? v : undefined;
  } catch {
    return undefined;
  }
}
export function guardarFase(moduloId: string, fase: FaseId) {
  try {
    localStorage.setItem(CLAVE_FASE + moduloId, fase);
  } catch {
    /* sin almacenamiento */
  }
}

/**
 * Fase que se abre al entrar al módulo: la del siguiente bloque pendiente si ya has empezado;
 * si no has empezado o está todo hecho, Configurar.
 */
export function faseQueToca(p: Progreso, m: Modulo, grupos: GrupoFase[]): FaseId {
  const obligatorios = bloquesObligatorios(m);
  const empezadoAlgo = obligatorios.some((e) => p.ejercicios[e.id]);
  const toca = bloqueQueToca(p, m);
  if (!empezadoAlgo || !toca) return 'configurar';
  const f = grupos.find((g) => g.bloques.some((b) => b.id === toca.id))?.id;
  return f ?? 'configurar';
}

/** Fase activa de un módulo: la de la URL, si no la recordada, si no la que toca */
export function faseActiva(p: Progreso, m: Modulo, grupos: GrupoFase[], url: string | null): FaseId {
  const hay = (f: unknown): f is FaseId => esFaseId(f) && grupos.some((g) => g.id === f);
  if (hay(url)) return url;
  const g = faseGuardada(m.id);
  if (hay(g)) return g;
  return faseQueToca(p, m, grupos);
}
