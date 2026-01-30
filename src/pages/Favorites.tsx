import { Star, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import ImageGrid from "@/components/ImageGrid";
import { useFavorites } from "@/hooks/useFavorites";
import { Button } from "@/components/ui/button";

const Favorites = () => {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 fill-primary text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Favorites</h1>
          </div>
          <p className="text-muted-foreground">
            {favorites.length === 0
              ? "Save your favorite NASA images to view them here"
              : `You have ${favorites.length} saved image${favorites.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 rounded-full bg-primary/10 p-6">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">No favorites yet</h2>
            <p className="mb-6 max-w-md text-muted-foreground">
              Start exploring NASA's incredible image library and save your
              favorite discoveries by clicking the star icon on any image.
            </p>
            <Link to="/">
              <Button className="gap-2">
                <Star className="h-4 w-4" />
                Start Exploring
              </Button>
            </Link>
          </div>
        ) : (
          <ImageGrid images={favorites} />
        )}
      </main>
    </div>
  );
};

export default Favorites;
