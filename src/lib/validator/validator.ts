import { type Rule, type Validator } from './types';

export class DefaultValidator<T> implements Validator<T> {
  private rules: Rule<T>[] = [];

  add(rule: Rule<T>): Validator<T> {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): T {
    this.rules.forEach((rule) => {
      const message = rule(value);
      if (message) {
        throw new Error(message);
      }
    });
    return value;
  }
}
