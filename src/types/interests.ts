export interface CanaryFirmInterest {
  id: string;
  company_id: number;
  user_id: string;
  created_at: string;
  status: string;
  is_anonymous: boolean;
}

export interface Listing {
  "Company ID": number;
  "Company Name": string | null;
  "Primary Subtitle": string | null;
  Location: string | null;
  "State Name": string | null;
  employeeCount: number | null;
  specialities: string | null;
  notes: string | null;
  status: string | null;
}