import { useState } from 'react';
import {
  useDb,
  fin,
  getDb,
  CUENTAS_FIN,
  hoy,
  type MovBanco,
} from '../modelo';
import {
  Lista,
  Seccion,
  Ficha,
  Rejilla,
  CampoTexto,
  CampoNum,
  CampoFecha,
  CampoSel,
  CampoLectura,
  Enlace,
  Dialogo,
  eur,
  fechaEs,
  useErp,
  type Accion,
  type Col,
} from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

const CODE = 'textract';
const EXCLUIR = ['Desconciliar', 'Conciliar automático'];

const CONCEPTOS_COMUNES = [
  { v: '02', t: '02 ABONARÉS - ENTREGAS - INGRESOS' },
  { v: '03', t: '03 DOMICILIADOS, RECIBOS, LETRAS, PAGOS' },
  { v: '04', t: '04 GIROS,TRANSFERENCIAS,TRASPASOS,CHEQUES' },
  { v: '06', t: '06 REMESAS EFECTOS' },
  { v: '12', t: '12 TARJETAS' },
  { v: '99', t: '99 VARIOS' },
];

function NuevoMovimiento({ onCerrar }: { onCerrar: () => void }) {
  const { ini, ir, hacer } = useErp();
  const [ctafin, setCtafin] = useState('BBVA_CA');
  const [fecope, setFecope] = useState(hoy());
  const [fecval, setFecval] = useState(hoy());
  const [concom, setConcom] = useState('');
  const [concep, setConcep] = useState('');
  const [docume, setDocume] = useState('');
  const [importe, setImporte] = useState(0);

  const aceptar = () => {
    const r = fin.nuevoMovimiento(
      { ctafin, fecope, fecval, concom, concep, docume, importe },
      ini,
    );
    if (
      hacer(r, 'Movimiento creado', r.ok ? { pantalla: 'extractos', clave: r.doc } : undefined) &&
      r.ok
    ) {
      ir('extractos', r.doc);
    }
  };

  return (
    <Dialogo
      titulo="Nuevo movimiento"
      onCerrar={onCerrar}
      acciones={[
        {
          label: 'Aceptar',
          tipo: 'primario',
          onClick: aceptar,
          disabled: !ctafin || !fecope || !fecval || !concom || importe === 0 || !ini,
        },
      ]}
    >
      <Rejilla cols={3}>
        <CampoSel
          label="Cuenta financiera"
          value={ctafin}
          onChange={setCtafin}
          opciones={CUENTAS_FIN.map((c) => ({ v: c.ctafin, t: `${c.ctafin} · ${c.nombre}` }))}
          req
        />
        <CampoFecha label="Fecha operación" value={fecope} onChange={setFecope} req />
        <CampoFecha label="Fecha valor" value={fecval} onChange={setFecval} req />
        <CampoSel
          label="Concepto común"
          value={concom}
          onChange={setConcom}
          opciones={CONCEPTOS_COMUNES}
          vacio="— elige —"
          req
        />
        <CampoTexto label="Descripción" value={concep} onChange={setConcep} />
        <CampoTexto label="Documento" value={docume} onChange={setDocume} />
        <CampoNum
          label="Importe"
          value={importe}
          onChange={setImporte}
          decimales={2}
          req
          ayuda="Negativo = cargo"
        />
      </Rejilla>
    </Dialogo>
  );
}

