import { Bird } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AppSidebar() {
  const [session, setSession] = useState(null);

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bird className="w-8 h-8 animate-color-change text-yellow-400" />
          <span className="text-xl font-bold text-yellow-400">Canary</span>
        </div>
        <div className="flex items-center gap-4">
          {!session && (
            <Link to="/firm-owners" className="text-white hover:text-yellow-400 transition-colors">
              Firm Owners
            </Link>
          )}
          <Link to="/auth" className="text-white hover:text-yellow-400 transition-colors">
            {session ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
}