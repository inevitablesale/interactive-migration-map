import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { TopFirm } from "@/types/rankings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface PracticeInfoProps {
  practice: TopFirm;
  onInterested?: () => void;
}

export function PracticeInfo({ practice, onInterested }: PracticeInfoProps) {
  const [showDialog, setShowDialog] = useState(false);

  const handleInterestConfirmed = () => {
    setShowDialog(false);
    onInterested?.();
  };

  return (
    <>
      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white">Practice Information</CardTitle>
          <Button 
            onClick={() => setShowDialog(true)}
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-black/90 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Express Interest</DialogTitle>
            <DialogDescription className="text-gray-400 pt-2">
              You're about to express interest in {practice["Company Name"]}. This will:
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Add this practice to your tracked practices</li>
                <li>Notify you of any updates about this practice</li>
                <li>Allow you to receive market insights about this region</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInterestConfirmed}
              className="bg-yellow-400 text-black hover:bg-yellow-500"
            >
              Confirm Interest
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}