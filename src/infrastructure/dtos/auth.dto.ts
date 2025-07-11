import { Types } from "mongoose";
import { CommonResponse } from "./common.dto";

// **** Register usec case **** \\
// user or provider register usecase request payload interface
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    role: string;
}
// user or provider register usecase response interface
export interface RegisterResponse extends CommonResponse {
  authUser: {
    verificationToken: string, 
    role: string, 
    token: string
  }
}


// **** OTP Verification use case **** \\
// user or provider OTP Verification usecase request payload interface
export interface OTPVerificationRequest {
    otp: string;
    verificationToken: string;
    role: string;
}


// **** Resend OTP use case **** \\
// user or provider Resend use case request payload interface
export interface ResendOtpRequest {
    role: string;
    verificationToken?: string;
    email?: string;
}


// **** Login use case **** \\
// user or provider login use case request payload interface
export interface LoginRequest {
    email: string;
    password: string;
    role: string;
}
// user or provider login use case response interface
export interface LoginResponse extends CommonResponse {
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
export interface UpdatePasswordRequest {
    role: string;
    verificationToken: string;
    password: string;
}


// **** Check status **** \\
// check user status use case request payload interface
export interface CheckUserStatusRequest {
    id: Types.ObjectId;
    role: string;
}
// check user status use case response interface
export interface CheckUserStatusResponse extends CommonResponse {
    status: number;
}