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
import { Textarea } from "@/components/ui/textarea";

interface AIDealSourcerFormData {
  buyer_name: string;
  contact_email: string;
  team_emails: string;
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
  { value: "1m_5m", label: "$1M - $5M" },
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

const paymentStructureOptions = [
  { value: "cash", label: "Cash Upfront" },
  { value: "seller_financing", label: "Seller Financing" },
  { value: "earnouts", label: "Earnouts" },
  { value: "equity_rollover", label: "Equity Rollovers" },
];

const timelineOptions = [
  { value: "immediate", label: "Immediate (1-3 months)" },
  { value: "short", label: "Short-Term (3-6 months)" },
  { value: "long", label: "Long-Term (6+ months)" },
];

const postAcquisitionGoalOptions = [
  { value: "retain_leadership", label: "Retain Existing Leadership" },
  { value: "streamline", label: "Streamline Operations" },
  { value: "expand", label: "Expand Service Offerings" },
  { value: "profitability", label: "Increase Profitability" },
  { value: "culture", label: "Cultural Alignment" },
];

const preferredRoleOptions = [
  { value: "hands_on", label: "Hands-On Operational" },
  { value: "advisory", label: "Advisory/Strategic" },
];

const attractiveFeatureOptions = [
  { value: "earnings", label: "Earnings Stability" },
  { value: "management", label: "Existing Management" },
  { value: "culture", label: "Cultural Alignment" },
  { value: "growth", label: "Growth Potential" },
  { value: "technology", label: "Technology Adoption" },
  { value: "scalability", label: "Scalability" },
];

export const AIDealSourcerForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<AIDealSourcerFormData>();

  const onSubmit = async (data: AIDealSourcerFormData) => {
    setLoading(true);
    try {
      // First create the buyer profile
      const { data: profile, error: profileError } = await supabase.from("buyer_profiles").insert({
        buyer_name: data.buyer_name,
        contact_email: data.contact_email,
        target_geography: data.geography,
        ai_preferences: {
          timeline: data.timeline,
          dealTypes: data.dealTypes,
          preferredRole: data.preferredRole,
          dealRequirements: data.dealRequirements,
          complexStructures: data.complexStructures,
          paymentStructures: data.paymentStructures,
          attractiveFeatures: data.attractiveFeatures,
          postAcquisitionGoals: data.postAcquisitionGoals,
          additionalNotes: data.additionalNotes,
          team_emails: data.team_emails?.split(',').map(email => email.trim()).filter(Boolean) || [],
        },
        alert_frequency: data.alertFrequency,
      }).select().single();

      if (profileError) throw profileError;

      // Then create an initial AI opportunity for tracking
      const { error: opportunityError } = await supabase.from("ai_opportunities").insert({
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
        title: "AI Deal Profile Created! 🎯",
        description: "I'll start hunting for your perfect opportunities right away.",
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
            <Label>Full Name</Label>
            <Controller
              name="buyer_name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your full name"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Controller
              name="contact_email"
              control={control}
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>

          <div>
            <Label>Team Member Emails (comma-separated)</Label>
            <Controller
              name="team_emails"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="team@example.com, analyst@example.com"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>

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

          <div>
            <Label>Payment Structures</Label>
            <div className="mt-1.5 space-y-2">
              {paymentStructureOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Controller
                    name="paymentStructures"
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
            <Label>Complex Deal Structures</Label>
            <Controller
              name="complexStructures"
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2 mt-1.5">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label>Open to complex deal structures</Label>
                </div>
              )}
            />
          </div>

          <div>
            <Label>Timeline</Label>
            <Controller
              name="timeline"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1.5 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    {timelineOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-white/10"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Post-Acquisition Goals</Label>
            <div className="mt-1.5 space-y-2">
              {postAcquisitionGoalOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Controller
                    name="postAcquisitionGoals"
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
            <Label>Preferred Role</Label>
            <Controller
              name="preferredRole"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="mt-1.5 bg-white/5 border-white/10">
                    <SelectValue placeholder="Select preferred role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10">
                    {preferredRoleOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-white hover:bg-white/10"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div>
            <Label>Attractive Features</Label>
            <div className="mt-1.5 space-y-2">
              {attractiveFeatureOptions.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Controller
                    name="attractiveFeatures"
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
            <Label>Specific Deal Requirements</Label>
            <Controller
              name="dealRequirements"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter any specific requirements or criteria"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>

          <div>
            <Label>Additional Notes</Label>
            <Controller
              name="additionalNotes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Any additional notes or preferences"
                  className="mt-1.5 bg-white/5 border-white/10"
                />
              )}
            />
          </div>

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
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600" disabled={loading}>
        {loading ? "Creating Profile..." : "Create AI Deal Profile"}
      </Button>
    </form>
  );
};