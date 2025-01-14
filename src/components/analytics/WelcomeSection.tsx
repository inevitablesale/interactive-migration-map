import { Bell, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { AlertForm } from "./AlertForm";
import { useSearchParams } from "react-router-dom";

export const WelcomeSection = () => {
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [, setSearchParams] = useSearchParams();

  const handleViewOpportunities = () => {
    setSearchParams({ filter: 'opportunities' });
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Welcome! Ready to discover your next acquisition opportunity?
            </h1>
            <p className="text-blue-100/80">
              Explore growth regions and high-potential firms tailored to your needs
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Dialog open={showAlertForm} onOpenChange={setShowAlertForm}>
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/10 hover:bg-white/10"
                onClick={() => setShowAlertForm(true)}
              >
                <Bell className="w-4 h-4 mr-2" />
                Set Up Alerts
              </Button>
              <DialogContent className="bg-gray-900 border-white/10 text-white">
                <DialogHeader>
                  <DialogTitle>Create New Alert</DialogTitle>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="text-sm text-blue-100/60">Active Alerts</div>
            <div className="text-2xl font-bold text-white">5</div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="text-sm text-blue-100/60">New Opportunities</div>
            <div className="text-2xl font-bold text-white">12</div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="text-sm text-blue-100/60">Growth Regions</div>
            <div className="text-2xl font-bold text-white">8</div>
          </Card>
          
          <Card className="bg-white/5 border-white/10 p-4">
            <div className="text-sm text-blue-100/60">High-Potential Firms</div>
            <div className="text-2xl font-bold text-white">24</div>
          </Card>
        </div>
      </div>
    </div>
  );
};