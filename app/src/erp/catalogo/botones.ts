/* Qué hace cada botón de proceso de Axional en el ERP de práctica: cambia el estado, contabiliza,
   copia o abre su diálogo, y responde con el mensaje que da el ERP. */
import { evalua } from './expresion';
import type { Fila } from './almacen';
import { hoyIso } from './almacen';
import type { CatBoton, CatCol, CatObjeto, CatValor } from './tipos';

export interface DialogoBoton {
  titulo: string;
  texto?: string;
  campos: CatCol[];
  aceptar: string;
}
export interface EfectoBoton {
  /** cambios en la fila */
  cambios?: Record<string, CatValor>;
  /** duplicar la fila (Copiar) */
  copia?: boolean;
  mensaje: string;
  tipo: 'ok' | 'error' | 'info';
}

const COLS_ESTADO = ['estcab', 'estado', 'estdoc', 'estado_doc', 'status', 'estact', 'estefe', 'estrem'];
/** Columna de estado del documento (la que tiene opciones Provisional/Validado…) */
export function colEstado(o: CatObjeto): CatCol | undefined {
  const cols = (o.cols ?? []).filter((c) => c.o?.length);
  return (
    cols.find((c) => COLS_ESTADO.includes(c.n) && c.o!.some((x) => /validad|provisional|activ|abiert|pendiente/i.test(x.v))) ??
    cols.find((c) => c.l === 'Estado') ??
    cols.find((c) => COLS_ESTADO.includes(c.n))
  );
}
/** Columna de fecha de contabilización */
export function colConta(o: CatObjeto): CatCol | undefined {
  const cols = o.cols ?? [];
  return cols.find((c) => c.n === 'fconta') ?? cols.find((c) => (c.t === 'd' || c.t === 'dt') && /contabiliz/i.test(c.l)) ?? cols.find((c) => /^(fconta|fecconta|fec_conta)/.test(c.n));
}
const opcion = (c: CatCol | undefined, re: RegExp, porDefecto?: string) => c?.o?.find((x) => re.test(x.v))?.k ?? (porDefecto && c?.o?.some((x) => x.k === porDefecto) ? porDefecto : undefined);

/** ¿Se ve y se puede pulsar? (como hideIfDisabled + clientExpression de Axional) */
export function estadoBoton(b: CatBoton, f: Fila, insertando: boolean) {
  const ok = !insertando && evalua(b.en, f, insertando);
  return { visible: ok || !b.hid, activo: ok };
}

const T = (s: string) => s.trim().toLowerCase();

/** Diálogo que abre el botón, o null si actúa directamente */
export function dialogoDe(o: CatObjeto, b: CatBoton): DialogoBoton | null {
  const l = T(b.l);
  if (/^(imprimir|impresión|imprimir documento)/.test(l))
    return {
      titulo: b.l,
      campos: [
        { n: '_formato', l: 'Formato', t: 's', req: 1, def: 'PDF', o: [{ k: 'PDF', v: 'PDF' }, { k: 'XLSX', v: 'Excel' }, { k: 'HTML', v: 'HTML' }] },
        { n: '_copias', l: 'Copias', t: 'i', def: '1' },
      ],
      aceptar: 'Imprimir',
    };
  if (/^copiar$/.test(l)) return { titulo: 'Copiar', texto: `Se creará un registro nuevo en ${o.tit.toLowerCase()} con los datos de este.`, campos: [], aceptar: 'Aceptar' };
  if (/^anular$/.test(l) || /^borrar/.test(l)) return { titulo: b.l, texto: '¿Seguro? Esta acción no se puede deshacer desde la práctica.', campos: [], aceptar: 'Aceptar' };
  if (b.campos || /^generar|^actualizar|^cambiar|^asignar|^traspasar|^evolucionar|^retroceder|^anticipo/.test(l)) {
    const campos: CatCol[] = [{ n: '_fecha', l: 'Fecha', t: 'd', req: 1, def: hoyIso() }];
    if (/^generar/.test(l)) campos.push({ n: '_validar', l: 'Validar documento generado', t: 's', chk: 1, def: 'S', o: [{ k: 'S', v: 'Sí' }, { k: 'N', v: 'No' }] });
    if (/^cambiar c[oó]digo/.test(l)) campos.unshift({ n: '_nuevo', l: 'Código nuevo', t: 's', req: 1, up: 1 });
    if (/^evolucionar|^retroceder/.test(l)) {
      const ce = colEstado(o);
      if (ce?.o) campos.unshift({ n: '_estado', l: 'Estado destino', t: 's', req: 1, o: ce.o });
    }
    campos.push({ n: '_obs', l: 'Observaciones', t: 's' });
    return { titulo: b.l, campos, aceptar: 'Aceptar' };
  }
  if (b.conf) return { titulo: b.l, texto: `¿Desea ejecutar «${b.l}»?`, campos: [], aceptar: 'Aceptar' };
  return null;
}

