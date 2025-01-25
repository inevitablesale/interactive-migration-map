import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function GeographicLevelToggle() {
  const [subscriptionTier, setSubscriptionTier] = useState('free');

  useEffect(() => {
    const fetchSubscriptionTier = async () => {
      try {
        // Default to free tier if table doesn't exist
        setSubscriptionTier('free');
      } catch (error) {
        setSubscriptionTier('free');
      }
    };

    fetchSubscriptionTier();
  }, []);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Geographic Level</h3>
        {subscriptionTier === 'free' && (
          <span className="text-sm text-gray-500">
            Upgrade to access more detailed geographic data
          </span>
        )}
      </div>
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            subscriptionTier === 'free'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          disabled={subscriptionTier === 'free'}
        >
          State Level
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            subscriptionTier !== 'free'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          disabled={subscriptionTier === 'free'}
        >
          County Level
        </button>
      </div>
    </div>
  );
}