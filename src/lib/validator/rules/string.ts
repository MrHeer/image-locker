import { type Rule } from '../types';

function isRequired(message?: string): Rule<string> {
  return (value: string) => {
    if (value.length === 0) {
      return message ?? 'Required.';
    }
    return null;
  };
}

function min(minLength: number, message?: string): Rule<string> {
  return (value: string) => {
    if (value.length < minLength) {
      return message ?? `Must be at least ${minLength} characters.`;
    }
    return null;
  };
}

function max(maxLength: number, message?: string): Rule<string> {
  return (value: string) => {
    if (value.length > maxLength) {
      return message ?? `Must be at most ${maxLength} characters.`;
    }
    return null;
  };
}

function regex(re: RegExp, message?: string): Rule<string> {
  return (value: string) => {
    if (!re.test(value)) {
      return message ?? 'Invalid.';
    }
    return null;
  };
}

export { isRequired, min, max, regex };
