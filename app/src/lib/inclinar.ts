import { useEffect } from 'react';

/**
 * Inclinación 3D de las tarjetas que son enlaces, en toda la app.
 * Un único oyente en el documento; escribe --incl-x / --incl-y / --incl-a en la tarjeta bajo el puntero
 * y la hoja sistema.css lo convierte en la propiedad `rotate` (no choca con framer-motion).
 * Solo con ratón y sin «reducir movimiento».
 */
const SELECTOR = [
  'a.ax-card',
  'a.po-card',
  'a.route-item',
  'a.po-door',
  'a.ex-foot',
  '.pl-badge',
  '.vc-cap',
  'a.tlp-nave',
  'a.tl-puesto-link',
  '[data-inclina]',
].join(',');

const MAX_DEG = 7;

export function useInclinacion() {
  useEffect(() => {
    const finoYQuieto = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)');
    let actual: HTMLElement | null = null;
    let raf = 0;
    let ultimo: PointerEvent | null = null;

    const soltar = (el: HTMLElement) => {
      el.classList.remove('inclinando');
      el.style.setProperty('--incl-a', '0deg');
    };

    const pintar = () => {
      raf = 0;
      const e = ultimo;
      if (!e) return;
      const t = (e.target as Element | null)?.closest<HTMLElement>(SELECTOR) ?? null;
      if (t !== actual) {
        if (actual) soltar(actual);
        actual = t;
        if (t) {
          t.setAttribute('data-inclina', '');
          const padre = t.parentElement;
          if (padre && !padre.style.perspective) padre.style.perspective = '1100px';
        }
      }
      if (!t) return;
      const r = t.getBoundingClientRect();
      const dx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const dy = ((e.clientY - r.top) / r.height) * 2 - 1;
      // tarjetas anchas giran menos para no «abrirse» demasiado
      const escala = Math.min(1, 340 / Math.max(r.width, 1));
      const ang = Math.min(1, Math.hypot(dx, dy)) * MAX_DEG * Math.max(0.35, escala);
      t.classList.add('inclinando');
      t.style.setProperty('--incl-x', String(dx.toFixed(3)));
      t.style.setProperty('--incl-y', String((-dy).toFixed(3)));
      t.style.setProperty('--incl-a', `${ang.toFixed(2)}deg`);
    };

    const mover = (e: PointerEvent) => {
      if (!finoYQuieto.matches || reducir.matches || e.pointerType !== 'mouse') return;
      ultimo = e;
      if (!raf) raf = requestAnimationFrame(pintar);
    };
    const fuera = () => {
      if (actual) soltar(actual);
      actual = null;
    };

    document.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerleave', fuera);
    window.addEventListener('blur', fuera);
    return () => {
      document.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerleave', fuera);
      window.removeEventListener('blur', fuera);
      cancelAnimationFrame(raf);
    };
  }, []);
}
