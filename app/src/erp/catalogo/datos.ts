/* Carga bajo demanda del catálogo de pantallas (app/public/erp-cat): menú, índice del buscador y objetos. */
import { useEffect, useState } from 'react';
import type { CatBuscar, CatMenuNodo, CatObjeto } from './tipos';

const BASE = `${import.meta.env.BASE_URL}erp-cat/`;
const cache = new Map<string, Promise<unknown>>();
const hechos = new Map<string, unknown>();

function carga<T>(ruta: string): Promise<T> {
  let p = cache.get(ruta) as Promise<T> | undefined;
  if (!p) {
    p = fetch(BASE + ruta).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${ruta}`);
      return r.json() as Promise<T>;
    });
    p.then((v) => hechos.set(ruta, v)).catch(() => cache.delete(ruta));
    cache.set(ruta, p);
  }
  return p;
}

/** Hook genérico: devuelve el JSON (o undefined mientras carga) y el error si lo hay */
function useCarga<T>(ruta: string | null): { datos?: T; error?: string } {
  const [st, setSt] = useState<{ ruta: string | null; datos?: T; error?: string }>(() => ({ ruta, datos: ruta ? (hechos.get(ruta) as T | undefined) : undefined }));
  useEffect(() => {
    if (!ruta) return;
    if (hechos.has(ruta)) {
      setSt({ ruta, datos: hechos.get(ruta) as T });
      return;
    }
    let vivo = true;
    carga<T>(ruta).then(
      (datos) => vivo && setSt({ ruta, datos }),
      (e: Error) => vivo && setSt({ ruta, error: e.message }),
    );
    return () => {
      vivo = false;
    };
  }, [ruta]);
  return st.ruta === ruta ? st : { datos: ruta ? (hechos.get(ruta) as T | undefined) : undefined };
}

export const useMenu = () => useCarga<CatMenuNodo[]>('menu.json');
export const useBuscar = () => useCarga<CatBuscar[]>('buscar.json');
export const useObjeto = (code: string | null) => useCarga<CatObjeto>(code ? `obj/${code}.json` : null);
export const cargaObjeto = (code: string) => carga<CatObjeto>(`obj/${code}.json`);
export const cargaBuscar = () => carga<CatBuscar[]>('buscar.json');
/** Objeto ya cargado (sin esperar) */
export const objetoCargado = (code: string) => hechos.get(`obj/${code}.json`) as CatObjeto | undefined;

/** Nombre del menú de un código (el de la primera hoja que lo abre) */
export function nombreMenu(lista: CatBuscar[] | undefined, code: string) {
  return lista?.find((x) => x[1] === code)?.[0];
}
