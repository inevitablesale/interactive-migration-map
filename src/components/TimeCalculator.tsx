import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TimeCalculator() {
  const [hoursPerMonth, setHoursPerMonth] = useState<number>(10);
  const [hourlyRate, setHourlyRate] = useState<number>(150);
  const canaryMonthlyPrice = 250; // Updated monthly price for Canary
  
  const calculateSavings = () => {
    const monthlyTimeCost = hoursPerMonth * hourlyRate;
    const annualTimeCost = monthlyTimeCost * 12;
    const annualCanaryCost = canaryMonthlyPrice * 12;
    return annualTimeCost - annualCanaryCost;
  };

  return (
    <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-primary">
          Calculate Your Time Savings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="hours">Hours spent searching per month</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            value={hoursPerMonth}
            onChange={(e) => setHoursPerMonth(Number(e.target.value))}
            className="bg-white"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rate">Your hourly rate ($)</Label>
          <Input
            id="rate"
            type="number"
            min="0"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(Number(e.target.value))}
            className="bg-white"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Monthly Canary Cost:</span>
            <span className="font-semibold">${canaryMonthlyPrice}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-600">Your Potential Annual Savings:</span>
            <span className="text-lg font-bold text-green-600">
              ${calculateSavings().toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}