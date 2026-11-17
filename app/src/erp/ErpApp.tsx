/* Marco del ERP de práctica: barra superior, menú lateral, migas y avisos «Éxito / Error». */
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { type Pantalla, erp, useDb } from './modelo';
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

const MENU: { grupo: string; items: { id: Pantalla; label: string; ico: string }[] }[] = [
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
      { id: 'stock', label: 'Stock global', ico: 'M3 21V9l9-6 9 6v12M8 21v-6h8v6' },
      { id: 'docflow', label: 'Docflow', ico: 'M5 6h5v5H5zM14 13h5v5h-5zM10 8.5h4v7' },
    ],
  },
];
const NOMBRE: Record<Pantalla, string> = { inicio: 'Escritorio', terceros: 'Terceros', proveedores: 'Proveedores', articulos: 'Artículos', pedidos: 'Pedidos de compra', albaranes: 'Albaranes de compra', facturas: 'Facturas de compra', stock: 'Stock global', docflow: 'Docflow' };
const GRUPO: Partial<Record<Pantalla, string>> = { terceros: 'Maestros', proveedores: 'Maestros', articulos: 'Maestros', pedidos: 'Compras', albaranes: 'Compras', facturas: 'Compras', stock: 'Logística', docflow: 'Logística' };

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
        <h2>Base de práctica · TUTORIAL</h2>
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
      hacer: (r, exito = 'Éxito', ver) => {
        if (r.ok) aviso('ok', exito, ver);
        else aviso('error', r.error);
        return r.ok;
      },
    }),
    [ini, nav, ir, aviso],
  );

  const P = { terceros: Terceros, proveedores: Proveedores, articulos: Articulos, pedidos: Pedidos, albaranes: Albaranes, facturas: Facturas, stock: Stock, docflow: Docflow } as const;
  const Comp = nav.pantalla === 'inicio' ? null : P[nav.pantalla];

  return (
    <Ctx.Provider value={ctx}>
      <div className={`erp${menu ? ' menu-abierto' : ''}`}>
        <header className="erp-top">
          <button type="button" className="erp-hamb" onClick={() => setMenu((m) => !m)} aria-label="Menú del ERP" aria-expanded={menu}>
            ☰
          </button>
          <button type="button" className="erp-logo" onClick={() => ir('inicio')}>
            <span className="erp-logo-a">A</span>
            <span>
              Axional <em>práctica</em>
            </span>
          </button>
          <span className="erp-ctx">
            <span>TUTORIAL</span>
            <span>Emp. 0</span>
            <span>CENTRAL</span>
          </span>
          <span className="erp-user" title="Tus iniciales">
            {ini || '··'}
          </span>
        </header>
        <div className="erp-body">
          <nav className="erp-menu" aria-label="Menú del ERP">
            <button type="button" className={`erp-menu-item${nav.pantalla === 'inicio' ? ' on' : ''}`} onClick={() => ir('inicio')}>
              <Ico d="M3 11 12 3l9 8M5 10v10h14V10" /> Escritorio
            </button>
            {MENU.map((g) => (
              <div key={g.grupo}>
                <div className="erp-menu-grupo">{g.grupo}</div>
                {g.items.map((i) => (
                  <button key={i.id} type="button" className={`erp-menu-item${nav.pantalla === i.id ? ' on' : ''}`} onClick={() => ir(i.id)}>
                    <Ico d={i.ico} /> {i.label}
                  </button>
                ))}
              </div>
            ))}
            <div className="erp-menu-pie">
              {extra}
              <button
                type="button"
                className="erp-menu-item peligro"
                onClick={() => {
                  if (window.confirm('¿Vaciar la base de práctica? Se borra todo lo grabado en este navegador (de cualquier alumno).')) {
                    erp.reiniciar();
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
            <div className="erp-migas">
              <button type="button" onClick={() => ir('inicio')}>
                Escritorio
              </button>
              {GRUPO[nav.pantalla] && <span>{GRUPO[nav.pantalla]}</span>}
              {nav.pantalla !== 'inicio' && (
                <button type="button" onClick={() => ir(nav.pantalla)}>
                  {NOMBRE[nav.pantalla]}
                </button>
              )}
              {nav.clave && <span className="mono">{nav.clave.startsWith('__nuevo') ? 'Nuevo' : nav.clave}</span>}
            </div>
            {Comp ? <Comp key={nav.pantalla + (nav.clave ?? '')} /> : <Escritorio ir={ir} ini={ini} />}
          </div>
        </div>
        <div className="erp-avisos" aria-live="polite">
          <AnimatePresence>
            {avisos.map((a) => (
              <motion.div key={a.id} className={`erp-aviso ${a.tipo}`} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} role={a.tipo === 'error' ? 'alert' : 'status'}>
                <b>{a.tipo === 'ok' ? 'Éxito' : a.tipo === 'error' ? 'Error' : 'Aviso'}</b>
                <span>{a.texto}</span>
                {a.ver && (
                  <button type="button" onClick={() => ir(a.ver!.pantalla, a.ver!.clave)}>
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
