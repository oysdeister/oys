import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon';
import { rng, type EscenaProps, type PlanetaDato } from './tipos';

/* =====================================================================
   Escena de la portada: galaxia, núcleo de cristal con el % global,
   el arco O&S como anillo de neón y los seis módulos como planetas.
   ===================================================================== */

const R = 3.3; // radio de la órbita
const ELEV = 0.72; // elevación de la cámara (rad)
const FOV = 36;
const INTRO = 2.6; // s

const V1 = new THREE.Vector3();
const V2 = new THREE.Vector3();
const Q1 = new THREE.Quaternion();
const ANCHOS = new WeakMap<HTMLElement, number>();
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeBack = (t: number) => {
  const x = clamp01(t);
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

/* ---------- Shaders ---------- */

const VERT_PUNTOS = /* glsl */ `
  attribute float aSize; attribute vec3 aColor; attribute float aPhase;
  uniform float uTime; uniform float uPx; uniform float uScale;
  varying vec3 vColor; varying float vTw;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = 0.62 + 0.38 * sin(uTime * (0.5 + aPhase * 1.8) + aPhase * 43.0);
    vColor = aColor;
    gl_PointSize = aSize * uPx * uScale / max(0.1, -mv.z);
  }
`;
const FRAG_PUNTOS = /* glsl */ `
  varying vec3 vColor; varying float vTw;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * 0.8 + smoothstep(0.16, 0.0, d);
    gl_FragColor = vec4(vColor * vTw, a * vTw);
  }
`;

const VERT_FRESNEL = /* glsl */ `
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vP = position;
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_FRESNEL = /* glsl */ `
  uniform vec3 uColor; uniform float uI; uniform float uP;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), uP);
    gl_FragColor = vec4(uColor * f * uI, f);
  }
`;
/** Interior del núcleo: energía azul que se mueve despacio */
const FRAG_ENERGIA = /* glsl */ `
  uniform float uTime;
  varying vec3 vN; varying vec3 vV; varying vec3 vP;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), 1.6);
    float s = 0.5 + 0.5 * sin(vP.y * 5.0 + uTime * 0.9 + sin(vP.x * 4.0 + uTime * 0.7) * 1.6);
    float s2 = 0.5 + 0.5 * sin(vP.z * 6.0 - uTime * 0.6 + cos(vP.y * 3.0) * 2.0);
    vec3 col = mix(vec3(0.06, 0.22, 0.65), vec3(0.2, 0.95, 0.85), s * s2);
    col = mix(col, vec3(0.55, 0.45, 1.0), smoothstep(0.6, 1.0, s2) * 0.5);
    float a = 0.18 + 0.55 * f;
    gl_FragColor = vec4(col * a * 0.9, a);
  }
`;
/** El arco O&S: tubo de neón con degradado turquesa → cian → violeta, se enciende al entrar */
const VERT_ARCO = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FRAG_ARCO = /* glsl */ `
  uniform float uIg; uniform float uTime; uniform float uI;
  varying vec2 vUv;
  void main() {
    float a = vUv.x;
    vec3 c1 = vec3(0.37, 0.94, 0.82), c2 = vec3(0.44, 0.91, 1.0), c3 = vec3(0.6, 0.5, 1.0);
    vec3 col = a < 0.5 ? mix(c1, c2, a * 2.0) : mix(c2, c3, (a - 0.5) * 2.0);
    float forma = smoothstep(0.0, 0.16, a) * smoothstep(1.0, 0.84, a);
    forma = 0.1 + 0.9 * forma;
    float rev = smoothstep(a - 0.05, a, uIg * 1.06);
    float p = fract(uTime * 0.07);
    float dp = fract(a - p + 0.5) - 0.5;
    float pulso = exp(-dp * dp * 900.0);
    float I = (forma * 0.95 + pulso * 1.6 * forma) * rev * uI;
    gl_FragColor = vec4(col * I, 1.0);
  }
