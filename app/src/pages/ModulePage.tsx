import type { CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { META, MODULOS, getModulo } from '../content';
import { ejercicioCompletado, useProgreso, APROBADO } from '../lib/progress';
import { notaExamen, preguntasDe } from '../lib/examenModulo';
import { conIni } from '../lib/texto';
import { seriesDeModulo } from '../content/videoSeries';
import { SIMS } from '../sims/registro';
import { Icon } from '../components/Icon';
import { SeccionVista } from '../components/exercise/SeccionVista';
import { useNotas } from '../erp/practicas';
import { FICHAS, type PiezaCircuito } from './portadaDatos';
import { modoLibre, bloqueAbierto, bloqueQueToca, bloquesObligatorios, etapasDe, pasoQueToca, pasosDe, pasosHechos, PASOS } from '../lib/ruta';
import './aprender.css';
import './ruta.css';

export default function ModulePage() {
  const { id = '' } = useParams();
  const p = useProgreso();
  const notasErp = useNotas();
  const modulo = getModulo(id);

  if (!modulo) {
    return (
      <div className="wrap" style={{ padding: '60px 0' }}>
        <h1>No encuentro ese módulo</h1>
        <p className="muted">Vuelve al inicio y elige uno de la lista.</p>
        <Link className="btn" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }

  // Enlace a un módulo antiguo que se fusionó en otro (p. ej. #/modulo/icon-cartera): al módulo vigente
  if (modulo.id !== id) return <Navigate to={`/modulo/${modulo.id}`} replace />;

  const ini = p.alumno.ini;
  const t = (x: string) => conIni(x, ini);
  const meta = META[modulo.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: modulo.titulo };
  const ficha = FICHAS[modulo.id];
  const piezas: PiezaCircuito[] = ficha?.circuito ?? modulo.circuito.map((x) => ({ t: x, d: '' }));
  const etapas = etapasDe(modulo);
  const obligatorios = bloquesObligatorios(modulo);
  const hechos = obligatorios.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
  const toca = bloqueQueToca(p, modulo);
  const todoHecho = !toca;
  const idx = MODULOS.findIndex((m) => m.id === modulo.id);
  const sigMod = MODULOS[idx + 1];
  const series = seriesDeModulo(modulo.id);
  const sims = SIMS.filter((s) => s.modulo === modulo.id);
  const nExamen = preguntasDe(modulo.id).length;
  const notaEx = notaExamen(p, modulo.id);
  const todos = etapas.flatMap((e) => e.bloques.map((b) => ({ b, opc: !!e.opcional })));
  const nOpc = todos.filter((x) => x.opc).length;
  const numBloque = new Map(etapas.flatMap((e) => e.bloques).map((b, i) => [b.id, i + 1]));

  const pasoToca = toca ? pasoQueToca(p, toca, notasErp) : 'concepto';
  const enlaceToca = toca ? `/ejercicio/${toca.id}${pasoToca === 'concepto' ? '' : `?tab=${pasoToca}`}` : '';
  const empezado = obligatorios.some((e) => p.ejercicios[e.id]);
  const ctaTexto = !toca ? '' : !empezado ? `Empezar por el bloque 1` : `Seguir: bloque ${numBloque.get(toca.id)}, ${PASOS.find((x) => x.id === pasoToca)?.label}`;

  return (
    <div className="wrap md" style={{ ['--mod' as string]: meta.color } as CSSProperties}>
      <Link to="/" className="md-volver">
        <Icon name="atras" size={16} /> Todos los módulos
      </Link>

      <header className="md-cab">
        <p className="md-num">
          <span className="md-ico" aria-hidden="true">
            <Icon name={meta.icono} size={22} />
          </span>
          Módulo {idx + 1} de {MODULOS.length}
        </p>
        <h1>{meta.corto}</h1>
        <p className="md-frase">{ficha ? t(ficha.frase) : t(modulo.resumen)}</p>
        <div className="md-avance">
          <div className="md-barra" role="progressbar" aria-valuemin={0} aria-valuemax={obligatorios.length} aria-valuenow={hechos} aria-label="Bloques terminados">
            <i style={{ width: `${(hechos / Math.max(1, obligatorios.length)) * 100}%` }} />
          </div>
          <span>
            {hechos} de {obligatorios.length} bloques terminados
            {nOpc > 0 && ` · además, ${nOpc} ${nOpc === 1 ? 'bloque' : 'bloques'} de ampliación (opcional)`}
          </span>
        </div>
        {toca ? (
          <Link className="btn arc lg md-cta" to={enlaceToca}>
            {ctaTexto}
          </Link>
        ) : (
          <p className="md-hecho">
            <Icon name="check" size={18} stroke={3} /> Has terminado todos los bloques. Te queda el examen del módulo.
          </p>
        )}
      </header>

      {/* 1. Antes de empezar: el mapa del módulo y lo básico, una sola vez */}
      <section className="md-sec" aria-labelledby="antes-h">
        <h2 id="antes-h"> Antes de empezar
        </h2>
        
        {ficha && (
          <ul className="md-aprendes">
            {ficha.aprendes.map((a, i) => (
              <li key={i}>
                <Icon name="check" size={16} stroke={3} /> {t(a)}
              </li>
            ))}
          </ul>
        )}
        {piezas.length > 0 && (
          <p className="md-recorrido">
            <b>El recorrido:</b> {piezas.map((x) => x.t).join(' → ')}.
          </p>
        )}
        {modulo.navegacion && modulo.navegacion.length > 0 && (
          <div className="md-basico">
            <h3>Lo básico del ERP para este módulo</h3>
            {modulo.navegacion.map((s) => {
              // Cada tema en un solo sitio: si un módulo anterior ya lo explica, aquí solo se enlaza
              const dueno = MODULOS.slice(0, idx).find((m) => m.navegacion?.some((x) => x.titulo === s.titulo));
              return dueno ? (
                <p key={s.id} className="md-ya">
                  {t(s.titulo)}: ya lo viste en <Link to={`/modulo/${dueno.id}`}>{META[dueno.id]?.corto ?? dueno.titulo}</Link>, en «Antes de empezar».
                </p>
              ) : (
                <div key={s.id} className="md-basico-tema">
                  <h4>{t(s.titulo)}</h4>
                  <SeccionVista s={s} ini={ini} conPasos />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 2. Los bloques, por etapas */}
      <section className="md-sec" aria-labelledby="bloques-h">
        <h2 id="bloques-h"> Los bloques
        </h2>
        <p className="md-sec-txt">
          Se hacen en orden. Cada bloque se abre al terminar el Guiado y aprobar el Test del anterior.
        </p>
        <ol className="md-bloques">
              {todos.map(({ b, opc }) => {
                const hecho = ejercicioCompletado(p.ejercicios[b.id]);
                const abierto = bloqueAbierto(p, modulo, b.id);
                const esToca = toca?.id === b.id;
                const h = pasosHechos(p, b, notasErp);
                const ps = pasosDe(b);
                const n = numBloque.get(b.id);
                const cuerpo = (
                  <>
                    <span className="md-b-n" aria-hidden="true">
                      {hecho ? <Icon name="check" size={18} stroke={3} /> : abierto ? n : <Icon name="candado" size={16} />}
                    </span>
                    <span className="md-b-txt">
                      <strong>
                        {t(b.titulo)}{opc ? ' (ampliación, opcional)' : ''}
                      </strong>
                      <span>{t(b.objetivo)}</span>
                      <span className="md-b-pasos" aria-label={`${ps.filter((x) => h[x.id]).length} de ${ps.length} pasos hechos`}>
                        {ps.map((x) => (
                          <i key={x.id} className={h[x.id] ? 'ok' : ''} title={x.label} />
                        ))}
                        <em>{b.duracionMin} min</em>
                      </span>
                    </span>
                    <span className="md-b-estado">{hecho ? 'Hecho' : esToca ? 'Te toca' : abierto ? (p.ejercicios[b.id] ? 'Empezado' : 'Abierto') : 'Cerrado'}</span>
                  </>
                );
                return (
                  <li key={b.id} className={`${hecho ? 'hecho' : ''}${esToca ? ' toca' : ''}${abierto ? '' : ' cerrado'}${opc ? ' opc' : ''}`}>
                    {abierto ? (
                      <Link to={`/ejercicio/${b.id}`} className="md-b">
                        {cuerpo}
                      </Link>
                    ) : (
                      <div className="md-b" aria-disabled="true" title="Termina el bloque anterior para abrir este">
                        {cuerpo}
                      </div>
                    )}
                  </li>
                );
              })}
        </ol>
      </section>

      {/* 3. Cierre */}
      <section className="md-sec" aria-labelledby="cierre-h">
        <h2 id="cierre-h"> Para cerrar el módulo
        </h2>
        <ol className="md-cierre">
          {nExamen > 0 && (
            <li>
              <Link to={`/modulo/${modulo.id}/examen`} className={`md-c${todoHecho ? ' toca' : ''}${todoHecho || modoLibre() ? '' : ' cerrado'}`} onClick={(e) => { if (!todoHecho && !modoLibre()) e.preventDefault(); }} aria-disabled={!todoHecho && !modoLibre()}>
                <Icon name="examen" size={22} />
                <span>
                  <strong>Examen del módulo</strong>
                  <span>
                    {notaEx === null
                      ? `${nExamen} preguntas de test. Apruebas con un ${Math.round(APROBADO * 100)} %.${todoHecho ? '' : ' Se abre cuando termines los bloques.'}`
                      : `Tu mejor nota: ${Math.round(notaEx * 100)} %${notaEx >= APROBADO ? ' (aprobado)' : ''}. Puedes repetirlo.`}
                  </span>
                </span>
              </Link>
            </li>
          )}
          <li>
            {sigMod ? (
              <Link to={`/modulo/${sigMod.id}`} className="md-c">
                <Icon name={META[sigMod.id]?.icono ?? 'flecha'} size={22} />
                <span>
                  <strong>Siguiente: módulo {idx + 2}, {META[sigMod.id]?.corto ?? sigMod.titulo}</strong>
                  <span>{FICHAS[sigMod.id]?.recorrido ?? ''}</span>
                </span>
              </Link>
            ) : (
              <Link to="/examen" className="md-c">
                <Icon name="examen" size={22} />
                <span>
                  <strong>Examen final del curso</strong>
                  <span>Teoría y un caso práctico completo en la demo.</span>
                </span>
              </Link>
            )}
          </li>
        </ol>
      </section>

      {(series.length > 0 || sims.length > 0) && (
        <section className="md-sec md-extra" aria-labelledby="extra-h">
          <h2 id="extra-h">Material de consulta</h2>
          {sims.length > 0 && (
            <p>
              <Link to={`/taller/${sims[0].id}`}>Simulador del Taller: {sims[0].titulo}</Link>
            </p>
          )}
          {series.length > 0 && (
            <p>
              <Link to="/video">Vídeos completos del módulo ({series.reduce((n, s) => n + s.capitulos.length, 0)} capítulos)</Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
