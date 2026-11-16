import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, Reorder } from 'framer-motion';
import { Icon } from '../components/Icon';
import { conIni } from '../lib/texto';
import { Marco, MensajeVeredicto, azar, datosSim, elige, pad, txt, useIni, useSim, useVeredicto, type Sim } from './kit';

type Clave = 'e' | 's' | '6n' | '4n' | 'a';
interface Ficha {
  id: number;
  k: Clave | 'txt';
  t?: string;
}
interface Ctx {
  empresa: string;
  serie: string;
  anio: string;
  contador: number;
}
interface RondaMascara {
  tipo: 'mascara';
  titulo: string;
  texto: string;
  ctx: Ctx;
  mascara: (Clave | string)[]; // claves o texto fijo
  rotura: Clave[];
  porQueRotura: string;
}
interface RondaError {
  tipo: 'error';
  mensaje: string;
  funcion: string;
  tabla: string;
  serie: string;
  manual: string;
}
type Ronda = RondaMascara | RondaError;

const TECLAS: { k: Clave; nombre: string; ej: (c: Ctx) => string }[] = [
  { k: 'e', nombre: 'empresa', ej: (c) => c.empresa },
  { k: 's', nombre: 'serie', ej: (c) => c.serie },
  { k: '6n', nombre: 'contador de 6 cifras', ej: (c) => pad(c.contador, 6) },
  { k: '4n', nombre: 'contador de 4 cifras', ej: (c) => pad(c.contador, 4) },
  { k: 'a', nombre: 'año (2 cifras)', ej: (c) => c.anio },
];
const ROTURAS: { k: Clave; nombre: string }[] = [
  { k: 'e', nombre: 'empresa' },
  { k: 's', nombre: 'serie' },
  { k: 'a', nombre: 'año' },
];
const CLAVES = TECLAS.map((t) => t.k) as string[];

const codigo = (f: Ficha) => (f.k === 'txt' ? f.t ?? '' : `#${f.k}`);
function pinta(f: Ficha, c: Ctx) {
  if (f.k === 'txt') return f.t ?? '';
  return TECLAS.find((t) => t.k === f.k)!.ej(c);
}
const numero = (fs: Ficha[], c: Ctx) => fs.map((f) => pinta(f, c)).join('');
const esperado = (r: RondaMascara, c: Ctx) =>
  r.mascara.map((m) => (CLAVES.includes(m) ? TECLAS.find((t) => t.k === m)!.ej(c) : m)).join('');

