/**
 * Acceso con Clerk. Sin sesión iniciada no se monta la app (ni ejercicios ni vídeo).
 * Sin VITE_CLERK_PUBLISHABLE_KEY la app funciona como antes, sin login y con el progreso solo en el navegador.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ClerkLoaded, ClerkLoading, ClerkProvider, Show, SignIn, SignUp } from '@clerk/react';
import { esES } from '@clerk/localizations';
import { motion, useReducedMotion } from 'framer-motion';
import { Espacio } from '../components/shell/Espacio';
import { useSincronizarProgreso, type EstadoSync } from './sincronizar';
import './auth.css';

export const CLAVE_CLERK = (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined)?.trim() || '';
export const CLERK_ACTIVO = CLAVE_CLERK.startsWith('pk_');

const NEON = '#4fbfa5';

/** Aspecto de los componentes de Clerk: cristal oscuro con neón, como la portada. */
export const APARIENCIA = {
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
    formButtonPrimary: 'acc-boton',
    userButtonPopoverCard: 'acc-popover',
  },
};

const EstadoCtx = createContext<EstadoSync | null>(null);
export const useEstadoSync = () => useContext(EstadoCtx);

function Sincronizado({ children }: { children: ReactNode }) {
  const estado = useSincronizarProgreso();
  return <EstadoCtx.Provider value={estado}>{children}</EstadoCtx.Provider>;
}

/** Enlace de invitación de Clerk: trae __clerk_ticket y __clerk_status=sign_up en la URL. */
function vieneDeInvitacion() {
  const q = new URLSearchParams(window.location.search);
  return !!q.get('__clerk_ticket') && q.get('__clerk_status') !== 'sign_in';
}

function PantallaEntrada() {
  const reduce = useReducedMotion();
  const [alta, setAlta] = useState(vieneDeInvitacion);
  const base = import.meta.env.BASE_URL;
  const d = (t: number) => (reduce ? { duration: 0 } : { delay: t, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] as const });
  return (
    <div className="acc">
      <Espacio />
      <div className="acc-grain" aria-hidden="true" />
      <div className="acc-in">
        <div className="acc-copy">
          <motion.img className="acc-logo" src={`${base}brand/oys_logo_light.png`} alt="O&S Consultores" initial={{ opacity: 0, y: reduce ? 0 : 14 }} animate={{ opacity: 1, y: 0 }} transition={d(0.2)} />
          <motion.h1 initial={{ opacity: 0, y: reduce ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={d(0.4)}>
            Practicando Axional
          </motion.h1>
          <motion.p className="acc-lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(0.7)}>
            Entra con tu cuenta de O&amp;S para seguir donde lo dejaste. Tu progreso se guarda en tu cuenta y lo recuperas en cualquier navegador.
          </motion.p>
          <motion.p className="acc-nota" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={d(0.9)}>
            El acceso es solo por invitación. Si no tienes cuenta, pídesela a tu formador.
          </motion.p>
        </div>
        <motion.div className="acc-panel" initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={d(0.5)}>
          <ClerkLoading>
            <div className="acc-cargando" role="status">
              <span className="acc-spinner" aria-hidden="true" /> Conectando…
            </div>
          </ClerkLoading>
          <ClerkLoaded>
            {alta ? <SignUp routing="hash" signInUrl="#" /> : <SignIn routing="hash" withSignUp={false} />}
            {alta && (
              <button type="button" className="acc-cambiar" onClick={() => setAlta(false)}>
                Ya tengo cuenta: entrar
              </button>
            )}
          </ClerkLoaded>
        </motion.div>
      </div>
    </div>
  );
}

export function Acceso({ children }: { children: ReactNode }) {
  if (!CLERK_ACTIVO) return <>{children}</>;
  return (
    <ClerkProvider publishableKey={CLAVE_CLERK} localization={esES} appearance={APARIENCIA} afterSignOutUrl={window.location.pathname}>
      <Show when="signed-out">
        <PantallaEntrada />
      </Show>
      <Show when="signed-in">
        <Sincronizado>{children}</Sincronizado>
      </Show>
    </ClerkProvider>
  );
}
