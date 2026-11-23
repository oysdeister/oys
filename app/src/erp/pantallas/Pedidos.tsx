import { useState } from 'react';
import {
  useDb,
  erp,
  getDb,
  situacionPedido,
  servida,
  facturaDeAlbaran,
  baseDe,
  totales,
  type Pedido,
} from '../modelo';
import {
  Lista,
  Ficha,
  Pestanas,
  Rejilla,
  CampoTexto,
  CampoFecha,
  CampoSel,
  CampoLectura,
  Lineas,
  Seccion,
  Totales,
  Enlace,
  Estado,
  eur,
  fechaEs,
  useErp,
  avisoGuardarAntes,
  type Accion,
  type Col,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

function ListaPedidos() {
  const { ini, ir } = useErp();
  const db = useDb();

  const pedidos = [...db.pedidos].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.numero.localeCompare(a.numero),
  );

  const cols: Col<Pedido>[] = [
    {
      titulo: 'Pedido',
      valor: (p) => <span className="mono">{p.numero}</span>,
      texto: (p) => p.numero,
    },
    { titulo: 'Tipo documento', valor: (p) => p.tipo, texto: (p) => p.tipo },
    { titulo: 'Empresa', valor: () => '0', texto: () => '0' },
    { titulo: 'Delegación', valor: () => 'CENTRAL', texto: () => 'CENTRAL' },
    { titulo: 'Departamento', valor: () => 'COMPRAS', texto: () => 'COMPRAS' },
    { titulo: 'Fecha pedido', valor: (p) => fechaEs(p.fecha), texto: (p) => p.fecha },
    {
      titulo: 'Proveedor',
      valor: (p) => {
        const t = db.terceros.find((x) => x.codigo === p.proveedor);
        return (
          <>
            {p.proveedor} · {t?.nombre ?? ''}
          </>
        );
      },
      texto: (p) => `${p.proveedor} ${db.terceros.find((x) => x.codigo === p.proveedor)?.nombre ?? ''}`,
    },
    { titulo: 'Divisa', valor: () => 'EUR', texto: () => 'EUR' },
    { titulo: 'Estado', valor: (p) => <Estado valor={p.estado} />, texto: (p) => p.estado },
    {
      titulo: 'Situación',
      valor: (p) => <Estado valor={situacionPedido(db, p)} />,
      texto: (p) => situacionPedido(db, p),
    },
    {
      titulo: 'Importe neto',
      num: true,
      valor: (p) => eur(baseDe(p.lineas)),
      texto: (p) => String(baseDe(p.lineas)),
    },
  ];

  if (!ini) {
    return (
      <section className="erp-lista">
        <p className="erp-nota">Pon tus iniciales en el encabezado para poder crear registros.</p>
        <Lista
          titulo="Pedidos de compra"
          filas={pedidos}
          cols={cols}
          clave={(p) => p.numero}
          onAbrir={(p) => ir('pedidos', p.numero)}
          vacio="No hay pedidos de compra."
          marcarMios={(r) => r.autor === ini}
        />
      </section>
    );
  }

  return (
    <Lista
      titulo="Pedidos de compra"
      filas={pedidos}
      cols={cols}
      clave={(p) => p.numero}
      onAbrir={(p) => ir('pedidos', p.numero)}
      onNuevo={() => ir('pedidos', '__nuevo')}
      vacio="No hay pedidos de compra."
      marcarMios={(r) => r.autor === ini}
    />
  );
}

