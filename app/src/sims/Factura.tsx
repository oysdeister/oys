import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { conIni, redondea } from '../lib/texto';
import { Marco, MensajeVeredicto, azar, baraja, datosSim, elige, esObj, f2, igual, leeImporte, lista, num, sacude, txt, useIni, useSim, useVeredicto, type Sim } from './kit';

interface Linea {
  articulo: string;
  cantidad: number;
  precio: number;
  dto: number;
  iva: number;
}
interface Ronda {
  titulo: string;
  documento: string;
  tercero: string;
  lineas: Linea[];
  nota?: string;
}

const importe = (l: Linea) => redondea(l.cantidad * l.precio * (1 - l.dto / 100));

function calcula(ls: Linea[]) {
  const base = redondea(ls.reduce((s, l) => s + importe(l), 0));
  const tipos = [...new Set(ls.map((l) => l.iva))].sort((a, b) => b - a);
  const desglose = tipos.map((t) => {
    const b = redondea(ls.filter((l) => l.iva === t).reduce((s, l) => s + importe(l), 0));
    return { tipo: t, base: b, cuota: redondea((b * t) / 100) };
  });
  const iva = redondea(desglose.reduce((s, d) => s + d.cuota, 0));
  return { base, iva, total: redondea(base + iva), desglose };
}

function lineasDe(v: unknown): Linea[] {
  const xs = esObj(v) ? lista(v.lineas) : [];
  return xs.filter(esObj).map((x) => ({
    articulo: [txt(x.articulo), txt(x.descripcion)].filter(Boolean).join(' '),
    cantidad: num(x.cantidad, 1),
    precio: num(x.precio),
    dto: num(x.dto),
    iva: num(x.ivaPct, 21),
  }));
}

const ARTICULOS = ['13500620 6000-2RS ISB', '00000016 Rodamiento 6201', '32515225 Retén 25x52', 'Servicio de montaje', 'Libro técnico', 'Fruta para el comedor', 'Caja de cartón 40x30'];

function construirRondas(ini: string): Ronda[] {
  const fc = datosSim('compras').factura;
  const fv = datosSim('ventas').factura;
  const fcL = lineasDe(fc);
  const fvL = lineasDe(fv);
  const fvAlt = lineasDe(esObj(fv) ? fv.alternativa : null);
  const cliente = conIni(esObj(fv) ? txt(fv.cliente, 'T{INI}') : 'T{INI}', ini);

  // variación 1: dos líneas con descuento, 21 %
  const v1: Linea[] = baraja(ARTICULOS.slice(0, 3))
    .slice(0, 2)
    .map((a) => ({ articulo: a, cantidad: azar(2, 15), precio: azar(4, 60) + elige([0, 0.5, 0.75, 0.2]), dto: elige([5, 10, 15]), iva: 21 }));
  v1[1].dto = 0;
  // variación 2: tres tipos de IVA
  const v2: Linea[] = [
    { articulo: elige(['Servicio de montaje', 'Caja de cartón 40x30']), cantidad: azar(1, 8), precio: azar(10, 90) + elige([0, 0.5, 0.35]), dto: elige([0, 10]), iva: 21 },
    { articulo: 'Fruta para el comedor', cantidad: azar(3, 20), precio: azar(1, 6) + elige([0.15, 0.4, 0.95]), dto: 0, iva: 10 },
    { articulo: 'Libro técnico', cantidad: azar(1, 6), precio: azar(12, 45) + elige([0, 0.9, 0.5]), dto: elige([0, 5]), iva: 4 },
  ];

  return [
    {
      titulo: 'Factura de compra 0FC000001',
      documento: '0FC000001',
      tercero: 'Proveedor 00001',
      lineas: fcL.length ? fcL : [{ articulo: '13500620 6000-2RS ISB', cantidad: 10, precio: 12.5, dto: 0, iva: 21 }],
      nota: 'Conformada con el albarán 0AC000002.',
    },
    {
      titulo: 'Factura de venta 0FV000001',
      documento: '0FV000001',
      tercero: `Cliente ${cliente}`,
      lineas: fvL.length ? fvL : [{ articulo: '13500620 6000-2RS ISB', cantidad: 10, precio: 20, dto: 0, iva: 21 }],
      nota: 'Generada desde el albarán 0AV000001.',
    },
    {
      titulo: 'Factura de venta 0FV000002',
      documento: '0FV000002',
      tercero: `Cliente ${cliente}`,
      lineas: fvAlt.length ? fvAlt : [{ articulo: '13500620 6000-2RS ISB', cantidad: 5, precio: 22, dto: 0, iva: 21 }],
      nota: 'Viene del pedido 0PV000002 y el albarán 0AV000002.',
    },
    { titulo: 'Variación: con descuento', documento: `0FV${String(azar(3, 99)).padStart(6, '0')}`, tercero: `Cliente ${cliente}`, lineas: v1, nota: 'El descuento se resta antes de calcular el IVA.' },
    { titulo: 'Variación: tres tipos de IVA', documento: `0FC${String(azar(10, 99)).padStart(6, '0')}`, tercero: 'Proveedor 00001', lineas: v2, nota: 'Cada tipo de IVA se calcula sobre su propia base.' },
  ];
}

