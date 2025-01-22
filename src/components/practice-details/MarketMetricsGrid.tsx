import { ComprehensiveMarketData } from "@/types/rankings";
import { MarketMetricsCard } from "@/components/market-report/MarketMetricsCard";
import { Users, TrendingUp, Percent, DollarSign, GraduationCap, Home } from "lucide-react";

interface MarketMetricsGridProps {
  marketData: ComprehensiveMarketData;
}

export function MarketMetricsGrid({ marketData }: MarketMetricsGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Competition Metrics */}
      <MarketMetricsCard
        title="Market Competition"
        icon={Users}
        metrics={[
          {
            label: "Market Density",
            value: marketData.avg_firms_per_10k?.toString(),
            type: "density",
            rank: marketData.firm_density_rank,
            sublabel: "Firms per 10k residents"
          },
          {
            label: "Market Saturation",
            value: marketData.avg_market_saturation?.toString(),
            type: "saturation",
            sublabel: "% of market capacity"
          },
          {
            label: "Total Firms",
            value: marketData.total_establishments?.toString(),
            type: "population"
          }
        ]}
      />

      {/* Growth Metrics */}
      <MarketMetricsCard
        title="Growth & Opportunity"
        icon={TrendingUp}
        metrics={[
          {
            label: "Growth Rate",
            value: marketData.avg_growth_rate?.toString(),
            type: "growth",
            rank: marketData.growth_rank,
            sublabel: "Annual growth rate"
          },
          {
            label: "Total Population",
            value: marketData.total_population?.toString(),
            type: "population",
            rank: marketData.population_rank
          }
        ]}
      />

      {/* Professional Demographics */}
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

      {/* Economic Indicators */}
      <MarketMetricsCard
        title="Economic Indicators"
        icon={DollarSign}
        metrics={[
          {
            label: "Average Annual Payroll",
            value: marketData.payann?.toString(),
            type: "money",
            rank: marketData.income_rank
          },
          {
            label: "Average Salary Per Employee",
            value: marketData.avgSalaryPerEmployee?.toString(),
            type: "money"
          }
        ]}
      />

      {/* Market Accessibility */}
      <MarketMetricsCard
        title="Market Accessibility"
        icon={Home}
        metrics={[
          {
            label: "Vacancy Rate",
            value: marketData.vacancy_rate?.toString(),
            type: "density",
            rank: marketData.vacancy_rank,
            sublabel: "% of vacant properties"
          }
        ]}
      />

      {/* Employment Metrics */}
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