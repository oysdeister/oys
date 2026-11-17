import { useEffect, useMemo, useState } from 'react';
import type { CatBoton, CatCol, CatObjeto, CatTab, CatValor } from './tipos';
import { cargaObjeto, useBuscar, useObjeto } from './datos';
import { almacen, claveTexto, filaNueva, filasDe, hoyIso, useGen, type Fila } from './almacen';
import { colEstado, destinoEnlace, dialogoDe, efectoBoton, estadoBoton, type DialogoBoton as TipoDialogoBoton } from './botones';
import { evalua } from './expresion';
import { useErp, Lista, Ficha, Seccion, Rejilla, CampoTexto, CampoNum, CampoFecha, CampoSel, CampoCheck, CampoLectura, Pestanas, Dialogo, type Col, type Accion, dec, fechaEs } from '../ui';

export function textoValor(col: CatCol, v: CatValor | undefined): string {
  if (v === null || v === undefined || v === '') return '';
  if (col.o) {
    const opcion = col.o.find((o) => o.k === v);
    return opcion?.v ?? String(v);
  }
  if (col.t === 'd') return fechaEs(String(v).slice(0, 10));
  if (col.t === 'dt') {
    const s = String(v);
    const fecha = fechaEs(s.slice(0, 10));
    const hora = s.length > 10 ? s.slice(11, 16) : '';
    return hora ? `${fecha} ${hora}` : fecha;
  }
  if (col.t === 'n') {
    const n = Number(v);
    return Number.isFinite(n) ? dec(n, col.sc ?? 2) : '';
  }
  if (col.t === 'i') return String(v);
  if (col.t === 'b') return v ? 'Sí' : 'No';
  return String(v);
}

function Valor({ col, v }: { col: CatCol; v: CatValor | undefined }) {
  if (v === null || v === undefined || v === '') return null;
  if (col.o) {
    const opcion = col.o.find((o) => o.k === v);
    const texto = opcion?.v ?? String(v);
    if (opcion?.c) {
      return (
        <span className="erp-estado-pt">
          <i style={{ background: opcion.c }} />
          {texto}
        </span>
      );
    }
    return <>{texto}</>;
  }
  if (col.t === 'd') return <>{fechaEs(String(v).slice(0, 10))}</>;
  if (col.t === 'dt') {
    const s = String(v);
    const fecha = fechaEs(s.slice(0, 10));
    const hora = s.length > 10 ? s.slice(11, 16) : '';
    return <>{hora ? `${fecha} ${hora}` : fecha}</>;
  }
  if (col.t === 'n') {
    const n = Number(v);
    return <>{Number.isFinite(n) ? dec(n, col.sc ?? 2) : ''}</>;
  }
  if (col.t === 'i') return <>{String(v)}</>;
  if (col.t === 'b') return <>{v ? 'Sí' : 'No'}</>;
  return <>{String(v)}</>;
}

