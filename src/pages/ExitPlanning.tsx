import { Button } from "@/components/ui/button";
import { Bird, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ExitPlanning() {
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
            <Link to="/" className="text-xl font-bold text-yellow-400">
              Canary
            </Link>
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
        <div className="mb-8">
          <Link to="/firm-owners">
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-yellow-400">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Firm Owners</span>
            </Button>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Learn About Exit Planning</h1>
        <p className="text-2xl text-gray-300 mb-12">Unlock the Full Potential of Your Firm with Expert Guidance</p>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">What is Exit Planning?</h2>
          <p className="text-gray-300 mb-6">
            Exit planning is a comprehensive, proactive strategy that aligns your business, personal, and financial goals to prepare you for a successful transition—on your terms. It's not just about selling your business; it's about maximizing value, reducing risk, and creating a roadmap for your legacy.
          </p>
          <p className="text-gray-300">
            As a Certified Exit Planning Advisor (CEPA), certified through the Exit Planning Institute, I bring proven expertise and tools to help firm owners navigate this critical process with confidence.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Exit Planning Matters</h2>
          <p className="text-gray-300 mb-6">
            For many firm owners, their business represents their largest financial asset. However, most owners don't have a written plan for transitioning. Without a strategy, you risk:
          </p>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
            <li>Selling for less than your business is worth.</li>
            <li>Leaving employees and clients in uncertainty.</li>
            <li>Missing opportunities to secure your financial future.</li>
          </ul>
          <p className="text-gray-300">Exit planning allows you to take control and ensures that you:</p>
          <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
            <li>Maximize the value of your business.</li>
            <li>Reduce risks for your family, team, and clients.</li>
            <li>Achieve your personal and financial goals.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">The Value Acceleration Methodology™</h2>
          <p className="text-gray-300 mb-6">
            Our approach to exit planning follows the Value Acceleration Methodology™, a proven process that ensures clarity, action, and measurable results. Here's how it works:
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium mb-3">1. The Discovery Phase</h3>
              <p className="text-gray-300 mb-4">We start by establishing a baseline value for your firm. This includes:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Analyzing your business's Attractiveness and Readiness scores.</li>
                <li>Identifying gaps in profitability, value, and wealth.</li>
                <li>Assessing your firm's market position and key risks.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">2. The Preparation Phase</h3>
              <p className="text-gray-300 mb-4">Next, we create a detailed plan to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Protect value by de-risking your business.</li>
                <li>Implement value growth strategies to enhance operational efficiency and profitability.</li>
                <li>Align your personal financial goals with your exit strategy.</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-medium mb-3">3. The Decision Phase</h3>
              <p className="text-gray-300">
                Finally, we guide you in making informed decisions, whether that means selling, transitioning to family, or pursuing another strategy. At every step, our goal is to ensure you achieve the best possible outcome.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Who Benefits from Exit Planning?</h2>
          <p className="text-gray-300 mb-6">
            Exit planning is valuable whether you're looking to transition in the next year, five years, or beyond. It's designed for firm owners who want to:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Prepare for the unexpected (illness, market shifts, or economic changes).</li>
            <li>Enhance the value and attractiveness of their business.</li>
            <li>Ensure their legacy lives on for employees, clients, and the community.</li>
            <li>Align their personal financial goals with their business plans.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Key Exit Planning Concepts</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>The Wealth Gap: Understanding the gap between your financial goals and your current resources.</li>
            <li>The Value Gap: Identifying the difference between your firm's current value and its potential value.</li>
            <li>The Triggering Event: Establishing a baseline with personal, financial, and business assessments to prioritize action items.</li>
            <li>90-Day Sprints: Breaking down goals into manageable, measurable steps to drive progress and accountability.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Why Work With a CEPA?</h2>
          <p className="text-gray-300 mb-6">
            Certified Exit Planning Advisors are trained to integrate your personal, business, and financial goals into a clear, actionable plan. As a CEPA certified by the Exit Planning Institute, I provide:
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Expertise in value growth through proven strategies.</li>
            <li>Access to advanced analytics to understand your firm's market position.</li>
            <li>A comprehensive, owner-focused approach tailored to your unique goals.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
          <p className="text-gray-300 mb-8">
            Exit planning is an investment in your future. Whether you're ready to transition soon or simply preparing for the unexpected, the best time to start is now. Let's create a roadmap that ensures the success of your firm—and your legacy.
          </p>
          <a href="https://calendly.com/inevitable-sale/is-selling-your-business-right-for-you" target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="text-white">
              Schedule a Consultation
            </Button>
          </a>
        </section>
      </div>
    </div>
  );
}
