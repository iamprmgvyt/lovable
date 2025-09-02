import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QrCode, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import QRCode from 'qrcode';

export const QRCodeGenerator = () => {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [size, setSize] = useState(256);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) {
      toast.error("Please enter text or URL to generate QR code");
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCode.toCanvas(canvas, text, {
        errorCorrectionLevel: errorLevel,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: size
      });

      // Get data URL for download
      const dataUrl = canvas.toDataURL('image/png');
      setQrDataUrl(dataUrl);
      
      toast.success("QR Code generated successfully!");
    } catch (error) {
      toast.error("Failed to generate QR code");
      console.error(error);
    }
  };

  // Auto-generate when text changes
  useEffect(() => {
    if (text.trim()) {
      const timeoutId = setTimeout(generateQR, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [text, errorLevel, size]);

  const downloadQR = () => {
    if (!qrDataUrl) {
      toast.error("Please generate a QR code first");
      return;
    }

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("QR Code downloaded!");
  };

  const copyToClipboard = async () => {
    if (!qrDataUrl) {
      toast.error("Please generate a QR code first");
      return;
    }

    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      toast.success("QR Code copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
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
              placeholder="Enter URL, text, WiFi credentials, or any data you want to encode..."
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Error Correction</label>
              <Select value={errorLevel} onValueChange={(value: 'L' | 'M' | 'Q' | 'H') => setErrorLevel(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Size</label>
              <Select value={size.toString()} onValueChange={(value) => setSize(parseInt(value))}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="128">128x128</SelectItem>
                  <SelectItem value="256">256x256</SelectItem>
                  <SelectItem value="512">512x512</SelectItem>
                  <SelectItem value="1024">1024x1024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {text.trim() && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-8 text-center">
              <canvas 
                ref={canvasRef}
                className="mx-auto border rounded-lg shadow-soft max-w-full"
                style={{ maxWidth: '300px', height: 'auto' }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={downloadQR} className="bg-gradient-primary">
                <Download className="mr-2 h-4 w-4" />
                Download PNG
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </Button>
            </div>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Common QR Code Uses:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Website URLs and links</li>
            <li>• Contact information (vCard format)</li>
            <li>• WiFi credentials: WIFI:T:WPA;S:NetworkName;P:Password;;</li>
            <li>• Email addresses: mailto:someone@example.com</li>
            <li>• Phone numbers: tel:+1234567890</li>
            <li>• SMS: sms:+1234567890:Hello World</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};