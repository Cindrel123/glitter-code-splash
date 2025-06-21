
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Download, Palette, Star, BarChart3, Upload } from "lucide-react";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState('https://example.com');
  const [qrFgColor, setQrFgColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [gaTrackingId, setGaTrackingId] = useState('');
  const [glitterElements, setGlitterElements] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create glitter effect
        const newGlitter = {
          id: Date.now() + Math.random(),
          x: x + (Math.random() - 0.5) * 50,
          y: y + (Math.random() - 0.5) * 50,
          delay: Math.random() * 1000
        };
        
        setGlitterElements(prev => [...prev.slice(-10), newGlitter]);
        
        // Remove glitter after animation
        setTimeout(() => {
          setGlitterElements(prev => prev.filter(g => g.id !== newGlitter.id));
        }, 2000);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const handleDownload = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = await html2canvas(qrRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvas.toDataURL();
      link.click();

      toast({
        title: "Success!",
        description: "QR code downloaded successfully",
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Error",
        description: "Failed to download QR code",
        variant: "destructive",
      });
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const trackingUrl = gaTrackingId 
    ? `${url}?utm_source=qr_code&utm_medium=offline&utm_campaign=qr_campaign&ga_tracking_id=${gaTrackingId}`
    : url;

  return (
    <div 
      ref={containerRef}
      className="min-h-screen relative glitter-container star-pattern"
    >
      {/* Glitter elements */}
      {glitterElements.map((glitter) => (
        <div
          key={glitter.id}
          className="glitter-effect"
          style={{
            left: `${glitter.x}px`,
            top: `${glitter.y}px`,
            animationDelay: `${glitter.delay}ms`
          }}
        />
      ))}
      
      {/* Sparkle elements */}
      {glitterElements.map((glitter, index) => (
        index % 3 === 0 && (
          <div
            key={`sparkle-${glitter.id}`}
            className="sparkle"
            style={{
              left: `${glitter.x + 20}px`,
              top: `${glitter.y - 10}px`,
              animationDelay: `${glitter.delay + 500}ms`
            }}
          >
            ✨
          </div>
        )
      ))}

      <div className="container mx-auto p-6 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-float">
            ✨ Magical QR Generator ✨
          </h1>
          <p className="text-lg text-gray-600">Create stunning QR codes with glitter effects and advanced customization</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Section */}
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-pink-500" />
                QR Code Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div>
                    <Label htmlFor="url">Enter URL</Label>
                    <Input
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste your link here..."
                      className="mt-1"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="design" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fgColor">QR Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="fgColor"
                          type="color"
                          value={qrFgColor}
                          onChange={(e) => setQrFgColor(e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={qrFgColor}
                          onChange={(e) => setQrFgColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="bgColor">Background</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="bgColor"
                          type="color"
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="w-16 h-10"
                        />
                        <Input
                          value={qrBgColor}
                          onChange={(e) => setQrBgColor(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="logo">Brand Logo</Label>
                    <div className="mt-1">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="w-full"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                    {logoImage && (
                      <div className="mt-2">
                        <img src={logoImage} alt="Logo preview" className="w-16 h-16 object-cover rounded" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={() => {setQrFgColor('#FF69B4'); setQrBgColor('#FFE4E1');}}
                      className="bg-gradient-to-r from-pink-400 to-pink-600 text-white"
                      size="sm"
                    >
                      Pink
                    </Button>
                    <Button
                      onClick={() => {setQrFgColor('#9370DB'); setQrBgColor('#E6E6FA');}}
                      className="bg-gradient-to-r from-purple-400 to-purple-600 text-white"
                      size="sm"
                    >
                      Purple
                    </Button>
                    <Button
                      onClick={() => {setQrFgColor('#4169E1'); setQrBgColor('#E0F6FF');}}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                      size="sm"
                    >
                      Blue
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div>
                    <Label htmlFor="gaTracking" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Google Analytics ID
                    </Label>
                    <Input
                      id="gaTracking"
                      value={gaTrackingId}
                      onChange={(e) => setGaTrackingId(e.target.value)}
                      placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Add tracking parameters to your QR code for analytics
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* QR Code Display */}
          <Card className="backdrop-blur-sm bg-white/80 shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Your QR Code
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div 
                ref={qrRef}
                className="inline-block p-6 bg-white rounded-lg shadow-lg relative"
                style={{ backgroundColor: qrBgColor }}
              >
                {logoImage && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img 
                      src={logoImage} 
                      alt="Logo" 
                      className="w-12 h-12 rounded bg-white p-1 shadow-md"
                    />
                  </div>
                )}
                <QRCode
                  value={trackingUrl}
                  size={256}
                  fgColor={qrFgColor}
                  bgColor={qrBgColor}
                  level="M"
                />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  URL: <span className="font-mono text-xs">{trackingUrl}</span>
                </p>
                <Button 
                  onClick={handleDownload}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="mt-8 backdrop-blur-sm bg-white/80 shadow-xl border-0">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">✨ Premium Features</h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold">Star Pattern Background</h4>
                <p className="text-sm text-gray-600">Beautiful embedded star patterns</p>
              </div>
              <div className="p-4">
                <Palette className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                <h4 className="font-semibold">Custom Colors & Gradients</h4>
                <p className="text-sm text-gray-600">Full color customization with presets</p>
              </div>
              <div className="p-4">
                <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold">Analytics Integration</h4>
                <p className="text-sm text-gray-600">Track QR code usage with Google Analytics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
