import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { PrivacyDemo } from "@/components/PrivacyDemo";
import { FeaturesSection } from "@/components/FeaturesSection";
import { IntegrationSection } from "@/components/IntegrationSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PrivacyDemo />
        <FeaturesSection />
        <IntegrationSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
