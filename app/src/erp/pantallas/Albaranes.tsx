import { useState } from 'react';
import { useDb, erp, facturaDeAlbaran, servida, baseDe, totales, type Albaran } from '../modelo';
import {
  Lista,
  Ficha,
  Pestanas,
  Rejilla,
  CampoLectura,
  CampoFecha,
  CampoTexto,
  Lineas,
  Dialogo,
  Enlace,
  Estado,
  eur,
  fechaEs,
  useErp,
  Seccion,
  Totales,
  type Accion,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

export default function Albaranes() {
  const extraAcc = useAccionesCatalogo('gcomalbh');
  const extraMenu = useEnlacesCatalogo('gcomalbh');
  const db = useDb();
  const { ini, clave, ir, hacer, noDisp } = useErp();

  const albaranes = [...db.albaranes].sort((a, b) => b.numero.localeCompare(a.numero));

  const cols = [
    { titulo: 'Albarán', valor: (a: Albaran) => <span className="mono">{a.numero}</span>, texto: (a: Albaran) => a.numero, ancho: '8em' },
    {
      titulo: 'Proveedor',
      valor: (a: Albaran) => {
        const t = db.terceros.find((x) => x.codigo === a.proveedor);
        return (
          <span>
            <span className="mono">{a.proveedor}</span> · {t?.nombre ?? ''}
          </span>
        );
      },
      texto: (a: Albaran) => a.proveedor,
      ancho: '18em',
    },
    { titulo: 'Tipo documento', valor: () => 'ACPC', texto: () => 'ACPC', ancho: '4em' },
    { titulo: 'Delegación', valor: () => 'CENTRAL', texto: () => 'CENTRAL', ancho: '8em' },
    { titulo: 'Departamento', valor: () => 'COMPRAS', texto: () => 'COMPRAS', ancho: '8em' },
    { titulo: 'Almacén', valor: (a: Albaran) => a.almacen, texto: (a: Albaran) => a.almacen, ancho: '6em' },
    { titulo: 'Empresa', valor: () => '0', texto: () => '0', ancho: '4em' },
    { titulo: 'Fecha albarán', valor: (a: Albaran) => fechaEs(a.fecha), texto: (a: Albaran) => a.fecha, ancho: '6em' },
    { titulo: 'Importe', valor: (a: Albaran) => eur(baseDe(a.lineas)), texto: (a: Albaran) => eur(baseDe(a.lineas)), num: true, ancho: '8em' },
    { titulo: 'Divisa', valor: () => 'EUR', texto: () => 'EUR', ancho: '4em' },
    { titulo: 'Estado', valor: (a: Albaran) => <Estado valor={a.estado} />, texto: (a: Albaran) => a.estado, ancho: '8em' },
    { titulo: 'Estado documento', valor: (a: Albaran) => <Estado valor={a.estado} />, texto: (a: Albaran) => a.estado, ancho: '8em' },
  ];

  const lista = (
    <>
      <p className="erp-nota">Los albaranes se generan desde un pedido validado con «Generar albaranes».</p>
      <button type="button" className="erp-btn" onClick={() => ir('pedidos', null)}>
        Ir a pedidos
      </button>
      <Lista
        titulo="Albaranes de compra"
        filas={albaranes}
        cols={cols}
        clave={(a) => a.numero}
        onAbrir={(a) => ir('albaranes', a.numero)}
        marcarMios={(a) => a.autor === ini}
      />
    </>
  );

  if (clave === null) {
    return lista;
  }

  const registro = db.albaranes.find((a) => a.numero === clave);
  if (!registro) {
    return lista;
  }

  const isTutorial = registro.autor === 'TUTORIAL';
  const editable = registro.estado === 'Provisional' && !isTutorial;
  const factura = facturaDeAlbaran(db, registro.numero);

  const [borrador, setBorrador] = useState<Albaran>(() => ({ ...registro }));
  const [tab, setTab] = useState('cabecera');
  const [showFactura, setShowFactura] = useState(false);
  const [facturaProveedor, setFacturaProveedor] = useState('');
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const dirty = JSON.stringify(borrador) !== JSON.stringify(registro);
  const tot = totales(borrador.lineas);

  const guardar = () => {
    const r = erp.guardarAlbaran(borrador, ini);
    hacer(r, 'Albarán guardado');
  };

  const validar = () => {
    const r = erp.estadoAlbaran(registro.numero, 'Validado', ini);
    hacer(r, 'Albarán validado. Stock actualizado.');
  };

  const borrar = () => {
    if (window.confirm('¿Borrar el albarán?')) {
      const r = erp.borrarAlbaran(registro.numero, ini);
      if (hacer(r, 'Albarán borrado')) {
        ir('albaranes', null);
      }
    }
  };

  const pasarProvisional = () => {
    const r = erp.estadoAlbaran(registro.numero, 'Provisional', ini);
    hacer(r, 'Albarán en provisional');
  };

  const abrirDialogoFactura = () => {
    setFacturaProveedor('');
    setSeleccionados([registro.numero]);
    setShowFactura(true);
  };

  const generarFactura = () => {
    const r = erp.generarFactura(seleccionados, facturaProveedor, ini);
    if (hacer(r, 'Factura generada', r.ok ? { pantalla: 'facturas', clave: r.doc } : undefined) && r.ok) {
      setShowFactura(false);
      ir('facturas', r.doc);
    }
  };

  const toggleSeleccion = (num: string, checked: boolean) => {
    if (num === registro.numero) return;
    setSeleccionados((prev) => (checked ? [...prev, num] : prev.filter((x) => x !== num)));
  };

  const acciones: Accion[] = [];
  const menuFicha: Accion[] = [];

  if (!isTutorial) {
    if (registro.estado === 'Provisional') {
      acciones.push({ label: 'Guardar', tipo: 'primario', onClick: guardar });
      acciones.push({ label: 'Validar', tipo: 'proceso', onClick: validar, disabled: dirty });
      acciones.push({ label: 'Borrar', tipo: 'peligro', onClick: borrar });
    } else if (registro.estado === 'Validado') {
      if (!factura) {
        acciones.push({ label: 'Generar factura', tipo: 'proceso', onClick: abrirDialogoFactura });
        acciones.push({ label: 'Contabilizar', onClick: () => noDisp('Contabilizar albarán') });
        acciones.push({ label: 'No facturable', onClick: () => noDisp('No facturable') });
        acciones.push({ label: 'Anular', onClick: () => noDisp('Anular albarán') });
      }
      acciones.push({ label: 'Pasar a provisional', tipo: 'normal', onClick: pasarProvisional });
      if (factura?.contabilizada) {
        acciones.push({ label: 'Descontabilizar', onClick: () => noDisp('Descontabilizar albarán') });
      }
    }

    menuFicha.push({ label: 'Docflow', onClick: () => ir('docflow', 'albaran:' + registro.numero) });
    menuFicha.push({ label: 'Suministros', onClick: () => noDisp('Suministros') });
    if (factura) {
      menuFicha.push({ label: 'Facturas compras', onClick: () => ir('facturas', factura.numero) });
    }
    menuFicha.push({ label: 'Asientos contables', onClick: () => noDisp('Asientos contables') });
  }

  const albaranesFacturables = db.albaranes.filter(
    (a) => a.estado === 'Validado' && a.proveedor === registro.proveedor && !facturaDeAlbaran(db, a.numero),
  );

  const tabs = [
    { id: 'cabecera', label: 'Albaranes compras' },
    { id: 'lineas', label: 'Líneas', n: borrador.lineas.length },
    { id: 'impuestos', label: 'Impuestos' },
    { id: 'anticipos', label: 'Anticipos' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'notas', label: 'Notas' },
  ];

  return (
    <>
      <Ficha
        titulo={`${registro.numero} [${registro.proveedor}]`}
        estado={registro.estado}
        acciones={[...acciones, ...extraAcc]}
        onVolver={() => ir('albaranes', null)}
        menu={[...menuFicha, ...extraMenu]}
      >
        <Pestanas tabs={tabs} actual={tab} onCambio={setTab} />

        {editable && registro.origen && (
          <p className="erp-nota">
            Albarán generado desde el pedido: solo puedes cambiar la cantidad recibida (entregas parciales).
          </p>
        )}

        {tab === 'cabecera' && (
          <>
            <Seccion titulo="Unidad de negocio">
              <Rejilla cols={4}>
                <CampoLectura label="Tipo documento" valor="ACPC" ayuda="ALBARAN COMPRA ORIGEN PEDIDO" req />
                <CampoLectura label="Empresa" valor="0" ayuda="Deister Software" req />
                <CampoLectura label="Almacén" valor={registro.almacen} ayuda="ALMACEN CENTRAL" req />
                <CampoLectura label="Delegación" valor="CENTRAL" req />
                <CampoLectura label="Departamento" valor="COMPRAS" req />
              </Rejilla>
            </Seccion>

            <Seccion titulo="Fecha" media>
              <Rejilla cols={3}>
                <CampoFecha
                  label="Fecha albarán"
                  value={borrador.fecha}
                  onChange={(v) => setBorrador({ ...borrador, fecha: v })}
                  disabled={!editable}
                  req
                />
                <CampoLectura label="Fecha proveedor" valor="" req />
                <CampoLectura label="Fecha contabilización" valor="" />
              </Rejilla>
            </Seccion>

            <Seccion
              media
              tabs={[
                {
                  label: 'Albarán',
                  contenido: (
                    <Rejilla cols={2}>
                      <CampoLectura label="Albarán" valor={registro.numero} req />
                      <CampoLectura
                        label="Origen"
                        valor={registro.origen ? <Enlace pantalla="pedidos" clave={registro.origen}>{registro.origen}</Enlace> : '—'}
                      />
                    </Rejilla>
                  ),
                },
                {
                  label: 'Origen auxiliar',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Origen auxiliar … no disponible en la práctica.</p>,
                },
              ]}
            />

            <Seccion titulo="Estado">
              <Rejilla cols={3}>
                <CampoLectura label="Estado documento" valor={<Estado valor={registro.estado} />} req />
                <CampoLectura label="Estado" valor={<Estado valor={registro.estado} />} req />
                <CampoLectura label="Validaciones" valor="" />
              </Rejilla>
            </Seccion>

            <Seccion
              media
              tabs={[
                {
                  label: 'Pedido a',
                  contenido: registro.origen ? (
                    <Enlace pantalla="pedidos" clave={registro.origen}>
                      {registro.origen}
                    </Enlace>
                  ) : (
                    '—'
                  ),
                },
                {
                  label: 'Facturado por',
                  contenido: factura ? <Enlace pantalla="facturas" clave={factura.numero}>{factura.numero}</Enlace> : '—',
                },
              ]}
            />

            <Seccion
              media
              tabs={[
                {
                  label: 'Recepcionado en',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Recepcionado en … no disponible en la práctica.</p>,
                },
                {
                  label: 'Enviado a',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Enviado a … no disponible en la práctica.</p>,
                },
              ]}
            />

            <Seccion
              media
              tabs={[
                {
                  label: 'Información general',
                  contenido: (
                    <Rejilla cols={3}>
                      <CampoLectura label="Referencia" valor="" />
                      <CampoLectura label="Clasificación" valor="" />
                      <CampoLectura label="Fecha no facturado" valor="" />
                      <CampoLectura label="Fecha recepción" valor="" req />
                    </Rejilla>
                  ),
                },
                {
                  label: 'Indicadores',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Indicadores … no disponible en la práctica.</p>,
                },
                {
                  label: 'Notas',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Notas … no disponible en la práctica.</p>,
                },
                {
                  label: 'Auxiliares',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Auxiliares … no disponible en la práctica.</p>,
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
                      <CampoLectura label="Presupuesto" valor="" />
                      <CampoLectura label="Partida" valor="" />
                      <CampoLectura label="Tipo efecto" valor="EF" ayuda="Efectivo" req />
                      <CampoLectura label="Forma pago" valor="30D" ayuda="30 días" req />
                    </Rejilla>
                  ),
                },
                {
                  label: 'Datos financieros (2)',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Datos financieros (2) … no disponible en la práctica.</p>,
                },
                {
                  label: 'Importaciones',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Importaciones … no disponible en la práctica.</p>,
                },
                {
                  label: 'Impuestos',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Impuestos … no disponible en la práctica.</p>,
                },
              ]}
            />

            <Seccion
              media
              tabs={[
                {
                  label: 'Descuentos',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Descuentos … no disponible en la práctica.</p>,
                },
                {
                  label: 'Procesos asociados',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Procesos asociados … no disponible en la práctica.</p>,
                },
                {
                  label: 'Permisos de procesos',
                  noDisp: true,
                  contenido: <p className="erp-vacio">Permisos de procesos … no disponible en la práctica.</p>,
                },
              ]}
            />

            <Totales base={tot.base} iva={tot.iva} total={tot.total} />
          </>
        )}

        {tab === 'lineas' && (
          <>
            <Lineas
              lineas={borrador.lineas}
              editable={editable}
              onChange={(ls) => setBorrador({ ...borrador, lineas: ls })}
              soloCantidad={!!registro.origen}
            />
            {borrador.lineas
              .filter((l) => l.origenLinea !== undefined)
              .map((l) => {
                const pedido = db.pedidos.find((p) => p.numero === registro.origen);
                const lineaPedido = pedido?.lineas.find((x) => x.n === l.origenLinea);
                const cantidadPedida = lineaPedido?.cantidad ?? 0;
                const serv = servida(db, registro.origen!, l.origenLinea!);
                const pend = cantidadPedida - serv;
                return (
                  <p key={l.n}>
                    Pedido {registro.origen} línea {l.origenLinea}: pide {cantidadPedida} · pendiente {pend}
                  </p>
                );
              })}

            <div className="erp-seccion">
              <h3>Efecto en stock</h3>
              <table className="erp-tabla compacta">
                <thead>
                  <tr>
                    <th>Artículo</th>
                    <th>Cuenta origen</th>
                    <th>Cuenta destino</th>
                    <th>Unidades</th>
                  </tr>
                </thead>
                <tbody>
                  {borrador.lineas.map((l) => (
                    <tr key={l.n}>
                      <td>
                        <span className="mono">{l.articulo}</span> {l.descripcion}
                      </td>
                      <td>NSAL</td>
                      <td>DISP</td>
                      <td className="num">{l.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                {registro.estado === 'Validado'
                  ? 'Stock actualizado: estas unidades ya están disponibles en el almacén 0.'
                  : 'Al validar entrarán en stock.'}
              </p>
            </div>
          </>
        )}

        {tab === 'impuestos' && <p className="erp-vacio">Impuestos … no disponible en la práctica.</p>}
        {tab === 'anticipos' && <p className="erp-vacio">Anticipos … no disponible en la práctica.</p>}
        {tab === 'documentos' && <p className="erp-vacio">Documentos … no disponible en la práctica.</p>}
        {tab === 'notas' && <p className="erp-vacio">Notas … no disponible en la práctica.</p>}
      </Ficha>

      {showFactura && (
        <Dialogo
          titulo="Generar factura"
          onCerrar={() => setShowFactura(false)}
          acciones={[
            {
              label: 'Generar',
              tipo: 'primario',
              onClick: generarFactura,
              disabled: seleccionados.length === 0 || facturaProveedor.trim() === '',
            },
          ]}
        >
          <CampoTexto
            label="Factura proveedor"
            value={facturaProveedor}
            onChange={setFacturaProveedor}
            req
            mono
            placeholder="PROV-XX-001"
          />
          <div className="erp-form">
            {albaranesFacturables.map((a) => (
              <label key={a.numero} className="erp-check">
                <input
                  type="checkbox"
                  checked={seleccionados.includes(a.numero)}
                  disabled={a.numero === registro.numero}
                  onChange={(e) => toggleSeleccion(a.numero, e.target.checked)}
                />
                <span>
                  <span className="mono">{a.numero}</span> {fechaEs(a.fecha)} · {eur(baseDe(a.lineas))}
                </span>
              </label>
            ))}
          </div>
        </Dialogo>
      )}
    </>
  );
}
