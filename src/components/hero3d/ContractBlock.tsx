import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { MotionValue } from 'framer-motion';
import * as THREE from 'three';
import { makeShards, SLOTS } from './shards';

const ELECTRIC = '#8B7CF6';
const RED = '#FF5C5C';

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const smooth = (x: number) => {
  x = clamp01(x);
  return x * x * (3 - 2 * x);
};

// Assembled at both ends of the scroll, fully apart in the middle.
function explodeFactor(p: number) {
  if (p < 0.3) return 0;
  if (p < 0.7) return smooth((p - 0.3) / 0.4);
  return smooth(1 - (p - 0.7) / 0.3);
}

// Six square outlines, one per cube face, that slide out along their normals.
const FACES: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [1, 0, 0], rot: [0, Math.PI / 2, 0] },
  { pos: [-1, 0, 0], rot: [0, -Math.PI / 2, 0] },
  { pos: [0, 1, 0], rot: [-Math.PI / 2, 0, 0] },
  { pos: [0, -1, 0], rot: [Math.PI / 2, 0, 0] },
  { pos: [0, 0, 1], rot: [0, 0, 0] },
  { pos: [0, 0, -1], rot: [0, Math.PI, 0] },
];

type Props = {
  progress: MotionValue<number>;
  pointer: React.MutableRefObject<{ x: number; y: number }>;
  shardCount: number;
  tilt: boolean;
};

export function ContractBlock({ progress, pointer, shardCount, tilt }: Props) {
  const group = useRef<THREE.Group>(null);
  const faceRefs = useRef<THREE.LineSegments[]>([]);
  const glow = useRef<THREE.LineSegments>(null);
  const planeRefs = useRef<THREE.Group[]>([]);
  const shardRefs = useRef<THREE.Mesh[]>([]);
  const tagRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ x: 0, y: 0 });
  const spinY = useRef(0);

  const shards = useMemo(() => makeShards(shardCount), [shardCount]);
  const faceGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(2, 2)), []);
  const cubeGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(2, 2, 2)), []);
  const boxGeo = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const tetraGeo = useMemo(() => new THREE.TetrahedronGeometry(0.72), []);
  const planeGeo = useMemo(() => new THREE.PlaneGeometry(1.9, 1.9), []);

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const p = progress.get();
    const e = explodeFactor(p);
    const assembled = 1 - e;

    // Idle spin (accumulates), plus a spring-eased pointer tilt on top —
    // both muted as the block comes apart.
    const targetX = tilt ? pointer.current.y * 0.35 * assembled : 0;
    const targetY = tilt ? pointer.current.x * 0.5 * assembled : 0;
    const k = Math.min(1, delta * 4);
    tiltRef.current.x += (targetX - tiltRef.current.x) * k;
    tiltRef.current.y += (targetY - tiltRef.current.y) * k;
    spinY.current += delta * 0.18 * assembled;
    g.rotation.x = tiltRef.current.x;
    g.rotation.y = spinY.current + tiltRef.current.y;
    g.rotation.z = tiltRef.current.y * 0.12;

    // Shell faces slide outward; the glow duplicate fades as it comes apart.
    for (let i = 0; i < FACES.length; i++) {
      const f = faceRefs.current[i];
      if (!f) continue;
      const [nx, ny, nz] = FACES[i].pos;
      f.position.set(nx * (1 + e * 0.9), ny * (1 + e * 0.9), nz * (1 + e * 0.9));
      (f.material as THREE.LineBasicMaterial).opacity = 0.85 - e * 0.4;
    }
    if (glow.current) {
      (glow.current.material as THREE.LineBasicMaterial).opacity = 0.18 * assembled;
    }

    // Storage-slot planes fan out and tilt.
    for (let i = 0; i < SLOTS.length; i++) {
      const pl = planeRefs.current[i];
      if (!pl) continue;
      const s = SLOTS[i];
      pl.position.set(s.explode[0] * e, s.restY + (s.explode[1] - s.restY) * e, s.explode[2] * e);
      pl.rotation.set(s.tilt * e, s.tilt * e * 0.6, 0);
      (pl.children[0] as THREE.Mesh).visible = e > 0.05;
    }

    // Bytecode shards travel their seeded trajectories and spin at full spread.
    for (let i = 0; i < shards.length; i++) {
      const m = shardRefs.current[i];
      if (!m) continue;
      const sh = shards[i];
      m.position.set(
        sh.rest[0] + (sh.explode[0] - sh.rest[0]) * e,
        sh.rest[1] + (sh.explode[1] - sh.rest[1]) * e,
        sh.rest[2] + (sh.explode[2] - sh.rest[2]) * e,
      );
      m.rotation.set(sh.spin[0] * e, sh.spin[1] * e, sh.spin[2] * e);
    }

    // H-1 tag fades in mid-explode, out on reassembly.
    if (tagRef.current) {
      const vis = smooth((p - 0.42) / 0.12) * smooth((0.85 - p) / 0.12);
      tagRef.current.style.opacity = String(clamp01(vis));
    }
  });

  return (
    <group ref={group} scale={1}>
      {/* soft additive glow — a larger faint wireframe cube */}
      <lineSegments ref={glow} scale={1.08} geometry={cubeGeo}>
        <lineBasicMaterial
          color={ELECTRIC}
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {FACES.map((f, i) => (
        <lineSegments
          key={i}
          ref={(el) => el && (faceRefs.current[i] = el)}
          position={f.pos}
          rotation={f.rot}
          geometry={faceGeo}
        >
          <lineBasicMaterial color={ELECTRIC} transparent opacity={0.85} />
        </lineSegments>
      ))}

      {SLOTS.map((s, i) => (
        <group key={i} ref={(el) => el && (planeRefs.current[i] = el)}>
          <mesh geometry={planeGeo} visible={false}>
            <meshBasicMaterial
              color={ELECTRIC}
              transparent
              opacity={0.12}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <Html position={[-0.85, 0.85, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[2, 0]}>
            <span className="whitespace-nowrap font-mono text-[9px] tracking-[0.15em] text-electric-glow/60">
              {s.label}
            </span>
          </Html>
        </group>
      ))}

      {shards.map((sh, i) => (
        <mesh
          key={i}
          ref={(el) => el && (shardRefs.current[i] = el)}
          position={sh.rest}
          scale={sh.scale}
          geometry={sh.tetra ? tetraGeo : boxGeo}
        >
          <meshStandardMaterial
            color={sh.fractured ? RED : '#1a1830'}
            emissive={sh.fractured ? RED : ELECTRIC}
            emissiveIntensity={sh.fractured ? 1.1 : 0.55}
            metalness={0.3}
            roughness={0.4}
          />
          {sh.fractured && (
            <Html position={[0.9, 0.9, 0]} style={{ pointerEvents: 'none' }} zIndexRange={[2, 0]}>
              <div
                ref={tagRef}
                style={{ opacity: 0 }}
                className="flex items-center gap-1.5 whitespace-nowrap rounded border border-[#FF5C5C]/60 bg-[#FF5C5C]/10 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.2em] text-[#FF8A8A] backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF5C5C]" />
                H-1 FOUND
              </div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
}
