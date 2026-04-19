import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Rocket, Calendar, MapPin, Building2, Search } from "lucide-react";
import Header from "@/components/Header";
import Timeline from "@/components/Timeline";
import ImageGrid from "@/components/ImageGrid";
import AIExplanation from "@/components/AIExplanation";
import { getMissionById, TimelineEvent } from "@/data/missions";
import { searchNASAImages } from "@/lib/nasa-api";
import { recommendMissionsForMission } from "@/lib/recommendations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";

const statusConfig = {
  active: { label: "Active", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  completed: { label: "Completed", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  lost: { label: "Lost", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  planned: { label: "Planned", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

const MissionDetail = () => {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  const mission = getMissionById(missionId || "");

  // Fetch mission images
  const { data: images = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ["mission-images", mission?.imageSearchQuery],
    queryFn: () => searchNASAImages(mission!.imageSearchQuery),
    enabled: !!mission,
    staleTime: 1000 * 60 * 5,
  });

  // Fetch event-specific images when an event is selected
  const { data: eventImages = [], isLoading: isLoadingEventImages } = useQuery({
    queryKey: ["event-images", selectedEvent?.imageSearchQuery],
    queryFn: () => searchNASAImages(selectedEvent!.imageSearchQuery!),
    enabled: !!selectedEvent?.imageSearchQuery,
    staleTime: 1000 * 60 * 5,
  });

  if (!mission) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 pb-16 pt-24">
          <Link to="/missions">
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Missions
            </Button>
          </Link>
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
            <p className="font-medium text-destructive">
              Mission not found
            </p>
          </div>
        </main>
      </div>
    );
  }

  const status = statusConfig[mission.status];
  const yearRange = mission.endYear 
    ? `${mission.launchYear} - ${mission.endYear}`
    : `${mission.launchYear} - Present`;

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    // Scroll to event detail section
    document.getElementById("event-detail")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Back Button */}
        <Link to="/missions">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Missions
          </Button>
        </Link>

        {/* Mission Header */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-wrap items-start gap-4">
            <div className="rounded-xl bg-primary/20 p-4">
              <Rocket className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  {mission.name}
                </h1>
                <Badge variant="outline" className={cn(status.className)}>
                  {status.label}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                {mission.fullName}
              </p>
            </div>
          </div>

          {/* Mission Info Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge variant="outline" className="gap-1.5">
              <Calendar className="h-3 w-3" />
              {yearRange}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <MapPin className="h-3 w-3" />
              {mission.target}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              <Building2 className="h-3 w-3" />
              {mission.agency}
            </Badge>
          </div>

          {/* Summary */}
          <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-6">
              <p className="text-lg leading-relaxed text-muted-foreground">
                {mission.summary}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Timeline */}
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight">Mission Timeline</h2>
            <Timeline events={mission.timeline} onEventClick={handleEventClick} />
          </div>

          {/* Event Detail / Images */}
          <div id="event-detail" className="space-y-6">
            {selectedEvent ? (
              <>
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-2">
                      {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <CardTitle>{selectedEvent.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      {selectedEvent.description}
                    </p>
                    
                    {/* AI Summary for the event */}
                    {eventImages[0]?.href && (
                      <AIExplanation
                        imageUrl={eventImages[0].href}
                        title={selectedEvent.title}
                        description={selectedEvent.description}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Event Images */}
                <div>
                  <h3 className="mb-4 text-lg font-semibold">Related Images</h3>
                  {isLoadingEventImages ? (
                    <div className="grid gap-4 grid-cols-2">
                      {[1, 2, 3, 4].map(i => (
                        <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                      ))}
                    </div>
                  ) : eventImages.length > 0 ? (
                    <ImageGrid images={eventImages.slice(0, 4)} />
                  ) : (
                    <p className="text-sm text-muted-foreground">No images found for this event</p>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Select a Timeline Event</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Click on any event in the timeline to see related images and AI-generated summaries
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mission Images Gallery */}
        <div className="mt-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Mission Gallery</h2>
            <Link to={`/search?q=${encodeURIComponent(mission.imageSearchQuery)}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Search className="h-4 w-4" />
                View All
              </Button>
            </Link>
          </div>
          <ImageGrid images={images.slice(0, 8)} isLoading={isLoadingImages} />
        </div>

        {/* You may also like — related missions */}
        {(() => {
          const related = recommendMissionsForMission(mission, 3);
          if (related.length === 0) return null;
          return (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-bold tracking-tight">
                You may also like
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((m) => (
                  <Link
                    key={m.id}
                    to={`/mission/${m.id}`}
                    className="group rounded-lg border border-border/50 bg-card/30 p-5 transition-colors hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-md bg-primary/15 p-2">
                        <Rocket className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary">
                        {m.name}
                      </h3>
                    </div>
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {m.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-xs">
                        {m.target}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {m.launchYear}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
};

export default MissionDetail;