function ListaExtractos() {
  const { ini, ir, hacer } = useErp();
  const db = useDb();
  const [dialogo, setDialogo] = useState(false);

  const extractos = [...db.extractos].sort((a, b) => a.orden - b.orden);

  const cols: Col<MovBanco>[] = [
    {
      titulo: 'Orden',
      valor: (m) => (
        <Enlace pantalla="extractos" clave={String(m.orden)}>
          {m.orden}
        </Enlace>
      ),
      texto: (m) => String(m.orden),
    },
    {
      titulo: 'Conciliado',
      valor: (m) => (m.conciliado ? '✓' : ''),
      texto: (m) => (m.conciliado ? '✓' : ''),
    },
    { titulo: 'Cuenta financiera', valor: (m) => m.ctafin, texto: (m) => m.ctafin },
    { titulo: 'Fecha operación', valor: (m) => fechaEs(m.fecope), texto: (m) => m.fecope },
    { titulo: 'Fecha valor', valor: (m) => fechaEs(m.fecval), texto: (m) => m.fecval },
    { titulo: 'Concepto común', valor: (m) => m.concom, texto: (m) => m.concom },
    { titulo: 'Concepto propio', valor: () => '', texto: () => '' },
    {
      titulo: 'Importe extracto',
      num: true,
      valor: (m) => (
        <span style={m.importe < 0 ? { color: '#F44336' } : undefined}>
          {eur(m.importe)}
        </span>
      ),
      texto: (m) => String(m.importe),
    },
    { titulo: 'Divisa', valor: () => 'EUR', texto: () => 'EUR' },
    { titulo: 'Documento', valor: (m) => m.docume, texto: (m) => m.docume },
    { titulo: 'Descripción', valor: (m) => m.concep, texto: (m) => m.concep },
  ];

  const menu: Accion[] = [
    {
      label: 'Conciliar automático (BBVA_CA)',
      onClick: () => {
        const r = fin.conciliarAutomatico('BBVA_CA', ini);
        hacer(r, r.ok ? `${r.doc} movimientos conciliados.` : undefined);
      },
    },
  ];

  return (
    <>
      <Lista
        titulo="EXTRACTOS BANCARIOS"
        filas={extractos}
        cols={cols}
        clave={(m) => String(m.orden)}
        onAbrir={(m) => ir('extractos', String(m.orden))}
        onNuevo={ini ? () => setDialogo(true) : undefined}
        vacio="No hay movimientos bancarios."
        marcarMios={(m) => m.autor === ini}
        menu={menu}
      />
      {dialogo && <NuevoMovimiento onCerrar={() => setDialogo(false)} />}
    </>
  );
}

