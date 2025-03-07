import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../infrastructure/security/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  console.log("authenticating")
    const token = req.cookies.token;
    console.log("token : ",token);
    if (!token) {
      res.status(401).json({ success: false, message: "Unauthorized, no token." });
      return;
    }
  
    try {
      console.log("decoding")
      const decoded = JWTService.verifyToken(token);
      (req as any).user = decoded;
      console.log("authorised");
      next();
    } catch (error) {
      console.log("unauthorized");
      res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
    }
  };