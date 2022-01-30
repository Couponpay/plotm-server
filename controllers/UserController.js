let UserController = function () { };
import uuid from "uuid";
import https from "https";
import ApiMessages from "../config/ApiMessages";
import CommonController from "./CommonController";
import Counters from "../models/Counters";
import ifsc from "ifsc";
import async from "async";
import { isBoolean, Boolify } from "node-boolify";
import moment from "moment";
import numbertowords from "number-to-words";
import config from "../config/config";
import User_OTPS from "../models/User_OTPS";
import MessagesController from "./MessagesController";
import User_OTP_Tries from "../models/User_OTP_Tries";
import Users from "../models/Users";
import User_Wallet_Logs from "../models/User_Wallet_Logs";
import Users_Network from "../models/Users_Network";
import Company_Wallet_Logs from "../models/Company_Wallet_Logs";
import Company_Wallet from "../models/Company_Wallet";
import Trimmer_Wallet_Logs from "../models/Trimmer_Wallet_Logs";
import Trimmer_Wallet from "../models/Trimmer_Wallet";
import Users_Referrals from "../models/Users_Referrals";
import COMMON_SYSTEM_MESSAGES from "../config/COMMON_SYSTEM_MESSAGES";
import User_Pins from "../models/User_Pins";
import User_Pin_Tries from "../models/User_Pin_Tries";
import User_Friend_Money_Requests from "../models/User_Friend_Money_Requests";
import User_Bank_Beneficiary_Accounts from "../models/User_Bank_Beneficiary_Accounts";
import User_Bank_Transfers from "../models/User_Bank_Transfers";
import User_Failed_Recharges from "../models/User_Failed_Recharges";
import User_Recharges from "../models/User_Recharges";
import RechargeDaddyController from "./RechargeDaddyController";
import GuideLines from "../models/GuideLines";
import News from "../models/News";
import App_Image_Resources from "../models/App_Image_Resources";
import RazorpayController from "./RazorpayController";
import User_Shop_Pins from "../models/User_Shop_Pins";
import GST_Wallet from "../models/GST_Wallet";
import GST_Wallet_Logs from "../models/GST_Wallet_Logs";
import Subscription from "../models/Subscription";
import Subscription_Log from "../models/Subscription_Log";
import User_Pin_Purchase from "../models/User_Pin_Purchase";
import User_Subscription_Log from "../models/User_Subscription_Log";
import Plots_Log from "../models/Plots_Log";
import YouTube_Links from "../models/YouTube_Links";
import User_Shop_Log from "../models/User_Shop_Log";
import Day_Pins_Log from "../models/Day_Pins_Log";
import Day_Bank_log from "../models/Day_Bank_log";
import crypto from "crypto";
import User_Address from "../models/User_Address";
import Order_Logs from "../models/Order_Logs";
import Orders from "../models/Orders";
import YouTube_Advertisement_Logs from "../models/YouTube_Advertisement_Logs";
import Gift_Meter from "../models/Gift_Meter";
import MSG91Controller from "./MSG91Controller";
import Transfer_OTP from "../models/Transfer_OTP";
import Transfer_OTP_Tries from "../models/Transfer_OTP_Tries";



UserController.List_Subscription_Product = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // Result.User_Amounts.Trimming_Amount 
                let queryUser = {
                    USERID: values.USERID
                }
                let User_data = await Users.findOne(queryUser).lean();

                if (User_data.Subscription_Data != null) {
                    let Sub_query = {
                        SubscriptionID: User_data.Subscription_Data.SubscriptionID,
                        Status: true
                    }
                    let Result = await Subscription.findOne(Sub_query, { Product_Data: 1, Delivery_Compulsory: 1, New_Pin: 1 }).select('-_id ')


                    if(Result!=null){
                    if (Result.Product_Data.Product_Image_Data != null) {
                        Result.Product_Data.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, Result.Product_Data.Product_Image_Data);
                    } else {
                        Result.Product_Data.Product_Image_Data = ""
                    }
                }else{
                    Result = {}
                }
                    console.log("80-----> " + JSON.stringify(Result))
                    resolve({ success: true, extras: { Data: Result } })
                    // resolve(Result)
                }
                console.log("84-----> " )


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



UserController.Withdraw_Roaylty_Amt = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // Result.User_Amounts.Trimming_Amount 
                let queryUser = {
                    USERID: values.USERID
                }
                let User_data = await Users.findOne(queryUser).lean();
                if (User_data.User_Amounts.Trimming_Amount >= values.Amount && values.Amount >= 1000 && values.Amount > 0) {
                    let changes = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Trimming_Amount": values.Amount * -1,
                            "User_Amounts.Available_Withdrawn_Trimming_Amount": values.Amount
                        }
                    }

                    let User_result = await Users.updateOne(queryUser, changes).lean();

                    let SData = {
                        LogID: uuid.v4(),
                        USERID: values.USERID,
                        Type: 32, //Royality Amount Adding to withdraw amt
                        Amount: values.Amount,
                        Data: {
                        },
                        Time: new Date()
                    };
                    let SSaveResult = await User_Wallet_Logs(SData).save();

                    resolve({ success: true, extras: { Status: "Royalty/Trimmer Amount Added to Trimmer Withdrawn Amount" } })
                } else {
                    reject({ success: false, extras: { msg: "User Royalty/Trimmer Amount must be Greater Than Gift Mater Amount" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Withdraw_gift_meter = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Gift_Meter_ID: values.Gift_Meter_ID,
                    Status: true
                }
                let Result = await Gift_Meter.findOne(query).lean().exec();

                if (Result == null) {
                    reject({ success: false, extras: { msg: "Gift Meter Not Exist" } })
                } else {

                    let queryUser = {
                        USERID: values.USERID
                    }
                    let User_data = await Users.findOne(queryUser).lean();
                    if (User_data.User_Amounts.Gift_Amount >= Result.Amount) {
                        let changes = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Gift_Amount": Result.Amount * -1,
                                "User_Amounts.Available_Withdrawn_Gift_Amount": Result.Amount
                            }
                        }

                        let User_result = await Users.updateOne(queryUser, changes).lean();

                        let SData = {
                            LogID: uuid.v4(),
                            USERID: values.USERID,
                            Type: 31, //Gift Amount Adding to withdraw amt
                            Amount: Result.Amount,
                            Data: {
                            },
                            Time: new Date()
                        };
                        let SSaveResult = await User_Wallet_Logs(SData).save();
                        resolve({ success: true, extras: { Status: "Gift Amount Added to Gift Withdrawn Amount" } })
                    } else {
                        reject({ success: false, extras: { msg: "User Gift Amount must be Greater Than Gift Mater Amount" } })
                    }
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Check_User_Level_GiftAmount = (UserData, Result) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let SN = 1

                if (UserData.User_Amounts.Gift_Amount == undefined || UserData.User_Amounts.Gift_Amount == null) {
                    UserData.User_Amounts.Gift_Amount = 0;
                }
                console.log(UserData.User_Amounts.Gift_Amount)
                Result = Result.reverse();
                let Gift_Id = null;
                for (let i = 0; i < Result.length; i++) {
                    var gdata = Result[i];
                    var ldata = Result[i + 1];
                    var Rootdata = Result[0];
                    let next_Amt = gdata.Amount
                    if (ldata != null) {
                        next_Amt = ldata.Amount
                    }

                    if (UserData.User_Amounts.Gift_Amount < Rootdata.Amount && gdata.Is_Root) {
                        console.log(SN, gdata.Amount, gdata.S_NO)
                        Gift_Id = null;
                        console.log(SN, gdata.Amount, gdata.S_NO, Gift_Id)
                        break;
                    }
                    else if (UserData.User_Amounts.Gift_Amount >= gdata.Amount && ldata == null) {
                        console.log(SN, gdata.Amount, gdata.S_NO)
                        Gift_Id = gdata.Gift_Meter_ID;
                        console.log(SN, gdata.Amount, gdata.S_NO, Gift_Id)
                        // break;
                    }
                    else if (UserData.User_Amounts.Gift_Amount >= gdata.Amount && UserData.User_Amounts.Gift_Amount <= next_Amt) {
                        console.log(SN, gdata.Amount, gdata.S_NO)
                        Gift_Id = gdata.Gift_Meter_ID;
                        console.log(SN, gdata.Amount, gdata.S_NO, Gift_Id)
                        // break;
                    }

                    SN++;
                }
                resolve(Gift_Id);

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.List_Gift_Meter = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                // if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                //     sortOptions = values.sortOptions;
                // };
                let query = {
                    Status: true
                };

                let Count = await Gift_Meter.countDocuments(query).lean().exec();
                let Result = await Gift_Meter.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                console.log(UserData.User_Amounts)
                let Level_Check_ID = await UserController.Check_User_Level_GiftAmount(UserData, Result);
                console.log(Level_Check_ID)
                let Lev_Obj = null;
                if (Level_Check_ID != null) {
                    Lev_Obj = Result.filter(function (item) {
                        return item.Gift_Meter_ID == Level_Check_ID;
                    });
                }
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        // console.log(item.Product_Data)
                        let Withdraw_available_status = false;
                        if (item.Gift_Meter_ID == Level_Check_ID) {
                            Withdraw_available_status = true
                        }
                        item.Withdraw_available_status = Withdraw_available_status;
                        if (item.Gift_Meter_Image_Data != null) {
                            item.Gift_Meter_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Gift_Meter_Image_Data);
                        } else {
                            item.Gift_Meter_Image_Data = ""
                        }

                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);



                    resolve({ success: true, extras: { Count: Count, Data: Result, Available_Lev: Lev_Obj } });
                });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Fetch_User_Royality_Information = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let User_query = {
                    USERID: values.USERID
                }
                let Result = await Users.findOne(User_query, { User_Amounts: 1 }).lean().exec();
                let Withdraw_Amt = 0;
                if (Result.User_Amounts.Trimming_Amount < 1000 || Result.User_Amounts.Available_Withdrawn_Trimming_Amount == null) {
                    Result.User_Amounts.Available_Withdrawn_Trimming_Amount = 0
                } else {
                    Withdraw_Amt = Result.User_Amounts.Trimming_Amount / 1000
                    Withdraw_Amt = Math.floor(Withdraw_Amt) * 1000
                    Result.User_Amounts.Available_Withdrawn_Trimming_Amount = Withdraw_Amt
                }
                console.log(Withdraw_Amt)
                // console.log(Result.User_Amounts.Available_Withdrawn_Trimming_Amount)
                // if(Result.User_Amounts.Available_Withdrawn_Trimming_Amount == null) {
                //     Result.User_Amounts.Available_Withdrawn_Trimming_Amount = 0
                // }
                resolve({ success: true, extras: { Data: Result } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



UserController.Inactive_Address = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let User_query = {
                    Address_ID: values.Address_ID,
                    USERID: values.USERID
                }
                let AddressResult = await User_Address.findOne(User_query).lean().exec();
                if (AddressResult == null) {
                    reject({ success: false, extras: { msg: ApiMessages.ADDRESS_NOT_FOUND } });
                } else {

                    let statys;
                    let refund_status;
                    if (AddressResult.Status) {

                        statys = "Inactivated Successfully";
                        let changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                        let SaveResult = await User_Address.updateOne(User_query, changes).lean().exec();

                    } else {
                        statys = "Activated Successfully"
                        let changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }

                        let SaveResult = await User_Address.updateOne(User_query, changes).lean().exec();
                    }

                    resolve({ success: true, extras: { Status: statys } });

                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Advertisements_History = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let query = {
                    Status: true,
                    USERID: values.USERID,
                    User_Type: 2
                };

                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };

                let Count = await YouTube_Links.countDocuments(query).lean().exec();
                let Result = await YouTube_Links.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                async.eachSeries(Result, async (item, callback) => {
                    try {
                        // console.log(item.Product_Information.Product_Image_Data)
                        item.Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Image_Data);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });

                // resolve({ success: true, extras: { Count: Count, Data: Result } });


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Orders_History = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let query = {
                    Status: true,
                    USERID: values.USERID,
                };

                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };

                let Count = await Orders.countDocuments(query).lean().exec();
                let Result = await Orders.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        // console.log(item.Product_Information.Product_Image_Data)
                        item.Product_Information.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Product_Information.Product_Image_Data);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });




            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


