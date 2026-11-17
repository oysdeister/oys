import { useState } from 'react';
import { useDb, erp, facturaDeAlbaran, servida, baseDe, type Albaran } from '../modelo';
import { Lista, Ficha, Pestanas, Rejilla, CampoLectura, CampoFecha, CampoTexto, Lineas, Dialogo, Enlace, Estado, eur, fechaEs, useErp, type Accion } from '../ui';

export default function Albaranes() {
  const db = useDb();
  const { ini, clave, ir, hacer } = useErp();

  const albaranes = [...db.albaranes].sort((a, b) => b.numero.localeCompare(a.numero));

  const cols = [
    { titulo: 'Número', valor: (a: Albaran) => <span className="mono">{a.numero}</span>, texto: (a: Albaran) => a.numero, ancho: '8em' },
    { titulo: 'Tipo', valor: (a: Albaran) => a.tipo, texto: (a: Albaran) => a.tipo, ancho: '4em' },
    { titulo: 'Fecha', valor: (a: Albaran) => fechaEs(a.fecha), texto: (a: Albaran) => a.fecha, ancho: '6em' },
    {
      titulo: 'Proveedor',
      valor: (a: Albaran) => {
        const t = db.terceros.find((x) => x.codigo === a.proveedor);
        return <span><span className="mono">{a.proveedor}</span> · {t?.nombre ?? ''}</span>;
      },
      texto: (a: Albaran) => a.proveedor,
      ancho: '20em',
    },
    { titulo: 'Origen', valor: (a: Albaran) => a.origen ? <span className="mono">{a.origen}</span> : '—', texto: (a: Albaran) => a.origen, ancho: '8em' },
    { titulo: 'Base', valor: (a: Albaran) => eur(baseDe(a.lineas)), texto: (a: Albaran) => eur(baseDe(a.lineas)), num: true, ancho: '8em' },
    { titulo: 'Estado', valor: (a: Albaran) => <Estado valor={a.estado} />, texto: (a: Albaran) => a.estado, ancho: '8em' },
    {
      titulo: 'Facturación',
      valor: (a: Albaran) =>
        a.estado === 'Validado'
          ? facturaDeAlbaran(db, a.numero)
            ? <Estado valor="Facturado" />
            : <Estado valor="Pendiente de facturar" />
          : '—',
      texto: (a: Albaran) =>
        a.estado === 'Validado'
          ? facturaDeAlbaran(db, a.numero)
            ? 'Facturado'
            : 'Pendiente de facturar'
          : '',
      ancho: '12em',
    },
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
  const [tab, setTab] = useState('lineas');
  const [showFactura, setShowFactura] = useState(false);
  const [facturaProveedor, setFacturaProveedor] = useState('');
  const [seleccionados, setSeleccionados] = useState<string[]>([]);

  const dirty = JSON.stringify(borrador) !== JSON.stringify(registro);

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
  if (!isTutorial) {
    if (registro.estado === 'Provisional') {
      acciones.push({ label: 'Guardar', tipo: 'primario', onClick: guardar });
      acciones.push({ label: 'Validar', tipo: 'proceso', onClick: validar, disabled: dirty });
      acciones.push({ label: 'Borrar', tipo: 'peligro', onClick: borrar });
    } else if (registro.estado === 'Validado') {
      if (!factura) {
        acciones.push({ label: 'Generar factura', tipo: 'proceso', onClick: abrirDialogoFactura });
      }
      acciones.push({ label: 'Pasar a provisional', tipo: 'normal', onClick: pasarProvisional });
    }
    acciones.push({ label: 'Docflow', tipo: 'normal', onClick: () => ir('docflow', 'albaran:' + registro.numero) });
  }

  const albaranesFacturables = db.albaranes.filter(
    (a) => a.estado === 'Validado' && a.proveedor === registro.proveedor && !facturaDeAlbaran(db, a.numero)
  );

  const tabs = [
    { id: 'lineas', label: 'Líneas', n: borrador.lineas.length },
    { id: 'stock', label: 'Efecto en stock' },
  ];

  return (
    <>
      <Ficha
        titulo={registro.numero}
        sub="Compras › Albaranes · ACPC"
        estado={registro.estado}
        acciones={acciones}
        onVolver={() => ir('albaranes', null)}
      >
        <Rejilla cols={3}>
          <CampoLectura
            label="Proveedor"
            valor={
              <Enlace pantalla="proveedores" clave={registro.proveedor}>
                {registro.proveedor} · {db.terceros.find((t) => t.codigo === registro.proveedor)?.nombre ?? ''}
              </Enlace>
            }
          />
          <CampoLectura
            label="Origen"
            valor={registro.origen ? <Enlace pantalla="pedidos" clave={registro.origen}>{registro.origen}</Enlace> : '—'}
          />
          <CampoFecha
            label="Fecha"
            value={borrador.fecha}
            onChange={(v) => setBorrador({ ...borrador, fecha: v })}
            disabled={!editable}
          />
          <CampoLectura label="Almacén" valor={registro.almacen} />
          <CampoLectura label="Movimiento" valor="Entrada · NSAL › DISP" ancho={2} />
          <CampoLectura
            label="Factura"
            valor={factura ? <Enlace pantalla="facturas" clave={factura.numero}>{factura.numero}</Enlace> : 'Pendiente de facturar'}
          />
        </Rejilla>

        {editable && registro.origen && (
          <p className="erp-nota">
            Albarán generado desde el pedido: solo puedes cambiar la cantidad recibida (entregas parciales).
          </p>
        )}

        <Pestanas tabs={tabs} actual={tab} onCambio={setTab} />

        {tab === 'lineas' ? (
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
                  <p key={l.n} className="erp-nota">
                    Pedido {registro.origen} línea {l.origenLinea}: pide {cantidadPedida} · pendiente {pend}
                  </p>
                );
              })}
          </>
        ) : (
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
            <p className="erp-nota">
              {registro.estado === 'Validado'
                ? 'Stock actualizado: estas unidades ya están disponibles en el almacén 0.'
                : 'Al validar entrarán en stock.'}
            </p>
          </div>
        )}
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