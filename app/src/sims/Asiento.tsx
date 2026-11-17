import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { conIni } from '../lib/texto';
import { Marco, MensajeVeredicto, azar, datosSim, elige, esObj, f2, igual, leeImporte, lista, num, sacude, txt, useIni, useSim, useVeredicto, type Sim } from './kit';

type Lado = 'D' | 'H';
type Pide = 'importe' | 'lado' | 'cuenta' | 'error' | null;

interface Linea {
  cuenta: string;
  nombre: string;
  lado: Lado;
  importe: number;
  pide: Pide;
  /** importe que se enseña al empezar (para «encuentra el error») */
  inicial?: number;
  /** pista concreta si esta línea está mal */
  pista?: string;
}

interface Ronda {
  titulo: string;
  texto: string;
  ayuda: string;
  lineas: Linea[];
  modo: 'normal' | 'error';
}

const CUENTAS: Record<string, string> = {
  '57200.00000': 'Bancos e instituciones de crédito c/c vista, euros',
  '43000.00000': 'Clientes (euros)',
  '40000.00000': 'Proveedores (euros)',
  '60000.00000': 'Compras de mercancías',
  '47200.00000': 'Hacienda Pública, IVA',
  '40000.00010': 'Proveedores (euros) · Rodamientos del Norte',
  '40090.00000': 'Proveedores, facturas pendientes de recibir o de formalizar',
  '70000.00000': 'Ventas de mercancías',
  '62900.00000': 'Otros servicios',
  '62902.00000': 'Gastos diversos',
  '62903.00000': 'Correos y mensajería',
  '62600.00000': 'Servicios bancarios y similares',
};

/** Lee las líneas de un asiento de los JSON (descarta las que no traen cuenta) */
function lineasDe(v: unknown, pide: (l: { cuenta: string; lado: Lado }, i: number) => Pide): Linea[] {
  const xs = esObj(v) ? lista(v.lineas) : [];
  const r: Linea[] = [];
  xs.forEach((x) => {
    if (!esObj(x)) return;
    const cuenta = txt(x.cuenta);
    if (!cuenta) return;
    const debe = num(x.debe);
    const haber = num(x.haber);
    const lado: Lado = debe > 0 ? 'D' : 'H';
    const l = { cuenta, lado };
    r.push({ cuenta, nombre: txt(x.nombreCuenta) || CUENTAS[cuenta] || '', lado, importe: debe || haber, pide: pide(l, r.length) });
  });
  return r;
}

