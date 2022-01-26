import express from "express";
import RechargeDaddyController from "../controllers/RechargeDaddyController";
import RazorpayController from "../controllers/RazorpayController";
const router = express.Router();

router.post('/callback', RazorpayController.CallbackOutFunctionality);

export default router;