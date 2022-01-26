let DeviceMediator = function () { };

import ApiMessages from "../config/ApiMessages";
import DeviceController from "../controllers/DeviceController";
import CommonController from "../controllers/CommonController";

DeviceMediator.Generate_Device_ID = async (req, res) => {
    try {
        let Result = await DeviceController.Generate_Device_ID();
        res.json(Result);
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

DeviceMediator.Splash_Screen = async (req, res) => {
    try {
        if (
            req.body.DeviceID != null && req.body.DeviceID != ''
            && req.body.DeviceType != null && isFinite(req.body.DeviceType)
            && req.body.DeviceName != null && req.body.DeviceName != ''
            && req.body.AppVersion != null && isFinite(req.body.AppVersion)
        ) {
            let ValidityStatus = await DeviceController.Splash_Screen_Validate_Device_Type(req.body);
            let IPAddress = await CommonController.Common_IP_Address(req);
            let DeviceData = await DeviceController.Add_or_Update_Device_And_Get_Device_Information(req.body, IPAddress);
            let Result = await DeviceController.Validate_Splash_Screen_App_Versions_and_Send_Response(req.body, DeviceData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

export default DeviceMediator;