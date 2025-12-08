// Enhanced Mock Data for Cloak Protocol - Production Ready
// Comprehensive RWA assets, realistic trading data, and ZK proof simulations

export interface Order {
  id: string;
  side: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  total: number;
  time: Date;
  status: 'open' | 'filled' | 'cancelled' | 'pending';
  proofId?: string;
}

export interface Position {
  asset: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  privacyStatus: 'shielded' | 'public' | 'generating';
  lastUpdated: Date;
}

export interface ZKProof {
  id: string;
  type: 'balance' | 'trade' | 'compliance' | 'settlement';
  status: 'generating' | 'complete' | 'verified' | 'failed';
  constraints: number;
  proveTime: number;
  proofSize: number;
  timestamp: Date;
  txHash?: string;
  errorMessage?: string;
}

export interface RWAAsset {
  symbol: string;
  name: string;
  type: 'credit' | 'real-estate' | 'carbon' | 'art' | 'commodities' | 'securities';
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  verified: boolean;
  issuer: string;
}

export interface TradeHistory {
  id: string;
  timestamp: Date;
  asset: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  total: number;
  proofId: string;
  txHash: string;
  status: 'completed' | 'pending' | 'failed';
}

// Comprehensive RWA Asset Database
export const RWA_ASSETS: RWAAsset[] = [
  {
    symbol: 'RWA-CREDIT-01',
    name: 'Private Credit Fund A',
    type: 'credit',
    price: 0.95,
    change24h: 0.32,
    volume24h: 2450000,
    marketCap: 125000000,
    liquidity: 8500000,
    verified: true,
    issuer: 'Institutional Credit Partners'
  },
  {
    symbol: 'RWA-ESTATE-NYC',
    name: 'Manhattan Commercial Property',
    type: 'real-estate',
    price: 1000000,
    change24h: 1.2,
    volume24h: 15000000,
    marketCap: 500000000,
    liquidity: 25000000,
    verified: true,
    issuer: 'RealT Properties'
  },
  {
    symbol: 'RWA-CARBON-EU',
    name: 'EU Carbon Credits 2025',
    type: 'carbon',
    price: 0.01,
    change24h: -0.5,
    volume24h: 750000,
    marketCap: 50000000,
    liquidity: 5000000,
    verified: true,
    issuer: 'Climate Token Exchange'
  },
  {
    symbol: 'RWA-ART-BASQUIAT',
    name: 'Basquiat Artwork Fraction',
    type: 'art',
    price: 250000,
    change24h: 2.1,
    volume24h: 3000000,
    marketCap: 75000000,
    liquidity: 2000000,
    verified: true,
    issuer: 'Masterworks'
  },
  {
    symbol: 'RWA-GOLD-PAXG',
    name: 'Tokenized Gold',
    type: 'commodities',
    price: 1950,
    change24h: 0.8,
    volume24h: 12000000,
    marketCap: 850000000,
    liquidity: 45000000,
    verified: true,
    issuer: 'Paxos Trust'
  },
  {
    symbol: 'RWA-TBILL-US',
    name: 'US Treasury Bill Token',
    type: 'securities',
    price: 0.98,
    change24h: 0.05,
    volume24h: 50000000,
    marketCap: 2500000000,
    liquidity: 150000000,
    verified: true,
    issuer: 'Franklin Templeton'
  },
  {
    symbol: 'RWA-CREDIT-02',
    name: 'SME Lending Pool',
    type: 'credit',
    price: 1.02,
    change24h: 0.15,
    volume24h: 1800000,
    marketCap: 95000000,
    liquidity: 6000000,
    verified: true,
    issuer: 'Centrifuge'
  },
  {
    symbol: 'RWA-ESTATE-TOKYO',
    name: 'Tokyo Residential Complex',
    type: 'real-estate',
    price: 500000,
    change24h: 0.9,
    volume24h: 8000000,
    marketCap: 250000000,
    liquidity: 12000000,
    verified: true,
    issuer: 'Proptech Asia'
  }
];

