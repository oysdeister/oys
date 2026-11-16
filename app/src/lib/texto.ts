/** Sustituye el token {INI} por las iniciales del alumno (o «CL» si aún no las ha escrito). */
export function conIni(texto: string, ini: string) {
  return texto.replaceAll('{INI}', ini || 'CL');
}

export const euro = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', useGrouping: 'always' });
export const num2 = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' });

export function redondea(n: number) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

export function baseUrl(ruta: string) {
  return `${import.meta.env.BASE_URL}${ruta.replace(/^\//, '')}`;
}
