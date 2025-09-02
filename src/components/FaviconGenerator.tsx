import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Download, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const FaviconGenerator = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Please select an image file");
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const generateFavicons = () => {
    if (!selectedImage) {
      toast.error("Please upload an image first");
      return;
    }
    toast.success("Favicon generation started! This would generate multiple sizes in a real implementation.");
  };

  const downloadFavicons = () => {
    if (!selectedImage) {
      toast.error("Please generate favicons first");
      return;
    }
    toast.success("Download started! This would download a zip file with all favicon sizes.");
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
            disabled={!selectedImage}
            className="bg-gradient-primary shadow-elegant"
          >
            Generate Favicons
          </Button>
          <Button 
            onClick={downloadFavicons}
            variant="outline"
            disabled={!selectedImage}
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <h4 className="font-medium mb-2">Generated Sizes:</h4>
          <div className="grid grid-cols-4 gap-2 text-sm text-muted-foreground">
            <span>16x16</span>
            <span>32x32</span>
            <span>48x48</span>
            <span>64x64</span>
            <span>128x128</span>
            <span>256x256</span>
            <span>512x512</span>
            <span>ICO format</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};