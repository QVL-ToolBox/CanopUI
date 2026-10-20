export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NAME_REGEX = /^[\p{L}\p{M}][\p{L}\p{M}'\- ]{0,79}$/u;

export const PASSWORD_MIN_LENGTH = 8;

export const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
export const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
export const PASSWORD_DIGIT_REGEX = /[0-9]/;
export const PASSWORD_SPECIAL_REGEX = /[^A-Za-z0-9]/;

export type CanopPasswordCriterionId = "length" | "uppercase" | "lowercase" | "digit" | "special";

export interface CanopPasswordCriterion {
  id: CanopPasswordCriterionId;
  test: (value: string) => boolean;
}

export const PASSWORD_CRITERIA: CanopPasswordCriterion[] = [
  { id: "length", test: (value) => value.length >= PASSWORD_MIN_LENGTH },
  { id: "uppercase", test: (value) => PASSWORD_UPPERCASE_REGEX.test(value) },
  { id: "lowercase", test: (value) => PASSWORD_LOWERCASE_REGEX.test(value) },
  { id: "digit", test: (value) => PASSWORD_DIGIT_REGEX.test(value) },
  { id: "special", test: (value) => PASSWORD_SPECIAL_REGEX.test(value) },
];

export interface CanopPasswordCriterionState {
  id: CanopPasswordCriterionId;
  passed: boolean;
}

export function passwordCriteriaState(value: string): CanopPasswordCriterionState[] {
  return PASSWORD_CRITERIA.map((criterion) => ({
    id: criterion.id,
    passed: criterion.test(value),
  }));
}

export function passwordStrength(value: string): number {
  return PASSWORD_CRITERIA.reduce(
    (count, criterion) => (criterion.test(value) ? count + 1 : count),
    0,
  );
}

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function isValidName(value: string): boolean {
  return NAME_REGEX.test(value);
}

export function isValidPassword(value: string): boolean {
  return PASSWORD_CRITERIA.every((criterion) => criterion.test(value));
}
