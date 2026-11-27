import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  GUIAS,
  cargarGuia,
  conImagenes,
  esSlugPrevia,
  leidosDe,
  marcarLeido,
  usePrevia,
  type GuiaPreviaDatos,
  type SlugPrevia,
} from '../../lib/previa';
import './previa.css';

/** Guía de la formación previa: página nativa con todo el contenido abierto */
export default function GuiaPrevia() {
  const { guia } = useParams();
  if (!esSlugPrevia(guia)) return <Navigate to="/formacion" replace />;
  return <Guia key={guia} slug={guia} />;
}

function Guia({ slug }: { slug: SlugPrevia }) {
  const [datos, setDatos] = useState<GuiaPreviaDatos | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let vivo = true;
    cargarGuia(slug).then(
      (d) => vivo && setDatos(d),
      () => vivo && setError(true),
    );
    return () => {
      vivo = false;
    };
  }, [slug]);

  if (error)
    return (
      <div className="pv-cargando" role="alert">
        No se ha podido cargar la guía. Recarga la página. <Link to="/formacion">Volver a la formación previa</Link>
      </div>
    );
  if (!datos)
    return (
      <div className="pv-cargando" role="status">
        Cargando la guía…
      </div>
    );
  return <Contenido datos={datos} />;
}

function Contenido({ datos }: { datos: GuiaPreviaDatos }) {
  const slug = datos.slug;
  const info = GUIAS[slug];
  const e = usePrevia();
  const leidos = e.leidos[slug];
  const nLeidos = leidosDe(e, slug);
  const total = info.capitulos.length;
  const [abierto, setAbierto] = useState(false);
  const [activo, setActivo] = useState(datos.capitulos[0]?.id ?? '');
  const raiz = useRef<HTMLDivElement>(null);
  const idDe = (c: string) => `pv-${slug}-${c}`;

  const capitulos = useMemo(
    () => datos.capitulos.map((c) => ({ ...c, html: conImagenes(c.html), titulo: conImagenes(c.titulo), lead: conImagenes(c.lead) })),
    [datos],
  );

  // Arriba del todo al entrar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Capítulo leído al llegar a su final; capítulo activo para el índice
  useEffect(() => {
    const el = raiz.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const fin = new IntersectionObserver(
      (entradas) => {
        for (const en of entradas) {
          if (!en.isIntersecting) continue;
          const id = (en.target as HTMLElement).dataset.cap;
          if (id) marcarLeido(slug, id);
        }
      },
      { threshold: 0 },
    );
    el.querySelectorAll<HTMLElement>('.pv-fin').forEach((s) => fin.observe(s));
    const act = new IntersectionObserver(
      (entradas) => {
        const vis = entradas.filter((en) => en.isIntersecting);
        if (vis.length) {
          const id = (vis[0].target as HTMLElement).dataset.cap;
          if (id) setActivo(id);
        }
      },
      { rootMargin: '-20% 0px -70% 0px' },
    );
    el.querySelectorAll<HTMLElement>('section.pv-ch').forEach((s) => act.observe(s));
    return () => {
      fin.disconnect();
      act.disconnect();
    };
  }, [slug, capitulos]);

  const irA = (cap: string) => {
    const destino = document.getElementById(idDe(cap));
    if (!destino) return;
    // primero se pliega el índice del móvil; se desplaza cuando ya no ocupa sitio
    setAbierto(false);
    setActivo(cap);
    requestAnimationFrame(() => {
      const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      destino.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth', block: 'start' });
      const h2 = destino.querySelector('h2');
      if (h2) {
        h2.setAttribute('tabindex', '-1');
        h2.focus({ preventScroll: true });
      }
    });
  };

  // Anclas internas (#c3…): no deben tocar el HashRouter
  const alClic = (ev: MouseEvent<HTMLDivElement>) => {
    const a = (ev.target as HTMLElement).closest('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('#') && !href.startsWith('#/')) {
      ev.preventDefault();
      irA(href.slice(1));
    }
  };

  const actual = capitulos.find((c) => c.id === activo);

  return (
    <div className="pv-guia" ref={raiz} onClick={alClic}>
      <nav className="pv-nav" aria-label={`Índice de «${datos.navTitulo}»`}>
        <div className="pv-brand">Antes de empezar · Apartado {info.orden}</div>
        <h2>{datos.navTitulo}</h2>
        <button
          type="button"
          className="pv-indice-btn"
          aria-expanded={abierto}
          aria-controls={`pv-indice-${slug}`}
          onClick={() => setAbierto((v) => !v)}
        >
          <span>Índice</span>
          <span className="act">{actual ? `${actual.nav}. ${actual.navTitulo}` : ''}</span>
          <span className="chev" aria-hidden="true">
            ▾
          </span>
        </button>
        <div className={`pv-nav-cuerpo${abierto ? ' abierto' : ''}`} id={`pv-indice-${slug}`}>
          <ol>
            {capitulos.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} aria-current={activo === c.id ? 'true' : undefined}>
                  <span className="n">{c.nav}</span>
                  {c.navTitulo}
                  {leidos.includes(c.id) && info.capitulos.includes(c.id) && (
                    <span className="ok" aria-label="leído" title="Leído">
                      ✓
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ol>
          <div className="pv-nav-pie">
            <div className="pv-avance">
              {nLeidos} de {total} capítulos leídos
              <div className="trk" aria-hidden="true">
                <i style={{ width: `${Math.round((nLeidos / total) * 100)}%` }} />
              </div>
            </div>
            <Link className="pv-btn pri" to={`/formacion/${slug}/examen`}>
              Hacer el examen
            </Link>
            <Link className="pv-volver" to="/formacion">
              ← Antes de empezar con Axional
            </Link>
          </div>
        </div>
      </nav>

      <div className="pv-main">
        <Link className="pv-volver" to="/formacion">
          ← Antes de empezar con Axional
        </Link>
        <header className="pv-hero">
          <div className="kicker">{datos.kicker}</div>
          <h1>{datos.titulo}</h1>
          {datos.heroHtml.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          <p className="pv-hero-meta">
            {total} capítulos · {info.lectura} · {nLeidos} leídos
          </p>
        </header>

        {capitulos.map((c) => (
          <section className="pv-ch" id={idDe(c.id)} data-cap={c.id} key={c.id} aria-labelledby={`${idDe(c.id)}-t`}>
            <div className="pv-num">
              {c.num}
              {leidos.includes(c.id) && info.capitulos.includes(c.id) && <span className="leido">✓ Leído</span>}
            </div>
            <h2 id={`${idDe(c.id)}-t`} dangerouslySetInnerHTML={{ __html: c.titulo }} />
            {c.lead && <p className="pv-lead" dangerouslySetInnerHTML={{ __html: c.lead }} />}
            <div className="pv-cuerpo" dangerouslySetInnerHTML={{ __html: c.html }} />
            <span className="pv-fin" data-cap={c.id} aria-hidden="true" />
          </section>
        ))}

        <section className="pv-cierre" aria-labelledby={`pv-cierre-${slug}`}>
          <h2 id={`pv-cierre-${slug}`}>Has llegado al final de la guía</h2>
          <p>
            Ahora haz el examen, sin consultar la guía: {info.examen}. Se aprueba con el 70 %. El examen se corrige solo y explica cada respuesta.
          </p>
          <div className="acciones">
            <Link className="pv-btn pri" to={`/formacion/${slug}/examen`}>
              Hacer el examen
            </Link>
            <Link className="pv-btn" to="/formacion">
              Volver a la formación previa
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
