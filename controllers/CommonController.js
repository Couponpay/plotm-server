let CommonController = function () { };
//Dependencies
import uuid from "uuid";
import moment from "moment";
import axios from "axios";
import async from "async";
import mongoose from "mongoose";
import crypto from "crypto";

//Models or Common files
import ApiMessages from "../config/ApiMessages";
import config from "../config/config";
import Images from "../models/Images";
import Counters from "../models/Counters";
import validator from 'validator';
import App_Versions_Settings from "../models/App_Versions_Settings";
import App_SMS_Providers from "../models/App_SMS_Providers";
import Devices from "../models/Devices";
import Admins from "../models/Admins";
import Users from "../models/Users";
import User_Pins from "../models/User_Pins";
import User_Bank_Beneficiary_Accounts from "../models/User_Bank_Beneficiary_Accounts";
import { Boolify, isBoolean } from "node-boolify";
import User_Bank_Transfers from "../models/User_Bank_Transfers";
import GuideLines from "../models/GuideLines";
import News from "../models/News";
import User_Shop_Pins from "../models/User_Shop_Pins";
import Subscription_Log from "../models/Subscription_Log";
import Users_Referrals from "../models/Users_Referrals";
import UserController from "./UserController";
import Company_Wallet_Logs from "../models/Company_Wallet_Logs";
import Company_Wallet from "../models/Company_Wallet";
import Trimmer_Wallet_Logs from "../models/Trimmer_Wallet_Logs";
import Trimmer_Wallet from "../models/Trimmer_Wallet";
import Plots_Log from "../models/Plots_Log";
import App_Image_Resources from "../models/App_Image_Resources";
import User_Wallet_Logs from "../models/User_Wallet_Logs";
import Day_Pins_Log from "../models/Day_Pins_Log";
import Day_Sharing_Log from "../models/Day_Sharing_Log";
import User_Address from "../models/User_Address";
import Product from "../models/Product";
import Orders from "../models/Orders";
import YouTube_Links from "../models/YouTube_Links";
import Users_Network from "../models/Users_Network";
import Order_Logs from "../models/Order_Logs";


