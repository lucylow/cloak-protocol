import { useState, useEffect } from 'react';
import { TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OrderBookEntry {
  id: string;
  amount: number;
  price: number;
  total: number;
}

export function InteractiveOrderBook() {
  const [selectedOrder, setSelectedOrder] = useState<OrderBookEntry | null>(null);
  const [bids, setBids] = useState<OrderBookEntry[]>([]);
  const [asks, setAsks] = useState<OrderBookEntry[]>([]);
  const [midPrice, setMidPrice] = useState(1.0025);

  // Generate random order book data
  useEffect(() => {
    const generateOrders = () => {
      const newBids: OrderBookEntry[] = Array.from({ length: 5 }, (_, i) => ({
        id: `bid-${i}`,
        amount: Math.floor(Math.random() * 500) + 50,
        price: 1.0025 - (i + 1) * 0.0015 - Math.random() * 0.001,
        total: 0
      })).map(b => ({ ...b, total: b.amount * b.price }));

      const newAsks: OrderBookEntry[] = Array.from({ length: 5 }, (_, i) => ({
        id: `ask-${i}`,
        amount: Math.floor(Math.random() * 500) + 50,
        price: 1.0025 + (i + 1) * 0.0015 + Math.random() * 0.001,
        total: 0
      })).map(a => ({ ...a, total: a.amount * a.price }));

      setBids(newBids);
      setAsks(newAsks);
      setMidPrice(prev => prev + (Math.random() - 0.5) * 0.002);
    };

    generateOrders();
    const interval = setInterval(generateOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Live Order Book
          </CardTitle>
          <div className="flex items-center gap-2 text-xs bg-accent/20 px-3 py-1 rounded-full text-accent">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="font-mono">Live · 1.2k TPS</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-1 bg-secondary/30 rounded-xl overflow-hidden">
          {/* Bids */}
          <div className="bg-gradient-to-b from-green-500/5 to-transparent p-3">
            <div className="text-xs font-mono text-green-400 mb-2 uppercase tracking-wider">Bids</div>
            <div className="space-y-1">
              {bids.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`
                    flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition-all text-xs
                    hover:bg-green-500/10
                    ${selectedOrder?.id === order.id ? 'bg-green-500/20 ring-1 ring-green-400/50' : ''}
                  `}
                >
                  <span className="font-mono text-muted-foreground">{order.amount.toLocaleString()}</span>
                  <span className="font-bold font-mono text-green-400">{order.price.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Asks */}
          <div className="bg-gradient-to-b from-red-500/5 to-transparent p-3">
            <div className="text-xs font-mono text-red-400 mb-2 uppercase tracking-wider">Asks</div>
            <div className="space-y-1">
              {asks.map(order => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`
                    flex justify-between items-center py-1.5 px-2 rounded cursor-pointer transition-all text-xs
                    hover:bg-red-500/10
                    ${selectedOrder?.id === order.id ? 'bg-red-500/20 ring-1 ring-red-400/50' : ''}
                  `}
                >
                  <span className="font-mono text-muted-foreground">{order.amount.toLocaleString()}</span>
                  <span className="font-bold font-mono text-red-400">{order.price.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mid Price */}
        <div className="flex items-center justify-center gap-4 py-3 bg-secondary/20 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold font-mono text-green-400">${midPrice.toFixed(4)}</div>
            <div className="text-xs text-muted-foreground mt-0.5">+2.3% (24h)</div>
          </div>
          <div className="flex flex-col items-center">
            <Shield className="h-6 w-6 text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground font-mono mt-1">ZK Protected</span>
          </div>
        </div>

        {selectedOrder && (
          <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
            <div className="text-xs font-mono text-muted-foreground">
              Selected: {selectedOrder.amount.toLocaleString()} @ ${selectedOrder.price.toFixed(4)} = ${selectedOrder.total.toFixed(2)}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
