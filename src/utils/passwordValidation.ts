
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // Minimum length check
  if (password.length < 8) {
    errors.push('A senha deve ter pelo menos 8 caracteres');
  }

  // Character type checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!hasLowerCase) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!hasNumbers) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!hasSpecialChar) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  // Calculate strength
  const criteriaCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
  
  if (password.length >= 12 && criteriaCount >= 3) {
    strength = 'strong';
  } else if (password.length >= 8 && criteriaCount >= 2) {
    strength = 'medium';
  }

  // Common password checks
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123'];
  if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
    errors.push('A senha não pode conter sequências comuns');
    strength = 'weak';
  }

  return {
    isValid: errors.length === 0 && password.length >= 8,
    errors,
    strength
  };
};

export const getPasswordStrengthColor = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'strong': return 'text-green-500';
    default: return 'text-gray-500';
  }
};

export const getPasswordStrengthText = (strength: 'weak' | 'medium' | 'strong'): string => {
  switch (strength) {
    case 'weak': return 'Fraca';
    case 'medium': return 'Média';
    case 'strong': return 'Forte';
    default: return '';
  }
};
