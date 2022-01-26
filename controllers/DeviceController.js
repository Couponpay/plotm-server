let DeviceController = function () { };
//Dependencies
import uuid from "uuid";
import moment from "moment";

//Models
import Devices from "../models/Devices";
import ApiMessages from "../config/ApiMessages";
import Installed_Devices from "../models/Installed_Devices";
import CommonController from "./CommonController";

DeviceController.Validate_Splash_Screen_App_Versions_and_Send_Response = (values, DeviceData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let DeviceType = parseInt(values.DeviceType) || 3;
                let AppVersion = parseFloat(values.AppVersion) || 1;
                if (DeviceType == 3) {
                    resolve({ success: true, extras: { Status: "Device Splash Screen Completed Successfully", ApiKey: DeviceData.ApiKey, Whether_Latest_Version: true } })
                } else {
                    let VersionData = await CommonController.Common_Register_or_Get_App_versions();
                    let CheckingVersion = (DeviceType == 1) ? VersionData.Android_Version : VersionData.IOS_Version;
                    let Whether_Latest_Version = (AppVersion >= CheckingVersion) ? true : false;
                    resolve({ success: true, extras: { Status: "Device Splash Screen Completed Successfully", ApiKey: DeviceData.ApiKey, Whether_Latest_Version: Whether_Latest_Version } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

DeviceController.Add_or_Update_Device_And_Get_Device_Information = (values, IPAddress) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ApiKey = uuid.v4();
                let DeviceType = parseInt(values.DeviceType) || 3;
                let Interval = parseInt(moment().utcOffset(330).format('kk'));
                let fndupdquery = {
                    DeviceID: values.DeviceID
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        DeviceType: DeviceType,
                        DeviceName: values.DeviceName,
                        InstallTime: new Date(),
                        Interval: Interval,
                        created_at: new Date()
                    },
                    $set: {
                        ApiKey: ApiKey,
                        AppVersion: values.AppVersion,
                        IPAddress: IPAddress,
                        updated_at: new Date()
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let DeviceData = await Devices.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve(DeviceData);
                if (DeviceType == 1 || DeviceType == 2) {
                    let InstalledDeviceData = await Installed_Devices.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


DeviceController.Splash_Screen_Validate_Device_Type = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let DeviceType = parseInt(values.DeviceType) || 3;
                if (DeviceType == 1 || DeviceType == 2 || DeviceType == 3) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_DEVICE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

DeviceController.Generate_Device_ID = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let DeviceID = uuid.v4();
                resolve({ success: true, extras: { DeviceID: DeviceID } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

export default DeviceController;