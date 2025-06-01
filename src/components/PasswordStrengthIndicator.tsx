
import { validatePassword, getPasswordStrengthColor, getPasswordStrengthText } from '@/utils/passwordValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showErrors?: boolean;
}

export const PasswordStrengthIndicator = ({ password, showErrors = true }: PasswordStrengthIndicatorProps) => {
  const validation = validatePassword(password);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Força da senha:</span>
        <span className={`text-sm font-medium ${getPasswordStrengthColor(validation.strength)}`}>
          {getPasswordStrengthText(validation.strength)}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            validation.strength === 'weak' ? 'bg-red-500 w-1/3' :
            validation.strength === 'medium' ? 'bg-yellow-500 w-2/3' :
            'bg-green-500 w-full'
          }`}
        />
      </div>

      {showErrors && validation.errors.length > 0 && (
        <div className="space-y-1">
          {validation.errors.map((error, index) => (
            <p key={index} className="text-xs text-red-600">
              • {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
