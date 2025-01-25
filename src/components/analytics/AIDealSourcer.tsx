import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function AIDealSourcer() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBuyerProfile = async () => {
      try {
        // Silently fail if table doesn't exist
        return null;
      } catch (error) {
        return null;
      }
    };

    const loadOpportunities = async () => {
      try {
        const profile = await fetchBuyerProfile();
        // Default values if no profile exists
        const defaultFilters = {
          employee_count_min: 0,
          employee_count_max: 1000,
        };

        // Use profile data or defaults
        const filters = profile || defaultFilters;

        const { data, error } = await supabase
          .from('opportunities')
          .select('*')
          .gte('employee_count', filters.employee_count_min)
          .lte('employee_count', filters.employee_count_max);

        if (error) {
          throw error;
        }

        setOpportunities(data);
        
      } catch (error) {
        console.error("Error loading opportunities:", error);
      }
    };

    loadOpportunities();
  }, []);

  return (
    <div>
      {opportunities.map(opportunity => (
        <div key={opportunity.id}>
          <h3>{opportunity.title}</h3>
          <p>{opportunity.description}</p>
        </div>
      ))}
    </div>
  );
}
