import { motion } from 'framer-motion';
import { type Db, type Pantalla, baseDe, facturaDeAlbaran, lineasFactura, situacionPedido, totales, useDb } from '../modelo';
import { Estado, eur, fechaEs, useErp } from '../ui';

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
    return { pantalla: 'pedidos', clave: n, tipo: 'Pedido PC', titulo: n, sub: fechaEs(p.fecha), estado: situacionPedido(d, p), importe: baseDe(p.lineas) };
  });
  const col2: Nodo[] = albs.map((n) => {
    const a = d.albaranes.find((x) => x.numero === n)!;
    return { pantalla: 'albaranes', clave: n, tipo: 'Albarán ACPC', titulo: n, sub: `${a.lineas.reduce((s, l) => s + l.cantidad, 0)} uds · ${fechaEs(a.fecha)}`, estado: a.estado, importe: baseDe(a.lineas) };
  });
  const col3: Nodo[] = facts.map((n) => {
    const f = d.facturas.find((x) => x.numero === n)!;
    return { pantalla: 'facturas', clave: n, tipo: 'Factura FCOA', titulo: n, sub: f.facturaProveedor, estado: f.contabilizada ? 'Contabilizada' : f.estado, importe: totales(lineasFactura(d, f)).total };
  });
  return [col1, col2, col3];
}

export default function Docflow() {
  const db = useDb();
  const { clave, ir } = useErp();
  const ref = clave ?? '';
  const cols = ref ? cadena(db, ref) : [[], [], []];
  const nombres = ['Pedido', 'Albaranes', 'Facturas'];
  return (
    <section className="erp-lista">
      <header className="erp-barra">
        <h2>Docflow</h2>
      </header>
      {!ref ? (
        <div className="erp-vacio">Abre un pedido, albarán o factura y pulsa «Docflow» para ver su cadena de documentos.</div>
      ) : (
        <div className="erp-docflow">
          {cols.map((c, i) => (
            <div key={nombres[i]} className="erp-df-col">
              <h3>{nombres[i]}</h3>
              {c.map((n, k) => (
                <motion.button
                  key={n.clave}
                  type="button"
                  className={`erp-df-nodo${ref.endsWith(':' + n.clave) ? ' actual' : ''}`}
                  onClick={() => ir(n.pantalla, n.clave)}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.18 + k * 0.06 }}
                >
                  <small>{n.tipo}</small>
                  <b className="mono">{n.titulo}</b>
                  <span>{n.sub}</span>
                  <span className="erp-df-pie">
                    <Estado valor={n.estado} />
                    <em>{eur(n.importe)} €</em>
                  </span>
                </motion.button>
              ))}
              {!c.length && <div className="erp-df-hueco">—</div>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
