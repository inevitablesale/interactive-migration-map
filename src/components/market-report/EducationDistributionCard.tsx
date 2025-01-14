import React from 'react';
import { GraduationCap, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMetricColor } from '@/utils/market-report/formatters';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { ComprehensiveMarketData } from '@/types/rankings';

interface EducationDistributionCardProps {
  marketData: ComprehensiveMarketData;
}

export const EducationDistributionCard: React.FC<EducationDistributionCardProps> = ({ marketData }) => {
  const calculatePercentage = (value: number, total: number) => {
    return total ? ((value / total) * 100).toFixed(1) : 'N/A';
  };

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
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Bachelor's Degree Holders</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Percentage of population with bachelor's degrees</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.bachelors_degree_holders
              ? (marketData.bachelors_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {calculatePercentage(marketData.bachelors_degree_holders, marketData.total_education_population)}%
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Master's Degree Holders</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Percentage of population with master's degrees</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.masters_degree_holders
              ? (marketData.masters_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {calculatePercentage(marketData.masters_degree_holders, marketData.total_education_population)}%
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-gray-400">Doctorate Degree Holders</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-sm">Percentage of population with doctorate degrees</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={`text-xl font-bold ${getMetricColor(
            marketData.total_education_population && marketData.doctorate_degree_holders
              ? (marketData.doctorate_degree_holders / marketData.total_education_population) * 100
              : 0,
            'density'
          )}`}>
            {calculatePercentage(marketData.doctorate_degree_holders, marketData.total_education_population)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};