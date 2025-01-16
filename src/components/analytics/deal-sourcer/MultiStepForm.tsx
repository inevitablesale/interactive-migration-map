import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

export const MultiStepForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    buyer_name: "",
    contact_email: "",
    team_emails: "",
    revenueRange: "",
    geography: [] as string[],
    dealTypes: [] as string[],
    paymentStructures: [] as string[],
    complexStructures: false,
    timeline: "",
    postAcquisitionGoals: [] as string[],
    preferredRole: "",
    attractiveFeatures: [] as string[],
    dealRequirements: "",
    additionalNotes: "",
    alertFrequency: "daily" as "realtime" | "daily" | "weekly",
  });

  const totalSteps = 7;

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
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create a profile.",
          variant: "destructive",
        });
        return;
      }

      // First create the buyer profile with user_id
      const { data: profile, error: profileError } = await supabase
        .from("buyer_profiles")
        .insert({
          user_id: user.id, // Add the user_id here
          buyer_name: formData.buyer_name,
          contact_email: formData.contact_email,
          target_geography: formData.geography,
          ai_preferences: {
            timeline: formData.timeline,
            dealTypes: formData.dealTypes,
            preferredRole: formData.preferredRole,
            dealRequirements: formData.dealRequirements,
            complexStructures: formData.complexStructures,
            paymentStructures: formData.paymentStructures,
            attractiveFeatures: formData.attractiveFeatures,
            postAcquisitionGoals: formData.postAcquisitionGoals,
            additionalNotes: formData.additionalNotes,
            team_emails: formData.team_emails?.split(',').map(email => email.trim()).filter(Boolean) || [],
          },
          alert_frequency: formData.alertFrequency,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create an initial AI opportunity for tracking
      const { error: opportunityError } = await supabase
        .from("ai_opportunities")
        .insert({
          user_id: user.id, // Add the user_id here as well
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
      navigate("/thank-you");
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
          <FirmPreferencesStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PaymentTimingStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <PostAcquisitionStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <DealAttractivenessStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 5:
        return (
          <AdditionalNotesStep
            data={formData}
            onChange={handleFieldChange}
            onBack={handleBack}
            onNext={handleNext}
          />
        );
      case 6:
        return (
          <ReviewStep
            data={formData}
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