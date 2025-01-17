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
      <Users className="w-5 h-5 text-accent" />
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
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">
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

    <div className="grid gap-6">
      <div>
        <Label className="text-white mb-2">Market Type</Label>
        <Select onValueChange={(value) => onChange('marketType', value)} value={data.marketType}>
          <SelectTrigger className="bg-white/5 border-white/10">
            <SelectValue placeholder="Select market type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-white/10">
            <SelectItem value="metro" className="text-white hover:bg-white/10">Major Metropolitan Areas</SelectItem>
            <SelectItem value="mid" className="text-white hover:bg-white/10">Mid-sized Cities</SelectItem>
            <SelectItem value="suburban" className="text-white hover:bg-white/10">Suburban Markets</SelectItem>
            <SelectItem value="rural" className="text-white hover:bg-white/10">Rural Communities</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
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
      <Building2 className="w-5 h-5 text-accent" />
      <h3 className="text-lg font-semibold text-white">Practice Size</h3>
    </div>

    <p className="text-sm text-white/60 mb-4">
      Size affects transition complexity and management needs
    </p>
    
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
      ].map(size => (
        <div key={size.value} className="flex items-center space-x-2">
          <RadioGroupItem value={size.value} id={size.value} />
          <Label htmlFor={size.value} className="text-white">{size.label}</Label>
        </div>
      ))}
    </RadioGroup>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
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
        { value: 'tax', label: 'Tax Services', icon: Calculator },
        { value: 'accounting', label: 'Accounting & Bookkeeping', icon: FileText },
        { value: 'audit', label: 'Audit & Assurance', icon: CheckSquare },
        { value: 'advisory', label: 'Advisory Services', icon: Lightbulb },
        { value: 'specialty', label: 'Specialty Services', icon: Brain }
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
            <service.icon className="w-4 h-4 text-accent" />
            <span className="text-white">{service.label}</span>
          </div>
        </Card>
      ))}
    </div>

    <div className="mt-6">
      <Label className="text-white">Additional Details</Label>
      <Textarea
        value={data.practiceDescription}
        onChange={(e) => onChange('practiceDescription', e.target.value)}
        placeholder="Describe your ideal practice acquisition, including any specific services, industries, or other important factors you're looking for."
        className="mt-2 bg-white/5 border-white/10 text-white"
      />
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
    </div>
  </div>
);

export const TimelineStep = ({
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
    </div>

    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack} className="border-white/10 hover:bg-white/5">Back</Button>
      <Button onClick={onNext} className="bg-accent hover:bg-accent/90">Next</Button>
    </div>
  </div>
);

export const FormProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="space-y-2">
    <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
    <p className="text-sm text-white/60 text-center">Step {currentStep} of {totalSteps}</p>
  </div>
);