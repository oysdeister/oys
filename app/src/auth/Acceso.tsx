/**
 * Acceso con Clerk. Sin sesión iniciada no se monta la app (ni ejercicios ni vídeo).
 * Sin VITE_CLERK_PUBLISHABLE_KEY la app funciona como antes, sin login y con el progreso solo en el navegador.
 *
 * La pantalla de entrada es propia: el botón de Google llama a la API de Clerk (authenticateWithPopup) y el
 * formulario de correo es el <SignIn>/<SignUp> de Clerk camuflado con `appearance` (sin cabecera, sin botones
 * sociales, sin pie «Secured by Clerk» y sin el aviso «Development mode»).
 */
import { createContext, useContext, useState, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import { ClerkLoaded, ClerkLoading, ClerkProvider, Show, SignIn, SignUp, useClerk, useUser } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Espacio } from '../components/shell/Espacio';
import { useSincronizarProgreso, type EstadoSync } from './sincronizar';
import './auth.css';

export const CLAVE_CLERK = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim() || '';
export const CLERK_ACTIVO = CLAVE_CLERK.startsWith('pk_');
/** Dirección de la app sin query ni hash (en GitHub Pages, …/oys/): tras Google o tras salir se vuelve aquí y no a la raíz del dominio. */
const URL_APP = window.location.origin + window.location.pathname;
/** Ruta de vuelta de Google cuando falta algún paso (p. ej. pasar de entrada a alta): la resuelve el <SignIn routing="hash"> montado. */
const URL_SSO = `${URL_APP}#/sso-callback`;

const NEON = '#4fbfa5';

/** Aspecto de los componentes de Clerk: integrados en el panel propio, sin tarjeta ni marca de Clerk. */
export const APARIENCIA = {
  options: {
    // Esconde el distintivo «Development mode» de la instancia de desarrollo.
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: NEON,
    colorBackground: 'rgba(14, 22, 34, 0.72)',
    colorInputBackground: 'rgba(255, 255, 255, 0.06)',
    colorText: '#eef3f8',
    colorTextSecondary: '#b5c3d6',
    colorInputText: '#ffffff',
    colorNeutral: '#dbe4ef',
    colorDanger: '#ff8a8a',
    borderRadius: '14px',
    fontFamily: "'Instrument Sans Variable', system-ui, sans-serif",
    fontFamilyButtons: "'Bricolage Grotesque Variable', system-ui, sans-serif",
  },
  elements: {
    rootBox: 'acc-clerk',
    cardBox: 'acc-cardbox',
    card: 'acc-card',
    footer: 'acc-footer',
    header: 'acc-cl-header',
    socialButtonsRoot: 'acc-oculto',
    dividerRow: 'acc-oculto',
    formButtonPrimary: 'acc-boton',
    formFieldInput: 'acc-input',
    userButtonPopoverCard: 'acc-popover',
  },
};

/** Textos de Clerk: sin el título «Entrar en …» del primer paso, que ya da la pantalla. */
const LOCALIZACION = {
  ...esES,
  signIn: { ...esES.signIn, start: { ...esES.signIn?.start, title: '', titleCombined: '', subtitle: '', subtitleCombined: '' } },
  signUp: { ...esES.signUp, start: { ...esES.signUp?.start, title: '', titleCombined: '', subtitle: '', subtitleCombined: '' } },
} as typeof esES;

const EstadoCtx = createContext<EstadoSync | null>(null);
export const useEstadoSync = () => useContext(EstadoCtx);

/** Dominio de correo con acceso (VITE_DOMINIO_PERMITIDO; vacío = cualquiera) y correos sueltos de excepción (VITE_CORREOS_EXTRA, separados por comas). */
const DOMINIO = ((import.meta.env.VITE_DOMINIO_PERMITIDO as string | undefined) ?? 'oysconsultores.com').trim().toLowerCase();
const EXTRA = ((import.meta.env.VITE_CORREOS_EXTRA as string | undefined) ?? '')
  .split(',')
  .map((c) => c.trim().toLowerCase())
  .filter(Boolean);

function correoPermitido(correo: string) {
  const c = correo.toLowerCase();
  return !DOMINIO || c.endsWith(`@${DOMINIO}`) || EXTRA.includes(c);
}