`;

/* ---------- Texturas generadas (sin descargas) ---------- */

function texturaNube(seed: number) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d')!;
  const r = rng(seed);
  for (let i = 0; i < 26; i++) {
    const x = 128 + (r() - 0.5) * 140;
    const y = 128 + (r() - 0.5) * 110;
    const rad = 30 + r() * 80;
    const gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, `rgba(255,255,255,${0.1 + r() * 0.12})`);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 256, 256);
  }
  // bordes suaves: sin cortes rectos del sprite
  g.globalCompositeOperation = 'destination-in';
  const m = g.createRadialGradient(128, 128, 20, 128, 128, 128);
  m.addColorStop(0, 'rgba(0,0,0,1)');
  m.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = m;
  g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function texturaPlaneta(hex: string, seed: number) {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  const r = rng(seed);
  const base = new THREE.Color(hex);
  const f1 = 0.12 + r() * 0.1;
  const f2 = 0.03 + r() * 0.03;
  for (let y = 0; y < 128; y++) {
    const banda = Math.sin(y * f1 + seed) * 0.5 + Math.sin(y * f2 + seed * 2) * 0.5;
    const col = base.clone().offsetHSL((r() - 0.5) * 0.015, 0.02, banda * 0.1 + (r() - 0.5) * 0.025);
    g.fillStyle = `#${col.getHexString()}`;
    g.fillRect(0, y, 256, 1);
  }
  for (let i = 0; i < 18; i++) {
    g.fillStyle = r() > 0.5 ? `rgba(255,255,255,${0.05 + r() * 0.08})` : `rgba(0,10,40,${0.05 + r() * 0.08})`;
    g.beginPath();
    g.ellipse(r() * 256, r() * 128, 10 + r() * 46, 1.5 + r() * 5, 0, 0, Math.PI * 2);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  return t;
}

/* ---------- Estrellas, galaxia, nebulosa y polvo ---------- */

function materialPuntos(px: number, scale: number) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT_PUNTOS,
    fragmentShader: FRAG_PUNTOS,
    uniforms: { uTime: { value: 0 }, uPx: { value: px }, uScale: { value: scale } },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

const PALETA_ESTRELLAS = ['#ffffff', '#dcecff', '#bff8ee', '#cfc6ff', '#fff1d6'].map((h) => new THREE.Color(h));