function FichaExtracto({ orden }: { orden: string }) {
  const { ini, ir, hacer } = useErp();
  const db = useDb();
  const catalogoAcciones = useAccionesCatalogo(CODE, EXCLUIR);
  const catalogoMenu = useEnlacesCatalogo(CODE, EXCLUIR);
  const num = Number(orden);
  const registro = db.extractos.find((m) => m.orden === num);
  const [borrador, setBorrador] = useState<MovBanco>(() =>
    registro ? JSON.parse(JSON.stringify(registro)) : ({} as MovBanco),
  );
  const [nuevo, setNuevo] = useState(false);

  if (!registro) {
    return (
      <section className="erp-ficha">
        <p className="erp-nota">Movimiento no encontrado.</p>
        <button className="erp-btn" onClick={() => ir('extractos', null)}>
          Volver
        </button>
      </section>
    );
  }

  const esEditable = !registro.conciliado && registro.autor !== 'TUTORIAL';

  const syncBorrador = () => {
    const fresh = getDb();
    const nuevo = fresh.extractos.find((m) => m.orden === registro.orden);
    if (nuevo) setBorrador(JSON.parse(JSON.stringify(nuevo)));
  };

  const acciones: Accion[] = [];

  if (esEditable) {
    acciones.push({
      label: 'Guardar',
      lugar: 'guardar',
      tipo: 'primario',
      onClick: () => {
        if (hacer(fin.guardarMovimiento(borrador, ini), 'Movimiento guardado')) {
          syncBorrador();
        }
      },
    });
    acciones.push({
      label: 'Borrar',
      lugar: 'borrar',
      tipo: 'peligro',
      onClick: () => {
        if (window.confirm('¿Borrar el movimiento?')) {
          const r = fin.borrarMovimiento(registro.orden, ini);
          if (hacer(r, 'Movimiento borrado') && r.ok) {
            ir('extractos', null);
          }
        }
      },
    });
  }

  if (registro.conciliado) {
    acciones.push({
      label: 'Desconciliar',
      title: 'Desconciliar',
      onClick: () => {
        const r = fin.desconciliar(registro.orden, ini);
        if (hacer(r, 'Movimiento desconciliado')) {
          syncBorrador();
        }
      },
    });
  }

  acciones.push({
    label: 'Conciliar automático',
    onClick: () => {
      const r = fin.conciliarAutomatico(registro.ctafin, ini);
      if (hacer(r, r.ok ? `${r.doc} movimientos conciliados.` : undefined)) {
        syncBorrador();
      }
    },
  });

  acciones.push({ label: 'Nuevo', onClick: () => setNuevo(true) });

  acciones.push(...catalogoAcciones);

  const menu: Accion[] = [
    ...catalogoMenu,
    {
      label: 'Conciliación bancaria',
      lugar: 'menu',
      onClick: () => ir('conciliacion'),
    },
  ];

  return (
    <Ficha
      titulo={String(registro.orden)}
      lista="EXTRACTOS BANCARIOS"
      acciones={acciones}
      onVolver={() => ir('extractos', null)}
      menu={menu}
    >
      {nuevo && <NuevoMovimiento onCerrar={() => setNuevo(false)} />}
      <Seccion titulo="Identificación">
        <Rejilla cols={3}>
          <CampoLectura label="Orden" valor={registro.orden} />
          <CampoLectura label="Conciliado" valor={registro.conciliado ? '✓' : ''} />
          <CampoLectura label="Fichero" valor="—" />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Unidad de negocio">
        <Rejilla cols={3}>
          <CampoLectura label="Empresa" valor="0" />
          <CampoSel
            label="Cuenta financiera"
            value={borrador.ctafin}
            onChange={(v) => setBorrador({ ...borrador, ctafin: v })}
            opciones={CUENTAS_FIN.map((c) => ({ v: c.ctafin, t: `${c.ctafin} · ${c.nombre}` }))}
            disabled={!esEditable}
          />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Referencias">
        <Rejilla cols={3}>
          <CampoTexto
            label="Documento"
            value={borrador.docume}
            onChange={(v) => setBorrador({ ...borrador, docume: v })}
            disabled={!esEditable}
          />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Fechas">
        <Rejilla cols={3}>
          <CampoFecha
            label="Fecha operación"
            value={borrador.fecope}
            onChange={(v) => setBorrador({ ...borrador, fecope: v })}
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
        </Rejilla>
      </Seccion>

      <Seccion titulo="Información operación">
        <Rejilla cols={3}>
          <CampoSel
            label="Concepto común"
            value={borrador.concom}
            onChange={(v) => setBorrador({ ...borrador, concom: v })}
            opciones={CONCEPTOS_COMUNES}
            vacio="— elige —"
            disabled={!esEditable}
            req
          />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Importes">
        <Rejilla cols={3}>
          <CampoNum
            label="Importe extracto"
            value={borrador.importe}
            onChange={(v) => setBorrador({ ...borrador, importe: v })}
            decimales={2}
            disabled={!esEditable}
            req
          />
          <CampoLectura label="Divisa" valor="EUR" />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Notas">
        <Rejilla cols={3}>
          <CampoTexto
            label="Descripción"
            value={borrador.concep}
            onChange={(v) => setBorrador({ ...borrador, concep: v })}
            disabled={!esEditable}
          />
        </Rejilla>
      </Seccion>

      <Seccion titulo="Conciliaciones">
        {registro.conciliado ? (
          <p>
            <Enlace pantalla="asientos" clave={String(registro.conciliado.asiento)}>
              Asiento {registro.conciliado.asiento}
            </Enlace>{' '}
            · apunte {registro.conciliado.orden}
          </p>
        ) : (
          <p>Pendiente de conciliar</p>
        )}
      </Seccion>
    </Ficha>
  );
}

export default function Extractos() {
  const { clave } = useErp();
  if (clave === null) return <ListaExtractos />;
  return <FichaExtracto key={clave} orden={clave} />;
}