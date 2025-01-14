import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AlertForm } from "./AlertForm";
import { useNavigate } from "react-router-dom";

export const WelcomeSection = () => {
  const [showAlertForm, setShowAlertForm] = useState(false);
  const navigate = useNavigate();

  const handleViewOpportunities = () => {
    navigate('/opportunities');
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-white mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-white/60 mb-8">
            Discover and analyze potential acquisition targets with our
            data-driven insights and market analysis tools.
          </p>
          <div className="flex justify-between items-center">
            <Dialog open={showAlertForm} onOpenChange={setShowAlertForm}>
              <Button
                variant="outline"
                className="border-white/10 hover:bg-white/5"
                onClick={() => setShowAlertForm(true)}
              >
                Create Alert
              </Button>
              <DialogContent className="bg-black/90 border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Alert</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Set up alerts to get notified about new opportunities that
                    match your criteria.
                  </DialogDescription>
                </DialogHeader>
                <AlertForm onSuccess={() => setShowAlertForm(false)} />
              </DialogContent>
            </Dialog>
            <Button 
              className="bg-blue-500 hover:bg-blue-600"
              onClick={handleViewOpportunities}
            >
              View Opportunities
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}