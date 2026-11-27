import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { MODULOS, META, getEjercicio } from '../../content';
import { FASE_UI, bloqueAbierto, bloquesDe, conSelectorDeFases, faseActiva, faseDeBloque, fasesDe, guardarFase, numeroBloque, pasosDe, pasoOpcional, esOpcional, type FaseId } from '../../lib/ruta';
import { ejercicioCompletado } from '../../lib/progress';
import { useProgreso } from '../../lib/progress';
import { avanceGlobal, avanceModulo } from '../../lib/avance';

/** Formación previa (antes de los módulos de Axional): páginas en pages/previa */
const PREVIA = [
  { to: '/formacion/contabilidad', label: 'Conceptos de contabilidad general', letra: '1' },
  { to: '/formacion/erp', label: 'Qué es un ERP', letra: '2' },
];

const PRACTICA = [
  { to: '/erp', label: 'ERP de práctica', icon: 'compras' },
  { to: '/taller', label: 'Taller', icon: 'taller' },
  { to: '/video', label: 'Vídeos', icon: 'video' },
  { to: '/glosario', label: 'Glosario', icon: 'libro' },
  { to: '/errores', label: 'Errores', icon: 'aviso' },
  { to: '/examen', label: 'Examen final', icon: 'examen' },
  { to: '/logros', label: 'Logros', icon: 'logros' },
];

const pct = (v: number) => `${Math.round(v * 100)} %`;

