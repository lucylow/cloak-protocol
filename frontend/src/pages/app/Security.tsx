import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  FileCheck,
  Eye,
  Key,
  Server,
  Zap,
  Download,
  ExternalLink
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const securityFeatures = [
  {
    title: 'Zero-Knowledge Proofs',
    description: 'All transactions are protected by advanced ZK cryptography, ensuring complete privacy while maintaining verifiability.',
    icon: Eye,
    status: 'active',
  },
  {
    title: 'Local Key Storage',
    description: 'SDKeys are generated and stored exclusively on your device. We never have access to your private keys.',
    icon: Key,
    status: 'active',
  },
  {
    title: 'Batch Settlement',
    description: 'Trades are batched into groups of 64, reducing on-chain costs and improving privacy through aggregation.',
    icon: Server,
    status: 'active',
  },
  {
    title: 'Audited Smart Contracts',
    description: 'All smart contracts have undergone comprehensive security audits by leading blockchain security firms.',
    icon: FileCheck,
    status: 'active',
  },
  {
    title: 'End-to-End Encryption',
    description: 'All sensitive data is encrypted at rest and in transit using industry-standard encryption protocols.',
    icon: Lock,
    status: 'active',
  },
  {
    title: 'Open Source',
    description: 'Our codebase is open source, allowing security researchers to audit and verify our implementation.',
    icon: Zap,
    status: 'active',
  },
];

const audits = [
  {
    firm: 'Trail of Bits',
    date: '2024-03-15',
    scope: 'ZK Circuits & Smart Contracts',
    status: 'passed',
    severity: {
      critical: 0,
      high: 0,
      medium: 2,
      low: 5,
      info: 12,
    },
    reportUrl: '#',
  },
  {
    firm: 'CertiK',
    date: '2024-02-28',
    scope: 'Protocol Security',
    status: 'passed',
    severity: {
      critical: 0,
      high: 0,
      medium: 1,
      low: 3,
      info: 8,
    },
    reportUrl: '#',
  },
  {
    firm: 'Halborn',
    date: '2024-01-10',
    scope: 'Cryptographic Implementation',
    status: 'passed',
    severity: {
      critical: 0,
      high: 0,
      medium: 0,
      low: 2,
      info: 6,
    },
    reportUrl: '#',
  },
];

const bugBounty = {
  totalRewards: 250000,
  critical: 50000,
  high: 25000,
  medium: 10000,
  low: 2000,
  status: 'active',
};

const Security = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-10 w-10 text-primary" />
          Security & Trust
        </h1>
        <p className="text-lg text-muted-foreground">
          Security is our top priority. Learn about our security measures, audits, and how to report vulnerabilities.
        </p>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white">Security Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">98/100</div>
            <p className="text-xs text-muted-foreground mt-1">Industry-leading security standards</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white">Audits Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{audits.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Security audits by top firms</p>
          </CardContent>
        </Card>
        <Card className="bg-white/10 border-white/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white">Bug Bounty Pool</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">${(bugBounty.totalRewards / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground mt-1">Rewards for security researchers</p>
          </CardContent>
        </Card>
      </div>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle>Security Features</CardTitle>
          <CardDescription>
            Comprehensive security measures protecting your assets and privacy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Audits, Bug Bounty, etc */}
      <Tabs defaultValue="audits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="audits">Security Audits</TabsTrigger>
          <TabsTrigger value="bounty">Bug Bounty</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Audits</CardTitle>
              <CardDescription>
                Independent security audits by leading blockchain security firms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {audits.map((audit, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{audit.firm}</h3>
                          <Badge
                            variant="outline"
                            className="bg-white/10 text-white border-white/20"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {audit.status.charAt(0).toUpperCase() + audit.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Scope:</span> {audit.scope}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Date:</span> {new Date(audit.date).toLocaleDateString()}
                        </p>
                        <div className="flex gap-4 pt-2">
                          <div className="text-sm">
                            <span className="font-medium text-white">Critical:</span>{' '}
                            {audit.severity.critical}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-white">High:</span>{' '}
                            {audit.severity.high}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-white">Medium:</span>{' '}
                            {audit.severity.medium}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium text-white">Low:</span>{' '}
                            {audit.severity.low}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a href={audit.reportUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          View Report
                        </a>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bounty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bug Bounty Program</CardTitle>
              <CardDescription>
                Help us improve security and earn rewards for responsibly disclosed vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">${(bugBounty.critical / 1000).toFixed(0)}K</div>
                  <p className="text-sm text-muted-foreground mt-1">Critical</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">${(bugBounty.high / 1000).toFixed(0)}K</div>
                  <p className="text-sm text-muted-foreground mt-1">High</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">${(bugBounty.medium / 1000).toFixed(0)}K</div>
                  <p className="text-sm text-muted-foreground mt-1">Medium</p>
                </div>
                <div className="p-4 bg-white/10 rounded-lg border border-white/20">
                  <div className="text-2xl font-bold text-white">${(bugBounty.low / 1000).toFixed(0)}K</div>
                  <p className="text-sm text-muted-foreground mt-1">Low</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How to Report</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Email security@cloakprotocol.io with detailed vulnerability information</li>
                    <li>Include proof-of-concept code or detailed steps to reproduce</li>
                    <li>Allow 48 hours for initial response</li>
                    <li>Do not publicly disclose until we've addressed the issue</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Scope</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Smart contracts and ZK circuits</li>
                    <li>Web application vulnerabilities</li>
                    <li>Cryptographic implementation flaws</li>
                    <li>Infrastructure and deployment security</li>
                  </ul>
                </div>

                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Full Bug Bounty Terms
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Best Practices</CardTitle>
              <CardDescription>
                Follow these guidelines to keep your assets and identity secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <Lock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Backup Your SDKey</h3>
                    <p className="text-sm text-muted-foreground">
                      Always create multiple secure backups of your SDKey. Store them in different secure locations.
                      If you lose your key, recovery is not possible.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Verify Website URL</h3>
                    <p className="text-sm text-muted-foreground">
                      Always verify you're on the official Cloak Protocol website. Check the SSL certificate and
                      ensure the URL matches exactly.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <AlertTriangle className="h-5 w-5 text-white shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Beware of Phishing</h3>
                    <p className="text-sm text-muted-foreground">
                      Never share your SDKey or private keys with anyone. Cloak Protocol staff will never ask for
                      your keys via email, Discord, or any other channel.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Use Hardware Security</h3>
                    <p className="text-sm text-muted-foreground">
                      For maximum security, consider using hardware wallets or secure enclaves for key generation
                      and storage.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 rounded-lg border bg-card">
                  <CheckCircle2 className="h-5 w-5 text-white shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">Keep Software Updated</h3>
                    <p className="text-sm text-muted-foreground">
                      Regularly update your browser and Cloak Protocol interface to ensure you have the latest
                      security patches and features.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Security;

