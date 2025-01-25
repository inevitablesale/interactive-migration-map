import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function BuyerProfileManager() {
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Silently fail if table doesn't exist
        setProfiles([]);
      } catch (error) {
        setProfiles([]);
      }
    };

    fetchProfiles();
  }, []);

  // Return empty state or loading UI
  return null;
}