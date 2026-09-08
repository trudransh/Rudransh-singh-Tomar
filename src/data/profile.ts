// ---------------------------------------------------------------------------
// Single source of truth for all portfolio content.
// v2 plan: replace the static constants with a build-time fetch from the
// GitHub API (see github_dual_exporter.py in the parent repo for the tokens
// + account layout) — components only read from this module, so nothing
// else has to change.
// ---------------------------------------------------------------------------

export const identity = {
  name: 'RUDRANSH',
  fullName: 'Rudransh Singh Tomar',
  title: 'Blockchain Engineer',
  subtitle: 'Protocol Researcher · Solidity Auditor · DeFi Builder',
  email: 'trudranshsingh2003@gmail.com',
};

export const socials = [
  { label: 'GitHub · Personal', handle: 'trudransh', url: 'https://github.com/trudransh' },
  { label: 'Twitter', handle: 'dracian_me', url: 'https://x.com/dracian_me' },
  {
    label: 'LinkedIn',
    handle: 'rudransh-singh-tomar',
    url: 'https://www.linkedin.com/in/rudransh-singh-tomar-a07a69218/',
  },
  { label: 'Email', handle: identity.email, url: `mailto:${identity.email}` },
];

export const stats = [
  { value: 27.5, suffix: 'k+', prefix: '$', label: 'hackathon winnings' },
  { value: 105, suffix: '+', prefix: '', label: 'research documents' },
  { value: 784660, suffix: '', prefix: '', label: 'lines committed' },
  { value: 18, suffix: '', prefix: '', label: 'chains' },
];

// About paragraph, segmented so key phrases light up in the accent color
// as the scroll reveal sweeps through.
export const aboutSegments = [
  { text: "I'm a Blockchain Developer and protocol engineer. I take ideas from" },
  { text: 'ground-zero', highlight: true },
  { text: 'to' },
  { text: 'Mainnet Ready code.', highlight: true },
  { text: '105+ technical documents', highlight: true },
  { text: ', written production smart contracts across' },
  { text: '18 chains', highlight: true },
  { text: ', and' },
  { text: 'Simulated Models in python', highlight: true },
  { text: 'before market launch.' },
];

// The constellation. Each chain is a star on the map, with the actual work
// done there. Lines between stars are real: they exist only where a project
// genuinely spans both chains (see chainLinks).
export type ChainNode = {
  name: string;
  role: string;
  projects: { name: string; note: string }[];
};

