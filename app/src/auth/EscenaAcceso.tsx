/**
 * Escena 3D de la pantalla de acceso (se carga en diferido).
 *
 * Intro (≈3,5 s, se puede saltar): las estrellas llegan en «salto», el arco O&S se dibuja con una chispa,
 * se enciende el núcleo de cristal y los módulos del curso entran en órbita uno a uno mientras la cámara se aleja.
 * Después la escena acompaña al acceso: se aviva al escribir, gira rápido al enviar, late en ámbar esperando
 * el código, se tiñe al fallar y hace un salto hacia el núcleo al entrar.
 * Con movimiento reducido no hay intro ni animación: se pinta quieta.
 */
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { rng } from '../components/escena3d/tipos';
import { INTRO_ESCENA } from './config';

export type FaseEscena = 'reposo' | 'escribiendo' | 'enviando' | 'codigo' | 'error' | 'ok';

interface Props {
  fase: FaseEscena;
  oscuro: boolean;
  reducir: boolean;
  /** true: se salta la intro y se coloca todo en su sitio */
  sinIntro: boolean;
}


/** Colores de los módulos (maestros, compras, ventas, contabilidad, cartera, tesorería, impuestos, activos) */
const MODULOS = ['#4fbfa5', '#6c8fd6', '#f2a93b', '#8c6ef0', '#e0708a', '#3fb6d9', '#9bd35a', '#c98a5a'];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const easeBack = (t: number) => {
  const x = clamp01(t);
  return 1 + 2.70158 * Math.pow(x - 1, 3) + 1.70158 * Math.pow(x - 1, 2);
};

const VERT = /* glsl */ `
  attribute float aSize; attribute vec3 aColor; attribute float aPhase;
  uniform float uTime; uniform float uPx; uniform float uWarp; uniform float uAparece;
  varying vec3 vColor; varying float vTw;
  void main() {
    vec3 p = position;
    p.z += uWarp * 26.0 * (0.3 + aPhase);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    vTw = (0.6 + 0.4 * sin(uTime * (0.6 + aPhase * 1.7) + aPhase * 40.0)) * smoothstep(aPhase * 0.8, aPhase * 0.8 + 0.2, uAparece);
    vColor = aColor;
    gl_PointSize = aSize * uPx * (1.0 + uWarp * 3.0) / max(0.1, -mv.z);
  }
`;
const FRAG_OSCURO = /* glsl */ `
  varying vec3 vColor; varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * 0.8 + smoothstep(0.15, 0.0, d);
    gl_FragColor = vec4(vColor * vTw, a * vTw);
  }
`;
const FRAG_CLARO = /* glsl */ `
  varying vec3 vColor; varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.1, d);
    gl_FragColor = vec4(vColor, a * (0.3 + 0.5 * vTw));
  }
`;

/** Anillo que se dibuja: el tubo va de uv.x = 0 a 1 a lo largo del arco */
const VERT_ARCO = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const FRAG_ARCO = /* glsl */ `
  uniform vec3 uColor; uniform float uProg; uniform float uI; uniform float uTime;
  varying vec2 vUv;
  void main() {
    if (vUv.x > uProg) discard;
    float cola = smoothstep(0.0, 0.25, vUv.x);               // el arranque del arco se apaga, como en el logo
    float cabeza = smoothstep(uProg - 0.06, uProg, vUv.x);    // la punta que avanza brilla más
    float flujo = 0.75 + 0.25 * sin(vUv.x * 40.0 - uTime * 3.0);
    vec3 c = uColor * uI * (0.35 + 0.65 * cola) * flujo + vec3(1.0) * cabeza * 1.5 * step(uProg, 0.999);
    gl_FragColor = vec4(c, 0.35 + 0.65 * cola);
  }
`;

const VERT_FRESNEL = /* glsl */ `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const FRAG_FRESNEL = /* glsl */ `
  uniform vec3 uColor; uniform float uI;
  varying vec3 vN; varying vec3 vV;
  void main() {
    float f = pow(1.0 - abs(dot(vN, vV)), 3.0);
    gl_FragColor = vec4(uColor * f * uI, f * clamp(uI, 0.0, 1.0));
  }
