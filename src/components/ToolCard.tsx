import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  isActive?: boolean;
}

export const ToolCard = ({ title, description, icon: Icon, onClick, isActive }: ToolCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 ${
        isActive ? "ring-2 ring-primary shadow-elegant bg-accent" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-primary rounded-lg p-2">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          Use Tool
        </Button>
      </CardContent>
    </Card>
  );
};