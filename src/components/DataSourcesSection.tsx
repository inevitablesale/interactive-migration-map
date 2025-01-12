import { Database, Globe, Info, Server } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export const DataSourcesSection = () => {
  return (
    <div className="min-h-screen bg-black/90 relative z-20 px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
            How Canary Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leveraging comprehensive data sources and advanced analytics to provide actionable insights for accounting practice acquisitions
          </p>
        </div>

        <Tabs defaultValue="data" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px] mx-auto mb-8">
            <TabsTrigger value="data">Data Sources</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="data" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Primary Data Sources</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    US Census Bureau ACS Data - Demographic and economic indicators
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Bureau of Labor Statistics - Employment and wage data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    County Business Patterns - Detailed business statistics
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Geographic Coverage</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    State-level economic indicators and firm density
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    MSA (Metropolitan Statistical Area) analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    County-level demographic and business data
                  </li>
                </ul>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Data Processing</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Real-time data aggregation and analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Advanced filtering and customization options
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Predictive analytics for growth potential
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Key Metrics</h3>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Firm density and distribution analysis
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Employee counts and revenue metrics
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Market penetration and growth indicators
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">Free Tier</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded">
                    $0
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Perfect for curious buyers or first-time users exploring basic insights
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Unlimited access to anonymized data
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    MSA-level heatmaps and trends
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Weekly insights newsletter
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-black/40 backdrop-blur-md border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-semibold text-white">All Access</h3>
                  <span className="px-2 py-1 text-xs font-medium bg-yellow-400/10 text-yellow-400 rounded">
                    $250 one-time
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  For active buyers needing detailed, actionable data
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Detailed city-level insights
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Access to actual firm listings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Custom filters and alerts
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    Downloadable reports
                  </li>
                </ul>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};