import { useState, useCallback } from "react";
import { Upload, ScanSearch, Sparkles, AlertTriangle, ChevronDown, ChevronUp, Search, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "@/components/ImageCard";
import { supabase } from "@/integrations/supabase/client";
import { searchNASAImages, NASAImageItem } from "@/lib/nasa-api";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  is_astronomical: boolean;
  object_name: string;
  object_type: string;
  confidence: number;
  simple_explanation: string;
  scientific_explanation: string;
  alternative_guesses: { name: string; type: string; confidence: number }[];
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const Scan = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [relatedImages, setRelatedImages] = useState<NASAImageItem[]>([]);
  const [showScientific, setShowScientific] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    if (f.size > MAX_FILE_SIZE) {
      toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    setResult(null);
    setRelatedImages([]);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleScan = async () => {
    if (!preview) return;
    setScanning(true);
    setResult(null);
    setRelatedImages([]);

    try {
      const { data, error } = await supabase.functions.invoke("astroscan", {
        body: { imageBase64: preview },
      });

      if (error) throw new Error(error.message);
      if (data.error) throw new Error(data.error);

      const scanResult = data as ScanResult;
      setResult(scanResult);

      if (scanResult.is_astronomical && scanResult.object_name) {
        try {
          const images = await searchNASAImages(scanResult.object_name);
          setRelatedImages(images.slice(0, 6));
        } catch {
          // non-critical
        }
      }
    } catch (err: any) {
      toast({ title: "Scan failed", description: err.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setScanning(false);
    }
  };

  const confidenceColor = (c: number) => {
    if (c >= 80) return "bg-green-500/20 text-green-400 border-green-500/30";
    if (c >= 50) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    return "bg-red-500/20 text-red-400 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="mx-auto max-w-3xl space-y-8">
          {/* Title */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <ScanSearch className="h-4 w-4" />
              AstroScan
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Identify Celestial Objects
            </h1>
            <p className="text-muted-foreground">
              Upload an image of the night sky and let AI identify what you're looking at
            </p>
          </div>

          {/* Upload Zone */}
          <div
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border/50 hover:border-primary/50"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="space-y-4 w-full">
                <img
                  src={preview}
                  alt="Upload preview"
                  className="mx-auto max-h-72 rounded-lg object-contain"
                />
                <div className="flex justify-center gap-3">
                  <Button variant="outline" onClick={() => { setFile(null); setPreview(null); setResult(null); setRelatedImages([]); }}>
                    Change Image
                  </Button>
                  <Button onClick={handleScan} disabled={scanning}>
                    {scanning ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        Scanning the universe…
                      </>
                    ) : (
                      <>
                        <ScanSearch className="h-4 w-4" />
                        Scan Image
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-3 text-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-medium">Drop your image here or click to browse</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </label>
            )}
          </div>

          {/* Loading State */}
          {scanning && (
            <Card className="border-border/50 bg-card/50">
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && !scanning && (
            <div className="space-y-6">
              {!result.is_astronomical ? (
                <Card className="border-yellow-500/30 bg-yellow-500/5">
                  <CardContent className="flex items-center gap-3 p-6">
                    <AlertTriangle className="h-6 w-6 text-yellow-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-400">Not an astronomical image</p>
                      <p className="text-sm text-muted-foreground">
                        This doesn't appear to contain celestial objects. Try uploading a photo of the night sky, a planet, or a nebula.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Main Result */}
                  <Card className="border-primary/30 bg-card/50">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground uppercase tracking-wider">Detected Object</p>
                          <CardTitle className="text-2xl">{result.object_name}</CardTitle>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <Badge variant="outline" className="capitalize">{result.object_type}</Badge>
                          <Badge className={confidenceColor(result.confidence)}>
                            {result.confidence}% match
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-muted-foreground leading-relaxed">
                          {showScientific ? result.scientific_explanation : result.simple_explanation}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-primary"
                          onClick={() => setShowScientific(!showScientific)}
                        >
                          {showScientific ? (
                            <><ChevronUp className="h-4 w-4" /> Simple explanation</>
                          ) : (
                            <><ChevronDown className="h-4 w-4" /> Scientific details</>
                          )}
                        </Button>
                      </div>

                      {/* Alternative Guesses */}
                      {result.alternative_guesses.length > 0 && result.confidence < 80 && (
                        <div className="border-t border-border/50 pt-4">
                          <p className="text-sm font-medium mb-2 text-muted-foreground">Other possibilities</p>
                          <div className="flex flex-wrap gap-2">
                            {result.alternative_guesses.map((g, i) => (
                              <Badge key={i} variant="outline" className="gap-1">
                                {g.name}
                                <span className="text-muted-foreground">({g.confidence}%)</span>
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Related NASA Images */}
                  {relatedImages.length > 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Related NASA Images</h2>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedImages.map((img) => (
                          <ImageCard key={img.nasa_id} image={img} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explore More */}
                  {result.is_astronomical && result.object_name && (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-5">
                      <h3 className="mb-3 font-semibold">Explore more</h3>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          to={`/search?q=${encodeURIComponent(result.object_name)}`}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-card/50 px-3 py-1.5 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                        >
                          <Search className="h-3.5 w-3.5" />
                          Search NASA for "{result.object_name}"
                        </Link>
                        <Link
                          to="/assistant"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-card/50 px-3 py-1.5 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Ask the AI assistant
                        </Link>
                        <Link
                          to="/learn"
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-card/50 px-3 py-1.5 text-sm font-medium hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                        >
                          <GraduationCap className="h-3.5 w-3.5" />
                          Start a learning path
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Scan;
