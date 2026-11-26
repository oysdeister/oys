/*
  Iniciales del alumno: sustituyen a {INI} en los códigos que crea en la demo (TXX, PROV-XX-001, EX-XX-…).
  Siempre 2 letras: con 3 o más, varios códigos del ERP pasan de su longitud máxima («Demasiado largo»).
*/

const sinTildes = (w: string) =>
  w
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-ZÑ0-9]/g, '');

/** «Laura Martín Ruiz» → «LM» (primera del nombre y del primer apellido); con una sola palabra, sus dos primeras letras. */
export function inicialesDe(nombre: string) {
  const palabras = nombre.trim().split(/\s+/).map(sinTildes).filter(Boolean);
  if (palabras.length >= 2) return `${palabras[0][0]}${palabras[1][0]}`;
  return (palabras[0] ?? '').slice(0, 2);
}

/** Deja unas iniciales en 2 letras: con el nombre si se conoce; si no, las dos primeras. */
export function iniciales2(ini: string, nombre = '') {
  const limpio = sinTildes(ini);
  if (limpio.length <= 2) return limpio;
  const deNombre = inicialesDe(nombre);
  return deNombre.length === 2 ? deNombre : limpio.slice(0, 2);
}

/* Aviso de una sola vez cuando se pasan unas iniciales guardadas de 3+ letras a 2 */
const CLAVE_AVISO = 'oys-ini-aviso';

export function anotarCambioIniciales(antes: string, ahora: string) {
  try {
    localStorage.setItem(CLAVE_AVISO, JSON.stringify({ antes, ahora, visto: false }));
  } catch {
    /* almacenamiento bloqueado: sin aviso */
  }
}

export function avisoIniciales(): { antes: string; ahora: string } | null {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_AVISO) || 'null') as { antes: string; ahora: string; visto: boolean } | null;
    return v && !v.visto ? { antes: v.antes, ahora: v.ahora } : null;
  } catch {
    return null;
  }
}

export function cerrarAvisoIniciales() {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_AVISO) || 'null') as object | null;
    if (v) localStorage.setItem(CLAVE_AVISO, JSON.stringify({ ...v, visto: true }));
  } catch {
    /* nada */
  }
}
