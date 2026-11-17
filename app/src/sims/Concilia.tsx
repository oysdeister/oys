import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '../components/Icon';
import { conIni } from '../lib/texto';
import './taller-concilia.css';
import { Marco, MensajeVeredicto, azar, f2, pad, useIni, useSim, useVeredicto, type Sim } from './kit';

/* ---------- Modelo ---------- */

interface Regla {
  codigo: string;
  nombre: string;
  /** Referencia de los parámetros de conciliación de la operación financiera */
  referencia: 'No considerar' | 'Documento';
  /** Float de fecha de operación, en días (± alrededor de la fecha) */
  float: number;
  primer: boolean;
  separaComision?: boolean;
}
interface LineaExt {
  id: string;
  dia: number;
  diaValor: number;
  propio: string;
  desc: string;
  ref: string;
  importe: number;
}
interface MovTes {
  id: string;
  dia: number;
  op: string;
  flujo: string;
  doc: string;
  importe: number;
}
type Accion = 'pendiente' | 'cancelar' | 'sinOperacion';
interface Ronda {
  titulo: string;
  texto: string;
  reglas: Regla[];
  lineas: LineaExt[];
  movs: MovTes[];
  acciones: Accion[];
  /** Solución por línea: id de movimiento o «accion:…» */
  sol: Record<string, string>;
  /** Por qué, al acertar (o al fallar con una acción) */
  porQue: Record<string, string>;
}

const ACCION: Record<Accion, { titulo: string; sub: string }> = {
  pendiente: { titulo: 'Dejar pendiente', sub: 'Aún no tiene pareja en tesorería' },
  cancelar: { titulo: 'Cancelar extractos', sub: 'Extorno: un cargo y su abono iguales' },
  sinOperacion: { titulo: 'No concilia', sub: 'Su concepto propio no tiene operación' },
};

const MES = '02-2026';
const fecha = (d: number) => `${pad(d, 2)}-${MES}`;
const signo = (n: number) => (n < 0 ? `−${f2(-n)}` : `+${f2(n)}`);
const cent = (n: number) => Math.round(n * 100) / 100;

/* ---------- Rondas ---------- */

