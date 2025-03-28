import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './interface/auth/auth.routes';
import userRouter from './interface/user/user.routes';
import adminRoutes from './interface/admin/admin.routes';
import providerRouter from './interface/provider/provider.router';

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(helmet());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use("/api/admin",adminRoutes);
app.use('/api/provider',providerRouter);
app.use('/api/user',userRouter);

export default app;