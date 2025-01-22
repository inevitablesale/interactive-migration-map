import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Building2, TrendingUp, ArrowLeft, GraduationCap } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface CountyData {
  COUNTYNAME: string;
  B01001_001E: number; // Total Population
  B19013_001E: number; // Median Household Income
  B25064_001E: number; // Median Gross Rent
  B25077_001E: number; // Median Home Value
  ESTAB: number; // Number of Establishments
  B15003_022E: number; // Bachelor's degree
  B15003_023E: number; // Master's degree
  B15003_025E: number; // Doctorate degree
  EMP: number; // Total Employment
  PAYANN: number; // Annual Payroll
}

const CountyDetails = () => {
  const { state, county } = useParams();
  const navigate = useNavigate();

  const { data: countyData, isLoading } = useQuery({
    queryKey: ['countyDetails', state, county],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('county_data')
        .select('*')
        .eq('COUNTYNAME', county)
        .maybeSingle();

      if (error) throw error;
      return data as CountyData;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">Loading county data...</div>
        </div>
      </div>
    );
  }

  if (!countyData) {
    return (
      <div className="min-h-screen bg-[#222222] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">County not found</h1>
          <Button onClick={() => navigate(-1)} variant="outline" className="text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#111111]">
      <div className="max-w-7xl mx-auto p-6">
        <Button onClick={() => navigate(-1)} variant="ghost" className="text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center gap-2 mb-8">
          <MapPin className="w-6 h-6 text-blue-500" />
          <h1 className="text-4xl font-bold text-white">{county}, {state}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-medium text-white">Population</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(countyData.B01001_001E)}</p>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-medium text-white">Establishments</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formatNumber(countyData.ESTAB)}</p>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-medium text-white">Annual Payroll</h3>
            </div>
            <p className="text-2xl font-bold text-white">{formatCurrency(countyData.PAYANN)}</p>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-medium text-white">Education</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Bachelor's: {formatNumber(countyData.B15003_022E)}</p>
              <p className="text-sm text-gray-400">Master's: {formatNumber(countyData.B15003_023E)}</p>
              <p className="text-sm text-gray-400">Doctorate: {formatNumber(countyData.B15003_025E)}</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Housing Metrics</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Median Home Value</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(countyData.B25077_001E)}</p>
              </div>
              <div>
                <p className="text-gray-400">Median Gross Rent</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(countyData.B25064_001E)}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-black/40 backdrop-blur-md border-white/10 p-6">
            <h3 className="text-xl font-medium text-white mb-4">Economic Indicators</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Median Household Income</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(countyData.B19013_001E)}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Employment</p>
                <p className="text-2xl font-bold text-white">{formatNumber(countyData.EMP)}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CountyDetails;