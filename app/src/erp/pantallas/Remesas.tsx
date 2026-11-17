import { useState } from 'react';
import {
  useDb,
  fin,
  importeRemesa,
  cuentaBanco,
  getDb,
  CUENTAS_FIN,
  type Remesa,
} from '../modelo';
import {
  Lista,
  Ficha,
  Pestanas,
  Rejilla,
  CampoLectura,
  CampoSel,
  CampoFecha,
  Seccion,
  Enlace,
  Estado,
  eur,
  fechaEs,
  useErp,
  Dialogo,
  Icono,
  type Accion,
  type Col,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

const EXCLUIR = ['Evolucionar estado', 'Retroceder', 'Imprimir formato', 'Soportes electrónicos'];
const ESTADO_EFECTO: Record<string, string> = { PE: 'Pendiente', OP: 'Ordenado', PA: 'Pagado', CO: 'Cobrado' };

function DialogoNuevaRemesa({ onCerrar }: { onCerrar: () => void }) {
  const { ini, ir, hacer } = useErp();
  const [clase, setClase] = useState<'P' | 'C'>('P');
  const [tipdoc, setTipdoc] = useState('PSCTT');
  const [ctafin, setCtafin] = useState('BBVA_CA');

  const tipos = clase === 'P'
    ? [
        { v: 'PSCTT', t: 'Pago transferencias (con Tesorería)' },
        { v: 'PSCTS', t: 'Pago transferencias (sin Tesorería)' },
        { v: 'PCHET', t: 'Pago cheques (con Tesorería)' },
      ]
    : [
        { v: 'CSCTT', t: 'Cobro transferencias (con Tesorería)' },
        { v: 'CCHET', t: 'Cobro cheques (con Tesorería)' },
      ];

  const cambiarClase = (v: string) => {
    setClase(v as 'P' | 'C');
    setTipdoc(v === 'P' ? 'PSCTT' : 'CSCTT');
  };

  const crear = () => {
    const r = fin.nuevaRemesa(clase, tipdoc, ctafin, ini);
    if (hacer(r, 'Remesa creada') && r.ok) {
      onCerrar();
      ir('remesas', r.doc);
    }
  };

  return (
    <Dialogo
      titulo="Nueva remesa"
      onCerrar={onCerrar}
      acciones={[
        { label: 'Aceptar', onClick: crear, disabled: !tipdoc || !ctafin || !ini },
      ]}
    >
      <Rejilla cols={3}>
        <CampoSel
          label="Clase"
          value={clase}
          onChange={cambiarClase}
          opciones={[
            { v: 'P', t: 'Pagar' },
            { v: 'C', t: 'Cobrar' },
          ]}
          req
        />
        <CampoSel label="Tipo remesa" value={tipdoc} onChange={setTipdoc} opciones={tipos} req />
        <CampoSel
          label="Cuenta financiera"
          value={ctafin}
          onChange={setCtafin}
          opciones={CUENTAS_FIN.map((c) => ({ v: c.ctafin, t: `${c.ctafin} · ${c.nombre}` }))}
          req
        />
      </Rejilla>
    </Dialogo>
  );
}

function ListaRemesas() {
  const { ini, ir } = useErp();
  const db = useDb();
  const [nueva, setNueva] = useState(false);

  const remesas = [...db.remesas].sort((a, b) => b.numrem - a.numrem);

  const cols: Col<Remesa>[] = [
    {
      titulo: 'Remesa',
      valor: (r) => <Enlace pantalla="remesas" clave={String(r.numrem)}>{r.numrem}</Enlace>,
      texto: (r) => String(r.numrem),
    },
    { titulo: 'Clase', valor: (r) => (r.clase === 'P' ? 'Pagar' : 'Cobrar'), texto: (r) => (r.clase === 'P' ? 'Pagar' : 'Cobrar') },
    { titulo: 'Tipo remesa', valor: (r) => r.tipdoc, texto: (r) => r.tipdoc },
    { titulo: 'Fecha remesa', valor: (r) => fechaEs(r.fecrem), texto: (r) => r.fecrem },
    { titulo: 'Fecha valor', valor: (r) => fechaEs(r.fecval), texto: (r) => r.fecval },
    { titulo: 'Estado', valor: (r) => <Estado valor={r.estrem === 'A' ? 'Abierto' : 'Cerrado'} />, texto: (r) => (r.estrem === 'A' ? 'Abierto' : 'Cerrado') },
    { titulo: 'Cuenta financiera', valor: (r) => r.ctafin, texto: (r) => r.ctafin },
    { titulo: 'Total remesa', num: true, valor: (r) => eur(importeRemesa(db, r)), texto: (r) => String(importeRemesa(db, r)) },
    { titulo: 'Moneda', valor: () => 'EUR', texto: () => 'EUR' },
    { titulo: 'Cambio', num: true, valor: () => '1,000000', texto: () => '1' },
    { titulo: 'Justificante', valor: () => 'RM', texto: () => 'RM' },
    { titulo: 'Empresa', valor: () => '0', texto: () => '0' },
  ];

  return (
    <>
      <Lista
        titulo="Remesas de cobros y pagos"
        filas={remesas}
        cols={cols}
        clave={(r) => String(r.numrem)}
        onAbrir={(r) => ir('remesas', String(r.numrem))}
        onNuevo={() => setNueva(true)}
        vacio="No hay remesas."
        marcarMios={(r) => r.autor === ini}
      />
      {nueva && <DialogoNuevaRemesa onCerrar={() => setNueva(false)} />}
    </>
  );
}

function FichaRemesa({ numrem }: { numrem: number }) {
  const { ini, ir, hacer, aviso } = useErp();
  const db = useDb();
  const catalogoAcciones = useAccionesCatalogo('cremesas', EXCLUIR);
  const catalogoEnlaces = useEnlacesCatalogo('cremesas', EXCLUIR);

  const [borrador, setBorrador] = useState<Remesa>(() => {
    const r = db.remesas.find((x) => x.numrem === numrem);
    if (!r) return {} as Remesa;
    return JSON.parse(JSON.stringify(r)) as Remesa;
  });
  const [pestana, setPestana] = useState('informacion');
  const [nueva, setNueva] = useState(false);
  const [confirmarCierre, setConfirmarCierre] = useState(false);
  const [marcados, setMarcados] = useState<number[]>([]);

  const registro = db.remesas.find((x) => x.numrem === numrem);

  if (!registro || !borrador.numrem) {
    return (
      <section className="erp-ficha">
        <p className="erp-nota">Remesa no encontrada.</p>
        <button className="erp-btn" onClick={() => ir('remesas', null)}>Volver</button>
      </section>
    );
  }

  const esEditable = registro.estrem === 'A';
  const efectos = db.efectos.filter((e) => registro.efectos.includes(e.numero));
  const pendientes = db.efectos.filter((e) => e.clase === registro.clase && e.estado === 'PE' && e.remesa === null);

  const tiposRemesa = (clase: 'P' | 'C') => clase === 'P'
    ? [
        { v: 'PSCTT', t: 'Pago transferencias (con Tesorería)' },
        { v: 'PSCTS', t: 'Pago transferencias (sin Tesorería)' },
        { v: 'PCHET', t: 'Pago cheques (con Tesorería)' },
      ]
    : [
        { v: 'CSCTT', t: 'Cobro transferencias (con Tesorería)' },
        { v: 'CCHET', t: 'Cobro cheques (con Tesorería)' },
      ];

  const acciones: Accion[] = [];

  if (esEditable) {
    acciones.push({
      label: 'Guardar',
      lugar: 'guardar',
      tipo: 'primario',
      onClick: () => {
        const r = fin.guardarRemesa(borrador, ini);
        if (hacer(r, 'Remesa guardada')) {
          const fresh = getDb().remesas.find((x) => x.numrem === numrem);
          if (fresh) setBorrador(JSON.parse(JSON.stringify(fresh)));
        }
      },
    });
    acciones.push({
      label: 'Borrar',
      tipo: 'peligro',
      onClick: () => {
        if (window.confirm('¿Borrar la remesa?')) {
          const r = fin.borrarRemesa(numrem, ini);
          if (hacer(r, 'Remesa borrada') && r.ok) {
            ir('remesas', null);
          }
        }
      },
    });
  }
  // como en Axional, los dos botones de proceso están siempre y se activan según el estado
  acciones.push({
    label: 'Evolucionar estado',
    tipo: 'proceso',
    title: esEditable ? 'Evolucionar estado' : 'Evolucionar estado — la remesa ya está cerrada',
    disabled: !esEditable,
    onClick: () => setConfirmarCierre(true),
  });
  acciones.push({
    label: 'Retroceder',
    tipo: 'proceso',
    title: esEditable ? 'Retroceder — la remesa está abierta' : 'Retroceder',
    disabled: esEditable,
    onClick: () => {
      if (hacer(fin.retrocederRemesa(numrem, ini), 'Remesa retrocedida')) {
        const fresh = getDb().remesas.find((x) => x.numrem === numrem);
        if (fresh) setBorrador(JSON.parse(JSON.stringify(fresh)));
      }
    },
  });

  acciones.push({
    label: 'Imprimir formato',
    lugar: 'acciones',
    onClick: () => aviso('ok', 'Formato de remesa generado en PDF.'),
  });

  acciones.push({
    label: 'Soportes electrónicos',
    lugar: 'boton',
    disabled: registro.estrem !== 'C',
    title: registro.estrem === 'C' ? 'Soportes electrónicos' : 'Soportes electrónicos — se generan con la remesa cerrada',
    onClick: () => aviso('ok', `Fichero SEPA generado: remesa_${numrem}.xml`),
  });

  acciones.push({
    label: 'Nuevo',
    lugar: 'boton',
    onClick: () => setNueva(true),
  });

  acciones.push(...catalogoAcciones);

  const quitar = (n: number) => {
    const r = fin.quitarEfecto(numrem, n, ini);
    if (hacer(r, 'Efecto quitado')) {
      const fresh = getDb().remesas.find((x) => x.numrem === numrem);
      if (fresh) setBorrador(JSON.parse(JSON.stringify(fresh)));
    }
  };

  const incluir = () => {
    const r = fin.incluirEfectos(numrem, marcados, ini);
    if (hacer(r, 'Efectos incluidos')) {
      setMarcados([]);
      const fresh = getDb().remesas.find((x) => x.numrem === numrem);
      if (fresh) setBorrador(JSON.parse(JSON.stringify(fresh)));
    }
  };

  const cerrar = () => {
    const r = fin.cerrarRemesa(numrem, ini);
    if (r.ok) {
      hacer(r, `Remesa cerrada. Asiento ${r.doc} generado.`, { pantalla: 'asientos', clave: r.doc });
      setConfirmarCierre(false);
    } else {
      hacer(r);
    }
  };

  const asiento = registro.asiento ? db.asientos.find((a) => a.numero === registro.asiento) : null;

  return (
    <Ficha
      titulo={`Remesa ${registro.numrem}`}
      estado={registro.estrem === 'A' ? 'Abierto' : 'Cerrado'}
      lista="Remesas de cobros y pagos"
      acciones={acciones}
      onVolver={() => ir('remesas', null)}
      menu={catalogoEnlaces}
    >
      {nueva && <DialogoNuevaRemesa onCerrar={() => setNueva(false)} />}
      {confirmarCierre && (
        <Dialogo
          titulo="Evolucionar estado"
          onCerrar={() => setConfirmarCierre(false)}
          acciones={[
            { label: 'Evolucionar estado', onClick: cerrar },
          ]}
        >
          <p>Se cerrará la remesa, los efectos pasarán a Pagado (o Cobrado) y se generará el asiento contra la cuenta {cuentaBanco(registro.ctafin)}.</p>
        </Dialogo>
      )}

      <Pestanas
        tabs={[
          { id: 'informacion', label: 'Información' },
          { id: 'gestion', label: 'Gestión remesas' },
          { id: 'apuntes', label: 'Apuntes' },
          { id: 'tesoreria', label: 'Tesorería' },
        ]}
        actual={pestana}
        onCambio={setPestana}
      />

      {pestana === 'informacion' ? (
        <>
          <Seccion
            tabs={[
              {
                label: 'Información general',
                contenido: (
                  <Rejilla cols={3}>
                    <CampoLectura label="Empresa" valor="0" req />
                    <CampoFecha
                      label="Fecha remesa"
                      value={borrador.fecrem}
                      onChange={(v) => setBorrador({ ...borrador, fecrem: v })}
                      disabled={!esEditable}
                      req
                    />
                    <CampoSel
                      label="Cuenta financiera"
                      value={borrador.ctafin}
                      onChange={(v) => setBorrador({ ...borrador, ctafin: v })}
                      opciones={CUENTAS_FIN.map((c) => ({ v: c.ctafin, t: `${c.ctafin} · ${c.nombre}` }))}
                      disabled={!esEditable}
                      req
                    />
                    <CampoFecha
                      label="Fecha valor"
                      value={borrador.fecval}
                      onChange={(v) => setBorrador({ ...borrador, fecval: v })}
                      disabled={!esEditable}
                      req
                    />
                    <CampoLectura label="Moneda" valor="EUR" req />
                    <CampoLectura label="Cambio" valor="1" num req />
                  </Rejilla>
                ),
              },
              {
                label: 'Información remesa',
                contenido: (
                  <Rejilla cols={3}>
                    <CampoLectura label="Clase" valor={registro.clase === 'P' ? 'Pagar' : 'Cobrar'} req />
                    <CampoLectura label="Estado" valor={<Estado valor={registro.estrem === 'A' ? 'Abierto' : 'Cerrado'} />} req />
                    <CampoSel
                      label="Tipo remesa"
                      value={borrador.tipdoc}
                      onChange={(v) => setBorrador({ ...borrador, tipdoc: v })}
                      opciones={tiposRemesa(registro.clase)}
                      disabled={!esEditable}
                      req
                    />
                    <CampoLectura label="Justificante" valor="RM" req />
                  </Rejilla>
                ),
              },
            ]}
          />
          <Seccion titulo="Importes">
            <Rejilla cols={3}>
              <CampoLectura label="Total remesa" valor={eur(importeRemesa(db, registro))} num req />
              <CampoLectura label="Nº de efectos" valor={registro.efectos.length} req />
            </Rejilla>
          </Seccion>
        </>
      ) : pestana === 'gestion' ? (
        <>
          <Seccion titulo={`Efectos incluidos (${efectos.length})`}>
            <div className="erp-tabla-scroll">
              <table className="erp-grid">
                <thead>
                  <tr>
                    <th>Id. efecto</th>
                    <th>Tercero</th>
                    <th>Documento</th>
                    <th>Vencimiento</th>
                    <th className="num">Importe</th>
                    <th>Estado</th>
                    {esEditable && <th style={{ width: '2.5em' }} aria-label="Quitar" />}
                  </tr>
                </thead>
                <tbody>
                  {efectos.map((e) => (
                    <tr key={e.numero}>
                      <td>
                        <Enlace pantalla="efectos" clave={String(e.numero)}>{e.numero}</Enlace>
                      </td>
                      <td>{e.tercero}</td>
                      <td>{e.docser}</td>
                      <td>{fechaEs(e.fecven)}</td>
                      <td className="num">{eur(e.importe)}</td>
                      <td><Estado valor={ESTADO_EFECTO[e.estado] ?? e.estado} /></td>
                      {esEditable && (
                        <td>
                          <button type="button" className="erp-ico" onClick={() => quitar(e.numero)} aria-label={`Quitar efecto ${e.numero}`} title="Quitar">
                            <Icono n="papelera" size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {!efectos.length && (
                    <tr className="vacia">
                      <td colSpan={esEditable ? 7 : 6}>Sin efectos incluidos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Seccion>
          {esEditable && (
            <Seccion titulo="Selección de efectos">
              {pendientes.length ? (
                <>
                  <div className="erp-tabla-scroll">
                    <table className="erp-grid">
                      <thead>
                        <tr>
                          <th className="chk">
                            <input
                              type="checkbox"
                              aria-label="Marcar todos"
                              checked={pendientes.length > 0 && marcados.length === pendientes.length}
                              onChange={(e) => setMarcados(e.target.checked ? pendientes.map((x) => x.numero) : [])}
                            />
                          </th>
                          <th>Id. efecto</th>
                          <th>Tercero</th>
                          <th>Documento</th>
                          <th>Vencimiento</th>
                          <th className="num">Importe</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendientes.map((e) => (
                          <tr key={e.numero}>
                            <td className="chk" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                aria-label={`Marcar efecto ${e.numero}`}
                                checked={marcados.includes(e.numero)}
                                onChange={() =>
                                  setMarcados((m) =>
                                    m.includes(e.numero) ? m.filter((x) => x !== e.numero) : [...m, e.numero],
                                  )
                                }
                              />
                            </td>
                            <td><Enlace pantalla="efectos" clave={String(e.numero)}>{e.numero}</Enlace></td>
                            <td>{e.tercero}</td>
                            <td>{e.docser}</td>
                            <td>{fechaEs(e.fecven)}</td>
                            <td className="num">{eur(e.importe)}</td>
                            <td><Estado valor={ESTADO_EFECTO[e.estado] ?? e.estado} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button type="button" className="erp-btn azul" onClick={incluir} disabled={!marcados.length}>
                    Añadir seleccionados
                  </button>
                </>
              ) : (
                <p className="erp-vacio">No hay efectos pendientes de esta clase.</p>
              )}
            </Seccion>
          )}
        </>
      ) : pestana === 'apuntes' ? (
        <>
          {asiento ? (
            <Seccion titulo={`Apuntes del asiento ${asiento.numero}`}>
              <p>
                <Enlace pantalla="asientos" clave={String(asiento.numero)}>Asiento {asiento.numero}</Enlace>
              </p>
              <div className="erp-tabla-scroll">
                <table className="erp-grid">
                  <thead>
                    <tr>
                      <th>Cuenta</th>
                      <th>Concepto</th>
                      <th className="num">Debe</th>
                      <th className="num">Haber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asiento.apuntes.map((ap) => (
                      <tr key={ap.orden}>
                        <td>{ap.cuenta}</td>
                        <td>{ap.concepto}</td>
                        <td className="num">{eur(ap.debe)}</td>
                        <td className="num">{eur(ap.haber)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Seccion>
          ) : (
            <p className="erp-vacio">La remesa no se ha contabilizado: se contabiliza al evolucionar su estado.</p>
          )}
        </>
      ) : (
        <Seccion tabs={[{ label: 'Tesorería' }]} />
      )}
    </Ficha>
  );
}

export default function Remesas() {
  const { clave } = useErp();
  if (clave === null) return <ListaRemesas />;
  return <FichaRemesa key={clave} numrem={Number(clave)} />;
}