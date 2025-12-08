import { useState, useEffect, useCallback } from 'react';
import { Order } from '@/lib/mockData';

export function useMockTrading() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '1', side: 'buy', asset: 'RWA-CREDIT', amount: 100, price: 0.95, total: 95, time: new Date(Date.now() - 10000), status: 'open' },
    { id: '2', side: 'sell', asset: 'RWA-ESTATE', amount: 0.5, price: 1.02, total: 510, time: new Date(Date.now() - 25000), status: 'open' },
    { id: '3', side: 'buy', asset: 'RWA-CARBON', amount: 500, price: 0.01, total: 5, time: new Date(Date.now() - 45000), status: 'filled' },
  ]);
  const [balance, setBalance] = useState({ USDC: 100000, RWA: 125.4 });
  const [isTrading, setIsTrading] = useState(false);

  const executeTrade = useCallback(async (order: Omit<Order, 'id' | 'time' | 'status'>) => {
    setIsTrading(true);
    
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}`,
      time: new Date(),
      status: Math.random() > 0.2 ? 'filled' : 'open'
    };
    
    setOrders(prev => [newOrder, ...prev.slice(0, 9)]);
    
    // Update balance
    if (order.side === 'buy') {
      setBalance(prev => ({ 
        USDC: prev.USDC - order.total,
        RWA: prev.RWA + order.amount
      }));
    } else {
      setBalance(prev => ({ 
        USDC: prev.USDC + order.total,
        RWA: prev.RWA - order.amount
      }));
    }
    
    setIsTrading(false);
    return newOrder;
  }, []);

  // Auto-match orders every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setOrders(prev => prev.map(order => 
          order.status === 'open' && Math.random() > 0.5
            ? { ...order, status: 'filled' as const }
            : order
        ));
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return { orders, balance, executeTrade, isTrading };
}
