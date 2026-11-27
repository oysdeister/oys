import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { useProgreso } from '../../lib/progress';
import { GUIAS, esSlugPrevia, fmtPct, registrarIntento, usePrevia, type SlugPrevia } from '../../lib/previa';
import {
  N_PREGUNTAS,
  codigoCert,
  drawQuestions,
  fmt,
  parseNum,
  type DefExamenPrevio,
  type EjercicioPrevio,
  type PreguntaSorteada,
} from '../../content/previa/examen-comun';
import { EXAMEN_CONTABILIDAD } from '../../content/previa/examen-contabilidad';
import { EXAMEN_ERP } from '../../content/previa/examen-erp';
import './previa.css';

const DEFS: Record<SlugPrevia, DefExamenPrevio> = { contabilidad: EXAMEN_CONTABILIDAD, erp: EXAMEN_ERP };

/** Examen de una guía de la formación previa (misma lógica que el examen HTML original) */
export default function ExamenPrevio() {
  const { guia } = useParams();
  if (!esSlugPrevia(guia)) return <Navigate to="/formacion" replace />;
  return <Examen key={guia} def={DEFS[guia]} />;
}

type Fase = 'inicio' | 'examen' | 'resultado';
interface CampoCorregido {
  raw: string;
  ok: boolean;
}
interface Resultado {
  pts: number;
  tot: number;
  pct: number;
  pass: boolean;
  byB: Record<string, { ok: number; t: number }>;
  date: Date;
  code: string;
  ansQ: (number | null)[];
  campos: CampoCorregido[][];
}
interface Confirmacion {
  msg: string;
  label: string;
  fn: () => void;
}

/** Separa «Nombre Apellidos» del alumno de la plataforma */
function partirNombre(completo: string): [string, string] {
  const t = completo.trim().split(/\s+/).filter(Boolean);
  if (!t.length) return ['', ''];
  return [t[0], t.slice(1).join(' ')];
}

