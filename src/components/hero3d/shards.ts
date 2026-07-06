// Deterministic bytecode-shard layout. Seeded so every render/frame agrees on
// where a shard rests inside the block and where it flies to when exploded —
// no per-frame randomness, no jitter between reloads.

export type Shard = {
  rest: [number, number, number]; // packed tight inside the block
  explode: [number, number, number]; // scattered outward on disassembly
  spin: [number, number, number]; // extra rotation applied at full explode
  scale: number;
  tetra: boolean; // box vs tetrahedron
  fractured: boolean; // the one red H-1 shard
};

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Storage-slot planes fanned out of the block's core. Kept small (3) so the
// labels stay legible.
export const SLOTS: { label: string; restY: number; explode: [number, number, number]; tilt: number }[] = [
  { label: 'slot 0x0', restY: 0.15, explode: [-1.6, 1.5, -0.4], tilt: -0.35 },
  { label: 'slot 0x1', restY: 0.0, explode: [1.7, 0.2, 0.5], tilt: 0.28 },
  { label: 'mapping(address => uint256)', restY: -0.15, explode: [-0.4, -1.7, 0.8], tilt: 0.4 },
];

export function makeShards(count: number, seed = 0x5eed): Shard[] {
  const rand = mulberry32(seed);
  const fracturedIndex = Math.floor(count * 0.55); // a mid shard, always visible
  const shards: Shard[] = [];

  for (let i = 0; i < count; i++) {
    // Rest: tight lattice-ish cluster filling a ~1.4 cube.
    const rest: [number, number, number] = [
      (rand() - 0.5) * 1.4,
      (rand() - 0.5) * 1.4,
      (rand() - 0.5) * 1.4,
    ];

    // Explode: push along a spherical direction to a shell radius 3–5.
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);
    const radius = 3 + rand() * 2;
    const explode: [number, number, number] = [
      Math.sin(phi) * Math.cos(theta) * radius,
      Math.cos(phi) * radius * 0.8,
      Math.sin(phi) * Math.sin(theta) * radius,
    ];

    const fractured = i === fracturedIndex;
    if (fractured) {
      // Pull the flagged shard toward the camera and up so its tag reads clean.
      explode[0] = 2.4;
      explode[1] = 1.9;
      explode[2] = 2.6;
    }

    shards.push({
      rest,
      explode,
      spin: [(rand() - 0.5) * 6, (rand() - 0.5) * 6, (rand() - 0.5) * 6],
      scale: 0.16 + rand() * 0.18,
      tetra: rand() > 0.6,
      fractured,
    });
  }

  return shards;
}
