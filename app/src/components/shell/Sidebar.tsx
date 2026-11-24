import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Icon } from '../Icon';
import { Anillo } from './Anillo';
import { MODULOS, META, getEjercicio } from '../../content';
import { FASE_UI, bloqueAbierto, bloquesDe, conSelectorDeFases, faseActiva, faseDeBloque, fasesDe, guardarFase, numeroBloque, pasosDe, pasoOpcional, esOpcional, type FaseId } from '../../lib/ruta';
import { ejercicioCompletado } from '../../lib/progress';
import '../../pages/ruta.css';
import { useProgreso } from '../../lib/progress';
import { avanceGlobal, avanceModulo } from '../../lib/avance';

const PRACTICA = [
  { to: '/erp', label: 'ERP de práctica', icon: 'compras' },
  { to: '/taller', label: 'Taller', icon: 'taller' },
  { to: '/video', label: 'Vídeos', icon: 'video' },
  { to: '/glosario', label: 'Glosario', icon: 'libro' },
  { to: '/errores', label: 'Errores', icon: 'aviso' },
  { to: '/examen', label: 'Examen', icon: 'examen' },
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
      const el = cont.querySelector<HTMLElement>('.sb-bloques li.actual') ?? cont.querySelector<HTMLElement>('.sb-mod-abierto');
      if (!el) return;
      const c = cont.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      if (r.top < c.top + 8 || r.bottom > c.bottom - 8) cont.scrollTop += r.top - c.top - c.height / 3;
    }, 60);
    return () => window.clearTimeout(id);
  }, [loc.pathname, abierto, plegada]);
  return (
    <aside className="sb" aria-label="Navegación de la plataforma" id="barra-lateral">
      <Link to="/" className="sb-brand" onClick={onNavegar} aria-label="Formación Axional Deister VNext, inicio">
        <img src={`${import.meta.env.BASE_URL}brand/oys_logo_light.png`} alt="" />
        <span>
          <b>Formación Axional Deister VNext</b>
          <small>O&amp;S Consultores</small>
        </span>
      </Link>

      <Link to="/logros" className="sb-profile" onClick={onNavegar} title={t(`${nombre} · ${pct(global)}`)}>
        <span className="sb-avatar">
          <Anillo valor={global} size={58} grosor={4} />
          <span className="sb-ini">{ini}</span>
        </span>
        <span className="sb-who">
          <b>{nombre}</b>
          <small>
            <em>{pct(global)}</em> del curso completado
          </small>
        </span>
      </Link>

      <nav className="sb-scroll" aria-label="Principal" ref={scrollRef}>
        <NavLink to="/" end className="sb-link" onClick={onNavegar} title={t('Inicio')}>
          <span className="sb-ico">
            <Icon name="inicio" />
          </span>
          <span className="sb-label">Inicio</span>
        </NavLink>

        <div className="sb-group">Módulos</div>
        {MODULOS.map((m, im) => {
          const meta = META[m.id] ?? { color: '#4fbfa5', icono: 'check', corto: m.titulo };
          const v = avanceModulo(p, m.id);
          return (
            <div key={m.id} className={abierto === m.id ? 'sb-mod-abierto' : undefined}>
              <NavLink
                to={`/modulo/${m.id}`}
                className={`sb-link sb-mod${abierto === m.id ? ' abierto' : ''}`}
                onClick={onNavegar}
                style={{ ['--mod' as string]: meta.color } as CSSProperties}
                title={t(`${meta.corto} · ${pct(v)}`)}
              >
                <span className="sb-ico">
                  <Icon name={meta.icono} size={20} />
                </span>
                <span className="sb-label">
                  {im}. {meta.corto}
                </span>
                <span className={`sb-pct${v >= 1 ? ' full' : ''}`}>{pct(v)}</span>
                <span className="sb-minibar" aria-hidden="true">
                  <i style={{ width: `${v * 100}%` }} />
                </span>
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
                        <span className="sb-bl" title="Se abre al terminar el bloque anterior">
                          <b>{n}</b>
                          <span>{b.titulo}</span>
                        </span>
                      )}
                      {actual && (
                        <ol className="sb-pasos">
                          {pasosDe(b).map((x) => {
                            const on = (pasoActual === 'problemas' ? 'demo' : pasoActual) === x.id;
                            return (
                              <li key={x.id}>
                                <Link to={`/ejercicio/${b.id}${x.id === 'concepto' ? '' : `?tab=${x.id}`}`} onClick={onNavegar} className={on ? 'on' : undefined} aria-current={on ? 'step' : undefined}>
                                  {x.label}
                                  {pasoOpcional(x.id) && <span className="sb-opc">opcional</span>}
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
                    <ol className="sb-bloques" aria-label={`Bloques de ${meta.corto}`}>
                      {bloquesDe(m).map(fila)}
                    </ol>
                  );
                }
                return (
                  <div className="sb-fases" aria-label={`Fases de ${meta.corto}`}>
                    {grupos.map((g) => {
                      const clave = `${m.id}:${g.id}`;
                      const vm = manual.en === enLoc ? manual.v : {};
                      const abierta = vm[clave] ?? g.id === faseAct;
                      const hechosF = g.bloques.filter((e) => ejercicioCompletado(p.ejercicios[e.id])).length;
                      const ui = FASE_UI[g.id];
                      // Fase sin bloques nuevos (p. ej. Ventas › Configurar): es un aviso, no una fase vacía que se abre
                      if (g.bloques.length === 0) {
                        return (
                          <Link key={g.id} to={`/modulo/${m.id}?fase=${g.id}`} className="sb-fase-info" onClick={onNavegar}>
                            <Icon name={ui.icono} size={16} />
                            <span className="sb-fase-t">{ui.titulo}</span>
                            <small>ya lo tienes, ver qué reutilizas</small>
                          </Link>
                        );
                      }
                      return (
                        <div key={g.id} className={`sb-fase${abierta ? ' abierta' : ''}${g.id === faseAct ? ' actual' : ''}`}>
                          <button
                            type="button"
                            className="sb-fase-cab"
                            aria-expanded={abierta}
                            aria-controls={`sb-fase-${clave}`}
                            onClick={() => {
                              setManual({ en: enLoc, v: { ...vm, [clave]: !abierta } });
                              // En la página del módulo, abrir una fase también cambia su pestaña
                              if (!abierta && !mBloque && mModulo === m.id) {
                                guardarFase(m.id, g.id);
                                navigate(`/modulo/${m.id}?fase=${g.id}`, { replace: true });
                              }
                            }}
                          >
                            <Icon name={ui.icono} size={16} />
                            <span className="sb-fase-t">{ui.titulo}</span>
                            <span className="sb-fase-n">
                              {hechosF}/{g.bloques.length}
                            </span>
                            <Icon name="chevron" size={14} />
                          </button>
                          {abierta && g.bloques.length > 0 && (
                            <ol className="sb-bloques" id={`sb-fase-${clave}`} aria-label={`${ui.titulo}: bloques de ${meta.corto}`}>
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

        <div className="sb-group">Practicar y demostrar</div>
        {PRACTICA.map((n) => (
          <NavLink key={n.to} to={n.to} className="sb-link" onClick={onNavegar} title={t(n.label)}>
            <span className="sb-ico">
              <Icon name={n.icon} />
            </span>
            <span className="sb-label">{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sb-foot">
        <button type="button" className="sb-btn" onClick={onTema} aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
          <Icon name={oscuro ? 'sol' : 'luna'} size={20} />
          <span>{oscuro ? 'Tema claro' : 'Tema oscuro'}</span>
        </button>
        <button type="button" className="sb-btn sq sb-collapse" onClick={onPlegar} aria-label={plegada ? 'Desplegar barra lateral' : 'Plegar barra lateral'} aria-expanded={!plegada}>
          <Icon name={plegada ? 'desplegar' : 'plegar'} size={20} />
        </button>
      </div>
    </aside>
  );
}
