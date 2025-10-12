import Hero from "@/components/Hero";
import MenuGrid from "@/components/MenuGrid";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      <MenuGrid />
      <Footer />
    </div>
  );
};

export default Index;
