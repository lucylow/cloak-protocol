import { Button } from "@/components/ui/button";
import { Play, Shield, Zap, Lock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const stats = [
  { value: "1M+", label: "TPS Capacity", icon: Zap },
  { value: "100%", label: "Private Trades", icon: Lock },
  { value: "<2s", label: "Settlement", icon: Shield },
];

export const HeroSection = () => {
  const [tps, setTps] = useState(1247532);

  useEffect(() => {
    const interval = setInterval(() => {
      setTps(prev => prev + Math.floor(Math.random() * 1000) + 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 overflow-hidden">
      {/* Animated Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-radial-purple translate-x-1/3 -translate-y-1/4"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-radial-teal -translate-x-1/3 translate-y-1/4"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Animated grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_40%,transparent_100%)]" />
      </div>
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              Testnet Live • Powered by Psy Protocol
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Private Trading of{" "}
              </span>
              <span className="text-gradient">Real-World Assets</span>
              <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                {" "}with Zero-Knowledge Proofs
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Cloak Protocol is the first ZK-privacy DEX for Real-World Assets (RWAs), 
              built on Psy Protocol. Trade tokenized real estate, private credit, and 
              commodities with complete confidentiality.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/app">
                <Button variant="gradient" size="lg" className="group">
                  Start Trading Privately
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="glass" size="lg">
                <Play className="w-4 h-4" />
                Watch Demo
              </Button>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Interactive visualization */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="glass rounded-2xl p-6 relative">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Live Network Activity</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  Synced
                </div>
              </div>

              {/* TPS Counter */}
              <div className="text-center mb-8">
                <motion.div 
                  className="text-5xl font-bold text-gradient mb-2"
                  key={tps}
                  initial={{ scale: 1.02 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {tps.toLocaleString()}
                </motion.div>
                <div className="text-muted-foreground">Total Private Transactions</div>
              </div>

              {/* Animated transaction flow */}
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                      <Lock className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-muted rounded-full flex-1 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-primary to-accent"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                          />
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">ZK Proof Verified • Private</div>
                    </div>
                    <Shield className="w-4 h-4 text-accent" />
                  </motion.div>
                ))}
              </div>

              {/* Bottom stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-blue-400">1,247 TPS</div>
                  <div className="text-xs text-muted-foreground">Current Throughput</div>
                </div>
                <div className="p-3 bg-secondary/30 rounded-lg text-center">
                  <div className="text-lg font-bold text-accent">99.9%</div>
                  <div className="text-xs text-muted-foreground">Privacy Rate</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
