import { useEffect, useMemo, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { META, MODULOS } from "../content";
import type { Modulo } from "../types";
import { ejercicioCompletado, useProgreso } from "../lib/progress";
import { avanceModulo } from "../lib/avance";
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
} from "../lib/ruta";
import { useNotas } from "../erp/practicas";
import { SIMS } from "../sims/registro";
import { Icon } from "../components/Icon";
import { FICHAS } from "./portadaDatos";

const metaDe = (m: Modulo) =>
  META[m.id] ?? { color: "#4fbfa5", icono: "maestros", corto: m.titulo };

/** Bloques con práctica en el ERP de práctica (se calcula para que no se desfase) */
const NUM_PRACTICAS = Object.keys(PRACTICAS_POR_EJERCICIO).length;

/** Primera frase de un texto (para el resumen corto del índice de módulos) */
const primeraFrase = (t: string) => {
  const m = t.match(/^.{20,}?\.(\s|$)/);
  return (m ? m[0] : t).trim();
};

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
  const nMod = continuar ? MODULOS.indexOf(continuar.modulo) : 0;
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
      : `Seguir: ${etiquetaPaso}`;

  const lead = !continuar
    ? "Has terminado todos los bloques. Te queda el examen final."
    : !empezado
      ? `Aprendes a trabajar con el ERP Axional Deister VNext en ${MODULOS.length} módulos, en orden. Si no tienes base de contabilidad ni de ERP, empieza por las dos guías de «Antes de empezar con Axional», aquí debajo.`
      : `Sigue donde lo dejaste. Son ${MODULOS.length} módulos, en orden.`;

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
    <section className="g-card gi-sec" aria-labelledby="como-h">
      <p className="g-kicker">Cómo se estudia</p>
      <h2 id="como-h">Cómo funciona un bloque</h2>
      <p className="gi-sec-txt">
        Cada bloque es una tarea real del ERP. Sigue estos pasos, en este
        orden. La Práctica solo está en {NUM_PRACTICAS} bloques; en el resto
        vas del Test a la Demo real.
      </p>
      <ol className="g-steps gi-pasos">
        {PASOS.map((x) => (
          <li key={x.id}>
            <b>{x.label}</b>
            {pasoOpcional(x.id) && <em className="gi-etq">Opcional</em>}
            {x.id === "erp" && <em className="gi-etq">En algunos bloques</em>}
            <span>{x.que}</span>
          </li>
        ))}
      </ol>
    </section>
  );

  /* Índice de módulos, como el índice de capítulos de las guías */
  const seccionRuta = (
    <section
      id="modulos"
      className="g-card gi-sec"
      aria-labelledby="mods-h"
    >
      <p className="g-kicker">Módulos de Axional</p>
      <h2 id="mods-h">Tu ruta</h2>
      <p className="gi-sec-txt">
        {MODULOS.length} módulos, en orden: cada uno usa lo que preparas en el
        anterior. Puedes entrar en cualquiera.
      </p>
      <ol className="gi-mods">
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
              <Link to={`/modulo/${m.id}`} className="gi-mod">
                <span className="gi-mod-ico" aria-hidden="true">
                  <Icon name={meta.icono} size={22} />
                </span>
                <span className="gi-mod-n" aria-hidden="true">
                  {i}
                </span>
                <span className="gi-mod-txt">
                  <strong>
                    <span className="sr-only">Módulo {i}: </span>
                    {meta.corto}
                    {hecho ? (
                      <em className="gi-etq ok">Hecho</em>
                    ) : toca ? (
                      <em className="gi-etq toca">
                        {av > 0 ? "En curso" : "Empieza aquí"}
                      </em>
                    ) : null}
                  </strong>
                  <span className="gi-mod-frase">
                    {primeraFrase(
                      ficha ? conIni(ficha.frase, ini) : conIni(m.resumen, ini),
                    )}
                  </span>
                </span>
                <span className="gi-mod-prog">
                  <span>
                    {hechos}/{bloques.length} bloques ·{" "}
                    {Math.max(1, Math.round(min / 60))} h
                  </span>
                  <span className="gi-barra" aria-hidden="true">
                    <i style={{ width: `${av * 100}%` }} />
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
    <div className="wrap gi">
      {/* ---------- Cabecera: saludo, qué es el curso y lo que toca ---------- */}
      <section className="g-hero gi-hero" aria-labelledby="ini-h1">
        <p className="g-kicker">Formación Axional Deister VNext</p>
        <h1 id="ini-h1">{nombre ? `Hola, ${nombre}.` : "Hola."}</h1>
        <p className="gi-lead">{lead}</p>

        <div className="gi-sigue">
          {continuar && metaCont ? (
            <>
              <p className="gi-sigue-donde">
                Te toca · Módulo {nMod}, {metaCont.corto} · Bloque {nBloque} de{" "}
                {nBloques}
              </p>
              <h2 className="gi-sigue-t">
                {conIni(continuar.ejercicio.titulo, ini)}
              </h2>
              <ol className="gi-sigue-pasos" aria-label="Pasos del bloque">
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
                      {estado === "hecho" && (
                        <Icon name="check" size={13} stroke={3} />
                      )}
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
            <h2 className="gi-sigue-t">Examen final</h2>
          )}
          <Link className="btn arc lg gi-cta" to={enlaceCont}>
            {textoCta}
            <Icon name="flecha" size={18} />
          </Link>
        </div>

        <dl className="gi-datos">
          {continuar && (
            <div>
              <dt>Duración del bloque</dt>
              <dd>
                {continuar.ejercicio.duracionMin} min
              </dd>
            </div>
          )}
          <div>
            <dt>Bloques hechos</dt>
            <dd>
              {totales.hechos} de {totales.total}
            </dd>
          </div>
          <div>
            <dt>Tiempo que te queda</dt>
            <dd>≈{totales.horas} h de bloques</dd>
          </div>
        </dl>
      </section>

      {/* ---------- Formación previa ---------- */}
      <section className="g-card gi-previa" aria-labelledby="previa-h">
        <div className="gi-previa-txt">
          <p className="g-kicker">Formación previa</p>
          <h2 id="previa-h">Antes de empezar con Axional</h2>
          <p>
            Dos guías para llegar con base: contabilidad general y qué es un
            ERP. Te recomendamos hacerlas antes del módulo 0. Cada una acaba
            con su examen.
          </p>
          <Link to="/formacion" className="btn gi-previa-btn">
            Ver las dos guías
          </Link>
        </div>
        <ol className="gi-previa-lista">
          <li>
            <Link to="/formacion/contabilidad">
              <b>1</b>
              <span>
                <strong>Conceptos de contabilidad general</strong>
                <small>Debe y haber, balance, resultados y partida doble.</small>
              </span>
              <Icon name="chevron" size={16} />
            </Link>
          </li>
          <li>
            <Link to="/formacion/erp">
              <b>2</b>
              <span>
                <strong>Qué es un ERP</strong>
                <small>Para qué sirve y cómo se organiza Axional.</small>
              </span>
              <Icon name="chevron" size={16} />
            </Link>
          </li>
        </ol>
      </section>

      {seccionRuta}
      {seccionComo}

      {/* ---------- Además ---------- */}
      <section className="g-card gi-sec" aria-labelledby="mas-h">
        <p className="g-kicker">Practicar y demostrar</p>
        <h2 id="mas-h">Para practicar y repasar</h2>
        <ul className="gi-mas">
          <li>
            <Link to="/erp">
              <Icon name="compras" size={20} />
              <span>
                <strong>ERP de práctica</strong>
                <small>
                  Un ERP simulado dentro de esta web: grabas datos y te corrige
                  al momento.
                </small>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/taller">
              <Icon name="taller" size={20} />
              <span>
                <strong>Taller</strong>
                <small>
                  Simuladores para repasar lo que más cuesta al principio.{" "}
                  {simsHechos} de {SIMS.length} superados.
                </small>
              </span>
            </Link>
          </li>
          <li>
            <Link to={examenEstado.to}>
              <Icon name={ex.aprobado ? "logros" : "examen"} size={20} />
              <span>
                <strong>{examenEstado.b}</strong>
                <small>{examenEstado.t}</small>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/video">
              <Icon name="video" size={20} />
              <span>
                <strong>Vídeos</strong>
                <small>
                  Tutoriales y sesiones grabadas, ordenados por módulo.
                </small>
              </span>
            </Link>
          </li>
          <li>
            <Link to="/glosario">
              <Icon name="libro" size={20} />
              <span>
                <strong>Glosario</strong>
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
  );
}
