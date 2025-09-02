import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <header className="border-b bg-gradient-primary shadow-soft">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary-foreground rounded-xl p-2 shadow-soft">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-foreground">DevTools Pro</h1>
              <p className="text-primary-foreground/80 text-sm">Professional tools for developers</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="shadow-soft">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};