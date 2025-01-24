import { Clock, Users, Play, Linkedin, Bird, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PracticeOfDayProps {
  practice?: {
    industry: string;
    region: string;
    employee_count: number;
    service_mix: Record<string, number>;
    buyer_count: number;
  };
  onInterested?: () => void;
}

export function PracticeOfDay({ practice, onInterested }: PracticeOfDayProps) {
  const { toast } = useToast();

  const handleLinkedInSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/thank-you`,
        },
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: error.message,
        });
      }
    } catch (error) {
      console.error('LinkedIn auth error:', error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to connect with LinkedIn. Please try again.",
      });
    }
  };

  if (!practice) {
    return (
      <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700/50 relative overflow-hidden shadow-xl hover:shadow-blue-900/20 transition-all duration-300">
        {/* Coming Soon Banner */}
        <div className="absolute -right-8 top-12 rotate-45 bg-yellow-500/90 text-blue-950 px-8 py-1 text-sm font-semibold shadow-lg z-10">
          Coming Soon
        </div>
        
        <CardHeader className="pb-4 border-b border-blue-700/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white">Practice of the Day</CardTitle>
            <Bird className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Clock className="h-12 w-12 text-yellow-400" />
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold text-white">Next Reveal in 12 Hours</h3>
              <p className="text-sm text-blue-200">
                Join now to get early access to our daily practice reveals
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-blue-800/50 rounded-lg p-3 border border-blue-700/30">
                <Calendar className="h-4 w-4 text-yellow-400" />
                <div className="min-w-0">
                  <span className="text-xs text-blue-200">Daily Reveals</span>
                  <p className="text-sm text-white font-medium">9 AM EST</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-blue-800/50 rounded-lg p-3 border border-blue-700/30">
                <Users className="h-4 w-4 text-yellow-400" />
                <div className="min-w-0">
                  <span className="text-xs text-blue-200">Early Access</span>
                  <p className="text-sm text-white font-medium">6 AM EST</p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-not-allowed opacity-50"
              disabled
              onClick={handleLinkedInSignup}
            >
              <Linkedin className="w-4 h-4 mr-2" />
              RSVP with LinkedIn
            </Button>

            <p className="text-xs text-center text-blue-200">
              Get early access and detailed metrics before the public reveal
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 border-blue-700/50">
      <CardHeader>
        <CardTitle className="text-white">Today's Featured Practice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">
            {practice.industry} | {practice.region}
          </h3>
          <p className="text-sm text-blue-200">
            {practice.employee_count} employees | {Object.entries(practice.service_mix)
              .map(([key, value]) => `${value}% ${key}`)
              .join(", ")}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-blue-200">{practice.buyer_count} interested buyers</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-blue-200">12 hours remaining</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold" onClick={onInterested}>
            I'm Interested
          </Button>
          <Button variant="outline" className="w-full border-blue-700/50 text-blue-200 hover:bg-blue-800/50" asChild>
            <a href="#replay">
              <Play className="h-4 w-4 mr-2" />
              Watch the live replay
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}