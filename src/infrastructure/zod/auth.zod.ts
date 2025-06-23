import { z } from 'zod';

export const usernameField = z.string({
  required_error: "Username is required",
  invalid_type_error: "Username must be a string"
})
  .min(4, "Username must be at least 4 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid username");

export const emailField = z.string({
  required_error: "Email is required",
  invalid_type_error: "Email must be a string"
}).email("Invalid email format");

export const passwordField = z.string({
  required_error: "Password is required",
  invalid_type_error: "Password must be a string"
})
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must be at most 50 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,50}$/,
    "Invalid password"
  );

export const roleField = z.enum(["USER", "PROVIDER", "ADMIN"] as const, {
  required_error: "Role is required",
  invalid_type_error: "Invalid role"
});

export const limitedRoleField = z.enum(["USER", "PROVIDER"], {
  required_error: "Role is required",
  invalid_type_error: "Invalid role"
});

export const otpField = z.string({
  required_error: "OTP is required",
  invalid_type_error: "OTP must be a string"
}).length(6, "OTP must be exactly 6 characters");

export const verificationTokenField = z.string({
  required_error: "Verification token is required",
  invalid_type_error: "Verification token must be a string"
});

// Regist controller zod validation
const RegisterZodSchema = z.object({
  username: usernameField,
  email: emailField,
  password: passwordField,
  role: limitedRoleField
});

// OTP Verification controller zod validation
const OTPVerificationZodSchema = z.object({
  otp: otpField,
  verificationToken: verificationTokenField,
  role: limitedRoleField
});

// Resend otp controller zod validation
const ResendOTPZodSchema = z.object({
  role: limitedRoleField,
  verificationToken: verificationTokenField.optional(),
  email: emailField.optional()
});

// Login controller zod validation
const LoginZodSchema = z.object({
  email: emailField,
  password: passwordField,
  role: roleField
});

// Update password zod validation
const UpdatePasswordZodSchema = z.object({
  role: limitedRoleField,
  verificationToken: verificationTokenField.optional(),
  password: passwordField
});

export {
    RegisterZodSchema,
    OTPVerificationZodSchema,
    ResendOTPZodSchema,
    LoginZodSchema,
    UpdatePasswordZodSchema
};
