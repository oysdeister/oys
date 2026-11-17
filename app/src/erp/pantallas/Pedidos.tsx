import { useState } from 'react';
import {
  useDb,
  erp,
  getDb,
  situacionPedido,
  servida,
  facturaDeAlbaran,
  baseDe,
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
  Enlace,
  Estado,
  eur,
  fechaEs,
  useErp,
  type Accion,
  type Col,
} from '../ui';

function ListaPedidos() {
  const { ini, ir } = useErp();
  const db = useDb();

  const pedidos = [...db.pedidos].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || b.numero.localeCompare(a.numero),
  );

  const cols: Col<Pedido>[] = [
    {
      titulo: 'Número',
      valor: (p) => <span className="mono">{p.numero}</span>,
      texto: (p) => p.numero,
    },
    { titulo: 'Tipo', valor: (p) => p.tipo, texto: (p) => p.tipo },
    { titulo: 'Fecha', valor: (p) => fechaEs(p.fecha), texto: (p) => p.fecha },
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
    { titulo: 'Base', num: true, valor: (p) => eur(baseDe(p.lineas)), texto: (p) => String(baseDe(p.lineas)) },
    { titulo: 'Situación', valor: (p) => <Estado valor={situacionPedido(db, p)} /> },
    { titulo: 'Estado', valor: (p) => <Estado valor={p.estado} /> },
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
      nuevoTexto="Nuevo pedido"
      vacio="No hay pedidos de compra."
      marcarMios={(r) => r.autor === ini}
    />
  );
}

function AltaPedido() {
  const { ini, ir, hacer } = useErp();
  const db = useDb();
  const [prov, setProv] = useState('');

  const proveedores = db.proveedores.map((p) => ({
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
      <Rejilla cols={3}>
        <CampoSel
          label="Proveedor"
          value={prov}
          onChange={setProv}
          opciones={proveedores}
          vacio="— elige proveedor —"
          req
        />
        <CampoLectura label="Tipo" valor="PC · Pedido de compra" />
        <CampoLectura label="Almacén" valor="0" />
        <CampoLectura label="Delegación" valor="CENTRAL" />
      </Rejilla>
    </Ficha>
  );
}

function FichaPedido({ numero }: { numero: string }) {
  const { ini, ir, hacer } = useErp();
  const db = useDb();

  const registro = db.pedidos.find((p) => p.numero === numero);
  const [borrador, setBorrador] = useState<Pedido>(() =>
    registro ? JSON.parse(JSON.stringify(registro)) : ({} as Pedido),
  );
  const [pestana, setPestana] = useState('lineas');

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
          if (hacer(erp.guardarPedido(borrador, ini), 'Pedido guardado')) {
            syncBorrador();
          }
        },
      });
      acciones.push({
        label: 'Validar',
        tipo: 'proceso',
        disabled: cambios,
        onClick: () => {
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

  return (
    <Ficha
      titulo={registro.numero}
      sub="Compras › Pedidos · PC"
      estado={registro.estado}
      acciones={acciones}
      onVolver={() => ir('pedidos', null)}
    >
      {cambios && <p className="erp-nota">Hay cambios sin guardar.</p>}

      <Rejilla cols={3}>
        <CampoLectura
          label="Proveedor"
          valor={
            <Enlace pantalla="proveedores" clave={registro.proveedor}>
              {registro.proveedor} ·{' '}
              {db.terceros.find((t) => t.codigo === registro.proveedor)?.nombre ?? ''}
            </Enlace>
          }
        />
        <CampoFecha
          label="Fecha"
          value={borrador.fecha}
          onChange={(v) => setBorrador({ ...borrador, fecha: v })}
          disabled={!esEditable}
        />
        <CampoLectura label="Almacén" valor={borrador.almacen} />
        <CampoLectura label="Delegación" valor={borrador.delegacion} />
        <CampoTexto
          label="Referencia"
          value={borrador.referencia}
          onChange={(v) => setBorrador({ ...borrador, referencia: v })}
          disabled={!esEditable}
        />
        <CampoLectura label="Situación" valor={<Estado valor={situacion} />} />
      </Rejilla>

      <Pestanas
        tabs={[
          { id: 'lineas', label: 'Líneas', n: borrador.lineas.length },
          { id: 'albaranes', label: 'Albaranes', n: albaranes.length },
        ]}
        actual={pestana}
        onCambio={setPestana}
      />

      {pestana === 'lineas' ? (
        <Lineas
          lineas={borrador.lineas}
          editable={esEditable}
          onChange={esEditable ? (ls) => setBorrador({ ...borrador, lineas: ls }) : undefined}
          articulos={articulosActivos}
          pendientes={pendientes}
        />
      ) : (
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