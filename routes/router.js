import express from "express";
let router = express.Router();
import AppRouter from "./app";
import AdminRouter from "./admin";
import UploadRouter from "./upload";
import CronRouter from "./cron";
import RechargeDaddyRouter from "./rd";
import RazorpayXRouter from "./razorpayx";
import RazorpayRouter from "./razorpay";
import CommonController from "../controllers/CommonController";


//Mobile Applications Apis
router.use('/app', AppRouter);

//Admin Dashboard Api's
router.use('/admin', AdminRouter);

//Cron Router
router.use('/cron', CronRouter);

//Upload Router
router.use('/upload', UploadRouter);

//Drop Total Database Except Admin
router.get('/Drop_All_Collections_Database', CommonController.Drop_All_Collections_Database);

//Recharge Daddy Callback Api
router.use('/RechargeDaddy', RechargeDaddyRouter);

//RazorpayX Callback Api
router.use('/razorpayx', RazorpayXRouter);

//Razorpay Callback Api
router.use('/razorpay', RazorpayRouter);

export default router;