//Save_User_Advertisement
CommonController.Save_User_Advertisement = (values) => {
    console.log(values, "hejj")
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let Type = 0
                if (values.CallBack) {
                    Type = 1
                }
                let wallet_data = {
                    LogID: uuid.v4(),
                    USERID: values.USERID,
                    Type: Type,
                    Amount: values.Data.Ad_Amount,
                    Data: values,
                    Time: new Date()
                }
                let Save_Wallet = await User_Wallet_Logs(wallet_data).save();

                let Referal_Amount = (values.Data.Ad_Amount / 2) //50% Amount Referal
                let Company_Amount = (values.Data.Ad_Amount / 2) //50% Amount Referal

                let netquery = {
                    USERID: values.USERID
                };
                let NetworkResult = await Users_Network.findOne(netquery).lean();
                console.log(NetworkResult.Parent_USERID)

                let changes = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": values.Used_Wallet_Amount * -1,
                        "User_Amounts.Withdrawn_Amount": values.Used_Wallet_Amount
                    }
                }

                let User_result = await Users.updateOne(netquery, changes).lean();

                let referal_query = {
                    USERID: NetworkResult.Parent_USERID
                }

                let changesS = {
                    $inc: {
                        "User_Amounts.Available_Amount": Referal_Amount,
                        "User_Amounts.Total_Amount": Referal_Amount,
                    }
                }
                let updatechanges = await Users.updateOne(referal_query, changesS).lean().exec();

                let Wal_Data = {
                    LogID: uuid.v4(),
                    USERID: NetworkResult.Parent_USERID,
                    Type: 33, //Advertisement Subscription Amount Credit to Wallet
                    Amount: Referal_Amount,
                    Time: new Date()
                };
                let SaveWResult = await User_Wallet_Logs(Wal_Data).save();

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


                let max = 0;
                let SnoMax = await YouTube_Links.find().lean().exec();
                if (SnoMax.length == 0) {
                    max = 0
                } else {
                    max = Math.max.apply(Math, SnoMax.map(function (o) { return o.SNo; }))
                }

                let Data = {
                    YouTubeID: uuid.v4(),
                    SNo: max + 1,
                    YouTube_Link_Name: values.Data.YouTube_Link_Name,
                    YouTube_Link: values.Data.YouTube_Link,
                    Description: values.Data.Description,
                    USERID: values.USERID,
                    AreaCode_Array: values.Data.AreaCode_Array,
                    Status: true,
                    Image_Available: values.Data.Image_Available,
                    Image_Data: values.Data.Image_Data,
                    User_Type: values.Data.User_Type,
                    Advertisement_Type: values.Data.Advertisement_Type, // 2:Image Add
                    Ad_Amount: values.Data.Ad_Amount,
                    No_of_Views: values.Data.No_of_Views,
                    Available_Views: values.Data.No_of_Views,
                    Payment_Status: 3,
                    Admin_Approve: 1,
                    TransactionID: values.TransactionID,
                    created_at: new Date(),
                    updated_at: new Date()
                };

                let SaveAdd = await YouTube_Links(Data).save();
                resolve(SaveAdd)


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//product details
CommonController.Check_for_Order = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let query_Order = {
                    OrderID: values.OrderID,
                    Status: true
                }
                let OrderResult = await Orders.findOne(query_Order).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID');

                // let OrderResult = await User_Address.findOne(Address_query).lean().exec();

                if (OrderResult == null) {
                    reject({ success: false, extras: { msg: ApiMessages.ORDER_NOT_FOUND } });
                } else {
                    resolve(OrderResult);
                }


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_Valid_Wallet = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (values.Amount >= UserData.User_Amounts.Available_Amount) {
                    reject({ success: false, extras: { msg: ApiMessages.INSUFFICIENT_AMOUNT } });
                } else {
                    resolve();
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Random_12_Digit_Number = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let charBank = "123456789";
                let str = '';
                for (let i = 0; i < 12; i++) {
                    str += charBank[parseInt(Math.random() * charBank.length)];
                };
                resolve(str);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



CommonController.Check_Phone_Number_Coupon_Bazaar = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PhoneNumber: values.PhoneNumber
                }

                const axios = require('axios')

                let request_optionscb = {
                    method: 'post',
                    baseURL: config.for_req_coupon_bazaar,
                    url: `app/Check_Phone_Number`,
                    data: query
                };

                console.log("252--->"+JSON.stringify(request_optionscb)) 
                let Response = await axios(request_optionscb);

               

                if (Response.status == 200) {
                    console.log("253 "+JSON.stringify(Response.data))
                    if(Response.data.success){
                        values.CountryCode="+91"
                        let OTP = await UserController.Generate_OTP_Transfer(values);
                    }else{
                        
                    }
                    resolve(Response.data);
                } else if (Response.status == 400) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_CAPTURE_AMOUNT } });
                } else if (Response.status == 401) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } });
                }

                resolve(true)

                // let Result = await Users.findOne(query).lean();
                // if (Result == null) {
                //     reject({ success: false, extras: { msg: ApiMessages.INVALID_PHONE_NUMBER } })
                // } else {
                //     resolve(Result);
                // }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}





