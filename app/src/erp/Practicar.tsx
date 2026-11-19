/* Espacio de práctica: el ERP a todo el ancho; el enunciado y la corrección se abren encima cuando los pides. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { confeti } from '../sims/kit';
import { ErpApp } from './ErpApp';
import { useDb } from './modelo';
import { type Practica, PRACTICAS, puntuar, registrarNota, txtIni, useNotas } from './practicas';

function Nota({ valor }: { valor: number }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="pr-nota" aria-label={`Nota ${Math.round(valor * 10)} sobre 10`}>
      <circle cx="40" cy="40" r={r} fill="none" stroke="var(--line)" strokeWidth="7" />
      <motion.circle cx="40" cy="40" r={r} fill="none" stroke={valor >= 0.8 ? 'var(--arc)' : 'var(--signal)'} strokeWidth="7" strokeLinecap="round" strokeDasharray={c} initial={false} animate={{ strokeDashoffset: c * (1 - valor) }} transform="rotate(-90 40 40)" />
      <text x="40" y="46" textAnchor="middle" fontSize="20" fontWeight="800" fill="var(--ink)">
        {(valor * 10).toFixed(1).replace('.', ',')}
      </text>
    </svg>
  );
}

export function PanelPractica({ practica, ini, compacto, onCerrar }: { practica: Practica; ini: string; compacto?: boolean; onCerrar?: () => void }) {
  const db = useDb();
  const reducir = !!useReducedMotion();
  const notas = useNotas();
  const { res, total, logrado, nota } = puntuar(practica, db, ini);
  const [abierta, setAbierta] = useState<number | null>(null);
  const previo = useRef(nota);
  useEffect(() => {
    if (nota > 0) registrarNota(practica.id, nota);
    if (nota >= 1 && previo.current < 1) confeti(reducir, true, '#4fbfa5');
    previo.current = nota;
  }, [nota, practica.id, reducir]);
  const t = (s: string) => txtIni(s, ini || 'XX');
  const mejor = notas[practica.id]?.nota ?? 0;

  return (
    <aside className={`pr-panel${compacto ? ' compacto' : ''}`} aria-label={`Enunciado: ${practica.titulo}`}>
      <header className="pr-cab">
        <div>
          <p className="pr-kicker">Práctica en el ERP · {practica.minutos} min</p>
          <h2>{practica.titulo}</h2>
        </div>
        <Nota valor={nota} />
        {onCerrar && (
          <button type="button" className="pr-cerrar" onClick={onCerrar} aria-label="Ocultar el enunciado">
            Ocultar
          </button>
        )}
      </header>
      {!ini && <p className="pr-alerta">Pon tus iniciales en la plataforma: todos tus códigos las llevan y la corrección las busca.</p>}
      <div className="pr-datos">
        {practica.datos.map((d) => (
          <div key={d.campo}>
            <span>{d.campo}</span>
            <code>{t(d.valor)}</code>
          </div>
        ))}
      </div>
      <ol className="pr-pasos">
        {practica.enunciado.map((p, i) => (
          <li key={i}>{t(p)}</li>
        ))}
      </ol>
      <div className="pr-checks">
        <div className="pr-checks-top">
          <h3>Corrección automática</h3>
          <span className="pr-puntos">
            {logrado} / {total} puntos
          </span>
        </div>
        <div className="pr-barra" aria-hidden="true">
          <motion.i initial={false} animate={{ width: `${nota * 100}%` }} />
        </div>
        <ul>
          {res.map((c, i) => (
            <li key={i} className={c.hecho ? 'ok' : ''}>
              <button type="button" onClick={() => setAbierta(abierta === i ? null : i)} aria-expanded={abierta === i}>
                <motion.span className="pr-tick" animate={c.hecho && !reducir ? { scale: [1, 1.3, 1] } : { scale: 1 }}>
                  {c.hecho ? '✓' : ''}
                </motion.span>
                <span className="pr-txt">{t(c.texto)}</span>
                <span className="pr-pt">{c.puntos}</span>
              </button>
              <AnimatePresence>
                {abierta === i && !c.hecho && (
                  <motion.p className="pr-pista" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                    Pista: {t(c.pista)}
                  </motion.p>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
        {nota >= 1 ? (
          <p className="pr-fin">Práctica superada: todo lo que has grabado cuadra.</p>
        ) : (
          mejor > 0 && <p className="pr-mejor">Se corrige sola mientras trabajas. Mejor nota: {(mejor * 10).toFixed(1).replace('.', ',')}</p>
        )}
      </div>
    </aside>
  );
}

/** Tira de arriba: qué práctica es, qué comprobación falta y botón para ver el enunciado */
function Tira({ practica, ini, abierto, onAbrir }: { practica: Practica; ini: string; abierto: boolean; onAbrir: () => void }) {
  const db = useDb();
  const { res, logrado, total, nota } = puntuar(practica, db, ini);
  const falta = res.find((c) => !c.hecho);
  const t = (s: string) => txtIni(s, ini || 'XX');
  return (
    <div className="pr-tira">
      <div className="pr-tira-txt">
        <strong>{practica.titulo}</strong>
        <span>{nota >= 1 ? 'Práctica superada: todo lo que has grabado cuadra.' : logrado === 0 && practica.enunciado[0] ? `Empieza: ${t(practica.enunciado[0])}` : falta ? `Te falta: ${t(falta.texto)}` : ''}</span>
      </div>
      <span className="pr-tira-pt">
        {logrado}/{total} puntos
      </span>
      <button type="button" className="btn sm" aria-expanded={abierto} aria-haspopup="dialog" onClick={onAbrir}>
        {abierto ? 'Ocultar enunciado' : 'Ver enunciado y corrección'}
      </button>
    </div>
  );
}

