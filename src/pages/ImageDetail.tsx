import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, ExternalLink, Image, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { getNASAImageAsset, getNASAImageMetadata } from "@/lib/nasa-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FavoriteButton from "@/components/FavoriteButton";
import AIExplanation from "@/components/AIExplanation";
import ShareDownload from "@/components/ShareDownload";
import ContextPanel from "@/components/ContextPanel";
import RecommendationPanel from "@/components/RecommendationPanel";
import ResearchExport from "@/components/ResearchExport";

const ImageDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: metadata,
    isLoading: isLoadingMetadata,
    error: metadataError,
  } = useQuery({
    queryKey: ["nasa-metadata", id],
    queryFn: () => getNASAImageMetadata(id!),
    enabled: !!id,
  });

  const {
    data: assets = [],
    isLoading: isLoadingAssets,
  } = useQuery({
    queryKey: ["nasa-assets", id],
    queryFn: () => getNASAImageAsset(id!),
    enabled: !!id,
  });

  const isLoading = isLoadingMetadata || isLoadingAssets;

  // Find the best quality image
  const largeImage = assets.find(
    (url) => url.includes("~orig") || url.includes("~large")
  ) || assets.find((url) => url.includes("~medium")) || assets[0] || metadata?.href;

  const formattedDate = metadata?.date_created
    ? new Date(metadata.date_created).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  if (metadataError) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pb-16 pt-24">
          <Link to="/">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
            <p className="font-medium text-destructive">
              Failed to load image details. The image may not exist.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : metadata ? (
          <article className="space-y-8">
            {/* Image */}
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30">
              {largeImage ? (
                <img
                  src={largeImage}
                  alt={metadata.title}
                  className="mx-auto max-h-[70vh] w-auto object-contain"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted">
                  <Image className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                {formattedDate && (
                  <Badge variant="outline" className="gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {formattedDate}
                  </Badge>
                )}
                <Badge className="bg-primary/20 text-primary">
                  {metadata.nasa_id}
                </Badge>
                {/* Favorite Button */}
                <FavoriteButton image={metadata} size="lg" />
              </div>

              {/* Share & Download */}
              <ShareDownload
                title={metadata.title}
                imageUrl={largeImage}
                nasaId={metadata.nasa_id}
              />

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {metadata.title}
              </h1>

              {metadata.description && (
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-muted-foreground">
                    {metadata.description.replace(/<[^>]*>/g, "")}
                  </p>
                </div>
              )}

              {/* AI Explanation Section */}
              {largeImage && (
                <div className="space-y-4 rounded-lg border border-border/50 bg-card/30 p-4">
                  <h3 className="font-semibold">AI-Powered Explanation</h3>
                  <AIExplanation
                    imageUrl={largeImage}
                    title={metadata.title}
                    description={metadata.description}
                  />
                </div>
              )}

              {/* Context: related missions, key topics, history */}
              <ContextPanel
                title={metadata.title}
                description={metadata.description || ""}
                date={metadata.date_created}
              />

              {/* Smart recommendations */}
              <RecommendationPanel
                sourceText={`${metadata.title} ${metadata.description || ""}`}
                excludeIds={[metadata.nasa_id]}
              />

              {/* Download Links */}
              {assets.length > 0 && (
                <div className="space-y-3 rounded-lg border border-border/50 bg-card/30 p-4">
                  <h3 className="font-semibold">Available Downloads</h3>
                  <div className="flex flex-wrap gap-2">
                    {assets
                      .filter((url) => url.endsWith(".jpg") || url.endsWith(".png"))
                      .slice(0, 5)
                      .map((url, index) => {
                        const quality = url.includes("~orig")
                          ? "Original"
                          : url.includes("~large")
                          ? "Large"
                          : url.includes("~medium")
                          ? "Medium"
                          : url.includes("~small")
                          ? "Small"
                          : `Image ${index + 1}`;

                        return (
                          <a
                            key={url}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-md border border-border/50 bg-background/50 px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            {quality}
                          </a>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </article>
        ) : (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </main>
    </div>
  );
};

export default ImageDetail;
