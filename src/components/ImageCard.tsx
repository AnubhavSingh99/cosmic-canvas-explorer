import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { NASAImageItem } from "@/lib/nasa-api";
import { Card, CardContent } from "@/components/ui/card";

interface ImageCardProps {
  image: NASAImageItem;
}

const ImageCard = ({ image }: ImageCardProps) => {
  const formattedDate = image.date_created
    ? new Date(image.date_created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <Link to={`/image/${image.nasa_id}`}>
      <Card className="group h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image.thumb || image.href}
            alt={image.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
        </div>
        <CardContent className="relative -mt-12 space-y-2 p-4">
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </div>
          )}
          <h3 className="line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
            {image.title}
          </h3>
          {image.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {image.description.replace(/<[^>]*>/g, "").substring(0, 100)}
              {image.description.length > 100 ? "..." : ""}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ImageCard;
