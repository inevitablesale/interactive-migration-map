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
  status: string;
  created_at: string;
}

interface Interest {
  practice_id: string;
  user_id: string;
  status: string;
  created_at: string;
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
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!adminData?.is_admin) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive"
      });
      return;
    }

    setIsAdmin(true);
    setLoading(false);
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

  const updatePracticeStatus = async (practiceId: string, newStatus: string) => {
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

    fetchPractices(); // Refresh the list
  };

  const handleSearch = (query: string) => {
    // Implement practice search logic
    console.log("Searching for:", query);
  };

  const handleFilter = (filters: any) => {
    // Implement practice filtering logic
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
                    onValueChange={(value) => updatePracticeStatus(practice.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending_response">Pending Response</SelectItem>
                      <SelectItem value="interested">Interested</SelectItem>
                      <SelectItem value="not_interested">Not Interested</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
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
                <TableCell>{new Date(interest.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}