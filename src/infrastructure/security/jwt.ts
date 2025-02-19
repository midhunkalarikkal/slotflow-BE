import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/env';

const JWT_SECRET = jwtConfig.jwtSecret as string;

export class JWTService {
    static generateJwtToken(payload: object, expiresIn: string = "5m"): string {
        return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
    }

    static verifyJwtToken(token: string): jwt.JwtPayload | null {
        try {
            const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret);
            return typeof decoded === "string" ? null : decoded;
        } catch (error) {
            return null;
        }
    }
}