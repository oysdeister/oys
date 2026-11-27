import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent as KEvent, type ReactNode } from 'react';
import { Glosa } from '../Glosario';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { Hotspot, Seccion } from '../../types';
import { idModulo, imgSrc, META } from '../../content';
import { posCampo } from '../../content/camposPos';
import { conIni } from '../../lib/texto';
import { Icon } from '../Icon';
import './campos.css';

interface Vista {
  imagen: string;
  hotspots: Hotspot[];
}

/** Recuadro en porcentajes sobre la imagen. */
interface Caja {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Dónde está un campo: en qué captura, su recuadro y el centro de su punto numerado. */
interface Loc {
  vi: number;
  caja: Caja;
  px: number;
  py: number;
  /** Captura estrecha (móvil): centro del punto pequeño y, si se ha apartado al borde, dónde acaba su línea guía. Todo en %. */
  c?: { px: number; py: number; gx?: number; gy?: number };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[*«»"'.:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** ¿La etiqueta del hotspot nombra este campo? Tolera «Campo / Otro», asteriscos y paréntesis. */
function casa(campo: string, etiqueta: string) {
  const b = norm(etiqueta);
  if (!b) return false;
  return campo
    .split('/')
    .map(norm)
    .filter(Boolean)
    .some((a) => a === b || (a.length >= 4 && b.startsWith(a)) || (b.length >= 4 && a.startsWith(b)));
}

const ENLACES = new Set(['y', 'e', 'o', 'u', 'de', 'del', 'en', 'con', 'por', 'a', 'al', 'la', 'el']);

/** El hotspot nombra OTRO campo que empieza igual («Grupo» frente a «Grupo precio»). Misma regla que _fuente/campos-ocr/casar.py. */
function compuesto(campo: string, etiqueta: string) {
  if (campo.includes('/') || campo.includes('·') || /\d/.test(etiqueta)) return false;
  const a = norm(campo);
  const pal = etiqueta.split(/\s+/).filter(Boolean);
  const n = a.split(' ').length;
  if (!a || pal.length <= n || norm(pal.slice(0, n).join(' ')) !== a) return false;
  const sig = pal[n];
  return /^[a-záéíóúüñ]+$/.test(sig) && !ENLACES.has(sig);
}

/** Separación mínima entre centros de dos puntos, en píxeles de la captura tal como se ve (punto de 26 px + aire). */
const HUECO_PX = 30;
const lim = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
/** Por debajo de este ancho (px) la captura de la página usa puntos pequeños y, si chocan, línea guía al borde. */
const COMPACTO_MAX = 600;
/** Diámetro del punto pequeño (campos.css: .ccx-frame.compacto .ccx-pin). */
const PIN_C = 17;
/** Pequeños desvíos permitidos junto a la etiqueta antes de mandar el punto al borde (px). */
const CERCA: [number, number][] = [[0, 0], [0, -5], [0, 5], [-5, 0], [0, -9], [0, 9], [-6, -6], [-6, 6], [-11, 0]];

/**
 * Colocación para capturas estrechas: punto pequeño justo a la izquierda de su etiqueta; si choca con otro punto,
 * tapa otra etiqueta o el botón de ampliar, se aparta al borde lateral más cercano con una línea guía hasta la etiqueta.
 */
function compactar(lista: (Loc | null)[], vistas: Vista[], asp: Record<string, number>, anchos: Record<string, number>) {
  const R = PIN_C / 2;
  const PASO = PIN_C + 3;
  vistas.forEach((v, vi) => {
    const W = anchos[v.imagen];
    if (!W || W >= COMPACTO_MAX) return;
    const H = W * (asp[v.imagen] ?? 9 / 16);
    const filas = lista.flatMap((l, i) => (l && l.vi === vi ? [i] : []));
    const et = new Map(filas.map((i) => {
      const c = lista[i]!.caja;
      return [i, { x: (c.x / 100) * W, y: (c.y / 100) * H, w: (c.w / 100) * W, h: (c.h / 100) * H }] as const;
    }));
    const ampliar = { x: W - 6 - 36, y: H - 6 - 36, w: 36, h: 36 };
    const puestos: { x: number; y: number }[] = [];
    const dentro = (x: number, y: number) => x >= R + 1 && x <= W - R - 1 && y >= R + 1 && y <= H - R - 1;
    const choca = (x: number, y: number) => puestos.some((o) => Math.abs(o.x - x) < PIN_C + 2 && Math.abs(o.y - y) < PIN_C + 2);
    const tapa = (x: number, y: number, propia: number) =>
      [...filas.filter((f) => f !== propia).map((f) => et.get(f)!), ampliar].some((e) => x + R > e.x && x - R < e.x + e.w && y + R > e.y && y - R < e.y + e.h);
    const poner = (i: number, x: number, y: number, guia?: { x: number; y: number }) => {
      puestos.push({ x, y });
      lista[i] = { ...lista[i]!, c: { px: (x / W) * 100, py: (y / H) * 100, ...(guia ? { gx: (guia.x / W) * 100, gy: (guia.y / H) * 100 } : {}) } };
    };
    const apartados: number[] = [];
    for (const i of filas) {
      const e = et.get(i)!;
      const ax = e.x - R - 2;
      const ay = e.y + e.h / 2;
      // A la izquierda de la etiqueta (lo normal) y, si no cabe, justo a su derecha.
      const bx = e.x + e.w + R + 2;
      const cerca = [...CERCA.map(([dx, dy]) => [ax + dx, ay + dy] as const), ...CERCA.slice(0, 3).map(([, dy]) => [bx, ay + dy] as const)];
      const sitio = cerca.find(([x, y]) => dentro(x, y) && !choca(x, y) && !tapa(x, y, i));
      if (sitio) poner(i, sitio[0], sitio[1]);
      else apartados.push(i);
    }
    /** Distancia de un punto al segmento a-b (para que la guía no pase por encima de otro punto). */
    const aSeg = (p: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) => {
      const dx = b.x - a.x, dy = b.y - a.y;
      const t = dx || dy ? lim(((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy), 0, 1) : 0;
      return Math.hypot(p.x - a.x - t * dx, p.y - a.y - t * dy);
    };
    for (const i of apartados) {
      const e = et.get(i)!;
      const ay = lim(e.y + e.h / 2, R + 1, H - R - 1);
      // Se prueban los dos bordes y varias alturas: gana la guía que no cruza otros puntos, no tapa etiquetas y es más corta.
      let mejor: { x: number; y: number; guia: { x: number; y: number }; coste: number } | null = null;
      for (const izq of [true, false]) {
        const x = izq ? R + 3 : W - R - 3;
        // La guía acaba en el lado de la etiqueta que mira al borde (así no cruza su texto).
        const guia = { x: izq ? Math.max(e.x - 2, x) : Math.min(e.x + e.w + 2, x), y: ay };
        for (let k = 0; k < 2 * Math.ceil(H / PASO) + 2; k++) {
          const y = ay + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * PASO;
          if (!dentro(x, y) || choca(x, y)) continue;
          const cruces = puestos.filter((o) => aSeg(o, { x, y }, guia) < R + 2).length;
          const coste = cruces * 45 + (tapa(x, y, i) ? 40 : 0) + Math.hypot(guia.x - x, guia.y - y) + Math.abs(y - ay) / 2;
          if (!mejor || coste < mejor.coste) mejor = { x, y, guia, coste };
        }
      }
      const { x, y, guia } = mejor ?? { x: R + 3, y: ay, guia: { x: e.x - 2, y: ay } };
      poner(i, x, y, Math.hypot(guia.x - x, guia.y - y) > PIN_C ? guia : undefined);
    }
  });
  return lista;
}

/** Nombre del campo sin el asterisco de obligatorio. */
const limpio = (campo: string) => campo.replace(/\s*\*\s*$/, '');

/**
 * Captura real de la pantalla con todos los campos numerados y su tabla debajo.
 * Al pulsar un número o una fila, sale un globo con todo el campo encima de la captura,
 * junto a su punto y sin tapar ni ese punto ni el siguiente (también en la ampliada).
 */
export function CapturaCampos({ s, modulo, ini }: { s: Seccion; modulo: string; ini: string }) {
  const t = (x: string) => conIni(x, ini);
  const reducir = useReducedMotion();

  const vistas = useMemo<Vista[]>(() => {
    const m = new Map<string, Vista>();
    for (const p of s.pasos) {
      if (!p.imagen) continue;
      const v = m.get(p.imagen) ?? { imagen: p.imagen, hotspots: [] };
      if (p.hotspot && !v.hotspots.some((h) => h.x === p.hotspot!.x && h.y === p.hotspot!.y)) v.hotspots.push(p.hotspot);
      m.set(p.imagen, v);
    }
    return [...m.values()];
  }, [s]);

  /** Proporción alto/ancho de cada captura (para medir solapes); 16:9 hasta que carga. */
  const [asp, setAsp] = useState<Record<string, number>>({});
  /** Ancho real con que se pinta cada captura (para que los puntos no se toquen, también a 375 px). */
  const [anchos, setAnchos] = useState<Record<string, number>>({});
  const figs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((es) => {
      setAnchos((a) => {
        let n = a;
        for (const e of es) {
          const img = (e.target as HTMLElement).dataset.img;
          const w = Math.round(e.contentRect.width);
          if (img && w > 0 && Math.abs((a[img] ?? 0) - w) > 8) n = { ...n, [img]: w };
        }
        return n;
      });
    });
    figs.current.forEach((f) => f && ro.observe(f));
    return () => ro.disconnect();
  }, [vistas]);

  /** Para cada fila: dónde se ve su campo. Primero la posición por OCR; si no, el hotspot de un paso. */
  const locs = useMemo<(Loc | null)[]>(() => {
    const base = s.campos.map((c, i): Omit<Loc, 'px' | 'py'> | null => {
      const p = posCampo(s.id, i);
      if (p) {
        const vi = vistas.findIndex((v) => v.imagen === p.imagen);
        if (vi >= 0) return { vi, caja: { x: p.x, y: p.y, w: p.w, h: p.h } };
      }
      for (let vi = 0; vi < vistas.length; vi++) {
        const h = vistas[vi].hotspots.find((x) => casa(c.campo, x.etiqueta) && !compuesto(c.campo, x.etiqueta));
        if (h) return { vi, caja: { x: h.x, y: h.y, w: h.w, h: h.h } };
      }
      return null;
    });
    // Punto pegado a la izquierda del recuadro (CSS lo corre su ancho), a media altura; si choca con otro, se aparta.
    // Se prueba primero hacia la izquierda (hueco libre, no tapa la etiqueta), luego arriba/abajo y, en último caso, a la derecha.
    const puestos: Loc[] = [];
    const desvios: [number, number][] = [[0, 0]];
    for (let k = 1; k <= 6; k++) desvios.push([-k / 2, 0], [0, -k / 2], [0, k / 2], [-k / 2, -k / 2], [-k / 2, k / 2]);
    for (let k = 1; k <= 6; k++) desvios.push([k, 0]);
    const lista = base.map((b) => {
      if (!b) return null;
      const img = vistas[b.vi].imagen;
      const r = asp[img] ?? 9 / 16;
      const ancho = anchos[img] ?? 900;
      // En móvil el punto mide 22 px (campos.css), así que basta menos aire y quedan más cerca de su campo.
      const movil = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 640px)').matches;
      const hueco = ((movil ? HUECO_PX - 6 : HUECO_PX) / ancho) * 100;
      const minX = (32 / ancho) * 100; // el CSS no deja el punto más a la izquierda de 32 px
      const x0 = lim(b.caja.x, minX, 99.6);
      const y0 = lim(b.caja.y + b.caja.h / 2, 2.5, 97.5);
      const libre = (x: number, y: number) => !puestos.some((o) => o.vi === b.vi && Math.hypot(o.px - x, (o.py - y) * r) < hueco);
      let px = x0;
      let py = y0;
      for (const [dx, dy] of desvios) {
        const x = x0 + dx * hueco;
        const y = y0 + (dy * hueco) / r;
        if (x < minX || x > 99.6 || y < 2.5 || y > 97.5) continue;
        if (libre(x, y)) {
          px = x;
          py = y;
          break;
        }
      }
      const l: Loc = { ...b, px, py };
      puestos.push(l);
      return l;
    });
    return compactar(lista, vistas, asp, anchos);
  }, [s.id, s.campos, vistas, asp, anchos]);


