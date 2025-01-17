import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Building2, Users, MapPin, Target, Clock, Calculator, FileText, CheckSquare, Lightbulb, DollarSign, Brain, HandshakeIcon } from "lucide-react";

export const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="space-y-6 animate-fade-in">
    <h2 className="text-2xl font-semibold text-white">Set up your Canary</h2>
    <p className="text-white/60">
      We'll help you find the right opportunities based on your preferences.
    </p>
    <Button onClick={onNext} className="w-full bg-accent hover:bg-accent/90">Get Started</Button>
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
    <div className="flex items-center gap-2 mb-4">
      <Building2 className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Firm Preferences</h3>
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
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">
        Back
      </Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">
        Next
      </Button>
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
    <div className="flex items-center gap-2 mb-4">
      <Clock className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Timeline & Payment Structure</h3>
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
        <Label className="text-white mb-2">Payment Preferences</Label>
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
                data.paymentStructures?.includes(option.value)
                  ? 'bg-accent/20 border-accent'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => {
                const current = data.paymentStructures || [];
                const updated = current.includes(option.value)
                  ? current.filter((v: string) => v !== option.value)
                  : [...current, option.value];
                onChange('paymentStructures', updated);
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
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
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
    <div className="flex items-center gap-2 mb-4">
      <Target className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Post-Acquisition Goals</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { value: 'growth', label: 'Expand Services', icon: Target },
        { value: 'efficiency', label: 'Improve Efficiency', icon: Lightbulb },
        { value: 'modernize', label: 'Modernize Technology', icon: Brain },
        { value: 'retain', label: 'Retain Key Staff', icon: Users }
      ].map(goal => (
        <Card
          key={goal.value}
          className={`p-4 cursor-pointer transition-all ${
            data.postAcquisitionGoals?.includes(goal.value)
              ? 'bg-accent/20 border-accent'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => {
            const current = data.postAcquisitionGoals || [];
            const updated = current.includes(goal.value)
              ? current.filter((v: string) => v !== goal.value)
              : [...current, goal.value];
            onChange('postAcquisitionGoals', updated);
          }}
        >
          <div className="flex items-center gap-2">
            <goal.icon className="w-4 h-4 text-accent" />
            <span className="text-white">{goal.label}</span>
          </div>
        </Card>
      ))}
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
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
    <div className="flex items-center gap-2 mb-4">
      <Target className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Deal Attractiveness</h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[
        { value: 'recurring', label: 'Recurring Revenue', icon: DollarSign },
        { value: 'growth', label: 'Growth Potential', icon: Target },
        { value: 'tech', label: 'Modern Technology', icon: Brain },
        { value: 'team', label: 'Strong Team', icon: Users },
        { value: 'processes', label: 'Efficient Processes', icon: CheckSquare }
      ].map(feature => (
        <Card
          key={feature.value}
          className={`p-4 cursor-pointer transition-all ${
            data.attractiveFeatures?.includes(feature.value)
              ? 'bg-accent/20 border-accent'
              : 'bg-white/5 border-white/10 hover:bg-white/10'
          }`}
          onClick={() => {
            const current = data.attractiveFeatures || [];
            const updated = current.includes(feature.value)
              ? current.filter((v: string) => v !== feature.value)
              : [...current, feature.value];
            onChange('attractiveFeatures', updated);
          }}
        >
          <div className="flex items-center gap-2">
            <feature.icon className="w-4 h-4 text-accent" />
            <span className="text-white">{feature.label}</span>
          </div>
        </Card>
      ))}
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
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
    <div className="flex items-center gap-2 mb-4">
      <FileText className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Additional Information</h3>
    </div>

    <div className="space-y-4">
      <div>
        <Label className="text-white">Contact Information</Label>
        <Input
          placeholder="Your name"
          value={data.buyer_name}
          onChange={(e) => onChange('buyer_name', e.target.value)}
          className="mt-2 bg-white/5 border-white/10 text-white"
        />
      </div>

      <div>
        <Label className="text-white">Email</Label>
        <Input
          type="email"
          placeholder="Contact email"
          value={data.contact_email}
          onChange={(e) => onChange('contact_email', e.target.value)}
          className="mt-2 bg-white/5 border-white/10 text-white"
        />
      </div>

      <div>
        <Label className="text-white">Team Emails (comma-separated)</Label>
        <Input
          placeholder="team@example.com, advisor@example.com"
          value={data.team_emails}
          onChange={(e) => onChange('team_emails', e.target.value)}
          className="mt-2 bg-white/5 border-white/10 text-white"
        />
      </div>

      <div>
        <Label className="text-white">Alert Frequency</Label>
        <Select 
          value={data.alertFrequency} 
          onValueChange={(value) => onChange('alertFrequency', value)}
        >
          <SelectTrigger className="mt-2 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="realtime">Real-time</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-white">Additional Notes</Label>
        <Textarea
          placeholder="Any other important details or preferences..."
          value={data.additionalNotes}
          onChange={(e) => onChange('additionalNotes', e.target.value)}
          className="mt-2 bg-white/5 border-white/10 text-white"
        />
      </div>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
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
    <div className="flex items-center gap-2 mb-4">
      <CheckSquare className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Review Your Preferences</h3>
    </div>

    <div className="space-y-4">
      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="font-medium text-white mb-2">Contact Information</h4>
        <div className="space-y-1 text-sm text-white/60">
          <p>Name: {data.buyer_name}</p>
          <p>Email: {data.contact_email}</p>
          <p>Team Emails: {data.team_emails}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="font-medium text-white mb-2">Deal Preferences</h4>
        <div className="space-y-1 text-sm text-white/60">
          <p>Timeline: {data.timeline}</p>
          <p>Payment Structures: {data.paymentStructures?.join(', ')}</p>
          <p>Post-Acquisition Goals: {data.postAcquisitionGoals?.join(', ')}</p>
        </div>
      </Card>

      <Card className="p-4 bg-white/5 border-white/10">
        <h4 className="font-medium text-white mb-2">Alert Settings</h4>
        <div className="space-y-1 text-sm text-white/60">
          <p>Frequency: {data.alertFrequency}</p>
          <p>Additional Notes: {data.additionalNotes}</p>
        </div>
      </Card>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">
        Back
      </Button>
      <Button onClick={onSubmit} className="bg-accent hover:bg-accent/90">
        Submit
      </Button>
    </div>
  </div>
);

export const FormProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="space-y-2">
    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    <p className="text-sm text-white/60 text-center">Step {currentStep} of {totalSteps}</p>
  </div>
);