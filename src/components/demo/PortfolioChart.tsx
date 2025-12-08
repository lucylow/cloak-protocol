import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PortfolioItem {
  label: string;
  value: number;
  pnl: number;
}

export function PortfolioChart() {
  const [data, setData] = useState<PortfolioItem[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalPnl, setTotalPnl] = useState(0);

  useEffect(() => {
    const updateData = () => {
      const newData = [
        { label: 'RWA-CREDIT', value: 125400 + Math.random() * 2000 - 1000, pnl: 3.26 + (Math.random() - 0.5) * 0.5 },
        { label: 'RWA-ESTATE', value: 2100000 + Math.random() * 20000 - 10000, pnl: 2.04 + (Math.random() - 0.5) * 0.3 },
        { label: 'RWA-CARBON', value: 8470 + Math.random() * 200 - 100, pnl: 5.67 + (Math.random() - 0.5) * 0.8 },
        { label: 'RWA-ART', value: 125000 + Math.random() * 5000 - 2500, pnl: -1.23 + (Math.random() - 0.5) * 0.4 },
      ];
      setData(newData);
      setTotalValue(newData.reduce((sum, item) => sum + item.value, 0));
      setTotalPnl(newData.reduce((sum, item) => sum + item.pnl, 0) / newData.length);
    };
    
    updateData();
    const interval = setInterval(updateData, 5000);
    return () => clearInterval(interval);
  }, []);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Portfolio PnL
          </CardTitle>
          <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Live · 5s
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Stats */}
        <div className="flex justify-between items-center p-3 bg-secondary/20 rounded-lg">
          <div>
            <div className="text-xs text-muted-foreground">Total Value</div>
            <div className="text-xl font-bold font-mono">${(totalValue / 1000000).toFixed(2)}M</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Avg PnL</div>
            <div className={`text-xl font-bold font-mono flex items-center gap-1 ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnl >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-mono text-muted-foreground">{item.label}</span>
                <span className={`font-mono font-medium ${item.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {item.pnl >= 0 ? '+' : ''}{item.pnl.toFixed(2)}%
                </span>
              </div>
              <div className="relative h-6 bg-secondary/30 rounded overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 rounded transition-all duration-500 ${
                    item.pnl >= 0 
                      ? 'bg-gradient-to-r from-green-500/60 to-green-400/40' 
                      : 'bg-gradient-to-r from-red-500/60 to-red-400/40'
                  }`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                />
                <div className="absolute inset-0 flex items-center px-2 text-xs font-mono text-foreground/80">
                  ${item.value >= 1000000 ? `${(item.value/1000000).toFixed(2)}M` : `${(item.value/1000).toFixed(0)}k`}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy Badge */}
        <div className="flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 bg-primary rounded-full" />
          <span className="font-mono">All positions ZK-shielded</span>
        </div>
      </CardContent>
    </Card>
  );
}
