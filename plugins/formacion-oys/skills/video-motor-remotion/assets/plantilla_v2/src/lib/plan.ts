import type { Escena, Guion, Timing, Transicion, Word } from '../types';

export type PlanItem = {
  escena: Escena;
  index: number;
  /** fotograma global de inicio */
  from: number;
  /** duración en fotogramas */
  dur: number;
  /** fotogramas de la transición de entrada (solape con la anterior) */
  trans: number;
  transTipo: Exclude<Transicion, 'auto'>;
  /** fotogramas antes de que empiece la voz */
  lead: number;
  durMs: number;
  words: Word[];
  hasAudio: boolean;
  chapter: number | null;
  /** tramos de la voz original [desdeMs, hastaMs, retrasoMs] (varios si la escena tiene «huecos») */
  audioTramos: [number, number, number][];
};

/** from/to: tramo del capítulo en la barra; renderFrom/renderTo: tramo que se renderiza en la composición por capítulo
 *  (el primero incluye la portada y el último el cierre). */
export type Chapter = { index: number; numero: number; titulo: string; from: number; to: number; renderFrom: number; renderTo: number };

export type Plan = { items: PlanItem[]; total: number; chapters: Chapter[]; fps: number };

const AUTO: Exclude<Transicion, 'auto'>[] = ['vuelo', 'slide', 'zoom', 'wipe', 'fade', 'slide-arriba'];

/** Estimación si aún no se ha generado la voz (≈ 2,6 palabras/s). */
const estimaMs = (t: string) => Math.max(1500, (t.trim().split(/\s+/).length / 2.6) * 1000);

export function buildPlan(guion: Guion, timing: Timing, fps = 30): Plan {
  const cfg = guion.config ?? {};
  const lead = Math.round((cfg.entrada ?? 0.6) * fps);
  const transF = Math.round((cfg.transicion ?? 0.8) * fps);
  const pausaCap = Math.round((cfg.pausaCapitulo ?? 1.2) * fps);
  const items: PlanItem[] = [];
  let chapter: number | null = null;
  let chapterCount = 0;
  let autoI = 0;

  guion.escenas.forEach((escena, index) => {
    const tm = timing[escena.id];
    const narr = (escena.narracion ?? '').trim();
    const hasAudio = !!narr && !!tm;
    const durMs0 = narr ? (tm?.durMs ?? estimaMs(narr)) : 0;
    // huecos: silencios insertados en la voz (las palabras posteriores se retrasan)
    const huecos = [...(escena.huecos ?? [])].filter((h) => h.ms > 0).sort((a, b) => a.s - b.s);
    const retraso = (ms: number) => huecos.reduce((acc, h) => acc + (h.s * 1000 <= ms ? h.ms : 0), 0);
    const words: Word[] = (tm?.words ?? []).map((w) => (huecos.length ? { ...w, o: w.o + retraso(w.o) } : w));
    const durMs = durMs0 + huecos.reduce((a, h) => a + h.ms, 0);
    const audioTramos: [number, number, number][] = [];
    let a0 = 0;
    let acc = 0;
    for (const h of huecos) {
      const c = Math.min(Math.max(h.s * 1000, a0), durMs0);
      audioTramos.push([a0, c, acc]);
      acc += h.ms;
      a0 = c;
    }
    audioTramos.push([a0, durMs0, acc]);
    const colchon = Math.round((escena.colchon ?? cfg.colchon ?? 1.3) * fps);
    const siguiente = guion.escenas[index + 1];
    const pausa = Math.round((escena.pausa ?? 0) * fps) + (siguiente?.tipo === 'capitulo' && index > 0 ? pausaCap : 0);
    let dur = escena.duracion
      ? Math.round(escena.duracion * fps)
      : lead + Math.ceil((durMs / 1000) * fps) + colchon + pausa;
    dur = Math.max(dur, Math.round(2.5 * fps));

    let transTipo: Exclude<Transicion, 'auto'>;
    const pedida = escena.transicion ?? 'auto';
    if (pedida !== 'auto') transTipo = pedida;
    else if (escena.tipo === 'capitulo') transTipo = 'luz';
    else if (escena.tipo === 'cierre') transTipo = 'zoom';
    else if (escena.tipo === 'pantalla' && guion.escenas[index - 1]?.tipo === 'pantalla') transTipo = 'vuelo';
    else if (escena.tipo === 'pantalla') transTipo = 'fade'; // la pantalla ya entra con su propio vuelo
    else transTipo = AUTO[autoI++ % AUTO.length];
    const trans = index === 0 || transTipo === 'ninguna' ? 0 : transF;

    if (escena.tipo === 'capitulo') chapter = chapterCount++;
    if (escena.tipo === 'portada' || escena.tipo === 'cierre') chapter = null;

    items.push({ escena, index, from: 0, dur, trans, transTipo, lead, durMs, words, hasAudio, chapter, audioTramos });
  });

  // la voz de la escena anterior debe acabar antes de que empiece el solape
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1];
    const voice = Math.ceil((prev.durMs / 1000) * fps);
    const min = prev.lead + voice + items[i].trans + 6;
    if (!prev.escena.duracion && prev.dur < min) prev.dur = min;
    // la transición nunca puede ser más larga que las escenas que une
    items[i].trans = Math.min(items[i].trans, prev.dur - 1, items[i].dur - 1);
  }

  let cursor = 0;
  items.forEach((it, i) => {
    it.from = i === 0 ? 0 : cursor - it.trans;
    cursor = it.from + it.dur;
  });
  const total = cursor;

  const chapters: Chapter[] = [];
  items.forEach((it) => {
    if (it.escena.tipo === 'capitulo') {
      const e = it.escena;
      chapters.push({ index: it.chapter!, numero: e.numero ?? chapters.length + 1, titulo: e.titulo, from: it.from, to: total, renderFrom: it.from, renderTo: total });
    }
    if ((it.escena.tipo === 'cierre') && chapters.length) chapters[chapters.length - 1].to = Math.min(chapters[chapters.length - 1].to, it.from);
  });
  for (let i = 0; i < chapters.length - 1; i++) {
    chapters[i].to = chapters[i + 1].from;
    chapters[i].renderTo = chapters[i + 1].from;
  }
  if (chapters.length) chapters[0].renderFrom = 0;

  return { items, total, chapters, fps };
}

// ---------- palabras clave ----------
export const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]+/g, ' ').trim();

/** Índice de la primera palabra que coincide con «clave» a partir de «desde». */
export function findClave(words: Word[], clave: string, desde = 0): number {
  const cw = norm(clave).split(' ').filter(Boolean);
  if (!cw.length) return -1;
  const ws = words.map((w) => norm(w.w));
  const match = (i: number) => cw.every((c, k) => ws[i + k] !== undefined && ws[i + k].startsWith(c));
  for (let i = desde; i < ws.length; i++) if (match(i)) return i;
  for (let i = 0; i < desde && i < ws.length; i++) if (match(i)) return i;
  return -1;
}
