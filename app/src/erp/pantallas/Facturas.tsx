import { useState } from 'react';
import { useDb, erp, CAT, totales, lineasFactura, asientoPrevisto, r2, baseDe, type Albaran } from '../modelo';
import { useErp, Lista, Ficha, Pestanas, Rejilla, CampoTexto, CampoFecha, CampoLectura, Lineas, Enlace, Estado, eur, fechaEs, Seccion, type Accion } from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

export default function Facturas() {
  const extraAcc = useAccionesCatalogo('gcomfach');
  const extraMenu = useEnlacesCatalogo('gcomfach');
  const { ini, clave, ir, hacer, noDisp } = useErp();
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
            { titulo: 'Factura', valor: (f) => <Enlace pantalla="facturas" clave={f.numero}><span className="mono">{f.numero}</span></Enlace>, texto: (f) => f.numero, ancho: '8%' },
            { titulo: 'Proveedor', valor: (f) => {
                const t = db.terceros.find((x) => x.codigo === f.proveedor);
                return `${f.proveedor} · ${t?.nombre ?? ''}`;
              }, texto: (f) => `${f.proveedor} ${db.terceros.find((x) => x.codigo === f.proveedor)?.nombre ?? ''}` },
            { titulo: 'Tipo documento', valor: (f) => f.tipo, texto: (f) => f.tipo, ancho: '5%' },
            { titulo: 'Empresa', valor: () => '0', texto: () => '0', ancho: '5%' },
            { titulo: 'Delegación', valor: () => 'CENTRAL', texto: () => 'CENTRAL', ancho: '8%' },
            { titulo: 'Departamento', valor: () => 'COMPRAS', texto: () => 'COMPRAS', ancho: '8%' },
            { titulo: 'Factura proveedor', valor: (f) => <span className="mono">{f.facturaProveedor}</span>, texto: (f) => f.facturaProveedor, ancho: '15%' },
            { titulo: 'Fecha factura', valor: (f) => fechaEs(f.fecha), texto: (f) => f.fecha, ancho: '9%' },
            { titulo: 'Divisa', valor: () => 'EUR', texto: () => 'EUR', ancho: '5%' },
            { titulo: 'Importe total', valor: (f) => eur(totales(lineasFactura(db, f)).total), num: true, ancho: '9%' },
            { titulo: 'Estado', valor: (f) => <Estado valor={f.estado} />, texto: (f) => f.estado, ancho: '9%' },
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
  const [pestana, setPestana] = useState('facturas');

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
        label: 'Pasar a provisional',
        tipo: 'normal',
        onClick: () => {
          hacer(erp.estadoFactura(registro.numero, 'Provisional', ini), 'Factura pasada a provisional');
        },
      });
      acciones.push({
        label: 'Contabilizar',
        tipo: 'proceso',
        onClick: () => {
          if (hacer(erp.contabilizar(registro.numero, true, ini), 'Factura contabilizada. Asiento generado en el diario DC.')) {
            setPestana('facturas');
          }
        },
      });
      acciones.push({
        label: 'Anular',
        tipo: 'normal',
        onClick: () => noDisp('Anular'),
      });
    } else if (registro.contabilizada) {
      acciones.push({
        label: 'Descontabilizar',
        tipo: 'normal',
        onClick: () => {
          hacer(erp.contabilizar(registro.numero, false, ini), 'Factura descontabilizada');
        },
      });
      acciones.push({
        label: 'Anular',
        tipo: 'normal',
        onClick: () => noDisp('Anular'),
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

  const menuExtra: Accion[] = [
    {
      label: 'Albaranes compras',
      onClick: () => (albaranesDeFactura.length ? ir('albaranes', albaranesDeFactura[0].numero) : noDisp('Albaranes compras')),
    },
    { label: 'Suministros', onClick: () => noDisp('Suministros') },
    { label: 'Asientos contables', onClick: () => noDisp('Asientos contables') },
    { label: 'Cartera de efectos', onClick: () => setPestana('vencimientos') },
    { label: 'Registros fiscales', onClick: () => noDisp('Registros fiscales') },
  ];

  const pestanasSuperiores = [
    { id: 'facturas', label: 'Facturas compras' },
    { id: 'lineas', label: 'Líneas' },
    { id: 'impuestos', label: 'Impuestos por documento' },
    { id: 'vencimientos', label: 'Vencimientos' },
    { id: 'anticipos', label: 'Anticipos' },
    { id: 'expedientes', label: 'Expedientes' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'notas', label: 'Notas' },
  ];

  return (
    <Ficha
      titulo={<span className="mono">{registro.numero} [{registro.proveedor}]</span>}
      estado={registro.contabilizada ? 'Contabilizada' : registro.estado}
      acciones={[...acciones, ...extraAcc]}
      onVolver={() => ir('facturas', null)}
      menu={[...menuExtra, ...extraMenu]}
    >
      <Pestanas tabs={pestanasSuperiores} actual={pestana} onCambio={setPestana} />

      {pestana === 'facturas' && (
        <>
          <Seccion titulo="Unidad de negocio">
            <Rejilla cols={4}>
              <CampoLectura label="Tipo documento" valor="FCOA" ayuda="FACTURA COMPRA ORIGEN ALBARAN" req />
              <CampoLectura label="Empresa" valor="0" ayuda="Deister Software" req />
              <CampoLectura label="Delegación" valor="CENTRAL" ayuda="CENTRAL" req />
              <CampoLectura label="Departamento" valor="COMPRAS" ayuda="C" req />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Fecha" media>
            <Rejilla cols={3}>
              <CampoFecha label="Fecha factura" value={borrador.fecha} onChange={(v) => setBorrador({ ...borrador, fecha: v })} disabled={!editable} req />
              <CampoLectura label="Fecha registro contable" valor="" />
              <CampoLectura label="Fecha valor" valor="" req />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Factura" media>
            <Rejilla cols={2}>
              <CampoLectura label="Factura" valor={<span className="mono">{registro.numero}</span>} req />
              <CampoLectura label="Origen" valor="" />
            </Rejilla>
            <div className="erp-tabla-scroll" style={{ marginTop: '0.5rem' }}>
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
          </Seccion>

          <Seccion titulo="Estado" media>
            <Rejilla cols={3}>
              <CampoLectura label="Estado" valor={<Estado valor={registro.estado} />} req />
              <CampoLectura label="Situación" valor={<Estado valor={registro.contabilizada ? 'Contabilizada' : 'Pendiente'} />} />
              <CampoLectura label="Validaciones" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Pedir a" media>
            <Rejilla cols={1}>
              <CampoLectura
                label="Proveedor"
                valor={
                  <Enlace pantalla="proveedores" clave={registro.proveedor}>
                    {registro.proveedor} · {tercero?.nombre ?? ''}
                  </Enlace>
                }
              />
            </Rejilla>
          </Seccion>

          <Seccion
            media
            tabs={[
              {
                label: 'Facturado por',
                contenido: (
                  <Rejilla cols={1}>
                    <CampoLectura
                      label="Proveedor"
                      valor={
                        <Enlace pantalla="proveedores" clave={registro.proveedor}>
                          {registro.proveedor} · {tercero?.nombre ?? ''}
                        </Enlace>
                      }
                    />
                  </Rejilla>
                ),
              },
              {
                label: 'Pagado por',
                contenido: (
                  <Rejilla cols={1}>
                    <CampoLectura
                      label="Proveedor"
                      valor={
                        <Enlace pantalla="proveedores" clave={registro.proveedor}>
                          {registro.proveedor} · {tercero?.nombre ?? ''}
                        </Enlace>
                      }
                    />
                  </Rejilla>
                ),
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
                    <CampoTexto
                      label="Factura proveedor"
                      value={borrador.facturaProveedor}
                      onChange={(v) => setBorrador({ ...borrador, facturaProveedor: v })}
                      mono
                      req
                      disabled={!editable}
                    />
                    <CampoLectura label="Clasificación" valor="" />
                    <CampoLectura label="Fecha contabilización" valor="" />
                    <CampoLectura label="Tipo de identificación" valor="NIF-Empresa" req />
                    <CampoLectura label="País emisor" valor="ES" req />
                    <CampoLectura label="CIF" valor={tercero?.nif ?? ''} req />
                  </Rejilla>
                ),
              },
              { label: 'Indicadores', noDisp: true },
              { label: 'Auxiliares', noDisp: true },
              { label: 'Notas', noDisp: true },
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
                    <CampoLectura
                      label="Tipo efecto"
                      valor={proveedor?.tipoEfecto ?? ''}
                      ayuda={efectoTxt(proveedor?.tipoEfecto ?? '')}
                      req
                    />
                    <CampoLectura
                      label="Forma pago"
                      valor={proveedor?.plazoPago ?? ''}
                      ayuda={CAT.plazos.find((p) => p.v === proveedor?.plazoPago)?.t ?? ''}
                      req
                    />
                  </Rejilla>
                ),
              },
              { label: 'Datos financieros (2)', noDisp: true },
              { label: 'Impuestos', noDisp: true },
            ]}
          />

          <Seccion
            media
            tabs={[
              { label: 'Descuentos', noDisp: true },
              { label: 'Procesos asociados', noDisp: true },
              { label: 'Permisos de procesos', noDisp: true },
            ]}
          />

          <Seccion
            tabs={[
              {
                label: 'Importe',
                contenido: (
                  <Rejilla cols={5}>
                    <CampoLectura label="Divisa" valor="EUR" ayuda="Euro" req />
                    <CampoLectura label="Cambio" valor="1,000000" num req />
                    <CampoLectura label="Base imponible" valor={eur(totales(lineasFactura(db, registro)).base)} num req />
                    <CampoLectura label="IVA 21 %" valor={eur(totales(lineasFactura(db, registro)).iva)} num />
                    <CampoLectura
                      label="Importe total"
                      valor={<b className="erp-total">{eur(totales(lineasFactura(db, registro)).total)}</b>}
                      num
                      req
                    />
                  </Rejilla>
                ),
              },
              { label: 'Anticipo', noDisp: true },
              { label: 'Tarifas', noDisp: true },
              {
                label: 'Contabilidad',
                contenido: (
                  <div>
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
                ),
              },
            ]}
          />
        </>
      )}

      {pestana === 'lineas' && <Lineas lineas={lineasFactura(db, registro)} editable={false} />}

      {pestana === 'impuestos' && <p className="erp-vacio">Impuestos por documento no disponible en la práctica.</p>}
      {pestana === 'anticipos' && <p className="erp-vacio">Anticipos no disponible en la práctica.</p>}
      {pestana === 'expedientes' && <p className="erp-vacio">Expedientes no disponible en la práctica.</p>}
      {pestana === 'documentos' && <p className="erp-vacio">Documentos no disponible en la práctica.</p>}
      {pestana === 'notas' && <p className="erp-vacio">Notas no disponible en la práctica.</p>}

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
