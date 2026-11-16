import { useEffect, useState } from 'react';
import { animate, useReducedMotion } from 'framer-motion';

export async function copiar(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function descargar(nombre: string, contenido: string, tipo = 'application/json') {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/** Hora actual que se refresca cada segundo (para temporizadores) */
export function useAhora(activo = true, cada = 1000) {
  const [ahora, setAhora] = useState(() => Date.now());
  useEffect(() => {
    if (!activo) return;
    const t = setInterval(() => setAhora(Date.now()), cada);
    return () => clearInterval(t);
  }, [activo, cada]);
  return ahora;
}

export function reloj(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${String(m).padStart(2, '0')}:${ss}`;
}

export const fechaLarga = (iso: string) => new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

/** Cifra que cuenta de 0 al valor (respeta reduced-motion: devuelve el valor final) */
export function useContador(hasta: number, { duracion = 1.2, retraso = 0 }: { duracion?: number; retraso?: number } = {}) {
  const reducir = useReducedMotion();
  const [v, setV] = useState(() => (reducir ? hasta : 0));
  useEffect(() => {
    if (reducir) return;
    const c = animate(0, hasta, { duration: duracion, delay: retraso, ease: [0.2, 0.7, 0.2, 1], onUpdate: setV });
    return () => c.stop();
  }, [hasta, duracion, retraso, reducir]);
  return reducir ? hasta : v;
}

/** Sube al principio de la página al montar (cambios de fase del examen) */
export function useArriba() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);
}
