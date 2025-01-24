import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function DocumentSigningFlow() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ndaChecked, setNdaChecked] = useState(false);
  const [successFeeChecked, setSuccessFeeChecked] = useState(false);

  useEffect(() => {
    const checkDocuments = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data: documents } = await supabase
        .from('user_documents')
        .select('*')
        .single();

      if (documents?.nda_signed && documents?.success_fee_signed) {
        navigate('/tracked-practices');
      }
    };

    checkDocuments();
  }, [navigate]);

  const handleSubmit = async () => {
    if (!ndaChecked || !successFeeChecked) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please agree to both documents to continue",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('user_documents')
        .update({
          nda_signed: true,
          success_fee_signed: true,
          nda_signed_at: new Date().toISOString(),
          success_fee_signed_at: new Date().toISOString(),
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Documents signed successfully",
      });

      navigate('/tracked-practices');
    } catch (error) {
      console.error('Error signing documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign documents. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/90 backdrop-blur-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">One Last Step</h1>
          <p className="text-gray-600">
            Please review and agree to the following documents to continue
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
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
                  I agree to keep all information confidential and not disclose any details about the practices.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
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
                  I understand and agree to the success fee terms and conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!ndaChecked || !successFeeChecked}
            >
              Agree & Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}