function construirRondas(ini: string): Ronda[] {
  const tr = (n: number) => conIni(`TR{INI}${pad(n, 4)}`, ini);
  const prov = conIni('T{INI} Proveedor', ini);
  const cli = conIni('T{INI} Cliente', ini);
  const PMICDT: Regla = { codigo: 'PMICDT', nombre: 'Pagos emitidos transferencias de crédito', referencia: 'No considerar', float: 0, primer: false };
  const COB = conIni('{INI}COB', ini);
  const COBRO: Regla = { codigo: COB, nombre: 'Cobros de clientes por transferencia', referencia: 'No considerar', float: 0, primer: false };
  const PMIDDT: Regla = { codigo: 'PMIDDT', nombre: 'Recibos domiciliados', referencia: 'No considerar', float: 0, primer: false };

  // 1 · Por importe y posición
  const a = cent(azar(800, 3200) + azar(0, 99) / 100);
  const b = cent(azar(200, 1500) + azar(0, 99) / 100);
  const c = cent(azar(30, 180) + azar(0, 99) / 100);
  const r1: Ronda = {
    titulo: 'Empareja por importe',
    texto: 'Las tres operaciones concilian sin referencia y sin float: basta con que el importe y la posición (entrada o salida) coincidan el mismo día.',
    reglas: [PMICDT, COBRO, PMIDDT],
    lineas: [
      { id: 'l1', dia: 3, diaValor: 3, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(41), importe: -a },
      { id: 'l2', dia: 3, diaValor: 3, propio: '002', desc: `Abono transferencia ${cli}`, ref: '', importe: b },
      { id: 'l3', dia: 3, diaValor: 3, propio: '003', desc: 'Recibo domiciliado suministros', ref: '', importe: -c },
    ],
    movs: [
      { id: 'm1', dia: 3, op: COB, flujo: 'Cobros de clientes', doc: 'FVN026-000031', importe: a },
      { id: 'm2', dia: 3, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(41), importe: -a },
      { id: 'm3', dia: 3, op: 'PMIDDT', flujo: 'Suministros', doc: 'REC-0207', importe: -c },
      { id: 'm4', dia: 3, op: COB, flujo: 'Cobros de clientes', doc: 'FVN026-000030', importe: b },
    ],
    acciones: [],
    sol: { l1: 'm2', l2: 'm4', l3: 'm3' },
    porQue: {
      l1: 'Mismo importe y las dos son salidas: un cargo del banco con un pago de tesorería.',
      l2: 'Un abono del banco (entra dinero) se empareja con un cobro de tesorería del mismo importe.',
      l3: 'Recibo domiciliado: mismo importe y mismo día.',
    },
  };

  // 2 · Float de fecha de operación
  const d = cent(azar(400, 2600) + azar(0, 99) / 100);
  const e = cent(azar(100, 900) + azar(0, 99) / 100);
  const g = cent(azar(50, 400) + azar(0, 99) / 100);
  const PMICDT2: Regla = { ...PMICDT, float: 2 };
  const COBRO2: Regla = { ...COBRO, float: 2 };
  const r2: Ronda = {
    titulo: 'El banco no carga el mismo día',
    texto: 'Ahora las operaciones tienen un float de ±2 días en la fecha de operación: el sistema busca la pareja entre dos días antes y dos días después.',
    reglas: [PMICDT2, COBRO2],
    lineas: [
      { id: 'l1', dia: 5, diaValor: 6, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(57), importe: -d },
      { id: 'l2', dia: 6, diaValor: 6, propio: '002', desc: `Abono transferencia ${cli}`, ref: '', importe: e },
      { id: 'l3', dia: 9, diaValor: 9, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(58), importe: -g },
    ],
    movs: [
      { id: 'm1', dia: 12, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(60), importe: -d },
      { id: 'm2', dia: 3, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(57), importe: -d },
      { id: 'm3', dia: 7, op: COB, flujo: 'Cobros de clientes', doc: 'FVN026-000044', importe: e },
      { id: 'm4', dia: 13, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(58), importe: -g },
    ],
    acciones: ['pendiente'],
    sol: { l1: 'm2', l2: 'm3', l3: 'accion:pendiente' },
    porQue: {
      l1: `Del ${fecha(3)} al ${fecha(5)} hay 2 días: entra en el float. El del ${fecha(12)} tiene el mismo importe, pero se va a 7 días.`,
      l2: 'Un día de diferencia, dentro de ±2.',
      l3: `El único movimiento de ${f2(g)} es del ${fecha(13)}: 4 días, fuera del float de ±2. No concilia todavía: se queda pendiente.`,
    },
  };

  // 3 · Documento y primer registro
  const h = cent(azar(900, 1900) + azar(0, 99) / 100);
  const n = cent(azar(1000, 1800));
  const PMICDT3: Regla = { ...PMICDT, referencia: 'Documento', float: 1 };
  const NOMI: Regla = { codigo: 'PNOMIN', nombre: 'Pagos de nómina', referencia: 'No considerar', float: 0, primer: true };
  const r3: Ronda = {
    titulo: 'Importes repetidos',
    texto:
      'Dos transferencias del mismo importe: su operación concilia por Documento (el número de operación del banco). Y tres cargos de nómina iguales para un solo pago en tesorería: la operación de nómina tiene marcado «Primer registro».',
    reglas: [PMICDT3, NOMI],
    lineas: [
      { id: 'l1', dia: 10, diaValor: 10, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(72), importe: -h },
      { id: 'l2', dia: 10, diaValor: 10, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(71), importe: -h },
      { id: 'l3', dia: 10, diaValor: 10, propio: '016', desc: 'Nómina febrero', ref: 'NOM-01', importe: -n },
      { id: 'l4', dia: 10, diaValor: 10, propio: '016', desc: 'Nómina febrero', ref: 'NOM-02', importe: -n },
      { id: 'l5', dia: 10, diaValor: 10, propio: '016', desc: 'Nómina febrero', ref: 'NOM-03', importe: -n },
    ],
    movs: [
      { id: 'm1', dia: 10, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(71), importe: -h },
      { id: 'm2', dia: 10, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(72), importe: -h },
      { id: 'm3', dia: 10, op: 'PNOMIN', flujo: 'Sueldos y salarios', doc: 'NOM-FEB', importe: -n },
    ],
    acciones: ['pendiente', 'cancelar'],
    sol: { l1: 'm2', l2: 'm1', l3: 'm3', l4: 'accion:pendiente', l5: 'accion:pendiente' },
    porQue: {
      l1: `Por Documento: la referencia ${tr(72)} del extracto es el documento del segundo movimiento, aunque el primero tenga el mismo importe.`,
      l2: `Por Documento: ${tr(71)} con ${tr(71)}.`,
      l3: 'Con «Primer registro», entre varias líneas iguales el sistema se queda con la primera que encuentra.',
      l4: 'El único pago de nómina ya se lo llevó la primera línea. Esta espera a su movimiento: pendiente.',
      l5: 'Igual que la anterior: no queda pareja en tesorería, se queda pendiente.',
    },
  };

  // 4 · Comisión separada, extorno y concepto sin operación
  const k = cent(azar(1500, 4000) + azar(0, 99) / 100);
  const com = elegirComision();
  const ext = cent(azar(20, 90) + azar(0, 99) / 100);
  const cus = cent(azar(5, 30) + azar(0, 99) / 100);
  const PMICDT4: Regla = { ...PMICDT, referencia: 'Documento', float: 1, separaComision: true };
  const r4: Ronda = {
    titulo: 'Comisión, extorno y un concepto sin pareja',
    texto:
      'La cuenta cobra comisión por transferencia y tiene informada la «Operación comisión»: cada pago genera dos movimientos de tesorería, el importe y la comisión. Además el banco ha hecho un extorno y te carga «intereses, comisiones y custodia» (concepto propio 313), que no está en ninguna operación a conciliar.',
    reglas: [PMICDT4],
    lineas: [
      { id: 'l1', dia: 16, diaValor: 16, propio: '099', desc: `Transferencia emitida ${prov}`, ref: tr(90), importe: -k },
      { id: 'l2', dia: 16, diaValor: 16, propio: '017', desc: 'Comisión transferencia', ref: tr(90), importe: -com },
      { id: 'l3', dia: 17, diaValor: 17, propio: '003', desc: 'Adeudo recibo', ref: 'R-5531', importe: -ext },
      { id: 'l4', dia: 17, diaValor: 17, propio: '003', desc: 'Extorno adeudo recibo', ref: 'R-5531', importe: ext },
      { id: 'l5', dia: 18, diaValor: 18, propio: '313', desc: 'Intereses, comisiones y custodia', ref: '', importe: -cus },
    ],
    movs: [
      { id: 'm1', dia: 16, op: 'PMICDT', flujo: 'Comisiones bancarias', doc: tr(90), importe: -com },
      { id: 'm2', dia: 16, op: 'PMICDT', flujo: 'Pagos a proveedores', doc: tr(90), importe: -k },
      { id: 'm3', dia: 24, op: 'PMICDT', flujo: 'Comisiones bancarias', doc: tr(93), importe: -com },
    ],
    acciones: ['pendiente', 'cancelar', 'sinOperacion'],
    sol: { l1: 'm2', l2: 'm1', l3: 'accion:cancelar', l4: 'accion:cancelar', l5: 'accion:sinOperacion' },
    porQue: {
      l1: 'El importe principal con su movimiento: comisión separada quiere decir dos movimientos, y este es el del pago.',
      l2: `La comisión tiene su propio movimiento, con flujo de comisión y el mismo documento ${tr(90)}. El de la comisión del ${fecha(24)} es de otro pago.`,
      l3: 'Un cargo y su extorno del mismo importe se anulan: no van a tesorería. Se cancelan entre ellos con «Cancelar extractos», solo desde el extracto.',
      l4: 'La otra mitad del extorno: también «Cancelar extractos».',
      l5: 'El concepto propio 313 no tiene operación a conciliar ni integración: no hay nada en tesorería con qué casarlo. Para que concilie, enlaza el concepto con una operación de salida (o usa «Generar»).',
    },
  };

  return [r1, r2, r3, r4];
}

