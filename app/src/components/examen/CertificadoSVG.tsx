import { useEffect, useId, useMemo, useRef, type Ref } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import fuenteCert from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-standard-normal.woff2?url';
import { ARCO, anillo, hipotrocoide, lunita, marco, onda, salpicaduras } from './guilloche';

export type EstadoCert = 'validado' | 'pendiente' | 'muestra';

interface Props {
  nombre: string;
  codigo: string;
  fecha: string;
  nota: string;
  estado: EstadoCert;
  validacion?: string;
  /** Orquesta la animación de entrada (false: dibujo estático, el que se imprime y se exporta) */
  animar: boolean;
  /** Cambia la clave para volver a estampar el sello */
  selloKey?: string;
  /** Segundos hasta que cae el sello (la entrada completa lo deja en 2,9 s) */
  selloRetardo?: number;
  /** Se llama en el instante en que el sello toca el papel */
  onImpacto?: () => void;
  svgRef?: Ref<SVGSVGElement>;
}

// Colores fijos: el certificado se imprime igual en tema claro u oscuro
const NAVY = '#1f2738';
const ARC = '#4fbfa5';
const ARC_DEEP = '#2a9c83';
const AMBAR = '#d98e1f';
const GRIS = '#6b7489';
const PAPEL = '#fcfdfc';
/** Familia propia con el eje de anchura (wdth) de Bricolage: se registra una vez y se incrusta al exportar */
export const FAMILIA_CERT = 'Cert Display OyS';
export const FUENTE_CERT_URL = fuenteCert;
const DISPLAY = `'${FAMILIA_CERT}', 'Bricolage Grotesque Variable', 'Bricolage Grotesque', system-ui, sans-serif`;
const TEXTO = "'Instrument Sans Variable', 'Instrument Sans', system-ui, sans-serif";

let fuenteRegistrada = false;
function registraFuente() {
  if (fuenteRegistrada || typeof document === 'undefined' || typeof FontFace === 'undefined') return;
  fuenteRegistrada = true;
  try {
    const ff = new FontFace(FAMILIA_CERT, `url(${fuenteCert}) format('woff2')`, { weight: '200 800', stretch: '75% 100%' });
    document.fonts.add(ff);
    void ff.load().catch(() => undefined);
  } catch {
    /* sin FontFace: se usa Bricolage normal */
  }
}

const W = 1123;
const H = 794;
const CX = W / 2;
/** Centro del sello y banda holográfica: Certificado.tsx coloca encima las capas vivas con estas cifras */
export const GEOM = { W, H, sello: { x: 944, y: 606, r: 56 }, banda: { x: 1004, y: 152, w: 26, h: 318 } };
const S = GEOM.sello;
const B = GEOM.banda;

const EASE = [0.2, 0.7, 0.2, 1] as const;

