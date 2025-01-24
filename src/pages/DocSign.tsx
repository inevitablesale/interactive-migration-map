import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Signature } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
        setDocuments(data);
        if (data.success_fee_signed) {
          navigate('/tracked-practices');
        }
      }
    } catch (error) {
      console.error('Error checking document status:', error);
    }
  };

  const handleSignDocument = async (documentType: 'nda' | 'success_fee') => {
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
        description: `You have successfully signed the ${documentType === 'nda' ? 'NDA' : 'Success Fee Agreement'}.`,
      });

      // If both documents are signed, redirect to tracked practices
      if (documentType === 'success_fee' || (documentType === 'nda' && documents.success_fee_signed)) {
        navigate('/tracked-practices');
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Document Signing</CardTitle>
          <CardDescription className="text-center">
            Please review and sign the following documents to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Non-Disclosure Agreement</h3>
                    <p className="text-sm text-gray-500">Protect confidential information</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSignDocument('nda')}
                  disabled={documents.nda_signed || loading}
                  className="flex items-center space-x-2"
                >
                  <Signature className="h-4 w-4" />
                  <span>{documents.nda_signed ? 'Signed' : 'Sign NDA'}</span>
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <File className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Success Fee Agreement</h3>
                    <p className="text-sm text-gray-500">Terms of service agreement</p>
                  </div>
                </div>
                <Button
                  onClick={() => handleSignDocument('success_fee')}
                  disabled={!documents.nda_signed || documents.success_fee_signed || loading}
                  className="flex items-center space-x-2"
                >
                  <Signature className="h-4 w-4" />
                  <span>{documents.success_fee_signed ? 'Signed' : 'Sign Agreement'}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-gray-500">
          Please sign the NDA first, followed by the Success Fee Agreement
        </CardFooter>
      </Card>
    </div>
  );
}