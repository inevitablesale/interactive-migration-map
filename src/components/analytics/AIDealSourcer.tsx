import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Plus, Settings, Star, Bookmark, X, Bell } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AIDealSourcerForm } from "./AIDealSourcerForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DealMap } from "./deal-sourcer/DealMap";

export const AIDealSourcer = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState([]);
  const [savedDeals, setSavedDeals] = useState<string[]>([]);
  const [unreviewedCount, setUnreviewedCount] = useState(0);
  const [matchingFirms, setMatchingFirms] = useState([]);

  const fetchOpportunities = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("buyer_profiles")
        .select(`
          *,
          ai_opportunities (*)
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const opportunities = profiles?.map(profile => ({
        ...profile,
        opportunities: profile.ai_opportunities || []
      })) || [];

      setOpportunities(opportunities);
      
      // Count unreviewed opportunities
      const unreviewed = opportunities.reduce((count, profile) => {
        return count + (profile.ai_opportunities || [])
          .filter(opp => !savedDeals.includes(opp.id))
          .length;
      }, 0);
      
      setUnreviewedCount(unreviewed);

      // Fetch matching firms based on the first profile's preferences
      if (opportunities.length > 0) {
        const firstProfile = opportunities[0];
        const { data: firms } = await supabase
          .from('canary_firms_data')
          .select('*')
          .gte('employeeCount', firstProfile.employee_count_min || 0)
          .lte('employeeCount', firstProfile.employee_count_max || 999999);
        
        setMatchingFirms(firms || []);
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleSaveDeal = (dealId: string) => {
    setSavedDeals(prev => [...prev, dealId]);
    setUnreviewedCount(prev => Math.max(0, prev - 1));
    toast({
      title: "Deal saved! 🎯",
      description: "I'll keep an eye on this one for you.",
    });
  };

  const handleDismissDeal = (dealId: string) => {
    setOpportunities(prev => prev.filter((opp: any) => opp.id !== dealId));
    setUnreviewedCount(prev => Math.max(0, prev - 1));
    toast({
      title: "Deal dismissed",
      description: "I'll find you better matches!",
    });
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400 animate-pulse" />
          <h3 className="text-lg font-semibold text-white">AI Deal Sourcer</h3>
        </div>
        <div className="flex gap-2">
          {unreviewedCount > 0 && (
            <div className="relative animate-fade-in">
              <Bell className="w-5 h-5 text-blue-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white animate-bounce">
                {unreviewedCount}
              </span>
            </div>
          )}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>Let's Find Your Perfect Match 🎯</DialogTitle>
              </DialogHeader>
              <AIDealSourcerForm onSuccess={() => {
                setShowForm(false);
                fetchOpportunities();
                toast({
                  title: "Profile updated! 🚀",
                  description: "I'm on the hunt for your ideal opportunities.",
                });
              }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse mx-auto mb-4" />
            <p className="text-sm text-blue-100/60">Scanning the market for opportunities...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-blue-400/20 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">
              Hey there! 👋 Let's Find Your Next Big Thing
            </h4>
            <p className="text-sm text-blue-100/60 mb-6 max-w-md mx-auto">
              I'm your AI deal scout! Tell me what you're looking for, and I'll analyze 
              the market 24/7 to find perfect matches. Click the + button to set up 
              your first deal search profile.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 animate-fade-in"
            >
              Create Your First Deal Profile
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4 animate-fade-in">
              {opportunities.map((opportunity: any) => (
              <div 
                key={opportunity.id} 
                className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-lg font-medium text-white">
                      {opportunity.buyer_name}'s Profile
                    </h4>
                    <p className="text-sm text-blue-100/60">
                      Looking for: {opportunity.ai_preferences?.dealTypes?.join(", ")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowForm(true)}
                      className="hover:bg-white/10"
                      title="Edit profile settings"
                    >
                      <Settings className="w-4 h-4 text-blue-400" />
                    </Button>
                    {!savedDeals.includes(opportunity.id) ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSaveDeal(opportunity.id)}
                        className="hover:bg-blue-500/20"
                      >
                        <Star className="w-4 h-4 text-blue-400" />
                      </Button>
                    ) : (
                      <Bookmark className="w-4 h-4 text-blue-400" />
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDismissDeal(opportunity.id)}
                      className="hover:bg-red-500/20"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-sm">
                    <p className="text-white/60">Timeline</p>
                    <p className="text-white">{opportunity.ai_preferences?.timeline}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-white/60">Preferred Role</p>
                    <p className="text-white">{opportunity.ai_preferences?.preferredRole}</p>
                  </div>
                </div>
              </div>
              ))}
            </div>
            <div className="mt-8 h-[400px] rounded-lg overflow-hidden">
              <DealMap firms={matchingFirms} />
            </div>
          </>
        )}
      </div>
    </Card>
  );
};
