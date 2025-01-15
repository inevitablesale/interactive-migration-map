import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

// State abbreviation to full name mapping
const stateMap: { [key: string]: string } = {
  'AL': 'Alabama',
  'AK': 'Alaska',
  'AZ': 'Arizona',
  'AR': 'Arkansas',
  'CA': 'California',
  'CO': 'Colorado',
  'CT': 'Connecticut',
  'DE': 'Delaware',
  'FL': 'Florida',
  'GA': 'Georgia',
  'HI': 'Hawaii',
  'ID': 'Idaho',
  'IL': 'Illinois',
  'IN': 'Indiana',
  'IA': 'Iowa',
  'KS': 'Kansas',
  'KY': 'Kentucky',
  'LA': 'Louisiana',
  'ME': 'Maine',
  'MD': 'Maryland',
  'MA': 'Massachusetts',
  'MI': 'Michigan',
  'MN': 'Minnesota',
  'MS': 'Mississippi',
  'MO': 'Missouri',
  'MT': 'Montana',
  'NE': 'Nebraska',
  'NV': 'Nevada',
  'NH': 'New Hampshire',
  'NJ': 'New Jersey',
  'NM': 'New Mexico',
  'NY': 'New York',
  'NC': 'North Carolina',
  'ND': 'North Dakota',
  'OH': 'Ohio',
  'OK': 'Oklahoma',
  'OR': 'Oregon',
  'PA': 'Pennsylvania',
  'RI': 'Rhode Island',
  'SC': 'South Carolina',
  'SD': 'South Dakota',
  'TN': 'Tennessee',
  'TX': 'Texas',
  'UT': 'Utah',
  'VT': 'Vermont',
  'VA': 'Virginia',
  'WA': 'Washington',
  'WV': 'West Virginia',
  'WI': 'Wisconsin',
  'WY': 'Wyoming'
};

export function MarketHighlights() {
  const navigate = useNavigate();

  const handleRowClick = (region: string) => {
    try {
      if (region.includes(",")) {
        // For format like "Helena, MT"
        const [city, stateAbbr] = region.split(",").map(s => s.trim());
        const stateName = stateMap[stateAbbr] || stateAbbr;
        // Helena is in Lewis and Clark County
        navigate(`/market-report/Lewis%20and%20Clark%20County/${stateName}`);
      } else if (region.includes("County")) {
        // For format like "Jefferson County"
        navigate(`/market-report/${encodeURIComponent(region)}/${stateMap['MT']}`);
      } else {
        // For single state names, convert if it's an abbreviation
        const stateName = stateMap[region] || region;
        navigate(`/state-market-report/${stateName}`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      toast.error("Unable to navigate to the selected market report");
    }
  };

  return (
    <Card className="col-span-3">
      <Tabs defaultValue="growth" className="p-6">
        <TabsList className="mb-4">
          <TabsTrigger value="growth">Growth Markets</TabsTrigger>
          <TabsTrigger value="underserved">Underserved Markets</TabsTrigger>
          <TabsTrigger value="affordable">Affordable Talent Hubs</TabsTrigger>
        </TabsList>
        <TabsContent value="growth">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Growth Rate</TableHead>
                <TableHead>Firm Density</TableHead>
                <TableHead>Total Firms</TableHead>
                <TableHead>Population</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Helena, MT")}>
                <TableCell className="font-medium">Helena, MT</TableCell>
                <TableCell>8.2%</TableCell>
                <TableCell>12.3</TableCell>
                <TableCell>245</TableCell>
                <TableCell>85,000</TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Jefferson County")}>
                <TableCell className="font-medium">Jefferson County</TableCell>
                <TableCell>7.5%</TableCell>
                <TableCell>10.8</TableCell>
                <TableCell>180</TableCell>
                <TableCell>65,000</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="underserved">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Firms per 10k</TableHead>
                <TableHead>Recent Movers</TableHead>
                <TableHead>Market Status</TableHead>
                <TableHead>Opportunity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Gallatin County")}>
                <TableCell className="font-medium">Gallatin County</TableCell>
                <TableCell>5.2</TableCell>
                <TableCell>12,500</TableCell>
                <TableCell>Underserved</TableCell>
                <TableCell>High</TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Missoula County")}>
                <TableCell className="font-medium">Missoula County</TableCell>
                <TableCell>6.8</TableCell>
                <TableCell>8,900</TableCell>
                <TableCell>Growing</TableCell>
                <TableCell>Medium</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="affordable">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Region</TableHead>
                <TableHead>Median Rent</TableHead>
                <TableHead>Accountant Density</TableHead>
                <TableHead>Vacancy Rate</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Lewis and Clark County")}>
                <TableCell className="font-medium">Lewis and Clark County</TableCell>
                <TableCell>$1,200</TableCell>
                <TableCell>8.5</TableCell>
                <TableCell>4.2%</TableCell>
                <TableCell>85</TableCell>
              </TableRow>
              <TableRow className="cursor-pointer hover:bg-gray-100/5" onClick={() => handleRowClick("Flathead County")}>
                <TableCell className="font-medium">Flathead County</TableCell>
                <TableCell>$1,350</TableCell>
                <TableCell>7.2</TableCell>
                <TableCell>3.8%</TableCell>
                <TableCell>82</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </Card>
  );
}