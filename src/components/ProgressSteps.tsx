import { Check } from 'lucide-react';
interface ProgressStepsProps {
  currentStep: number;
  steps: string[];
}
export const ProgressSteps = ({
  currentStep,
  steps
}: ProgressStepsProps) => {
  return <div className="flex items-center justify-center mb-8 bg-[sidebar-item-active-bg] rounded-none bg-transparent">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        return <div key={index} className="flex items-center bg-[sidebar-item-active-text] bg-transparent">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${isCompleted ? 'bg-residuall-green' : isCurrent ? 'bg-residuall-orange' : 'bg-gray-300'}`}>
                  {isCompleted ? <Check size={16} /> : stepNumber}
                </div>
                <span className={`ml-2 text-sm font-medium ${isCompleted ? 'text-residuall-green' : isCurrent ? 'text-residuall-orange' : 'text-gray-600'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && <div className={`w-12 h-0.5 ml-4 ${isCompleted ? 'bg-residuall-green' : 'bg-gray-300'}`}></div>}
            </div>;
      })}
      </div>
    </div>;
};