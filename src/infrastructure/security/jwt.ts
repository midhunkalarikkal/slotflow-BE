import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/env';

const JWT_SECRET = jwtConfig.jwtSecret as string;
const REFRESH_JWT_SECRET = jwtConfig.refreshJwtSecret as string;

export class JWTService {
    static generateJwtToken(payload: object, expiresIn: string = "5m"): string {
        try {
            return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
        } catch (error) {
            throw new Error("Token generation failed.")
        }
    }

    static generateAccessToken(payload: object, expiresIn: string = "15m") : string {
        try{
            return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"]});
        }catch(error){
            throw new Error("Access token generation failed.")
        }
    }

    static generateRefreshToken(payload: object, expiresIn: string = "1d") : string {
        try{
            return jwt.sign(payload, REFRESH_JWT_SECRET as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"]});
        }catch(error){
            throw new Error("Refresh token generation failed.")
        }
    }

    static verifyAccessToken(token: string): jwt.JwtPayload {
        try {
            const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret);
            if (typeof decoded === "string") throw new Error("Invalid token format.");
            return decoded;
        } catch (error) {
            throw new Error("Token Verification failed.")
        }
    }

    static verifyRefreshToken(token: string): jwt.JwtPayload {
        try {
          const decoded = jwt.verify(token, REFRESH_JWT_SECRET as jwt.Secret);
          if (typeof decoded === "string") throw new Error("Invalid refresh token format.");
          return decoded;
        } catch (error) {
          throw new Error("Refresh token verification failed.");
        }
      }
}