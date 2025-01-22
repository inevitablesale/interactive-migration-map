import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopFirm } from "@/types/rankings";

interface PracticeInfoProps {
  practice: TopFirm;
}

export function PracticeInfo({ practice }: PracticeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Practice Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Location</h3>
          <p>{practice.Location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Employee Count</h3>
          <p>{practice.employee_count || 'Not available'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Follower Count</h3>
          <p>{practice.follower_count?.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold">Founded</h3>
          <p>{practice.foundedOn || 'Not available'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Specialties</h3>
          <p>{practice.specialities || 'Not available'}</p>
        </div>
        {practice.Summary && (
          <div>
            <h3 className="font-semibold">Summary</h3>
            <p>{practice.Summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}