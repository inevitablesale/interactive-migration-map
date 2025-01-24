import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { estimateAnnualRevenue } from "@/utils/valuationUtils";

export default function TrackedPractices() {
  const { data: practices, isLoading } = useQuery({
    queryKey: ['tracked-practices'],
    queryFn: async () => {
      const { data: firms, error } = await supabase
        .from('canary_firms_data')
        .select('*')
        .order('employeeCount', { ascending: false });

      if (error) throw error;

      // Transform the data
      return firms.map(practice => ({
        id: practice["Company ID"].toString(),
        generated_title: practice["Company Name"],
        industry: practice["Primary Subtitle"] || "",
        region: practice["State Name"] || "",
        employee_count: practice.employeeCount || 0,
        annual_revenue: estimateAnnualRevenue(practice.employeeCount || 0),
        service_mix: { "General": 100 },
        status: "not_contacted",
        last_updated: new Date().toISOString(),
      }));
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {practices.map(practice => (
        <div key={practice.id}>
          <h3>{practice.generated_title}</h3>
          <p>Industry: {practice.industry}</p>
          <p>Region: {practice.region}</p>
          <p>Employees: {practice.employee_count}</p>
          <p>Estimated Revenue: {practice.annual_revenue}</p>
        </div>
      ))}
    </div>
  );
}
