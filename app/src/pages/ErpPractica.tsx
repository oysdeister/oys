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
    <div className="wrap erp-pagina cs-pag">
      <header className="g-hero cs-hero erp-hero">
        <p className="g-kicker">Practicar y demostrar</p>
        <h1>ERP de práctica</h1>
        <p className="cs-lead">
          Un ERP simulado dentro de esta web, con el menú completo de Axional VNext. Aquí grabas de verdad: tu proveedor y tu artículo, el circuito pedido › albarán › factura, el asiento, el pago por remesa y la conciliación bancaria. La plataforma lo corrige y te pone nota al momento.
        </p>
        <p className="cs-datos">
          <span>
            <b>{PRACTICAS.length}</b> prácticas
          </span>
          <span>
            <b>{hechas}</b> superadas
          </span>
          <span>Datos guardados en este navegador</span>
        </p>
      </header>
      <Practicar ids={orden} ini={p.alumno.ini} />
    </div>
  );
}