// Enhanced Mock Orders with realistic data
export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    side: 'buy',
    asset: 'RWA-CREDIT-01',
    amount: 100,
    price: 0.95,
    total: 95,
    time: new Date(Date.now() - 10000),
    status: 'open',
    proofId: 'PROOF-001'
  },
  {
    id: 'ORD-002',
    side: 'sell',
    asset: 'RWA-ESTATE-NYC',
    amount: 0.5,
    price: 1020000,
    total: 510000,
    time: new Date(Date.now() - 25000),
    status: 'open',
    proofId: 'PROOF-002'
  },
  {
    id: 'ORD-003',
    side: 'buy',
    asset: 'RWA-CARBON-EU',
    amount: 500,
    price: 0.01,
    total: 5,
    time: new Date(Date.now() - 45000),
    status: 'filled',
    proofId: 'PROOF-003'
  },
  {
    id: 'ORD-004',
    side: 'sell',
    asset: 'RWA-CREDIT-01',
    amount: 250,
    price: 1.01,
    total: 252.5,
    time: new Date(Date.now() - 60000),
    status: 'open',
    proofId: 'PROOF-004'
  },
  {
    id: 'ORD-005',
    side: 'buy',
    asset: 'RWA-ART-BASQUIAT',
    amount: 1.2,
    price: 248000,
    total: 297600,
    time: new Date(Date.now() - 75000),
    status: 'pending',
    proofId: 'PROOF-005'
  },
  {
    id: 'ORD-006',
    side: 'buy',
    asset: 'RWA-GOLD-PAXG',
    amount: 10,
    price: 1950,
    total: 19500,
    time: new Date(Date.now() - 90000),
    status: 'filled',
    proofId: 'PROOF-006'
  },
  {
    id: 'ORD-007',
    side: 'sell',
    asset: 'RWA-TBILL-US',
    amount: 1000,
    price: 0.98,
    total: 980,
    time: new Date(Date.now() - 105000),
    status: 'open',
    proofId: 'PROOF-007'
  }
];

// Enhanced Mock Positions
export const MOCK_POSITIONS: Position[] = [
  {
    asset: 'RWA-CREDIT-01',
    amount: 125.4,
    avgPrice: 0.92,
    currentPrice: 0.95,
    pnl: 3800,
    pnlPercent: 3.26,
    privacyStatus: 'shielded',
    lastUpdated: new Date(Date.now() - 3600000)
  },
  {
    asset: 'RWA-ESTATE-NYC',
    amount: 2.1,
    avgPrice: 980000,
    currentPrice: 1000000,
    pnl: 42000,
    pnlPercent: 2.04,
    privacyStatus: 'shielded',
    lastUpdated: new Date(Date.now() - 7200000)
  },
  {
    asset: 'RWA-CARBON-EU',
    amount: 847,
    avgPrice: 0.0095,
    currentPrice: 0.01,
    pnl: 42.5,
    pnlPercent: 5.67,
    privacyStatus: 'generating',
    lastUpdated: new Date(Date.now() - 1800000)
  },
  {
    asset: 'RWA-GOLD-PAXG',
    amount: 25.5,
    avgPrice: 1920,
    currentPrice: 1950,
    pnl: 765,
    pnlPercent: 1.56,
    privacyStatus: 'shielded',
    lastUpdated: new Date(Date.now() - 5400000)
  },
  {
    asset: 'RWA-TBILL-US',
    amount: 5000,
    avgPrice: 0.97,
    currentPrice: 0.98,
    pnl: 50,
    pnlPercent: 1.03,
    privacyStatus: 'shielded',
    lastUpdated: new Date(Date.now() - 10800000)
  }
];

// Enhanced Mock ZK Proofs
export const MOCK_PROOFS: ZKProof[] = [
  {
    id: 'PROOF-001',
    type: 'trade',
    status: 'verified',
    constraints: 1247392,
    proveTime: 182,
    proofSize: 288,
    timestamp: new Date(Date.now() - 120000),
    txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 'PROOF-002',
    type: 'balance',
    status: 'generating',
    constraints: 847392,
    proveTime: 156,
    proofSize: 288,
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: 'PROOF-003',
    type: 'compliance',
    status: 'complete',
    constraints: 392847,
    proveTime: 89,
    proofSize: 288,
    timestamp: new Date(Date.now() - 30000),
    txHash: '0x9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba'
  },
  {
    id: 'PROOF-004',
    type: 'settlement',
    status: 'verified',
    constraints: 1547392,
    proveTime: 205,
    proofSize: 320,
    timestamp: new Date(Date.now() - 180000),
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: 'PROOF-005',
    type: 'trade',
    status: 'generating',
    constraints: 1247392,
    proveTime: 0,
    proofSize: 0,
    timestamp: new Date(Date.now() - 15000)
  }
];

