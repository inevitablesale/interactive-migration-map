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
    marketType: "",
    practiceSize: "",
    services: [] as string[],
    additionalDetails: "",
    timeline: "",
    dealPreferences: [] as string[],
  });

  const totalSteps = 6;

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a profile.",
          variant: "destructive",
        });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("buyer_profiles")
        .insert({
          user_id: user.id,
          ai_preferences: {
            buyerType: formData.buyerType,
            marketType: formData.marketType,
            practiceSize: formData.practiceSize,
            services: formData.services,
            additionalDetails: formData.additionalDetails,
            timeline: formData.timeline,
            dealPreferences: formData.dealPreferences,
          },
        })
        .select()
        .single();

      if (profileError) throw profileError;

      const { error: opportunityError } = await supabase
        .from("ai_opportunities")
        .insert({
          user_id: user.id,
          buyer_profile_id: profile.id,
          opportunity_data: {
            status: 'active',
            created_at: new Date().toISOString(),
            last_checked: new Date().toISOString(),
          },
          status: 'new',
        });

      if (opportunityError) throw opportunityError;

      toast({
        title: "Profile Created! 🎯",
        description: "We'll start finding opportunities that match your preferences.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error creating profile",
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
            onNext={handleSubmit}
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