import { useState } from "react";
import { Header } from "@/components/Header";
import { ToolCard } from "@/components/ToolCard";
import { FaviconGenerator } from "@/components/FaviconGenerator";
import { ColorPaletteGenerator } from "@/components/ColorPaletteGenerator";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { ImageOptimizer } from "@/components/ImageOptimizer";
import { Image, Palette, QrCode, Zap, Download, FileImage } from "lucide-react";

type ToolType = "favicon" | "colors" | "qr" | "optimizer" | "none";

const tools = [
  {
    id: "favicon" as ToolType,
    title: "Favicon Generator",
    description: "Create favicons in all sizes",
    icon: Image,
  },
  {
    id: "colors" as ToolType,
    title: "Color Palette",
    description: "Generate beautiful color schemes",
    icon: Palette,
  },
  {
    id: "qr" as ToolType,
    title: "QR Code Generator",
    description: "Create QR codes for any data",
    icon: QrCode,
  },
  {
    id: "optimizer" as ToolType,
    title: "Image Optimizer",
    description: "Compress and optimize images",
    icon: Zap,
  },
];

const Index = () => {
  const [activeTool, setActiveTool] = useState<ToolType>("none");

  const renderActiveTool = () => {
    switch (activeTool) {
      case "favicon":
        return <FaviconGenerator />;
      case "colors":
        return <ColorPaletteGenerator />;
      case "qr":
        return <QRCodeGenerator />;
      case "optimizer":
        return <ImageOptimizer />;
      default:
        return (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Professional Developer Tools
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create, optimize, and manage your web projects. 
                Fast, reliable, and completely free.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  onClick={() => setActiveTool(tool.id)}
                  isActive={activeTool === tool.id}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {activeTool !== "none" && (
          <div className="mb-8">
            <button
              onClick={() => setActiveTool("none")}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              ← Back to Tools
            </button>
          </div>
        )}
        
        {renderActiveTool()}
      </main>
      
      <footer className="border-t bg-muted/50 py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Built with ❤️ for developers. All tools are free and work entirely in your browser.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