function construirRondas(): Ronda[] {
  const n = datosSim('maestros').numerador;
  const d = (typeof n === 'object' && n !== null ? n : {}) as Record<string, unknown>;
  const plantillas: { mascara: (Clave | string)[]; rotura: Clave[]; por: string }[] = [
    { mascara: ['e', 's', '6n'], rotura: ['e', 's'], por: 'Cada empresa y serie llevan su propio contador, sin reiniciar por año.' },
    { mascara: ['s', 'a', '-', '4n'], rotura: ['s', 'a'], por: 'El contador vuelve a empezar cada año en cada serie.' },
    { mascara: ['e', '-', 's', '/', '6n'], rotura: ['e', 's'], por: 'Un contador por empresa y serie.' },
  ];
  const p = elige(plantillas);
  const ctxVar: Ctx = { empresa: elige(['DIS', 'OYS', '0']), serie: elige(['PV', 'AV', 'OC', 'SC', 'FV']), anio: elige(['26', '27']), contador: azar(2, 480) };
  return [
    {
      tipo: 'mascara',
      titulo: 'Pedido de compra DISPC000001',
      texto: 'Empresa DIS, serie PC. Queremos DISPC000001, DISPC000002… con un contador por empresa y serie, sin año.',
      ctx: { empresa: 'DIS', serie: 'PC', anio: '26', contador: 1 },
      mascara: ['e', 's', '6n'],
      rotura: ['e', 's'],
      porQueRotura: 'El contador es por empresa y serie, no por año: así está en gsernumh (rotura #e#s).',
    },
    {
      tipo: 'mascara',
      titulo: 'Albarán de compra 0AC000011',
      texto: 'Empresa 0, serie AC. El contador de esta serie va por el 11. Haz que salga 0AC000011.',
      ctx: { empresa: '0', serie: 'AC', anio: '26', contador: 11 },
      mascara: ['e', 's', '6n'],
      rotura: ['e', 's'],
      porQueRotura: 'Los albaranes de la empresa 0 y los de DIS no comparten contador: la rotura lleva empresa y serie.',
    },
    {
      tipo: 'mascara',
      titulo: 'Factura de venta 0FV000002',
      texto: 'Empresa 0, serie FV. Segunda factura de venta: 0FV000002.',
      ctx: { empresa: '0', serie: 'FV', anio: '26', contador: 2 },
      mascara: ['e', 's', '6n'],
      rotura: ['e', 's'],
      porQueRotura: 'Ventas usa el mismo criterio que compras: rotura #e#s y máscara #e#s#6n.',
    },
    {
      tipo: 'mascara',
      titulo: 'Asiento EA26-000001',
      texto: 'Serie EA, año 26. Queremos EA26-000001 y que el contador vuelva a 1 cada año. Aquí no hace falta la empresa. Añade el guion como texto fijo.',
      ctx: { empresa: '0', serie: 'EA', anio: '26', contador: 1 },
      mascara: ['s', 'a', '-', '6n'],
      rotura: ['s', 'a'],
      porQueRotura: 'Para reiniciar por año, el año tiene que estar en la rotura: así cada año tiene su propio contador.',
    },
    {
      tipo: 'mascara',
      titulo: 'Variación',
      texto: `Empresa ${ctxVar.empresa}, serie ${ctxVar.serie}, año ${ctxVar.anio}, el contador va por el ${ctxVar.contador}. ${p.por}`,
      ctx: ctxVar,
      mascara: p.mascara,
      rotura: p.rotura,
      porQueRotura: p.por,
    },
    {
      tipo: 'error',
      mensaje: txt(d.mensajeError, 'gsernumh_getserie: Sin máscara. Tab.[geanmovh] Cod.[MOV]'),
      funcion: txt(d.funcion, 'gsernumh_getserie'),
      tabla: txt(d.tabla, 'geanmovh'),
      serie: txt(d.serie, 'MOV'),
      manual: txt(d.numeroManual, '{INI}000001'),
    },
  ];
}

/* ---------- Ronda de máscara ---------- */

let sec = 1;

