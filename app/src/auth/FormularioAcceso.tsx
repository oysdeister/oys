/**
 * Formularios propios de acceso sobre la API de Clerk (sin componentes ni pantallas de Clerk).
 * - Entrar: correo → código de 6 cifras por correo → dentro.
 * - Crear cuenta o entrar: con Google (redirección y vuelta propia) o con nombre, apellidos y correo → código → dentro.
 * - Invitación de Clerk (__clerk_ticket en la URL): se acepta con un botón.
 */
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { useClerk } from '@clerk/react';
import { useSignIn, useSignUp } from '@clerk/react/legacy';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { DOMINIO, PARAM_VUELTA, URL_APP, URL_VUELTA, correoPermitido, correoValido } from './config';
import type { FaseEscena } from './EscenaAcceso';

type Modo = 'entrar' | 'registro';
type Paso = 'correo' | 'codigo' | 'completar' | 'hecho';
type Ocupado = null | 'enviar' | 'verificar' | 'google' | 'reenviar' | 'vuelta';

interface Aviso {
  texto: string;
  /** Acción que propone el aviso (p. ej. «Crear cuenta con este correo») */
  accion?: { texto: string; hacer: () => void };
}

const ESPERA_REENVIO = 30;
const RE_CODIGO = /^\d{6}$/;

/* ---------- Errores de Clerk en español y sin jerga ---------- */

function codigoError(e: unknown) {
  const err = e as { errors?: { code?: string; longMessage?: string; message?: string }[]; message?: string; code?: string };
  return { code: err?.errors?.[0]?.code ?? err?.code ?? '', texto: err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || err?.message || '' };
}

function textoError(code: string, texto: string): string {
  switch (code) {
    case 'form_code_incorrect':
      return 'El código no es correcto. Revísalo o pide uno nuevo.';
    case 'verification_expired':
      return 'El código ha caducado. Pide uno nuevo.';
    case 'verification_failed':
    case 'too_many_attempts':
      return 'Has probado demasiadas veces. Pide un código nuevo.';
    case 'too_many_requests':
      return 'Demasiados intentos seguidos. Espera un minuto y vuelve a probar.';
    case 'not_allowed_access':
    case 'sign_up_restricted_waitlist':
    case 'not_allowed_to_sign_up':
      return 'Este correo no tiene permiso para entrar. Pídeselo a tu formador.';
    case 'form_param_format_invalid':
    case 'form_identifier_invalid':
      return 'Revisa el correo: no parece una dirección válida.';
    case 'sin_codigo':
    case 'strategy_for_user_invalid':
      return 'Tu cuenta aún no puede entrar con código. Avísale a tu formador.';
    case 'oauth_access_denied':
      return 'Has cancelado el acceso con Google. Puedes volver a intentarlo.';
    case 'external_account_exists':
      return 'Ese correo ya tiene cuenta. Usa «Entrar».';
    case 'identifier_already_signed_in':
    case 'session_exists':
      return 'Ya tienes la sesión abierta. Recarga la página.';
    case 'red':
      return 'No hay conexión con el servicio de acceso. Revisa tu red y vuelve a probar.';
    default:
      if (texto) console.warn('[acceso]', code, texto);
      return 'Algo ha fallado. Vuelve a intentarlo y, si se repite, avisa a tu formador.';
  }
}

/** Invitación de Clerk en la URL */
function leerInvitacion() {
  const q = new URLSearchParams(window.location.search);
  const ticket = q.get('__clerk_ticket');
  return ticket ? { ticket, entrar: q.get('__clerk_status') === 'sign_in' } : null;
}

/** Quita de la barra de direcciones los parámetros del acceso (vuelta de Google, invitación) */
function limpiarUrl() {
  window.history.replaceState(null, '', URL_APP + window.location.hash);
}

