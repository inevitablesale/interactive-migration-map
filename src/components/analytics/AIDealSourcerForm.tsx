import { MultiStepForm } from "./deal-sourcer/MultiStepForm";

export const AIDealSourcerForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  return <MultiStepForm onSuccess={onSuccess} />;
};