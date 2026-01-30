import { Link } from "react-router-dom";
import { Rocket, Filter, Search } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import MissionCard from "@/components/MissionCard";
import { missions, getTargets } from "@/data/missions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const Missions = () => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const targets = getTargets();

  const filteredMissions = selectedTarget
    ? missions.filter(m => m.target === selectedTarget)
    : missions;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <Rocket className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Space Missions</h1>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Explore humanity's greatest space exploration missions. Click on any mission to see its complete timeline, key discoveries, and related images.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filter by destination:
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTarget === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTarget(null)}
            >
              All Missions
            </Button>
            {targets.map(target => (
              <Button
                key={target}
                variant={selectedTarget === target ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTarget(target)}
              >
                {target}
              </Button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6">
          <Badge variant="outline" className="gap-1.5">
            <Rocket className="h-3 w-3" />
            {filteredMissions.length} mission{filteredMissions.length !== 1 ? "s" : ""}
          </Badge>
        </div>

        {/* Mission Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map(mission => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        {filteredMissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-xl font-semibold">No missions found</h3>
            <p className="mt-2 text-muted-foreground">
              Try selecting a different destination filter
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Missions;
