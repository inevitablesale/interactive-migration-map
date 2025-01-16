import { MultiStepForm } from "./deal-sourcer/MultiStepForm";

interface AIDealSourcerFormProps {
  onSubmit?: (data: any) => Promise<void>;
  isLoading?: boolean;
  onSuccess?: () => void;
}

export const AIDealSourcerForm = ({ onSubmit, isLoading, onSuccess }: AIDealSourcerFormProps) => {
  const handleSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  return <MultiStepForm onSuccess={handleSubmit} />;
};