`;

/** Estado animado compartido (sin re-render de React) */
interface Pulso {
  vel: number;
  brillo: number;
  warp: number;
  color: THREE.Color;
  /** segundos de intro transcurridos (INTRO_ESCENA o más = terminada) */
  t: number;
}

const COLOR_FASE: Record<FaseEscena, string> = {
  reposo: '#4fbfa5',
  escribiendo: '#5fd8bd',
  enviando: '#7aa2ff',
  codigo: '#f2b65a',
  error: '#ff7a8f',
  ok: '#9ef0dc',
};

function puntos(n: number, oscuro: boolean, px: number, forma: 'cielo' | 'galaxia', semilla: number) {
  const r = rng(semilla);
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const tam = new Float32Array(n);
  const fase = new Float32Array(n);
  const paleta = (oscuro ? ['#ffffff', '#cfe8ff', '#9ef0dc', '#b9a8ff', '#7aa2ff'] : ['#1d3f8f', '#2b6cb0', '#1f8f7a', '#5b47c9']).map((c) => new THREE.Color(c));
  const centro = new THREE.Color(oscuro ? '#fff4d6' : '#0e7a64');
  for (let i = 0; i < n; i++) {
    let x: number, y: number, z: number;
    let c = paleta[Math.floor(r() * paleta.length)];
    if (forma === 'cielo') {
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const rad = 25 + r() * 45;
      x = rad * Math.sin(ph) * Math.cos(th);
      y = rad * Math.sin(ph) * Math.sin(th);
      z = rad * Math.cos(ph);
    } else {
      // Espiral de cuatro brazos, más densa y cálida en el centro
      const brazo = Math.floor(r() * 4);
      const d = Math.pow(r(), 0.8) * 9 + 0.9;
      const a = brazo * (Math.PI / 2) + d * 0.6 + (r() - 0.5) * (0.9 - d * 0.04);
      x = Math.cos(a) * d + (r() - 0.5) * 0.5;
      z = Math.sin(a) * d + (r() - 0.5) * 0.5;
      y = (r() - 0.5) * 0.5 * (1 - d / 12);
      if (d < 2.6 && r() < 0.6) c = centro;
    }
    pos.set([x, y, z], i * 3);
    col.set([c.r, c.g, c.b], i * 3);
    tam[i] = (forma === 'cielo' ? 0.6 + r() * 1.6 : 0.35 + r() * 1.2) * (oscuro ? 1 : 0.85);
    fase[i] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  geo.setAttribute('aSize', new THREE.BufferAttribute(tam, 1));
  geo.setAttribute('aPhase', new THREE.BufferAttribute(fase, 1));
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: oscuro ? FRAG_OSCURO : FRAG_CLARO,
    uniforms: { uTime: { value: 0 }, uPx: { value: px * 60 }, uWarp: { value: 0 }, uAparece: { value: 1 } },
    transparent: true,
    depthWrite: false,
    blending: oscuro ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  return { geo, mat };
}

function Particulas({ n, forma, oscuro, reducir, pulso, semilla }: { n: number; forma: 'cielo' | 'galaxia'; oscuro: boolean; reducir: boolean; pulso: Pulso; semilla: number }) {
  const { gl } = useThree();
  const px = Math.min(gl.getPixelRatio(), 2);
  const { geo, mat } = useMemo(() => puntos(n, oscuro, px, forma, semilla), [n, oscuro, px, forma, semilla]);
  const ref = useRef<THREE.Points>(null);
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat]);
  useFrame((st, dt) => {
    const u = mat.uniforms;
    u.uTime.value = reducir ? 0 : st.clock.elapsedTime;
    if (forma === 'cielo') {
      // Intro: llegada en salto (estelas que se recogen)
      u.uWarp.value = Math.max(pulso.warp, 1 - easeOut(pulso.t / 1.5));
      u.uAparece.value = 1;
    } else {
      u.uAparece.value = easeOut((pulso.t - 0.5) / 2.2) * 1.2;
    }
    if (!reducir && ref.current) ref.current.rotation.y += dt * (forma === 'galaxia' ? 0.04 : 0.006) * pulso.vel;
  });
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}

/** El arco O&S: se dibuja en la intro y luego gira despacio con una chispa que lo recorre */
function Arco({ pulso, reducir, oscuro }: { pulso: Pulso; reducir: boolean; oscuro: boolean }) {
  const grupo = useRef<THREE.Group>(null);
  const chispa = useRef<THREE.Mesh>(null);
  const ARCO = Math.PI * 1.7;
  const R = 2.5;
  const mats = useMemo(
    () =>
      [0.04, 0.012].map(
        () =>
          new THREE.ShaderMaterial({
            vertexShader: VERT_ARCO,
            fragmentShader: FRAG_ARCO,
            uniforms: { uColor: { value: new THREE.Color() }, uProg: { value: 0 }, uI: { value: 1 }, uTime: { value: 0 } },
            transparent: true,
            depthWrite: false,
            blending: oscuro ? THREE.AdditiveBlending : THREE.NormalBlending,
            toneMapped: false,
          }),
      ),
    [oscuro],
  );
  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats]);
  useFrame((st, dt) => {
    const prog = easeInOut((pulso.t - 0.45) / 1.3);
    mats.forEach((m, i) => {
      m.uniforms.uProg.value = prog;
      m.uniforms.uColor.value.copy(pulso.color);
      m.uniforms.uI.value = (oscuro ? (i ? 0.9 : 2.2) : i ? 0.6 : 1) * pulso.brillo;
      m.uniforms.uTime.value = reducir ? 0 : st.clock.elapsedTime;
    });
    if (!reducir && grupo.current) grupo.current.rotation.z += dt * 0.1 * pulso.vel * prog;
    if (chispa.current) {
      const a = prog < 1 ? prog * ARCO : ((reducir ? 0.8 : st.clock.elapsedTime) * 0.8 * pulso.vel) % ARCO;
      chispa.current.position.set(Math.cos(a) * R, Math.sin(a) * R, 0);
      chispa.current.visible = prog > 0.01;
    }
  });
  return (
    <group rotation={[1.2, 0.2, 0]}>
      <group ref={grupo} rotation={[0, 0, 2.4]}>
        <mesh material={mats[0]}>
          <torusGeometry args={[R, 0.03, 12, 300, ARCO]} />
        </mesh>
        <mesh material={mats[1]} scale={[1, 1, 1]}>
          <torusGeometry args={[R * 1.18, 0.012, 8, 300, ARCO * 0.8]} />
        </mesh>
        <mesh ref={chispa}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial color={oscuro ? '#ffffff' : '#0e6b59'} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/** Núcleo de cristal: se enciende con un destello y queda latiendo */
function Nucleo({ pulso, reducir, oscuro }: { pulso: Pulso; reducir: boolean; oscuro: boolean }) {
  const grupo = useRef<THREE.Group>(null);
  const red = useRef<THREE.LineSegments>(null);
  const corazon = useRef<THREE.MeshBasicMaterial>(null);
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERT_FRESNEL,
        fragmentShader: FRAG_FRESNEL,
        uniforms: { uColor: { value: new THREE.Color('#9ef0dc') }, uI: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: oscuro ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    [oscuro],
  );
  const aristas = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.62, 1)), []);
  useEffect(() => () => (mat.dispose(), aristas.dispose()), [mat, aristas]);
  useFrame((st, dt) => {
    const enc = (pulso.t - 1.35) / 0.9;
    const s = easeBack(enc) * (1 + (reducir ? 0 : Math.sin(st.clock.elapsedTime * 1.6) * 0.03) + pulso.warp * 0.8);
    grupo.current?.scale.setScalar(Math.max(0.0001, s));
    // Destello al encenderse
    const flash = enc > 0 && enc < 1 ? Math.sin(enc * Math.PI) * 2.5 : 0;
    mat.uniforms.uColor.value.copy(pulso.color);
    mat.uniforms.uI.value = (oscuro ? 1.4 : 2.4) * pulso.brillo + flash;
    corazon.current?.color.copy(pulso.color).multiplyScalar(oscuro ? 1.2 + flash + pulso.warp * 3 : 0.8);
    if (reducir) return;
    if (grupo.current) grupo.current.rotation.y += dt * 0.25 * pulso.vel;
    if (red.current) {
      red.current.rotation.x -= dt * 0.3 * pulso.vel;
      red.current.rotation.z += dt * 0.2 * pulso.vel;
    }
  });
  return (
    <group ref={grupo}>
      <mesh material={mat}>
        <icosahedronGeometry args={[0.95, 5]} />
      </mesh>
      <lineSegments ref={red} geometry={aristas}>
        <lineBasicMaterial color={oscuro ? '#bff8ee' : '#1f6f8f'} transparent opacity={oscuro ? 0.6 : 0.75} />
      </lineSegments>
      <mesh>
        <icosahedronGeometry args={[0.2, 2]} />
        <meshBasicMaterial ref={corazon} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Los módulos del curso: entran en órbita uno a uno */
function Modulos({ pulso, reducir, oscuro }: { pulso: Pulso; reducir: boolean; oscuro: boolean }) {
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const orbitas = useMemo(
    () => MODULOS.map((c, i) => ({ color: c, r: 3.0 + (i % 3) * 0.45, incl: ((i * 37) % 50) / 100 - 0.25, vel: 0.16 + (i % 4) * 0.035, a0: (i / MODULOS.length) * Math.PI * 2, tam: 0.12 + (i % 3) * 0.035 })),
    [],
  );
  const giro = useRef(0);
  useFrame((_, dt) => {
    if (!reducir) giro.current += dt * pulso.vel;
    orbitas.forEach((o, i) => {
      const m = refs.current[i];
      if (!m) return;
      const llegada = easeOut((pulso.t - 1.9 - i * 0.12) / 0.9);
      const a = o.a0 + giro.current * o.vel - (1 - llegada) * 2.2;
      const r = o.r * (1 + pulso.warp * 0.8) * (1 + (1 - llegada) * 3);
      m.position.set(Math.cos(a) * r, Math.sin(a) * r * o.incl * 0.6, Math.sin(a) * r * 0.55);
      m.scale.setScalar(Math.max(0.0001, llegada));
    });
  });
  return (
    <group rotation={[0.5, 0, -0.12]}>
      {orbitas.map((o, i) => (
        <mesh key={o.color} ref={(m) => void (refs.current[i] = m)}>
          <sphereGeometry args={[o.tam, 24, 24]} />
          <meshStandardMaterial color={o.color} emissive={o.color} emissiveIntensity={oscuro ? 1.5 : 0.35} roughness={0.35} metalness={0.1} toneMapped={!oscuro} />
        </mesh>
      ))}
    </group>
  );
}

/** Lleva la escena hacia lo que pide la fase, mueve la cámara (intro, puntero, salto final) y descentra la vista */
function Director({ fase, pulso, reducir, sinIntro, apunta }: { fase: FaseEscena; pulso: Pulso; reducir: boolean; sinIntro: boolean; apunta: { current: { x: number; y: number } } }) {
  const { camera, invalidate, size, clock } = useThree();
  const objetivo = useMemo(() => new THREE.Color(), []);
  const inicio = useRef(0);
  const ancho = size.width >= 900;
  const lejos = ancho ? 10.5 : 13;

  useLayoutEffect(() => {
    inicio.current = clock.elapsedTime;
  }, [clock]);

  // Vista descentrada: en escritorio el núcleo queda detrás de la tarjeta; en móvil, arriba, detrás del titular
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const w = size.width;
    const h = size.height;
    if (ancho) cam.setViewOffset(w, h, -w * 0.025, h * 0.03, w, h);
    else cam.setViewOffset(w, h, 0, h * 0.3, w, h);
    cam.updateProjectionMatrix();
    invalidate();
    return () => {
      cam.clearViewOffset();
    };
  }, [camera, size.width, size.height, ancho, invalidate]);

  useEffect(() => {
    if (!reducir) return;
    pulso.t = INTRO_ESCENA + 1;
    pulso.color.set(COLOR_FASE[fase]);
    pulso.brillo = fase === 'reposo' ? 1 : 1.3;
    let n = 0;
    let id = 0;
    const tic = () => {
      invalidate();
      if (++n < 6) id = requestAnimationFrame(tic);
    };
    id = requestAnimationFrame(tic);
    return () => cancelAnimationFrame(id);
  }, [fase, reducir, invalidate, pulso]);

  useFrame((st, dt) => {
    if (reducir) {
      camera.position.set(0, 1.4, lejos);
      camera.lookAt(0, 0, 0);
      return;
    }
    pulso.t = sinIntro ? Math.max(pulso.t + dt * 6, INTRO_ESCENA * 0.98) : st.clock.elapsedTime - inicio.current;
    const velObj = { reposo: 1, escribiendo: 1.6, enviando: 4.5, codigo: 1.4, error: 0.6, ok: 7 }[fase];
    const brilloObj = { reposo: 1, escribiendo: 1.2, enviando: 1.45, codigo: 1.3, error: 1.5, ok: 2 }[fase];
    pulso.vel = THREE.MathUtils.damp(pulso.vel, velObj, 3, dt);
    pulso.brillo = THREE.MathUtils.damp(pulso.brillo, brilloObj + (fase === 'codigo' ? Math.sin(st.clock.elapsedTime * 3) * 0.15 : 0), 4, dt);
    pulso.warp = THREE.MathUtils.damp(pulso.warp, fase === 'ok' ? 1 : 0, fase === 'ok' ? 1.8 : 4, dt);
    objetivo.set(COLOR_FASE[fase]);
    pulso.color.lerp(objetivo, 1 - Math.exp(-6 * dt));

    // Intro: la cámara empieza cerca y baja, y se aleja girando hasta su sitio
    const k = easeInOut(pulso.t / INTRO_ESCENA);
    const ang = (1 - k) * 1.1;
    const dist = THREE.MathUtils.lerp(4.2, lejos, k) - pulso.warp * (lejos - 2.2);
    const alto = THREE.MathUtils.lerp(0.4, 1.4, k);
    const px = Math.sin(ang) * dist + apunta.current.x * 1.1 * k;
    const pz = Math.cos(ang) * dist;
    const py = alto + apunta.current.y * 0.7 * k;
    if (pulso.t < INTRO_ESCENA) camera.position.set(px, py, pz);
    else {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, px, 2.5, dt);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, py, 2.5, dt);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, pz, 3, dt);
    }
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Mundo({ fase, oscuro, reducir, sinIntro, apunta, movil }: Props & { apunta: { current: { x: number; y: number } }; movil: boolean }) {
  const pulso = useMemo<Pulso>(() => ({ vel: 1, brillo: 1, warp: 0, color: new THREE.Color(COLOR_FASE.reposo), t: 0 }), []);
  return (
    <>
      {oscuro && <color attach="background" args={['#040a1f']} />}
      <ambientLight intensity={oscuro ? 0.25 : 0.9} />
      <pointLight position={[0, 0, 0]} intensity={oscuro ? 18 : 6} color="#c4f6ff" />
      <directionalLight position={[-4, 6, 5]} intensity={0.9} color="#b7c6ff" />
      <Director fase={fase} pulso={pulso} reducir={reducir} sinIntro={sinIntro} apunta={apunta} />
      <Particulas n={movil ? 900 : 2600} forma="cielo" oscuro={oscuro} reducir={reducir} pulso={pulso} semilla={7} />
      <group rotation={[0.35, 0, 0.18]}>
        <Particulas n={movil ? 2600 : 7500} forma="galaxia" oscuro={oscuro} reducir={reducir} pulso={pulso} semilla={21} />
      </group>
      <Arco pulso={pulso} reducir={reducir} oscuro={oscuro} />
      <Nucleo pulso={pulso} reducir={reducir} oscuro={oscuro} />
      <Modulos pulso={pulso} reducir={reducir} oscuro={oscuro} />
      {oscuro && (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom mipmapBlur intensity={1.25} luminanceThreshold={0.5} luminanceSmoothing={0.25} radius={0.8} />
          <Vignette offset={0.3} darkness={0.55} />
        </EffectComposer>
      )}
    </>
  );
}

/** Pausa la escena con la pestaña oculta */
function useVisible() {
  const [v, setV] = useState(() => document.visibilityState !== 'hidden');
  useEffect(() => {
    const f = () => setV(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', f);
    return () => document.removeEventListener('visibilitychange', f);
  }, []);
  return v;
}

export default function EscenaAcceso(props: Props) {
  const apunta = useRef({ x: 0, y: 0 });
  const movil = useMemo(() => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches, []);
  const visible = useVisible();

  useEffect(() => {
    if (props.reducir || !window.matchMedia('(pointer: fine)').matches) return;
    const mover = (e: PointerEvent) => {
      apunta.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      apunta.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    return () => window.removeEventListener('pointermove', mover);
  }, [props.reducir]);

  return (
    <Canvas
      className="acc3d-canvas"
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop={props.reducir || !visible ? 'demand' : 'always'}
      gl={{ antialias: !movil, alpha: !props.oscuro, }}
      camera={{ fov: 40, position: [0, 1.4, 10], near: 0.1, far: 200 }}
    >
      <Mundo {...props} apunta={apunta} movil={movil} />
    </Canvas>
  );
}
