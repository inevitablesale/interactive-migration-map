import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function DocumentSigningDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ndaChecked, setNdaChecked] = useState(false);
  const [successFeeChecked, setSuccessFeeChecked] = useState(false);

  const handleSignDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to sign documents.",
        });
        return;
      }

      const { error } = await supabase
        .from('user_documents')
        .upsert({
          user_id: user.id,
          nda_signed: ndaChecked,
          success_fee_signed: successFeeChecked,
          nda_signed_at: ndaChecked ? new Date().toISOString() : null,
          success_fee_signed_at: successFeeChecked ? new Date().toISOString() : null,
        });

      if (error) throw error;

      toast({
        title: "Documents signed successfully",
        description: "You can now access all features.",
      });

      onOpenChange(false);
      navigate("/tracked-practices");
    } catch (error) {
      console.error('Error signing documents:', error);
      toast({
        variant: "destructive",
        title: "Error signing documents",
        description: "Please try again later.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Document Signing Required</DialogTitle>
          <DialogDescription>
            Please review and sign the following documents to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="nda"
              checked={ndaChecked}
              onCheckedChange={(checked) => setNdaChecked(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="nda"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Non-Disclosure Agreement
              </label>
              <p className="text-sm text-muted-foreground">
                I agree to the terms of the Non-Disclosure Agreement
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="success-fee"
              checked={successFeeChecked}
              onCheckedChange={(checked) => setSuccessFeeChecked(checked as boolean)}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="success-fee"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Success Fee Agreement
              </label>
              <p className="text-sm text-muted-foreground">
                I agree to the terms of the Success Fee Agreement
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSignDocuments}
            disabled={!ndaChecked || !successFeeChecked}
          >
            Sign and Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}