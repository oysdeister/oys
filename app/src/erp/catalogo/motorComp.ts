/* Motor de comportamiento: aplica comp/<código>.json (ver comportamiento.ts) sobre el modelo local.
   Valida al guardar y borrar con los mensajes literales de la demo, calcula defectos y ejecuta los botones. */
import { useEffect, useState } from 'react';
import type { CompBoton, CompObjeto, CompRegla, CompTipoMsg } from './comportamiento';
import type { CatObjeto, CatValor } from './tipos';
import { cargaObjeto, objetoCargado } from './datos';
import { almacen, filasDe, hoyIso, type Fila } from './almacen';

const BASE = `${import.meta.env.BASE_URL}erp-cat/comp/`;
const comps = new Map<string, CompObjeto | null>();
const pendientes = new Map<string, Promise<CompObjeto | null>>();

/** Mensajes genéricos de Axional (comp/_generico.json); claves: obligatorio, noExiste, duplicado, borrarHijos, confirmarBorrar, guardarAntes… */
let genericos: Record<string, string> = {};
let genericosPedidos = false;
function pideGenericos() {
  if (genericosPedidos) return;
  genericosPedidos = true;
  fetch(BASE + '_generico.json')
    .then((r) => (r.ok ? r.json() : null))
    .then((d: { mensajes?: Record<string, string> } | null) => {
      if (d?.mensajes) genericos = d.mensajes;
    })
    .catch(() => undefined);
}

/** Texto genérico con ${var} sustituidas; si no se capturó aún, usa el texto de reserva */
export function msgGenerico(clave: string, reserva: string, vars: Record<string, unknown> = {}): string {
  return sustituye(genericos[clave] ?? reserva, vars);
}

