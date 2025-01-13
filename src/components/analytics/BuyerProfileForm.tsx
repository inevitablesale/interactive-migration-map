import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const serviceLines = [
  "Tax Services",
  "Audit Services",
  "Payroll Services",
  "Advisory Services",
  "Bookkeeping",
  "Financial Planning",
];

const growthPriorities = [
  "High-growth Regions",
  "Underserved Markets",
  "Technology Integration",
  "Service Expansion",
];

const insights = [
  "Market Trends",
  "Competitive Analysis",
  "Growth Opportunities",
  "Risk Assessment",
];

export const BuyerProfileForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    buyer_name: "",
    contact_email: "",
    contact_phone: "",
    preferred_communication: "email",
    target_geography: [] as string[],
    employee_count_min: 5,
    employee_count_max: 50,
    revenue_min: 500000,
    revenue_max: 2000000,
    service_lines: [] as string[],
    price_min: 500000,
    price_max: 1000000,
    acquisition_purpose: "expansion",
    growth_priorities: [] as string[],
    retention_risk: "medium",
    preferred_insights: [] as string[],
    engagement_frequency: "monthly",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("buyer_profiles").insert([formData]);

      if (error) throw error;

      toast({
        title: "Profile Created",
        description: "Your buyer profile has been saved successfully.",
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create buyer profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="buyer_name">Buyer Name</Label>
            <Input
              id="buyer_name"
              value={formData.buyer_name}
              onChange={(e) =>
                setFormData({ ...formData, buyer_name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="contact_email">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) =>
                setFormData({ ...formData, contact_email: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Acquisition Preferences</h3>
        <div className="grid gap-4">
          <div>
            <Label>Employee Count Range</Label>
            <div className="pt-4">
              <Slider
                value={[formData.employee_count_min, formData.employee_count_max]}
                min={0}
                max={200}
                step={5}
                onValueChange={([min, max]) =>
                  setFormData({
                    ...formData,
                    employee_count_min: min,
                    employee_count_max: max,
                  })
                }
              />
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>{formData.employee_count_min} employees</span>
                <span>{formData.employee_count_max} employees</span>
              </div>
            </div>
          </div>

          <div>
            <Label>Service Lines</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {serviceLines.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.service_lines.includes(service)}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        service_lines: checked
                          ? [...formData.service_lines, service]
                          : formData.service_lines.filter((s) => s !== service),
                      })
                    }
                  />
                  <Label htmlFor={service}>{service}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Strategic Goals</h3>
        <div>
          <Label>Acquisition Purpose</Label>
          <Select
            value={formData.acquisition_purpose}
            onValueChange={(value) =>
              setFormData({ ...formData, acquisition_purpose: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="expansion">Geographic Expansion</SelectItem>
              <SelectItem value="diversification">
                Service Line Diversification
              </SelectItem>
              <SelectItem value="market-share">
                Increasing Market Share
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Growth Priorities</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {growthPriorities.map((priority) => (
              <div key={priority} className="flex items-center space-x-2">
                <Checkbox
                  id={priority}
                  checked={formData.growth_priorities.includes(priority)}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      growth_priorities: checked
                        ? [...formData.growth_priorities, priority]
                        : formData.growth_priorities.filter((p) => p !== priority),
                    })
                  }
                />
                <Label htmlFor={priority}>{priority}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Engagement Preferences</h3>
        <div>
          <Label>Preferred Insights</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {insights.map((insight) => (
              <div key={insight} className="flex items-center space-x-2">
                <Checkbox
                  id={insight}
                  checked={formData.preferred_insights.includes(insight)}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      preferred_insights: checked
                        ? [...formData.preferred_insights, insight]
                        : formData.preferred_insights.filter((i) => i !== insight),
                    })
                  }
                />
                <Label htmlFor={insight}>{insight}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Engagement Frequency</Label>
          <RadioGroup
            value={formData.engagement_frequency}
            onValueChange={(value) =>
              setFormData({ ...formData, engagement_frequency: value })
            }
            className="grid grid-cols-3 gap-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly">Weekly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly">Monthly</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="quarterly" id="quarterly" />
              <Label htmlFor="quarterly">Quarterly</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Profile..." : "Create Buyer Profile"}
      </Button>
    </form>
  );
};