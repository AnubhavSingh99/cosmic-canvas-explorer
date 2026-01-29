import { useQuery } from "@tanstack/react-query";
import { Calendar, ExternalLink } from "lucide-react";
import { getAPOD } from "@/lib/nasa-api";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const APODCard = () => {
  const { data: apod, isLoading, error } = useQuery({
    queryKey: ["apod"],
    queryFn: getAPOD,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="aspect-video w-full" />
          <CardContent className="flex flex-col justify-center gap-4 p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </div>
      </Card>
    );
  }

  if (error || !apod) {
    return (
      <Card className="border-destructive/50 bg-destructive/10 p-6">
        <p className="text-center text-destructive">
          Failed to load Astronomy Picture of the Day
        </p>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/30">
      <div className="grid gap-0 lg:grid-cols-2">
        <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-[300px]">
          {apod.media_type === "video" ? (
            <iframe
              src={apod.url}
              title={apod.title}
              className="absolute inset-0 h-full w-full"
              allowFullScreen
            />
          ) : (
            <img
              src={apod.url}
              alt={apod.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent lg:bg-gradient-to-r" />
        </div>
        <CardContent className="flex flex-col justify-center gap-4 p-6 lg:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              {apod.date}
            </Badge>
            <Badge className="bg-primary/20 text-primary">
              Astronomy Picture of the Day
            </Badge>
          </div>
          <h3 className="text-2xl font-bold tracking-tight lg:text-3xl">
            {apod.title}
          </h3>
          <p className="line-clamp-4 text-muted-foreground">
            {apod.explanation}
          </p>
          {apod.copyright && (
            <p className="text-sm text-muted-foreground">
              © {apod.copyright}
            </p>
          )}
          {apod.hdurl && (
            <a
              href={apod.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
            >
              View HD Image
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default APODCard;
