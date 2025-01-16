import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Bird } from "lucide-react";

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary to-black p-4">
      <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur-sm">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Bird className="w-16 h-16 animate-color-change" />
          </div>
          
          <h1 className="text-3xl font-bold text-primary">Welcome to Canary!</h1>
          
          <p className="text-gray-600 text-lg">
            Thank you for signing up. We're excited to help you discover prime acquisition opportunities in the accounting industry.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              We're currently in beta, and we'll notify you as soon as we launch.
            </p>
            <p className="text-gray-600 mt-6">
              Are you an investor interested in Canary? Connect with me on{" "}
              <a 
                href="https://www.linkedin.com/in/christabb/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ThankYou;