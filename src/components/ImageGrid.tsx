import { NASAImageItem } from "@/lib/nasa-api";
import ImageCard from "./ImageCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageGridProps {
  images: NASAImageItem[];
  isLoading?: boolean;
}

const ImageGrid = ({ images, isLoading }: ImageGridProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 text-6xl">🔭</div>
        <h3 className="text-xl font-semibold">No images found</h3>
        <p className="mt-2 text-muted-foreground">
          Try a different search term to explore NASA's vast image library
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <ImageCard key={image.nasa_id} image={image} />
      ))}
    </div>
  );
};

export default ImageGrid;
