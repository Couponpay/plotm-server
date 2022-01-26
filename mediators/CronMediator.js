let CronMediator = function () { };
import ApiMessages from "../config/ApiMessages";
import CommonController from "../controllers/CommonController";
import CronController from "../controllers/CronController";

CronMediator.Pending_Bank_Transfer_Update_Statuses = async (req, res) => {
    try {
        if (
            req.body.SECRETCODE != null && req.body.SECRETCODE != ''
        ) {
            let ValidityStatus = await CommonController.Check_for_Secret_Code(req.body);
            res.json({ success: true, extras: { Status: "Processing Started" } });
            let ProcessingStatus = await CronController.Pending_Bank_Transfer_Update_Statuses();
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

CronMediator.Pending_Recharge_Update_Statuses = async (req, res) => {
    try {
        if (
            req.body.SECRETCODE != null && req.body.SECRETCODE != ''
        ) {
            let ValidityStatus = await CommonController.Check_for_Secret_Code(req.body);
            res.json({ success: true, extras: { Status: "Processing Started" } });
            let ProcessingStatus = await CronController.Pending_Recharge_Update_Statuses();
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

CronMediator.Expired_Pending_Referral_Account = async (req, res) => {
    try {
        if (
            req.body.SECRETCODE != null && req.body.SECRETCODE != ''
        ) {
            let ValidityStatus = await CommonController.Check_for_Secret_Code(req.body);
            res.json({ success: true, extras: { Status: "Processing Started" } });
            let ProcessingStatus = await CronController.Expired_Pending_Referral_Account();
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

CronMediator.Trimming_Amount_Distribution = async (req, res) => {
    try {
        if (
            req.body.SECRETCODE != null && req.body.SECRETCODE != ''
        ) {
            let ValidityStatus = await CommonController.Check_for_Secret_Code(req.body);
            res.json({ success: true, extras: { Status: "Processing Started" } });
            let ProcessingStatus = await CronController.Trimming_Amount_Distribution();
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


export default CronMediator;