/** Solo deja pasar cuentas con algún correo verificado del dominio de O&S (o de la lista de excepciones). */
function SoloOys({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  if (!user) return null;
  const correos = user.emailAddresses.filter((e) => e.verification?.status === 'verified').map((e) => e.emailAddress);
  if (correos.some(correoPermitido)) return <>{children}</>;
  return (
    <div className="acc">
      <Espacio />
      <div className="acc-in acc-solo">
        <div className="acc-copy">
          <h1>Solo cuentas de O&amp;S</h1>
          <p className="acc-lead">
            Has entrado con {correos[0] ?? 'una cuenta'}, pero esta plataforma es solo para correos @{DOMINIO}. Sal y entra con tu cuenta de empresa.
          </p>
          <button type="button" className="acc-salir acc-salir-grande" onClick={() => void signOut()}>
            Salir y entrar con otra cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

function Sincronizado({ children }: { children: ReactNode }) {
  const estado = useSincronizarProgreso();
  // Hasta fusionar el progreso de la cuenta no se pinta la app (evita ver un momento datos o preferencias de otro navegador).
  if (estado === 'cargando')
    return (
      <div className="acc">
        <div className="acc-in acc-solo">
          <div className="acc-cargando" role="status">
            <span className="acc-spinner" aria-hidden="true" /> Cargando tu progreso…
          </div>
        </div>
      </div>
    );
  return <EstadoCtx.Provider value={estado}>{children}</EstadoCtx.Provider>;
}

/** Enlace de invitación de Clerk: trae __clerk_ticket y __clerk_status=sign_up en la URL. */
function vieneDeInvitacion() {
  const q = new URLSearchParams(window.location.search);
  return !!q.get('__clerk_ticket') && q.get('__clerk_status') !== 'sign_in';
}

function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" width="26" height="26" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Ventana emergente centrada: se abre en el mismo clic para que el navegador no la bloquee. */
function abrirVentana() {
  const w = 500;
  const h = 640;
  const left = Math.max(0, window.screenX + (window.outerWidth - w) / 2);
  const top = Math.max(0, window.screenY + (window.outerHeight - h) / 2);
  return window.open('about:blank', 'oys-google', `width=${w},height=${h},left=${left},top=${top},popup=yes`);
}

function mensajeError(e: unknown) {
  const err = e as { errors?: { code?: string; longMessage?: string; message?: string }[]; message?: string };
  const primero = err?.errors?.[0];
  if (primero?.code === 'not_allowed_access' || primero?.code === 'sign_up_restricted_waitlist' || primero?.code === 'not_allowed_to_sign_up')
    return 'Esta cuenta no tiene invitación. Pídesela a tu formador.';
  return primero?.longMessage || primero?.message || err?.message || 'No se ha podido conectar con Google. Vuelve a intentarlo.';
}

/** Botón grande «Continuar con Google» con la API de Clerk (ventana emergente; si el navegador la bloquea, redirección). */
function BotonGoogle({ alta }: { alta: boolean }) {
  const clerk = useClerk();
  const reduce = useReducedMotion();
  const [estado, setEstado] = useState<'listo' | 'abriendo'>('listo');
  const [error, setError] = useState('');
  const [onda, setOnda] = useState<{ x: number; y: number; k: number } | null>(null);

  const entrar = async (ev: ReactMouseEvent<HTMLButtonElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    if (!reduce) setOnda({ x: ev.clientX - r.left, y: ev.clientY - r.top, k: Date.now() });
    const cliente = clerk.client;
    if (!cliente || estado === 'abriendo') return;
    setError('');
    setEstado('abriendo');
    const recurso = alta ? cliente.signUp : cliente.signIn;
    const comun = {
      strategy: 'oauth_google' as const,
      redirectUrl: URL_SSO,
      redirectUrlComplete: URL_APP,
      ...(alta && cliente.signUp.id ? { continueSignUp: true } : {}),
    };
    const popup = abrirVentana();
    try {
      if (popup) await recurso.authenticateWithPopup({ ...comun, popup });
      else await recurso.authenticateWithRedirect(comun);
    } catch (e) {
      popup?.close();
      setError(mensajeError(e));
    } finally {
      setEstado('listo');
    }
  };

  return (
    <>
      <motion.button
        type="button"
        className="acc-google"
        onClick={(e) => void entrar(e)}
        disabled={!clerk.loaded}
        aria-busy={estado === 'abriendo'}
        whileHover={reduce ? undefined : { y: -3, scale: 1.015 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      >
        <span className="acc-google-brillo" aria-hidden="true" />
        <span className="acc-google-logo">
          {estado === 'abriendo' ? <span className="acc-spinner acc-spinner-g" aria-hidden="true" /> : <LogoGoogle />}
        </span>
        <span className="acc-google-txt">
          <b>{estado === 'abriendo' ? 'Abriendo Google…' : 'Continuar con Google'}</b>
          <small>Tu cuenta @{DOMINIO || 'empresa'}</small>
        </span>
        <span className="acc-google-flecha" aria-hidden="true">
          →
        </span>
        <AnimatePresence>
          {onda && (
            <motion.span
              key={onda.k}
              className="acc-onda"
              style={{ left: onda.x, top: onda.y }}
              initial={{ scale: 0, opacity: 0.45 }}
              animate={{ scale: 9, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              onAnimationComplete={() => setOnda(null)}
            />
          )}
        </AnimatePresence>
      </motion.button>
      <AnimatePresence>
        {error && (
          <motion.p className="acc-error" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}

const PALABRAS = ['Practicando', 'Axional'];
const CHIPS = ['Bloques guiados', 'Vídeos paso a paso', 'Tu progreso en la nube'];

function PantallaEntrada() {
  const reduce = useReducedMotion();
  const [alta, setAlta] = useState(vieneDeInvitacion);
  const base = import.meta.env.BASE_URL;
  const d = (t: number) => (reduce ? { duration: 0 } : { delay: t, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const });

  // Inclinación 3D del panel y foco de luz que sigue al ratón (solo con puntero fino y sin movimiento reducido).
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotY = useSpring(useTransform(mx, [0, 1], [-7, 7]), { stiffness: 120, damping: 18 });
  const rotX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 120, damping: 18 });
  const luzX = useTransform(mx, (v) => `${v * 100}%`);
  const luzY = useTransform(my, (v) => `${v * 100}%`);
  const luz = useMotionTemplate`radial-gradient(420px circle at ${luzX} ${luzY}, rgba(79, 191, 165, 0.16), transparent 60%)`;
  const mover = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const soltar = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className={`acc acc-entrada`}>
      <Espacio />
      <div className="acc-aurora" aria-hidden="true">
        <span className="acc-blob acc-blob-1" />
        <span className="acc-blob acc-blob-2" />
        <span className="acc-blob acc-blob-3" />
      </div>
      <div className="acc-rejilla" aria-hidden="true" />
      <div className="acc-grain" aria-hidden="true" />
      <div className="acc-in">
        <div className="acc-copy">
          <motion.img className="acc-logo" src={`${base}brand/oys_logo_light.png`} alt="O&S Consultores" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={d(0.15)} />
          <motion.p className="acc-eyebrow" initial={{ opacity: 0, x: reduce ? 0 : -16 }} animate={{ opacity: 1, x: 0 }} transition={d(0.3)}>
            <span className="acc-punto" aria-hidden="true" /> Plataforma de formación · ERP Axional
          </motion.p>
          <h1 className="acc-titulo" aria-label="Practicando Axional">
            {PALABRAS.map((p, i) => (
              <span key={p} className="acc-linea" aria-hidden="true">
                <motion.span
                  className={i === 1 ? 'acc-brillo' : undefined}
                  initial={{ y: reduce ? 0 : '105%', opacity: reduce ? 0 : 1 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={reduce ? { duration: 0.3 } : { delay: 0.4 + i * 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                >
                  {p}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="acc-lead" initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={d(0.85)}>
            Entra con tu cuenta de O&amp;S para seguir donde lo dejaste. Tu progreso se guarda en tu cuenta y lo recuperas en cualquier navegador.
          </motion.p>
          <ul className="acc-chips">
            {CHIPS.map((c, i) => (
              <motion.li key={c} initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.94 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={d(1 + i * 0.1)}>
                {c}
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="acc-escena" onMouseMove={mover} onMouseLeave={soltar}>
          <motion.div
            className="acc-panel"
            style={reduce ? undefined : { rotateX: rotX, rotateY: rotY }}
            initial={{ opacity: 0, y: reduce ? 0 : 40, scale: reduce ? 1 : 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={reduce ? { duration: 0 } : { delay: 0.45, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="acc-borde" aria-hidden="true" />
            <motion.span className="acc-luz" aria-hidden="true" style={{ background: luz }} />
            <div className="acc-panel-in">
              <p className="acc-panel-kicker">{alta ? 'Tienes una invitación' : 'Bienvenido de nuevo'}</p>
              <h2 className="acc-panel-titulo">{alta ? 'Crea tu cuenta' : 'Entra'}</h2>

              <ClerkLoading>
                <div className="acc-cargando acc-cargando-panel" role="status">
                  <span className="acc-spinner" aria-hidden="true" /> Conectando…
                </div>
              </ClerkLoading>
              <ClerkLoaded>
                <BotonGoogle alta={alta} />
                <div className="acc-sep" role="separator">
                  <span>o con tu correo</span>
                </div>
                <div className="acc-correo">
                  {alta ? (
                    <SignUp routing="hash" signInUrl="#" oauthFlow="popup" forceRedirectUrl={URL_APP} />
                  ) : (
                    <SignIn routing="hash" withSignUp={false} oauthFlow="popup" forceRedirectUrl={URL_APP} signUpForceRedirectUrl={URL_APP} />
                  )}
                </div>
                {alta && (
                  <button type="button" className="acc-cambiar" onClick={() => setAlta(false)}>
                    Ya tengo cuenta: entrar
                  </button>
                )}
              </ClerkLoaded>
              <p className="acc-nota">
                <span aria-hidden="true">🔒</span> Acceso solo por invitación. Si no tienes cuenta, pídesela a tu formador.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function Acceso({ children }: { children: ReactNode }) {
  if (!CLERK_ACTIVO) return <>{children}</>;
  return (
    <ClerkProvider
      publishableKey={CLAVE_CLERK}
      localization={LOCALIZACION}
      appearance={APARIENCIA}
      afterSignOutUrl={URL_APP}
      signInFallbackRedirectUrl={URL_APP}
      signUpFallbackRedirectUrl={URL_APP}
    >
      <Show when="signed-out">
        <PantallaEntrada />
      </Show>
      <Show when="signed-in">
        <SoloOys>
          <Sincronizado>{children}</Sincronizado>
        </SoloOys>
      </Show>
    </ClerkProvider>
  );
}
