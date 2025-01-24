import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Signature } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DocSign() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState({
    nda_signed: false,
    success_fee_signed: false
  });

  useEffect(() => {
    checkDocumentStatus();
  }, []);

  const checkDocumentStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data, error } = await supabase
          .from('user_documents')
          .select('nda_signed, success_fee_signed')
          .eq('user_id', session.user.id)
          .single();

        if (error) throw error;

        if (data) {
          setDocuments(data);
          if (data.success_fee_signed) {
            navigate('/tracked-practices');
          }
        }
      }
    } catch (error) {
      console.error('Error checking document status:', error);
    }
  };

  const handleSignDocument = async (documentType: 'success_fee') => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const updateData = {
        [`${documentType}_signed`]: true,
        [`${documentType}_signed_at`]: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_documents')
        .update(updateData)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setDocuments(prev => ({
        ...prev,
        [`${documentType}_signed`]: true
      }));

      toast({
        title: "Document Signed",
        description: "You have successfully signed the Success Fee Agreement.",
      });

      navigate('/tracked-practices');
    } catch (error) {
      console.error('Error signing document:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign document. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const successFeeText = `Success Fee Agreement

This Success Fee Agreement (the "Agreement") is entered into by and between Thaw.Network LLC, a Delaware limited liability company ("Intermediary"), and the undersigned party ("Client"), effective as of the date of acceptance by Client (the "Effective Date"). By utilizing Intermediary's platform and services, Client agrees to the following terms:

1. Services Provided
1.1 Platform Access: The Intermediary, through its proprietary software platform, Canary.Accountants (the "Platform"), enables the Client to discover opportunities and gather information regarding accounting practices that may not be publicly listed for sale.

1.2 Intermediary Services: Upon identification of a potential opportunity by the Client, the Intermediary will act as a facilitator by reaching out to the practice owner(s) to explore their willingness to enter into a transaction.

1.3 Success-Based Model: The Intermediary operates on a success-fee model, meaning compensation is contingent on the completion of a transaction resulting from the Client's use of the Platform or related services.

2. Success Fee Terms
2.1 Fee Amount: The Client agrees to pay the Intermediary a success fee equal to 2.5% of the total transaction value (the "Success Fee") upon the successful closing of a transaction involving any practice identified through the Intermediary's Platform or services.

2.2 Trigger for Payment:

The Success Fee shall be due and payable upon the execution of a binding purchase agreement or closing of the transaction, whichever occurs first.
A transaction is deemed "successful" when the Client or its affiliates, directly or indirectly, acquires all or part of the assets, equity, or other interests in the identified practice.
2.3 Attribution of Transactions: Any transaction initiated or facilitated by the Intermediary, or arising from the Client's use of the Platform, shall be deemed attributable to the Intermediary. This includes, but is not limited to:

Initial introductions made by the Intermediary.
Information provided through the Platform.
Follow-up communications, negotiations, or engagements initiated by the Intermediary.

3. Confidentiality and Exclusivity
3.1 Non-Disclosure: All information provided by the Intermediary regarding practices, including but not limited to owner details, financial data, and operational metrics, is confidential. The Client agrees not to disclose such information to third parties without the prior written consent of the Intermediary.

3.2 Exclusivity: The Client acknowledges that the Intermediary is the exclusive source of information and intermediary services for any practice identified through the Platform. The Success Fee remains payable regardless of whether the transaction is finalized directly with the owner or through other intermediaries.

4. Payment Terms
4.1 Timing of Payment: The Success Fee is due within 10 business days of the transaction closing or execution of a purchase agreement, whichever occurs first.

4.2 Method of Payment: Payments shall be made via wire transfer or other agreed-upon method to the account designated by the Intermediary.

4.3 Late Payments: Any overdue amounts will incur interest at the rate of 1.5% per month, or the highest rate permitted by law, whichever is lower.

5. Miscellaneous
5.1 Governing Law: This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of laws provisions.

5.2 Entire Agreement: This Agreement constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior agreements or understandings, whether written or oral.

5.3 Amendments: Any modifications to this Agreement must be made in writing and signed by both parties.

5.4 Survival: The obligations set forth in Sections 2, 3, and 5 shall survive the termination of this Agreement.

By clicking 'Accept,' the Client acknowledges and agrees to the terms outlined in this Agreement. Such action constitutes the Client's signature and binding commitment.`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Document Signing</CardTitle>
          <CardDescription className="text-center">
            Please review and sign the Success Fee Agreement to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-6 border rounded-lg bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Success Fee Agreement</h3>
                    <p className="text-sm text-gray-500">Terms of service agreement</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSignDocument('success_fee')}
                  disabled={documents.success_fee_signed || loading}
                  className="flex items-center space-x-2"
                >
                  <Signature className="h-4 w-4" />
                  <span>{documents.success_fee_signed ? 'Signed' : 'Accept'}</span>
                </Button>
              </div>
              {!documents.success_fee_signed && (
                <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                    {successFeeText}
                  </pre>
                </ScrollArea>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Please review the agreement carefully before signing
        </CardFooter>
      </Card>
    </div>
  );
}