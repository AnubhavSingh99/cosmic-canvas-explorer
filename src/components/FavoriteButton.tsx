import { Star } from "lucide-react";
import { NASAImageItem } from "@/lib/nasa-api";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  image: NASAImageItem;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const FavoriteButton = ({ image, className, size = "md" }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isFav = isFavorite(image.nasa_id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(image);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "rounded-full p-2 transition-all duration-200",
        "hover:scale-110 active:scale-95",
        isFav
          ? "bg-primary/20 text-primary"
          : "bg-background/80 text-muted-foreground hover:bg-background hover:text-primary",
        className
      )}
      aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(sizeClasses[size], "transition-all", isFav && "fill-primary")}
      />
    </button>
  );
};

export default FavoriteButton;
