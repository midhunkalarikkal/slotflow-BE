import { z } from 'zod';

const RegisterZodSchema = z.object({
    username: z.string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string"
    })
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z\s]{4,30}$/, "Invalid username"),
    
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string"
    }).email("Invalid email format"),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    })
    .min(8, "Password must be at least 8 characters")
    .max(50,"Password must be at most 50 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,50}$/,"Invalid password"),

    role: z.enum(["USER", "PROVIDER"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role"
    })
});

const OTPVerificationZodSchema = z.object({
    otp: z.string({
        required_error: "OTP is required",
        invalid_type_error: "OTP must be a string"
    }).length(6, "OTP must be exactly 6 characters"),

    verificationToken: z.string({
        required_error: "Verification token is required",
        invalid_type_error: "Verification token must be a string"
    }),

    role: z.enum(["USER", "PROVIDER"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role"
    })
});

const ResendOTPZodSchema = z.object({
    role: z.enum(["USER", "PROVIDER"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role"
    }),

    verificationToken: z.string({
        invalid_type_error: "Verification token must be a string"
    }).optional(),

    email: z.string({
        invalid_type_error: "Email must be a string"
    }).email("Invalid email format").optional()
});

const LoginZodSchema = z.object({
    email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string"
    }).email("Invalid email format"),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    }).min(8, "Password must be at least 8 characters"),

    role: z.enum(["USER", "PROVIDER", "ADMIN"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role"
    })
});

const UpdatePasswordZodSchema = z.object({
    role: z.enum(["USER", "PROVIDER"], {
        required_error: "Role is required",
        invalid_type_error: "Invalid role"
    }),

    verificationToken: z.string({
        invalid_type_error: "Verification token must be a string"
    }).optional(),

    password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string"
    }).min(8, "Password must be at least 8 characters")
});

export {
    RegisterZodSchema,
    OTPVerificationZodSchema,
    ResendOTPZodSchema,
    LoginZodSchema,
    UpdatePasswordZodSchema
};
