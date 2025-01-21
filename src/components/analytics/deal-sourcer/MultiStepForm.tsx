import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  WelcomeStep,
  FirmPreferencesStep,
  PaymentTimingStep,
  PostAcquisitionStep,
  DealAttractivenessStep,
  AdditionalNotesStep,
  ReviewStep,
  FormProgress
} from "./FormSteps";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MultiStepFormProps {
  profiles?: any[];
  onSuccess?: () => void;
}

export const MultiStepForm = ({ profiles, onSuccess }: MultiStepFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    buyerType: "",
    practiceSize: "",
    services: [],
    additionalDetails: "",
    timeline: "",
    dealPreferences: [],
    preferredState: "",
    remotePreference: ""
  });
  
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your preferences.",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('deal_sourcing_forms')
        .insert([
          {
            user_id: user.user.id,
            ...formData
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your preferences have been saved.",
      });

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "Failed to save your preferences. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 7));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="space-y-6">
      <FormProgress currentStep={currentStep} totalSteps={7} />
      {currentStep === 1 && <WelcomeStep onNext={nextStep} />}
      {currentStep === 2 && (
        <FirmPreferencesStep 
          data={formData} 
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))} 
          onBack={prevStep} 
          onNext={nextStep} 
        />
      )}
      {currentStep === 3 && (
        <PaymentTimingStep 
          data={formData} 
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))} 
          onBack={prevStep} 
          onNext={nextStep} 
        />
      )}
      {currentStep === 4 && (
        <PostAcquisitionStep 
          data={formData} 
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))} 
          onBack={prevStep} 
          onNext={nextStep} 
        />
      )}
      {currentStep === 5 && (
        <DealAttractivenessStep 
          data={formData} 
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))} 
          onBack={prevStep} 
          onNext={nextStep} 
        />
      )}
      {currentStep === 6 && (
        <AdditionalNotesStep 
          data={formData} 
          onChange={(field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }))} 
          onBack={prevStep} 
          onNext={nextStep} 
        />
      )}
      {currentStep === 7 && (
        <ReviewStep 
          data={formData} 
          onBack={prevStep} 
          onSubmit={handleSubmit} 
        />
      )}
      <div className="flex justify-between">
        {currentStep > 1 && (
          <Button 
            variant="outline" 
            onClick={prevStep}
            className="border-white/10 hover:bg-white/5"
          >
            Previous
          </Button>
        )}
        
        {currentStep < 7 ? (
          <Button 
            className="ml-auto"
            onClick={nextStep}
          >
            Next
          </Button>
        ) : (
          <Button 
            className="ml-auto bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};