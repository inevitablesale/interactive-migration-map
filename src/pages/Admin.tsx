import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SearchFilters } from "@/components/crm/SearchFilters";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Practice {
  id: string;
  industry: string;
  region: string;
  status: "pending_response" | "owner_engaged" | "negotiation" | "closed" | "withdrawn";
  created_at: string;
}

interface Interest {
  practice_id: string;
  user_id: string;
  status: string;
  created_at: string;
  id: string;
  is_anonymous: boolean;
  joined_at: string;
  notes: string | null;
  rating: number | null;
}

export default function Admin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchPractices();
    fetchInterests();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current user:", user);
      
      if (!user) {
        console.log("No user found, redirecting to auth");
        navigate('/auth');
        return;
      }

      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();

      console.log("Admin check result:", { adminData, error });

      if (error) {
        console.error("Error checking admin status:", error);
        navigate('/');
        toast({
          title: "Error",
          description: "Failed to verify admin access.",
          variant: "destructive"
        });
        return;
      }

      if (!adminData?.is_admin) {
        console.log("User is not admin, redirecting to home");
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page.",
          variant: "destructive"
        });
        return;
      }

      console.log("Admin access granted");
      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error("Error in admin check:", error);
      navigate('/');
      toast({
        title: "Error",
        description: "An error occurred while checking permissions.",
        variant: "destructive"
      });
    }
  };

  const fetchPractices = async () => {
    const { data, error } = await supabase
      .from('tracked_practices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch practices",
        variant: "destructive"
      });
      return;
    }

    setPractices(data || []);
  };

  const fetchInterests = async () => {
    const { data, error } = await supabase
      .from('practice_buyer_pool')
      .select('*')
      .order('joined_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interests",
        variant: "destructive"
      });
      return;
    }

    setInterests(data || []);
  };

  const updatePracticeStatus = async (practiceId: string, newStatus: Practice['status']) => {
    const { error } = await supabase
      .from('tracked_practices')
      .update({ status: newStatus })
      .eq('id', practiceId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update practice status",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Practice status updated successfully"
    });

    fetchPractices();
  };

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: any) => {
    console.log("Applying filters:", filters);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="mb-8">
        <SearchFilters onSearch={handleSearch} onFilter={handleFilter} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Practices</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {practices.map((practice) => (
              <TableRow key={practice.id}>
                <TableCell>{practice.id}</TableCell>
                <TableCell>{practice.industry}</TableCell>
                <TableCell>{practice.region}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={practice.status}
                    onValueChange={(value: Practice['status']) => updatePracticeStatus(practice.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_response">Pending Response</SelectItem>
                      <SelectItem value="owner_engaged">Owner Engaged</SelectItem>
                      <SelectItem value="negotiation">Negotiation</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="withdrawn">Withdrawn</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{new Date(practice.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/practice/${practice.id}`)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white rounded-lg shadow mt-8">
        <h2 className="text-xl font-semibold p-4 border-b">Interest Tracking</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Practice ID</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expressed At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {interests.map((interest) => (
              <TableRow key={`${interest.practice_id}-${interest.user_id}`}>
                <TableCell>{interest.practice_id}</TableCell>
                <TableCell>{interest.user_id}</TableCell>
                <TableCell>{interest.status}</TableCell>
                <TableCell>{new Date(interest.joined_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}