/** Datos que la portada pasa a la escena 3D (sin contextos de React: la escena vive en su propio árbol) */
export interface PlanetaDato {
  id: string;
  nombre: string;
  /** Color del módulo en hex (#rrggbb) */
  color: string;
  icono: string;
  /** Avance del módulo de 0 a 1 */
  valor: number;
}

export interface EscenaProps {
  planetas: PlanetaDato[];
  /** Avance global de 0 a 1 */
  global: number;
  /** Módulo en curso (se marca con más brillo) */
  activo?: string;
  /** Sin animaciones: escena quieta y se pinta solo cuando cambia algo */
  reducir: boolean;
  /** true: escena centrada (anchos medios y móvil); false: escena a la derecha, por detrás del titular */
  centrada: boolean;
  onIr: (id: string) => void;
}

/** ¿Puede este navegador pintar WebGL? */
export function hayWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Generador pseudoaleatorio con semilla (el cielo es siempre el mismo) */
export function rng(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
