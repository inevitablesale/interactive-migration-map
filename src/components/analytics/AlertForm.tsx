import { useState } from "react";
import { useForm } from "react-hook-form";
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

  const { register, handleSubmit, reset } = useForm<AlertFormData>();

  const onSubmit = async (data: AlertFormData) => {
    setLoading(true);
    try {
      const { error } = await supabase.from("alerts").insert({
        title: data.title,
        region: data.region,
        employee_count_min: employeeRange[0],
        employee_count_max: employeeRange[1],
        specialties: [data.specialties], // Convert single specialty to array
        frequency: data.frequency,
      });

      if (error) throw error;

      toast({
        title: "Alert created",
        description: "You will be notified when matching opportunities are found.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create alert. Please try again.",
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
          <Input
            {...register("title")}
            placeholder="E.g., Tax firms in California"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Region</Label>
          <Select {...register("region")}>
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
          <Select {...register("specialties")}>
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
        </div>

        <div>
          <Label>Notification Frequency</Label>
          <RadioGroup defaultValue="daily" className="mt-1.5">
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
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Alert..." : "Create Alert"}
      </Button>
    </form>
  );
};