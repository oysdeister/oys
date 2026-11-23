/* Kit de interfaz del ERP de práctica, copiado del aspecto de Axional VNext (nextdemo, base TUTORIAL):
   cabecera «LISTA › registro ☆ ⌄» con botones de proceso de colores, secciones-tarjeta con grupos de pestañas,
   campos subrayados con la etiqueta pequeña encima y listas con nº de fila, casilla, Ordenar y Filtros.
   Todas las pantallas (src/erp/pantallas/*) se construyen solo con estas piezas. */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { PestanaCatalogo } from './catalogo/Generica';
import { codigoDe } from './catalogo/propias';
import { type Linea, type Pantalla, importeLinea, totales } from './modelo';

export const eur = (n: number) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }).format(n);
export const dec = (n: number, d = 3) => new Intl.NumberFormat('es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' }).format(n);
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
  /** Aviso estándar para botones, menús y pestañas que existen en Axional pero no en la práctica */
  noDisp: (que: string) => void;
  /** Campo señalado por el último error de guardado (se marca en rojo y recibe el foco) */
  campoError?: CampoError | null;
  /** Quita la marca de error (al corregir el campo) */
  limpiarError?: () => void;
}
/** Campo de un error: el rótulo entre «» del mensaje y, si lo dice, la línea («Línea 2: …») */
export interface CampoError {
  label: string;
  linea?: number;
  /** cambia en cada error para volver a dar el foco aunque sea el mismo campo */
  vez: number;
}
/** Saca del texto de un error el campo que nombra: «Línea 1: el campo «Artículo» …» → { label: 'Artículo', linea: 1 } */
export function campoDeError(texto: string, vez: number): CampoError | null {
  const m = /«([^»]+)»/.exec(texto);
  if (!m) return null;
  const l = /^Línea (\d+)/.exec(texto);
  return { label: m[1], linea: l ? Number(l[1]) : undefined, vez };
}
/** Aviso al pulsar un proceso con cambios sin guardar: dice qué hacer. */
export const avisoGuardarAntes = (accion: string) => `Tienes cambios sin guardar. Guarda primero con el disquete («Guardar») y después pulsa «${accion}».`;
const normaliza = (s: string) => s.replace(/\*/g, '').trim().toLowerCase();
/** ¿Este campo es el que señala el último error? */
function useMarcaError(label: string, linea?: number) {
  const c = useContext(Ctx);
  const e = c?.campoError;
  const marcado = !!e && normaliza(e.label) === normaliza(label) && (e.linea === undefined || linea === undefined || e.linea === linea);
  const ref = useRef<HTMLLabelElement | null>(null);
  const vez = marcado ? e!.vez : 0;
  useEffect(() => {
    if (!vez) return;
    const el = ref.current?.querySelector<HTMLElement>('input,select,textarea');
    el?.focus({ preventScroll: false });
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  }, [vez]);
  return { marcado, ref, limpiar: () => marcado && c?.limpiarError?.() };
}
export const Ctx = createContext<ErpCtx | null>(null);
export function useErp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useErp fuera de <ErpApp>');
  return c;
}

/** Título de la lista tal como sale en Axional (cabecera y miga de la ficha) */
export const TITULO_LISTA: Partial<Record<Pantalla, string>> = {
  terceros: 'TERCEROS',
  proveedores: 'MAESTRO DE PROVEEDORES',
  articulos: 'MAESTRO DE ARTÍCULOS',
  pedidos: 'PEDIDOS DE COMPRAS',
  albaranes: 'ALBARANES DE COMPRAS',
  facturas: 'FACTURAS DE COMPRAS',
  stock: 'STOCKS CUENTAS',
  docflow: 'DOCFLOW',
};

