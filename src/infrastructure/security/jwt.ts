import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/env';

const JWT_SECRET = jwtConfig.jwtSecret as string;

export class JWTService {

    static generateToken(payload: object, expiresIn: string = "7d") : string {
        try{
            return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"]});
        }catch(error){
            throw new Error("Access token generation failed.")
        }
    }

    static verifyToken(token: string): jwt.JwtPayload {
        try {
            const decoded = jwt.verify(token, JWT_SECRET as jwt.Secret);
            if (typeof decoded === "string") throw new Error("Invalid token format.");
            return decoded;
        } catch (error) {
            throw new Error("Token Verification failed.")
        }
    }
}