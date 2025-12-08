// Mock API for Cloak Protocol with localStorage persistence

export interface Proposal {
  id: string;
  title: string;
  summary: string;
  description: string;
  author: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  quorum: number;
  endDate: Date;
  createdAt: Date;
  category: 'protocol' | 'treasury' | 'governance' | 'security';
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  category: 'credit' | 'estate' | 'commodities' | 'art';
  privacyEnabled: boolean;
}

export interface UserPosition {
  assetId: string;
  asset: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  privacyStatus: 'shielded' | 'public' | 'generating';
}

export interface LiquidityPair {
  pair: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  fee: number;
  apr: number;
}

export interface Transaction {
  id: string;
  type: 'swap' | 'deposit' | 'withdraw' | 'vote';
  asset: string;
  amount: number;
  price?: number;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
}

// Storage keys
const STORAGE_KEYS = {
  PROPOSALS: 'cloak_proposals',
  USER_VOTES: 'cloak_user_votes',
  USER_POSITIONS: 'cloak_user_positions',
  TRANSACTIONS: 'cloak_transactions',
};

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomLatency = () => delay(200 + Math.random() * 300);

// Occasionally simulate failures (5% chance)
const maybeFailure = () => {
  if (Math.random() < 0.05) {
    throw new Error('Network request failed. Please try again.');
  }
};

// Default proposals
const defaultProposals: Proposal[] = [
  {
    id: 'prop-001',
    title: 'Increase Privacy Pool Allocation',
    summary: 'Proposal to allocate 10% more liquidity to the privacy-enhanced trading pools',
    description: 'This proposal aims to increase the allocation of liquidity to privacy-enhanced trading pools from 30% to 40%. This will improve execution quality for private trades and reduce slippage for large orders.',
    author: '0x8F2a...4D91',
    status: 'active',
    votesFor: 847392,
    votesAgainst: 234567,
    votesAbstain: 45678,
    quorum: 1000000,
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    category: 'protocol',
  },
  {
    id: 'prop-002',
    title: 'Treasury Diversification Strategy',
    summary: 'Diversify protocol treasury into yield-bearing RWAs',
    description: 'This proposal suggests diversifying 25% of the treasury into yield-bearing real-world assets including tokenized bonds and credit instruments to generate sustainable yield for the protocol.',
    author: '0xA3b...7E21',
    status: 'active',
    votesFor: 523456,
    votesAgainst: 189234,
    votesAbstain: 67890,
    quorum: 1000000,
    endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: 'treasury',
  },
  {
    id: 'prop-003',
    title: 'ZK Circuit Upgrade v2.1',
    summary: 'Upgrade ZK circuits for 40% faster proof generation',
    description: 'Technical upgrade to our zero-knowledge proof circuits that will reduce proof generation time by approximately 40% while maintaining the same security guarantees.',
    author: '0x2D4...9F38',
    status: 'passed',
    votesFor: 1234567,
    votesAgainst: 89234,
    votesAbstain: 45678,
    quorum: 1000000,
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    category: 'security',
  },
  {
    id: 'prop-004',
    title: 'Reduce Governance Quorum',
    summary: 'Lower quorum requirement from 10% to 7% of total supply',
    description: 'This proposal aims to reduce the governance quorum requirement to improve proposal throughput while maintaining meaningful participation requirements.',
    author: '0x6E9...1C45',
    status: 'rejected',
    votesFor: 456789,
    votesAgainst: 678901,
    votesAbstain: 123456,
    quorum: 1000000,
    endDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    category: 'governance',
  },
];

const defaultAssets: Asset[] = [
  { id: 'rwa-credit', name: 'Tokenized Credit', symbol: 'RWA-CREDIT', price: 0.95, change24h: 1.2, volume24h: 2450000, marketCap: 45000000, category: 'credit', privacyEnabled: true },
  { id: 'rwa-estate', name: 'Real Estate Index', symbol: 'RWA-ESTATE', price: 1.02, change24h: -0.3, volume24h: 1890000, marketCap: 78000000, category: 'estate', privacyEnabled: true },
  { id: 'rwa-carbon', name: 'Carbon Credits', symbol: 'RWA-CARBON', price: 0.01, change24h: 5.7, volume24h: 890000, marketCap: 12000000, category: 'commodities', privacyEnabled: true },
  { id: 'rwa-art', name: 'Art Collection', symbol: 'RWA-ART', price: 0.98, change24h: 0.8, volume24h: 340000, marketCap: 23000000, category: 'art', privacyEnabled: false },
  { id: 'rwa-bonds', name: 'Treasury Bonds', symbol: 'RWA-BONDS', price: 1.001, change24h: 0.1, volume24h: 5670000, marketCap: 156000000, category: 'credit', privacyEnabled: true },
];

const defaultLiquidity: LiquidityPair[] = [
  { pair: 'RWA-CREDIT/USDC', token0: 'RWA-CREDIT', token1: 'USDC', reserve0: 2500000, reserve1: 2375000, fee: 0.003, apr: 12.4 },
  { pair: 'RWA-ESTATE/USDC', token0: 'RWA-ESTATE', token1: 'USDC', reserve0: 1800000, reserve1: 1836000, fee: 0.003, apr: 8.7 },
  { pair: 'RWA-CARBON/USDC', token0: 'RWA-CARBON', token1: 'USDC', reserve0: 45000000, reserve1: 450000, fee: 0.003, apr: 23.1 },
  { pair: 'RWA-BONDS/USDC', token0: 'RWA-BONDS', token1: 'USDC', reserve0: 8900000, reserve1: 8908900, fee: 0.001, apr: 4.2 },
];