function AltaPedido() {
  const { ini, ir, hacer } = useErp();
  const db = useDb();
  const [prov, setProv] = useState('');

  // Tu proveedor T{INI} sale el primero del desplegable
  const proveedores = [...db.proveedores].sort((a, b) => Number(b.tercero === `T${ini}`) - Number(a.tercero === `T${ini}`)).map((p) => ({
    v: p.tercero,
    t: `${p.tercero} · ${db.terceros.find((t) => t.codigo === p.tercero)?.nombre ?? ''}`,
  }));

  const crear = () => {
    const r = erp.nuevoPedido(prov, ini);
    if (hacer(r, 'Pedido creado') && r.ok) {
      ir('pedidos', r.doc);
    }
  };

  return (
    <Ficha
      titulo="Nuevo pedido de compra"
      acciones={[
        {
          label: 'Crear pedido',
          tipo: 'primario',
          disabled: !prov || !ini,
          onClick: crear,
        },
      ]}
      onVolver={() => ir('pedidos', null)}
    >
      <Seccion titulo="Unidad de negocio">
        <Rejilla cols={3}>
          <CampoSel
            label="Proveedor"
            value={prov}
            onChange={setProv}
            opciones={proveedores}
            vacio="— elige proveedor —"
            req
          />
          <CampoLectura label="Tipo documento" valor="PC" ayuda="PEDIDO COMPRA" req />
          <CampoLectura label="Empresa" valor="0" ayuda="Deister Software" req />
          <CampoLectura label="Delegación" valor="CENTRAL" req />
          <CampoLectura label="Departamento" valor="COMPRAS" ayuda="C" req />
          <CampoLectura label="Almacén" valor="0" ayuda="ALMACEN CENTRAL" />
        </Rejilla>
      </Seccion>
    </Ficha>
  );
}

