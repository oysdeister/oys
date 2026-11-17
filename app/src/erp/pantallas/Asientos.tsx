import { useState } from 'react';
import {
  useDb,
  getDb,
  fin,
  sumaDebe,
  sumaHaber,
  cuadra,
  r2,
  PLAN,
  type Asiento,
  type Apunte,
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
  Seccion,
  Enlace,
  Estado,
  eur,
  fechaEs,
  leeNum,
  useErp,
  type Accion,
  type Col,
} from '../ui';
import {
  useAccionesCatalogo,
  useEnlacesCatalogo,
} from '../catalogo/extra';

function NumApunteInput({
  valor,
  onCambio,
  etiqueta,
}: {
  valor: number;
  onCambio: (n: number) => void;
  etiqueta: string;
}) {
  const [txt, setTxt] = useState<string | null>(null);
  return (
    <input
      className="erp-input mini num"
      inputMode="decimal"
      aria-label={etiqueta}
      value={txt ?? String(valor).replace('.', ',')}
      onFocus={(e) => {
        setTxt(String(valor).replace('.', ','));
        e.target.select();
      }}
      onChange={(e) => setTxt(e.target.value)}
      onBlur={() => {
        if (txt !== null) {
          const n = leeNum(txt);
          onCambio(Number.isFinite(n) ? n : 0);
        }
        setTxt(null);
      }}
    />
  );
}

function ListaAsientos() {
  const { ini, ir, hacer } = useErp();
  const db = useDb();

  const asientos = [...db.asientos].sort((a, b) => b.numero - a.numero);

  const origen = (a: Asiento) => (a.origen === 'MAN' ? 'Manual' : a.origen === 'FCOA' ? 'gcomfach' : 'cremesas');
  const estado = (a: Asiento) => (a.estado === 'P' ? 'Provisional' : 'Contabilizado');
  const cols: Col<Asiento>[] = [
    { titulo: 'Empresa', valor: () => '0', texto: () => '0' },
    { titulo: 'Fecha', valor: (a) => fechaEs(a.fecha), texto: (a) => a.fecha },
    {
      titulo: 'Asiento',
      valor: (a) => (
        <Enlace pantalla="asientos" clave={String(a.numero)}>
          {a.numero}
        </Enlace>
      ),
      texto: (a) => String(a.numero),
    },
    { titulo: 'Justificante', valor: (a) => a.jusser, texto: (a) => a.jusser },
    { titulo: 'Documento', valor: (a) => a.docser, texto: (a) => a.docser },
    { titulo: 'Sistema', valor: () => 'A', texto: () => 'A' },
    { titulo: 'Diario', valor: (a) => a.diario, texto: (a) => a.diario },
    { titulo: 'Moneda', valor: () => 'EUR', texto: () => 'EUR' },
    { titulo: 'Ejercicio', valor: (a) => a.fecha.slice(0, 4), texto: (a) => a.fecha.slice(0, 4) },
    { titulo: 'Período', valor: (a) => a.fecha.slice(5, 7), texto: (a) => a.fecha.slice(5, 7) },
    { titulo: 'Debe', num: true, valor: (a) => eur(sumaDebe(a)), texto: (a) => String(sumaDebe(a)) },
    { titulo: 'Haber', num: true, valor: (a) => eur(sumaHaber(a)), texto: (a) => String(sumaHaber(a)) },
    {
      titulo: 'Cuadre',
      num: true,
      valor: (a) => {
        const d = r2(sumaDebe(a) - sumaHaber(a));
        return <span style={d ? { color: '#F44336' } : undefined}>{eur(d)}</span>;
      },
      texto: (a) => String(r2(sumaDebe(a) - sumaHaber(a))),
    },
    { titulo: 'Líneas', num: true, valor: (a) => a.apuntes.length, texto: (a) => String(a.apuntes.length) },
    { titulo: 'Estado', valor: (a) => <Estado valor={estado(a)} />, texto: estado },
    { titulo: 'Origen', valor: origen, texto: origen },
  ];

  const nuevo = () => {
    const r = fin.nuevoAsiento(ini);
    if (hacer(r, 'Asiento creado') && r.ok) {
      ir('asientos', r.doc);
    }
  };

  return (
    <Lista
      titulo="Asientos contables"
      filas={asientos}
      cols={cols}
      clave={(a) => String(a.numero)}
      onAbrir={(a) => ir('asientos', String(a.numero))}
      onNuevo={nuevo}
      vacio="No hay asientos contables."
      marcarMios={(r) => r.autor === ini}
    />
  );
}

