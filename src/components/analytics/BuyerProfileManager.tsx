import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { BuyerProfileForm } from "./BuyerProfileForm";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const BuyerProfileManager = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["buyerProfile"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("deal_sourcing_forms")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold">{profile.buyer_type}</h3>
          <p className="text-gray-500">{profile.contact_email}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Buyer Profile</DialogTitle>
            </DialogHeader>
            <BuyerProfileForm onSuccess={() => refetch()} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-2">Acquisition Preferences</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Practice Size:</span>{" "}
              {profile.practice_size}
            </p>
            <p>
              <span className="text-gray-500">Service Lines:</span>{" "}
              {profile.services?.join(", ")}
            </p>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Strategic Goals</h4>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Purpose:</span>{" "}
              {profile.buyer_type}
            </p>
            <p>
              <span className="text-gray-500">Timeline:</span>{" "}
              {profile.timeline}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};