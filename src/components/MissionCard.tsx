import { Link } from "react-router-dom";
import { Rocket, Calendar, MapPin, Building2 } from "lucide-react";
import { Mission } from "@/data/missions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  mission: Mission;
}

const statusConfig = {
  active: { label: "Active", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  completed: { label: "Completed", className: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  lost: { label: "Lost", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  planned: { label: "Planned", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
};

const MissionCard = ({ mission }: MissionCardProps) => {
  const status = statusConfig[mission.status];
  const yearRange = mission.endYear 
    ? `${mission.launchYear} - ${mission.endYear}`
    : `${mission.launchYear} - Present`;

  return (
    <Link to={`/mission/${mission.id}`}>
      <Card className="group h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-2 transition-colors group-hover:bg-primary/30">
                <Rocket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold leading-tight transition-colors group-hover:text-primary">
                  {mission.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {mission.fullName}
                </p>
              </div>
            </div>
            <Badge variant="outline" className={cn("shrink-0", status.className)}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {mission.summary}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {yearRange}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {mission.target}
            </span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {mission.agency}
            </span>
          </div>
          <div className="text-xs text-primary/70">
            {mission.timeline.length} timeline events →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MissionCard;
