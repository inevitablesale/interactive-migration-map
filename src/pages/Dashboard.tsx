import { LayoutDashboard } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-2 mb-8">
        <LayoutDashboard className="w-6 h-6 text-blue-500" />
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Content will go here based on your needs */}
      </div>
    </div>
  );
}