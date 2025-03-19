import { Request } from "express";

export interface DecodedUser {
    userOrProviderId: string;
    role: string;
    exp: number;
    iat: number;
}

// Extend the Request interface
declare global {
    namespace Express {
        interface Request {
            user: DecodedUser;
        }
    }
}