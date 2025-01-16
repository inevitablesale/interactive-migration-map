import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIDealSourcerFormData {
  revenueRange: string;
  geography: string[];
  dealTypes: string[];
  paymentStructures: string[];
  complexStructures: boolean;
  timeline: string;
  postAcquisitionGoals: string[];
  preferredRole: string;
  attractiveFeatures: string[];
  dealRequirements: string;
  additionalNotes: string;
  alertFrequency: "realtime" | "daily" | "weekly";
}

const revenueRanges = [
  { value: "below_1m", label: "Below $1M" },
  { value: "1m_5m", label: "1M - $5M" },
  { value: "5m_10m", label: "$5M - $10M" },
  { value: "above_10m", label: "Above $10M" },
];

const geographyOptions = [
  { value: "local", label: "Local" },
  { value: "regional", label: "Regional" },
  { value: "national", label: "National" },
  { value: "remote", label: "Digital/Remote" },
];

const dealTypeOptions = [
  { value: "minority", label: "Minority Stake" },
  { value: "majority", label: "Majority Stake" },
  { value: "full", label: "Full Buyout" },
  { value: "strategic", label: "Strategic Partnership" },
  { value: "franchise", label: "Potential Franchisee" },
];

export const AIDealSourcerForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<AIDealSourcerFormData>();

  const onSubmit = async (data: AIDealSourcerFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("buyer_profiles").insert({
        deal_preferences: {
          revenueRange: data.revenueRange,
          geography: data.geography,
          dealTypes: data.dealTypes,
          paymentStructures: data.paymentStructures,
        },
        ai_preferences: {
          complexStructures: data.complexStructures,
          timeline: data.timeline,
          postAcquisitionGoals: data.postAcquisitionGoals,
          preferredRole: data.preferredRole,
          attractiveFeatures: data.attractiveFeatures,
          dealRequirements: data.dealRequirements,
          additionalNotes: data.additionalNotes,
        },
        alert_frequency: data.alertFrequency,
      });

      if (error) throw error;

      toast({
        title: "AI Deal Profile Created",
        description: "You'll start receiving personalized opportunities soon.",
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error creating AI deal profile:', error);
      toast({
        title: "Error creating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label>Revenue Range</Label>
            <Controller
              name="revenueRange"
              control={control}
              rules={{ required: "Revenue range is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1.5 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    {revenueRanges.map(range => (
                      <SelectItem 
                        key={range.value} 
                        value={range.value}
                        className="text-white hover:bg-white/10"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Geography</Label>
            <div className="mt-1.5 space-y-2">
              {geographyOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Controller
                    name="geography"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const updated = checked
                            ? [...current, option.value]
                            : current.filter(v => v !== option.value);
                          field.onChange(updated);
                        }}
                      />
                    )}
                  />
                  <Label>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Deal Types</Label>
            <div className="mt-1.5 space-y-2">
              {dealTypeOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Controller
                    name="dealTypes"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          const updated = checked
                            ? [...current, option.value]
                            : current.filter(v => v !== option.value);
                          field.onChange(updated);
                        }}
                      />
                    )}
                  />
                  <Label>{option.label}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Alert Frequency</Label>
            <Controller
              name="alertFrequency"
              control={control}
              defaultValue="daily"
              render={({ field }) => (
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue="daily"
                  className="mt-1.5"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="realtime" id="realtime" />
                    <Label htmlFor="realtime">Real-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily Digest</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly Summary</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>

          <div>
            <Label>Additional Requirements</Label>
            <Controller
              name="dealRequirements"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Any specific requirements or criteria"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
        {loading ? "Creating Profile..." : "Create AI Deal Profile"}
      </Button>
    </form>
  );
};