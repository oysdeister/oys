import { useState } from 'react';
import { useDb, erp, CAT, type Tercero, type Direccion } from '../modelo';
import { Lista, Ficha, Pestanas, Rejilla, CampoTexto, CampoNum, CampoSel, Estado, useErp, type Accion } from '../ui';

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
  const { ini, clave, ir, hacer } = useErp();
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

  const [tab, setTab] = useState('general');

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
      setBorrador(aGuardar);
      if (clave === '__nuevo' && r.ok) ir('terceros', r.doc);
    }
  };

  const validar = () => {
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
          nuevoTexto="Nuevo tercero"
          marcarMios={t => t.autor === ini}
          cols={[
            { titulo: 'Código', valor: t => <span className="mono">{t.codigo}</span>, texto: t => t.codigo },
            { titulo: 'Nombre', valor: t => t.nombre, texto: t => t.nombre },
            { titulo: 'Id. fiscal', valor: t => <span className="mono">{t.nif}</span>, texto: t => t.nif },
            { titulo: 'Categoría', valor: t => t.categoria, texto: t => t.categoria },
            { titulo: 'Estado', valor: t => <Estado valor={t.estado} />, texto: t => t.estado },
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
    : `${borrador.codigo} · ${borrador.nombre}`;

  const acciones: Accion[] = [];

  if (!soloLectura) {
    acciones.push({ label: 'Guardar', onClick: guardar, tipo: 'primario' });

    const esGuardado = clave !== null && clave !== '__nuevo';

    if (esGuardado && borrador.estado === 'Provisional') {
      acciones.push({
        label: 'Validar',
        onClick: validar,
        tipo: 'proceso',
        disabled: cambiosSinGuardar,
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

  return (
    <Ficha
      titulo={titulo}
      sub="Maestros › Terceros"
      estado={borrador.estado}
      acciones={acciones}
      onVolver={() => ir('terceros', null)}
    >
      {cambiosSinGuardar && <p className="erp-nota">Cambios sin guardar</p>}

      <Pestanas
        tabs={[
          { id: 'general', label: 'Datos generales' },
          { id: 'direcciones', label: 'Direcciones', n: borrador.direcciones.length },
          { id: 'relaciones', label: 'Relaciones', n: borrador.relaciones.length },
        ]}
        actual={tab}
        onCambio={setTab}
      />

      {tab === 'general' && (
        <Rejilla cols={3}>
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
        </Rejilla>
      )}

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
    </Ficha>
  );
}