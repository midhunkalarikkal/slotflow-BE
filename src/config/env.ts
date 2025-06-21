import dotenv from 'dotenv';

dotenv.config();

export const mongoConfig = {
    port: process.env.MONGODB_PORT || 5000,
    mongoURL : process.env.NODE_ENV === "development" ? process.env.MONGO_URI_DEV : process.env.MONGO_URI 
}

export const mailConfig = {
    user : process.env.OFFICIAL_EMAIL,
    password : process.env.OFFICIALEMAIL_PASS
}

export const jwtConfig = {
    jwtSecret : process.env.JWT_SECRET,
    refreshJwtSecret : process.env.REFRES_JWT_SECRET
}

export const appConfig = {
    nodeEnv : process.env.NODE_ENV
}

export const adminConfig = {
    adminEmail : process.env.ADMIN_EMAIL,
    adminPassword : process.env.ADMIN_PASSWORD
}

export const aws_s3Config = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
}