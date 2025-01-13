export interface BuyerProfile {
  id: string;
  user_id: string;
  subscription_tier: 'free' | 'paid';
  // Add any other existing fields here
}