/** Objetos citados por un comp (lupas, ayudas, pasos) para precargarlos */
function citados(c: CompObjeto): string[] {
  const s = JSON.stringify(c);
  const out = new Set<string>();
  for (const m of s.matchAll(/(?:existe|busca|cuenta|suma|siguiente)\(\s*\\?['"](\w+)/g)) out.add(m[1]);
  for (const m of s.matchAll(/"obj"\s*:\s*"(\w+)"/g)) out.add(m[1]);
  return [...out];
}

export function cargaComp(code: string): Promise<CompObjeto | null> {
  pideGenericos();
  if (comps.has(code)) return Promise.resolve(comps.get(code) ?? null);
  let p = pendientes.get(code);
  if (!p) {
    p = fetch(BASE + code + '.json')
      .then((r) => (r.ok ? (r.json() as Promise<CompObjeto>) : null))
      .catch(() => null)
      .then(async (c) => {
        if (c) await Promise.all(citados(c).map((o) => cargaObjeto(o).catch(() => undefined)));
        comps.set(code, c);
        return c;
      });
    pendientes.set(code, p);
  }
  return p;
}

/** Hook: comp del objeto (undefined mientras carga, null si no hay) */
export function useComp(code: string | null | undefined): CompObjeto | null | undefined {
  const [, setN] = useState(0);
  useEffect(() => {
    if (!code || comps.has(code)) return;
    let vivo = true;
    cargaComp(code).then(() => vivo && setN((n) => n + 1));
    return () => {
      vivo = false;
    };
  }, [code]);
  pideGenericos();
  return code ? comps.get(code) : null;
}

/* ───────── expresiones ───────── */

const vacio = (x: unknown) => x === null || x === undefined || x === '';
const filasObj = (obj: string): Fila[] | null => {
  const o = objetoCargado(obj);
  return o ? filasDe(o) : null;
};
// comparación laxa (los datos de la TUTORIAL llegan como texto o número)
const igual = (a: unknown, b: unknown) => (vacio(a) && vacio(b)) || String(a ?? '') === String(b ?? '');

const AYUDAS = {
  hoy: () => hoyIso(),
  vacio,
  existe: (obj: string, col: string, valor: unknown) => {
    const fs = filasObj(obj);
    return fs ? fs.some((f) => igual(f[col], valor)) : true;
  },
  busca: (obj: string, col: string, valor: unknown, ret: string) => filasObj(obj)?.find((f) => igual(f[col], valor))?.[ret] ?? null,
  cuenta: (obj: string, col: string, valor: unknown) => filasObj(obj)?.filter((f) => igual(f[col], valor)).length ?? 0,
  suma: (obj: string, col: string, valor: unknown, campo: string) =>
    (filasObj(obj) ?? []).filter((f) => igual(f[col], valor)).reduce((s, f) => s + (Number(f[campo]) || 0), 0),
  siguiente: (obj: string, col: string) => (filasObj(obj) ?? []).reduce((m, f) => Math.max(m, Number(f[col]) || 0), 0) + 1,
};

export interface CtxExpr {
  fila: Record<string, CatValor | undefined>;
  ins?: boolean;
  padre?: Record<string, CatValor | undefined>;
  ent?: Record<string, CatValor | undefined>;
  /** fila candidata de una lupa */
  l?: Record<string, CatValor | undefined>;
}

const compiladas = new Map<string, ((...a: unknown[]) => unknown) | null>();
const NOMBRES = ['__f', '__ins', 'padre', 'ent', 'l', '__t', ...Object.keys(AYUDAS)];
const PROPIOS = new Set(['padre', 'ent', 'l', 'Math', 'Number', 'String', 'Date', 'JSON', 'Object', 'Array', 'console']);
/** fecha (texto o Date) → milisegundos, para expresiones de Axional con .getTime() */
const __t = (x: unknown) => (x instanceof Date ? x.getTime() : x === null || x === undefined || x === '' ? NaN : new Date(String(x)).getTime());

/** Adapta las expresiones de cliente de Axional al modelo local */
function adapta(expr: string): string {
  let e = expr.replace(/context\.isOnInsert\(\)/g, '__ins').replace(/context\.isOnUpdate\(\)/g, '(!__ins)');
  // x.getTime() → __t(x)
  e = e.replace(/([A-Za-z_][\w.]*)\.getTime\(\)/g, '__t($1)');
  // tabla.columna (columnas de tablas unidas en Axional) → columna; respeta padre., ent., l. y objetos de JS
  e = e.replace(/(["'])(?:\\.|(?!\1).)*\1|\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\b(?!\s*\()/g, (m, q, a: string, b: string) => (q || PROPIOS.has(a) ? m : b));
  return e;
}

/** Evalúa una expresión de comp; si falla devuelve `siFalla` (por defecto undefined) */
export function calcula(expr: string, ctx: CtxExpr, siFalla?: unknown): unknown {
  let fn = compiladas.get(expr);
  if (fn === undefined) {
    try {
      fn = new Function(...NOMBRES, `with(__f){ return (${adapta(expr)}); }`) as (...a: unknown[]) => unknown;
    } catch {
      fn = null;
      console.warn('[comp] expresión no válida:', expr);
    }
    compiladas.set(expr, fn);
  }
  if (!fn) return siFalla;
  // columnas de la fila como variables; las que faltan, null (with + Proxy evita ReferenceError)
  const datos = new Proxy(
    { ...ctx.fila },
    {
      has: (_t, k) => typeof k === 'string' && !NOMBRES.includes(k) && !(k in globalThis),
      get: (t, k) => (typeof k === 'string' ? (t[k] === undefined || t[k] === '' ? null : t[k]) : undefined),
    },
  );
  try {
    return fn(datos, !!ctx.ins, ctx.padre ?? {}, ctx.ent ?? {}, ctx.l ?? {}, __t, ...Object.values(AYUDAS));
  } catch (e) {
    console.warn('[comp] error al evaluar', expr, e);
    return siFalla;
  }
}
export const cumple = (expr: string | undefined, ctx: CtxExpr) => (expr ? !!calcula(expr, ctx, false) : false);

/** Sustituye ${col} o ${expresión} (p. ej. ${ent.fecbaj}, ${busca('obj','c',x,'d')}) en un mensaje literal */
export function sustituye(texto: string, vars: Record<string, unknown>, ctx?: CtxExpr): string {
  return texto.replace(/\$\{([^}]+)\}/g, (m, k: string) => {
    if (/^\w+$/.test(k) && vars[k] !== undefined && vars[k] !== null) return String(vars[k]);
    if (!ctx) return m;
    const v = calcula(k, ctx);
    return v === undefined || v === null ? '' : String(v);
  });
}

export interface Mensaje {
  tipo: CompTipoMsg;
  texto: string;
  campo?: string;
}
const aMensaje = (r: CompRegla, vars: Record<string, unknown>, ctx?: CtxExpr): Mensaje => ({ tipo: r.tipo ?? 'error', texto: sustituye(r.msg, vars, ctx), campo: r.campo });
function primeraQueSalta(reglas: CompRegla[] | undefined, ctx: CtxExpr, vars: Record<string, unknown>): Mensaje[] {
  const out: Mensaje[] = [];
  for (const r of reglas ?? []) if (cumple(r.si, ctx)) out.push(aMensaje(r, vars, ctx));
  return out;
}

/* ───────── altas ───────── */

/** Aplica def/defExpr del comp a una fila nueva */
export function defectosComp(c: CompObjeto | null | undefined, f: Fila, padre?: Record<string, CatValor | undefined>): Fila {
  if (!c?.campos) return f;
  const g: Fila = { ...f };
  for (const [n, cc] of Object.entries(c.campos)) {
    if (cc.def !== undefined) g[n] = cc.def as CatValor;
    if (cc.defExpr) g[n] = calcula(cc.defExpr, { fila: g, ins: true, padre }, g[n]) as CatValor;
  }
  return calculados(c, g, true, padre);
}
/** Recalcula los campos calc */
export function calculados(c: CompObjeto | null | undefined, f: Fila, ins: boolean, padre?: Record<string, CatValor | undefined>): Fila {
  if (!c?.campos) return f;
  let g = f;
  for (const [n, cc] of Object.entries(c.campos)) {
    if (!cc.calc) continue;
    const v = calcula(cc.calc, { fila: g, ins, padre }, g[n]) as CatValor;
    if (v !== g[n]) g = { ...g, [n]: v };
  }
  return g;
}
/** Al cambiar un campo: aplica alCambiar y calc */
export function alCambiar(c: CompObjeto | null | undefined, f: Fila, col: string, ins: boolean, padre?: Record<string, CatValor | undefined>): Fila {
  const cc = c?.campos?.[col];
  let g: Fila = cc?.mayus && typeof f[col] === 'string' ? { ...f, [col]: (f[col] as string).toUpperCase() } : f;
  if (cc?.alCambiar) {
    const nuevos: Record<string, CatValor> = {};
    for (const [n, e] of Object.entries(cc.alCambiar)) nuevos[n] = calcula(e, { fila: g, ins, padre }, g[n]) as CatValor;
    g = { ...g, ...nuevos };
  }
  return calculados(c, g, ins, padre);
}

/* ───────── validaciones ───────── */

/** Errores al guardar (en el orden de la demo: campos, luego reglas de registro) */
export function validaGuardar(
  o: CatObjeto,
  c: CompObjeto | null | undefined,
  f: Fila,
  ins: boolean,
  padre?: Record<string, CatValor | undefined>,
  /** obligatorio según el catálogo (si el comp no dice nada) */
  reqCat?: (col: string) => boolean,
): Mensaje[] {
  const ctx: CtxExpr = { fila: f, ins, padre };
  const vars = { ...f };
  const out: Mensaje[] = [];
  for (const col of o.cols ?? []) {
    const cc = c?.campos?.[col.n];
    if (cc?.oculto && cumple(cc.oculto, ctx)) continue;
    const ro = col.ro === 1 || (cc?.ro && cumple(cc.ro, ctx));
    const req = cc?.req || (cc?.reqSi ? cumple(cc.reqSi, ctx) : !!reqCat?.(col.n));
    if (req && !ro && vacio(f[col.n])) {
      out.push({ tipo: 'error', campo: col.n, texto: msgGenerico('obligatorio', 'El campo «${campo}» es obligatorio.', { campo: col.l.replace(/\n/g, ' '), col: col.n }) });
      continue;
    }
    const lov = cc?.lov;
    if (lov && !vacio(f[col.n])) {
      const fs = filasObj(lov.obj);
      if (fs && !fs.some((x) => igual(x[lov.clave], f[col.n]))) {
        out.push({
          tipo: 'error',
          campo: col.n,
          texto: sustituye(lov.noExiste ?? msgGenerico('lupa_no_existe', 'Error en la validación', {}), { ...vars, valor: f[col.n], campo: col.l.replace(/\n/g, ' ') }),
        });
        continue;
      }
    }
    out.push(...primeraQueSalta(cc?.reglas, ctx, vars));
  }
  out.push(...primeraQueSalta(c?.alGuardar, ctx, vars));
  return out;
}
export const validaBorrar = (c: CompObjeto | null | undefined, f: Fila, padre?: Record<string, CatValor | undefined>) =>
  primeraQueSalta(c?.alBorrar, { fila: f, padre }, { ...f });

/* ───────── botones ───────── */

export interface ResultadoBoton {
  ok: boolean;
  mensajes: Mensaje[];
  /** cambios aplicados a la fila actual */
  cambios: Record<string, CatValor>;
  ir?: { obj: string; clave?: string };
}

/** Precondiciones del botón (antes de abrir el diálogo) */
export const preBoton = (b: CompBoton, f: Fila, padre?: Record<string, CatValor | undefined>) =>
  primeraQueSalta(b.pre, { fila: f, padre }, { ...f }).filter((m) => m.tipo === 'error' || m.tipo === 'aviso');

/** Ejecuta los pasos del botón sobre el modelo local */
export function ejecutaBoton(
  code: string,
  b: CompBoton,
  f: Fila,
  ent: Record<string, CatValor>,
  autor: string,
  padre?: Record<string, CatValor | undefined>,
): ResultadoBoton {
  const mensajes: Mensaje[] = [];
  let fila: Fila = { ...f };
  let ir: ResultadoBoton['ir'];
  const cambios: Record<string, CatValor> = {};
  const ctx = (): CtxExpr => ({ fila, padre, ent });
  for (const paso of b.pasos ?? []) {
    if (paso.set) {
      const nuevos: Record<string, CatValor> = {};
      for (const [n, e] of Object.entries(paso.set)) nuevos[n] = calcula(e, ctx(), fila[n]) as CatValor;
      fila = { ...fila, ...nuevos };
      Object.assign(cambios, nuevos);
    }
    if (paso.crea) {
      const { obj, valores, porCada } = paso.crea;
      const destino = objetoCargado(obj);
      // porCada = 'objHijo:colDelHijo:colDeEstaFila' → una fila nueva por cada hija (accesible como l.)
      const [oh, ch, cp] = (porCada ?? '').split(':');
      const hijos: (Fila | null)[] = porCada ? (filasObj(oh) ?? []).filter((h) => igual(h[ch], fila[cp])) : [null];
      for (const h of hijos) {
        const nueva: Fila = { _k: '' };
        for (const col of destino?.cols ?? []) nueva[col.n] = null;
        for (const [n, e] of Object.entries(valores)) nueva[n] = calcula(e, { fila, padre, ent, l: h ?? undefined }, null) as CatValor;
        almacen.insertar(obj, nueva, autor);
      }
    }
    if (paso.actualiza) {
      const { obj, donde, set } = paso.actualiza;
      const valor = calcula(donde[1], ctx());
      for (const x of filasObj(obj) ?? []) {
        if (!igual(x[donde[0]], valor)) continue;
        const nuevos: Record<string, CatValor> = {};
        for (const [n, e] of Object.entries(set)) nuevos[n] = calcula(e, { fila, padre, ent, l: x }, x[n]) as CatValor;
        almacen.actualizar(obj, x._k, nuevos, autor, 'boton', b.l);
      }
    }
    if (paso.borra) {
      const { obj, donde } = paso.borra;
      const valor = calcula(donde[1], ctx());
      for (const x of filasObj(obj) ?? []) if (igual(x[donde[0]], valor)) almacen.borrar(obj, x._k, autor);
    }
    if (paso.ir) ir = { obj: paso.ir.obj, clave: paso.ir.clave ? String(calcula(paso.ir.clave, ctx()) ?? '') : undefined };
    if (paso.msg) mensajes.push({ tipo: paso.msg.tipo, texto: sustituye(paso.msg.texto, { ...fila, ...ent }, ctx()) });
  }
  if (Object.keys(cambios).length) almacen.actualizar(code, f._k, cambios, autor, 'boton', b.l);
  else almacen.registrar(code, f._k, autor, b.l);
  if (b.ok) mensajes.push({ tipo: 'ok', texto: sustituye(b.ok, { ...fila, ...ent }, { fila, padre, ent }) });
  return { ok: true, mensajes, cambios, ir };
}
