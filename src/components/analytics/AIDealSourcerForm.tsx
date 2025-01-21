import { MultiStepForm } from "./deal-sourcer/MultiStepForm";

interface AIDealSourcerFormProps {
  onSuccess?: () => void;
}

export const AIDealSourcerForm = ({ onSuccess }: AIDealSourcerFormProps) => {
  return <MultiStepForm onSuccess={onSuccess} />;
};