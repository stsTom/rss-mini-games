const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const CAPITAL_REGEX = /[A-Z]/;
const DIGIT_REGEX = /\d/;
const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9]/;

export function validateEmail(value: string): string {
  return EMAIL_REGEX.test(value) ? '' : 'Please, enter a valid email address';
}

export function validatePassword(value: string): string {
  const passwordLengthValidationResult = validatePasswordLength(value);

  if (passwordLengthValidationResult) {
    return passwordLengthValidationResult;
  }

  if (!CAPITAL_REGEX.test(value) || !DIGIT_REGEX.test(value) || !SPECIAL_CHAR_REGEX.test(value)) {
    return 'Password must contain at least 1 capital letter, 1 digit and 1 special character';
  }

  return '';
}

export function validatePasswordLength(value: string) {
  if (value.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  return '';
}

export function validateUsername(value: string): string {
  if (value === '') {
    return 'Please, enter your nickname';
  }

  if (!/^[A-Z]/.test(value)) {
    return 'Username should start with a capital letter';
  }

  if (value.length < 2) {
    return 'Username should be at least 2 characters long';
  }

  if (value.length > 30) {
    return 'Username cannot exceed 30 characters';
  }

  return '';
}
