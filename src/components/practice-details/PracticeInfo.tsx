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
import { Textarea } from "@/components/ui/textarea";

interface PracticeInfoProps {
  practice: TopFirm;
  onInterested?: () => void;
}

export function PracticeInfo({ practice, onInterested }: PracticeInfoProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");

  const handleInterestConfirmed = () => {
    setShowDialog(false);
    onInterested?.();
  };

  // Create an anonymized name
  const anonymizedName = `${practice.Location} Practice (${practice.employeeCount || 'Small'} employees)`;

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
              You're about to express interest in {anonymizedName}. This will:
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Add this practice to your tracked practices</li>
                <li>Notify you of any updates about this practice</li>
                <li>Our team will make contact with the owner on your behalf</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                Message to Owner (Optional)
              </label>
              <Textarea
                id="message"
                placeholder="Share any specific questions or information you'd like us to relay to the owner..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-black/50 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="bg-black border-white/10 text-white hover:bg-white/10"
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