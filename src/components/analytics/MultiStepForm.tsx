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
          description: "You must be logged in to create a profile.",
          variant: "destructive",
        });
        return;
      }

      console.log("👤 User authenticated:", user.id);

      console.log("📊 Creating buyer profile...");
      const { data: profile, error: profileError } = await supabase
        .from("buyer_profiles")
        .insert({
          user_id: user.id,
          buyer_name: "Anonymous",
          contact_email: user.email || "anonymous@example.com",
          target_geography: ["US"],
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

      if (profileError) {
        console.error("❌ Error creating profile:", profileError);
        throw profileError;
      }

      console.log("✅ Profile created successfully:", profile);

      console.log("🎯 Creating AI opportunity...");
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

      if (opportunityError) {
        console.error("❌ Error creating opportunity:", opportunityError);
        throw opportunityError;
      }

      console.log("✅ AI opportunity created successfully");
      toast({
        title: "Profile Created! 🎯",
        description: "We'll start finding opportunities that match your preferences.",
      });

      console.log("✨ Form submission completed successfully");
      onSuccess?.();
    } catch (error) {
      console.error('❌ Error in form submission:', error);
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
