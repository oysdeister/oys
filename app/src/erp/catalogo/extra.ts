/* Botones reales del menú «Acciones ⋮» de Axional para las pantallas propias (las que tienen lógica de circuito):
   los que la pantalla no implementa responden como en el ERP (diálogo y mensaje del proceso). */
import { useErp, type Accion } from '../ui';
import { almacen } from './almacen';
import { efectoBoton } from './botones';
import { useObjeto } from './datos';

/** Acciones del catálogo del grupo «Acciones» que no están en `excluir` (por etiqueta) */
export function useAccionesCatalogo(code: string | undefined, excluir: string[] = []): Accion[] {
  const { datos: obj } = useObjeto(code ?? null);
  const { aviso, ini } = useErp();
  if (!obj?.bot || !code) return [];
  return obj.bot
    .filter((b) => b.g && !excluir.includes(b.l))
    .map((b) => ({
      label: b.l,
      lugar: 'acciones' as const,
      onClick: () => {
        const ef = efectoBoton({ ...obj, cols: [] }, b, { _k: '' });
        almacen.registrar(code, '-', ini, b.l);
        aviso(ef.tipo, ef.mensaje);
      },
    }));
}
/** Entradas del menú ⌄ del título según el catálogo (Docflow, Asientos contables…), salvo las de `excluir` */
export function useEnlacesCatalogo(code: string | undefined, excluir: string[] = []): Accion[] {
  const { datos: obj } = useObjeto(code ?? null);
  const { noDisp } = useErp();
  if (!obj?.enl) return [];
  return obj.enl.filter((e) => !excluir.includes(e.l)).map((e) => ({ label: e.l, lugar: 'menu' as const, onClick: () => noDisp(e.l) }));
}