function Campo({ col, valor, onChange, soloLectura }: { col: CatCol; valor: CatValor | undefined; onChange: (v: CatValor) => void; soloLectura: boolean }) {
  if (soloLectura) {
    return (
      <CampoLectura
        label={col.l}
        valor={<Valor col={col} v={valor} />}
        req={!!col.req}
        ayuda={col.h}
        num={col.t === 'i' || col.t === 'n'}
      />
    );
  }

  if (col.chk) {
    const opcionSi = col.o?.find((o) => ['S', '1', 'Y'].includes(o.k));
    const opcionNo = col.o?.find((o) => !['S', '1', 'Y'].includes(o.k)) ?? { k: 'N', v: 'No' };
    const v = String(valor ?? '');
    const activo = ['S', '1', 'Y'].includes(v);
    return (
      <CampoCheck
        label={col.l}
        value={activo}
        onChange={(nuevo) => onChange(nuevo ? (opcionSi?.k ?? 'S') : (opcionNo?.k ?? 'N'))}
      />
    );
  }

  if (col.o) {
    const opciones = col.o.map((o) => ({ v: o.k, t: o.v }));
    return (
      <CampoSel
        label={col.l}
        req={!!col.req}
        ayuda={col.h}
        value={String(valor ?? '')}
        onChange={(v) => onChange(v)}
        opciones={opciones}
        vacio={col.req ? undefined : ''}
      />
    );
  }

  if (col.t === 'd' || col.t === 'dt') {
    const fecha = String(valor ?? '').slice(0, 10);
    return (
      <CampoFecha
        label={col.l}
        req={!!col.req}
        ayuda={col.h}
        value={fecha}
        onChange={(v) => onChange(v)}
      />
    );
  }

  if (col.t === 'i' || col.t === 'n') {
    const decimales = col.t === 'i' ? 0 : (col.sc ?? 2);
    const num = Number(valor ?? 0);
    return (
      <CampoNum
        label={col.l}
        req={!!col.req}
        ayuda={col.h}
        value={Number.isFinite(num) ? num : 0}
        onChange={(v) => onChange(v)}
        decimales={decimales}
      />
    );
  }

  return (
    <CampoTexto
      label={col.l}
      req={!!col.req}
      ayuda={col.h}
      value={String(valor ?? '')}
      onChange={(v) => onChange(col.up ? v.toUpperCase() : v)}
      mono={!!col.fk}
    />
  );
}

function VistaLista({ obj, code }: { obj: CatObjeto; code: string }) {
  const { ini, ir, aviso } = useErp();
  const gen = useGen();
  const [filtroActivo, setFiltroActivo] = useState<string | null>(null);

  const todas = filasDe(obj, gen);
  const ce = colEstado(obj);

  const filasFiltradas = useMemo(() => {
    if (filtroActivo && ce) {
      const opcion = ce.o?.find((o) => o.v === filtroActivo);
      if (opcion) {
        return todas.filter((f) => f[ce.n] === opcion.k);
      }
    }
    return todas;
  }, [todas, filtroActivo, ce]);

  const columnas: Col<Fila>[] = useMemo(() => {
    return (obj.lista ?? [])
      .slice(0, 14)
      .map((n) => {
        const col = obj.cols?.find((c) => c.n === n);
        if (!col) return null;
        return {
          titulo: col.l,
          valor: (f: Fila) => <Valor col={col} v={f[n]} />,
          texto: (f: Fila) => textoValor(col, f[n]),
          num: col.t === 'i' || col.t === 'n',
        } as Col<Fila>;
      })
      .filter((c): c is Col<Fila> => c !== null);
  }, [obj]);

  const menu: Accion[] = [
    { label: 'Exportar', onClick: () => aviso('ok', `Exportación generada: ${filasFiltradas.length} filas.`) },
    { label: 'Imprimir', onClick: () => aviso('ok', 'Listado enviado a la cola de impresión.') },
    { label: 'Información', onClick: () => aviso('info', `${obj.tit} · objeto ${code} · ${obj.total ?? filasFiltradas.length} registros en la base TUTORIAL.`) },
  ];

  return (
    <div>
      {obj.filtros?.length ? (
        <div className="erp-fchips">
          {obj.filtros.map((f) => {
            const on = filtroActivo === f;
            return (
              <button
                key={f}
                className={`erp-fchip${on ? ' on' : ''}`}
                onClick={() => {
                  setFiltroActivo(on ? null : f);
                  if (!on) aviso('info', `Filtro «${f}» aplicado.`);
                }}
              >
                {f}
              </button>
            );
          })}
        </div>
      ) : null}
      <Lista<Fila>
        titulo={obj.tit}
        filas={filasFiltradas}
        cols={columnas}
        clave={(f) => f._k}
        onAbrir={(f) => ir(`obj:${code}`, f._k)}
        onNuevo={obj.perm?.i ? () => ir(`obj:${code}`, 'nuevo') : undefined}
        marcarMios={(f) => f._autor === ini}
        menu={menu}
      />
    </div>
  );
}

