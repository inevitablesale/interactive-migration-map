export interface BuyerProfile {
  id: string;
  user_id: string;
  buyer_name: string;
  contact_email: string;
  contact_phone?: string;
  preferred_communication?: string;
  target_geography: string[];
  employee_count_min?: number;
  employee_count_max?: number;
  revenue_min?: number;
  revenue_max?: number;
  service_lines?: string[];
  price_min?: number;
  price_max?: number;
  acquisition_purpose?: string;
  growth_priorities?: string[];
  retention_risk?: string;
  preferred_insights?: string[];
  engagement_frequency?: string;
  created_at?: string;
  updated_at?: string;
}