  const total = s.campos.length;
  /** La ampliada va en un portal, fuera de la página del bloque: le pasamos el color del módulo. */
  const cMod = META[modulo]?.color ?? META[idModulo(modulo)]?.color;
  const colorMod = cMod ? ({ ['--mod' as string]: cMod } as CSSProperties) : undefined;
  const hayPuntos = locs.some(Boolean);

  const [activa, setActiva] = useState<number | null>(null);
  const [grande, setGrande] = useState<number | null>(null);
  /** Dónde va el globo del campo activo (medido en píxeles tras pintarlo). */
  const [pos, setPos] = useState<Sitio | null>(null);

  // Tras elegir: llevar la vista a la captura (desde la tabla) o el foco al globo (al pulsar o recorrer).
  const pendiente = useRef<'figura' | 'ficha' | null>(null);
  const raiz = useRef<HTMLDivElement>(null);
  const raizLbx = useRef<HTMLDivElement>(null);
  const globoPag = useRef<HTMLDivElement>(null);
  const globoLbx = useRef<HTMLDivElement>(null);
  /** Escena (captura + globo) de cada vista en la página y la de la ampliada. */
  const escenas = useRef<(HTMLDivElement | null)[]>([]);
  const escenaLbx = useRef<HTMLDivElement | null>(null);
  /** Captura en la que estaba el globo la última vez (para saber si ha saltado). */
  const ultima = useRef<number | null>(null);

