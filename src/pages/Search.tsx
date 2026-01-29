import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, Image } from "lucide-react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import ImageGrid from "@/components/ImageGrid";
import { searchNASAImages } from "@/lib/nasa-api";
import { Badge } from "@/components/ui/badge";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const {
    data: images = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["nasa-search", query],
    queryFn: () => searchNASAImages(query),
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Search Header */}
        <div className="mb-8 space-y-6">
          <div className="flex items-center gap-3">
            <SearchIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          </div>
          <div className="max-w-2xl">
            <SearchBar initialQuery={query} />
          </div>
        </div>

        {/* Results Info */}
        {query && !isLoading && !error && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="gap-1.5 text-sm">
              <Image className="h-3.5 w-3.5" />
              {images.length} images
            </Badge>
            <span className="text-muted-foreground">
              for "{query}"
            </span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
            <p className="font-medium text-destructive">
              Failed to search images. Please try again.
            </p>
          </div>
        )}

        {/* No Query State */}
        {!query && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <SearchIcon className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <h2 className="text-xl font-semibold">Enter a search term</h2>
            <p className="mt-2 text-muted-foreground">
              Type something in the search bar to explore NASA's image library
            </p>
          </div>
        )}

        {/* Results Grid */}
        {query && <ImageGrid images={images} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Search;
