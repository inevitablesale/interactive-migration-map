import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users } from "lucide-react";

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
          <p className="text-muted-foreground">Next reveal in 12 hours</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <CardTitle>Today's Featured Opportunity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">
            {practice.industry} | {practice.region}
          </h3>
          <p className="text-sm text-muted-foreground">
            {practice.employee_count} employees | {Object.entries(practice.service_mix)
              .map(([key, value]) => `${value}% ${key}`)
              .join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{practice.buyer_count} interested buyers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">12 hours remaining</span>
          </div>
        </div>

        <Button className="w-full" onClick={onInterested}>
          I'm Interested
        </Button>
      </CardContent>
    </Card>
  );
}