import { useSearchParams } from 'react-router-dom';
import { useProgreso } from '../lib/progress';
import { Practicar } from '../erp/Practicar';
import { PRACTICAS, useNotas } from '../erp/practicas';

export default function ErpPractica() {
  const p = useProgreso();
  const notas = useNotas();
  const [sp] = useSearchParams();
  const pedida = sp.get('p');
  const ids = PRACTICAS.map((x) => x.id);
  const orden = pedida && ids.includes(pedida) ? [pedida, ...ids.filter((x) => x !== pedida)] : ids;
  const hechas = PRACTICAS.filter((x) => (notas[x.id]?.nota ?? 0) >= 1).length;
  return (
    <div className="wrap erp-pagina">
      <header className="ax-banner erp-hero">
        <div className="ax-banner-in">
          <div className="ax-banner-text">
            <p className="ax-kicker">Practicar y demostrar</p>
            <h1>Transacciona en el ERP</h1>
            <p className="lead">
              Una réplica del circuito de compras de Axional donde grabas de verdad: tu proveedor, tu artículo, pedidos, albaranes y facturas. La plataforma revisa lo que has hecho y te pone nota al momento.
            </p>
            <div className="ex-chips">
              <span className="chip">{PRACTICAS.length} prácticas</span>
              <span className={`chip${hechas === PRACTICAS.length ? ' ok' : ''}`}>
                {hechas} superadas
              </span>
              <span className="chip">Datos guardados en este navegador</span>
            </div>
          </div>
        </div>
      </header>
      <Practicar ids={orden} ini={p.alumno.ini} />
    </div>
  );
}
