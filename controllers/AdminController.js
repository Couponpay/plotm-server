let AdminController = function () { };
import uuid from "uuid";
import ApiMessages from "../config/ApiMessages";
import CommonController from "./CommonController";
import Counters from "../models/Counters";
import async from "async";
import crypto from "crypto";
import { isBoolean, Boolify } from "node-boolify";
import moment from "moment";
import config from "../config/config";
import Admins from "../models/Admins";
import Users from "../models/Users";
import Users_Network from "../models/Users_Network";
import User_Wallet_Logs from "../models/User_Wallet_Logs";
import Company_Wallet_Logs from "../models/Company_Wallet_Logs";
import Company_Wallet from "../models/Company_Wallet";
import Trimmer_Wallet_Logs from "../models/Trimmer_Wallet_Logs";
import Trimmer_Wallet from "../models/Trimmer_Wallet";
import User_Failed_Recharges from "../models/User_Failed_Recharges";
import User_Friend_Money_Requests from "../models/User_Friend_Money_Requests";
import User_Bank_Beneficiary_Accounts from "../models/User_Bank_Beneficiary_Accounts";
import User_Recharges from "../models/User_Recharges";
import User_Bank_Transfers from "../models/User_Bank_Transfers";
import User_Pins from "../models/User_Pins";
import Trimmer_Distribution from "../models/Trimmer_Distribution";
import Trimmer_Distribution_Logs from "../models/Trimmer_Distribution_Logs";
import Images from "../models/Images";
import GuideLines from "../models/GuideLines";
import AWSController from "./AWSController";
import App_Versions_Settings from "../models/App_Versions_Settings";
import News from "../models/News";
import App_Image_Resources from "../models/App_Image_Resources";
import Subscription from "../models/Subscription";
import Subscription_Log from "../models/Subscription_Log";
import Files from "../models/Files";
import Plots_Log from "../models/Plots_Log";
import YouTube_Links from "../models/YouTube_Links";
import UserController from "./UserController";
import Day_Pins_Log from "../models/Day_Pins_Log";
import Day_Bank_log from "../models/Day_Bank_log";
import Devices from "../models/Devices";
import Razorpay_Webhooks from "../models/Razorpay_Webhooks";
import RazorpayX_Webhooks from "../models/RazorpayX_Webhooks";
import User_OTPS from "../models/User_OTPS";
import User_OTP_Tries from "../models/User_OTP_Tries";
import User_Pin_Purchase from "../models/User_Pin_Purchase";
import User_Pin_Tries from "../models/User_Pin_Tries";
import User_Shop_Log from "../models/User_Shop_Log";
import User_Shop_Pins from "../models/User_Shop_Pins";
import User_Subscription_Log from "../models/User_Subscription_Log";
import Installed_Devices from "../models/Installed_Devices";
import Users_Referrals from "../models/Users_Referrals";
import Day_Sharing_Log from "../models/Day_Sharing_Log";
import Gift_Meter from "../models/Gift_Meter";
import Product from "../models/Product";
import Orders from "../models/Orders";

import States from "../models/State"



AdminController.Active_Inactive_Gift_Meter = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                Gift_Meter_ID: values.Gift_Meter_ID
            };
            let Result = await Gift_Meter.findOne(query).lean();

            if (Result == null) {
                reject({ success: false, extras: { msg: "Gift Meter Not Available" } })
            } else {
                let statys;
                if (Result.Status) {

                    statys = "Inactivated Successfully";
                    let changes = {
                        $set: {
                            Status: false,
                            updated_at: new Date(),
                        }
                    }
                    let SaveResult = await Gift_Meter.updateOne(query, changes).lean().exec();

                } else {
                    statys = "Activated Successfully"
                    let changes = {
                        $set: {
                            Status: true,
                            updated_at: new Date(),
                        }
                    }

                    let SaveResult = await Gift_Meter.updateOne(query, changes).lean().exec();
                }

                resolve({ success: true, extras: { Status: statys } });
            }

        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}



AdminController.Active_Inactive_Product = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                Product_ID: values.Product_ID
            };
            let Result = await Product.findOne(query).lean();

            if (Result == null) {
                reject({ success: false, extras: { msg: "Product Not Found" } })
            } else {
                let statys;
                if (Result.Status) {

                    statys = "Inactivated Successfully";
                    let changes = {
                        $set: {
                            Status: false,
                            updated_at: new Date(),
                        }
                    }
                    let SaveResult = await Product.updateOne(query, changes).lean().exec();

                } else {
                    statys = "Activated Successfully"
                    let changes = {
                        $set: {
                            Status: true,
                            updated_at: new Date(),
                        }
                    }

                    let SaveResult = await Product.updateOne(query, changes).lean().exec();
                }

                resolve({ success: true, extras: { Status: statys } });
            }

        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}


AdminController.Check_For_Prod_SNo_Available = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                S_NO: values.S_NO,
            }
            let Result = await Product.findOne(query).lean().exec();
            if (Result == null) {
                resolve('SNo Available');
            } else {
                reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                // msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST
            }
        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}

AdminController.Check_For_GM_SNo_Available = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let query = {
                S_NO: values.S_NO,
            }
            let Result = await Gift_Meter.findOne(query).lean().exec();
            if (Result == null) {
                resolve('SNo Available');
            } else {
                reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                // msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST
            }
        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}


