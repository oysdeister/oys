import { useState } from 'react';
import { useErp, Lista, Ficha, Pestanas, Rejilla, CampoTexto, CampoSel, CampoNum, CampoLectura, Estado, Enlace, eur, fechaEs } from '../ui';
import { useDb, erp, CAT, stock, type Articulo } from '../modelo';

const CLAVE_FISCAL_OPCIONES = [
  { v: 'BOG', t: 'BOG · Bien' },
  { v: 'SOG', t: 'SOG · Servicio' },
] as const;

export default function Articulos() {
  const { ini, clave, ir, hacer } = useErp();
  const db = useDb();

  if (clave === null) {
    const cols = [
      { titulo: 'Código', valor: (a: Articulo) => <span className="mono">{a.codigo}</span>, texto: (a: Articulo) => a.codigo },
      { titulo: 'Descripción', valor: (a: Articulo) => a.nombre, texto: (a: Articulo) => a.nombre },
      { titulo: 'Unidad', valor: (a: Articulo) => a.unidad, texto: (a: Articulo) => a.unidad },
      { titulo: 'Familia', valor: (a: Articulo) => a.familia, texto: (a: Articulo) => a.familia },
      { titulo: 'Tipo contable', valor: (a: Articulo) => a.tipoContable, texto: (a: Articulo) => a.tipoContable },
      { titulo: 'Precio compra', valor: (a: Articulo) => eur(a.precioCompra), num: true },
      { titulo: 'Estado', valor: (a: Articulo) => <Estado valor={a.estado} /> },
    ];

    if (!ini) {
      return (
        <>
          <p className="erp-nota">Pon tus iniciales en la cabecera para poder crear artículos.</p>
          <Lista
            titulo="Maestro de artículos"
            filas={db.articulos}
            cols={cols}
            clave={(a) => a.codigo}
            onAbrir={(a) => ir('articulos', a.codigo)}
            marcarMios={(a) => a.autor === ini}
          />
        </>
      );
    }

    return (
      <Lista
        titulo="Maestro de artículos"
        filas={db.articulos}
        cols={cols}
        clave={(a) => a.codigo}
        onAbrir={(a) => ir('articulos', a.codigo)}
        onNuevo={() => ir('articulos', '__nuevo')}
        nuevoTexto="Nuevo artículo"
        marcarMios={(a) => a.autor === ini}
      />
    );
  }

  const esAlta = clave === '__nuevo';
  const registro = esAlta ? undefined : db.articulos.find((a) => a.codigo === clave);

  const [borrador, setBorrador] = useState<Articulo>(() => {
    if (esAlta) {
      return {
        codigo: '',
        nombre: '',
        unidad: 'UNIDAD',
        familia: '',
        tipoContable: 'VEN',
        claveFiscal: 'SOG',
        iva: 21,
        precioCompra: 0,
        estado: 'Provisional',
        autor: ini,
      };
    }
    if (registro) return { ...registro };
    return {
      codigo: clave ?? '',
      nombre: '',
      unidad: 'UNIDAD',
      familia: '',
      tipoContable: 'VEN',
      claveFiscal: 'SOG',
      iva: 21,
      precioCompra: 0,
      estado: 'Provisional',
      autor: ini,
    };
  });

  const [tab, setTab] = useState('general');
  const [notaFamilia, setNotaFamilia] = useState('');

  if (!esAlta && !registro) {
    return <p className="erp-nota">Artículo no encontrado.</p>;
  }

  const disabled = borrador.estado === 'Activo' || borrador.autor === 'TUTORIAL';

  const onFamiliaChange = (v: string) => {
    const nuevo = { ...borrador, familia: v };
    let nota = '';
    if (v.startsWith('01.')) {
      nuevo.claveFiscal = 'BOG';
      nota = 'La familia ha propuesto clave fiscal BOG';
    } else if (v.startsWith('02.')) {
      nuevo.claveFiscal = 'SOG';
      nuevo.tipoContable = 'SERV';
      nota = 'La familia ha propuesto clave fiscal SOG';
    }
    setBorrador(nuevo);
    setNotaFamilia(nota);
  };

  const acciones = [];
  if (borrador.autor !== 'TUTORIAL') {
    acciones.push({
      label: 'Guardar',
      tipo: 'primario' as const,
      disabled: borrador.estado === 'Activo',
      onClick: () => {
        const esAltaActual = clave === '__nuevo';
        const exito = hacer(erp.guardarArticulo(borrador, ini), 'Artículo guardado', {
          pantalla: 'articulos',
          clave: borrador.codigo,
        });
        if (exito) {
          if (esAltaActual && borrador.codigo) {
            ir('articulos', borrador.codigo);
          } else {
            const nuevoReg = db.articulos.find((a) => a.codigo === borrador.codigo);
            if (nuevoReg) setBorrador(nuevoReg);
          }
        }
      },
    });

    if (!esAlta && borrador.estado === 'Provisional') {
      acciones.push({
        label: 'Validar',
        tipo: 'proceso' as const,
        onClick: () => {
          const exito = hacer(erp.estadoArticulo(borrador.codigo, 'Activo', ini), 'Artículo activo');
          if (exito) setBorrador((prev) => ({ ...prev, estado: 'Activo' }));
        },
      });
    }

    if (borrador.estado === 'Activo') {
      acciones.push({
        label: 'Pasar a provisional',
        onClick: () => {
          const exito = hacer(erp.estadoArticulo(borrador.codigo, 'Provisional', ini), 'Artículo en provisional');
          if (exito) setBorrador((prev) => ({ ...prev, estado: 'Provisional' }));
        },
      });
    }
  }

  const stockArticulo = stock(db).filter((s) => s.articulo === borrador.codigo);
  const movimientos = stockArticulo.flatMap((s) => s.movimientos);

  return (
    <Ficha
      titulo={esAlta ? 'Nuevo artículo' : `${borrador.codigo} · ${borrador.nombre}`}
      sub="Maestros › Artículos"
      estado={borrador.estado}
      acciones={acciones}
      onVolver={() => ir('articulos', null)}
    >
      <Pestanas
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'compras', label: 'Compras' },
          { id: 'stock', label: 'Stock' },
        ]}
        actual={tab}
        onCambio={setTab}
      />

      {tab === 'general' && (
        <>
          <Rejilla cols={3}>
            <CampoTexto
              label="Código"
              req
              mono
              disabled={!esAlta || disabled}
              value={borrador.codigo}
              onChange={(v) => setBorrador({ ...borrador, codigo: v })}
              ayuda="Tus iniciales + 001"
            />
            <CampoTexto
              label="Descripción"
              req
              ancho={2}
              disabled={disabled}
              value={borrador.nombre}
              onChange={(v) => setBorrador({ ...borrador, nombre: v })}
            />
            <CampoSel
              label="Unidad"
              value={borrador.unidad}
              onChange={(v) => setBorrador({ ...borrador, unidad: v })}
              opciones={CAT.unidades.map((u) => ({ v: u, t: u }))}
              disabled={disabled}
            />
            <CampoSel
              label="Familia"
              req
              value={borrador.familia}
              onChange={onFamiliaChange}
              opciones={CAT.familias.map((f) => ({ v: f.v, t: `${f.v} · ${f.t}` }))}
              vacio="— elige familia —"
              disabled={disabled}
            />
            <CampoSel
              label="Tipo contable"
              value={borrador.tipoContable}
              onChange={(v) => setBorrador({ ...borrador, tipoContable: v as Articulo['tipoContable'] })}
              opciones={CAT.tiposContables}
              disabled={disabled}
            />
            <CampoSel
              label="Clave fiscal"
              value={borrador.claveFiscal}
              onChange={(v) => setBorrador({ ...borrador, claveFiscal: v as Articulo['claveFiscal'] })}
              opciones={CLAVE_FISCAL_OPCIONES}
              disabled={disabled}
            />
            <CampoLectura label="IVA %" valor="21 %" />
          </Rejilla>
          {notaFamilia && <p className="erp-nota">{notaFamilia}</p>}
          {borrador.estado === 'Activo' && borrador.autor !== 'TUTORIAL' && (
            <p className="erp-nota">Artículo activo: pásalo a provisional para modificarlo.</p>
          )}
        </>
      )}

      {tab === 'compras' && (
        <>
          <Rejilla cols={3}>
            <CampoNum
              label="Precio compra"
              value={borrador.precioCompra}
              onChange={(v) => setBorrador({ ...borrador, precioCompra: v })}
              disabled={disabled}
            />
          </Rejilla>
          <div className="erp-seccion">
            <h3>Dónde se ha pedido</h3>
            <div className="erp-tabla-scroll">
              <table className="erp-tabla compacta">
                <thead>
                  <tr>
                    <th>Pedido</th>
                    <th>Proveedor</th>
                    <th className="num">Cantidad</th>
                    <th className="num">Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {db.pedidos
                    .flatMap((p) =>
                      p.lineas
                        .filter((l) => l.articulo === borrador.codigo)
                        .map((l) => ({ pedido: p, linea: l })),
                    )
                    .map(({ pedido, linea }) => (
                      <tr key={`${pedido.numero}-${linea.n}`}>
                        <td>
                          <Enlace pantalla="pedidos" clave={pedido.numero}>
                            {pedido.numero}
                          </Enlace>
                        </td>
                        <td>{pedido.proveedor}</td>
                        <td className="num">{linea.cantidad}</td>
                        <td className="num">{eur(linea.precio)}</td>
                        <td>
                          <Estado valor={pedido.estado} />
                        </td>
                      </tr>
                    ))}
                  {db.pedidos.flatMap((p) =>
                    p.lineas.filter((l) => l.articulo === borrador.codigo),
                  ).length === 0 && (
                    <tr className="vacia">
                      <td colSpan={5}>No se ha pedido este artículo.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'stock' && (
        <>
          <div className="erp-tabla-scroll">
            <table className="erp-tabla compacta">
              <thead>
                <tr>
                  <th>Almacén</th>
                  <th className="num">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {stockArticulo.map((s) => (
                  <tr key={s.almacen}>
                    <td>{s.almacen}</td>
                    <td className="num">{s.cantidad}</td>
                  </tr>
                ))}
                {stockArticulo.length === 0 && (
                  <tr className="vacia">
                    <td colSpan={2}>Sin stock de este artículo.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {movimientos.length === 0 ? (
            <div className="erp-vacio">Sin movimientos de stock.</div>
          ) : (
            <div className="erp-tabla-scroll">
              <table className="erp-tabla compacta">
                <thead>
                  <tr>
                    <th>Documento</th>
                    <th>Fecha</th>
                    <th className="num">Entrada</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((m, idx) => (
                    <tr key={`${m.doc}-${idx}`}>
                      <td>
                        <Enlace pantalla="albaranes" clave={m.doc}>
                          {m.doc}
                        </Enlace>
                      </td>
                      <td>{fechaEs(m.fecha)}</td>
                      <td className="num">{m.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Ficha>
  );
}