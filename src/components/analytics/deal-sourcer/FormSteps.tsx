import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Users, MapPin, Target, Clock, Calculator, FileText, CheckSquare, Lightbulb, DollarSign, Brain, HandshakeIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-semibold text-white">Set up your Canary</h2>
    <p className="text-white/60">
      We'll help you find the right opportunities based on your preferences.
    </p>
    <Button onClick={onNext} className="w-full bg-accent hover:bg-accent/90">Get Started</Button>
  </div>
);

export const BuyerTypeStep = ({ 
  data,
  onChange,
  onBack,
  onNext 
}: { 
  data: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <Building2 className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Buyer Type</h3>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        {
          value: 'individual',
          icon: Users,
          title: 'Individual Buyer',
          description: 'Looking to own and run your own practice'
        },
        {
          value: 'financial',
          icon: DollarSign,
          title: 'Financial Buyer',
          description: 'Representing an investment group or PE firm'
        },
        {
          value: 'strategic',
          icon: Target,
          title: 'Strategic Buyer',
          description: 'Looking to expand existing business'
        },
        {
          value: 'industry',
          icon: Building2,
          title: 'Industry Buyer',
          description: 'Accounting firm looking to acquire competitors'
        }
      ].map(option => (
        <Card 
          key={option.value}
          className={`p-4 cursor-pointer transition-all ${
            data.buyerType === option.value 
              ? 'bg-accent/20 border-accent' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => onChange('buyerType', option.value)}
        >
          <div className="flex items-center gap-3 mb-2">
            <option.icon className="w-5 h-5 text-accent" />
            <div className="font-medium text-white">{option.title}</div>
          </div>
          <p className="text-sm text-white/60">{option.description}</p>
        </Card>
      ))}
    </div>

    <div className="flex justify-between mt-8">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5 text-black">
        Back
      </Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">
        Next
      </Button>
    </div>
  </div>
);

export const LocationStep = ({
  data,
  onChange,
  onBack,
  onNext
}: {
  data: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <MapPin className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Location Preferences</h3>
    </div>

    <div className="space-y-6">
      <div>
        <Label className="text-white mb-2">State Preference</Label>
        <Select
          value={data.preferredState || ''}
          onValueChange={(value) => onChange('preferredState', value)}
        >
          <SelectTrigger className="h-12 bg-black/60 border-white/10 text-white">
            <SelectValue placeholder="Select preferred state" />
          </SelectTrigger>
          <SelectContent className="bg-black/95 border-white/10">
            <SelectItem value="any" className="text-white">Any State</SelectItem>
            {[
              "California", "New York", "Texas", "Florida", "Illinois",
              "Pennsylvania", "Ohio", "Michigan", "Georgia", "North Carolina",
            ].map(state => (
              <SelectItem key={state} value={state} className="text-white">
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white mb-2">Remote Practice Consideration</Label>
        <RadioGroup
          value={data.remotePreference || 'no'}
          onValueChange={(value) => onChange('remotePreference', value)}
          className="grid gap-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="remote-yes" />
            <Label htmlFor="remote-yes" className="text-white">
              Open to remote practice opportunities
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="remote-no" />
            <Label htmlFor="remote-no" className="text-white">
              Prefer traditional in-person practice
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hybrid" id="remote-hybrid" />
            <Label htmlFor="remote-hybrid" className="text-white">
              Interested in hybrid model
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5 text-black">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
    </div>
  </div>
);

export const PracticeSizeStep = ({
  data,
  onChange,
  onBack,
  onNext
}: {
  data: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Practice Size</h3>
    </div>

    <p className="text-white/60 mb-4">Size affects transition complexity and management needs</p>

    <RadioGroup
      value={data.practiceSize}
      onValueChange={(value) => onChange('practiceSize', value)}
      className="grid gap-4"
    >
      {[
        { value: 'small', label: 'Small (1-5 professionals)' },
        { value: 'growing', label: 'Growing (6-15 professionals)' },
        { value: 'established', label: 'Established (16-30 professionals)' },
        { value: 'large', label: 'Large (31+ professionals)' }
      ].map(option => (
        <Card 
          key={option.value}
          className={`p-4 cursor-pointer transition-all ${
            data.practiceSize === option.value 
              ? 'bg-accent/20 border-accent' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => onChange('practiceSize', option.value)}
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value} className="text-white">{option.label}</Label>
          </div>
        </Card>
      ))}
    </RadioGroup>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5 text-black">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
    </div>
  </div>
);

