import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { userController } from "./user.controller";

const router = Router();


export default router;