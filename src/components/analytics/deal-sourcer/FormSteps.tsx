<lov-code>
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
    </div