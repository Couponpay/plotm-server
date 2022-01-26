let FcmController = function () { };


import FCM from "fcm-push";


import ApiMessages from "../config/ApiMessages";
import config from "../config/config.js";

let fcm = new FCM(config.firebase.serverkey);


FcmController.Send_App_Notification = (Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            let NotificationFnction = (Data) => {
                return new Promise((resolve, reject) => {
                    setImmediate(async () => {
                        let msg = {
                            to: Data.token,
                            collapse_key: 'your_collapse_key',
                            priority: 'high',
                            data: Data.data,
                            notification: {
                                title: Data.title,
                                body: Data.body,
                                sound: "default",
                                alert: "true",
                                vibrate: true,
                                badge: 1
                            }
                        }
                        fcm.send(msg).then((Result) => {
                            resolve("sent notification")
                        }).catch((error) => {
                            console.error("Notification Error");
                            console.error(error);
                            resolve("notification error")
                        })
                    })
                })
            }
            NotificationFnction(Data).then((Result) => {
                resolve("notification sent successfully")
            })
        })
    })
}

export default FcmController;