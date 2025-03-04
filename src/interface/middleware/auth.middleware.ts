import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../infrastructure/security/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];
  
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized, no token." });
      return;
    }
  
    try {
      const decoded = JWTService.verifyAccessToken(token);
      (req as any).user = decoded;
      console.log("authorised");
      next();
    } catch (error) {
      console.log("unauthorized");
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
    }
  };