  /** Captura en la que va el globo del campo i (en la página, o en la ampliada que está abierta). */
  const casaDe = (i: number, defecto: number) => locs[i]?.vi ?? defecto;
  /** Vista donde se pinta ahora el globo (o null si no hay globo sobre una captura). */
  const vistaGlobo = activa == null || !vistas.length ? null : grande !== null ? grande : casaDe(activa, 0);
  const claveSitio = activa == null || vistaGlobo == null ? '' : `${activa}|${vistaGlobo}|${grande !== null ? 'z' : 'p'}`;

  const elegir = (i: number, tras: 'figura' | 'ficha' | null = null) => {
    setActiva(i);
    if (grande !== null) {
      const l = locs[i];
      if (l && l.vi !== grande) setGrande(l.vi);
    }
    pendiente.current = tras;
  };
  const mover = (d: number) => {
    if (!total) return;
    const i = activa == null ? 0 : (activa + d + total) % total;
    elegir(i, 'ficha');
  };
  const cerrarGrande = useCallback(() => setGrande(null), []);

  /** Mide y coloca el globo: junto al punto, sin tapar ni el punto activo ni el siguiente. */
  const colocar = () => {
    if (activa == null || vistaGlobo == null) return;
    const zoom = grande !== null;
    const st = zoom ? escenaLbx.current : escenas.current[vistaGlobo];
    const g = zoom ? globoLbx.current : globoPag.current;
    const frame = st?.querySelector<HTMLElement>('.ccx-frame');
    if (!st || !g || !frame || !st.offsetWidth) return;
    const R = st.getBoundingClientRect();
    // La ampliada entra con una animación de escala: todo se pasa a píxeles sin escalar de la escena.
    const esc = R.width / st.offsetWidth || 1;
    const aLocal = (r: DOMRect): Rect => ({ x: (r.left - R.left) / esc, y: (r.top - R.top) / esc, w: r.width / esc, h: r.height / esc });
    const F = aLocal(frame.getBoundingClientRect());
    const w = Math.round(Math.max(200, Math.min(340, F.w - 16)));
    g.style.width = `${w}px`;
    g.style.setProperty('--gmax', 'none');
    const h = g.offsetHeight;
    const pinA = st.querySelector<HTMLElement>(`.ccx-pin[data-fila="${activa}"]`);
    const pinN = activa + 1 < total ? st.querySelector<HTMLElement>(`.ccx-pin[data-fila="${activa + 1}"]`) : null;
    const caja = st.querySelector<HTMLElement>('.ccx-box');
    const A = pinA ? aLocal(pinA.getBoundingClientRect()) : null;
    const N = pinN ? aLocal(pinN.getBoundingClientRect()) : null;
    const C = caja ? aLocal(caja.getBoundingClientRect()) : null;
    const dentro: Rect = { x: F.x + 8, y: F.y + 8, w: F.w - 16, h: F.h - 16 };
    let r = buscarSitio(dentro, w, h, A, N, C);
    let fuera = false;
    let gmax: number | undefined;
    if (!r && zoom) {
      // Ampliada: siempre encima. Si no cabe en la captura, vale toda la pantalla (sin tapar la X de cerrar).
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;
      const V: Rect = { x: (8 - R.left) / esc, y: (68 - R.top) / esc, w: (vw - 16) / esc, h: (vh - 76) / esc };
      const hh = Math.min(h, V.h);
      if (hh < h) gmax = hh;
      r = buscarSitio(V, w, hh, A, N, C) ?? menosMalo(V, w, hh, A, N);
    }
    if (!r) {
      // Último recurso (captura pequeña en la página): pegado por fuera, justo debajo de la captura.
      fuera = true;
      const cx = A ? A.x + A.w / 2 : F.x + F.w / 2;
      const x = lim(cx - w / 2, F.x + 8, F.x + F.w - 8 - w);
      r = { x, y: F.y + F.h + 14, lado: A ? 'abajo' : 'libre', pico: lim(cx - x, 18, w - 18) };
    }
    const nuevo: Sitio = { k: claveSitio, ...r, w, h: gmax ?? h, fuera, gmax };
    setPos((p) => (p && p.k === nuevo.k && p.fuera === nuevo.fuera && p.lado === nuevo.lado && p.gmax === nuevo.gmax && Math.abs(p.x - nuevo.x) < 0.6 && Math.abs(p.y - nuevo.y) < 0.6 && Math.abs(p.h - nuevo.h) < 0.6 && p.w === nuevo.w && Math.abs(p.pico - nuevo.pico) < 0.6 ? p : nuevo));
  };
  const colocarRef = useRef(colocar);
  colocarRef.current = colocar;