function FichaAsiento({ numero }: { numero: string }) {
  const { ini, ir, hacer, aviso } = useErp();
  const db = useDb();

  const registro = db.asientos.find((a) => a.numero === Number(numero));
  const [borrador, setBorrador] = useState<Asiento>(() =>
    registro ? JSON.parse(JSON.stringify(registro)) : ({} as Asiento),
  );
  const [pestana, setPestana] = useState('Asiento');
  // hooks del catálogo antes de cualquier return
  const accionesCatalogo = useAccionesCatalogo('casientos', [
    'Recalcular cuadre',
    'Reordenar líneas',
    'Abrir a provisional',
    'Finalizar',
    'Copiar asiento',
  ]);
  const enlacesCatalogo = useEnlacesCatalogo('casientos');

  if (!registro) {
    return (
      <section className="erp-ficha">
        <p className="erp-nota">Asiento no encontrado.</p>
        <button className="erp-btn" onClick={() => ir('asientos', null)}>
          Volver
        </button>
      </section>
    );
  }

  const syncBorrador = () => {
    const fresh = getDb();
    const nuevo = fresh.asientos.find((x) => x.numero === registro.numero);
    if (nuevo) setBorrador(JSON.parse(JSON.stringify(nuevo)));
  };

  const editable = registro.estado === 'P' && registro.origen === 'MAN';
  // en lectura se pinta siempre la base (p. ej. una conciliación hecha en otra pantalla)
  const vista = editable ? borrador : registro;
  const cambios = editable && JSON.stringify(borrador) !== JSON.stringify(registro);

  const totalDebe = sumaDebe(vista);
  const totalHaber = sumaHaber(vista);
  const diferencia = r2(totalDebe - totalHaber);

  const actualizarApunte = (orden: number, cambio: Partial<Apunte>) => {
    setBorrador({
      ...borrador,
      apuntes: borrador.apuntes.map((p) =>
        p.orden === orden ? { ...p, ...cambio } : p,
      ),
    });
  };

  const quitarApunte = (orden: number) => {
    setBorrador({
      ...borrador,
      apuntes: borrador.apuntes
        .filter((p) => p.orden !== orden)
        .map((p, i) => ({ ...p, orden: i + 1 })),
    });
  };

  const anadirApunte = () => {
    const ultimo = borrador.apuntes[borrador.apuntes.length - 1];
    setBorrador({
      ...borrador,
      apuntes: [
        ...borrador.apuntes,
        {
          orden: borrador.apuntes.length + 1,
          cuenta: '',
          concepto: ultimo?.concepto ?? '',
          debe: 0,
          haber: 0,
        },
      ],
    });
  };

  const renderApuntes = (editableTabla: boolean) => (
    <div className="erp-tabla-scroll">
      <table className="erp-grid">
        <thead>
          <tr>
            <th>Orden</th>
            <th>Cuenta</th>
            <th>Descripción cuenta</th>
            <th>Descripción</th>
            <th className="num">Debe</th>
            <th className="num">Haber</th>
            <th>Conciliado</th>
            {editableTabla && (
              <th style={{ width: '2.5em' }} aria-label="Quitar" />
            )}
          </tr>
        </thead>
        <tbody>
          {vista.apuntes.map((p) => {
            const descCuenta =
              PLAN.find((x) => x.cuenta === p.cuenta)?.nombre ?? '';
            return (
              <tr key={p.orden}>
                <td className="n">
                  <span className="erp-lnk">{p.orden}</span>
                </td>
                <td>
                  {editableTabla ? (
                    <input
                      className="erp-input mini mono"
                      value={p.cuenta}
                      onChange={(e) =>
                        actualizarApunte(p.orden, {
                          cuenta: e.target.value.toUpperCase(),
                        })
                      }
                      aria-label={`Cuenta de la línea ${p.orden}`}
                    />
                  ) : (
                    <span className="erp-lnk">{p.cuenta}</span>
                  )}
                </td>
                <td>{descCuenta}</td>
                <td>
                  {editableTabla ? (
                    <input
                      className="erp-input mini"
                      value={p.concepto}
                      onChange={(e) =>
                        actualizarApunte(p.orden, {
                          concepto: e.target.value,
                        })
                      }
                      aria-label={`Concepto de la línea ${p.orden}`}
                    />
                  ) : (
                    p.concepto
                  )}
                </td>
                <td className="num">
                  {editableTabla ? (
                    <NumApunteInput
                      valor={p.debe}
                      onCambio={(v) => actualizarApunte(p.orden, { debe: v })}
                      etiqueta={`Debe de la línea ${p.orden}`}
                    />
                  ) : (
                    <span className="num">{eur(p.debe)}</span>
                  )}
                </td>
                <td className="num">
                  {editableTabla ? (
                    <NumApunteInput
                      valor={p.haber}
                      onCambio={(v) => actualizarApunte(p.orden, { haber: v })}
                      etiqueta={`Haber de la línea ${p.orden}`}
                    />
                  ) : (
                    <span className="num">{eur(p.haber)}</span>
                  )}
                </td>
                <td>{p.conciliado ? '✓' : ''}</td>
                {editableTabla && (
                  <td>
                    <button
                      type="button"
                      className="erp-ico"
                      onClick={() => quitarApunte(p.orden)}
                      aria-label={`Quitar la línea ${p.orden}`}
                      title="Borrar apunte"
                    >
                      ✕
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
          {!vista.apuntes.length && (
            <tr className="vacia">
              <td colSpan={editableTabla ? 8 : 7}>Sin apuntes.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={editableTabla ? 8 : 7} style={{ textAlign: 'right' }}>
              {editableTabla && (
                <button
                  type="button"
                  className="erp-btn neutro"
                  onClick={anadirApunte}
                >
                  Añadir apunte
                </button>
              )}
              <span style={{ marginLeft: '1em' }}>
                Total Debe: {eur(totalDebe)} · Total Haber: {eur(totalHaber)}
              </span>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const accionesManuales: Accion[] = [];

  if (editable) {
    accionesManuales.push({
      label: 'Guardar',
      onClick: () => {
        if (hacer(fin.guardarAsiento(borrador, ini), 'Asiento guardado')) {
          syncBorrador();
        }
      },
    });
    accionesManuales.push({
      label: 'Borrar',
      onClick: () => {
        if (window.confirm('¿Borrar el asiento?')) {
          const r = fin.borrarAsiento(registro.numero, ini);
          if (hacer(r, 'Asiento borrado') && r.ok) {
            ir('asientos', null);
          }
        }
      },
    });
  }

  if (editable) {
    accionesManuales.push({
      label: 'Finalizar',
      tipo: 'proceso',
      title: 'Finalizar',
      onClick: () => {
        if (cambios) {
          const r = fin.guardarAsiento(borrador, ini);
          if (!r.ok) {
            hacer(r, 'Error al guardar');
            return;
          }
        }
        const r2 = fin.finalizarAsiento(registro.numero, ini);
        if (hacer(r2, 'Asiento contabilizado')) {
          syncBorrador();
        }
      },
    });
  }

  if (registro.estado === 'C' && registro.origen === 'MAN') {
    accionesManuales.push({
      label: 'Abrir a provisional',
      title: 'Abrir a provisional',
      onClick: () => {
        if (
          hacer(fin.abrirAsiento(registro.numero, ini), 'Asiento abierto a provisional')
        ) {
          syncBorrador();
        }
      },
    });
  }

  accionesManuales.push({
    label: 'Recalcular cuadre',
    onClick: () => {
      aviso(
        cuadra(vista) ? 'ok' : 'info',
        cuadra(vista)
          ? `El asiento cuadra: Debe ${eur(totalDebe)} · Haber ${eur(totalHaber)}.`
          : `Asiento descuadrado: Debe ${eur(totalDebe)} · Haber ${eur(totalHaber)} · diferencia ${eur(diferencia)}.`,
      );
    },
  });

  accionesManuales.push({
    label: 'Copiar asiento',
    lugar: 'boton',
    title: 'Copiar asiento',
    onClick: () => {
      const r = fin.copiarAsiento(registro.numero, ini);
      if (
        hacer(r, 'Asiento copiado', r.ok
          ? { pantalla: 'asientos', clave: r.doc }
          : undefined) &&
        r.ok
      ) {
        ir('asientos', r.doc);
      }
    },
  });

  if (editable) {
    accionesManuales.push({
      label: 'Reordenar líneas',
      onClick: () => {
        setBorrador({
          ...borrador,
          // primero los apuntes al debe y después los del haber, numerados de nuevo
          apuntes: [...borrador.apuntes]
            .sort((a, b) => Number((b.debe || 0) > 0) - Number((a.debe || 0) > 0) || a.orden - b.orden)
            .map((p, i) => ({ ...p, orden: i + 1 })),
        });
        aviso('ok', 'Líneas reordenadas: debe primero y haber después. Guarda para conservar el orden.');
      },
    });
  }

  accionesManuales.push({
    label: 'Nuevo',
    onClick: () => {
      const r = fin.nuevoAsiento(ini);
      if (
        hacer(r, 'Asiento creado', r.ok
          ? { pantalla: 'asientos', clave: r.doc }
          : undefined) &&
        r.ok
      ) {
        ir('asientos', r.doc);
      }
    },
  });

  const acciones = [...accionesManuales, ...accionesCatalogo];

  const menu: Accion[] = [...enlacesCatalogo];

  if (registro.origen === 'FCOA') {
    menu.push({
      label: 'Documento origen',
      lugar: 'menu',
      onClick: () => ir('facturas', registro.docser),
    });
  } else if (registro.origen === 'REM') {
    const n = parseInt(registro.docser.replace('REM ', ''), 10);
    menu.push({
      label: 'Documento origen',
      lugar: 'menu',
      onClick: () => ir('remesas', String(n)),
    });
  }

  // orden real de las pestañas de casientos en la demo
  const tabs = ['Asiento', 'Líneas de apuntes', 'Impuestos', 'Carteras', 'Costes', 'Tesorería', 'Saldos', 'Periodificaciones'].map((t) => ({
    id: t,
    label: t,
    n: t === 'Líneas de apuntes' ? vista.apuntes.length : undefined,
  }));

  return (
    <Ficha
      titulo={`Asiento ${registro.numero}`}
      lista="Asientos contables"
      estado={registro.estado === 'P' ? 'Provisional' : 'Contabilizado'}
      acciones={acciones}
      onVolver={() => ir('asientos', null)}
      menu={menu}
    >
      {cambios && <p className="erp-nota">Hay cambios sin guardar.</p>}

      <Pestanas tabs={tabs} actual={pestana} onCambio={setPestana} />

      {pestana === 'Asiento' ? (
        <>
          <Seccion titulo="Identificación">
            <Rejilla cols={4}>
              <CampoLectura label="Empresa" valor="0" />
              <CampoLectura label="Asiento" valor={String(registro.numero)} />
              <CampoSel
                label="Diario"
                value={vista.diario}
                onChange={(v) => setBorrador({ ...borrador, diario: v })}
                opciones={[
                  { v: 'GEN', t: 'GEN · General' },
                  { v: 'COM', t: 'COM · Compras' },
                  { v: 'TES', t: 'TES · Tesorería' },
                  { v: 'VEN', t: 'VEN · Ventas' },
                ]}
                disabled={!editable}
              />
              <CampoLectura label="Sistema" valor="A" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Fechas">
            <Rejilla cols={3}>
              <CampoFecha
                label="Fecha"
                value={vista.fecha}
                onChange={(v) => setBorrador({ ...borrador, fecha: v })}
                disabled={!editable}
              />
              <CampoLectura
                label="Ejercicio"
                valor={vista.fecha ? vista.fecha.slice(0, 4) : ''}
              />
              <CampoLectura
                label="Período"
                valor={vista.fecha ? vista.fecha.slice(5, 7) : ''}
              />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Referencias">
            <Rejilla cols={2}>
              <CampoTexto
                label="Justificante"
                value={vista.jusser}
                onChange={(v) => setBorrador({ ...borrador, jusser: v })}
                disabled={!editable}
              />
              <CampoTexto
                label="Documento"
                value={vista.docser}
                onChange={(v) => setBorrador({ ...borrador, docser: v })}
                disabled={!editable}
              />
            </Rejilla>
          </Seccion>

          {registro.estado === 'C' && <div className="erp-banda-fin">FINALIZADO</div>}

          <Seccion titulo="Cuadre">
            <Rejilla cols={3}>
              <CampoLectura label="Debe" valor={eur(totalDebe)} num />
              <CampoLectura label="Haber" valor={eur(totalHaber)} num />
              <CampoLectura
                label="Diferencia"
                valor={
                  <span
                    style={{ color: diferencia !== 0 ? '#F44336' : undefined }}
                  >
                    {eur(diferencia)}
                  </span>
                }
                num
              />
            </Rejilla>
          </Seccion>

          <Seccion titulo={`Resumen de apuntes (${vista.apuntes.length})`}>{renderApuntes(editable)}</Seccion>
        </>
      ) : pestana === 'Líneas de apuntes' ? (
        renderApuntes(false)
      ) : (
        <Seccion tabs={[{ label: pestana }]} />
      )}
    </Ficha>
  );
}

export default function Asientos() {
  const { clave } = useErp();
  if (clave === null) return <ListaAsientos />;
  return <FichaAsiento key={clave} numero={clave} />;
}