//Order Deliver
CommonController.Add_Order_to_Delivery = (UserData, ProductData, Address_Data, Order_Type, WebHookData, Order_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                console.log(Order_Data)

                let logquery = {
                    TransactionID: Order_Data.TransactionID
                }

                let Order_LogData = await Order_Logs.findOne(logquery).lean().exec();
                console.log(Order_LogData.Amount)

                let tData = {
                    UserData: UserData,
                    ProductData: ProductData,
                    Address_Data: Address_Data,
                    Order_Type: Order_Type,
                    WebHookData: WebHookData,
                    Order_Data: Order_Data
                }

                let wallet_data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 1,
                    Amount: Order_LogData.Amount,
                    Data: tData,
                    Time: new Date()
                }
                let Save_Wallet = await User_Wallet_Logs(wallet_data).save();

                let Cfndupdquery = {

                };
                let Cfndupdchanges = {
                    $inc: {
                        Available_Amount: Order_LogData.Amount,
                        Total_Amount: Order_LogData.Amount
                    }
                };
                let Cfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();

                // resolve({ UserData, ProductData, Address_Data, Order_Type, WebHookData })
                // Used_Wallet_Amount
                let query = {

                }

                let Data = {}
                if (Order_Type == 1) {
                    Data = {
                        OrderID: uuid.v4(),
                        USERID: UserData.USERID,
                        Status: true,
                        Order_Type: Order_Type,   //1 : Subscription Product 2: Not Subscription Product
                        Product_Order_Used: 1,  //1.subscription product used
                        Order_Status: 1, //1- started, 2- Accepted, 3- completed 4- Tripped 5- Trip Initiated 6- Pickup Start 7- Reached at pickup 8- Order Picked 9- Drop Start 10- Reach at drop
                        Order_Report: [{
                            _id: false,
                            Title: ProductData.Product_Name,
                            Description: ProductData.Description,
                            Price: ProductData.Product_Price,
                            Time: new Date()
                        }],
                        // Amount_Paid: {
                        //     Amount_Used_From_Wallet: { type: Number, default: 0 },
                        //     Amount_Paid_Online: { type: Number, default: 0 },
                        //     Total_Amount_Paid: { type: Number, default: 0 }
                        // },
                        Payment_Type: 4, //1- Wallet, 2- RazorPay 3- both, 4- Subscription 
                        Order_Number: await CommonController.Random_12_Digit_Number(),
                        Payment_Status: 3, // 1- initial, 2- fail, 3- Success,
                        TransactionID: Order_Data.TransactionID,
                        Product_Information: ProductData,
                        Order_Invoice: {
                            Order_Total_Price: ProductData.Product_Price,
                            // Order_Delivery_Charge: { type: Number, default: 0 },
                            // Order_Total_Final_Price: { type: Number, default: 0 },
                        },
                        Delivery_Address_Information: Address_Data,

                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let subProductQuery = {
                        USERID: UserData.USERID,
                        Status: true
                    }
                    let changesS = {
                        "Subscription_Data.Delivery_Product_Used": 2,
                        updated_at: new Date()

                    }
                    let updatechanges = await Users.updateOne(subProductQuery, changesS).lean().exec();

                } else if (Order_Type == 2) {    //Online Amount, General Order Not Subscription Product

                    let Payment_Type = 1
                    if (Object.keys(WebHookData).length != 0) {
                        Payment_Type = 2
                    }

                    Data = {
                        OrderID: uuid.v4(),
                        USERID: UserData.USERID,
                        Status: true,
                        Order_Type: Order_Type,
                        Product_Order_Used: 2,
                        Order_Status: 1,
                        Order_Report: [{
                            _id: false,
                            Title: ProductData.Product_Name,
                            Description: ProductData.Description,
                            Price: ProductData.Product_Price,
                            Time: new Date()
                        }],
                        Amount_Paid: {
                            Amount_Used_From_Wallet: Order_Data.Used_Wallet_Amount,
                            Amount_Paid_Online: Order_Data.Online_Amount,
                            Total_Amount_Paid: Order_Data.Product_Total_Amount
                        },
                        Payment_Type: Payment_Type,
                        Order_Number: await CommonController.Random_12_Digit_Number(),
                        Payment_Status: 3,
                        TransactionID: Order_Data.TransactionID,
                        Product_Information: ProductData,
                        Order_Invoice: {
                            Order_Total_Price: ProductData.Product_Price,
                            // Order_Delivery_Charge: { type: Number, default: 0 },
                            // Order_Total_Final_Price: { type: Number, default: 0 },
                        },
                        Delivery_Address_Information: Address_Data,
                        // From_Information: {
                        //     BranchID: { type: String, default: "" },
                        //     Branch_Name: { type: String, default: "" },
                        //     Branch_PhoneNumber: { type: String, default: "" },
                        //     Latitude: Number,
                        //     Longitude: Number,
                        //     Point: {
                        //         type: [Number],
                        //         index: '2d'
                        //     },
                        //     Address: { type: String, default: "" },
                        // },
                        // Driver_Information: {},
                        // Driver_Logs: [{
                        //     _id: false,
                        //     LogID: { type: String, default: "" },
                        //     TripID: { type: String, default: "" },
                        //     DriverID: { type: String, default: "" },
                        //     Order_Status: { type: Number, default: 1 },
                        //     Time: { type: Date, default: null },
                        // }],

                        WebHookData: WebHookData,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                }

                let Result = await Orders(Data).save();
                resolve(Result);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


//product details
CommonController.Check_for_User_Address = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let Address_query = {
                    Address_ID: values.Address_ID,
                    USERID: values.USERID,
                    Status: true
                }

                let AddressResult = await User_Address.findOne(Address_query).lean().exec();

                if (AddressResult == null) {
                    reject({ success: false, extras: { msg: ApiMessages.ADDRESS_NOT_FOUND } });
                } else {
                    resolve(AddressResult);
                }


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//product details
CommonController.Product_Details = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Product_ID: values.Product_ID,
                    Status: true
                };

                let Result = await Product.findOne(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID');
                if (Result == null) {
                    reject({ success: false, extras: { msg: "Product Not Found" } })
                } else {
                    resolve(Result);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Shop = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ShopData = await Users.findOne({ USERID: values.ShopUSERID }).lean();
                if (ShopData.Whether_Shop) {
                    if (!UserData.Whether_Shop) {
                        resolve(ShopData);
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SHOP_DOESNT_HAVE_PERMISSIONS_FOR_TRANSFER_AMOUNT_TO_OTHER_SHOP } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.USER_DOESNT_HAVE_SHOP_PERMISSIONS } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Validate_Shop_Permission = (UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                UserData = await Users.findOne({ USERID: UserData.USERID }).lean();
                if (UserData.Whether_Shop) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.USER_DOESNT_HAVE_SHOP_PERMISSIONS } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Shop_PIN_CODE = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USER_PIN_CODE: values.USER_PIN_CODE
                };
                let Result = await User_Shop_Pins.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PIN_CODE } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_UPI_Validation = UPI => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (config.UPI_REGEX_FORMAT.test(UPI)) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_UPI_ID } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_News = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    NewsID: values.NewsID
                };
                let Result = await News.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_NEWS } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_GuideLine = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    GuideLineID: values.GuideLineID
                };
                let Result = await GuideLines.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_GUIDELINE } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Plot = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PlotID: values.PlotID
                };
                let Result = await Plots_Log.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PLOT } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Resource = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ResourceID: values.ResourceID
                };
                let Result = await App_Image_Resources.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_RESOURCE } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Date_Validation = Date => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (moment(Date, config.Take_Date_Format).isValid()) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_DATE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Bank_Transfer_Transaction = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    TransactionID: values.TransactionID
                };
                let Result = await User_Bank_Transfers.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_BANK_TRANSFER_TRANSACTION } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Validate_Dates_Filters = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (Boolify(values.Whether_Date_Filter)) {
                    if (
                        values.Start_Date != null && values.Start_Date != ''
                        && values.End_Date != null && values.End_Date != ''
                    ) {
                        CommonController.Common_Start_Date_End_Date_Validation(values).then((ValidityStatus) => {
                            resolve(ValidityStatus)
                        }).catch(err => reject(err));
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } })
                    }
                } else {
                    resolve("Validated Successfully");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Beneficiary = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    BeneficiaryID: values.BeneficiaryID
                };
                let Result = await User_Bank_Beneficiary_Accounts.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_BENEFICIARY } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Finding_Network_Level = (Network_Number) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let level = 0;
                let heirarhy_sum = 0;
                for (let x = 0; x < 1 / 0; x++) {
                    level++;
                    heirarhy_sum += Math.pow(10, x);
                    if (Network_Number <= heirarhy_sum) {
                        break;
                    }
                }
                resolve(level);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_USER_PIN_CODE = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USER_PIN_CODE: values.USER_PIN_CODE
                };
                let Result = await User_Pins.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PIN_CODE } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_Only_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let Result = await Users.findOne(query).select('-_id USERID Name CountryCode PhoneNumber EmailID Whether_Company_Account User_Basic_Information_Available User_Amounts User_Account_Status User_Account_Registered_Date').lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_User_and_Session = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let Result = await Users.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
                } else {
                    if (Result.USER_SESSIONS.SessionID == values.SessionID || config.SECRET_SESSIONID == values.SessionID) {
                        resolve(Result);
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SESSION_EXPIRED } })
                    }
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