//Change details
AdminController.Apr_Rej_Adverstisement = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query_Advertisment = {
                    YouTubeID: values.YouTubeID,
                    Status: true
                }


                let Result = await YouTube_Links.findOne(query_Advertisment).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID');
                if (Result == null) {
                    reject({ success: false, extras: { msg: "Advertisement Not Found" } })
                } else {
                    let changes = {
                        $set: {
                            Admin_Approve: values.Ad_Status,
                            updated_at: new Date(),
                        }
                    };
                    let Update = await YouTube_Links.updateOne(query_Advertisment, changes).lean();
                    resolve({ success: true, extras: { Status: "Advertisement Status Updated Successfully" } })
                    resolve(Result);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


//Change details
AdminController.Change_Order_Status = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query_Order = {
                    OrderID: values.OrderID,
                    Status: true
                }


                let Result = await Orders.findOne(query_Order).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID');
                if (Result == null) {
                    reject({ success: false, extras: { msg: "Order Not Found" } })
                } else {
                    let changes = {
                        $set: {
                            Order_Status: values.Order_Status,
                            updated_at: new Date(),
                        }
                    };
                    let Update = await Orders.updateOne(query_Order, changes).lean();
                    resolve({ success: true, extras: { Status: "Product Status Updated Successfully" } })
                    resolve(Result);
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//product details
AdminController.List_Orders = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Status: true,
                    Order_Status: values.Order_Status
                };
                if(values.Order_Status == 0){
                    query = {
                        Status: true
                    };
                }

                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };

                let Count = await Orders.countDocuments(query).lean().exec();
                let Result  = await Orders.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                if (Result.length == 0) {
                    reject({ success: false, extras: { msg: "Orders Not Found" } })
                } else {
                    async.eachSeries(Result, async (item, callback) => {
                        try {
                            console.log(item.Product_Information.Product_Image_Data)
                            if (item.Product_Information.Product_Image_Data != null) {
                                item.Product_Information.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Product_Information.Product_Image_Data);
                            } else {
                                item.Product_Information.Product_Image_Data = ""
                            }
    
                            callback();
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
    
                        // Result.sort(function (a, b) { return a.S_NO - b.S_NO })
                        resolve({ success: true, extras: { Count: Count, Data: Result } });
                    });
                   
                   
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


//product details
AdminController.Product_Details = values => {
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

//All product detaila
AdminController.List_Products = values => {
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

                let Status = true
                if (values.Status == 1) {
                    Status = true
                } else if (values.Status == 2) {
                    Status = false
                }
                let query = {
                    Status: Status
                };


                let Count = await Product.countDocuments(query).lean().exec();
                let Result = await Product.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                // Code Adde Raj
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        console.log(item.Product_Data)
                        if (item.Product_Image_Data != null) {
                            item.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Product_Image_Data);
                        } else {
                            item.Product_Image_Data = ""
                        }

                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);

                    Result.sort(function (a, b) { return a.S_NO - b.S_NO })
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//Edit Product
AdminController.Edit_Product = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Product_ID: values.Product_ID
                };
                let Result = await Product.findOne(query).lean();
                if (Result != null) {
                    let changes = {
                        $set: {
                            S_NO: values.S_NO,
                            Product_Name: values.Product_Name,
                            Product_Price: values.Product_Price,
                            Product_Image_Available: true,
                            Product_Image_Data: ImageData,
                            Description: values.Description,
                            updated_at: new Date(),
                        }
                    };
                    let Update = await Product.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "Product Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: "Product Not Available" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//Add_Product
AdminController.Add_Product = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // console.log(values)

                let Data = {
                    Product_ID: uuid.v4(),
                    S_NO: values.S_NO,
                    Product_Name: values.Product_Name,
                    Product_Price: values.Product_Price,
                    Product_Image_Available: true,
                    Product_Image_Data: ImageData,
                    Description: values.Description,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                let Result = await Product(Data).save();
                resolve({ success: true, extras: { Status: "Product Created Successfully" } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


AdminController.List_Gift_Meter = values => {
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
                let Status = true
                if (values.Status == 1) {
                    Status = true
                } else if (values.Status == 2) {
                    Status = false
                }
                let query = {
                    Status: Status
                };

                let Count = await Gift_Meter.countDocuments(query).lean().exec();
                let Result = await Gift_Meter.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                // Code Adde Raj
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        // console.log(item.Product_Data)
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

                    Result.sort(function (a, b) { return a.S_NO - b.S_NO })

                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });



            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

//Edit Gift Meter
AdminController.Edit_Gift_Meter = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Gift_Meter_ID: values.Gift_Meter_ID
                };
                let Result = await Gift_Meter.findOne(query).lean();
                if (Result != null) {
                    let changes = {
                        $set: {
                            S_NO: values.S_NO,
                            Gift_Meter_Image_Available: true,
                            Gift_Meter_Image_Data: ImageData,
                            Amount: values.Amount,
                            Is_Root: values.Is_Root,
                            Gift_Meter_Level_ID: values.Gift_Meter_Level_ID,
                            updated_at: new Date()
                        }
                    };
                    let Update = await Gift_Meter.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "Gift Meter Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: "Gift Meter Not Available" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
//Create_Gift_Meter
AdminController.Create_Gift_Meter = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Result = null
                if (values.Is_Root) {
                    let query_rt = {
                        Is_Root: true,
                        Status: true
                    }
                    Result = await Gift_Meter.findOne(query_rt).lean();
                }

                // console.log(values)

                if (Result == null) {
                    let Gift_Meter_Level_ID = values.Gift_Meter_Level_ID;
                    if (values.Is_Root) {
                        Gift_Meter_Level_ID = null
                    }
                    let Data = {
                        Gift_Meter_ID: uuid.v4(),
                        S_NO: values.S_NO,
                        Gift_Meter_Image_Available: true,
                        Gift_Meter_Image_Data: ImageData,
                        Amount: values.Amount,
                        Is_Root: values.Is_Root,
                        Gift_Meter_Level_ID: Gift_Meter_Level_ID,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                    let Result = await Gift_Meter(Data).save();
                    resolve({ success: true, extras: { Status: "Gift Meter Created Successfully" } });
                } else {
                    reject({ success: false, extras: { msg: "Gift Root Already Exist" } })
                }


            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.All_Users_Wallet_Balance = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Total_Amount = 0;
                let query = {
                    Status: true
                };
                let gmapping = {
                    "_id": "Total_Amount",
                    "Total_Amount": {
                        $sum: "$User_Amounts.Available_Amount"
                    }
                };
                let Result = await Users.aggregate().match(query).group(gmapping);
                Result = await JSON.parse(JSON.stringify(Result));
                if (Result.length > 0) {
                    Total_Amount += Result[0].Total_Amount;
                    resolve({ success: true, extras: { Data: { Total_Amount: parseFloat(Total_Amount.toFixed(2)) } } });
                } else {
                    resolve({ success: true, extras: { Data: { Total_Amount: parseFloat(Total_Amount.toFixed(2)) } } });
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Refund_For_Black_Accounts = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let walletquery = {
                    Type: 4
                };
                let WalletResult = await User_Wallet_Logs.find(walletquery).lean().exec();
                let i = 0
                async.eachSeries(WalletResult, async (item, callback) => {
                    i++;
                    console.log(i)
                    try {
                        let Amount = item.Amount;
                        let query = {
                            USERID: item.USERID,
                        }
                        let changes = {
                            $set: {
                                User_Account_Status: 1,
                            },
                            $inc: {
                                "User_Amounts.Withdrawn_Amount": (Amount * -1),
                                "User_Amounts.Available_Amount": Amount
                            }
                        }
                        let SaveData = await Users.updateOne(query, changes).lean().exec();
                        let Delete_User_Wallet_Logs = await User_Wallet_Logs.deleteOne({ USERID: item.USERID, Type: 4 }).lean();
                        let Delete_Trimmer_Wallet_Logs = await Trimmer_Wallet_Logs.deleteOne({ 'Data.UserData.UserID': item.USERID, Type: 3 }).lean();
                        let Tfndupdquery = {

                        };
                        let Tfndupdchanges = {
                            $inc: {
                                Available_Amount: Amount * -1,
                                Total_Amount: Amount * -1
                            }
                        };
                        let Tfndupdoptions = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        };
                        let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve({ success: true, extras: { Status: "Process Completed" } });
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Clear_User_Data = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {

                }
                let Delete_comapy_Log = await Company_Wallet_Logs.deleteMany(query).lean();
                let Delete_comapy_wallet = await Company_Wallet.deleteMany(query).lean();
                let Delete_Counter = await Counters.deleteMany(query).lean();
                let Delete_Day_Pins_Log = await Day_Pins_Log.deleteMany(query).lean();
                let Delete_Day_Bank_log = await Day_Bank_log.deleteMany(query).lean();
                let Delete_Day_share_log = await Day_Sharing_Log.deleteMany(query).lean();
                let Delete_Devices = await Devices.deleteMany(query).lean();
                let Delete_Installed_Devices = await Installed_Devices.deleteMany(query).lean();
                let Delete_Razorpay_Webhooks = await Razorpay_Webhooks.deleteMany(query).lean();
                let Delete_RazorpayX_Webhooks = await RazorpayX_Webhooks.deleteMany(query).lean();
                let Delete_Trimmer_Distribution = await Trimmer_Distribution.deleteMany(query).lean();
                let Delete_Trimmer_Distribution_Logs = await Trimmer_Distribution_Logs.deleteMany(query).lean();
                let Delete_Trimmer_Wallet = await Trimmer_Wallet.deleteMany(query).lean();
                let Delete_Trimmer_Wallet_Logs = await Trimmer_Wallet_Logs.deleteMany(query).lean();
                let Delete_User_Bank_Beneficiary_Accounts = await User_Bank_Beneficiary_Accounts.deleteMany(query).lean();
                let Delete_User_OTPS = await User_OTPS.deleteMany(query).lean();
                let Delete_User_OTP_Tries = await User_OTP_Tries.deleteMany(query).lean();
                let Delete_User_Pin_Purchase = await User_Pin_Purchase.deleteMany(query).lean();
                let Delete_User_Pins = await User_Pins.deleteMany(query).lean();
                let Delete_User_Pin_Tries = await User_Pin_Tries.deleteMany(query).lean();
                let Delete_User_Shop_Log = await User_Shop_Log.deleteMany(query).lean();
                let Delete_User_Shop_Pins = await User_Shop_Pins.deleteMany(query).lean();
                let Delete_User_Subscription_Log = await User_Subscription_Log.deleteMany(query).lean();
                let Delete_User_Wallet_Logs = await User_Wallet_Logs.deleteMany(query).lean();
                let Delete_Users = await Users.deleteMany(query).lean();
                let Delete_Users_Network = await Users_Network.deleteMany(query).lean();
                let Delete_Users_Referrals = await Users_Referrals.deleteMany(query).lean();
                resolve({ success: true, extras: { Status: "Process Completed" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.User_Level_Report = (values, NetworkUserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let NetworkData = await UserController.User_Network_Heirarchy(values, NetworkUserData, 2);
                let ParentData = NetworkData.ParentData;
                let ChildData = NetworkData.ChildData;

                resolve({ success: true, extras: { Data1: NetworkData } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Sharing_Day_Report = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Date1 = moment(values.Date).format('YYYY-MM-DD');
                let today = moment().format('YYYY-MM-DD');
                if (Date1 <= today) {
                    let query = {
                        Date: Date1
                    }
                    let Result = await Day_Sharing_Log.findOne(query).select('-_id -__v').lean();
                    if (Result == null) {
                        let d = new Date(values.Date);
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
                        } else {
                            Data = {
                                Date: Date1,
                            }
                        }

                        let createNew = await Day_Sharing_Log(Data).save();
                        let Result1 = await Day_Sharing_Log.findOne(query).select('-_id -__v').lean();

                        resolve({ success: true, extras: { Data: Result1 } });
                    } else {
                        resolve({ success: true, extras: { Data: Result } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.FUTURE_DATE_NOT_ALLOWED } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Bank_Day_Report = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Date1 = moment(values.Date).format('YYYY-MM-DD');
                let today = moment().format('YYYY-MM-DD');
                if (Date1 <= today) {
                    let query = {
                        Date: Date1
                    }
                    let Result = await Day_Bank_log.findOne(query).select('-_id -__v').lean();
                    if (Result == null) {
                        let d = new Date(values.Date);
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
                        let Result1 = await Day_Bank_log.findOne(query).select('-_id -__v').lean();

                        resolve({ success: true, extras: { Data: Result1 } });
                    } else {
                        resolve({ success: true, extras: { Data: Result } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.FUTURE_DATE_NOT_ALLOWED } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Pins_Day_Report = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Date1 = moment(values.Date).format('YYYY-MM-DD');
                let today = moment().format('YYYY-MM-DD');
                if (Date1 <= today) {
                    let query = {
                        Date: Date1
                    }
                    let Result = await Day_Pins_Log.findOne(query).select('-_id -__v').lean();
                    if (Result == null) {
                        let d = new Date(values.Date);
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
                        let Result1 = await Day_Pins_Log.findOne(query).select('-_id -__v').lean();

                        resolve({ success: true, extras: { Data: Result1 } });
                    } else {
                        resolve({ success: true, extras: { Data: Result } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.FUTURE_DATE_NOT_ALLOWED } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Free_Pins = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: { $regex: /^ADMIN_/i },
                    TransactionID: { $regex: /^ADMIN_/i }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };

                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Pins.countDocuments(query).lean().exec();
                let Result = await User_Pins.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Generate_Free_Pins = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SubscriptionID: values.SubscriptionID
                };
                let Result = await Subscription.findOne(query).lean();
                if (Result != null) {
                    let no_of_pins = parseInt(values.Quantity);

                    //console.log(1);
                    let PinFree = 0;
                    async.timesSeries(no_of_pins, async (index, callback) => {
                        try {
                            let USER_PIN_CODE = await UserController.Take_Unique_USER_PIN_CODE();
                            //console.log(USER_PIN_CODE);
                            let Data = {
                                USERID: 'Admin_' + values.AdminID,
                                USER_PIN_CODE: USER_PIN_CODE,
                                SubscriptionID: values.SubscriptionID,
                                TransactionID: 'Admin_' + USER_PIN_CODE,
                                Subscription_Amount: Result.Subscription_Amount,
                                Subscription_Type: Result.Subscription_Name,
                                Version: Result.Current_Version,
                                created_at: new Date(),
                                updated_at: new Date()
                            }
                            let SaveResult = await User_Pins(Data).save();
                            PinFree = PinFree + 1
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
                                "Created_Pins.PinFree": PinFree,
                                "Balance_Pins.PinFree": PinFree,
                                "Total_Pins.PinFree": PinFree,
                                "Total_Balance_Pins.PinFree": PinFree,
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
                    resolve({ success: true, extras: { Status: "Pins Generated Successfully" } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_NOT_FOUND } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Remove_Resource_Image = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ResourceID: values.ResourceID
                };
                let DeletedxStatus = await App_Image_Resources.deleteOne(query).lean();
                resolve({ success: true, extras: { Status: "Image Removed Successfully" } });
                let RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image50);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image100);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image250);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image550);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image900);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.ImageOriginal);
                let DeletedStatus = await Images.deleteOne({ ImageID: values.ImageID }).lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Remove_Plot_Image = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PlotID: values.PlotID
                };
                let changes = {
                    $set: {
                        updated_at: new Date()
                    },
                    $pull: {
                        Plot_Image_Data: {
                            ImageID: values.ImageID
                        }
                    }
                };
                let UpdatedStatus = await Plots_Log.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Image Removed Successfully" } });
                let RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image50);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image100);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image250);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image550);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image900);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.ImageOriginal);
                let DeletedStatus = await Images.deleteOne({ ImageID: values.ImageID }).lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_Subscriptions_Validate_All = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (values.Subscription_Name.length <= config.Subscription_Title_Length) {
                    if (values.Description.length <= config.Subscription_Description_Length) {
                        resolve("Validated Successfully");
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_TITLE_CHARACTERS_EXCEEDED } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_DESCRIPTION_CHARACTERS_EXCEEDED } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Activate_Inactivate_News = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    NewsID: values.NewsID
                };
                let Result = await News.findOne(query).lean();
                if (Result != null) {
                    let changes;
                    if (Result.Status == true) {
                        changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                    } else {
                        changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                    }
                    let updatedSubscription_Links = await News.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "News Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_NEWS } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Activate_Inactivate_Subscriptions = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SubscriptionID: values.SubscriptionID
                };
                let Result = await Subscription.findOne(query).lean();
                if (Result != null) {
                    let changes;
                    if (Result.Status == true) {
                        changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                    } else {
                        changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                    }
                    let updatedSubscription_Links = await Subscription.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "Subscription Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_NOT_FOUND } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_YouTube_Add = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    YouTubeID: values.YouTubeID
                };
                let Result = await YouTube_Links.findOne(query).lean();
                if (Result != null) {
                    let changes = {
                        $set: {
                            YouTube_Link_Name: values.YouTube_Link_Name,
                            YouTube_Link: values.YouTube_Link,
                            Description: values.Description,
                            AreaCode_Array: values.AreaCode_Array,
                            updated_at: new Date()
                        }
                    };
                    let UpdateAdd = await YouTube_Links.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "YouTube Ad Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_YOUTUBE_LINK } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_Plot = (values, All_Images_Data, File_Data, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PlotID: values.PlotID
                };
                let Result = await Plots_Log.findOne(query).lean();
                if (Result != null) {
                    let queryx = {
                        SNo: values.SNo,
                    }
                    let ResourceData1 = await News.find(queryx).lean().exec();
                    if (ResourceData1.length != 0) {
                        if (ResourceData1[0].SNo == Result.SNo) {
                            let changes = {
                                $set: {
                                    Plot_Name: values.Plot_Name,
                                    Company_Name: values.Company_Name,
                                    SNo: Result.SNo,
                                    Address: values.Address,
                                    Description: values.Description,
                                    Plot_Image_Data: All_Images_Data,
                                    Company_Image_Data: ImageData,
                                    FileData: File_Data,
                                    Latitude: parseFloat(values.Latitude),
                                    Longitude: parseFloat(values.Longitude),
                                    Point: [parseFloat(values.Longitude), parseFloat(values.Latitude)],
                                    updated_at: new Date()
                                }
                            };
                            let UpdatePlot = await Plots_Log.updateOne(query, changes).lean();
                            resolve({ success: true, extras: { Status: "Plot Updated Successfully" } })

                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                        }
                    } else {
                        let changes = {
                            $set: {
                                Plot_Name: values.Plot_Name,
                                Company_Name: values.Company_Name,
                                SNo: values.SNo,
                                Address: values.Address,
                                Description: values.Description,
                                Plot_Image_Data: All_Images_Data,
                                Company_Image_Data: ImageData,
                                FileData: File_Data,
                                Latitude: parseFloat(values.Latitude),
                                Longitude: parseFloat(values.Longitude),
                                Point: [parseFloat(values.Longitude), parseFloat(values.Latitude)],
                                updated_at: new Date()
                            }
                        };
                        let UpdatePlot = await Plots_Log.updateOne(query, changes).lean();
                        resolve({ success: true, extras: { Status: "Plot Updated Successfully" } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PLOT } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_YouTube_Add = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {}
                if (values.User_Type == 2) {
                    if (values.Status == 0) {
                        query = {
                            User_Type: 2
                        }
                    } else {
                        query = {
                            User_Type: 2,
                            Admin_Approve: values.Status
                        }
                    }

                } else {
                    console.log("hello")
                    query = {
                        $or: [{ User_Type: 1 }, { User_Type: undefined }]
                    }
                }

                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await YouTube_Links.countDocuments(query).lean().exec();
                let Result = await YouTube_Links.find(query).select('-_id -__v').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Activate_Inactivate_YouTube_Add = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    YouTubeID: values.YouTubeID
                };
                let Result = await YouTube_Links.findOne(query).lean();
                if (Result != null) {
                    let changes;
                    if (Result.Status == true) {
                        changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                    } else {
                        changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                    }
                    let updatedYouTube_Links = await YouTube_Links.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "YouTube Ad updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_YOUTUBE_LINK } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_YouTube_Add = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
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
                    YouTube_Link_Name: values.YouTube_Link_Name,
                    YouTube_Link: values.YouTube_Link,
                    Description: values.Description,
                    AreaCode_Array: values.AreaCode_Array,
                    Status: true,
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let SaveAdd = await YouTube_Links(Data).save();
                resolve({ success: true, extras: { Status: "YouTube Ad Created Successfully" } })
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Plot = values => {
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
                let Count = await Plots_Log.countDocuments().lean().exec();
                let Result = await Plots_Log.find().select('-_id -__v').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                for (let i = 0; i < Result.length; i++) {
                    Result[i].Company_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, Result[i].Company_Image_Data);
                    Result[i].FileData = await CommonController.Common_File_Response_Single_File(true, Result[i].FileData);
                    for (let j = 0; j < Result[i].Plot_Image_Data.length; j++) {
                        Result[i].Plot_Image_Data[j] = await CommonController.Common_Image_Response_Single_Image(true, Result[i].Plot_Image_Data[j]);
                    }
                }
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Activate_Inactivate_Plot = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    PlotID: values.PlotID
                };
                let Result = await Plots_Log.findOne(query).lean();
                if (Result != null) {
                    let changes;
                    if (Result.Status == true) {
                        changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                    } else {
                        changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                    }
                    let updatedplot = await Plots_Log.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "Plot updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PLOT } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_Plot = (values, All_Images_Data, File_Data, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await Plots_Log.findOne(query).lean();
                if (Result == null) {
                    let Data = {
                        PlotID: uuid.v4(),
                        SNo: values.SNo,
                        Plot_Name: values.Plot_Name,
                        Company_Name: values.Company_Name,
                        Address: values.Address,
                        Description: values.Description,
                        Plot_Image_Data: All_Images_Data,
                        Company_Image_Data: ImageData,
                        FileData: File_Data,
                        Latitude: parseFloat(values.Latitude),
                        Longitude: parseFloat(values.Longitude),
                        Point: [parseFloat(values.Longitude), parseFloat(values.Latitude)],
                        Status: true,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                    let SavePlot = await Plots_Log(Data).save();
                    resolve({ success: true, extras: { Status: "Plot Created Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Image_Data_From_ImageID_Array = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = [];
                if (values.All_ImageID_Array.length > 0) {
                    async.eachSeries(values.All_ImageID_Array, async (ImageID, callback) => {
                        try {
                            let query = {
                                ImageID: ImageID
                            };
                            let Result = await Images.findOne(query).lean();

                            if (Result == null) {
                                callback({ success: false, extras: { msg: ApiMessages.INVALID_IMAGE } })
                            } else {
                                Data.push(Result);
                                callback();
                            };
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                        resolve(Data);
                    });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.PLEASE_UPLOAD_ATLEAST_ONE_IMAGE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Check_File_Data_From_FileID = (FileID) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    FileID: FileID
                }
                let Result = await Files.findOne(query).select('-_id -__v').lean();
                if (Result == null) {
                    res.json({ success: false, extras: { msg: ApiMessages.INVALID_FILE } });
                } else {
                    resolve(Result)
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_Subscriptions_Log = values => {
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

                let Count = await Subscription_Log.countDocuments().lean().exec();
                let Result = await Subscription_Log.find().select('-_id -__v -updated_at -Status').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                async.eachSeries(Result, async (item, callback) => {
                    try {
                        console.log(item.Product_Data)
                        if (item.Product_Data != null && item.Product_Data.Product_Image_Data != null) {
                            item.Product_Data.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Product_Data.Product_Image_Data);
                        } else {
                            item.Product_Data = ""
                        }

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

AdminController.List_Subscriptions_Lite = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {

                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await Subscription.countDocuments().lean().exec();
                let Result = await Subscription.find().select('-_id SubscriptionID Subscription_Name Subscription_Amount').sort(sortOptions).lean().exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_Subscriptions = values => {
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
                let Count = await Subscription.countDocuments().lean().exec();
                let Result = await Subscription.find().select('-_id -__v -updated_at').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                // Code Adde Raj
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        console.log(item.Product_Data)
                        if (item.Product_Data != null && item.Product_Data.Product_Image_Data != null) {
                            item.Product_Data.Product_Image_Data = await CommonController.Common_Image_Response_Single_Image(true, item.Product_Data.Product_Image_Data);
                        } else {
                            item.Product_Data = ""
                        }

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

AdminController.Update_Subscriptions = (values, Prodcut_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Sub_Name = values.Subscription_Name.toUpperCase();
                let query = {
                    SubscriptionID: values.SubscriptionID,
                    Status: true
                }
                let SubscriptionResult = await Subscription.findOne(query).lean().exec();
                if (SubscriptionResult == null) {
                    reject({ success: false, extras: { msg: ApiMessages.SUBSCRIPTION_NOT_FOUND } });
                } else {
                    // let max = 0;
                    // let SubscriptionVerMax = await Subscription.find(query).lean().exec();
                    // if(SubscriptionVerMax.length == 0){
                    //     max = 0
                    // } else {
                    //     max = Math.max.apply(Math, SubscriptionVerMax.map(function(o) { return o.Current_Version; }))
                    // }
                    let queryx = {
                        SNo: values.SNo,//max + 1,                    
                    }

                    let resx = await Subscription.find(queryx).lean().exec();
                    if (resx.length != 0) {
                        if (resx[0].SNo == SubscriptionResult.SNo) {
                            let changes = {
                                $set: {
                                    SubscriptionID: SubscriptionResult.SubscriptionID,
                                    SNo: values.SNo,
                                    Subscription_Amount: values.Subscription_Amount,
                                    Subscription_Name: Sub_Name,
                                    Description: values.Description,
                                    Subscription_Type: {
                                        User_Subscription_Share: values.User_Subscription_Share,
                                        Company_Subscription_Share: values.Company_Subscription_Share,
                                        Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                        Max_Receivers: values.Max_Receivers,
                                        DF_Ref: values.DF_Ref,
                                        Max_Wallet_Limit: values.Max_Wallet_Limit,
                                        Max_Reward: values.Max_Reward,
                                        //Code Added Raj
                                        Gift_Share: values.Gift_Share,
                                        Level_One_Share: values.Level_One_Share,
                                        Level_Two_Share: values.Level_Two_Share,
                                        //
                                    },
                                    Duration: values.Duration,
                                    //Current_Version: max + 1,

                                    //code Added Raj
                                    New_Pin: values.New_Pin,
                                    Delivery_Compulsory: values.Delivery_Compulsory,
                                    Product_Data: Prodcut_Data,
                                    //
                                    updated_at: new Date()
                                },
                                $inc: {
                                    Current_Version: 1,
                                }
                            }
                            let UpsateSubscriptionVer = await Subscription.updateOne(query, changes).lean().exec();
                            let max1 = 0;
                            let SubscriptionLogSnoMax = await Subscription_Log.find().lean().exec();
                            if (SubscriptionLogSnoMax.length == 0) {
                                max1 = 0
                            } else {
                                max1 = Math.max.apply(Math, SubscriptionLogSnoMax.map(function (o) { return o.SNo; }))
                            }
                            let DataLog = {
                                Subscription_LogID: uuid.v4(),
                                SubscriptionID: SubscriptionResult.SubscriptionID,
                                SNo: max1 + 1,
                                Subscription_Amount: values.Subscription_Amount,
                                Subscription_Name: Sub_Name,
                                Description: values.Description,
                                Subscription_Type: {
                                    User_Subscription_Share: values.User_Subscription_Share,
                                    Company_Subscription_Share: values.Company_Subscription_Share,
                                    Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                    Max_Receivers: values.Max_Receivers,
                                    DF_Ref: values.DF_Ref,
                                    Max_Reward: values.Max_Reward,
                                    Max_Wallet_Limit: values.Max_Wallet_Limit,

                                    //Code Added Raj
                                    Gift_Share: values.Gift_Share,
                                    Level_One_Share: values.Level_One_Share,
                                    Level_Two_Share: values.Level_Two_Share,
                                    //
                                },
                                Duration: values.Duration,
                                Version: SubscriptionResult.Current_Version + 1,

                                //code Added Raj
                                New_Pin: values.New_Pin,
                                Delivery_Compulsory: values.Delivery_Compulsory,
                                Product_Data: Prodcut_Data,
                                //
                                created_at: new Date(),
                                updated_at: new Date()
                            };
                            let SaveResultLog = await Subscription_Log(DataLog).save();
                            resolve({ success: true, extras: { Status: "Updated Successfully" } })
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                        }
                    } else {

                        let changes = {
                            $set: {
                                SubscriptionID: SubscriptionResult.SubscriptionID,
                                SNo: values.SNo,
                                Subscription_Amount: values.Subscription_Amount,
                                Subscription_Name: Sub_Name,
                                Description: values.Description,
                                Subscription_Type: {
                                    User_Subscription_Share: values.User_Subscription_Share,
                                    Company_Subscription_Share: values.Company_Subscription_Share,
                                    Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                    Max_Receivers: values.Max_Receivers,
                                    Max_Wallet_Limit: values.Max_Wallet_Limit,
                                    DF_Ref: values.DF_Ref,
                                    Max_Reward: values.Max_Reward,

                                    //Code Added Raj
                                    Gift_Share: values.Gift_Share,
                                    Level_One_Share: values.Level_One_Share,
                                    Level_Two_Share: values.Level_Two_Share,
                                    //
                                },
                                Duration: values.Duration,
                                //Current_Version: max + 1,
                                //code Added Raj
                                New_Pin: values.New_Pin,
                                Delivery_Compulsory: values.Delivery_Compulsory,
                                Product_Data: Prodcut_Data,
                                //
                                updated_at: new Date()
                            },
                            $inc: {
                                Current_Version: 1,
                            }
                        }
                        let UpsateSubscriptionVer = await Subscription.updateOne(query, changes).lean().exec();
                        let max1 = 0;
                        let SubscriptionLogSnoMax = await Subscription_Log.find().lean().exec();
                        if (SubscriptionLogSnoMax.length == 0) {
                            max1 = 0
                        } else {
                            max1 = Math.max.apply(Math, SubscriptionLogSnoMax.map(function (o) { return o.SNo; }))
                        }
                        let DataLog = {
                            Subscription_LogID: uuid.v4(),
                            SubscriptionID: SubscriptionResult.SubscriptionID,
                            SNo: max1 + 1,
                            Subscription_Amount: values.Subscription_Amount,
                            Subscription_Name: Sub_Name,
                            Description: values.Description,
                            Subscription_Type: {
                                User_Subscription_Share: values.User_Subscription_Share,
                                Company_Subscription_Share: values.Company_Subscription_Share,
                                Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                Max_Receivers: values.Max_Receivers,
                                Max_Wallet_Limit: values.Max_Wallet_Limit,
                                DF_Ref: values.DF_Ref,
                                Max_Reward: values.Max_Reward
                            },
                            Duration: values.Duration,
                            Version: SubscriptionResult.Current_Version + 1,
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                        let SaveResultLog = await Subscription_Log(DataLog).save();
                        resolve({ success: true, extras: { Status: "Updated Successfully" } })
                    }
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_Subscriptions = (values, Prodcut_Data) => {
    console.log(values)
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Perc_100 = 0;
                if (values.New_Pin) {
                    console.log(Prodcut_Data)                    
                    Perc_100 = values.User_Subscription_Share + values.Company_Subscription_Share + values.Trimmer_Subscription_Share + values.DF_Ref + values.Gift_Share + values.Level_One_Share + values.Level_Two_Share
                } else {
                    Perc_100 = values.User_Subscription_Share + values.Company_Subscription_Share + values.Trimmer_Subscription_Share + values.DF_Ref
                }
                console.log(Perc_100, "Perc_100")
                if(Perc_100 == 100){
                    let Sub_Name = values.Subscription_Name.toUpperCase();
                    // return true;
                    // let max = 0;
                    // let SubscriptionSnoMax = await Subscription.find().lean().exec();
                    // if(SubscriptionSnoMax.length == 0){
                    //     max = 0
                    // } else {
                    //     max = Math.max.apply(Math, SubscriptionSnoMax.map(function(o) { return o.SNo; }))
                    // }
                    let query = {
                        SNo: values.SNo,//max + 1,                    
                    }
    
                    let resx = await Subscription.find(query).lean().exec();
                    if (resx.length != 0) {
                        reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                    } else {
                        let subid = uuid.v4()
                        let Data = {
                            SubscriptionID: subid,
                            SNo: values.SNo,//max + 1,
                            Subscription_Amount: values.Subscription_Amount,
                            Subscription_Name: Sub_Name,
                            Description: values.Description,
                            Subscription_Type: {
                                User_Subscription_Share: values.User_Subscription_Share,
                                Company_Subscription_Share: values.Company_Subscription_Share,
                                Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                Max_Receivers: values.Max_Receivers,
                                Max_Wallet_Limit: values.Max_Wallet_Limit,
                                DF_Ref: values.DF_Ref,
                                Max_Reward: values.Max_Reward,
                                //Code Added Raj
                                Gift_Share: values.Gift_Share,
                                Level_One_Share: values.Level_One_Share,
                                Level_Two_Share: values.Level_Two_Share,
                                //
                            },
                            Duration: values.Duration,
                            Current_Version: 1,
                            //code Added Raj
                            New_Pin: values.New_Pin,
                            Delivery_Compulsory: values.Delivery_Compulsory,
                            Product_Data: Prodcut_Data,
                            //
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                        let max1 = 0;
                        let SubscriptionLogSnoMax = await Subscription_Log.find().lean().exec();
                        if (SubscriptionLogSnoMax.length == 0) {
                            max1 = 0
                        } else {
                            max1 = Math.max.apply(Math, SubscriptionLogSnoMax.map(function (o) { return o.SNo; }))
                        }
                        let DataLog = {
                            Subscription_LogID: uuid.v4(),
                            SubscriptionID: subid,
                            SNo: max1 + 1,
                            Subscription_Amount: values.Subscription_Amount,
                            Subscription_Name: Sub_Name,
                            Description: values.Description,
                            Subscription_Type: {
                                User_Subscription_Share: values.User_Subscription_Share,
                                Company_Subscription_Share: values.Company_Subscription_Share,
                                Trimmer_Subscription_Share: values.Trimmer_Subscription_Share,
                                Max_Receivers: values.Max_Receivers,
                                Max_Wallet_Limit: values.Max_Wallet_Limit,
                                DF_Ref: values.DF_Ref,
                                Max_Reward: values.Max_Reward,
    
                                //Code Added Raj
    
                                Gift_Share: values.Gift_Share,
                                Level_One_Share: values.Level_One_Share,
                                Level_Two_Share: values.Level_Two_Share,
                                //
                            },
                            Duration: values.Duration,
                            Version: 1,
    
                            //code Added Raj
                            New_Pin: values.New_Pin,
                            Delivery_Compulsory: values.Delivery_Compulsory,
                            Product_Data: Prodcut_Data,
    
                            // $push: {
                            //     Product_Logs: values.Product_Details,
                            // },
                            //
                            created_at: new Date(),
                            updated_at: new Date()
                        };
                        let SaveResult = await Subscription(Data).save();
                        let SaveResultLog = await Subscription_Log(DataLog).save();
                        resolve({ success: true, extras: { Status: "Created Successfully" } })
                    }
                } else {
                    reject({ success: false, extras: { msg: "Total Subscrption Share Percentage Must Be 100" } })
                }
               
               
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_App_Image_Resource = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    ResourceID: values.ResourceID,
                }
                let ResourceData = await App_Image_Resources.findOne(query).lean().exec();
                if (ResourceData != null) {
                    let queryx = {
                        SNo: values.SNo,
                    }
                    let ResourceData1 = await App_Image_Resources.find(queryx).lean().exec();
                    if (ResourceData1.length != 0) {
                        if (ResourceData1[0].SNo == ResourceData.SNo) {
                            let changes = {
                                $set: {
                                    ImageData: ImageData,
                                    SNo: ResourceData.SNo,
                                    Status: true,
                                    updated_at: new Date()
                                }
                            }
                            let Updatedate = await App_Image_Resources.updateOne(query, changes).lean();
                            resolve({ success: true, extras: { Status: "Updated Successfully" } });
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                        }
                    } else {
                        let changes = {
                            $set: {
                                ImageData: ImageData,
                                SNo: values.SNo,
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                        let Updatedate = await App_Image_Resources.updateOne(query, changes).lean();
                        resolve({ success: true, extras: { Status: "Updated Successfully" } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_RESOURCE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_App_Image_Resource = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let ResourceType = parseInt(values.ResourceType);
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    SNo: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let query = {
                    ResourceType: ResourceType,
                    Status: true
                };
                let Count = await App_Image_Resources.countDocuments(query).lean().exec();
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
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_App_Image_Resource = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await App_Image_Resources.findOne(query).lean();
                if (Result == null) {
                    let ResourceType = parseInt(values.ResourceType);
                    let Data = {
                        ResourceID: uuid.v4(),
                        ResourceType: ResourceType,
                        ImageData: ImageData,
                        SNo: values.SNo,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                    let SaveResult = await App_Image_Resources(Data).save();
                    resolve({ success: true, extras: { Status: "Image Added Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_App_Image_Resource_Validate_All = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await App_Image_Resources.findOne(query).lean();
                if (Result == null) {
                    let ResourceType = parseInt(values.ResourceType);
                    if (ResourceType == 1 || ResourceType == 2 || ResourceType == 3) {
                        let Evaluate_Count = (ResourceType == 1) ? config.SMALL_BANNERS_LIMIT : (ResourceType == 2) ? config.SMALL_ICONS_LIMIT : config.BIG_BANNERS_LIMIT;
                        let query = {
                            ResourceType: ResourceType,
                            Status: true
                        };
                        let Count = await App_Image_Resources.countDocuments(query).lean().exec();
                        if (Count < Evaluate_Count) {
                            resolve("Validated Successfully")
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.MAXIMUM_IMAGES_EXCEEDED } })
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_RESOURCE_TYPE } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Update_News = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    NewsID: values.NewsID
                };
                let ResourceData = await News.findOne(query).lean().exec();
                if (ResourceData != null) {
                    let queryx = {
                        SNo: values.SNo,
                    }
                    let ResourceData1 = await News.find(queryx).lean().exec();
                    if (ResourceData1.length != 0) {
                        if (ResourceData1[0].SNo == ResourceData.SNo) {
                            let changes = {
                                $set: {
                                    Title: values.Title,
                                    SNo: ResourceData.SNo,
                                    Description: values.Description,
                                    updated_at: new Date()
                                }
                            };
                            let UpdatedStatus = await News.updateOne(query, changes).lean();
                            resolve({ success: true, extras: { Status: "Updated Successfully" } })
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                        }
                    } else {
                        let changes = {
                            $set: {
                                Title: values.Title,
                                SNo: values.SNo,
                                Description: values.Description,
                                updated_at: new Date()
                            }
                        }
                        let Updatedate = await News.updateOne(query, changes).lean();
                        resolve({ success: true, extras: { Status: "Updated Successfully" } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_NEWS } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Update_News_Validate_All = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (values.Title.length <= config.News_Title_Length) {
                    if (values.Description.length <= config.News_Description_Length) {
                        resolve("Validated Successfully");
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.NEWS_TITLE_CHARACTERS_EXCEEDED } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.NEWS_TITLE_CHARACTERS_EXCEEDED } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_News = values => {
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
                    Status: true
                };
                let Count = await News.countDocuments(query).lean().exec();
                let Result = await News.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_News = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await News.findOne(query).lean();
                if (Result == null) {
                    let Data = {
                        NewsID: uuid.v4(),
                        Title: values.Title,
                        SNo: values.SNo,
                        Description: values.Description,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                    let SaveResult = await News(Data).save();
                    resolve({ success: true, extras: { Status: "News Added Successfully" } });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_News_Validate_All = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await News.findOne(query).lean();
                if (Result == null) {
                    let Count = await News.countDocuments({ Status: true }).lean();
                    if (Count < config.NEWS_LIMIT) {
                        if (values.Title.length <= config.News_Title_Length) {
                            if (values.Description.length <= config.News_Description_Length) {
                                resolve("Validated Successfully");
                            } else {
                                reject({ success: false, extras: { msg: ApiMessages.NEWS_TITLE_CHARACTERS_EXCEEDED } })
                            }
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.NEWS_TITLE_CHARACTERS_EXCEEDED } })
                        }
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.NEWS_LIMIT_EXCEEDED } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Update_App_Version_Settings = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let fndupdquery = {

                };
                let fndupdchanges = {
                    $set: {
                        Android_Version: values.Android_Version,
                        IOS_Version: values.IOS_Version
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let Data = await App_Versions_Settings.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve({ success: true, extras: { Status: "Updated Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Fetch_App_Version_Settings = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let fndupdquery = {

                };
                let fndupdchanges = {

                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let Data = await App_Versions_Settings.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve({ success: true, extras: { Data: Data } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


AdminController.Add_Guideline_Image = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    GuideLineID: values.GuideLineID
                };
                let changes = {
                    $set: {
                        updated_at: new Date()
                    },
                    $push: {
                        All_Images_Data: ImageData
                    }
                };
                let UpdatedStatus = await GuideLines.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Added Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Remove_Guideline_Image = (values, ImageData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    GuideLineID: values.GuideLineID
                };
                let changes = {
                    $set: {
                        updated_at: new Date()
                    },
                    $pull: {
                        All_Images_Data: {
                            ImageID: values.ImageID
                        }
                    }
                };
                let UpdatedStatus = await GuideLines.updateOne(query, changes).lean();
                resolve({ success: true, extras: { Status: "Removed Successfully" } });
                let RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image50);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image100);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image250);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image550);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.Image900);
                RemoveStatus = await AWSController.DeleteAWSImage(ImageData.ImageOriginal);
                let DeletedStatus = await Images.deleteOne({ ImageID: values.ImageID }).lean();
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_Guideline_Details = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    GuideLineID: values.GuideLineID
                };
                let ResourceData = await GuideLines.findOne(query).lean().exec();
                if (ResourceData != null) {
                    let queryx = {
                        SNo: values.SNo,
                    }
                    let ResourceData1 = await GuideLines.find(queryx).lean().exec();
                    if (ResourceData1.length != 0) {
                        if (ResourceData1[0].SNo == ResourceData.SNo) {
                            let changes = {
                                $set: {
                                    Title: values.Title,
                                    SNo: ResourceData.SNo,
                                    Description: values.Description
                                }
                            };
                            let UpdatedStatus = await GuideLines.updateOne(query, changes).lean();
                            resolve({ success: true, extras: { Status: "Updated Successfully" } })
                        } else {
                            reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                        }
                    } else {
                        let changes = {
                            $set: {
                                Title: values.Title,
                                SNo: values.SNo,
                                Description: values.Description
                            }
                        };
                        let UpdatedStatus = await GuideLines.updateOne(query, changes).lean();
                        resolve({ success: true, extras: { Status: "Updated Successfully" } })
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_GUIDELINE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Guidelines = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
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
                let Count = await GuideLines.countDocuments(query).lean().exec();
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
                    resolve({ success: true, extras: { Count: Count, Data: Result } });
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_Guideline = (values, All_Images_Data) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: values.SNo,
                    Status: true
                }
                let Result = await GuideLines.findOne(query).lean();
                if (Result == null) {
                    let Data = {
                        GuideLineID: uuid.v4(),
                        Title: values.Title,
                        SNo: values.SNo,
                        Description: values.Description,
                        All_Images_Data: All_Images_Data,
                        created_at: new Date(),
                        updated_at: new Date()
                    };
                    let SaveResult = await GuideLines(Data).save();
                    resolve({ success: true, extras: { Status: "Guideline Added Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_Guideline_Validate_All_Params = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = [];
                if (values.All_ImageID_Array.length > 0) {
                    async.eachSeries(values.All_ImageID_Array, async (ImageID, callback) => {
                        try {
                            let Result = await Images.findOne({ ImageID: ImageID }).lean();
                            if (Result == null) {
                                callback({ success: false, extras: { msg: ApiMessages.INVALID_IMAGE } })
                            } else {
                                Data.push(Result);
                                callback();
                            };
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                        resolve(Data);
                    });
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.PLEASE_UPLOAD_ATLEAST_ONE_IMAGE } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_User_Phone_Number_Validate_Registration_Date = (values, UserData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                var now = moment();
                var User_Account_Registered_Date = moment(UserData.User_Account_Registered_Date);
                let diff = Math.abs(now.diff(User_Account_Registered_Date, "hours"));
                if (diff < config.MAX_HOURS_FOR_EDITING_PHONE_NUMBER) {
                    resolve("Validated Successfully")
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.YOU_CAN_EDIT_ONLY_NEW_USER } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Users_with_Filters_Validate_Statuses = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (Boolify(values.Whether_Status_Filter)) {
                    if (values.Status_Array != null && values.Status_Array != undefined && values.Status_Array.length > 0) {
                        async.eachSeries(values.Status_Array, async (User_Account_Status, callback) => {
                            try {
                                if (User_Account_Status == 1 || User_Account_Status == 2 || User_Account_Status == 3 || User_Account_Status == 4 || User_Account_Status == 5 || User_Account_Status == 6 || User_Account_Status == 7) {
                                    callback();
                                } else {
                                    callback({ success: false, extras: { msg: ApiMessages.INVALID_STATUS } })
                                }
                            } catch (error) {
                                callback(error);
                            }
                        }, async (err) => {
                            if (err) reject(err);
                            resolve("Validated Successfully");
                        });
                    } else {
                        reject({ success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } })
                    }
                } else {
                    resolve("Validated Successfully")
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Users_with_Filters = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Whether_Company_Account: false,
                    Status: true,
                    User_Account_Registered_Date: {
                        $ne: null
                    },
                    User_Account_Status: {
                        $in: [1, 2, 3, 4, 5, 6]
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Name: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.User_Account_Registered_Date = time_options
                };
                if (Boolify(values.Whether_Status_Filter)) {
                    query.User_Account_Status = values.Status_Array;
                };
                let Count = await Users.countDocuments(query).lean().exec();
                let Result = await Users.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_User_Phone_Number = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let changes = {
                    $set: {
                        PhoneNumber: values.PhoneNumber
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

AdminController.Edit_User_Name = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: values.USERID
                };
                let changes = {
                    $set: {
                        Name: values.Name
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

AdminController.Edit_User_Phone_Number_Validate_Phone_Number_Already_Exist = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: {
                        $ne: values.USERID
                    },
                    PhoneNumber: values.PhoneNumber
                };
                let Result = await Users.findOne(query).lean();
                if (Result == null) {
                    resolve("Validated Successfully")
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.PHONE_NUMBER_ALREADY_REGISTERED } })
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}



AdminController.List_All_Trimmer_Distribution_Yellow_Green_Royalty_Share_By_Date = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Start_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').toDate();
                let End_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').add(1, 'day').subtract(1, 'ms').toDate();
                let time_options = {
                    $gte: Start_Date,
                    $lte: End_Date
                };
                let query = {
                    Type: {
                        $in: [8]
                    },
                    Time: time_options
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await User_Wallet_Logs.countDocuments(query).lean().exec();
                let Result = await User_Wallet_Logs.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').skip(toSkip).limit(toLimit).sort({ created_at: 1 }).lean().exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        let UserData = await CommonController.Check_Only_User(item);
                        item = await Object.assign(item, UserData);
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

AdminController.List_All_Trimmer_Distribution_Yellow_Blue_Trimming_Share_By_Date = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Start_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').toDate();
                let End_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').add(1, 'day').subtract(1, 'ms').toDate();
                let time_options = {
                    $gte: Start_Date,
                    $lte: End_Date
                };
                let query = {
                    Type: {
                        $in: [5]
                    },
                    Time: time_options
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await User_Wallet_Logs.countDocuments(query).lean().exec();
                let Result = await User_Wallet_Logs.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort({ created_at: 1 }).skip(toSkip).limit(toLimit).lean().exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        let UserData = await CommonController.Check_Only_User(item);
                        item = await Object.assign(item, UserData);
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

AdminController.List_All_Trimmer_Distribution_Company_Account_By_Date = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Start_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').toDate();
                let End_Date = moment(values.Date, config.Take_Date_Format).subtract(330, 'minute').add(1, 'day').subtract(1, 'ms').toDate();
                let time_options = {
                    $gte: Start_Date,
                    $lte: End_Date
                };
                let query = {
                    Whether_Company_Account: true,
                    User_Account_Registered_Date: time_options
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await Users.countDocuments(query).lean().exec();
                let Result = await Users.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort({ created_at: 1 }).skip(toSkip).limit(toLimit).lean().exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Trimmer_Distribution_Logs_By_Date = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = await CommonController.Common_Last_Day_Start_Date(values.Date);
                let Trimmer_DateID = date.toISOString();
                let fndupdquery = {
                    Date: date
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        Trimmer_DateID: Trimmer_DateID
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let query = {
                    Trimmer_DateID: TrimmerDistributionData.Trimmer_DateID
                };
                let Result = await Trimmer_Distribution_Logs.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort({ Date: -1 }).lean().exec();
                resolve({ success: true, extras: { TrimmerDistributionData: TrimmerDistributionData, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_all_Total_Trimmer_Distributions = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Trimmer_Amount: {
                        $gt: 0
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Date: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).subtract(1, 'day').toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.Date = time_options
                };
                let Count = await Trimmer_Distribution.countDocuments(query).lean().exec();
                let Result = await Trimmer_Distribution.find(query).select("-_id -__v").sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        item.DistributionData = await Trimmer_Distribution_Logs.find({ Trimmer_DateID: item.Trimmer_DateID }).sort({ Type: 1 }).select("-_id -__v").lean();
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

AdminController.List_All_User_Purchase_Pins = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Pins.countDocuments(query).lean().exec();
                let Result = await User_Pins.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Bank_Transfers = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {

                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Bank_Transfers.countDocuments(query).lean().exec();
                let Result = await User_Bank_Transfers.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        let UserData = await CommonController.Check_Only_User(item);
                        item = await Object.assign(item, UserData);
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

AdminController.List_All_User_Bank_Transfers = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Bank_Transfers.countDocuments(query).lean().exec();
                let Result = await User_Bank_Transfers.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
AdminController.List_All_User_Failed_Recharges = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Failed_Recharges.countDocuments(query).lean().exec();
                let Result = await User_Failed_Recharges.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
AdminController.List_All_User_Recharges = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Recharges.countDocuments(query).lean().exec();
                let Result = await User_Recharges.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_User_Bank_Beneficiary_Accounts = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Bank_Beneficiary_Accounts.countDocuments(query).lean().exec();
                let Result = await User_Bank_Beneficiary_Accounts.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_User_Friend_Transfers = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Friend_Money_Requests.countDocuments(query).lean().exec();
                let Result = await User_Friend_Money_Requests.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Recharges = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {

                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Recharges.countDocuments(query).lean().exec();
                let Result = await User_Recharges.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        let UserData = await CommonController.Check_Only_User(item);
                        item = await Object.assign(item, UserData);
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

AdminController.List_All_Failed_Recharges = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {

                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    created_at: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.created_at = time_options
                };
                let Count = await User_Failed_Recharges.countDocuments(query).lean().exec();
                let Result = await User_Failed_Recharges.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                async.eachSeries(Result, async (item, callback) => {
                    try {
                        let UserData = await CommonController.Check_Only_User(item);
                        item = await Object.assign(item, UserData);
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

AdminController.List_All_Trimmer_Wallet_Logs = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Amount: {
                        $gt: 0
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Time: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.Time = time_options
                };
                let fndupdquery = {

                };
                let fndupdchanges = {

                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TrimmerData = await Trimmer_Wallet.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Count = await Trimmer_Wallet_Logs.countDocuments(query).lean().exec();
                let Result = await Trimmer_Wallet_Logs.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, TrimmerData: TrimmerData, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Company_Wallet_Logs = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Amount: {
                        $gt: 0
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Time: -1
                };
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.Time = time_options
                };
                let fndupdquery = {

                };
                let fndupdchanges = {

                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let CompanyData = await Company_Wallet.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Count = await Company_Wallet_Logs.countDocuments(query).lean().exec();
                let Result = await Company_Wallet_Logs.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, CompanyData: CompanyData, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_User_Wallet_Logs = (values) => {
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
                if (Boolify(values.Whether_Date_Filter)) {
                    let Start_Date = moment(values.Start_Date, config.Take_Date_Format).toDate();
                    let End_Date = moment(values.End_Date, config.Take_Date_Format).add(1, 'day').subtract(1, 'ms').toDate();
                    let time_options = {
                        $gte: Start_Date,
                        $lte: End_Date
                    };
                    query.Time = time_options
                };
                let Count = await User_Wallet_Logs.countDocuments(query).lean().exec();
                let Result = await User_Wallet_Logs.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.User_Network_Heirarchy_Validate_Network_USERID = values => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let dResult = await Users_Network.findOne({}).lean();
                if (dResult == null) {
                    reject({ success: true, extras: { isHeirarchy: false, ParentData: new Object(), ChildData: [] } });
                } else {
                    let netquery = {

                    };
                    if (values.Network_USERID == null || values.Network_USERID == "" || values.Network_USERID == undefined) {
                        let RootData = await Users_Network.findOne({ Parent_USERID: 'root' }).lean();
                        netquery.USERID = (RootData == null) ? '' : RootData.USERID;
                    } else {
                        netquery.USERID = values.Network_USERID;
                    }
                    let Result = await Users.findOne(netquery).lean();
                    if (Result == null) {
                        reject({ success: false, extras: { msg: ApiMessages.INVALID_NETWORK_USER } })
                    } else {
                        resolve(Result);
                    };
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Search_All_Users_By_Phone_Number = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let SearchValue = String(values.SearchValue)
                let query = {
                    Whether_Company_Account: false,
                    Status: true,
                    PhoneNumber: { $regex: SearchValue, $options: "i" },
                    User_Account_Registered_Date: {
                        $ne: null
                    }
                };
                let sortOptions = {
                    PhoneNumber: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await Users.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().limit(10).exec();
                resolve({ success: true, extras: { Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Search_All_Users_By_Name = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let SearchValue = String(values.SearchValue)
                let query = {
                    Whether_Company_Account: false,
                    Status: true,
                    Name: { $regex: SearchValue, $options: "i" },
                    User_Account_Registered_Date: {
                        $ne: null
                    }
                };
                let sortOptions = {
                    Name: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Result = await Users.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().limit(10).exec();
                resolve({ success: true, extras: { Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Users = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Whether_Company_Account: false,
                    Status: true,
                    User_Account_Registered_Date: {
                        $ne: null
                    }
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Name: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await Users.countDocuments(query).lean().exec();
                let Result = await Users.find(query).select('-_id -__v -updated_at -USER_SESSIONS -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Check_Whether_Admin_Email_Registered = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    EmailID: values.EmailID
                };
                let Result = await Admins.findOne(query).lean();
                if (Result == null) {
                    reject({ success: false, extras: { msg: ApiMessages.EMAIL_NOT_REGISTERED } })
                } else {
                    resolve(Result);
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}
AdminController.Check_Whether_Admin_Email_Already_Exist = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    EmailID: values.EmailID,
                    Status: true
                };
                let Result = await Admins.findOne(query).lean();
                if (Result == null) {
                    resolve("Validated Successfully");
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.EMAIL_ALREADY_REGISTERED } })
                };
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Update_Password = (values, AdminData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Old_Password = String(values.Old_Password);
                let New_Password = String(values.New_Password);
                let PasswordSalt = AdminData.PasswordSalt;
                let oldpass = Old_Password + PasswordSalt;
                let newpass = New_Password + PasswordSalt;
                let OldPasswordHash = crypto.createHash('sha512').update(oldpass).digest("hex");
                let NewPasswordHash = crypto.createHash('sha512').update(newpass).digest("hex");
                if (AdminData.PasswordHash == OldPasswordHash) {
                    if (OldPasswordHash === NewPasswordHash) {
                        reject({ success: false, extras: { msg: ApiMessages.OLD_PASSWORD_AND_NEW_PASSWORD_MUST_BE_DIFFERENT } })
                    } else {
                        let fndupdquery = {
                            AdminID: AdminData.AdminID
                        };
                        let fndupdchanges = {
                            $set: {
                                PasswordHash: NewPasswordHash,
                                updated_at: new Date()
                            }
                        };
                        let fndupdoptions = {
                            upsert: true,
                            setDefaultsOnInsert: true,
                            new: true
                        }
                        AdminData = await Admins.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v -PasswordHash -PasswordSalt -Status -updated_at').lean();
                        resolve({ success: true, extras: { Status: "Password Updated Successfully" } });
                    }
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_OLD_PASSWORD } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_All_Admin_User = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Whether_God: false,
                    Status: true
                };
                let toSkip = parseInt(values.skip);
                let toLimit = parseInt(values.limit);
                let sortOptions = {
                    Name: 1
                };
                if (values.sortOptions != null && Object.keys(values.sortOptions).length > 0) {
                    sortOptions = values.sortOptions;
                };
                let Count = await Admins.countDocuments(query).lean().exec();
                let Result = await Admins.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();
                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Create_Admin_User = (values, AdminData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.Password);
                let PasswordSalt = await CommonController.Random_OTP_Number();
                let pass = Password + PasswordSalt;
                let Data = {
                    AdminID: uuid.v4(),
                    Name: values.Name,
                    EmailID: values.EmailID,
                    PasswordHash: crypto.createHash('sha512').update(pass).digest("hex"),
                    PasswordSalt: PasswordSalt,
                    Permissions: { Admin_Section_Permision: Boolify(values.Admin_Section_Permision) },
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let SaveResult = await Admins(Data).save();
                resolve({ success: true, extras: { Status: "Admin Created Successfully" } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Login = (values, AdminData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Password = String(values.Password);
                let PasswordSalt = AdminData.PasswordSalt;
                let pass = Password + PasswordSalt;
                let PasswordHash = crypto.createHash('sha512').update(pass).digest("hex");
                if (AdminData.PasswordHash == PasswordHash) {
                    let fndupdquery = {
                        AdminID: AdminData.AdminID
                    };
                    let fndupdchanges = {
                        $set: {
                            SessionID: uuid.v4(),
                            updated_at: new Date()
                        }
                    };
                    let fndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    AdminData = await Admins.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v -PasswordHash -PasswordSalt -Status -updated_at').lean();
                    resolve({ success: true, extras: { Status: "Login Successfully", AdminData: AdminData } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_PASSWORD } })
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.List_States = values => {
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

                let Status = true
                if (values.Status == 1) {
                    Status = true
                } else if (values.Status == 2) {
                    Status = false
                }
                let query = {
                    Status: Status
                };


                let Count = await States.countDocuments(query).lean().exec();
                let Result = await States.find(query).select('-_id -__v -updated_at -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').sort(sortOptions).lean().skip(toSkip).limit(toLimit).exec();

                resolve({ success: true, extras: { Count: Count, Data: Result } });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Edit_State = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    StateID: values.StateID
                };
                let Result = await States.findOne(query).lean();
                if (Result != null) {
                    let changes = {
                        $set: {
                            SNo: values.SNo,
                            State_Name: values.State_Name,
                            updated_at: new Date(),
                        }
                    };
                    let Update = await States.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "State Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: "State Not Available" } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Add_State = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                // console.log(values)

                let Data = {
                    StateID: uuid.v4(),
                    SNo: values.SNo,
                    State_Name: values.State_Name,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                let Result = await States(Data).save();
                resolve({ success: true, extras: { Status: "State Created Successfully" } });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Activate_Inactivate_State = (values) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    StateID: values.StateID
                };
                let Result = await States.findOne(query).lean();
                if (Result != null) {
                    let changes;
                    if (Result.Status == true) {
                        changes = {
                            $set: {
                                Status: false,
                                updated_at: new Date()
                            }
                        }
                    } else {
                        changes = {
                            $set: {
                                Status: true,
                                updated_at: new Date()
                            }
                        }
                    }
                    let update_States_Link = await States.updateOne(query, changes).lean();
                    resolve({ success: true, extras: { Status: "State Updated Successfully" } })
                } else {
                    reject({ success: false, extras: { msg: ApiMessages.INVALID_STATE } })
                }

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

AdminController.Check_For_State_SNo_Available = (values) => {
    return new Promise(async (resolve, reject) => {
        try {
            let SNo = parseInt(values.SNo);
            if (values.StateID === null || values.StateID === undefined || values.StateID === "") {
                values.StateID = "";
            };
            let query = {
                StateID: {
                    $ne: values.StateID
                },
                SNo: SNo
            };
            let Result = await States.findOne(query).lean().exec();
            if (Result === null) {
                resolve('SNo Available');
            } else {
                reject({ success: false, extras: { msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST } })
                // msg: ApiMessages.SERIAL_NUMBER_ALREADY_EXIST
            }
        } catch (error) {
            reject(await CommonController.Common_Error_Handler(error));
        }
    });
}

export default AdminController;