export const chains: ChainNode[] = [
  {
    name: 'Ethereum',
    role: 'Home turf — production Solidity, audits, DeFi integrations',
    projects: [
      { name: 'Ladder Integrations', note: 'ERC-4626 wrappers, AMM pools, Queued redemptions' },
      { name: 'Trust Protocol', note: 'Game-theoretic trust bonds, aave vaults integrated' },
      { name: 'ERC-404 Audits', note: 'ERC-404 & TRC-404 integrations, Uniswap + bonding curves' },
      { name: 'Phoenix', note: 'RWA CDP factory — S&P 500-pegged stablecoins' },
    ],
  },
  {
    name: 'Polygon',
    role: 'Audit ground — severity-graded production reviews',
    projects: [
      { name: 'Predex Review', note: 'H-1/H-2 critical findings, deployment checklist' },
      { name: 'Mainnet Audits', note: 'Contracts secured pre-launch at Prospective' },
    ],
  },
  {
    name: 'Arbitrum',
    role: 'DeFi integration deployments',
    projects: [{ name: 'Ladder Integrations', note: 'Vault + AMM integration targets' }],
  },
  {
    name: 'Base',
    role: 'EVM deployment target',
    projects: [{ name: 'Ladder Integrations', note: 'Cross-chain vault deployments' }],
  },
  {
    name: 'BSC',
    role: 'EVM deployment target',
    projects: [{ name: 'EVM Deployments', note: 'Production contract deployments' }],
  },
  {
    name: 'Solana',
    role: 'ZK lending + agent policy infrastructure',
    projects: [
      { name: 'zkRL', note: 'ZK under-collateralized lending — 4 Anchor programs' },
      { name: 'Sentinel', note: 'YAML policy DSL for AI agent treasuries' },
      { name: 'KILT DID', note: 'Multichain Web3 name registration (EdDSA)' },
    ],
  },
  {
    name: 'ICP',
    role: 'Grant-winning  + shipped production dApps',
    projects: [
      { name: 'Hush Protocol', note: '$25k grant — DKIM + VetKeys wallet recovery' },
      { name: 'Kai Foundry dApps', note: 'mahaka, merch-store, indonesia-on-chain (Motoko)' },
      { name: 'pump.icp', note: 'Memecoin launchpad' },
    ],
  },
  {
    name: 'Sui',
    role: 'Hackathon-winning Move + margin engine design',
    projects: [
      { name: 'Trust Protocol', note: 'Move port — won Kathmandu 2025 Professional Track' },
      { name: 'DeepBook Prime', note: 'Cross-margin engine — 7 Move packages designed' },
      { name: 'Gas Futures', note: 'Object-based gas price hedging architecture' },
    ],
  },
  {
    name: 'Aptos',
    role: 'Move payments experiments',
    projects: [
      { name: 'FaceWise-Pay', note: 'Facial-recognition payments in Move' },
      { name: 'aptfund / aptospay', note: 'Funding + payment protocols' },
    ],
  },
  {
    name: 'Algorand',
    role: 'Settlement-layer architecture for a perp DEX',
    projects: [
      { name: 'Denance Perps', note: 'ATG settlement design — ~3.3s irreversible finality' },
      { name: 'Liquidsat', note: 'BTC-collateral lending, ASA-native design' },
    ],
  },
  {
    name: 'Polkadot',
    role: 'Cross-chain identity + dApp experiments',
    projects: [
      { name: 'KILT DID', note: 'Multichain Web3 name system design' },
      { name: 'DotLuck', note: 'Decentralized lottery on xcDot' },
    ],
  },
  {
    name: 'StarkNet',
    role: 'Cairo contract work',
    projects: [{ name: 'Regen-Bazaar', note: 'Cairo port of the impact marketplace' }],
  },
  {
    name: 'Oasis Sapphire',
    role: 'Confidential computing research',
    projects: [{ name: 'COAS', note: 'TEE oracle aggregation — kills liquidation front-running' }],
  },
  {
    name: 'Avalanche',
    role: 'Validator security module suite',
    projects: [{ name: 'Universal SecModules', note: '5 modules for ACP-77 L1s — NFT-gated, stake-basket, PoA→PoS' }],
  },
  {
    name: 'NEAR',
    role: 'Protocol research',
    projects: [{ name: 'Research', note: 'Protocol design exploration' }],
  },
  {
    name: 'Flare',
    role: 'Liquid staking architecture',
    projects: [{ name: 'Liquid Staking', note: '4-layer design on FDC attestations + FTSO feeds' }],
  },
  {
    name: 'LEZ / Logos',
    role: 'Privacy-preserving vesting design',
    projects: [{ name: 'RFP-017 Vesting', note: 'Private claims — the anti-MANTRA design' }],
  },
  {
    name: 'Sia',
    role: 'Storage-layer systems in Rust',
    projects: [
      { name: 'AI Slab Optimizer', note: 'ML repacking daemon — Sia Foundation top priority' },
      { name: 'Weft', note: 'Local-first Yjs sync provider' },
    ],
  },
];

// Real cross-chain connections: [chainA, chainB, project that spans them]
export const chainLinks: [string, string, string][] = [
  ['Ethereum', 'Sui', 'Trust Protocol'],
  ['Ethereum', 'StarkNet', 'Regen-Bazaar'],
  ['Ethereum', 'Arbitrum', 'Ladder Integrations'],
  ['Ethereum', 'Base', 'Ladder Integrations'],
  ['Ethereum', 'Polygon', 'Audit practice'],
  ['Ethereum', 'BSC', 'EVM deployments'],
  ['Polkadot', 'Solana', 'KILT DID'],
  ['Polkadot', 'Ethereum', 'KILT DID'],
  ['Sui', 'Algorand', 'Order-book settlement research'],
];

