let RazorpayController = function () { };
import axios from "axios";
import ApiMessages from "../config/ApiMessages";
import config from "../config/config";
import CommonController from "./CommonController";
import moment from "moment";
import uuid from "uuid";
import RazorpayX_Webhooks from "../models/RazorpayX_Webhooks";
import Razorpay_Webhooks from "../models/Razorpay_Webhooks";
import UserController from "./UserController";
import Users from "../models/Users";
import User_Pin_Purchase from "../models/User_Pin_Purchase";
import User_Subscription_Log from "../models/User_Subscription_Log";
import User_Shop_Log from "../models/User_Shop_Log";
import Day_Bank_log from "../models/Day_Bank_log";
import Order_Logs from "../models/Order_Logs";
import Product from "../models/Product";
import User_Address from "../models/User_Address";
import YouTube_Advertisement_Logs from "../models/YouTube_Advertisement_Logs";
/////////////////////

RazorpayController.CallbackInFunctionality = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));

        let request_optionsdh = {
            method: 'post',
            baseURL: 'https://cxapi.mobilerechargeapp.net/razorpay',
            url: `/callback`,
            data: values
        };
        let Responsedh = await axios(request_optionsdh);

        let request_optionscb = {
            method: 'post',
            baseURL: 'https://apicb.mobilerechargeapp.net/razorpay',
            url: `/callback`,
            data: values
        };
        let Responsecb = await axios(request_optionscb);

        res.status(200).send("Callback Completed Successfully");
        if (values.payload.payment.entity.notes.Application == 'DREAMHOUSE') {
            let PaymentData = new Object();
            let paymentarray = ["payment.authorized", "payment.captured", "payment.failed"];
            if (paymentarray.indexOf(values.event) >= 0) {
                PaymentData = values.payload.payment.entity;
            }
            let Data = {
                WebookID: uuid.v4(),
                PaymentID: PaymentData.id,
                Captured: PaymentData.status,
                TranxID: values.payload.payment.entity.notes.TransactionID,
                RequestData: values,
                PaymentData: PaymentData,
                created_at: new Date(),
                updated_at: new Date()
            };
            let SaveResult = await Razorpay_Webhooks(Data).save();
            if (paymentarray.indexOf(values.event) >= 0) {
                if (PaymentData.status == 'authorized') {
                    PaymentData = await RazorpayController.Capture_Razorpay_Payment(PaymentData.id, PaymentData.amount);
                    resolve("Functionality Completed");
                } else if (PaymentData.status == 'captured') {
                    console.log(values.payload.payment.entity.notes.uuID);
                    let Amount = parseFloat(values.payload.payment.entity.amount / 100);
                    ////////////
                    //console.log(Amount);

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
                            Day_Credit_Amount: Amount,
                            Day_Total_Amount: Amount,
                            Total_Amount: Amount,
                        }
                    };
                    let fndupdoptionslog = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateDatalog = await Day_Bank_log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();

                    /////////////
                    if (values.payload.payment.entity.notes.uuID.startsWith("PI_")) { // pin purchase
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let ResultData = await User_Pin_Purchase.findOne(query).lean();
                        let queryUser = {
                            USERID: ResultData.USERID
                        }
                        let ResultUser = await Users.findOne(queryUser).lean();
                        let updateTranx = await UserController.User_Pins_Generate(ResultData, ResultUser, Data);
                    } else if (values.payload.payment.entity.notes.uuID.startsWith("RI_")) {  // user register                 
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let subResult = await User_Subscription_Log.findOne(query).lean();
                        let changes = {
                            $set: {
                                Status: 3,
                                WebHookData: Data,
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Subscription_Log.updateOne(query, changes).lean();
                        let queryUser = {
                            USERID: subResult.USERID
                        }
                        let UserData = await Users.findOne(queryUser).lean();
                        let upgrade = values.payload.payment.entity.notes.Upgrade;
                        UserData.Upgrade = upgrade;
                        let FinalResult = await CommonController.User_Add_Subscription_Data(subResult, UserData, 2, Amount)
                    } else if (values.payload.payment.entity.notes.uuID.startsWith("SP_")) {     // shop purchase                   
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let subResult = await User_Shop_Log.findOne(query).lean();
                        let changes = {
                            $set: {
                                Status: 3,
                                WebHookData: Data,
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Shop_Log.updateOne(query, changes).lean();
                        let queryUser = {
                            USERID: subResult.USERID
                        }
                        let UserData = await Users.findOne(queryUser).lean();
                        let RegisterSubscriptionProcess = await UserController.Register_Shop_After_Payment(UserData);
                        let AmountProcessing = await UserController.Shop_Subscription_Amount_Sharing(UserData);
                        let RegisterUpdateRazorpayUser = await UserController.Create_and_Update_User_RazorpayX_Contact(UserData);

                    } else if (values.payload.payment.entity.notes.uuID.startsWith("ORD_")) {     // Order Payment
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let Order_Result = await Order_Logs.findOne(query).lean();
                        let changes = {
                            $set: {
                                Payment_Status: 3,
                                WebHookData: Data,
                                updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await Order_Logs.updateOne(query, changes).lean();

                        let queryUser = {
                            USERID: Order_Result.USERID
                        }
                        let UserData = await Users.findOne(queryUser).lean();

                        let queryProduct = {
                            Product_ID: Order_Result.ProductData.Product_ID
                        }
                        let Product_Data = await Product.findOne(queryProduct).lean();

                        let queryAddress = {
                            Address_ID: Order_Result.Address_Data.Address_ID,
                            USERID: Order_Result.USERID
                        }
                        let Address_Data = await User_Address.findOne(queryAddress).lean();

                        console.log("Razor Pay AMount Ord")

                        let Result2 = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId,
                            Online_Amount: Order_Result.Online_Amount,
                            Product_Total_Amount: Order_Result.Amount,
                            Used_Wallet_Amount: Order_Result.Used_Wallet_Amount
                        }

                        let Save_Order = await CommonController.Add_Order_to_Delivery(UserData, Product_Data, Address_Data, 2, Data, Result2);


                    } else if (values.payload.payment.entity.notes.uuID.startsWith("AD_")) {     // Adevrtisement Payment
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let Adevrtisement_Result = await YouTube_Advertisement_Logs.findOne(query).lean();
                        let changes = {
                            $set: {
                                Payment_Status: 3,
                                WebHookData: Data,
                                updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await YouTube_Advertisement_Logs.updateOne(query, changes).lean();

                        let queryUser = {
                            USERID: Adevrtisement_Result.USERID
                        }
                        let UserData = await Users.findOne(queryUser).lean();



                        console.log("Razor Pay AMount Adv")
                        let Save_Advertisement = await CommonController.Save_User_Advertisement(Adevrtisement_Result)

                    }
                    resolve("Captured Completed");
                } else if (PaymentData.status == 'failed') {
                    if (values.payload.payment.entity.notes.uuID.startsWith("PI_")) {
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let changes = {
                            $set: {
                                Status: 2,
                                WebHookData: Data,
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Pin_Purchase.updateOne(query, changes).lean();
                    } else if (values.payload.payment.entity.notes.uuID.startsWith("RI_")) {
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let changes = {
                            $set: {
                                Status: 2,
                                WebHookData: Data,
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Subscription_Log.updateOne(query, changes).lean();
                    } else if (values.payload.payment.entity.notes.uuID.startsWith("SP_")) {
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let changes = {
                            $set: {
                                Status: 2,
                                WebHookData: Data,
                                Updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await User_Shop_Log.updateOne(query, changes).lean();
                    } else if (values.payload.payment.entity.notes.uuID.startsWith("ORD_")) {     // Order Payment
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        let Order_Result = await Order_Logs.findOne(query).lean();
                        let changes = {
                            $set: {
                                Payment_Status: 2,
                                WebHookData: Data,
                                updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await Order_Logs.updateOne(query, changes).lean();

                    } else if (values.payload.payment.entity.notes.uuID.startsWith("AD_")) {     // Order Payment
                        let query = {
                            TransactionID: values.payload.payment.entity.notes.TransactionId
                        };
                        // let Order_Result = await Order_Logs.findOne(query).lean();
                        let Adevrtisement_Result = await YouTube_Advertisement_Logs.findOne(query).lean();
                        let changes = {
                            $set: {
                                Payment_Status: 2,
                                WebHookData: Data,
                                updated_at: new Date()
                            }
                        };
                        let UpdatedStatus = await YouTube_Advertisement_Logs.updateOne(query, changes).lean();

                    }
                    resolve("Payment Failed");
                }
            }
        }


    } catch (error) {
        if (!res.headersSent) {
            console.error("Something Razorpay Callback error-->", error)
            res.status(200).send("Callback Completed Successfully");
        }
    }
}

////////////////////////

RazorpayController.CallbackOutFunctionality = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        res.status(200).send("Callback Completed Successfully");
        let PayoutData = new Object();
        let payoutarray = ["payout.queued", "payout.initiated", "payout.processed", "payout.reversed", "payout.created"];
        if (payoutarray.indexOf(values.event) >= 0) {
            PayoutData = values.payload.payout.entity;
        }
        let Data = {
            WebookID: uuid.v4(),
            RequestData: values,
            PayoutData: PayoutData,
            created_at: new Date(),
            updated_at: new Date()
        };
        let SaveResult = await RazorpayX_Webhooks(Data).save();
        if (payoutarray.indexOf(values.event) >= 0) {
            let TransactionStatusUpdate = await UserController.Common_Razorpay_Update_Statues(PayoutData);
        }
    } catch (error) {
        if (!res.headersSent) {
            console.error("Something RazorpayX Callback error-->", error)
            res.status(200).send("Callback Completed Successfully");
        }
    }
}

RazorpayController.Razorpay_Fetch_Payout_Current_Information = (RazorpayX_TransactionID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (config.Whether_Production_Settings) {
                    let request_options = {
                        method: 'get',
                        baseURL: config.razorpay.baseURL,
                        url: `/payouts/${RazorpayX_TransactionID}`,
                        auth: {
                            username: config.razorpay.key_id,
                            password: config.razorpay.key_secret
                        },
                    };
                    let Response = await axios(request_options);
                    if (Response.status == 200) {
                        resolve(Response.data);
                    } else if (Response.status == 400) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                    } else if (Response.status == 401) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                    }
                } else {
                    let Data = {
                        "id": "cd9aa360-494c-49a4-87b0-9bcdbca533c3",
                        "amount": 105000,
                        "currency": "INR",
                        "fees": 30,
                        "tax": 10,
                        "status": "processed",
                        "utr": "c9c3e0f2-bc85-4952-b414-bafde69297ad",
                        "mode": "UPI",
                        "reference_id": "da73e3e0-d44b-46be-86e7-06cae548295f",
                        "failure_reason": ""
                    }
                    resolve(Data);
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Razorpay_Beneficiary_Account_Payout = (BeneficiaryData, Amount, TransactionID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                Amount = parseInt(Amount) * 100; //In paise
                let mode = (BeneficiaryData.BeneficiaryType == 1) ? 'IMPS' : 'UPI';
                if (config.Whether_Production_Settings) {

                    let request_options = {
                        method: 'post',
                        baseURL: config.razorpay.baseURL,
                        url: `/payouts`,
                        data: {
                            "account_number": config.razorpay.razorpayx_account_number,
                            "fund_account_id": BeneficiaryData.RazorpayX_BeneficiaryID,
                            "amount": Amount,
                            "currency": "INR",
                            "mode": mode,
                            "purpose": "payout",
                            "queue_if_low_balance": true,
                            "reference_id": TransactionID,
                            "narration": "DreamHouse Bank Transfer",
                            "notes": {
                                "note_key": "DreamHouse Bank Transfer"
                            }
                        },
                        auth: {
                            username: config.razorpay.key_id,
                            password: config.razorpay.key_secret
                        },
                    };
                    let Response = await axios(request_options);
                    if (Response.status == 200) {
                        resolve(Response.data);
                    } else if (Response.status == 400) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                    } else if (Response.status == 401) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                    }
                } else {
                    let Data = {
                        id: uuid.v4(),
                        amount: Amount,
                        currency: "INR",
                        fees: 30,
                        tax: 10,
                        status: "processed",
                        utr: uuid.v4(),
                        mode: mode,
                        reference_id: TransactionID,
                        failure_reason: ""
                    };
                    resolve(Data);
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Create_Razorpay_Beneficiary_Account_for_UPI = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let request_options = {
                    method: 'post',
                    baseURL: config.razorpay.baseURL,
                    url: `/fund_accounts`,
                    data: {
                        "contact_id": UserData.RazorpayX_ContactID,
                        "account_type": "vpa",
                        "vpa": {
                            "address": values.UPI
                        }
                    },
                    auth: {
                        username: config.razorpay.key_id,
                        password: config.razorpay.key_secret
                    },
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    resolve(Response.data);
                } else if (Response.status == 400) {
                    console.error("Razorpay Error")
                    console.error(Response.data);
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                } else if (Response.status == 401) {
                    console.error("Razorpay Error")
                    console.error(Response.data);
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Create_Razorpay_Beneficiary_Account_for_Bank_Account = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (values.Name.length <= 4) {
                    values.Name = `${values.Name} DreamHouse`;
                };

                let request_options = {
                    method: 'post',
                    baseURL: config.razorpay.baseURL,
                    url: `/fund_accounts`,
                    data: {
                        "contact_id": UserData.RazorpayX_ContactID,
                        "account_type": "bank_account",
                        "bank_account": {
                            "name": values.Name,
                            "ifsc": values.IFSC,
                            "account_number": values.Account_Number
                        }
                    },
                    auth: {
                        username: config.razorpay.key_id,
                        password: config.razorpay.key_secret
                    },
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    resolve(Response.data);
                } else if (Response.status == 400) {
                    console.error("Razorpay Error")
                    console.error(Response.data);
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                } else if (Response.status == 401) {
                    console.error("Razorpay Error")
                    console.error(Response.data);
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Create_Razorpay_Contact = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (UserData.Name.length <= 2) {
                    UserData.Name = `${UserData.Name} DreamHouse`;
                }
                if (UserData.Whether_RazorpayX_Customer_Register == null || !UserData.Whether_RazorpayX_Customer_Register) {

                    let request_options = {
                        method: 'post',
                        baseURL: config.razorpay.baseURL,
                        url: `/contacts`,
                        data: {
                            "name": UserData.Name,
                            "email": UserData.EmailID,
                            "contact": UserData.PhoneNumber,
                            "type": "customer",
                            "reference_id": UserData.USERID,
                            "notes": {
                                "note_key": "DreamHouse User Registration"
                            }
                        },
                        auth: {
                            username: config.razorpay.key_id,
                            password: config.razorpay.key_secret
                        },
                    };
                    let Response = await axios(request_options);
                    if (Response.status == 200) {
                        resolve(Response.data);
                    } else if (Response.status == 400) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                    } else if (Response.status == 401) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                    }
                } else {
                    //Fetch Customer
                    let request_options = {
                        method: 'patch',
                        baseURL: config.razorpay.baseURL,
                        url: `/contacts/${UserData.RazorpayX_ContactID}`,
                        data: {
                            "name": UserData.Name,
                            "email": UserData.EmailID,
                            "contact": UserData.PhoneNumber,
                            "type": "customer",
                            "reference_id": UserData.USERID,
                            "notes": {
                                "note_key": "DreamHouse User Registration"
                            }
                        },
                        auth: {
                            username: config.razorpay.key_id,
                            password: config.razorpay.key_secret
                        },
                    };
                    let Response = await axios(request_options);
                    if (Response.status == 200) {
                        resolve(Response.data);
                    } else if (Response.status == 400) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_RAZORPAY_REQUEST } });
                    } else if (Response.status == 401) {
                        console.error("Razorpay Error")
                        console.error(Response.data);
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                    }
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Check_Razorpay_Payment = (PaymentID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let url = `https://${config.razorpay.key_id}:${config.razorpay.key_secret}@${config.razorpay.host}/payments/${PaymentID}`;
                let request_options = {
                    method: 'get',
                    url: url
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    let Data = Response.data;
                    if (Data.status == "created" || Data.status == "failed") {
                        reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_PAYMENT_FAILED } });
                    } else {
                        resolve(Data);
                    }
                } else if (Response.status == 400) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PAYMENT_ID } });
                } else if (Response.status == 401) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

RazorpayController.Capture_Razorpay_Payment = (PaymentID, amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let url = `https://${config.razorpay.key_id}:${config.razorpay.key_secret}@${config.razorpay.host}/payments/${PaymentID}/capture`;
                let request_options = {
                    method: 'post',
                    url: url,
                    data: {
                        amount: amount// In paise
                    }
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    resolve(Response.data);
                } else if (Response.status == 400) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_CAPTURE_AMOUNT } });
                } else if (Response.status == 401) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }
            } catch (error) {
                console.error("Razorpay Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RAZORPAY_ERROR } });
            }
        });
    });
}

export default RazorpayController;