  useLayoutEffect(() => {
    colocarRef.current();
  }, [claveSitio, locs, anchos, asp]);

  // Se vuelve a medir si cambia el tamaño de la escena o del globo, al redimensionar y al acabar la animación de la ampliada.
  useEffect(() => {
    if (vistaGlobo == null) return;
    const st = grande !== null ? escenaLbx.current : escenas.current[vistaGlobo];
    const g = grande !== null ? globoLbx.current : globoPag.current;
    const f = () => colocarRef.current();
    window.addEventListener('resize', f);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(f) : null;
    if (st) ro?.observe(st.querySelector('.ccx-frame') ?? st);
    if (g) ro?.observe(g);
    const tm = window.setTimeout(f, 380);
    return () => {
      window.removeEventListener('resize', f);
      ro?.disconnect();
      window.clearTimeout(tm);
    };
  }, [claveSitio, grande, vistaGlobo]);

  useEffect(() => {
    const que = pendiente.current;
    pendiente.current = null;
    if (activa == null) return;
    if (!que) {
      if (grande === null) ultima.current = casaDe(activa, 0);
      return;
    }
    const comp: ScrollBehavior = reducir ? 'auto' : 'smooth';
    const g = grande !== null ? globoLbx.current : globoPag.current;
    if (que === 'figura' && grande === null && !vistas.length) {
      g?.scrollIntoView({ block: 'nearest', behavior: comp });
    } else if (que === 'figura' && grande === null) {
      figs.current[casaDe(activa, 0)]?.scrollIntoView({ block: 'start', behavior: comp });
      ultima.current = casaDe(activa, 0);
    } else if (que === 'ficha') {
      g?.focus({ preventScroll: true });
      // Si el globo ha saltado a otra captura, se muestra esa captura desde arriba; si no, basta con ver el globo.
      const vk = casaDe(activa, 0);
      if (grande === null && vistas.length && vk !== ultima.current) figs.current[vk]?.scrollIntoView({ block: 'start', behavior: comp });
      else g?.scrollIntoView({ block: 'nearest', behavior: comp });
    }
    ultima.current = grande === null ? casaDe(activa, 0) : ultima.current;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activa, grande]);

