import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface AlertFormData {
  buyer_type: string;
  practice_size: string;
  services: string[];
  additional_details: string;
  timeline: string;
  deal_preferences: string[];
  preferred_state: string;
  remote_preference: string;
}

const regions = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
];

const specialtiesList = [
  { value: "tax", label: "Tax" },
  { value: "audit", label: "Audit" },
  { value: "advisory", label: "Advisory" },
  { value: "payroll", label: "Payroll" },
];

export const AlertForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AlertFormData>({
    defaultValues: {
      buyer_type: "",
      practice_size: "",
      services: [],
      additional_details: "",
      timeline: "",
      deal_preferences: [],
      preferred_state: "",
      remote_preference: "no"
    }
  });

  const onSubmit = async (data: AlertFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("alerts").insert({
        ...data,
        services: selectedSpecialties,
      });

      if (error) throw error;

      toast({
        title: "Alert created successfully",
        description: "You will be notified when matching opportunities are found.",
      });

      reset();
      setSelectedSpecialties([]);
      onSuccess?.();
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error creating alert",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSpecialtySelect = (value: string) => {
    setSelectedSpecialties(prev => {
      if (prev.includes(value)) {
        return prev.filter(v => v !== value);
      }
      return [...prev, value];
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Buyer Type</Label>
          <Controller
            name="buyer_type"
            control={control}
            rules={{ required: "Buyer type is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="E.g., Individual Buyer"
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            )}
          />
          {errors.buyer_type && (
            <p className="text-sm text-red-500 mt-1">{errors.buyer_type.message}</p>
          )}
        </div>

        <div>
          <Label>Practice Size</Label>
          <Controller
            name="practice_size"
            control={control}
            rules={{ required: "Practice size is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select practice size" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  <SelectItem value="small" className="text-white hover:bg-white/10">Small (1-5 professionals)</SelectItem>
                  <SelectItem value="medium" className="text-white hover:bg-white/10">Medium (6-20 professionals)</SelectItem>
                  <SelectItem value="large" className="text-white hover:bg-white/10">Large (21+ professionals)</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label>Region</Label>
          <Controller
            name="preferred_state"
            control={control}
            rules={{ required: "Region is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/10">
                  {regions.map(region => (
                    <SelectItem 
                      key={region.value} 
                      value={region.value}
                      className="text-white hover:bg-white/10"
                    >
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <Label>Timeline</Label>
          <Controller
            name="timeline"
            control={control}
            render={({ field }) => (
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue="daily"
                className="mt-1.5"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Immediate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="within_6_months" id="within_6_months" />
                  <Label htmlFor="within_6_months">Within 6 months</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="6_12_months" id="6_12_months" />
                  <Label htmlFor="6_12_months">6-12 months</Label>
                </div>
              </RadioGroup>
            )}
          />
        </div>

        <div>
          <Label>Additional Details</Label>
          <Controller
            name="additional_details"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Any additional requirements or preferences"
                className="mt-1.5 bg-white/5 border-white/10 text-white"
              />
            )}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Alert...
          </>
        ) : (
          "Create Alert"
        )}
      </Button>
    </form>
  );
};