// CommonController.Check_for_User_and_Session_with_Active_Account = (values) => {
//     return new Promise((resolve, reject) => {
//         setImmediate(async () => {
//             try {
//                 let query = {
//                     USERID: values.USERID
//                 };
//                 let Result = await Users.findOne(query).lean();
//                 if (Result == null) {
//                     reject({ success: false, extras: { msg: ApiMessages.INVALID_USER } })
//                 } else {
//                     if (Result.USER_SESSIONS.SessionID == values.SessionID || config.SECRET_SESSIONID == values.SessionID) {
//                         if (Result.User_Account_Status == 2 || Result.User_Account_Status == 3 || Result.User_Account_Status == 4 || Result.User_Account_Status == 5) {
//                             resolve(Result);
//                         } else {
//                             reject({ success: false, extras: { msg: ApiMessages.PLEASE_COMPLETE_ATLEAST_10_REFERRALS_FOR_AVAILING_THIS_SERVICE } })
//                         }
//                     } else {
//                         reject({ success: false, extras: { msg: ApiMessages.SESSION_EXPIRED } })
//                     }
//                 };
//             } catch (error) {
//                 reject(await CommonController.Common_Error_Handler(error));
//             }
//         });
//     });
// }


CommonController.Common_Start_Date_End_Date_Validation = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Start_Date = moment(values.Start_Date, config.Take_Date_Format).subtract(330, 'minutes');
                let End_Date = moment(values.End_Date, config.Take_Date_Format).subtract(330, 'minutes').add(1, 'day').subtract(1, 'ms');
                if (Start_Date.isValid() && End_Date.isValid()) {
                    if (Start_Date.isBefore(End_Date)) {
                        resolve("Validated Successfully")
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.START_DATE_MUST_BE_LESS_THAN_END_DATE } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_DATE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Drop_All_Collections_Database = async (req, res) => {
    try {
        let All_Collections = await mongoose.connections[0].collections;
        let Collection_Names = [];
        async.eachSeries(Object.keys(All_Collections), async (item, callback) => {
            try {
                if (item != 'Admins') {
                    Collection_Names.push(item);
                    await mongoose.connection.db.dropCollection(item);
                    callback();
                } else {
                    callback();
                }
            } catch (error) {
                callback();
            }
        }, async (err) => {
            res.json({ success: true, extras: { Status: "All Collections Dropped Successfully", Data: Collection_Names } });
        });
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

CommonController.Common_Unique_Nine_Digit_String = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let alphabank = "ABCDEFGHIJKLMNPQRSTUVWXYZ";
                let charBank = "0123456789ABCDEFGHIJKLMNPQRSTUVWXYZ9876543210";
                charBank = charBank.toUpperCase();
                let fstring = alphabank[parseInt(Math.random() * alphabank.length)];
                for (let i = 0; i < 8; i++) {
                    fstring += charBank[parseInt(Math.random() * charBank.length)];
                }
                resolve(fstring);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
CommonController.Common_Unique_String = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = new Date().getTime();
                let charBank = "abcdefghijklmnpqrstuvwxyz";
                charBank = charBank.toUpperCase();
                let fstring = '';
                for (let i = 0; i < 5; i++) {
                    fstring += charBank[parseInt(Math.random() * charBank.length)];
                }
                resolve(fstring += date);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Common_Last_Day_Start_Date = (qDate) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (qDate == null || qDate == undefined) {
                    var date = moment().startOf('day').subtract(330, 'minutes').subtract(1, 'day').add(1, 'ms').toDate();
                } else {
                    var date = moment(qDate, config.Take_Date_Format).subtract(330, 'minutes').subtract(1, 'day').add(1, 'ms').toDate();
                }
                resolve(date);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Start_Date = (qDate) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (qDate == null || qDate == undefined) {
                    var date = moment().startOf('day').subtract(330, 'minutes').add(1, 'ms').toDate();
                } else {
                    var date = moment(qDate, config.Take_Date_Format).subtract(330, 'minutes').add(1, 'ms').toDate();
                }
                resolve(date);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Random_OTP_Number = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let charBank = "123456789";
                let str = '';
                for (let i = 0; i < 4; i++) {
                    str += charBank[parseInt(Math.random() * charBank.length)];
                };
                resolve(str);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Random_Number = (N) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                var min = 0;
                var max = parseInt(N);
                var random = parseInt(Math.random() * (+max - +min) + +min);
                resolve(random);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Api_Key = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ApiKey: values.ApiKey
                };
                let Result = await Devices.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_API_KEY } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Find_Default_SMS_Provider = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Selected_Provider: true,
                    Status: true
                };
                let Result = await App_SMS_Providers.findOne(query).lean();
                resolve(Result);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Register_or_Get_App_versions = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Result = await App_Versions_Settings.findOne().lean();
                if (Result == null) {
                    let VersionData = await App_Versions_Settings().save();
                    resolve(JSON.parse(JSON.stringify(VersionData)));
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_IP_Address = (req) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let IPAddress = req.headers["x-forwarded-for"];
                if (IPAddress) {
                    let list = IPAddress.split(",");
                    IPAddress = list[list.length - 1];
                } else {
                    IPAddress = req.connection.remoteAddress;
                }
                IPAddress = (IPAddress == '::1') ? '0:0:0:0' : IPAddress;
                resolve(IPAddress);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Common_Email_Validation = EmailID => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (EmailID == "") {
                    resolve("Validated Successfully");
                } else {
                    if (validator.isEmail(EmailID)) {
                        resolve("Validated Successfully");
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_EMAIL_FORMAT } });
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_Old_Password = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.Old_Password);
                let PasswordSalt = UserData.PasswordSalt;
                let pass = Password + PasswordSalt;
                let PasswordHash = crypto.createHash('sha512').update(pass).digest("hex");
                if (UserData.PasswordHash == PasswordHash) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_OLD_PASSWORD } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_Old_And_New_Password = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.New_Password);
                let PasswordSalt = UserData.PasswordSalt;
                let pass = Password + PasswordSalt;
                let PasswordHash = crypto.createHash('sha512').update(pass).digest("hex");
                if (UserData.PasswordHash == PasswordHash) {
                    reject({ success: false, extras: { msg: ApiMessages.OLD_PASSWORD_AND_NEW_PASSWORD_MUST_BE_DIFFERENT } })
                } else {
                    resolve("Validated Successfully");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.GENERATE_TEN_DIGIT_INCREMENT_COUNTER_SEQUENCE = (CounterID, StartCode) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                CounterID = String(CounterID);
                StartCode = String(StartCode);
                let seq = await CommonController.Generate_Counter_Sequence(CounterID);
                let Unique_Sequnce = StartCode;
                let seq_length = (String(seq).length <= 10) ? String(seq).length : 10;
                let length = 10 - seq_length;
                for (let t = 0; t < length; t++) {
                    Unique_Sequnce += 0;
                }
                Unique_Sequnce += seq;
                resolve(Unique_Sequnce);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Generate_Counter_Sequence = (CounterID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    _id: CounterID
                };
                let changes = {
                    $set: {
                        _id: CounterID
                    },
                    $inc: {
                        "seq": 1
                    }
                };
                let options = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let Result = await Counters.findByIdAndUpdate(query, changes, options).lean();
                resolve(Result.seq);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Check_for_Admin = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = new Object();
                if (config.AdminID == values.AdminID) {
                    query = {
                        Status: true
                    };
                } else {
                    query = {
                        AdminID: values.AdminID
                    };
                }
                let Result = await Admins.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_ADMIN } })
                } else {
                    if (Result.SessionID == values.SessionID || config.SECRET_SESSIONID == values.SessionID || config.SessionID == values.SessionID) {
                        resolve(Result);
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SESSION_EXPIRED } })
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


