import { QrCode, Smartphone, Box } from "lucide-react";

const steps = [
  {
    icon: QrCode,
    title: "Scan QR Code",
    description: "Find the QR code on your table and scan it with your phone's camera"
  },
  {
    icon: Smartphone,
    title: "Browse Menu",
    description: "Explore our delicious menu items with beautiful photos and descriptions"
  },
  {
    icon: Box,
    title: "View in AR",
    description: "Tap 'View in AR' to see a 3D model of the dish right on your table"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center space-y-4">
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary to-transparent" />
              )}
              
              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-24 h-24 rounded-full hero-gradient flex items-center justify-center shadow-lg relative z-10">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              {/* Step Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;