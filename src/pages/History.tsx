import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Rocket, Sparkles, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import { getAPODByDate } from "@/lib/nasa-api";
import { getEventsForDate, SpaceEvent } from "@/data/space-events";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { icon: typeof Rocket; color: string; bgColor: string }> = {
  launch: { icon: Rocket, color: "text-orange-400", bgColor: "bg-orange-400/20" },
  landing: { icon: Rocket, color: "text-green-400", bgColor: "bg-green-400/20" },
  discovery: { icon: Sparkles, color: "text-primary", bgColor: "bg-primary/20" },
  milestone: { icon: Clock, color: "text-blue-400", bgColor: "bg-blue-400/20" },
  tragedy: { icon: Rocket, color: "text-red-400", bgColor: "bg-red-400/20" },
};

const History = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const monthDay = format(selectedDate, "MM-dd");
  const displayDate = format(selectedDate, "MMMM d");
  
  // Get APOD for selected date
  const { data: apod, isLoading: isLoadingAPOD, error: apodError } = useQuery({
    queryKey: ["apod-history", formattedDate],
    queryFn: () => getAPODByDate(formattedDate),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Get historical events for this day
  const events = getEventsForDate(monthDay);

  const goToToday = () => setSelectedDate(new Date());
  
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };
  
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= new Date()) {
      setSelectedDate(newDate);
    }
  };

  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const isFutureDisabled = selectedDate >= new Date();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">On This Day in Space</h1>
          </div>
          <p className="max-w-2xl text-muted-foreground">
            Travel through time and discover what happened in space exploration history on any date. See the Astronomy Picture of the Day and major space events.
          </p>
        </div>

        {/* Date Navigation */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPreviousDay}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2 min-w-[200px] justify-start">
                  <CalendarIcon className="h-4 w-4" />
                  {format(selectedDate, "MMMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date > new Date() || date < new Date("1995-06-16")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="icon"
              onClick={goToNextDay}
              disabled={isFutureDisabled}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant={isToday ? "default" : "secondary"}
            onClick={goToToday}
            className="gap-2"
          >
            <Clock className="h-4 w-4" />
            Today
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* APOD for this date */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Astronomy Picture - {displayDate}
            </h2>
            
            {isLoadingAPOD ? (
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-0">
                  <Skeleton className="aspect-video w-full rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ) : apodError ? (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-8 text-center">
                  <p className="text-destructive">
                    No APOD available for this date. Try selecting a date after June 16, 1995.
                  </p>
                </CardContent>
              </Card>
            ) : apod ? (
              <Card className="overflow-hidden border-border/50 bg-card/50">
                {apod.media_type === "image" ? (
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full aspect-video object-cover"
                  />
                ) : apod.media_type === "video" ? (
                  <div className="aspect-video">
                    <iframe
                      src={apod.url}
                      title={apod.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                <CardHeader>
                  <CardTitle className="text-lg">{apod.title}</CardTitle>
                  {apod.copyright && (
                    <p className="text-xs text-muted-foreground">© {apod.copyright}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-4">
                    {apod.explanation}
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Historical Events */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Rocket className="h-5 w-5 text-primary" />
              Space History - {displayDate}
            </h2>

            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map(event => {
                  const config = categoryConfig[event.category] || categoryConfig.milestone;
                  const Icon = config.icon;
                  
                  return (
                    <Card key={event.id} className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
                      <CardContent className="pt-4">
                        <div className="flex gap-4">
                          <div className={cn(
                            "h-10 w-10 shrink-0 rounded-full flex items-center justify-center",
                            config.bgColor
                          )}>
                            <Icon className={cn("h-5 w-5", config.color)} />
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="font-semibold">{event.title}</h3>
                              <Badge variant="outline" className="shrink-0">
                                {event.year}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {event.description}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className={cn("capitalize text-xs", config.bgColor, config.color)}
                            >
                              {event.category}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="border-border/50 bg-card/30">
                <CardContent className="py-12 text-center">
                  <div className="mb-4 inline-flex rounded-full bg-muted p-4">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="mb-2 font-semibold">No Major Events Recorded</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    No significant space events are recorded for {displayDate} in our database. Try exploring other dates!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Explore More */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="py-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Want to explore more space history? Check out our curated mission timelines.
                </p>
                <Button asChild variant="outline" className="gap-2">
                  <a href="/missions">
                    <Rocket className="h-4 w-4" />
                    Browse Missions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
