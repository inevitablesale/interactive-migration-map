import { useState } from "react";
import { StateRankings } from "./StateRankings";
import { MSARankings } from "./MSARankings";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export const Rankings = () => {
  const [activeView, setActiveView] = useState<'state' | 'msa'>('state');

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/10">
      <Tabs defaultValue="state" className="w-full" onValueChange={(value) => setActiveView(value as 'state' | 'msa')}>
        <TabsList className="w-full grid grid-cols-2 bg-black/20 p-1 rounded-lg">
          <TabsTrigger 
            value="state"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            State Rankings
          </TabsTrigger>
          <TabsTrigger 
            value="msa"
            className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400"
          >
            MSA Rankings
          </TabsTrigger>
        </TabsList>

        <div className="p-4">
          <TabsContent value="state" className="mt-0">
            <StateRankings />
          </TabsContent>
          <TabsContent value="msa" className="mt-0">
            <MSARankings />
          </TabsContent>
        </div>
      </Tabs>
    </Card>
  );
};