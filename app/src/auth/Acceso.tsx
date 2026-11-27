/**
 * Acceso con Clerk. Sin sesión iniciada no se monta la app (ni bloques ni vídeo).
 * Sin VITE_CLERK_PUBLISHABLE_KEY la app funciona como antes, sin login y con el progreso solo en el navegador.
 *
 * Todo lo que ve el alumno es de la plataforma: los formularios (FormularioAcceso) usan la API de Clerk
 * y nunca se muestran componentes, ventanas ni pantallas alojadas de Clerk.
 */
import { Suspense, createContext, lazy, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ClerkProvider, useAuth, useClerk, useUser } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { hayWebGL } from '../components/escena3d/tipos';
import { useSincronizarProgreso, type EstadoSync } from './sincronizar';
import { CLAVE_CLERK, CLERK_ACTIVO, DOMINIO, INTRO_ESCENA, URL_APP, correoPermitido } from './config';
import { FormularioAcceso } from './FormularioAcceso';
import type { FaseEscena } from './EscenaAcceso';
import './auth.css';

export { CLERK_ACTIVO } from './config';

const EscenaAcceso = lazy(() => import('./EscenaAcceso'));

const EstadoCtx = createContext<EstadoSync | null>(null);
export const useEstadoSync = () => useContext(EstadoCtx);

/* ---------- Tema y escena ---------- */

/** La escena 3D se pide cuando la pantalla ya está pintada y el navegador está libre */
function useEscenaDiferida() {
  const [cargar, setCargar] = useState(false);
  useEffect(() => {
    if (!hayWebGL()) return;
    const w = window as Window & { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setCargar(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setCargar(true), 300);
    return () => window.clearTimeout(t);
  }, []);
  return cargar;
}

function Fondo({ fase, oscuro, sinIntro, onLista }: { fase: FaseEscena; oscuro: boolean; sinIntro: boolean; onLista: () => void }) {
  const reducir = !!useReducedMotion();
  const cargar = useEscenaDiferida();
  const [lista, setLista] = useState(false);
  return (
    <div className={`acc-fondo${lista ? ' con-3d' : ''}`} aria-hidden="true">
      <div className="acc-aurora">
        <span className="acc-blob acc-blob-1" />
        <span className="acc-blob acc-blob-2" />
        <span className="acc-blob acc-blob-3" />
      </div>
      {cargar && (
        <Suspense fallback={null}>
          <div
            className="acc3d"
            ref={(el) => {
              if (el && !lista)
                requestAnimationFrame(() => {
                  setLista(true);
                  onLista();
                });
            }}
          >
            <EscenaAcceso fase={fase} oscuro={oscuro} reducir={reducir} sinIntro={sinIntro} />
          </div>
        </Suspense>
      )}
      <div className="acc-velo" />
      <div className="acc-grain" />
    </div>
  );
}

/* ---------- Pantalla de entrada ---------- */

const PUNTOS = [
  { t: 'Bloques guiados', d: 'Del alta del proveedor a la tesorería, paso a paso.' },
  { t: 'ERP de práctica', d: 'Prueba sin miedo: nada toca datos reales.' },
  { t: 'Tu progreso en la nube', d: 'Sigue donde lo dejaste, en cualquier equipo.' },
];

function Marco({ children, fase = 'reposo', sinIntro = true, onLista, retardoBarra = 0, extra }: { children: ReactNode; fase?: FaseEscena; sinIntro?: boolean; onLista?: () => void; retardoBarra?: number; extra?: ReactNode }) {
  // La pantalla de acceso es siempre oscura, aunque el alumno use la plataforma en claro
  const oscuro = true;
  const reduce = useReducedMotion();
  const base = import.meta.env.BASE_URL;
  return (
    <div className="acceso">
      <Fondo fase={fase} oscuro={oscuro} sinIntro={sinIntro} onLista={onLista ?? (() => {})} />
      {retardoBarra < 90 && <motion.header className="acc-barra" initial={{ opacity: 0, y: reduce ? 0 : -12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reduce ? 0 : retardoBarra, duration: 0.7 }}>
        <img className="acc-logo" src={`${base}brand/oys_logo_light.png`} alt="O&S Consultores" />
      </motion.header>}
      {extra}
      {children}
    </div>
  );
}

/** Letras del titular: salen una a una, de borrosas a nítidas */
function Letras({ texto, desde, clase, palabras }: { texto: string; desde: number; clase?: string; palabras?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <span className={`acc-linea${clase ? ` ${clase}` : ''}`} aria-hidden="true">
      {(palabras ? texto.split(' ').flatMap((w, i) => (i ? [' ', w] : [w])) : [...texto]).map((ch, i) => (
        <motion.span
          key={i}
          className="acc-letra"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: '0.5em', filter: 'blur(12px)', rotateX: -70 }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 }}
          transition={reduce ? { duration: 0.2 } : { delay: desde + i * (palabras ? 0.12 : 0.035), duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === ' ' ? '\u00a0' : ch}
        </motion.span>
      ))}
    </span>
  );
}

