import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Plus, Settings } from "lucide-react";
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

export const AIDealSourcer = () => {
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState([]);

  const fetchOpportunities = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_opportunities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI Deal Sourcer</h3>
        </div>
        <div className="flex gap-2">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create AI Deal Profile</DialogTitle>
              </DialogHeader>
              <AIDealSourcerForm onSuccess={() => {
                setShowForm(false);
                fetchOpportunities();
              }} />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" className="hover:bg-white/10">
            <Settings className="w-4 h-4 text-white" />
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-sm text-blue-100/60">Loading opportunities...</div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="w-12 h-12 text-blue-400/20 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-white mb-2">
              No AI Deal Profile Set
            </h4>
            <p className="text-sm text-blue-100/60 mb-6 max-w-md mx-auto">
              Create an AI Deal Profile to get personalized recommendations and alerts
              about opportunities that match your criteria.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Create AI Deal Profile
            </Button>
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <div key={opportunity.id} className="bg-white/5 p-4 rounded-lg">
              {/* Opportunity card content will go here */}
            </div>
          ))
        )}
      </div>
    </Card>
  );
};