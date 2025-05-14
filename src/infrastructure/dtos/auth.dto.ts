import { User } from "../../domain/entities/user.entity";
import { CommonResponse } from "./common.dto";

// **** Register usec case **** \\
// user or provider register usecase request payload interface
export interface RegisterUseCaseRequestPayload {
    username: string;
    email: string;
    password: string;
    role: string;
}
// user or provider register usecase response interface
export interface RegisterUseCaseResponse extends CommonResponse {
  authUser: {
    verificationToken: string, 
    role: string, 
    token: string
  }
}


// **** OTP Verification use case **** \\
// user or provider OTP Verification usecase request payload interface
export interface OTPVerificationUseCaseRequestPayload {
    otp: string;
    verificationToken: string;
    role: string;
}


// **** Resend OTP use case **** \\
// user or provider Resend use case request payload interface
export interface ResendOtpUseCaseRequestPayload {
    role: string;
    verificationToken?: string;
    email?: string;
}


// **** Login use case **** \\
// user or provider login use case request payload interface
export interface LoginUseCaseRequestPayload {
    email: string;
    password: string;
    role: string;
}
// user or provider login use case response interface
export interface LoginUseCaseResponse extends CommonResponse {
    authUser: { 
        username: string, 
        profileImage: string | null, 
        role: string, 
        token: string, 
        isLoggedIn: boolean, 
        address?: boolean, 
        serviceDetails?: boolean, 
        serviceAvailability?: boolean, 
        approved?: boolean 
    }
}


// **** Update password use case **** \\
// user or provider update password use case request payload interface
export interface UpdatePasswordUseCaseRequestPayload {
    role: string;
    verificationToken: string;
    password: string;
}