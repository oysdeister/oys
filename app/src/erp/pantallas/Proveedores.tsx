import { useState } from 'react';
import { erp, CAT, useDb, type Proveedor } from '../modelo';
import {
  Lista,
  Ficha,
  Pestanas,
  Rejilla,
  CampoTexto,
  CampoFecha,
  CampoSel,
  CampoLectura,
  Enlace,
  Estado,
  fechaEs,
  useErp,
  type Accion,
} from '../ui';

export default function Proveedores() {
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
          nuevoTexto="Nuevo proveedor"
          marcarMios={(p) => p.autor === ini}
          cols={[
            { titulo: 'Código', valor: (p) => <span className="mono">{p.tercero}</span>, texto: (p) => p.tercero },
            { titulo: 'Nombre', valor: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.nombre ?? '—', texto: (p) => db.terceros.find((t) => t.codigo === p.tercero)?.nombre ?? '' },
            { titulo: 'Tipo', valor: (p) => p.tipo, texto: (p) => p.tipo },
            { titulo: 'Efecto', valor: (p) => CAT.efectos.find((e) => e.v === p.tipoEfecto)?.t ?? p.tipoEfecto, texto: (p) => CAT.efectos.find((e) => e.v === p.tipoEfecto)?.t ?? p.tipoEfecto },
            { titulo: 'Plazo pago', valor: (p) => CAT.plazos.find((x) => x.v === p.plazoPago)?.t ?? p.plazoPago, texto: (p) => CAT.plazos.find((x) => x.v === p.plazoPago)?.t ?? p.plazoPago },
            { titulo: 'Fecha baja', valor: (p) => fechaEs(p.fechaBaja), texto: (p) => fechaEs(p.fechaBaja) },
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

  const [tab, setTab] = useState('general');

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

  const titulo = esAlta
    ? 'Nuevo proveedor'
    : `${codigo} · ${db.terceros.find((t) => t.codigo === codigo)?.nombre ?? 'Proveedor'}`;
  const sub = 'Maestros › Proveedores';

  const relacionesProveedor = tercero?.relaciones.filter((r) => r.tipo === 'Proveedor') ?? [];

  return (
    <Ficha titulo={titulo} sub={sub} acciones={acciones} onVolver={() => ir('proveedores', null)}>
      <Pestanas
        tabs={[
          { id: 'general', label: 'Datos generales' },
          { id: 'financieros', label: 'Datos financieros' },
        ]}
        actual={tab}
        onCambio={setTab}
      />

      {tab === 'general' && (
        <Rejilla cols={3}>
          <CampoSel
            label="Tercero"
            req
            value={borrador.tercero}
            onChange={onTerceroChange}
            opciones={opcionesTerceros}
            vacio="— elige tercero —"
            disabled={!esAlta || isTutorial}
          />
          <CampoLectura label="Id. fiscal" valor={tercero ? tercero.nif : '—'} />
          <CampoLectura label="Estado" valor={tercero ? <Estado valor={tercero.estado} /> : '—'} />
          <CampoSel
            label="Tipo proveedor"
            value={borrador.tipo}
            onChange={(v) => setBorrador({ ...borrador, tipo: v as Proveedor['tipo'] })}
            opciones={[
              { v: 'GENERAL', t: 'GENERAL' },
              { v: 'ACREEDOR', t: 'ACREEDOR' },
            ]}
            disabled={isTutorial}
          />
          <CampoFecha
            label="Fecha baja"
            value={borrador.fechaBaja}
            onChange={(v) => setBorrador({ ...borrador, fechaBaja: v })}
            disabled={isTutorial}
          />
          <CampoTexto
            label="Central compras"
            mono
            value={borrador.centralCompras}
            onChange={(v) => setBorrador({ ...borrador, centralCompras: v })}
            disabled={isTutorial}
          />
          <CampoTexto
            label="Central pagos"
            mono
            value={borrador.centralPagos}
            onChange={(v) => setBorrador({ ...borrador, centralPagos: v })}
            disabled={isTutorial}
          />
        </Rejilla>
      )}

      {tab === 'financieros' && (
        <>
          <Rejilla cols={3}>
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
          </Rejilla>
          <section className="erp-seccion">
            <h3>Relaciones contables del tercero</h3>
            {tercero ? (
              <>
                {relacionesProveedor.length > 0 ? (
                  <ul>
                    {relacionesProveedor.map((r) => (
                      <li key={r.codigo}>
                        {r.codigo} · {r.cuenta}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="erp-nota">No tiene relaciones de tipo Proveedor.</p>
                )}
                <Enlace pantalla="terceros" clave={tercero.codigo}>
                  Abrir tercero
                </Enlace>
              </>
            ) : (
              <p className="erp-nota">Selecciona un tercero para ver sus relaciones contables.</p>
            )}
          </section>
        </>
      )}
    </Ficha>
  );
}