function Estrellas({ n, px, reducir }: { n: number; px: number; reducir: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const r = rng(1311);
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const ph = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      // cascarón esférico, más denso detrás de la órbita
      const u = r() * 2 - 1;
      const th = r() * Math.PI * 2;
      const rad = 16 + r() * 50;
      const s = Math.sqrt(1 - u * u);
      pos[i * 3] = rad * s * Math.cos(th);
      pos[i * 3 + 1] = rad * u * 0.8;
      pos[i * 3 + 2] = rad * s * Math.sin(th) - 6;
      const c = PALETA_ESTRELLAS[Math.floor(r() * PALETA_ESTRELLAS.length)];
      const b = 0.55 + r() * 0.6;
      col[i * 3] = c.r * b;
      col[i * 3 + 1] = c.g * b;
      col[i * 3 + 2] = c.b * b;
      size[i] = r() < 0.04 ? 2.6 + r() * 1.6 : 0.7 + r() * 1.1;
      ph[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    return { geo: g, mat: materialPuntos(px, 26) };
  }, [n, px]);
  useFrame((st, dt) => {
    mat.uniforms.uTime.value = reducir ? 0 : st.clock.elapsedTime;
    if (!reducir && ref.current) ref.current.rotation.y += dt * 0.006;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

function Galaxia({ n, px, reducir }: { n: number; px: number; reducir: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const r = rng(777);
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const ph = new Float32Array(n);
    const dentro = new THREE.Color('#fff0d8');
    const medio = new THREE.Color('#6fe9ff');
    const fuera = new THREE.Color('#8b7bff');
    const brazos = 4;
    for (let i = 0; i < n; i++) {
      const rad = Math.pow(r(), 1.5) * 11;
      const brazo = ((i % brazos) / brazos) * Math.PI * 2;
      const giro = rad * 0.55;
      const disp = (k: number) => Math.pow(r(), 3) * (r() < 0.5 ? 1 : -1) * k * (0.25 + rad * 0.12);
      pos[i * 3] = Math.cos(brazo + giro) * rad + disp(1.2);
      pos[i * 3 + 1] = disp(0.35);
      pos[i * 3 + 2] = Math.sin(brazo + giro) * rad + disp(1.2);
      const t = rad / 11;
      const c = t < 0.35 ? dentro.clone().lerp(medio, t / 0.35) : medio.clone().lerp(fuera, (t - 0.35) / 0.65);
      const b = 0.35 + r() * 0.45;
      col[i * 3] = c.r * b;
      col[i * 3 + 1] = c.g * b;
      col[i * 3 + 2] = c.b * b;
      size[i] = 0.5 + r() * 1.2 + (rad < 1.4 ? 1.2 : 0);
      ph[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    return { geo: g, mat: materialPuntos(px, 30) };
  }, [n, px]);
  useFrame((st, dt) => {
    mat.uniforms.uTime.value = reducir ? 0 : st.clock.elapsedTime;
    if (!reducir && ref.current) ref.current.rotation.y += dt * 0.02;
  });
  return (
    <group position={[10, 5, -30]} rotation={[0.95, 0.2, -0.35]} scale={1.7}>
      <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
    </group>
  );
}

function Nebulosa() {
  const tex = useMemo(() => [texturaNube(11), texturaNube(23), texturaNube(37)], []);
  const nubes: { p: [number, number, number]; s: number; c: string; o: number; t: number }[] = [
    { p: [-9, 3, -24], s: 30, c: '#1fd1b8', o: 0.34, t: 0 },
    { p: [9, 6, -30], s: 36, c: '#6b4dff', o: 0.4, t: 1 },
    { p: [2, -7, -22], s: 28, c: '#2357ff', o: 0.34, t: 2 },
    { p: [12, -2, -18], s: 18, c: '#36c9e6', o: 0.16, t: 0 },
    { p: [-4, 8, -34], s: 34, c: '#8b5cff', o: 0.18, t: 2 },
  ];
  return (
    <group>
      {nubes.map((n, i) => (
        <sprite key={i} position={n.p} scale={[n.s, n.s * 0.7, 1]}>
          <spriteMaterial map={tex[n.t]} color={n.c} transparent opacity={n.o} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  );
}

function Polvo({ n, px, reducir }: { n: number; px: number; reducir: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const { geo, mat } = useMemo(() => {
    const r = rng(4242);
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const ph = new Float32Array(n);
    const a = new THREE.Color('#7ff5dd');
    const b = new THREE.Color('#a99cff');
    for (let i = 0; i < n; i++) {
      const th = r() * Math.PI * 2;
      const g = (r() + r() + r() - 1.5) * 0.45;
      const rad = R + g;
      pos[i * 3] = Math.cos(th) * rad;
      pos[i * 3 + 1] = (r() - 0.5) * 0.12;
      pos[i * 3 + 2] = Math.sin(th) * rad;
      const c = a.clone().lerp(b, (Math.sin(th) + 1) / 2);
      const k = 0.35 + r() * 0.5;
      col[i * 3] = c.r * k;
      col[i * 3 + 1] = c.g * k;
      col[i * 3 + 2] = c.b * k;
      size[i] = 0.4 + r() * 0.9;
      ph[i] = r();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(ph, 1));
    return { geo, mat: materialPuntos(px, 9) };
  }, [n, px]);
  useFrame((st, dt) => {
    mat.uniforms.uTime.value = reducir ? 0 : st.clock.elapsedTime;
    if (!reducir && ref.current) ref.current.rotation.y -= dt * 0.03;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

/* ---------- El arco O&S y las órbitas guía ---------- */

function Arco({ reducir, inicio }: { reducir: boolean; inicio: { current: number } }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_ARCO,
        fragmentShader: FRAG_ARCO,
        uniforms: { uIg: { value: reducir ? 1 : 0 }, uTime: { value: 0 }, uI: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [reducir],
  );
  const halo = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_ARCO,
        fragmentShader: FRAG_ARCO,
        uniforms: { uIg: { value: reducir ? 1 : 0 }, uTime: { value: 0 }, uI: { value: 0.05 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [reducir],
  );
  useFrame((st) => {
    const t = st.clock.elapsedTime - inicio.current;
    const ig = reducir ? 1 : easeOut((t - 0.35) / 1.7);
    mat.uniforms.uIg.value = ig;
    halo.uniforms.uIg.value = ig;
    const tt = reducir ? 0.3 : st.clock.elapsedTime;
    mat.uniforms.uTime.value = tt;
    halo.uniforms.uTime.value = tt;
  });
  const guias = useMemo(() => {
    const mk = (rad: number) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 160; i++) {
        const a = (i / 160) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * rad, 0, Math.sin(a) * rad));
      }
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      return g;
    };
    return [mk(R * 1.32), mk(R * 0.62), mk(R * 1.62)];
  }, []);
  // El tubo empieza (uv.x = 0) en el extremo apagado: lo giramos para que la abertura quede detrás, arriba a la izquierda
  return (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 2.3]} material={mat}>
        <torusGeometry args={[R, 0.032, 12, 360]} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 2.3]} material={halo}>
        <torusGeometry args={[R, 0.16, 12, 240]} />
      </mesh>
      {guias.map((g, i) => (
        <lineLoop key={i} geometry={g}>
          <lineBasicMaterial color={i === 1 ? '#6fe9ff' : '#9ab8ff'} transparent opacity={i === 2 ? 0.08 : 0.16} depthWrite={false} />
        </lineLoop>
      ))}
    </group>
  );
}

/* ---------- Núcleo de cristal ---------- */

function Nucleo({ global, reducir, inicio }: { global: number; reducir: boolean; inicio: { current: number } }) {
  const grupo = useRef<THREE.Group>(null);
  const anillo = useRef<THREE.Group>(null);
  const energia = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_FRESNEL,
        fragmentShader: FRAG_ENERGIA,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const rim = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_FRESNEL,
        fragmentShader: FRAG_FRESNEL,
        uniforms: { uColor: { value: new THREE.Color('#6ff5ff') }, uI: { value: 2.2 }, uP: { value: 3.2 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );
  const v = clamp01(global);
  useFrame((st, dt) => {
    energia.uniforms.uTime.value = reducir ? 1 : st.clock.elapsedTime;
    const t = st.clock.elapsedTime - inicio.current;
    const s = reducir ? 1 : easeBack((t - 0.1) / 1.1);
    grupo.current?.scale.setScalar(Math.max(0.001, s));
    if (!reducir && anillo.current) anillo.current.rotation.z += dt * 0.15;
  });
  return (
    <group ref={grupo}>
      <mesh>
        <sphereGeometry args={[0.78, 48, 48]} />
        <primitive object={energia} attach="material" />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.12, 64, 64]} />
        <meshPhysicalMaterial color="#123a8c" transparent opacity={0.4} roughness={0.04} metalness={0} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={2.2} depthWrite={false} />
      </mesh>
      <mesh scale={1.015}>
        <sphereGeometry args={[1.12, 64, 64]} />
        <primitive object={rim} attach="material" />
      </mesh>
      {/* Anillo de avance global, inclinado como un giroscopio */}
      <group rotation={[1.25, 0.25, 0]}>
        <group ref={anillo}>
          <mesh>
            <torusGeometry args={[1.42, 0.012, 8, 160]} />
            <meshBasicMaterial color="#9ab8ff" transparent opacity={0.25} depthWrite={false} />
          </mesh>
          {v > 0.004 && (
            <mesh>
              <torusGeometry args={[1.42, 0.03, 10, 200, Math.PI * 2 * v]} />
              <meshBasicMaterial color={new THREE.Color(0.5, 2.2, 1.9)} toneMapped={false} />
            </mesh>
          )}
        </group>
      </group>
    </group>
  );
}

/* ---------- Reflejos del cristal (sin descargas) ---------- */

function Entorno() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const sala = new RoomEnvironment();
    const env = pmrem.fromScene(sala, 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      env.dispose();
      sala.dispose?.();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/** Grupo que siempre mira a la cámara (anillo de progreso del planeta) */
function Cara({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((st) => {
    const g = ref.current;
    if (!g || !g.parent) return;
    g.parent.getWorldQuaternion(Q1);
    g.quaternion.copy(Q1.invert().multiply(st.camera.quaternion));
  });
  return <group ref={ref}>{children}</group>;
}

/* ---------- Planetas ---------- */

function Planeta3D({
  d,
  i,
  n,
  activo,
  hover,
  setHover,
  onIr,
  reducir,
  inicio,
  giro,
  radio,
  etiqueta,
}: {
  d: PlanetaDato;
  i: number;
  n: number;
  activo: boolean;
  hover: string | null;
  setHover: (id: string | null) => void;
  onIr: (id: string) => void;
  reducir: boolean;
  inicio: { current: number };
  giro: { current: number };
  radio: number;
  etiqueta: () => HTMLElement | null;
}) {
  const pos = useRef<THREE.Group>(null);
  const cuerpo = useRef<THREE.Group>(null);
  const esfera = useRef<THREE.Mesh>(null);
  const tex = useMemo(() => texturaPlaneta(d.color, 101 + i * 37), [d.color, i]);
  const col = useMemo(() => new THREE.Color(d.color), [d.color]);
  const atm = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_FRESNEL,
        fragmentShader: FRAG_FRESNEL,
        uniforms: { uColor: { value: col.clone().lerp(new THREE.Color('#ffffff'), 0.25) }, uI: { value: 1.4 }, uP: { value: 2.4 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [col],
  );
  const arcoCol = useMemo(() => col.clone().lerp(new THREE.Color('#ffffff'), 0.2).multiplyScalar(2.2), [col]);
  const sobre = hover === d.id;
  const base = -Math.PI / 2 + (i / n) * Math.PI * 2 + 0.35;
  const v = clamp01(d.valor);
  const rr = radio * (activo ? 1.12 : 1);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime - inicio.current;
    const ang = base + giro.current;
    pos.current?.position.set(Math.cos(ang) * R, 0, Math.sin(ang) * R);
    const aparece = reducir ? 1 : easeBack((t - 1.0 - i * 0.13) / 0.6);
    const objetivo = (sobre ? 1.3 : 1) * aparece;
    const c = cuerpo.current;
    if (c) {
      const s = reducir ? objetivo : THREE.MathUtils.damp(c.scale.x, objetivo, 10, dt);
      c.scale.setScalar(Math.max(0.001, s));
    }
    if (esfera.current && !reducir) esfera.current.rotation.y += dt * 0.25;
    const ia = (sobre ? 3.2 : activo ? 2.1 : 1.3) * (reducir ? 1 : 0.85 + 0.15 * Math.sin(st.clock.elapsedTime * 1.6 + i));
    atm.uniforms.uI.value = reducir ? ia : THREE.MathUtils.damp(atm.uniforms.uI.value, ia, 8, dt);
    // Etiqueta HTML: debajo del planeta en pantalla, delante o detrás según la profundidad
    const el = etiqueta();
    if (el && pos.current) {
      pos.current.getWorldPosition(V1);
      V2.set(0, 1, 0).applyQuaternion(st.camera.quaternion).multiplyScalar(-rr * 1.58 * Math.max(c?.scale.x ?? 1, 0.6));
      V1.add(V2).project(st.camera);
      let ancho = ANCHOS.get(el);
      if (!ancho) {
        ancho = el.offsetWidth;
        if (ancho) ANCHOS.set(el, ancho);
      }
      const media = (ancho ?? 0) / 2 + 6;
      const x = Math.max(media, Math.min(st.size.width - media, ((V1.x + 1) / 2) * st.size.width));
      const y = ((1 - V1.y) / 2) * st.size.height;
      // Con 10 módulos las etiquetas del fondo se pisan: las de detrás, más pequeñas y tenues
      const fondo = sobre || activo ? 1 : (Math.sin(ang) + 1) / 2;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, 0) scale(${(0.8 + 0.2 * fondo).toFixed(3)})`;
      el.style.zIndex = String(Math.round((1 - V1.z) * 1000) + 10);
      el.style.opacity = String(clamp01(reducir ? 1 : (t - 1.2 - i * 0.13) / 0.5) * (0.6 + 0.4 * fondo));
    }
  });

  return (
    <group ref={pos}>
      <group ref={cuerpo}>
        <mesh
          ref={esfera}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(d.id);
          }}
          onPointerOut={() => setHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onIr(d.id);
          }}
        >
          <sphereGeometry args={[rr, 48, 48]} />
          <meshStandardMaterial map={tex} roughness={0.55} metalness={0.05} emissive={col} emissiveIntensity={sobre ? 0.42 : 0.16} envMapIntensity={0.6} />
        </mesh>
        <mesh scale={1.1}>
          <sphereGeometry args={[rr, 32, 32]} />
          <primitive object={atm} attach="material" />
        </mesh>
        {/* Área de clic más generosa (dedos) */}
        <mesh
          visible={false}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHover(d.id);
          }}
          onPointerOut={() => setHover(null)}
          onClick={(e) => {
            e.stopPropagation();
            onIr(d.id);
          }}
        >
          <sphereGeometry args={[rr * 1.9, 12, 12]} />
        </mesh>
        <Cara>
          <mesh>
            <ringGeometry args={[rr * 1.42, rr * 1.5, 64]} />
            <meshBasicMaterial color={col} transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
          {v > 0.004 && (
            <mesh>
              <ringGeometry args={[rr * 1.38, rr * 1.56, 96, 1, Math.PI / 2 - Math.PI * 2 * v, Math.PI * 2 * v]} />
              <meshBasicMaterial color={arcoCol} toneMapped={false} side={THREE.DoubleSide} />
            </mesh>
          )}
        </Cara>
      </group>
    </group>
  );
}

/* ---------- Cámara: encuadre, entrada y reacción al ratón y al móvil ---------- */

function Camara({ centrada, reducir, inicio, apunta, elev }: { elev: number; centrada: boolean; reducir: boolean; inicio: { current: number }; apunta: { current: { x: number; y: number } } }) {
  const { camera, size } = useThree();
  const dist = useRef(12);
  const suave = useRef({ x: 0, y: 0 });
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const tan = Math.tan(THREE.MathUtils.degToRad(FOV / 2));
    // Cuánto mundo hace falta ver alrededor del origen
    const shift = centrada ? 0 : 0.2; // el origen queda en el 70 % del ancho
    const fraccion = (0.5 - shift) / 0.5;
    const needW = R * (centrada ? 1.3 : 1.18);
    const needH = R * Math.sin(elev) + (centrada ? 1.9 : 1.35);
    const dW = needW / (tan * aspect * fraccion);
    const dH = needH / tan;
    dist.current = Math.max(dW, dH, 8);
    cam.fov = FOV;
    // Escritorio: el origen a la derecha. Centrada: un poco hacia arriba, para que las etiquetas de delante no rocen el titular
    cam.setViewOffset(size.width, size.height, -shift * size.width, size.height * (centrada ? 0.06 : 0.02), size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height, centrada, elev]);

  useFrame((st, dt) => {
    const t = st.clock.elapsedTime - inicio.current;
    const k = reducir ? 1 : easeOut(t / INTRO);
    const objetivo = reducir ? { x: 0, y: 0 } : apunta.current;
    suave.current.x = THREE.MathUtils.damp(suave.current.x, objetivo.x, 2.4, dt);
    suave.current.y = THREE.MathUtils.damp(suave.current.y, objetivo.y, 2.4, dt);
    const az = suave.current.x * 0.22 - (1 - k) * 0.9;
    const el = elev + suave.current.y * 0.1 - (1 - k) * 0.42;
    const d = dist.current * (1 + (1 - k) * 1.5);
    camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ---------- Todo junto ---------- */

interface Capa {
  movil: boolean;
  apunta: { current: { x: number; y: number } };
  hover: string | null;
  setHover: (id: string | null) => void;
  etiquetas: { current: Record<string, HTMLElement | null> };
  nucleo: { current: HTMLElement | null };
}

/** Coloca el % del núcleo en el centro proyectado de la escena */
function SigueNucleo({ nucleo }: { nucleo: { current: HTMLElement | null } }) {
  useFrame((st) => {
    const el = nucleo.current;
    if (!el) return;
    V1.set(0, 0, 0).project(st.camera);
    el.style.transform = `translate3d(${(((V1.x + 1) / 2) * st.size.width).toFixed(1)}px, ${(((1 - V1.y) / 2) * st.size.height).toFixed(1)}px, 0) translate(-50%, -50%)`;
  });
  return null;
}

function Mundo({ planetas, global, activo, reducir, centrada, onIr, movil, apunta, hover, setHover, etiquetas, nucleo }: EscenaProps & Capa) {
  const inicio = useRef(0);
  const giro = useRef(0);
  const velGiro = useRef(1);
  const { gl, invalidate, clock, size } = useThree();
  useLayoutEffect(() => {
    inicio.current = clock.elapsedTime;
  }, [clock]);
  const px = Math.min(gl.getPixelRatio(), 2);
  // En pantallas estrechas la órbita se ve más de frente: los planetas no tapan el %
  const elev = centrada ? (size.width < 600 ? 1.02 : 0.9) : ELEV;

  // Sin animación (frameloop «demand»): unos cuantos fotogramas al montar para encuadrar cámara y etiquetas
  useEffect(() => {
    if (!reducir) return;
    let n = 0;
    let id = 0;
    const tic = () => {
      invalidate();
      if (++n < 20) id = requestAnimationFrame(tic);
    };
    id = requestAnimationFrame(tic);
    return () => cancelAnimationFrame(id);
  }, [reducir, invalidate, size.width, size.height]);

  useEffect(() => {
    document.body.style.cursor = hover ? 'pointer' : '';
    invalidate();
    return () => {
      document.body.style.cursor = '';
    };
  }, [hover, invalidate]);

  useFrame((_, dt) => {
    if (reducir) return;
    velGiro.current = THREE.MathUtils.damp(velGiro.current, hover ? 0 : 1, 5, dt);
    giro.current += dt * 0.055 * velGiro.current;
  });

  return (
    <>
      <color attach="background" args={['#040b28']} />
      <fog attach="fog" args={['#040b28', 30, 80]} />
      <Camara centrada={centrada} reducir={reducir} inicio={inicio} apunta={apunta} elev={elev} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 0, 0]} intensity={26} color="#c4f6ff" distance={0} decay={2} />
      <directionalLight position={[-5, 7, 6]} intensity={0.9} color="#b7c6ff" />
      <Entorno />

      <Estrellas n={movil ? 1400 : 3600} px={px} reducir={reducir} />
      {/* El fondo se orienta hacia donde mira la cámara */}
      <group rotation={[-elev, 0, 0]}>
        <Galaxia n={movil ? 2600 : 7000} px={px} reducir={reducir} />
        <Nebulosa />
      </group>

      <group rotation={[0.06, 0, -0.16]}>
        <Arco reducir={reducir} inicio={inicio} />
        <Polvo n={movil ? 700 : 1800} px={px} reducir={reducir} />
        <Nucleo global={global} reducir={reducir} inicio={inicio} />
        {planetas.map((d, i) => (
          <Planeta3D
            key={d.id}
            d={d}
            i={i}
            n={planetas.length}
            activo={d.id === activo}
            hover={hover}
            setHover={setHover}
            onIr={onIr}
            reducir={reducir}
            inicio={inicio}
            giro={giro}
            radio={centrada && movil ? 0.46 : 0.42}
            etiqueta={() => etiquetas.current[d.id] ?? null}
          />
        ))}
      </group>

      <SigueNucleo nucleo={nucleo} />

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.62} luminanceSmoothing={0.22} radius={0.78} />
        <Vignette offset={0.32} darkness={0.55} />
      </EffectComposer>
    </>
  );
}

export default function EscenaPortada(props: EscenaProps) {
  const caja = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [pestana, setPestana] = useState(() => document.visibilityState !== 'hidden');
  const apunta = useRef({ x: 0, y: 0 });
  const [hover, setHover] = useState<string | null>(null);
  const etiquetas = useRef<Record<string, HTMLElement | null>>({});
  const nucleo = useRef<HTMLDivElement>(null);
  const pctGlobal = Math.round(clamp01(props.global) * 100);
  const movil = useMemo(() => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches, []);

  // Pausa cuando no se ve (fuera de pantalla o pestaña oculta)
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

  // La cámara sigue al ratón (en toda la portada) y a la inclinación del móvil
  useEffect(() => {
    if (props.reducir) return;
    const mover = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      apunta.current = { x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 };
    };
    const inclinar = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || e.beta == null) return;
      apunta.current = { x: Math.max(-1, Math.min(1, e.gamma / 25)), y: Math.max(-1, Math.min(1, (e.beta - 50) / 30)) };
    };
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('deviceorientation', inclinar, { passive: true });
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('deviceorientation', inclinar);
    };
  }, [props.reducir]);

  const frameloop = !visible || !pestana ? 'never' : props.reducir ? 'demand' : 'always';

  return (
    <div ref={caja} className="e3-caja">
      <Canvas
        frameloop={frameloop}
        dpr={movil ? [1, 1.5] : [1, 1.75]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false }}
        camera={{ fov: FOV, near: 0.1, far: 200, position: [0, 6, 16] }}
      >
        <Mundo {...props} movil={movil} apunta={apunta} hover={hover} setHover={setHover} etiquetas={etiquetas} nucleo={nucleo} />
      </Canvas>
      {/* Capa HTML (fuera del canvas): % global y etiquetas de los planetas, legibles y enfocables */}
      <div className="e3-capa">
        <div ref={nucleo} className="e3-core-pos">
          <div className="e3-core" role="img" aria-label={`${pctGlobal} % de tu formación`}>
            <span className="e3-core-pct">
              {pctGlobal}
              <small>%</small>
            </span>
            <span className="e3-core-et">de tu formación</span>
          </div>
        </div>
        {props.planetas.map((d) => {
          const pct = Math.round(clamp01(d.valor) * 100);
          return (
            <div
              key={d.id}
              ref={(el) => {
                etiquetas.current[d.id] = el;
              }}
              className={`e3-tag${hover === d.id ? ' on' : ''}${props.activo === d.id ? ' act' : ''}`}
              style={{ ['--mod' as string]: d.color, opacity: 0 }}
            >
              <Link
                to={`/modulo/${d.id}`}
                tabIndex={-1}
                onMouseEnter={() => setHover(d.id)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(d.id)}
                onBlur={() => setHover(null)}
                aria-label={`${d.nombre}, ${pct} % completado`}
              >
                <span className="e3-tag-ico" aria-hidden="true">
                  <Icon name={d.icono} size={14} />
                </span>
                <b>{d.nombre}</b>
                <small>{pct} %</small>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
