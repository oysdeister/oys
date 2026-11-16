import { memo, useEffect, useRef } from 'react';

/**
 * Fondo global: cielo con tres capas de estrellas en paralaje (scroll y ratón), nebulosa
 * turquesa y violeta, unos destellos que parpadean y alguna estrella fugaz.
 * Ligero: las capas se pintan una vez en lienzos aparte y solo se recolocan cuando
 * hay scroll o se mueve el ratón; quieto no gasta nada. Con movimiento reducido, quieto.
 */

function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

interface Capa {
  lienzo: HTMLCanvasElement;
  k: number; // cuánto se mueve con el scroll
  km: number; // cuánto se mueve con el ratón (px)
}

const COLORES_OSCURO = ['255,255,255', '214,236,255', '191,248,238', '207,198,255', '255,241,214'];
const COLORES_CLARO = ['54,88,190', '64,110,210', '40,150,150', '106,92,224'];

function pintaCapa(w: number, h: number, dpr: number, densidad: number, tam: [number, number], brillo: [number, number], seed: number, oscuro: boolean, destellos: boolean) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * dpr);
  c.height = Math.ceil(h * dpr);
  const g = c.getContext('2d');
  if (!g) return c;
  g.scale(dpr, dpr);
  const r = rng(seed);
  const n = Math.round(((w * h) / 10000) * densidad);
  const cols = oscuro ? COLORES_OSCURO : COLORES_CLARO;
  for (let i = 0; i < n; i++) {
    const x = r() * w;
    const y = r() * h;
    const rad = tam[0] + r() * (tam[1] - tam[0]);
    const a = (brillo[0] + r() * (brillo[1] - brillo[0])) * (oscuro ? 1 : 0.55);
    const col = cols[Math.floor(r() * cols.length)];
    if (destellos && rad > 1.3) {
      const gr = g.createRadialGradient(x, y, 0, x, y, rad * 5);
      gr.addColorStop(0, `rgba(${col},${a * 0.55})`);
      gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr;
      g.beginPath();
      g.arc(x, y, rad * 5, 0, Math.PI * 2);
      g.fill();
      if (r() < 0.35) {
        g.strokeStyle = `rgba(${col},${a * 0.5})`;
        g.lineWidth = 0.7;
        g.beginPath();
        g.moveTo(x - rad * 6, y);
        g.lineTo(x + rad * 6, y);
        g.moveTo(x, y - rad * 6);
        g.lineTo(x, y + rad * 6);
        g.stroke();
      }
    }
    g.fillStyle = `rgba(${col},${a})`;
    g.beginPath();
    g.arc(x, y, rad, 0, Math.PI * 2);
    g.fill();
  }
  return c;
}

/* Brillo especular que sigue al ratón en las tarjetas de cristal (variables --mx/--my) */
const SEL_BRILLO = '.ax-card, .mod-card, .route-item, .quiz-opt, .badge, .glass, .sheet, .ax-panel';
let brilloInstalado = false;
function instalaBrillo() {
  if (brilloInstalado || typeof window === 'undefined') return;
  brilloInstalado = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      const el = (e.target as Element | null)?.closest?.(SEL_BRILLO) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
      el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
    },
    { passive: true },
  );
}

const DESTELLOS = Array.from({ length: 14 }, (_, i) => {
  const r = rng(7700 + i * 13);
  return { x: r() * 100, y: r() * 100, d: (r() * 7).toFixed(2), t: (4 + r() * 5).toFixed(2), s: 2 + Math.round(r() * 2) };
});

