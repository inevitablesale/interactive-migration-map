import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const communityPrompts = [
  {
    id: 1,
    prompt: "Find the average number of accountants employed in firms located in counties with a median household income above the 75th percentile.",
    category: "Income Analysis"
  },
  {
    id: 2,
    prompt: "Calculate the percentage of firms with a LinkedIn follower count above the 75th percentile that were founded after 2015.",
    category: "Social Media Impact"
  },
  {
    id: 3,
    prompt: "Calculate the average employee count for accounting firms founded in each decade since 1980.",
    category: "Historical Growth"
  },
  {
    id: 4,
    prompt: "Identify the founding year with the highest total number of followers for firms in the top quartile of 'B01001_001E'.",
    category: "Market Leaders"
  },
  {
    id: 5,
    prompt: "Calculate the percentage of firms founded each year that have a LinkedIn profile ('Profile URL' is not NULL).",
    category: "Digital Presence"
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