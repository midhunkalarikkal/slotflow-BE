import { Request } from "express";

interface DecodedUser {
    userOrProviderId?: string;
    role?: string;
    token?: string;
    verificationToken?: string;
    email?: string;
    exp?: number;
    iat?: number;
}

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser;
        }
    }
}