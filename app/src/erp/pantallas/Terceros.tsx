import { useState } from 'react';
import { useDb, erp, CAT, type Tercero, type Direccion } from '../modelo';
import { Lista, Ficha, Pestanas, Rejilla, CampoTexto, CampoNum, CampoSel, CampoLectura, Seccion, Estado, useErp, avisoGuardarAntes, type Accion } from '../ui';
import { useAccionesCatalogo, useEnlacesCatalogo } from '../catalogo/extra';

const PAISES = [
  { v: 'ES', t: 'España' },
  { v: 'PT', t: 'Portugal' },
  { v: 'FR', t: 'Francia' },
];

const TIPOS_ID = [
  { v: 'NIF-Empresa', t: 'NIF-Empresa' },
  { v: 'No censado', t: 'No censado' },
];

const CATEGORIAS = [
  { v: '001 Clientes', t: '001 Clientes' },
  { v: '002 Proveedores', t: '002 Proveedores' },
];

const OPC_RELACIONES = CAT.relaciones.map(r => ({ v: r.codigo, t: r.t }));

function nuevoTercero(ini: string): Tercero {
  return {
    codigo: '',
    nombre: '',
    tipoId: 'NIF-Empresa',
    nif: '',
    categoria: '002 Proveedores',
    pais: 'ES',
    direcciones: [],
    relaciones: [],
    estado: 'Provisional',
    autor: ini,
  };
}