  /** Cierra el globo; con teclado, el foco vuelve a su punto. */
  const cerrarGlobo = (devolverFoco: boolean) => {
    if (activa == null) return;
    if (devolverFoco) {
      const st = grande !== null ? escenaLbx.current : vistaGlobo != null ? escenas.current[vistaGlobo] : null;
      const pin = st?.querySelector<HTMLElement>(`.ccx-pin[data-fila="${activa}"]`);
      pin?.focus({ preventScroll: true });
    }
    setActiva(null);
  };
  const cerrarRef = useRef(cerrarGlobo);
  cerrarRef.current = cerrarGlobo;

  // Esc cierra el globo antes que la ampliada (se adelanta al Esc del Lightbox); clic fuera también lo cierra.
  useEffect(() => {
    if (activa == null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      if (document.querySelector('.gl-pop')) return; // primero se cierra la definición del glosario
      e.preventDefault();
      e.stopImmediatePropagation();
      cerrarRef.current(true);
    };
    const fuera = (e: PointerEvent) => {
      const n = e.target as Element | null;
      if (!n || !(n instanceof Element)) return;
      if (n.closest('.ccx-globo, .ccx-ficha, .gl-pop')) return;
      const mio = raiz.current?.contains(n) || raizLbx.current?.contains(n);
      if (mio && n.closest('.ccx-pin, tr.cc-has, .ccx-ampliar')) return;
      cerrarRef.current(false);
    };
    window.addEventListener('keydown', tecla, true);
    document.addEventListener('pointerdown', fuera, true);
    return () => {
      window.removeEventListener('keydown', tecla, true);
      document.removeEventListener('pointerdown', fuera, true);
    };
  }, [activa]);

  const teclas = (e: KEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      mover(1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      mover(-1);
    }
  };

  /** Todo lo de un campo: número, nombre, obligatorio, qué es, ejemplo y Anterior/Siguiente. */
  const contenido = (visto: boolean, idNombre: string) => {
    const c = s.campos[activa!];
    return (
      <>
        <div className="ccx-g-cab">
          <span className="ccx-g-num" aria-hidden="true">
            {activa! + 1}
          </span>
          <div className="ccx-g-tit">
            <p className="ccx-cuenta">
              Campo {activa! + 1} de {total}
            </p>
            <h4 className="ccx-nombre" id={idNombre}>
              {t(limpio(c.campo))}
              {/\*\s*$/.test(c.campo) && <span className="ccx-oblig">Obligatorio</span>}
            </h4>
          </div>
          <button type="button" className="ccx-g-x" onClick={() => cerrarGlobo(true)} aria-label="Cerrar la explicación del campo">
            <Icon name="cerrar" size={16} />
          </button>
        </div>
        <p className="ccx-que">
          <Glosa>{t(c.significado)}</Glosa>
        </p>
        {c.ejemplo && (
          <p className="ccx-ej">
            <span>Ejemplo</span> <b>{t(c.ejemplo)}</b>
          </p>
        )}
        {!visto && vistas.length > 0 && <p className="ccx-nota">Este campo no sale en la captura.</p>}
        <div className="ccx-nav">
          <button type="button" className="ccx-btn" onClick={() => mover(-1)} aria-label="Campo anterior">
            <Icon name="atras" size={18} />
            <span>Anterior</span>
          </button>
          <button type="button" className="ccx-btn" onClick={() => mover(1)} aria-label="Campo siguiente">
            <span>Siguiente</span>
            <Icon name="flecha" size={18} />
          </button>
        </div>
      </>
    );
  };

