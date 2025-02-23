import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get('/providers',adminController.getAllProviders);

export default router;