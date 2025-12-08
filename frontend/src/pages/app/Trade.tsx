import { useState } from 'react';
import { Zap, Shield, BarChart3, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InteractiveOrderBook } from '@/components/demo/InteractiveOrderBook';
import { ZKProofSimulator } from '@/components/demo/ZKProofSimulator';
import { PortfolioChart } from '@/components/demo/PortfolioChart';
import { useMockTrading } from '@/hooks/useMockTrading';
import { InfoTooltip } from '@/components/ui/privacy-indicators';

const TradePage = () => {
  const { executeTrade, balance, isTrading, orders } = useMockTrading();
  const [tradeForm, setTradeForm] = useState({
    side: 'buy' as 'buy' | 'sell',
    asset: 'RWA-CREDIT',
    amount: '',
    price: '1.00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tradeForm.amount) return;
    
    await executeTrade({
      side: tradeForm.side,
      asset: tradeForm.asset,
      amount: Number(tradeForm.amount),
      price: Number(tradeForm.price),
      total: Number(tradeForm.amount) * Number(tradeForm.price)
    });
    
    setTradeForm(prev => ({ ...prev, amount: '' }));
  };

  const total = Number(tradeForm.amount || 0) * Number(tradeForm.price || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-foreground">Private Trading</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Execute private RWA trades with end-to-end ZK proofs. No front-running, no data leaks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Trade Form + Order Book */}
        <div className="space-y-6">
          {/* Trade Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary" />
                Execute Trade
                <InfoTooltip content="Your trade details are encrypted using ZK proofs before submission" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Side</Label>
                    <Select 
                      value={tradeForm.side} 
                      onValueChange={(v) => setTradeForm({...tradeForm, side: v as 'buy' | 'sell'})}
                    >
                      <SelectTrigger className="bg-secondary/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">
                          <span className="text-green-400 font-medium">BUY</span>
                        </SelectItem>
                        <SelectItem value="sell">
                          <span className="text-red-400 font-medium">SELL</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Asset</Label>
                    <Select 
                      value={tradeForm.asset} 
                      onValueChange={(v) => setTradeForm({...tradeForm, asset: v})}
                    >
                      <SelectTrigger className="bg-secondary/30 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RWA-CREDIT">RWA-CREDIT</SelectItem>
                        <SelectItem value="RWA-ESTATE">RWA-ESTATE</SelectItem>
                        <SelectItem value="RWA-CARBON">RWA-CARBON</SelectItem>
                        <SelectItem value="RWA-ART">RWA-ART</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={tradeForm.amount}
                      onChange={(e) => setTradeForm({...tradeForm, amount: e.target.value})}
                      className="bg-secondary/30 border-border/50 font-mono text-right"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Price (USDC)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      placeholder="1.0000"
                      value={tradeForm.price}
                      onChange={(e) => setTradeForm({...tradeForm, price: e.target.value})}
                      className="bg-secondary/30 border-border/50 font-mono text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-secondary/20 rounded-lg text-sm">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-mono font-bold">${total.toFixed(2)} USDC</span>
                </div>

                <Button
                  type="submit"
                  disabled={isTrading || !tradeForm.amount}
                  className={`w-full h-12 text-base font-semibold transition-all ${
                    tradeForm.side === 'buy' 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {isTrading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
                      Generating ZK Proof...
                    </>
                  ) : (
                    <>
                      <Shield className="h-5 w-5 mr-2" />
                      Execute Private {tradeForm.side.toUpperCase()}
                    </>
                  )}
                </Button>
              </form>

              {/* Balance Display */}
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">USDC:</span>
                    <span className="font-bold">${balance.USDC?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">RWA:</span>
                    <span className="font-bold">{balance.RWA?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Book */}
          <InteractiveOrderBook />

          {/* Recent Orders */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {orders.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">No orders yet. Execute a trade above!</p>
                ) : (
                  orders.slice(0, 5).map(order => (
                    <div key={order.id} className="flex items-center justify-between py-2 px-3 bg-secondary/20 rounded-lg text-xs font-mono">
                      <span className={order.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                        {order.side.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">{order.amount} {order.asset}</span>
                      <span className={
                        order.status === 'filled' ? 'text-green-400' : 
                        order.status === 'cancelled' ? 'text-red-400' : 'text-yellow-400'
                      }>
                        {order.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Charts + Proof Simulator */}
        <div className="space-y-6">
          <PortfolioChart />
          <ZKProofSimulator />

          {/* Settlement Stats */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                Settlement Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <div className="text-muted-foreground mb-1">Avg. Settlement</div>
                  <div className="font-mono font-bold text-xl text-foreground">180ms</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <div className="text-muted-foreground mb-1">Proof Size</div>
                  <div className="font-mono font-bold text-xl text-foreground">288 bytes</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Powered by Psy Protocol PoW 2.0 batch verification
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
