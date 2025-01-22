import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopFirm } from "@/types/rankings";

interface PracticeInfoProps {
  practice: TopFirm;
}

export function PracticeInfo({ practice }: PracticeInfoProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Practice Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-yellow-400">Location</h3>
          <p className="text-white/80">{practice.Location}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Employee Count</h3>
          <p className="text-white/80">{practice.employee_count || 'Not available'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Follower Count</h3>
          <p className="text-white/80">{practice.follower_count?.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Founded</h3>
          <p className="text-white/80">{practice.foundedOn || 'Not available'}</p>
        </div>
      </CardContent>
    </Card>
  );
}