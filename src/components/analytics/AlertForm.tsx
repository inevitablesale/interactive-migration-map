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
  title: string;
  region: string;
  employeeCountMin: number;
  employeeCountMax: number;
  specialties: string;
  frequency: "realtime" | "daily" | "weekly";
}

export const AlertForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [employeeRange, setEmployeeRange] = useState([10, 50]);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AlertFormData>({
    defaultValues: {
      title: "",
      region: "",
      specialties: "",
      frequency: "daily"
    }
  });

  const onSubmit = async (data: AlertFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("alerts").insert({
        title: data.title,
        region: data.region,
        employee_count_min: employeeRange[0],
        employee_count_max: employeeRange[1],
        specialties: [data.specialties],
        frequency: data.frequency,
      });

      if (error) throw error;

      toast({
        title: "Alert created successfully",
        description: "You will be notified when matching opportunities are found.",
      });

      reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Alert Name</Label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Alert name is required" }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="E.g., Tax firms in California"
                className="mt-1.5"
              />
            )}
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label>Region</Label>
          <Controller
            name="region"
            control={control}
            rules={{ required: "Region is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.region && (
            <p className="text-sm text-red-500 mt-1">{errors.region.message}</p>
          )}
        </div>

        <div>
          <Label>Employee Count Range ({employeeRange[0]} - {employeeRange[1]})</Label>
          <Slider
            defaultValue={[10, 50]}
            max={200}
            min={0}
            step={5}
            value={employeeRange}
            onValueChange={setEmployeeRange}
            className="mt-3"
          />
        </div>

        <div>
          <Label>Specialties</Label>
          <Controller
            name="specialties"
            control={control}
            rules={{ required: "Specialty is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select specialties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tax">Tax</SelectItem>
                  <SelectItem value="audit">Audit</SelectItem>
                  <SelectItem value="advisory">Advisory</SelectItem>
                  <SelectItem value="payroll">Payroll</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.specialties && (
            <p className="text-sm text-red-500 mt-1">{errors.specialties.message}</p>
          )}
        </div>

        <div>
          <Label>Notification Frequency</Label>
          <Controller
            name="frequency"
            control={control}
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