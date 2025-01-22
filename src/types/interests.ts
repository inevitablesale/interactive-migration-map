export interface Practice {
  id: string;
  industry: string;
  "State Name": string;
  employee_count: number;
  annual_revenue: number;
  service_mix: Record<string, number>;
  status?: string;
  last_updated?: string;
  practice_buyer_pool?: any[];
  buyer_count: number;
  notes?: string;
  specialities?: string;
  "Company Name"?: string;
  employeeCount?: number;
}

export interface CanaryFirmInterest {
  id: string;
  company_id: number;
  user_id: string;
  created_at: string;
  status: string;
  is_anonymous: boolean;
}