/* Kit de interfaz del ERP de práctica: listas, fichas, campos, pestañas, líneas y avisos.
   Todas las pantallas (src/erp/pantallas/*) se construyen solo con estas piezas. */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { type Linea, type Pantalla, importeLinea, totales } from './modelo';

export const eur = (n: number) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }).format(n);
export const fechaEs = (iso: string) => (iso ? iso.split('-').reverse().join('-') : '');
export const leeNum = (s: string) => {
  const t = s.trim().replace(/\s/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.');
  const n = Number(t);
  return t === '' || !Number.isFinite(n) ? NaN : n;
};

/* ------------------------------------------------------------------ contexto */
export interface Aviso {
  id: number;
  tipo: 'ok' | 'error' | 'info';
  texto: string;
  ver?: { pantalla: Pantalla; clave: string };
}
export interface ErpCtx {
  ini: string;
  pantalla: Pantalla;
  clave: string | null;
  ir: (p: Pantalla, clave?: string | null) => void;
  aviso: (tipo: Aviso['tipo'], texto: string, ver?: Aviso['ver']) => void;
  /** Ejecuta una acción del modelo y muestra «Éxito» o el error; devuelve true si fue bien */
  hacer: (r: { ok: true; doc: string } | { ok: false; error: string }, exito?: string, ver?: Aviso['ver']) => boolean;
}
export const Ctx = createContext<ErpCtx | null>(null);
export function useErp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useErp fuera de <ErpApp>');
  return c;
}

