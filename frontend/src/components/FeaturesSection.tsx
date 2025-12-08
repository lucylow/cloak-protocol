import { UserCheck, Gem, Zap, Shield, RefreshCw, PieChart } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: UserCheck,
    title: "End-to-End Privacy",
    description: "Your trades are completely confidential. Zero-knowledge proofs validate transactions without revealing amounts, parties, or portfolio details.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Gem,
    title: "RWA-Focused",
    description: "Specialized infrastructure for Real-World Assets with compliance-ready features, permissioned pools, and institutional liquidity.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Million+ TPS Scalability",
    description: "Built on Psy Protocol's PARTH architecture for high-frequency trading without compromising decentralization or security.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Shield,
    title: "Programmable Identities",
    description: "Leverage Psy's SDKeys for private, verifiable credentials that enable access to permissioned RWA pools without KYC exposure.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: RefreshCw,
    title: "Cross-Chain Compatibility",
    description: "Trade RWAs from multiple chains with our privacy-preserving bridges. Bring your assets from Ethereum, Solana, and more.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: PieChart,
    title: "Institutional Tools",
    description: "Advanced order types, dark pool functionality, portfolio analytics, and reporting tools designed for professional investors.",
    gradient: "from-rose-500 to-red-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,212,191,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <div className="container relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Zap className="w-4 h-4" />
            Core Features
          </motion.div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose Cloak Protocol
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The most advanced privacy-preserving DEX for institutional and sophisticated investors
          </p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group glass rounded-2xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/30 hover:shadow-glow relative overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <motion.div 
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 transition-transform duration-500`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-gradient transition-all duration-300">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom stats */}
        <motion.div 
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { value: "1M+", label: "TPS Capacity" },
            { value: "<2s", label: "Settlement Time" },
            { value: "100%", label: "ZK Protected" },
            { value: "24/7", label: "Uptime" }
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 glass rounded-xl">
              <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
