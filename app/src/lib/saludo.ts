/**
 * Bienvenida al entrar: una vez por sesión del navegador.
 */
const VISTA = 'oys-bienvenida-vista';

/** Saludo neutro: no preguntamos el género ni lo deducimos del nombre. */
export const SALUDO = 'Te damos la bienvenida';

export function primerNombre(nombre: string) {
  return nombre.trim().split(/\s+/)[0] ?? '';
}

/** La bienvenida sale una vez por sesión del navegador. */
export function bienvenidaVista() {
  try {
    return sessionStorage.getItem(VISTA) === '1';
  } catch {
    return true;
  }
}

export function marcaBienvenida() {
  try {
    sessionStorage.setItem(VISTA, '1');
  } catch {
    /* sin almacenamiento: no se repite en esta pestaña igualmente */
  }
}

export function olvidaBienvenida() {
  try {
    sessionStorage.removeItem(VISTA);
  } catch {
    /* nada */
  }
}