export default function Terceros() {
  const extraAcc = useAccionesCatalogo('ctercero');
  const extraMenu = useEnlacesCatalogo('ctercero');
  const { ini, clave, ir, hacer, noDisp, aviso } = useErp();
  const db = useDb();

  const guardado = clave !== null && clave !== '__nuevo'
    ? db.terceros.find(t => t.codigo === clave)
    : undefined;
  const soloLectura = guardado?.autor === 'TUTORIAL';

  const [borrador, setBorrador] = useState<Tercero>(() => {
    if (clave === '__nuevo') return nuevoTercero(ini);
    if (guardado) return { ...guardado };
    return nuevoTercero(ini);
  });

  const [tab, setTab] = useState('terceros');

  const [nuevaDir, setNuevaDir] = useState<Direccion>(() => ({
    tipo: borrador.direcciones.length,
    direccion: '',
    cp: '',
    poblacion: '',
    provincia: '08',
    zonaImp: 'ESCO',
  }));

  const [relCodigo, setRelCodigo] = useState<string>(CAT.relaciones[0].codigo);

  const filas = [...db.terceros].sort((a, b) => a.codigo.localeCompare(b.codigo));

  const cambiosSinGuardar = !soloLectura && (
    guardado
      ? JSON.stringify(borrador) !== JSON.stringify(guardado)
      : JSON.stringify(borrador) !== JSON.stringify(nuevoTercero(ini))
  );

  const anyadirDireccion = () => {
    if (soloLectura) return;
    if (!nuevaDir.cp.trim()) {
      hacer({ ok: false, error: 'Falta el código postal.' });
      return;
    }
    const dir: Direccion = {
      tipo: Number.isFinite(nuevaDir.tipo) ? nuevaDir.tipo : 0,
      direccion: nuevaDir.direccion,
      cp: nuevaDir.cp.trim(),
      poblacion: nuevaDir.poblacion,
      provincia: nuevaDir.provincia,
      zonaImp: nuevaDir.zonaImp,
    };
    setBorrador({ ...borrador, direcciones: [...borrador.direcciones, dir] });
    setNuevaDir({
      tipo: borrador.direcciones.length + 1,
      direccion: '',
      cp: '',
      poblacion: '',
      provincia: '08',
      zonaImp: 'ESCO',
    });
  };

  const quitarDireccion = (i: number) => {
    if (soloLectura) return;
    const nuevas = borrador.direcciones.filter((_, j) => j !== i);
    setBorrador({ ...borrador, direcciones: nuevas });
    setNuevaDir(prev => ({ ...prev, tipo: nuevas.length }));
  };

  const anyadirRelacion = () => {
    if (soloLectura) return;
    const rel = CAT.relaciones.find(r => r.codigo === relCodigo);
    if (!rel) return;
    if (borrador.relaciones.some(r => r.codigo === rel.codigo)) {
      hacer({ ok: false, error: 'Esa relación ya existe.' });
      return;
    }
    setBorrador({
      ...borrador,
      relaciones: [
        ...borrador.relaciones,
        { tipo: rel.tipo, codigo: rel.codigo, plan: 'PGE 2008', cuenta: rel.cuenta },
      ],
    });
  };

  const quitarRelacion = (i: number) => {
    if (soloLectura) return;
    setBorrador({ ...borrador, relaciones: borrador.relaciones.filter((_, j) => j !== i) });
  };

  const guardar = () => {
    const aGuardar: Tercero = {
      ...borrador,
      codigo: borrador.codigo.trim().toUpperCase(),
      nif: borrador.nif.trim().toUpperCase(),
      autor: ini,
    };
    const r = erp.guardarTercero(aGuardar, ini);
    if (hacer(r, 'Tercero guardado', r.ok ? { pantalla: 'terceros', clave: r.doc } : undefined)) {
      const { sembrado: _s, ...sinMarca } = aGuardar;
      void _s;
      setBorrador(sinMarca);
      if (clave === '__nuevo' && r.ok) ir('terceros', r.doc);
    } else {
      // Los campos que comprueba «Guardar» están en la pestaña «Terceros»: se vuelve a ella para marcar el campo
      setTab('terceros');
    }
  };

  const validar = () => {
    if (cambiosSinGuardar) {
      aviso('error', avisoGuardarAntes('Validar'));
      return;
    }
    const r = erp.validarTercero(borrador.codigo, ini);
    if (hacer(r, 'Tercero validado', r.ok ? { pantalla: 'terceros', clave: r.doc } : undefined)) {
      setBorrador({ ...borrador, estado: 'Validado' });
    }
  };

  const provisional = () => {
    const r = erp.provisionalTercero(borrador.codigo, ini);
    if (hacer(r, 'Tercero en provisional', r.ok ? { pantalla: 'terceros', clave: r.doc } : undefined)) {
      setBorrador({ ...borrador, estado: 'Provisional' });
    }
  };

  if (clave === null) {
    return (
      <>
        {!ini && <p className="erp-nota">Pon tus iniciales en la cabecera para crear registros.</p>}
        <Lista
          titulo="Maestro de terceros"
          filas={filas}
          clave={t => t.codigo}
          onAbrir={t => ir('terceros', t.codigo)}
          onNuevo={ini ? () => ir('terceros', '__nuevo') : undefined}
          marcarMios={t => t.autor === ini}
          cols={[
            { titulo: 'Tercero', valor: t => <span className="mono">{t.codigo}</span>, texto: t => t.codigo },
            { titulo: 'Nombre', valor: t => t.nombre, texto: t => t.nombre },
            { titulo: 'Id. fiscal', valor: t => <span className="mono">{t.nif}</span>, texto: t => t.nif },
            { titulo: 'Estado', valor: t => <Estado valor={t.estado} />, texto: t => t.estado },
            { titulo: 'Estado cobros', valor: () => ' ', texto: () => '' },
            { titulo: 'Estado pagos', valor: () => ' ', texto: () => '' },
            { titulo: 'Categoría', valor: t => t.categoria, texto: t => t.categoria },
            { titulo: 'Actividad', valor: () => ' ', texto: () => '' },
            { titulo: 'Tipo ID fiscal', valor: t => t.tipoId, texto: t => t.tipoId },
            { titulo: 'País emisor', valor: t => t.pais, texto: t => t.pais },
            { titulo: 'Clasificación', valor: () => ' ', texto: () => '' },
            { titulo: 'Cargo', valor: () => ' ', texto: () => '' },
          ]}
        />
      </>
    );
  }

  if (clave !== '__nuevo' && !guardado) {
    return (
      <div className="erp-vacio">
        <p>No existe el tercero {clave}</p>
        <button type="button" className="erp-btn" onClick={() => ir('terceros', null)}>Volver</button>
      </div>
    );
  }

  const titulo = clave === '__nuevo'
    ? 'Nuevo tercero'
    : borrador.nombre || borrador.codigo;

  const acciones: Accion[] = [];

  acciones.push({ label: 'Cambiar código', onClick: () => noDisp('Cambiar código') });

  if (!soloLectura) {
    acciones.push({ label: 'Guardar', onClick: guardar, tipo: 'primario' });

    const esGuardado = clave !== null && clave !== '__nuevo';

    if (esGuardado && borrador.estado === 'Provisional') {
      acciones.push({
        label: 'Validar',
        onClick: validar,
        tipo: 'proceso',
        title: cambiosSinGuardar ? 'Guarda los cambios antes de validar.' : undefined,
      });
    }

    if (esGuardado && borrador.estado === 'Validado') {
      acciones.push({ label: 'Pasar a provisional', onClick: provisional });
    }

    if (
      esGuardado &&
      borrador.estado === 'Validado' &&
      borrador.relaciones.some(r => r.tipo === 'Proveedor') &&
      !db.proveedores.some(p => p.tercero === borrador.codigo)
    ) {
      acciones.push({
        label: 'Crear proveedor',
        onClick: () => ir('proveedores', `__nuevo:${borrador.codigo}`),
      });
    }
  }

  // «Cerrar» y «Activar» bloquean o desbloquean el tercero para documentos nuevos: en la práctica no cambian nada, pero dicen qué harían
  const procesoEstado = (boton: 'Cerrar' | 'Activar') => {
    if (clave === '__nuevo' || !guardado) {
      aviso('error', `Primero guarda el tercero con el disquete («Guardar»); después podrás usar «${boton}».`);
      return;
    }
    if (cambiosSinGuardar) {
      aviso('error', avisoGuardarAntes(boton));
      return;
    }
    if (boton === 'Activar')
      aviso('info', `«Activar» deja el tercero ${guardado.codigo} activo para usarlo en pedidos y facturas. Ya lo está: no hay nada que cambiar.`);
    else aviso('info', `«Cerrar» bloquearía el tercero ${guardado.codigo} para documentos nuevos. En la práctica no se cierra, para que puedas seguir usándolo.`);
  };
  acciones.push({ label: 'Cerrar', onClick: () => procesoEstado('Cerrar') });
  acciones.push({ label: 'Activar', onClick: () => procesoEstado('Activar') });
  acciones.push({ label: 'Añadir tercero', onClick: () => ir('terceros', '__nuevo') });

  const menuFicha: Accion[] = [
    { label: 'Clientes', onClick: () => noDisp('Clientes') },
    { label: 'Proveedores', onClick: () => ir('proveedores', null) },
    { label: 'Situación global', onClick: () => noDisp('Situación global') },
  ];

  return (
    <Ficha
      titulo={titulo}
      estado={borrador.estado}
      acciones={[...acciones, ...extraAcc]}
      onVolver={() => ir('terceros', null)}
      menu={[...menuFicha, ...extraMenu]}
    >
      {cambiosSinGuardar && <p className="erp-nota">Cambios sin guardar</p>}

      <Pestanas
        tabs={[
          { id: 'terceros', label: 'Terceros' },
          { id: 'relaciones', label: 'Relaciones', n: borrador.relaciones.length },
          { id: 'datos_bancarios', label: 'Datos bancarios' },
          { id: 'condiciones_pago', label: 'Condiciones de pago' },
          { id: 'condiciones_cobro', label: 'Condiciones de cobro' },
          { id: 'direcciones', label: 'Direcciones', n: borrador.direcciones.length },
          { id: 'contactos', label: 'Contactos' },
          { id: 'mandato', label: 'Mandato' },
          { id: 'impuestos', label: 'Impuestos' },
          { id: 'emails', label: 'E-mails' },
        ]}
        actual={tab}
        onCambio={setTab}
      />

      {tab === 'terceros' && (
        <>
          <Seccion titulo="Identificación">
            <Rejilla cols={4}>
              <CampoTexto
                label="Código"
                req
                mono
                value={borrador.codigo}
                onChange={v => setBorrador({ ...borrador, codigo: v })}
                disabled={soloLectura || clave !== '__nuevo'}
                ayuda={`T + tus iniciales, p. ej. T${ini}`}
              />
              <CampoTexto
                label="Nombre"
                req
                ancho={2}
                value={borrador.nombre}
                onChange={v => setBorrador({ ...borrador, nombre: v })}
                disabled={soloLectura}
              />
              <CampoLectura label="Nombre comercial" valor="" />
              <CampoSel
                label="País"
                value={borrador.pais}
                opciones={PAISES}
                onChange={v => setBorrador({ ...borrador, pais: v })}
                disabled={soloLectura}
              />
              <CampoSel
                label="Tipo Id. fiscal"
                value={borrador.tipoId}
                opciones={TIPOS_ID}
                onChange={v => setBorrador({ ...borrador, tipoId: v as Tercero['tipoId'] })}
                disabled={soloLectura}
              />
              <CampoTexto
                label="Id. fiscal"
                mono
                value={borrador.nif}
                onChange={v => setBorrador({ ...borrador, nif: v })}
                disabled={soloLectura}
                ayuda="Con No censado, 0"
              />
              <CampoSel
                label="Categoría"
                value={borrador.categoria}
                opciones={CATEGORIAS}
                onChange={v => setBorrador({ ...borrador, categoria: v as Tercero['categoria'] })}
                disabled={soloLectura}
              />
              <CampoLectura label="Empresas" valor="0" ayuda="Deister Software" />
              <CampoLectura label="Clave fiscal tercero" valor="" />
              <CampoLectura label="Actividad" valor="" />
              <CampoLectura label="Referencia tercero" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Estado">
            <Rejilla cols={4}>
              <CampoLectura label="Estado" valor={<Estado valor={borrador.estado} />} />
              <CampoLectura label="Workflow" valor="" />
              <CampoLectura label="Estado cobros" valor="" />
              <CampoLectura label="Pendientes" valor="0,00" num />
              <CampoLectura label="Estado pagos" valor="" />
              <CampoLectura label="Fecha baja" valor="" />
              <CampoLectura label="Validaciones" valor="" />
              <CampoLectura label="Federación" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Más datos">
            <Rejilla cols={4}>
              <CampoLectura label="Grupo" valor="" />
              <CampoLectura label="Gestor" valor="" />
              <CampoLectura label="Holding" valor="" />
              <CampoLectura label="Prioridad de pago" valor="" />
              <CampoLectura label="Responsable" valor="" />
              <CampoLectura label="Idioma" valor="ES" />
              <CampoLectura label="Clasificación" valor="" />
              <CampoLectura label="Compensación" valor="" />
              <CampoLectura label="Tipología" valor="" />
              <CampoLectura label="Notas" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Información personal">
            <Rejilla cols={4}>
              <CampoLectura label="Tratamiento" valor="" />
              <CampoLectura label="Nombre auxiliar" valor="" />
              <CampoLectura label="Cargo" valor="" />
              <CampoLectura label="Profesión" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Workflow">
            <Rejilla cols={4}>
              <CampoLectura label="Workflow" valor="" />
              <CampoLectura label="Actividad" valor="" />
              <CampoLectura label="Fase" valor="" />
              <CampoLectura label="Usuario efectivo" valor="" />
              <CampoLectura label="Validación" valor="" />
            </Rejilla>
          </Seccion>

          <Seccion titulo="Datos de control">
            <Rejilla cols={4}>
              <CampoLectura label="Creado por" valor={borrador.autor} />
              <CampoLectura label="Creado el" valor="" />
              <CampoLectura label="Modificado por" valor="" />
              <CampoLectura label="Modificado el" valor="" />
              <CampoLectura label="ID tercero" valor="" />
            </Rejilla>
          </Seccion>
        </>
      )}

      {tab === 'relaciones' && (
        <>
          <table className="erp-tabla compacta">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Relación</th>
                <th>Plan</th>
                <th>Cuenta</th>
                <th aria-label="Quitar" />
              </tr>
            </thead>
            <tbody>
              {borrador.relaciones.map((r, i) => (
                <tr key={r.codigo}>
                  <td>{r.tipo}</td>
                  <td className="mono">{r.codigo}</td>
                  <td>{r.plan}</td>
                  <td className="mono">{r.cuenta}</td>
                  <td>
                    <button
                      type="button"
                      className="erp-x"
                      onClick={() => quitarRelacion(i)}
                      aria-label={`Quitar la relación ${r.codigo}`}
                      disabled={soloLectura}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {!borrador.relaciones.length && (
                <tr className="vacia">
                  <td colSpan={5}>Sin relaciones.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Rejilla cols={2}>
            <CampoSel
              label="Relación"
              value={relCodigo}
              onChange={setRelCodigo}
              opciones={OPC_RELACIONES}
              disabled={soloLectura}
            />
            <div className="erp-campo">
              <span className="erp-label">&nbsp;</span>
              <button type="button" className="erp-btn" onClick={anyadirRelacion} disabled={soloLectura}>
                Añadir relación
              </button>
            </div>
          </Rejilla>
        </>
      )}

      {tab === 'datos_bancarios' && <p className="erp-vacio">Datos bancarios no disponible en la práctica.</p>}
      {tab === 'condiciones_pago' && <p className="erp-vacio">Condiciones de pago no disponible en la práctica.</p>}
      {tab === 'condiciones_cobro' && <p className="erp-vacio">Condiciones de cobro no disponible en la práctica.</p>}

      {tab === 'direcciones' && (
        <>
          <table className="erp-tabla compacta">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Dirección</th>
                <th>CP</th>
                <th>Población</th>
                <th>Provincia</th>
                <th>Zona imp.</th>
                <th aria-label="Quitar" />
              </tr>
            </thead>
            <tbody>
              {borrador.direcciones.map((d, i) => (
                <tr key={i}>
                  <td>{d.tipo}</td>
                  <td>{d.direccion}</td>
                  <td>{d.cp}</td>
                  <td>{d.poblacion}</td>
                  <td>{d.provincia}</td>
                  <td>{d.zonaImp}</td>
                  <td>
                    <button
                      type="button"
                      className="erp-x"
                      onClick={() => quitarDireccion(i)}
                      aria-label={`Quitar la dirección ${i}`}
                      disabled={soloLectura}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
              {!borrador.direcciones.length && (
                <tr className="vacia">
                  <td colSpan={7}>Sin direcciones.</td>
                </tr>
              )}
            </tbody>
          </table>

          <Rejilla cols={3}>
            <CampoNum
              label="Tipo"
              value={nuevaDir.tipo}
              onChange={v => setNuevaDir({ ...nuevaDir, tipo: v })}
              disabled={soloLectura}
            />
            <CampoTexto
              label="Dirección"
              value={nuevaDir.direccion}
              onChange={v => setNuevaDir({ ...nuevaDir, direccion: v })}
              disabled={soloLectura}
            />
            <CampoTexto
              label="CP"
              value={nuevaDir.cp}
              onChange={v => setNuevaDir({ ...nuevaDir, cp: v })}
              disabled={soloLectura}
            />
            <CampoTexto
              label="Población"
              value={nuevaDir.poblacion}
              onChange={v => setNuevaDir({ ...nuevaDir, poblacion: v })}
              disabled={soloLectura}
            />
            <CampoTexto
              label="Provincia"
              value={nuevaDir.provincia}
              onChange={v => setNuevaDir({ ...nuevaDir, provincia: v })}
              disabled={soloLectura}
            />
            <CampoSel
              label="Zona impositiva"
              value={nuevaDir.zonaImp}
              opciones={CAT.zonas}
              onChange={v => setNuevaDir({ ...nuevaDir, zonaImp: v })}
              disabled={soloLectura}
            />
          </Rejilla>

          <button type="button" className="erp-btn" onClick={anyadirDireccion} disabled={soloLectura}>
            Añadir dirección
          </button>
        </>
      )}

      {tab === 'contactos' && <p className="erp-vacio">Contactos no disponible en la práctica.</p>}
      {tab === 'mandato' && <p className="erp-vacio">Mandato no disponible en la práctica.</p>}
      {tab === 'impuestos' && <p className="erp-vacio">Impuestos no disponible en la práctica.</p>}
      {tab === 'emails' && <p className="erp-vacio">E-mails no disponible en la práctica.</p>}
    </Ficha>
  );
}
