import { Link } from "react-router-dom";
import { Rocket, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { missions } from "@/data/missions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const featured = missions.slice(0, 6);

const statusColors: Record<string, string> = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
  planned: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
};

const FeaturedMissions = () => {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const canPrev = startIndex > 0;
  const canNext = startIndex + visibleCount < featured.length;

  const visible = featured.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight">Featured Missions</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setStartIndex((i) => Math.max(0, i - 1))}
            disabled={!canPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setStartIndex((i) => Math.min(featured.length - visibleCount, i + 1))}
            disabled={!canNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Link to="/missions">
            <Button variant="ghost" size="sm">
              View all →
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((mission, i) => (
          <Link
            key={mission.id}
            to={`/mission/${mission.id}`}
            className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/50 hover:bg-card/80 hover:shadow-lg animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={statusColors[mission.status]}>
                  {mission.status}
                </Badge>
                <span className="text-xs text-muted-foreground">{mission.launchYear}</span>
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {mission.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {mission.summary}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-border/50 bg-background/50 px-2 py-0.5">
                  {mission.target}
                </span>
                <span className="rounded-full border border-border/50 bg-background/50 px-2 py-0.5">
                  {mission.agency}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedMissions;
