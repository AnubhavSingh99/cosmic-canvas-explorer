import { useEffect, useState } from "react";
import { Satellite, MapPin, Gauge, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface ISSPosition {
  latitude: number;
  longitude: number;
  altitude: number; // km
  velocity: number; // km/h
  visibility: string;
  timestamp: number; // unix seconds
}

const ENDPOINT = "https://api.wheretheiss.at/v1/satellites/25544";
const REFRESH_MS = 5000;

const formatCoord = (n: number, posSuffix: string, negSuffix: string) =>
  `${Math.abs(n).toFixed(4)}° ${n >= 0 ? posSuffix : negSuffix}`;

interface ISSTrackerProps {
  /** When true, render compact card without map (for dashboard widget). */
  compact?: boolean;
}

const ISSTracker = ({ compact = false }: ISSTrackerProps) => {
  const [position, setPosition] = useState<ISSPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPosition = async () => {
    try {
      const res = await fetch(ENDPOINT);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setPosition({
        latitude: data.latitude,
        longitude: data.longitude,
        altitude: data.altitude,
        velocity: data.velocity,
        visibility: data.visibility,
        timestamp: data.timestamp,
      });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch ISS position");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchPosition();
    const id = setInterval(fetchPosition, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Map ISS lat/lon onto an equirectangular world map (0-100% coords)
  const markerLeft = position ? ((position.longitude + 180) / 360) * 100 : 50;
  const markerTop = position ? ((90 - position.latitude) / 180) * 100 : 50;

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <div className="relative">
            <Satellite className="h-5 w-5 text-primary" />
            {!loading && !error && (
              <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            )}
          </div>
          ISS Live Position
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setLoading(true);
            void fetchPosition();
          }}
          className="h-8 gap-1.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          <span className="text-xs">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Couldn't fetch ISS position: {error}
          </div>
        )}

        {!position && loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {position && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Latitude"
                value={formatCoord(position.latitude, "N", "S")}
              />
              <Stat
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Longitude"
                value={formatCoord(position.longitude, "E", "W")}
              />
              <Stat
                icon={<Gauge className="h-3.5 w-3.5" />}
                label="Altitude"
                value={`${position.altitude.toFixed(1)} km`}
              />
              <Stat
                icon={<Gauge className="h-3.5 w-3.5" />}
                label="Velocity"
                value={`${position.velocity.toFixed(0)} km/h`}
              />
            </div>

            {!compact && (
              <div className="relative aspect-[2/1] overflow-hidden rounded-md border border-border/50 bg-muted/40">
                {/* Simple equirectangular world graphic via SVG */}
                <svg
                  viewBox="0 0 360 180"
                  preserveAspectRatio="none"
                  className="absolute inset-0 h-full w-full"
                >
                  <defs>
                    <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.5" />
                    </pattern>
                  </defs>
                  <rect width="360" height="180" fill="url(#grid)" />
                  {/* Equator */}
                  <line x1="0" y1="90" x2="360" y2="90" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,3" opacity="0.5" />
                  {/* Prime meridian */}
                  <line x1="180" y1="0" x2="180" y2="180" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,3" opacity="0.5" />
                </svg>

                {/* ISS marker */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${markerLeft}%`, top: `${markerTop}%` }}
                >
                  <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-primary/40" />
                  <div className="relative flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                    <Satellite className="h-3.5 w-3.5" />
                  </div>
                </div>

                <div className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-1 text-[10px] text-muted-foreground backdrop-blur">
                  Equirectangular projection · auto-refresh {REFRESH_MS / 1000}s
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Visibility: <span className="capitalize text-foreground">{position.visibility}</span></span>
              <span>
                Updated{" "}
                {new Date(position.timestamp * 1000).toLocaleTimeString()}
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-md border border-border/40 bg-background/40 p-2.5">
    <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-muted-foreground">
      {icon} {label}
    </div>
    <div className="font-mono text-sm font-semibold">{value}</div>
  </div>
);

export default ISSTracker;
