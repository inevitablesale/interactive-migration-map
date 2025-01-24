import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export const DocumentSigningFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ndaChecked, setNdaChecked] = useState(false);
  const [successFeeChecked, setSuccessFeeChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentsStatus, setDocumentsStatus] = useState({
    nda_signed: false,
    success_fee_signed: false
  });

  useEffect(() => {
    checkDocumentStatus();
  }, []);

  const checkDocumentStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('user_documents')
        .select('nda_signed, success_fee_signed')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setDocumentsStatus(data);
        if (data.nda_signed && data.success_fee_signed) {
          navigate('/tracked-practices');
        }
      }
    } catch (error) {
      console.error('Error checking document status:', error);
    }
  };

  const handleSubmit = async () => {
    if (!ndaChecked || !successFeeChecked) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please agree to both documents to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session found');

      const { error } = await supabase
        .from('user_documents')
        .update({
          nda_signed: true,
          success_fee_signed: true,
          nda_signed_at: new Date().toISOString(),
          success_fee_signed_at: new Date().toISOString()
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Documents signed successfully.",
      });

      navigate('/tracked-practices');
    } catch (error) {
      console.error('Error signing documents:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign documents. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-white/90 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Document Signing Required</h2>
        <p className="text-gray-600 mb-6 text-center">
          Please review and agree to the following documents to continue:
        </p>

        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Non-Disclosure Agreement</h3>
            <ScrollArea className="h-40 mb-4 p-4 border rounded bg-gray-50">
              <div className="space-y-4">
                <p>This Non-Disclosure Agreement ("Agreement") is entered into between Canary ("Company") and you ("Recipient").</p>
                <p>1. Confidential Information includes all information shared about potential acquisition targets.</p>
                <p>2. Recipient agrees to maintain strict confidentiality of all information.</p>
                <p>3. This agreement is binding for 2 years from the date of signing.</p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="nda" 
                checked={ndaChecked}
                onCheckedChange={(checked) => setNdaChecked(checked as boolean)}
              />
              <label htmlFor="nda" className="text-sm text-gray-600">
                I have read and agree to the Non-Disclosure Agreement
              </label>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">Success Fee Terms</h3>
            <ScrollArea className="h-40 mb-4 p-4 border rounded bg-gray-50">
              <div className="space-y-4">
                <p>By agreeing to these terms, you acknowledge and accept our success fee structure:</p>
                <p>1. A success fee of 2.5% applies to the final transaction value.</p>
                <p>2. The fee is only payable upon successful completion of an acquisition.</p>
                <p>3. The fee covers all our services including deal sourcing and facilitation.</p>
              </div>
            </ScrollArea>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="successFee" 
                checked={successFeeChecked}
                onCheckedChange={(checked) => setSuccessFeeChecked(checked as boolean)}
              />
              <label htmlFor="successFee" className="text-sm text-gray-600">
                I have read and agree to the Success Fee Terms
              </label>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !ndaChecked || !successFeeChecked}
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
        </div>
      </Card>
    </div>
  );
};