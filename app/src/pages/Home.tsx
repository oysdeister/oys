import {
  Component,
  Suspense,
  lazy,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { META, MODULOS } from "../content";
import type { Modulo } from "../types";
import { ejercicioCompletado, useProgreso } from "../lib/progress";
import { avanceGlobal, avanceModulo } from "../lib/avance";
import { useExamen } from "../lib/examen";
import { PRACTICAS_POR_EJERCICIO } from "../erp/practicas";
import { conIni } from "../lib/texto";
import {
  bloqueQueToca,
  bloquesDe,
  bloquesObligatorios,
  numeroBloque,
  pasoOpcional,
  pasoQueToca,
  pasosDe,
  pasosHechos,
  PASOS,
  type PasoId,
} from "../lib/ruta";
import { useNotas } from "../erp/practicas";
import { SIMS } from "../sims/registro";
import { Icon } from "../components/Icon";
import { NucleoOrbita } from "../components/shell/NucleoOrbita";
import { FICHAS } from "./portadaDatos";
import { hayWebGL, type PlanetaDato } from "../components/escena3d/tipos";
import "../components/escena3d/escena3d.css";
import "./inicio.css";

const EscenaPortada = lazy(
  () => import("../components/escena3d/EscenaPortada"),
);
const metaDe = (m: Modulo) =>
  META[m.id] ?? { color: "#4fbfa5", icono: "maestros", corto: m.titulo };

/** Icono de cada paso del bloque (tira «Cómo funciona» y pasos de la tarjeta de seguir) */
/** Bloques con práctica en el ERP de práctica (se calcula para que no se desfase) */
const NUM_PRACTICAS = Object.keys(PRACTICAS_POR_EJERCICIO).length;

const ICONO_PASO: Record<PasoId, string> = {
  concepto: "libro",
  guiado: "play",
  memoria: "cerebro",
  test: "examen",
  erp: "engranaje",
  demo: "rayo",
};

function useMedia(q: string) {
  const [si, setSi] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const f = () => setSi(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, [q]);
  return si;
}

/** Si la escena 3D falla, se queda el núcleo estático con el % */
class Respaldo extends Component<
  { alternativa: ReactNode; children: ReactNode },
  { fallo: boolean }
> {
  state = { fallo: false };
  static getDerivedStateFromError() {
    return { fallo: true };
  }
  componentDidCatch() {
    /* el núcleo estático toma el relevo */
  }
  render() {
    return this.state.fallo ? this.props.alternativa : this.props.children;
  }
}

/** Arco O&S en 3D con los módulos en órbita. Solo en pantallas anchas y si hay WebGL: en móvil carga más rápido sin él. */
function Escena({ global, activo }: { global: number; activo?: string }) {
  const p = useProgreso();
  const reducir = !!useReducedMotion();
  const ancha = useMedia("(min-width: 1320px)");
  const navegar = useNavigate();
  const [webgl] = useState(() => {
    const ahorro = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    return !ahorro && hayWebGL();
  });
  const planetas: PlanetaDato[] = useMemo(
    () =>
      MODULOS.map((m) => {
        const meta = metaDe(m);
        return {
          id: m.id,
          nombre: meta.corto,
          color: meta.color.startsWith("#") ? meta.color : "#5fe3c6",
          icono: meta.icono,
          valor: avanceModulo(p, m.id),
        };
      }),
    [p],
  );
  const estatico = (
    <div className="ini-nucleo" aria-hidden="true">
      <NucleoOrbita valor={global} size={ancha ? 260 : 132} />
    </div>
  );
  if (!webgl || !ancha) return estatico;
  return (
    <div className="ini-escena" aria-hidden="true">
      <Respaldo alternativa={estatico}>
        <Suspense
          fallback={<div className="ini-escena-carga" aria-hidden="true" />}
        >
          <EscenaPortada
            planetas={planetas}
            global={global}
            activo={activo}
            reducir={reducir}
            centrada
            onIr={(id) => navegar(`/modulo/${id}`)}
          />
        </Suspense>
      </Respaldo>
    </div>
  );
}

export default function Home() {
  const p = useProgreso();
  const ex = useExamen();
  const loc = useLocation();
  const reducir = useReducedMotion();
  const ini = p.alumno.ini;
  const nombre = p.alumno.nombre.split(/\s+/)[0] ?? "";
  const notasErp = useNotas();

  useEffect(() => {
    if (loc.hash !== "#modulos") return;
    const t = setTimeout(
      () =>
        document.getElementById("modulos")?.scrollIntoView({
          behavior: reducir ? "auto" : "smooth",
          block: "start",
        }),
      350,
    );
    return () => clearTimeout(t);
  }, [loc.hash, reducir]);

  // Lo que toca: el primer bloque obligatorio sin terminar, en el orden del curso, y su paso
  const continuar = useMemo(() => {
    for (const m of MODULOS) {
      const b = bloqueQueToca(p, m);
      if (b) return { modulo: m, ejercicio: b };
    }
    return null;
  }, [p]);

  const global = avanceGlobal(p);
  const totales = useMemo(() => {
    let total = 0;
    let hechos = 0;
    let minPend = 0;
    for (const m of MODULOS) {
      for (const e of bloquesObligatorios(m)) {
        total += 1;
        if (ejercicioCompletado(p.ejercicios[e.id])) hechos += 1;
        else minPend += e.duracionMin;
      }
    }
    return { total, hechos, horas: Math.max(1, Math.round(minPend / 60)) };
  }, [p]);

  const empezado = Object.keys(p.ejercicios).length > 0;
  const simsHechos = SIMS.filter((s) => p.sims[s.id]).length;
  const pasoCont = continuar
    ? pasoQueToca(p, continuar.ejercicio, notasErp)
    : "concepto";
  const enlaceCont = continuar
    ? `/ejercicio/${continuar.ejercicio.id}${pasoCont === "concepto" ? "" : `?tab=${pasoCont}`}`
    : "/examen";
  const metaCont = continuar ? metaDe(continuar.modulo) : null;
  const nMod = continuar ? MODULOS.indexOf(continuar.modulo) + 1 : 0;
  const nBloque = continuar
    ? numeroBloque(continuar.modulo, continuar.ejercicio.id)
    : 0;
  const nBloques = continuar ? bloquesDe(continuar.modulo).length : 0;
  const pasos = continuar ? pasosDe(continuar.ejercicio) : [];
  const hechosPaso = continuar
    ? pasosHechos(p, continuar.ejercicio, notasErp)
    : null;
  const etiquetaPaso =
    PASOS.find((x) => x.id === pasoCont)?.label ?? "Concepto";
  const textoCta = !continuar
    ? "Ir al examen final"
    : !empezado
      ? "Empezar el primer bloque"
      : `Seguir con el ${etiquetaPaso}`;

  const lead = !continuar
    ? "Has terminado todos los bloques. Te queda el examen final."
    : !empezado
      ? `Son ${MODULOS.length} módulos, en orden. Cada bloque es una tarea del ERP: lees la idea, la haces paso a paso y la repites en la Demo real.`
      : "Sigue donde lo dejaste.";

  const examenEstado = ex.aprobado
    ? {
        t: "Aprobado. Descarga tu certificado.",
        to: "/certificado",
        b: "Certificado",
      }
    : ex.actual && !ex.actual.fin
      ? { t: "Tienes un examen a medias.", to: "/examen", b: "Examen final" }
      : {
          t: "Teoría y un caso práctico completo en la Demo real.",
          to: "/examen",
          b: "Examen final",
        };

  /* Cómo funciona un bloque: los pasos */
  const seccionComo = (
    <section className="ini-sec" aria-labelledby="como-h">
      <header className="ini-sec-cab">
        <h2 id="como-h">Cómo funciona un bloque</h2>
        <p>
          Un bloque es una tarea del ERP. Sigue estos pasos, en este orden. La
          Práctica solo está en {NUM_PRACTICAS} bloques; el resto va del Test a la Demo real.
        </p>
      </header>
      <ol className="ini-pasos">
        {PASOS.map((x, i) => (
          <li
            key={x.id}
            className={x.id === "erp" || pasoOpcional(x.id) ? "opc" : undefined}
          >
            <span className="ini-paso-ico" aria-hidden="true">
              <Icon name={ICONO_PASO[x.id]} size={22} />
            </span>
            <b>
              <span className="ini-paso-n" aria-hidden="true">
                {i + 1}
              </span>
              {x.label}
            </b>
            <span>{x.que}</span>
            {pasoOpcional(x.id) && <em>Opcional</em>}
            {x.id === "erp" && <em>En algunos bloques</em>}
          </li>
        ))}
      </ol>
      <div className="ini-notas">
        <p>
          <Icon name="engranaje" size={18} />
          <span>
            La <b>Práctica</b> es el ERP de práctica: un ERP simulado dentro de
            esta web que se corrige solo. La <b>Demo real</b> es el ERP de demostración de
            Deister, en otra pestaña.
          </span>
        </p>
        <p>
          <Icon name="aviso" size={18} />
          <span>
            <b>No necesitas formación previa.</b> El curso empieza por lo
            básico en «Datos maestros». Si ya conoces el ERP o la contabilidad,
            empieza donde quieras.
          </span>
        </p>
      </div>
    </section>
  );

  /* Tu ruta: los módulos en orden (va primero si ya has empezado) */
  const seccionRuta = (
    <section id="modulos" className="ini-sec" aria-labelledby="mods-h">
      <header className="ini-sec-cab">
        <h2 id="mods-h">Tu ruta</h2>
        <p>
          {MODULOS.length} módulos, en orden: cada uno usa lo que montaste en el
          anterior. Puedes entrar en cualquiera.
        </p>
      </header>
      <ol className="ini-mods">
        {MODULOS.map((m, i) => {
          const meta = metaDe(m);
          const ficha = FICHAS[m.id];
          const av = avanceModulo(p, m.id);
          const bloques = bloquesObligatorios(m);
          const min = bloques.reduce((s2, e) => s2 + e.duracionMin, 0);
          const hechos = bloques.filter((e) =>
            ejercicioCompletado(p.ejercicios[e.id]),
          ).length;
          const hecho = hechos === bloques.length && hechos > 0;
          const toca = m.id === continuar?.modulo.id;
          return (
            <li
              key={m.id}
              className={`${hecho ? "hecho" : ""}${toca ? " toca" : ""}`}
              style={{ ["--mod" as string]: meta.color } as CSSProperties}
            >
              <Link to={`/modulo/${m.id}`} className="ini-mod">
                <span className="ini-mod-cab">
                  <span className="ini-mod-ico" aria-hidden="true">
                    <Icon name={meta.icono} size={22} />
                  </span>
                  <span className="ini-mod-n">Módulo {i + 1}</span>
                  {hecho ? (
                    <em className="ini-chip ok">
                      <Icon name="check" size={14} stroke={3} /> Hecho
                    </em>
                  ) : toca ? (
                    <em className="ini-chip">
                      {av > 0 ? "En curso" : "Empieza aquí"}
                    </em>
                  ) : null}
                </span>
                <strong>{meta.corto}</strong>
                <span className="ini-mod-frase">
                  {ficha ? conIni(ficha.frase, ini) : conIni(m.resumen, ini)}
                </span>
                <span className="ini-mod-pie">
                  <span className="ini-barra" aria-hidden="true">
                    <i style={{ width: `${av * 100}%` }} />
                  </span>
                  <span className="ini-mod-meta">
                    <span>
                      {hechos}/{bloques.length} bloques ·{" "}
                      {Math.max(1, Math.round(min / 60))} h
                    </span>
                    <b>{Math.round(av * 100)} %</b>
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );

  return (
    <div className="home ini">
      {/* ---------- Cabecera: saludo, lo que toca y el arco O&S ---------- */}
      <section className="ini-hero" aria-labelledby="ini-h1">
        <div className="ini-copy">
          <p className="ini-eyebrow">
            <span className="ini-punto" aria-hidden="true" />
            Formación Axional Deister VNext
          </p>
          <h1 id="ini-h1" className="ini-hola">
            {nombre ? (
              <>
                Hola, <span className="ini-brillo">{nombre}</span>.
              </>
            ) : (
              "Hola."
            )}
          </h1>
          <p className="ini-lead">{lead}</p>

          <div
            className="ini-sigue"
            style={
              metaCont
                ? ({ ["--mod" as string]: metaCont.color } as CSSProperties)
                : undefined
            }
          >
            {continuar && metaCont ? (
              <>
                <div className="ini-sigue-cab">
                  <span className="ini-sigue-ico" aria-hidden="true">
                    <Icon name={metaCont.icono} size={22} />
                  </span>
                  <span className="ini-sigue-donde">
                    <b>
                      Módulo {nMod} · {metaCont.corto}
                    </b>
                    <small>
                      Bloque {nBloque} de {nBloques}
                    </small>
                  </span>
                </div>
                <h2 className="ini-sigue-t">
                  {conIni(continuar.ejercicio.titulo, ini)}
                </h2>
                <ol className="ini-sigue-pasos" aria-label="Pasos del bloque">
                  {pasos.map((x) => {
                    const estado =
                      x.id === pasoCont
                        ? "ahora"
                        : hechosPaso?.[x.id]
                          ? "hecho"
                          : "";
                    return (
                      <li
                        key={x.id}
                        className={estado}
                        aria-current={estado === "ahora" ? "step" : undefined}
                      >
                        <span aria-hidden="true">
                          {estado === "hecho" ? (
                            <Icon name="check" size={13} stroke={3} />
                          ) : (
                            <Icon name={ICONO_PASO[x.id]} size={12} />
                          )}
                        </span>
                        {x.label}
                        {pasoOpcional(x.id) && <small> · opcional</small>}
                        {estado === "hecho" && (
                          <span className="sr-only"> (hecho)</span>
                        )}
                        {estado === "ahora" && (
                          <span className="sr-only"> (toca ahora)</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </>
            ) : (
              <h2 className="ini-sigue-t">Examen final</h2>
            )}
            <Link className="btn arc lg ini-cta" to={enlaceCont}>
              {textoCta}
            </Link>
          </div>

          <dl className="ini-datos">
            <div>
              <dt>Bloques hechos</dt>
              <dd>
                {totales.hechos}
                <small> de {totales.total}</small>
              </dd>
            </div>
            <div>
              <dt>Tiempo que te queda</dt>
              <dd>
                ≈{totales.horas}
                <small> h de bloques</small>
              </dd>
            </div>
          </dl>
        </div>
        <Escena global={global} activo={continuar?.modulo.id} />
      </section>

      <div className="ini-cuerpo">
        {empezado ? (
          <>
            {seccionRuta}
            {seccionComo}
          </>
        ) : (
          <>
            {seccionComo}
            {seccionRuta}
          </>
        )}

        {/* ---------- Además ---------- */}
        <section className="ini-sec" aria-labelledby="mas-h">
          <header className="ini-sec-cab">
            <h2 id="mas-h">Además</h2>
          </header>
          <ul className="ini-mas">
            <li>
              <Link to="/taller" className="ini-mas-a">
                <span className="ini-mas-ico" aria-hidden="true">
                  <Icon name="taller" size={22} />
                </span>
                <span>
                  <b>Taller</b>
                  <small>
                    Simuladores para repasar lo que más cuesta al principio.{" "}
                    {simsHechos} de {SIMS.length} superados.
                  </small>
                </span>
              </Link>
            </li>
            <li>
              <Link to={examenEstado.to} className="ini-mas-a">
                <span className="ini-mas-ico" aria-hidden="true">
                  <Icon name={ex.aprobado ? "logros" : "examen"} size={22} />
                </span>
                <span>
                  <b>{examenEstado.b}</b>
                  <small>{examenEstado.t}</small>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/glosario" className="ini-mas-a">
                <span className="ini-mas-ico" aria-hidden="true">
                  <Icon name="libro" size={22} />
                </span>
                <span>
                  <b>Glosario</b>
                  <small>
                    Las palabras del ERP y de contabilidad, explicadas sin
                    tecnicismos.
                  </small>
                </span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