/* ------------------------------------------------------------------ iconos (trazos al estilo mdi) */
const PATH = {
  estrella: 'm12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z',
  abajo: 'm7 10 5 5 5-5',
  izq: 'm14 7-5 5 5 5',
  der: 'm10 7 5 5-5 5',
  lupa: 'M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM20 20l-4.8-4.8',
  recargar: 'M19 12a7 7 0 1 1-2.05-4.95M19 5v4h-4',
  guardar: 'M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6',
  papelera: 'M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v6M14 11v6',
  ordenar: 'M8 5v14M5 8l3-3 3 3M16 19V5M13 16l3 3 3-3',
  filtros: 'M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4',
  mas: 'M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16zM12 8v8M8 12h8',
  sync: 'M5 10a7 7 0 0 1 12.3-3.3L19 8M19 14a7 7 0 0 1-12.3 3.3L5 16M19 4v4h-4M5 20v-4h4',
  enlace: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  cerrar: 'M6 6l12 12M18 6 6 18',
  arriba: 'm7 14 5-5 5 5',
  calendario: 'M5 6h14v14H5zM5 10h14M9 4v4M15 4v4',
  rejilla: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
} as const;
export function Icono({ n, size = 18 }: { n: keyof typeof PATH | 'puntos'; size?: number }) {
  if (n === 'puntos')
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
        <circle cx="12" cy="5.5" r="1.7" fill="currentColor" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        <circle cx="12" cy="18.5" r="1.7" fill="currentColor" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d={PATH[n]} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function BotonIcono({ n, label, onClick, disabled, activo }: { n: Parameters<typeof Icono>[0]['n']; label: string; onClick?: () => void; disabled?: boolean; activo?: boolean }) {
  return (
    <button type="button" className={`erp-ico${activo ? ' activo' : ''}`} onClick={onClick} disabled={disabled} title={label} aria-label={label}>
      <Icono n={n} />
    </button>
  );
}

/* ------------------------------------------------------------------ menú desplegable */
function Desplegable({ boton, items, alinear = 'izq' }: { boton: (abrir: () => void, abierto: boolean) => ReactNode; items: { label: string; onClick: () => void; disabled?: boolean; title?: string }[]; alinear?: 'izq' | 'der' }) {
  const [abierto, setAbierto] = useState(false);
  const caja = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: MouseEvent) => !caja.current?.contains(e.target as Node) && setAbierto(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false);
    document.addEventListener('mousedown', fuera);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', fuera);
      document.removeEventListener('keydown', esc);
    };
  }, [abierto]);
  return (
    <span className="erp-desp" ref={caja}>
      {boton(() => setAbierto((a) => !a), abierto)}
      {abierto && (
        <motion.ul className={`erp-desp-menu ${alinear}`} role="menu" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.12 }}>
          {items.map((i) => (
            <li key={i.label} role="none">
              <button
                type="button"
                role="menuitem"
                disabled={i.disabled}
                title={i.title}
                onClick={() => {
                  setAbierto(false);
                  i.onClick();
                }}
              >
                {i.label}
              </button>
            </li>
          ))}
        </motion.ul>
      )}
    </span>
  );
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
  menu,
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
  /** opciones del menú ⋮ de la lista */
  menu?: Accion[];
}) {
  const { pantalla, noDisp } = useErp();
  const [q, setQ] = useState('');
  const [buscar, setBuscar] = useState(false);
  const [filtros, setFiltros] = useState(false);
  const [porCol, setPorCol] = useState<Record<string, string>>({});
  const [solo, setSolo] = useState(false);
  const [orden, setOrden] = useState<{ col: string; asc: boolean } | null>(null);
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set());
  const txt = (c: Col<T>, r: T) => (c.texto ? c.texto(r) : String(c.valor(r) ?? ''));
  const vis = useMemo(() => {
    const t = q.trim().toLowerCase();
    let v = filas.filter(
      (r) =>
        (!solo || marcarMios?.(r)) &&
        (!t || cols.some((c) => txt(c, r).toLowerCase().includes(t))) &&
        cols.every((c) => !porCol[c.titulo] || txt(c, r).toLowerCase().includes(porCol[c.titulo].toLowerCase())),
    );
    if (orden) {
      const c = cols.find((x) => x.titulo === orden.col);
      if (c) v = [...v].sort((a, b) => txt(c, a).localeCompare(txt(c, b), 'es', { numeric: true }) * (orden.asc ? 1 : -1));
    }
    return v;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filas, cols, q, solo, marcarMios, porCol, orden]);
  const nombre = TITULO_LISTA[pantalla] ?? titulo.toUpperCase();
  const ordenarPor = (col: string) => setOrden((o) => (o?.col === col ? { col, asc: !o.asc } : { col, asc: true }));
  const todas = vis.length > 0 && vis.every((r) => marcadas.has(clave(r)));
  return (
    <section className="erp-lista">
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <h2 title={nombre}>
            {icono}
            {nombre}
          </h2>
          <BotonIcono n="estrella" label="Añadir a favoritos" onClick={() => noDisp('Favoritos')} />
          <button type="button" className={`erp-chip${orden ? ' on' : ''}`} onClick={() => ordenarPor(orden?.col ?? cols[0].titulo)} title="Ordenar por la primera columna (o pulsa una cabecera)">
            <Icono n="ordenar" size={15} /> Ordenar
          </button>
          <button type="button" className={`erp-chip${filtros ? ' on' : ''}`} onClick={() => setFiltros((f) => !f)} aria-expanded={filtros}>
            <Icono n="filtros" size={15} /> Filtros
          </button>
          {buscar && (
            <label className="erp-buscar">
              <Icono n="lupa" size={15} />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar…" aria-label={`Buscar en ${titulo}`} />
            </label>
          )}
        </div>
        <div className="erp-cab-acc">
          {onNuevo && (
            <button type="button" className="erp-btn azul" onClick={onNuevo}>
              {nuevoTexto}
            </button>
          )}
          <BotonIcono n="izq" label="Página anterior" disabled />
          <BotonIcono n="der" label="Página siguiente" disabled />
          <span className="erp-sep" />
          <BotonIcono n="lupa" label="Buscar" onClick={() => setBuscar((b) => !b)} activo={buscar} />
          <BotonIcono
            n="recargar"
            label="Recargar"
            onClick={() => {
              setQ('');
              setPorCol({});
              setOrden(null);
            }}
          />
          <Desplegable
            alinear="der"
            items={[...(menu ?? []).map((a) => ({ label: a.label, onClick: a.onClick, disabled: a.disabled })), ...['Información', 'Imprimir', 'Exportar'].map((l) => ({ label: l, onClick: () => noDisp(l) }))]}
            boton={(abrir) => <BotonIcono n="puntos" label="Más opciones" onClick={abrir} />}
          />
        </div>
      </header>
      {filtros && (
        <div className="erp-filtros">
          {marcarMios && (
            <label className="erp-check">
              <input type="checkbox" checked={solo} onChange={(e) => setSolo(e.target.checked)} /> Solo los míos
            </label>
          )}
          <span className="erp-filtros-ayuda">Escribe en la fila de filtros de cada columna.</span>
          {(Object.values(porCol).some(Boolean) || solo) && (
            <button
              type="button"
              className="erp-btn"
              onClick={() => {
                setPorCol({});
                setSolo(false);
              }}
            >
              Quitar filtros
            </button>
          )}
        </div>
      )}
      <div className="erp-tarjeta erp-tabla-scroll">
        <table className="erp-tabla">
          <thead>
            <tr>
              <th className="n" />
              <th className="chk">
                <input
                  type="checkbox"
                  aria-label="Marcar todas"
                  checked={todas}
                  onChange={() => setMarcadas(todas ? new Set() : new Set(vis.map(clave)))}
                />
              </th>
              {cols.map((c) => (
                <th key={c.titulo} className={c.num ? 'num' : undefined} style={c.ancho ? { width: c.ancho } : undefined} onClick={() => ordenarPor(c.titulo)} aria-sort={orden?.col === c.titulo ? (orden.asc ? 'ascending' : 'descending') : undefined}>
                  {c.titulo}
                  {orden?.col === c.titulo && <span className="erp-ord">{orden.asc ? '▲' : '▼'}</span>}
                </th>
              ))}
            </tr>
            {filtros && (
              <tr className="filtro">
                <th />
                <th />
                {cols.map((c) => (
                  <th key={c.titulo}>
                    <input className="erp-input mini" value={porCol[c.titulo] ?? ''} onChange={(e) => setPorCol((p) => ({ ...p, [c.titulo]: e.target.value }))} aria-label={`Filtrar ${c.titulo}`} />
                  </th>
                ))}
              </tr>
            )}
          </thead>
          <tbody>
            {vis.map((r, i) => {
              const k = clave(r);
              return (
                <tr key={k} className={marcarMios?.(r) ? 'mio' : undefined} onClick={() => onAbrir(r)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onAbrir(r)}>
                  <td className="n">
                    <span className="erp-lnk">{i + 1}</span>
                  </td>
                  <td className="chk" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Marcar ${k}`}
                      checked={marcadas.has(k)}
                      onChange={() =>
                        setMarcadas((m) => {
                          const n = new Set(m);
                          if (n.has(k)) n.delete(k);
                          else n.add(k);
                          return n;
                        })
                      }
                    />
                  </td>
                  {cols.map((c, j) => (
                    <td key={c.titulo} className={c.num ? 'num' : undefined}>
                      {j === 0 ? <span className="erp-lnk">{c.valor(r)}</span> : c.valor(r)}
                    </td>
                  ))}
                </tr>
              );
            })}
            {!vis.length && (
              <tr className="vacia">
                <td colSpan={cols.length + 2}>{vacio}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="erp-pie-lista">
        {vis.length ? `1-${vis.length} de ${vis.length}` : '0 registros'}
        {marcadas.size > 0 && ` · ${marcadas.size} marcados`}
      </p>
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
  /** dónde va en la cabecera: botón de color, menú «Acciones ⋮», menú ⌄ del título o icono. Si falta, se deduce del texto */
  lugar?: 'boton' | 'acciones' | 'menu' | 'guardar' | 'borrar';
}
/** Colores reales de los botones de proceso de Axional VNext */
const COLOR: Record<string, string> = {
  Validar: 'verde',
  'Pasar a provisional': 'naranja',
  Contabilizar: 'violeta',
  Descontabilizar: 'morado',
  Anular: 'gris',
  'No facturable': 'gris',
  Cerrar: 'gris',
  Nuevo: 'azul',
};
function colorDe(a: Accion) {
  if (COLOR[a.label]) return COLOR[a.label];
  if (/^(Nuevo|Añadir|Crear)/.test(a.label)) return 'azul';
  return a.tipo === 'peligro' ? 'gris' : 'neutro';
}
function lugarDe(a: Accion): NonNullable<Accion['lugar']> {
  if (a.lugar) return a.lugar;
  if (a.label === 'Guardar') return 'guardar';
  if (a.label === 'Borrar') return 'borrar';
  if (/^(Docflow|Ver |Asiento|Vencimientos|Suministros|Albaranes|Facturas|Terceros|Proveedores|Clientes|Stock|Situación)/.test(a.label)) return 'menu';
  if (/^(Generar|Copiar|Conformar|Actualizar|Imprimir|Cambiar)/.test(a.label)) return 'acciones';
  return 'boton';
}
export function Ficha({
  titulo,
  sub,
  estado,
  acciones,
  onVolver,
  children,
  lista,
  menu,
}: {
  titulo: ReactNode;
  sub?: ReactNode;
  estado?: string;
  acciones: Accion[];
  onVolver: () => void;
  children: ReactNode;
  /** texto de la miga (por defecto, el título de la lista de la pantalla) */
  lista?: string;
  /** entradas extra del menú ⌄ del título (Docflow, Suministros, Asientos…) */
  menu?: Accion[];
}) {
  const { pantalla, noDisp } = useErp();
  const por = (l: Accion['lugar']) => acciones.filter((a) => lugarDe(a) === l);
  const guardar = por('guardar')[0];
  const borrar = por('borrar')[0];
  const unico = (xs: Accion[]) => xs.filter((a, i) => xs.findIndex((b) => b.label === a.label) === i);
  const enMenu = unico([...por('menu'), ...(menu ?? [])]);
  const enAcciones = unico([...por('acciones'), { label: 'Copiar', onClick: () => noDisp('Copiar'), lugar: 'acciones' as const }]);
  const ORDEN = ['Cambiar código', 'Validar', 'Pasar a provisional', 'Contabilizar', 'Descontabilizar', 'Cerrar', 'Activar', 'No facturable', 'Anular'];
  const rango = (a: Accion) => (/^(Nuevo|Añadir)/.test(a.label) ? 99 : ORDEN.indexOf(a.label) === -1 ? 50 : ORDEN.indexOf(a.label));
  const botones = por('boton').sort((a, b) => rango(a) - rango(b));
  const it = (a: Accion) => ({ label: a.label, onClick: a.onClick, disabled: a.disabled, title: a.title });
  const nombre = lista ?? TITULO_LISTA[pantalla] ?? '';
  return (
    <motion.section className="erp-ficha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15 }}>
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <button type="button" className="erp-miga" onClick={onVolver} title="Volver a la lista">
            {nombre}
          </button>
          <span className="erp-miga-sep" aria-hidden="true">
            ›
          </span>
          <h2>{titulo}</h2>
          <BotonIcono n="estrella" label="Añadir a favoritos" onClick={() => noDisp('Favoritos')} />
          {enMenu.length > 0 && <Desplegable items={enMenu.map(it)} boton={(abrir, ab) => <BotonIcono n={ab ? 'arriba' : 'abajo'} label="Documentos relacionados" onClick={abrir} />} />}
          {estado && <Estado valor={estado} />}
          {sub && <span className="erp-cab-sub">{sub}</span>}
        </div>
        <div className="erp-cab-acc" role="toolbar" aria-label="Acciones del registro">
          <Desplegable
            alinear="der"
            items={enAcciones.map(it)}
            boton={(abrir) => (
              <button type="button" className="erp-btn neutro" onClick={abrir}>
                Acciones <Icono n="puntos" size={14} />
              </button>
            )}
          />
          {botones.map((a) => (
            <button key={a.label} type="button" className={`erp-btn ${colorDe(a)}`} onClick={a.onClick} disabled={a.disabled} title={a.title}>
              {a.label}
            </button>
          ))}
          {guardar ? <BotonIcono n="guardar" label="Guardar" onClick={guardar.onClick} disabled={guardar.disabled} activo={!guardar.disabled} /> : <BotonIcono n="guardar" label="Guardar" disabled />}
          {borrar ? <BotonIcono n="papelera" label="Borrar" onClick={borrar.onClick} disabled={borrar.disabled} /> : <BotonIcono n="papelera" label="Borrar" disabled />}
          <BotonIcono n="izq" label="Registro anterior" disabled />
          <BotonIcono n="der" label="Registro siguiente" disabled />
          <span className="erp-sep" />
          <BotonIcono n="lupa" label="Buscar" onClick={onVolver} />
          <BotonIcono n="recargar" label="Recargar" onClick={() => noDisp('Recargar')} />
          <Desplegable alinear="der" items={['Información', 'Metadata', 'Imprimir', 'Exportar'].map((l) => ({ label: l, onClick: () => noDisp(l) }))} boton={(abrir) => <BotonIcono n="puntos" label="Más opciones" onClick={abrir} />} />
        </div>
      </header>
      <div className="erp-ficha-cuerpo">{children}</div>
    </motion.section>
  );
}

const CLASE_ESTADO: Record<string, string> = {
  Validado: 'verde',
  Activo: 'verde',
  Contabilizada: 'violeta',
  Contabilizado: 'violeta',
  'Servido o Facturado': 'azul',
  Facturado: 'azul',
  Provisional: 'naranja',
  Pendiente: 'gris',
  'Parcialmente servido': 'ambar',
  'Pendiente de facturar': 'ambar',
};
export function Estado({ valor }: { valor: string }) {
  return (
    <span className={`erp-estado ${CLASE_ESTADO[valor] ?? 'gris'}`}>
      <i aria-hidden="true" />
      {valor}
    </span>
  );
}

/* ------------------------------------------------------------------ pestañas superiores (Facturas compras | Líneas | …) */
export function Pestanas({ tabs, actual, onCambio }: { tabs: { id: string; label: string; n?: number }[]; actual: string; onCambio: (id: string) => void }) {
  return (
    <div className="erp-pestanas" role="tablist">
      {tabs.map((t, i) => (
        <button key={t.id} type="button" role="tab" aria-selected={t.id === actual} className={t.id === actual ? 'on' : ''} onClick={() => onCambio(t.id)}>
          {i > 0 && <Icono n="rejilla" size={13} />}
          {t.label}
          {t.n !== undefined && <span className="erp-cuenta">{t.n}</span>}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ secciones-tarjeta */
/** Tarjeta plegable de la ficha. Con `tabs`, la cabecera es un grupo de pestañas (Información general | Facturación…).
    `media` la pone en media columna (las fichas de documento van a dos columnas). */
export function Seccion({
  titulo,
  tabs,
  children,
  media,
  inicial,
}: {
  titulo?: string;
  tabs?: { label: string; contenido?: ReactNode; noDisp?: boolean }[];
  children?: ReactNode;
  media?: boolean;
  inicial?: number;
}) {
  const { pantalla } = useErp();
  const [abierta, setAbierta] = useState(true);
  const [tab, setTab] = useState(inicial ?? 0);
  return (
    <section className={`erp-sec erp-tarjeta${media ? ' media' : ''}`}>
      <header className="erp-sec-cab">
        {tabs ? (
          <div className="erp-sec-tabs" role="tablist">
            {tabs.map((t, i) => (
              <button
                key={`${t.label}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === tab}
                className={i === tab ? 'on' : ''}
                onClick={() => {
                  setTab(i);
                  setAbierta(true);
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        ) : (
          <h3>{titulo}</h3>
        )}
        <BotonIcono n={abierta ? 'arriba' : 'abajo'} label={abierta ? 'Plegar' : 'Desplegar'} onClick={() => setAbierta((a) => !a)} />
      </header>
      {abierta && <div className="erp-sec-cuerpo">{tabs ? (tabs[tab]?.noDisp || !tabs[tab]?.contenido ? <PestanaCatalogo code={codigoDe(pantalla)} titulo={tabs[tab]?.label ?? ''} /> : tabs[tab].contenido) : children}</div>}
    </section>
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
  /** texto pequeño bajo el campo (en Axional, la descripción del código elegido) */
  ayuda?: string;
  ancho?: 1 | 2 | 3 | 4;
}
function Envoltorio({ label, req, ayuda, ancho, children, clase = '' }: Base & { children: ReactNode; clase?: string }) {
  const { marcado, ref, limpiar } = useMarcaError(label);
  return (
    <label ref={ref} className={`erp-campo${ancho ? ` a${ancho}` : ''} ${clase}${marcado ? ' con-error' : ''}`} onInput={limpiar} onChange={limpiar}>
      <span className="erp-label">
        {label}
        {req && <i aria-label="obligatorio">*</i>}
      </span>
      {children}
      {ayuda && <small className="erp-ayuda">{ayuda}</small>}
      {marcado && (
        <small className="erp-error-campo" role="alert">
          Revisa este campo
        </small>
      )}
    </label>
  );
}
/** aria-invalid del control según la marca de error del campo */
function useInvalido(label: string) {
  const c = useContext(Ctx);
  const e = c?.campoError;
  return !!e && e.linea === undefined && normaliza(e.label) === normaliza(label) ? true : undefined;
}
export function CampoTexto({ value, onChange, mono, placeholder, ...b }: Base & { value: string; onChange: (v: string) => void; mono?: boolean; placeholder?: string }) {
  const inv = useInvalido(b.label);
  return (
    <Envoltorio {...b}>
      <input aria-invalid={inv} className={`erp-input${mono ? ' mono' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled} placeholder={placeholder} required={b.req} />
    </Envoltorio>
  );
}
export function CampoNum({ value, onChange, decimales = 2, ...b }: Base & { value: number; onChange: (v: number) => void; decimales?: number }) {
  const [txt, setTxt] = useState<string | null>(null);
  const inv = useInvalido(b.label);
  return (
    <Envoltorio {...b}>
      <input
        aria-invalid={inv}
        className="erp-input num"
        inputMode="decimal"
        value={txt ?? (Number.isFinite(value) ? dec(value, decimales) : '')}
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
  const inv = useInvalido(b.label);
  return (
    <Envoltorio {...b} clase="fecha">
      <input aria-invalid={inv} type="date" className="erp-input" value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled} />
    </Envoltorio>
  );
}
export function CampoSel({ value, onChange, opciones, vacio, ...b }: Base & { value: string; onChange: (v: string) => void; opciones: readonly { v: string; t: string }[]; vacio?: string }) {
  const inv = useInvalido(b.label);
  return (
    <Envoltorio {...b} clase="sel">
      <select aria-invalid={inv} className="erp-input" value={value} onChange={(e) => onChange(e.target.value)} disabled={b.disabled}>
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
export function CampoCheck({ label, value, onChange, disabled, ancho }: { label: string; value: boolean; onChange?: (v: boolean) => void; disabled?: boolean; ancho?: 1 | 2 | 3 | 4 }) {
  return (
    <label className={`erp-campo check${ancho ? ` a${ancho}` : ''}`}>
      <span className="erp-check">
        <input type="checkbox" checked={value} onChange={(e) => onChange?.(e.target.checked)} disabled={disabled || !onChange} /> {label}
      </span>
    </label>
  );
}
export function CampoLectura({ label, valor, ancho, ayuda, req, num }: { label: string; valor: ReactNode; ancho?: 1 | 2 | 3 | 4; ayuda?: string; req?: boolean; num?: boolean }) {
  return (
    <div className={`erp-campo lectura${ancho ? ` a${ancho}` : ''}`}>
      <span className="erp-label">
        {label}
        {req && <i aria-label="obligatorio">*</i>}
      </span>
      <span className={`erp-valor${num ? ' num' : ''}`}>{valor === '' || valor === undefined || valor === null ? ' ' : valor}</span>
      {ayuda && <small className="erp-ayuda">{ayuda}</small>}
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
  const { noDisp, campoError, limpiarError } = useErp();
  const caja = useRef<HTMLDivElement>(null);
  /** ¿El último error señala esta columna de esta línea? */
  const mal = (label: string, n: number) => (campoError && campoError.linea === n && normaliza(campoError.label) === normaliza(label) ? true : undefined);
  useEffect(() => {
    if (!campoError?.linea) return;
    const el = caja.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    el?.focus();
    el?.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
  }, [campoError?.vez, campoError?.linea]);
  const set = (n: number, cambio: Partial<Linea>) => {
    if (campoError?.linea === n) limpiarError?.();
    onChange?.(lineas.map((l) => (l.n === n ? { ...l, ...cambio } : l)));
  };
  const quitar = (n: number) => onChange?.(lineas.filter((l) => l.n !== n).map((l, i) => ({ ...l, n: i + 1 })));
  /** La línea nueva sale vacía: el alumno elige el artículo (como en Axional). */
  const anadir = () => {
    onChange?.([...lineas, { n: lineas.length + 1, articulo: '', descripcion: '', cantidad: 1, precio: 0, dto: 0 }]);
  };
  const desc = (l: Linea) => l.descripcion || articulos?.find((a) => a.v === l.articulo)?.t.replace(/^\S+\s*[·-]?\s*/, '') || '';
  const t = totales(lineas);
  const editaTodo = editable && !soloCantidad;
  return (
    <div className="erp-lineas" ref={caja}>
      <section className="erp-sec erp-tarjeta">
        <header className="erp-sec-cab">
          <h3>
            <Icono n="rejilla" size={15} /> Líneas
          </h3>
        </header>
        <div className="erp-cab mini">
          <div className="erp-cab-tit">
            <BotonIcono n="estrella" label="Favoritos" onClick={() => noDisp('Favoritos')} />
            <button type="button" className="erp-chip" onClick={() => noDisp('Ordenar líneas')}>
              <Icono n="ordenar" size={15} /> Ordenar
            </button>
            <button type="button" className="erp-chip" onClick={() => noDisp('Filtros de líneas')}>
              <Icono n="filtros" size={15} /> Filtros
            </button>
          </div>
          <div className="erp-cab-acc">
            <BotonIcono n="izq" label="Anterior" disabled />
            <BotonIcono n="der" label="Siguiente" disabled />
            <span className="erp-sep" />
            <BotonIcono n="recargar" label="Recargar" onClick={() => noDisp('Recargar')} />
            <BotonIcono n="puntos" label="Más opciones" onClick={() => noDisp('Importar / exportar líneas')} />
          </div>
        </div>
        <div className="erp-tabla-scroll">
          <table className="erp-tabla">
            <thead>
              <tr>
                <th className="n" />
                <th className="chk">
                  <input type="checkbox" aria-label="Marcar todas" disabled />
                </th>
                <th>Artículo</th>
                <th>Descripción artículo</th>
                <th>VLP</th>
                <th className="num">Cantidad</th>
                <th>Unidad</th>
                <th className="num">Precio</th>
                <th className="num">% Dto.</th>
                <th className="num">Importe neto</th>
                {pendientes && <th className="num">Pendiente</th>}
                {editaTodo && <th style={{ width: '2.5em' }} aria-label="Quitar" />}
              </tr>
            </thead>
            <tbody>
              {lineas.map((l) => (
                <tr key={l.n} className="estatica">
                  <td className="n">
                    <span className="erp-lnk">{l.n}</span>
                  </td>
                  <td className="chk">
                    <input type="checkbox" aria-label={`Marcar línea ${l.n}`} />
                  </td>
                  <td>
                    {editaTodo && articulos ? (
                      <select
                        className="erp-input mini"
                        value={l.articulo}
                        aria-label={`Artículo de la línea ${l.n}`}
                        aria-invalid={mal('Artículo', l.n)}
                        onChange={(e) => {
                          const a = articulos.find((x) => x.v === e.target.value);
                          set(l.n, { articulo: e.target.value, precio: a?.precio ?? l.precio, descripcion: '' });
                        }}
                      >
                        <option value="">— elige artículo —</option>
                        {articulos.map((a) => (
                          <option key={a.v} value={a.v}>
                            {a.t}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="erp-lnk">{l.articulo}</span>
                    )}
                  </td>
                  <td>{desc(l)}</td>
                  <td>0</td>
                  <td className="num">{editable ? <NumCelda valor={l.cantidad} onCambio={(v) => set(l.n, { cantidad: v })} etiqueta={`Cantidad de la línea ${l.n}`} invalido={mal('Cantidad', l.n)} /> : dec(l.cantidad)}</td>
                  <td>UNIDAD</td>
                  <td className="num">{editaTodo ? <NumCelda valor={l.precio} onCambio={(v) => set(l.n, { precio: v })} etiqueta={`Precio de la línea ${l.n}`} invalido={mal('Precio', l.n)} /> : dec(l.precio, 6)}</td>
                  <td className="num">{editaTodo ? <NumCelda valor={l.dto} onCambio={(v) => set(l.n, { dto: v })} etiqueta={`Descuento de la línea ${l.n}`} /> : dec(l.dto)}</td>
                  <td className="num fuerte">{eur(importeLinea(l))}</td>
                  {pendientes && <td className={`num${(pendientes[l.n] ?? 0) > 0 ? ' aviso' : ''}`}>{dec(pendientes[l.n] ?? 0)}</td>}
                  {editaTodo && (
                    <td>
                      <button type="button" className="erp-ico" onClick={() => quitar(l.n)} aria-label={`Quitar la línea ${l.n}`} title="Borrar línea">
                        <Icono n="papelera" size={16} />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {editaTodo && articulos && (
                <tr className="alta estatica">
                  <td className="n">
                    <button type="button" className="erp-ico azul" onClick={anadir} disabled={!articulos.length} aria-label="Añadir línea" title="Añadir línea">
                      <Icono n="mas" size={18} />
                    </button>
                  </td>
                  <td colSpan={pendientes ? 10 : 9} className="erp-alta-txt">
                    <button type="button" className="erp-enlace" onClick={anadir} disabled={!articulos.length}>
                      Añadir línea
                    </button>
                  </td>
                </tr>
              )}
              {!lineas.length && !editaTodo && (
                <tr className="vacia">
                  <td colSpan={12}>Sin líneas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <Totales base={t.base} iva={t.iva} total={t.total} />
    </div>
  );
}
function NumCelda({ valor, onCambio, etiqueta, invalido }: { valor: number; onCambio: (v: number) => void; etiqueta: string; invalido?: boolean }) {
  const [txt, setTxt] = useState<string | null>(null);
  return (
    <input
      aria-invalid={invalido}
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
/** Tarjeta «Importe» de la cabecera de un documento (divisa, base, IVA y total) */
export function Totales({ base, iva, total }: { base: number; iva: number; total: number }) {
  return (
    <section className="erp-sec erp-tarjeta erp-totales">
      <header className="erp-sec-cab">
        <div className="erp-sec-tabs">
          <button type="button" className="on">
            Importe
          </button>
        </div>
      </header>
      <div className="erp-sec-cuerpo">
        <div className="erp-rejilla c5">
          <CampoLectura label="Divisa" valor="EUR" ayuda="Euro" req />
          <CampoLectura label="Cambio" valor="1,000000" num req />
          <CampoLectura label="Base imponible" valor={eur(base)} num req />
          <CampoLectura label="IVA 21 %" valor={eur(iva)} num />
          <CampoLectura label="Importe total" valor={<b className="erp-total">{eur(total)}</b>} num req />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ diálogo modal (como los de Axional: cabecera con la base y ✕) */
export function Dialogo({ titulo, children, onCerrar, acciones }: { titulo: string; children: ReactNode; onCerrar: () => void; acciones: Accion[] }) {
  return (
    <div className="erp-modal-fondo" onClick={onCerrar}>
      <motion.div className="erp-modal" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <header className="erp-modal-cab">
          <span>BBDD TUTORIAL</span>
          <BotonIcono n="cerrar" label="Cerrar" onClick={onCerrar} />
        </header>
        <h3>{titulo.toUpperCase()}</h3>
        <div className="erp-modal-cuerpo">{children}</div>
        <div className="erp-modal-pie">
          <button type="button" className="erp-btn neutro" onClick={onCerrar}>
            Cancelar
          </button>
          {acciones.map((a) => (
            <button key={a.label} type="button" className={`erp-btn ${COLOR[a.label] ?? 'azul'}`} onClick={a.onClick} disabled={a.disabled}>
              {a.label}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/** Enlace a otro documento (abre su ficha), subrayado como los códigos de Axional */
export function Enlace({ pantalla, clave, children }: { pantalla: Pantalla; clave: string; children: ReactNode }) {
  const { ir } = useErp();
  return (
    <button type="button" className="erp-enlace" onClick={(e) => (e.stopPropagation(), ir(pantalla, clave))}>
      {children}
    </button>
  );
}
