import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Play } from "lucide-react";

interface PracticeOfDayProps {
  practice?: {
    industry: string;
    region: string;
    employee_count: number;
    service_mix: Record<string, number>;
    buyer_count: number;
  };
  onInterested?: () => void;
}

export function PracticeOfDay({ practice, onInterested }: PracticeOfDayProps) {
  if (!practice) {
    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Practice of the Day</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          <Calendar className="h-8 w-8 text-muted-foreground" />
          <p className="text-muted-foreground">Next reveal in 12 hours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white relative overflow-hidden">
      {/* Coming Soon Banner */}
      <div className="absolute -right-20 top-12 rotate-45 bg-yellow-400 text-black font-semibold py-1 px-16 text-base shadow-md z-10">
        COMING SOON
      </div>
      
      <CardHeader>
        <CardTitle>Today's Featured Opportunity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">
            {practice.industry} | {practice.region}
          </h3>
          <p className="text-base text-muted-foreground">
            {practice.employee_count} employees | {Object.entries(practice.service_mix)
              .map(([key, value]) => `${value}% ${key}`)
              .join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-base">{practice.buyer_count} interested buyers</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span className="text-base">12 hours remaining</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button className="w-full h-12 text-base" onClick={onInterested} disabled>
            I'm Interested
          </Button>
          <Button variant="outline" className="w-full h-12 text-base" asChild disabled>
            <a href="#replay">
              <Play className="h-5 w-5 mr-2" />
              Watch the live replay
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}