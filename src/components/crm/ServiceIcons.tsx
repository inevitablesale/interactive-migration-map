import { 
  DollarSign, 
  Clipboard, 
  Calculator, 
  Users, 
  Lightbulb, 
  Briefcase, 
  PiggyBank, 
  ChartBar, 
  Search, 
  Home,
  Scale,
  Shield,
  FileText,
  Handshake,
  BarChart,
  Heart,
  Lock,
  Wallet,
  Star,
  ChevronDown,
  LucideIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const serviceIconMap: Record<string, LucideIcon> = {
  "tax": DollarSign,
  "accounting": Calculator,
  "bookkeeping": Calculator,
  "payroll": Users,
  "advisory": Lightbulb,
  "consulting": Briefcase,
  "financial": PiggyBank,
  "planning": BarChart,
  "valuation": ChartBar,
  "forensic": Search,
  "estate": Home,
  "litigation": Scale,
  "compliance": Shield,
  "statements": FileText,
  "reporting": FileText,
  "reviews": FileText,
  "risk": Shield,
  "controls": Lock,
  "mergers": Handshake,
  "acquisitions": Handshake,
  "diligence": Search,
  "non-profit": Heart,
  "healthcare": Heart,
  "wealth": Wallet,
  "retirement": PiggyBank,
  "strategic": Star,
  "management": Briefcase,
  "audit": Clipboard,
  "analytics": ChartBar,
  "analysis": ChartBar
};

interface ServiceIconsProps {
  specialities?: string;
}

export function ServiceIcons({ specialities }: ServiceIconsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!specialities) return null;

  const services = specialities.split(',').map(s => s.trim().toLowerCase());
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-2">
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 h-8 text-sm text-white/60 hover:text-white/80 transition-colors"
        >
          View Services
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform duration-200 ${
            isOpen ? "transform rotate-180" : ""
          }`}/>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="flex flex-wrap gap-2">
          {services.map((service, index) => {
            const iconKey = Object.keys(serviceIconMap).find(key => service.includes(key));
            const Icon = iconKey ? serviceIconMap[iconKey] : Star;

            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="p-1.5 bg-black/20 rounded-md cursor-help hover:bg-black/30 transition-colors">
                      <Icon className="h-4 w-4 text-white/60" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{service}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}