export function Sidebar({
  oscuro,
  onTema,
  plegada,
  onPlegar,
  onNavegar,
}: {
  oscuro: boolean;
  onTema: () => void;
  plegada: boolean;
  onPlegar: () => void;
  onNavegar: () => void;
}) {
  const p = useProgreso();
  const loc = useLocation();
  const navigate = useNavigate();
  // Fases plegadas o desplegadas a mano; se olvidan al cambiar de página
  const [manual, setManual] = useState<{ en: string; v: Record<string, boolean> }>({ en: '', v: {} });
  // Módulo abierto ahora (en su página o en uno de sus bloques): se despliega con sus bloques
  const mModulo = loc.pathname.match(/^\/modulo\/([^/]+)/)?.[1];
  const mBloque = loc.pathname.match(/^\/ejercicio\/([^/]+)/)?.[1];
  const abierto = mBloque ? getEjercicio(mBloque)?.modulo.id : mModulo;
  const pasoActual = new URLSearchParams(loc.search).get('tab') ?? 'concepto';
  const global = avanceGlobal(p);
  const ini = p.alumno.ini || '··';
  const nombre = p.alumno.nombre || 'Alumno';
  const t = (s: string) => (plegada ? s : undefined);
  const enLoc = loc.pathname + loc.search;
  const moduloAbierto = MODULOS.find((m) => m.id === abierto);
  // El bloque que estás viendo fija la fase recordada del módulo (al volver a su página se abre esa pestaña)
  useEffect(() => {
    if (moduloAbierto && mBloque) {
      const f = faseDeBloque(moduloAbierto, mBloque);
      if (f) guardarFase(moduloAbierto.id, f);
    }
  }, [moduloAbierto, mBloque]);
  const scrollRef = useRef<HTMLElement>(null);

  // Lleva la barra hasta la lección abierta (o el módulo) para que siempre se vea dónde estás
  useEffect(() => {
    const cont = scrollRef.current;
    if (!cont || plegada) return;
    const id = window.setTimeout(() => {
      const el = cont.querySelector<HTMLElement>('.gsb-bloques li.actual') ?? cont.querySelector<HTMLElement>('.gsb-mod-abierto');
      if (!el) return;
      const c = cont.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.top < c.top + 8 || r.bottom > c.bottom - 8) cont.scrollTop += r.top - c.top - c.height / 3;
    }, 60);
    return () => window.clearTimeout(id);
  }, [loc.pathname, abierto, plegada]);
  const enPrevia = loc.pathname.startsWith('/formacion');
  return (
    <aside className="gsb" aria-label="Navegación de la plataforma" id="barra-lateral">
      <div className="gsb-cab">
        <Link to="/" className="gsb-marca" onClick={onNavegar} aria-label="Formación Axional Deister VNext, inicio">
          <img src={`${import.meta.env.BASE_URL}brand/oys_logo.png`} alt="" className="logo-claro" />
          <img src={`${import.meta.env.BASE_URL}brand/oys_logo_light.png`} alt="" className="logo-oscuro" />
          <span className="gsb-marca-txt">
            <small>O&amp;S Consultores</small>
            <b>Axional Deister VNext</b>
          </span>
        </Link>
        <Link to="/logros" className="gsb-perfil" onClick={onNavegar} title={t(`${nombre} · ${pct(global)}`)}>
          <span className="gsb-ini" aria-hidden="true">{ini}</span>
          <span className="gsb-quien">
            <b>{nombre}</b>
            <small>{pct(global)} del curso</small>
          </span>
          <span className="gsb-barra" aria-hidden="true">
            <i style={{ width: `${global * 100}%` }} />
          </span>
        </Link>
      </div>

      <nav className="gsb-nav" aria-label="Principal" ref={scrollRef}>
        <NavLink to="/" end className="gsb-item" onClick={onNavegar} title={t('Inicio')}>
          <span className="gsb-n">
            <Icon name="inicio" size={18} />
          </span>
          <span className="gsb-t">Inicio</span>
        </NavLink>

        <p className="gsb-grupo">Formación previa</p>
        <NavLink to="/formacion" end className={`gsb-item${enPrevia ? ' abierto' : ''}`} onClick={onNavegar} title={t('Antes de empezar con Axional')}>
          <span className="gsb-n">
            <Icon name="libro" size={18} />
          </span>
          <span className="gsb-t">Antes de empezar con Axional</span>
        </NavLink>
        {!plegada && (
          <ol className="gsb-bloques gsb-previa" aria-label="Apartados de la formación previa">
            {PREVIA.map((x) => (
              <li key={x.to} className={loc.pathname.startsWith(x.to) ? 'actual' : undefined}>
                <NavLink to={x.to} onClick={onNavegar}>
                  <b>{x.letra}</b>
                  <span>{x.label}</span>
                </NavLink>
              </li>
            ))}
          </ol>
        )}

        <p className="gsb-grupo">Módulos de Axional</p>
        {MODULOS.map((m, im) => {
          const meta = META[m.id] ?? { color: '#4fbfa5', icono: 'check', corto: m.titulo };
          const v = avanceModulo(p, m.id);
          return (
            <div key={m.id} className={abierto === m.id ? 'gsb-mod-abierto' : undefined}>
              <NavLink
                to={`/modulo/${m.id}`}
                className={`gsb-item gsb-mod${abierto === m.id ? ' abierto' : ''}${v >= 1 ? ' completo' : ''}`}
                onClick={onNavegar}
                title={t(`${im}. ${meta.corto} · ${pct(v)}`)}
              >
                <span className="gsb-n">{im}</span>
                <span className="gsb-t">{meta.corto}</span>
                {v > 0 && <span className="gsb-pct">{v >= 1 ? '✓' : pct(v)}</span>}
              </NavLink>
              {abierto === m.id && !plegada && (() => {
                const grupos = fasesDe(m);
                const conFases = conSelectorDeFases(grupos);
                const faseAct: FaseId | undefined = mBloque ? faseDeBloque(m, mBloque) : faseActiva(p, m, grupos, new URLSearchParams(loc.search).get('fase'));
                const fila = (b: (typeof grupos)[number]['bloques'][number]) => {
                  const hecho = ejercicioCompletado(p.ejercicios[b.id]);
                  const actual = mBloque === b.id;
                  const opc = esOpcional(m, b.id);
                  const n = numeroBloque(m, b.id);
                  return (
                    <li key={b.id} className={`${hecho ? 'hecho' : ''}${actual ? ' actual' : ''}`}>
                      {bloqueAbierto(p, m, b.id) ? (
                        <NavLink to={`/ejercicio/${b.id}`} onClick={onNavegar} title={b.titulo} end>
                          <b>{hecho ? '✓' : opc ? '+' : n}</b>
                          <span>{b.titulo}</span>
                        </NavLink>
                      ) : (
                        <span className="gsb-cerrado" title="Se abre al terminar el bloque anterior">
                          <b>{n}</b>
                          <span>{b.titulo}</span>
                        </span>
                      )}
                      {actual && (
                        <ol className="gsb-pasos">
                          {pasosDe(b).map((x) => {
                            const on = (pasoActual === 'problemas' ? 'demo' : pasoActual) === x.id;
                            return (
                              <li key={x.id}>
                                <Link to={`/ejercicio/${b.id}${x.id === 'concepto' ? '' : `?tab=${x.id}`}`} onClick={onNavegar} className={on ? 'on' : undefined} aria-current={on ? 'step' : undefined}>
                                  {x.label}
                                  {pasoOpcional(x.id) && <span className="gsb-opc">opcional</span>}
                                </Link>
                              </li>
                            );
                          })}
                        </ol>
                      )}
                    </li>
                  );
                };
                if (!conFases) {
                  return (
                    <ol className="gsb-bloques" aria-label={`Bloques de ${meta.corto}`}>
                      {bloquesDe(m).map(fila)}
                    </ol>
                  );
                }
                return (
                  <div className="gsb-fases" aria-label={`Fases de ${meta.corto}`}>
                    {grupos.map((g) => {
                      const clave = `${m.id}:${g.id}`;
                      const vm = manual.en === enLoc ? manual.v : {};
                      const abiertaF = vm[clave] ?? g.id === faseAct;
                      const hechosF = g.bloques.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
                      const ui = FASE_UI[g.id];
                      // Fase sin bloques nuevos (p. ej. Ventas › Configurar): es un aviso, no una fase vacía que se abre
                      if (g.bloques.length === 0) {
                        return (
                          <Link key={g.id} to={`/modulo/${m.id}?fase=${g.id}`} className="gsb-fase-info" onClick={onNavegar}>
                            <span className="gsb-fase-t">{ui.titulo}</span>
                            <small>ya lo tienes</small>
                          </Link>
                        );
                      }
                      return (
                        <div key={g.id} className={`gsb-fase${abiertaF ? ' abierta' : ''}${g.id === faseAct ? ' actual' : ''}`}>
                          <button
                            type="button"
                            className="gsb-fase-cab"
                            aria-expanded={abiertaF}
                            aria-controls={`sb-fase-${clave}`}
                            onClick={() => {
                              setManual({ en: enLoc, v: { ...vm, [clave]: !abiertaF } });
                              // En la página del módulo, abrir una fase también cambia su pestaña
                              if (!abiertaF && !mBloque && mModulo === m.id) {
                                guardarFase(m.id, g.id);
                                navigate(`/modulo/${m.id}?fase=${g.id}`, { replace: true });
                              }
                            }}
                          >
                            <Icon name="chevron" size={14} />
                            <span className="gsb-fase-t">{ui.titulo}</span>
                            <span className="gsb-fase-n">
                              {hechosF}/{g.bloques.length}
                            </span>
                          </button>
                          {abiertaF && g.bloques.length > 0 && (
                            <ol className="gsb-bloques" id={`sb-fase-${clave}`} aria-label={`${ui.titulo}: bloques de ${meta.corto}`}>
                              {g.bloques.map(fila)}
                            </ol>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          );
        })}

        <p className="gsb-grupo">Practicar y demostrar</p>
        {PRACTICA.map((n) => (
          <NavLink key={n.to} to={n.to} className="gsb-item" onClick={onNavegar} title={t(n.label)}>
            <span className="gsb-n">
              <Icon name={n.icon} size={18} />
            </span>
            <span className="gsb-t">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="gsb-pie">
        <button type="button" className="gsb-btn" onClick={onTema} aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
          <Icon name={oscuro ? 'sol' : 'luna'} size={18} />
          <span>{oscuro ? 'Tema claro' : 'Tema oscuro'}</span>
        </button>
        <button type="button" className="gsb-btn sq gsb-plegar" onClick={onPlegar} aria-label={plegada ? 'Desplegar barra lateral' : 'Plegar barra lateral'} aria-expanded={!plegada}>
          <Icon name={plegada ? 'desplegar' : 'plegar'} size={18} />
        </button>
      </div>
    </aside>
  );
}