// Enhanced Mock Trade History
export const MOCK_TRADE_HISTORY: TradeHistory[] = [
  {
    id: 'TRADE-001',
    timestamp: new Date(Date.now() - 3600000),
    asset: 'RWA-CREDIT-01',
    side: 'buy',
    amount: 50,
    price: 0.92,
    total: 46,
    proofId: 'PROOF-H001',
    txHash: '0xabc123...',
    status: 'completed'
  },
  {
    id: 'TRADE-002',
    timestamp: new Date(Date.now() - 7200000),
    asset: 'RWA-ESTATE-NYC',
    side: 'buy',
    amount: 1.5,
    currentPrice: 980000,
    total: 1470000,
    proofId: 'PROOF-H002',
    txHash: '0xdef456...',
    status: 'completed'
  },
  {
    id: 'TRADE-003',
    timestamp: new Date(Date.now() - 10800000),
    asset: 'RWA-GOLD-PAXG',
    side: 'buy',
    amount: 15,
    price: 1920,
    total: 28800,
    proofId: 'PROOF-H003',
    txHash: '0xghi789...',
    status: 'completed'
  },
  {
    id: 'TRADE-004',
    timestamp: new Date(Date.now() - 14400000),
    asset: 'RWA-CARBON-EU',
    side: 'buy',
    amount: 500,
    price: 0.0095,
    total: 4.75,
    proofId: 'PROOF-H004',
    txHash: '0xjkl012...',
    status: 'completed'
  },
  {
    id: 'TRADE-005',
    timestamp: new Date(Date.now() - 18000000),
    asset: 'RWA-TBILL-US',
    side: 'buy',
    amount: 5000,
    price: 0.97,
    total: 4850,
    proofId: 'PROOF-H005',
    txHash: '0xmno345...',
    status: 'completed'
  }
];

// Error messages for comprehensive error handling
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  PROOF_GENERATION_FAILED: 'ZK proof generation failed. Please try again.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  INVALID_ORDER: 'Invalid order parameters. Please check your input.',
  BACKEND_UNAVAILABLE: 'Backend service is currently unavailable. Retrying...',
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again later.',
  PROOF_VERIFICATION_FAILED: 'Proof verification failed on-chain.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before submitting more requests.',
  INVALID_ASSET: 'Invalid RWA asset selected.',
  ORDER_EXPIRED: 'Order has expired. Please create a new order.',
  SETTLEMENT_PENDING: 'Settlement is pending. Please wait for confirmation.'
};

// Helper functions
export function generateMockProof(type: ZKProof['type']): ZKProof {
  return {
    id: `PROOF-${Date.now()}`,
    type,
    status: 'generating',
    constraints: Math.floor(Math.random() * 1000000) + 500000,
    proveTime: Math.floor(Math.random() * 200) + 100,
    proofSize: 288,
    timestamp: new Date()
  };
}

export function simulateProofGeneration(proof: ZKProof): Promise<ZKProof> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...proof,
        status: 'complete',
        proveTime: Math.floor(Math.random() * 200) + 100,
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`
      });
    }, proof.proveTime || 2000);
  });
}

export function getAssetBySymbol(symbol: string): RWAAsset | undefined {
  return RWA_ASSETS.find(asset => asset.symbol === symbol);
}

export function calculateTotalPortfolioValue(positions: Position[]): number {
  return positions.reduce((total, pos) => total + (pos.amount * pos.currentPrice), 0);
}

export function calculateTotalPnL(positions: Position[]): number {
  return positions.reduce((total, pos) => total + pos.pnl, 0);
}
