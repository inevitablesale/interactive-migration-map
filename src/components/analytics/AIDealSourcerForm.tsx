import { MultiStepForm } from "./deal-sourcer/MultiStepForm";

interface AIDealSourcerFormProps {
  onSubmit?: (data: any) => Promise<void>;
  isLoading?: boolean;
  onSuccess?: () => void;
  embedded?: boolean;
}

export const AIDealSourcerForm = ({ onSubmit, isLoading, onSuccess, embedded }: AIDealSourcerFormProps) => {
  const handleSubmit = async (data: any) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  return <MultiStepForm onSuccess={handleSubmit} embedded={embedded} />;
};