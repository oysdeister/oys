import { useState } from 'react';
import { erp, CAT, useDb, type Proveedor } from '../modelo';
import {
  Lista,
  Ficha,
  Seccion,
  Rejilla,
  CampoTexto,
  CampoFecha,
  CampoSel,
  CampoLectura,
  CampoCheck,
  Enlace,
  Estado,

  useErp,
  type Accion,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

export default function Proveedores() {
  const extraAcc = useAccionesCatalogo('gproveed');
  const extraMenu = useEnlacesCatalogo('gproveed');
  const { ini, clave, ir, hacer } = useErp();
  const db = useDb();

  if (clave === null) {
    return (
      <>
        {!ini && <p className="erp-nota">Pon tus iniciales para trabajar.</p>}
        <Lista
          titulo="Proveedores"
          filas={db.proveedores}
          clave={(p) => p.tercero}
          onAbrir={(p) => ir('proveedores', p.tercero)}
          onNuevo={ini ? () => ir('proveedores', '__nuevo') : undefined}
          marcarMios={(p) => p.autor === ini}
          cols={[
            { titulo: 'Proveedor', valor: (p) => <span className="mono">{p.tercero}</span>, texto: (p) => p.tercero },
            { titulo: 'Nombre', valor: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.nombre ?? '—', texto: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.nombre ?? '' },
            { titulo: 'Grupo', valor: () => 'ALL', texto: () => 'ALL' },
            { titulo: 'Tipo proveedor', valor: (p) => p.tipo, texto: (p) => p.tipo },
            { titulo: 'Grupo de empresas', valor: () => 'ALL', texto: () => 'ALL' },
            { titulo: 'Tercero facturación', valor: (p) => p.tercero, texto: (p) => p.tercero },
            { titulo: 'Dirección facturación', valor: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.direcciones[0]?.direccion ?? '—', texto: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.direcciones[0]?.direccion ?? '' },
            { titulo: 'Divisa', valor: () => 'EUR', texto: () => 'EUR' },
            { titulo: 'Descuento comercial 1', valor: () => '0,000', texto: () => '0,000', num: true },
            { titulo: 'Estado', valor: () => <Estado valor="Activo" />, texto: () => 'Activo' },
          ]}
          vacio="No hay proveedores."
        />
      </>
    );
  }

  const esAlta = clave.startsWith('__nuevo');
  const codigo = clave;

  if (!esAlta && !db.proveedores.some((p) => p.tercero === codigo)) {
    return <p className="erp-nota">No existe el proveedor {codigo}.</p>;
  }

  const isTutorial = !esAlta && db.proveedores.find((p) => p.tercero === codigo)?.autor === 'TUTORIAL';

  const [borrador, setBorrador] = useState<Proveedor>(() => {
    if (esAlta) {
      const propuesto = clave.startsWith('__nuevo:') ? clave.slice('__nuevo:'.length) : '';
      return {
        tercero: propuesto,
        tipo: 'GENERAL',
        tipoEfecto: 'TF',
        plazoPago: '30D',
        fechaBaja: '2099-12-31',
        centralCompras: propuesto,
        centralPagos: propuesto,
        autor: ini,
      };
    }
    const p = db.proveedores.find((x) => x.tercero === codigo);
    return p
      ? { ...p }
      : {
          tercero: '',
          tipo: 'GENERAL',
          tipoEfecto: 'TF',
          plazoPago: '30D',
          fechaBaja: '2099-12-31',
          centralCompras: '',
          centralPagos: '',
          autor: ini,
        };
  });

  const tercero = db.terceros.find((t) => t.codigo === borrador.tercero);
  const opcionesTerceros = db.terceros
    .filter((t) => t.categoria === '002 Proveedores' || t.relaciones.some((r) => r.tipo === 'Proveedor'))
    .map((t) => ({ v: t.codigo, t: `${t.codigo} · ${t.nombre}` }));

  const onTerceroChange = (v: string) => {
    setBorrador((prev) => {
      const anterior = prev.tercero;
      const nuevo: Proveedor = { ...prev, tercero: v };
      if (esAlta) {
        if (prev.centralCompras === '' || prev.centralCompras === anterior) nuevo.centralCompras = v;
        if (prev.centralPagos === '' || prev.centralPagos === anterior) nuevo.centralPagos = v;
      }
      return nuevo;
    });
  };

  const acciones: Accion[] = [];
  if (!isTutorial) {
    acciones.push({
      label: 'Guardar',
      tipo: 'primario',
      onClick: () => {
        const res = erp.guardarProveedor(borrador, ini);
        if (hacer(res, 'Proveedor guardado', res.ok ? { pantalla: 'proveedores', clave: res.doc } : undefined)) {
          if (esAlta && res.ok) ir('proveedores', res.doc);
        }
      },
    });
    if (!esAlta) {
      acciones.push({
        label: 'Nuevo pedido',
        lugar: 'acciones',
        tipo: 'proceso',
        onClick: () => {
          const r = erp.nuevoPedido(codigo, ini);
          if (hacer(r, 'Pedido creado')) {
            if (r.ok) ir('pedidos', r.doc);
          }
        },
      });
      acciones.push({
        label: 'Ver tercero',
        onClick: () => ir('terceros', codigo),
      });
    }
  }

  const titulo = esAlta ? 'Nuevo proveedor' : codigo;
  const relacionesProveedor = tercero?.relaciones.filter((r) => r.tipo === 'Proveedor') ?? [];

  return (
    <Ficha titulo={titulo} acciones={[...acciones, ...extraAcc]} menu={extraMenu} onVolver={() => ir('proveedores', null)}>
      <Seccion titulo="Identificación">
        <Rejilla cols={4}>
          <CampoSel
            label="Tercero"
            req
            value={borrador.tercero}
            onChange={onTerceroChange}
            opciones={opcionesTerceros}
            vacio="— elige tercero —"
            disabled={!esAlta || isTutorial}
            ayuda={tercero ? `${tercero.nombre} · ${tercero.nif}` : ''}
          />
          <CampoLectura label="Fecha alta" req valor="" />
          <CampoLectura label="Estado" req valor={<Estado valor="Activo" />} />
          <CampoLectura label="Validaciones" valor="0" num />
          <CampoCheck label="Federación" value={false} disabled={isTutorial} />
          <CampoFecha
            label="Fecha baja"
            value={borrador.fechaBaja}
            onChange={(v) => setBorrador({ ...borrador, fechaBaja: v })}
            disabled={isTutorial}
          />
          <CampoLectura label="Password web" valor="" />
          <CampoLectura label="Grupo" valor="ALL" />
          <CampoLectura label="Cliente" valor="" />
          <CampoLectura label="Comercial" req valor="" />
          <CampoLectura label="Grupo de empresas" req valor="ALL" />
          <CampoSel
            label="Tipo proveedor"
            req
            value={borrador.tipo}
            onChange={(v) => setBorrador({ ...borrador, tipo: v as Proveedor['tipo'] })}
            opciones={[
              { v: 'GENERAL', t: 'GENERAL' },
              { v: 'ACREEDOR', t: 'ACREEDOR' },
            ]}
            disabled={isTutorial}
          />
        </Rejilla>
      </Seccion>

      <Seccion
        tabs={[
          {
            label: 'Información general',
            contenido: (
              <Rejilla cols={4}>
                <CampoLectura label="Agrupar pedidos" req valor="Tercero y más campos" />
                <CampoLectura label="Transportista" valor="" />
                <CampoLectura label="Tipo transporte" valor="" />
                <CampoLectura label="Medio transporte" valor="" />
                <CampoLectura label="Sector transporte" valor="" />
                <CampoLectura label="Plazo entrega" req valor="0" num />
                <CampoLectura label="Días demora" valor="0,00" num />
                <CampoLectura label="Tipo días" req valor="Calendario" />
                <CampoLectura label="Pedidos parciales" valor="" />
                <CampoLectura label="Depósito" valor="" />
                <CampoLectura label="Incoterm" valor="" />
                <CampoLectura label="Calidad" valor="" />
                <CampoLectura label="Portes" req valor="Debidos" />
                <CampoLectura label="Redondeo" valor="" />
                <CampoLectura label="Descuento comercial 1" valor="0,000" num />
                <CampoLectura label="Descuento comercial 2" valor="0,000" num />
                <CampoLectura label="Divisa" req valor="EUR" ayuda="Euro" />
                <CampoLectura label="Mínimo pedido" req valor="0,00" num />
                <CampoLectura label="Descuento comercial 3" valor="0,000" num />
                <CampoLectura label="% Pronto pago" valor="0,000" num />
                <CampoLectura label="Importe tolerancia" valor="" />
                <CampoLectura label="% tolerancia" valor="" />
                <CampoLectura label="% Royalty" req valor="0,00" num />
                <CampoLectura label="Identificador proveedor" valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Facturación',
            contenido: (
              <Rejilla cols={4}>
                <CampoLectura label="Tercero facturación" req valor={borrador.tercero || '—'} ayuda={tercero?.nombre} />
                <CampoLectura label="Agrupación albaranes" req valor="" />
                <CampoLectura label="Dirección facturación" valor={tercero?.direcciones[0]?.direccion ?? '—'} />
                <CampoLectura label="Modo autofacturación" req valor="" />
              </Rejilla>
            ),
          },
          {
            label: 'Central de compras',
            contenido: (
              <Rejilla cols={4}>
                <CampoTexto
                  label="Central compras"
                  mono
                  value={borrador.centralCompras}
                  onChange={(v) => setBorrador({ ...borrador, centralCompras: v })}
                  disabled={isTutorial}
                />
                <CampoLectura label="Proveedor compras" valor={borrador.centralCompras || '—'} ayuda={db.terceros.find((t) => t.codigo === borrador.centralCompras)?.nombre} />
              </Rejilla>
            ),
          },
          {
            label: 'Central de pagos',
            contenido: (
              <Rejilla cols={4}>
                <CampoTexto
                  label="Central pagos"
                  mono
                  value={borrador.centralPagos}
                  onChange={(v) => setBorrador({ ...borrador, centralPagos: v })}
                  disabled={isTutorial}
                />
                <CampoLectura label="Proveedor pagos" valor={borrador.centralPagos || '—'} ayuda={db.terceros.find((t) => t.codigo === borrador.centralPagos)?.nombre} />
              </Rejilla>
            ),
          },
        ]}
      />

      <Seccion
        tabs={[
          { label: 'Logística', noDisp: true, contenido: null },
          { label: 'Auxiliares', noDisp: true, contenido: null },
          { label: 'Impresión', noDisp: true, contenido: null },
        ]}
      />

      <Seccion
        tabs={[
          {
            label: 'Datos financieros',
            contenido: (
              <>
                <Rejilla cols={4}>
                  <CampoSel
                    label="Tipo efecto"
                    value={borrador.tipoEfecto}
                    onChange={(v) => setBorrador({ ...borrador, tipoEfecto: v })}
                    opciones={CAT.efectos}
                    disabled={isTutorial}
                  />
                  <CampoSel
                    label="Plazo pago"
                    req
                    value={borrador.plazoPago}
                    onChange={(v) => setBorrador({ ...borrador, plazoPago: v })}
                    opciones={CAT.plazos}
                    disabled={isTutorial}
                  />
                  <CampoLectura label="Agrupación empresas" req valor="ALL" />
                  <CampoLectura label="Delegación" valor="CENTRAL" />
                  <CampoLectura label="Dirección" valor={tercero?.direcciones[0]?.direccion ?? '—'} />
                  <CampoLectura label="Divisa" req valor="EUR" ayuda="Euro" />
                  <CampoLectura label="Cambio" req num valor="1,000000" />
                  <CampoLectura label="% Pronto pago" valor="0,000" num />
                </Rejilla>
                {tercero ? (
                  relacionesProveedor.length > 0 ? (
                    <Rejilla cols={3}>
                      {relacionesProveedor.map((r) => (
                        <CampoLectura
                          key={`${r.codigo}-${r.cuenta}`}
                          label={`Relación ${r.codigo}`}
                          valor={`${r.codigo} · ${r.cuenta}`}
                          ayuda={`${r.tipo} · ${r.plan}`}
                        />
                      ))}
                    </Rejilla>
                  ) : (
                    <p className="erp-nota">No tiene relaciones de tipo Proveedor.</p>
                  )
                ) : (
                  <p className="erp-nota">Selecciona un tercero para ver sus relaciones contables.</p>
                )}
                {tercero && (
                  <Enlace pantalla="terceros" clave={tercero.codigo}>
                    Abrir tercero
                  </Enlace>
                )}
              </>
            ),
          },
          { label: 'Tarifas', noDisp: true, contenido: null },
          { label: 'Transportes', noDisp: true, contenido: null },
        ]}
      />

      <Seccion
        tabs={[
          { label: 'Destinos', noDisp: true, contenido: null },
          { label: 'Artículos por proveedor', noDisp: true, contenido: null },
          { label: 'Almacenes', noDisp: true, contenido: null },
          { label: 'Notas', noDisp: true, contenido: null },
        ]}
      />

      <Seccion
        tabs={[
          { label: 'Datos de control', noDisp: true, contenido: null },
          { label: 'Workflow', noDisp: true, contenido: null },
          { label: 'Evolución del workflow', noDisp: true, contenido: null },
        ]}
      />
    </Ficha>
  );
}