export const Espacio = memo(function Espacio() {
  const ref = useRef<HTMLCanvasElement>(null);
  const nebulosa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    instalaBrillo();
    const lienzo = ref.current;
    const ctx = lienzo?.getContext('2d');
    if (!lienzo || !ctx) return;
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let capas: Capa[] = [];
    let W = 0;
    let H = 0;
    let dpr = 1;
    const actual = { x: 0, y: 0, s: 0 };
    const objetivo = { x: 0, y: 0, s: 0 };
    let raf = 0;

    const prepara = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      lienzo.width = Math.ceil(W * dpr);
      lienzo.height = Math.ceil(H * dpr);
      const oscuro = document.documentElement.dataset.theme === 'dark' || !!lienzo.closest('.onb');
      const movil = W < 760;
      capas = [
        { lienzo: pintaCapa(W, H, dpr, movil ? 1.5 : 2.1, [0.35, 0.8], [0.25, 0.6], 11, oscuro, false), k: 0.04, km: 4 },
        { lienzo: pintaCapa(W, H, dpr, movil ? 0.5 : 0.7, [0.6, 1.2], [0.4, 0.85], 23, oscuro, false), k: 0.12, km: 10 },
        { lienzo: pintaCapa(W, H, dpr, movil ? 0.08 : 0.11, [1.1, 2.1], [0.7, 1], 37, oscuro, true), k: 0.26, km: 22 },
      ];
      dibuja();
    };

    const dibuja = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      const cw = lienzo.width;
      const ch = lienzo.height;
      for (const c of capas) {
        // desplazamiento con vuelta (mosaico) para que nunca se vea el borde
        let ox = (actual.x * c.km * dpr) % cw;
        let oy = (-actual.s * c.k * dpr + actual.y * c.km * dpr) % ch;
        if (ox > 0) ox -= cw;
        if (oy > 0) oy -= ch;
        for (let x = ox; x < cw; x += cw) for (let y = oy; y < ch; y += ch) ctx.drawImage(c.lienzo, x, y);
      }
      if (nebulosa.current) nebulosa.current.style.transform = `translate3d(${(actual.x * 18).toFixed(1)}px, ${(-actual.s * 0.06 + actual.y * 12).toFixed(1)}px, 0)`;
    };

    const paso = () => {
      raf = 0;
      const k = 0.12;
      actual.x += (objetivo.x - actual.x) * k;
      actual.y += (objetivo.y - actual.y) * k;
      actual.s += (objetivo.s - actual.s) * 0.35;
      dibuja();
      if (Math.abs(objetivo.x - actual.x) > 0.002 || Math.abs(objetivo.y - actual.y) > 0.002 || Math.abs(objetivo.s - actual.s) > 0.3) pide();
      else {
        actual.x = objetivo.x;
        actual.y = objetivo.y;
        actual.s = objetivo.s;
      }
    };
    const pide = () => {
      if (!raf && document.visibilityState !== 'hidden') raf = requestAnimationFrame(paso);
    };

    prepara();
    let t: ReturnType<typeof setTimeout> | undefined;
    const alCambiarTamano = () => {
      clearTimeout(t);
      t = setTimeout(prepara, 150);
    };
    window.addEventListener('resize', alCambiarTamano);
    const tema = new MutationObserver(prepara);
    tema.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const scroll = () => {
      objetivo.s = window.scrollY;
      pide();
    };
    const raton = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      objetivo.x = -(e.clientX / W - 0.5);
      objetivo.y = -(e.clientY / H - 0.5);
      pide();
    };
    if (!reducir) {
      window.addEventListener('scroll', scroll, { passive: true });
      window.addEventListener('pointermove', raton, { passive: true });
    }
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      tema.disconnect();
      window.removeEventListener('resize', alCambiarTamano);
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', raton);
    };
  }, []);

  return (
    <div className="espacio" aria-hidden="true">
      <div ref={nebulosa} className="espacio-nebulosa" />
      <canvas ref={ref} className="espacio-lienzo" />
      <div className="espacio-destellos">
        {DESTELLOS.map((d, i) => (
          <i key={i} style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.s, height: d.s, animationDelay: `${d.d}s`, animationDuration: `${d.t}s` }} />
        ))}
        <b className="espacio-fugaz" />
      </div>
      <div className="espacio-vineta" />
    </div>
  );
});
