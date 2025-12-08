import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Vote, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getProposals, vote, getUserVotes, type Proposal } from '@/lib/mockApi';
import { CreateProposalDialog } from '@/components/governance/CreateProposalDialog';
import { ProposalDetailSheet } from '@/components/governance/ProposalDetailSheet';

const statusConfig = {
  active: { icon: Clock, color: 'text-accent', bg: 'bg-accent/10', label: 'Active' },
  passed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Passed' },
  rejected: { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Rejected' },
  pending: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Pending' },
};

const categoryColors = {
  protocol: 'bg-primary/20 text-primary border-primary/30',
  treasury: 'bg-accent/20 text-accent border-accent/30',
  governance: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  security: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function GovernancePage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);
      const [proposalsData, votesData] = await Promise.all([
        getProposals(),
        getUserVotes(),
      ]);
      setProposals(proposalsData);
      setUserVotes(votesData);
    } catch (error) {
      toast({
        title: 'Error loading data',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVote = async (proposalId: string, option: 'for' | 'against' | 'abstain') => {
    try {
      setVotingId(proposalId);
      const result = await vote(proposalId, option);
      
      if (result.success) {
        setUserVotes(prev => ({ ...prev, [proposalId]: option }));
        setProposals(prev => prev.map(p => 
          p.id === proposalId 
            ? { ...p, ...result.newTotals }
            : p
        ));
        toast({
          title: 'Vote submitted',
          description: `Your vote "${option}" has been recorded on-chain.`,
        });
      }
    } catch (error) {
      toast({
        title: 'Vote failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setVotingId(null);
    }
  };

  const activeProposals = proposals.filter(p => p.status === 'active');
  const pastProposals = proposals.filter(p => p.status !== 'active');

  const stats = {
    totalProposals: proposals.length,
    activeVotes: activeProposals.length,
    participationRate: 67.4,
    totalVoters: 12847,
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  const getTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    if (diff <= 0) return 'Ended';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const ProposalCard = ({ proposal }: { proposal: Proposal }) => {
    const StatusIcon = statusConfig[proposal.status].icon;
    const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
    const forPercent = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
    const againstPercent = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
    const quorumPercent = Math.min((totalVotes / proposal.quorum) * 100, 100);
    const userVote = userVotes[proposal.id];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="group cursor-pointer hover:border-accent/50 transition-all"
          onClick={() => setSelectedProposal(proposal)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={categoryColors[proposal.category]}>
                    {proposal.category}
                  </Badge>
                  <Badge variant="outline" className={`${statusConfig[proposal.status].bg} ${statusConfig[proposal.status].color} border-0`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig[proposal.status].label}
                  </Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">
                  {proposal.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {proposal.summary}
                </CardDescription>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Vote Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-400">For: {formatNumber(proposal.votesFor)}</span>
                <span className="text-destructive">Against: {formatNumber(proposal.votesAgainst)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                <div 
                  className="bg-green-400 transition-all"
                  style={{ width: `${forPercent}%` }}
                />
                <div 
                  className="bg-destructive transition-all"
                  style={{ width: `${againstPercent}%` }}
                />
              </div>
            </div>

            {/* Quorum */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Quorum Progress</span>
                <span>{quorumPercent.toFixed(1)}%</span>
              </div>
              <Progress value={quorumPercent} className="h-1" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground">
                {proposal.status === 'active' ? getTimeRemaining(proposal.endDate) : `Ended ${proposal.endDate.toLocaleDateString()}`}
              </span>
              {userVote ? (
                <Badge variant="outline" className="text-xs">
                  You voted: {userVote}
                </Badge>
              ) : proposal.status === 'active' ? (
                <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs border-green-500/30 text-green-400 hover:bg-green-500/10"
                    onClick={() => handleVote(proposal.id, 'for')}
                    disabled={votingId === proposal.id}
                  >
                    For
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => handleVote(proposal.id, 'against')}
                    disabled={votingId === proposal.id}
                  >
                    Against
                  </Button>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Governance</h1>
          <p className="text-muted-foreground mt-1">
            Participate in protocol decisions with privacy-preserving voting
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-gradient-primary shadow-glow">
          <Plus className="h-4 w-4 mr-2" />
          Create Proposal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalProposals}</p>
                <p className="text-xs text-muted-foreground">Total Proposals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Vote className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.activeVotes}</p>
                <p className="text-xs text-muted-foreground">Active Votes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.participationRate}%</p>
                <p className="text-xs text-muted-foreground">Participation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatNumber(stats.totalVoters)}</p>
                <p className="text-xs text-muted-foreground">Total Voters</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Proposals */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="bg-card border border-border">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Active ({activeProposals.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Past ({pastProposals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                    <div className="h-6 bg-muted rounded w-3/4" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-2 bg-muted rounded w-full mb-4" />
                    <div className="h-1 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeProposals.length === 0 ? (
            <Card className="bg-card/50">
              <CardContent className="py-12 text-center">
                <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No active proposals</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Be the first to create a proposal for the community
                </p>
                <Button onClick={() => setCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Proposal
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence>
                {activeProposals.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastProposals.length === 0 ? (
            <Card className="bg-card/50">
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No past proposals</p>
                <p className="text-sm text-muted-foreground">
                  Past proposals will appear here after voting ends
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <AnimatePresence>
                {pastProposals.map(proposal => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateProposalDialog 
        open={createOpen} 
        onOpenChange={setCreateOpen}
        onSuccess={loadData}
      />
      
      <ProposalDetailSheet
        proposal={selectedProposal}
        onClose={() => setSelectedProposal(null)}
        userVote={selectedProposal ? userVotes[selectedProposal.id] : undefined}
        onVote={handleVote}
        isVoting={votingId !== null}
      />
    </div>
  );
}
