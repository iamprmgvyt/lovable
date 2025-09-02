import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Palette, Shuffle } from "lucide-react";
import { toast } from "sonner";

export const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState("#8B5CF6");
  const [palette, setPalette] = useState<string[]>([
    "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE"
  ]);

  const generatePalette = () => {
    // Simple palette generation based on base color
    const hsl = hexToHsl(baseColor);
    const newPalette = [
      baseColor,
      hslToHex(hsl.h, Math.max(0, hsl.s - 20), Math.min(100, hsl.l + 20)),
      hslToHex(hsl.h, Math.max(0, hsl.s - 10), Math.min(100, hsl.l + 35)),
      hslToHex(hsl.h, Math.max(0, hsl.s - 30), Math.min(100, hsl.l + 50)),
      hslToHex(hsl.h, Math.max(0, hsl.s - 40), Math.min(100, hsl.l + 65))
    ];
    setPalette(newPalette);
    toast.success("New palette generated!");
  };

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard!`);
  };

  const copyAllColors = () => {
    const colorsText = palette.join(", ");
    navigator.clipboard.writeText(colorsText);
    toast.success("All colors copied to clipboard!");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Color Palette Generator
        </CardTitle>
        <CardDescription>
          Generate beautiful color palettes from a base color
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Base Color</label>
            <div className="flex gap-2 mt-1">
              <Input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                placeholder="#8B5CF6"
                className="flex-1"
              />
            </div>
          </div>
          <div className="flex flex-col justify-end">
            <Button onClick={generatePalette} className="bg-gradient-primary">
              <Shuffle className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Generated Palette</h4>
            <Button variant="outline" size="sm" onClick={copyAllColors}>
              <Copy className="mr-2 h-4 w-4" />
              Copy All
            </Button>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {palette.map((color, index) => (
              <div key={index} className="space-y-2">
                <div 
                  className="h-20 rounded-lg shadow-soft cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                />
                <p className="text-xs text-center font-mono">{color}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Usage Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Click any color to copy it to clipboard</li>
            <li>• Use the lightest colors for backgrounds</li>
            <li>• Use the darkest colors for text</li>
            <li>• Middle colors work great for UI elements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper functions
function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}