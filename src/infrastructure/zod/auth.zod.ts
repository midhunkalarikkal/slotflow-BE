import { z } from 'zod';

const RegisterZodSchema = z.object({
    username: z.string().min(4).max(25),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["USER", "PROVIDER"])
});

const OTPVerificationZodSchema = z.object({
    otp: z.string().length(6),
    verificationToken: z.string(),
    role: z.enum(["USER", "PROVIDER"])
});

const ResendOTPZodSchema = z.object({
    role: z.enum(["USER", "PROVIDER"]),
    verificationToken: z.string().optional(),
    email: z.string().email().optional(),
});

const LoginZodSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(["USER", "PROVIDER"]),
});

const UpdatePasswordZodSchema = z.object({
    role: z.enum(["USER", "PROVIDER"]),
    verificationToken: z.string().optional(),
    password: z.string().min(8),
});

export { RegisterZodSchema, OTPVerificationZodSchema, ResendOTPZodSchema, LoginZodSchema, UpdatePasswordZodSchema };