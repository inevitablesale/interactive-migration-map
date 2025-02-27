import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { Users, TrendingUp, Percent, DollarSign, GraduationCap, Home } from "lucide-react";
import { ComprehensiveMarketData } from "@/types/rankings";

interface MarketMetricsGridProps {
  marketData: ComprehensiveMarketData;
}

export function MarketMetricsGrid({ marketData }: MarketMetricsGridProps) {
  const calculateAverageSalary = () => {
    if (!marketData.payann || !marketData.emp || marketData.emp === 0) return undefined;
    return Math.round((marketData.payann * 1000) / marketData.emp);
  };

  const calculateAveragePayrollPerFirm = () => {
    if (!marketData.payann || !marketData.total_establishments || marketData.total_establishments === 0) return undefined;
    return Math.round((marketData.payann * 1000) / marketData.total_establishments);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatGrowthRate = (rate: number | undefined) => {
    if (rate === undefined) return undefined;
    return (rate / 10).toFixed(1);
  };

  const averageSalary = calculateAverageSalary();
  const averagePayrollPerFirm = calculateAveragePayrollPerFirm();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <MarketMetricsCard
        title="Economic Indicators"
        icon={DollarSign}
        metrics={[
          {
            label: "Average Annual Payroll Per Firm",
            value: averagePayrollPerFirm ? formatCurrency(averagePayrollPerFirm) : undefined,
            type: "money",
            rank: marketData.income_rank,
            sublabel: `National Rank: ${marketData.national_income_rank}`
          },
          {
            label: "Average Salary Per Employee",
            value: averageSalary ? formatCurrency(averageSalary) : undefined,
            type: "money",
            rank: marketData.state_rank,
            sublabel: `County Average`
          }
        ]}
      />

      <MarketMetricsCard
        title="Market Competition"
        icon={Users}
        metrics={[
          {
            label: "Market Density",
            value: marketData.firms_per_10k_population?.toString(),
            type: "density",
            rank: marketData.firm_density_rank,
            sublabel: `Avg: ${marketData.avg_firms_per_10k?.toFixed(1)} per 10k`
          },
          {
            label: "Market Saturation",
            value: marketData.market_saturation_index?.toString(),
            type: "saturation",
            rank: marketData.national_market_saturation_rank,
            sublabel: `Avg: ${marketData.avg_market_saturation?.toFixed(1)}%`
          },
          {
            label: "Total Firms",
            value: marketData.total_establishments?.toString(),
            type: "population",
            rank: marketData.national_firm_density_rank
          }
        ]}
      />

      <MarketMetricsCard
        title="Growth & Opportunity"
        icon={TrendingUp}
        metrics={[
          {
            label: "Growth Rate",
            value: formatGrowthRate(marketData.population_growth_rate)?.toString(),
            type: "growth",
            rank: marketData.growth_rank,
            sublabel: `National Rank: ${marketData.national_growth_rank}`
          },
          {
            label: "Total Population",
            value: marketData.total_population?.toString(),
            type: "population",
            rank: marketData.population_rank,
            sublabel: `National Rank: ${marketData.national_population_rank}`
          }
        ]}
      />

      <MarketMetricsCard
        title="Professional Demographics"
        icon={GraduationCap}
        metrics={[
          {
            label: "Bachelor's Degree Holders",
            value: marketData.bachelors_holders?.toString(),
            type: "population"
          },
          {
            label: "Master's Degree Holders",
            value: marketData.masters_holders?.toString(),
            type: "population"
          },
          {
            label: "Doctorate Degree Holders",
            value: marketData.doctorate_holders?.toString(),
            type: "population"
          }
        ]}
      />

      <MarketMetricsCard
        title="Market Accessibility"
        icon={Home}
        metrics={[
          {
            label: "Vacancy Rate",
            value: marketData.vacancy_rate?.toString(),
            type: "density",
            rank: marketData.vacancy_rank,
            sublabel: `National Rank: ${marketData.national_vacancy_rank}`
          }
        ]}
      />

      <MarketMetricsCard
        title="Employment"
        icon={Percent}
        metrics={[
          {
            label: "Employed Population",
            value: marketData.employed_population?.toString(),
            type: "population"
          },
          {
            label: "Private Sector Accountants",
            value: marketData.private_sector_accountants?.toString(),
            type: "population"
          },
          {
            label: "Public Sector Accountants",
            value: marketData.public_sector_accountants?.toString(),
            type: "population"
          }
        ]}
      />
    </div>
  );
}