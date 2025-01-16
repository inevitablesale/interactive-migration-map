import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Bird } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <Bird className="w-16 h-16 mx-auto text-yellow-400 animate-bounce" />
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Thank You for Setting Up Your Canary!
        </h1>
        <p className="text-lg text-white/80">
          We're excited to help you find the perfect opportunities. Our AI is now analyzing your preferences and will start sending you matches soon.
        </p>
        <div className="space-y-4">
          <p className="text-white/60">
            You'll receive email notifications when we find opportunities that match your criteria.
          </p>
          <Button 
            onClick={() => navigate("/opportunities")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            View Opportunities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;