function construirRondas(ini: string): Ronda[] {
  const as = lista(datosSim('asientos').asientos);
  const cart = lista(datosSim('carteras').asientos);
  const buscar = (xs: unknown[], trozo: string) => xs.find((a) => esObj(a) && txt(a.titulo).includes(trozo));

  // 1 · Asiento 6 con cuatro líneas: rellena el Haber
  let r1 = lineasDe(buscar(as, 'cuatro líneas'), (l) => (l.lado === 'H' ? 'importe' : null));
  if (r1.length < 2)
    r1 = [
      { cuenta: '62902.00000', nombre: CUENTAS['62902.00000'], lado: 'D', importe: 1000, pide: null },
      { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: 1000, pide: 'importe' },
      { cuenta: '62903.00000', nombre: CUENTAS['62903.00000'], lado: 'D', importe: 250, pide: null },
      { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: 250, pide: 'importe' },
    ];

  // 2 · Factura de compra 0FC000009 del vídeo (cap. 8): asiento de 5 líneas, elige el lado
  const r2: Linea[] = [
    { cuenta: '40000.00010', nombre: CUENTAS['40000.00010'], lado: 'H', importe: 48.4, pide: 'lado', pista: 'La 40000.00010 es lo que debes al proveedor: una deuda va al Haber.' },
    { cuenta: '47200.00000', nombre: CUENTAS['47200.00000'], lado: 'D', importe: 8.4, pide: 'lado', pista: 'El IVA que pagas en una compra (47200) lo recuperas de Hacienda: va al Debe.' },
    { cuenta: '60000.00000', nombre: 'Compras de mercancías', lado: 'D', importe: 40, pide: 'lado', pista: 'La primera 60000 es la compra de verdad: un gasto va al Debe.' },
    { cuenta: '40090.00000', nombre: CUENTAS['40090.00000'], lado: 'D', importe: 40, pide: 'lado', pista: 'El albarán dejó la 40090 al Haber. La factura la anula poniéndola al lado contrario: Debe.' },
    { cuenta: '60000.00000', nombre: 'Compras de mercancías (retroceso del albarán)', lado: 'H', importe: 40, pide: 'lado', pista: 'Esta segunda 60000 deshace la compra que ya anotó el albarán: va al Haber.' },
  ];

  // 3 · Cobro CA026-000001 (carteras): elige la cuenta
  let r3 = lineasDe(buscar(cart, 'CA026-000001'), () => 'cuenta');
  if (r3.length < 2)
    r3 = [
      { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'D', importe: 242, pide: 'cuenta' },
      { cuenta: '43000.00000', nombre: 'Clientes (euros)', lado: 'H', importe: 242, pide: 'cuenta' },
    ];

  // 4 · Asiento 9 descuadrado (Cuadre 500,00): encuentra el error
  const malo = lineasDe(buscar(as, 'descuadrado'), () => 'error');
  const bueno = lineasDe(buscar(as, 'líneas 1 y 2 a 1.500'), () => 'error');
  let r4: Linea[] =
    malo.length === bueno.length && malo.length > 0
      ? bueno.map((b, i) => ({ ...b, inicial: malo[i].importe }))
      : [
          { cuenta: '62902.00000', nombre: CUENTAS['62902.00000'], lado: 'D', importe: 1500, pide: 'error', inicial: 1500 },
          { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: 1500, pide: 'error', inicial: 1000 },
          { cuenta: '62903.00000', nombre: CUENTAS['62903.00000'], lado: 'D', importe: 250, pide: 'error', inicial: 250 },
          { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: 250, pide: 'error', inicial: 250 },
        ];
  r4 = r4.map((l) => ({ ...l, pide: 'error' as Pide }));

  // 5 · Variación: gasto con IVA pagado por banco
  const gasto = elige(['62900.00000', '62902.00000', '62903.00000']);
  const base = azar(40, 900) + elige([0, 0.25, 0.5, 0.8, 0.15]);
  const iva = Math.round(base * 21) / 100;
  const total = Math.round((base + iva) * 100) / 100;
  const r5: Linea[] = [
    { cuenta: gasto, nombre: CUENTAS[gasto], lado: 'D', importe: base, pide: null },
    { cuenta: '47200.00000', nombre: CUENTAS['47200.00000'], lado: 'D', importe: iva, pide: 'importe' },
    { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: total, pide: 'importe' },
  ];

  // 6 · Movimiento de tesorería: pago por transferencia con comisión
  const pago = azar(600, 3200) + elige([0, 0.15, 0.4, 0.75]);
  const comision = elige([2.5, 3.5, 4.75, 6]);
  const r6: Linea[] = [
    { cuenta: '40000.00000', nombre: CUENTAS['40000.00000'], lado: 'D', importe: pago, pide: 'lado', pista: 'El flujo del pago lleva la cuenta del proveedor: le pagas, tu deuda baja, así que va al Debe.' },
    { cuenta: '62600.00000', nombre: CUENTAS['62600.00000'], lado: 'D', importe: comision, pide: 'cuenta', pista: 'La comisión es un gasto bancario: el flujo de comisión lleva la 62600, Servicios bancarios.' },
    { cuenta: '57200.00000', nombre: CUENTAS['57200.00000'], lado: 'H', importe: Math.round((pago + comision) * 100) / 100, pide: 'importe', pista: 'Del banco sale el pago más la comisión.' },
  ];

  return [
    {
      titulo: 'Asiento 6 (EA-DOC-001)',
      texto: 'Gasto diverso de 1.000,00 y correos y mensajería de 250,00, los dos pagados por banco. El Debe ya está puesto: rellena el Haber del banco.',
      ayuda: 'Cada euro que va al Debe tiene su pareja en el Haber. El banco paga lo mismo que cuesta cada gasto.',
      lineas: r1,
      modo: 'normal',
    },
    {
      titulo: 'Factura de compra 0FC000009',
      texto:
        'La factura FRA-2026-0157 de Rodamientos del Norte (proveedor 00010): 10 × 4,00 = 40,00 + IVA 21 % 8,40 = 48,40. Viene del albarán 0AC000011, que ya se contabilizó. Toca el lado de cada una de las 5 líneas.',
      ayuda: 'Compra e IVA van al Debe; la deuda con el proveedor, al Haber. Las dos últimas líneas deshacen el apunte del albarán (60000 al Debe, 40090 al Haber), así que van al revés.',
      lineas: r2,
      modo: 'normal',
    },
    {
      titulo: 'Cobro CA026-000001',
      texto: conIni('Cobras en el banco el efecto de la factura FVN026-000001 de T{INI} Tercero Carteras: 242,00. Elige la cuenta de cada línea.', ini),
      ayuda: 'El dinero entra en el banco (Debe). El cliente ya no te debe ese importe, así que su cuenta baja por el Haber.',
      lineas: r3,
      modo: 'normal',
    },
    {
      titulo: 'Asiento 9 (EA-DOC-004): encuentra el error',
      texto: 'Al copiar el asiento cambiaste el gasto diverso a 1.500,00, pero el ERP marca Cuadre 500,00 y no te deja seguir. Corrige la línea que se quedó sin cambiar.',
      ayuda: 'El Cuadre es Debe menos Haber. Si sobran 500,00 en el Debe, falta subir 500,00 en alguna línea del Haber.',
      lineas: r4,
      modo: 'error',
    },
    {
      titulo: 'Variación: gasto con IVA',
      texto: `Pagas por banco una factura de ${CUENTAS[gasto].toLowerCase()} de ${f2(base)} + IVA 21 %. Calcula el IVA y lo que sale del banco.`,
      ayuda: 'IVA = base × 21 / 100, redondeado a 2 decimales. Lo que sale del banco es base + IVA.',
      lineas: r5,
      modo: 'normal',
    },
    {
      titulo: 'Movimiento de tesorería con comisión',
      texto: conIni(
        `Contabilizas el movimiento de tesorería de la cuenta BBVACCTRI: pago por transferencia (operación PMICDT) de ${f2(pago)} a T{INI} Proveedor, con una comisión de ${f2(comision)} en su propio flujo. El banco es la cuenta contable de la cuenta financiera; cada flujo pone la suya.`,
        ini,
      ),
      ayuda: 'El banco (57200) va contra las cuentas de los flujos: el pago al proveedor y la comisión. Pagas: el banco baja por el Haber y lo que sale va al Debe.',
      lineas: r6,
      modo: 'normal',
    },
  ];
}

