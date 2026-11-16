import type { MomentoVideo } from '../../content/videoMapa';
import { BotonMomento } from '../video';

/** Botones «Míralo en el vídeo»: abren el clip en una ventana, en el segundo exacto, sin salir del ejercicio */
export function Momentos({ lista, compacto = false }: { lista: MomentoVideo[]; compacto?: boolean }) {
  if (!lista.length) return null;
  return (
    <div className={`vm-list${compacto ? ' sm' : ''}`}>
      {lista.map((m, i) => (
        <BotonMomento key={`${m.capitulo}-${m.t}-${i}`} m={m} />
      ))}
    </div>
  );
}
