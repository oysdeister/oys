import { useId, useMemo, type Ref } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ARCO, anillo, hipotrocoide, marco, onda } from './guilloche';

export type EstadoCert = 'validado' | 'pendiente' | 'muestra';

interface Props {
  nombre: string;
  codigo: string;
  fecha: string;
  nota: string;
  estado: EstadoCert;
  validacion?: string;
  /** Orquesta la animación de entrada */
  animar: boolean;
  /** Cambia la clave para volver a estampar el sello */
  selloKey?: string;
  onSello?: () => void;
  svgRef?: Ref<SVGSVGElement>;
}

// Colores fijos: el certificado se imprime igual en tema claro u oscuro
const NAVY = '#1f2738';
const ARC = '#4fbfa5';
const ARC_DEEP = '#2a9c83';
const AMBAR = '#d98e1f';
const GRIS = '#7a8499';
const PAPEL = '#fcfdfc';
const DISPLAY = "'Bricolage Grotesque Variable', 'Bricolage Grotesque', system-ui, sans-serif";
const TEXTO = "'Instrument Sans Variable', 'Instrument Sans', system-ui, sans-serif";

const W = 1123;
const H = 794;
const CX = W / 2;

export function CertificadoSVG({ nombre, codigo, fecha, nota, estado, validacion, animar, selloKey, onSello, svgRef }: Props) {
  const reducir = useReducedMotion();
  const anim = animar && !reducir;
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (s: string) => `${s}-${uid}`;

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
      bajoNombre: [0, 1, 2].map((k) => onda(250, 392, W - 250, 392, 3.2, 16, (k * 2 * Math.PI) / 3)),
      selloAnillo: [0, 1, 2, 3, 4, 5].map((k) => anillo(0, 0, 63, 3.2, 24, (k * Math.PI) / 3, 480)),
      selloRoseta: hipotrocoide(0, 0, 60, 22, 30, 0.62, 900),
    }),
    [],
  );

  const t = (s: number) => (anim ? s : 0);
  const aparece = (retardo: number, y = 10) =>
    anim
      ? { initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { delay: retardo, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } }
      : { initial: false as const };
  const traza = (retardo: number, dur: number) =>
    anim ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { delay: retardo, duration: dur, ease: 'easeInOut' as const } } : { initial: false as const };

  const tamNombre = Math.min(60, Math.round(1150 / Math.max(10, nombre.length)));
  const microtexto = 'O&S CONSULTORES · TALLER AXIONAL · DEISTER AXIONAL · '.repeat(14);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      role="img"
      aria-label={`Certificado de ${nombre}. Practicante certificado en Deister Axional. Nota ${nota}. Código ${codigo}. ${estado === 'validado' ? 'Validado' : estado === 'pendiente' ? 'Pendiente de validación' : 'Muestra'}.`}
      style={{ display: 'block', fontFamily: TEXTO }}
    >
      <defs>
        <radialGradient id={id('fondo')} cx="50%" cy="45%" r="75%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.7" stopColor={PAPEL} />
          <stop offset="1" stopColor="#eef4f2" />
        </radialGradient>
        <linearGradient id={id('arco')} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={ARC_DEEP} />
          <stop offset="0.55" stopColor={ARC} />
          <stop offset="1" stopColor="#9fe3d2" />
        </linearGradient>
        <mask id={id('trazo')} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
          <motion.path d={ARCO.guia} fill="none" stroke="#fff" strokeWidth={70} strokeLinecap="round" {...traza(t(0.35), 1.7)} />
        </mask>
        <path id={id('micro')} d={`M 80 ${H - 67} H ${W - 80}`} />
        <path id={id('circ')} d="M 0 0 m -50 0 a 50 50 0 1 1 100 0 a 50 50 0 1 1 -100 0" />
        <pattern id={id('lineas')} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="6" stroke={ARC} strokeWidth="0.35" opacity="0.35" />
        </pattern>
      </defs>

      {/* Papel */}
      <rect width={W} height={H} fill={`url(#${id('fondo')})`} />
      <rect x="52" y="52" width={W - 104} height={H - 104} fill={`url(#${id('lineas')})`} opacity="0.5" />

      {/* Roseta central, muy tenue */}
      <motion.g opacity={0.13} {...(anim ? { initial: { opacity: 0, scale: 0.92 }, animate: { opacity: 0.13, scale: 1 }, transition: { duration: 2.2, ease: 'easeOut' } } : {})} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <path d={geo.roseta[0]} fill="none" stroke={ARC_DEEP} strokeWidth="0.55" />
        <path d={geo.roseta[1]} fill="none" stroke={NAVY} strokeWidth="0.35" />
      </motion.g>

      {/* Marco trenzado */}
      <g fill="none" strokeLinecap="round">
        {geo.marcoExt.map((d, i) => (
          <motion.path key={`e${i}`} d={d} stroke={i % 2 ? ARC_DEEP : ARC} strokeWidth="0.7" {...traza(t(0.02 * (i % 4)), 1.4)} />
        ))}
        {geo.marcoInt.map((d, i) => (
          <motion.path key={`i${i}`} d={d} stroke={NAVY} strokeWidth="0.45" opacity="0.6" {...traza(t(0.4), 1.2)} />
        ))}
        <rect x="18" y="18" width={W - 36} height={H - 36} stroke={NAVY} strokeWidth="1.6" rx="4" />
        <rect x="64" y="64" width={W - 128} height={H - 128} stroke={NAVY} strokeWidth="0.6" opacity="0.5" />
        {geo.esquinas.map((grupo, i) => (
          <g key={`c${i}`}>
            <circle cx={i === 0 || i === 3 ? 52 : W - 52} cy={i < 2 ? 52 : H - 52} r="22" fill={PAPEL} />
            {grupo.map((d, k) => (
              <path key={k} d={d} stroke={k % 2 ? NAVY : ARC_DEEP} strokeWidth="0.6" />
            ))}
          </g>
        ))}
      </g>

      {/* El arco de la marca, que se traza */}
      <path d={ARCO.relleno} fill={`url(#${id('arco')})`} mask={`url(#${id('trazo')})`} />
      <motion.path d="M96 712 C 100 300, 420 86, 1046 100" fill="none" stroke={NAVY} strokeWidth="0.8" strokeDasharray="2 5" opacity="0.45" {...traza(t(0.8), 1.6)} />

      {/* Marca de agua de muestra */}
      {estado === 'muestra' && (
        <text x={CX} y={470} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="170" fill={NAVY} opacity="0.06" transform={`rotate(-18 ${CX} 430)`}>
          Muestra
        </text>
      )}

      {/* Títulos */}
      <motion.text {...aparece(t(0.9))} x={CX} y={176} textAnchor="middle" fontSize="15" letterSpacing="3" fill={GRIS}>
        Taller Axional · O&amp;S Consultores
      </motion.text>
      <motion.text {...aparece(t(1.0), 16)} x={CX} y={252} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="78" letterSpacing="-1.5" fill={NAVY} style={{ fontVariationSettings: "'wdth' 75" }}>
        Certificado
      </motion.text>
      <motion.text {...aparece(t(1.25))} x={CX} y={300} textAnchor="middle" fontSize="18" fill={GRIS} fontStyle="italic">
        O&amp;S Consultores certifica que
      </motion.text>

      {/* Nombre */}
      <motion.text
        x={CX}
        y={370}
        textAnchor="middle"
        fontFamily={DISPLAY}
        fontWeight={700}
        fontSize={tamNombre}
        fill={NAVY}
        {...(anim
          ? { initial: { opacity: 0, letterSpacing: '18px' }, animate: { opacity: 1, letterSpacing: '-0.5px' }, transition: { delay: 1.5, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] } }
          : { initial: false as const, letterSpacing: '-0.5px' })}
      >
        {nombre}
      </motion.text>
      <g fill="none">
        {geo.bajoNombre.map((d, i) => (
          <motion.path key={i} d={d} stroke={i === 1 ? NAVY : ARC} strokeWidth="0.8" opacity={i === 1 ? 0.5 : 1} {...traza(t(1.7 + i * 0.08), 1)} />
        ))}
      </g>

      <motion.g {...aparece(t(2.0))}>
        <text x={CX} y={436} textAnchor="middle" fontSize="18" fill={NAVY}>
          ha superado el examen final del Taller Axional y es
        </text>
        <text x={CX} y={478} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize="29" fill={ARC_DEEP}>
          Practicante certificado en Deister Axional
        </text>
        <text x={CX} y={510} textAnchor="middle" fontSize="16" fill={GRIS}>
          compras, ventas, maestros, asientos, parametrización contable y carteras
        </text>
      </motion.g>

      {/* Datos */}
      <motion.g {...aparece(t(2.2))}>
        {[
          { x: 362, k: 'Fecha', v: fecha },
          { x: 572, k: 'Nota', v: nota },
          { x: 748, k: 'Código de examen', v: codigo },
        ].map((d) => (
          <g key={d.k}>
            <line x1={d.x - 72} x2={d.x + 72} y1={582} y2={582} stroke={NAVY} strokeWidth="0.8" opacity="0.4" />
            <text x={d.x} y={606} textAnchor="middle" fontSize="12.5" letterSpacing="1" fill={GRIS}>
              {d.k}
            </text>
            <text x={d.x} y={634} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize="19" fill={NAVY} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {d.v}
            </text>
          </g>
        ))}
        <path d="M466 680 c 18 -26 30 -30 38 -12 s 14 22 26 -2 s 22 -26 32 0 s 18 14 30 -6 s 20 -10 34 4" fill="none" stroke={NAVY} strokeWidth="1.3" opacity="0.7" />
        <line x1={CX - 120} x2={CX + 120} y1={692} y2={692} stroke={NAVY} strokeWidth="0.8" opacity="0.4" />
        <text x={CX} y={711} textAnchor="middle" fontSize="12.5" fill={GRIS}>
          Dirección de formación · O&amp;S Consultores
        </text>
      </motion.g>

      {/* Logo */}
      <motion.image {...aparece(t(0.6), 0)} href={`${import.meta.env.BASE_URL}brand/oys_logo.png`} x={112} y={588} width={156} height={95} />

      {/* Microtexto de seguridad */}
      <text fontSize="5.2" letterSpacing="0.6" fill={NAVY} opacity="0.45">
        <textPath href={`#${id('micro')}`}>{microtexto}</textPath>
      </text>

      {/* Sello */}
      <g transform="translate(944 612)">
        {estado === 'validado' && (
          <motion.g
            key={selloKey ?? 'v'}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            {...(anim
              ? {
                  initial: { opacity: 0, scale: 2.8, rotate: -190 },
                  animate: { opacity: 1, scale: 1, rotate: -14 },
                  transition: { delay: 2.5, type: 'spring', stiffness: 170, damping: 13, mass: 1.1 },
                  onAnimationComplete: () => onSello?.(),
                }
              : { initial: false as const, animate: { rotate: -14 } })}
          >
            <circle r="80" fill={PAPEL} />
            <circle r="78" fill="none" stroke={ARC_DEEP} strokeWidth="3" />
            <circle r="71" fill="none" stroke={ARC_DEEP} strokeWidth="0.8" />
            {geo.selloAnillo.map((d, i) => (
              <path key={i} d={d} fill="none" stroke={i % 2 ? NAVY : ARC} strokeWidth="0.55" />
            ))}
            <circle r="56" fill={ARC_DEEP} />
            <path d={geo.selloRoseta} fill="none" stroke="#ffffff" strokeWidth="0.45" opacity="0.35" />
            <path d="M -20 -10 l 12 12 l 26 -28" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <text y="26" textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize="21" fill="#fff" letterSpacing="0.5">
              Validado
            </text>
            <g transform="scale(1.33)">
              <text fontSize="6.6" fontWeight={700} letterSpacing="1.8" fill={NAVY}>
                <textPath href={`#${id('circ')}`}>O&amp;S CONSULTORES · TALLER AXIONAL · {codigo} ·</textPath>
              </text>
            </g>
          </motion.g>
        )}
        {estado === 'validado' && anim && (
          <motion.circle
            key={`onda-${selloKey ?? 'v'}`}
            r="80"
            fill="none"
            stroke={ARC}
            strokeWidth="3"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.7], opacity: [0.8, 0] }}
            transition={{ delay: 2.85, duration: 0.8, ease: 'easeOut' }}
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        )}
        {estado === 'pendiente' && (
          <motion.g {...(anim ? { initial: { opacity: 0, scale: 0.6 }, animate: { opacity: 1, scale: 1 }, transition: { delay: 2.5, duration: 0.6 } } : { initial: false as const })} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
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
      {estado === 'validado' && validacion && (
        <motion.text {...aparece(t(3.1), 0)} x={944} y={716} textAnchor="middle" fontSize="11" letterSpacing="1" fill={GRIS}>
          Validación {validacion}
        </motion.text>
      )}
    </svg>
  );
}
