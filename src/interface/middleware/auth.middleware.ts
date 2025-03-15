import { NextFunction, Request, Response } from "express";
import { JWTService } from "../../infrastructure/security/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies.token;
  const currentTime = Date.now();

  if (!token) {
    console.log("working")
    res.status(401).json({ success: false, message: "Unauthorized, no token." });
    return;
  }

  try {
    const decoded = JWTService.verifyToken(token);
    console.log("decoded token : ",token);
    console.log("decoded token : ",decoded);
    if (decoded && decoded.exp && currentTime > decoded.exp * 1000) {
      res.status(401).json({ success: false, message: "Unauthorized: Token expired." });
      return;
    }

    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
  }
};