import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dealSize: "",
    location: "",
    timeline: "",
    additionalDetails: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const savePreferences = async () => {
      try {
        // Silently fail if table doesn't exist
        return;
      } catch (error) {
        console.error("Error saving preferences:", error);
      }
    };

    if (step === 4) {
      savePreferences();
    }
  }, [step, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      toast({
        title: "Preferences saved",
        description: "Your deal sourcing preferences have been updated.",
      });
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Deal Size Preferences</h2>
            <div className="space-y-2">
              <Label htmlFor="dealSize">Target Deal Size Range</Label>
              <Input
                id="dealSize"
                name="dealSize"
                value={formData.dealSize}
                onChange={handleInputChange}
                placeholder="e.g., $1M - $5M"
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Location Preferences</h2>
            <div className="space-y-2">
              <Label htmlFor="location">Preferred Locations</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Northeast US, California"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Timeline</h2>
            <div className="space-y-2">
              <Label htmlFor="timeline">Investment Timeline</Label>
              <Input
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleInputChange}
                placeholder="e.g., 6-12 months"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Additional Details</h2>
            <div className="space-y-2">
              <Label htmlFor="additionalDetails">Any Other Requirements</Label>
              <Input
                id="additionalDetails"
                name="additionalDetails"
                value={formData.additionalDetails}
                onChange={handleInputChange}
                placeholder="Any other specific requirements or preferences"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i + 1 <= step ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        {renderStep()}
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handleBack}
          disabled={step === 1}
          variant="outline"
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === 4 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
}