/* ---------- La balanza ---------- */

function Balanza({ debe, haber, reducido }: { debe: number; haber: number; reducido: boolean }) {
  const dif = Math.round((debe - haber) * 100) / 100;
  const max = Math.max(debe, haber, 1);
  const ang = -Math.max(-14, Math.min(14, (dif / max) * 22));
  const cuadra = Math.abs(dif) < 0.005 && debe > 0;
  const tr = reducido ? 'none' : 'transform 0.9s cubic-bezier(.25,1.6,.45,1)';
  const plato = (x: number, etiqueta: string, valor: number) => (
    <g style={{ transform: `rotate(${-ang}deg)`, transformOrigin: `${x}px 46px`, transformBox: 'view-box', transition: tr }}>
      <line x1={x} y1={46} x2={x - 46} y2={118} stroke="var(--ink-3)" strokeWidth="1.5" />
      <line x1={x} y1={46} x2={x + 46} y2={118} stroke="var(--ink-3)" strokeWidth="1.5" />
      <path d={`M${x - 58} 118 h116 a58 22 0 0 1 -116 0z`} className="tl-plato" />
      <ellipse cx={x} cy={118} rx={58} ry={7} className="tl-plato-borde" />
      <text x={x} y={160} textAnchor="middle" className="tl-plato-et">
        {etiqueta}
      </text>
      <text x={x} y={180} textAnchor="middle" className="tl-plato-num">
        {f2(valor)}
      </text>
    </g>
  );
  return (
    <div className={`tl-balanza ${cuadra ? 'cuadra' : ''}`}>
      <div className="tl-balanza-3d">
      <svg viewBox="0 0 360 230" role="img" aria-label={`Debe ${f2(debe)}, Haber ${f2(haber)}, cuadre ${f2(dif)}`}>
        <ellipse cx="180" cy="224" rx="150" ry="9" className="tl-suelo" />
        <path d="M150 222 h60 l-12 -14 h-36z" fill="var(--ink)" />
        <rect x="177" y="40" width="6" height="170" rx="3" fill="var(--ink)" />
        <g style={{ transform: `rotate(${ang}deg)`, transformOrigin: '180px 46px', transformBox: 'view-box', transition: tr }}>
          <rect x="54" y="42" width="252" height="8" rx="4" fill="var(--ink)" />
          {plato(64, 'Debe', debe)}
          {plato(296, 'Haber', haber)}
        </g>
        <circle cx="180" cy="46" r="11" fill={cuadra ? 'var(--arc)' : 'var(--signal)'} stroke="var(--ink)" strokeWidth="3" />
      </svg>
      </div>
      <motion.div className="tl-cuadre" animate={cuadra && !reducido ? { scale: [1, 1.12, 1] } : { scale: 1 }} transition={{ duration: 0.5 }}>
        Cuadre <strong>{f2(dif)}</strong>
      </motion.div>
    </div>
  );
}

