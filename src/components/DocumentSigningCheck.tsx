import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DocumentSigningDialog } from "./DocumentSigningDialog";

export function DocumentSigningCheck({ children }: { children: React.ReactNode }) {
  const [showDialog, setShowDialog] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Checking documents for user:", user?.id);
        
        if (user) {
          const { data: documents, error } = await supabase
            .from('user_documents')
            .select('nda_signed, success_fee_signed')
            .eq('user_id', user.id)
            .maybeSingle();

          console.log("Documents check result:", documents, error);

          if (!documents || !documents.nda_signed || !documents.success_fee_signed) {
            console.log("Documents need to be signed");
            setShowDialog(true);
          } else {
            console.log("Documents already signed, navigating to tracked practices");
            navigate("/tracked-practices");
          }
        }
        setCheckComplete(true);
      } catch (error) {
        console.error('Error checking documents:', error);
        setCheckComplete(true);
      }
    };

    checkDocuments();
  }, [navigate]);

  if (!checkComplete) {
    return null;
  }

  return (
    <>
      {children}
      <DocumentSigningDialog 
        open={showDialog} 
        onOpenChange={setShowDialog} 
      />
    </>
  );
}