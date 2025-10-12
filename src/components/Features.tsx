import { Smartphone, Box, Zap, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Smartphone,
    title: "No App Required",
    description: "Experience AR directly in your web browser. Simply scan the QR code and start exploring."
  },
  {
    icon: Box,
    title: "3D Food Models",
    description: "View realistic 3D models of every dish with accurate proportions and textures."
  },
  {
    icon: Zap,
    title: "Instant Loading",
    description: "Fast and seamless AR experience with optimized 3D models for mobile devices."
  },
  {
    icon: Shield,
    title: "100% Secure",
    description: "Your privacy matters. No data collection, no tracking, just pure AR experience."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Why Choose AR Menu?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of dining with cutting-edge AR technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg hero-gradient flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;