/* ------------------------------------------------------------------ lista (maestro) */
export interface Col<T> {
  titulo: string;
  valor: (r: T) => ReactNode;
  texto?: (r: T) => string;
  num?: boolean;
  ancho?: string;
}
export function Lista<T>({
  titulo,
  icono,
  filas,
  cols,
  clave,
  onAbrir,
  onNuevo,
  nuevoTexto = 'Nuevo',
  vacio = 'No hay registros con este filtro.',
  marcarMios,
}: {
  titulo: string;
  icono?: ReactNode;
  filas: T[];
  cols: Col<T>[];
  clave: (r: T) => string;
  onAbrir: (r: T) => void;
  onNuevo?: () => void;
  nuevoTexto?: string;
  vacio?: string;
  /** devuelve true si el registro es del alumno (se resalta) */
  marcarMios?: (r: T) => boolean;
}) {
  const [q, setQ] = useState('');
  const [solo, setSolo] = useState(false);
  const vis = useMemo(() => {
    const t = q.trim().toLowerCase();
    return filas.filter((r) => (!solo || marcarMios?.(r)) && (!t || cols.some((c) => (c.texto ? c.texto(r) : String(c.valor(r) ?? '')).toLowerCase().includes(t))));
  }, [filas, cols, q, solo, marcarMios]);
  return (
    <section className="erp-lista">
      <header className="erp-barra">
        <h2>
          {icono}
          {titulo}
          <span className="erp-cuenta">{vis.length}</span>
        </h2>
        <div className="erp-barra-acc">
          <label className="erp-buscar">
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar…" aria-label={`Filtrar ${titulo}`} />
          </label>
          {marcarMios && (
            <label className="erp-solo">
              <input type="checkbox" checked={solo} onChange={(e) => setSolo(e.target.checked)} /> Solo los míos
            </label>
          )}
          {onNuevo && (
            <button type="button" className="erp-btn primario" onClick={onNuevo}>
              <span aria-hidden="true">＋</span> {nuevoTexto}
            </button>
          )}
        </div>
      </header>
      <div className="erp-tabla-scroll">
        <table className="erp-tabla">
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.titulo} className={c.num ? 'num' : undefined} style={c.ancho ? { width: c.ancho } : undefined}>
                  {c.titulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vis.map((r) => (
              <tr key={clave(r)} className={marcarMios?.(r) ? 'mio' : undefined} onClick={() => onAbrir(r)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onAbrir(r)}>
                {cols.map((c) => (
                  <td key={c.titulo} className={c.num ? 'num' : undefined}>
                    {c.valor(r)}
                  </td>
                ))}
              </tr>
            ))}
            {!vis.length && (
              <tr className="vacia">
                <td colSpan={cols.length}>{vacio}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ ficha */
export interface Accion {
  label: string;
  onClick: () => void;
  tipo?: 'primario' | 'peligro' | 'normal' | 'proceso';
  disabled?: boolean;
  title?: string;
}
export function Ficha({
  titulo,
  sub,
  estado,
  acciones,
  onVolver,
  children,
}: {
  titulo: ReactNode;
  sub?: ReactNode;
  estado?: string;
  acciones: Accion[];
  onVolver: () => void;
  children: ReactNode;
}) {
  return (
    <motion.section className="erp-ficha" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <header className="erp-ficha-cab">
        <button type="button" className="erp-volver" onClick={onVolver} aria-label="Volver a la lista">
          ‹
        </button>
        <div className="erp-ficha-tit">
          <h2>{titulo}</h2>
          {sub && <p>{sub}</p>}
        </div>
        {estado && <Estado valor={estado} />}
      </header>
      <div className="erp-acciones" role="toolbar" aria-label="Acciones del registro">
        {acciones.map((a) => (
          <button key={a.label} type="button" className={`erp-btn ${a.tipo ?? 'normal'}`} onClick={a.onClick} disabled={a.disabled} title={a.title}>
            {a.label}
          </button>
        ))}
      </div>
      <div className="erp-ficha-cuerpo">{children}</div>
    </motion.section>
  );
}

const CLASE_ESTADO: Record<string, string> = {
  Validado: 'ok',
  Activo: 'ok',
  Contabilizada: 'ok',
  'Servido o Facturado': 'ok',
  Facturado: 'ok',
  Provisional: 'prov',
  Pendiente: 'pend',
  'Parcialmente servido': 'pend',
  'Pendiente de facturar': 'pend',
};
export function Estado({ valor }: { valor: string }) {
  return <span className={`erp-estado ${CLASE_ESTADO[valor] ?? 'pend'}`}>{valor}</span>;
}

/* ------------------------------------------------------------------ pestañas */
export function Pestanas({ tabs, actual, onCambio }: { tabs: { id: string; label: string; n?: number }[]; actual: string; onCambio: (id: string) => void }) {
  return (
    <div className="erp-pestanas" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === actual} className={t.id === actual ? 'on' : ''} onClick={() => onCambio(t.id)}>
          {t.label}
          {t.n !== undefined && <span className="erp-cuenta">{t.n}</span>}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ campos */
export function Rejilla({ children, cols = 3 }: { children: ReactNode; cols?: number }) {
  return <div className={`erp-rejilla c${cols}`}>{children}</div>;
}
interface Base {
  label: string;
  req?: boolean;
  disabled?: boolean;
  ayuda?: string;
  ancho?: 1 | 2 | 3;
}
function Envoltorio({ label, req, ayuda, ancho, children }: Base & { children: ReactNode }) {
  return (
    <label className={`erp-campo${ancho ? ` a${ancho}` : ''}`}>
      <span className="erp-label">
        {label}
        {req && <i aria-label="obligatorio">*</i>}
      </span>
      {children}
      {ayuda && <small className="erp-ayuda">{ayuda}</small>}
    </label>
  );
}
export function CampoTexto({ value, onChange, mono, placeholder, ...b }: Base & { value: string; onChange: (v: string) => void; mono?: boolean; placeholder?: string }) {
  return (
    <Envoltorio {...b}>
      <input className={`erp-input${mono ? ' mono' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled} placeholder={placeholder} required={b.req} />
    </Envoltorio>
  );
}
export function CampoNum({ value, onChange, ...b }: Base & { value: number; onChange: (v: number) => void }) {
  const [txt, setTxt] = useState<string | null>(null);
  return (
    <Envoltorio {...b}>
      <input
        className="erp-input num"
        inputMode="decimal"
        value={txt ?? (Number.isFinite(value) ? eur(value) : '')}
        onFocus={() => setTxt(Number.isFinite(value) ? String(value).replace('.', ',') : '')}
        onChange={(e) => setTxt(e.target.value)}
        onBlur={() => {
          if (txt !== null) onChange(leeNum(txt));
          setTxt(null);
        }}
        disabled={b.disabled}
      />
    </Envoltorio>
  );
}
export function CampoFecha({ value, onChange, ...b }: Base & { value: string; onChange: (v: string) => void }) {
  return (
    <Envoltorio {...b}>
      <input type="date" className="erp-input" value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled} />
    </Envoltorio>
  );
}
export function CampoSel({ value, onChange, opciones, vacio, ...b }: Base & { value: string; onChange: (v: string) => void; opciones: readonly { v: string; t: string }[]; vacio?: string }) {
  return (
    <Envoltorio {...b}>
      <select className="erp-input" value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled}>
        {vacio !== undefined && <option value="">{vacio}</option>}
        {opciones.map((o) => (
          <option key={o.v} value={o.v}>
            {o.t}
          </option>
        ))}
      </select>
    </Envoltorio>
  );
}
export function CampoLectura({ label, valor, ancho }: { label: string; valor: ReactNode; ancho?: 1 | 2 | 3 }) {
  return (
    <div className={`erp-campo lectura${ancho ? ` a${ancho}` : ''}`}>
      <span className="erp-label">{label}</span>
      <span className="erp-valor">{valor}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ líneas de documento */
export function Lineas({
  lineas,
  editable,
  onChange,
  articulos,
  pendientes,
  soloCantidad,
}: {
  lineas: Linea[];
  editable: boolean;
  onChange?: (ls: Linea[]) => void;
  articulos?: readonly { v: string; t: string; precio: number }[];
  /** columna extra «Pendiente» (pedidos): nº de línea → unidades por servir */
  pendientes?: Record<number, number>;
  /** albaranes generados: solo se puede cambiar la cantidad */
  soloCantidad?: boolean;
}) {
  const set = (n: number, cambio: Partial<Linea>) => onChange?.(lineas.map((l) => (l.n === n ? { ...l, ...cambio } : l)));
  const quitar = (n: number) => onChange?.(lineas.filter((l) => l.n !== n).map((l, i) => ({ ...l, n: i + 1 })));
  const anadir = () => {
    const a = articulos?.[0];
    onChange?.([...lineas, { n: lineas.length + 1, articulo: a?.v ?? '', descripcion: '', cantidad: 1, precio: a?.precio ?? 0, dto: 0 }]);
  };
  const t = totales(lineas);
  const editaTodo = editable && !soloCantidad;
  return (
    <div className="erp-lineas">
      <div className="erp-tabla-scroll">
        <table className="erp-tabla compacta">
          <thead>
            <tr>
              <th style={{ width: '3em' }}>Lín.</th>
              <th>Artículo</th>
              <th className="num">Cantidad</th>
              <th className="num">Precio</th>
              <th className="num">% Dto.</th>
              <th className="num">Importe</th>
              {pendientes && <th className="num">Pendiente</th>}
              {editaTodo && <th style={{ width: '2.5em' }} aria-label="Quitar" />}
            </tr>
          </thead>
          <tbody>
            {lineas.map((l) => (
              <tr key={l.n}>
                <td>{l.n}</td>
                <td>
                  {editaTodo && articulos ? (
                    <select
                      className="erp-input mini"
                      value={l.articulo}
                      aria-label={`Artículo de la línea ${l.n}`}
                      onChange={(e) => {
                        const a = articulos.find((x) => x.v === e.target.value);
                        set(l.n, { articulo: e.target.value, precio: a?.precio ?? l.precio, descripcion: '' });
                      }}
                    >
                      {articulos.map((a) => (
                        <option key={a.v} value={a.v}>
                          {a.t}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span>
                      <b className="mono">{l.articulo}</b> {l.descripcion}
                    </span>
                  )}
                </td>
                <td className="num">{editable ? <NumCelda valor={l.cantidad} onCambio={(v) => set(l.n, { cantidad: v })} etiqueta={`Cantidad de la línea ${l.n}`} /> : eur(l.cantidad).replace(',00', '')}</td>
                <td className="num">{editaTodo ? <NumCelda valor={l.precio} onCambio={(v) => set(l.n, { precio: v })} etiqueta={`Precio de la línea ${l.n}`} /> : eur(l.precio)}</td>
                <td className="num">{editaTodo ? <NumCelda valor={l.dto} onCambio={(v) => set(l.n, { dto: v })} etiqueta={`Descuento de la línea ${l.n}`} /> : eur(l.dto)}</td>
                <td className="num fuerte">{eur(importeLinea(l))}</td>
                {pendientes && <td className={`num${(pendientes[l.n] ?? 0) > 0 ? ' aviso' : ''}`}>{pendientes[l.n] ?? 0}</td>}
                {editaTodo && (
                  <td>
                    <button type="button" className="erp-x" onClick={() => quitar(l.n)} aria-label={`Quitar la línea ${l.n}`}>
                      ×
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {!lineas.length && (
              <tr className="vacia">
                <td colSpan={8}>Sin líneas.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="erp-lineas-pie">
        {editaTodo && articulos ? (
          <button type="button" className="erp-btn" onClick={anadir} disabled={!articulos.length}>
            ＋ Añadir línea
          </button>
        ) : (
          <span />
        )}
        <Totales base={t.base} iva={t.iva} total={t.total} />
      </div>
    </div>
  );
}
function NumCelda({ valor, onCambio, etiqueta }: { valor: number; onCambio: (v: number) => void; etiqueta: string }) {
  const [txt, setTxt] = useState<string | null>(null);
  return (
    <input
      className="erp-input mini num"
      inputMode="decimal"
      aria-label={etiqueta}
      value={txt ?? String(valor).replace('.', ',')}
      onFocus={(e) => {
        setTxt(String(valor).replace('.', ','));
        e.target.select();
      }}
      onChange={(e) => setTxt(e.target.value)}
      onBlur={() => {
        if (txt !== null) {
          const n = leeNum(txt);
          onCambio(Number.isFinite(n) ? n : 0);
        }
        setTxt(null);
      }}
    />
  );
}
export function Totales({ base, iva, total }: { base: number; iva: number; total: number }) {
  return (
    <dl className="erp-totales">
      <div>
        <dt>Base imponible</dt>
        <dd>{eur(base)}</dd>
      </div>
      <div>
        <dt>IVA 21 %</dt>
        <dd>{eur(iva)}</dd>
      </div>
      <div className="total">
        <dt>Total</dt>
        <dd>{eur(total)} €</dd>
      </div>
    </dl>
  );
}

/* ------------------------------------------------------------------ diálogo modal sencillo */
export function Dialogo({ titulo, children, onCerrar, acciones }: { titulo: string; children: ReactNode; onCerrar: () => void; acciones: Accion[] }) {
  return (
    <div className="erp-modal-fondo" onClick={onCerrar}>
      <motion.div className="erp-modal" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()} initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h3>{titulo}</h3>
        <div className="erp-modal-cuerpo">{children}</div>
        <div className="erp-acciones fin">
          <button type="button" className="erp-btn" onClick={onCerrar}>
            Cancelar
          </button>
          {acciones.map((a) => (
            <button key={a.label} type="button" className={`erp-btn ${a.tipo ?? 'primario'}`} onClick={a.onClick} disabled={a.disabled}>
              {a.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** Enlace a otro documento (abre su ficha) */
export function Enlace({ pantalla, clave, children }: { pantalla: Pantalla; clave: string; children: ReactNode }) {
  const { ir } = useErp();
  return (
    <button type="button" className="erp-enlace" onClick={(e) => (e.stopPropagation(), ir(pantalla, clave))}>
      {children}
    </button>
  );
}
