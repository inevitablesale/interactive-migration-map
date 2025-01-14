import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricColor } from '@/utils/market-report/formatters';
import type { ComprehensiveMarketData } from '@/types/rankings';

interface EducationDistributionCardProps {
  marketData: ComprehensiveMarketData;
}

export const EducationDistributionCard: React.FC<EducationDistributionCardProps> = ({ marketData }) => {
  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <GraduationCap className="w-5 h-5 mr-2" />
          Education Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-gray-400">Bachelor's Degree Holders</p>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.bachelors_degree_holders
              ? (marketData.bachelors_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {marketData.total_education_population && marketData.bachelors_degree_holders
              ? ((marketData.bachelors_degree_holders / marketData.total_education_population) * 100).toFixed(1)
              : 'N/A'}%
          </p>
        </div>
        <div>
          <p className="text-gray-400">Master's Degree Holders</p>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.masters_degree_holders
              ? (marketData.masters_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {marketData.total_education_population && marketData.masters_degree_holders
              ? ((marketData.masters_degree_holders / marketData.total_education_population) * 100).toFixed(1)
              : 'N/A'}%
          </p>
        </div>
        <div>
          <p className="text-gray-400">Doctorate Degree Holders</p>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.doctorate_degree_holders
              ? (marketData.doctorate_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {marketData.total_education_population && marketData.doctorate_degree_holders
              ? ((marketData.doctorate_degree_holders / marketData.total_education_population) * 100).toFixed(1)
              : 'N/A'}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};