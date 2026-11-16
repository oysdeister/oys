import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../Icon';
import { todosEjercicios } from '../../content';
import { ejercicioCompletado, useProgreso } from '../../lib/progress';

const IZQ = [
  { to: '/', label: 'Inicio', icon: 'inicio' },
  { to: '/taller', label: 'Taller', icon: 'taller' },
];
const DER = [
  { to: '/video', label: 'Vídeo', icon: 'video' },
  { to: '/logros', label: 'Logros', icon: 'logros' },
];

function Item({ to, label, icon }: { to: string; label: string; icon: string }) {
  return (
    <NavLink to={to} end={to === '/'}>
      {({ isActive }) => (
        <>
          {isActive && <motion.span layoutId="bn-pill" className="bn-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <Icon name={icon} />
          {label}
        </>
      )}
    </NavLink>
  );
}

/** Barra inferior del móvil: 4 accesos y, en la muesca central, el botón luminoso «Seguir» (o «Examen» al acabarlo todo) */
export function BottomNav() {
  const p = useProgreso();
  const sig = todosEjercicios().find(({ ejercicio }) => !ejercicioCompletado(p.ejercicios[ejercicio.id]));
  const destino = sig ? `/ejercicio/${sig.ejercicio.id}` : '/examen';
  const rotulo = sig ? 'Seguir' : 'Examen';
  return (
    <nav className="bottom-nav" aria-label="Accesos rápidos">
      <div className="bn-bar">
        {IZQ.map((n) => (
          <Item key={n.to} {...n} />
        ))}
        <span className="bn-hueco" aria-hidden="true" />
        {DER.map((n) => (
          <Item key={n.to} {...n} />
        ))}
      </div>
      <Link to={destino} className="bn-main" aria-label={sig ? `Seguir con: ${sig.ejercicio.titulo}` : 'Ir al examen final'}>
        <span className="bn-main-orb">
          <Icon name={sig ? 'play' : 'examen'} size={26} />
        </span>
        <span className="bn-main-txt">{rotulo}</span>
      </Link>
    </nav>
  );
}