// Hero spotlight hidden layer — actual research doc titles + audit finding IDs.
export const hiddenDocs = [
  'ASC SETTLEMENT RESEARCH', '[H-1] HOSTILE CALLDATA SIGNING', 'DYDX V4 ORDERBOOK EXTRACTION',
  'V2 ZK ARCHITECTURE — SP1', 'GOSSIP-BASED COMMUNICATION', 'MONTE CARLO PHASE 2',
  'UPSHIFT PRICE TIMESTAMP PROBLEM', '[H-2] UNAUTHENTICATED API SURFACE', 'TWO SEPARATE LEDGERS DESIGN',
  'GLP AS A MODEL FOR STABLE VAULT', 'TRUST BONDS SPECIFICATION', '[M-3] ZERO-CONF REORG RISK',
  'AI SLAB OPTIMIZER PROPOSAL', 'WEFT — YJS ON SIA', 'COAS TEE AGGREGATION',
  'RFP-017 PRIVATE VESTING', 'SUI GAS FUTURES', 'DEEPBOOK PRIME CROSS-MARGIN',
  'UNIVERSAL SECURITY MODULES', 'KILT DID MULTICHAIN', 'LIQUIDSAT ATG LENDING',
  'HOTSTUFF 3-PHASE CONSENSUS', 'STABLESWAP INVARIANT FUZZING', 'NAV CONSERVED TO 2 WEI',
  '89% JUNIOR DEPLETION @ 20/80', '130X SIMULATION SPEEDUP', '784,660 LINES COMMITTED',
];


export const experience = [
  {
    period: 'AUG 2025 — NOW',
    role: 'Senior Smart Contract Auditor',
    org: 'Prospective LLC',
    log: 'Secured mainnet launches of ERC-404, TRC-404 and Polygon contracts across a 34-week engagement. Layered analysis: Slither, Mythril, Echidna, Halmos, and line-by-line manual review. Caught reentrancy, oracle manipulation, front-running and access-control flaws before they shipped.',
  },
  {
    period: 'DEC 2025 — NOW',
    role: 'Protocol Engineer',
    org: 'Ladder Protocol',
    log: 'Shipped 3 production DeFi integrations (5,000+ lines Solidity 0.8.20): ERC-4626 vault wrappers, multi-asset AMM pools, async epoch-based redemptions. Built a 6,200-line Python Monte Carlo risk framework, cross-validated against Solidity via Foundry fuzz tests.',
  },
  {
    period: 'JAN 2025 — DEC 2025',
    role: 'Co-Founder & Lead Developer',
    org: 'Trust Protocol',
    log: 'Game-theoretic trust layer for undercollateralized lending. Solidity bond mechanics with UUPS proxies, expanded to Sui in Move. Validated with 100+ beta members. Won SUI Hacker House Kathmandu 2025, Professional Track.',
  },
  {
    period: '2023 — 2024',
    role: 'Blockchain Developer',
    org: 'Kai Foundry',
    log: 'Shipped full-stack dApps on the Internet Computer: NFT platforms, decentralized commerce, education platforms. Motoko canisters, stable memory persistence, EXT token standards.',
  },
];

