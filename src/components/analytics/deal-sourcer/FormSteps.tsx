import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

export const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-semibold text-white">Set up your Canary</h2>
    <p className="text-white/60">
      We're here to tailor acquisition opportunities to your unique preferences. Let's get started by understanding your goals and requirements.
    </p>
    <Button onClick={onNext} className="w-full">Get Started</Button>
  </div>
);

export const FirmPreferencesStep = ({ 
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
    <h3 className="text-lg font-semibold text-white">Firm Preferences</h3>
    
    <div>
      <Label>Preferred Firm Size (Revenue)</Label>
      <Select onValueChange={(value) => onChange('revenueRange', value)} value={data.revenueRange}>
        <SelectTrigger className="mt-1.5 bg-white/5 border-white/10">
          <SelectValue placeholder="Select revenue range" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10">
          <SelectItem value="below_1m" className="text-white hover:bg-white/10">Below $1M</SelectItem>
          <SelectItem value="1m_5m" className="text-white hover:bg-white/10">$1M–$5M</SelectItem>
          <SelectItem value="5m_10m" className="text-white hover:bg-white/10">$5M–$10M</SelectItem>
          <SelectItem value="above_10m" className="text-white hover:bg-white/10">$10M+</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label>Preferred Geography</Label>
      <div className="mt-1.5 space-y-2">
        {['local', 'regional', 'national', 'remote'].map(option => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              checked={data.geography?.includes(option)}
              onCheckedChange={(checked) => {
                const current = data.geography || [];
                const updated = checked
                  ? [...current, option]
                  : current.filter((v: string) => v !== option);
                onChange('geography', updated);
              }}
            />
            <Label>{option.charAt(0).toUpperCase() + option.slice(1)}</Label>
          </div>
        ))}
      </div>
    </div>
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  </div>
);

