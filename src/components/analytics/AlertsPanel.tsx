import { useState, useEffect } from "react";
import { Bell, Settings, Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertForm } from "./AlertForm";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  title: string;
  region: string;
  employee_count_min: number;
  employee_count_max: number;
  specialties: string[];
  frequency: string;
  created_at: string;
}

export const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from("alerts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const deleteAlert = async (id: string) => {
    try {
      const { error } = await supabase.from("alerts").delete().eq("id", id);
      if (error) throw error;

      setAlerts(alerts.filter((alert) => alert.id !== id));
      toast({
        title: "Alert deleted",
        description: "The alert has been removed successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete alert. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Alerts</h3>
        </div>
        <div className="flex gap-2">
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-white/10">
                <Plus className="w-4 h-4 text-white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-white/10 text-white">
              <DialogHeader>
                <DialogTitle>Create New Alert</DialogTitle>
              </DialogHeader>
              <AlertForm onSuccess={() => {
                setShowForm(false);
                fetchAlerts();
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
          <div className="text-sm text-blue-100/60">Loading alerts...</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white/5 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  {alert.title}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-white/10"
                  onClick={() => deleteAlert(alert.id)}
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </Button>
              </div>
              <p className="text-sm text-blue-100/60">
                {alert.region} · {alert.employee_count_min}-{alert.employee_count_max} employees
                · {alert.frequency} updates
              </p>
            </div>
          ))
        )}

        <Button
          className="w-full bg-white/5 hover:bg-white/10 border-white/10"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-2 text-white" />
          Add New Alert
        </Button>
      </div>
    </Card>
  );
};