export const PracticeFocusStep = ({
  data,
  onChange,
  onBack,
  onNext
}: {
  data: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <div className="space-y-6 animate-fade-in">
    <div className="flex items-center gap-2 mb-4">
      <Target className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Practice Focus</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { value: 'tax', label: 'Tax Services' },
        { value: 'accounting', label: 'Accounting & Bookkeeping' },
        { value: 'audit', label: 'Audit & Assurance' },
        { value: 'advisory', label: 'Advisory Services' },
        { value: 'specialty', label: 'Specialty Services' }
      ].map(service => (
        <Card
          key={service.value}
          className={`p-4 cursor-pointer transition-all ${
            data.services?.includes(service.value)
              ? 'bg-accent/20 border-accent'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => {
            const current = data.services || [];
            const updated = current.includes(service.value)
              ? current.filter((v: string) => v !== service.value)
              : [...current, service.value];
            onChange('services', updated);
          }}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              checked={data.services?.includes(service.value)}
              className="border-white/10"
            />
            <span className="text-white">{service.label}</span>
          </div>
        </Card>
      ))}
    </div>

    <div>
      <Label className="text-white">Additional Details</Label>
      <Textarea
        placeholder="Describe your ideal practice acquisition, including any specific services, industries, or other important factors you're looking for..."
        value={data.additionalDetails}
        onChange={(e) => onChange('additionalDetails', e.target.value)}
        className="mt-2 bg-white/5 border-white/10 text-white"
      />
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5 text-black">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
    </div>
  </div>
);

export const TimelineAndDealStep = ({
  data,
  onChange,
  onBack,
  onNext
}: {
  data: any;
  onChange: (field: string, value: any) => void;
  onBack: () => void;
  onNext: () => void;
}) => {
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);

  const testGeminiConnection = async () => {
    setTesting(true);
    try {
      const { data: matchData, error: matchError } = await supabase.functions.invoke('match-deals', {
        body: {
          buyerProfile: {
            id: '123', // This is just for testing
            preferences: data
          },
          firms: [] // Empty array for testing
        }
      });

      if (matchError) {
        console.error('Match-deals error:', matchError);
        throw new Error('Failed to test match-deals function');
      }

      console.log('Match-deals response:', matchData);

      const { data: geminiResponse, error: geminiError } = await supabase.functions.invoke('test-gemini');
      
      if (geminiError) throw geminiError;
      
      console.log('Gemini test response:', geminiResponse);
      
      toast({
        title: "Connection Successful",
        description: "Successfully tested both match-deals and Gemini API",
      });
    } catch (error) {
      console.error('Test error:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to test connections",
        variant: "destructive",
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold text-white">Timeline & Deal Structure</h3>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-white mb-2">Timeline</Label>
          <RadioGroup
            value={data.timeline}
            onValueChange={(value) => onChange('timeline', value)}
            className="grid gap-3"
          >
            {[
              { value: 'immediate', label: 'Immediate (1-3 months)' },
              { value: 'short', label: 'Short-term (3-6 months)' },
              { value: 'medium', label: 'Medium-term (6-12 months)' },
              { value: 'long', label: 'Long-term planning (12+ months)' }
            ].map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="text-white">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div>
          <Label className="text-white mb-2">Deal Preferences</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'cash', label: 'Cash Purchase', icon: DollarSign },
              { value: 'seller_financing', label: 'Seller Financing', icon: Calculator },
              { value: 'gradual', label: 'Gradual Transition', icon: Clock },
              { value: 'partnership', label: 'Partnership/Merger', icon: HandshakeIcon }
            ].map(option => (
              <Card
                key={option.value}
                className={`p-4 cursor-pointer transition-all ${
                  data.dealPreferences?.includes(option.value)
                    ? 'bg-accent/20 border-accent'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
                onClick={() => {
                  const current = data.dealPreferences || [];
                  const updated = current.includes(option.value)
                    ? current.filter((v: string) => v !== option.value)
                    : [...current, option.value];
                  onChange('dealPreferences', updated);
                }}
              >
                <div className="flex items-center gap-2">
                  <option.icon className="w-4 h-4 text-accent" />
                  <span className="text-white">{option.label}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={testGeminiConnection}
            disabled={testing}
          >
            {testing ? (
              <>Testing Connections...</>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Test Connections
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5 text-black">Back</Button>
        <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Complete</Button>
      </div>
    </div>
  );
};

export const FormProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="space-y-2">
    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    <p className="text-sm text-white/60 text-center">Step {currentStep} of {totalSteps}</p>
  </div>
);

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
    preferredState: "",
    remotePreference: "no",
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

      // Create profile with all required fields
      const { data: profile, error: profileError } = await supabase
        .from("buyer_profiles")
        .insert({
          user_id: user.id,
          buyer_name: "Anonymous", // Required field with default value
          contact_email: user.email || "anonymous@example.com", // Required field with default value
          target_geography: formData.preferredState ? [formData.preferredState] : ["US"], // Required field with default value
          remote_preference: formData.remotePreference,
          buyer_type: formData.buyerType,
          employee_count_min: formData.practiceSize === 'small' ? 1 : 
                            formData.practiceSize === 'growing' ? 6 :
                            formData.practiceSize === 'established' ? 16 : 31,
          employee_count_max: formData.practiceSize === 'small' ? 5 : 
                            formData.practiceSize === 'growing' ? 15 :
                            formData.practiceSize === 'established' ? 30 : 999999,
          service_lines: formData.services || [],
          ai_preferences: {
            timeline: formData.timeline,
            buyerType: formData.buyerType,
            practiceSize: formData.practiceSize,
            services: formData.services,
            additionalDetails: formData.additionalDetails,
            remotePreference: formData.remotePreference,
            dealPreferences: formData.dealPreferences
          }
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
