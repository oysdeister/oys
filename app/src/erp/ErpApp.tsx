/* Marco del ERP de práctica copiado de Axional VNext: barra «Manager · BBDD TUTORIAL» con buscador ⌘K, menú lateral y avisos «Éxito / Ver registro». */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Pantalla, type PantallaFija, erp, useDb } from './modelo';
import { type Aviso, type ErpCtx, Ctx } from './ui';
import './erp.css';
import Terceros from './pantallas/Terceros';
import Proveedores from './pantallas/Proveedores';
import Articulos from './pantallas/Articulos';
import Pedidos from './pantallas/Pedidos';
import Albaranes from './pantallas/Albaranes';
import Facturas from './pantallas/Facturas';
import Stock from './pantallas/Stock';
import Docflow from './pantallas/Docflow';
import Generica from './catalogo/Generica';
import Asientos from './pantallas/Asientos';
import Efectos from './pantallas/Efectos';
import Remesas from './pantallas/Remesas';
import Extractos from './pantallas/Extractos';
import Conciliacion from './pantallas/Conciliacion';
import { almacen } from './catalogo/almacen';
import { useBuscar, useMenu } from './catalogo/datos';
import type { CatBuscar, CatMenuNodo } from './catalogo/tipos';
import { destinoEnlace } from './catalogo/botones';

import { CODIGO, codigoDe, destino } from './catalogo/propias';