const CLAVE_INTRO = 'oys-intro-vista';
function introYaVista() {
  try {
    // Intro larga como mucho una vez por semana: es una plataforma de uso diario
    return Date.now() - Number(localStorage.getItem(CLAVE_INTRO) || 0) < 7 * 864e5;
  } catch {
    return false;
  }
}

function PantallaEntrada() {
  const reduce = !!useReducedMotion();
  const [fase, setFase] = useState<FaseEscena>('reposo');
  const onFase = useCallback((f: FaseEscena) => setFase(f), []);
  // Intro completa solo la primera vez en la sesión; sin WebGL o con movimiento reducido, corta
  const [sinIntro, setSinIntro] = useState(() => reduce || introYaVista() || !hayWebGL());
  const [arranque, setArranque] = useState(sinIntro);
  const onLista = useCallback(() => setArranque(true), []);
  // Si la escena tarda, el texto no la espera
  useEffect(() => {
    const t = window.setTimeout(() => setArranque(true), 1600);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!arranque || sinIntro) return;
    try {
      localStorage.setItem(CLAVE_INTRO, String(Date.now()));
    } catch {
      /* sin almacenamiento */
    }
    const t = window.setTimeout(() => setSinIntro(true), INTRO_ESCENA * 1000 + 900);
    const saltar = (e: KeyboardEvent) => e.key === 'Escape' && setSinIntro(true);
    window.addEventListener('keydown', saltar);
    return () => (window.clearTimeout(t), window.removeEventListener('keydown', saltar));
  }, [arranque, sinIntro]);

  // Tiempos del texto (s) respecto a la intro de la escena
  const largo = !useRef(sinIntro).current;
  const T = largo ? { barra: 2.2, eyebrow: 1.6, titulo: 1.7, lead: 2.6, puntos: 2.8, tarjeta: 1.5 } : { barra: 0, eyebrow: 0.05, titulo: 0.1, lead: 0.45, puntos: 0.55, tarjeta: 0.2 };
  const d = (t: number) => (reduce ? { duration: 0 } : { delay: t, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const });

  if (!arranque) return <Marco fase={fase} sinIntro={sinIntro} onLista={onLista} retardoBarra={99}>{null}</Marco>;

  return (
    <Marco
      fase={fase}
      sinIntro={sinIntro}
      onLista={onLista}
      retardoBarra={T.barra}
      extra={
        <>
          <AnimatePresence>
            {largo && !sinIntro && (
              <motion.button type="button" className="acc-saltar" onClick={() => setSinIntro(true)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-keyshortcuts="Escape">
                Saltar intro <kbd>Esc</kbd>
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>{fase === 'ok' && !reduce && <motion.div className="acc-destello" initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 0.65] }} transition={{ duration: 0.9, times: [0, 0.55, 1] }} />}</AnimatePresence>
        </>
      }
    >
      <main className="acc-in">
        <div className="acc-hueco" aria-hidden="true" />
        <section className="acc-copy" aria-labelledby="acc-titulo">
          <motion.p className="acc-eyebrow" initial={{ opacity: 0, x: reduce ? 0 : -16, letterSpacing: reduce ? '0.14em' : '0.6em' }} animate={{ opacity: 1, x: 0, letterSpacing: '0.14em' }} transition={{ ...d(T.eyebrow), duration: 1.1 }}>
            <span className="acc-punto" aria-hidden="true" /> Plataforma de formación de O&amp;S
          </motion.p>
          <h1 id="acc-titulo" className="acc-titulo" aria-label="Formación Axional Deister VNext">
            <Letras texto="Formación" desde={T.titulo} />
            <Letras texto="Axional Deister" desde={T.titulo + 0.3} clase="acc-brillo" palabras />
            <Letras texto="VNext" desde={T.titulo + 0.75} />
          </h1>
          <motion.p className="acc-lead" initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={d(T.lead)}>
            Aprende el ERP como lo usarás con los clientes: con vídeos, bloques guiados y un ERP de práctica.
          </motion.p>
          <ul className="acc-puntos">
            {PUNTOS.map((p, i) => (
              <motion.li key={p.t} initial={{ opacity: 0, x: reduce ? 0 : -14 }} animate={{ opacity: 1, x: 0 }} transition={d(T.puntos + i * 0.12)}>
                <b>{p.t}</b>
                <span>{p.d}</span>
              </motion.li>
            ))}
          </ul>
        </section>

        <motion.section
          className="acc-tarjeta"
          aria-label="Acceso"
          initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.94, rotateX: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          transition={reduce ? { duration: 0 } : { delay: T.tarjeta, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="acc-borde" aria-hidden="true" />
          <FormularioAcceso onFase={onFase} />
          <p className="acc-nota">
            Solo para el equipo de O&amp;S (@{DOMINIO || 'empresa'}). Si eres externo, pide acceso a tu formador.
          </p>
        </motion.section>
      </main>
    </Marco>
  );
}

/* ---------- Cuenta fuera de O&S y carga del progreso ---------- */

function SoloOys({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!user) return null;
  const correos = user.emailAddresses.filter((e) => e.verification?.status === 'verified').map((e) => e.emailAddress);
  if (correos.some(correoPermitido)) return <>{children}</>;
  return (
    <Marco fase="error">
      <main className="acc-in acc-solo">
        <section className="acc-tarjeta">
          <span className="acc-borde" aria-hidden="true" />
          <div className="acc-form">
            <h1 className="acc-form-titulo">Solo cuentas de O&amp;S</h1>
            <p className="acc-ayuda">
              Has entrado con <b>{correos[0] ?? 'una cuenta'}</b>, pero esta plataforma es solo para correos @{DOMINIO}. Sal y entra con tu cuenta de empresa.
            </p>
            <button type="button" className="acc-btn" onClick={() => void signOut({ redirectUrl: URL_APP })}>
              Salir y entrar con otra cuenta
            </button>
          </div>
        </section>
      </main>
    </Marco>
  );
}

function Sincronizado({ children }: { children: ReactNode }) {
  const estado = useSincronizarProgreso();
  // Hasta fusionar el progreso de la cuenta no se pinta la app (evita ver un momento datos o preferencias de otro navegador).
  if (estado === 'cargando')
    return (
      <Marco fase="ok">
        <main className="acc-in acc-solo">
          <div className="acc-cargando acc-cargando-grande" role="status">
            <span className="acc-spinner" aria-hidden="true" /> Cargando tu progreso…
          </div>
        </main>
      </Marco>
    );
  return <EstadoCtx.Provider value={estado}>{children}</EstadoCtx.Provider>;
}

/** Mientras Clerk carga ya se pinta la pantalla de acceso (con «Conectando…» en la tarjeta), sin pantallazo en blanco */
function Puerta({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded || !isSignedIn) return <PantallaEntrada />;
  return (
    <SoloOys>
      <Sincronizado>{children}</Sincronizado>
    </SoloOys>
  );
}

export function Acceso({ children }: { children: ReactNode }) {
  if (!CLERK_ACTIVO) return <>{children}</>;
  return (
    <ClerkProvider
      publishableKey={CLAVE_CLERK}
      localization={esES}
      afterSignOutUrl={URL_APP}
      signInFallbackRedirectUrl={URL_APP}
      signUpFallbackRedirectUrl={URL_APP}
      appearance={{ options: { unsafe_disableDevelopmentModeWarnings: true } }}
    >
      <Puerta>{children}</Puerta>
    </ClerkProvider>
  );
}
