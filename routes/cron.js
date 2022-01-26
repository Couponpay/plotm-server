import express from "express";
import CronMediator from "../mediators/CronMediator";
const router = express.Router();

router.post('/Expired_Pending_Referral_Account', CronMediator.Expired_Pending_Referral_Account);

router.post('/Trimming_Amount_Distribution', CronMediator.Trimming_Amount_Distribution);

router.post('/Pending_Recharge_Update_Statuses', CronMediator.Pending_Recharge_Update_Statuses);

router.post('/Pending_Bank_Transfer_Update_Statuses', CronMediator.Pending_Bank_Transfer_Update_Statuses);

export default router;