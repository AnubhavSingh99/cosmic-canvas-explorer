import Header from "@/components/Header";
import ISSTracker from "@/components/ISSTracker";
import { Satellite } from "lucide-react";

const Tracker = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-5xl px-4 pb-16 pt-24">
        <div className="mb-6 space-y-2">
          <div className="flex items-center gap-2">
            <Satellite className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Satellite Tracker
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Live position of the International Space Station, refreshed every 5
            seconds. Data provided by{" "}
            <a
              href="https://wheretheiss.at"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              wheretheiss.at
            </a>
            .
          </p>
        </div>

        <ISSTracker />

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Fact
            title="What is the ISS?"
            body="The International Space Station is a habitable artificial satellite in low Earth orbit, jointly operated by NASA, Roscosmos, ESA, JAXA, and CSA since 2000."
          />
          <Fact
            title="How fast does it move?"
            body="The ISS travels at roughly 28,000 km/h, completing one orbit around Earth approximately every 90 minutes — about 16 sunrises and sunsets per day."
          />
        </div>
      </main>
    </div>
  );
};

const Fact = ({ title, body }: { title: string; body: string }) => (
  <div className="rounded-lg border border-border/50 bg-card/30 p-4">
    <h3 className="mb-1 font-semibold">{title}</h3>
    <p className="text-sm text-muted-foreground">{body}</p>
  </div>
);

export default Tracker;