function LogoGoogle() {
  return (
    <svg viewBox="0 0 48 48" width="22" height="22" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Spinner() {
  return <span className="acc-spinner" aria-hidden="true" />;
}

/** Campo de código: un solo input (autocompletado del sistema y pegar) dibujado como 6 casillas */
function CampoCodigo({ valor, onCambio, invalido, desactivado, idError }: { valor: string; onCambio: (v: string) => void; invalido: boolean; desactivado: boolean; idError?: string }) {
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!desactivado) ref.current?.focus();
  }, [desactivado]);
  return (
    <div className="acc-campo">
      <label htmlFor={id}>Código de 6 cifras</label>
      <div className={`acc-otp${invalido ? ' es-error' : ''}`}>
        <input
          ref={ref}
          id={id}
          className="acc-otp-input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          value={valor}
          readOnly={desactivado}
          aria-invalid={invalido}
          aria-describedby={invalido ? idError : undefined}
          onChange={(e) => onCambio(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        <div className="acc-otp-cajas" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className={`acc-otp-caja${valor[i] ? ' llena' : ''}${i === Math.min(valor.length, 5) ? ' actual' : ''}`}>
              {valor[i] ?? ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Boton({ children, ocupado, textoOcupado, ...p }: { children: ReactNode; ocupado: boolean; textoOcupado: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="acc-btn" aria-busy={ocupado} {...p}>
      {ocupado ? (
        <>
          <Spinner /> {textoOcupado}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormularioAcceso({ onFase }: { onFase: (f: FaseEscena) => void }) {
  const clerk = useClerk();
  const { isLoaded: cargaIn, signIn } = useSignIn();
  const { isLoaded: cargaUp, signUp } = useSignUp();
  const listo = cargaIn && cargaUp && !!signIn && !!signUp;
  const reduce = useReducedMotion();
  const idError = useId();

  const invitacion = useRef(leerInvitacion()).current;
  // Solo en desarrollo: ?demo=codigo|registro|error|hecho fuerza un estado para revisar el diseño sin mandar correos
  const demo = import.meta.env.DEV ? new URLSearchParams(window.location.search).get('demo') : null;
  const vueltaGoogle = useRef(new URLSearchParams(window.location.search).get(PARAM_VUELTA) === 'google').current;

  const [modo, setModo] = useState<Modo>((invitacion && !invitacion.entrar) || demo === 'registro' ? 'registro' : 'entrar');
  const [paso, setPaso] = useState<Paso>(demo === 'codigo' || demo === 'error' ? 'codigo' : demo === 'hecho' ? 'hecho' : 'correo');
  const [ocupado, setOcupado] = useState<Ocupado>(vueltaGoogle ? 'vuelta' : null);
  const [aviso, setAviso] = useState<Aviso | null>(demo === 'error' ? { texto: textoError('form_code_incorrect', '') } : null);
  const [correo, setCorreo] = useState(demo ? 'nombre.apellido@oysconsultores.com' : '');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [codigo, setCodigo] = useState(demo === 'error' ? '482913' : demo === 'codigo' ? '48' : '');
  const [espera, setEspera] = useState(0);
  const [reenviado, setReenviado] = useState(false);
  const correoRef = useRef<HTMLInputElement>(null);

  // La escena acompaña al formulario
  useEffect(() => {
    if (paso === 'hecho') onFase('ok');
    else if (aviso) onFase('error');
    else if (ocupado === 'enviar' || ocupado === 'verificar' || ocupado === 'google' || ocupado === 'vuelta') onFase('enviando');
    else if (paso === 'codigo') onFase('codigo');
    else if (correo || nombre) onFase('escribiendo');
    else onFase('reposo');
  }, [paso, aviso, ocupado, correo, nombre, onFase]);

  // Cuenta atrás para reenviar el código
  useEffect(() => {
    if (espera <= 0) return;
    const t = window.setTimeout(() => setEspera((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [espera]);

  const fallo = (e: unknown, extra?: Aviso['accion']) => {
    const { code, texto } = codigoError(e);
    const red = e instanceof TypeError || /network|fetch/i.test(texto);
    setAviso({ texto: textoError(red ? 'red' : code, texto), accion: extra });
  };

  /** Abre la sesión con un pequeño «salto» de la escena antes (si hay movimiento) */
  const terminar = async (sesion: string | null) => {
    if (!sesion) {
      setAviso({ texto: 'Falta un paso que esta pantalla no sabe completar. Avísale a tu formador.' });
      return;
    }
    const antes = paso;
    setPaso('hecho');
    limpiarUrl();
    if (!reduce) await new Promise((r) => window.setTimeout(r, 900));
    try {
      await clerk.setActive({ session: sesion });
    } catch (e) {
      setPaso(antes === 'hecho' ? 'correo' : antes);
      throw e;
    }
  };

  /* ---------- Vuelta de Google ---------- */
  const vueltaHecha = useRef(false);
  useEffect(() => {
    if (!vueltaGoogle || !listo || vueltaHecha.current) return;
    vueltaHecha.current = true;
    const base = `${URL_APP}?${PARAM_VUELTA}=`;
    void clerk
      .handleRedirectCallback(
        {
          signInUrl: `${base}entrar`,
          signUpUrl: `${base}registro`,
          signInForceRedirectUrl: URL_APP,
          signUpForceRedirectUrl: URL_APP,
          continueSignUpUrl: `${base}completar`,
          firstFactorUrl: `${base}factor`,
          secondFactorUrl: `${base}factor`,
          resetPasswordUrl: `${base}factor`,
        },
        async (a: string) => {
          const destino = new URL(a, URL_APP).searchParams.get(PARAM_VUELTA);
          limpiarUrl();
          setOcupado(null);
          if (!destino) return; // Sesión abierta: <Show signed-in> monta la app
          const s = clerk.client?.signUp;
          if (destino === 'completar' && s?.missingFields?.every((f) => f === 'first_name' || f === 'last_name')) {
            setModo('registro');
            setNombre(s.firstName ?? '');
            setApellidos(s.lastName ?? '');
            setPaso('completar');
            return;
          }
          const errOAuth = clerk.client?.signIn?.firstFactorVerification?.error ?? s?.verifications?.externalAccount?.error;
          if (errOAuth) fallo({ errors: [errOAuth] });
          else if (destino === 'completar') setAviso({ texto: 'Con Google no hemos podido terminar tu cuenta. Créala con tu correo.' });
          else setAviso({ texto: 'No se ha podido terminar el acceso con Google. Prueba con tu correo.' });
        },
      )
      .catch((e: unknown) => {
        limpiarUrl();
        setOcupado(null);
        fallo(e);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listo]);

  /* ---------- Google ---------- */
  const conGoogle = async () => {
    if (!listo || ocupado) return;
    setAviso(null);
    setOcupado('google');
    try {
      const recurso = modo === 'registro' ? signUp : signIn;
      await recurso.authenticateWithRedirect({ strategy: 'oauth_google', redirectUrl: URL_VUELTA, redirectUrlComplete: URL_APP });
    } catch (e) {
      setOcupado(null);
      fallo(e);
    }
  };

  /* ---------- Invitación ---------- */
  const aceptarInvitacion = async () => {
    if (!listo || !invitacion || ocupado) return;
    setAviso(null);
    setOcupado('enviar');
    try {
      if (invitacion.entrar) {
        const r = await signIn.create({ strategy: 'ticket', ticket: invitacion.ticket });
        await terminar(r.status === 'complete' ? r.createdSessionId : null);
      } else {
        const datos = { strategy: 'ticket' as const, ticket: invitacion.ticket, ...(nombre ? { firstName: nombre.trim() } : {}), ...(apellidos ? { lastName: apellidos.trim() } : {}) };
        const r = await signUp.create(datos).catch((e) => (codigoError(e).code === 'form_param_unknown' ? signUp.create({ strategy: 'ticket', ticket: invitacion.ticket }) : Promise.reject(e)));
        await terminar(r.status === 'complete' ? r.createdSessionId : null);
      }
    } catch (e) {
      fallo(e);
    } finally {
      setOcupado(null);
    }
  };

  /* ---------- Correo → código ---------- */
  const cambiarModo = (m: Modo, conservarCorreo = true, enfocar = true) => {
    setModo(m);
    setPaso('correo');
    setCodigo('');
    setAviso(null);
    if (!conservarCorreo) setCorreo('');
    if (enfocar && m === 'entrar') window.setTimeout(() => correoRef.current?.focus(), 30);
  };

  const enviarCodigo = async (ev?: FormEvent) => {
    ev?.preventDefault();
    if (!listo || ocupado) return;
    const c = correo.trim();
    if (!correoValido(c)) return setAviso({ texto: 'Escribe tu correo completo, por ejemplo nombre@' + (DOMINIO || 'empresa.com') + '.' });
    if (!correoPermitido(c)) return setAviso({ texto: `Ese correo no es de O&S. Usa tu correo @${DOMINIO}.` });
    if (modo === 'registro' && (!nombre.trim() || !apellidos.trim())) return setAviso({ texto: 'Escribe tu nombre y tus apellidos.' });
    setAviso(null);
    setOcupado('enviar');
    try {
      if (modo === 'entrar') {
        const r = await signIn.create({ identifier: c });
        const f = r.supportedFirstFactors?.find((x) => x.strategy === 'email_code');
        if (!f || !('emailAddressId' in f)) throw { code: 'sin_codigo' };
        await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: f.emailAddressId });
      } else {
        const datos = { emailAddress: c, firstName: nombre.trim(), lastName: apellidos.trim() };
        // Si la instancia no tiene activados nombre y apellidos, se crea sin ellos
        await signUp.create(datos).catch((e) => (codigoError(e).code === 'form_param_unknown' ? signUp.create({ emailAddress: c }) : Promise.reject(e)));
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      }
      setCodigo('');
      setPaso('codigo');
      setEspera(ESPERA_REENVIO);
    } catch (e) {
      const { code } = codigoError(e);
      if (code === 'form_identifier_not_found')
        setAviso({ texto: 'No hay ninguna cuenta con este correo.', accion: { texto: 'Crear cuenta con este correo', hacer: () => cambiarModo('registro') } });
      else if (code === 'form_identifier_exists')
        setAviso({ texto: 'Ya tienes cuenta con este correo.', accion: { texto: 'Entrar con este correo', hacer: () => cambiarModo('entrar') } });
      else fallo(e);
    } finally {
      setOcupado(null);
    }
  };

  const reenviar = async () => {
    if (!listo || ocupado || espera > 0) return;
    setAviso(null);
    setOcupado('reenviar');
    try {
      if (modo === 'entrar') {
        const f = signIn.supportedFirstFactors?.find((x) => x.strategy === 'email_code');
        if (!f || !('emailAddressId' in f)) throw { code: 'sin_codigo' };
        await signIn.prepareFirstFactor({ strategy: 'email_code', emailAddressId: f.emailAddressId });
      } else await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setCodigo('');
      setEspera(ESPERA_REENVIO);
      setReenviado(true);
    } catch (e) {
      fallo(e);
    } finally {
      setOcupado(null);
    }
  };

  const verificar = async (valor = codigo, ev?: FormEvent) => {
    ev?.preventDefault();
    if (!listo || ocupado) return;
    if (!RE_CODIGO.test(valor)) return setAviso({ texto: 'El código tiene 6 cifras. Míralo en el correo que te acabamos de enviar.' });
    setAviso(null);
    setOcupado('verificar');
    try {
      if (modo === 'entrar') {
        const r = await signIn.attemptFirstFactor({ strategy: 'email_code', code: valor });
        if (r.status === 'needs_second_factor') throw { code: 'segundo_factor' };
        await terminar(r.status === 'complete' ? r.createdSessionId : null);
      } else {
        const r = await signUp.attemptEmailAddressVerification({ code: valor });
        if (r.status !== 'complete') {
          console.warn('[acceso] faltan campos', r.missingFields);
          throw { code: 'faltan_campos' };
        }
        await terminar(r.createdSessionId);
      }
    } catch (e) {
      fallo(e);
      setCodigo('');
    } finally {
      setOcupado(null);
    }
  };

  const completar = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!listo || ocupado) return;
    if (!nombre.trim() || !apellidos.trim()) return setAviso({ texto: 'Escribe tu nombre y tus apellidos para terminar.' });
    setAviso(null);
    setOcupado('enviar');
    try {
      const r = await signUp.update({ firstName: nombre.trim(), lastName: apellidos.trim() });
      await terminar(r.status === 'complete' ? r.createdSessionId : null);
    } catch (e) {
      fallo(e);
    } finally {
      setOcupado(null);
    }
  };

  const cambiarCodigo = (v: string) => {
    setCodigo(v);
    if (aviso) setAviso(null);
    if (RE_CODIGO.test(v)) void verificar(v);
  };

  /* ---------- Pintado ---------- */
  const anim = () =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
      : { initial: { opacity: 0, x: 24, filter: 'blur(6px)' }, animate: { opacity: 1, x: 0, filter: 'blur(0px)' }, exit: { opacity: 0, x: -24, filter: 'blur(6px)' }, transition: { duration: 0.35, ease: [0.2, 0.7, 0.2, 1] as const } };

  const cargandoClerk = !listo || ocupado === 'vuelta';
  const [tarda, setTarda] = useState(false);
  useEffect(() => {
    if (!cargandoClerk) return setTarda(false);
    const t = window.setTimeout(() => setTarda(true), 9000);
    return () => window.clearTimeout(t);
  }, [cargandoClerk]);
  const titulo = paso === 'hecho' ? '¡Dentro!' : paso === 'codigo' ? 'Revisa tu correo' : paso === 'completar' ? 'Un último dato' : invitacion ? 'Tienes una invitación' : modo === 'entrar' ? 'Entra en tu formación' : 'Tu primera vez aquí';

  return (
    <div className="acc-form">
      {paso === 'correo' && !invitacion && (
        <div className="acc-tabs" role="tablist" aria-label="Elige cómo acceder">
          {(['entrar', 'registro'] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              id={`acc-tab-${m}`}
              aria-selected={modo === m}
              aria-controls="acc-panel"
              tabIndex={modo === m ? 0 : -1}
              className={`acc-tab${modo === m ? ' activo' : ''}`}
              onClick={() => cambiarModo(m)}
              onKeyDown={(e) => {
                if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
                  e.preventDefault();
                  const otro = e.key === 'Home' ? 'entrar' : e.key === 'End' ? 'registro' : m === 'entrar' ? 'registro' : 'entrar';
                  cambiarModo(otro, true, false);
                  document.getElementById(`acc-tab-${otro}`)?.focus();
                }
              }}
            >
              {modo === m && <motion.span layoutId="acc-tab-fondo" className="acc-tab-fondo" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}
              <span className="acc-tab-txt">{m === 'entrar' ? 'Entrar' : 'Crear cuenta'}</span>
            </button>
          ))}
        </div>
      )}

      <div id="acc-panel" role={paso === 'correo' && !invitacion ? 'tabpanel' : undefined} aria-labelledby={paso === 'correo' && !invitacion ? `acc-tab-${modo}` : undefined} className="acc-panel-cuerpo">
        <h2 className="acc-form-titulo" aria-live="polite">
          {titulo}
        </h2>

        <AnimatePresence mode="wait" initial={false}>
          {cargandoClerk ? (
            <motion.div key="cargando" {...anim()} className="acc-cargando" role="status">
              <Spinner /> {ocupado === 'vuelta' ? 'Terminando el acceso con Google…' : 'Conectando con el servicio de acceso…'}
              {tarda && (
                <span className="acc-tarda" role="alert">
                  No conseguimos conectar con el acceso. Revisa tu red o desactiva el bloqueador de anuncios.
                  <button type="button" className="acc-error-accion" onClick={() => window.location.reload()}>
                    Reintentar
                  </button>
                </span>
              )}
            </motion.div>
          ) : paso === 'hecho' ? (
            <motion.div key="hecho" {...anim()} className="acc-hecho" role="status">
              <svg viewBox="0 0 52 52" className="acc-check" aria-hidden="true">
                <circle cx="26" cy="26" r="24" />
                <path d="M15 27l7 7 15-16" />
              </svg>
              <p>Abriendo tu formación…</p>
            </motion.div>
          ) : invitacion && paso === 'correo' ? (
            <motion.div key="invitacion" {...anim()} className="acc-pasos">
              <p className="acc-ayuda">{invitacion.entrar ? 'Pulsa el botón para entrar con tu invitación.' : 'Tu formador te ha invitado. Dinos tu nombre y entra.'}</p>
              {!invitacion.entrar && <CamposNombre nombre={nombre} apellidos={apellidos} setNombre={setNombre} setApellidos={setApellidos} />}
              <Boton type="button" ocupado={ocupado === 'enviar'} textoOcupado="Entrando…" onClick={() => void aceptarInvitacion()}>
                Aceptar invitación y entrar
              </Boton>
            </motion.div>
          ) : paso === 'completar' ? (
            <motion.form key="completar" {...anim()} className="acc-pasos" onSubmit={(e) => void completar(e)} noValidate>
              <p className="acc-ayuda">Google no nos ha dado tu nombre. Escríbelo para terminar.</p>
              <CamposNombre nombre={nombre} apellidos={apellidos} setNombre={setNombre} setApellidos={setApellidos} />
              <Boton type="submit" ocupado={ocupado === 'enviar'} textoOcupado="Guardando…">
                Terminar y entrar
              </Boton>
            </motion.form>
          ) : paso === 'codigo' ? (
            <motion.form key="codigo" {...anim()} className="acc-pasos" onSubmit={(e) => void verificar(codigo, e)} noValidate>
              <p className="acc-ayuda">
                Te hemos enviado un código a <b className="acc-correo-dest">{correo.trim()}</b>. Suele llegar en menos de un minuto; si no lo ves, mira en «Correo no deseado». No cierres esta pestaña: al escribir la sexta cifra entras solo.
              </p>
              <CampoCodigo valor={codigo} onCambio={cambiarCodigo} invalido={!!aviso} desactivado={ocupado === 'verificar'} idError={idError} />
              <Boton type="submit" ocupado={ocupado === 'verificar'} textoOcupado="Comprobando…" disabled={codigo.length < 6 && !ocupado}>
                Entrar
              </Boton>
              <p className="acc-ok" role="status">
                {reenviado ? `Código nuevo enviado a ${correo.trim()}.` : ''}
              </p>
              <div className="acc-enlaces">
                <button type="button" className="acc-link" onClick={() => void reenviar()} disabled={espera > 0 || !!ocupado}>
                  {ocupado === 'reenviar' ? 'Enviando…' : espera > 0 ? `Reenviar código en ${espera} s` : 'Reenviar código'}
                </button>
                <button type="button" className="acc-link" onClick={() => cambiarModo(modo)}>
                  Cambiar de correo
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div key={modo} {...anim()} className="acc-pasos">
              <button type="button" className="acc-google" onClick={() => void conGoogle()} disabled={!!ocupado} aria-busy={ocupado === 'google'}>
                <span className="acc-google-logo">{ocupado === 'google' ? <Spinner /> : <LogoGoogle />}</span>
                <span>{ocupado === 'google' ? 'Abriendo Google…' : modo === 'entrar' ? 'Entrar con Google' : 'Crear cuenta con Google'}</span>
              </button>
              <div className="acc-sep" role="separator">
                <span>o con tu correo</span>
              </div>
              {modo === 'registro' && <p className="acc-ayuda">Escribe tu nombre, tus apellidos y tu correo de O&amp;S. Te enviamos un código y entras. Sin contraseñas.</p>}
              {modo === 'entrar' && (
                <p className="acc-ayuda">
                  Te enviamos un código a tu correo de O&amp;S para entrar. Sin contraseñas. ¿Es tu primer día?{' '}
                  <button type="button" className="acc-link acc-link-linea" onClick={() => cambiarModo('registro')}>
                    Crea tu cuenta
                  </button>
                </p>
              )}
              <form className="acc-pasos" onSubmit={(e) => void enviarCodigo(e)} noValidate>
                {modo === 'registro' && <CamposNombre nombre={nombre} apellidos={apellidos} setNombre={setNombre} setApellidos={setApellidos} />}
                <CampoCorreo refInput={correoRef} valor={correo} onCambio={(v) => (setCorreo(v), aviso && setAviso(null))} invalido={!!aviso} idError={idError} enfoque={modo === 'entrar'} />
                {modo === 'registro' && <div id="clerk-captcha" />}
                <Boton type="submit" ocupado={ocupado === 'enviar'} textoOcupado="Enviando el código…" disabled={!!ocupado && ocupado !== 'enviar'}>
                  {modo === 'entrar' ? 'Enviarme el código' : 'Crear cuenta'}
                </Boton>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {aviso && (
            <motion.div
              key={aviso.texto}
              id={idError}
              className="acc-error"
              role="alert"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.98 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, x: [0, -6, 6, -3, 3, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <span>{aviso.texto}</span>
              {aviso.accion && (
                <button type="button" className="acc-error-accion" onClick={aviso.accion.hacer}>
                  {aviso.accion.texto}
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CampoCorreo({ refInput, valor, onCambio, invalido, idError, enfoque }: { refInput: React.RefObject<HTMLInputElement | null>; valor: string; onCambio: (v: string) => void; invalido: boolean; idError: string; enfoque: boolean }) {
  const id = useId();
  const idAyuda = useId();
  return (
    <div className="acc-campo">
      <label htmlFor={id}>Correo de O&amp;S</label>
      <input
        ref={refInput}
        id={id}
        className="acc-input"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={`tu.nombre@${DOMINIO || 'empresa.com'}`}
        value={valor}
        aria-invalid={invalido}
        aria-describedby={invalido ? `${idAyuda} ${idError}` : idAyuda}
        onChange={(e) => onCambio(e.target.value)}
        autoFocus={enfoque && window.matchMedia('(pointer: fine)').matches}
      />
      <small id={idAyuda} className="acc-pista sr-only">
        Solo cuentas @{DOMINIO || 'empresa'}
      </small>
    </div>
  );
}

function CamposNombre({ nombre, apellidos, setNombre, setApellidos }: { nombre: string; apellidos: string; setNombre: (v: string) => void; setApellidos: (v: string) => void }) {
  const a = useId();
  const b = useId();
  return (
    <div className="acc-fila">
      <div className="acc-campo">
        <label htmlFor={a}>Nombre</label>
        <input id={a} className="acc-input" autoComplete="given-name" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </div>
      <div className="acc-campo">
        <label htmlFor={b}>
          Apellidos
        </label>
        <input id={b} className="acc-input" autoComplete="family-name" value={apellidos} onChange={(e) => setApellidos(e.target.value)} />
      </div>
    </div>
  );
}