function FichaPedido({ numero }: { numero: string }) {
  const extraAcc = useAccionesCatalogo('gcompedh');
  const extraMenu = useEnlacesCatalogo('gcompedh');
  const { ini, ir, hacer, aviso } = useErp();
  const db = useDb();

  const registro = db.pedidos.find((p) => p.numero === numero);
  const [borrador, setBorrador] = useState<Pedido>(() =>
    registro ? JSON.parse(JSON.stringify(registro)) : ({} as Pedido),
  );
  const [pestana, setPestana] = useState('cabecera');

  if (!registro) {
    return (
      <section className="erp-ficha">
        <p className="erp-nota">Pedido no encontrado.</p>
        <button className="erp-btn" onClick={() => ir('pedidos', null)}>
          Volver
        </button>
      </section>
    );
  }

  const tutorial = registro.autor === 'TUTORIAL';
  const esEditable = registro.estado === 'Provisional' && !tutorial;
  const cambios = JSON.stringify(borrador) !== JSON.stringify(registro);
  const situacion = situacionPedido(db, registro);
  const albaranes = db.albaranes.filter((a) => a.origen === registro.numero);
  const importe = totales(borrador.lineas);

  const articulosActivos = db.articulos
    .filter((a) => a.estado === 'Activo')
    .map((a) => ({ v: a.codigo, t: `${a.codigo} · ${a.nombre}`, precio: a.precioCompra }));

  const pendientes: Record<number, number> = {};
  for (const l of borrador.lineas) {
    pendientes[l.n] = l.cantidad - servida(db, borrador.numero, l.n);
  }

  const syncBorrador = () => {
    const fresh = getDb();
    const nuevo = fresh.pedidos.find((p) => p.numero === registro.numero);
    if (nuevo) setBorrador(JSON.parse(JSON.stringify(nuevo)));
  };

  const acciones: Accion[] = [];
  if (!tutorial) {
    if (registro.estado === 'Provisional') {
      acciones.push({
        label: 'Guardar',
        tipo: 'primario',
        onClick: () => {
          const r = erp.guardarPedido(borrador, ini);
          if (hacer(r, 'Pedido guardado')) {
            syncBorrador();
          } else if (!r.ok && /^Línea \d+/.test(r.error)) {
            setPestana('lineas');
          }
        },
      });
      acciones.push({
        label: 'Validar',
        tipo: 'proceso',
        onClick: () => {
          if (cambios) {
            aviso('error', avisoGuardarAntes('Validar'));
            return;
          }
          if (hacer(erp.estadoPedido(registro.numero, 'Validado', ini), 'Pedido validado')) {
            syncBorrador();
          }
        },
      });
      acciones.push({
        label: 'Borrar',
        tipo: 'peligro',
        onClick: () => {
          if (window.confirm('¿Borrar el pedido?')) {
            const r = erp.borrarPedido(registro.numero, ini);
            if (hacer(r, 'Pedido borrado') && r.ok) {
              ir('pedidos', null);
            }
          }
        },
      });
    } else if (registro.estado === 'Validado') {
      acciones.push({
        label: 'Generar albaranes',
        tipo: 'proceso',
        disabled: situacion === 'Servido o Facturado',
        onClick: () => {
          const r = erp.generarAlbaran(registro.numero, null, ini);
          if (
            hacer(r, 'Albarán generado', r.ok ? { pantalla: 'albaranes', clave: r.doc } : undefined) &&
            r.ok
          ) {
            ir('albaranes', r.doc);
          }
        },
      });
      acciones.push({
        label: 'Pasar a provisional',
        tipo: 'normal',
        onClick: () => {
          if (hacer(erp.estadoPedido(registro.numero, 'Provisional', ini), 'Pedido en provisional')) {
            syncBorrador();
          }
        },
      });
    }
  }
  acciones.push({
    label: 'Docflow',
    tipo: 'normal',
    onClick: () => ir('docflow', `pedido:${registro.numero}`),
  });

  const proveedor =
    db.terceros.find((t) => t.codigo === registro.proveedor)?.nombre ?? '';

  return (
    <Ficha
      titulo={`${registro.numero} [${registro.proveedor}]`}
      estado={registro.estado}
      acciones={[...acciones, ...extraAcc]} menu={extraMenu}
      onVolver={() => ir('pedidos', null)}
    >
      {cambios && <p className="erp-nota">Hay cambios sin guardar.</p>}

      <Pestanas
        tabs={[
          { id: 'cabecera', label: 'Pedidos compras' },
          { id: 'lineas', label: 'Líneas', n: borrador.lineas.length },
          { id: 'impuestos', label: 'Impuestos' },
          { id: 'documentos', label: 'Documentos' },
          { id: 'notas', label: 'Notas' },
        ]}
        actual={pestana}
        onCambio={setPestana}
      />

      {pestana === 'cabecera' ? (
        <>
          <Seccion titulo="Unidad de negocio">
            <Rejilla cols={4}>
              <CampoLectura label="Tipo documento" valor="PC" ayuda="PEDIDO COMPRA" req />
              <CampoLectura label="Empresa" valor="0" ayuda="Deister Software" req />
              <CampoLectura label="Delegación" valor="CENTRAL" req />
              <CampoLectura label="Departamento" valor="COMPRAS" ayuda="C" req />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Fecha" media>
            <Rejilla cols={3}>
              <CampoFecha
                label="Fecha"
                value={borrador.fecha}
                onChange={(v) => setBorrador({ ...borrador, fecha: v })}
                disabled={!esEditable}
                req
              />
              <CampoLectura label="Inicio entrega" valor="" />
              <CampoLectura label="Fin entrega" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Pedido" media>
            <Rejilla cols={3}>
              <CampoLectura label="Pedido" valor={registro.numero} req />
              <CampoLectura label="Origen" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Estado" media>
            <Rejilla cols={3}>
              <CampoLectura label="Estado" valor={<Estado valor={registro.estado} />} req />
              <CampoLectura label="Situación" valor={<Estado valor={situacion} />} />
              <CampoLectura label="Validaciones" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Pedir a" media>
            <Rejilla cols={3}>
              <CampoLectura
                label="Proveedor"
                valor={
                  <Enlace pantalla="proveedores" clave={registro.proveedor}>
                    {registro.proveedor} · {proveedor}
                  </Enlace>
                }
                req
              />
              <CampoLectura label="Nombre" valor={proveedor} />
              <CampoLectura label="Dirección" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Facturado por" media>
            <Rejilla cols={3}>
              <CampoLectura
                label="Proveedor"
                valor={
                  <Enlace pantalla="proveedores" clave={registro.proveedor}>
                    {registro.proveedor} · {proveedor}
                  </Enlace>
                }
                req
              />
              <CampoLectura label="Nombre" valor={proveedor} />
              <CampoLectura label="Dirección" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Destinatario" media>
            <Rejilla cols={3}>
              <CampoLectura label="Almacén" valor={borrador.almacen} ayuda="ALMACEN CENTRAL" />
              <CampoLectura label="Delegación" valor={borrador.delegacion} />
              <CampoLectura label="Nombre" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion
            media
            tabs={[
              {
                label: 'Información general',
                contenido: (
                  <Rejilla cols={3}>
                    <CampoTexto
                      label="Referencia"
                      value={borrador.referencia}
                      onChange={(v) => setBorrador({ ...borrador, referencia: v })}
                      disabled={!esEditable}
                    />
                    <CampoLectura label="Comprador" valor="" />
                    <CampoLectura label="Almacén" valor={borrador.almacen} ayuda="ALMACEN CENTRAL" />
                  </Rejilla>
                ),
              },
              {
                label: 'Auxiliares',
                noDisp: true,
                contenido: <p className="erp-vacio">Auxiliares no disponible en la práctica.</p>,
              },
              {
                label: 'Notas',
                noDisp: true,
                contenido: <p className="erp-vacio">Notas no disponible en la práctica.</p>,
              },
            ]}
          />

          <Seccion
            media
            tabs={[
              {
                label: 'Datos financieros',
                contenido: (
                  <Rejilla cols={3}>
                    <CampoLectura label="Tipo efecto" valor="EF" ayuda="EF · Efectivo" req />
                    <CampoLectura label="Forma pago" valor="30D" ayuda="30 días" req />
                    <CampoLectura label="Presupuesto" valor="" />
                    <CampoLectura label="Partida" valor="" />
                  </Rejilla>
                ),
              },
              {
                label: 'Impuestos',
                noDisp: true,
                contenido: <p className="erp-vacio">Impuestos no disponible en la práctica.</p>,
              },
            ]}
          />

          <Seccion titulo="Descuentos" media>
            <Rejilla cols={3}>
              <CampoLectura label="% Descuento 1" valor="0,000" num />
              <CampoLectura label="% Descuento 2" valor="0,000" num />
              <CampoLectura label="% Descuento 3" valor="0,000" num />
              <CampoLectura label="% Pronto pago" valor="0,000" num />
              <CampoLectura label="Portes" valor="Debidos" />
            </Rejilla>
          </Seccion>

          <Totales base={importe.base} iva={importe.iva} total={importe.total} />

          <Seccion titulo="Albaranes generados">
            <div className="erp-tabla-scroll">
              <table className="erp-tabla compacta">
                <thead>
                  <tr>
                    <th>Albarán</th>
                    <th>Fecha</th>
                    <th className="num">Unidades</th>
                    <th>Estado</th>
                    <th>Factura</th>
                  </tr>
                </thead>
                <tbody>
                  {albaranes.map((alb) => {
                    const factura = facturaDeAlbaran(db, alb.numero);
                    return (
                      <tr key={alb.numero}>
                        <td>
                          <Enlace pantalla="albaranes" clave={alb.numero}>
                            {alb.numero}
                          </Enlace>
                        </td>
                        <td>{fechaEs(alb.fecha)}</td>
                        <td className="num">{alb.lineas.reduce((s, l) => s + l.cantidad, 0)}</td>
                        <td>
                          <Estado valor={alb.estado} />
                        </td>
                        <td>
                          {factura ? (
                            <Enlace pantalla="facturas" clave={factura.numero}>
                              {factura.numero}
                            </Enlace>
                          ) : (
                            '—'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {!albaranes.length && (
                    <tr className="vacia">
                      <td colSpan={5}>Sin albaranes.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Seccion>
        </>
      ) : pestana === 'lineas' ? (
        <Lineas
          lineas={borrador.lineas}
          editable={esEditable}
          onChange={esEditable ? (ls) => setBorrador({ ...borrador, lineas: ls }) : undefined}
          articulos={articulosActivos}
          pendientes={pendientes}
        />
      ) : pestana === 'impuestos' ? (
        <p className="erp-vacio">Impuestos no disponible en la práctica.</p>
      ) : pestana === 'documentos' ? (
        <p className="erp-vacio">Documentos no disponible en la práctica.</p>
      ) : (
        <p className="erp-vacio">Notas no disponible en la práctica.</p>
      )}
    </Ficha>
  );
}

export default function Pedidos() {
  const { clave } = useErp();
  if (clave === null) return <ListaPedidos />;
  if (clave === '__nuevo') return <AltaPedido />;
  return <FichaPedido numero={clave} />;
}
