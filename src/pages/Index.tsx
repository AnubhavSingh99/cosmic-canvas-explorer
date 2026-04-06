import { Stars } from "lucide-react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import APODCard from "@/components/APODCard";
import FeaturedMissions from "@/components/FeaturedMissions";
import spaceBg from "@/assets/space-bg.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden pt-16">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${spaceBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        </div>

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Stars className="h-4 w-4" />
              Explore the Universe
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
                NASA Explorer
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Discover breathtaking images from NASA's vast archive. Search for
              galaxies, planets, nebulae, and more from humanity's journey into
              space.
            </p>
            <div className="mx-auto max-w-2xl pt-4">
              <SearchBar size="large" />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-muted-foreground">
              <span>Popular:</span>
              {["Mars", "Apollo", "Nebula", "Jupiter", "Black Hole"].map(
                (term) => (
                  <a
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full border border-border/50 bg-card/50 px-3 py-1 transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                  >
                    {term}
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* APOD Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <h2 className="text-center text-2xl font-bold tracking-tight">
            Today's Astronomy Picture
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <APODCard />
      </section>

      {/* Featured Missions */}
      <FeaturedMissions />

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{" "}
            <a
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              NASA Open APIs
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
