import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormSteps } from "./FormSteps";
import { supabase } from "@/integrations/supabase/client";

interface MultiStepFormProps {
  onSuccess?: () => void;
}

export function MultiStepForm({ onSuccess }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    buyerType: "",
    practiceSize: "",
    serviceLines: [],
    dealPreferences: [],
    remotePreference: "",
    additionalDetails: "",
    timeline: ""
  });

  const handleStepSubmit = async (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { error: updateError } = await supabase
          .from('buyer_profiles')
          .update({
            ai_preferences: formData
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
        
        onSuccess?.();

      } catch (error) {
        console.error('Error saving form data:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <FormSteps 
        currentStep={currentStep} 
        onStepSubmit={handleStepSubmit}
        formData={formData}
      />
      
      {currentStep > 1 && (
        <Button
          variant="outline"
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        >
          Previous Step
        </Button>
      )}
    </div>
  );
}