// Helper functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// API Functions

export async function getProposals(): Promise<Proposal[]> {
  await randomLatency();
  maybeFailure();
  
  const stored = getFromStorage<Proposal[]>(STORAGE_KEYS.PROPOSALS, []);
  if (stored.length === 0) {
    saveToStorage(STORAGE_KEYS.PROPOSALS, defaultProposals);
    return defaultProposals.map(p => ({
      ...p,
      endDate: new Date(p.endDate),
      createdAt: new Date(p.createdAt),
    }));
  }
  return stored.map(p => ({
    ...p,
    endDate: new Date(p.endDate),
    createdAt: new Date(p.createdAt),
  }));
}

export async function getProposal(id: string): Promise<Proposal | null> {
  await randomLatency();
  const proposals = await getProposals();
  return proposals.find(p => p.id === id) || null;
}

export async function submitProposal(payload: {
  title: string;
  summary: string;
  description: string;
  category: Proposal['category'];
}): Promise<Proposal> {
  await delay(800);
  maybeFailure();

  const newProposal: Proposal = {
    id: `prop-${Date.now()}`,
    ...payload,
    author: '0xYour...Addr',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    quorum: 1000000,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  };

  const proposals = await getProposals();
  proposals.unshift(newProposal);
  saveToStorage(STORAGE_KEYS.PROPOSALS, proposals);
  
  return newProposal;
}

export async function vote(proposalId: string, option: 'for' | 'against' | 'abstain'): Promise<{ success: boolean; newTotals: { votesFor: number; votesAgainst: number; votesAbstain: number } }> {
  await delay(600);
  maybeFailure();

  const userVotes = getFromStorage<Record<string, string>>(STORAGE_KEYS.USER_VOTES, {});
  
  if (userVotes[proposalId]) {
    throw new Error('You have already voted on this proposal');
  }

  const proposals = await getProposals();
  const proposal = proposals.find(p => p.id === proposalId);
  
  if (!proposal) {
    throw new Error('Proposal not found');
  }

  if (proposal.status !== 'active') {
    throw new Error('Voting is closed for this proposal');
  }

  // Simulate vote weight (random for demo)
  const voteWeight = 10000 + Math.floor(Math.random() * 50000);

  if (option === 'for') {
    proposal.votesFor += voteWeight;
  } else if (option === 'against') {
    proposal.votesAgainst += voteWeight;
  } else {
    proposal.votesAbstain += voteWeight;
  }

  userVotes[proposalId] = option;
  saveToStorage(STORAGE_KEYS.USER_VOTES, userVotes);
  saveToStorage(STORAGE_KEYS.PROPOSALS, proposals);

  return {
    success: true,
    newTotals: {
      votesFor: proposal.votesFor,
      votesAgainst: proposal.votesAgainst,
      votesAbstain: proposal.votesAbstain,
    },
  };
}

export async function getUserVotes(): Promise<Record<string, string>> {
  await randomLatency();
  return getFromStorage<Record<string, string>>(STORAGE_KEYS.USER_VOTES, {});
}

export async function getAssets(): Promise<Asset[]> {
  await randomLatency();
  maybeFailure();
  return defaultAssets;
}

export async function getLiquidityForPair(pair: string): Promise<LiquidityPair | null> {
  await randomLatency();
  return defaultLiquidity.find(l => l.pair === pair) || null;
}

export async function getAllLiquidity(): Promise<LiquidityPair[]> {
  await randomLatency();
  return defaultLiquidity;
}

export async function getUserPositions(): Promise<UserPosition[]> {
  await randomLatency();
  const stored = getFromStorage<UserPosition[]>(STORAGE_KEYS.USER_POSITIONS, [
    { assetId: 'rwa-credit', asset: 'RWA-CREDIT', amount: 125.4, avgPrice: 0.92, currentPrice: 0.95, pnl: 3800, pnlPercent: 3.26, privacyStatus: 'shielded' },
    { assetId: 'rwa-estate', asset: 'RWA-ESTATE', amount: 2.1, avgPrice: 0.98, currentPrice: 1.02, pnl: 84, pnlPercent: 4.08, privacyStatus: 'shielded' },
    { assetId: 'rwa-carbon', asset: 'RWA-CARBON', amount: 847, avgPrice: 0.0095, currentPrice: 0.01, pnl: 42.5, pnlPercent: 5.67, privacyStatus: 'generating' },
  ]);
  return stored;
}

export async function submitSwap(payload: {
  fromAsset: string;
  toAsset: string;
  amount: number;
  slippage: number;
}): Promise<{ txHash: string; executedPrice: number; received: number }> {
  await delay(1200);
  maybeFailure();

  const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
  
  // Simulate price impact
  const priceImpact = payload.amount > 10000 ? 0.005 : 0.001;
  const executedPrice = 0.95 * (1 - priceImpact);
  const received = payload.amount * executedPrice;

  // Save transaction
  const transactions = getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  transactions.unshift({
    id: txHash,
    type: 'swap',
    asset: `${payload.fromAsset} → ${payload.toAsset}`,
    amount: payload.amount,
    price: executedPrice,
    timestamp: new Date(),
    status: 'confirmed',
    txHash,
  });
  saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);

  return { txHash, executedPrice, received };
}

export async function getTransactions(): Promise<Transaction[]> {
  await randomLatency();
  const stored = getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
  return stored.map(t => ({ ...t, timestamp: new Date(t.timestamp) }));
}

// Reset all demo data
export function resetDemoData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}