  /** Globo encima de la captura vk, junto al punto del campo activo. */
  const globo = (vk: number, enLbx: boolean) => {
    if (activa == null || vistaGlobo !== vk || (!enLbx && grande !== null)) return null;
    const l = locs[activa];
    const visto = !!l && l.vi === vk;
    const listo = pos && pos.k === claveSitio ? pos : null;
    const idNombre = `ccx-n-${s.id}-${enLbx ? 'z' : 'p'}`;
    const estilo = {
      left: listo ? `${listo.x}px` : 0,
      top: listo ? `${listo.y}px` : 0,
      width: listo ? `${listo.w}px` : undefined,
      // Hasta medirlo, invisible pero enfocable (con visibility: hidden no podría recibir el foco).
      opacity: listo ? undefined : 0,
      pointerEvents: listo ? undefined : 'none',
      ['--pico' as string]: listo ? `${listo.pico}px` : undefined,
      ['--gmax' as string]: listo?.gmax ? `${listo.gmax}px` : 'none',
    } as CSSProperties;
    return (
      <div
        ref={enLbx ? globoLbx : globoPag}
        className={`ccx-globo lado-${listo?.lado ?? 'libre'}${listo?.fuera ? ' fuera' : ''}`}
        style={estilo}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-labelledby={idNombre}
        aria-live="polite"
        key={activa}
      >
        <span className="ccx-pico" aria-hidden="true" />
        <div className="ccx-globo-in">{contenido(visto, idNombre)}</div>
      </div>
    );
  };

  /** Parte sin capturas: la ficha va encima de la tabla, como siempre. */
  const fichaSinCaptura = () => {
    if (activa == null) return null;
    const idNombre = `ccx-n-${s.id}-t`;
    return (
      <div ref={globoPag} className="ccx-ficha" tabIndex={-1} onKeyDown={teclas} role="region" aria-labelledby={idNombre} aria-live="polite" key={activa}>
        {contenido(false, idNombre)}
      </div>
    );
  };

  const lienzo = (vk: number, zoom: boolean) => {
    const v = vistas[vk];
    const act = activa != null && locs[activa]?.vi === vk ? locs[activa]! : null;
    const r = asp[v.imagen];
    // Ampliada: la captura entera cabe en la pantalla (sin desplazarse), así el globo siempre se ve encima.
    const ancho = zoom && r ? ({ width: `min(100%, calc((100dvh - 124px) / ${r}))` } as CSSProperties) : undefined;
    const fuera = pos && pos.k === claveSitio && pos.fuera && vistaGlobo === vk && !zoom;
    // Captura estrecha en la página: puntos pequeños y líneas guía (la ampliada no cambia).
    const comp = !zoom && (anchos[v.imagen] ?? Infinity) < COMPACTO_MAX;
    return (
      <div
        className="ccx-escena"
        ref={(el) => {
          if (zoom) escenaLbx.current = el;
          else escenas.current[vk] = el;
        }}
        onKeyDown={teclas}
        style={fuera ? { paddingBottom: `${pos!.h + 14}px` } : undefined}
      >
        <div className={`cc-frame ccx-frame${zoom ? ' zoom' : ''}${comp ? ' compacto' : ''}${act ? ' con-activo' : ''}`} style={ancho}>
          <img
            src={imgSrc(modulo, v.imagen)}
            alt={`Pantalla del ERP: ${t(s.titulo)}`}
            draggable={false}
            loading="lazy"
            onLoad={(e) => {
              const im = e.currentTarget;
              if (im.naturalWidth && !asp[v.imagen]) setAsp((a) => ({ ...a, [v.imagen]: im.naturalHeight / im.naturalWidth }));
            }}
          />
          {act && (
            <div
              className="ccx-box"
              style={{ left: `${act.caja.x}%`, top: `${act.caja.y}%`, width: `${act.caja.w}%`, height: `${act.caja.h}%` }}
              aria-hidden="true"
            />
          )}
          {comp && (
            <svg className="ccx-guias" aria-hidden="true" focusable="false">
              {locs.map((l, fila) =>
                l && l.vi === vk && l.c?.gx != null ? (
                  <g key={fila} className={`ccx-guia${activa === fila ? ' on' : ''}`}>
                    <line className="ccx-guia-h" x1={`${l.c.px}%`} y1={`${l.c.py}%`} x2={`${l.c.gx}%`} y2={`${l.c.gy}%`} />
                    <line className="ccx-guia-l" x1={`${l.c.px}%`} y1={`${l.c.py}%`} x2={`${l.c.gx}%`} y2={`${l.c.gy}%`} />
                    <circle className="ccx-guia-p" cx={`${l.c.gx}%`} cy={`${l.c.gy}%`} r="2.75" />
                  </g>
                ) : null,
              )}
            </svg>
          )}
          {locs.map((l, fila) =>
            l && l.vi === vk ? (
              <button
                key={fila}
                type="button"
                data-fila={fila}
                className={`ccx-pin${activa === fila ? ' on' : ''}`}
                style={comp && l.c ? { left: `${l.c.px}%`, top: `${l.c.py}%` } : { left: `max(32px, ${l.px}%)`, top: `${l.py}%` }}
                onClick={() => (activa === fila ? cerrarGlobo(false) : elegir(fila, 'ficha'))}
                aria-label={`Campo ${fila + 1}: ${t(limpio(s.campos[fila].campo))}`}
                aria-pressed={activa === fila}
                aria-haspopup="dialog"
              >
                {fila + 1}
              </button>
            ) : null,
          )}
          {!zoom && (
            <button type="button" className="ccx-ampliar" onClick={() => setGrande(vk)} aria-haspopup="dialog" aria-label="Ampliar la captura">
              <Icon name="buscar" size={16} />
              <span>Ampliar</span>
            </button>
          )}
        </div>
        {globo(vk, zoom)}
      </div>
    );
  };

