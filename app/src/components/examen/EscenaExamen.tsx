import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { META, ORDEN } from '../../content';

/* =====================================================================
   Escena 3D de la portada del examen: un núcleo de cristal con tres
   órbitas de neón. En las órbitas viajan las preguntas (satélites) y los
   módulos (planetas). La cámara llega desde el fondo del espacio.
   Ligera: sin postproceso (el brillo son sprites aditivos) y con fondo
   transparente para que se vea el cielo de la tarjeta.
   ===================================================================== */

const MODULOS_COL = ORDEN.map((id) => META[id]?.color ?? '#4fbfa5');
const INTRO = 2.4;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

function texturaHalo() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,1)');
  gr.addColorStop(0.18, 'rgba(255,255,255,0.55)');
  gr.addColorStop(0.5, 'rgba(255,255,255,0.12)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_NUCLEO = /* glsl */ `
  uniform float uTime;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), 1.7);
    float s = 0.5 + 0.5 * sin(vP.y * 4.0 + uTime * 0.8 + sin(vP.x * 3.5 + uTime * 0.6) * 1.5);
    vec3 col = mix(vec3(0.05, 0.2, 0.62), vec3(0.25, 0.95, 0.85), s * 0.7);
    col = mix(col, vec3(0.55, 0.47, 1.0), f * 0.6);
    float a = 0.22 + 0.7 * f;
    gl_FragColor = vec4(col * (0.5 + f * 1.4), a);
  }
