import { useState } from 'react';
import { ShieldCheck, Play, Zap, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useMockProofs } from '@/lib/mockData';

export function ZKProofSimulator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [proofComplete, setProofComplete] = useState(false);
  const { proofs } = useMockProofs();

  const generateProof = async () => {
    setIsGenerating(true);
    setProgress(0);
    setProofComplete(false);

    const phases = [
      { name: 'Circuit Setup', duration: 300, progress: 15 },
      { name: 'R1CS Generation', duration: 450, progress: 35 },
      { name: 'Witness Computation', duration: 350, progress: 55 },
      { name: 'Groth16 Prove', duration: 600, progress: 85 },
      { name: 'BLS12-381 Finalize', duration: 200, progress: 100 },
    ];

    for (const phase of phases) {
      setCurrentPhase(phase.name);
      await new Promise(resolve => setTimeout(resolve, phase.duration));
      setProgress(phase.progress);
    }

    setIsGenerating(false);
    setProofComplete(true);
    setCurrentPhase('');
  };

  return (
    <Card className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            ZK Proof Simulator
          </CardTitle>
          <div className="text-xs font-mono bg-secondary/50 px-2 py-1 rounded text-muted-foreground">
            GPU · CUDA
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Live Groth16 circuit execution</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted-foreground">
              {isGenerating ? currentPhase : proofComplete ? 'Proof Complete' : 'Ready'}
            </span>
            <span className="text-foreground">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-[10px] text-muted-foreground font-mono flex justify-between">
            <span>0ms</span>
            <span>~1.9s</span>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generateProof}
          disabled={isGenerating}
          className="w-full h-12 text-base font-semibold"
          variant={proofComplete ? "outline" : "default"}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin mr-2" />
              Proving...
            </>
          ) : proofComplete ? (
            <>
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Proof Verified ✓
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Generate Trade Proof (1.2M Constraints)
            </>
          )}
        </Button>

        {/* Stats */}
        {proofComplete && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold font-mono text-primary">182ms</div>
              <div className="text-[10px] text-muted-foreground">Prove Time</div>
            </div>
            <div className="p-2 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold font-mono text-accent">288B</div>
              <div className="text-[10px] text-muted-foreground">Proof Size</div>
            </div>
            <div className="p-2 bg-secondary/30 rounded-lg">
              <div className="text-lg font-bold font-mono text-green-400">1.2M</div>
              <div className="text-[10px] text-muted-foreground">Constraints</div>
            </div>
          </div>
        )}

        {/* Recent Proofs */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            Recent Proofs
          </h4>
          <div className="space-y-1.5">
            {proofs.slice(0, 3).map(proof => (
              <div key={proof.id} className="flex items-center justify-between py-2 px-3 bg-secondary/20 rounded-lg text-xs font-mono">
                <span className="text-muted-foreground uppercase">{proof.type}</span>
                <span className={
                  proof.status === 'verified' ? 'text-green-400' : 
                  proof.status === 'complete' ? 'text-primary' : 'text-yellow-400'
                }>
                  {proof.status}
                </span>
                <span className="text-foreground">{proof.proveTime}ms</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