const MENU: { grupo: string; items: { id: PantallaFija; label: string; ico: string }[] }[] = [
  {
    grupo: 'Maestros',
    items: [
      { id: 'terceros', label: 'Terceros', ico: 'M4 20c0-4 4-6 8-6s8 2 8 6M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8' },
      { id: 'proveedores', label: 'Proveedores', ico: 'M3 7h13v10H3zM16 10h4l1 3v4h-5M7 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4M18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4' },
      { id: 'articulos', label: 'Artículos', ico: 'M12 2 3 7v10l9 5 9-5V7zM3 7l9 5 9-5M12 12v10' },
    ],
  },
  {
    grupo: 'Compras',
    items: [
      { id: 'pedidos', label: 'Pedidos', ico: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6' },
      { id: 'albaranes', label: 'Albaranes', ico: 'M4 4h16v16H4zM4 9h16M9 14h6' },
      { id: 'facturas', label: 'Facturas', ico: 'M7 3h10l3 3v15H4V3zM8 9h8M8 13h8M8 17h5' },
    ],
  },
  {
    grupo: 'Logística',
    items: [
      { id: 'stock', label: 'Stocks cuentas', ico: 'M3 21V9l9-6 9 6v12M8 21v-6h8v6' },
      { id: 'docflow', label: 'Docflow', ico: 'M5 6h5v5H5zM14 13h5v5h-5zM10 8.5h4v7' },
    ],
  },
  {
    grupo: 'Finanzas',
    items: [
      { id: 'asientos', label: 'Asientos', ico: 'M5 4h14v16H5zM8 8h8M8 12h8M8 16h4' },
      { id: 'efectos', label: 'Cartera de efectos', ico: 'M3 7h18v10H3zM7 12h4M15 10v4' },
      { id: 'remesas', label: 'Remesas', ico: 'M4 6h16M4 12h16M4 18h10' },
      { id: 'extractos', label: 'Extractos bancarios', ico: 'M4 10 12 4l8 6M6 10v8M10 10v8M14 10v8M18 10v8M4 20h16' },
      { id: 'conciliacion', label: 'Conciliación', ico: 'M7 7h10M7 12h10M7 17h10M4 7l1 1M4 12l1 1M4 17l1 1' },
    ],
  },
];

/** Árbol del menú real de Axional (Finanzas, Gestión, Dashboard) con carpetas plegables */
function Arbol({ nodos, ruta, abiertos, alternar, abrir, actual }: { nodos: CatMenuNodo[]; ruta: string; abiertos: Set<string>; alternar: (r: string) => void; abrir: (c: string) => void; actual: string }) {
  return (
    <ul className="erp-arbol" role="group">
      {nodos.map((n, i) => {
        const r = `${ruta}/${i}`;
        if (n.h) {
          const ab = abiertos.has(r);
          return (
            <li key={r}>
              <button type="button" className="erp-arbol-carpeta" aria-expanded={ab} onClick={() => alternar(r)}>
                <span className={`erp-arbol-tri${ab ? ' on' : ''}`} aria-hidden="true">▸</span>
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M3 6h7l2 2h9v11H3z" fill="currentColor" /></svg>
                {n.n}
              </button>
              {ab && <Arbol nodos={n.h} ruta={r} abiertos={abiertos} alternar={alternar} abrir={abrir} actual={actual} />}
            </li>
          );
        }
        return (
          <li key={r}>
            <button type="button" className={`erp-arbol-hoja${actual === n.c ? ' on' : ''}`} onClick={() => n.c && abrir(n.c)} title={n.c}>
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d={n.k === 'q' ? 'M5 4h14v16H5zM8 9h8M8 13h8M8 17h5' : 'M4 5h16v14H4zM4 10h16M10 10v9'} fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>
              {n.n}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Ico({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Escritorio({ ir, ini }: { ir: (p: Pantalla, c?: string | null) => void; ini: string }) {
  const db = useDb();
  const mios = {
    terceros: db.terceros.filter((x) => x.autor === ini).length,
    proveedores: db.proveedores.filter((x) => x.autor === ini).length,
    articulos: db.articulos.filter((x) => x.autor === ini).length,
    pedidos: db.pedidos.filter((x) => x.autor === ini).length,
    albaranes: db.albaranes.filter((x) => x.autor === ini).length,
    facturas: db.facturas.filter((x) => x.autor === ini).length,
  } as Record<string, number>;
  const ultimos = db.log.filter((e) => e.autor === ini).slice(-6).reverse();
  return (
    <div className="erp-escritorio">
      <div className="erp-bienvenida">
        <h2>Manager · BBDD TUTORIAL</h2>
        <p>Empresa 0 · Delegación CENTRAL · Almacén 0. Todo lo que grabes se guarda en este navegador con tus iniciales ({ini || '—'}).</p>
      </div>
      <div className="erp-flujo" aria-label="Circuito de compras">
        {MENU.flatMap((g) => g.items)
          .filter((i) => i.id !== 'stock' && i.id !== 'docflow')
          .map((i, k) => (
            <motion.button key={i.id} type="button" className="erp-tile" onClick={() => ir(i.id)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.05 }}>
              <span className="erp-tile-ico">
                <Ico d={i.ico} />
              </span>
              <b>{i.label}</b>
              <small>{mios[i.id] ? `${mios[i.id]} tuyos` : 'Ninguno tuyo aún'}</small>
            </motion.button>
          ))}
      </div>
      {ultimos.length > 0 && (
        <div className="erp-seccion">
          <h3>Tu actividad reciente</h3>
          <ul className="erp-actividad">
            {ultimos.map((e) => (
              <li key={e.t + e.doc}>
                <time>{new Date(e.t).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</time> {e.que} <code>{e.doc.split('<')[0]}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function ErpApp({ ini, inicial = 'inicio', extra }: { ini: string; inicial?: Pantalla; extra?: ReactNode }) {
  const [nav, setNav] = useState<{ pantalla: Pantalla; clave: string | null }>({ pantalla: inicial, clave: null });
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [menu, setMenu] = useState(false);
  const idRef = useRef(0);
  const cuerpo = useRef<HTMLDivElement>(null);
  const indiceRef = useRef<CatBuscar[] | undefined>(undefined);

  const ir = useCallback((pantalla: Pantalla, clave: string | null = null) => {
    setNav({ pantalla, clave });
    setMenu(false);
    cuerpo.current?.scrollTo({ top: 0 });
  }, []);
  const aviso = useCallback((tipo: Aviso['tipo'], texto: string, ver?: Aviso['ver']) => {
    const id = ++idRef.current;
    setAvisos((a) => [...a.slice(-2), { id, tipo, texto, ver }]);
    setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== id)), tipo === 'error' ? 9000 : 4500);
  }, []);
  const ctx = useMemo<ErpCtx>(
    () => ({
      ini,
      pantalla: nav.pantalla,
      clave: nav.clave,
      ir,
      aviso,
      noDisp: (que) => {
        const q = que.replace(/^La pestaña «(.*)»$/, '$1').trim();
        const RESP: [RegExp, Aviso['tipo'], string][] = [
          [/^Favoritos$/, 'ok', 'Añadido a favoritos.'],
          [/^Recargar$/, 'info', 'Datos actualizados.'],
          [/^Información$/, 'info', `Base TUTORIAL · empresa 0 · usuario ${ini || '—'}.`],
          [/^Metadata$/, 'info', `Objeto ${codigoDe(nav.pantalla) ?? nav.pantalla} · diccionario wic_icon.`],
          [/^Imprimir/, 'ok', 'Documento enviado a la cola de impresión.'],
          [/^(Exportar|Importar)/, 'ok', 'Exportación generada en Excel.'],
          [/^Copiar$/, 'ok', 'Registro copiado.'],
          [/^Ordenar/, 'info', 'Ordenado por la primera columna.'],
          [/^Filtros/, 'info', 'Sin filtros aplicados.'],
          [/^Contabilizar/, 'ok', `Contabilizado. Asiento ${1000 + Math.floor(Math.random() * 9000)} generado.`],
          [/^Descontabilizar/, 'ok', 'Descontabilizado. Asiento eliminado.'],
          [/^Anular/, 'ok', 'Documento anulado.'],
          [/^No facturable/, 'ok', 'Marcado como no facturable.'],
          [/^(Cerrar|Activar)$/, 'ok', 'Éxito'],
          [/^(Cambiar|Alterar)/, 'ok', 'Proceso ejecutado correctamente.'],
        ];
        const r = RESP.find(([re]) => re.test(q));
        if (r) return aviso(r[1], r[2]);
        const d = destinoEnlace(q, indiceRef.current);
        if (d === 'docflow') return ir('docflow');
        if (d) return ir(destino(d));
        aviso('ok', 'Proceso ejecutado correctamente.');
      },
      hacer: (r, exito = 'Éxito', ver) => {
        if (r.ok) aviso('ok', exito, ver);
        else aviso('error', r.error);
        return r.ok;
      },
    }),
    [ini, nav, ir, aviso],
  );

  const P: Partial<Record<PantallaFija, () => ReactNode>> = { terceros: Terceros, proveedores: Proveedores, articulos: Articulos, pedidos: Pedidos, albaranes: Albaranes, facturas: Facturas, stock: Stock, docflow: Docflow, asientos: Asientos, efectos: Efectos, remesas: Remesas, extractos: Extractos, conciliacion: Conciliacion };
  const pf = nav.pantalla as PantallaFija;
  const Comp = nav.pantalla === 'inicio' || nav.pantalla.startsWith('obj:') ? null : P[pf];
  const genCode = nav.pantalla.startsWith('obj:') ? nav.pantalla.slice(4) : !Comp && nav.pantalla !== 'inicio' ? CODIGO[pf] : undefined;

  const [busca, setBusca] = useState('');
  const { datos: indice } = useBuscar();
  indiceRef.current = indice;
  const { datos: arbol } = useMenu();
  const [abiertos, setAbiertos] = useState<Set<string>>(() => new Set());
  const alternar = (r: string) => setAbiertos((a) => { const n = new Set(a); if (n.has(r)) n.delete(r); else n.add(r); return n; });
  const abrir = (code: string) => ir(destino(code));
  const actualCode = nav.pantalla.startsWith('obj:') ? nav.pantalla.slice(4) : (CODIGO[nav.pantalla as PantallaFija] ?? '');
  const sinAcentos = (x: string) => x.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const resultados = useMemo(() => {
    const q = sinAcentos(busca.trim());
    if (!q || !indice) return [];
    const vistos = new Set<string>();
    const res: { code: string; nombre: string; ruta: string }[] = [];
    for (const [nombre, code, ruta] of indice) {
      if (vistos.has(code)) continue;
      if (sinAcentos(nombre).includes(q) || code.includes(q) || sinAcentos(ruta).includes(q)) {
        vistos.add(code);
        res.push({ code, nombre, ruta });
      }
    }
    const empieza = (x: { nombre: string }) => (sinAcentos(x.nombre).startsWith(q) ? 0 : 1);
    return res.sort((a, b) => empieza(a) - empieza(b)).slice(0, 12);
  }, [busca, indice]);
  const ruido = (que: string) =>
    aviso('info', que === 'Notificaciones' ? 'No tienes notificaciones pendientes.' : que === 'Aplicaciones' ? 'Aplicaciones: Manager, Studio y DBStudio.' : 'Asistente: escribe en el buscador ⌘K el nombre de la pantalla que buscas.');

  return (
    <Ctx.Provider value={ctx}>
      <div className={`erp${menu ? ' menu-abierto' : ''}`}>
        <header className="erp-top">
          <button type="button" className="erp-top-ico" onClick={() => setMenu((m) => !m)} aria-label="Menú del ERP" aria-expanded={menu} title="Sidebar">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <rect x="3.5" y="4.5" width="17" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 4.5v15" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4.5 5.5h4v13h-4z" fill="currentColor" />
            </svg>
          </button>
          <button type="button" className="erp-logo" onClick={() => ir('inicio')}>
            Manager
          </button>
          <span className="erp-base">BBDD TUTORIAL</span>
          <div className="erp-top-buscar">
            <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-4.8-4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && resultados[0]) {
                  abrir(resultados[0].code);
                  setBusca('');
                }
                if (e.key === 'Escape') setBusca('');
              }}
              placeholder="Buscar"
              aria-label="Buscar una pantalla del ERP"
            />
            <kbd>⌘</kbd>
            <kbd>K</kbd>
            {resultados.length > 0 && (
              <ul className="erp-top-res" role="listbox">
                {resultados.map((r) => (
                  <li key={r.code}>
                    <button
                      type="button"
                      onClick={() => {
                        abrir(r.code);
                        setBusca('');
                      }}
                    >
                      <span className="erp-res-txt">
                        <b>{r.nombre}</b>
                        <small>{r.ruta}</small>
                      </span>
                      <code>{r.code}</code>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span className="erp-top-der">
            <button type="button" className="erp-top-ico" onClick={() => ruido('Asistente')} aria-label="Asistente">
              <Ico d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
            </button>
            <button type="button" className="erp-top-ico" onClick={() => ruido('Notificaciones')} aria-label="Notificaciones">
              <Ico d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0" />
            </button>
            <button type="button" className="erp-top-ico" onClick={() => ruido('Aplicaciones')} aria-label="Aplicaciones">
              <Ico d="M5 5h2v2H5zM11 5h2v2h-2zM17 5h2v2h-2zM5 11h2v2H5zM11 11h2v2h-2zM17 11h2v2h-2zM5 17h2v2H5zM11 17h2v2h-2zM17 17h2v2h-2z" />
            </button>
            <span className="erp-user" title="Tus iniciales">
              {ini || '··'}
            </span>
          </span>
        </header>
        <div className="erp-body">
          <nav className="erp-menu" aria-label="Menú del ERP">
            <button type="button" className={`erp-menu-item${nav.pantalla === 'inicio' ? ' on' : ''}`} onClick={() => ir('inicio')}>
              <Ico d="M3 11 12 3l9 8M5 10v10h14V10" /> Escritorio
            </button>
            {arbol ? <Arbol nodos={arbol} ruta="" abiertos={abiertos} alternar={alternar} abrir={abrir} actual={actualCode} /> : <p className="erp-arbol-carga">Cargando menú…</p>}
            <div className="erp-menu-pie">
              {extra}
              <button
                type="button"
                className="erp-menu-item peligro"
                onClick={() => {
                  if (window.confirm('¿Vaciar la base de práctica? Se borra todo lo grabado en este navegador (de cualquier alumno).')) {
                    erp.reiniciar();
                    almacen.reiniciar();
                    ir('inicio');
                  }
                }}
              >
                <Ico d="M4 4v6h6M20 20v-6h-6M5 15a8 8 0 0 0 14 3M19 9A8 8 0 0 0 5 6" /> Reiniciar base
              </button>
            </div>
          </nav>
          <div className="erp-scrim" onClick={() => setMenu(false)} aria-hidden="true" />
          <div className="erp-main" ref={cuerpo}>
            {Comp ? <Comp key={nav.pantalla + (nav.clave ?? '')} /> : genCode ? <Generica key={nav.pantalla + (nav.clave ?? '')} code={genCode} /> : <Escritorio ir={ir} ini={ini} />}
          </div>
        </div>
        <div className="erp-avisos" aria-live="polite">
          <AnimatePresence>
            {avisos.map((a) => (
              <motion.div key={a.id} className={`erp-aviso ${a.tipo}`} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} role={a.tipo === 'error' ? 'alert' : 'status'}>
                <div>
                  <b>{a.tipo === 'ok' ? 'Éxito' : a.tipo === 'error' ? 'Error' : 'Aviso'}</b>
                  <span>{a.texto}</span>
                </div>
                {a.ver && (
                  <button type="button" className="erp-aviso-ver" onClick={() => ir(a.ver!.pantalla, a.ver!.clave)}>
                    Ver registro
                  </button>
                )}
                <button type="button" className="erp-aviso-x" onClick={() => setAvisos((x) => x.filter((y) => y.id !== a.id))} aria-label="Cerrar aviso">
                  ×
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Ctx.Provider>
  );
}
