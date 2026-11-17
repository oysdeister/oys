import { motion } from 'framer-motion';
import { type Db, type Pantalla, baseDe, facturaDeAlbaran, lineasFactura, situacionPedido, totales, useDb } from '../modelo';
import { eur, fechaEs, useErp } from '../ui';

interface Nodo {
  pantalla: Pantalla;
  clave: string;
  tipo: string;
  titulo: string;
  sub: string;
  estado: string;
  importe: number;
}

/** Cadena pedido → albaranes → facturas a partir de cualquier documento ('pedido:X', 'albaran:X', 'factura:X') */
function cadena(d: Db, ref: string) {
  const [tipo, num] = ref.split(':');
  let pedidos: string[] = [];
  if (tipo === 'pedido') pedidos = [num];
  if (tipo === 'albaran') pedidos = [d.albaranes.find((a) => a.numero === num)?.origen ?? ''].filter(Boolean);
  if (tipo === 'factura') pedidos = [...new Set((d.facturas.find((f) => f.numero === num)?.albaranes ?? []).map((a) => d.albaranes.find((x) => x.numero === a)?.origen ?? '').filter(Boolean))];
  const albs = tipo === 'albaran' && !pedidos.length ? [num] : d.albaranes.filter((a) => pedidos.includes(a.origen)).map((a) => a.numero);
  if (tipo === 'factura' && !pedidos.length) albs.push(...(d.facturas.find((f) => f.numero === num)?.albaranes ?? []));
  const facts = [...new Set(albs.map((a) => facturaDeAlbaran(d, a)?.numero).filter((x): x is string => !!x))];
  const col1: Nodo[] = pedidos.map((n) => {
    const p = d.pedidos.find((x) => x.numero === n)!;
    return { pantalla: 'pedidos', clave: n, tipo: 'PEDIDO COMPRA', titulo: n, sub: fechaEs(p.fecha), estado: situacionPedido(d, p), importe: baseDe(p.lineas) };
  });
  const col2: Nodo[] = albs.map((n) => {
    const a = d.albaranes.find((x) => x.numero === n)!;
    return { pantalla: 'albaranes', clave: n, tipo: 'ALBARAN COMPRA ORIGEN PEDIDO', titulo: n, sub: fechaEs(a.fecha), estado: facturaDeAlbaran(d, n) ? 'Facturado' : a.estado, importe: baseDe(a.lineas) };
  });
  const col3: Nodo[] = facts.map((n) => {
    const f = d.facturas.find((x) => x.numero === n)!;
    return { pantalla: 'facturas', clave: n, tipo: 'FACTURA COMPRA ORIGEN ALBARAN', titulo: n, sub: fechaEs(f.fecha), estado: f.contabilizada ? 'Contabilizada' : f.estado, importe: totales(lineasFactura(d, f)).total };
  });
  return [col1, col2, col3];
}

const COLOR: Record<string, string> = { Facturado: '', Validado: 'verde', Contabilizada: 'violeta', Provisional: 'naranja', Pendiente: 'naranja' };

/* Copia del diálogo DOCFLOW de Axional: arriba un círculo por tipo de documento con cuántos hay,
   abajo una tarjeta por documento (código, estado en color, tipo y fecha) y la actual con borde naranja. */
export default function Docflow() {
  const db = useDb();
  const { clave, ir } = useErp();
  const ref = clave ?? '';
  const cols = ref ? cadena(db, ref) : [[], [], []];
  const nombres = ['Pedidos compras', 'Suministros', 'Facturas compras'];
  const usadas = cols.map((c, i) => ({ c, i })).filter(({ c }) => c.length);
  return (
    <section className="erp-lista">
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <h2>DOCFLOW</h2>
          {ref && <span className="erp-cab-sub">{ref.split(':')[1]}</span>}
        </div>
      </header>
      {!ref ? (
        <div className="erp-df erp-vacio">Abre un pedido, albarán o factura y elige «Docflow» en el menú ⌄ que hay junto a la estrella del título.</div>
      ) : (
        <div className="erp-df">
          <div className="erp-df-tipos">
            {usadas.map(({ c, i }, k) => (
              <div key={i} style={{ display: 'contents' }}>
                {k > 0 && <span className="erp-df-flecha" aria-hidden="true" />}
                <motion.div className="erp-df-tipo" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: k * 0.15 }}>
                  <span className={`erp-df-circ${i === 2 ? ' verde' : ''}`}>{c.length}</span>
                  <span>{nombres[i]}</span>
                </motion.div>
              </div>
            ))}
          </div>
          <div className="erp-df-docs">
            {usadas.map(({ c, i }, k) => (
              <div key={i} style={{ display: 'contents' }}>
                {k > 0 && <span className="erp-df-enlace" aria-hidden="true" />}
                <div className="erp-df-col">
                  {c.map((n, j) => (
                    <motion.button
                      key={n.clave}
                      type="button"
                      className={`erp-df-doc${ref.endsWith(':' + n.clave) ? ' actual' : ''}`}
                      onClick={() => ir(n.pantalla, n.clave)}
                      title={`${eur(n.importe)} € · abrir ${n.clave}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + k * 0.15 + j * 0.05 }}
                    >
                      <b>{n.titulo}</b>
                      <span className={`st ${COLOR[n.estado] ?? ''}`}>{n.estado === 'Servido o Facturado' ? 'Facturado' : n.estado}</span>
                      <small>{n.tipo}</small>
                      <em>{n.sub}</em>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="erp-df-zoom">
            <span>−&nbsp;&nbsp;100 %&nbsp;&nbsp;+</span>
          </div>
        </div>
      )}
    </section>
  );
}
