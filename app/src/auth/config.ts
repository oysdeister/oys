/** Configuración del acceso: clave de Clerk, direcciones de vuelta y filtro de correos de O&S. */

export const CLAVE_CLERK = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim() || '';
export const CLERK_ACTIVO = CLAVE_CLERK.startsWith('pk_');

/** Dirección de la app sin query ni hash (en GitHub Pages, …/oys/): tras Google o tras salir se vuelve aquí. */
export const URL_APP = window.location.origin + window.location.pathname;
/** Vuelta de Google: la propia pantalla de acceso la reconoce por el parámetro y termina el inicio de sesión. */
export const PARAM_VUELTA = 'acceso';
export const URL_VUELTA = `${URL_APP}?${PARAM_VUELTA}=google`;

/** Dominio de correo con acceso (VITE_DOMINIO_PERMITIDO; vacío = cualquiera) y correos sueltos de excepción (VITE_CORREOS_EXTRA). */
export const DOMINIO = ((import.meta.env.VITE_DOMINIO_PERMITIDO as string | undefined) ?? 'oysconsultores.com').trim().toLowerCase();
const EXTRA = ((import.meta.env.VITE_CORREOS_EXTRA as string | undefined) ?? '')
  .split(',')
  .map((c) => c.trim().toLowerCase())
  .filter(Boolean);

export function correoPermitido(correo: string) {
  const c = correo.trim().toLowerCase();
  return !DOMINIO || c.endsWith(`@${DOMINIO}`) || EXTRA.includes(c);
}

export function correoValido(correo: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(correo.trim());
}

/** Duración de la intro de la escena 3D (s); el texto de la pantalla se sincroniza con ella */
export const INTRO_ESCENA = 3.4;
