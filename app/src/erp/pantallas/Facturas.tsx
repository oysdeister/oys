import { useState } from 'react';
import { useDb, erp, CAT, totales, lineasFactura, asientoPrevisto, r2, baseDe, type Albaran } from '../modelo';
import { useErp, Lista, Ficha, Pestanas, Rejilla, CampoTexto, CampoFecha, CampoLectura, Lineas, Enlace, Estado, eur, fechaEs, type Accion } from '../ui';

export default function Facturas() {
  const { ini, clave, ir, hacer } = useErp();
  const db = useDb();

  if (clave === null) {
    const filas = [...db.facturas].sort((a, b) => b.numero.localeCompare(a.numero));
    return (
      <>
        {ini.trim() === '' && <p className="erp-nota">Pon tus iniciales para trabajar en la base de práctica.</p>}
        <div style={{ margin: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button type="button" className="erp-btn" onClick={() => ir('albaranes', null)}>
            Ir a albaranes
          </button>
          <p className="erp-nota">Las facturas se generan desde albaranes validados con «Generar factura».</p>
        </div>
        <Lista
          titulo="Facturas de compra"
          filas={filas}
          cols={[
            { titulo: 'Número', valor: (f) => <Enlace pantalla="facturas" clave={f.numero}><span className="mono">{f.numero}</span></Enlace>, texto: (f) => f.numero, ancho: '8%' },
            { titulo: 'Tipo', valor: (f) => f.tipo, texto: (f) => f.tipo, ancho: '5%' },
            { titulo: 'Fecha', valor: (f) => fechaEs(f.fecha), texto: (f) => f.fecha, ancho: '9%' },
            { titulo: 'Proveedor', valor: (f) => {
                const t = db.terceros.find((x) => x.codigo === f.proveedor);
                return `${f.proveedor} · ${t?.nombre ?? ''}`;
              }, texto: (f) => `${f.proveedor} ${db.terceros.find((x) => x.codigo === f.proveedor)?.nombre ?? ''}` },
            { titulo: 'Factura proveedor', valor: (f) => <span className="mono">{f.facturaProveedor}</span>, texto: (f) => f.facturaProveedor, ancho: '15%' },
            { titulo: 'Total', valor: (f) => eur(totales(lineasFactura(db, f)).total), num: true, ancho: '9%' },
            { titulo: 'Estado', valor: (f) => <Estado valor={f.estado} />, texto: (f) => f.estado, ancho: '9%' },
            { titulo: 'Situación', valor: (f) => <Estado valor={f.contabilizada ? 'Contabilizada' : 'Pendiente'} />, texto: (f) => f.contabilizada ? 'Contabilizada' : 'Pendiente', ancho: '11%' },
          ]}
          clave={(f) => f.numero}
          onAbrir={(f) => ir('facturas', f.numero)}
          marcarMios={(f) => f.autor === ini}
        />
      </>
    );
  }

  const registro = db.facturas.find((f) => f.numero === clave);
  if (!registro) return <p className="erp-nota">Factura no encontrada.</p>;

  const esTutorial = registro.autor === 'TUTORIAL';
  const editable = !esTutorial && registro.estado === 'Provisional';
  const proveedor = db.proveedores.find((p) => p.tercero === registro.proveedor);
  const tercero = db.terceros.find((t) => t.codigo === registro.proveedor);
  const [borrador, setBorrador] = useState(() => ({ facturaProveedor: registro.facturaProveedor, fecha: registro.fecha }));
  const [pestana, setPestana] = useState('albaranes');

  const sinCambios = borrador.facturaProveedor === registro.facturaProveedor && borrador.fecha === registro.fecha;
  const totalFactura = totales(lineasFactura(db, registro)).total;

  const albaranesDeFactura = registro.albaranes
    .map((n) => db.albaranes.find((a) => a.numero === n))
    .filter((a): a is Albaran => a !== undefined);

  const acciones: Accion[] = [];
  if (!esTutorial) {
    if (registro.estado === 'Provisional') {
      acciones.push({
        label: 'Guardar',
        tipo: 'primario',
        onClick: () => {
          hacer(erp.guardarFactura({ ...registro, ...borrador }, ini), 'Factura guardada');
        },
      });
      acciones.push({
        label: 'Validar',
        tipo: 'proceso',
        disabled: !sinCambios,
        title: sinCambios ? undefined : 'Guarda los cambios antes de validar',
        onClick: () => {
          hacer(erp.estadoFactura(registro.numero, 'Validado', ini), 'Factura validada');
        },
      });
      acciones.push({
        label: 'Borrar',
        tipo: 'peligro',
        onClick: () => {
          if (window.confirm('¿Borrar la factura? Esta acción no se puede deshacer.')) {
            if (hacer(erp.borrarFactura(registro.numero, ini), 'Factura borrada')) {
              ir('facturas', null);
            }
          }
        },
      });
    } else if (registro.estado === 'Validado' && !registro.contabilizada) {
      acciones.push({
        label: 'Contabilizar',
        tipo: 'proceso',
        onClick: () => {
          if (hacer(erp.contabilizar(registro.numero, true, ini), 'Factura contabilizada. Asiento generado en el diario DC.')) {
            setPestana('asiento');
          }
        },
      });
      acciones.push({
        label: 'Pasar a provisional',
        tipo: 'normal',
        onClick: () => {
          hacer(erp.estadoFactura(registro.numero, 'Provisional', ini), 'Factura pasada a provisional');
        },
      });
    } else if (registro.contabilizada) {
      acciones.push({
        label: 'Descontabilizar',
        tipo: 'normal',
        onClick: () => {
          hacer(erp.contabilizar(registro.numero, false, ini), 'Factura descontabilizada');
        },
      });
    }
  }
  acciones.push({
    label: 'Docflow',
    tipo: 'normal',
    onClick: () => ir('docflow', 'factura:' + registro.numero),
  });

  const sumarDias = (fecha: string, dias: number) => {
    if (!fecha) return '';
    const d = new Date(fecha + 'T00:00:00');
    d.setDate(d.getDate() + dias);
    return d.toISOString().slice(0, 10);
  };
  const tipoEfecto = proveedor?.tipoEfecto ?? 'TF';
  const plazoPago = proveedor?.plazoPago ?? 'CON';
  const efectoTxt = (codigo: string) => CAT.efectos.find((e) => e.v === codigo)?.t ?? codigo;
  const vencimientos =
    plazoPago === '3060'
      ? [
          { efecto: tipoEfecto, vencimiento: sumarDias(registro.fecha, 30), importe: r2(totalFactura / 2), estado: 'PE' },
          { efecto: tipoEfecto, vencimiento: sumarDias(registro.fecha, 60), importe: r2(totalFactura - r2(totalFactura / 2)), estado: 'PE' },
        ]
      : [
          {
            efecto: tipoEfecto,
            vencimiento: sumarDias(registro.fecha, plazoPago === '30D' ? 30 : plazoPago === '60D' ? 60 : 0),
            importe: totalFactura,
            estado: 'PE',
          },
        ];

  const asiento = registro.contabilizada ? registro.asiento : asientoPrevisto(db, registro);
  const sumDebe = asiento.reduce((s, l) => s + l.debe, 0);
  const sumHaber = asiento.reduce((s, l) => s + l.haber, 0);
  const cuadre = sumDebe - sumHaber;

  return (
    <Ficha
      titulo={<span className="mono">{registro.numero}</span>}
      sub="Compras › Facturas · FCOA"
      estado={registro.contabilizada ? 'Contabilizada' : registro.estado}
      acciones={acciones}
      onVolver={() => ir('facturas', null)}
    >
      <Rejilla cols={3}>
        <CampoLectura
          label="Proveedor"
          valor={
            <Enlace pantalla="proveedores" clave={registro.proveedor}>
              {registro.proveedor}
              {tercero ? ` · ${tercero.nombre}` : ''}
            </Enlace>
          }
        />
        <CampoTexto
          label="Factura proveedor"
          value={borrador.facturaProveedor}
          onChange={(v) => setBorrador({ ...borrador, facturaProveedor: v })}
          mono
          req
          disabled={!editable}
        />
        <CampoFecha
          label="Fecha"
          value={borrador.fecha}
          onChange={(v) => setBorrador({ ...borrador, fecha: v })}
          disabled={!editable}
        />
        <CampoLectura
          label="Tipo efecto y plazo pago"
          valor={`${efectoTxt(proveedor?.tipoEfecto ?? '')} · ${CAT.plazos.find((p) => p.v === proveedor?.plazoPago)?.t ?? proveedor?.plazoPago ?? ''}`}
        />
        <CampoLectura label="Total" valor={eur(totalFactura)} />
      </Rejilla>

      <Pestanas
        tabs={[
          { id: 'albaranes', label: 'Albaranes conformados', n: albaranesDeFactura.length },
          { id: 'lineas', label: 'Líneas' },
          { id: 'asiento', label: 'Asiento' },
          { id: 'vencimientos', label: 'Vencimientos' },
        ]}
        actual={pestana}
        onCambio={setPestana}
      />

      {pestana === 'albaranes' && (
        <div className="erp-tabla-scroll">
          <table className="erp-tabla compacta">
            <thead>
              <tr>
                <th>Albarán</th>
                <th>Origen</th>
                <th>Fecha</th>
                <th className="num">Base</th>
                {!esTutorial && registro.estado === 'Provisional' && albaranesDeFactura.length > 1 && <th style={{ width: '2.5em' }} aria-label="Quitar" />}
              </tr>
            </thead>
            <tbody>
              {albaranesDeFactura.map((alb) => (
                <tr key={alb.numero}>
                  <td>
                    <Enlace pantalla="albaranes" clave={alb.numero}>
                      <span className="mono">{alb.numero}</span>
                    </Enlace>
                  </td>
                  <td>
                    {alb.origen ? (
                      <Enlace pantalla="pedidos" clave={alb.origen}>
                        {alb.origen}
                      </Enlace>
                    ) : (
                      ''
                    )}
                  </td>
                  <td>{fechaEs(alb.fecha)}</td>
                  <td className="num">{eur(baseDe(alb.lineas))}</td>
                  {!esTutorial && registro.estado === 'Provisional' && albaranesDeFactura.length > 1 && (
                    <td>
                      <button
                        type="button"
                        className="erp-x"
                        onClick={() => hacer(erp.quitarAlbaranDeFactura(registro.numero, alb.numero, ini), 'Albarán desconformado')}
                        aria-label={`Quitar albarán ${alb.numero}`}
                      >
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {!albaranesDeFactura.length && (
                <tr className="vacia">
                  <td colSpan={5}>Sin albaranes conformados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pestana === 'lineas' && <Lineas lineas={lineasFactura(db, registro)} editable={false} />}

      {pestana === 'asiento' && (
        <div className="erp-seccion">
          {!registro.contabilizada && <h3>Prevista del asiento</h3>}
          {!registro.contabilizada && <p className="erp-nota">Revisa la prevista antes de contabilizar.</p>}
          <div className="erp-tabla-scroll">
            <table className="erp-tabla compacta">
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Concepto</th>
                  <th className="num">Debe</th>
                  <th className="num">Haber</th>
                  <th className="num">Cuadre</th>
                </tr>
              </thead>
              <tbody>
                {asiento.map((l, i) => (
                  <tr key={i}>
                    <td className="mono">{l.cuenta}</td>
                    <td>{l.concepto}</td>
                    <td className="num">{eur(l.debe)}</td>
                    <td className="num">{eur(l.haber)}</td>
                    <td />
                  </tr>
                ))}
                {!asiento.length && (
                  <tr className="vacia">
                    <td colSpan={5}>Sin asiento.</td>
                  </tr>
                )}
                <tr>
                  <td>Cuadre</td>
                  <td>Totales</td>
                  <td className="num">{eur(sumDebe)}</td>
                  <td className="num">{eur(sumHaber)}</td>
                  <td className={`num ${cuadre === 0 ? 'ok' : 'pend'}`}>{eur(cuadre)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pestana === 'vencimientos' && (
        <div className="erp-tabla-scroll">
          <table className="erp-tabla compacta">
            <thead>
              <tr>
                <th>Efecto</th>
                <th>Vencimiento</th>
                <th className="num">Importe</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {vencimientos.map((v, i) => (
                <tr key={i}>
                  <td>{efectoTxt(v.efecto)}</td>
                  <td>{fechaEs(v.vencimiento)}</td>
                  <td className="num">{eur(v.importe)}</td>
                  <td>{v.estado}</td>
                </tr>
              ))}
              {!vencimientos.length && (
                <tr className="vacia">
                  <td colSpan={4}>Sin vencimientos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Ficha>
  );
}