import express from "express";
import RechargeDaddyController from "../controllers/RechargeDaddyController";
const router = express.Router();

router.post('/callback', RechargeDaddyController.CallbackFunctionality);

export default router;