function elegirComision() {
  return [2.5, 3.5, 4.75, 6][azar(0, 3)];
}

/* ---------- Por qué no casa una pareja ---------- */

function porQueNo(r: Ronda, l: LineaExt, m: MovTes, usados: Set<string>): string {
  const regla = r.reglas.find((x) => x.codigo === m.op);
  if (usados.has(m.id)) return 'Ese movimiento ya está conciliado con otra línea. Cada movimiento se concilia una sola vez.';
  if (Math.sign(l.importe) !== Math.sign(m.importe))
    return l.importe < 0
      ? 'La línea es un cargo (sale dinero del banco) y el movimiento es una entrada. La posición tiene que coincidir.'
      : 'La línea es un abono (entra dinero) y el movimiento es una salida. La posición tiene que coincidir.';
  if (Math.abs(l.importe - m.importe) > 0.005)
    return `Los importes no coinciden: ${f2(Math.abs(l.importe))} en el extracto y ${f2(Math.abs(m.importe))} en tesorería.${
      regla?.separaComision ? ' Recuerda: con la comisión separada, el pago y la comisión son dos movimientos.' : ''
    }`;
  if (regla?.referencia === 'Documento' && l.ref !== m.doc)
    return `La operación ${m.op} concilia por Documento: la referencia del extracto (${l.ref || 'sin referencia'}) tiene que ser el documento del movimiento (${m.doc}).`;
  const dif = Math.abs(l.dia - m.dia);
  if (dif > (regla?.float ?? 0))
    return `Hay ${dif} ${dif === 1 ? 'día' : 'días'} entre el ${fecha(l.dia)} y el ${fecha(m.dia)}, y el float de ${m.op} es de ±${regla?.float ?? 0}. Fuera de margen.`;
  if (regla?.primer) return 'Con «Primer registro» el movimiento se lo lleva la primera línea que encaja, por orden del extracto. Mira si hay otra igual antes.';
  return r.porQue[l.id] ?? 'No es su pareja.';
}

