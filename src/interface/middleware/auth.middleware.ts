import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../infrastructure/security/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    

    if(!token){
        res.status(401).json({ success:false, message: "Unauthorized, no token."});
        return;
    }

    try{
        const decoded = JWTService.verifyJwtToken(token);
        (req as any).user = decoded;
        next();
    }catch(error){
        res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
    }
}