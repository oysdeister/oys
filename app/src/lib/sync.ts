/**
 * Aviso de cambios en el progreso guardado.
 *
 * Cada almacén (progreso de ejercicios, examen, notas del ERP, avance del Taller) llama a
 * `avisarCambio()` después de escribir en localStorage. Si hay sesión de Clerk, `src/auth/sincronizar.ts`
 * escucha este aviso y sube el progreso compactado a la cuenta del alumno (con debounce).
 * Sin Clerk configurado, el aviso no lo escucha nadie y el progreso vive solo en el navegador.
 */
export const EVENTO_CAMBIO = 'oys-progreso-cambio';

/** Mientras se aplica el progreso bajado de la cuenta, no se vuelve a subir. */
let silencio = 0;

export function avisarCambio() {
  if (silencio > 0) return;
  try {
    window.dispatchEvent(new Event(EVENTO_CAMBIO));
  } catch {
    /* fuera del navegador: nada que avisar */
  }
}

export function sinAvisos(f: () => void) {
  silencio++;
  try {
    f();
  } finally {
    silencio--;
  }
}
