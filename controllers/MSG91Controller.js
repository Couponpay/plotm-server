
let MSG91Controller = function () { };
import MSG91 from "msg91";
const axios = require("axios");
import ApiMessages from "../config/ApiMessages.js";
import config from "../config/config.js";
import CommonController from "./CommonController.js";
let msg91 = MSG91(config.msg91.authkey, config.msg91.sender_id, config.msg91.route_no);

MSG91Controller.Send_SMS = (PhoneNumber, Message) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let MessageSent = await msg91.send(PhoneNumber, Message);
                resolve("Message Sent Successfully");
            } catch (error) {
                console.error("MSG91 error----->", error);
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

MSG91Controller.Send_OTP = async (PhoneNumber, OTP) => {
    try {
        console.log(PhoneNumber)
        PhoneNumber = "" + PhoneNumber
        console.log(OTP)
        let options = {
            method: 'get',
            url: `${config.msg91.baseURL}/v5/otp`,
            params: {
                authkey: config.msg91.authkey,
                template_id: config.msg91.otp_template_id,
                extra_param: {
                    OTP: OTP,
                },
                mobile: `${PhoneNumber}`
            }
        };
        console.log("41---->"+JSON.stringify(options))
        let Response = await axios(options);
        if (Response.status == 200 || Response.status == 201) {
            if (Response.data.type === "success") {
                console.log(Response.data)
                return "Message Sent Successfully";
            } else {
                console.log(Response.data)
                return "Message Sent Successfully";
            }
        } else {
            console.log(Response)
            return "Message Sent Successfully";
        }
    } catch (error) {
        console.log(error)
        return "Message Sent Successfully";
    }
}

export default MSG91Controller;