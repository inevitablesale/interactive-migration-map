import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QueryPreviewProps {
  data?: any[];
  type: string;
}

export function QueryPreview({ data, type }: QueryPreviewProps) {
  if (!data) return null;

  const renderVisualization = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#000000dd',
                  border: '1px solid #ffffff20',
                  borderRadius: '4px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
      // Add other visualization types here
      default:
        return null;
    }
  };

  return (
    <Card className="p-6 bg-black/40 border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
      {renderVisualization()}
    </Card>
  );
}