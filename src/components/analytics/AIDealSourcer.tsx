import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AIDealSourcerForm } from "./AIDealSourcerForm";

export interface AIDealSourcerProps {
  embedded?: boolean;
}

export function AIDealSourcer({ embedded = false }: AIDealSourcerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/analysis');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${embedded ? 'p-0' : 'p-6'}`}>
      <div className="max-w-2xl mx-auto">
        {!embedded && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              AI Deal Sourcer
            </h2>
            <p className="text-gray-400">
              Let our AI analyze your target market criteria and find the perfect opportunities.
            </p>
          </div>
        )}
        <AIDealSourcerForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}