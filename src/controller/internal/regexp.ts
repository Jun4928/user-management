export const FOUR_DIGITS_YEAR = /^\d{4}$/;

export const PASSWORD =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{12,}$/;

export const PASSWORD_DETAILS = {
  ALPHABETICAL: [/(?=.*[A-Za-z])/, "At least one alphabetical character"],
  ONE_DIGIT: [/(?=.*\d)/, "At least one digit"],
  SPECIAL_CHARACTER: [/(?=.*[@$!%*#?&])/, "At least one special character"],
  LENGTH: [/^[A-Za-z\d@$!%*#?&]{12,}$/, "At least 12 characters"],
} as Record<string, [RegExp, string]>;
