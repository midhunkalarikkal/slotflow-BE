import dotenv from 'dotenv';

dotenv.config();

export const mongoConfig = {
    port: process.env.MONGODB_PORT || 5000,
    mongoURL : process.env.MONGO_URI 
}

export const mailConfig = {
    user : process.env.OFFICIAL_EMAIL,
    password : process.env.OFFICIALEMAIL_PASS
}

export const jwtConfig = {
    jwtSecret : process.env.JWT_SECRET
}

export const appConfig = {
    nodeEnv : process.env.NODE_ENV
}