import { META, MODULOS } from '../content';
import { APROBADO, ejercicioCompletado, type Progreso } from './progress';
import { clavesActivas } from './examenModulo';

export interface Insignia {
  id: string;
  titulo: string;
  texto: string;
  color: string;
  ganada: (p: Progreso) => boolean;
}

const modCompleto = (p: Progreso, id: string) => {
  const m = MODULOS.find((x) => x.id === id);
  return !!m && m.ejercicios.length > 0 && m.ejercicios.every((e) => ejercicioCompletado(p.ejercicios[e.id]));
};

export const INSIGNIAS: Insignia[] = [
  { id: 'primer-paso', titulo: 'Primer clic', texto: 'Completa un recorrido guiado.', color: '#4fbfa5', ganada: (p) => Object.values(p.ejercicios).some((e) => e.guiado) },
  { id: 'sin-fallos', titulo: 'Diez de diez', texto: 'Saca un test perfecto.', color: '#f2a93b', ganada: (p) => Object.values(p.ejercicios).some((e) => e.test === 1) },
  { id: 'manos', titulo: 'Manos en la demo', texto: 'Completa una checklist en la demo real.', color: '#6c8fd6', ganada: (p) => {
      return MODULOS.some((m) => m.ejercicios.some((e) => e.checklist.length > 0 && (p.ejercicios[e.id]?.demo.length ?? 0) >= e.checklist.length));
    } },
  { id: 'cuadrado', titulo: 'Asiento cuadrado', texto: 'Cuadra un asiento en el simulador.', color: '#8a7be0', ganada: (p) => !!p.sims['asiento'] },
  { id: 'taller', titulo: 'Taller completo', texto: 'Supera todos los simuladores.', color: '#e0708a', ganada: (p) => ['asiento', 'numerador', 'circuito', 'docflow', 'factura', 'cartera'].every((s) => p.sims[s]) },
  ...MODULOS.map((m) => ({
    id: `mod-${m.id}`,
    titulo: m.titulo,
    texto: 'Termina todos los bloques del módulo.',
    color: META[m.id]?.color ?? '#2a9c83',
    ganada: (p: Progreso) => modCompleto(p, m.id),
  })),
  ...clavesActivas().map(({ clave, moduloId }) => ({
    id: `exm-${clave}`,
    titulo: `Examen: ${META[moduloId]?.corto ?? clave}`,
    texto: `Aprueba el examen del módulo (${Math.round(APROBADO * 100)} %).`,
    color: META[moduloId]?.color ?? '#2a9c83',
    ganada: (p: Progreso) => (p.examenes?.[clave] ?? 0) >= APROBADO,
  })),
  { id: 'listo', titulo: 'Listo para el examen', texto: 'Completa todos los módulos.', color: '#1f2738', ganada: (p) => MODULOS.length > 0 && MODULOS.every((m) => modCompleto(p, m.id)) },
];

export function insigniasGanadas(p: Progreso) {
  return INSIGNIAS.filter((b) => b.ganada(p)).map((b) => b.id);
}
