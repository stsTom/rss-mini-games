import { describe, expect, it } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validatePasswordLength,
  validateUsername,
} from '../../../../src/shared/features/auth-dialog/validation.js';

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('jane@example.com')).toBe('');
    expect(validateEmail('a.b@mail.example.org')).toBe('');
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('')).not.toBe('');
    expect(validateEmail('jane@')).not.toBe('');
    expect(validateEmail('jane@example')).not.toBe('');
    expect(validateEmail('jane example@x.com')).not.toBe('');
  });
});

describe('validatePasswordLength', () => {
  it('requires at least 6 characters', () => {
    expect(validatePasswordLength('12345')).not.toBe('');
    expect(validatePasswordLength('123456')).toBe('');
  });
});

describe('validatePassword', () => {
  it('reports short passwords first', () => {
    expect(validatePassword('A1!')).toContain('at least 6');
  });

  it('requires capital, digit and special character', () => {
    expect(validatePassword('password1!')).toContain('capital');
    expect(validatePassword('Password!!')).toContain('digit');
    expect(validatePassword('Password11')).toContain('special');
  });

  it('accepts a strong password', () => {
    expect(validatePassword('Passw0rd!')).toBe('');
  });
});

describe('validateUsername', () => {
  it('validates each rule', () => {
    expect(validateUsername('')).toContain('nickname');
    expect(validateUsername('jane')).toContain('capital');
    expect(validateUsername('J')).toContain('at least 2');
    expect(validateUsername(`J${'a'.repeat(30)}`)).toContain('exceed');
    expect(validateUsername('Jane')).toBe('');
  });
});
