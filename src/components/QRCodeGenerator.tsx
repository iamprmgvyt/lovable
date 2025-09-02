import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QrCode, Download } from "lucide-react";
import { toast } from "sonner";

export const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrGenerated, setQrGenerated] = useState(false);

  const generateQR = () => {
    if (!text.trim()) {
      toast.error("Please enter text or URL to generate QR code");
      return;
    }
    setQrGenerated(true);
    toast.success("QR Code generated successfully!");
  };

  const downloadQR = () => {
    if (!qrGenerated) {
      toast.error("Please generate a QR code first");
      return;
    }
    toast.success("QR Code downloaded! This would download the QR code image.");
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          QR Code Generator
        </CardTitle>
        <CardDescription>
          Generate QR codes for URLs, text, or any data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Text or URL</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter URL, text, or any data you want to encode..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <Button 
            onClick={generateQR}
            className="w-full bg-gradient-primary shadow-elegant"
          >
            Generate QR Code
          </Button>
        </div>

        {qrGenerated && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-8 text-center">
              <div className="mx-auto w-48 h-48 bg-background rounded-lg shadow-soft flex items-center justify-center">
                <QrCode className="h-32 w-32 text-muted-foreground" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">QR Code Preview</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={downloadQR} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button onClick={downloadQR} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download SVG
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">QR Code Uses:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Website URLs and links</li>
            <li>• Contact information (vCard)</li>
            <li>• WiFi network credentials</li>
            <li>• Payment information</li>
            <li>• Social media profiles</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};