//Advertisement details
UserController.Add_Advertisement = (values, UserData, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // console.log(ImageData, values.YouTube_Link, "hello")
                let No_of_Views = 0
                if ((+values.Ad_Amount) >= config.Min_Advertisement_Amount) {
                    No_of_Views = (+values.Ad_Amount) * config.Adv_View_Cost

                    let Image_Available = false;
                    if (ImageData != null && ImageData != "") {
                        Image_Available = true
                    }

                    let max = 0;
                    let SnoMax = await YouTube_Links.find().lean().exec();
                    if (SnoMax.length == 0) {
                        max = 0
                    } else {
                        max = Math.max.apply(Math, SnoMax.map(function (o) { return o.SNo; }))
                    }

                    let Data = {}
                    if (values.Advertisement_Type == 1) {
                        Data = {
                            YouTubeID: uuid.v4(),
                            SNo: max + 1,
                            YouTube_Link_Name: values.YouTube_Link_Name,
                            YouTube_Link: values.YouTube_Link,
                            Description: values.Description,
                            USERID: values.USERID,
                            AreaCode_Array: values.AreaCode_Array,
                            Status: true,
                            Image_Available: Image_Available,
                            Image_Data: ImageData,
                            User_Type: 2,
                            Advertisement_Type: 1, // 1:Video Add
                            Ad_Amount: values.Ad_Amount,
                            No_of_Views: No_of_Views,
                            Available_Views: No_of_Views,
                            created_at: new Date(),
                            updated_at: new Date()
                        };

                    } else if (values.Advertisement_Type == 2) {
                        Data = {
                            YouTubeID: uuid.v4(),
                            SNo: max + 1,
                            YouTube_Link_Name: values.YouTube_Link_Name,
                            YouTube_Link: values.YouTube_Link,
                            Description: values.Description,
                            USERID: values.USERID,
                            AreaCode_Array: values.AreaCode_Array,
                            Status: true,
                            Image_Available: Image_Available,
                            Image_Data: ImageData,
                            User_Type: 2,
                            Advertisement_Type: 2, // 2:Image Add
                            Ad_Amount: values.Ad_Amount,
                            No_of_Views: No_of_Views,
                            Available_Views: No_of_Views,
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                    }


                    // Razorpay
                    let WebHookData = {}
                    let TranxID = uuid.v4();
                    let onlineamount;
                    let calbk;

                    let Ad_Amount = values.Ad_Amount;
                    let Wallet_Amount = UserData.User_Amounts.Available_Amount;
                    onlineamount = Ad_Amount - Wallet_Amount;
                    // onlineamount = Ad_Amount

                    if (onlineamount <= 0) {
                        onlineamount = 0;
                    }
                    let Used_Wallet_Amount = 0;
                    Used_Wallet_Amount = Ad_Amount - onlineamount;
                    console.log(onlineamount, Used_Wallet_Amount, "p", Ad_Amount)




                    if (parseInt(onlineamount) == 0) { calbk = false } else { calbk = true }
                    let Result = {
                        Total_Amount: parseFloat(onlineamount.toFixed(2)),
                        TransactionID: TranxID,
                        CallBack: calbk
                    }

                    if (calbk) {
                        resolve({ success: true, extras: { Data: Result } });
                    }
                    let Payment_Type = 2;
                    if (!calbk) {
                        Payment_Type = 1
                    }
                    let Log_Data = {

                        LogID: uuid.v4(),
                        USERID: values.USERID,
                        TransactionID: TranxID,
                        Amount: Ad_Amount,
                        Data: Data,
                        WebHookData: {},
                        Payment_Type: Payment_Type, //1- Wallet, 2- RazorPay 3- both 4- Subscription
                        Payment_Status: 1, // 1- initial, 2- fail, 3- Success,
                        Online_Amount: onlineamount,
                        CallBack: calbk,
                        Used_Wallet_Amount: Used_Wallet_Amount,
                        created_at: new Date(),
                        updated_at: new Date(),
                    }

                    let SaveAdd_log = await YouTube_Advertisement_Logs(Log_Data).save();
                    if (!calbk) {
                        let Save_Advertisement = await CommonController.Save_User_Advertisement(Log_Data)
                    }

                    resolve({ success: true, extras: { Status: "YouTube Ad Created Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: "Rs." + config.Min_Advertisement_Amount + " is The Minimum Amount to Create Advertisement" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Place_Order = (values, UserData, ProductData, Address_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Sub_query = {
                    SubscriptionID: UserData.Subscription_Data.SubscriptionID,
                    Status: true
                }
                let Result = await Subscription.findOne(Sub_query).select('-_id ')
                console.log(Result)
                let WebHookData = {}
                let TranxID = uuid.v4();
                let onlineamount;
                let calbk;
                if (Result == null || Result == undefined) {

                    let Product_Amount = ProductData.Product_Price;
                    let Wallet_Amount = UserData.User_Amounts.Available_Amount;
                    onlineamount = Product_Amount - Wallet_Amount;
                    // onlineamount = Product_Amount

                    if (onlineamount <= 0) {
                        onlineamount = 0;
                    }
                    let Used_Wallet_Amount = Product_Amount - onlineamount;
                    // console.log(onlineamount, Used_Wallet_Amount, "p", Product_Amount)

                    if (parseInt(onlineamount) == 0) { calbk = false } else { calbk = true }
                    let Result3 = {
                        Total_Amount: parseFloat(onlineamount.toFixed(2)),
                        TransactionID: TranxID,
                        CallBack: calbk
                    }

                    let P_Data = {
                        Product_Amount: Product_Amount,
                        Wallet_Amount: Wallet_Amount
                    }
                    if (calbk) {
                        resolve({ success: true, extras: { Data: Result3 } });
                    }


                    let Result2 = {
                        TransactionID: TranxID,
                        Online_Amount: parseFloat(onlineamount.toFixed(2)),
                        Product_Total_Amount: Product_Amount,
                        Used_Wallet_Amount: Used_Wallet_Amount,
                        CallBack: calbk

                    }

                    if (calbk == false) {
                        // console.log(UserData)
                        let Log_Data = {
                            LogID: uuid.v4(),
                            USERID: UserData.USERID,
                            TransactionID: TranxID,
                            Type: 2, //1.Credited 2.Debited
                            Amount: ProductData.Product_Price,
                            Online_Amount: onlineamount,
                            UserData: UserData,
                            ProductData: ProductData,
                            Address_Data: Address_Data,
                            Order_Type: 2, //1 : Subscription Product 2: Not Subscription Product
                            Payment_Type: 1, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
                            Payment_Status: 3, // 1- initial, 2- fail, 3- Success,
                            Used_Wallet_Amount: Used_Wallet_Amount,
                            Product_Order_Used: 2,

                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let Save_Order_Log = await Order_Logs(Log_Data).save();


                        // console.log("Wallet AMount")
                        let Save_Order = await CommonController.Add_Order_to_Delivery(UserData, ProductData, Address_Data, 2, WebHookData, Result2);

                        //Update USER Available Amount
                        let queryUser = {
                            USERID: UserData.USERID
                        }

                        let changes = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Available_Amount": Used_Wallet_Amount * -1,
                                "User_Amounts.Withdrawn_Amount": Used_Wallet_Amount
                            }
                        }

                        let User_result = await Users.updateOne(queryUser, changes).lean();

                        console.log("Update USER Available Amount")

                        // resolve({ success: true, extras: { Data: "Order Placed Successfully" } });
                        resolve({ success: true, extras: { Data: Result3 } });

                    } else {

                        let Log_Data = {
                            LogID: uuid.v4(),
                            USERID: UserData.USERID,
                            TransactionID: TranxID,
                            Type: 2, //1.Credited 2.Debited
                            Amount: ProductData.Product_Price,
                            Online_Amount: onlineamount,
                            UserData: UserData,
                            ProductData: ProductData,
                            Address_Data: Address_Data,
                            Order_Type: 2, //1 : Subscription Product 2: Not Subscription Product
                            Payment_Type: 2, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
                            Payment_Status: 1, // 1- initial, 2- fail, 3- Success,
                            CallBack: calbk,
                            Used_Wallet_Amount: Used_Wallet_Amount,
                            Product_Order_Used: 2,

                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let Save_Order_Log = await Order_Logs(Log_Data).save();

                    }

                } else {
                    let query_UsedProduct = {
                        "Product_Information.Product_ID": Result.Product_Data.Product_ID,
                        USERID: UserData.USERID,
                        Product_Order_Used: 1
                    }
                    let Used_Products = await Orders.find(query_UsedProduct)

                    if (UserData.Subscription_Data.Delivery_Product_Used == undefined || UserData.Subscription_Data.Delivery_Product_Used == null) {
                        UserData.Subscription_Data.Delivery_Product_Used = 0
                    }

                    console.log(UserData.Subscription_Data.Delivery_Product_Used, "Delivery_Product_Used")

                    if (Result.Product_Data.Product_ID == ProductData.Product_ID && UserData.Subscription_Data.Delivery_Product_Used == 1) {
                        // if (Used_Products.length == 0) {
                        let Log_Data = {
                            LogID: uuid.v4(),
                            TransactionID: TranxID,
                            USERID: UserData.USERID,
                            Type: 2, //1.Credited 2.Debited
                            Amount: ProductData.Product_Price,
                            UserData: UserData,
                            ProductData: ProductData,
                            Address_Data: Address_Data,
                            Order_Type: 1, //1 : Subscription Product 2: Not Subscription Product
                            Payment_Type: 4, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
                            Payment_Status: 3, // 1- initial, 2- fail, 3- Success,
                            Product_Order_Used: 1,

                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let Save_Order_Log = await Order_Logs(Log_Data).save();

                        let Result2 = {
                            Total_Amount: 0,
                            TransactionID: TranxID,
                            CallBack: false
                        }


                        let Save_Order = await CommonController.Add_Order_to_Delivery(UserData, ProductData, Address_Data, 1, WebHookData, Result2)
                        // resolve({ success: true, extras: { Data: "Order Placed Successfully" } });
                        resolve({ success: true, extras: { Data: Result2 } });
                        // } else {
                        //     reject({ success: false, extras: { msg: "Product Already Used" } })
                        // }
                    } else {
                        let Product_Amount = ProductData.Product_Price;
                        let Wallet_Amount = UserData.User_Amounts.Available_Amount;
                        onlineamount = Product_Amount - Wallet_Amount;
                        // onlineamount = Product_Amount

                        if (onlineamount <= 0) {
                            onlineamount = 0;
                        }
                        let Used_Wallet_Amount = Product_Amount - onlineamount;
                        // console.log(onlineamount, Used_Wallet_Amount, "p", Product_Amount)

                        if (parseInt(onlineamount) == 0) { calbk = false } else { calbk = true }
                        let Result3 = {
                            Total_Amount: parseFloat(onlineamount.toFixed(2)),
                            TransactionID: TranxID,
                            CallBack: calbk
                        }

                        let P_Data = {
                            Product_Amount: Product_Amount,
                            Wallet_Amount: Wallet_Amount
                        }
                        if (calbk) {
                            resolve({ success: true, extras: { Data: Result3 } });
                        }


                        let Result2 = {
                            TransactionID: TranxID,
                            Online_Amount: parseFloat(onlineamount.toFixed(2)),
                            Product_Total_Amount: Product_Amount,
                            Used_Wallet_Amount: Used_Wallet_Amount,
                            CallBack: calbk

                        }

                        if (calbk == false) {
                            // console.log(UserData)
                            let Log_Data = {
                                LogID: uuid.v4(),
                                USERID: UserData.USERID,
                                TransactionID: TranxID,
                                Type: 2, //1.Credited 2.Debited
                                Amount: ProductData.Product_Price,
                                Online_Amount: onlineamount,
                                UserData: UserData,
                                ProductData: ProductData,
                                Address_Data: Address_Data,
                                Order_Type: 2, //1 : Subscription Product 2: Not Subscription Product
                                Payment_Type: 1, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
                                Payment_Status: 3, // 1- initial, 2- fail, 3- Success,
                                Used_Wallet_Amount: Used_Wallet_Amount,
                                Product_Order_Used: 2,

                                created_at: new Date(),
                                updated_at: new Date()
                            }
                            let Save_Order_Log = await Order_Logs(Log_Data).save();


                            // console.log("Wallet AMount")
                            let Save_Order = await CommonController.Add_Order_to_Delivery(UserData, ProductData, Address_Data, 2, WebHookData, Result2);

                            //Update USER Available Amount
                            let queryUser = {
                                USERID: UserData.USERID
                            }

                            let changes = {
                                $set: {
                                    updated_at: new Date()
                                },
                                $inc: {
                                    "User_Amounts.Available_Amount": Used_Wallet_Amount * -1,
                                    "User_Amounts.Withdrawn_Amount": Used_Wallet_Amount
                                }
                            }

                            let User_result = await Users.updateOne(queryUser, changes).lean();

                            console.log("Update USER Available Amount")

                            // resolve({ success: true, extras: { Data: "Order Placed Successfully" } });
                            resolve({ success: true, extras: { Data: Result2 } });

                        } else {

                            let Log_Data = {
                                LogID: uuid.v4(),
                                USERID: UserData.USERID,
                                TransactionID: TranxID,
                                Type: 2, //1.Credited 2.Debited
                                Amount: ProductData.Product_Price,
                                Online_Amount: onlineamount,
                                UserData: UserData,
                                ProductData: ProductData,
                                Address_Data: Address_Data,
                                Order_Type: 2, //1 : Subscription Product 2: Not Subscription Product
                                Payment_Type: 2, //1- Wallet, 2- RazorPay 3- both 4- Subscription 
                                Payment_Status: 1, // 1- initial, 2- fail, 3- Success,
                                CallBack: calbk,
                                Used_Wallet_Amount: Used_Wallet_Amount,
                                Product_Order_Used: 2,

                                created_at: new Date(),
                                updated_at: new Date()
                            }
                            let Save_Order_Log = await Order_Logs(Log_Data).save();

                        }
                    }

                }


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_Address = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };

                let query = {
                    USERID: values.USERID,
                    Status: true,
                };
                let Count = await User_Address.countDocuments(query).lean().exec();
                let Result = await User_Address.find(query).select('-_id ').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                // for (let i = 0; i < Result.length; i++) {
                //     Result[i].Company_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, Result[i].Company_Image_Data);
                // }
                // if (values == '') {
                //     resolve(Result);
                // } else {
                resolve({ success: true, extras: { Count: Count, Data: Result } });
                // }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Edit_Address = (values) => {
    console.log(values)
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let User_query = {
                    Address_ID: values.Address_ID,
                    USERID: values.USERID,
                    Status: true
                }
                let AddressResult = await User_Address.findOne(User_query).lean().exec();
                if (AddressResult == null) {
                    reject({ success: false, extras: { msg: ApiMessages.ADDRESS_NOT_FOUND } });
                } else {
                    // let query = {
                    //     SNo: values.SNo,//max + 1, 
                    //     USERID: values.USERID,
                    // }

                    // let resx = await User_Address.find(query).lean().exec();
                    // if (resx.length != 0) {
                    // if (resx[0].SNo == AddressResult.SNo) {
                    let changes = {
                        $set: {
                            SNo: values.SNo,
                            Name: values.Name,
                            Type: values.Type,
                            CountryCode: values.CountryCode,
                            PhoneNumber: values.PhoneNumber,
                            Flat_Details: values.Flat_Details,
                            Address: values.Address,
                            // Landmark: values.Landmark,
                            lat: values.lat,
                            lng: values.lng,
                            Postal_Code: values.Postal_Code,
                            State: values.State,
                            City: values.City,
                            Land_Mark: values.Land_Mark,
                            Status: true,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    }
                    console.log(changes)

                    let SaveResult = await User_Address.updateOne(User_query, changes).lean().exec();
                    resolve({ success: true, extras: { Status: "Updated Successfully" } })
                    // } else {
                    //     reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                    // }
                    // } else {
                    //     reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                    // }
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//Add address
UserController.Add_Address = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,//max + 1,
                    USERID: values.USERID,
                }

                let resx = await User_Address.find(query).lean().exec();
                if (resx.length != 0) {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                } else {
                    let data1 = {
                        Address_ID: uuid.v4(),
                        USERID: values.USERID,
                        SNo: values.SNo,
                        Name: values.Name,
                        Type: values.Type,
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber,
                        Flat_Details: values.Flat_Details,
                        Address: values.Address,
                        // Landmark: values.Landmark,
                        lat: values.lat,
                        lng: values.lng,
                        Postal_Code: values.Postal_Code,
                        State: values.State,
                        City: values.City,
                        Land_Mark: values.Land_Mark,
                        Status: true,


                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let SaveResult = await User_Address(data1).save();
                    resolve({ success: true, extras: { Status: "Created Successfully" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Reset_User_Password = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.New_Password);
                let PasswordSalt = await CommonController.Random_OTP_Number();
                let pass = Password + PasswordSalt;
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                }
                let changes = {
                    $set: {
                        Password_Available: true,
                        PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                        PasswordSalt: PasswordSalt,
                        updated_at: new Date()
                    }
                }
                let updatePass = await Users.updateOne(query, changes).lean().exec()
                resolve({ success: true, extras: { Status: "updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Update_User_Password = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.New_Password);
                let PasswordSalt = await CommonController.Random_OTP_Number();
                let pass = Password + PasswordSalt;
                let query = {
                    USERID: values.USERID,
                    Password_Available: true
                }
                let changes = {
                    $set: {
                        Password_Available: true,
                        PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                        PasswordSalt: PasswordSalt,
                        updated_at: new Date()
                    }
                }
                let updatePass = await Users.updateOne(query, changes).lean().exec()
                resolve({ success: true, extras: { Status: "updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Create_User_Password = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.Password);
                let PasswordSalt = await CommonController.Random_OTP_Number();
                let pass = Password + PasswordSalt;
                let query = {
                    USERID: values.USERID,
                    // Password_Available: false
                }
                let changes = {
                    $set: {
                        Password_Available: true,
                        PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                        PasswordSalt: PasswordSalt,
                        updated_at: new Date()
                    }
                }
                let updatePass = await Users.updateOne(query, changes).lean().exec()
                resolve({ success: true, extras: { Status: "updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Generated_Bills = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let query = {
                    USERID: values.USERID,
                    Status: 3
                }
                let CountSubscriptionBill = await User_Subscription_Log.countDocuments(query).lean()
                let SubscriptionBill = await User_Subscription_Log.find(query).sort(sortOptions).select('-_id -__v').lean().exec();
                let Result = [];
                await SubscriptionBill.forEach((item1) => {
                    let queryA = {
                        SubscriptionID: item1.SubscriptionID,
                        Version: item1.Version
                    }
                    Subscription_Log.findOne(queryA).then((SubscriptionData) => {
                        let unitprice = parseFloat(SubscriptionData.Subscription_Amount)
                        let qty = 1;
                        item1.Unit_Price = unitprice;
                        item1.Description = "Subscription";
                        item1.Qty = qty;
                        item1.Total = parseFloat(unitprice * qty);
                        item1.Total_Words = numbertowords.toWords(unitprice * qty).charAt(0).toUpperCase() + numbertowords.toWords(unitprice * qty).slice(1);
                        Result.push(item1)
                    });
                });
                let CountPinPurchaseBill = await User_Pin_Purchase.countDocuments(query).lean()
                let PinPurchaseBill = await User_Pin_Purchase.find(query).sort(sortOptions).select('-_id -__v').lean().exec();
                await PinPurchaseBill.forEach((item2) => {
                    let unitprice = parseFloat(item2.Subscription_Amount)
                    let qty = item2.Quantity;
                    item2.Unit_Price = unitprice;
                    item2.Description = "Pin_Purchase";
                    item2.Qty = qty;
                    item2.Total = parseFloat(item2.Total_Amount);
                    item2.Total_Words = numbertowords.toWords(item2.Total_Amount).charAt(0).toUpperCase() + numbertowords.toWords(item2.Total_Amount).slice(1);
                    Result.push(item2)
                });
                let CountShopPurchaseBill = await User_Shop_Log.countDocuments(query).lean()
                let ShopPurchaseBill = await User_Shop_Log.find(query).sort(sortOptions).select('-_id -__v').lean().exec();
                await ShopPurchaseBill.forEach((item3) => {
                    let unitprice = parseFloat(item3.Total_Amount)
                    let qty = 1;
                    item3.Unit_Price = unitprice;
                    item3.Description = "Shop_Purchase";
                    item3.Qty = qty;
                    item3.Total = parseFloat(unitprice * qty);
                    item3.Total_Words = numbertowords.toWords(unitprice * qty).charAt(0).toUpperCase() + numbertowords.toWords(unitprice * qty).slice(1);
                    Result.push(item3)
                });
                let Count = CountSubscriptionBill + CountPinPurchaseBill + CountShopPurchaseBill;
                let Result1 = Result.sort(function (a, b) {
                    a = new Date(a.created_at);
                    b = new Date(b.created_at);
                    if (values.Latest == 'true') {
                        return a > b ? -1 : a < b ? 1 : 0;
                    } else {
                        return a > b ? 1 : a < b ? 0 : 1;
                    }

                });
                resolve({ success: true, extras: { Count: Count, Data: Result1.slice(toSkip, toSkip + toLimit) } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Search_For_Shop_With_PhoneNumber = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                let search = {
                    $regex: String(values.PhoneNumber),
                    $options: "i"
                }
                let query1 = {
                    $or: [{
                        PhoneNumber: search
                    }],
                    Whether_Shop: true
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await Users.countDocuments(query1).lean();
                let Result = await Users.find(query1).sort(sortOptions).select('-_id -__v').lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Amount_Transfer_To_Shop = (values, UserData, ShopData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = parseInt(values.Amount);
                let Bonus_Amount = parseFloat((Amount * config.Transfer_Amount_From_User_To_Shop_Company_Bonus) / 100);
                //check for amount availablity in wallet
                let Wallet_Balance = parseInt(UserData.User_Amounts.Available_Amount);
                if (Wallet_Balance > Amount) {
                    // add amount to shop 100% of the amount from user wallet
                    let shopquery = {
                        USERID: ShopData.USERID
                    }
                    let shopchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Amount,
                            "User_Amounts.Total_Amount": Amount
                        }
                    }
                    let UpdateShopData = await Users.updateOne(shopquery, shopchanges).lean();
                    //wallet log shop amount credit
                    //
                    let SData = {
                        LogID: uuid.v4(),
                        USERID: ShopData.USERID,
                        Type: 25, //Amount Credited to shop from user
                        Amount: Amount,
                        Data: {
                            Amount: Amount,
                            UserData: ShopData,
                            From_UserData: UserData
                        },
                        Time: new Date()
                    };
                    let SSaveResult = await User_Wallet_Logs(SData).save();
                    //withdraw amount to wallet 100% of the amount from user wallet to credit amount to shop
                    let userquery = {
                        USERID: UserData.USERID
                    }
                    let userchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Amount * -1,
                            "User_Amounts.Withdrawn_Amount": Amount
                        }
                    }
                    let UpdateUserData = await Users.updateOne(userquery, userchanges).lean();
                    //wallet log user amount withdraw
                    //
                    let UData = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 26, //Amount transfered from user to shop 
                        Amount: Amount,
                        Data: {
                            Amount: Amount,
                            To_UserData: ShopData,
                            UserData: UserData
                        },
                        Time: new Date()
                    };
                    let USaveResult = await User_Wallet_Logs(UData).save();
                    // add amount to shop 10% of the amount from company account  
                    let shopchanges1 = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Bonus_Amount,
                            "User_Amounts.Total_Amount": Bonus_Amount
                        }
                    }
                    let UpdateShopBData = await Users.updateOne(shopquery, shopchanges1).lean();
                    //wallet log shop bonus amount credit
                    //
                    let CData = {
                        LogID: uuid.v4(),
                        Type: 6, //bonus amount debited due to amount transfer from user to shop 
                        Amount: Bonus_Amount,
                        Data: {
                            Amount: Bonus_Amount,
                            USERID: ShopData.USERID,
                        },
                        Time: new Date()
                    };
                    let CSaveResult = await Company_Wallet_Logs(CData).save();
                    let Cfndupdquery = {

                    };
                    let Cfndupdchanges = {
                        $inc: {
                            Available_Amount: Bonus_Amount * -1,
                            Withdrawn_Amount: Bonus_Amount
                        }
                    };
                    let Cfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();

                    let BData = {
                        LogID: uuid.v4(),
                        USERID: ShopData.USERID,
                        Type: 27, //Bonus Amount credited from Company Account 
                        Amount: Bonus_Amount,
                        Data: {
                            Amount: Bonus_Amount,
                            UserData: ShopData
                        },
                        Time: new Date()
                    };
                    let BSaveResult = await User_Wallet_Logs(BData).save();

                    // add amount to User 10% of the amount from company                    
                    let userchanges1 = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Bonus_Amount,
                            "User_Amounts.Total_Amount": Bonus_Amount
                        }
                    }
                    let UpdateUserBData = await Users.updateOne(userquery, userchanges1).lean();
                    //wallet log user banus amount credit
                    //
                    let CData1 = {
                        LogID: uuid.v4(),
                        Type: 6, //bonus amount debited due to amount transfer from user to shop 
                        Amount: Bonus_Amount,
                        Data: {
                            Amount: Bonus_Amount,
                            USERID: ShopData.USERID,
                        },
                        Time: new Date()
                    };
                    let CSaveResult1 = await Company_Wallet_Logs(CData1).save();
                    let Cfndupdquery1 = {

                    };
                    let Cfndupdchanges1 = {
                        $inc: {
                            Available_Amount: Bonus_Amount * -1,
                            Withdrawn_Amount: Bonus_Amount
                        }
                    };
                    let Cfndupdoptions1 = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let CfindupdateData1 = await Company_Wallet.findOneAndUpdate(Cfndupdquery1, Cfndupdchanges1, Cfndupdoptions1).select('-_id -__v').lean();

                    let BData1 = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 27, //Bonus Amount credited from Company Account 
                        Amount: Bonus_Amount,
                        Data: {
                            Amount: Bonus_Amount,
                            UserData: UserData
                        },
                        Time: new Date()
                    };
                    let BSaveResult1 = await User_Wallet_Logs(BData1).save();
                    resolve({ success: true, extras: { Status: 'Upadated Successfully' } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } });
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_User_Expired_Amount_Log = (values, UserData) => { // check for type
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let query = {
                    USERID: UserData.USERID,
                    Type: {
                        $in: [16, 22]
                    }
                }
                let sortOptions = {
                    Time: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await User_Wallet_Logs.countDocuments(query).lean();
                let Result = await User_Wallet_Logs.find(query).select('-_id -__v -updated_at -Status -Data').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Register_Shop_After_Payment = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = config.New_Shop_Subscription_Amount;
                let Shop_Expiry_Date = moment().add(1, 'year').subtract(1, 'ms').toDate();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let Whether_Shop_Subscription_Shared_Amount = Amount / 2;
                let fndupdchanges = {
                    $set: {
                        Whether_Shop: true,
                        Whether_Shop_Subscription_Shared_Amount: Whether_Shop_Subscription_Shared_Amount,
                        Shop_Information: {
                            Shop_Expiry_Date: Shop_Expiry_Date,
                        },
                        User_Account_Registered_Date: new Date(),
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": Whether_Shop_Subscription_Shared_Amount,
                        "User_Amounts.Total_Amount": Whether_Shop_Subscription_Shared_Amount,
                    },
                };
                let fndupdoptions = {
                    new: true
                }
                UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve('Shop Data Updated');
                let Data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 28, //Shop Subscription Amount Credit to Wallet
                    Amount: Whether_Shop_Subscription_Shared_Amount,
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Upgrade = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (!UserData.Whether_Shop) {
                    let TranxID = uuid.v4();
                    let Data = {
                        Total_Amount: config.New_Shop_Subscription_Amount,
                        USERID: values.USERID,
                        Status: 1,
                        TransactionID: TranxID,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let SaveSub = await User_Shop_Log(Data).save();
                    let Result = {
                        Total_Amount: config.New_Shop_Subscription_Amount,
                        TransactionID: TranxID,
                        CallBack: true
                    }
                    resolve({ success: true, extras: { Data: Result } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.ALREADY_UPGRADED_TO_SHOP } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Check_Or_Create_User_PhoneNumber = (values, ReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PhoneNumber: values.PhoneNumber,
                    Whether_Subscribed: true
                };
                let Result = await Users.findOne(query).lean();
                if (Result != null) {
                    reject({ success: false, extras: { msg: ApiMessages.USER_PHONENUMBER_INUSE } })
                } else {
                    let queryA = {
                        PhoneNumber: values.PhoneNumber
                    }
                    let ResultA = await Users.findOne(queryA).lean();
                    if (ResultA != null) {
                        let changes = {
                            $set: {
                                Name: values.Name,
                                User_Basic_Information_Available: true,
                                Referral_USERID: ReferralData.USERID,
                                User_Account_Registered_Date: new Date(),
                                Zip_Code: values.Postal_Code,
                                State: values.State,
                                Area: values.Area,
                                City: values.City,
                                created_at: new Date(),
                                updated_at: new Date()
                            }
                        }
                        let saveData = await Users.updateOne(queryA, changes).lean()
                    } else {
                        let Data = {
                            USERID: uuid.v4(),
                            Name: values.Name,
                            CountryCode: values.CountryCode,
                            PhoneNumber: values.PhoneNumber,
                            User_Basic_Information_Available: true,
                            Referral_USERID: ReferralData.USERID,
                            User_Account_Registered_Date: new Date(),
                            Zip_Code: values.Postal_Code,
                            State: values.State,
                            Area: values.Area,
                            City: values.City,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let ResultData = await Users(Data).save();
                    }
                    let NewResult = await Users.findOne(queryA).lean();
                    let Rfndupdquery = {
                        USERID: NewResult.USERID
                    };
                    let Rfndupdchanges = {
                        $setOnInsert: {
                            Name: NewResult.Name,
                            CountryCode: NewResult.CountryCode,
                            PhoneNumber: NewResult.PhoneNumber,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                    };
                    let Rfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let RfindupdateData = await Users_Referrals.findOneAndUpdate(Rfndupdquery, Rfndupdchanges, Rfndupdoptions).select('-_id -__v').lean();
                    if (ReferralData) {
                        let rquery = {
                            USERID: ReferralData.USERID
                        };
                        let rchanges = {
                            $set: {
                                Name: ReferralData.Name,
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Referrals: 1
                            },
                            $push: {
                                Referral_USERID_Array: NewResult.USERID,
                                Referral_Information: NewResult
                            }
                        };
                        let RUpdatedStatus = await Users_Referrals.updateOne(rquery, rchanges).lean();
                    }
                    let Result = await UserController.User_Subscription_With_PIN(values, NewResult);
                    let RegisterUpdateRazorpayUser = await UserController.Create_and_Update_User_RazorpayX_Contact(NewResult);
                    resolve(Result);
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Shops = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let Latitude = parseFloat(values.Latitude);
                let Longitude = parseFloat(values.Longitude);
                let Point = [
                    Longitude,
                    Latitude
                ];
                let query = {
                    'Point': {
                        '$near': {
                            '$minDistance': 0,
                            '$maxDistance': 50000,
                            '$geometry': {
                                type: "Point",
                                coordinates: Point
                            }
                        }
                    },
                    'Whether_Shop': true,
                    'Status': true
                };

                let Result = await Users.find(query).select('-_id -__v').lean();//.skip(toSkip).limit(toLimit).exec();
                let Count = Result.length
                resolve({ success: true, extras: { Count: Count, Data: Result.slice(toSkip, toSkip + toLimit) } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Fetch_YouTube_Ad = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let queryU = {
                    USERID: values.USERID
                };
                let ResultU = await Users.findOne(queryU).lean();
                if (ResultU != null) {
                    let Userpincode = ResultU.Zip_Code;
                    let queryA = {
                        AreaCode_Array: Userpincode,
                        $or: [{ User_Type: 1 }, { User_Type: undefined }],
                        Status: true
                    };
                    let queryB = {
                        $or: [{ User_Type: 1 }, { User_Type: undefined }],
                        AreaCode_Array: {
                            $size: 0
                        },
                        Status: true
                    };
                    let queryA_User_Ads = {
                        AreaCode_Array: Userpincode,
                        User_Type: 2,
                        Admin_Approve: 2,
                        Status: true,
                        Available_Views: {
                            $gt: 0
                        },
                    };

                    let queryB_User_Ads = {
                        AreaCode_Array: {
                            $size: 0
                        },
                        User_Type: 2,
                        Admin_Approve: 2,
                        Status: true,
                        Available_Views: {
                            $gt: 0
                        },
                    };
                    console.log(queryB_User_Ads, queryA_User_Ads)
                    let Result1 = await YouTube_Links.find(queryA).select().lean().exec();
                    // console.log("Result1:", Result1)
                    let Result2 = await YouTube_Links.find(queryB).select().lean().exec();
                    // console.log("Result2:", Result2)
                    let Result3 = await YouTube_Links.find(queryA_User_Ads).select().lean().exec();
                    let Result4 = await YouTube_Links.find(queryB_User_Ads).select().lean().exec();
                    // console.log("Result3:", Result3)
                    // console.log("Result4:", Result4)
                    let Result = Result1.concat(Result2)
                    Result = Result.concat(Result3)
                    Result = Result.concat(Result4)
                    // console.log(Result, Result.length)
                    let DataLength = Result.length;
                    if (DataLength != 0) {
                        let Random_number = await CommonController.Random_Number(DataLength);

                        let FinalResult = Result[Random_number];
                        // console.log(Random_number, FinalResult.Available_Views) 
                        // let Available_Views = 1 ;
                        // if (FinalResult.Available_Views != undefined && FinalResult.Available_Views != null) {
                        //     Available_Views = FinalResult.Available_Views

                        // } else {
                        //     Available_Views = 0;
                        // }

                       

                        // let YouTube_Link;
                        // YouTube_Link = FinalResult.YouTube_Link.split('=');
                        // console.log(FinalResult.YouTube_Link, "FinalResult.Available_Views2", YouTube_Link)
                        if(FinalResult.YouTube_Link != null && FinalResult.YouTube_Link != "" && FinalResult.YouTube_Link != undefined){
                            var str = FinalResult.YouTube_Link;
                            var pos = str.indexOf("youtu.be");
                            
                            let YouTube_Link;
                             if(pos == -1){
                               YouTube_Link = str
                             } else {
                                let YouTube_Link2 = str.split('/');
                                console.log( " x pos " + pos + " matchtype2 ", YouTube_Link2[3])
                               YouTube_Link = "https://www.youtube.com/watch?v="+YouTube_Link2[3]
                             }
                            
                             console.log(YouTube_Link)
                             FinalResult.YouTube_Link = YouTube_Link
                        }
                       



                        
                        if(FinalResult.Image_Available){
                            FinalResult.Image_Data = await CommonController.Common_Image_Response_Single_Image(true, FinalResult.Image_Data);
                        }                      

                        let viewquery = {
                            YouTubeID: FinalResult.YouTubeID
                        };
                        let changes = {
                            $push: {
                                ViewedData: {
                                    $each: [{
                                        USERID: values.USERID,
                                        Name: ResultU.Name,
                                        PhoneNumber: ResultU.PhoneNumber,
                                        created_at: new Date()
                                    }]
                                }
                            },
                            $set: {
                                ViewCount: FinalResult.ViewCount + 1,
                            },
                            $inc: {
                                Available_Views: (1 * -1),
                            }
                        }
                        let countupdate = await YouTube_Links.updateOne(viewquery, changes).lean();
                        delete FinalResult.ViewCount;
                        resolve({ success: true, extras: { Data: FinalResult } });
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.ADS_NOT_AVAILABLE } })
                    }

                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Fetch_Single_Plot = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PlotID: values.PlotID,
                    Status: true
                };
                let Result = await Plots_Log.findOne(query).select('-_id -__v').lean().exec();
                Result.Company_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, Result.Company_Image_Data);
                Result.FileData = await CommonController.Common_File_Response_Single_File(true, Result.FileData);
                for (let i = 0; i < Result.Plot_Image_Data.length; i++) {
                    Result.Plot_Image_Data[i] = await CommonController.Common_Image_Response_Single_Image(true, Result.Plot_Image_Data[i]);
                }
                resolve({ success: true, extras: { Data: Result } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Active_Plots = (values, skip, limit) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(skip);
                let toLimit = parseInt(limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let query = {
                    Status: true
                };
                let Count = await Plots_Log.countDocuments(query).lean().exec();
                let Result = await Plots_Log.find(query).select('-_id Company_Image_Data PlotID Plot_Name Company_Name').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                for (let i = 0; i < Result.length; i++) {
                    Result[i].Company_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, Result[i].Company_Image_Data);
                }
                if (values == '') {
                    resolve(Result);
                } else {
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_Subscriptions = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let queryU = {
                    USERID: values.USERID
                }
                let ResultU = await Users.findOne(queryU).lean();
                if (ResultU != null) {
                    let SubscriptionID = ResultU.Subscription_Data.SubscriptionID;
                    let SubscriptionAmount = ResultU.Subscription_Data.Subscription_Amount;
                    let toSkip = parseInt(values.skip);
                    let toLimit = parseInt(values.limit);
                    let sortOptions = {
                        SNo: 1
                    };
                    if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                        sortOptions = values.sortOptions;
                    };
                    let query = {
                        SubscriptionID: {
                            $ne: SubscriptionID
                        },
                        Subscription_Amount: {
                            $gt: SubscriptionAmount
                        },
                        Status: true
                    };
                    let Count = await Subscription.countDocuments(query).lean().exec();
                    let Result = await Subscription.find(query).select('-_id -__v -updated_at -Status').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Subscriptions = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let query = {
                    Status: true
                };
                let Count = await Subscription.countDocuments(query).lean().exec();
                let Result = await Subscription.find(query).select('-_id -__v -updated_at -Status').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Pincode = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let pin = parseInt(values.PinCode);
                https.get('https://api.postalpincode.in/pincode/' + pin, (resp) => {
                    let data = '';
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        //console.log(data);
                        var datanew = JSON.parse(data);
                        if (datanew[0].PostOffice != null) {
                            var dat = datanew[0].PostOffice[0];
                            var State = dat.State;
                            var district = dat.District;
                            var Division = dat.Division;
                            var Address = {
                                State: State,
                                District: district,
                                Division: Division
                            }
                            resolve({ success: true, extras: { Status: Address } })
                        } else {
                            resolve({ success: false, extras: { msg: ApiMessages.INVALID_AREACODE } })
                        }
                    });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Update_Shop_Information = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let lat = parseFloat(values.lat);
                let lng = parseFloat(values.lng);
                let Point = [lng, lat];
                let query = {
                    USERID: values.USERID
                };
                let changes = {
                    $set: {
                        Shop_Information: {
                            Shop_Name: values.Shop_Name,
                            Shop_Address: values.Shop_Address,
                            Shop_Expiry_Date: UserData.Shop_Information.Shop_Expiry_Date,
                            lat: lat,
                            lng: lng,
                            Point: Point,
                        },
                        Point: Point,
                        Whether_Shop_Details_Available: true,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await Users.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing_GST_Processing = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                let GData = {
                    LogID: uuid.v4(),
                    Type: 1,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let GSaveResult = await GST_Wallet_Logs(GData).save();
                let Gfndupdquery = {

                };
                let Gfndupdchanges = {
                    $inc: {
                        Available_Amount: Amount,
                        Total_Amount: Amount
                    }
                };
                let Gfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let GfindupdateData = await GST_Wallet.findOneAndUpdate(Gfndupdquery, Gfndupdchanges, Gfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing_Company_Processing = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                let CData = {
                    LogID: uuid.v4(),
                    Type: 5,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let CSaveResult = await Company_Wallet_Logs(CData).save();
                let Cfndupdquery = {

                };
                let Cfndupdchanges = {
                    $inc: {
                        Available_Amount: Amount,
                        Total_Amount: Amount
                    }
                };
                let Cfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Company_Sharing', Amount);
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing_Referral_Processing = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                if (UserData.Whether_Referral_Signup) {
                    let USERID = UserData.Referral_USERID;
                    let Ufndupdquery = {
                        USERID: USERID
                    };
                    let pj1 = await Users.findOne(Ufndupdquery).lean();
                    if (pj1.User_Amounts.Total_Amount < pj1.Subscription_Data.Subscription_Limits.Max_Wallet_Limit) {
                        if (parseFloat(pj1.User_Amounts.Total_Amount + Amount) < parseFloat(pj1.Subscription_Data.Subscription_Limits.Max_Wallet_Limit)) {
                            Amount = Amount;
                        } else {
                            let RemAmount = parseFloat(pj1.Subscription_Data.Subscription_Limits.Max_Wallet_Limit - pj1.User_Amounts.Total_Amount);
                            let ExtraAmount = parseFloat(Amount - RemAmount);
                            Amount = RemAmount;
                            // transfer extra amount to triming wallet
                            let Data2 = {
                                UserData: pj1,
                                Amount: ExtraAmount
                            };
                            let TData = {
                                LogID: uuid.v4(),
                                Type: 14,
                                Amount: ExtraAmount,
                                Data: Data2,
                                Time: new Date()
                            };
                            let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                            let Tfndupdquery = {

                            };
                            let Tfndupdchanges = {
                                $inc: {
                                    Available_Amount: ExtraAmount,
                                    Total_Amount: ExtraAmount
                                }
                            };
                            let Tfndupdoptions = {
                                upsert: true,
                                setDefaultsOnInsert: true,
                                new: true
                            }
                            let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                            // add extra amount to expired log 
                            let Ufndupdchanges1 = {
                                $set: {
                                    updated_at: new Date()
                                },
                                $inc: {
                                    "User_Amounts.Expired_Amount": ExtraAmount
                                }
                            };
                            let Ufndupdoptions1 = {
                                upsert: true,
                                setDefaultsOnInsert: true,
                                new: true
                            }
                            let UfindupdateData1 = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges1, Ufndupdoptions1).select('-_id -__v').lean();
                            let Dataxt = {
                                UserData: pj1,
                                Amount: ExtraAmount
                            };
                            let UDataxt = {
                                LogID: uuid.v4(),
                                USERID: USERID,
                                Type: 29, // Amount Expired Due to Total Wallet Limit Exceed
                                Amount: ExtraAmount,
                                Data: Dataxt,
                                Time: new Date()
                            };
                            let USaveResultxt = await User_Wallet_Logs(UDataxt).save();
                        }
                        let Ufndupdchanges = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Available_Amount": Amount,
                                "User_Amounts.Referral_Amount": Amount,
                                "User_Amounts.Total_Amount": Amount
                            }
                        };
                        let Ufndupdoptions = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        }
                        let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                        let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Refferal_Sharing', Amount);

                        let Data1 = {
                            UserData: pj1,
                            Amount: Amount
                        };
                        let UData = {
                            LogID: uuid.v4(),
                            USERID: USERID,
                            Type: 23,
                            Amount: Amount,
                            Data: Data1,
                            Time: new Date()
                        };
                        let USaveResult = await User_Wallet_Logs(UData).save();
                    } else {
                        // transfer amount to trimming wallet
                        let Data3 = {
                            UserData: pj1,
                            Amount: Amount
                        };
                        let TData = {
                            LogID: uuid.v4(),
                            Type: 14,
                            Amount: Amount,
                            Data: Data3,
                            Time: new Date()
                        };
                        let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                        let Tfndupdquery = {

                        };
                        let Tfndupdchanges = {
                            $inc: {
                                Available_Amount: Amount,
                                Total_Amount: Amount
                            }
                        };
                        let Tfndupdoptions = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        }
                        let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                        // add extra amount to expired log
                        let Ufndupdchanges1 = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Expired_Amount": Amount
                            }
                        };
                        let Ufndupdoptions1 = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        }
                        let UfindupdateData1 = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges1, Ufndupdoptions1).select('-_id -__v').lean();
                        let Dataxt1 = {
                            UserData: pj1,
                            Amount: Amount
                        };
                        let UDataxt1 = {
                            LogID: uuid.v4(),
                            USERID: USERID,
                            Type: 29, // Amount Expired Due to Total Wallet Limit Exceed
                            Amount: Amount,
                            Data: Dataxt1,
                            Time: new Date()
                        };
                        let USaveResultxt1 = await User_Wallet_Logs(UDataxt1).save();
                    }

                    resolve("Share Processing Completed");
                } else {
                    //Drop amount in trimmer
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 13,
                        Amount: Amount,
                        Data: Data,
                        Time: new Date()
                    };
                    let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                    let Tfndupdquery = {

                    };
                    let Tfndupdchanges = {
                        $inc: {
                            Available_Amount: Amount,
                            Total_Amount: Amount
                        }
                    };
                    let Tfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                    resolve("Share Processing Completed");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Shop_Subscription_Amount_Sharing_Trimmer_Share_Amount_for_Remaining = (UserData, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (No_of_User_Share_For_Trimmer >= 1 && Trimmer_Share_Amount > 0) {
                    let Trimmer_Amount = Trimmer_Share_Amount;
                    let Data = {
                        UserData: UserData,
                        Amount: Trimmer_Amount,
                        No_of_User_Share_For_Trimmer: No_of_User_Share_For_Trimmer
                    };
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 12,//Non Available Hierarchy pushed to trimmer
                        Amount: Trimmer_Amount,
                        Data: Data,
                        Time: new Date()
                    };
                    let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                    let Tfndupdquery = {

                    };
                    let Tfndupdchanges = {
                        $inc: {
                            Available_Amount: Trimmer_Amount,
                            Total_Amount: Trimmer_Amount
                        }
                    };
                    let Tfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                    resolve("Share Processing Completed");
                } else {
                    resolve("Share Processing Completed");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing_Expired = (UserData, Users_Network_Data_Expired, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                async.eachSeries(Users_Network_Data_Expired, async (USERID, callback) => {
                    try {
                        let UserShareProcessing = await UserController.Shop_Subscription_Amount_Sharing_User_Processing_Expired(UserData, USERID, Amount);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Total Processing Completed");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing_User_Processing_Expired = (UserData, USERID, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                let UData = {
                    LogID: uuid.v4(),
                    USERID: USERID,
                    Type: 22,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let USaveResult = await User_Wallet_Logs(UData).save();
                let Ufndupdquery = {
                    USERID: USERID
                };
                let Ufndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Expired_Amount": Amount
                    }
                };
                let Ufndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                let TData = {
                    LogID: uuid.v4(),
                    Type: 11,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Amount,
                        Total_Amount: Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//data 
UserController.Shop_Subscription_Amount_Sharing_User_Processing = (UserData, USERID, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let User_Amount = parseFloat((Amount * config.User_Subscription_Share) / 100);
                let User_Taxex_Amount = parseFloat(Amount - User_Amount);
                let Company_Amount = parseFloat((Amount * config.Company_Subscription_Share) / 100);
                let Trimmer_Amount = parseFloat((Amount * config.Trimmer_Subscription_Share) / 100);
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                let UData = {
                    LogID: uuid.v4(),
                    USERID: USERID,
                    Type: 21,
                    Amount: User_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let USaveResult = await User_Wallet_Logs(UData).save();
                let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Level_Sharing', User_Amount);

                let Ufndupdquery = {
                    USERID: USERID
                };
                let Ufndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": User_Amount,
                        "User_Amounts.Referral_Amount": User_Amount,
                        "User_Amounts.Total_Amount": User_Amount,
                        "User_Amounts.Service_Fee_and_Taxes_Amount": User_Taxex_Amount
                    }
                };
                let Ufndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                let CData = {
                    LogID: uuid.v4(),
                    Type: 4,
                    Amount: Company_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let CSaveResult = await Company_Wallet_Logs(CData).save();
                let Cfndupdquery = {

                };
                let Cfndupdchanges = {
                    $inc: {
                        Available_Amount: Company_Amount,
                        Total_Amount: Company_Amount
                    }
                };
                let Cfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                let refprocesss = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Company_Sharing', Company_Amount);
                let TData = {
                    LogID: uuid.v4(),
                    Type: 10,
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Trimmer_Amount,
                        Total_Amount: Trimmer_Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Shop_Subscription_Amount_Sharing = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                UserData = await Users.findOne({ USERID: UserData.USERID });
                let Users_Network_Data = await UserController.Find_Network_Parent_Array([], UserData.USERID);
                await Users_Network_Data.splice(0, 1);
                let Users_Network_Data_Expired = await UserController.Fetch_All_Subscription_Share_User_Accounts_Expired_Accounts(Users_Network_Data);
                Users_Network_Data = await UserController.Fetch_All_Subscription_Share_User_Accounts(Users_Network_Data);
                let No_of_Users_Network = Users_Network_Data.length;
                let No_of_Users_Network_Expired = Users_Network_Data_Expired.length;
                let Subscription_Amount = config.New_Shop_Subscription_Amount;
                //let GST_Amount = ((Subscription_Amount * config.Shop_GST_Percentage) / 100);
                let Referral_Bonus_Amount = parseFloat((Subscription_Amount * config.Referral_Bonus_Amount) / 100);
                let Company_Share_Amount = parseFloat((Subscription_Amount * config.Company_Share_Amount) / 100);
                let Users_Distribution_Amount = parseFloat((Subscription_Amount * config.Users_Distribution_Amount / 100));
                let Each_User_Subscription_Share_Amount = parseFloat(Users_Distribution_Amount / (config.no_of_user_subscription_share - 1));
                let No_of_User_Share_For_Trimmer = (config.no_of_user_subscription_share - 1) - No_of_Users_Network - No_of_Users_Network_Expired;
                let Trimmer_Share_Amount = Each_User_Subscription_Share_Amount * No_of_User_Share_For_Trimmer;

                async.eachSeries(Users_Network_Data, async (USERID, callback) => {
                    try {
                        let UserShareProcessing = await UserController.Shop_Subscription_Amount_Sharing_User_Processing(UserData, USERID, Each_User_Subscription_Share_Amount);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    let ExpiredProcessing = await UserController.Shop_Subscription_Amount_Sharing_Expired(UserData, Users_Network_Data_Expired, Each_User_Subscription_Share_Amount);
                    let TrimmerProcessing = await UserController.Shop_Subscription_Amount_Sharing_Trimmer_Share_Amount_for_Remaining(UserData, Users_Network_Data, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount);
                    //let GSTProcessing = await UserController.Shop_Subscription_Amount_Sharing_GST_Processing(UserData, GST_Amount);
                    let CompanyProcessing = await UserController.Shop_Subscription_Amount_Sharing_Company_Processing(UserData, Company_Share_Amount);
                    let ReferralProcessing = await UserController.Shop_Subscription_Amount_Sharing_Referral_Processing(UserData, Referral_Bonus_Amount);
                    resolve("Total Processing Completed");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Register_Shop_with_Subscription = (values, UserData, ReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let now = moment();
                let expiry_moment = (UserData.Subscription_Expiry_Date == null) ? moment().subtract(1, 'hour') : moment(UserData.Subscription_Expiry_Date);
                if (!UserData.Whether_Subscribed || now.isAfter(expiry_moment)) {
                    let User_Account_Status = 2;//Yellow
                    let User_Account_Status_Logs = {
                        User_Account_Status: User_Account_Status,
                        Comment: COMMON_SYSTEM_MESSAGES.SHOP_REGISTRATION_AND_SUBSCRIPTION,
                        Time: new Date()
                    };
                    let Amount = config.New_Shop_Subscription_Amount;
                    let Subscription_Type = parseInt(values.Subscription_Type);
                    let Subscription_Expiry_Date = moment().add(1, 'year').subtract(1, 'ms').toDate();
                    let Subscription_Logs = {
                        SubscriptionID: uuid.v4(),
                        Subscription_Amount: Amount,
                        Subscription_Type: Subscription_Type,
                        Subscription_Expiry_Date: Subscription_Expiry_Date,
                        Time: new Date()
                    };
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let Whether_Shop_Subscription_Shared_Amount = Amount / 2;
                    let fndupdchanges = {
                        $set: {
                            Name: values.Name,
                            EmailID: values.EmailID,
                            Whether_Shop: true,
                            Whether_Shop_Subscription_Shared_Amount: Whether_Shop_Subscription_Shared_Amount,
                            User_Basic_Information_Available: true,
                            Whether_Referral_Signup: Boolify(values.Whether_Referral_Signup),
                            Referral_USERID: ReferralData.USERID,
                            Whether_Subscribed: true,
                            Subscription_Type: Subscription_Type,
                            Subscription_Expiry_Date: Subscription_Expiry_Date,
                            USER_PIN_CODE: values.USER_PIN_CODE,
                            User_Account_Status: User_Account_Status,
                            User_Account_Registered_Date: new Date(),
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Withdrawn_Amount": Amount,
                            "User_Amounts.Available_Amount": (Amount * -1),
                        },
                        $push: {
                            Subscription_Logs: Subscription_Logs,
                            User_Account_Status_Logs: User_Account_Status_Logs
                        }
                    };
                    let fndupdoptions = {
                        new: true
                    }
                    UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    let Data = {
                        LogID: uuid.v4(),
                        USERID: values.USERID,
                        Type: 20, //Account Subscription Amount Debited from Wallet
                        Amount: Amount,
                        Data: Subscription_Logs,
                        Time: new Date()
                    };
                    let SaveResult = await User_Wallet_Logs(Data).save();
                    resolve([{ success: true, extras: { Status: "Register and Subscribed Successfully" } }, Subscription_Logs]);
                    if (Boolify(values.Whether_Referral_Signup)) {
                        let rquery = {
                            USERID: ReferralData.USERID
                        };
                        let rchanges = {
                            $set: {
                                Name: ReferralData.Name,
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Referrals: 1
                            },
                            $push: {
                                Referral_USERID_Array: UserData.USERID,
                                Referral_Information: UserData
                            }
                        };
                        let RUpdatedStatus = await Users_Referrals.updateOne(rquery, rchanges).lean();
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.ALREADY_SUBSCRIBED } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Check_Whether_Shop_Subscription_Amount_Available = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (UserData.User_Amounts.Available_Amount >= config.New_Shop_Subscription_Amount) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_Shop_Pin_Add_Money_To_Wallet = (values, UserData, UserPinCodeData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (UserPinCodeData.Whether_Code_Used) {
                    reject({ success: false, extras: { msg: ApiMessages.PIN_CODE_ALREADY_USED } })
                } else {
                    let PinUserData = await CommonController.Check_Only_User(UserPinCodeData);
                    let pquery = {
                        USER_PIN_CODE: UserPinCodeData.USER_PIN_CODE
                    };
                    let PIN_APPLIED_DETAILS = {
                        USERID: UserData.USERID,
                        Name: UserData.Name,
                        CountryCode: UserData.CountryCode,
                        PhoneNumber: UserData.PhoneNumber,
                        Shop_Name: UserData.Shop_Information.Shop_Name,
                        Shop_Address: UserData.Shop_Information.Shop_Address,
                        lat: UserData.Shop_Information.lat,
                        lng: UserData.Shop_Information.lng,
                        Point: UserData.Shop_Information.Point
                    }
                    let pchanges = {
                        $set: {
                            Whether_Code_Used: true,
                            PIN_APPLIED_DETAILS: PIN_APPLIED_DETAILS,
                            updated_at: new Date()
                        }
                    };
                    let pUpdatedStatus = await User_Shop_Pins.updateMany(pquery, pchanges).lean();
                    let Amount = config.New_Purchase_Shop_Pin_Amount;
                    let LData = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 19,
                        Amount: Amount,
                        Data: {
                            UserPinCodeData: UserPinCodeData,
                            PinUserData: PinUserData
                        },
                        Time: new Date()
                    };
                    let SaveResult = await User_Wallet_Logs(LData).save();
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Amount,
                            "User_Amounts.Total_Amount": Amount
                        }
                    };
                    let fndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    resolve({ success: true, extras: { Status: "Pins Amount Added to Wallet Successfully" } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_all_Used_Shop_Pins = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Whether_Code_Used: true,
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Shop_Pins.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_all_Available_Shop_Pins = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Whether_Code_Used: false,
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Shop_Pins.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Purchase_Shop_Pins = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let no_of_pins = parseInt(values.no_of_pins);
                let Total_Pins_Amount = no_of_pins * config.New_Purchase_Shop_Pin_Amount;
                let LData = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 18,
                    Amount: Total_Pins_Amount,
                    Data: {
                        no_of_pins: no_of_pins,
                        Total_Pins_Amount: Total_Pins_Amount
                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(LData).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Withdrawn_Amount": Total_Pins_Amount,
                        "User_Amounts.Available_Amount": (Total_Pins_Amount * -1)
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve({ success: true, extras: { Status: "Pins Generated Successfully" } });
                async.timesSeries(no_of_pins, async (index, callback) => {
                    try {
                        let USER_PIN_CODE = await UserController.Take_Unique_Shop_PIN_CODE();
                        let Data = {
                            USERID: UserData.USERID,
                            USER_PIN_CODE: USER_PIN_CODE,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await User_Shop_Pins(Data).save();
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);

                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Purchase_Shop_Pins_Validate_Amount = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let no_of_pins = parseInt(values.no_of_pins);
                let Total_Pins_Amount = no_of_pins * config.New_Purchase_Shop_Pin_Amount;
                if (UserData.User_Amounts.Available_Amount >= Total_Pins_Amount) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Common_Razorpay_Update_Statues = (PayoutData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let TransactionData = await User_Bank_Transfers.findOne({ RazorpayX_TransactionID: PayoutData.id }).lean();
                if (TransactionData == null) {
                    resolve("Updated Successfully")
                } else {
                    let Transaction_Detailed_Data = await config.Razorpay_Transaction_Data.find(ele => ele.status == PayoutData.status);
                    if (TransactionData.Transaction_Status == 2 || TransactionData.Transaction_Status == 5 || TransactionData.Transaction_Status == 7) {
                        resolve("Updated Successfully");
                    } else {
                        let Transaction_Status = Transaction_Detailed_Data.Transaction_Status;
                        if (TransactionData.Transaction_Status == Transaction_Status) {
                            resolve("Updated Successfully");
                        } else {
                            let Transaction_Status_Logs = {
                                LogID: uuid.v4(),
                                Transaction_Status: Transaction_Status,
                                Comment: Transaction_Detailed_Data.Comment,
                                Time: new Date()
                            };
                            let Transaction_Reference_ID = (Transaction_Status == 2) ? PayoutData.utr : "";
                            let Transaction_Completion_Remarks = (Transaction_Status == 2) ? Transaction_Detailed_Data.Comment : "";
                            let query = {
                                TransactionID: TransactionData.TransactionID
                            };
                            let changes = {
                                $set: {
                                    Transaction_Status: Transaction_Status,
                                    Transaction_Reference_ID: Transaction_Reference_ID,
                                    Transaction_Completion_Remarks: Transaction_Completion_Remarks,
                                    RazorpayXPayoutData: PayoutData,
                                    updated_at: new Date()
                                },
                                $push: {
                                    Transaction_Status_Logs: Transaction_Status_Logs
                                }
                            };
                            let UpdatedStatus = await User_Bank_Transfers.updateOne(query, changes).lean();
                            resolve("Updated Successfully");
                            if (Transaction_Status == 5) {
                                //Amount Reversal
                                let Amount = TransactionData.Amount;
                                let LData = {
                                    LogID: uuid.v4(),
                                    USERID: TransactionData.USERID,
                                    Type: 17,
                                    Amount: Amount,
                                    Data: {
                                        Amount: Amount,
                                        TransactionData: TransactionData
                                    },
                                    Time: new Date()
                                };
                                let LSaveResult = await User_Wallet_Logs(LData).save();
                                let fndupdquery = {
                                    USERID: TransactionData.USERID
                                };
                                let fndupdchanges = {
                                    $set: {
                                        updated_at: new Date()
                                    },
                                    $inc: {
                                        "User_Amounts.Available_Amount": Amount,
                                        //"User_Amounts.Total_Amount": Amount
                                    }
                                };
                                let fndupdoptions = {
                                    new: true
                                };
                                let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                            }
                        }
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Add_Beneficiary_Account_for_UPI_ID = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let RazorpayXBeneficiaryData = await RazorpayController.Create_Razorpay_Beneficiary_Account_for_UPI(values, UserData);
                let Data = {
                    BeneficiaryID: uuid.v4(),
                    RazorpayX_BeneficiaryID: RazorpayXBeneficiaryData.id,
                    USERID: values.USERID,
                    RazorpayX_ContactID: UserData.RazorpayX_ContactID,
                    BeneficiaryType: 2,
                    Name: values.Name,
                    UPI: values.UPI,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let SaveResult = await User_Bank_Beneficiary_Accounts(Data).save();
                resolve({ success: true, extras: { Status: "Beneficiary Account Added Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Create_and_Update_User_RazorpayX_Contact = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                UserData = await Users.findOne({ USERID: UserData.USERID }).lean();
                let RazorpayXCustomerData = await RazorpayController.Create_Razorpay_Contact(UserData);
                let query = {
                    USERID: UserData.USERID
                };
                let changes = {
                    $set: {
                        Whether_RazorpayX_Customer_Register: true,
                        RazorpayX_ContactID: RazorpayXCustomerData.id
                    }
                };
                let UpdatedStatus = await Users.updateOne(query, changes).lean();
                resolve("Updated Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_App_Image_Resource = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ResourceType = parseInt(values.ResourceType);
                let query = {
                    Status: true,
                    ResourceType: ResourceType
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await App_Image_Resources.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        item.ImageData = await CommonController.Common_Image_Response_Single_Image(true, item.ImageData);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve({ success: true, extras: { Data: Result } });
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_News = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    // Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await News.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Guidelines = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await GuideLines.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        item.All_Images_Data = await CommonController.Common_Multiple_Image_Response(item.All_Images_Data);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve({ success: true, extras: { Data: Result } });
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Update_Bank_Transfer_Amount_Issue = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    TransactionID: values.TransactionID
                };
                let changes = {
                    $set: {
                        Transaction_Status: 3,
                        updated_at: new Date()
                    },
                    $push: {
                        Transaction_Status_Logs: {
                            LogID: uuid.v4(),
                            Transaction_Status: 3,
                            Comment: values.Comment,
                            Time: new Date()
                        }
                    }
                };
                let UpdatedStatus = await User_Bank_Transfers.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Update_Bank_Transfer_Amount_Transferred = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    TransactionID: values.TransactionID
                };
                let changes = {
                    $set: {
                        Transaction_Status: 2,
                        Transaction_Reference_ID: values.Transaction_Reference_ID,
                        Transaction_Completion_Remarks: values.Comment,
                        updated_at: new Date()
                    },
                    $push: {
                        Transaction_Status_Logs: {
                            LogID: uuid.v4(),
                            Transaction_Status: 2,
                            Comment: values.Comment,
                            Time: new Date()
                        }
                    }
                };
                let UpdatedStatus = await User_Bank_Transfers.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Recharges = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Recharges.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Recharge_Mobile = (values, UserData, BalanceData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = parseInt(values.Amount);
                let ServiceType = parseInt(values.ServiceType);
                let Data = {
                    RechargeTransactionID: uuid.v4(),
                    USERID: values.USERID,
                    Amount: Amount,
                    ServiceType: ServiceType,
                    RechargePhoneNumber: values.RechargePhoneNumber,
                    ServiceCode: values.ServiceCode,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let PostRechargeData = await RechargeDaddyController.Recharge_Mobile(Data);
                if (parseInt(PostRechargeData.STATUSCODE) == 0) {
                    let RechargeData = await User_Recharges(Data).save();
                    RechargeData = JSON.parse(JSON.stringify(RechargeData));
                    let LData = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 14,
                        Amount: Amount,
                        Data: {
                            Amount: Amount,
                            RechargeData: RechargeData
                        },
                        Time: new Date()
                    };
                    let LSaveResult = await User_Wallet_Logs(LData).save();
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Withdrawn_Amount": Amount,
                            "User_Amounts.Available_Amount": (Amount * -1)
                        }
                    };
                    let fndupdoptions = {
                        new: true
                    };
                    let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    resolve({ success: true, extras: { Status: "Request Proceeded" } });
                    let rrquery = {
                        RechargeTransactionID: RechargeData.RechargeTransactionID
                    };
                    let rrchanges = {
                        $set: {
                            ReferenceTransactionID: PostRechargeData.TRNID,
                            TransactionStatus: PostRechargeData.TRNSTATUS,
                            TransactionStatusDescription: PostRechargeData.TRNSTATUSDESC,
                            OPRID: PostRechargeData.OPRID,
                            updated_at: new Date()
                        }
                    };
                    let rrUpdatedStatus = await User_Recharges.updateOne(rrquery, rrchanges).lean();
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SOMETHING_WENT_WRONG_PLEASE_TRY_AGAIN_AFTER_SOME_TIME } })
                    console.error("Some Recharge Daddy Error---->", PostRechargeData);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Recharge_Mobile_Validate_Completely = (values, UserData, BalanceData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = parseInt(values.Amount);
                let Available_Amount = parseFloat(BalanceData.BALANCE);
                let ServiceType = parseInt(values.ServiceType);
                if (Amount >= 5 && Amount <= 5000) {
                    if (ServiceType == 0 || ServiceType == 1) {
                        if (Amount <= UserData.User_Amounts.Available_Amount) {
                            if (Amount <= Available_Amount) {
                                resolve("Validated Successfully");
                            } else {
                                reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE_IN_COMPANY_ACCOUNT_CONTACT_HELPDESK } });
                                let Data = {
                                    ReferenceID: uuid.v4(),
                                    USERID: UserData.USERID,
                                    Available_Amount: Available_Amount,
                                    Recharge_Amount: Amount,
                                    ServiceType: ServiceType,
                                    RechargePhoneNumber: values.RechargePhoneNumber,
                                    ServiceCode: values.ServiceCode,
                                    created_at: new Date(),
                                    updated_at: new Date()
                                };
                                let SaveResult = await User_Failed_Recharges(Data).save();
                            }
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_SERVICE_TYPE } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_AMOUNT_MUST_BE_BETWEEN_5_AND_5000 } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Bank_Transfers = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Bank_Transfers.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Amount_Transfer_To_Bank = (values, UserData, BeneficiaryData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = parseInt(values.Amount);
                if (Amount <= UserData.User_Amounts.Available_Amount) {
                    if (Amount >= config.min_bank_transfer_amount && Amount <= config.max_bank_transfer_amount) {
                        let TransactionID = uuid.v4();
                        let RazorpayXPayoutData = await RazorpayController.Razorpay_Beneficiary_Account_Payout(BeneficiaryData, Amount, TransactionID);
                        let Transaction_Detailed_Data = await config.Razorpay_Transaction_Data.find(ele => ele.status == RazorpayXPayoutData.status);
                        let Transaction_Status = Transaction_Detailed_Data.Transaction_Status;
                        let Transaction_Status_Logs = {
                            LogID: uuid.v4(),
                            Transaction_Status: Transaction_Status,
                            Comment: Transaction_Detailed_Data.Comment,
                            Time: new Date()
                        };
                        let Transaction_Reference_ID = (Transaction_Status == 2) ? RazorpayXPayoutData.utr : "";
                        let Transaction_Completion_Remarks = (Transaction_Status == 2) ? Transaction_Detailed_Data.Comment : "";
                        let Data = {
                            TransactionID: TransactionID,
                            RazorpayX_TransactionID: RazorpayXPayoutData.id,
                            Transaction_Number: await CommonController.GENERATE_TEN_DIGIT_INCREMENT_COUNTER_SEQUENCE("User_Bank_Transfers", "BT"),
                            BeneficiaryID: BeneficiaryData.BeneficiaryID,
                            RazorpayX_BeneficiaryID: BeneficiaryData.RazorpayX_BeneficiaryID,
                            USERID: values.USERID,
                            RazorpayX_ContactID: BeneficiaryData.RazorpayX_ContactID,
                            BeneficiaryType: BeneficiaryData.BeneficiaryType,
                            Amount: Amount,
                            Name: BeneficiaryData.Name,
                            Account_Number: BeneficiaryData.Account_Number,
                            IFSC: BeneficiaryData.IFSC,
                            Bank_Details: BeneficiaryData.Bank_Details,
                            UPI: BeneficiaryData.UPI,
                            Transaction_Status: Transaction_Status,
                            Transaction_Reference_ID: Transaction_Reference_ID,
                            Transaction_Completion_Remarks: Transaction_Completion_Remarks,
                            Transaction_Status_Logs: Transaction_Status_Logs,
                            RazorpayXPayoutData: RazorpayXPayoutData,
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                        let TransactionData = await User_Bank_Transfers(Data).save();
                        TransactionData = JSON.parse(JSON.stringify(TransactionData));
                        let LData = {
                            LogID: uuid.v4(),
                            USERID: UserData.USERID,
                            Type: 13,
                            Amount: Amount,
                            Data: {
                                Amount: Amount,
                                BeneficiaryData: BeneficiaryData,
                                TransactionData: TransactionData
                            },
                            Time: new Date()
                        };
                        let LSaveResult = await User_Wallet_Logs(LData).save();
                        let fndupdquery = {
                            USERID: UserData.USERID
                        };
                        let fndupdchanges = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Withdrawn_Amount": Amount,
                                "User_Amounts.Available_Amount": (Amount * -1)
                            }
                        };
                        let fndupdoptions = {
                            new: true
                        };
                        let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                        ////////////

                        let Date1 = moment().format('YYYY-MM-DD');
                        let fndupdquerylog = {
                            Date: Date1
                        };
                        let LogCheck = await Day_Bank_log.findOne(fndupdquerylog).lean();
                        if (LogCheck == null) {

                            let d = new Date();
                            d.setDate(d.getDate() - 1);
                            let Date2 = moment(d).format('YYYY-MM-DD');
                            let queryx = {
                                Date: Date2
                            }
                            let Resultx = await Day_Bank_log.findOne(queryx).lean();
                            let Data;
                            if (Resultx == null) {
                                Data = {
                                    Date: Date1,
                                }
                            } else {
                                Data = {
                                    Date: Date1,
                                    Total_Amount: Resultx.Total_Amount,
                                }
                            }
                            let createNew = await Day_Bank_log(Data).save();

                        }
                        let fndupdchangeslog = {
                            $inc: {
                                Day_Withdrawn_Amount: Amount,
                                Day_Total_Amount: Amount * -1,
                                Total_Amount: Amount * -1,
                            }
                        };
                        let fndupdoptionslog = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        };
                        let findupdateDatalog = await Day_Bank_log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();
                        ///////////
                        resolve({ success: true, extras: { Status: "Your Amount will be transferred shortly" } });
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.BANK_TRANSFER_AMOUNT_MUST_BE_BETWEEN_1000_AND_50000 } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Beneficiary_Accounts = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Name: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Bank_Beneficiary_Accounts.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.User_Add_Beneficiary_Account_for_Bank_Account = (values, BankData, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let RazorpayXBeneficiaryData = await RazorpayController.Create_Razorpay_Beneficiary_Account_for_Bank_Account(values, UserData);
                let Data = {
                    BeneficiaryID: uuid.v4(),
                    RazorpayX_BeneficiaryID: RazorpayXBeneficiaryData.id,
                    USERID: values.USERID,
                    RazorpayX_ContactID: UserData.RazorpayX_ContactID,
                    BeneficiaryType: 1,
                    Name: values.Name,
                    Account_Number: values.Account_Number,
                    IFSC: values.IFSC,
                    Bank_Details: BankData,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let SaveResult = await User_Bank_Beneficiary_Accounts(Data).save();
                resolve({ success: true, extras: { Status: "Beneficiary Account Added Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Add_Beneficiary_Account_for_UPI_ID_Already_Exist = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    UPI: values.UPI
                };
                let Result = await User_Bank_Beneficiary_Accounts.findOne(query).lean();
                if (Result == null) {
                    resolve({ success: true, extras: { Status: "Validated Successfully" } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.BENEFICIARY_UPI_ID_ALREADY_EXIST } })
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Add_Beneficiary_Account_Check_Whether_Account_Number_Already_Exist = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Account_Number: values.Account_Number
                };
                let Result = await User_Bank_Beneficiary_Accounts.findOne(query).lean();
                if (Result == null) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.BENEFICIARY_ACCOUNT_NUMBER_ALREADY_EXIST } })
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_IFSC_Code = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (ifsc.validate(values.IFSC)) {
                    let Data = await ifsc.fetchDetails(values.IFSC);
                    resolve(Data);
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_IFSC_CODE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_All_Friend_Money_Transfers = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Time: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Friend_Money_Requests.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Transfer_Amount_To_Friend = (values, UserData, FriendData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = parseFloat(values.Amount);
                if (Amount <= UserData.User_Amounts.Available_Amount) {
                    let After_Commissioned_Amount = ((Amount * config.Friend_Money_Transfer_After_Commissioned) / 100);
                    let LData = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 11,
                        Amount: Amount,
                        Data: {
                            UserData: UserData,
                            FriendData: FriendData,
                            After_Commissioned_Amount: After_Commissioned_Amount
                        },
                        Time: new Date()
                    };
                    let LSaveResult = await User_Wallet_Logs(LData).save();
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Withdrawn_Amount": Amount,
                            "User_Amounts.Available_Amount": (Amount * -1),
                        }
                    };
                    let fndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();


                    let FData = {
                        LogID: uuid.v4(),
                        USERID: FriendData.USERID,
                        Type: 12,
                        Amount: Amount,
                        Data: {
                            UserData: UserData,
                            FriendData: FriendData,
                            After_Commissioned_Amount: After_Commissioned_Amount
                        },
                        Time: new Date()
                    };
                    let FSaveResult = await User_Wallet_Logs(FData).save();
                    let Ffndupdquery = {
                        USERID: FriendData.USERID
                    };
                    let Ffndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Amount,
                            "User_Amounts.Total_Amount": Amount,
                        }
                    };
                    let Ffndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let FfindupdateData = await Users.findOneAndUpdate(Ffndupdquery, Ffndupdchanges, Ffndupdoptions).select('-_id -__v').lean();
                    let Data = {
                        USERID: FriendData.USERID,
                        Amount: Amount,
                        After_Commissioned_Amount: After_Commissioned_Amount,
                        REQUEST_DETAILS: UserData,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let SaveResult = await User_Friend_Money_Requests(Data).save();
                    resolve({ success: true, extras: { Status: "Money Transferred and Requested in Cash Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_Fetch_Phone_Number = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PhoneNumber: values.PhoneNumber
                };
                let Result = await Users.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.PHONE_NUMBER_NOT_REGISTERED } })
                } else {
                    if (Result.PhoneNumber == UserData.PhoneNumber) {
                        reject({ success: false, extras: { msg: ApiMessages.PHONE_NUMBER_AND_SELF_PHONE_NUMBER_MUST_BE_DIFFERENT } })
                    } else {
                        resolve(Result);
                    }
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.List_All_User_Wallet_Logs = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Amount: {
                        $gt: 0
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Time: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Wallet_Logs.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Network_Heirarchy_Validate_Network_USERID = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let netquery = {

                };
                if (values.Network_USERID == null || values.Network_USERID == "" || values.Network_USERID == undefined) {
                    netquery.USERID = values.USERID;
                } else {
                    netquery.USERID = values.Network_USERID
                }
                let Result = await Users.findOne(netquery).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_NETWORK_USER } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Network_Heirarchy = (values, NetworkUserData, Type) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let netquery = {
                    USERID: NetworkUserData.USERID
                };
                let NetworkResult = await Users_Network.findOne(netquery).lean();
                let ParentData = await CommonController.Check_Only_User(NetworkResult);
                ParentData.No_of_Child_Network = await NetworkResult.No_of_Network;
                ParentData.Network_Level = await CommonController.Common_Finding_Network_Level(NetworkResult.Network_Number);
                let Network_User_Array = [];
                await NetworkResult.Network_Information.forEach((item) => {
                    Network_User_Array.push(item.USERID);
                });
                let query = {
                    USERID: {
                        $in: Network_User_Array
                    },
                    Status: true
                };
                let sortOptions = {
                    No_of_Network: 1
                };
                let ChildData = await Users.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().exec();
                async.eachSeries(ChildData, async (item, callback) => {
                    try {
                        let fquery = {
                            USERID: item.USERID
                        };
                        let Child_Network_Data = await Users_Network.findOne(fquery).lean().exec();
                        item.No_of_Child_Network = await Child_Network_Data.No_of_Network;
                        item.Network_Level = await CommonController.Common_Finding_Network_Level(Child_Network_Data.Network_Number);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    if (Type == 1) {
                        resolve({ success: true, extras: { isHeirarchy: true, ParentData: ParentData, ChildData: ChildData } });
                    } else if (Type == 2) {
                        let Datax = {
                            isHeirarchy: true, ParentData: ParentData, ChildData: ChildData
                        }
                        resolve(Datax);
                    }

                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_User_Pin_Add_Money_To_Wallet = (values, UserData, UserPinCodeData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (UserPinCodeData.Whether_Code_Used) {
                    reject({ success: false, extras: { msg: ApiMessages.PIN_CODE_ALREADY_USED } })
                } else {
                    let PinUserData = await CommonController.Check_Only_User(UserPinCodeData);
                    let pquery = {
                        USER_PIN_CODE: UserPinCodeData.USER_PIN_CODE
                    };
                    let pchanges = {
                        $set: {
                            Whether_Code_Used: true,
                            PIN_APPLIED_DETAILS: UserData,
                            updated_at: new Date()
                        }
                    };
                    let pUpdatedStatus = await User_Pins.updateMany(pquery, pchanges).lean();
                    let Amount = config.New_Purchase_Pin_Amount;
                    let LData = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 10,
                        Amount: Amount,
                        Data: {
                            UserPinCodeData: UserPinCodeData,
                            PinUserData: PinUserData
                        },
                        Time: new Date()
                    };
                    let SaveResult = await User_Wallet_Logs(LData).save();
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Amount,
                            "User_Amounts.Total_Amount": Amount
                        }
                    };
                    let fndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    resolve({ success: true, extras: { Status: "Pins Amount Added to Wallet Successfully" } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_User_Pin_Tries = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let time = moment().subtract(config.PURCHASE_PIN_TRIES_COUNT_TIME_IN_MINUTES, 'minutes').toDate();
                let query = {
                    USERID: values.USERID,
                    Time: {
                        $gte: time
                    }
                };
                let Count = await User_Pin_Tries.countDocuments(query).lean().exec();
                if (Count <= config.PIN_TRIES_COUNT) {
                    resolve('Validated Successfully');
                    let Data = {
                        USERID: values.USERID,
                        Time: new Date()
                    };
                    let SaveResult = await User_Pin_Tries(Data).save();
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.PIN_TRIES_EXCEEDED_PLEASE_TRY_AFTER_SOME_TIME } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_all_Used_Pins = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Whether_Code_Used: true,
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Pins.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.List_all_Available_Pins = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID,
                    Whether_Code_Used: false,
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await User_Pins.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Data: Result } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Pins_Purchase = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                //console.log(values)
                let query = {
                    USERID: values.USERID
                }
                let Result = await Users.findOne(query).lean().exec()
                if (Result == null) {
                    reject({ success: false, extras: { msg: INVALID_USER } })
                } else {
                    let TranxID = uuid.v4();
                    let calbk;
                    if (parseInt(values.Amount_Online) == 0) { calbk = false } else { calbk = true }
                    let subquery = {
                        SubscriptionID: values.SubscriptionID,
                    }
                    let Resultsub = await Subscription.findOne(subquery).lean()
                    let Data = {
                        USERID: values.USERID,
                        SubscriptionID: values.SubscriptionID,
                        Subscription_Name: Resultsub.Subscription_Name,
                        Subscription_Amount: Resultsub.Subscription_Amount,
                        Version: values.Version,
                        Quantity: values.no_of_pins,
                        Total_Amount: values.Total_Amount,
                        Use_From_Wallet: values.Use_From_Wallet,
                        Amount_Used_From_Wallet: values.Amount_Used_From_Wallet,
                        Callback: calbk,
                        Amount_Online: values.Amount_Online,
                        TransactionID: TranxID,
                        Status: 1,
                        created_at: new Date(),
                        updated_at: new Date(),
                    };
                    let saveData = await User_Pin_Purchase(Data).save();
                    let ResultData = {
                        TransactionID: TranxID,
                        Callback: calbk,
                        Final_Amount: values.Amount_Online
                    }
                    if (calbk == false) {
                        let q = {
                            TransactionID: TranxID
                        }
                        let ResultTx = await User_Pin_Purchase.findOne(q).lean();;
                        let updateTranx = await UserController.User_Pins_Generate(ResultTx, Result, '');
                    }
                    resolve({ success: true, extras: { Data: ResultData } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Pins_Request = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                }
                let Result = await Users.findOne(query).lean().exec()
                if (Result == null) {
                    reject({ success: false, extras: { msg: INVALID_USER } })
                } else {
                    let queryS = {
                        SubscriptionID: values.SubscriptionID,
                        Version: values.Version
                    }
                    let ResultS = await Subscription_Log.findOne(queryS).lean().exec()
                    if (ResultS != null) {
                        let Amount_per_Pin = ResultS.Subscription_Amount;
                        let Total_Amount = Amount_per_Pin * parseInt(values.no_of_pins);
                        let Data = {
                            Total_Amount: Total_Amount,
                            Amount_Per_Item: Amount_per_Pin,
                            Total_Wallet_Amount: Result.User_Amounts.Available_Amount
                        }
                        resolve({ success: true, extras: { Data: Data } })
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_NOT_FOUND } })
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Pins_Generate = (values, UserData, webhook) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let no_of_pins = parseInt(values.Quantity);
                let Total_Pins_Amount = values.Total_Amount;
                let Amount_Used_From_Wallet = values.Amount_Used_From_Wallet;
                let LData = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 9,
                    Amount: Total_Pins_Amount,
                    Data: {
                        no_of_pins: no_of_pins,
                        Total_Pins_Amount: Total_Pins_Amount,
                        Amount_Used_From_Wallet: Amount_Used_From_Wallet
                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(LData).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Withdrawn_Amount": Amount_Used_From_Wallet,
                        "User_Amounts.Available_Amount": (Amount_Used_From_Wallet * -1)
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let querytx = {
                    TransactionID: values.TransactionID
                }
                let changestx = {
                    $set: {
                        Status: 3,
                        WebHookData: webhook,
                        updated_at: new Date()
                    }
                }
                let findupdateTx = await User_Pin_Purchase.findOneAndUpdate(querytx, changestx, fndupdoptions).select('-_id -__v').lean();
                let TranxResult = await User_Pin_Purchase.findOne(querytx).lean()
                resolve("Pins Generated Successfully");
                //console.log(1);
                let Pin10 = 0, Pin100 = 0, Pin1000 = 0, Pin10000 = 0;
                async.timesSeries(no_of_pins, async (index, callback) => {
                    try {
                        let USER_PIN_CODE = await UserController.Take_Unique_USER_PIN_CODE();
                        let Data = {
                            USERID: UserData.USERID,
                            USER_PIN_CODE: USER_PIN_CODE,
                            SubscriptionID: values.SubscriptionID,
                            TransactionID: values.TransactionID,
                            Subscription_Amount: TranxResult.Subscription_Amount,
                            Subscription_Type: TranxResult.Subscription_Name,
                            Version: values.Version,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await User_Pins(Data).save();
                        switch (parseInt(TranxResult.Subscription_Amount)) {
                            case 10:
                                Pin10 = Pin10 + 1// Statements
                                break; // optional
                            case 100:
                                Pin100 = Pin100 + 1// Statements
                                break; // optional
                            case 1000:
                                Pin1000 = Pin1000 + 1// Statements
                                break; // optional
                            case 10000:
                                Pin10000 = Pin10000 + 1// Statements
                                break; // optional
                            // You can have any number of case statements.
                            default: // Optional
                            // Statements
                        }
                        //console.log(2)
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    let Date1 = moment().format('YYYY-MM-DD');
                    let fndupdquerylog = {
                        Date: Date1
                    };
                    let LogCheck = await Day_Pins_Log.findOne(fndupdquerylog).lean();
                    if (LogCheck == null) {

                        let d = new Date();
                        d.setDate(d.getDate() - 1);
                        let Date2 = moment(d).format('YYYY-MM-DD');
                        let queryx = {
                            Date: Date2
                        }
                        let Resultx = await Day_Pins_Log.findOne(queryx).lean();
                        let Data;
                        if (Resultx == null) {
                            Data = {
                                Date: Date1,
                            }
                        } else {
                            Data = {
                                Date: Date1,
                                Total_Pins: Resultx.Total_Pins,
                                Total_Balance_Pins: Resultx.Total_Balance_Pins,
                                Total_Used_Pins: Resultx.Total_Used_Pins,
                            }
                        }
                        let createNew = await Day_Pins_Log(Data).save();
                    }
                    let fndupdchangeslog = {
                        $inc: {
                            "Created_Pins.Pin10": Pin10,
                            "Created_Pins.Pin100": Pin100,
                            "Created_Pins.Pin1000": Pin1000,
                            "Created_Pins.Pin10000": Pin10000,
                            "Balance_Pins.Pin10": Pin10,
                            "Balance_Pins.Pin100": Pin100,
                            "Balance_Pins.Pin1000": Pin1000,
                            "Balance_Pins.Pin10000": Pin10000,
                            "Total_Pins.Pin10": Pin10,
                            "Total_Pins.Pin100": Pin100,
                            "Total_Pins.Pin1000": Pin1000,
                            "Total_Pins.Pin10000": Pin10000,
                            "Total_Balance_Pins.Pin10": Pin10,
                            "Total_Balance_Pins.Pin100": Pin100,
                            "Total_Balance_Pins.Pin1000": Pin1000,
                            "Total_Balance_Pins.Pin10000": Pin10000,
                        }
                    };
                    let fndupdoptionslog = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateDatalog = await Day_Pins_Log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();

                    if (err) reject(err);
                });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Take_Unique_Shop_PIN_CODE = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let USER_PIN_CODE = await CommonController.Common_Unique_Nine_Digit_String();
                let query = {
                    USER_PIN_CODE: USER_PIN_CODE
                };
                let Result = await User_Shop_Pins.findOne(query).lean();
                if (Result == null) {
                    resolve(USER_PIN_CODE);
                } else {
                    USER_PIN_CODE = await UserController.Take_Unique_Shop_PIN_CODE();
                    resolve(USER_PIN_CODE);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Take_Unique_USER_PIN_CODE = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let USER_PIN_CODE = await CommonController.Common_Unique_Nine_Digit_String();
                let query = {
                    USER_PIN_CODE: USER_PIN_CODE
                };
                let Result = await User_Pins.findOne(query).lean();
                if (Result == null) {
                    resolve(USER_PIN_CODE);
                } else {
                    USER_PIN_CODE = await UserController.Take_Unique_USER_PIN_CODE();
                    resolve(USER_PIN_CODE);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Purchase_Pins_Validate_Amount = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let no_of_pins = parseInt(values.no_of_pins);
                let Total_Pins_Amount = no_of_pins * config.New_Purchase_Pin_Amount;
                if (UserData.User_Amounts.Available_Amount >= Total_Pins_Amount) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Home_Screen_Details_News_Data = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Status: true
                };
                let sortOptions = {
                    updated_at: -1
                }
                let Result = await News.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().exec();
                resolve(Result);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Home_Screen_Details_App_Image_Resources = (ResourceType) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ResourceType: ResourceType,
                    Status: true
                };
                let sortOptions = {
                    updated_at: -1
                }
                let Result = await App_Image_Resources.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        item.ImageData = await CommonController.Common_Image_Response_Single_Image(true, item.ImageData);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve(Result);
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Home_Screen_Details_Find_Referral_Information = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    Whether_Referral_Signup: false,
                    USERID: "",
                    Name: "",
                    CountryCode: "",
                    PhoneNumber: ""
                };
                if (UserData.Whether_Referral_Signup && UserData.Referral_USERID != '') {
                    let RefData = await CommonController.Check_Only_User({ USERID: UserData.Referral_USERID });
                    Data.Whether_Referral_Signup = true;
                    Data.USERID = RefData.USERID;
                    Data.Name = RefData.Name;
                    Data.CountryCode = RefData.CountryCode;
                    Data.PhoneNumber = RefData.PhoneNumber;
                    resolve(Data);
                } else {
                    resolve(Data);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Home_Screen_Details_Find_Parent_Information = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: UserData.USERID
                }
                let NetworkData = await Users_Network.findOne(query).lean();
                let Data = {
                    USERID: "",
                    Name: "",
                    CountryCode: "",
                    PhoneNumber: ""
                };
                if (NetworkData.Parent_USERID == 'root') {
                    resolve(Data);
                } else {
                    let ParentData = await CommonController.Check_Only_User({ USERID: NetworkData.Parent_USERID });
                    Data.USERID = ParentData.USERID;
                    Data.Name = ParentData.Name;
                    Data.CountryCode = ParentData.CountryCode;
                    Data.PhoneNumber = ParentData.PhoneNumber;
                    resolve(Data);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Home_Screen_Details = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let UserReferralData = await Users_Referrals.findOne({ USERID: UserData.USERID }).lean();
                let now = moment();
                let date = moment(UserData.User_Account_Registered_Date);
                var diff = now.diff(date, "days");
                diff = Math.abs(diff);
                let Whether_Referral_Setting_Expired = false;
                if (diff > config.max_referral_account_difference_days) {
                    Whether_Referral_Setting_Expired = true;
                }
                UserData.Whether_Referral_Setting_Expired = Whether_Referral_Setting_Expired;
                UserData.diff = Math.abs(config.max_referral_account_difference_days - diff);
                UserData.Completed_Referrals = UserReferralData.No_of_Referrals;
                UserData.Total_Required_Referrals = config.max_referral_account_setting;
                let ReferralData = await UserController.User_Home_Screen_Details_Find_Referral_Information(UserData);
                let ParentData = await UserController.User_Home_Screen_Details_Find_Parent_Information(UserData);
                let NewsData = await UserController.User_Home_Screen_Details_News_Data();
                let SmallBannerData = await UserController.User_Home_Screen_Details_App_Image_Resources(1);
                let SmallIconData = await UserController.User_Home_Screen_Details_App_Image_Resources(2);
                let LargeBannerData = await UserController.User_Home_Screen_Details_App_Image_Resources(3);
                //plot Images should be added here (Buy Home Data)
                let Plots = await UserController.List_All_Active_Plots('', 0, 12);
                //

                if (UserData.Subscription_Data.Delivery_Product_Used == undefined || UserData.Subscription_Data.Delivery_Product_Used == null) {
                    UserData.Subscription_Data.Delivery_Product_Used = 0
                }


                UserData.User_Amounts.Expired_Amount = UserData.User_Amounts.Expired_Amount.toFixed(2);
                resolve({ success: true, extras: { UserData: UserData, ReferralData: ReferralData, ParentData: ParentData, NewsData: NewsData, SmallBannerData: SmallBannerData, SmallIconData: SmallIconData, LargeBannerData: LargeBannerData, Plot_Data: Plots } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing = (UserData, Trimming_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Users_Network_Data = await UserController.Find_Network_Parent_Array([], UserData.USERID);
                await Users_Network_Data.splice(0, 1);
                Users_Network_Data = await UserController.Fetch_All_Trimming_Share_User_Accounts(Users_Network_Data);
                let No_of_Users_Network = Users_Network_Data.length;
                let Remaining_Amount = Trimming_Amount - config.YELLOW_BLUE_CONVERSION_TO_GREEN_PURPLE_STATUS_AMOUNT_LIMIT;
                Trimming_Amount -= Remaining_Amount;
                let Each_User_Trimming_Share_Amount = parseFloat(Trimming_Amount / (config.no_of_user_yellow_blue_conversion_trimmer_share - 1));
                let No_of_User_Share_For_Trimmer = (config.no_of_user_yellow_blue_conversion_trimmer_share - 1) - No_of_Users_Network;
                let Trimmer_Share_Amount = (Each_User_Trimming_Share_Amount * No_of_User_Share_For_Trimmer) + Remaining_Amount;
                async.eachSeries(Users_Network_Data, async (USERID, callback) => {
                    try {
                        let UserShareProcessing = await UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing_User_Amount_Distribution(UserData, USERID, Each_User_Trimming_Share_Amount);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    let TrimmerProcessing = await UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing_Trimmer_Amount_Sharing_Trimmer_Share_Amount_for_Remaining(UserData, Users_Network_Data, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount);
                    resolve("Total Processing Completed");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing_Trimmer_Amount_Sharing_Trimmer_Share_Amount_for_Remaining = (UserData, Users_Network_Data, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (No_of_User_Share_For_Trimmer >= 1 && Trimmer_Share_Amount > 0) {
                    let Trimmer_Amount = Trimmer_Share_Amount;
                    let Data = {
                        UserData: UserData,
                        Amount: Trimmer_Amount,
                        No_of_User_Share_For_Trimmer: No_of_User_Share_For_Trimmer,
                        Users_Network_Data: Users_Network_Data
                    };
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 6,//Non Available Hierarchy pushed to trimmer
                        Amount: Trimmer_Amount,
                        Data: Data,
                        Time: new Date()
                    };
                    let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                    let Tfndupdquery = {

                    };
                    let Tfndupdchanges = {
                        $inc: {
                            Available_Amount: Trimmer_Amount,
                            Total_Amount: Trimmer_Amount
                        }
                    };
                    let Tfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                    resolve("Share Processing Completed");
                } else {
                    resolve("Share Processing Completed");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing_User_Amount_Distribution = (UserData, USERID, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let User_Amount = parseFloat((Amount * config.User_Trimmer_Share) / 100);
                let User_Taxex_Amount = parseFloat(Amount - User_Amount);
                let Company_Amount = parseFloat((Amount * config.Company_Trimmer_Share) / 100);
                let Trimmer_Amount = parseFloat((Amount * config.Trimmer_Trimmer_Share) / 100);
                let Data = {
                    UserData: UserData,
                    Amount: Amount
                };
                let UData = {
                    LogID: uuid.v4(),
                    USERID: USERID,
                    Type: 7,
                    Amount: User_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let USaveResult = await User_Wallet_Logs(UData).save();
                let Ufndupdquery = {
                    USERID: USERID
                };
                let Ufndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": User_Amount,
                        "User_Amounts.Referral_Amount": User_Amount,
                        "User_Amounts.Total_Amount": User_Amount,
                        "User_Amounts.Service_Fee_and_Taxes_Amount": User_Taxex_Amount
                    }
                };
                let Ufndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                let CData = {
                    LogID: uuid.v4(),
                    Type: 3,
                    Amount: Company_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let CSaveResult = await Company_Wallet_Logs(CData).save();
                let Cfndupdquery = {

                };
                let Cfndupdchanges = {
                    $inc: {
                        Available_Amount: Company_Amount,
                        Total_Amount: Company_Amount
                    }
                };
                let Cfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                let TData = {
                    LogID: uuid.v4(),
                    Type: 5,
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Trimmer_Amount,
                        Total_Amount: Trimmer_Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Find_Network_Parent_Array = (Data, USERID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let NetworkData = await Users_Network.findOne({ USERID: USERID }).lean();
                Data.push(USERID);
                //BOOKMARK LOGIC
                console.log(USERID, "??")
                // if(no_of_user_subscription_share != undefined ){
                //     config.no_of_user_subscription_share = no_of_user_subscription_share
                // }
                console.log(config.no_of_user_subscription_share,"config.no_of_user_subscription_share")
                if (Data.length >= config.no_of_user_subscription_share || NetworkData.Parent_USERID == 'root') {
                    resolve(Data);
                } else {
                    Data = await UserController.Find_Network_Parent_Array(Data, NetworkData.Parent_USERID);
                    resolve(Data);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
UserController.Fetch_All_Trimming_Share_User_Accounts = (Users_Network_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: {
                        $in: Users_Network_Data
                    },
                    User_Account_Status: {
                        $in: [1, 2, 3, 4, 5]
                    },
                    Whether_Subscribed: true
                };
                Users_Network_Data = await Users.distinct('USERID', query).lean();
                resolve(Users_Network_Data);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Fetch_All_Subscription_Share_User_Accounts = (Users_Network_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: {
                        $in: Users_Network_Data
                    },
                    User_Account_Status: {
                        $in: [1, 2, 3, 4, 5]
                    },
                    Whether_Subscribed: true
                };
                Users_Network_Data = await Users.distinct('USERID', query).lean();
                resolve(Users_Network_Data);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Fetch_All_Subscription_Share_User_Accounts_Expired_Accounts = (Users_Network_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: {
                        $in: Users_Network_Data
                    },
                    User_Account_Status: {
                        $in: [6]
                    },
                    Whether_Subscribed: true
                };
                Users_Network_Data = await Users.distinct('USERID', query).lean();
                resolve(Users_Network_Data);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
//BOOKMARK
UserController.Subscription_Amount_Sharing_User_Processing = (values, UserData, Subscription_Logs, USERID, Users_Network_Data, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // UserData.i = i
                console.log(UserData.i, "IIIIIS", USERID, Subscription_Logs.Subscription_Amount)
                let Ufndupdquery = {
                    USERID: USERID
                };
                let udata = await Users.findOne(Ufndupdquery).lean();
                let Subscription_Amount = parseFloat(udata.Subscription_Data.Subscription_Amount) / (config.no_of_user_subscription_share - 1);
                let Max_Amount;
                let Excess_Amount = 0;
                if (Subscription_Amount < Amount) {
                    Max_Amount = Subscription_Amount;
                    Excess_Amount = Amount - Subscription_Amount;
                } else {
                    Max_Amount = Amount;
                }
                ////

                let User_Amount = parseFloat((Max_Amount * udata.Subscription_Data.Subscription_Limits.User_Subscription_Share) / 100);
                let User_Taxex_Amount = parseFloat(Max_Amount - User_Amount);
                let Company_Amount = parseFloat((Max_Amount * udata.Subscription_Data.Subscription_Limits.Company_Subscription_Share) / 100);
                let Trimmer_Amount = parseFloat(((Max_Amount * udata.Subscription_Data.Subscription_Limits.Trimmer_Subscription_Share) / 100) + Excess_Amount); //BOOKMARK UPDATE
                let Gift_Amount = 0
                let Level_One_Amount = 0
                let Level_Two_Amount = 0
                if (Subscription_Logs.New_Pin) {
                    // console.log(Subscription_Logs.Subscription_Limits.Gift_Share,
                    //     Subscription_Logs.Subscription_Limits.Level_One_Share,
                    //     Subscription_Logs.Subscription_Limits.Level_Two_Share)

                    if (udata.Subscription_Data.Subscription_Limits.Gift_Share == null || udata.Subscription_Data.Subscription_Limits.Gift_Share == undefined) {
                        Trimmer_Amount += parseFloat((Max_Amount * Subscription_Logs.Subscription_Limits.Gift_Share) / 100);
                        // console.log(Trimmer_Amount, "Trimmer_Amount")

                    } else {
                        Gift_Amount = parseFloat((Max_Amount * udata.Subscription_Data.Subscription_Limits.Gift_Share) / 100);
                        // console.log(Trimmer_Amount, "Trimmer_Amount123")
                    }
                    if (UserData.i == 1) {
                        if (udata.Subscription_Data.Subscription_Limits.Gift_Share == null || udata.Subscription_Data.Subscription_Limits.Gift_Share == undefined) {
                            Trimmer_Amount += parseFloat((Subscription_Logs.Subscription_Amount * Subscription_Logs.Subscription_Limits.Level_One_Share) / 100);
                            // console.log(Trimmer_Amount, "Trimmer_Amount2")

                        } else {
                            Level_One_Amount = parseFloat((Subscription_Logs.Subscription_Amount * udata.Subscription_Data.Subscription_Limits.Level_One_Share) / 100);
                        }
                        // console.log(Level_One_Amount,"Level_One_Amount")

                    }
                    if (UserData.i == 2) {
                        if (udata.Subscription_Data.Subscription_Limits.Gift_Share == null || udata.Subscription_Data.Subscription_Limits.Gift_Share == undefined) {
                            Trimmer_Amount += parseFloat((Subscription_Logs.Subscription_Amount * Subscription_Logs.Subscription_Limits.Level_Two_Share) / 100);
                            // console.log(Trimmer_Amount, "Trimmer_Amoun3")

                        } else {
                            Level_Two_Amount = parseFloat((Subscription_Logs.Subscription_Amount * udata.Subscription_Data.Subscription_Limits.Level_Two_Share) / 100);
                        }
                        // console.log(Level_Two_Amount,"Level_Two_Amount")
                    }

                    //  Level_One_Amount = parseFloat((Max_Amount * udata.Subscription_Data.Subscription_Limits.Level_One_Share) / 100);

                    // Level_Two_Amount = parseFloat((Max_Amount * udata.Subscription_Data.Subscription_Limits.Level_Two_Share) / 100);

                }

                let Data = {
                    UserData: UserData,
                    Subscription_Logs: udata.Subscription_Data,
                    Amount: Max_Amount
                };
                let UData = {
                    LogID: uuid.v4(),
                    USERID: USERID,
                    Type: 3,
                    Amount: User_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let USaveResult = await User_Wallet_Logs(UData).save();
                let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Level_Sharing', User_Amount);



                let Ufndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": User_Amount,
                        "User_Amounts.Referral_Amount": User_Amount,
                        "User_Amounts.Total_Amount": User_Amount,
                        "User_Amounts.Service_Fee_and_Taxes_Amount": User_Taxex_Amount, //BOOKMARK WORK
                        "User_Amounts.Gift_Amount": Gift_Amount,
                        "User_Amounts.Level_One_Amount": Level_One_Amount,
                        "User_Amounts.Level_Two_Amount": Level_Two_Amount,
                    }
                };

                console.log(Ufndupdchanges, "Ufndupdchanges", Subscription_Amount, "Subscription_Amount", udata.Subscription_Data.Subscription_Limits.Level_One_Share, "udata.Subscription_Data.Subscription_Limits.Level_One_Share", parseFloat((Subscription_Amount * udata.Subscription_Data.Subscription_Limits.Level_One_Share) / 100))
                let Ufndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                let CData = {
                    LogID: uuid.v4(),
                    Type: 1,
                    Amount: Company_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let CSaveResult = await Company_Wallet_Logs(CData).save();
                let Cfndupdquery = {

                };
                let Cfndupdchanges = {
                    $inc: {
                        Available_Amount: Company_Amount,
                        Total_Amount: Company_Amount
                    }
                };
                let Cfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                let refprocessz = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Company_Sharing', Company_Amount);
                let TData = {
                    LogID: uuid.v4(),
                    Type: 1,
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Trimmer_Amount,
                        Total_Amount: Trimmer_Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                // code for expired amount

                if (Excess_Amount != 0) {
                    let Expired_User_Amount = parseFloat((Amount * udata.Subscription_Data.Subscription_Limits.User_Subscription_Share) / 100) - User_Amount;
                    let EData = {
                        UserData: UserData,
                        Subscription_Logs: udata.Subscription_Data,
                        Amount: Expired_User_Amount
                    };
                    let EUData = {
                        LogID: uuid.v4(),
                        USERID: USERID,
                        Type: 16,
                        Amount: Expired_User_Amount,
                        Data: EData,
                        Time: new Date()
                    };
                    let EUSaveResult = await User_Wallet_Logs(EUData).save();
                    let EUfndupdquery = {
                        USERID: USERID
                    };
                    let EUfndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Expired_Amount": Expired_User_Amount
                        }
                    };
                    let EUfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let EUfindupdateData = await Users.findOneAndUpdate(EUfndupdquery, EUfndupdchanges, EUfndupdoptions).select('-_id -__v').lean();
                }
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Subscription_Amount_Sharing_User_Processing_Expired = (values, UserData, Subscription_Logs, USERID, Users_Network_Data_Expired, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let Data = {
                    UserData: UserData,
                    Subscription_Logs: Subscription_Logs,
                    Amount: Amount
                };
                let UData = {
                    LogID: uuid.v4(),
                    USERID: USERID,
                    Type: 16,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let USaveResult = await User_Wallet_Logs(UData).save();
                let Ufndupdquery = {
                    USERID: USERID
                };
                let Ufndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Expired_Amount": Amount
                    }
                };
                let Ufndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UfindupdateData = await Users.findOneAndUpdate(Ufndupdquery, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                let TData = {
                    LogID: uuid.v4(),
                    Type: 9,
                    Amount: Amount,
                    Data: Data,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Amount,
                        Total_Amount: Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Subscription_Amount_Sharing_Trimmer_Share_Amount_for_Remaining = (values, UserData, Subscription_Logs, Users_Network_Data, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (No_of_User_Share_For_Trimmer >= 1 && Trimmer_Share_Amount > 0) {
                    let Trimmer_Amount = Trimmer_Share_Amount;
                    let Data = {
                        UserData: UserData,
                        Subscription_Logs: Subscription_Logs,
                        Amount: Trimmer_Amount,
                        No_of_User_Share_For_Trimmer: No_of_User_Share_For_Trimmer,
                        Users_Network_Data: Users_Network_Data
                    };
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 2,//Non Available Hierarchy pushed to trimmer
                        Amount: Trimmer_Amount,
                        Data: Data,
                        Time: new Date()
                    };
                    let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                    let Tfndupdquery = {

                    };
                    let Tfndupdchanges = {
                        $inc: {
                            Available_Amount: Trimmer_Amount,
                            Total_Amount: Trimmer_Amount
                        }
                    };
                    let Tfndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                    resolve("Share Processing Completed");
                } else {
                    resolve("Share Processing Completed");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Subscription_Amount_Sharing_Expired = (values, UserData, Subscription_Logs, Users_Network_Data_Expired, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                async.eachSeries(Users_Network_Data_Expired, async (USERID, callback) => {
                    try {
                        let UserShareProcessing = await UserController.Subscription_Amount_Sharing_User_Processing_Expired(values, UserData, Subscription_Logs, USERID, Users_Network_Data_Expired, Amount);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Total Processing Completed");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Level_Two_Undefined_Subscription_Amount_Sharing = (values, UserData, Subscription_Logs, Users_Network_Data, Each_User_Subscription_Share_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                
                // let Max_Amount = Each_User_Subscription_Share_Amount;
                let Max_Amount = Subscription_Logs.Subscription_Amount;
                

                let Trimmer_Amount = parseFloat((Max_Amount * Subscription_Logs.Subscription_Limits.Level_Two_Share) / 100);
                console.log(Trimmer_Amount,"Trimmer_Amount", Max_Amount, "Max_Amount")


                let TData = {
                    LogID: uuid.v4(),
                    Type: 1,
                    Amount: Trimmer_Amount,
                    Data: UserData,
                    Time: new Date()
                };
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Available_Amount: Trimmer_Amount,
                        Total_Amount: Trimmer_Amount
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();

                // async.eachSeries(Users_Network_Data_Expired, async (USERID, callback) => {
                //     try {
                //         let UserShareProcessing = await UserController.Subscription_Amount_Sharing_User_Processing_Expired(values, UserData, Subscription_Logs, USERID, Users_Network_Data_Expired, Amount);
                //         callback();
                //     } catch (error) {
                //         callback(error);
                //     }
                // }, async (err) => {
                //     if (err) reject(err);
                //     resolve("Total Processing Completed");
                // });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


//BOOKMARK
UserController.Subscription_Amount_Sharing = (values, UserData, Subscription_Logs) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                console.log(Subscription_Logs.Subscription_Limits.Max_Receivers);
                config.no_of_user_subscription_share = Subscription_Logs.Subscription_Limits.Max_Receivers;
                console.log(config.no_of_user_subscription_share, "Max Recievers");

                let Users_Network_Data = await UserController.Find_Network_Parent_Array([], UserData.USERID );
                await Users_Network_Data.splice(0, 1);
                let Users_Network_Data_Expired = await UserController.Fetch_All_Subscription_Share_User_Accounts_Expired_Accounts(Users_Network_Data);
                Users_Network_Data = await UserController.Fetch_All_Subscription_Share_User_Accounts(Users_Network_Data); //??
                let No_of_Users_Network = Users_Network_Data.length;
                console.log("5103--->" + No_of_Users_Network)
                let No_of_Users_Network_Expired = Users_Network_Data_Expired.length;
                let Subscription_Amount = Subscription_Logs.Subscription_Amount;
                let Each_User_Subscription_Share_Amount = parseFloat(Subscription_Amount / (config.no_of_user_subscription_share - 1));
                let Each_User_Subscription_Share_Amount_Trimm = parseFloat((Subscription_Amount / (config.no_of_user_subscription_share - 1)) * Subscription_Logs.Subscription_Limits.User_Subscription_Share / 100);
                let No_of_User_Share_For_Trimmer = (config.no_of_user_subscription_share - 1) - No_of_Users_Network - No_of_Users_Network_Expired;
                let Trimmer_Share_Amount = Each_User_Subscription_Share_Amount_Trimm * No_of_User_Share_For_Trimmer;

                //Code Added Raj
                let Rev_Users_Network_Data = Users_Network_Data.reverse();

                console.log("5114--->" + JSON.stringify(Rev_Users_Network_Data))
                // Users_Network_Data = Users_Network_Data.reverse();

                if (Subscription_Logs.New_Pin) {
                    console.log('hello level 2')
                    if (Rev_Users_Network_Data[1] == null || Rev_Users_Network_Data[1] == undefined) {

                        UserController.Level_Two_Undefined_Subscription_Amount_Sharing(values, UserData, Subscription_Logs, Users_Network_Data, Each_User_Subscription_Share_Amount)
                    }
                }

                var i = 1;
                console.log(Users_Network_Data, Users_Network_Data.length, "Users_Network_Data")
                async.eachSeries(Users_Network_Data, async (USERID, callback) => {
                    try {
                        UserData.i = 0;
                        UserData.i = i;
                        console.log(i)
                        let UserShareProcessing = await UserController.Subscription_Amount_Sharing_User_Processing(values, UserData, Subscription_Logs, USERID, Users_Network_Data, Each_User_Subscription_Share_Amount); //BOOKMARK
                        // console.log("LEVEL 0", Subscription_Logs)
                        // if (Rev_Users_Network_Data[0] !== null) {
                        //     console.log("LEVEL 1")
                        // }
                        // if (Rev_Users_Network_Data[1] != null) {
                        //     console.log("LEVEL 2")
                        // }
                        i++;
                        callback();                        
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);

                    i= 0;
                    let ExpiredProcessing = await UserController.Subscription_Amount_Sharing_Expired(values, UserData, Subscription_Logs, Users_Network_Data_Expired, Each_User_Subscription_Share_Amount);
                    let TrimmerProcessing = await UserController.Subscription_Amount_Sharing_Trimmer_Share_Amount_for_Remaining(values, UserData, Subscription_Logs, Users_Network_Data, No_of_User_Share_For_Trimmer, Trimmer_Share_Amount);
                    resolve("Total Processing Completed");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



UserController.Find_Network_Child_Array = (USERID, ALL_USERID_ARRAY, LastCount) => {
    return new Promise(async (resolve, reject) => {
        let query = {
            $or: [
                {
                    USERID: USERID
                },
                {
                    USERID: {
                        $in: ALL_USERID_ARRAY
                    }
                }
            ]
        };
        //console.log('15.1.1');
        let Data = await Users_Network.distinct('Network_USERID_Array', query).lean();
        let mainfind = ALL_USERID_ARRAY.find(ele => ele === USERID);
        if (mainfind === null || mainfind === undefined) {
            ALL_USERID_ARRAY.push(USERID);
        };
        async.eachSeries(Data, (item, callback) => {
            //console.log(item)
            let Available = ALL_USERID_ARRAY.find(ele => ele == item);
            if (Available === null || Available === undefined) {
                //console.log('15.1.2');
                ALL_USERID_ARRAY.push(item);
                callback();
            } else {
                //console.log('15.1.3');
                callback();
            }
        }, async err => {
            let Total_length = ALL_USERID_ARRAY.length;
            if (Total_length > LastCount) {
                //console.log('15.1.4');
                ALL_USERID_ARRAY = await UserController.Find_Network_Child_Array(USERID, ALL_USERID_ARRAY, Total_length);
                resolve(ALL_USERID_ARRAY);
            } else if (Total_length == LastCount) {
                //console.log('15.1.5');
                ALL_USERID_ARRAY = await UserController.Find_Network_Child_Array(USERID, ALL_USERID_ARRAY, Total_length + 1);
                resolve(ALL_USERID_ARRAY);
            } else {
                //console.log('15.1.6');
                resolve(ALL_USERID_ARRAY);
            }
        })
    })
}

// UserController.Find_Network_Child_Array = (USERID, ALL_USERID_ARRAY, LAST_ALL_USERID_ARRAY) => {
//     return new Promise((resolve, reject) => {
//         setImmediate(async () => {
//             try {
//                 let query = new Object();
//                 console.log('15.1.1');
//                 if (ALL_USERID_ARRAY.length <= 0) {
//                     console.log('15.1.2');
//                     query = {
//                         Parent_USERID: USERID
//                     };
//                     let Data = await Users_Network.distinct('USERID', query).lean();
//                     console.log('15.1.3');
//                     if (Data.length > 0) {
//                         console.log('15.1.4');
//                         ALL_USERID_ARRAY = await UserController.Find_Network_Child_Array(USERID, Data, []);
//                         resolve(ALL_USERID_ARRAY);
//                     } else {
//                         console.log('15.1.5');
//                         resolve(Data);
//                     }
//                 } else {
//                     console.log('15.1.6');
//                     query = {
//                         $and: [
//                             {
//                                 Parent_USERID: {
//                                     $in: ALL_USERID_ARRAY
//                                 }
//                             },
//                             {
//                                 Parent_USERID: {
//                                     $nin: LAST_ALL_USERID_ARRAY
//                                 }
//                             },
//                         ]
//                     };
//                     console.log("the query------------------------>");
//                     console.log(JSON.stringify(query));
//                     let Data = await Users_Network.distinct('USERID', query).lean();
//                     // console.log('15.1.7');
//                     if (Data.length > 0) {
//                         console.log("the all user data------------>", ALL_USERID_ARRAY.length);
//                         console.log("the data------------>", Data.length);
//                         console.log(JSON.stringify(Data));
//                         console.log('15.1.8');
//                         //let All_U_ARRAY = []
//                         async.eachSeries(Data, (item, callback) => {
//                             let Available = ALL_USERID_ARRAY.find(ele => ele == item);
//                             if (Available == null) {
//                                 // console.log('15.1.9');
//                                 ALL_USERID_ARRAY.push(item);
//                                 callback();
//                             } else {
//                                 // console.log('15.1.11');
//                                 callback();
//                             }
//                         }, async err => {
//                             // console.log('15.1.12');
//                             // console.log('15.1.12 -->' + ALL_USERID_ARRAY);
//                             ALL_USERID_ARRAY = await UserController.Find_Network_Child_Array(USERID, ALL_USERID_ARRAY, Data);
//                             resolve(ALL_USERID_ARRAY);
//                         })
//                     } else {
//                         console.log('15.1.13');
//                         resolve(ALL_USERID_ARRAY);
//                     }
//                 };
//             } catch (error) {
//                 reject(await CommonController.Common_Error_Handler(error));
//             }
//         });
//     });
// }

UserController.User_Network_Processing_Referral_User_Network_Processing = (UserData, ReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: ReferralData.USERID
                };
                let ReferralNetworkData = await Users_Network.findOne(query).lean();
                //console.log(ReferralNetworkData)
                //console.log(11)
                if (ReferralNetworkData.No_of_Network < config.max_user_network_heirarchy) {
                    //console.log(12)
                    let query1 = {
                        USERID: ReferralData.USERID
                    };
                    let changes1 = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            No_of_Network: 1
                        },
                        $push: {
                            Network_USERID_Array: UserData.USERID,
                            Network_Information: UserData
                        }
                    };
                    let UpdatedStatus = await Users_Network.updateOne(query1, changes1).lean();
                    let data1 = {
                        USERID: UserData.USERID,
                        Network_Number: await CommonController.Generate_Counter_Sequence('Users_Network'),
                        Parent_USERID: ReferralNetworkData.USERID,
                        Name: UserData.Name,
                        CountryCode: UserData.CountryCode,
                        PhoneNumber: UserData.PhoneNumber,
                        Whether_Company_Account: UserData.Whether_Company_Account,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let SaveResult = await Users_Network(data1).save();
                    resolve("Network Information Processed");
                } else {
                    //console.log(13) //BOOKMARK NETWORK
                    let squery = {
                        USERID: {
                            $in: ReferralNetworkData.Network_USERID_Array
                        },
                        No_of_Network: {
                            $lt: config.max_user_network_heirarchy
                        }
                    }
                    let Available_Network_Data = await Users_Network.findOne(squery).sort({ No_of_Network: 1 }).lean().exec();
                    //console.log(14)

                    if (Available_Network_Data == null) {
                        //console.log(15)
                        //free Child Network Available
                        let Child_ALL_USERID_ARRAY = await UserController.Find_Network_Child_Array(ReferralData.USERID, [], 0);
                        //console.log(15.1)
                        //console.log(15.1 + '-->' + Child_ALL_USERID_ARRAY)

                        let fndupdquery1 = {
                            Status: true,
                            USERID: {
                                $in: Child_ALL_USERID_ARRAY
                            },
                            No_of_Network: {
                                $lt: config.max_user_network_heirarchy
                            }
                        };
                        let fndupdchanges1 = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Network: 1
                            },
                            $push: {
                                Network_USERID_Array: UserData.USERID,
                                Network_Information: UserData
                            }
                        };
                        let fndupdoptions1 = {
                            new: true,
                            sort: {
                                Network_Number: 1
                            }
                        }
                        let ParentDetail = await Users_Network.findOneAndUpdate(fndupdquery1, fndupdchanges1, fndupdoptions1).select('-_id -__v').lean();
                        let ParentDetail1 = await Users_Network.findOne(fndupdquery1).select('-_id -__v').lean();

                        // console.log(15.2)
                        // console.log(15.2 + '--> ' + ParentDetail)
                        // console.log(15.2 + '--> ' + ParentDetail1)
                        let data1 = {
                            USERID: UserData.USERID,
                            Network_Number: await CommonController.Generate_Counter_Sequence('Users_Network'),
                            Parent_USERID: ParentDetail1.USERID,
                            Name: UserData.Name,
                            CountryCode: UserData.CountryCode,
                            PhoneNumber: UserData.PhoneNumber,
                            Whether_Company_Account: UserData.Whether_Company_Account,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await Users_Network(data1).save();
                        //console.log(15.3)
                        resolve("Network Information Processed");
                    } else {
                        //console.log(16)
                        //free Child Network Available
                        let query1 = {
                            USERID: Available_Network_Data.USERID
                        };
                        let changes1 = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Network: 1
                            },
                            $push: {
                                Network_USERID_Array: UserData.USERID,
                                Network_Information: UserData
                            }
                        };
                        let UpdatedStatus = await Users_Network.updateOne(query1, changes1).lean();
                        let data1 = {
                            USERID: UserData.USERID,
                            Network_Number: await CommonController.Generate_Counter_Sequence('Users_Network'),
                            Parent_USERID: Available_Network_Data.USERID,
                            Name: UserData.Name,
                            CountryCode: UserData.CountryCode,
                            PhoneNumber: UserData.PhoneNumber,
                            Whether_Company_Account: UserData.Whether_Company_Account,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await Users_Network(data1).save();
                        resolve("Network Information Processed");
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Network_Processing_Referral_Account_Setting_Yellow_Blue = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                UserData = await Users.findOne({ USERID: UserData.USERID }).lean();
                let UserReferralData = await Users_Referrals.findOne({ USERID: UserData.USERID }).lean();
                let No_of_Referrals = UserReferralData.No_of_Referrals;
                if (No_of_Referrals >= config.max_referral_account_setting) {
                    //Only for Account Red and Black
                    if (UserData.User_Account_Status == 1 || UserData.User_Account_Status == 6) {
                        let now = moment();
                        let date = moment(UserData.User_Account_Registered_Date);
                        var diff = now.diff(date, "days");
                        diff = Math.abs(diff);
                        let User_Account_Status = UserData.User_Account_Status;
                        let User_Account_Status_Logs = new Object();
                        if (diff <= config.max_referral_account_difference_days) {
                            User_Account_Status = 2;
                            User_Account_Status_Logs = {
                                User_Account_Status: User_Account_Status,
                                Comment: COMMON_SYSTEM_MESSAGES.YELLOW_STATUS_REFERRAL_SIGNUP,
                                Time: new Date()
                            }
                        } else {
                            User_Account_Status = 3;
                            User_Account_Status_Logs = {
                                User_Account_Status: User_Account_Status,
                                Comment: COMMON_SYSTEM_MESSAGES.BLUE_STATUS_REFERRAL_SIGNUP,
                                Time: new Date()
                            }
                        }
                        let query = {
                            USERID: UserData.USERID
                        };
                        let changes = {
                            $set: {
                                User_Account_Status: User_Account_Status,
                                updated_at: new Date()
                            },
                            $push: {
                                User_Account_Status_Logs: User_Account_Status_Logs
                            }
                        };
                        let UpdatedStatus = await Users.updateOne(query, changes).lean();
                        resolve("Processing Completed")
                    } else {
                        resolve("Processing Completed")
                    }
                } else {
                    resolve("Processing Completed")
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.User_Network_Processing = (UserData, ReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (ReferralData.USERID != '' && UserData.Referral_USERID != '') {
                    //Referral Network 
                    let ReferralNetworkCreation = await UserController.User_Network_Processing_Referral_User_Network_Processing(UserData, ReferralData);
                    //let ReferralAccountSetting = await UserController.User_Network_Processing_Referral_Account_Setting_Yellow_Blue(ReferralData);
                    resolve("Network Information Processed");
                } else {
                    //Not Referral
                    //Check Whether Any Network Exist
                    let query1 = {
                        Status: true
                    }
                    let CheckAtleastOneUserNetworkExist = await Users_Network.findOne(query1).lean();
                    if (CheckAtleastOneUserNetworkExist == null) {
                        //Root or First Network User
                        let data1 = {
                            USERID: UserData.USERID,
                            Network_Number: await CommonController.Generate_Counter_Sequence('Users_Network'),
                            Name: UserData.Name,
                            CountryCode: UserData.CountryCode,
                            PhoneNumber: UserData.PhoneNumber,
                            Whether_Company_Account: UserData.Whether_Company_Account,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await Users_Network(data1).save();
                        resolve("Network Information Processed");
                    } else {
                        //Not the Root User
                        let fndupdquery1 = {
                            Status: true,
                            No_of_Network: {
                                $lt: config.max_user_network_heirarchy
                            }
                        };
                        let fndupdchanges1 = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Network: 1
                            },
                            $push: {
                                Network_USERID_Array: UserData.USERID,
                                Network_Information: UserData
                            }
                        };
                        let fndupdoptions1 = {
                            new: true,
                            sort: {
                                Network_Number: 1
                            }
                        }
                        let ParentDetail = await Users_Network.findOneAndUpdate(fndupdquery1, fndupdchanges1, fndupdoptions1).select('-_id -__v').lean();
                        let data1 = {
                            USERID: UserData.USERID,
                            Network_Number: await CommonController.Generate_Counter_Sequence('Users_Network'),
                            Parent_USERID: ParentDetail.USERID,
                            Name: UserData.Name,
                            CountryCode: UserData.CountryCode,
                            PhoneNumber: UserData.PhoneNumber,
                            Whether_Company_Account: UserData.Whether_Company_Account,
                            created_at: new Date(),
                            updated_at: new Date()
                        }
                        let SaveResult = await Users_Network(data1).save();
                        resolve("Network Information Processed");
                    };
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Register_User_With_Subscription = (values, UserData, ReferralData) => { // not using
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let now = moment();
                let expiry_moment = (UserData.Subscription_Expiry_Date == null) ? moment().subtract(1, 'hour') : moment(UserData.Subscription_Expiry_Date);
                if (!UserData.Whether_Subscribed || now.isAfter(expiry_moment)) {
                    let User_Account_Status = 1;
                    let User_Account_Status_Logs = {
                        User_Account_Status: User_Account_Status,
                        Comment: COMMON_SYSTEM_MESSAGES.USER_REGISTRATION_AND_SUBSCRIPTION,
                        Time: new Date()
                    };
                    let Amount = config.New_Subscription_Amount;
                    let Subscription_Type = parseInt(values.Subscription_Type);
                    let Subscription_Expiry_Date = moment().add(1, 'year').subtract(1, 'ms').toDate();
                    let Subscription_Logs = {
                        SubscriptionID: uuid.v4(),
                        Subscription_Amount: Amount,
                        Subscription_Type: Subscription_Type,
                        Subscription_Expiry_Date: Subscription_Expiry_Date,
                        Time: new Date()
                    };
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            Name: values.Name,
                            EmailID: values.EmailID,
                            User_Basic_Information_Available: true,
                            Whether_Referral_Signup: Boolify(values.Whether_Referral_Signup),
                            Referral_USERID: ReferralData.USERID,
                            Whether_Subscribed: true,
                            Subscription_Type: Subscription_Type,
                            Subscription_Expiry_Date: Subscription_Expiry_Date,
                            USER_PIN_CODE: values.USER_PIN_CODE,
                            User_Account_Status: User_Account_Status,
                            User_Account_Registered_Date: new Date(),
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Withdrawn_Amount": Amount,
                            "User_Amounts.Available_Amount": (Amount * -1),
                        },
                        $push: {
                            Subscription_Logs: Subscription_Logs,
                            User_Account_Status_Logs: User_Account_Status_Logs
                        }
                    };
                    let fndupdoptions = {
                        new: true
                    }
                    UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    let Data = {
                        LogID: uuid.v4(),
                        USERID: values.USERID,
                        Type: 2, //Account Subscription Amount Debited from Wallet
                        Amount: Amount,
                        Data: Subscription_Logs,
                        Time: new Date()
                    };
                    let SaveResult = await User_Wallet_Logs(Data).save();
                    resolve([{ success: true, extras: { Status: "Register and Subscribed Successfully" } }, Subscription_Logs]);
                    if (Boolify(values.Whether_Referral_Signup)) {
                        let rquery = {
                            USERID: ReferralData.USERID
                        };
                        let rchanges = {
                            $set: {
                                Name: ReferralData.Name,
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Referrals: 1
                            },
                            $push: {
                                Referral_USERID_Array: UserData.USERID,
                                Referral_Information: UserData
                            }
                        };
                        let RUpdatedStatus = await Users_Referrals.updateOne(rquery, rchanges).lean();
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.ALREADY_SUBSCRIBED } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Subscription_With_ID = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let onlineamount
                //if (!UserData.Whether_Subscribed) {
                let query = {
                    SubscriptionID: values.SubscriptionID
                }
                let SubscriptionResult = await Subscription.findOne(query).lean();
                if (SubscriptionResult != null) {
                    let TranxID = uuid.v4();
                    let calbk;
                    let Data = {
                        SubscriptionID: values.SubscriptionID,
                        Version: SubscriptionResult.Current_Version,
                        Total_Amount: SubscriptionResult.Subscription_Amount,
                        USERID: values.USERID,
                        Status: 1,
                        TransactionID: TranxID,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let SaveSub = await User_Subscription_Log(Data).save();
                    let Final_Amount = SubscriptionResult.Subscription_Amount;
                    let Wallet_Amount = UserData.User_Amounts.Available_Amount;
                    onlineamount = Final_Amount - Wallet_Amount;
                    if (onlineamount <= 0) {
                        onlineamount = 0;
                    }
                    if (parseInt(onlineamount) == 0) { calbk = false } else { calbk = true }
                    let Result = {
                        Total_Amount: parseFloat(onlineamount.toFixed(2)),
                        TransactionID: TranxID,
                        CallBack: calbk
                    }
                    resolve({ success: true, extras: { Data: Result } });
                    if (calbk == false) {
                        let query = {
                            TransactionID: TranxID
                        };
                        let subResult = await User_Subscription_Log.findOne(query).lean();
                        let changes = {
                            $set: {
                                Status: 3,
                                WebHookData: '',
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Subscription_Log.updateOne(query, changes).lean();
                        let queryUser = {
                            USERID: subResult.USERID
                        }
                        let UserData = await Users.findOne(queryUser).lean();

                        let upgrade = UserData.Whether_Subscribed;
                        UserData.Upgrade = upgrade;
                        // console.log('hello Deliver product if subscribed')
                        // let Place_Order_Product = await CommonController.User_Place_Order();
                        let FinalResult = await CommonController.User_Add_Subscription_Data(subResult, UserData, 2, onlineamount)
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_NOT_FOUND } });
                }
                // } else {
                //     reject({ success: false, extras: { msg: ApiMessages.ALREADY_SUBSCRIBED } });
                // }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Subscription_With_PIN = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                //if (!UserData.Whether_Subscribed) {
                let query = {
                    USER_PIN_CODE: values.USER_PIN_CODE,
                    Status: true
                }
                let PinResult = await User_Pins.findOne(query).lean();
                if (PinResult != null) {
                    if (!PinResult.Whether_Code_Used) {
                        let changes = {
                            $set: {
                                Whether_Code_Used: true,
                                PIN_APPLIED_DETAILS: {
                                    USERID: UserData.USERID,
                                    Name: UserData.Name,
                                    CountryCode: UserData.CountryCode,
                                    PhoneNumber: UserData.PhoneNumber
                                },
                                updated_at: new Date()
                            }
                        }
                        let UpdateData = await User_Pins.updateOne(query, changes).lean();
                        let PinFree = 0, Pin10 = 0, Pin100 = 0, Pin1000 = 0, Pin10000 = 0, PinShop = 0;
                        switch (parseInt(PinResult.Subscription_Amount)) {
                            case 10:
                                if ((PinResult.USERID.startsWith("Admin_"))) {
                                    PinFree = PinFree + 1// Statements
                                } else {
                                    Pin10 = Pin10 + 1// Statements
                                }
                                break; // optional
                            case 100:
                                if ((PinResult.USERID.startsWith("Admin_"))) {
                                    PinFree = PinFree + 1// Statements
                                } else {
                                    Pin100 = Pin100 + 1// Statements
                                }
                                break; // optional
                            case 1000:
                                if ((PinResult.USERID.startsWith("Admin_"))) {
                                    PinFree = PinFree + 1// Statements
                                } else {
                                    Pin1000 = Pin1000 + 1// Statements
                                }
                                break; // optional
                            case 10000:
                                if ((PinResult.USERID.startsWith("Admin_"))) {
                                    PinFree = PinFree + 1// Statements
                                } else {
                                    Pin10000 = Pin10000 + 1// Statements
                                }
                                break; // optional
                            // You can have any number of case statements.
                            default: // Optional
                            // Statements
                        }
                        let Date1 = moment().format('YYYY-MM-DD');
                        let fndupdquerylog = {
                            Date: Date1
                        };
                        let fndupdchangeslog = {
                            $inc: {
                                'Used_Pins.Pin10': Pin10,
                                'Used_Pins.Pin100': Pin100,
                                'Used_Pins.Pin1000': Pin1000,
                                'Used_Pins.Pin10000': Pin10000,
                                'Used_Pins.PinFree': PinFree,
                                'Balance_Pins.Pin10': Pin10 * -1,
                                'Balance_Pins.Pin100': Pin100 * -1,
                                'Balance_Pins.Pin1000': Pin1000 * -1,
                                'Balance_Pins.Pin10000': Pin10000 * -1,
                                'Balance_Pins.PinFree': PinFree * -1,
                                'Total_Used_Pins.Pin10': Pin10,
                                'Total_Used_Pins.Pin100': Pin100,
                                'Total_Used_Pins.Pin1000': Pin1000,
                                'Total_Used_Pins.Pin10000': Pin10000,
                                'Total_Used_Pins.PinFree': PinFree,
                                'Total_Balance_Pins.Pin10': Pin10 * -1,
                                'Total_Balance_Pins.Pin100': Pin100 * -1,
                                'Total_Balance_Pins.Pin1000': Pin1000 * -1,
                                'Total_Balance_Pins.Pin10000': Pin10000 * -1,
                                'Total_Balance_Pins.PinFree': PinFree * -1,
                            }
                        };
                        let fndupdoptionslog = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        };
                        let findupdateDatalog = await Day_Pins_Log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();

                        let FinalResult = await CommonController.User_Add_Subscription_Data(PinResult, UserData, 1, parseInt(PinResult.Subscription_Amount))
                        let Data = {
                            Total_Amount: '',
                            TransactionID: '',
                            CallBack: false
                        }
                        resolve({ success: true, extras: { Data: Data } });
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.PIN_CODE_ALREADY_USED } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PIN_CODE } });
                }
                // } else {
                //     reject({ success: false, extras: { msg: ApiMessages.ALREADY_SUBSCRIBED } });
                // }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Register_User = (values, UserData, ReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let now = moment();
                //let expiry_moment = (UserData.Subscription_Expiry_Date == null) ? moment().subtract(1, 'hour') : moment(UserData.Subscription_Expiry_Date);
                if (!UserData.Whether_Subscribed) {
                    let fndupdquery = {
                        USERID: UserData.USERID
                    };
                    let fndupdchanges = {
                        $set: {
                            Name: values.Name,
                            User_Basic_Information_Available: true,
                            Referral_USERID: ReferralData.USERID,
                            Zip_Code: values.Postal_Code,
                            State: values.State,
                            Area: values.Area,
                            City: values.City,
                            User_Account_Registered_Date: new Date(),
                            updated_at: new Date()
                        }
                    };
                    let fndupdoptions = {
                        new: true
                    }
                    UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    resolve({ success: true, extras: { Status: "Register Successfully", User_Basic_Information_Available: true } });
                    if (ReferralData) {
                        let rquery = {
                            USERID: ReferralData.USERID
                        };
                        let rchanges = {
                            $set: {
                                Name: ReferralData.Name,
                                updated_at: new Date()
                            },
                            $inc: {
                                No_of_Referrals: 1
                            },
                            $push: {
                                Referral_USERID_Array: UserData.USERID,
                                Referral_Information: UserData
                            }
                        };
                        let RUpdatedStatus = await Users_Referrals.updateOne(rquery, rchanges).lean();
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.ALREADY_SUBSCRIBED } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Check_Whether_Subscription_Amount_Available = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (UserData.User_Amounts.Available_Amount >= config.New_Subscription_Amount) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Register_User_With_Subscription_Validate_Referral_Phone_Number = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ReferralData = {
                    USERID: "",
                    Name: "",
                    CountryCode: "",
                    PhoneNumber: ""
                }
                if (Boolify(values.Whether_Referral_Signup)) {
                    ReferralData = await UserController.Validate_Referral_Phone_Number(values, UserData);
                    resolve(ReferralData);
                } else {
                    resolve(ReferralData);
                }
            } catch (error) {
                reject(error);
            }
        });
    });
}

UserController.Validate_Referral_Phone_Number = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Whether_Subscribed: true,
                    PhoneNumber: values.PhoneNumber
                };
                let Result = await Users.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.REFERRAL_NOT_AVAILABLE } })
                } else {
                    if (Result.PhoneNumber == UserData.PhoneNumber) {
                        reject({ success: false, extras: { msg: ApiMessages.REFERRAL_PHONE_NUMBER_AND_SELF_PHONE_NUMBER_MUST_BE_DIFFERENT } })
                    } else {
                        resolve(Result);
                    }
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.User_Add_Amount_From_Razorpay_To_Wallet = (values, PaymentData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Amount = PaymentData.amount / 100;
                let Data = {
                    LogID: uuid.v4(),
                    USERID: values.USERID,
                    Type: 1, //Money Credited from Razorpay
                    Amount: Amount,
                    Data: PaymentData,
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
                let fquery = {
                    USERID: values.USERID
                };
                let fchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": Amount,
                        "User_Amounts.Total_Amount": Amount
                    }
                };
                let foptions = {
                    new: true
                };
                let UpdateData = await Users.findOneAndUpdate(fquery, fchanges, foptions).lean();
                resolve({ success: true, extras: { Status: "Amount Added to Wallet Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Transfer_Amount_To_CBWallet = (values,UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let query = {
                    PhoneNumber: values.PhoneNumber,
                    Amount: values.Amount
                }

                const axios = require('axios')

                let request_optionscb = {
                    method: 'post',
                    baseURL: config.for_req_coupon_bazaar,
                    url: `app/Receive_Amount_From_DHWallet`,
                    data: query
                };

                console.log("252--->"+JSON.stringify(request_optionscb)) 
                let Response = await axios(request_optionscb);

               

                if (Response.status == 200) {
                    console.log("253 "+JSON.stringify(Response.data))
                    if(Response.data.success){
                        let Amount = parseFloat(values.Amount);
                        if (Amount <= UserData.User_Amounts.Available_Amount) {
                          //  let After_Commissioned_Amount = ((Amount * config.Friend_Money_Transfer_After_Commissioned) / 100);
                            let  LData = {
                                PhoneNumber: values.PhoneNumber,
                            //    LogID: uuid.v4(),
                            //     USERID: UserData.USERID,
                            //     Type: 11,
                                 Amount: values.Amount
                            //     Data: {
                            //         UserData: UserData,
                            //         FriendData: FriendData,
                            //        After_Commissioned_Amount: After_Commissioned_Amount
                                }
            // Why we used.???????
                                Time: new Date()
                            };
                            let LSaveResult = await User_Wallet_Logs(LData).save();
                            let fndupdquery = {
                                USERID: UserData.USERID
                            };
                            let fndupdchanges = {
                                $set: {
                                    updated_at: new Date()
                                },
                                $inc: {
                                    "User_Amounts.Withdrawn_Amount": Amount,
                                    "User_Amounts.Available_Amount": (Amount * -1),
                                }
                            };
                            let fndupdoptions = {
                                upsert: true,
                                setDefaultsOnInsert: true,
                                new: true
                            };
                            let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
        
        
                    }else{
                        
                    }
                    resolve(Response.data);
                } else if (Response.status == 400) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_CAPTURE_AMOUNT } });
                } else if (Response.status == 401) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }

                resolve(true)
            



                //     const axios = require('axios')

                // let request_optionscb = {
                //     method: 'post',
                //     baseURL: config.for_req_coupon_bazaar,
                //     url: `app/Receive_Amount_From_DHWallet`,
                //     data:  {
                //         PhoneNumber:""
                //         // ReceiverData:{
                //         //     LogID: uuid.v4(),
                //         //     USERID: FriendData.USERID,
                //         //     Type: 12,
                //         //     Amount: Amount,
                //         //     Time: new Date()
                //         }
                //     };

                // console.log("252--->"+JSON.stringify(request_optionscb)) 
                // let Response = await axios(request_optionscb);

               

                // if (Response.status == 200) {
                //     console.log("253 "+JSON.stringify(Response.data))
                //     if(Response.data.success){
                     
                        
                //     }else{
                        
                //     }
                //     resolve(Response.data);
                // } else if (Response.status == 400) {
                //     reject({ success: false, extras: { msg: ApiMessages.INVALID_CAPTURE_AMOUNT } });
                // } else if (Response.status == 401) {
                //     reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                // }

                // resolve(true)



                    // let FData = {
                    //     PhoneNumber:"",
                    //     ReceiverData:{
                    //         LogID: uuid.v4(),
                    //         USERID: FriendData.USERID,
                    //         Type: 12,
                    //         Amount: Amount,
                    //         Data: {
                    //             UserData: UserData,
                    //             FriendData: FriendData,
                    //         // After_Commissioned_Amount: After_Commissioned_Amount
                    //         },
                    //         Time: new Date()
                    //     }
                    // };

                    
                    // let FSaveResult = await User_Wallet_Logs(FData).save();
                    // let Ffndupdquery = {
                    //     USERID: FriendData.USERID
                    // };
                    // let Ffndupdchanges = {
                    //     $set: {
                    //         updated_at: new Date()
                    //     },
                    //     $inc: {
                    //         "User_Amounts.Available_Amount": Amount,
                    //         "User_Amounts.Total_Amount": Amount,
                    //     }
                    // };
                    // let Ffndupdoptions = {
                    //     upsert: true,
                    //     setDefaultsOnInsert: true,
                    //     new: true
                    // };
                    // let FfindupdateData = await Users.findOneAndUpdate(Ffndupdquery, Ffndupdchanges, Ffndupdoptions).select('-_id -__v').lean();
                    // let Data = {
                    //     USERID: FriendData.USERID,
                    //     Amount: Amount,
                    //    // After_Commissioned_Amount: After_Commissioned_Amount,
                    //     REQUEST_DETAILS: UserData,
                    //     created_at: new Date(),
                    //     updated_at: new Date()
                    // }
                   //  let SaveResult = await User_Friend_Money_Requests(Data).save();
                //     resolve({ success: true, extras: { Status: "Money Transferred and Requested in Cash Successfully" } })
                // } else {
                //     reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
                // }


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

// UserController.Transfer_Amount_To_CBWallet = (values,UserData) => {
//     return new Promise((resolve, reject) => {
//         setImmediate(async () => {
//             try {
//                 let Amount = parseFloat(values.Amount);
//                 if (Amount <= UserData.User_Amounts.Available_Amount) {
//                   //  let After_Commissioned_Amount = ((Amount * config.Friend_Money_Transfer_After_Commissioned) / 100);
//                     let  LData = {
//                         PhoneNumber: values.PhoneNumber,
//                     //    LogID: uuid.v4(),
//                     //     USERID: UserData.USERID,
//                     //     Type: 11,
//                          Amount: values.Amount
//                     //     Data: {
//                     //         UserData: UserData,
//                     //         FriendData: FriendData,
//                     //        After_Commissioned_Amount: After_Commissioned_Amount
//                         }
//     // Why we used.???????
//                         Time: new Date()
//                     };
//                     let LSaveResult = await User_Wallet_Logs(LData).save();
//                     let fndupdquery = {
//                         USERID: UserData.USERID
//                     };
//                     let fndupdchanges = {
//                         $set: {
//                             updated_at: new Date()
//                         },
//                         $inc: {
//                             "User_Amounts.Withdrawn_Amount": Amount,
//                             "User_Amounts.Available_Amount": (Amount * -1),
//                         }
//                     };
//                     let fndupdoptions = {
//                         upsert: true,
//                         setDefaultsOnInsert: true,
//                         new: true
//                     };
//                     let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();



//                     const axios = require('axios')

//                 let request_optionscb = {
//                     method: 'post',
//                     baseURL: config.for_req_coupon_bazaar,
//                     url: `app/Receive_Amount_From_DHWallet`,
//                     data:  {
//                         PhoneNumber:""
//                         // ReceiverData:{
//                         //     LogID: uuid.v4(),
//                         //     USERID: FriendData.USERID,
//                         //     Type: 12,
//                         //     Amount: Amount,
//                         //     Time: new Date()
//                         }
//                     };

//                 console.log("252--->"+JSON.stringify(request_optionscb)) 
//                 let Response = await axios(request_optionscb);

               

//                 if (Response.status == 200) {
//                     console.log("253 "+JSON.stringify(Response.data))
//                     if(Response.data.success){
                     
                        
//                     }else{
                        
//                     }
//                     resolve(Response.data);
//                 } else if (Response.status == 400) {
//                     reject({ success: false, extras: { msg: ApiMessages.INVALID_CAPTURE_AMOUNT } });
//                 } else if (Response.status == 401) {
//                     reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
//                 }

//                 resolve(true)



//                     // let FData = {
//                     //     PhoneNumber:"",
//                     //     ReceiverData:{
//                     //         LogID: uuid.v4(),
//                     //         USERID: FriendData.USERID,
//                     //         Type: 12,
//                     //         Amount: Amount,
//                     //         Data: {
//                     //             UserData: UserData,
//                     //             FriendData: FriendData,
//                     //         // After_Commissioned_Amount: After_Commissioned_Amount
//                     //         },
//                     //         Time: new Date()
//                     //     }
//                     // };

                    
//                     // let FSaveResult = await User_Wallet_Logs(FData).save();
//                     // let Ffndupdquery = {
//                     //     USERID: FriendData.USERID
//                     // };
//                     // let Ffndupdchanges = {
//                     //     $set: {
//                     //         updated_at: new Date()
//                     //     },
//                     //     $inc: {
//                     //         "User_Amounts.Available_Amount": Amount,
//                     //         "User_Amounts.Total_Amount": Amount,
//                     //     }
//                     // };
//                     // let Ffndupdoptions = {
//                     //     upsert: true,
//                     //     setDefaultsOnInsert: true,
//                     //     new: true
//                     // };
//                     // let FfindupdateData = await Users.findOneAndUpdate(Ffndupdquery, Ffndupdchanges, Ffndupdoptions).select('-_id -__v').lean();
//                     // let Data = {
//                     //     USERID: FriendData.USERID,
//                     //     Amount: Amount,
//                     //    // After_Commissioned_Amount: After_Commissioned_Amount,
//                     //     REQUEST_DETAILS: UserData,
//                     //     created_at: new Date(),
//                     //     updated_at: new Date()
//                     // }
//                    //  let SaveResult = await User_Friend_Money_Requests(Data).save();
//                 //     resolve({ success: true, extras: { Status: "Money Transferred and Requested in Cash Successfully" } })
//                 // } else {
//                 //     reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_BALANCE } })
//                 // }


//             } catch (error) {
//                 reject(await CommonController.Common_Error_Handler(error));
//             }
//         });
//     });
// }

UserController.UPDATE_USER_PROFILE_IMAGE = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let changes = {
                    $set: {
                        User_Image_Available: true,
                        User_Image_Data: ImageData,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await Users.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.UPDATE_USER_BASIC_INFORMATION = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let changes = {
                    $set: {
                        Name: values.Name,
                        EmailID: values.EmailID,
                        User_Basic_Information_Available: true,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await Users.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Add_Fetch_User_Profile_Information = (values, DeviceData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let fndupdquery = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        USERID: uuid.v4(),
                        created_at: new Date()
                    },
                    $set: {
                        "USER_SESSIONS.SessionID": uuid.v4(),
                        DeviceID: DeviceData.DeviceID,
                        updated_at: new Date()
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v -created_at -updated_at -PasswordHash -PasswordSalt').lean();
                if (UserData.Password_Available == null || UserData.Password_Available == undefined) {
                    UserData.Password_Available = false
                }
                UserData.User_Image_Data = await CommonController.Common_Image_Response_Single_Image(UserData.User_Image_Available, UserData.User_Image_Data);
                resolve({ success: true, extras: { Status: "Login Succeesfully", Data: UserData } });
                let Rfndupdquery = {
                    USERID: UserData.USERID
                };
                let Rfndupdchanges = {
                    $setOnInsert: {
                        Name: UserData.Name,
                        CountryCode: UserData.CountryCode,
                        PhoneNumber: UserData.PhoneNumber,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                };
                let Rfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let RfindupdateData = await Users_Referrals.findOneAndUpdate(Rfndupdquery, Rfndupdchanges, Rfndupdoptions).select('-_id -__v').lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_Direct_Ref_OTP = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let obj1 = {
                    $ne: null
                };
                let obj2 = {
                    $eq: values.OTP
                }
                let OTP_Query = (config.SECRET_OTP_CODE === String(values.OTP)) ? obj1 : obj2;
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: OTP_Query,
                    Latest: true
                };
                let Result = await User_OTPS.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_OTP } });
                    let Data = {
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber,
                        Time: new Date()
                    };
                    let SaveResult = await User_OTP_Tries(Data).save();
                } else {
                    resolve({ success: true, extras: { Status: "Validated Successfully" } });
                    let RemoveTries = await User_OTP_Tries.deleteMany({
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber
                    }).lean();
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_User_Password = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                };
                let Result = await Users.findOne(query).lean();
                let Password = String(values.Password);
                let PasswordSalt = Result.PasswordSalt;
                let pass = Password + PasswordSalt;
                let PasswordHash = crypto.createHash('sha512').update(pass).digest("hex");

                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
                } else {
                    if (Result.PasswordHash == PasswordHash) {
                        resolve("Validated Successfully");
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_PASSWORD } })
                    }
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

UserController.Validate_User_OTP = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let obj1 = {
                    $ne: null
                };
                let obj2 = {
                    $eq: values.OTP
                }
                let OTP_Query = (config.SECRET_OTP_CODE === String(values.OTP)) ? obj1 : obj2;
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: OTP_Query,
                    Latest: true
                };
                let Result = await User_OTPS.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_OTP } });
                    let Data = {
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber,
                        Time: new Date()
                    };
                    let SaveResult = await User_OTP_Tries(Data).save();
                } else {
                    resolve("Validated Successfully");
                    let RemoveTries = await User_OTP_Tries.deleteMany({
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber
                    }).lean();
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Check_for_User_OTP_Tries_Count = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let time = moment().subtract(config.OTP_TRIES_COUNT_TIME_IN_MINUTES, 'minutes').toDate();
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    Time: {
                        $gte: time
                    }
                };
                let Count = await User_OTP_Tries.countDocuments(query).lean().exec();
                if (Count <= config.OTP_TRIES_COUNT) {
                    resolve('Validated Successfully');
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.OTP_TRIES_EXCEED_TRY_AFTER_SOME_TIME } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



UserController.Check_for_Transfer_OTP_Tries_Count = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let time = moment().subtract(config.OTP_TRIES_COUNT_TIME_IN_MINUTES, 'minutes').toDate();
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    Time: {
                        $gte: time
                    }
                };
                let Count = await Transfer_OTP_Tries.countDocuments(query).lean().exec();
                if (Count <= config.OTP_TRIES_COUNT) {
                    resolve('Validated Successfully');
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.OTP_TRIES_EXCEED_TRY_AFTER_SOME_TIME } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Generate_User_OTP_Send_Message = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                }
                let Result = await Users.findOne(query).lean().exec();
                if (Result != null) {
                    if (Result.Password_Available == true || Result.Password_Available == "true") {
                        if (values.Password_Reset == false || values.Password_Reset == "false") {
                            resolve({ success: true, extras: { Status: "OTP Sent Successfully", Status_Code: 2 } }) // call password Api
                        } else if (values.Password_Reset == true || values.Password_Reset == "true") {
                            let OTP_Process = await UserController.Generate_OTP(values);
                            resolve(OTP_Process)
                        } else {
                            let OTP_Process = await UserController.Generate_OTP(values);
                            resolve(OTP_Process)
                        }
                    } else {
                        let OTP_Process = await UserController.Generate_OTP(values);
                        resolve(OTP_Process)
                    }
                } else {
                    let OTP_Process = await UserController.Generate_OTP(values);
                    resolve(OTP_Process)
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Generate_OTP_Transfer = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let OTP = await CommonController.Random_OTP_Number();
                let Data = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: OTP,
                    Latest: true,
                    Time: new Date()
                }
                let SaveResult = await Transfer_OTP(Data).save();
                resolve({ success: true, extras: { Status: "OTP Sent Successfully", Status_Code: 1 } }) //call otp api
                let PhoneNumber = `${values.CountryCode}${values.PhoneNumber}`;
                let OTPStatus = await MSG91Controller.Send_OTP(PhoneNumber, OTP);
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: { $ne: OTP }
                };
                let changes = {
                    Latest: false
                };
                let UpdatedStatus = await Transfer_OTP.updateMany(query, changes).lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Generate_OTP = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let OTP = await CommonController.Random_OTP_Number();
                let Data = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: OTP,
                    Latest: true,
                    Time: new Date()
                }
                let SaveResult = await User_OTPS(Data).save();
                resolve({ success: true, extras: { Status: "OTP Sent Successfully", Status_Code: 1 } }) //call otp api
                let PhoneNumber = `${values.CountryCode}${values.PhoneNumber}`;
                let OTPStatus = await MSG91Controller.Send_OTP(PhoneNumber, OTP);
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: { $ne: OTP }
                };
                let changes = {
                    Latest: false
                };
                let UpdatedStatus = await User_OTPS.updateMany(query, changes).lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Check_for_OTP_Count = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let time = moment().subtract(config.OTP_COUNT_TIME_IN_MINUTES, 'minutes').toDate();
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    Time: {
                        $gte: time
                    }
                };
                let Count = await User_OTPS.countDocuments(query).lean();
                if (Count <= config.OTP_COUNT) {
                    resolve('Validated Successfully')
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.OTP_REQUEST_EXCEED_TRY_AFTER_SOME_TIME } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


UserController.Validate_Transfer_OTP = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let obj1 = {
                    $ne: null
                };
                let obj2 = {
                    $eq: values.OTP
                }
                let OTP_Query = (config.SECRET_OTP_CODE === String(values.OTP)) ? obj1 : obj2;
                let query = {
                    CountryCode: values.CountryCode,
                    PhoneNumber: values.PhoneNumber,
                    OTP: OTP_Query,
                    Latest: true
                };
                let Result = await Transfer_OTP.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_OTP } });
                    let Data = {
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber,
                        Time: new Date()
                    };
                    let SaveResult = await Transfer_OTP_Tries(Data).save();
                } else {
                    resolve("Validated Successfully");
                    let RemoveTries = await Transfer_OTP_Tries.deleteMany({
                        CountryCode: values.CountryCode,
                        PhoneNumber: values.PhoneNumber
                    }).lean();
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

export default UserController;