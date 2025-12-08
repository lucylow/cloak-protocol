import React, { useState } from 'react';
import { Shield, Cpu, Lock, EyeOff, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProofGenerationStatus {
  phase: 'idle' | 'computing' | 'proving' | 'verifying' | 'complete';
  localData: boolean;
  proofSize: number;
  estimatedTime: number;
}

const phaseDetails = {
  idle: { title: 'Ready for Private Trade', Icon: Shield, color: 'text-muted-foreground', desc: 'Click to generate ZK proof locally' },
  computing: { title: 'Computing Locally', Icon: Cpu, color: 'text-white', desc: 'Processing trade data on your device' },
  proving: { title: 'Generating ZK Proof', Icon: Lock, color: 'text-primary', desc: 'Creating cryptographic proof (data stays local)' },
  verifying: { title: 'Verifying Proof', Icon: CheckCircle, color: 'text-accent', desc: 'Validating proof integrity' },
  complete: { title: 'Proof Ready', Icon: Shield, color: 'text-accent', desc: 'Proof generated locally, ready for submission' }
};

export const PrivacyStatusVisualizer: React.FC = () => {
  const [status, setStatus] = useState<ProofGenerationStatus>({
    phase: 'idle',
    localData: true,
    proofSize: 0,
    estimatedTime: 0
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const simulateZKProof = async () => {
    setIsGenerating(true);
    
    setStatus({ phase: 'computing', localData: true, proofSize: 0, estimatedTime: 1500 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus({ phase: 'proving', localData: true, proofSize: 245, estimatedTime: 800 });
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setStatus({ phase: 'verifying', localData: true, proofSize: 245, estimatedTime: 400 });
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setStatus({ phase: 'complete', localData: true, proofSize: 245, estimatedTime: 0 });
    setTimeout(() => {
      setStatus({ phase: 'idle', localData: true, proofSize: 0, estimatedTime: 0 });
      setIsGenerating(false);
    }, 2000);
  };

  const phase = phaseDetails[status.phase];
  const PhaseIcon = phase.Icon;

  const steps = ['computing', 'proving', 'verifying', 'complete'] as const;

  return (
    <div className="glass rounded-xl p-6 shadow-glow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          Psy Protocol Privacy Engine
        </h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.localData ? 'bg-accent/20 text-accent' : 'bg-destructive/20 text-destructive'}`}>
          {status.localData ? '🔒 Data Local' : '⚠️ Data Exposed'}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-muted-foreground">ZK Proof Generation Flow</h4>
          <button
            onClick={simulateZKProof}
            disabled={isGenerating}
            className="px-4 py-2 bg-gradient-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-all duration-200 text-primary-foreground"
          >
            {isGenerating ? 'Generating...' : 'Simulate Proof Generation'}
          </button>
        </div>

        {/* Visual Timeline */}
        <div className="relative py-4">
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-border" />
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const stepIndex = steps.indexOf(status.phase as typeof steps[number]);
              const isActive = status.phase === step;
              const isCompleted = stepIndex > index || status.phase === 'complete';
              
              return (
                <div key={step} className="flex flex-col items-center">
                  <motion.div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative transition-all duration-300 ${
                      isActive ? 'bg-gradient-primary shadow-glow' :
                      isCompleted ? 'bg-accent' : 'bg-secondary'
                    }`}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle className="h-5 w-5 text-accent-foreground" />
                    ) : isActive ? (
                      <Loader className="h-5 w-5 text-primary-foreground animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/50" />
                    )}
                  </motion.div>
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-medium capitalize ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Details */}
        <AnimatePresence mode="wait">
          <motion.div
            key={status.phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border"
          >
            <div className="flex items-center gap-3 mb-2">
              <PhaseIcon className={`h-5 w-5 ${phase.color}`} />
              <h5 className="font-semibold">{phase.title}</h5>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{phase.desc}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Proof Size</div>
                <div className="font-mono text-foreground">{status.proofSize} bytes</div>
              </div>
              <div>
                <div className="text-muted-foreground">Data Location</div>
                <div className="flex items-center gap-1 text-accent">
                  <Cpu className="h-4 w-4" />
                  <span>Your Device Only</span>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Key Privacy Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <EyeOff className="h-4 w-4 text-primary" />
            <span className="font-medium">Zero Knowledge</span>
          </div>
          <p className="text-sm text-muted-foreground">Prove trade validity without revealing amounts or balances</p>
        </div>
        
        <div className="p-4 bg-secondary/30 rounded-lg border border-border hover:border-accent/30 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="h-4 w-4 text-accent" />
            <span className="font-medium">Client-Side Processing</span>
          </div>
          <p className="text-sm text-muted-foreground">All proofs generated locally, data never leaves your device</p>
        </div>
      </div>
    </div>
  );
};
