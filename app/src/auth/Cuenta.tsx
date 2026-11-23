/** Botón de usuario, estado de la copia en la cuenta y botón de salir (en la barra superior). */
import { useState } from 'react';
import { useClerk, useUser } from '@clerk/react';
import { CLERK_ACTIVO, useEstadoSync } from './Acceso';
import { vaciarPendiente } from './sincronizar';

const TEXTO = {
  cargando: 'Cargando tu progreso…',
  'al-dia': 'Progreso guardado en tu cuenta',
  guardando: 'Guardando en tu cuenta…',
  pendiente: 'Cambios pendientes de guardar (se guardan solos)',
  error: 'Sin conexión con la cuenta: se guarda en este navegador y se reintentará',
} as const;

function Salir() {
  const { signOut } = useClerk();
  const [saliendo, setSaliendo] = useState(false);
  return (
    <button
      type="button"
      className="acc-salir"
      disabled={saliendo}
      onClick={async () => {
        setSaliendo(true);
        try {
          await vaciarPendiente();
        } finally {
          await signOut({ redirectUrl: window.location.origin + window.location.pathname });
        }
      }}
    >
      {saliendo ? 'Saliendo…' : 'Salir'}
    </button>
  );
}

/** Avatar propio (sin el menú de Clerk): foto de la cuenta o iniciales, con el nombre y el correo al pasar el ratón */
function Avatar() {
  const { user } = useUser();
  if (!user) return null;
  const nombre = user.fullName || user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'Tú';
  const correo = user.primaryEmailAddress?.emailAddress ?? '';
  const iniciales = nombre
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('');
  const etiqueta = correo ? `${nombre} · ${correo}` : nombre;
  return (
    <span className="acc-avatar" title={etiqueta} aria-label={`Has entrado como ${etiqueta}`} role="img">
      {user.hasImage ? <img src={user.imageUrl} alt="" width={32} height={32} /> : iniciales}
    </span>
  );
}

function CuentaClerk() {
  const estado = useEstadoSync();
  return (
    <div className="acc-cuenta">
      {estado && <span className={`acc-sync acc-sync-${estado}`} role="status" title={TEXTO[estado]} aria-label={TEXTO[estado]} />}
      <Avatar />
      <Salir />
    </div>
  );
}

export function Cuenta() {
  return CLERK_ACTIVO ? <CuentaClerk /> : null;
}
