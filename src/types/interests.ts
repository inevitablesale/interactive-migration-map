export interface Practice {
  id?: string;
  industry: string;
  state: string;  // Changed from region to state
  employee_count: number;
  annual_revenue?: number;
  service_mix: Record<string, number>;
  status?: string;
  last_updated?: string;
  practice_buyer_pool?: any[];
  buyer_count: number;
}

export interface Listing {
  "Company ID": number;
  "Company Name": string | null;
  "Primary Subtitle": string | null;
  "State Name": string | null;
  employeeCount: number | null;
  specialities: string | null;
  notes: string | null;
  status?: string;
}

export interface CanaryFirmInterest {
  id: string;
  company_id: number;
  user_id: string;
  created_at: string;
  status: string;
  is_anonymous: boolean;
}