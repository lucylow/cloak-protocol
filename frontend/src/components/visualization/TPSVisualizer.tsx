import React, { useState, useEffect } from 'react';
import { Zap, Layers, Clock, TrendingUp, Package } from 'lucide-react';
import { motion } from 'framer-motion';

interface BatchTransaction {
  id: string;
  size: number;
  status: 'pending' | 'aggregating' | 'settling' | 'completed';
  timestamp: number;
  estimatedSettlement: number;
}

const statusConfig = {
  pending: { color: 'bg-gray-400/20 text-gray-300', Icon: Clock },
  aggregating: { color: 'bg-white/20 text-white', Icon: Layers },
  settling: { color: 'bg-primary/20 text-primary', Icon: Package },
  completed: { color: 'bg-accent/20 text-accent', Icon: TrendingUp }
};

export const TPSVisualizer: React.FC = () => {
  const [liveTps, setLiveTps] = useState(1247);
  const [pendingTransactions, setPendingTransactions] = useState(42);
  const [batches, setBatches] = useState<BatchTransaction[]>([
    { id: 'B#7823', size: 128, status: 'settling', timestamp: Date.now() - 120000, estimatedSettlement: 2.3 },
    { id: 'B#7824', size: 256, status: 'aggregating', timestamp: Date.now() - 60000, estimatedSettlement: 1.8 },
    { id: 'B#7825', size: 64, status: 'pending', timestamp: Date.now(), estimatedSettlement: 3.1 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTps(prev => {
        const change = Math.random() > 0.5 ? 50 : -30;
        return Math.max(800, Math.min(2000, prev + change));
      });
      
      if (Math.random() > 0.7) {
        setPendingTransactions(prev => prev + Math.floor(Math.random() * 5) + 1);
      }
      
      setBatches(prev => prev.map((batch): BatchTransaction => {
        if (batch.status === 'pending' && Math.random() > 0.9) {
          return { ...batch, status: 'aggregating' as const, estimatedSettlement: batch.estimatedSettlement * 0.8 };
        }
        if (batch.status === 'aggregating' && Math.random() > 0.85) {
          return { ...batch, status: 'settling' as const, estimatedSettlement: batch.estimatedSettlement * 0.5 };
        }
        if (batch.status === 'settling' && Math.random() > 0.8) {
          return { ...batch, status: 'completed' as const };
        }
        return batch;
      }).filter(batch => batch.status !== 'completed' || Math.random() > 0.5));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-xl p-6 shadow-glow border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-6 w-6 text-white" />
          PARTH High-TPS Engine
        </h3>
        <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg">
          <motion.div 
            className="text-2xl font-bold text-white"
            key={liveTps}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
          >
            {liveTps.toLocaleString()} TPS
          </motion.div>
          <div className="text-xs text-gray-300/70">Live Throughput</div>
        </div>
      </div>

      {/* Batch Processing Visualization */}
      <div className="mb-8">
        <h4 className="font-semibold text-muted-foreground mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Batch Processing Queue
        </h4>
        
        <div className="space-y-3">
          {batches.map((batch, index) => {
            const config = statusConfig[batch.status];
            const StatusIcon = config.Icon;
            
            return (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-secondary/50 rounded-lg border border-border hover:border-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <StatusIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold">{batch.id}</div>
                      <div className="text-sm text-muted-foreground">{batch.size} transactions</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
                      {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                    </div>
                    {batch.status !== 'completed' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        ~{batch.estimatedSettlement.toFixed(1)}s to settle
                      </div>
                    )}
                  </div>
                </div>
                
                {batch.status !== 'completed' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-white to-primary"
                        initial={{ width: '0%' }}
                        animate={{ 
                          width: batch.status === 'pending' ? '25%' : 
                                 batch.status === 'aggregating' ? '60%' : '90%'
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-blue-400">{pendingTransactions}</div>
          <div className="text-sm text-muted-foreground">Pending TX</div>
        </div>
        
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-accent">2.3s</div>
          <div className="text-sm text-muted-foreground">Avg. Settlement</div>
        </div>
        
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-primary">99.9%</div>
          <div className="text-sm text-muted-foreground">Success Rate</div>
        </div>
        
        <div className="p-4 bg-secondary/30 rounded-lg border border-border">
          <div className="text-2xl font-bold text-yellow-400">64</div>
          <div className="text-sm text-muted-foreground">Active Batches</div>
        </div>
      </div>

      {/* Explanatory Note */}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="h-5 w-5 text-blue-400 mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-300">Psy's PARTH Architecture in Action</p>
            <p className="text-muted-foreground mt-1">
              Transactions are batched and settled in parallel lanes, enabling million+ TPS.
              Each batch undergoes ZK-proof aggregation before final settlement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
