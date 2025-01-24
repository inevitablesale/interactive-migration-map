import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DocumentSigningDialog } from "./DocumentSigningDialog";

export function DocumentSigningCheck({ children }: { children: React.ReactNode }) {
  const [showDialog, setShowDialog] = useState(false);
  const [checkComplete, setCheckComplete] = useState(false);

  useEffect(() => {
    const checkDocuments = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: documents } = await supabase
            .from('user_documents')
            .select('nda_signed, success_fee_signed')
            .eq('user_id', user.id)
            .single();

          if (!documents?.nda_signed || !documents?.success_fee_signed) {
            setShowDialog(true);
          }
        }
        setCheckComplete(true);
      } catch (error) {
        console.error('Error checking documents:', error);
        setCheckComplete(true);
      }
    };

    checkDocuments();
  }, []);

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