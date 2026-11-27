import { useEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { META, MODULOS, getModulo } from '../content';
import { ejercicioCompletado, useProgreso, APROBADO } from '../lib/progress';
import { MAX_PREG, notaExamen, preguntasDe } from '../lib/examenModulo';
import { conIni } from '../lib/texto';
import { momentosDeModulo, seriesDeModulo } from '../content/videoSeries';
import { VideoPrimero } from '../components/exercise/VideoPrimero';
import { SIMS } from '../sims/registro';
import { Icon } from '../components/Icon';
import { SeccionVista } from '../components/exercise/SeccionVista';
import { useNotas } from '../erp/practicas';
import { FICHAS, type PiezaCircuito } from './portadaDatos';
import { FASE_UI, conSelectorDeFases, esFaseId, faseActiva, fasesDe, guardarFase, type FaseId, modoLibre, bloqueAbierto, bloqueQueToca, bloquesObligatorios, etapasDe, pasoQueToca, pasosDe, pasosHechos, PASOS } from '../lib/ruta';
import './aprender.css';
import './ruta.css';

export default function ModulePage() {
  const { id = '' } = useParams();
  const p = useProgreso();
  const notasErp = useNotas();
  const modulo = getModulo(id);
  const [sp, setSp] = useSearchParams();
  const faseUrl = sp.get('fase');
  const refTabs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Si la fase viene en la URL (enlace compartido, chip de la portada o menú lateral), se recuerda para este módulo
  useEffect(() => {
    if (modulo && esFaseId(faseUrl)) guardarFase(modulo.id, faseUrl);
  }, [modulo, faseUrl]);

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
  const nExamen = Math.min(preguntasDe(modulo.id).length, MAX_PREG);
  const notaEx = notaExamen(p, modulo.id);
  const todos = etapas.flatMap((e) => e.bloques.map((b) => ({ b, opc: !!e.opcional })));
  const nOpc = todos.filter((x) => x.opc).length;
  const numBloque = new Map(etapas.flatMap((e) => e.bloques).map((b, i) => [b.id, i + 1]));

  // Fases del módulo: Configurar, Operar y Para saber más (selector solo si hay Configurar y Operar)
  const grupos = fasesDe(modulo);
  const conSelector = conSelectorDeFases(grupos);
  const fase: FaseId = faseActiva(p, modulo, grupos, faseUrl);
  const grupoActivo = grupos.find((g) => g.id === fase) ?? grupos[0];
  const sinBloques = modulo.ejercicios.length === 0;

  const irAlPanel = () => {
    window.setTimeout(() => document.getElementById('bloques-h')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  };
  const cambiarFase = (f: FaseId, conScroll: boolean) => {
    guardarFase(modulo.id, f);
    setSp({ fase: f }, { replace: true });
    if (conScroll) irAlPanel();
  };
  const alTeclear = (ev: KeyboardEvent, i: number) => {
    const n = grupos.length;
    const j = ev.key === 'ArrowRight' || ev.key === 'ArrowDown' ? (i + 1) % n : ev.key === 'ArrowLeft' || ev.key === 'ArrowUp' ? (i + n - 1) % n : ev.key === 'Home' ? 0 : ev.key === 'End' ? n - 1 : -1;
    if (j < 0) return;
    ev.preventDefault();
    cambiarFase(grupos[j].id, false);
    refTabs.current[grupos[j].id]?.focus();
  };

  const pasoToca = toca ? pasoQueToca(p, toca, notasErp) : 'concepto';
  const enlaceToca = toca ? `/ejercicio/${toca.id}${pasoToca === 'concepto' ? '' : `?tab=${pasoToca}`}` : '';
  const empezado = obligatorios.some((e) => p.ejercicios[e.id]);
  const ctaTexto = !toca ? '' : !empezado ? `Empezar por el bloque 1` : `Seguir: bloque ${numBloque.get(toca.id)}, ${PASOS.find((x) => x.id === pasoToca)?.label}`;

  // Índice «En esta página» (botones: con HashRouter un #ancla cambiaría de ruta)
  const hayExtra = series.length > 0 || sims.length > 0;
  const indice = [
    { id: 'antes-h', t: 'Para situarte' },
    { id: 'bloques-h', t: 'Los bloques' },
    { id: 'cierre-h', t: 'Para cerrar el módulo' },
    ...(hayExtra ? [{ id: 'extra-h', t: 'Material de consulta' }] : []),
  ];
  const irA = (idSec: string) => {
    const reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(idSec)?.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
  };

  const renderEtapa = (et: (typeof etapas)[number], ei: number) => (
              <div key={ei} className={`md-etapa${et.opcional ? ' opc' : ''}`}>
                {(et.fase || et.opcional) && et.titulo && !et.nota && (
                  <h4 className="md-etapa-t">
                    {et.titulo}
                    {et.opcional ? ' (opcional)' : ''}
                    {et.que && <small>{et.que}</small>}
                  </h4>
                )}
                {et.nota && (
                  <div className="md-nota-card">
                    <span className="md-nota-ico" aria-hidden="true">
                      <Icon name="check" size={22} stroke={3} />
                    </span>
                    <div>
                      <strong>{et.titulo}</strong>
                      <p>{et.que}</p>
                      <p>{et.nota}</p>
                      {et.enlace && META[et.enlace] && (
                        <Link className="btn" to={`/modulo/${et.enlace}`}>
                          Ir a {META[et.enlace].corto}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
        {et.bloques.length > 0 && <ol className="md-bloques">
              {et.bloques.map((b) => {
                const opc = !!et.opcional;
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
                    <span className="md-b-estado">{hecho ? 'Hecho' : esToca ? 'Te toca' : abierto ? (p.ejercicios[b.id] ? 'Empezado' : '') : 'Cerrado'}</span>
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
        </ol>}
              </div>
  );

  return (
    <div className="wrap gm" style={{ ['--mod' as string]: meta.color } as CSSProperties}>
      <Link to="/" className="md-volver gm-volver">
        <Icon name="atras" size={16} /> Todos los módulos
      </Link>

      <header className="g-hero gm-hero">
        <p className="g-kicker">
          Módulo {idx} · {obligatorios.length} {obligatorios.length === 1 ? 'bloque' : 'bloques'}
        </p>
        <h1>{meta.corto}</h1>
        <p className="gm-frase">{ficha ? t(ficha.frase) : t(modulo.resumen)}</p>
        <div className="gm-hero-acc">
        <div className="gm-avance">
          <div className="gm-barra" role="progressbar" aria-valuemin={0} aria-valuemax={obligatorios.length} aria-valuenow={hechos} aria-label="Bloques terminados">
            <i style={{ width: `${(hechos / Math.max(1, obligatorios.length)) * 100}%` }} />
          </div>
          <span>
            {hechos} de {obligatorios.length} bloques terminados
            {nOpc > 0 && ` · además, ${nOpc} ${nOpc === 1 ? 'bloque' : 'bloques'} de ampliación (opcional)`}
          </span>
        </div>
        {sinBloques ? (
          <p className="md-hecho md-prox">
            <Icon name="reloj" size={18} /> Próximamente: los bloques de este módulo se están preparando.
          </p>
        ) : toca ? (
          <Link className="btn arc lg md-cta" to={enlaceToca}>
            {ctaTexto}
          </Link>
        ) : (
          <p className="md-hecho">
            <Icon name="check" size={18} stroke={3} /> Has terminado todos los bloques. Te queda el examen del módulo.
          </p>
        )}
        </div>
      </header>

      <nav className="gm-indice" aria-label="En esta página">
        <p className="g-kicker">En esta página</p>
        <ol>
          {indice.map((x, i) => (
            <li key={x.id}>
              <button type="button" onClick={() => irA(x.id)}>
                <b>{i + 1}</b>
                {x.t}
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. Antes de empezar: el mapa del módulo y lo básico, una sola vez */}
      <section className="g-card gm-sec" aria-labelledby="antes-h">
        <p className="g-kicker">Parte 1</p>
        <h2 id="antes-h">Para situarte</h2>
        <VideoPrimero
          lista={momentosDeModulo(modulo.id)}
          indice
          ante="Antes de empezar el módulo"
          luego="Luego empieza por el bloque 1."
        />
        
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
              if (dueno && /mover/i.test(s.titulo)) {
                return (
                  <p key={s.id} className="md-ya">
                    {t(s.titulo)}: está en Fundamentos › <Link to="/ejercicio/fundamentos-navegar">Moverse por el ERP</Link>.
                  </p>
                );
              }
              return dueno ? (
                <p key={s.id} className="md-ya">
                  {t(s.titulo)}: ya lo viste en <Link to={`/modulo/${dueno.id}`}>{META[dueno.id]?.corto ?? dueno.titulo}</Link>, en «Para situarte».
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
      <section className="g-card gm-sec" aria-labelledby="bloques-h">
        <p className="g-kicker">Parte 2</p>
        <h2 id="bloques-h">Los bloques</h2>
        {sinBloques ? (
          <p className="md-sec-txt">Aquí aparecerán los bloques cuando estén listos.</p>
        ) : (
          <p className="md-sec-txt">
            Te recomendamos hacerlos en orden: cada uno usa lo que montaste en el anterior. «Te toca» marca el siguiente que tienes pendiente.
          </p>
        )}
        {conSelector && (
          <p className="md-aviso-operar">
            <Icon name="aviso" size={18} />
            <span>
              ¿La empresa ya está configurada? <Link to={`/modulo/${modulo.id}?fase=operar`} onClick={irAlPanel}>Ve directo a Operar</Link>. Si es tu primera vez, empieza por el bloque 1, en Configurar.
            </span>
          </p>
        )}
        {conSelector && (
          <div className="md-fases" role="tablist" aria-label="Fases del módulo">
            {grupos.map((g, i) => {
              const ui = FASE_UI[g.id];
              const hechosF = g.bloques.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
              const activa = g.id === fase;
              return (
                <button
                  key={g.id}
                  ref={(el) => { refTabs.current[g.id] = el; }}
                  type="button"
                  role="tab"
                  id={`fase-tab-${g.id}`}
                  aria-selected={activa}
                  aria-controls="fase-panel"
                  tabIndex={activa ? 0 : -1}
                  className={`md-fase-tab md-ft-${g.id}${activa ? ' on' : ''}`}
                  onClick={() => cambiarFase(g.id, true)}
                  onKeyDown={(ev) => alTeclear(ev, i)}
                >
                  <span className="md-ft-ico" aria-hidden="true">
                    <Icon name={ui.icono} size={26} />
                  </span>
                  <span className="md-ft-txt">
                    <strong>{ui.titulo}</strong>
                    <span>{ui.corto}</span>
                    <span className="md-ft-prog">
                      <span className="md-ft-barra" aria-hidden="true">
                        <i style={{ width: `${(hechosF / Math.max(1, g.bloques.length)) * 100}%` }} />
                      </span>
                      <em>
                        {g.bloques.length === 0 ? 'Sin bloques nuevos' : `${hechosF} de ${g.bloques.length} ${g.bloques.length === 1 ? 'bloque' : 'bloques'}`}
                      </em>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
        {conSelector ? (
          <div role="tabpanel" id="fase-panel" aria-labelledby={`fase-tab-${fase}`} tabIndex={0} className="md-panel">
            {grupoActivo.etapas.map(renderEtapa)}
          </div>
        ) : (
          etapas.map(renderEtapa)
        )}
      </section>

      {/* 3. Cierre */}
      <section className="g-card gm-sec" aria-labelledby="cierre-h">
        <p className="g-kicker">Parte 3</p>
        <h2 id="cierre-h">Para cerrar el módulo</h2>
        <ol className="md-cierre">
          {nExamen > 0 && (
            <li>
              <Link to={`/modulo/${modulo.id}/examen`} className={`md-c${todoHecho ? ' toca' : ''}${todoHecho || modoLibre() ? '' : ' cerrado'}`} onClick={(e) => { if (!todoHecho && !modoLibre()) e.preventDefault(); }} aria-disabled={!todoHecho && !modoLibre()}>
                <Icon name="examen" size={22} />
                <span>
                  <strong>Examen del módulo</strong>
                  <span>
                    {notaEx === null
                      ? `${nExamen} preguntas de test. Apruebas con un ${Math.round(APROBADO * 100)} %.${todoHecho ? '' : ' Mejor cuando termines los bloques.'}`
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
                  <strong>Siguiente: módulo {idx + 1}, {META[sigMod.id]?.corto ?? sigMod.titulo}</strong>
                  <span>{FICHAS[sigMod.id]?.recorrido ?? ''}</span>
                </span>
              </Link>
            ) : (
              <Link to="/examen" className="md-c">
                <Icon name="examen" size={22} />
                <span>
                  <strong>Examen final del curso</strong>
                  <span>Teoría y un caso práctico completo en la Demo real.</span>
                </span>
              </Link>
            )}
          </li>
        </ol>
      </section>

      {hayExtra && (
        <section className="g-card gm-sec gm-extra" aria-labelledby="extra-h">
          <p className="g-kicker">Parte 4</p>
          <h2 id="extra-h">Material de consulta</h2>
          {sims.length > 0 && (
            <p>
              <Link to={`/taller/${sims[0].id}`}>Simulador del Taller: {sims[0].titulo}</Link>
            </p>
          )}
          {series.length > 0 && (
            <p>
              <Link to="/video">Vídeos completos del módulo ({series.reduce((n, s) => n + s.capitulos.length, 0)} {series.reduce((n, s) => n + s.capitulos.length, 0) === 1 ? 'capítulo' : 'capítulos'})</Link>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
