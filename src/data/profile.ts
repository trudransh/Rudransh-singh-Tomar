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
  title: 'Smart Contract Security Engineer',
  subtitle: 'Protocol Researcher · Solidity Auditor · DeFi Builder',
  heroLine: 'calculated risks. global impact. building the future of web3.',
  email: 'trudranshsingh2003@gmail.com',
};

export const socials = [
  { label: 'GitHub · Personal', handle: 'trudransh', url: 'https://github.com/trudransh' },
  { label: 'GitHub · Work', handle: 'trudranshsingh', url: 'https://github.com/trudranshsingh' },
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
  { value: 18, suffix: '', prefix: '', label: 'chains shipped on' },
];

export const marqueeItems = [
  'TRUST PROTOCOL',
  '$25K HUSH GRANT',
  'ERC-404 MAINNET AUDITS',
  'DYDX V4 TEARDOWN',
  'SUI KATHMANDU WINNER',
  'MONTE CARLO RISK ENGINE',
  '105+ RESEARCH DOCS',
  'ZK ORDER BOOK DESIGN',
  'BEST DEFI USE CASE — GOA',
  '18 CHAINS',
];

export const aboutText =
  "I'm a smart contract security engineer and protocol researcher. I take ideas from ground-zero research to audited mainnet code — 105+ technical documents, production Solidity across 18 chains, and simulations that prove designs before real capital ever touches them.";

// The constellation. Each chain is a star on the map.
export const chains = [
  { name: 'Ethereum', note: 'Production Solidity · ERC-4626 vaults · audits' },
  { name: 'Polygon', note: 'Mainnet audits · Predex security review' },
  { name: 'Arbitrum', note: 'DeFi integrations' },
  { name: 'Base', note: 'EVM deployments' },
  { name: 'BSC', note: 'EVM deployments' },
  { name: 'Solana', note: 'zkRL lending · Sentinel policy engine · Anchor' },
  { name: 'ICP', note: 'Hush Protocol ($25k) · Kai Foundry dApps · Motoko' },
  { name: 'Sui', note: 'Trust Protocol (Move) · DeepBook Prime design' },
  { name: 'Aptos', note: 'FaceWise-Pay · Move contracts' },
  { name: 'Algorand', note: 'Denance Perps settlement · ATG design' },
  { name: 'Polkadot', note: 'DotLuck lottery · xcDot' },
  { name: 'StarkNet', note: 'Regen-Bazaar Cairo contracts' },
  { name: 'Oasis Sapphire', note: 'Confidential oracle aggregation · TEE' },
  { name: 'Avalanche', note: 'Universal Security Module suite · ACP-77' },
  { name: 'NEAR', note: 'Protocol research' },
  { name: 'Flare', note: 'Liquid staking architecture · FDC' },
  { name: 'LEZ / Logos', note: 'Private token vesting (RFP-017)' },
  { name: 'Sia', note: 'AI Slab Optimizer · Weft sync provider' },
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
