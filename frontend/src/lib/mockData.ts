// Real-time mock data for Cloak Protocol demo
export interface Order {
  id: string;
  side: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  total: number;
  time: Date;
  status: 'open' | 'filled' | 'cancelled';
}

export interface Position {
  asset: string;
  amount: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  privacyStatus: 'shielded' | 'public' | 'generating';
}

export interface ZKProof {
  id: string;
  type: 'balance' | 'trade' | 'compliance';
  status: 'generating' | 'complete' | 'verified';
  constraints: number;
  proveTime: number;
  proofSize: number;
  timestamp: Date;
}

// Live updating mock data stores
export const useMockOrders = () => {
  const orders: Order[] = [
    { id: '1', side: 'buy', asset: 'RWA-CREDIT', amount: 100, price: 0.95, total: 95, time: new Date(Date.now() - 10000), status: 'open' },
    { id: '2', side: 'sell', asset: 'RWA-ESTATE', amount: 0.5, price: 1.02, total: 510, time: new Date(Date.now() - 25000), status: 'open' },
    { id: '3', side: 'buy', asset: 'RWA-CARBON', amount: 500, price: 0.01, total: 5, time: new Date(Date.now() - 45000), status: 'filled' },
    { id: '4', side: 'sell', asset: 'RWA-CREDIT', amount: 250, price: 1.01, total: 252.5, time: new Date(Date.now() - 60000), status: 'open' },
    { id: '5', side: 'buy', asset: 'RWA-ART', amount: 1.2, price: 0.98, total: 1.18, time: new Date(Date.now() - 75000), status: 'open' },
  ];
  return { orders };
};

export const useMockPositions = () => {
  const positions: Position[] = [
    { asset: 'RWA-CREDIT', amount: 125.4, avgPrice: 0.92, currentPrice: 0.95, pnl: 3800, pnlPercent: 3.26, privacyStatus: 'shielded' },
    { asset: 'RWA-ESTATE', amount: 2.1, avgPrice: 980000, currentPrice: 1000000, pnl: 42000, pnlPercent: 2.04, privacyStatus: 'shielded' },
    { asset: 'RWA-CARBON', amount: 847, avgPrice: 0.0095, currentPrice: 0.01, pnl: 42.5, pnlPercent: 5.67, privacyStatus: 'generating' },
  ];
  return { positions };
};

export const useMockProofs = () => {
  const proofs: ZKProof[] = [
    { id: 'proof-001', type: 'trade', status: 'verified', constraints: 1247392, proveTime: 182, proofSize: 288, timestamp: new Date(Date.now() - 120000) },
    { id: 'proof-002', type: 'balance', status: 'generating', constraints: 847392, proveTime: 156, proofSize: 288, timestamp: new Date(Date.now() - 60000) },
    { id: 'proof-003', type: 'compliance', status: 'complete', constraints: 392847, proveTime: 89, proofSize: 288, timestamp: new Date(Date.now() - 30000) },
  ];
  return { proofs };
};