/* ---------- Ronda ---------- */

type Hecho = { tipo: 'mov'; mov: string; n: number } | { tipo: 'accion'; accion: Accion };

function RondaConcilia({ r, sim }: { r: Ronda; sim: Sim }) {
  const [sel, setSel] = useState<string | null>(r.lineas[0]?.id ?? null);
  const [hechos, setHechos] = useState<Record<string, Hecho>>({});
  const [mal, setMal] = useState<{ id: string; n: number } | null>(null);
  const [v, decir] = useVeredicto();
  const usados = new Set(Object.values(hechos).flatMap((h) => (h.tipo === 'mov' ? [h.mov] : [])));
  const nConc = Object.values(hechos).filter((h) => h.tipo === 'mov').length;
  const linea = r.lineas.find((l) => l.id === sel);

  const resolver = (l: LineaExt, h: Hecho) => {
    const nuevos = { ...hechos, [l.id]: h };
    setHechos(nuevos);
    setMal(null);
    decir(true, r.porQue[l.id]);
    const sig = r.lineas.find((x) => !nuevos[x.id]);
    setSel(sig?.id ?? null);
    if (!sig) sim.acierto();
  };

  const tocaMov = (m: MovTes) => {
    if (!linea || sim.resuelta || hechos[linea.id]) return;
    if (r.sol[linea.id] === m.id) return resolver(linea, { tipo: 'mov', mov: m.id, n: nConc + 1 });
    setMal((x) => ({ id: m.id, n: (x?.n ?? 0) + 1 }));
    const correcta = r.sol[linea.id];
    const motivo = porQueNo(r, linea, m, usados);
    decir(false, correcta.startsWith('accion:') && !usados.has(m.id) && motivo === r.porQue[linea.id] ? `Esta línea no tiene pareja en tesorería. ${r.porQue[linea.id]}` : motivo);
  };

  const tocaAccion = (ac: Accion) => {
    if (!linea || sim.resuelta || hechos[linea.id]) return;
    if (r.sol[linea.id] === `accion:${ac}`) return resolver(linea, { tipo: 'accion', accion: ac });
    setMal((x) => ({ id: ac, n: (x?.n ?? 0) + 1 }));
    const sol = r.sol[linea.id];
    if (!sol.startsWith('accion:')) {
      const m = r.movs.find((x) => x.id === sol);
      decir(false, `Esta línea sí tiene pareja en tesorería: busca un movimiento de ${m ? signo(m.importe) : 'ese importe'} que cumpla los parámetros de su operación.`);
    } else if (ac === 'cancelar') decir(false, '«Cancelar extractos» es para un cargo y su abono del mismo importe en el extracto (un extorno). Esta línea no tiene su contraria.');
    else if (ac === 'sinOperacion') decir(false, 'Su concepto propio sí tiene operación: lo que pasa es otra cosa. Revisa fechas y movimientos.');
    else decir(false, r.porQue[linea.id]);
  };

  return (
    <div className="tc">
      <div className="tc-reglas" aria-label="Parámetros de conciliación">
        {r.reglas.map((g) => (
          <div key={g.codigo} className="tc-regla">
            <b className="tl-mono">{g.codigo}</b>
            <span className="tc-regla-nom">{g.nombre}</span>
            <span className="tc-chip">Referencia: {g.referencia}</span>
            <span className="tc-chip">Float F. operación: ±{g.float} d</span>
            <span className={`tc-chip ${g.primer ? 'on' : 'off'}`}>Primer registro {g.primer ? '✓' : '—'}</span>
            {g.separaComision && <span className="tc-chip on">Operación comisión ✓</span>}
          </div>
        ))}
      </div>

      <div className="tc-mesa">
        <section className="tc-col" aria-label="Extracto bancario">
          <h4>
            <Icon name="asiento" size={16} /> Extracto bancario N43 · BBVACCTRI
          </h4>
          <ul className="tc-lista">
            {r.lineas.map((l) => {
              const h = hechos[l.id];
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    className={`tc-linea ${sel === l.id ? 'sel' : ''} ${h ? 'hecha' : ''}`}
                    onClick={() => !h && setSel(l.id)}
                    aria-pressed={sel === l.id}
                    disabled={!!h}
                  >
                    <span className="tc-fechas">
                      <b>{fecha(l.dia)}</b>
                      <small>valor {fecha(l.diaValor)}</small>
                    </span>
                    <span className="tc-desc">
                      <span>{l.desc}</span>
                      <small>
                        Concepto propio {l.propio}
                        {l.ref ? ` · ref. ${l.ref}` : ''}
                      </small>
                    </span>
                    <span className={`tc-imp ${l.importe < 0 ? 'neg' : 'pos'}`}>{signo(l.importe)}</span>
                    <AnimatePresence>
                      {h && (
                        <motion.span className={`tc-sello ${h.tipo === 'mov' ? 'ok' : h.accion}`} initial={sim.reducido ? false : { scale: 2.4, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: -8 }}>
                          {h.tipo === 'mov' ? `Conciliado nº ${h.n}` : h.accion === 'pendiente' ? 'Pendiente' : h.accion === 'cancelar' ? 'Cancelado' : 'Sin operación'}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="tc-col" aria-label="Movimientos de tesorería pendientes">
          <h4>
            <Icon name="cartera" size={16} /> Tesorería pendiente de conciliar
          </h4>
          <ul className="tc-lista">
            {r.movs.map((m) => {
              const n = Object.values(hechos).find((h) => h.tipo === 'mov' && h.mov === m.id) as { n: number } | undefined;
              return (
                <li key={m.id}>
                  <motion.button
                    key={`${m.id}-${mal?.id === m.id ? mal.n : 0}`}
                    type="button"
                    className={`tc-mov ${n ? 'hecha' : ''} ${mal?.id === m.id ? 'mal' : ''}`}
                    onClick={() => tocaMov(m)}
                    disabled={!linea || !!n || sim.resuelta}
                    animate={mal?.id === m.id && !sim.reducido ? { x: [0, -8, 7, -5, 3, 0] } : { x: 0 }}
                  >
                    <span className="tc-fechas">
                      <b>{fecha(m.dia)}</b>
                      <small className="tl-mono">{m.op}</small>
                    </span>
                    <span className="tc-desc">
                      <span>{m.flujo}</span>
                      <small>Documento {m.doc}</small>
                    </span>
                    <span className={`tc-imp ${m.importe < 0 ? 'neg' : 'pos'}`}>{signo(m.importe)}</span>
                    {n && <span className="tc-sello ok">nº {n.n}</span>}
                  </motion.button>
                </li>
              );
            })}
          </ul>
          {r.acciones.length > 0 && (
            <div className="tc-acciones" role="group" aria-label="Si la línea no tiene pareja">
              {r.acciones.map((ac) => (
                <motion.button
                  key={`${ac}-${mal?.id === ac ? mal.n : 0}`}
                  type="button"
                  className={`tc-accion ${mal?.id === ac ? 'mal' : ''}`}
                  onClick={() => tocaAccion(ac)}
                  disabled={!linea || sim.resuelta}
                  animate={mal?.id === ac && !sim.reducido ? { x: [0, -8, 7, -5, 3, 0] } : { x: 0 }}
                >
                  <b>{ACCION[ac].titulo}</b>
                  <small>{ACCION[ac].sub}</small>
                </motion.button>
              ))}
            </div>
          )}
        </section>
      </div>
      <p className="tl-pregunta tc-pregunta">
        {linea ? (
          <>
            Línea seleccionada: <b>{linea.desc}</b> {signo(linea.importe)}. Toca su movimiento de tesorería{r.acciones.length ? ' o qué hacer con ella' : ''}.
          </>
        ) : (
          'Todas las líneas del extracto están resueltas.'
        )}
      </p>
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimConcilia() {
  const ini = useIni();
  const sim = useSim('concilia', 4);
  const rondas = useMemo(() => construirRondas(ini), [ini, sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Concilia el extracto"
      color="#1f8fb3"
      instruccion="Elige una línea del extracto y toca su movimiento de tesorería, o qué hacer si no tiene pareja."
      pistas={[
        'Primero, importe y posición: un cargo del banco casa con una salida de tesorería, un abono con una entrada.',
        'Mira los parámetros de la operación del movimiento: si dice Documento, la referencia del extracto tiene que ser su documento; el float dice cuántos días de margen hay.',
        'Si no hay pareja dentro de esas reglas: pendiente; si es un cargo y su abono iguales, cancelar extractos; si el concepto propio no tiene operación, no concilia.',
      ]}
      concepto={
        <>
          <p>
            Conciliar es casar cada línea del <b>extracto del banco</b> (el fichero N43 que cargas en Extractos bancarios) con su <b>movimiento de tesorería</b>. Al conciliarlas, las dos quedan marcadas
            como conciliadas y se enlazan con un número.
          </p>
          <p>
            Cada operación financiera tiene sus <b>parámetros de conciliación</b>: por referencia (No considerar = solo importe; Documento = el número de operación), el <b>float</b> de días de margen y el{' '}
            <b>Primer registro</b> para importes repetidos.
          </p>
        </>
      }
      enunciado={
        <>
          <h3>{r.titulo}</h3>
          <p>{r.texto}</p>
        </>
      }
    >
      <RondaConcilia key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />
    </Marco>
  );
}
