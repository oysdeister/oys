import { useState } from 'react';
import {
  useDb,
  fin,
  sumaDebe,
  sumaHaber,
  type Efecto,
  type EstadoEfecto,
} from '../modelo';
import {
  useErp,
  Lista,
  Ficha,
  Pestanas,
  Rejilla,
  CampoLectura,
  CampoSel,
  Seccion,
  Dialogo,
  Enlace,
  Estado,
  eur,
  dec,
  fechaEs,
  type Accion,
  type Col,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

const nombreEstado = (e: EstadoEfecto) =>
  e === 'PE' ? 'Pendiente' : e === 'OP' ? 'Ordenado' : e === 'PA' ? 'Pagado' : 'Cobrado';

const claseEfecto = (c: Efecto['clase']) => (c === 'P' ? 'Pagar' : 'Cobrar');
/** justificante del documento de origen: FC factura de compra (pagos) · FV factura de venta (cobros) */
const justificante = (e: Efecto) => (e.clase === 'P' ? 'FC' : 'FV');

type FiltroEfectos = 'Todos' | 'Pendientes' | 'En remesa' | 'Pagados';

function ListaEfectos() {
  const { ini, ir } = useErp();
  const db = useDb();
  const [filtro, setFiltro] = useState<FiltroEfectos>('Todos');

  const filtrados = db.efectos.filter((e) => {
    if (filtro === 'Pendientes') return e.estado === 'PE';
    if (filtro === 'En remesa') return e.remesa !== null;
    if (filtro === 'Pagados') return e.estado === 'PA' || e.estado === 'CO';
    return true;
  });

  const chips: { id: FiltroEfectos; label: string }[] = [
    { id: 'Todos', label: 'Todos' },
    { id: 'Pendientes', label: 'Pendientes' },
    { id: 'En remesa', label: 'En remesa' },
    { id: 'Pagados', label: 'Pagados' },
  ];

  const cols: Col<Efecto>[] = [
    {
      titulo: 'Id. efecto',
      valor: (e) => (
        <Enlace pantalla="efectos" clave={String(e.numero)}>
          {e.numero}
        </Enlace>
      ),
      texto: (e) => String(e.numero),
    },
    { titulo: 'Empresa', valor: () => '0', texto: () => '0' },
    {
      titulo: 'Clase',
      valor: (e) => (
        <>
          <span style={{ color: e.clase === 'P' ? '#f44336' : '#2e7d32' }}>●</span>{' '}
          {claseEfecto(e.clase)}
        </>
      ),
      texto: (e) => claseEfecto(e.clase),
    },
    { titulo: 'Tercero', valor: (e) => e.tercero, texto: (e) => e.tercero },
    {
      titulo: 'Nombre',
      valor: (e) => db.terceros.find((t) => t.codigo === e.tercero)?.nombre ?? '',
      texto: (e) => db.terceros.find((t) => t.codigo === e.tercero)?.nombre ?? '',
    },
    { titulo: 'Cuenta', valor: (e) => e.cuenta, texto: (e) => e.cuenta },
    { titulo: 'Justificante', valor: (e) => justificante(e), texto: (e) => justificante(e) },
    {
      titulo: 'Documento',
      valor: (e) =>
        db.facturas.some((f) => f.numero === e.docser) ? (
          <Enlace pantalla="facturas" clave={e.docser}>
            {e.docser}
          </Enlace>
        ) : (
          e.docser
        ),
      texto: (e) => e.docser,
    },
    {
      titulo: 'Estado',
      valor: (e) => <Estado valor={nombreEstado(e.estado)} />,
      texto: (e) => nombreEstado(e.estado),
    },
    { titulo: 'Orden', valor: (e) => e.numefe, texto: (e) => String(e.numefe) },
    { titulo: 'Fecha factura', valor: (e) => fechaEs(e.fecha), texto: (e) => e.fecha },
    { titulo: 'Vencimiento', valor: (e) => fechaEs(e.fecven), texto: (e) => e.fecven },
    {
      titulo: 'Importe local',
      num: true,
      valor: (e) => eur(e.importe),
      texto: (e) => String(e.importe),
    },
    { titulo: 'Importe divisa', num: true, valor: (e) => eur(e.importe), texto: (e) => String(e.importe) },
    { titulo: 'Moneda', valor: () => 'EUR', texto: () => 'EUR' },
    { titulo: 'Tipo de efecto', valor: (e) => e.tipefe, texto: (e) => e.tipefe },
    {
      titulo: 'Remesa',
      valor: (e) =>
        e.remesa !== null ? (
          <Enlace pantalla="remesas" clave={String(e.remesa)}>
            {e.remesa}
          </Enlace>
        ) : (
          '—'
        ),
      texto: (e) => (e.remesa !== null ? String(e.remesa) : ''),
    },
  ];

  return (
    <>
      <div className="erp-filtros">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`erp-chip${filtro === c.id ? ' on' : ''}`}
            onClick={() => setFiltro(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <Lista
        titulo="CARTERA DE EFECTOS"
        filas={filtrados}
        cols={cols}
        clave={(e) => String(e.numero)}
        onAbrir={(e) => ir('efectos', String(e.numero))}
        vacio={
          db.efectos.length === 0
            ? 'No hay efectos. Se generan al contabilizar una factura de compra.'
            : 'No hay efectos con este filtro.'
        }
        marcarMios={(e) => e.autor === ini}
      />
    </>
  );
}

function FichaEfecto({ numero }: { numero: string }) {
  const { ini, ir, hacer } = useErp();
  const db = useDb();
  const [pestana, setPestana] = useState('cartera');
  const [dialogo, setDialogo] = useState(false);
  const [estadoDestino, setEstadoDestino] = useState<EstadoEfecto>('PA');

  const accionesCatalogo = useAccionesCatalogo('cefectos', ['Evolucionar estado', 'Retroceder']);
  const enlacesCatalogo = useEnlacesCatalogo('cefectos');

  const registro = db.efectos.find((e) => String(e.numero) === numero);

  if (!registro) {
    return (
      <section className="erp-ficha">
        <p className="erp-nota">Efecto no encontrado.</p>
        <button className="erp-btn" onClick={() => ir('efectos', null)}>
          Volver
        </button>
      </section>
    );
  }

  const tercero = db.terceros.find((t) => t.codigo === registro.tercero);
  const factura = db.facturas.find((f) => f.numero === registro.docser);
  const historia = db.log.filter((l) => l.doc.includes(`efecto:${registro.numero}`));
  const asientos = db.asientos.filter(
    (a) => a.docser === registro.docser || (registro.remesa !== null && a.docser === `REM ${registro.remesa}`),
  );

  const enRemesa = registro.remesa !== null;
  const avisoRemesa = enRemesa ? ` — el efecto está en la remesa ${registro.remesa}: se gestiona desde la remesa` : '';
  // un efecto suelto pasa de Pendiente a Pagado (pago) o Cobrado (cobro)
  const destino: EstadoEfecto = registro.clase === 'P' ? 'PA' : 'CO';
  const acciones: Accion[] = [
    {
      label: 'Evolucionar estado',
      tipo: 'proceso',
      disabled: enRemesa || registro.estado !== 'PE',
      title: `Evolucionar estado${avisoRemesa}`,
      onClick: () => {
        setEstadoDestino(destino);
        setDialogo(true);
      },
    },
    {
      label: 'Retroceder',
      tipo: 'normal',
      disabled: enRemesa || registro.estado === 'PE',
      title: `Retroceder${avisoRemesa}`,
      onClick: () => {
        const res = fin.estadoEfecto(registro.numero, 'PE', ini);
        hacer(res, 'Efecto retrocedido a Pendiente');
      },
    },
    ...accionesCatalogo,
  ];

  return (
    <Ficha
      titulo={registro.docser || `Efecto ${registro.numero}`}
      sub={`Efecto ${registro.numero} · vencimiento ${registro.numefe}`}
      lista="CARTERA DE EFECTOS"
      estado={nombreEstado(registro.estado)}
      acciones={acciones}
      onVolver={() => ir('efectos', null)}
      menu={enlacesCatalogo}
    >
      {dialogo && (
        <Dialogo
          titulo="Evolucionar estado"
          onCerrar={() => setDialogo(false)}
          acciones={[
            {
              label: 'Aceptar',
              tipo: 'primario',
              onClick: () => {
                const res = fin.estadoEfecto(registro.numero, estadoDestino, ini);
                if (hacer(res, 'Estado del efecto actualizado')) {
                  setDialogo(false);
                }
              },
            },
          ]}
        >
          <Rejilla cols={1}>
            <CampoSel
              label="Estado destino"
              value={estadoDestino}
              onChange={(v) => setEstadoDestino(v as EstadoEfecto)}
              opciones={registro.clase === 'P' ? [{ v: 'PA', t: 'PA Pagado' }] : [{ v: 'CO', t: 'CO Cobrado' }]}
            />
          </Rejilla>
        </Dialogo>
      )}

      <Pestanas
        tabs={[
          { id: 'cartera', label: 'Cartera de efectos' },
          { id: 'historia', label: 'Historia efecto' },
          { id: 'asientos', label: 'Asientos contables' },
        ]}
        actual={pestana}
        onCambio={setPestana}
      />

      {pestana === 'cartera' ? (
        <>
          <Seccion titulo="Unidad de negocio">
            <Rejilla cols={3}>
              <CampoLectura label="Empresa" valor="0" />
              <CampoLectura label="Proyecto" valor="0" />
              <CampoLectura label="Sección" valor="0" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Fechas">
            <Rejilla cols={3}>
              <CampoLectura label="Fecha factura" valor={fechaEs(registro.fecha)} />
              <CampoLectura label="Vencimiento" valor={fechaEs(registro.fecven)} />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Referencias">
            <Rejilla cols={3}>
              <CampoLectura label="Justificante" valor={justificante(registro)} />
              <CampoLectura
                label="Clase"
                valor={
                  <>
                    <span style={{ color: registro.clase === 'P' ? '#f44336' : '#2e7d32' }}>●</span>{' '}
                    {claseEfecto(registro.clase)}
                  </>
                }
              />
              <CampoLectura
                label="Documento"
                valor={
                  factura ? (
                    <Enlace pantalla="facturas" clave={factura.numero}>
                      {factura.numero}
                    </Enlace>
                  ) : (
                    registro.docser
                  )
                }
              />
              <CampoLectura label="Orden" valor={registro.numefe} />
              <CampoLectura label="Tipo efecto" valor={registro.tipefe} />
              <CampoLectura label="Sistema" valor="A" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Tercero">
            <Rejilla cols={3}>
              <CampoLectura
                label="Tercero"
                valor={
                  <Enlace pantalla="terceros" clave={registro.tercero}>
                    {registro.tercero} · {tercero?.nombre ?? ''}
                  </Enlace>
                }
              />
              <CampoLectura label="Cuenta" valor={registro.cuenta} />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Estados">
            <Rejilla cols={3}>
              <CampoLectura label="Tipo efecto" valor={registro.tipefe} />
              <CampoLectura label="Estado" valor={<Estado valor={nombreEstado(registro.estado)} />} />
              <CampoLectura
                label="Remesa"
                valor={
                  registro.remesa !== null ? (
                    <Enlace pantalla="remesas" clave={String(registro.remesa)}>
                      {registro.remesa}
                    </Enlace>
                  ) : (
                    '—'
                  )
                }
              />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Importes">
            <Rejilla cols={4}>
              <CampoLectura label="Moneda" valor="EUR" />
              <CampoLectura label="Importe divisa" valor={eur(registro.importe)} num />
              <CampoLectura label="Cambio" valor={dec(1, 6)} num />
              <CampoLectura label="Importe local" valor={eur(registro.importe)} num />
            </Rejilla>
          </Seccion>
        </>
      ) : pestana === 'historia' ? (
        <Seccion titulo="Historia efecto">
          <div className="erp-tabla-scroll">
            <table className="erp-tabla compacta">
              <thead>
                <tr>
                  <th>Fecha-hora</th>
                  <th>Qué</th>
                  <th>Autor</th>
                </tr>
              </thead>
              <tbody>
                {historia.map((h, i) => (
                  <tr key={i}>
                    <td>{new Date(h.t).toLocaleString('es-ES')}</td>
                    <td>{h.que}</td>
                    <td>{h.autor}</td>
                  </tr>
                ))}
                {!historia.length && (
                  <tr className="vacia">
                    <td colSpan={3}>Sin historia.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Seccion>
      ) : pestana === 'asientos' ? (
        <Seccion titulo="Asientos contables">
          <div className="erp-tabla-scroll">
            <table className="erp-tabla compacta">
              <thead>
                <tr>
                  <th>Asiento</th>
                  <th>Fecha</th>
                  <th>Justificante</th>
                  <th>Documento</th>
                  <th className="num">Debe</th>
                  <th className="num">Haber</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {asientos.map((a) => (
                  <tr key={a.numero}>
                    <td>
                      <Enlace pantalla="asientos" clave={String(a.numero)}>
                        {a.numero}
                      </Enlace>
                    </td>
                    <td>{fechaEs(a.fecha)}</td>
                    <td>{a.jusser}</td>
                    <td>{a.docser}</td>
                    <td className="num">{eur(sumaDebe(a))}</td>
                    <td className="num">{eur(sumaHaber(a))}</td>
                    <td>
                      <Estado valor={a.estado === 'C' ? 'Contabilizado' : 'Provisional'} />
                    </td>
                  </tr>
                ))}
                {!asientos.length && (
                  <tr className="vacia">
                    <td colSpan={7}>Sin asientos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Seccion>
      ) : null}
    </Ficha>
  );
}

export default function Efectos() {
  const { clave } = useErp();
  if (clave === null) return <ListaEfectos />;
  return <FichaEfecto key={clave} numero={clave} />;
}