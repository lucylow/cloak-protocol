import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettlementBatch {
  id: string;
  size: number;
  totalValue: number;
  status: 'aggregating' | 'proving' | 'mining' | 'settled';
  progress: number;
  startTime: number;
}

const statusInfo = {
  aggregating: { 
    label: 'Aggregating Proofs', 
    color: 'text-white', 
    bg: 'bg-white/20',
    Icon: Users,
    description: 'Collecting ZK proofs from users'
  },
  proving: { 
    label: 'Generating Batch Proof', 
    color: 'text-primary', 
    bg: 'bg-primary/20',
    Icon: Package,
    description: 'Creating recursive proof for the batch'
  },
  mining: { 
    label: 'PoW 2.0 Verification', 
    color: 'text-gray-300', 
    bg: 'bg-gray-400/20',
    Icon: TrendingUp,
    description: 'Miners verifying batch proof (Useful Work)'
  },
  settled: { 
    label: 'Settled', 
    color: 'text-accent', 
    bg: 'bg-accent/20',
    Icon: CheckCircle,
    description: 'Batch settled on Psy mainchain'
  }
};

export const BatchSettlementTracker: React.FC = () => {
  const [activeBatch, setActiveBatch] = useState<SettlementBatch>({
    id: 'BATCH#7823-45',
    size: 128,
    totalValue: 4250000,
    status: 'proving',
    progress: 65,
    startTime: Date.now() - 180000
  });

  const [recentBatches] = useState<SettlementBatch[]>([
    { id: 'BATCH#7823-44', size: 256, totalValue: 8200000, status: 'settled', progress: 100, startTime: Date.now() - 300000 },
    { id: 'BATCH#7823-43', size: 64, totalValue: 1850000, status: 'settled', progress: 100, startTime: Date.now() - 480000 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBatch(prev => {
        if (prev.status === 'settled') return prev;
        
        const newProgress = Math.min(100, prev.progress + Math.random() * 10);
        let newStatus: SettlementBatch['status'] = prev.status;
        
        if (newProgress >= 30 && prev.status === 'aggregating') newStatus = 'proving';
        if (newProgress >= 70 && prev.status === 'proving') newStatus = 'mining';
        if (newProgress >= 100) newStatus = 'settled';
        
        return { ...prev, progress: newProgress, status: newStatus };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const currentStatus = statusInfo[activeBatch.status];
  const StatusIcon = currentStatus.Icon;

  const stages = ['aggregating', 'proving', 'mining', 'settled'] as const;

  return (
    <div className="glass rounded-xl p-6 shadow-glow border-accent/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-accent" />
          Batch Settlement Tracker
        </h3>
        <div className={`px-3 py-1.5 rounded-lg ${currentStatus.bg} ${currentStatus.color} font-medium`}>
          {currentStatus.label}
        </div>
      </div>

      {/* Active Batch Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-foreground">Active Batch: {activeBatch.id}</h4>
            <p className="text-sm text-muted-foreground">{currentStatus.description}</p>
          </div>
          <div className="text-right">
            <motion.div 
              className="text-2xl font-bold text-foreground"
              key={Math.round(activeBatch.progress)}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
            >
              {activeBatch.progress.toFixed(0)}%
            </motion.div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="space-y-4">
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${activeBatch.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="grid grid-cols-4 gap-2 text-center">
            {stages.map((stage, index) => {
              const stageIndex = stages.indexOf(activeBatch.status);
              const isCompleted = index < stageIndex || (index === stageIndex && activeBatch.progress >= 100);
              const isActive = index === stageIndex;
              
              return (
                <div key={stage} className="text-sm">
                  <motion.div 
                    className={`h-2 w-2 mx-auto rounded-full mb-1 ${isCompleted ? 'bg-accent' : isActive ? 'bg-primary' : 'bg-muted'}`}
                    animate={isActive ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <div className={`text-xs ${isCompleted ? 'text-accent' : isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                    {statusInfo[stage].label.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Batch Details */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-secondary/30 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground">Batch Size</div>
            <div className="font-bold text-lg text-foreground">{activeBatch.size} TX</div>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="font-bold text-lg text-foreground">${(activeBatch.totalValue / 1000000).toFixed(1)}M</div>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground">Time Elapsed</div>
            <div className="font-bold text-lg flex items-center gap-1 text-foreground">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {Math.floor((Date.now() - activeBatch.startTime) / 60000)}m
            </div>
          </div>
          <div className="p-3 bg-secondary/30 rounded-lg border border-border">
            <div className="text-sm text-muted-foreground">Status</div>
            <div className="font-bold text-lg flex items-center gap-1 text-foreground">
              <StatusIcon className={`h-4 w-4 ${currentStatus.color}`} />
              <span className="capitalize">{activeBatch.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Batches */}
      <div>
        <h4 className="font-semibold text-muted-foreground mb-4">Recently Settled</h4>
        <div className="space-y-3">
          {recentBatches.map((batch) => (
            <motion.div 
              key={batch.id} 
              className="p-3 bg-secondary/30 rounded-lg border border-border hover:border-accent/30 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground">{batch.id}</div>
                  <div className="text-sm text-muted-foreground">
                    {batch.size} transactions • ${(batch.totalValue / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="flex items-center gap-2 text-accent">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Settled</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Psy Integration Note */}
      <div className="mt-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
        <p className="text-sm text-foreground">
          <span className="font-medium text-accent">Psy PoW 2.0 Integration:</span>
          {' '}Batch settlement leverages miners' useful work (ZK proof verification) for efficient, secure transaction processing at scale.
        </p>
      </div>
    </div>
  );
};
