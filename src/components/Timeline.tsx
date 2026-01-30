import { Rocket, Flag, Sparkles, CheckCircle } from "lucide-react";
import { TimelineEvent } from "@/data/missions";
import { cn } from "@/lib/utils";

interface TimelineProps {
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const eventTypeConfig = {
  launch: {
    icon: Rocket,
    color: "text-orange-400",
    bgColor: "bg-orange-400/20",
    borderColor: "border-orange-400/50",
  },
  milestone: {
    icon: Flag,
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
    borderColor: "border-blue-400/50",
  },
  discovery: {
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/20",
    borderColor: "border-primary/50",
  },
  status: {
    icon: CheckCircle,
    color: "text-green-400",
    bgColor: "bg-green-400/20",
    borderColor: "border-green-400/50",
  },
};

const Timeline = ({ events, onEventClick }: TimelineProps) => {
  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent" />

      {events.map((event, index) => {
        const config = eventTypeConfig[event.type];
        const Icon = config.icon;
        const isLast = index === events.length - 1;

        return (
          <div
            key={event.id}
            className={cn(
              "relative flex gap-4 pb-8 group",
              isLast && "pb-0"
            )}
          >
            {/* Icon node */}
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                config.bgColor,
                config.borderColor,
                "group-hover:scale-110 group-hover:shadow-lg",
                onEventClick && "cursor-pointer"
              )}
              onClick={() => onEventClick?.(event)}
            >
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>

            {/* Content */}
            <div
              className={cn(
                "flex-1 rounded-lg border border-border/50 bg-card/50 p-4 transition-all duration-300",
                "hover:border-primary/30 hover:bg-card/80",
                onEventClick && "cursor-pointer"
              )}
              onClick={() => onEventClick?.(event)}
            >
              {/* Date badge */}
              <div className="mb-2 text-xs font-medium text-muted-foreground">
                {new Date(event.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Title */}
              <h4 className="mb-1 font-semibold leading-tight group-hover:text-primary transition-colors">
                {event.title}
              </h4>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {event.description}
              </p>

              {/* Type badge */}
              <div className="mt-3">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                    config.bgColor,
                    config.color
                  )}
                >
                  <Icon className="h-3 w-3" />
                  {event.type}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
