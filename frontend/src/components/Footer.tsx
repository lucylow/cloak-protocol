import { Shield, Twitter, Github, MessageCircle, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Trade RWAs", href: "/app" },
    { label: "Private Pools", href: "#" },
    { label: "Documentation", href: "#" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Compliance", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: MessageCircle, href: "#", label: "Discord" },
];

export const Footer = () => {
  return (
    <footer className="py-16 border-t border-border/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-radial-purple -translate-x-1/2 translate-y-1/2 opacity-30" />
      
      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 text-xl font-bold mb-4 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:shadow-glow transition-shadow">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              Cloak Protocol
            </Link>
            <p className="text-muted-foreground mb-6 max-w-sm leading-relaxed">
              The premier ZK-privacy DEX for Real-World Assets, built on Psy Protocol. Trade with complete confidentiality.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 hover:border-primary/30 border border-transparent transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link 
                        to={link.href} 
                        className="text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                      >
                        {link.label}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <a 
                        href={link.href} 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup hint */}
        <div className="mb-12 p-6 glass rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold mb-1">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">Get the latest updates on Cloak Protocol and RWA trading.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 sm:w-64 h-10 px-4 rounded-lg bg-secondary border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="h-10 px-4 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-sm">
          <p>&copy; 2025 Cloak Protocol. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built on 
            <span className="text-gradient font-semibold">Psy Protocol</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
