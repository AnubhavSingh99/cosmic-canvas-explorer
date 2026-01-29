import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  initialQuery?: string;
  size?: "default" | "large";
}

const SearchBar = ({ initialQuery = "", size = "default" }: SearchBarProps) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isLarge = size === "large";

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-3">
      <div className="relative flex-1">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${
            isLarge ? "h-5 w-5" : "h-4 w-4"
          }`}
        />
        <Input
          type="text"
          placeholder="Search NASA's image library..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`pl-10 bg-card/50 border-border/50 placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 ${
            isLarge ? "h-14 text-lg" : "h-10"
          }`}
        />
      </div>
      <Button
        type="submit"
        className={`font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 ${
          isLarge ? "h-14 px-8 text-lg" : "h-10 px-6"
        }`}
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;
