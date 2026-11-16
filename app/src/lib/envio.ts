import type { Acta } from './examen';

/**
 * Envío del acta del examen por correo al formador.
 *
 * La web es estática (GitHub Pages), sin servidor propio, así que se usa FormSubmit
 * (https://formsubmit.co), que reenvía un POST al correo indicado. La primera vez,
 * FormSubmit manda un correo de activación al destinatario: hasta que no se pulse
 * su enlace, no entrega nada. Se puede cambiar el destino con VITE_CORREO_EXAMEN.
 */
export const CORREO_EXAMEN = (import.meta.env.VITE_CORREO_EXAMEN as string | undefined) || 'jmayguavives@oysconsultores.com';

function asunto(acta: Acta) {
  const quien = acta.alumno.usuario || acta.alumno.nombre;
  return `Examen Practicando Axional Deister VNext · ${quien} · ${acta.codigo} · ${acta.aprobado ? 'APROBADO' : 'NO APROBADO'}`;
}

export async function enviarActa(acta: Acta, texto: string): Promise<boolean> {
  try {
    const r = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CORREO_EXAMEN)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: asunto(acta),
        _template: 'box',
        _captcha: 'false',
        Usuario: acta.alumno.usuario || '—',
        Nombre: acta.alumno.nombre,
        Iniciales: acta.alumno.ini,
        'Código de examen': acta.codigo,
        Nota: `teoría ${acta.nota.teoria} % · práctica ${acta.nota.practica} % · global ${acta.nota.global} %`,
        Resultado: acta.aprobado ? 'APROBADO' : 'NO APROBADO',
        Acta: texto,
      }),
    });
    if (!r.ok) return false;
    const j = (await r.json().catch(() => null)) as { success?: string | boolean } | null;
    return !j || j.success === true || j.success === 'true';
  } catch {
    return false;
  }
}

/** Plan B: abre el correo del alumno con el acta ya escrita. */
export function enlaceCorreo(acta: Acta, texto: string) {
  return `mailto:${CORREO_EXAMEN}?subject=${encodeURIComponent(asunto(acta))}&body=${encodeURIComponent(texto)}`;
}
