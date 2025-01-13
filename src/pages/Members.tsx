import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const communityPrompts = [
  {
    id: 1,
    prompt: "Identify geographic areas with an exceptionally high concentration of accounting firms relative to the total population, suggesting potential market saturation or specialization.",
    category: "Geographic Analysis"
  },
  {
    id: 2,
    prompt: "Identify areas with a significantly higher proportion of accountants in the public sector compared to the national average, potentially indicating government-dependent accounting markets.",
    category: "Sector Analysis"
  },
  {
    id: 3,
    prompt: "Pinpoint counties with unusually low median household incomes compared to the median value of owner-occupied housing units.",
    category: "Economic Indicators"
  },
  {
    id: 4,
    prompt: "Find accounting firms with exceptionally high employee counts on LinkedIn compared to their reported accountant employment.",
    category: "Data Validation"
  },
  {
    id: 5,
    prompt: "Identify accounting firms with unusually high accountant payroll relative to the number of accountants employed.",
    category: "Compensation Analysis"
  },
  {
    id: 6,
    prompt: "Locate accounting firms established before 1950 that have remarkably low follower counts on social media.",
    category: "Digital Presence"
  },
  {
    id: 7,
    prompt: "Calculate the percentage of firms with above-average employee count and below-average median age in their area.",
    category: "Demographic Analysis"
  },
  {
    id: 8,
    prompt: "Find the top 5 counties with the highest ratio of accountants employed in the private sector to public sector.",
    category: "Employment Distribution"
  },
  {
    id: 9,
    prompt: "Find the county with the highest concentration of accounting firms per 10,000 residents.",
    category: "Market Density"
  },
  {
    id: 10,
    prompt: "Identify the state with the smallest difference between the 75th and 25th percentile of accountant payroll.",
    category: "Wage Distribution"
  },
  {
    id: 11,
    prompt: "Calculate the correlation between the number of vacant housing units and the median gross rent.",
    category: "Housing Market"
  },
  {
    id: 12,
    prompt: "Calculate the correlation between the median age of the population and the number of accounting firms in each county.",
    category: "Demographic Correlation"
  },
  {
    id: 13,
    prompt: "Calculate the correlation between Bachelor's degree holders and management/business employment.",
    category: "Education Impact"
  },
  {
    id: 14,
    prompt: "What is the maximum median household income for firms located in counties with more than 100 accounting firms?",
    category: "Market Analysis"
  },
  {
    id: 15,
    prompt: "What is the average accountant payroll for firms in the top 3 states with highest median household income?",
    category: "Income Analysis"
  },
  {
    id: 16,
    prompt: "What is the average number of Master's degree holders in areas with 30+ minute commute times?",
    category: "Education Geography"
  },
  {
    id: 17,
    prompt: "What is the median employee count for firms established before 2010 in counties with median age above 38?",
    category: "Business Demographics"
  },
  {
    id: 18,
    prompt: "What is the 90th percentile of accountant establishments in counties with poverty rate below 10%?",
    category: "Economic Impact"
  },
  {
    id: 19,
    prompt: "What is the average number of followers for 'Bookkeeping' firms in the top 25% by employee count?",
    category: "Social Media Analysis"
  },
  {
    id: 20,
    prompt: "Find the maximum employee count for firms founded after 2015 in states with highest accountant payroll.",
    category: "Growth Analysis"
  }
];

const Members = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Community Prompts</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">
          Explore data-driven insights with these community-developed prompts
        </p>
        
        <ScrollArea className="h-[600px] rounded-md border p-4">
          {communityPrompts.map((item) => (
            <Card key={item.id} className="p-6 mb-4 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {item.category}
                </div>
                <p className="text-lg text-gray-800">
                  {item.prompt}
                </p>
              </div>
            </Card>
          ))}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Members;