import { Link } from "react-router-dom";
import { GraduationCap, Rocket, Telescope, Sun, Globe, Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LearningStep {
  title: string;
  description: string;
  to: string;
  cta: string;
}

interface LearningPath {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  icon: typeof Rocket;
  intro: string;
  steps: LearningStep[];
}

const paths: LearningPath[] = [
  {
    id: "solar-system",
    title: "Tour the Solar System",
    level: "Beginner",
    icon: Sun,
    intro: "Travel from the Sun to the outer planets with imagery and missions.",
    steps: [
      { title: "1. The Sun and inner planets", description: "Explore Mercury, Venus, Earth and Mars.", to: "/search?q=inner%20planets", cta: "View imagery" },
      { title: "2. Mars exploration", description: "See how rovers map the red planet.", to: "/mission/curiosity", cta: "Open mission" },
      { title: "3. Outer giants", description: "Jupiter, Saturn, Uranus and Neptune up close.", to: "/search?q=outer%20planets", cta: "View imagery" },
      { title: "4. Voyager's journey", description: "The mission still flying beyond the solar system.", to: "/mission/voyager-1", cta: "Open mission" },
    ],
  },
  {
    id: "deep-space",
    title: "Discover Deep Space",
    level: "Intermediate",
    icon: Telescope,
    intro: "Galaxies, nebulae and the early universe through space telescopes.",
    steps: [
      { title: "1. Hubble's greatest hits", description: "Iconic galaxy and nebula portraits.", to: "/search?q=hubble", cta: "View imagery" },
      { title: "2. The James Webb era", description: "Infrared views of star formation.", to: "/mission/jwst", cta: "Open mission" },
      { title: "3. Identify what you see", description: "Use AstroScan on a sky photo.", to: "/scan", cta: "Try AstroScan" },
      { title: "4. Ask the assistant", description: "Get explanations on demand.", to: "/assistant", cta: "Open assistant" },
    ],
  },
  {
    id: "human-spaceflight",
    title: "Humans in Space",
    level: "Beginner",
    icon: Rocket,
    intro: "From Apollo to the ISS — how people live and work in orbit.",
    steps: [
      { title: "1. Apollo 11 — first steps", description: "The Moon landing, in context.", to: "/mission/apollo-11", cta: "Open mission" },
      { title: "2. Watch the ISS live", description: "Real-time orbit tracking.", to: "/tracker", cta: "Open tracker" },
      { title: "3. Earth from above", description: "The view astronauts see every day.", to: "/search?q=earth%20from%20space", cta: "View imagery" },
      { title: "4. Mission control overview", description: "Stats, APOD and live ISS in one place.", to: "/dashboard", cta: "Open dashboard" },
    ],
  },
  {
    id: "history",
    title: "Space History Timeline",
    level: "Intermediate",
    icon: Globe,
    intro: "Walk through the milestones that shaped space exploration.",
    steps: [
      { title: "1. Browse historical events", description: "Pick a date and see what happened.", to: "/history", cta: "Open history" },
      { title: "2. Mission catalog", description: "Compare missions across agencies.", to: "/missions", cta: "Open missions" },
      { title: "3. Deep dive: Voyager", description: "Interactive timeline view.", to: "/mission/voyager-1", cta: "Open mission" },
      { title: "4. Save your favorites", description: "Build a personal collection.", to: "/favorites", cta: "Open favorites" },
    ],
  },
];

const levelTone: Record<LearningPath["level"], string> = {
  Beginner: "bg-green-500/15 text-green-400 border-green-500/30",
  Intermediate: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Advanced: "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 pb-16 pt-24">
        <div className="mb-8 space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Learning Paths
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Structured journeys through NASA's imagery, missions and tools.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {paths.map((path) => {
            const Icon = path.icon;
            return (
              <Card key={path.id} className="border-border/50 bg-card/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/15 p-2.5">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {path.intro}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className={levelTone[path.level]}>
                      {path.level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {path.steps.map((step) => (
                      <li
                        key={step.title}
                        className="rounded-lg border border-border/50 bg-background/40 p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-medium">{step.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                          <Link
                            to={step.to}
                            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/50 bg-card/50 px-2.5 py-1 text-xs font-medium text-primary transition-colors hover:border-primary/50 hover:bg-primary/10"
                          >
                            {step.cta}
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-10 rounded-lg border border-primary/30 bg-primary/5 p-5 text-center">
          <Sparkles className="mx-auto mb-2 h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Want a custom answer? Ask the AI assistant about any topic and get linked imagery.
          </p>
          <Link
            to="/assistant"
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            Open Assistant <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Learn;
