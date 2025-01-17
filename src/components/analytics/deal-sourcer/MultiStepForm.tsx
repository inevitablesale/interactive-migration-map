import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  WelcomeStep,
  BuyerTypeStep,
  LocationStep,
  PracticeSizeStep,
  PracticeFocusStep,
  TimelineAndDealStep,
  FormProgress
} from "./FormSteps";

export const MultiStepForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    buyerType: "",
    practiceSize: "",
    services: [] as string[],
    additionalDetails: "",
    timeline: "",
    dealPreferences: [] as string[],
    preferredState: "",
    remotePreference: "",
  });

  const totalSteps = 6;

  const handleFieldChange = (field: string, value: any) => {
    console.log(`Updating field: ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    console.log(`Moving to next step: ${currentStep + 1}`);
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    console.log(`Moving back to step: ${currentStep - 1}`);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    console.log("🚀 Starting form submission process");
    console.log("📝 Form data being submitted:", formData);

    try {
      console.log("🔍 Checking for authenticated user...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("❌ Error getting user:", userError);
        throw userError;
      }
      
      if (!user) {
        console.log("❌ No authenticated user found");
        toast({
          title: "Error",
          description: "You must be logged in to submit the form.",
          variant: "destructive",
        });
        return;
      }

      console.log("👤 User authenticated:", user.id);

      // Save to deal_sourcing_forms table
      console.log("📊 Creating deal sourcing form...");
      const { error: formError } = await supabase
        .from("deal_sourcing_forms")
        .insert({
          user_id: user.id,
          buyer_type: formData.buyerType,
          practice_size: formData.practiceSize,
          services: formData.services,
          additional_details: formData.additionalDetails,
          timeline: formData.timeline,
          deal_preferences: formData.dealPreferences,
          preferred_state: formData.preferredState,
          remote_preference: formData.remotePreference,
        });

      if (formError) {
        console.error("❌ Error creating form:", formError);
        throw formError;
      }

      console.log("✅ Form submission completed successfully");
      toast({
        title: "Success! 🎯",
        description: "Your preferences have been saved.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      toast({
        title: "Error saving form",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <WelcomeStep onNext={handleNext} />;
      case 1:
        return (
          <BuyerTypeStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <LocationStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <PracticeSizeStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <PracticeFocusStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <TimelineAndDealStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <FormProgress currentStep={currentStep + 1} totalSteps={totalSteps} />
      {renderStep()}
    </div>
  );
};