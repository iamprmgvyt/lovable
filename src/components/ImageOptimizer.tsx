import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Zap, FileImage, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const ImageOptimizer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [optimizedUrl, setOptimizedUrl] = useState<string>("");
  const [quality, setQuality] = useState([80]);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [maxWidth, setMaxWidth] = useState(1920);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setOriginalSize(file.size);
        setOptimizedUrl("");
        setOptimizedSize(0);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const optimizeImage = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsOptimizing(true);

    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      // Enable smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setOptimizedUrl(url);
            setOptimizedSize(blob.size);
            toast.success("Image optimized successfully!");
          }
        },
        `image/${format}`,
        quality[0] / 100
      );
    } catch (error) {
      toast.error("Failed to optimize image");
      console.error(error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const downloadOptimized = () => {
    if (!optimizedUrl) {
      toast.error("Please optimize an image first");
      return;
    }

    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = `optimized-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Optimized image downloaded!");
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize && optimizedSize 
    ? Math.round((1 - optimizedSize / originalSize) * 100)
    : 0;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Image Optimizer
        </CardTitle>
        <CardDescription>
          Compress and optimize images for web use
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            {previewUrl ? (
              <div className="space-y-4">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="mx-auto max-h-32 max-w-full object-contain rounded-lg shadow-soft"
                />
                <p className="text-sm text-muted-foreground">
                  {selectedImage?.name} ({formatBytes(originalSize)})
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <FileImage className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Upload your image</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, or WebP files up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            variant="outline" 
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {selectedImage ? "Change Image" : "Upload Image"}
          </Button>
        </div>

        {selectedImage && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Quality: {quality[0]}%</label>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  max={100}
                  min={10}
                  step={5}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Format</label>
                <Select value={format} onValueChange={(value: 'jpeg' | 'png' | 'webp') => setFormat(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Max Width: {maxWidth}px</label>
              <Slider
                value={[maxWidth]}
                onValueChange={(value) => setMaxWidth(value[0])}
                max={3840}
                min={320}
                step={80}
                className="mt-2"
              />
            </div>

            <Button 
              onClick={optimizeImage}
              disabled={isOptimizing}
              className="w-full bg-gradient-primary shadow-elegant"
            >
              {isOptimizing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Optimize Image
                </>
              )}
            </Button>
          </div>
        )}

        {optimizedUrl && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-2">Optimization Results:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Original Size</p>
                  <p className="font-medium">{formatBytes(originalSize)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Optimized Size</p>
                  <p className="font-medium">{formatBytes(optimizedSize)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted-foreground">Compression</p>
                  <p className="font-medium text-green-600">{compressionRatio}% smaller</p>
                </div>
              </div>
            </div>

            <Button onClick={downloadOptimized} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Optimized Image
            </Button>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Optimization Tips:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use JPEG for photos and complex images</li>
            <li>• Use PNG for images with transparency</li>
            <li>• Use WebP for best compression (modern browsers)</li>
            <li>• Lower quality = smaller file size</li>
            <li>• Reduce dimensions for web use</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};