import { Link } from 'react-router-dom';
import { GUIAS, ORDEN_GUIAS, fmtPct, leidosDe, usePrevia } from '../../lib/previa';
import './previa.css';

/** Portada de la formación previa «Antes de empezar con Axional» */
export default function Formacion() {
  const e = usePrevia();
  return (
    <div className="pv-portada">
      <header className="pv-hero">
        <div className="kicker">Formación previa · Cultura general</div>
        <h1>Antes de empezar con Axional</h1>
        <p>
          Esta formación previa reúne dos guías de base, del nivel de un primer curso universitario: los conceptos de contabilidad general y
          qué es un ERP. No hace falta saber nada antes.
        </p>
        <p>
          Léelas en orden y aprueba el examen de cada una antes de empezar el curso por el módulo 0, Fundamentos. Fundamentos no repite esta
          teoría: la repasa con las cifras del caso del curso.
        </p>
      </header>

      <div className="pv-tarjetas">
        {ORDEN_GUIAS.map((slug) => {
          const g = GUIAS[slug];
          const leidos = leidosDe(e, slug);
          const total = g.capitulos.length;
          const ex = e.examenes[slug];
          const mejor = ex.mejor;
          return (
            <article className="pv-tarjeta" key={slug} aria-labelledby={`pv-t-${slug}`}>
              <div className="pv-num">Apartado {g.orden}</div>
              <h2 id={`pv-t-${slug}`}>
                {g.orden}. {g.titulo}
              </h2>
              <p className="sub">Guía «{g.guia}»</p>
              <p>{g.resumen}</p>
              <dl>
                <dt>Capítulos</dt>
                <dd>{total} capítulos, glosario y fuentes</dd>
                <dt>Tiempo</dt>
                <dd>{g.lectura}</dd>
                <dt>Leídos</dt>
                <dd>
                  {leidos} de {total}
                  <div
                    className="trk"
                    role="progressbar"
                    aria-label={`Capítulos leídos de ${g.titulo}`}
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={leidos}
                  >
                    <i style={{ width: `${Math.round((leidos / total) * 100)}%` }} />
                  </div>
                </dd>
                <dt>Examen</dt>
                <dd>
                  {!mejor ? (
                    <span className="pv-estado">No hecho</span>
                  ) : mejor.aprobado ? (
                    <span className="pv-estado ok">Aprobado · {fmtPct(mejor.pct)} %</span>
                  ) : (
                    <span className="pv-estado ko">Mejor nota {fmtPct(mejor.pct)} % · sin aprobar</span>
                  )}
                  {ex.intentos > 0 && (
                    <span className="sub">
                      {' '}
                      · {ex.intentos} {ex.intentos === 1 ? 'intento' : 'intentos'}
                    </span>
                  )}
                  <div className="sub">{g.examen} · aprobado con el 70 %</div>
                </dd>
              </dl>
              <div className="acciones">
                <Link className="pv-btn pri" to={`/formacion/${slug}`}>
                  {leidos > 0 && leidos < total ? 'Seguir leyendo' : 'Leer la guía'}
                </Link>
                <Link className="pv-btn" to={`/formacion/${slug}/examen`}>
                  Hacer el examen
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <div className="pv-nota">
        <p>
          <b>Cómo se cuenta tu avance.</b> Un capítulo queda leído cuando llegas a su final. El examen guarda tus intentos y tu mejor nota en
          este navegador. Hazlo sin consultar la guía.
        </p>
      </div>
    </div>
  );
}
