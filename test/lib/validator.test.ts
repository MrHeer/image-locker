import { beforeEach, describe, expect, test } from 'vitest';
import { validators } from '../../src/lib';

describe('string validator', () => {
  let validator: validators.StringValidator;
  beforeEach(() => {
    validator = validators.string();
  });

  test('should be required', () => {
    validator.isRequired();
    expect(() => validator.validate('')).toThrowError('Required');
  });

  test('should be at least 6 characters', () => {
    validator.min(6);
    expect(() => validator.validate('test')).toThrowError(
      'Must be at least 6 characters.',
    );
  });

  test('should be at most 6 characters', () => {
    validator.max(6);
    expect(() => validator.validate('testtest')).toThrowError(
      'Must be at most 6 characters.',
    );
  });

  test('should be satisfy regex', () => {
    validator.regex(/^[A-Za-z0-9]+$/);
    expect(() => validator.validate('test-test')).toThrowError('Invalid');
  });

  test('should be satisfy all rules', () => {
    validator
      .isRequired()
      .min(6)
      .max(12)
      .regex(/^[A-Za-z0-9]+$/);
    expect(validator.validate('testtest')).toBe('testtest');
  });
});