export const projects = [
  {
    number: '01',
    name: 'Trust Protocol',
    category: 'Founder · DeFi',
    metric: '100+',
    metricLabel: 'beta members',
    problem:
      'DeFi demands $200 locked to borrow $100. No mechanism builds on-chain trust that reduces collateral over time without being gameable.',
    solution:
      'Game-theoretic trust bonds: two users stake into a shared pot and build verifiable cooperation history. Log-scaled stakes tame whales, time-roots punish flippers, defaults slash the defector.',
    outcome: 'Won SUI Hacker House Kathmandu 2025 (Professional Track). Solidity + Move implementations.',
    tags: ['Solidity', 'Move', 'Game Theory', 'UUPS'],
    link: 'https://github.com/trudransh/trust-bonds',
  },
  {
    number: '02',
    name: 'Denance Perps',
    category: 'Backend Lead · Perp DEX',
    metric: '~500ms',
    metricLabel: 'match finality',
    problem:
      'Perp DEXs sacrifice performance for decentralization or vice versa. On-chain CLOBs cannot afford the 85–95% of traffic that is order placement and cancellation.',
    solution:
      'Dual-ledger architecture: an in-memory validator network (libp2p GossipSub + HotStuff consensus) matches orders in ~500ms; Algorand atomic transaction groups settle irreversibly in ~3.3s. V2 evolves to SP1 zkVM proofs verified on-chain.',
    outcome: 'Authored the settlement architecture, a 4,710-line dYdX v4 orderbook teardown, gossip spec, and ZK V2 design.',
    tags: ['Algorand', 'GossipSub', 'HotStuff', 'SP1 zkVM'],
    link: 'https://github.com/trudransh',
  },
  {
    number: '03',
    name: 'Ladder Risk Engine',
    category: 'Protocol Engineer · Risk',
    metric: '5,000',
    metricLabel: 'simulation runs',
    problem:
      'A tranche protocol splitting yield into Senior (protected) and Junior (leveraged) needed proof the design survives real markets before capital deployment.',
    solution:
      'Replayed 2 years of real ETH/USD prices through deployed Solidity on a local chain, then 5,000 Monte Carlo runs across 5 volatility levels. NAV conservation verified to 2 wei.',
    outcome: 'Quantified the leverage/survival tradeoff: Junior depletes in 89% of runs at a 20/80 split — reshaping the parameter design.',
    tags: ['Python', 'Foundry', 'Monte Carlo', 'GBM'],
    link: 'https://github.com/trudransh/dex_integration',
  },
  {
    number: '04',
    name: 'Hush Protocol',
    category: 'Co-Creator · Security',
    metric: '$25k',
    metricLabel: 'grant won',
    problem:
      'Lose your seed phrase, lose everything. Wallet recovery either trusts a custodian or does not exist.',
    solution:
      'Trustless wallet recovery on ICP using DKIM email signatures and VetKeys — cryptographic recovery through infrastructure you already use, with no custodian.',
    outcome: 'Won a $25k grant at Encode Club x ICP Zero to DApp.',
    tags: ['ICP', 'DKIM', 'VetKeys', 'Cryptography'],
    link: 'https://github.com/trudransh/hush-ui',
  },
];

export const researchAreas = [
  {
    title: 'DEX & Settlement Architecture',
    detail: 'Dual-ledger designs, dYdX v4 matching-engine extraction, Algorand atomic settlement, CLOB mechanics.',
  },
  {
    title: 'ZK Integration',
    detail: 'SP1 zkVM sequencer proofs, Groth16 on-chain verification, browser-WASM proof generation for private lending.',
  },
  {
    title: 'Risk Simulation',
    detail: 'Monte Carlo engines (GBM, fat-tailed), historical replay through deployed contracts, impermanent-loss modeling.',
  },
  {
    title: 'Security Reviews',
    detail: 'Severity-graded audit reports: hostile-calldata signing, API hardening, reorg safety, deployment checklists.',
  },
  {
    title: 'Oracle Design',
    detail: 'Confidential aggregation in TEEs, staleness/confidence checks, Sybil-resistant reputation oracles.',
  },
  {
    title: 'Consensus & Networking',
    detail: 'HotStuff 3-phase consensus, CometBFT, libp2p GossipSub propagation specs, validator security modules.',
  },
];

export const achievements = [
  { event: 'Encode Club x ICP — Zero to DApp', result: '$25k Grant Winner', project: 'Hush Protocol' },
  { event: 'SUI Hacker House Kathmandu 2025', result: 'Winner · Professional Track', project: 'Trust Protocol' },
  { event: 'Hacker House Goa 2024', result: 'Best DeFi Use Case · $2.5k', project: 'Anon Aadhaar Track' },
  { event: 'Solana HackDay 2022', result: 'Winner', project: 'Early Solana Project' },
];
