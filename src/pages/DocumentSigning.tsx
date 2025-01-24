import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

export default function DocumentSigning() {
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
        navigate("/auth");
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
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Document Signing Required</h1>
          <p className="text-gray-600">
            Please review and sign the following documents to continue.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
            <Checkbox
              id="nda"
              checked={ndaChecked}
              onCheckedChange={(checked) => setNdaChecked(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <label
                htmlFor="nda"
                className="text-lg font-medium"
              >
                Non-Disclosure Agreement
              </label>
              <p className="text-sm text-muted-foreground">
                I have read and agree to the terms of the Non-Disclosure Agreement
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg">
            <Checkbox
              id="success-fee"
              checked={successFeeChecked}
              onCheckedChange={(checked) => setSuccessFeeChecked(checked as boolean)}
              className="mt-1"
            />
            <div className="grid gap-1.5">
              <label
                htmlFor="success-fee"
                className="text-lg font-medium"
              >
                Success Fee Agreement
              </label>
              <p className="text-sm text-muted-foreground">
                I have read and agree to the terms of the Success Fee Agreement
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            onClick={handleSignDocuments}
            disabled={!ndaChecked || !successFeeChecked}
          >
            Sign and Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}