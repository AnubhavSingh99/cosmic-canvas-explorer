import { Link } from "react-router-dom";
import { Rocket, Star, Calendar, Map, ScanSearch, Sparkles } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

const Header = () => {
  const { favorites } = useFavorites();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight transition-colors hover:text-primary"
        >
          <Rocket className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NASA Explorer
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/missions"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Map className="h-4 w-4" />
            Missions
          </Link>
          <Link
            to="/history"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Calendar className="h-4 w-4" />
            History
          </Link>
          <Link
            to="/scan"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ScanSearch className="h-4 w-4" />
            AstroScan
          </Link>
          <Link
            to="/assistant"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sparkles className="h-4 w-4" />
            Assistant
          </Link>
          <Link
            to="/favorites"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {favorites.length}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
