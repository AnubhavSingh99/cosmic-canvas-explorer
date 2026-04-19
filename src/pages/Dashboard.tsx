import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Rocket,
  Image as ImageIcon,
  Satellite,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Header from "@/components/Header";
import ISSTracker from "@/components/ISSTracker";
import APODCard from "@/components/APODCard";
import ImageGrid from "@/components/ImageGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { missions } from "@/data/missions";
import { searchNASAImages } from "@/lib/nasa-api";

const Dashboard = () => {
  const { data: recentImages = [], isLoading: isLoadingImages } = useQuery({
    queryKey: ["dashboard-recent", "earth"],
    queryFn: () => searchNASAImages("earth from space"),
    staleTime: 1000 * 60 * 10,
  });

  const activeCount = missions.filter((m) => m.status === "active").length;
  const completedCount = missions.filter((m) => m.status === "completed").length;
  const featured = missions.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pb-16 pt-24">
        {/* Title */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Mission Control
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Live overview of NASA imagery, missions and orbital activity.
          </p>
        </div>

        {/* Stats row */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<Rocket className="h-4 w-4" />}
            label="Tracked missions"
            value={missions.length.toString()}
          />
          <Stat
            icon={<Sparkles className="h-4 w-4" />}
            label="Active"
            value={activeCount.toString()}
            tone="active"
          />
          <Stat
            icon={<Rocket className="h-4 w-4" />}
            label="Completed"
            value={completedCount.toString()}
            tone="completed"
          />
          <Stat
            icon={<Satellite className="h-4 w-4" />}
            label="ISS"
            value="Live"
            tone="active"
          />
        </div>

        {/* Top grid: APOD + ISS */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ImageIcon className="h-5 w-5 text-primary" />
                Astronomy Picture of the Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <APODCard />
            </CardContent>
          </Card>

          <ISSTracker />
        </div>

        {/* Featured missions */}
        <section className="mb-10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Featured missions</h2>
            <Link to="/missions">
              <Button variant="ghost" size="sm" className="gap-1.5">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((m) => (
              <Link
                key={m.id}
                to={`/mission/${m.id}`}
                className="group rounded-lg border border-border/50 bg-card/30 p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="mb-2 flex items-center gap-2">
                  <div className="rounded-md bg-primary/15 p-1.5">
                    <Rocket className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold group-hover:text-primary">{m.name}</h3>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {m.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {m.target}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {m.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent imagery */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">Recent NASA imagery</h2>
            <Link to="/search?q=earth%20from%20space">
              <Button variant="ghost" size="sm" className="gap-1.5">
                Browse <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
          <ImageGrid images={recentImages.slice(0, 8)} isLoading={isLoadingImages} />
        </section>
      </main>
    </div>
  );
};

const toneClass: Record<string, string> = {
  active: "text-green-400",
  completed: "text-blue-400",
  default: "text-primary",
};

const Stat = ({
  icon,
  label,
  value,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "default" | "active" | "completed";
}) => (
  <div className="rounded-lg border border-border/50 bg-card/30 p-4">
    <div className={`mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wide ${toneClass[tone]}`}>
      {icon} {label}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

export default Dashboard;