  const filaClave = (e: KEvent, i: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      elegir(i, 'figura');
    }
  };

  return (
    <div className="cc cc-plano ccx" ref={raiz}>
      {total > 0 && (
        <p className={`ccx-pista${activa == null ? '' : ' hecho'}`}>
          {activa == null
            ? hayPuntos
              ? 'Pulsa un número para ver qué es cada campo.'
              : 'Pulsa un campo de la lista para ver qué es.'
            : `Usa ← → o «Siguiente» para recorrer los ${total} campos. Esc cierra la explicación.`}
        </p>
      )}
      {vistas.map((v, vk) => (
        <figure
          key={v.imagen}
          className="cc-shot ccx-shot"
          data-img={v.imagen}
          ref={(el) => {
            figs.current[vk] = el;
          }}
        >
          {lienzo(vk, false)}
        </figure>
      ))}
      {!vistas.length && fichaSinCaptura()}
      {total > 0 && (
        <div className="sec-campos cc-campos">
          <table className="fields ax-table cc-table">
            <thead>
              <tr>
                <th scope="col">Campo</th>
                <th scope="col">Qué es</th>
                <th scope="col">Ejemplo</th>
              </tr>
            </thead>
            <tbody>
              {s.campos.map((c, i) => (
                <tr
                  key={i}
                  className={`cc-has${activa === i ? ' cc-on' : ''}`}
                  onClick={() => elegir(i, 'figura')}
                  onKeyDown={(e) => filaClave(e, i)}
                  tabIndex={0}
                  aria-current={activa === i ? 'true' : undefined}
                >
                  <td>
                    <span className={`cc-n ccx-n${locs[i] ? ' loc' : ''}`} aria-hidden="true">
                      {i + 1}
                    </span>
                    {t(c.campo)}
                  </td>
                  <td>
                    <Glosa>{t(c.significado)}</Glosa>
                  </td>
                  <td>{c.ejemplo ? t(c.ejemplo) : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Lightbox abierto={grande !== null} onCerrar={cerrarGrande}>
        {grande !== null && (
          <div className="ccx ccx-lbx" style={colorMod} ref={raizLbx}>
            {lienzo(grande, true)}
          </div>
        )}
      </Lightbox>
    </div>
  );
}

/** Rectángulo en píxeles de la escena. */
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
type Lado = 'abajo' | 'arriba' | 'derecha' | 'izquierda' | 'libre';
/** Sitio del globo: esquina, lado del punto en que queda y dónde va el pico (px desde su borde). */
interface Hueco {
  x: number;
  y: number;
  lado: Lado;
  pico: number;
}
interface Sitio extends Hueco {
  k: string;
  w: number;
  h: number;
  fuera: boolean;
  gmax?: number;
}

const crece = (r: Rect, d: number): Rect => ({ x: r.x - d, y: r.y - d, w: r.w + 2 * d, h: r.h + 2 * d });
const area = (a: Rect, b: Rect) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
/** Separación entre el punto y el globo (deja sitio al pico). */
const AIRE = 14;
const ORDEN: Lado[] = ['abajo', 'arriba', 'derecha', 'izquierda'];

/** Candidatos alrededor del punto: abajo, arriba, derecha, izquierda, corridos a lo largo para esquivar el siguiente. */
function candidatos(B: Rect, w: number, h: number, A: Rect, pegar: boolean): (Hueco & { coste: number })[] {
  const cx = A.x + A.w / 2;
  const cy = A.y + A.h / 2;
  const out: (Hueco & { coste: number })[] = [];
  ORDEN.forEach((lado, li) => {
    const horiz = lado === 'abajo' || lado === 'arriba';
    const largo = horiz ? w : h;
    const base = horiz ? cx - w / 2 : cy - h / 2;
    const pasos = [0];
    for (let d = 24; d <= largo; d += 24) pasos.push(-d, d);
    const vistos = new Set<number>();
    for (const d of pasos) {
      let x: number;
      let y: number;
      if (horiz) {
        x = lim(base + d, B.x, B.x + B.w - w);
        y = lado === 'abajo' ? A.y + A.h + AIRE : A.y - AIRE - h;
        if (pegar) y = lim(y, B.y, B.y + B.h - h);
      } else {
        y = lim(base + d, B.y, B.y + B.h - h);
        x = lado === 'derecha' ? A.x + A.w + AIRE : A.x - AIRE - w;
        if (pegar) x = lim(x, B.x, B.x + B.w - w);
      }
      const clave = Math.round(horiz ? x : y);
      if (vistos.has(clave)) continue;
      vistos.add(clave);
      const pico = horiz ? cx - x : cy - y;
      const corrido = Math.abs((horiz ? x : y) - base);
      out.push({ x, y, lado, pico: lim(pico, 18, largo - 18), coste: li * 40 + corrido * 0.25 + (pico < 18 || pico > largo - 18 ? 1000 : 0) });
    }
  });
  return out;
}

/** El mejor sitio que cabe entero en B sin tapar el punto activo (A) ni el siguiente (N); evita además el recuadro del campo. */
function buscarSitio(B: Rect, w: number, h: number, A: Rect | null, N: Rect | null, C: Rect | null): Hueco | null {
  if (w > B.w + 0.5 || h > B.h + 0.5) return null;
  const Ai = A ? crece(A, 6) : null;
  const Ni = N ? crece(N, 4) : null;
  const tapa = (g: Rect) => (Ai && area(g, Ai) > 0) || (Ni && area(g, Ni) > 0);
  const cabe = (g: Rect) => g.x >= B.x - 0.5 && g.y >= B.y - 0.5 && g.x + g.w <= B.x + B.w + 0.5 && g.y + g.h <= B.y + B.h + 0.5;
  if (!A) {
    // Campo que no sale en la captura: abajo en el centro, o arriba, sin tapar el número siguiente.
    const xs = [B.x + (B.w - w) / 2, B.x, B.x + B.w - w];
    for (const y of [B.y + B.h - h, B.y])
      for (const x of xs) {
        const g = { x, y, w, h };
        if (!tapa(g)) return { x, y, lado: 'libre', pico: 0 };
      }
    return null;
  }
  let mejor: (Hueco & { coste: number }) | null = null;
  for (const c of candidatos(B, w, h, A, false)) {
    const g = { x: c.x, y: c.y, w, h };
    if (!cabe(g) || tapa(g)) continue;
    const coste = c.coste + (C ? (area(g, C) / Math.max(1, C.w * C.h)) * 60 : 0);
    if (!mejor || coste < mejor.coste) mejor = { ...c, coste };
  }
  return mejor;
}

/** Si nada cabe sin tapar: el que menos tape de los dos puntos (y nunca fuera de B). */
function menosMalo(B: Rect, w: number, h: number, A: Rect | null, N: Rect | null): Hueco {
  if (!A) return { x: B.x + (B.w - w) / 2, y: B.y + B.h - h, lado: 'libre', pico: 0 };
  let mejor: (Hueco & { coste: number }) | null = null;
  for (const c of candidatos(B, w, h, A, true)) {
    const g = { x: c.x, y: c.y, w, h };
    const coste = area(g, crece(A, 6)) * 10 + (N ? area(g, crece(N, 4)) * 10 : 0) + c.coste;
    if (!mejor || coste < mejor.coste) mejor = { ...c, coste };
  }
  return mejor!;
}

/** Captura ampliada a pantalla completa. Esc o tocar fuera la cierra. */
export function Lightbox({ abierto, onCerrar, children }: { abierto: boolean; onCerrar: () => void; children: ReactNode }) {
  const reducir = useReducedMotion();
  const cerrar = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const prev = document.activeElement as HTMLElement | null;
    cerrar.current?.focus();
    const f = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar();
    };
    window.addEventListener('keydown', f);
    const ov = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', f);
      document.body.style.overflow = ov;
      prev?.focus();
    };
  }, [abierto, onCerrar]);
  return createPortal(
    <AnimatePresence>
      {abierto && (
        <motion.div className="lbx" role="dialog" aria-modal="true" aria-label="Captura ampliada" onClick={onCerrar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="lbx-in"
            onClick={(e) => e.stopPropagation()}
            initial={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.9, rotateX: 8 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={reducir ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ transformPerspective: 1200 }}
          >
            {children}
          </motion.div>
          <button ref={cerrar} type="button" className="lbx-x" onClick={onCerrar} aria-label="Cerrar">
            <Icon name="cerrar" size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