export const PaymentTimingStep = ({
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
    <h3 className="text-lg font-semibold text-white">Payment & Timing Preferences</h3>
    
    <div>
      <Label>Payment Structures</Label>
      <div className="mt-1.5 space-y-2">
        {[
          { value: 'cash', label: 'Cash Upfront' },
          { value: 'seller_financing', label: 'Seller Financing' },
          { value: 'earnouts', label: 'Earnouts' },
          { value: 'equity_rollover', label: 'Equity Rollovers' }
        ].map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              checked={data.paymentStructures?.includes(option.value)}
              onCheckedChange={(checked) => {
                const current = data.paymentStructures || [];
                const updated = checked
                  ? [...current, option.value]
                  : current.filter((v: string) => v !== option.value);
                onChange('paymentStructures', updated);
              }}
            />
            <Label>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>

    <div>
      <Label>Complex Deal Structures</Label>
      <div className="flex items-center space-x-2 mt-1.5">
        <Checkbox
          checked={data.complexStructures}
          onCheckedChange={(checked) => onChange('complexStructures', checked)}
        />
        <Label>Open to complex deal structures</Label>
      </div>
    </div>

    <div>
      <Label>Timeline</Label>
      <Select onValueChange={(value) => onChange('timeline', value)} value={data.timeline}>
        <SelectTrigger className="mt-1.5 bg-white/5 border-white/10">
          <SelectValue placeholder="Select timeline" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-white/10">
          <SelectItem value="immediate" className="text-white hover:bg-white/10">Immediate (1-3 months)</SelectItem>
          <SelectItem value="short" className="text-white hover:bg-white/10">Short-Term (3-6 months)</SelectItem>
          <SelectItem value="long" className="text-white hover:bg-white/10">Long-Term (6+ months)</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  </div>
);

export const PostAcquisitionStep = ({
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
    <h3 className="text-lg font-semibold text-white">Post-Acquisition Goals</h3>
    
    <div>
      <Label>Goals</Label>
      <div className="mt-1.5 space-y-2">
        {[
          { value: 'retain_leadership', label: 'Retain Existing Leadership' },
          { value: 'streamline', label: 'Streamline Operations' },
          { value: 'expand', label: 'Expand Service Offerings' },
          { value: 'profitability', label: 'Increase Profitability' },
          { value: 'culture', label: 'Cultural Alignment' }
        ].map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              checked={data.postAcquisitionGoals?.includes(option.value)}
              onCheckedChange={(checked) => {
                const current = data.postAcquisitionGoals || [];
                const updated = checked
                  ? [...current, option.value]
                  : current.filter((v: string) => v !== option.value);
                onChange('postAcquisitionGoals', updated);
              }}
            />
            <Label>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>

    <div>
      <Label>Preferred Role</Label>
      <RadioGroup
        value={data.preferredRole}
        onValueChange={(value) => onChange('preferredRole', value)}
        className="mt-1.5"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="hands_on" id="hands_on" />
          <Label htmlFor="hands_on">Hands-On Operational</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advisory" id="advisory" />
          <Label htmlFor="advisory">Advisory/Strategic</Label>
        </div>
      </RadioGroup>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  </div>
);

export const DealAttractivenessStep = ({
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
    <h3 className="text-lg font-semibold text-white">Deal Attractiveness</h3>
    
    <div>
      <Label>Attractive Features</Label>
      <div className="mt-1.5 space-y-2">
        {[
          { value: 'earnings', label: 'Earnings Stability' },
          { value: 'management', label: 'Existing Management' },
          { value: 'culture', label: 'Cultural Alignment' },
          { value: 'growth', label: 'Growth Potential' },
          { value: 'technology', label: 'Technology Adoption' },
          { value: 'scalability', label: 'Scalability' }
        ].map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              checked={data.attractiveFeatures?.includes(option.value)}
              onCheckedChange={(checked) => {
                const current = data.attractiveFeatures || [];
                const updated = checked
                  ? [...current, option.value]
                  : current.filter((v: string) => v !== option.value);
                onChange('attractiveFeatures', updated);
              }}
            />
            <Label>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>

    <div>
      <Label>Specific Deal Requirements</Label>
      <Textarea
        value={data.dealRequirements}
        onChange={(e) => onChange('dealRequirements', e.target.value)}
        placeholder="E.g., Firms with $500K–$1.5M EBITDA within 6 hours of Nashville, TN"
        className="mt-1.5 bg-white/5 border-white/10"
      />
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  </div>
);

export const AdditionalNotesStep = ({
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
    <h3 className="text-lg font-semibold text-white">Additional Notes & Preferences</h3>
    
    <div>
      <Label>Team Member Emails (comma-separated)</Label>
      <Input
        value={data.team_emails}
        onChange={(e) => onChange('team_emails', e.target.value)}
        placeholder="team@example.com, analyst@example.com"
        className="mt-1.5 bg-white/5 border-white/10"
      />
      <p className="text-sm text-white/60 mt-1">Team members will receive deal alerts based on these preferences.</p>
    </div>

    <div>
      <Label>Additional Notes</Label>
      <Textarea
        value={data.additionalNotes}
        onChange={(e) => onChange('additionalNotes', e.target.value)}
        placeholder="Any additional information about your acquisition goals"
        className="mt-1.5 bg-white/5 border-white/10"
      />
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onNext}>Next</Button>
    </div>
  </div>
);

export const ReviewStep = ({
  data,
  onBack,
  onSubmit
}: {
  data: any;
  onBack: () => void;
  onSubmit: () => void;
}) => (
  <div className="space-y-6 animate-fade-in">
    <h3 className="text-lg font-semibold text-white">Review Your Preferences</h3>
    
    <div className="space-y-4 bg-white/5 p-4 rounded-lg">
      <div>
        <h4 className="font-medium text-white">Firm Size</h4>
        <p className="text-white/60">{data.revenueRange}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-white">Geography</h4>
        <p className="text-white/60">{data.geography?.join(", ")}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-white">Timeline</h4>
        <p className="text-white/60">{data.timeline}</p>
      </div>
      
      <div>
        <h4 className="font-medium text-white">Team Notifications</h4>
        <p className="text-white/60">{data.team_emails}</p>
      </div>
    </div>
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="text-black hover:text-white">Back</Button>
      <Button onClick={onSubmit}>Set up your Canary</Button>
    </div>
  </div>
);

export const FormProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="space-y-2">
    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    <p className="text-sm text-white/60 text-center">Step {currentStep} of {totalSteps}</p>
  </div>
);

export const FormSteps = ({
  currentStep,
  onStepSubmit,
  formData
}: {
  currentStep: number;
  onStepSubmit: (data: any) => void;
  formData: any;
}) => {
  const handleChange = (field: string, value: any) => {
    onStepSubmit({ [field]: value });
  };

  switch (currentStep) {
    case 1:
      return <WelcomeStep onNext={() => onStepSubmit({})} />;
    case 2:
      return (
        <FirmPreferencesStep
          data={formData}
          onChange={handleChange}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onNext={() => onStepSubmit({ step: currentStep + 1 })}
        />
      );
    case 3:
      return (
        <PaymentTimingStep
          data={formData}
          onChange={handleChange}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onNext={() => onStepSubmit({ step: currentStep + 1 })}
        />
      );
    case 4:
      return (
        <PostAcquisitionStep
          data={formData}
          onChange={handleChange}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onNext={() => onStepSubmit({ step: currentStep + 1 })}
        />
      );
    case 5:
      return (
        <DealAttractivenessStep
          data={formData}
          onChange={handleChange}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onNext={() => onStepSubmit({ step: currentStep + 1 })}
        />
      );
    case 6:
      return (
        <AdditionalNotesStep
          data={formData}
          onChange={handleChange}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onNext={() => onStepSubmit({ step: currentStep + 1 })}
        />
      );
    case 7:
      return (
        <ReviewStep
          data={formData}
          onBack={() => onStepSubmit({ step: currentStep - 1 })}
          onSubmit={() => onStepSubmit({ completed: true })}
        />
      );
    default:
      return null;
  }
};
