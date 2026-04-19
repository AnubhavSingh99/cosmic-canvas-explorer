import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { searchNASAImages } from "@/lib/nasa-api";
import { buildRelatedImageQuery } from "@/lib/recommendations";
import { Skeleton } from "@/components/ui/skeleton";

interface RecommendationPanelProps {
  /** Source text used to derive related-image keywords */
  sourceText: string;
  /** NASA IDs to exclude (e.g. the current image) */
  excludeIds?: string[];
  title?: string;
  limit?: number;
}

const RecommendationPanel = ({
  sourceText,
  excludeIds = [],
  title = "You may also like",
  limit = 6,
}: RecommendationPanelProps) => {
  const query = buildRelatedImageQuery(sourceText);

  const { data: images = [], isLoading } = useQuery({
    queryKey: ["recommendations", query],
    queryFn: () => searchNASAImages(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });

  const filtered = images
    .filter((img) => !excludeIds.includes(img.nasa_id) && !!img.thumb)
    .slice(0, limit);

  if (!isLoading && filtered.length === 0) return null;

  return (
    <section className="space-y-4 rounded-lg border border-border/50 bg-card/30 p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((img) => (
            <Link
              key={img.nasa_id}
              to={`/image/${img.nasa_id}`}
              className="group relative aspect-square overflow-hidden rounded-md border border-border/50 bg-muted"
            >
              {img.thumb ? (
                <img
                  src={img.thumb}
                  alt={img.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-2">
                <p className="line-clamp-2 text-xs font-medium">{img.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendationPanel;
