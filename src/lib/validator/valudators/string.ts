import { string as StringRule } from '../rules';
import { type Rule } from '../types';
import { DefaultValidator } from '../validator';

class StringValidator extends DefaultValidator<string> {
  protected _add(rule: Rule<string>): this {
    this.add(rule);
    return this;
  }

  isRequired(message?: string): this {
    const rule = StringRule.isRequired(message);
    return this._add(rule);
  }

  min(minLength: number, message?: string): this {
    const rule = StringRule.min(minLength, message);
    return this._add(rule);
  }

  max(maxLength: number, message?: string): this {
    const rule = StringRule.max(maxLength, message);
    return this._add(rule);
  }

  regex(re: RegExp, message?: string): this {
    const rule = StringRule.regex(re, message);
    return this._add(rule);
  }
}

function string(): StringValidator {
  return new StringValidator();
}

export { StringValidator, string };
