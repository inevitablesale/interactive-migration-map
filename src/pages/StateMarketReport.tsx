import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Building2, Users, TrendingUp, GraduationCap } from 'lucide-react';
import { MarketMetricsCard } from '@/components/market-report/MarketMetricsCard';
import { AccountingIndustryCard } from '@/components/market-report/AccountingIndustryCard';
import { EducationDistributionCard } from '@/components/market-report/EducationDistributionCard';
import { EmploymentMetricsCard } from '@/components/market-report/EmploymentMetricsCard';

export default function StateMarketReport() {
  const navigate = useNavigate();
  const { state } = useParams();
  const [stateName, setStateName] = useState<string>("");
  const [stateAbbr, setStateAbbr] = useState<string>("");
  const [isValidState, setIsValidState] = useState(true);
  const [stateData, setStateData] = useState<any>(null);
  const [stateRankings, setStateRankings] = useState<any>(null);

  const calculateNationalRank = (stateRankings: any) => {
    if (!stateRankings) return null;
    return stateRankings.density_rank;
  };

  const calculateEducationPercentages = (stateData: any) => {
    if (!stateData) return {
      bachelors: 0,
      masters: 0,
      doctorate: 0
    };

    const total = stateData.B15003_001E || 1; // Total population 25 years and over
    return {
      bachelors: ((stateData.B15003_022E || 0) / total * 100).toFixed(1),
      masters: ((stateData.B15003_023E || 0) / total * 100).toFixed(1),
      doctorate: ((stateData.B15003_025E || 0) / total * 100).toFixed(1)
    };
  };

  const handleCountyClick = (countyName: string) => {
    if (!stateAbbr) return;
    navigate(`/market-report/${countyName}/${stateAbbr}`);
  };

  const fetchStateData = async () => {
    if (!state) {
      setIsValidState(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('state_data')
        .select('*')
        .eq('STATEFP', state)
        .single();

      if (error || !data) {
        setIsValidState(false);
        return;
      }

      setStateData(data);
    } catch (error) {
      console.error('Error fetching state data:', error);
      setIsValidState(false);
    }
  };

  const fetchStateRankings = async () => {
    if (!state) {
      setIsValidState(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('state_rankings')
        .select('*')
        .eq('STATEFP', state)
        .single();

      if (error || !data) {
        setIsValidState(false);
        return;
      }

      setStateRankings(data);
    } catch (error) {
      console.error('Error fetching state rankings:', error);
      setIsValidState(false);
    }
  };

  useEffect(() => {
    const loadStateName = async () => {
      if (!state) {
        setIsValidState(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('state_fips_codes')
          .select('state, postal_abbr')
          .eq('STATEFP', state)
          .single();

        if (error || !data) {
          setIsValidState(false);
          return;
        }

        setStateName(data.state);
        setStateAbbr(data.postal_abbr);
      } catch (error) {
        console.error('Error fetching state name:', error);
        setIsValidState(false);
      }
    };

    loadStateName();
    fetchStateData();
    fetchStateRankings();
  }, [state, isValidState]);

  // Handle invalid state parameter
  if (!isValidState) {
    return (
      <div className="container mx-auto py-8">
        <Card className="p-6 bg-red-50">
          <h1 className="text-xl font-semibold text-red-800 mb-2">Invalid State</h1>
          <p className="text-red-600">The specified state could not be found.</p>
        </Card>
      </div>
    );
  }

  // Handle loading state
  if (!stateData || !stateRankings) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading market report...</p>
        </div>
      </div>
    );
  }

  const nationalRank = calculateNationalRank(stateRankings);
  const educationPercentages = calculateEducationPercentages(stateData);

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">{stateName} Market Report</h1>
        <p className="text-lg text-white/60">
          Comprehensive market analysis and insights for {stateName}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketMetricsCard
          title="Market Overview"
          icon={Building2}
          metrics={[
            {
              label: "National Rank",
              value: nationalRank?.toString() || "N/A",
              type: "rank",
              rank: nationalRank || undefined
            },
            {
              label: "Total Establishments",
              value: stateData?.ESTAB?.toLocaleString() || "N/A",
              type: "count"
            },
            {
              label: "Market Growth",
              value: `${((stateRankings?.growth_rate || 0) * 100).toFixed(1)}%`,
              type: "growth"
            }
          ]}
        />

        <MarketMetricsCard
          title="Employment"
          icon={Users}
          metrics={[
            {
              label: "Total Employment",
              value: stateData?.EMP?.toLocaleString() || "N/A",
              type: "count"
            },
            {
              label: "Annual Payroll",
              value: `$${((stateData?.PAYANN || 0) * 1000).toLocaleString()}`,
              type: "money"
            }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AccountingIndustryCard marketData={stateData} />
        <EducationDistributionCard marketData={stateData} />
      </div>

      <EmploymentMetricsCard marketData={stateData} />
    </div>
  );
}
