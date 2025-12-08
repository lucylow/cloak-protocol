import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Search,
  HelpCircle,
  MessageSquare,
  Book,
  Video,
  FileText,
  Mail,
  Send,
  ExternalLink,
  ArrowRight,
  Code
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const faqCategories = [
  {
    category: 'Getting Started',
    questions: [
      {
        question: 'What is Cloak Protocol?',
        answer: 'Cloak Protocol is a zero-knowledge privacy-preserving DEX (Decentralized Exchange) specifically designed for trading Real World Assets (RWAs). It uses advanced ZK cryptography to ensure complete transaction privacy while maintaining full auditability.',
      },
      {
        question: 'How do I create a private identity?',
        answer: 'To create a private identity, navigate to the Dashboard and click "Create Identity". This will generate an SDKey (Stealthy Decentralized Key) that serves as your private financial passport. All keys are generated and stored locally on your device for maximum security.',
      },
      {
        question: 'What are RWAs?',
        answer: 'Real World Assets (RWAs) are tokenized representations of physical or traditional financial assets such as real estate, bonds, commodities, art, and credit instruments. Cloak Protocol enables private trading of these assets on-chain.',
      },
      {
        question: 'Do I need a wallet to use Cloak?',
        answer: 'Cloak Protocol uses SDKeys for identity management, which work independently of traditional wallets. However, you may need a compatible wallet for depositing funds or connecting to the Psy Protocol layer.',
      },
    ],
  },
  {
    category: 'Trading & Privacy',
    questions: [
      {
        question: 'How does zero-knowledge proof privacy work?',
        answer: 'ZK proofs allow you to prove that you have sufficient balance and authorization to trade without revealing your actual balance, identity, or trade details. Each trade generates a cryptographic proof that is verified on-chain while keeping all sensitive information private.',
      },
      {
        question: 'Are my trades completely private?',
        answer: 'Yes, with Cloak Protocol, your trades are end-to-end encrypted using ZK proofs. No one can see your trading patterns, balances, or positions unless you explicitly share a proof for verification purposes.',
      },
      {
        question: 'How long does proof generation take?',
        answer: 'Proof generation typically takes 100-200 milliseconds, depending on the complexity of the transaction. Our optimized ZK circuits ensure fast proof generation without compromising security.',
      },
      {
        question: 'Can I prove my balance to a third party?',
        answer: 'Yes, you can generate selective disclosure proofs that reveal only the information you choose to share. This is useful for compliance, audits, or showing proof of funds to counterparties.',
      },
    ],
  },
  {
    category: 'Technical',
    questions: [
      {
        question: 'What blockchain does Cloak Protocol use?',
        answer: 'Cloak Protocol is built on top of Psy Protocol, which provides the settlement layer. The protocol uses BLS12-381 curves and Poseidon-2 hash functions for optimal performance and security.',
      },
      {
        question: 'How are trades settled?',
        answer: 'Trades are batched into groups of 64 and settled on Psy Protocol. This batching mechanism reduces gas costs and improves efficiency while maintaining privacy through aggregated proofs.',
      },
      {
        question: 'What is the difference between shielded and public balances?',
        answer: 'Shielded balances are encrypted and private, visible only to you. Public balances are visible on-chain but may be used for compatibility with other protocols. You can convert between these states as needed.',
      },
      {
        question: 'How do I recover my SDKey?',
        answer: 'SDKeys should be securely backed up when first created. If you lose your key, recovery is not possible due to the zero-knowledge architecture. Always keep multiple secure backups of your key material.',
      },
    ],
  },
  {
    category: 'Support & Security',
    questions: [
      {
        question: 'How do I report a security issue?',
        answer: 'Security vulnerabilities should be reported through our responsible disclosure program. Please email security@cloakprotocol.io with details. We offer bug bounties for critical vulnerabilities.',
      },
      {
        question: 'Is Cloak Protocol audited?',
        answer: 'Yes, Cloak Protocol has undergone multiple security audits by leading blockchain security firms. Audit reports are available on our Security page and in our documentation.',
      },
      {
        question: 'How can I get help with an issue?',
        answer: 'You can reach out through our support email, join our Discord community, or check our documentation. For urgent issues, please use our support ticket system.',
      },
      {
        question: 'What fees does Cloak Protocol charge?',
        answer: 'Cloak Protocol charges minimal fees for proof generation and settlement. Trading fees are typically 0.1-0.3% depending on the asset pair and liquidity. All fees are transparently displayed before trade execution.',
      },
    ],
  },
];

const helpResources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API reference',
    icon: Book,
    href: '/app/docs',
    color: 'text-white',
  },
  {
    title: 'Video Tutorials',
    description: 'Step-by-step video guides',
    icon: Video,
    href: '#',
    color: 'text-white',
  },
  {
    title: 'Developer Guide',
    description: 'Integration guides for developers',
    icon: Code,
    href: '#',
    color: 'text-white',
  },
  {
    title: 'Community Discord',
    description: 'Join our community for support',
    icon: MessageSquare,
    href: '#',
    color: 'text-white',
  },
];

// Fix for Code icon
const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    email: '',
    subject: '',
    message: '',
  });

  const filteredFAQs = faqCategories.flatMap((cat) =>
    cat.questions
      .filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((q) => ({ ...q, category: cat.category }))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Help & Support</h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions and get support
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, FAQs, or documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Help Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {helpResources.map((resource) => (
          <Card key={resource.title} className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <div className={`${resource.color} mb-2`}>
                <resource.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{resource.title}</CardTitle>
              <CardDescription>{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between group" asChild>
                <a href={resource.href}>
                  View
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </Button>
            {faqCategories.map((cat) => (
              <Button
                key={cat.category}
                variant={selectedCategory === cat.category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat.category)}
              >
                {cat.category}
              </Button>
            ))}
          </div>
        </div>

        {searchQuery ? (
          <Card>
            <CardHeader>
              <CardTitle>
                Search Results ({filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq, index) => (
                  <AccordionItem key={`${faq.category}-${index}`} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{faq.question}</span>
                        <Badge variant="secondary" className="ml-2">
                          {faq.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {faqCategories
              .filter((cat) => !selectedCategory || cat.category === selectedCategory)
              .map((category) => (
                <Card key={category.category}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Contact Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Support
          </CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              alert('Support request submitted! We\'ll get back to you soon.');
              setContactForm({ email: '', subject: '', message: '' });
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="How can we help?"
                  value={contactForm.subject}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, subject: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <textarea
                className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                placeholder="Describe your question or issue..."
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