CommonController.Check_for_Image = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ImageID: values.ImageID
                };
                let Result = await Images.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.IMAGE_NOT_FOUND } })
                } else {
                    resolve(Result);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Multiple_Image_Response = Data => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                async.eachSeries(Data, async (item, callback) => {
                    try {
                        item.Image50 = config.S3URL + item.Image50;
                        item.Image100 = config.S3URL + item.Image100;
                        item.Image250 = config.S3URL + item.Image250;
                        item.Image550 = config.S3URL + item.Image550;
                        item.Image900 = config.S3URL + item.Image900;
                        item.ImageOriginal = config.S3URL + item.ImageOriginal;
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve(Data);
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Image_Response_Single_Image = (Available, Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (Available) {
                    Data.Image50 = config.S3URL + Data.Image50;
                    Data.Image100 = config.S3URL + Data.Image100;
                    Data.Image250 = config.S3URL + Data.Image250;
                    Data.Image550 = config.S3URL + Data.Image550;
                    Data.Image900 = config.S3URL + Data.Image900;
                    Data.ImageOriginal = config.S3URL + Data.ImageOriginal;
                    resolve(Data);
                } else {
                    resolve(new Object());
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_File_Response_Single_File = (Available, Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (Available) {
                    Data.File_Path = config.S3URL + Data.File_Path;
                    resolve(Data);
                } else {
                    resolve(new Object());
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Check_for_Secret_Code = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (values.SECRETCODE == config.SECRETCODE) {
                    resolve("Validated Successfully")
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_SECRET_CODE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CommonController.Common_Error_Handler = (error) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                console.error("Common_Error_Handler---------->", error);
                if (error.success == null || error.success == undefined) {
                    if (error instanceof SyntaxError) {
                        resolve({ success: false, extras: { msg: ApiMessages.SERVER_ERROR } })
                    } else {
                        resolve({ success: false, extras: { msg: ApiMessages.DATABASE_ERROR } })
                    }
                } else {
                    resolve(error);
                }
            } catch (error) {
                console.error('Something Error Handler--->', error);
            }
        });
    });
};
//////pj Code

CommonController.User_Add_Subscription_Data = (PinResult, UserData, type, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let queryS = {
                    SubscriptionID: PinResult.SubscriptionID,
                    Version: PinResult.Version
                };
                let ResultS = await Subscription_Log.findOne(queryS).lean();
                var d = new Date();
                let expireDate = new Date(d.setFullYear(d.getFullYear() + parseInt(ResultS.Duration)));
                let queryU = {
                    USERID: UserData.USERID
                };
                let Delivery_Product_Used = 0;
                if (ResultS.New_Pin && ResultS.Delivery_Compulsory) {
                    Delivery_Product_Used = 1
                }
                let Subscription_Amount = ResultS.Subscription_Amount;
                let Wallet_Amount_Used = Subscription_Amount - Amount
                if (Wallet_Amount_Used != 0) {
                    //let Amount = subResult.Total_Amount - parseFloat(Amount.toFixed(2));
                    let DataSubs = {
                        LogID: uuid.v4(),
                        USERID: UserData.USERID,
                        Type: 2,
                        Amount: Wallet_Amount_Used,
                        Time: new Date(),
                        Data: {
                            SubscriptionID: PinResult.SubscriptionID,
                            Subscription_Amount: PinResult.Total_Amount,
                            Subscription_Type: 2,
                            Subscription_Expiry_Date: expireDate,
                            Time: new Date()
                        }
                    }
                    let Data = await User_Wallet_Logs(DataSubs).save();
                    let changesS = {
                        $inc: {
                            'User_Amounts.Withdrawn_Amount': Wallet_Amount_Used,
                            'User_Amounts.Available_Amount': Wallet_Amount_Used * -1
                        }
                    }
                    let updatechanges = await Users.updateOne(queryU, changesS).lean().exec();
                }

                let Pin = PinResult.USER_PIN_CODE;
                let type_modified;
                let No_of_Referrals;
                if (PinResult.USERID.startsWith("Admin_")) {
                    type_modified = 4;
                    No_of_Referrals = 10
                } else {
                    type_modified = type;
                    No_of_Referrals = 0
                }
                let changes = {
                    $set: {
                        USER_PIN_CODE: Pin,
                        Subscription_Type: type_modified,
                        Subscription_Expiry_Date: expireDate,
                        updated_at: new Date(),
                        Whether_Subscribed: true,
                        Subscription_Data: {
                            SubscriptionID: PinResult.SubscriptionID,
                            Subscription_Name: ResultS.Subscription_Name,
                            Version: PinResult.Version,
                            Subscription_Amount: ResultS.Subscription_Amount,
                            Subscription_Expiry_Date: expireDate,
                            Delivery_Product_Used: Delivery_Product_Used,
                            Subscription_Limits: ResultS.Subscription_Type
                        }
                    },
                    $push: {
                        Subscription_Logs: {
                            $each: [{
                                SubscriptionID: PinResult.SubscriptionID,
                                Version: PinResult.Version,
                                Subscription_Amount: ResultS.Subscription_Amount,
                                Subscription_Expiry_Date: expireDate,
                                Delivery_Product_Used: Delivery_Product_Used,
                                Subscription_Limits: ResultS.Subscription_Type //BOOKMARK SAVING SUBSCRIPTION
                            }]
                        }
                    }
                }
                let changesRef = {
                    $set: {
                        updated_at: new Date(),
                        Whether_Subscribed: true
                    },
                    $inc: {
                        No_of_Referrals: No_of_Referrals
                    }
                }
                let UpdateUserData = await Users.findOneAndUpdate(queryU, changes).lean();
                let UpdateRefData = await Users_Referrals.findOneAndUpdate(queryU, changesRef).lean();
                let queryRef = {
                    USERID: UserData.Referral_USERID
                };
                let UserData1 = await Users.findOne(queryRef).lean();
                let ReferralData = {
                    USERID: '',
                    Name: '',
                    CountryCode: '',
                    PhoneNumber: ''
                }
                if (UserData1 != null) {
                    ReferralData = {
                        USERID: UserData1.USERID,
                        Name: UserData1.Name,
                        CountryCode: UserData1.CountryCode,
                        PhoneNumber: UserData1.PhoneNumber
                    }
                }
                //console.log(UserData.Upgrade);

                if (UserData.Upgrade != 'true') {
                    //console.log('x');
                    let NetworkProcessing = await UserController.User_Network_Processing(UserData, ReferralData);
                }
                //amount sharing start here
                //console.log(1)
                //console.log(PinResult.USERID.startsWith("Admin_"))
                /// amount to referal account
                if (!(PinResult.USERID.startsWith("Admin_"))) {
                    //console.log('Purchased pin')
                    let Referal_Amount = parseFloat((ResultS.Subscription_Amount * ResultS.Subscription_Type.DF_Ref) / 100);
                    // referal amouunt to user account or if no referal exit amount will be transfered to trimmer accout;
                    //console.log(UserData1)
                    if (UserData1 != null) { //amount to user account
                        //console.log(1)
                        let changesRef = {
                            $inc: {
                                "User_Amounts.Available_Amount": Referal_Amount,
                                "User_Amounts.Referral_Amount": Referal_Amount,
                                "User_Amounts.Total_Amount": Referal_Amount
                            }
                        }
                        //console.log(UserData1);
                        let updateRefData = await Users.updateOne(queryRef, changesRef).lean();

                        //console.log(2)
                        let LData = {
                            LogID: uuid.v4(),
                            USERID: UserData1.USERID,
                            Type: 24, //Referal Bonus from referal users
                            Amount: Referal_Amount,
                            Data: {
                                Amount: Referal_Amount,
                            },
                            Time: new Date()
                        };
                        let LSaveResult = await User_Wallet_Logs(LData).save();

                        /////////////////////////////

                        let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Refferal_Sharing', Referal_Amount);

                        /////////////////////////////

                    } else { // amount to trimmer account
                        //console.log(2)

                        let TxData = {
                            LogID: uuid.v4(),
                            Type: 9, //referal bonus expired from non-referal users
                            Amount: Referal_Amount,
                            Time: new Date()
                        };
                        let TxSaveResult = await Trimmer_Wallet_Logs(TxData).save();
                        let Txfndupdquery = {

                        };
                        let Txfndupdchanges = {
                            $inc: {
                                Available_Amount: Referal_Amount,
                                Total_Amount: Referal_Amount
                            }
                        };
                        let Txfndupdoptions = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        }
                        let TxfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Txfndupdquery, Txfndupdchanges, Txfndupdoptions).select('-_id -__v').lean();
                    }
                    ///
                    //console.log(3)
                    /// amount to company account
                    let Company_Amount = parseFloat((ResultS.Subscription_Amount * ResultS.Subscription_Type.Company_Subscription_Share) / 100);// ResultS.Subscription_Amount;
                    let CData = {
                        LogID: uuid.v4(),
                        Type: 1,
                        Amount: Company_Amount,
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
                    let refprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Company_Sharing', Company_Amount);
                    let Trimmer_Amount = parseFloat((ResultS.Subscription_Amount * ResultS.Subscription_Type.Trimmer_Subscription_Share) / 100);// ResultS.Subscription_Amount;
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 5,
                        Amount: Trimmer_Amount,
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
                    let New_Pin = false
                    let Delivery_Compulsory = false
                    let Product_Data = ""
                    if (ResultS.New_Pin != null && ResultS.New_Pin != undefined) {
                        New_Pin = ResultS.New_Pin
                    }
                    if (ResultS.Delivery_Compulsory != null && ResultS.Delivery_Compulsory != undefined) {
                        Delivery_Compulsory = ResultS.Delivery_Compulsory
                    }
                    if (ResultS.Product_Data != null && ResultS.Product_Data != undefined) {
                        Product_Data = ResultS.Product_Data
                    }
                    ///////
                    let Subscription_Logs = {
                        SubscriptionID: PinResult.SubscriptionID,
                        Version: PinResult.Version,
                        Subscription_Amount: ResultS.Subscription_Amount,
                        Subscription_Expiry_Date: expireDate,
                        Subscription_Limits: ResultS.Subscription_Type,
                        New_Pin: New_Pin,
                        Delivery_Compulsory: Delivery_Compulsory,
                        Product_Data: Product_Data
                    };

                    let AmountProcessing = await UserController.Subscription_Amount_Sharing('', UserData, Subscription_Logs);
                    //console.log(4)
                    //end
                }
                resolve('User Data updated');

            } catch (error) {
                console.error('Something Error Handler--->', error);
            }
        });
    });
}

