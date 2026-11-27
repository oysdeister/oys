import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../Icon';

const ITEMS = [
  { to: '/', label: 'Inicio', icon: 'inicio' },
  { to: '/taller', label: 'Taller', icon: 'taller' },
  { to: '/video', label: 'Vídeos', icon: 'video' },
  { to: '/logros', label: 'Logros', icon: 'logros' },
];

/**
 * Barra inferior del móvil: solo accesos, sin botón de avance (para avanzar está «Siguiente» o «Continuar» en la página).
 * Dentro de una lección no se muestra, para que no tape el texto ni los botones del pie.
 */
export function BottomNav() {
  const loc = useLocation();
  if (loc.pathname.startsWith('/ejercicio/')) return null;
  return (
    <nav className="gbn" aria-label="Accesos rápidos">
      <div className="gbn-bar">
        {ITEMS.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.to === '/'}>
            <Icon name={n.icon} size={20} />
            {n.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