/* ---------- Una ronda ---------- */

interface Fila {
  cuenta: string;
  lado: Lado | null;
  importe: string;
}

function RondaAsiento({ ronda, sim }: { ronda: Ronda; sim: Sim }) {
  const [filas, setFilas] = useState<Fila[]>(() =>
    ronda.lineas.map((l) => ({
      cuenta: l.pide === 'cuenta' ? '' : l.cuenta,
      lado: l.pide === 'lado' ? null : l.lado,
      importe: l.pide === 'importe' ? '' : f2(l.inicial ?? l.importe),
    })),
  );
  const [mal, setMal] = useState<boolean[]>([]);
  const [sac, setSac] = useState<number[]>([]);
  const [v, decir] = useVeredicto();
  const opcionesCuenta = useMemo(() => {
    const propias = ronda.lineas.map((l) => l.cuenta);
    const otras = ['40000.00000', '70000.00000', '60000.00000'].filter((c) => !propias.includes(c));
    return [...new Set([...propias, ...otras])].sort();
  }, [ronda]);

  const totales = filas.reduce(
    (t, f) => {
      const n = leeImporte(f.importe) ?? 0;
      if (f.lado === 'D') t.d += n;
      if (f.lado === 'H') t.h += n;
      return t;
    },
    { d: 0, h: 0 },
  );
  totales.d = Math.round(totales.d * 100) / 100;
  totales.h = Math.round(totales.h * 100) / 100;

  const cambia = (i: number, f: Partial<Fila>) => {
    setFilas((xs) => xs.map((x, j) => (j === i ? { ...x, ...f } : x)));
    setMal((m) => m.map((x, j) => (j === i ? false : x)));
  };

  const comprobar = () => {
    const errores = ronda.lineas.map((l, i) => {
      const f = filas[i];
      return f.cuenta !== l.cuenta || f.lado !== l.lado || !igual(leeImporte(f.importe), l.importe);
    });
    setMal(errores);
    const pistaDe = () => {
      const k = errores.findIndex((e, i) => e && ronda.lineas[i].pista && filas[i].lado !== null);
      return k >= 0 ? ronda.lineas[k].pista : undefined;
    };
    setSac((xs) => errores.map((e, i) => (xs[i] ?? 0) + (e ? 1 : 0)));
    const nMal = errores.filter(Boolean).length;
    const cuadra = Math.abs(totales.d - totales.h) < 0.005;
    if (nMal === 0) {
      decir(true, <>Debe {f2(totales.d)} = Haber {f2(totales.h)}. El asiento cuadra y el ERP te deja guardarlo.</>);
      sim.acierto();
      return;
    }
    const sinLado = filas.some((f) => f.lado === null);
    const sinCuenta = filas.some((f) => !f.cuenta);
    if (sinLado) decir(false, 'Aún hay líneas sin lado. Toca Debe o Haber en cada una.');
    else if (sinCuenta) decir(false, 'Falta elegir alguna cuenta.');
    else if (ronda.modo === 'error' && cuadra)
      decir(false, <>Ahora cuadra, pero el gasto diverso debía quedarse en 1.500,00. Arregla la línea del banco, no la del gasto.</>);
    else if (cuadra)
      decir(
        false,
        <>
          Cuadra, pero {nMal === 1 ? 'una línea no es correcta' : `${nMal} líneas no son correctas`} (en rojo). {pistaDe() ?? ronda.ayuda}
        </>,
      );
    else
      decir(
        false,
        <>
          Debe {f2(totales.d)} y Haber {f2(totales.h)}: sobran {f2(Math.abs(totales.d - totales.h))} en el {totales.d > totales.h ? 'Debe' : 'Haber'}. {pistaDe() ?? ronda.ayuda}
        </>,
      );
  };

  return (
    <>
      <div className="tl-asiento">
        <div className="tl-libro" role="table" aria-label="Líneas del asiento">
          <div className="tl-libro-cab" role="row">
            <span role="columnheader">Cuenta</span>
            <span role="columnheader">Nombre</span>
            <span role="columnheader" className="num">
              Debe
            </span>
            <span role="columnheader" className="num">
              Haber
            </span>
          </div>
          {ronda.lineas.map((l, i) => {
            const f = filas[i];
            const celda = (lado: Lado) => {
              const activa = f.lado === lado;
              if (l.pide === 'lado')
                return (
                  <button className={`tl-lado ${activa ? 'on' : ''}`} onClick={() => cambia(i, { lado })} aria-pressed={activa} aria-label={`${lado === 'D' ? 'Debe' : 'Haber'} ${f2(l.importe)}`}>
                    {activa ? f2(l.importe) : lado === 'D' ? 'Debe' : 'Haber'}
                  </button>
                );
              if (!activa) return <span className="tl-vacio" aria-hidden="true" />;
              if (l.pide === 'importe' || l.pide === 'error')
                return (
                  <input
                    className="tl-imp"
                    inputMode="decimal"
                    value={f.importe}
                    placeholder="0,00"
                    aria-label={`${lado === 'D' ? 'Debe' : 'Haber'} de ${l.cuenta}`}
                    onChange={(e) => cambia(i, { importe: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && comprobar()}
                  />
                );
              return <span className="tl-fijo">{f.importe}</span>;
            };
            return (
              <motion.div
                role="row"
                key={`${i}-${sac[i] ?? 0}`}
                className={`tl-libro-fila ${mal[i] ? 'mal' : ''} ${sim.resuelta ? 'bien' : ''}`}
                animate={mal[i] && !sim.reducido && (sac[i] ?? 0) > 0 ? sacude : { x: 0 }}
              >
                <span role="cell" className="tl-cuenta">
                  {l.pide === 'cuenta' ? (
                    <select className="field-input" value={f.cuenta} onChange={(e) => cambia(i, { cuenta: e.target.value })} aria-label={`Cuenta de la línea ${i + 1}`}>
                      <option value="">Elige cuenta…</option>
                      {opcionesCuenta.map((c) => (
                        <option key={c} value={c}>
                          {c} {CUENTAS[c] ?? ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <code>{l.cuenta}</code>
                  )}
                </span>
                <span role="cell" className="tl-nombre">
                  {l.pide === 'cuenta' ? (f.cuenta ? CUENTAS[f.cuenta] ?? '' : '—') : l.nombre}
                </span>
                <span role="cell" className="num tl-col-d" data-et="Debe">
                  {celda('D')}
                </span>
                <span role="cell" className="num tl-col-h" data-et="Haber">
                  {celda('H')}
                </span>
              </motion.div>
            );
          })}
          <div className="tl-libro-tot" role="row">
            <span role="cell">Totales</span>
            <span role="cell" />
            <span role="cell" className="num" data-et="Debe">
              {f2(totales.d)}
            </span>
            <span role="cell" className="num" data-et="Haber">
              {f2(totales.h)}
            </span>
          </div>
        </div>
        <Balanza debe={totales.d} haber={totales.h} reducido={sim.reducido} />
      </div>
      <div className="tl-acciones">
        <button className="btn arc" onClick={comprobar} disabled={sim.resuelta}>
          Comprobar
        </button>
      </div>
      <MensajeVeredicto v={v} />
    </>
  );
}

export default function SimAsiento() {
  const ini = useIni();
  const sim = useSim('asiento', 6);
  const rondas = useMemo(() => construirRondas(ini), [ini, sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const ronda = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Cuadra el asiento"
      color="#8a7be0"
      instruccion="Completa las líneas hasta que Debe y Haber sumen lo mismo y pulsa Comprobar."
      pistas={['Suma la columna del Debe y luego la del Haber. La diferencia es el Cuadre.', 'Lo que gastas o lo que entra va al Debe. El banco que paga y lo que debes van al Haber.', 'El importe que falta es justo la diferencia, en el lado que suma menos.']}
      concepto={
        <>
          <p>
            Un asiento es la anotación contable de algo que ha pasado. Cada línea va a una cuenta y a un lado: el <b>Debe</b> (lo que entra o lo que gastas) o el <b>Haber</b> (de dónde
            sale o lo que debes).
          </p>
          <p>La regla de oro: la suma del Debe tiene que ser igual a la del Haber. Si no, el ERP enseña el Cuadre (la diferencia) y no te deja guardar. La balanza te lo enseña.</p>
        </>
      }
      enunciado={
        <>
          <h3>{ronda.titulo}</h3>
          <p>{ronda.texto}</p>
        </>
      }
    >
      <RondaAsiento key={`${sim.partida}-${sim.ronda}`} ronda={ronda} sim={sim} />
    </Marco>
  );
}