function RondaFactura({ r, sim }: { r: Ronda; sim: Sim }) {
  const sol = useMemo(() => calcula(r.lineas), [r]);
  const [val, setVal] = useState({ base: '', iva: '', total: '' });
  const [res, setRes] = useState<Record<string, boolean | null>>({});
  const [n, setN] = useState(0);
  const [verDesglose, setVerDesglose] = useState(false);
  const [v, decir] = useVeredicto();
  const conDto = r.lineas.some((l) => l.dto > 0);

  const comprobar = () => {
    const b = leeImporte(val.base);
    const i = leeImporte(val.iva);
    const t = leeImporte(val.total);
    const ok = { base: igual(b, sol.base), iva: igual(i, sol.iva), total: igual(t, sol.total) };
    setRes(ok);
    setN((x) => x + 1);
    setVerDesglose(true);
    if (ok.base && ok.iva && ok.total) {
      decir(true, <>Base {f2(sol.base)} + IVA {f2(sol.iva)} = {f2(sol.total)}. Igual que la factura del ERP.</>);
      sim.acierto();
      return;
    }
    if (!ok.base) decir(false, conDto ? 'La base no cuadra. Calcula cada línea: cantidad × precio, menos el descuento, y súmalas.' : 'La base no cuadra: suma cantidad × precio de cada línea.');
    else if (!ok.iva)
      decir(false, sol.desglose.length > 1 ? 'La base está bien. El IVA no: calcula la cuota de cada tipo por separado, redondea cada una a 2 decimales y súmalas.' : 'La base está bien. El IVA es base × tipo / 100, redondeado a 2 decimales.');
    else decir(false, 'Base e IVA bien. El total es la suma de los dos.');
  };

  const campo = (k: 'base' | 'iva' | 'total', etiqueta: string) => (
    <motion.label key={`${k}-${res[k] === false ? n : 0}`} className={`tl-fac-campo ${res[k] === true ? 'ok' : res[k] === false ? 'mal' : ''}`} animate={res[k] === false && !sim.reducido ? sacude : { x: 0 }}>
      <span>{etiqueta}</span>
      <input
        inputMode="decimal"
        placeholder="0,00"
        value={val[k]}
        onChange={(e) => {
          setVal((x) => ({ ...x, [k]: e.target.value }));
          setRes((x) => ({ ...x, [k]: null }));
        }}
        onKeyDown={(e) => e.key === 'Enter' && comprobar()}
        disabled={sim.resuelta}
      />
    </motion.label>
  );

  return (
    <div className="tl-fac-zona">
      <motion.article className="tl-papel" initial={sim.reducido ? false : { rotateX: 25, y: 30, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 110, damping: 15 }}>
        <header className="tl-papel-cab">
          <div>
            <small>Factura</small>
            <b className="tl-mono">{r.documento}</b>
          </div>
          <div className="tl-papel-ter">{r.tercero}</div>
        </header>
        <div className="tl-papel-lineas" role="table" aria-label="Líneas de la factura">
          <div className="tl-papel-fila cab" role="row">
            <span role="columnheader">Artículo</span>
            <span role="columnheader">Cant.</span>
            <span role="columnheader">Precio</span>
            <span role="columnheader">% Dto.</span>
            <span role="columnheader">% IVA</span>
            <span role="columnheader">Importe</span>
          </div>
          {r.lineas.map((l, i) => (
            <div className="tl-papel-fila" role="row" key={i}>
              <span role="cell" className="art">
                {l.articulo}
              </span>
              <span role="cell" data-et="Cant.">
                {l.cantidad}
              </span>
              <span role="cell" data-et="Precio">
                {f2(l.precio)}
              </span>
              <span role="cell" data-et="% Dto.">
                {l.dto ? f2(l.dto) : '—'}
              </span>
              <span role="cell" data-et="% IVA">
                {l.iva}
              </span>
              <span role="cell" data-et="Importe" className="imp">
                {verDesglose ? f2(importe(l)) : '?'}
              </span>
            </div>
          ))}
        </div>
        {r.nota && <p className="small muted tl-papel-nota">{r.nota}</p>}
        <div className="tl-fac-campos">
          {campo('base', 'Base imponible')}
          {campo('iva', 'Cuota de IVA')}
          {campo('total', 'Total factura')}
        </div>
        <AnimatePresence>
          {verDesglose && (
            <motion.div className="tl-desglose" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ overflow: 'hidden' }}>
              <b>Desglose</b>
              {r.lineas.map((l, i) => (
                <div key={i} className="tl-desglose-l">
                  <span>
                    {l.cantidad} × {f2(l.precio)}
                    {l.dto ? ` − ${f2(l.dto)} %` : ''}
                  </span>
                  <span>{f2(importe(l))}</span>
                </div>
              ))}
              {sol.desglose.map((d) => (
                <div key={d.tipo} className="tl-desglose-l iva">
                  <span>
                    IVA {d.tipo} % sobre {f2(d.base)}
                  </span>
                  <span>{sim.resuelta || res.iva ? f2(d.cuota) : '…'}</span>
                </div>
              ))}
              {sim.resuelta && (
                <div className="tl-desglose-l tot">
                  <span>Total</span>
                  <span>{f2(sol.total)}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.article>
      <div className="tl-acciones">
        <button className="btn arc" onClick={comprobar} disabled={sim.resuelta}>
          Comprobar
        </button>
      </div>
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimFactura() {
  const ini = useIni();
  const sim = useSim('factura', 5);
  const rondas = useMemo(() => construirRondas(ini), [ini, sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Base, IVA y total"
      color="#e0708a"
      concepto={
        <>
          <p>
            La <b>base imponible</b> es lo que valen las líneas: cantidad × precio, menos el descuento. La <b>cuota de IVA</b> es la base por el tipo (21, 10 o 4 %). El <b>total</b> es base +
            cuota.
          </p>
          <p>Redondea siempre a 2 decimales. Si hay varios tipos de IVA, calcula cada cuota sobre su propia base y súmalas, como hace el ERP en el pie de la factura.</p>
        </>
      }
      enunciado={
        <>
          <h3>{r.titulo}</h3>
          <p>Calcula la base imponible, la cuota de IVA y el total. Puedes usar coma o punto para los decimales.</p>
        </>
      }
    >
      <RondaFactura key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />
    </Marco>
  );
}