function VistaFicha({ obj, code, clave }: { obj: CatObjeto; code: string; clave: string }) {
  const { ini, ir, aviso } = useErp();
  const gen = useGen();
  const { datos: buscar } = useBuscar();
  const [f, setF] = useState<Fila>(() => {
    if (clave === 'nuevo') return filaNueva(obj);
    return filasDe(obj, gen).find((x) => x._k === clave) ?? filaNueva(obj);
  });
  const insertando = clave === 'nuevo';
  const [original, setOriginal] = useState<Fila>(() => f);
  const [dialogo, setDialogo] = useState<{ b: CatBoton; d: TipoDialogoBoton } | null>(null);

  useEffect(() => {
    const nueva = clave === 'nuevo' ? filaNueva(obj) : (filasDe(obj, gen).find((x) => x._k === clave) ?? filaNueva(obj));
    setF(nueva);
    setOriginal(nueva);
    setDialogo(null);
  }, [clave, obj, gen]);

  const sucio = useMemo(() => {
    const keys = new Set([...Object.keys(original), ...Object.keys(f)]);
    for (const k of keys) {
      if (!k.startsWith('_')) {
        if ((original[k] ?? null) !== (f[k] ?? null)) return true;
      }
    }
    return false;
  }, [original, f]);

  const foundFila = insertando ? filaNueva(obj) : filasDe(obj, gen).find((x) => x._k === clave);
  if (!insertando && !foundFila) {
    return (
      <div className="erp-tarjeta">
        No se ha encontrado el registro. <button onClick={() => ir(`obj:${code}`, null)}>Volver</button>
      </div>
    );
  }

  const apareceEnPestanaF = (c: CatCol, o: CatObjeto) => {
    return o.lay?.[0]?.cajas?.some((caja) => caja.tabs.some((tab) => tab.k === 'F' && (tab.f ?? []).some(([n]) => n === c.n))) ?? false;
  };

  const guardar = () => {
    const requeridos = (obj.cols ?? []).filter(
      (c) => c.req && !c.ro && c.t !== 'b' && apareceEnPestanaF(c, obj),
    );
    const faltante = requeridos.find(
      (c) => f[c.n] === null || f[c.n] === undefined || f[c.n] === '',
    );
    if (faltante) {
      aviso('error', `El campo «${faltante.l}» es obligatorio.`);
      return;
    }
    if (insertando) {
      const k = almacen.insertar(code, f, ini);
      aviso('ok', 'Éxito', { pantalla: `obj:${code}`, clave: k });
      ir(`obj:${code}`, k);
    } else {
      almacen.actualizar(code, f._k, f, ini);
      aviso('ok', 'Éxito');
    }
  };

  const borrar = () => {
    if (window.confirm('¿Borrar el registro?')) {
      almacen.borrar(code, f._k, ini);
      aviso('ok', 'Registro borrado.');
      ir(`obj:${code}`, null);
    }
  };

  const aplicar = (b: CatBoton, entrada: Record<string, CatValor> = {}) => {
    const ef = efectoBoton(obj, b, f, entrada);
    if (ef.tipo === 'error') {
      aviso('error', ef.mensaje);
      return;
    }
    if (ef.copia) {
      const k = almacen.insertar(code, { ...f, _k: '' }, ini);
      aviso('ok', ef.mensaje, { pantalla: `obj:${code}`, clave: k });
      return;
    }
    if (ef.cambios && Object.keys(ef.cambios).length > 0) {
      const cambios = ef.cambios;
      almacen.actualizar(code, f._k, cambios, ini, 'boton', b.l);
      setF((prev) => ({ ...prev, ...cambios }));
      aviso(ef.tipo, ef.mensaje);
    } else {
      almacen.registrar(code, f._k, ini, b.l);
      aviso(ef.tipo, ef.mensaje);
    }
  };

  const pulsar = (b: CatBoton) => {
    if (sucio) {
      aviso('error', 'Guarde los cambios antes de ejecutar el proceso.');
      return;
    }
    const d = dialogoDe(obj, b);
    if (d) {
      setDialogo({ b, d });
    } else {
      aplicar(b, {});
    }
  };

  const abrirEnlace = (l: string) => {
    const d = destinoEnlace(l, buscar);
    if (d === 'docflow') {
      ir('docflow', null);
    } else if (d) {
      ir(`obj:${d}`, null);
    } else {
      aviso('info', `«${l}» no tiene registros relacionados en la base de práctica.`);
    }
  };

  const acciones: Accion[] = [];
  if (obj.perm?.u || insertando) acciones.push({ label: 'Guardar', lugar: 'guardar', onClick: guardar });
  if (obj.perm?.d && !insertando) acciones.push({ label: 'Borrar', lugar: 'borrar', onClick: borrar });
  for (const b of obj.bot ?? []) {
    const st = estadoBoton(b, f, insertando);
    if (!st.visible) continue;
    acciones.push({ label: b.l, lugar: b.g ? 'acciones' : 'boton', disabled: !st.activo, onClick: () => pulsar(b) });
  }
  if (obj.perm?.i) acciones.push({ label: 'Nuevo', lugar: 'boton', onClick: () => ir(`obj:${code}`, 'nuevo') });

  const menuTitulo: Accion[] = (obj.enl ?? []).map((e) => ({ label: e.l, onClick: () => abrirEnlace(e.l) }));

  const renderCampo = (col: CatCol, valor: CatValor | undefined, soloLectura: boolean, span?: number) => {
    return (
      <div key={col.n} style={span && span > 1 ? { gridColumn: `span ${span}` } : undefined}>
        <Campo
          col={col}
          valor={valor}
          onChange={(v) => setF((prev) => ({ ...prev, [col.n]: v }))}
          soloLectura={soloLectura}
        />
      </div>
    );
  };

  const renderTabContent = (tab: CatTab) => {
    if (tab.k === 'F') {
      const cols = Math.min(4, Math.max(1, tab.g ?? 3));
      return (
        <Rejilla cols={cols}>
          {(tab.f ?? []).map(([n, span]) => {
            const col = obj.cols?.find((c) => c.n === n);
            if (!col) return null;
            const soloLectura = !(obj.perm?.u || insertando) || col.ro === 1 || (typeof col.ro === 'string' && evalua(col.ro, f, insertando));
            return renderCampo(col, f[n], soloLectura, span);
          })}
        </Rejilla>
      );
    } else if (tab.k === 'O') {
      return <SubRejilla code={tab.o} padre={f} />;
    } else {
      return <p className="erp-nota">Contenido calculado por el servidor de Axional ({tab.t || 'script'}).</p>;
    }
  };

  const [tabActiva, setTabActiva] = useState(0);
  const layoutActual = obj.lay?.[tabActiva] ?? obj.lay?.[0];
  const cajas = layoutActual?.cajas ?? [];

  const cuerpo = (
    <>
      {obj.lay && obj.lay.length > 1 && (
        <Pestanas
          tabs={obj.lay.map((L, i) => ({ id: String(i), label: L.l }))}
          actual={String(tabActiva)}
          onCambio={(id) => setTabActiva(Number(id))}
        />
      )}
      <div className="erp-cajas">
        {cajas.map((caja, idx) => {
          const esMedia = caja.s <= 6;
          if (caja.tabs.length > 1) {
            return (
              <div key={idx} className="erp-caja" style={{ gridColumn: `span ${Math.min(12, caja.s)}` }}>
                <Seccion
                  media={esMedia}
                  tabs={caja.tabs.map((tab) => ({ label: tab.t, contenido: renderTabContent(tab) }))}
                />
              </div>
            );
          } else if (caja.tabs.length === 1) {
            const tab = caja.tabs[0];
            const titulo = tab.ht ? '' : tab.t;
            return (
              <div key={idx} className="erp-caja" style={{ gridColumn: `span ${Math.min(12, caja.s)}` }}>
                <Seccion media={esMedia} titulo={titulo}>
                  {renderTabContent(tab)}
                </Seccion>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );

  const estadoTexto = (() => {
    const ce = colEstado(obj);
    if (!ce) return undefined;
    const valorF = f[ce.n];
    if (valorF === null || valorF === undefined || valorF === '') return undefined;
    const opcion = ce.o?.find((o) => o.k === valorF);
    return opcion?.v ?? String(valorF);
  })();

  const tituloFicha = insertando ? 'Nuevo' : claveTexto(obj, f);

  return (
    <>
      <Ficha
        titulo={tituloFicha}
        sub={null}
        estado={estadoTexto}
        acciones={acciones}
        onVolver={() => ir(`obj:${code}`, null)}
        lista={obj.tit}
        menu={menuTitulo}
      >
        {cuerpo}
      </Ficha>
      {dialogo && (
        <DialogoBoton
          d={dialogo.d}
          onAceptar={(entrada) => {
            setDialogo(null);
            aplicar(dialogo.b, entrada);
          }}
          onCerrar={() => setDialogo(null)}
        />
      )}
    </>
  );
}

function DialogoBoton({ d, onAceptar, onCerrar }: { d: TipoDialogoBoton; onAceptar: (entrada: Record<string, CatValor>) => void; onCerrar: () => void }) {
  const { aviso } = useErp();
  const [valores, setValores] = useState<Record<string, CatValor>>(() => {
    const init: Record<string, CatValor> = {};
    for (const c of d.campos) init[c.n] = c.def !== undefined ? c.def : '';
    return init;
  });

  const aceptar = () => {
    for (const c of d.campos) {
      if (c.req && (valores[c.n] === undefined || valores[c.n] === null || valores[c.n] === '')) {
        aviso('error', `El campo «${c.l}» es obligatorio.`);
        return;
      }
    }
    onAceptar(valores);
  };

  return (
    <Dialogo titulo={d.titulo} onCerrar={onCerrar} acciones={[{ label: d.aceptar, onClick: aceptar }]}>
      {d.texto && <p>{d.texto}</p>}
      <Rejilla cols={3}>
        {d.campos.map((c) => (
          <Campo
            key={c.n}
            col={c}
            valor={valores[c.n]}
            onChange={(v) => setValores((prev) => ({ ...prev, [c.n]: v }))}
            soloLectura={false}
          />
        ))}
      </Rejilla>
    </Dialogo>
  );
}

function SubRejilla({ code, padre }: { code?: string; padre: Fila }) {
  const { ini, ir, aviso } = useErp();
  const gen = useGen();
  const { datos: sub, error } = useObjeto(code ?? null);
  if (!sub || error) {
    return <p className="erp-nota">Sin registros.</p>;
  }

  const comunes = (sub.cols ?? [])
    .filter(
      (c) =>
        ['cabid', 'codigo', 'tercer', 'codart', 'numero', 'docser', 'empcode', 'apteid', 'loteid', 'linid', 'ctaid', 'id'].includes(c.n) &&
        padre[c.n] !== null &&
        padre[c.n] !== undefined,
    )
    .map((c) => c.n);

  const filas = filasDe(sub, gen).filter((f) => comunes.every((n) => f[n] === padre[n]));
  const columnas = (sub.lista ?? [])
    .slice(0, 8)
    .map((n) => sub.cols?.find((c) => c.n === n))
    .filter((c): c is CatCol => c !== undefined);

  const anadir = () => {
    const nueva = filaNueva(sub);
    for (const n of comunes) {
      if (sub.cols?.some((c) => c.n === n)) {
        nueva[n] = padre[n];
      }
    }
    almacen.insertar(code!, nueva, ini);
    aviso('ok', 'Línea añadida.');
  };

  return (
    <div>
      <table className="erp-grid">
        <thead>
          <tr>
            <th>Nº</th>
            {columnas.map((c) => (
              <th key={c.n}>{c.l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.length === 0 ? (
            <tr>
              <td colSpan={columnas.length + 1}>Sin registros</td>
            </tr>
          ) : (
            filas.map((fila, i) => (
              <tr key={fila._k} onClick={() => ir(`obj:${code}`, fila._k)} style={{ cursor: 'pointer' }}>
                <td>{i + 1}</td>
                {columnas.map((c) => (
                  <td key={c.n}>
                    <Valor col={c} v={fila[c.n]} />
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {sub.perm?.i && (
        <button type="button" className="erp-btn neutro" onClick={anadir}>
          Añadir línea
        </button>
      )}
    </div>
  );
}

function VistaConsulta({ obj, code }: { obj: CatObjeto; code: string }) {
  const { aviso } = useErp();
  const gen = useGen();
  const [valores, setValores] = useState<Record<string, CatValor>>(() => {
    const init: Record<string, CatValor> = {};
    for (const c of [...(obj.qbe?.vars ?? []), ...(obj.qbe?.campos ?? [])].slice(0, 24)) {
      init[c.n] = c.def !== undefined ? c.def : '';
    }
    return init;
  });
  const [resultado, setResultado] = useState<{ cols: CatCol[]; filas: CatValor[][] } | null>(null);
  const [buscando, setBuscando] = useState(false);

  const campos = useMemo(() => {
    const vars = obj.qbe?.vars ?? [];
    const camps = obj.qbe?.campos ?? [];
    return [...vars, ...camps].slice(0, 24);
  }, [obj]);

  const limpiar = () => {
    const init: Record<string, CatValor> = {};
    for (const c of campos) init[c.n] = c.def !== undefined ? c.def : '';
    setValores(init);
    setResultado(null);
  };

  const ejecutar = async () => {
    for (const c of obj.qbe?.vars ?? []) {
      if (c.req && (valores[c.n] === undefined || valores[c.n] === null || valores[c.n] === '')) {
        aviso('error', `El campo «${c.l}» es obligatorio.`);
        return;
      }
    }
    setBuscando(true);
    try {
      const relCode = code.split('_')[0];
      const rel = await cargaObjeto(relCode);
      const colsResultado = obj.qbe?.campos?.slice(0, 10) ?? [];
      if (!rel || !rel.cols || !rel.filas) {
        setResultado({ cols: colsResultado, filas: [] });
        return;
      }
      const filasRel = filasDe(rel, gen);
      let filasResultado: CatValor[][] = filasRel.map((fila) => colsResultado.map((c) => fila[c.n] ?? ''));
      for (const c of obj.qbe?.campos ?? []) {
        const filtro = valores[c.n];
        if (filtro !== undefined && filtro !== null && filtro !== '' && rel.cols.some((rc) => rc.n === c.n)) {
          const textoFiltro = String(filtro).toLowerCase();
          filasResultado = filasResultado.filter((_, idx) => {
            const valorFila = filasRel[idx][c.n];
            return textoValor(c, valorFila).toLowerCase().includes(textoFiltro);
          });
        }
      }
      filasResultado = filasResultado.slice(0, 25);
      setResultado({ cols: colsResultado, filas: filasResultado });
    } catch {
      setResultado({ cols: [], filas: [] });
    } finally {
      setBuscando(false);
    }
  };

  const esReport = obj.qbe?.tipo === 'REPORT';
  const boton = esReport ? 'Ejecutar' : 'Buscar';

  return (
    <div className="erp-ficha">
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <h2>{obj.tit}</h2>
        </div>
      </header>
      {obj.qbe?.nota && <p className="erp-nota">{obj.qbe.nota}</p>}
      <Seccion titulo="Criterios de búsqueda">
        <Rejilla cols={3}>
          {campos.map((c) => (
            <Campo
              key={c.n}
              col={c}
              valor={valores[c.n]}
              onChange={(v) => setValores((prev) => ({ ...prev, [c.n]: v }))}
              soloLectura={false}
            />
          ))}
        </Rejilla>
        <div className="erp-pie">
          <button type="button" className="erp-btn neutro" onClick={limpiar}>
            Limpiar
          </button>
          <button type="button" className="erp-btn azul" onClick={ejecutar} disabled={buscando}>
            {boton}
          </button>
        </div>
      </Seccion>
      {resultado && (
        <Seccion titulo={esReport ? 'Informe' : 'Resultado'}>
          {esReport && resultado.filas.length > 0 && (
            <div className="erp-consulta-pie">
              <span>
                Informe «{obj.tit}» generado el {new Date().toLocaleString('es-ES')} · {resultado.filas.length} líneas
              </span>
              <button className="erp-btn neutro" onClick={() => aviso('ok', 'Informe descargado en PDF.')}>
                PDF
              </button>
              <button className="erp-btn neutro" onClick={() => aviso('ok', 'Informe descargado en Excel.')}>
                Excel
              </button>
            </div>
          )}
          {resultado.filas.length > 0 ? (
            <table className="erp-grid">
              <thead>
                <tr>
                  {resultado.cols.map((c) => (
                    <th key={c.n}>{c.l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resultado.filas.map((fila, i) => (
                  <tr key={i}>
                    {resultado.cols.map((c, j) => (
                      <td key={c.n}>
                        <Valor col={c} v={fila[j]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="erp-nota">No se han encontrado datos con los criterios indicados.</p>
          )}
        </Seccion>
      )}
    </div>
  );
}

function VistaProceso({ code }: { code: string }) {
  const { ini, aviso } = useErp();
  const { datos: buscar } = useBuscar();
  const [empresa, setEmpresa] = useState('0');
  const [fecha, setFecha] = useState(hoyIso());
  const [obs, setObs] = useState('');
  const titulo = (buscar ?? []).find((x) => x[1] === code)?.[0] ?? code;

  const ejecutar = () => {
    aviso('ok', 'Proceso finalizado correctamente.');
    almacen.registrar(code, '-', ini, 'Ejecutar');
  };

  return (
    <div className="erp-ficha">
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <h2>{titulo.toUpperCase()}</h2>
        </div>
      </header>
      <p className="erp-nota">Proceso de Axional. Indica los parámetros y pulsa Ejecutar.</p>
      <Seccion titulo="Parámetros">
        <Rejilla cols={3}>
          <CampoTexto label="Empresa" value={empresa} onChange={setEmpresa} req />
          <CampoFecha label="Fecha" value={fecha} onChange={setFecha} />
          <CampoTexto label="Observaciones" value={obs} onChange={setObs} />
        </Rejilla>
        <div className="erp-pie">
          <button type="button" className="erp-btn azul" onClick={ejecutar}>
            Ejecutar
          </button>
        </div>
      </Seccion>
    </div>
  );
}

export default function Generica({ code }: { code: string }) {
  const { clave } = useErp();
  const { datos: obj, error } = useObjeto(code);

  if (!obj && !error) {
    return <div className="erp-cargando">Cargando…</div>;
  }
  if (error || !obj) {
    return <div className="erp-tarjeta">No se ha podido cargar la pantalla {code}.</div>;
  }

  if (obj.cols) {
    return clave === null ? <VistaLista obj={obj} code={code} /> : <VistaFicha obj={obj} code={code} clave={clave} />;
  }
  if (obj.qbe) {
    return <VistaConsulta obj={obj} code={code} />;
  }
  return <VistaProceso code={code} />;
}
/** Contenido de una pestaña del catálogo por su título (para las pestañas de las pantallas propias que no tienen lógica):
    campos vacíos en lectura o la rejilla del subobjeto, tal como salen en Axional. */
export function PestanaCatalogo({ code, titulo }: { code?: string; titulo: string }) {
  const { datos: obj } = useObjeto(code ?? null);
  if (!obj) return <p className="erp-nota">Cargando…</p>;
  const tab = (obj.lay ?? []).flatMap((L) => L.cajas.flatMap((c) => c.tabs)).find((t) => t.t === titulo) ?? (obj.lay ?? []).find((L) => L.l === titulo)?.cajas[0]?.tabs[0];
  if (!tab) return <p className="erp-nota">Sin registros.</p>;
  if (tab.k === 'O') return <SubRejilla code={tab.o} padre={{ _k: '' }} />;
  if (tab.k === 'S') return <p className="erp-nota">Contenido calculado por el servidor de Axional ({tab.t || 'script'}).</p>;
  const cols = obj.cols ?? [];
  return (
    <Rejilla cols={Math.min(4, Math.max(1, tab.g ?? 3))}>
      {(tab.f ?? []).map(([n]) => {
        const col = cols.find((c) => c.n === n);
        return col ? <Campo key={n} col={col} valor={null} onChange={() => undefined} soloLectura /> : null;
      })}
    </Rejilla>
  );
}