/** Efecto del botón sobre la fila (después del diálogo, si lo hay) */
export function efectoBoton(o: CatObjeto, b: CatBoton, f: Fila, entrada: Record<string, CatValor> = {}): EfectoBoton {
  const l = T(b.l);
  const ce = colEstado(o);
  const cc = colConta(o);
  const estado = ce ? f[ce.n] : undefined;
  const cambiaEstado = (re: RegExp, def: string, msg = 'Éxito'): EfectoBoton => {
    const k = opcion(ce, re, def);
    if (!ce || k === undefined) return { mensaje: `${b.l}: proceso ejecutado correctamente.`, tipo: 'ok' };
    if (estado === k) return { mensaje: `El registro ya está en estado «${ce.o!.find((x) => x.k === k)?.v ?? k}».`, tipo: 'error' };
    return { cambios: { [ce.n]: k }, mensaje: msg, tipo: 'ok' };
  };
  if (/^validar/.test(l)) return cambiaEstado(/^validad|^activ/i, 'V');
  if (/provisional/.test(l)) return cambiaEstado(/provisional/i, 'P');
  if (/^anular$/.test(l)) return cambiaEstado(/anulad/i, 'A', 'Documento anulado.');
  if (/^activar/.test(l)) return cambiaEstado(/^activ|^validad|^abiert/i, 'A');
  if (/^cerrar/.test(l)) return cambiaEstado(/cerrad/i, 'C');
  if (/^bloqueo/.test(l)) return cambiaEstado(/bloquead/i, 'E', 'Documento bloqueado manualmente.');
  if (/^no facturable/.test(l)) return cambiaEstado(/no facturable/i, 'N', 'Marcado como no facturable.');
  if (/^facturado/.test(l)) return cambiaEstado(/facturad/i, 'F');
  if (/^evolucionar|^retroceder/.test(l) && ce && entrada._estado) return { cambios: { [ce.n]: entrada._estado }, mensaje: 'Éxito', tipo: 'ok' };
  if (/^contabilizar/.test(l)) {
    if (cc && f[cc.n]) return { mensaje: 'El documento ya está contabilizado.', tipo: 'error' };
    if (ce && /provisional/i.test(ce.o?.find((x) => x.k === estado)?.v ?? '')) return { mensaje: 'Valide el documento antes de contabilizarlo.', tipo: 'error' };
    const n = 1000 + Math.floor(Math.random() * 9000);
    return { cambios: cc ? { [cc.n]: hoyIso() } : {}, mensaje: `Contabilizado. Asiento ${n} generado.`, tipo: 'ok' };
  }
  if (/^descontabilizar|^descont\./.test(l)) {
    if (cc && !f[cc.n]) return { mensaje: 'El documento no está contabilizado.', tipo: 'error' };
    return { cambios: cc ? { [cc.n]: null } : {}, mensaje: 'Descontabilizado. Asiento eliminado.', tipo: 'ok' };
  }
  if (/^copiar$/.test(l)) return { copia: true, mensaje: 'Registro copiado.', tipo: 'ok' };
  if (/^(imprimir|impresión)/.test(l)) return { mensaje: `Documento generado en ${String(entrada._formato ?? 'PDF')} y enviado a la cola de impresión.`, tipo: 'ok' };
  if (/^generar/.test(l)) return { mensaje: `Proceso finalizado. ${b.l}: 1 documento generado${entrada._validar === 'N' ? ' en provisional' : ' y validado'}.`, tipo: 'ok' };
  if (/^cambiar c[oó]digo/.test(l)) return { mensaje: `Código cambiado a ${String(entrada._nuevo ?? '')}.`, tipo: 'ok' };
  return { mensaje: `${b.l}: proceso ejecutado correctamente.`, tipo: 'ok' };
}

/** Destino de una entrada del menú ⌄ (Docflow, Asientos contables…): código de objeto por su nombre */
export function destinoEnlace(label: string, buscar: [string, string, string][] | undefined): string | null {
  const l = T(label);
  if (l === 'docflow') return 'docflow';
  const exacto = buscar?.find((x) => T(x[0]) === l);
  if (exacto) return exacto[1];
  const parecido = buscar?.find((x) => T(x[0]).startsWith(l) || l.startsWith(T(x[0])));
  return parecido?.[1] ?? null;
}
