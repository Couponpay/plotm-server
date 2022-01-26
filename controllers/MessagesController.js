let MessagesController = function () { };

import MSG91Controller from "./MSG91Controller";
import config from "../config/config";
import CommonController from "./CommonController";

MessagesController.Send_OTP_TO_Mobile = (PhoneNumber, OTP) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Message = `Welcome to Dream House, Your OTP for login is  ${OTP}.`;
                let Result = await MessagesController.Find_Default_SMS_Provider_and_Send_SMS(PhoneNumber, Message);
                resolve(Result);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

MessagesController.Find_Default_SMS_Provider_and_Send_SMS = (PhoneNumber, Message) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ProviderData = await CommonController.Common_Find_Default_SMS_Provider();
                if (ProviderData == null) {
                    let Result = await MSG91Controller.Send_SMS(PhoneNumber, Message);
                    resolve(Result);
                } else {
                    if (ProviderData.Service_Type == 1) {
                        //Msg91
                        let Result = await MSG91Controller.Send_SMS(PhoneNumber, Message);
                        resolve(Result);
                    } else {
                        // In future we have to implement other providers
                        let Result = await MSG91Controller.Send_SMS(PhoneNumber, Message);
                        resolve(Result);
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

export default MessagesController;