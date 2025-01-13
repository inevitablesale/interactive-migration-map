import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Database, Table, BarChart3, PieChart, LineChart } from "lucide-react";
import { toast } from "sonner";

interface DataSource {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface Visualization {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function QueryBuilderPanel() {
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [selectedVisualization, setSelectedVisualization] = useState<string>("");

  const dataSources: DataSource[] = [
    {
      id: "firms",
      name: "Law Firms",
      description: "Company information and metrics",
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: "county",
      name: "County Data",
      description: "Demographic and economic indicators",
      icon: <Table className="w-4 h-4" />,
    },
  ];

  const visualizations: Visualization[] = [
    {
      id: "bar",
      name: "Bar Chart",
      description: "Compare values across categories",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "pie",
      name: "Pie Chart",
      description: "Show proportions of a whole",
      icon: <PieChart className="w-4 h-4" />,
    },
    {
      id: "line",
      name: "Line Chart",
      description: "Track changes over time",
      icon: <LineChart className="w-4 h-4" />,
    },
  ];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceId = result.draggableId;
    if (!selectedSources.includes(sourceId)) {
      setSelectedSources([...selectedSources, sourceId]);
      toast.success(`Added ${sourceId} to your query`);
    }
  };

  const handleVisualizationSelect = (visId: string) => {
    setSelectedVisualization(visId);
    toast.success(`Selected ${visId} visualization`);
  };

  const handleGenerateReport = () => {
    if (selectedSources.length === 0) {
      toast.error("Please select at least one data source");
      return;
    }
    if (!selectedVisualization) {
      toast.error("Please select a visualization type");
      return;
    }

    // Here we would generate the SQL query based on selections
    toast.success("Generating your report...");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/40 border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Build Your Report</h3>
        
        <div className="space-y-6">
          {/* Data Sources Section */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">1. Choose Your Data</h4>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="data-sources">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid gap-2"
                  >
                    {dataSources.map((source, index) => (
                      <Draggable key={source.id} draggableId={source.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white/5 p-3 rounded-lg cursor-move hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {source.icon}
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {source.name}
                                </div>
                                <div className="text-xs text-white/60">
                                  {source.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Selected Sources */}
          {selectedSources.length > 0 && (
            <div className="bg-blue-500/10 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Selected Sources:</h4>
              <div className="flex gap-2 flex-wrap">
                {selectedSources.map((sourceId) => (
                  <div key={sourceId} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-sm">
                    {dataSources.find(s => s.id === sourceId)?.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visualization Section */}
          <div>
            <h4 className="text-sm font-medium text-white mb-2">2. Choose Visualization</h4>
            <div className="grid grid-cols-3 gap-2">
              {visualizations.map((vis) => (
                <button
                  key={vis.id}
                  onClick={() => handleVisualizationSelect(vis.id)}
                  className={`p-3 rounded-lg text-left transition-colors ${
                    selectedVisualization === vis.id
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-white/5 hover:bg-white/10 text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {vis.icon}
                    <span className="text-sm font-medium">{vis.name}</span>
                  </div>
                  <p className="text-xs text-white/60">{vis.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            disabled={selectedSources.length === 0 || !selectedVisualization}
          >
            Generate Report
          </Button>
        </div>
      </Card>
    </div>
  );
}