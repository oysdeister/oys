/** Botón de usuario, estado de la copia en la cuenta y botón de salir (en la barra superior). */
import { useState } from 'react';
import { UserButton, useClerk } from '@clerk/clerk-react';
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
          await signOut();
        }
      }}
    >
      {saliendo ? 'Saliendo…' : 'Salir'}
    </button>
  );
}

function CuentaClerk() {
  const estado = useEstadoSync();
  return (
    <div className="acc-cuenta">
      {estado && <span className={`acc-sync acc-sync-${estado}`} role="status" title={TEXTO[estado]} aria-label={TEXTO[estado]} />}
      <UserButton />
      <Salir />
    </div>
  );
}

export function Cuenta() {
  return CLERK_ACTIVO ? <CuentaClerk /> : null;
}
