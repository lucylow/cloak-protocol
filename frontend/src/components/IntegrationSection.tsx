import { Brain, Lock, Hammer, GitBranch, Rocket, ShieldCheck, Cog, Link, Zap, Layers, Package, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const protocols = [
  { icon: Brain, title: "PARTH Architecture", desc: "Horizontally scalable state management enabling 1M+ TPS for high-frequency RWA trading" },
  { icon: Lock, title: "Programmable SDKeys", desc: "Private identities that generate ZK proofs of credentials without exposing underlying data" },
  { icon: Hammer, title: "Proof of Useful Work 2.0", desc: "Miners verify and aggregate ZK proofs, securing the network while processing your trades" },
  { icon: GitBranch, title: "Client-Side ZK Proofs", desc: "All proofs generated locally on your device - your data never leaves your control" },
];

const benefits = [
  { icon: Rocket, title: "Horizontal Scalability", desc: "PARTH architecture enables unlimited parallel execution lanes" },
  { icon: ShieldCheck, title: "True Data Ownership", desc: "Client-side proof generation means your data stays on your device" },
  { icon: Cog, title: "Efficient Consensus", desc: "PoW 2.0 uses useful work (ZK proof verification) to secure the network" },
  { icon: Link, title: "Native Interoperability", desc: "Built-in bridges and cross-chain capabilities" },
];

interface BatchStatus {
  id: string;
  size: number;
  status: 'aggregating' | 'proving' | 'mining' | 'settled';
  progress: number;
}

export const IntegrationSection = () => {
  const [batches, setBatches] = useState<BatchStatus[]>([
    { id: 'B#7823', size: 128, status: 'mining', progress: 85 },
    { id: 'B#7824', size: 256, status: 'proving', progress: 45 },
    { id: 'B#7825', size: 64, status: 'aggregating', progress: 20 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBatches(prev => prev.map((batch): BatchStatus => {
        const newProgress = Math.min(100, batch.progress + Math.random() * 15);
        let newStatus: BatchStatus['status'] = batch.status;
        
        if (newProgress >= 30 && batch.status === 'aggregating') newStatus = 'proving';
        if (newProgress >= 60 && batch.status === 'proving') newStatus = 'mining';
        if (newProgress >= 95) newStatus = 'settled';
        
        return { ...batch, progress: newProgress, status: newStatus };
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: BatchStatus['status']) => {
    const colors = {
      aggregating: 'bg-blue-500/20 text-blue-400',
      proving: 'bg-primary/20 text-primary',
      mining: 'bg-yellow-500/20 text-yellow-400',
      settled: 'bg-accent/20 text-accent'
    };
    return colors[status];
  };

  const getStatusIcon = (status: BatchStatus['status']) => {
    const icons = { aggregating: Layers, proving: Package, mining: Hammer, settled: CheckCircle };
    return icons[status];
  };

  return (
    <section id="integration" className="py-24 bg-card relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-radial-teal -translate-x-1/3 translate-y-1/2" />
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Zap className="w-4 h-4" />
            Powered by Psy Protocol
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Next-Generation Infrastructure
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leveraging next-generation blockchain infrastructure for unparalleled privacy and scalability
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Protocol Cards */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {protocols.map((protocol, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-5 p-6 bg-background/50 rounded-xl border border-border/50 transition-all duration-300 hover:border-primary/50 hover:translate-x-1 cursor-pointer group"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <protocol.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">{protocol.title}</h4>
                  <p className="text-muted-foreground text-sm">{protocol.desc}</p>
                </div>
              </motion.div>
            ))}

            {/* Live Batch Processing */}
            <motion.div 
              className="p-6 bg-background/50 rounded-xl border border-border/50 mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </div>
                <span className="font-semibold">Live Batch Processing</span>
              </div>
              
              <div className="space-y-3">
                {batches.map((batch) => {
                  const StatusIcon = getStatusIcon(batch.status);
                  return (
                    <div key={batch.id} className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${getStatusColor(batch.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-mono">{batch.id}</span>
                          <span className="text-muted-foreground">{batch.size} tx</span>
                        </div>
                        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: '0%' }}
                            animate={{ width: `${batch.progress}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">
              Why Psy Protocol Powers Cloak
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Psy Protocol provides the foundation for truly private, scalable decentralized 
              applications. Unlike traditional blockchains that sacrifice privacy for transparency 
              or scalability for decentralization, Psy delivers all three.
            </p>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Cloak Protocol is built from the ground up to leverage Psy's unique architecture:
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.li 
                  key={index} 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <benefit.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">{benefit.title}</span>
                    <span className="text-muted-foreground">: {benefit.desc}</span>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Architecture diagram hint */}
            <motion.div 
              className="mt-8 p-4 bg-primary/10 border border-primary/20 rounded-xl"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-primary">PoW 2.0 = Useful Work</p>
                  <p className="text-sm text-muted-foreground">
                    Miners verify ZK proofs as their "useful work", securing the network while processing your private transactions.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
