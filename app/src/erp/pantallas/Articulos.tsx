import { useState } from 'react';
import {
  useErp,
  Lista,
  Ficha,
  Seccion,
  Rejilla,
  CampoTexto,
  CampoSel,
  CampoNum,
  CampoLectura,
  CampoCheck,
  Estado,
  Enlace,
  eur,
  fechaEs,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';
import { useDb, erp, CAT, stock, type Articulo } from '../modelo';

const CLAVE_FISCAL_OPCIONES = [
  { v: 'BOG', t: 'BOG · Bien' },
  { v: 'SOG', t: 'SOG · Servicio' },
] as const;

export default function Articulos() {
  const extraAcc = useAccionesCatalogo('garticul');
  const extraMenu = useEnlacesCatalogo('garticul');
  const { ini, clave, ir, hacer, noDisp } = useErp();
  const db = useDb();

  if (clave === null) {
    // Calcular stock total por artículo para la columna
    const stockPorArticulo = new Map<string, number>();
    stock(db).forEach((s) => {
      stockPorArticulo.set(s.articulo, (stockPorArticulo.get(s.articulo) ?? 0) + s.cantidad);
    });

    const cols = [
      {
        titulo: 'Artículo',
        valor: (a: Articulo) => <span className="mono">{a.codigo}</span>,
        texto: (a: Articulo) => a.codigo,
      },
      {
        titulo: 'Descripción artículo',
        valor: (a: Articulo) => a.nombre,
        texto: (a: Articulo) => a.nombre,
      },
      {
        titulo: 'Agrupación empresas',
        valor: () => '0',
        texto: () => '0',
      },
      {
        titulo: 'Unidad base',
        valor: (a: Articulo) => a.unidad,
        texto: (a: Articulo) => a.unidad,
      },
      {
        titulo: 'Familia',
        valor: (a: Articulo) => a.familia,
        texto: (a: Articulo) => a.familia,
      },
      {
        titulo: 'Tipo contable',
        valor: (a: Articulo) => a.tipoContable,
        texto: (a: Articulo) => a.tipoContable,
      },
      {
        titulo: 'Clave fiscal',
        valor: (a: Articulo) => a.claveFiscal,
        texto: (a: Articulo) => a.claveFiscal,
      },
      {
        titulo: 'Fabricante',
        valor: () => '',
        texto: () => '',
      },
      {
        titulo: 'Stock',
        valor: (a: Articulo) => String(stockPorArticulo.get(a.codigo) ?? 0),
        texto: (a: Articulo) => String(stockPorArticulo.get(a.codigo) ?? 0),
        num: true,
      },
      {
        titulo: 'Coste unificado',
        valor: (a: Articulo) => eur(a.precioCompra),
        texto: (a: Articulo) => String(a.precioCompra),
        num: true,
      },
      {
        titulo: 'Estado',
        valor: (a: Articulo) => <Estado valor={a.estado} />,
        texto: (a: Articulo) => a.estado,
      },
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

  acciones.push({
    label: 'Nuevo',
    onClick: () => ir('articulos', '__nuevo'),
  });

  acciones.push(
    {
      label: 'Alterar modificación',
      lugar: 'acciones' as const,
      onClick: () => noDisp('Alterar modificación'),
    },
    {
      label: 'Cambiar unidad base',
      lugar: 'acciones' as const,
      onClick: () => noDisp('Cambiar unidad base'),
    },
  );

  const stockArticulo = stock(db).filter((s) => s.articulo === borrador.codigo);
  const movimientos = stockArticulo.flatMap((s) => s.movimientos);

  const restoPestanas = [
    'Ean',
    'Unidades por artículo',
    'Conversión de unidades',
    'Niveles stocks',
    'Artículos por proveedor',
    'Artículos por cliente',
    'Almacenes',
    'Catálogos',
    'Formulaciones',
    'Alternativos',
    'Imágenes',
    'Imágenes Secuenciadas',
    'Imágenes VL',
    'Documentos',
    'Notas',
    'Características',
    'Localización',
    'ISO',
    'Versiones',
    'Configurador',
    'Impuestos ventas',
    'Artículos',
    'Impuestos compras',
    'Datos de control',
    'Workflow',
    'Evolución de workflow',
  ];

  return (
    <Ficha
      titulo={esAlta ? 'Nuevo artículo' : borrador.nombre}
      estado={borrador.estado}
      acciones={[...acciones, ...extraAcc]}
      onVolver={() => ir('articulos', null)}
      menu={[...extraMenu, 
        {
          label: 'Stocks cuentas',
          onClick: () => ir('stock'),
        },
        {
          label: 'Stock ubicaciones',
          onClick: () => noDisp('Stock ubicaciones'),
        },
        {
          label: 'Situación artículo',
          onClick: () => noDisp('Situación artículo'),
        },
        {
          label: 'Compradores',
          onClick: () => noDisp('Compradores'),
        },
      ]}
    >
      {borrador.estado === 'Activo' && borrador.autor !== 'TUTORIAL' && (
        <p className="erp-nota">Artículo activo: pásalo a provisional para modificarlo.</p>
      )}

      {/* Primera fila: Identificación + Estado */}
      <Seccion media titulo="Identificación">
        <Rejilla cols={3}>
          <CampoTexto
            label="Artículo"
            req
            mono
            disabled={!esAlta || disabled}
            value={borrador.codigo}
            onChange={(v) => setBorrador({ ...borrador, codigo: v })}
            ayuda="Tus iniciales + 001"
          />
          <CampoTexto
            label="Descripción artículo"
            req
            ancho={2}
            disabled={disabled}
            value={borrador.nombre}
            onChange={(v) => setBorrador({ ...borrador, nombre: v })}
          />
          <CampoSel
            label="Unidad base"
            req
            value={borrador.unidad}
            onChange={(v) => setBorrador({ ...borrador, unidad: v })}
            opciones={CAT.unidades.map((u) => ({ v: u, t: u }))}
            disabled={disabled}
          />
          <CampoLectura label="Unidad auxiliar" valor="" />
          <CampoLectura label="Relación variable" valor="1" num />
        </Rejilla>
      </Seccion>

      <Seccion media titulo="Estado">
        <Rejilla cols={3}>
          <CampoLectura label="Estado" valor={<Estado valor={borrador.estado} />} req />
          <CampoCheck label="Modificar" value={!disabled} />
        </Rejilla>
      </Seccion>

      {/* Segunda fila: Clasificación | Unidades de medida | ABC + Familias | Variable logística | Atributos */}
      <Seccion
        media
        tabs={[
          {
            label: 'Clasificación',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Clasificación" valor="" />
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
                <CampoLectura label="Naturaleza" valor="" />
                <CampoLectura label="Partida estadística" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Unidades de medida',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Unidad precios" valor="" />
                <CampoLectura label="Unidad expediciones" valor="" />
                <CampoLectura label="Unidad coste" valor="" />
                <CampoLectura label="Unidad recepciones" valor="" />
                <CampoLectura label="Unidad ventas" valor="" />
                <CampoLectura label="Unidad referencia" valor="" />
                <CampoLectura label="Unidad compras" valor="" />
                <CampoLectura label="Plantilla unidades" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'ABC',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Tipo ABC ventas" valor="" />
                <CampoLectura label="Orden ABC ventas" valor="" />
                <CampoLectura label="Tipo ABC compras" valor="" />
                <CampoLectura label="Orden ABC compras" valor="" />
                <CampoLectura label="Tipo ABC consumos" valor="" />
                <CampoLectura label="Orden ABC consumos" valor="" />
                <CampoLectura label="Tipo ABC existencias" valor="" />
                <CampoLectura label="Orden ABC existencias" valor="" />
              </Rejilla>
            ),
          },
        ]}
      />

      <Seccion
        media
        tabs={[
          {
            label: 'Familias',
            contenido: (
              <Rejilla cols={3}>
                <CampoSel
                  label="Familia"
                  req
                  value={borrador.familia}
                  onChange={onFamiliaChange}
                  opciones={CAT.familias.map((f) => ({ v: f.v, t: `${f.v} · ${f.t}` }))}
                  vacio="— elige familia —"
                  disabled={disabled}
                  ayuda={notaFamilia || 'La familia propone clave fiscal y naturaleza.'}
                />
                <CampoLectura label="Familia ecom" valor="" />
                <CampoLectura label="Familia intranet" valor="" />
                <CampoLectura label="Familia presupuestaria" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Variable logística',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Plantilla V.L." valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Atributos',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Tipo agrupación 1" valor="" />
                <CampoLectura label="Tipo agrupación 2" valor="" />
                <CampoLectura label="Tipo agrupación 3" valor="" />
                <CampoLectura label="Tipo agrupación 4" valor="" />
              </Rejilla>
            ),
          },
        ]}
      />

      {/* Tercera fila: Contabilidad | Fabricante + Fechas | Lotes | Costes */}
      <Seccion
        media
        tabs={[
          {
            label: 'Contabilidad',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Partida estadística" valor="" />
                <CampoLectura label="Naturaleza" valor="" />
                <CampoLectura label="Componente coste" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Fabricante',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Fabricante" valor="" />
                <CampoLectura label="Marca" valor="" />
                <CampoLectura label="Modelo" valor="" />
              </Rejilla>
            ),
          },
        ]}
      />

      <Seccion
        media
        tabs={[
          {
            label: 'Fechas',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Fecha alta" valor="" />
                <CampoLectura label="Fecha baja" valor="" />
                <CampoLectura label="Fecha sincronización" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Lotes',
            contenido: (
              <Rejilla cols={3}>
                <CampoLectura label="Lotes" valor="No" />
                <CampoLectura label="Serie lotes" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Costes',
            contenido: (
              <Rejilla cols={3}>
                <CampoNum
                  label="Precio compra"
                  value={borrador.precioCompra}
                  onChange={(v) => setBorrador({ ...borrador, precioCompra: v })}
                  disabled={disabled}
                />
                <CampoLectura label="Coste en línea" valor={eur(borrador.precioCompra)} num />
                <CampoLectura label="Coste unificado" valor={eur(borrador.precioCompra)} num />
              </Rejilla>
            ),
          },
        ]}
      />

      {/* Cuarta fila: Disponibilidad | Logística | Auxiliares | Información complementaria | Pie de documento */}
      <Seccion
        tabs={[
          {
            label: 'Disponibilidad',
            contenido: (
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
            ),
          },
          {
            label: 'Logística',
            contenido: (
              <>
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
              </>
            ),
          },
          {
            label: 'Auxiliares',
            contenido: (
              <Rejilla cols={4}>
                <CampoLectura label="Alfanumérico auxiliar 1" valor="" />
                <CampoLectura label="Alfanumérico auxiliar 2" valor="" />
                <CampoLectura label="Alfanumérico auxiliar 3" valor="" />
                <CampoLectura label="Alfanumérico auxiliar 4" valor="" />
                <CampoLectura label="Alfanumérico auxiliar 5" valor="" />
                <CampoLectura label="Numérico auxiliar 1" valor="" num />
                <CampoLectura label="Numérico auxiliar 2" valor="" num />
                <CampoLectura label="Numérico auxiliar 3" valor="" num />
                <CampoLectura label="Fecha auxiliar 1" valor="" />
                <CampoLectura label="Fecha auxiliar 2" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Información complementaria',
            contenido: <div className="erp-vacio">Sin información complementaria.</div>,
          },
          {
            label: 'Pie de documento',
            contenido: (
              <Rejilla cols={4}>
                <CampoLectura label="Pie de documento" valor="" />
                <CampoLectura label="Albarán de compras" valor="" />
                <CampoLectura label="Canal liquidación" valor="" />
                <CampoLectura label="Concepto coste" valor="" />
              </Rejilla>
            ),
          },
        ]}
      />

      {/* Resto de pestañas del inventario (noDisp) agrupadas */}
      <Seccion
        tabs={restoPestanas.slice(0, 9).map((label) => ({
          label,
          noDisp: true,
          contenido: <div />,
        }))}
      />
      <Seccion
        tabs={restoPestanas.slice(9, 18).map((label) => ({
          label,
          noDisp: true,
          contenido: <div />,
        }))}
      />
      <Seccion
        tabs={restoPestanas.slice(18).map((label) => ({
          label,
          noDisp: true,
          contenido: <div />,
        }))}
      />
    </Ficha>
  );
}
