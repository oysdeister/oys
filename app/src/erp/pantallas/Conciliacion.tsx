import { useMemo, useState } from 'react';
import { Seccion, CampoSel, CampoCheck, CampoLectura, Rejilla, Enlace, eur, fechaEs, useErp } from '../ui';
import { useDb, fin, apuntesBanco, importeBanco, CUENTAS_FIN, r2 } from '../modelo';

const opcionesCta = CUENTAS_FIN.map((c) => ({ v: c.ctafin, t: `${c.ctafin} · ${c.nombre}` }));

export default function Conciliacion() {
  const db = useDb();
  const { ini, hacer } = useErp();

  const [ctafin, setCtafin] = useState('BBVA_CA');
  const [mostrar, setMostrar] = useState(false);
  const [ordenSel, setOrdenSel] = useState<number | null>(null);
  const [apunteSel, setApunteSel] = useState<{ asiento: number; orden: number } | null>(null);

  const extractos = useMemo(() => db.extractos.filter((m) => m.ctafin === ctafin), [db, ctafin]);
  const apuntes = useMemo(() => apuntesBanco(db, ctafin), [db, ctafin]);

  const visExtractos = extractos.filter((m) => mostrar || !m.conciliado);
  const visApuntes = apuntes.filter(({ apunte }) => mostrar || !apunte.conciliado);

  const totalExtracto = r2(extractos.reduce((s, m) => s + m.importe, 0));
  const totalContable = r2(apuntes.reduce((s, { apunte }) => s + importeBanco(apunte), 0));

  const pendExtracto = extractos.filter((m) => !m.conciliado);
  const pendApuntes = apuntes.filter(({ apunte }) => !apunte.conciliado);
  const totalPendExtracto = r2(pendExtracto.reduce((s, m) => s + m.importe, 0));
  const totalPendApuntes = r2(pendApuntes.reduce((s, { apunte }) => s + importeBanco(apunte), 0));

  const selExtracto = extractos.find((m) => m.orden === ordenSel) ?? null;
  const selApunte = apuntes.find(({ asiento, apunte }) => asiento.numero === apunteSel?.asiento && apunte.orden === apunteSel?.orden) ?? null;

  const importeSelExtracto = selExtracto?.importe ?? null;
  const importeSelApunte = selApunte ? importeBanco(selApunte.apunte) : null;
  const diferencia = r2((importeSelExtracto ?? 0) - (importeSelApunte ?? 0));

  const hayAmbos = selExtracto !== null && selApunte !== null;
  // se desconcilia el movimiento elegido o, si solo hay apunte, el movimiento con el que está conciliado
  const ordenDesconciliar = selExtracto?.conciliado ? selExtracto.orden : (selApunte?.apunte.conciliado ?? null);

  const onConciliar = () => {
    if (!selExtracto || !selApunte) return;
    const r = fin.conciliar(selExtracto.orden, selApunte.asiento.numero, selApunte.apunte.orden, ini);
    if (hacer(r, 'Conciliación realizada')) {
      setOrdenSel(null);
      setApunteSel(null);
    }
  };

  const onAutomatico = () => {
    const r = fin.conciliarAutomatico(ctafin, ini);
    if (r.ok) {
      hacer(r, `${r.doc} movimientos conciliados.`);
      setOrdenSel(null);
      setApunteSel(null);
    } else {
      hacer(r);
    }
  };

  const onDesconciliar = () => {
    if (ordenDesconciliar === null) return;
    const r = fin.desconciliar(ordenDesconciliar, ini);
    if (hacer(r, 'Movimiento desconciliado')) {
      setOrdenSel(null);
      setApunteSel(null);
    }
  };

  return (
    <section className="erp-ficha">
      <header className="erp-cab">
        <div className="erp-cab-tit">
          <h2>CONCILIACIÓN BANCARIA</h2>
        </div>
      </header>

      <div className="erp-ficha-cuerpo">
        <Seccion titulo="Criterios de búsqueda">
          <Rejilla cols={3}>
            <CampoSel
              label="Cuenta financiera"
              value={ctafin}
              onChange={(v) => {
                setCtafin(v);
                setOrdenSel(null);
                setApunteSel(null);
              }}
              opciones={opcionesCta}
            />
            <CampoCheck label="Mostrar conciliados" value={mostrar} onChange={setMostrar} />
          </Rejilla>
        </Seccion>

        <div className="erp-cajas">
          <div className="erp-caja" style={{ gridColumn: 'span 6' }}>
            <Seccion titulo="Extracto bancario">
              <div className="erp-tabla-scroll">
                <table className="erp-tabla erp-concil">
                  <thead>
                    <tr>
                      <th style={{ width: '2em' }} />
                      <th>Orden</th>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th className="num">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visExtractos.map((m) => {
                      const sel = m.orden === ordenSel;
                      return (
                        <tr
                          key={m.orden}
                          className={m.conciliado ? 'conciliado' : undefined}
                          style={m.conciliado ? { opacity: 0.55 } : undefined}
                          onClick={() => setOrdenSel(m.orden)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input type="radio" name="extracto" checked={sel} onChange={() => setOrdenSel(m.orden)} />
                          </td>
                          <td>{m.orden}</td>
                          <td>{fechaEs(m.fecope)}</td>
                          <td className="desc" title={m.concep}>
                            {m.concep}
                            {m.conciliado ? ` ✓ Asiento ${m.conciliado.asiento}` : ''}
                          </td>
                          <td className="num" style={m.importe < 0 ? { color: '#F44336' } : undefined}>
                            {eur(m.importe)}
                          </td>
                        </tr>
                      );
                    })}
                    {!visExtractos.length && (
                      <tr className="vacia">
                        <td colSpan={5}>Sin movimientos.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Seccion>
          </div>

          <div className="erp-caja" style={{ gridColumn: 'span 6' }}>
            <Seccion titulo="Apuntes contables">
              <div className="erp-tabla-scroll">
                <table className="erp-tabla erp-concil">
                  <thead>
                    <tr>
                      <th style={{ width: '2em' }} />
                      <th>Asiento</th>
                      <th>Fecha</th>
                      <th>Concepto</th>
                      <th className="num">Importe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visApuntes.map(({ asiento: a, apunte: p }) => {
                      const sel = apunteSel?.asiento === a.numero && apunteSel?.orden === p.orden;
                      return (
                        <tr
                          key={`${a.numero}-${p.orden}`}
                          className={p.conciliado ? 'conciliado' : undefined}
                          style={p.conciliado ? { opacity: 0.55 } : undefined}
                          onClick={() => setApunteSel({ asiento: a.numero, orden: p.orden })}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="apunte"
                              checked={sel}
                              onChange={() => setApunteSel({ asiento: a.numero, orden: p.orden })}
                            />
                          </td>
                          <td>
                            <Enlace pantalla="asientos" clave={String(a.numero)}>
                              {a.numero}
                            </Enlace>
                          </td>
                          <td>{fechaEs(a.fecha)}</td>
                          <td className="desc" title={p.concepto}>
                            {p.concepto}
                            {p.conciliado ? ` ✓ Extracto ${p.conciliado}` : ''}
                          </td>
                          <td className="num">{eur(importeBanco(p))}</td>
                        </tr>
                      );
                    })}
                    {!visApuntes.length && (
                      <tr className="vacia">
                        <td colSpan={5}>Sin apuntes contables.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Seccion>
          </div>
        </div>

        <div className="erp-pie erp-pie-concil">
          <span>
            Seleccionado: extracto {importeSelExtracto != null ? `${eur(importeSelExtracto)} €` : '—'} · contabilidad{' '}
            {importeSelApunte != null ? `${eur(importeSelApunte)} €` : '—'} · diferencia {eur(diferencia)} €
          </span>
          <button type="button" className="erp-btn azul" disabled={!hayAmbos} onClick={onConciliar}>
            Conciliar
          </button>
          <button type="button" className="erp-btn" onClick={onAutomatico}>
            Conciliar automático
          </button>
          <button type="button" className="erp-btn" disabled={ordenDesconciliar === null} onClick={onDesconciliar}>
            Desconciliar
          </button>
        </div>

        <Seccion titulo="Resumen">
          <Rejilla cols={4}>
            <CampoLectura label="Saldo extracto" valor={eur(totalExtracto)} num />
            <CampoLectura label="Saldo contable banco" valor={eur(totalContable)} num />
            <CampoLectura label="Pendiente extracto" valor={`${pendExtracto.length} · ${eur(totalPendExtracto)}`} />
            <CampoLectura label="Pendiente contabilidad" valor={`${pendApuntes.length} · ${eur(totalPendApuntes)}`} />
          </Rejilla>
        </Seccion>
      </div>
    </section>
  );
}