function Examen({ def }: { def: DefExamenPrevio }) {
  const slug = def.slug;
  const info = GUIAS[slug];
  const p = useProgreso();
  const previa = usePrevia();
  const hist = previa.examenes[slug];
  const [nom0, ape0] = partirNombre(p.alumno.nombre);

  const [fase, setFase] = useState<Fase>('inicio');
  const [nomEsc, setNom] = useState<string | null>(null);
  const [apeEsc, setApe] = useState<string | null>(null);
  const [errNom, setErrNom] = useState('');
  const [errApe, setErrApe] = useState('');
  const [qs, setQs] = useState<PreguntaSorteada[]>([]);
  const [ex, setEx] = useState<EjercicioPrevio[]>([]);
  const [respQ, setRespQ] = useState<(number | null)[]>([]);
  const [respE, setRespE] = useState<string[][]>([]);
  const [confirm, setConfirm] = useState<Confirmacion | null>(null);
  const [res, setRes] = useState<Resultado | null>(null);
  const [filtro, setFiltro] = useState<'all' | 'ko'>('all');
  const [certMsg, setCertMsg] = useState('');
  const refNom = useRef<HTMLInputElement>(null);
  const refApe = useRef<HTMLInputElement>(null);
  const refSi = useRef<HTMLButtonElement>(null);

  // Nombre y apellidos: los del alumno de la plataforma mientras no se escriban otros
  const nom = nomEsc ?? nom0;
  const ape = apeEsc ?? ape0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fase]);
  useEffect(() => {
    if (confirm) refSi.current?.focus();
  }, [confirm]);

  // Puntos totales y mínimo para aprobar (25 preguntas + campos de los ejercicios)
  const reglas = useMemo(() => {
    const ejs = def.genExercises();
    const campos = ejs.reduce((s, e) => s + e.f.length, 0);
    const tot = N_PREGUNTAS + campos;
    return { ejercicios: ejs.length, campos, tot, need: Math.ceil(tot * 0.7) };
  }, [def]);

  const nuevoExamen = () => {
    const q = drawQuestions(def.bank);
    const e = def.genExercises();
    setQs(q);
    setEx(e);
    setRespQ(q.map(() => null));
    setRespE(e.map((x) => x.f.map(() => '')));
    setConfirm(null);
    setRes(null);
    setFiltro('all');
    setCertMsg('');
  };

  const totalFields = qs.length + ex.reduce((s, e) => s + e.f.length, 0);
  const answered = respQ.filter((r) => r !== null).length + respE.reduce((s, fila) => s + fila.filter((v) => String(v).trim() !== '').length, 0);

  const empezar = (ev: FormEvent) => {
    ev.preventDefault();
    const n = nom.trim();
    const a = ape.trim();
    const okN = n.length >= 2;
    const okA = a.length >= 2;
    setErrNom(okN ? '' : 'Escribe tu nombre.');
    setErrApe(okA ? '' : 'Escribe tus apellidos.');
    if (!okN) return refNom.current?.focus();
    if (!okA) return refApe.current?.focus();
    setNom(n);
    setApe(a);
    nuevoExamen();
    setFase('examen');
  };

  const grade = (): Resultado => {
    const byB: Record<string, { ok: number; t: number }> = {};
    Object.keys(def.bloques).forEach((k) => {
      byB[k] = { ok: 0, t: 0 };
    });
    let pts = 0;
    let tot = 0;
    const ansQ = qs.map((x, k) => {
      const q = def.bank[x.i];
      const ans = respQ[k];
      const ok = ans === q.a;
      tot++;
      byB[q.b].t++;
      if (ok) {
        pts++;
        byB[q.b].ok++;
      }
      return ans;
    });
    const campos = ex.map((e, k) =>
      e.f.map((f, j) => {
        const raw = respE[k]?.[j] ?? '';
        let ok: boolean;
        if (e.kind === 'sel') ok = raw === f.v;
        else {
          const n = parseNum(raw);
          ok = isFinite(n) && Math.abs(n - Number(f.v)) <= (f.tol ?? 0) + 1e-9;
        }
        tot++;
        byB[e.b].t++;
        if (ok) {
          pts++;
          byB[e.b].ok++;
        }
        return { raw, ok };
      }),
    );
    const pct = Math.round((pts / tot) * 1000) / 10;
    return { pts, tot, pct, pass: pts >= Math.ceil(tot * 0.7), byB, date: new Date(), code: codigoCert(def.prefijoCodigo, nom, ape), ansQ, campos };
  };

  const finalizar = () => {
    const go = () => {
      const r = grade();
      setRes(r);
      setConfirm(null);
      registrarIntento(slug, { pct: r.pct, pts: r.pts, tot: r.tot, aprobado: r.pass, fecha: r.date.toISOString(), codigo: r.code });
      setFase('resultado');
    };
    if (answered < totalFields)
      setConfirm({
        msg: `Tienes ${totalFields - answered} respuestas en blanco y contarán como fallo. ¿Finalizar igualmente?`,
        label: 'Finalizar',
        fn: go,
      });
    else go();
  };

  const borrar = () =>
    setConfirm({
      msg: 'Se borrarán todas tus respuestas. Las preguntas no cambian.',
      label: 'Borrar respuestas',
      fn: () => {
        setRespQ(qs.map(() => null));
        setRespE(ex.map((x) => x.f.map(() => '')));
        setConfirm(null);
        window.scrollTo(0, 0);
      },
    });

  const regenerar = () =>
    setConfirm({
      msg: 'Se descartará este examen y se generará otro con preguntas y cifras nuevas.',
      label: 'Generar examen nuevo',
      fn: () => {
        nuevoExamen();
        window.scrollTo(0, 0);
      },
    });

  const fechaLarga = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  const descargarCert = async () => {
    setCertMsg('');
    const r = res;
    if (!r) return;
    let jsPDF: typeof import('jspdf').jsPDF;
    try {
      jsPDF = (await import('jspdf')).jsPDF;
    } catch {
      setCertMsg('No se ha podido generar el PDF. Guarda una captura de este recuadro.');
      return;
    }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W = 297;
    const H = 210;
    doc.setDrawColor(13, 92, 76);
    doc.setLineWidth(1.2);
    doc.rect(12, 12, W - 24, H - 24);
    doc.setLineWidth(0.3);
    doc.rect(16, 16, W - 32, H - 32);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(13, 92, 76);
    doc.setFontSize(11);
    doc.text('FORMACIÓN FUNCIONAL · ERP AXIONAL', W / 2, 38, { align: 'center' });
    doc.setTextColor(21, 33, 44);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.text('Certificado de superación', W / 2, 58, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(13);
    doc.text('Se certifica que', W / 2, 78, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text(nom + ' ' + ape, W / 2, 94, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(21, 33, 44);
    doc.setFontSize(13);
    doc.text('ha superado la evaluación del curso «' + def.cert.curso + '»', W / 2, 118, { align: 'center' });
    doc.text('con una calificación de ' + fmt(r.pct, 1) + ' % (' + r.pts + ' de ' + r.tot + ' puntos; mínimo para aprobar: 70 %).', W / 2, 127, { align: 'center' });
    doc.setDrawColor(214, 221, 227);
    doc.line(60, 150, W - 60, 150);
    doc.setFontSize(10.5);
    doc.setTextColor(86, 101, 111);
    doc.text('Fecha: ' + fechaLarga(r.date), 70, 160);
    doc.text('Código: ' + r.code, W - 70, 160, { align: 'right' });
    doc.text(def.cert.contenidos[0], W / 2, 174, { align: 'center' });
    doc.text(def.cert.contenidos[1], W / 2, 180, { align: 'center' });
    const file =
      def.cert.fichero +
      ' - ' +
      (nom + ' ' + ape)
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^A-Za-z0-9 .-]/g, '')
        .replace(/\s+/g, ' ')
        .trim() +
      '.pdf';
    try {
      const url = URL.createObjectURL(doc.output('blob'));
      const a = document.createElement('a');
      a.href = url;
      a.download = file;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.remove();
      }, 4000);
      setCertMsg('Certificado descargado.');
    } catch {
      setCertMsg('No se ha podido descargar. Guarda una captura de este recuadro.');
    }
  };

  const etiquetaSel = (v: string | number) => {
    const o = def.clasifOpt.find((x) => x[0] === v);
    return o ? o[1] : 'sin responder';
  };

  const cabecera = (
    <header className="top">
      <p className="kicker">Antes de empezar con Axional · Apartado {info.orden}</p>
      <h1>{def.h1}</h1>
      <p className="lead">{def.lead}</p>
    </header>
  );

  const cajaConfirm = confirm && (
    <div className="confirm" role="alertdialog" aria-label="Confirmación">
      <span style={{ marginRight: 'auto' }}>{confirm.msg}</span>
      <button type="button" className="pv-btn danger" ref={refSi} onClick={confirm.fn}>
        {confirm.label}
      </button>
      <button type="button" className="pv-btn" onClick={() => setConfirm(null)}>
        Cancelar
      </button>
    </div>
  );

  return (
    <div className="pv-examen">
      <Link className="pv-volver" to={`/formacion/${slug}`}>
        ← Volver a la guía «{info.guia}»
      </Link>
      {cabecera}

      {fase === 'inicio' && (
        <div>
          <div className="rules">
            <div>
              <b>{N_PREGUNTAS}</b>
              <span>preguntas tipo test</span>
            </div>
            <div>
              <b>{reglas.ejercicios}</b>
              <span>ejercicios con cifras</span>
            </div>
            <div>
              <b>{reglas.tot}</b>
              <span>puntos en total</span>
            </div>
            <div>
              <b>70 %</b>
              <span>para aprobar ({reglas.need} puntos)</span>
            </div>
          </div>
          {hist.mejor && (
            <p className="previo">
              Ya lo has hecho {hist.intentos} {hist.intentos === 1 ? 'vez' : 'veces'}. Tu mejor nota: <b>{fmtPct(hist.mejor.pct)} %</b>
              {hist.mejor.aprobado ? ' (aprobado).' : ' (sin aprobar).'}
            </p>
          )}
          <div className="panel">
            <h2>Datos del alumno</h2>
            <p className="note">Aparecerán en el certificado si apruebas.</p>
            <form onSubmit={empezar} noValidate>
              <div className="row">
                <div className="fld">
                  <label htmlFor={`pv-nom-${slug}`}>Nombre</label>
                  <input
                    id={`pv-nom-${slug}`}
                    ref={refNom}
                    autoComplete="given-name"
                    required
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    aria-invalid={errNom ? 'true' : 'false'}
                    aria-describedby={`pv-enom-${slug}`}
                  />
                  <span className="err" id={`pv-enom-${slug}`}>
                    {errNom}
                  </span>
                </div>
                <div className="fld">
                  <label htmlFor={`pv-ape-${slug}`}>Apellidos</label>
                  <input
                    id={`pv-ape-${slug}`}
                    ref={refApe}
                    autoComplete="family-name"
                    required
                    value={ape}
                    onChange={(e) => setApe(e.target.value)}
                    aria-invalid={errApe ? 'true' : 'false'}
                    aria-describedby={`pv-eape-${slug}`}
                  />
                  <span className="err" id={`pv-eape-${slug}`}>
                    {errApe}
                  </span>
                </div>
              </div>
              <p className="note">
                Cada pregunta tiene una sola respuesta correcta. Los ejercicios piden un número: escribe solo la cifra, sin símbolo de euro. Puedes usar
                coma o punto para los decimales. No hay penalización por fallo. Las soluciones se muestran al finalizar.
              </p>
              <button className="pv-btn pri" type="submit">
                Empezar el examen
              </button>
            </form>
          </div>
        </div>
      )}

      {fase === 'examen' && (
        <div>
          <div className="bar">
            <span className="who">
              Alumno: <b>{nom + ' ' + ape}</b>
            </span>
            <span className="prog" aria-live="polite">
              {answered} / {totalFields} respondidas
            </span>
            <button type="button" className="pv-btn" onClick={borrar}>
              Borrar respuestas
            </button>
            <button type="button" className="pv-btn" onClick={regenerar}>
              Generar examen nuevo
            </button>
          </div>
          {cajaConfirm}
          <p className="part-h">Parte 1 · Preguntas tipo test ({N_PREGUNTAS} puntos)</p>
          {qs.map((x, k) => {
            const q = def.bank[x.i];
            return (
              <fieldset className="q" key={`q${k}-${x.i}`}>
                <legend className="qh">
                  <span className="qn">{k + 1}.</span>
                  <span className="qt">{q.q}</span>
                </legend>
                <div className="opts">
                  {x.ord.map((oi, j) => {
                    const id = `pv-${slug}-q${k}_${j}`;
                    return (
                      <label htmlFor={id} key={oi}>
                        <input
                          type="radio"
                          name={`pv-${slug}-q${k}`}
                          id={id}
                          value={oi}
                          checked={respQ[k] === oi}
                          onChange={() => setRespQ((r) => r.map((v, i) => (i === k ? oi : v)))}
                        />
                        <span>{q.o[oi]}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}
          <p className="part-h">Parte 2 · Ejercicios prácticos ({reglas.campos} puntos)</p>
          {ex.map((e, k) => (
            <div className="q" key={`e${k}`}>
              <div className="qh">
                <span className="qn">E{k + 1}.</span>
                <span className="qt">{e.t}</span>
              </div>
              <p>{e.txt}</p>
              {e.datos && (
                <div className="datos">
                  {e.datos.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
              )}
              <div className="fields">
                {e.f.map((f, j) => {
                  const id = `pv-${slug}-e${k}_${j}`;
                  const val = respE[k]?.[j] ?? '';
                  const cambiar = (v: string) => setRespE((r) => r.map((fila, a) => (a === k ? fila.map((c, b) => (b === j ? v : c)) : fila)));
                  return (
                    <div className="field" key={j}>
                      <label htmlFor={id}>{f.l}</label>
                      {e.kind === 'sel' ? (
                        <select id={id} value={val} onChange={(ev) => cambiar(ev.target.value)}>
                          <option value="">Elige…</option>
                          {def.clasifOpt.map((o) => (
                            <option value={o[0]} key={o[0]}>
                              {o[1]}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input id={id} inputMode="decimal" autoComplete="off" value={val} onChange={(ev) => cambiar(ev.target.value)} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {cajaConfirm}
          <div className="foot">
            <button className="pv-btn pri" type="button" onClick={finalizar}>
              Finalizar y corregir
            </button>
            <span className="note">{answered < totalFields ? `Quedan ${totalFields - answered} sin responder. Cuentan como fallo.` : 'Todo respondido.'}</span>
          </div>
        </div>
      )}

      {fase === 'resultado' && res && (
        <div>
          <div className={`result ${res.pass ? 'pass' : 'fail'}`}>
            <div className="big">
              <span className="pct">
                {fmt(res.pct, 1)}
                <small>%</small>
              </span>
              <span className="verdict">{res.pass ? 'Aprobado' : 'No aprobado'}</span>
            </div>
            <p className="sub">
              {res.pts} de {res.tot} puntos. Para aprobar hacen falta {Math.ceil(res.tot * 0.7)} (70 %).{' '}
              {res.pass
                ? 'Has entendido la mayoría de los conceptos.'
                : 'Todavía hay conceptos por afianzar: repasa los temas en rojo y vuelve a intentarlo.'}
            </p>
            <div className="bars">
              {Object.keys(def.bloques).map((k) => {
                const b = res.byB[k];
                if (!b.t) return null;
                const pc = b.ok / b.t;
                return (
                  <div className="brow" key={k}>
                    <span>{def.bloques[k]}</span>
                    <div className="trk" aria-hidden="true">
                      <div className={`fill${pc < 0.7 ? ' lo' : ''}`} style={{ width: `${Math.round(pc * 100)}%` }} />
                    </div>
                    <span className="v">
                      {b.ok}/{b.t}
                    </span>
                  </div>
                );
              })}
            </div>
            {res.pass && (
              <div className="cert">
                <p>
                  <b>Certificado de superación</b>
                  <br />
                  {nom + ' ' + ape} · {fmt(res.pct, 1)} % · {fechaLarga(res.date)} · Código {res.code}
                </p>
                <button className="pv-btn pri" type="button" onClick={descargarCert}>
                  Descargar certificado (PDF)
                </button>{' '}
                <span className="note" role="status">
                  {certMsg}
                </span>
              </div>
            )}
          </div>

          <div className="review-h">
            <h2>Revisión de respuestas</h2>
            <div className="filter" role="group" aria-label="Filtrar">
              <button type="button" className="pv-btn" aria-pressed={filtro === 'all'} onClick={() => setFiltro('all')}>
                Todas
              </button>
              <button type="button" className="pv-btn" aria-pressed={filtro === 'ko'} onClick={() => setFiltro('ko')}>
                Solo fallos
              </button>
            </div>
          </div>
          <Revision def={def} qs={qs} ex={ex} res={res} filtro={filtro} etiquetaSel={etiquetaSel} />
          <div className="foot">
            <button
              className="pv-btn pri"
              type="button"
              onClick={() => {
                nuevoExamen();
                setFase('examen');
              }}
            >
              Hacer un examen nuevo
            </button>
            <Link className="pv-btn" to="/formacion">
              Volver a la formación previa
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function Revision({
  def,
  qs,
  ex,
  res,
  filtro,
  etiquetaSel,
}: {
  def: DefExamenPrevio;
  qs: PreguntaSorteada[];
  ex: EjercicioPrevio[];
  res: Resultado;
  filtro: 'all' | 'ko';
  etiquetaSel: (v: string | number) => string;
}) {
  const bloques: ReactNode[] = [];
  qs.forEach((x, k) => {
    const q = def.bank[x.i];
    const ans = res.ansQ[k];
    const ok = ans === q.a;
    if (filtro === 'ko' && ok) return;
    bloques.push(
      <div className={`q locked ${ok ? 'okq' : 'koq'}`} key={`rq${k}`}>
        <div className="qh">
          <span className="qn">{k + 1}.</span>
          <span className="qt">{q.q}</span>
        </div>
        <div className="opts">
          {x.ord.map((oi) => {
            let cls = '';
            let tag = '';
            if (oi === q.a) {
              cls = 'correct';
              tag = ans === oi ? 'Tu respuesta · correcta' : 'Respuesta correcta';
            } else if (oi === ans) {
              cls = 'wrong';
              tag = 'Tu respuesta';
            }
            return (
              <label className={cls} key={oi}>
                <input type="radio" disabled checked={oi === ans} readOnly />
                <span>{q.o[oi]}</span>
                {tag && <span className="tag">{tag}</span>}
              </label>
            );
          })}
        </div>
        <div className={`exp ${ok ? 'ok' : 'ko'}`}>
          <b>{ok ? 'Acierto' : ans === null ? 'Sin responder' : 'Fallo'}</b>
          {q.e}
        </div>
      </div>,
    );
  });
  ex.forEach((e, k) => {
    const campos = res.campos[k];
    const allok = campos.every((z) => z.ok);
    if (filtro === 'ko' && allok) return;
    const nOk = campos.filter((z) => z.ok).length;
    bloques.push(
      <div className={`q locked ${allok ? 'okq' : 'koq'}`} key={`re${k}`}>
        <div className="qh">
          <span className="qn">E{k + 1}.</span>
          <span className="qt">{e.t}</span>
        </div>
        {e.datos && (
          <div className="datos">
            {e.datos.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
        )}
        <div className="fields">
          {e.f.map((f, j) => {
            const z = campos[j];
            let yours: string;
            let right: string;
            if (e.kind === 'sel') {
              yours = etiquetaSel(z.raw);
              right = etiquetaSel(f.v);
            } else {
              const n = parseNum(z.raw);
              yours = isFinite(n) ? fmt(n, f.d) : 'sin responder';
              right = fmt(Number(f.v), f.d);
            }
            const id = `pv-r-${def.slug}-e${k}_${j}`;
            return (
              <div className={`field ${z.ok ? 'ok' : 'ko'}`} key={j}>
                <label htmlFor={id}>{f.l}</label>
                <input id={id} disabled value={yours} readOnly />
                <span className={`sol ${z.ok ? 'ok' : 'ko'}`}>
                  {z.ok ? 'Correcto' : 'Correcto: ' + right}
                  {e.kind === 'sel' && !z.ok ? '. ' + def.clasifExp[String(f.v)] : ''}
                </span>
              </div>
            );
          })}
        </div>
        <div className={`exp ${allok ? 'ok' : 'ko'}`}>
          <b>
            {nOk} de {e.f.length} correctos{e.exp ? ' · Solución' : ''}
          </b>
          {e.exp ?? def.ayudaClasif}
        </div>
      </div>,
    );
  });
  if (!bloques.length) return <p className="note">No hay fallos que mostrar.</p>;
  return <div>{bloques}</div>;
}
