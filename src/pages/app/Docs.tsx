import { FileText, ExternalLink, BookOpen, Code, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const docSections = [
  {
    icon: BookOpen,
    title: 'Getting Started',
    description: 'Learn the basics of Cloak Protocol and set up your first private trade.',
    link: '#',
  },
  {
    icon: Shield,
    title: 'Privacy Guarantees',
    description: 'Understand our ZK-proof system and how we protect your trading data.',
    link: '#',
  },
  {
    icon: Code,
    title: 'Developer SDK',
    description: 'Integrate Cloak Protocol into your own applications with our SDK.',
    link: '#',
  },
  {
    icon: Zap,
    title: 'Psy Protocol Integration',
    description: 'Deep dive into how we leverage Psy PARTH for high-throughput settlement.',
    link: '#',
  },
];

const DocsPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-gradient-primary rounded-xl flex items-center justify-center">
          <FileText className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documentation</h1>
          <p className="text-muted-foreground">Learn how to use Cloak Protocol</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {docSections.map((section, i) => (
          <Card key={i} className="bg-card border-border group hover:border-accent/50 transition-all">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-muted-foreground" />
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Links */}
      <Card className="bg-secondary border-border">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-2" />
            GitHub
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-2" />
            API Reference
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-2" />
            Psy Network
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-3 w-3 mr-2" />
            Discord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocsPage;