CommonController.Daily_Sharing_Amount_Processing_For_Log = (Type, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let Date1 = moment().format('YYYY-MM-DD');
                let fndupdquerylog = {
                    Date: Date1
                };
                let LogCheck = await Day_Sharing_Log.findOne(fndupdquerylog).lean();
                if (LogCheck == null) {

                    let d = new Date();
                    d.setDate(d.getDate() - 1);
                    let Date2 = moment(d).format('YYYY-MM-DD');
                    let queryx = {
                        Date: Date2
                    }
                    let Resultx = await Day_Sharing_Log.findOne(queryx).lean();
                    let Data;
                    if (Resultx == null) {
                        Data = {
                            Date: Date1,
                        }
                        let createNew = await Day_Pins_Log(Data).save();
                    }

                }
                let fndupdchangeslog;
                if (Type == 'Refferal_Sharing') {
                    fndupdchangeslog = {
                        $inc: {
                            Refferal_Amount: Amount,
                            Total_Amount: Amount
                        }
                    };
                } else if (Type == 'Level_Sharing') {
                    fndupdchangeslog = {
                        $inc: {
                            Level_Amount: Amount,
                            Total_Amount: Amount
                        }
                    };
                } else if (Type == 'Royality_Sharing') {
                    fndupdchangeslog = {
                        $inc: {
                            Royality_Amount: Amount,
                            Total_Amount: Amount
                        }
                    };
                } else if (Type == 'Company_Sharing') {
                    fndupdchangeslog = {
                        $inc: {
                            Company_Amount: Amount,
                            Total_Amount: Amount
                        }
                    };
                } else {
                    resolve('Invalid Type')
                }

                let fndupdoptionslog = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let findupdateDatalog = await Day_Sharing_Log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();


                resolve('completed');
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
export default CommonController;