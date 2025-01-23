import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { TopFirm } from "@/types/rankings";

interface PracticeInfoProps {
  practice: TopFirm;
  onInterested?: () => void;
}

export function PracticeInfo({ practice, onInterested }: PracticeInfoProps) {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-white">Practice Information</CardTitle>
        <Button 
          onClick={onInterested}
          className="bg-yellow-400 text-black hover:bg-yellow-500"
          size="sm"
        >
          <Heart className="mr-2 h-4 w-4" />
          I'm Interested
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-yellow-400">Location</h3>
          <p className="text-white/80">{practice.Location}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Employee Count</h3>
          <p className="text-white/80">{practice.employeeCount || 'Not available'}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Follower Count</h3>
          <p className="text-white/80">{practice.followerCount?.toLocaleString()}</p>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-400">Founded</h3>
          <p className="text-white/80">{practice.foundedOn || 'Not available'}</p>
        </div>
      </CardContent>
    </Card>
  );
}