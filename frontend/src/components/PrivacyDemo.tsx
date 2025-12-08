import { useState } from "react";
import { Home, HandCoins, TrendingUp, Check, Shield, Cpu, Lock, EyeOff, CheckCircle, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const transactions = [
  { icon: Home, amount: "$250,000", asset: "Commercial Real Estate Token", hash: "0x7f3a...8c2d" },
  { icon: HandCoins, amount: "$500,000", asset: "Private Credit Fund", hash: "0x2b9e...1f4a" },
  { icon: TrendingUp, amount: "10,000", asset: "Carbon Credit Tokens", hash: "0x9d4c...3e7b" },
];

const features = [
  { title: "Complete Confidentiality", desc: "Trade amounts, counterparties, and portfolio balances remain private" },
  { title: "Regulatory Compliance", desc: "Provide proof of credentials without exposing identity" },
  { title: "Institutional-Grade Security", desc: "Built on Psy Protocol's PoW 2.0 and PARTH architecture" },
  { title: "Real-World Asset Support", desc: "Tokenized real estate, private credit, commodities, and more" },
];

type ProofPhase = 'idle' | 'computing' | 'proving' | 'verifying' | 'complete';

const phaseDetails: Record<ProofPhase, { title: string; color: string; desc: string }> = {
  idle: { title: 'Ready for Private Trade', color: 'text-muted-foreground', desc: 'Click to generate ZK proof locally' },
  computing: { title: 'Computing Locally', color: 'text-blue-400', desc: 'Processing trade data on your device' },
  proving: { title: 'Generating ZK Proof', color: 'text-primary', desc: 'Creating cryptographic proof (data stays local)' },
  verifying: { title: 'Verifying Proof', color: 'text-accent', desc: 'Validating proof integrity' },
  complete: { title: 'Proof Ready', color: 'text-accent', desc: 'Proof generated locally, ready for submission' }
};

export const PrivacyDemo = () => {
  const [isPrivate, setIsPrivate] = useState(true);
  const [proofPhase, setProofPhase] = useState<ProofPhase>('idle');
  const [isGenerating, setIsGenerating] = useState(false);

  const simulateZKProof = async () => {
    setIsGenerating(true);
    
    setProofPhase('computing');
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    setProofPhase('proving');
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setProofPhase('verifying');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProofPhase('complete');
    setTimeout(() => {
      setProofPhase('idle');
      setIsGenerating(false);
    }, 2000);
  };

  const steps: ProofPhase[] = ['computing', 'proving', 'verifying', 'complete'];

  return (
    <section id="demo" className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-purple opacity-30" />
      
      <div className="container relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Experience ZK-Privacy in Action
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            See how Cloak Protocol keeps your RWA trades confidential while ensuring regulatory compliance
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Demo Visualization */}
          <motion.div 
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-background/50 rounded-full p-1 flex">
                <button
                  onClick={() => setIsPrivate(true)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    isPrivate ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                  }`}
                >
                  Private Mode
                </button>
                <button
                  onClick={() => setIsPrivate(false)}
                  className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                    !isPrivate ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
                  }`}
                >
                  Public Mode
                </button>
              </div>
            </div>

            {/* Transactions */}
            <div className="space-y-4 mb-8">
              {transactions.map((tx, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-4 p-5 bg-background/70 rounded-xl border border-border/50 transition-all duration-300 hover:translate-x-1 hover:shadow-lg group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                    <tx.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div className={`flex-1 transition-all duration-500 ${isPrivate ? "blur-md select-none" : ""}`}>
                    <div className="font-bold text-lg">{tx.amount}</div>
                    <div className="text-muted-foreground text-sm">{tx.asset}</div>
                    <div className="text-xs text-muted-foreground/60 font-mono mt-1">{tx.hash}</div>
                  </div>
                  <div className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    ZK-Protected
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ZK Proof Generator */}
            <div className="p-4 bg-secondary/30 rounded-xl border border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground">ZK Proof Generation</h4>
                <button
                  onClick={simulateZKProof}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-all duration-200 text-primary-foreground"
                >
                  {isGenerating ? 'Generating...' : 'Generate Proof'}
                </button>
              </div>

              {/* Timeline */}
              <div className="relative py-4">
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-border" />
                <div className="relative flex justify-between">
                  {steps.map((step, index) => {
                    const stepIndex = steps.indexOf(proofPhase);
                    const isActive = proofPhase === step;
                    const isCompleted = stepIndex > index || proofPhase === 'complete';
                    
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <motion.div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center z-10 relative transition-all duration-300 ${
                            isActive ? 'bg-gradient-primary shadow-glow' :
                            isCompleted ? 'bg-accent' : 'bg-secondary'
                          }`}
                          animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          {isCompleted && !isActive ? (
                            <CheckCircle className="h-4 w-4 text-accent-foreground" />
                          ) : isActive ? (
                            <Loader className="h-4 w-4 text-primary-foreground animate-spin" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                          )}
                        </motion.div>
                        <div className={`mt-2 text-xs font-medium capitalize ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step === 'complete' ? 'Done' : step.slice(0, 4)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={proofPhase}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm"
                >
                  <span className={phaseDetails[proofPhase].color}>{phaseDetails[proofPhase].title}</span>
                  <span className="text-muted-foreground"> - {phaseDetails[proofPhase].desc}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-6">
              How ZK-Privacy Protects Your Trades
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Traditional DEXs expose your trading activity to the public. Cloak Protocol 
              uses Zero-Knowledge Proofs to verify transactions without revealing sensitive details.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.li 
                  key={index} 
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div>
                    <span className="font-semibold">{feature.title}</span>
                    <span className="text-muted-foreground">: {feature.desc}</span>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Privacy comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <EyeOff className="w-4 h-4 text-destructive" />
                  <span className="font-semibold text-destructive">Public DEX</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• All trades visible on-chain</li>
                  <li>• Portfolio exposed</li>
                  <li>• Front-running risk</li>
                </ul>
              </div>
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-4 h-4 text-accent" />
                  <span className="font-semibold text-accent">Cloak Protocol</span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ZK-protected trades</li>
                  <li>• Hidden balances</li>
                  <li>• MEV-resistant</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