export function CertificadoSVG({ nombre, codigo, fecha, nota, estado, validacion, animar, selloKey, selloRetardo = 2.9, onImpacto, svgRef }: Props) {
  const reducir = useReducedMotion();
  const anim = animar && !reducir;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (s: string) => `${s}-${uid}`;
  registraFuente();

  // El impacto del sello: avisa al padre (sacudida y confeti) justo cuando toca el papel
  const impacto = useRef(onImpacto);
  impacto.current = onImpacto;
  useEffect(() => {
    if (!anim || estado !== 'validado') return;
    const t = setTimeout(() => impacto.current?.(), (selloRetardo + 0.34) * 1000);
    return () => clearTimeout(t);
  }, [anim, estado, selloKey, selloRetardo]);

  const geo = useMemo(
    () => ({
      marcoExt: marco(30, 30, W - 60, H - 60, 5, 26, 5),
      marcoInt: marco(52, 52, W - 104, H - 104, 2.2, 12, 3),
      roseta: [hipotrocoide(CX, 420, 96, 35, 70, 2.5, 1800), hipotrocoide(CX, 420, 90, 27, 46, 2.5, 1800)],
      esquinas: [
        [52, 52],
        [W - 52, 52],
        [W - 52, H - 52],
        [52, H - 52],
      ].map(([x, y]) => [0, 1, 2, 3].map((k) => anillo(x, y, 15, 4, 9, (k * Math.PI) / 2, 240))),
      bajoNombre: [0, 1, 2].map((k) => onda(240, 392, W - 240, 392, 3.2, 16, (k * 2 * Math.PI) / 3)),
      selloAnillo: [0, 1, 2, 3, 4, 5].map((k) => anillo(0, 0, 63, 3.2, 24, (k * Math.PI) / 3, 480)),
      selloRoseta: hipotrocoide(0, 0, 60, 22, 30, 0.62, 900),
      lunas: Array.from({ length: 8 }, (_, i) => lunita(B.x + B.w / 2, B.y + 22 + i * 39, 8)),
      gotas: salpicaduras(14, 84, 118),
    }),
    [],
  );

  const t = (s: number) => (anim ? s : 0);
  const aparece = (retardo: number, y = 10) =>
    anim ? { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay: retardo, duration: 0.7, ease: EASE } } : { initial: false as const };
  const traza = (retardo: number, dur: number) =>
    anim ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay: retardo, duration: dur, ease: 'easeInOut' as const } } : { initial: false as const };

  const letras = Array.from(nombre);
  const tamNombre = Math.min(60, Math.round(1150 / Math.max(10, letras.length)));
  const pasoLetra = Math.min(0.055, 0.75 / Math.max(1, letras.length));
  const micro = `O&S CONSULTORES · TALLER AXIONAL · DEISTER AXIONAL · ${codigo} · `;
  const microInf = micro.repeat(Math.ceil(1100 / (micro.length * 3.3)));
  const microSup = `DOCUMENTO DE FORMACIÓN · ${codigo} · ${validacion ?? 'SIN VALIDAR'} · `.repeat(10);
  const textoEstado = estado === 'validado' ? `Validado con el código ${validacion ?? ''}` : estado === 'pendiente' ? 'Pendiente de validación por el examinador' : 'Muestra sin valor';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`Certificado de ${nombre}. Practicante certificado en Deister Axional por O&S Consultores. Fecha ${fecha}. Nota ${nota}. Código de examen ${codigo}. ${textoEstado}.`}
      style={{ display: 'block', fontFamily: TEXTO }}
    >
      <defs>
        <radialGradient id={id('fondo')} cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor={PAPEL} />
          <stop offset="1" stopColor="#eaf2ef" />
        </radialGradient>
        <linearGradient id={id('arco')} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={ARC_DEEP} />
          <stop offset="0.55" stopColor={ARC} />
          <stop offset="1" stopColor="#9fe3d2" />
        </linearGradient>
        <linearGradient id={id('iris')} x1="0" y1="0" x2="0.35" y2="1">
          <stop offset="0" stopColor="#9fe3d2" />
          <stop offset="0.18" stopColor="#8fd3ff" />
          <stop offset="0.36" stopColor="#c7b8ff" />
          <stop offset="0.54" stopColor="#f6c4d8" />
          <stop offset="0.72" stopColor="#f5d58a" />
          <stop offset="0.88" stopColor="#9fe3d2" />
          <stop offset="1" stopColor="#8fd3ff" />
        </linearGradient>
        <linearGradient id={id('brilloNombre')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#bff0e3" stopOpacity="0.95" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <mask id={id('trazo')} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <motion.path d={ARCO.guia} fill="none" stroke="#fff" strokeWidth={70} strokeLinecap="round" {...traza(t(0.55), 1.5)} />
        </mask>
        <clipPath id={id('clipNombre')}>
          <text x={CX} y={370} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={tamNombre} letterSpacing="-0.5">
            {nombre}
          </text>
        </clipPath>
        <path id={id('micro')} d={`M 80 ${H - 67} H ${W - 80}`} />
        <path id={id('microSup')} d={`M 92 140 H 300`} />
        <path id={id('circ')} d="M 0 0 m -50 0 a 50 50 0 1 1 100 0 a 50 50 0 1 1 -100 0" />
        <pattern id={id('lineas')} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={ARC} strokeWidth="0.35" opacity="0.35" />
        </pattern>
        <pattern id={id('rayado')} width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <line x1="0" y1="0" x2="0" y2="4" stroke="#ffffff" strokeWidth="0.8" opacity="0.55" />
        </pattern>
        <radialGradient id={id('presion')}>
          <stop offset="0.55" stopColor={NAVY} stopOpacity="0.16" />
          <stop offset="1" stopColor={NAVY} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Papel */}
      <rect width={W} height={H} fill={`url(#${id('fondo')})`} />
      <rect x="52" y="52" width={W - 104} height={H - 104} fill={`url(#${id('lineas')})`} opacity="0.5" />

      {/* Roseta central, muy tenue: se dibuja como un espirógrafo */}
      <g opacity={0.13} fill="none">
        <motion.path d={geo.roseta[0]} stroke={ARC_DEEP} strokeWidth="0.55" {...traza(t(0.25), 2.2)} />
        <motion.path d={geo.roseta[1]} stroke={NAVY} strokeWidth="0.35" {...traza(t(0.45), 2.2)} />
      </g>

      {/* Marco trenzado */}
      <g fill="none" strokeLinecap="round">
        {geo.marcoExt.map((d, i) => (
          <motion.path key={`e${i}`} d={d} stroke={i % 2 ? ARC_DEEP : ARC} strokeWidth="0.7" {...traza(t(0.15 + 0.03 * (i % 4)), 1.3)} />
        ))}
        {geo.marcoInt.map((d, i) => (
          <motion.path key={`i${i}`} d={d} stroke={NAVY} strokeWidth="0.45" opacity="0.6" {...traza(t(0.4), 1.2)} />
        ))}
        <rect x="18" y="18" width={W - 36} height={H - 36} stroke={NAVY} strokeWidth="1.6" rx="4" />
        <rect x="64" y="64" width={W - 128} height={H - 128} stroke={NAVY} strokeWidth="0.6" opacity="0.5" />
        {geo.esquinas.map((grupo, i) => (
          <motion.g key={`c${i}`} {...(anim ? { initial: { opacity: 0, scale: 0.4 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 0.9 + i * 0.08, type: 'spring', stiffness: 220, damping: 16 } } : { initial: false as const })} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <circle cx={i === 0 || i === 3 ? 52 : W - 52} cy={i < 2 ? 52 : H - 52} r="22" fill={PAPEL} />
            {grupo.map((d, k) => (
              <path key={k} d={d} stroke={k % 2 ? NAVY : ARC_DEEP} strokeWidth="0.6" />
            ))}
          </motion.g>
        ))}
      </g>

      {/* Microtexto superior del marco */}
      <text fontSize="4.2" letterSpacing="0.5" fill={NAVY} opacity="0.4">
        <textPath href={`#${id('microSup')}`}>{microSup}</textPath>
      </text>

      {/* El arco de la marca, que barre de abajo a la izquierda hacia arriba a la derecha */}
      <path d={ARCO.relleno} fill={`url(#${id('arco')})`} mask={`url(#${id('trazo')})`} />
      <motion.path d="M100 700 C 104 300, 420 92, 990 98" fill="none" stroke={NAVY} strokeWidth="0.8" strokeDasharray="2 5" opacity="0.4" {...traza(t(0.9), 1.4)} />

      {/* Numeración: código de examen arriba a la izquierda, validación arriba a la derecha */}
      <motion.g {...aparece(t(1.1), 0)} style={{ fontVariantNumeric: 'tabular-nums' }}>
        <text x={92} y={104} fontSize="10" letterSpacing="1.4" fill={GRIS}>
          Nº de certificado
        </text>
        <text x={92} y={126} fontFamily={DISPLAY} fontWeight={700} fontSize="17" letterSpacing="1" fill={NAVY}>
          {codigo}
        </text>
        <text x={1031} y={118} textAnchor="end" fontSize="10" letterSpacing="1.4" fill={GRIS}>
          {estado === 'validado' ? 'Código de validación' : estado === 'pendiente' ? 'Validación' : 'Documento'}
        </text>
        <text x={1031} y={140} textAnchor="end" fontFamily={DISPLAY} fontWeight={700} fontSize="17" letterSpacing="1" fill={estado === 'validado' ? ARC_DEEP : estado === 'pendiente' ? AMBAR : GRIS}>
          {estado === 'validado' ? validacion : estado === 'pendiente' ? 'pendiente' : 'sin valor'}
        </text>
      </motion.g>

      {/* Banda holográfica de seguridad: en pantalla la sustituye una capa viva que cambia con el ángulo */}
      {estado !== 'muestra' && (
        <motion.g className="cert-holo-estatico" {...(anim ? { initial: { opacity: 0 }, animate: { opacity: estado === 'validado' ? 0.95 : 0.4 }, transition: { delay: 1.3, duration: 0.8 } } : { initial: false as const, opacity: estado === 'validado' ? 0.95 : 0.4 })}>
          <rect x={B.x} y={B.y} width={B.w} height={B.h} rx="3" fill={`url(#${id('iris')})`} />
          <rect x={B.x} y={B.y} width={B.w} height={B.h} rx="3" fill={`url(#${id('rayado')})`} />
          {geo.lunas.map((d, i) => (
            <path key={i} d={d} fill="#ffffff" opacity="0.75" />
          ))}
          <rect x={B.x} y={B.y} width={B.w} height={B.h} rx="3" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />
        </motion.g>
      )}

      {/* Marca de agua de muestra */}
      {estado === 'muestra' && (
        <text x={CX} y={470} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="170" fill={NAVY} opacity="0.06" transform={`rotate(-18 ${CX} 430)`}>
          Muestra
        </text>
      )}

      {/* Títulos */}
      <motion.text {...aparece(t(1.0))} x={CX} y={178} textAnchor="middle" fontSize="15" letterSpacing="3" fill={GRIS}>
        Practicando Axional Deister VNext · O&amp;S Consultores
      </motion.text>
      <motion.text {...aparece(t(1.1), 18)} x={CX} y={252} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="80" letterSpacing="-1.5" fill={NAVY} style={{ fontVariationSettings: "'wdth' 75" }}>
        Certificado
      </motion.text>
      <motion.text {...aparece(t(1.3))} x={CX} y={300} textAnchor="middle" fontSize="18" fill={GRIS} fontStyle="italic">
        O&amp;S Consultores certifica que
      </motion.text>

      {/* Nombre: se escribe letra a letra y le pasa un brillo turquesa */}
      <text x={CX} y={370} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={tamNombre} letterSpacing="-0.5" fill={NAVY}>
        {anim
          ? letras.map((l, i) => (
              <motion.tspan key={`${i}-${l}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.45 + i * pasoLetra, duration: 0.32 }}>
                {l}
              </motion.tspan>
            ))
          : nombre}
      </text>
      {anim && (
        <g clipPath={`url(#${id('clipNombre')})`} style={{ pointerEvents: 'none' }}>
          <motion.rect y={300} width={140} height={90} fill={`url(#${id('brilloNombre')})`} initial={{ x: 150, opacity: 1 }} animate={{ x: W - 290, opacity: [1, 1, 0] }} transition={{ delay: 1.5, duration: 1.3, ease: 'easeInOut' }} />
        </g>
      )}
      <g fill="none">
        {geo.bajoNombre.map((d, i) => (
          <motion.path key={i} d={d} stroke={i === 1 ? NAVY : ARC} strokeWidth="0.8" opacity={i === 1 ? 0.5 : 1} {...traza(t(1.85 + i * 0.08), 0.9)} />
        ))}
      </g>

      <motion.g {...aparece(t(2.1))}>
        <text x={CX} y={436} textAnchor="middle" fontSize="18" fill={NAVY}>
          ha superado el examen final de Practicando Axional Deister VNext y es
        </text>
        <text x={CX} y={478} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize="29" fill={ARC_DEEP}>
          Practicante certificado en Deister Axional
        </text>
        <text x={CX} y={510} textAnchor="middle" fontSize="16" fill={GRIS}>
          compras, ventas, maestros, asientos, parametrización contable y carteras
        </text>
      </motion.g>

      {/* Datos en cascada */}
      {[
        { x: 432, w: 118, k: 'Fecha', v: fecha },
        { x: 616, w: 52, k: 'Nota', v: nota },
        { x: 762, w: 74, k: 'Código de examen', v: codigo },
      ].map((d, i) => (
        <motion.g key={d.k} {...aparece(t(2.3 + i * 0.12), 14)}>
          <line x1={d.x - d.w} x2={d.x + d.w} y1={572} y2={572} stroke={NAVY} strokeWidth="0.8" opacity="0.4" />
          <text x={d.x} y={594} textAnchor="middle" fontSize="12" letterSpacing="1" fill={GRIS}>
            {d.k}
          </text>
          <text x={d.x} y={620} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize="18" fill={NAVY} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {d.v}
          </text>
        </motion.g>
      ))}

      {/* Firma */}
      <motion.path
        d="M540 676 c 16 -26 28 -30 36 -12 s 14 22 26 -2 s 22 -26 32 0 s 18 14 30 -6 s 20 -10 34 4"
        fill="none"
        stroke={NAVY}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
        {...traza(t(2.6), 0.8)}
      />
      <motion.g {...aparece(t(2.65), 6)}>
        <line x1={600 - 128} x2={600 + 128} y1={688} y2={688} stroke={NAVY} strokeWidth="0.8" opacity="0.4" />
        <text x={600} y={706} textAnchor="middle" fontSize="12" fill={GRIS}>
          Dirección de formación · O&amp;S Consultores
        </text>
      </motion.g>

      {/* Logo, abajo a la izquierda, separado del arco y de la columna de la fecha */}
      <motion.image {...aparece(t(0.8), 0)} href={`${import.meta.env.BASE_URL}brand/oys_logo.png`} x={128} y={604} width={128} height={78} />

      {/* Microtexto de seguridad */}
      <text fontSize="5.2" letterSpacing="0.6" fill={NAVY} opacity="0.45">
        <textPath href={`#${id('micro')}`}>{microInf}</textPath>
      </text>

      {/* Sello */}
      <g transform={`translate(${S.x} ${S.y})`}>
        {estado === 'validado' && (
          <>
            {/* Huella de la presión en el papel */}
            <motion.ellipse rx="98" ry="98" fill={`url(#${id('presion')})`} {...(anim ? { initial: { opacity: 0 }, animate: { opacity: [0, 1, 0.55] }, transition: { delay: selloRetardo + 0.3, duration: 0.7 } } : { initial: false as const, opacity: 0.55 })} />
            {anim &&
              geo.gotas.map((g, i) => (
                <motion.circle
                  key={`g${selloKey}-${i}`}
                  r={g.r}
                  fill={i % 3 ? ARC_DEEP : NAVY}
                  initial={{ cx: g.x, cy: g.y, opacity: 0 }}
                  animate={{ cx: g.dx, cy: g.dy, opacity: [0, 0.9, 0] }}
                  transition={{ delay: selloRetardo + 0.33, duration: 0.6, ease: 'easeOut' }}
                />
              ))}
            <motion.g
              key={selloKey ?? 'v'}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              {...(anim
                ? {
                    initial: { opacity: 0, scale: 2.7, rotate: -48 },
                    animate: { opacity: [0, 1, 1, 1], scale: [2.7, 0.93, 1.035, 1], rotate: [-48, -14, -14, -14] },
                    transition: { delay: selloRetardo, duration: 0.62, times: [0, 0.55, 0.78, 1], ease: ['easeIn', 'easeOut', 'easeInOut'] },
                  }
                : { initial: false as const })}
            >
              <g transform={anim ? undefined : 'rotate(-14)'}>
                <circle r="80" fill={PAPEL} />
                <circle r="78" fill="none" stroke={ARC_DEEP} strokeWidth="3" />
                <circle r="74.5" fill="none" stroke={`url(#${id('iris')})`} strokeWidth="4" opacity="0.9" />
                <circle r="71" fill="none" stroke={ARC_DEEP} strokeWidth="0.8" />
                {geo.selloAnillo.map((d, i) => (
                  <path key={i} d={d} fill="none" stroke={i % 2 ? NAVY : ARC} strokeWidth="0.55" />
                ))}
                <circle r={S.r} fill={ARC_DEEP} />
                <path d={geo.selloRoseta} fill="none" stroke="#ffffff" strokeWidth="0.45" opacity="0.35" />
                <path d="M -20 -10 l 12 12 l 26 -28" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <text y="26" textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="21" fill="#fff" letterSpacing="0.5">
                  Validado
                </text>
                <g transform="scale(1.33)">
                  <text fontSize="6.6" fontWeight={700} letterSpacing="1.8" fill={NAVY}>
                    <textPath href={`#${id('circ')}`}>O&amp;S CONSULTORES · TALLER AXIONAL · {validacion ?? codigo} ·</textPath>
                  </text>
                </g>
              </g>
            </motion.g>
            {anim &&
              [0, 1].map((k) => (
                <motion.circle
                  key={`onda-${selloKey ?? 'v'}-${k}`}
                  r="80"
                  fill="none"
                  stroke={k ? NAVY : ARC}
                  strokeWidth={k ? 1.2 : 3}
                  initial={{ scale: 1, opacity: 0 }}
                  animate={{ scale: [1, 1, k ? 2.3 : 1.8], opacity: [0, 0.85, 0] }}
                  transition={{ delay: selloRetardo + 0.32 + k * 0.08, duration: 0.9, times: [0, 0.04, 1], ease: 'easeOut' }}
                  style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                />
              ))}
          </>
        )}
        {estado === 'pendiente' && (
          <motion.g {...(anim ? { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, transition: { delay: selloRetardo, duration: 0.6, ease: EASE } } : { initial: false as const })} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
            <g transform="rotate(-8)">
              <circle r="78" fill={PAPEL} stroke={AMBAR} strokeWidth="2.5" strokeDasharray="7 6" />
              <circle r="64" fill="none" stroke={AMBAR} strokeWidth="0.8" />
              <text y="-8" textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="20" fill={AMBAR}>
                Pendiente
              </text>
              <text y="16" textAnchor="middle" fontSize="13" fontWeight={600} fill={AMBAR}>
                de validación
              </text>
              <text y="38" textAnchor="middle" fontSize="9" fill={GRIS}>
                por el examinador
              </text>
            </g>
          </motion.g>
        )}
      </g>
    </svg>
  );
}