/** ERP a todo el ancho con el enunciado plegable encima. Con varias prácticas, pestañas para cambiar. */
export function Practicar({ ids, ini, alto }: { ids: string[]; ini: string; alto?: string }) {
  const lista = ids.map((id) => PRACTICAS.find((p) => p.id === id)).filter((p): p is Practica => !!p);
  const [actual, setActual] = useState(lista[0]?.id ?? '');
  const [abierto, setAbierto] = useState(false);
  const pr = lista.find((p) => p.id === actual) ?? lista[0];
  const notas = useNotas();
  if (!pr) return null;
  return (
    <div className="pr-espacio pr-ancho" style={alto ? { ['--pr-alto' as string]: alto } : undefined}>
      {lista.length > 1 && (
        <p className="pr-orden">
          Práctica {lista.indexOf(pr) + 1} de {lista.length}.
          {lista.indexOf(pr) < lista.length - 1 ? (
            <button type="button" className="pr-orden-sig" onClick={() => setActual(lista[lista.indexOf(pr) + 1].id)}>
              Ir a la práctica {lista.indexOf(pr) + 2}: {lista[lista.indexOf(pr) + 1].titulo}
            </button>
          ) : (
            <button type="button" className="pr-orden-sig" onClick={() => setActual(lista[0].id)}>
              Volver a la práctica 1
            </button>
          )}
          {(notas[pr.id]?.nota ?? 0) >= 1 && <span className="pr-sel-ok"> ✓ superada</span>}
        </p>
      )}
      <Tira practica={pr} ini={ini} abierto={abierto} onAbrir={() => setAbierto((v) => !v)} />
      <div className={`pr-lienzo${abierto ? ' con-panel' : ''}`}>
        <div className="pr-erp">
          <ErpApp key={pr.id} ini={ini} inicial={pr.pantalla} />
        </div>
        {abierto && (
          <div className="pr-flota" role="dialog" aria-label={`Enunciado: ${pr.titulo}`}>
            <PanelPractica practica={pr} ini={ini} onCerrar={() => setAbierto(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
