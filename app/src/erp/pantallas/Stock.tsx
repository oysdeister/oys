import { useDb, stock } from '../modelo';
import { Enlace, eur, fechaEs, useErp } from '../ui';

export default function Stock() {
  const db = useDb();
  const { ini } = useErp();
  const filas = stock(db).sort((a, b) => a.articulo.localeCompare(b.articulo));
  return (
    <section className="erp-lista">
      <header className="erp-barra">
        <h2>
          Stock global <span className="erp-cuenta">{filas.length}</span>
        </h2>
      </header>
      <p className="erp-nota">Cuenta logística DISP (disponible). Solo suman los albaranes validados: un albarán provisional todavía no mueve stock.</p>
      <div className="erp-tabla-scroll">
        <table className="erp-tabla">
          <thead>
            <tr>
              <th>Artículo</th>
              <th>Descripción</th>
              <th>Almacén</th>
              <th>Cuenta</th>
              <th className="num">Stock</th>
              <th>Kardex (entradas)</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((s) => {
              const a = db.articulos.find((x) => x.codigo === s.articulo);
              return (
                <tr key={`${s.articulo}|${s.almacen}`} className={a?.autor === ini ? 'mio' : undefined}>
                  <td>
                    <Enlace pantalla="articulos" clave={s.articulo}>
                      <span className="mono">{s.articulo}</span>
                    </Enlace>
                  </td>
                  <td>{a?.nombre}</td>
                  <td>{s.almacen}</td>
                  <td>DISP</td>
                  <td className="num fuerte">{eur(s.cantidad).replace(',00', '')}</td>
                  <td>
                    <div className="erp-chips">
                      {s.movimientos.map((m) => (
                        <Enlace key={m.doc} pantalla="albaranes" clave={m.doc}>
                          <span className="erp-chip">
                            {m.doc} · {fechaEs(m.fecha)} · +{m.cantidad}
                          </span>
                        </Enlace>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!filas.length && (
              <tr className="vacia">
                <td colSpan={6}>Todavía no hay stock: valida un albarán de compra.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
