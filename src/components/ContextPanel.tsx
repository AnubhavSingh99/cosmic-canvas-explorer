import { Link } from "react-router-dom";
import { Rocket, Tag, Calendar } from "lucide-react";
import { recommendMissionsFromText, extractKeywords } from "@/lib/recommendations";
import { spaceEvents } from "@/data/space-events";
import { Badge } from "@/components/ui/badge";

interface ContextPanelProps {
  title: string;
  description: string;
  date?: string;
}

/**
 * ContextPanel surfaces related missions, key topic tags and historical
 * timeline snippets for a given image / piece of NASA content.
 */
const ContextPanel = ({ title, description, date }: ContextPanelProps) => {
  const sourceText = `${title} ${description}`;
  const relatedMissions = recommendMissionsFromText(sourceText, { limit: 3 });
  const keywords = extractKeywords(sourceText, 6);

  // Pick up to 3 historical events that share keywords (best-effort)
  const relatedEvents = spaceEvents
    .map((e) => {
      const haystack = `${e.title} ${e.description}`.toLowerCase();
      const score = keywords.reduce(
        (acc, kw) => acc + (haystack.includes(kw) ? 1 : 0),
        0
      );
      return { event: e, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.event);

  // If we have nothing useful at all, render nothing.
  if (
    relatedMissions.length === 0 &&
    relatedEvents.length === 0 &&
    keywords.length === 0
  ) {
    return null;
  }

  return (
    <section className="space-y-5 rounded-lg border border-border/50 bg-card/30 p-4">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <h3 className="font-semibold">Context</h3>
      </div>

      {keywords.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Key topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((kw) => (
              <Link key={kw} to={`/search?q=${encodeURIComponent(kw)}`}>
                <Badge
                  variant="outline"
                  className="cursor-pointer capitalize hover:bg-primary/10 hover:text-primary"
                >
                  {kw}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedMissions.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Rocket className="h-3 w-3" /> Related missions
          </p>
          <div className="grid gap-2">
            {relatedMissions.map((m) => (
              <Link
                key={m.id}
                to={`/mission/${m.id}`}
                className="group flex items-start justify-between gap-3 rounded-md border border-border/50 bg-background/40 p-3 transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <div className="min-w-0">
                  <p className="font-medium group-hover:text-primary">{m.name}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">
                    {m.summary}
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0 text-xs">
                  {m.target}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedEvents.length > 0 && (
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
            <Calendar className="h-3 w-3" /> On this topic in history
          </p>
          <ul className="space-y-2">
            {relatedEvents.map((e) => (
              <li
                key={e.id}
                className="rounded-md border border-border/50 bg-background/40 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{e.title}</p>
                  <span className="text-xs text-muted-foreground">{e.year}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                  {e.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {date && (
        <p className="text-xs text-muted-foreground">
          Captured / published: {new Date(date).toLocaleDateString()}
        </p>
      )}
    </section>
  );
};

export default ContextPanel;
