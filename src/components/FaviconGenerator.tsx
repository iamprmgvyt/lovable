import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

const FAVICON_SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 512];

export const FaviconGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [generatedFavicons, setGeneratedFavicons] = useState<{[size: number]: string}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setGeneratedFavicons({});
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const resizeImage = (img: HTMLImageElement, size: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      canvas.width = size;
      canvas.height = size;
      
      // Use better image scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, size, size);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          resolve(url);
        }
      }, 'image/png');
    });
  };

  const generateFavicons = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);
    
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const generatedImages: {[size: number]: string} = {};

      for (const size of FAVICON_SIZES) {
        const resizedUrl = await resizeImage(img, size);
        generatedImages[size] = resizedUrl;
      }

      setGeneratedFavicons(generatedImages);
      toast.success("All favicon sizes generated successfully!");
    } catch (error) {
      toast.error("Failed to generate favicons");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadFavicons = async () => {
    if (Object.keys(generatedFavicons).length === 0) {
      toast.error("Please generate favicons first");
      return;
    }

    setIsDownloading(true);

    try {
      const zip = new JSZip();
      
      // Add favicons to zip
      for (const [size, url] of Object.entries(generatedFavicons)) {
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(`favicon-${size}x${size}.png`, blob);
      }

      // Add a sample HTML snippet
      const htmlSnippet = `<!-- Add these to your HTML <head> section -->
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="shortcut icon" href="favicon-32x32.png">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="theme-color" content="#ffffff">`;
      
      zip.file("usage-instructions.html", htmlSnippet);

      // Generate and download zip
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'favicons.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      toast.success("Favicons downloaded successfully!");
    } catch (error) {
      toast.error("Failed to create download");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Favicon Generator
        </CardTitle>
        <CardDescription>
          Upload an image and generate favicons in all required sizes
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
                  className="mx-auto h-32 w-32 object-cover rounded-lg shadow-soft"
                />
                <p className="text-sm text-muted-foreground">{selectedImage?.name}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Upload your image</p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG or SVG files up to 10MB
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
            onClick={handleUploadClick}
            variant="outline" 
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {selectedImage ? "Change Image" : "Upload Image"}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={generateFavicons}
            disabled={!selectedImage || isGenerating}
            className="bg-gradient-primary shadow-elegant"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Favicons"
            )}
          </Button>
          <Button 
            onClick={downloadFavicons}
            variant="outline"
            disabled={Object.keys(generatedFavicons).length === 0 || isDownloading}
          >
            {isDownloading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating ZIP...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download ZIP
              </>
            )}
          </Button>
        </div>

        {Object.keys(generatedFavicons).length > 0 && (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="font-medium mb-3">Generated Favicons:</h4>
              <div className="grid grid-cols-3 gap-4">
                {FAVICON_SIZES.slice(0, 6).map((size) => (
                  <div key={size} className="text-center">
                    {generatedFavicons[size] && (
                      <img 
                        src={generatedFavicons[size]} 
                        alt={`${size}x${size}`}
                        className="mx-auto mb-1 border rounded"
                        style={{ width: `${Math.min(size, 48)}px`, height: `${Math.min(size, 48)}px` }}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">{size}x{size}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">What you'll get:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
            {FAVICON_SIZES.map(size => (
              <span key={size}>{size}x{size} PNG</span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            + HTML usage instructions included in ZIP
          </p>
        </div>
      </CardContent>
    </Card>
  );
};