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
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface PracticeInfoProps {
  practice: TopFirm;
  onInterested?: (message?: string) => void;
}

export function PracticeInfo({ practice, onInterested }: PracticeInfoProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [message, setMessage] = useState("");
  const [hasExpressedInterest, setHasExpressedInterest] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingInterest = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData?.user?.id) return;

        const { data: existingInterest } = await supabase
          .from('canary_firm_interests')
          .select('id')
          .eq('company_id', practice["Company ID"])
          .eq('user_id', userData.user.id)
          .maybeSingle();

        setHasExpressedInterest(!!existingInterest);
      } catch (error) {
        console.error('Error checking existing interest:', error);
      }
    };

    checkExistingInterest();
  }, [practice]);

  const handleInterestConfirmed = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.id) {
        // Redirect to auth page if user is not logged in
        navigate("/auth");
        return;
      }

      console.log('handleInterested called with message:', message);

      // Add interest record
      const { error: interestError } = await supabase
        .from('canary_firm_interests')
        .insert([{
          company_id: practice["Company ID"],
          user_id: userData.user.id,
          status: 'interested',
          is_anonymous: false
        }]);

      if (interestError) {
        console.error('Error inserting interest:', interestError);
        throw interestError;
      }

      // Send admin notification email
      const { error: adminEmailError } = await supabase.functions.invoke('smtp-email', {
        body: {
          to: 'chris@inevitable.sale',
          subject: `New Interest: Practice #${practice["Company ID"]}`,
          html: `
            <h2>New Interest Notification</h2>
            <p>A user has expressed interest in practice #${practice["Company ID"]}</p>
            <p>User ID: ${userData.user.id}</p>
            <p>Message: ${message || 'No message provided'}</p>
            <p>Practice Details:</p>
            <ul>
              <li>Location: ${practice.Location}</li>
              <li>Employee Count: ${practice.employeeCount}</li>
              <li>Specialities: ${practice.specialities || 'Not specified'}</li>
            </ul>
          `,
          text: `New Interest Notification\n\nA user has expressed interest in practice #${practice["Company ID"]}\nUser ID: ${userData.user.id}\nMessage: ${message || 'No message provided'}`
        }
      });

      if (adminEmailError) {
        console.error('Error sending admin notification:', adminEmailError);
      }

      // Send user confirmation email
      const { error: userEmailError } = await supabase.functions.invoke('smtp-email', {
        body: {
          to: userData.user.email,
          subject: "Interest Confirmation - Next Steps",
          html: `
            <h2>Thank you for your interest!</h2>
            <p>We've received your interest in practice #${practice["Company ID"]}.</p>
            <p>Our team will make contact with the practice owner within the next 72 hours and keep you updated on any developments.</p>
            <p>If you have any questions in the meantime, please don't hesitate to reach out to us at team@canary.accountants.</p>
            <br>
            <p>Best regards,</p>
            <p>The Canary Team</p>
          `,
          text: `Thank you for your interest!\n\nWe've received your interest in practice #${practice["Company ID"]}.\n\nOur team will make contact with the practice owner within the next 72 hours and keep you updated on any developments.\n\nIf you have any questions in the meantime, please don't hesitate to reach out to us at team@canary.accountants.\n\nBest regards,\nThe Canary Team`
        }
      });

      if (userEmailError) {
        console.error('Error sending user confirmation:', userEmailError);
      }

      setShowDialog(false);
      setHasExpressedInterest(true);
      onInterested?.(message);
      
      toast({
        title: "Interest Registered",
        description: "We'll notify you of any updates about this practice",
      });
    } catch (error) {
      console.error('Error in handleInterestConfirmed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  // Create an anonymized name
  const anonymizedName = `${practice.Location} Practice (${practice.employeeCount || 'Small'} employees)`;

  return (
    <>
      <Card className="bg-black/40 backdrop-blur-md border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white">Practice Information</CardTitle>
          <Button 
            onClick={() => {
              if (!hasExpressedInterest) {
                console.log('Opening interest dialog');
                setShowDialog(true);
              }
            }}
            className={`${
              hasExpressedInterest 
                ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed' 
                : 'bg-yellow-400 hover:bg-yellow-500 text-black'
            }`}
            disabled={hasExpressedInterest}
            size="sm"
          >
            <Heart className="mr-2 h-4 w-4" />
            {hasExpressedInterest ? 'Interest Expressed' : "I'm Interested"}
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