`;

function Estrellas({ n, mapa }: { n: number; mapa: THREE.Texture }) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    let s = 7;
    const azar = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
    const paleta = [new THREE.Color('#ffffff'), new THREE.Color('#9fe8ff'), new THREE.Color('#c9c0ff'), new THREE.Color('#bff8ea')];
    for (let i = 0; i < n; i++) {
      const r = 14 + azar() * 46;
      const th = azar() * Math.PI * 2;
      const ph = Math.acos(2 * azar() - 1);
      pos.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th) * 0.6, r * Math.cos(ph) - 10], i * 3);
      const c = paleta[i % 4];
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    return g;
  }, [n]);
  useEffect(() => () => geo.dispose(), [geo]);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.012;
  });
  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.32} map={mapa} sizeAttenuation vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Halo({ color, escala, opacidad = 0.9, mapa }: { color: string; escala: number; opacidad?: number; mapa: THREE.Texture }) {
  return (
    <sprite scale={[escala, escala, 1]}>
      <spriteMaterial map={mapa} color={color} transparent opacity={opacidad} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

function Orbita({ r, color, giro, velocidad, cuerpos, mapa }: { r: number; color: string; giro: [number, number, number]; velocidad: number; cuerpos: { color: string; tam: number; fase: number }[]; mapa: THREE.Texture }) {
  const rueda = useRef<THREE.Group>(null);
  const brillo = useMemo(() => new THREE.Color(color).multiplyScalar(1.6), [color]);
  useFrame((_, dt) => {
    if (rueda.current) rueda.current.rotation.z += dt * velocidad;
  });
  return (
    <group rotation={giro}>
      <mesh>
        <torusGeometry args={[r, 0.016, 6, 180]} />
        <meshBasicMaterial color={brillo} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[r, 0.09, 6, 120]} />
        <meshBasicMaterial color={color} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={rueda}>
        {cuerpos.map((c, k) => (
          <group key={k} position={[Math.cos(c.fase) * r, Math.sin(c.fase) * r, 0]}>
            <mesh>
              <sphereGeometry args={[c.tam, 18, 14]} />
              <meshBasicMaterial color={new THREE.Color(c.color).multiplyScalar(1.25)} toneMapped={false} />
            </mesh>
            <Halo color={c.color} escala={c.tam * 7} opacidad={0.75} mapa={mapa} />
          </group>
        ))}
      </group>
    </group>
  );
}

function Mundo({ reducir, apunta }: { reducir: boolean; apunta: { current: { x: number; y: number } } }) {
  const { camera, invalidate } = useThree();
  const sistema = useRef<THREE.Group>(null);
  const nucleo = useRef<THREE.ShaderMaterial>(null);
  const t0 = useRef<number | null>(null);
  const mapa = useMemo(texturaHalo, []);
  useEffect(() => () => mapa.dispose(), [mapa]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  const orbitas = useMemo(
    () => [
      { r: 2.35, color: '#5ff0d2', giro: [0.95, 0.15, 0.35] as [number, number, number], velocidad: 0.22, cuerpos: Array.from({ length: 8 }, (_, k) => ({ color: k % 2 ? '#bffcf0' : '#5ff0d2', tam: 0.055, fase: (k / 8) * Math.PI * 2 })) },
      { r: 3.25, color: '#8b7bff', giro: [1.18, -0.42, -0.5] as [number, number, number], velocidad: -0.14, cuerpos: Array.from({ length: 12 }, (_, k) => ({ color: k % 3 ? '#c9c0ff' : '#6fe9ff', tam: 0.05, fase: (k / 12) * Math.PI * 2 + 0.2 })) },
      { r: 4.3, color: '#6fe9ff', giro: [0.82, 0.3, 0.7] as [number, number, number], velocidad: 0.07, cuerpos: [...MODULOS_COL.map((c, k) => ({ color: c, tam: 0.16, fase: (k / MODULOS_COL.length) * Math.PI * 2 })), ...Array.from({ length: 10 }, (_, k) => ({ color: '#f6b65a', tam: 0.04, fase: (k / 10) * Math.PI * 2 + 0.3 }))] },
    ],
    [],
  );

  useFrame((state) => {
    if (t0.current === null) t0.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - t0.current;
    const k = reducir ? 1 : easeOut(t / INTRO);
    const ax = apunta.current;
    camera.position.set(ax.x * 1.1, 1.2 + -ax.y * 0.7, 32 - 20.5 * k);
    camera.lookAt(0, 0, 0);
    if (sistema.current) {
      sistema.current.rotation.y = (1 - k) * 1.4 + (reducir ? 0 : Math.sin(t * 0.12) * 0.15);
      sistema.current.scale.setScalar(0.6 + 0.4 * k);
    }
    uniforms.uTime.value = reducir ? 1.5 : t;
    if (reducir && t < 0.2) invalidate();
  });

  return (
    <>
      <Estrellas n={reducir ? 600 : 1400} mapa={mapa} />
      <group ref={sistema} rotation={[0.25, 0, -0.12]}>
        <mesh>
          <sphereGeometry args={[1.25, 48, 36]} />
          <shaderMaterial ref={nucleo} vertexShader={VERT} fragmentShader={FRAG_NUCLEO} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
        <Halo color="#6fe9ff" escala={5.2} opacidad={0.55} mapa={mapa} />
        <Halo color="#8b7bff" escala={8.5} opacidad={0.22} mapa={mapa} />
        {orbitas.map((o, k) => (
          <Orbita key={k} {...o} mapa={mapa} />
        ))}
      </group>
    </>
  );
}

export default function EscenaExamen({ reducir }: { reducir: boolean }) {
  const caja = useRef<HTMLDivElement>(null);
  const apunta = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [pestana, setPestana] = useState(() => document.visibilityState !== 'hidden');

  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    const vis = () => setPestana(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', vis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', vis);
    };
  }, []);

  useEffect(() => {
    if (reducir) return;
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      apunta.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, [reducir]);

  const frameloop = !visible || !pestana ? 'never' : reducir ? 'demand' : 'always';
  return (
    <div ref={caja} className="exe-caja" aria-hidden="true">
      <Canvas frameloop={frameloop} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', stencil: false }} camera={{ fov: 38, near: 0.1, far: 200, position: [0, 1.2, 30] }}>
        <Mundo reducir={reducir} apunta={apunta} />
      </Canvas>
    </div>
  );
}
