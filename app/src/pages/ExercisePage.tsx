import { Glosa } from '../components/Glosario';
import { useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { META, getEjercicio } from '../content';
import { useProgreso } from '../lib/progress';
import { conIni } from '../lib/texto';
import { Icon } from '../components/Icon';
import { Concepto } from '../components/exercise/Concepto';
import { Guiado } from '../components/exercise/Guiado';
import { DeMemoria } from '../components/exercise/DeMemoria';
import { TestEj } from '../components/exercise/TestEj';
import { DemoReal } from '../components/exercise/DemoReal';
import { Practicar } from '../erp/Practicar';
import { PRACTICAS_POR_EJERCICIO } from '../erp/practicas';
import { bloqueAbierto, bloqueQueToca, bloquesDe, bloquesObligatorios, esOpcional, numeroBloque, pasosDe, type PasoId } from '../lib/ruta';
import { MODULOS } from '../content';
import { ejercicioCompletado } from '../lib/progress';
import './aprender.css';
import './pulido.css';
import './ruta.css';

export default function ExercisePage() {
  const { id = '' } = useParams();
  const [sp, setSp] = useSearchParams();
  const reducir = useReducedMotion();
  const p = useProgreso();
  const hallado = getEjercicio(id);
  const tabParam = sp.get('tab');
  // Pasos con ejercicio interno (Guiado, De memoria, Test): el «Siguiente» del pie solo aparece al terminarlo
  const [listo, setListo] = useState<{ clave: string; ok: boolean }>({ clave: '', ok: false });
  const claveListo = `${id}:${tabParam ?? ''}`;
  const onListo = useCallback((ok: boolean) => setListo({ clave: claveListo, ok }), [claveListo]);
  useEffect(() => { window.scrollTo({ top: 0 }); }, [claveListo]);
  // Al cambiar de pestaña se olvida el «terminado» anterior (en el mismo render, antes de que el paso nuevo avise):
  // si vuelves a un paso ya hecho, el «Siguiente» no asoma mientras se anima el cambio
  const [claveVista, setClaveVista] = useState(claveListo);
  if (claveVista !== claveListo) {
    setClaveVista(claveListo);
    setListo({ clave: '', ok: false });
  }


  if (!hallado) {
    return (
      <div className="wrap" style={{ padding: '60px 0' }}>
        <h1>No encuentro este bloque</h1>
        <p className="muted">Puede que el enlace esté mal escrito.</p>
        <Link className="btn" to="/">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const { modulo, ejercicio: ej } = hallado;
  const ini = p.alumno.ini;
  const t = (x: string) => conIni(x, ini);
  const meta = META[modulo.id] ?? { color: 'var(--arc)', icono: 'maestros', corto: modulo.titulo };
  const obligatorios = bloquesObligatorios(modulo);
  const opcional = esOpcional(modulo, ej.id);
  const n = numeroBloque(modulo, ej.id);
  const pasos = pasosDe(ej);
  // «Problemas» ya no es una pestaña: vive al final de la Demo real
  const tabPedida = tabParam === 'problemas' ? 'demo' : tabParam;
  const tab = (pasos.some((x) => x.id === tabPedida) ? tabPedida : 'concepto') as PasoId;
  const k = pasos.findIndex((x) => x.id === tab);
  const practicasEj = PRACTICAS_POR_EJERCICIO[ej.id] ?? [];

  // Lo siguiente: el próximo bloque obligatorio del módulo; si no queda, el examen del módulo.
  // En «Para saber más» se encadenan los bloques de ampliación entre sí (el último vuelve al módulo).
  const cadena = opcional ? bloquesDe(modulo).filter((b) => esOpcional(modulo, b.id)) : obligatorios;
  const k0 = cadena.findIndex((b) => b.id === ej.id);
  const sigBloque = k0 >= 0 ? cadena[k0 + 1] : undefined;
  const sigAbierto = sigBloque ? bloqueAbierto(p, modulo, sigBloque.id) : false;
  const antBloque = k0 > 0 ? cadena[k0 - 1] : undefined;
  const idxMod = MODULOS.findIndex((m) => m.id === modulo.id);
  const sigMod = MODULOS[idxMod + 1];

  const ir = (paso: string) => {
    setSp(paso === 'concepto' ? {} : { tab: paso }, { replace: false });
  };

  // Bloque cerrado: hay que terminar el anterior
  if (!bloqueAbierto(p, modulo, ej.id)) {
    const toca = bloqueQueToca(p, modulo);
    const nToca = toca ? numeroBloque(modulo, toca.id) : 0;
    return (
      <div className="wrap bq" style={{ ['--mod' as string]: meta.color }}>
        <p className="bq-miga">
          <Link to={`/modulo/${modulo.id}`}>
            <Icon name="atras" size={16} /> {meta.corto}
          </Link>
        </p>
        <div className="bq-cerrado">
          <Icon name="candado" size={28} />
          <h1>
            Bloque {n}: {t(ej.titulo)}
          </h1>
          <p>
            {opcional ? 'Este bloque de ampliación se abre cuando termines los bloques del módulo.' : 'Los bloques se abren de uno en uno.'} Ahora te toca el <b>bloque {nToca}</b>, «{t(toca?.titulo ?? '')}». Un bloque está terminado cuando completas su <b>Guiado</b> y apruebas su <b>Test</b>.
          </p>
          {toca && (
            <Link className="btn arc lg" to={`/ejercicio/${toca.id}`}>
              Ir al bloque {nToca}
            </Link>
          )}
        </div>
      </div>
    );
  }


  const anterior = pasos[k - 1];
  const siguiente = pasos[k + 1];
  const interno = tab === 'guiado' || tab === 'memoria' || tab === 'test';
  const esperar = interno && !(listo.clave === claveListo && listo.ok);
  const queFalta = tab === 'test' ? 'Aprueba el test' : tab === 'guiado' ? 'Termina el recorrido' : 'Termina las pantallas';

  return (
    <div className="wrap bq" style={{ ['--mod' as string]: meta.color }}>
      <header className="bq-cab">
        <p className="bq-miga">
          <Link to={`/modulo/${modulo.id}`}>
            <Icon name="atras" size={16} /> {meta.corto}
          </Link>
          <span>{opcional ? 'Para saber más (opcional)' : `Bloque ${n} de ${obligatorios.length}`}</span>
        </p>
        <h1>{t(ej.titulo)}</h1>
        <p className="bq-obj">
          <Glosa>{t(ej.objetivo)}</Glosa>
        </p>
      </header>

      <p id="bloque-pasos" className="bq-donde">
        <b>{pasos[k].label}.</b> {pasos[k].que}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={tab}
          id="panel-ej"
          className="panel bq-panel"
          aria-label={pasos[k].label}
          initial={reducir ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          {tab === 'concepto' && <Concepto ej={ej} ini={ini} modulo={modulo.id} />}
          {tab === 'guiado' && <Guiado ej={ej} modulo={modulo.id} ini={ini} onListo={onListo} />}
          {tab === 'memoria' && <DeMemoria ej={ej} modulo={modulo.id} ini={ini} onListo={onListo} />}
          {tab === 'test' && <TestEj ej={ej} ini={ini} onListo={onListo} onIr={ir} />}
          {tab === 'erp' && <Practicar ids={practicasEj} ini={ini} />}
          {tab === 'demo' && <DemoReal ej={ej} ini={ini} />}
        </motion.section>
      </AnimatePresence>

      {/* Cierre del bloque: lo que el alumno ha hecho en él, al final del último paso */}
      {!siguiente && ej.aprendido && ej.aprendido.length > 0 && (
        <section className="callout why" aria-labelledby="aprendido-h" style={{ marginTop: 32 }}>
          <h2 id="aprendido-h">Qué has aprendido</h2>
          <ul className="md-aprendes" style={{ marginBottom: 0 }}>
            {ej.aprendido.map((x, i) => (
              <li key={i}>
                <Icon name="check" size={16} stroke={3} />
                <span>
                  <Glosa>{t(x)}</Glosa>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="bq-sig" aria-label="Seguir">
        {anterior ? (
          <button type="button" className="btn ghost" onClick={() => ir(anterior.id)}>
            <Icon name="atras" size={18} /> Anterior: {anterior.label}
          </button>
        ) : antBloque ? (
          <Link className="btn ghost bq-ant" to={`/ejercicio/${antBloque.id}`}>
            <Icon name="atras" size={18} /> Bloque anterior
          </Link>
        ) : (
          <Link className="btn ghost bq-ant" to={`/modulo/${modulo.id}`}>
            <Icon name="atras" size={18} /> Inicio del módulo
          </Link>
        )}
        {esperar ? (
          <p className="bq-falta">
            <span>
              {queFalta} y aparecerá aquí «Siguiente{siguiente ? `: ${siguiente.label}` : ''}».
            </span>
          </p>
        ) : siguiente ? (
          <button type="button" className="btn arc lg" onClick={() => ir(siguiente.id)}>
            Siguiente: {siguiente.label}
          </button>
        ) : sigBloque ? (
          sigAbierto ? (
            <Link className="btn arc lg" to={`/ejercicio/${sigBloque.id}`}>
              Siguiente bloque: {t(sigBloque.titulo)}
            </Link>
          ) : (
            <div className="bq-sig-der">
              <button type="button" className="btn arc lg" disabled>
                Siguiente: bloque {n + 1}
              </button>
              <p className="bq-falta">
                <span>Para abrir el bloque {n + 1}, termina el Guiado y aprueba el Test de este bloque.</span>
              </p>
            </div>
          )
        ) : !opcional && obligatorios.every((b) => ejercicioCompletado(p.ejercicios[b.id])) ? (
          <Link className="btn arc lg" to={`/modulo/${modulo.id}/examen`}>
            Siguiente: examen del módulo
          </Link>
        ) : (
          <Link className="btn arc lg" to={`/modulo/${modulo.id}`}>
            {opcional ? 'Volver al módulo' : sigMod ? 'Volver al módulo: te queda terminar sus bloques' : 'Volver al módulo'}
          </Link>
        )}
      </nav>
    </div>
  );
}
