import { MutableRefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { MotionValue } from 'framer-motion';
import { ContractBlock } from './ContractBlock';

type Props = {
  progress: MotionValue<number>;
  pointer: MutableRefObject<{ x: number; y: number }>;
  shardCount: number;
  tilt: boolean;
  dpr: [number, number];
};

// Lazy-loaded so `three` lands in its own chunk. Transparent canvas: the
// page's ink void + ledger-grid CSS show straight through.
export default function Scene({ progress, pointer, shardCount, tilt, dpr }: Props) {
  return (
    <Canvas
      dpr={dpr}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 8], fov: 40 }}
      style={{ pointerEvents: 'none' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <fog attach="fog" args={[0x0a0a0f, 7, 16]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 5, 6]} intensity={30} color={0xb7afff} />
      <pointLight position={[-6, -3, 2]} intensity={12} color={0x6fe7f2} />
      <ContractBlock progress={progress} pointer={pointer} shardCount={shardCount} tilt={tilt} />
    </Canvas>
  );
}
