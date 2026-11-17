/**
 * Sincroniza el progreso de este navegador con la cuenta de Clerk del alumno (`user.unsafeMetadata.oys`).
 *
 * - Al entrar: fusiona local + cuenta quedándose con el mayor avance, lo aplica aquí y sube lo que falte.
 * - Cada cambio: sube con debounce (2 s). Sin conexión, queda pendiente y se reintenta al volver la red,
 *   al recuperar el foco o en la siguiente visita.
 * - Si entra otra persona en el mismo navegador, el progreso local del anterior no se le mezcla.
 */
import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { EVENTO_CAMBIO, sinAvisos } from '../lib/sync';
import { recargarProgreso } from '../lib/progress';
import { recargarExamen } from '../lib/examen';
import { recargarNotas } from '../erp/practicas';
import { CLAVES_PROGRESO, ajustar, bytes, escribirLocal, esProgresoC, fusionar, igualSinFecha, leerLocal, type ProgresoC } from './compacto';

const CLAVE_DUENO = 'oys-sync-usuario';
const CLAVE_PENDIENTE = 'oys-sync-pendiente';
const ESPERA_MS = 2000;

export type EstadoSync = 'cargando' | 'al-dia' | 'guardando' | 'pendiente' | 'error';

function ls(k: string, v?: string | null) {
  try {
    if (v === undefined) return localStorage.getItem(k);
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* almacenamiento bloqueado */
  }
  return null;
}

function recargarTodo() {
  recargarProgreso();
  recargarExamen();
  recargarNotas();
}

/** Borra el progreso local (al cambiar de usuario en este navegador). */
export function borrarProgresoLocal() {
  for (const k of CLAVES_PROGRESO) ls(k, null);
  ls(CLAVE_PENDIENTE, null);
  recargarTodo();
}

type Usuario = NonNullable<ReturnType<typeof useUser>['user']>;

async function subir(user: Usuario, pc: ProgresoC) {
  await user.update({ unsafeMetadata: { ...user.unsafeMetadata, oys: ajustar(pc) } });
}

/** Deja una función para forzar la subida antes de salir. */
let vaciarAhora: (() => Promise<void>) | null = null;
export async function vaciarPendiente() {
  if (vaciarAhora) await vaciarAhora();
}

export function useSincronizarProgreso(): EstadoSync {
  const { isLoaded, user } = useUser();
  const [estado, setEstado] = useState<EstadoSync>('cargando');
  const listo = useRef(false);
  const temporizador = useRef<number | undefined>(undefined);
  const userId = user?.id;

  useEffect(() => {
    if (!isLoaded || !user) return;
    let vivo = true;
    listo.current = false;

    const empujar = async () => {
      window.clearTimeout(temporizador.current);
      temporizador.current = undefined;
      if (!navigator.onLine) {
        ls(CLAVE_PENDIENTE, '1');
        setEstado('pendiente');
        return;
      }
      const local = leerLocal();
      const remoto = esProgresoC(user.unsafeMetadata?.oys) ? (user.unsafeMetadata.oys as ProgresoC) : null;
      if (igualSinFecha(local, remoto)) {
        ls(CLAVE_PENDIENTE, null);
        setEstado('al-dia');
        return;
      }
      setEstado('guardando');
      try {
        // Por si otro dispositivo subió mientras tanto: fusiona antes de escribir.
        await user.reload();
        const ultimo = esProgresoC(user.unsafeMetadata?.oys) ? (user.unsafeMetadata.oys as ProgresoC) : null;
        const total = fusionar(leerLocal(), ultimo);
        await subir(user, total);
        if (!igualSinFecha(total, leerLocal())) {
          sinAvisos(() => escribirLocal(total));
          recargarTodo();
        }
        ls(CLAVE_PENDIENTE, null);
        if (vivo) setEstado('al-dia');
        if (import.meta.env.DEV) console.info(`[oys] Progreso guardado en la cuenta (${bytes(ajustar(total))} bytes).`);
      } catch (e) {
        ls(CLAVE_PENDIENTE, '1');
        if (vivo) setEstado(navigator.onLine ? 'error' : 'pendiente');
        console.warn('[oys] No se pudo guardar el progreso en la cuenta; se reintentará.', e);
      }
    };

    const programar = () => {
      ls(CLAVE_PENDIENTE, '1');
      if (!listo.current) return;
      setEstado('pendiente');
      window.clearTimeout(temporizador.current);
      temporizador.current = window.setTimeout(() => void empujar(), ESPERA_MS);
    };

    // 1) Al entrar: si el progreso local es de otra persona, se descarta; después se fusiona.
    const dueno = ls(CLAVE_DUENO);
    if (dueno && dueno !== user.id) borrarProgresoLocal();
    ls(CLAVE_DUENO, user.id);
    const remoto = esProgresoC(user.unsafeMetadata?.oys) ? (user.unsafeMetadata.oys as ProgresoC) : null;
    const local = leerLocal();
    const total = fusionar(local, remoto);
    if (!igualSinFecha(total, local)) {
      sinAvisos(() => escribirLocal(total));
      recargarTodo();
    }
    listo.current = true;
    if (!igualSinFecha(total, remoto) || ls(CLAVE_PENDIENTE)) void empujar();
    else setEstado('al-dia');

    vaciarAhora = async () => {
      if (temporizador.current !== undefined || ls(CLAVE_PENDIENTE)) await empujar();
    };
    const alVolverRed = () => void empujar();
    const alOcultar = () => {
      if (document.visibilityState === 'hidden' && temporizador.current !== undefined) void empujar();
    };
    window.addEventListener(EVENTO_CAMBIO, programar);
    window.addEventListener('online', alVolverRed);
    document.addEventListener('visibilitychange', alOcultar);
    return () => {
      vivo = false;
      vaciarAhora = null;
      window.clearTimeout(temporizador.current);
      window.removeEventListener(EVENTO_CAMBIO, programar);
      window.removeEventListener('online', alVolverRed);
      document.removeEventListener('visibilitychange', alOcultar);
    };
    // user cambia de referencia en cada update; solo reinicia al cambiar de persona
  }, [isLoaded, userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return estado;
}
