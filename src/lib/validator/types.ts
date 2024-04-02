type Message = string;

type Result = null | Message;

type Rule<T> = (value: T) => Result;

interface Validator<T> {
  add: (rule: Rule<T>) => Validator<T>;
  validate: (value: T) => T;
}

export type { Rule, Validator };
