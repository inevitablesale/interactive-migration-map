import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Info, Bird } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function FirmOwners() {
  const [session, setSession] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900">
      {/* Fixed Header with Logo */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
            <span className="text-xl font-bold text-yellow-400">Canary</span>
          </div>
          {session ? (
            <div className="flex items-center gap-4">
              <Link to="/tracked-practices" className="text-white hover:text-yellow-400 transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-white hover:text-yellow-400 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors">
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-white">
        <h1 className="text-4xl font-bold mb-6">Why You're Here – And How We Can Help</h1>
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Welcome to Canary</h2>
            <p className="text-gray-300">
              If you're here, it's likely because we've reached out on behalf of a buyer, you're exploring the idea of selling your firm, or you have questions about your listing on Canary. Whatever brought you here, we're here to help—with clarity, confidentiality, and your goals in mind.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Why We Reached Out</h2>
            <p className="text-gray-300">
              We reached out to you because a buyer we work with expressed interest in a firm like yours. Canary specializes in connecting buyers with off-market professional service firms that align with their needs. Your firm stood out based on its size, service mix, or location.
            </p>
            <p className="mt-4 text-gray-300">
              Your firm's listing on Canary is anonymized, and no identifying information is shared without your consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Not Ready to Sell Yet?</h2>
            <p className="text-gray-300 mb-4">
              Selling your firm is a big decision, and it's okay if you're not ready yet.
            </p>
            <p className="text-gray-300 mb-6">
              We can help you understand your firm's potential, prepare for the future, and explore your options—at your own pace.
            </p>
            <Button variant="outline" className="flex items-center gap-2 text-black">
              <span>Learn About Exit Planning</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How Canary Works for Firm Owners</h2>
            <p className="text-gray-300 mb-6">
              Canary is built for buyers, but we take firm owners seriously. Our goal is to protect your privacy while connecting you with qualified buyers who value what you've built.
            </p>
            <ul className="list-disc list-inside space-y-4 text-gray-300">
              <li>Anonymized Listings: No real names, client lists, or sensitive details are shared.</li>
              <li>Buyer Interest: Listings are created when a buyer expresses interest in firms like yours.</li>
              <li>Your Control: You decide what happens next—explore opportunities, plan for the future, or remove your listing entirely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Why was my firm listed?
                </h3>
                <p className="text-gray-300">
                  Your firm was included in our marketplace because a buyer expressed interest in firms with characteristics like yours. All listings are anonymized to protect your privacy.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  What if I'm not ready to sell?
                </h3>
                <p className="text-gray-300">
                  That's completely fine. Many firm owners we contact aren't ready yet. We're here to help you explore options or plan for the future at your pace.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Your Next Step—On Your Terms</h2>
            <p className="text-gray-300 mb-8">
              Whether you're ready to explore selling or thinking about the future, we're here to support you.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://calendly.com/inevitable-sale/is-selling-your-business-right-for-you" target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Talk to Chris</span>
                </Button>
              </a>
              <Button variant="outline" className="flex items-center gap-2 text-black">
                <ArrowRight className="w-4 h-4" />
                <span>Learn About Exit Planning</span>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