function RondaMasc({ r, sim }: { r: RondaMascara; sim: Sim }) {
  const [fichas, setFichas] = useState<Ficha[]>([]);
  const [rotura, setRotura] = useState<Clave[]>([]);
  const [texto, setTexto] = useState('');
  const [v, decir] = useVeredicto();
  const ranura = useRef<HTMLDivElement>(null);
  const arrastrando = useRef(false);
  const objetivo = esperado(r, r.ctx);
  const sale = numero(fichas, r.ctx);
  const mas = (k: Ficha['k'], t?: string) => setFichas((fs) => [...fs, { id: sec++, k, t }]);

  const soltar = (k: Clave, p: { x: number; y: number }) => {
    const box = ranura.current?.getBoundingClientRect();
    if (box && p.x >= box.left && p.x <= box.right && p.y >= box.top - 20 && p.y <= box.bottom + 20) mas(k);
  };

  const comprobar = () => {
    const mio = fichas.map(codigo).join('');
    const bueno = r.mascara.map((m) => (CLAVES.includes(m) ? `#${m}` : m)).join('');
    const rotOk = [...rotura].sort().join() === [...r.rotura].sort().join();
    if (!fichas.length) return decir(false, 'Pon al menos una ficha en la máscara: tócalas o arrástralas al hueco.');
    if (sale !== objetivo) return decir(false, <>Sale <b>{sale || '(nada)'}</b> y buscas <b>{objetivo}</b>. Mira qué trozo sobra o falta.</>);
    if (mio !== bueno) {
      const fijos = fichas.filter((f) => f.k === 'txt' && f.t && f.t.length > 1).map((f) => f.t);
      return decir(
        false,
        <>
          Hoy sale bien, pero has escrito {fijos.length ? <b>«{fijos.join('», «')}»</b> : 'un trozo'} como texto fijo. Si mañana cambia la empresa, la serie o el contador, el número saldría mal. Usa las
          fichas # para lo que cambia.
        </>,
      );
    }
    if (!rotOk)
      return decir(
        false,
        <>
          La máscara está bien. Falla la rotura: {r.porQueRotura} Marca {r.rotura.map((k) => `#${k}`).join(' + ')}.
        </>,
      );
    decir(
      true,
      <>
        Rotura <code>{r.rotura.map((k) => `#${k}`).join('')}</code> y máscara <code>{bueno}</code>. Los siguientes serán {numero(fichas, { ...r.ctx, contador: r.ctx.contador + 1 })} y{' '}
        {numero(fichas, { ...r.ctx, contador: r.ctx.contador + 2 })}.
      </>,
    );
    sim.acierto();
  };

  const chars = sale.split('');
  return (
    <div className="tl-num">
      <div className="tl-num-pantalla" aria-live="polite">
        <span className="tl-num-obj">
          Objetivo <b>{objetivo}</b>
        </span>
        <div className={`tl-num-lcd ${sale === objetivo ? 'ok' : ''}`} aria-label={`Número resultante: ${sale || 'vacío'}`}>
          <AnimatePresence initial={false}>
            {chars.length ? (
              chars.map((c, i) => (
                <motion.span key={`${i}-${c}`} initial={sim.reducido ? false : { y: -18, opacity: 0, rotateX: 90 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} exit={{ opacity: 0 }}>
                  {c}
                </motion.span>
              ))
            ) : (
              <span className="tl-num-cursor">_</span>
            )}
          </AnimatePresence>
        </div>
        <span className="tl-num-ctx">
          empresa <b>{r.ctx.empresa}</b> · serie <b>{r.ctx.serie}</b> · año <b>{r.ctx.anio}</b> · contador <b>{r.ctx.contador}</b>
        </span>
      </div>

      <div className="tl-campo">
        <div className="tl-campo-et">
          <b>Numerador</b> (máscara)
          <code>{fichas.map(codigo).join('') || '—'}</code>
        </div>
        <div ref={ranura} className={`mask-slot tl-ranura ${fichas.length ? '' : 'vacia'}`}>
          {fichas.length === 0 && <span className="muted small">Toca o arrastra aquí las fichas</span>}
          <Reorder.Group as="div" axis="x" values={fichas} onReorder={setFichas} className="tl-ranura-in">
            {fichas.map((f) => (
              <Reorder.Item as="div" key={f.id} value={f} className={`tl-ficha-puesta ${f.k === 'txt' ? 'fijo' : ''}`} whileDrag={{ scale: 1.1, zIndex: 2 }}>
                <span>{codigo(f)}</span>
                <button onClick={() => setFichas((fs) => fs.filter((x) => x.id !== f.id))} aria-label={`Quitar ${codigo(f)}`}>
                  ×
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      </div>

      <div className="tl-teclado" role="group" aria-label="Fichas de la máscara">
        {TECLAS.map((t) => (
          <motion.button
            key={t.k}
            className="tl-tecla"
            drag
            dragSnapToOrigin
            dragMomentum={false}
            style={{ rotateX: 18 }}
            whileHover={sim.reducido ? undefined : { rotateX: 8, y: -2 }}
            whileDrag={{ scale: 1.14, rotate: -4, rotateX: 0, zIndex: 5 }}
            whileTap={{ y: 5, rotateX: 0 }}
            onDragStart={() => (arrastrando.current = true)}
            onDragEnd={(_, info) => {
              soltar(t.k, info.point.x !== undefined ? { x: info.point.x - window.scrollX, y: info.point.y - window.scrollY } : { x: -1, y: -1 });
              setTimeout(() => (arrastrando.current = false), 80);
            }}
            onClick={() => {
              if (arrastrando.current) return;
              mas(t.k);
            }}
            aria-label={`Añadir #${t.k}, ${t.nombre}`}
          >
            <b>#{t.k}</b>
            <small>{t.nombre}</small>
          </motion.button>
        ))}
        {['-', '/'].map((c) => (
          <button key={c} className="tl-tecla fija" onClick={() => mas('txt', c)} aria-label={`Añadir el texto fijo ${c}`}>
            <b>{c}</b>
            <small>texto fijo</small>
          </button>
        ))}
      </div>
      <form
        className="tl-texto-fijo"
        onSubmit={(e) => {
          e.preventDefault();
          if (texto.trim()) mas('txt', texto.trim().toUpperCase());
          setTexto('');
        }}
      >
        <input className="field-input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Otro texto fijo" maxLength={6} aria-label="Texto fijo" />
        <button className="btn ghost sm" type="submit">
          Añadir texto
        </button>
        <button className="btn ghost sm" type="button" onClick={() => setFichas((fs) => fs.slice(0, -1))} disabled={!fichas.length}>
          Borrar última
        </button>
      </form>

      <div className="tl-campo">
        <div className="tl-campo-et">
          <b>Rotura</b> · ¿con qué empieza un contador nuevo?
          <code>{rotura.map((k) => `#${k}`).join('') || '—'}</code>
        </div>
        <div className="tl-rotura">
          {ROTURAS.map((x) => {
            const on = rotura.includes(x.k);
            return (
              <button key={x.k} className={`tl-tecla mini ${on ? 'on' : ''}`} aria-pressed={on} onClick={() => setRotura((rs) => (on ? rs.filter((k) => k !== x.k) : [...rs, x.k]))}>
                <b>#{x.k}</b>
                <small>{x.nombre}</small>
              </button>
            );
          })}
        </div>
        <p className="small muted tl-nota">
          {rotura.length
            ? `Habrá un contador distinto por cada ${rotura.map((k) => ROTURAS.find((x) => x.k === k)!.nombre).join(' + ')}.`
            : 'Sin rotura habría un solo contador para todo.'}
        </p>
      </div>

      <div className="tl-acciones">
        <button className="btn arc" onClick={comprobar} disabled={sim.resuelta}>
          Comprobar
        </button>
      </div>
      <MensajeVeredicto v={v} />
    </div>
  );
}

/* ---------- Ronda del error «Sin máscara» ---------- */

function RondaErr({ r, sim }: { r: RondaError; sim: Sim }) {
  const ini = useIni();
  const [paso, setPaso] = useState(0);
  const [v, decir] = useVeredicto();
  const trozos = useMemo(() => {
    const m = r.mensaje;
    const marcas = [r.funcion, 'Sin máscara', r.tabla, r.serie];
    const res: { t: string; id: string | null }[] = [];
    let i = 0;
    while (i < m.length) {
      const hit = marcas.map((x) => ({ x, p: m.indexOf(x, i) })).filter((h) => h.p >= 0).sort((a, b) => a.p - b.p)[0];
      if (!hit) {
        res.push({ t: m.slice(i), id: null });
        break;
      }
      if (hit.p > i) res.push({ t: m.slice(i, hit.p), id: null });
      res.push({ t: hit.x, id: hit.x });
      i = hit.p + hit.x.length;
    }
    return res;
  }, [r]);
  const preguntas: { q: string; resp: string; bien: string }[] = [
    { q: '¿Qué tabla intenta numerar? Toca su código en el mensaje.', resp: r.tabla, bien: `${r.tabla} son los movimientos internos de almacén.` },
    { q: '¿Qué serie no tiene máscara? Tócala.', resp: r.serie, bien: `La serie ${r.serie} no tiene máscara en el numerador (gsernumh), así que el ERP no sabe fabricar el número.` },
  ];
  const opciones = [
    { t: conIni(`Teclear el número a mano (${r.manual}) para seguir en TUTORIAL y pedir que configuren la máscara de la serie ${r.serie} en el numerador`, ini), ok: true },
    { t: 'Guardar varias veces hasta que salga un número', ok: false },
    { t: 'Cambiar la empresa del documento para que use otra serie', ok: false },
  ];
  const opcionesOrden = useMemo(() => [...opciones].sort(() => Math.random() - 0.5), []); // eslint-disable-line react-hooks/exhaustive-deps

  const toca = (id: string | null) => {
    if (paso >= preguntas.length || !id) return;
    if (id === preguntas[paso].resp) {
      decir(true, preguntas[paso].bien);
      setPaso((p) => p + 1);
    } else decir(false, id === r.funcion ? `${r.funcion} es la función que fabrica el número; no es la tabla ni la serie.` : 'Ese trozo no es. Vuelve a leer el mensaje: Tab. es la tabla y Cod. la serie.');
  };

  return (
    <div className="tl-err">
      <h3>El error «Sin máscara»</h3>
      <p>Al guardar un movimiento interno, el ERP te enseña este mensaje. Léelo como lo haría un consultor.</p>
      <div className="tl-consola" role="group" aria-label="Mensaje de error">
        <span className="tl-consola-pre">!</span>
        {trozos.map((t, i) =>
          t.id ? (
            <button key={i} className={`tl-trozo ${paso > 0 && t.id === r.tabla ? 'ok' : ''} ${paso > 1 && t.id === r.serie ? 'ok' : ''}`} onClick={() => toca(t.id)} disabled={paso >= preguntas.length}>
              {t.t}
            </button>
          ) : (
            <span key={i}>{t.t}</span>
          ),
        )}
      </div>
      {paso < preguntas.length ? (
        <p className="tl-pregunta">
          <Icon name="flecha" size={18} /> {preguntas[paso].q}
        </p>
      ) : (
        <div className="tl-opciones">
          <p className="tl-pregunta">
            <Icon name="flecha" size={18} /> ¿Qué haces?
          </p>
          {opcionesOrden.map((o) => (
            <button
              key={o.t}
              className="quiz-opt tl-opt"
              disabled={sim.resuelta}
              onClick={() => {
                if (o.ok) {
                  decir(true, 'Eso es. Sin máscara no hay número automático: en la demo lo tecleas tú y, en un cliente real, se configura la máscara de la serie.');
                  sim.acierto();
                } else decir(false, 'Así el error volverá a salir: la serie sigue sin máscara.');
              }}
            >
              {o.t}
            </button>
          ))}
        </div>
      )}
      <MensajeVeredicto v={v} />
    </div>
  );
}

export default function SimNumerador() {
  const sim = useSim('numerador', 6);
  const rondas = useMemo(() => construirRondas(), [sim.partida]); // eslint-disable-line react-hooks/exhaustive-deps
  const r = rondas[sim.ronda] ?? rondas[0];
  return (
    <Marco
      sim={sim}
      titulo="Construye la máscara del numerador"
      color="#6c8fd6"
      concepto={
        <>
          <p>
            Cada documento (pedido, albarán, factura) recibe su número del <b>numerador</b> (gsernumh). Tiene dos campos: la <b>máscara</b> dice cómo se escribe el número, y la{' '}
            <b>rotura</b> dice cuándo empieza un contador nuevo.
          </p>
          <p>
            Las fichas con # se sustituyen por datos del documento: <code>#e</code> empresa, <code>#s</code> serie, <code>#6n</code> el contador con 6 cifras. Con rotura <code>#e#s</code> y máscara{' '}
            <code>#e#s#6n</code>, la empresa DIS y la serie PC dan DISPC000001.
          </p>
        </>
      }
      enunciado={
        r.tipo === 'mascara' ? (
          <>
            <h3>{r.titulo}</h3>
            <p>{r.texto}</p>
          </>
        ) : undefined
      }
    >
      {r.tipo === 'mascara' ? <RondaMasc key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} /> : <RondaErr key={`${sim.partida}-${sim.ronda}`} r={r} sim={sim} />}
    </Marco>
  );
}
