import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, Shield, Zap, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const stats = [
  { value: "$4.2B+", label: "RWA Market Volume", icon: Shield },
  { value: "24", label: "Private RWA Pools", icon: Lock },
  { value: "<2s", label: "Avg. Settlement Time", icon: Zap },
  { value: "100%", label: "ZK-Protected Trades", icon: Shield },
];

export const CTASection = () => {
  const [volume, setVolume] = useState(4200000000);

  useEffect(() => {
    const interval = setInterval(() => {
      setVolume(prev => prev + Math.floor(Math.random() * 100000));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatVolume = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B+`;
    return `$${(num / 1e6).toFixed(1)}M+`;
  };

  return (
    <section className="py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-radial-purple translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-radial-teal -translate-x-1/2 translate-y-1/2" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            Testnet Now Live
          </motion.div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Trade RWAs with{" "}
            <span className="text-gradient">Complete Privacy</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join the future of confidential institutional trading. Cloak Protocol is 
            currently in testnet with mainnet launch coming soon.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Link to="/app">
              <Button variant="gradient" size="lg" className="group">
                Join Testnet
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="glass" size="lg">
              <BookOpen className="w-4 h-4" />
              Read Documentation
            </Button>
          </div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="glass rounded-xl p-6 text-center group hover:border-primary/30 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <motion.div 
                  className="text-2xl sm:text-3xl font-bold text-accent mb-2"
                  key={index === 0 ? volume : stat.value}
                  initial={index === 0 ? { scale: 1.05 } : {}}
                  animate={{ scale: 1 }}
                >
                  {index === 0 ? formatVolume(volume) : stat.value}
                </motion.div>
                <div className="text-muted-foreground text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div 
            className="mt-16 pt-8 border-t border-border/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by leading institutions</p>
            <div className="flex items-center justify-center gap-8 opacity-50">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-24 h-8 bg-muted/20 rounded-md" />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
