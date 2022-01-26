let CronController = function () { };
import uuid from "uuid";
import cron from "cron";
import ApiMessages from "../config/ApiMessages";
import CommonController from "./CommonController";
import Counters from "../models/Counters";
import async from "async";
import { isBoolean, Boolify } from "node-boolify";
import moment from "moment";
import config from "../config/config";
import axios from "axios";
import Users from "../models/Users";
import Users_Referrals from "../models/Users_Referrals";
import Trimmer_Wallet_Logs from "../models/Trimmer_Wallet_Logs";
import Trimmer_Wallet from "../models/Trimmer_Wallet";
import User_Wallet_Logs from "../models/User_Wallet_Logs";
import COMMON_SYSTEM_MESSAGES from "../config/COMMON_SYSTEM_MESSAGES";
import UserController from "./UserController";
import Company_Wallet_Logs from "../models/Company_Wallet_Logs";
import Company_Wallet from "../models/Company_Wallet";
import RechargeDaddyController from "./RechargeDaddyController";
import User_Recharges from "../models/User_Recharges";
import Trimmer_Distribution from "../models/Trimmer_Distribution";
import Trimmer_Distribution_Logs from "../models/Trimmer_Distribution_Logs";
import User_Bank_Transfers from "../models/User_Bank_Transfers";
import RazorpayController from "./RazorpayController";
import Subscription from "../models/Subscription";
import Day_Pins_Log from "../models/Day_Pins_Log";

CronController.Pending_Bank_Transfer_Update_Statuses = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Status: true,
                    Transaction_Status: {
                        $in: [1, 3, 4, 6]
                    }
                };
                let All_Transaction_Data = await User_Bank_Transfers.find(query).lean();
                async.eachSeries(All_Transaction_Data, async (item, callback) => {
                    try {
                        let PayoutData = await RazorpayController.Razorpay_Fetch_Payout_Current_Information(item.RazorpayX_TransactionID);
                        let UpdateStatus = await UserController.Common_Razorpay_Update_Statues(PayoutData);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Processing Completed Successfully")
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Pending_Recharge_Update_Statuses = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    Status: true,
                    TransactionStatus: {
                        $in: [0, 4, 6]
                    }
                };
                let All_Recharges_Data = await User_Recharges.find(query).select('-_id -__v -updated_at -Status -Point -Geometry -Delivery_Pricings -PasswordHash -PasswordSalt -SessionID').lean().exec();
                async.eachSeries(All_Recharges_Data, async (RechargeData, callback) => {
                    try {
                        let PostRechargeData = await RechargeDaddyController.Check_Recharge_Status(RechargeData);
                        let ProcessingStatus = await CronController.Pending_Recharge_Update_Statuses_Complete_Processing(RechargeData, PostRechargeData);
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Processing Completed Successfully")
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Pending_Recharge_Update_Statuses_Complete_Processing = (RechargeData, PostRechargeData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (RechargeData.TransactionStatus == 0 || RechargeData.TransactionStatus == 4 || RechargeData.TransactionStatus == 6) {
                    //Amount Already Refunded
                    let TransactionStatus = 0;
                    let ClientStatus = parseInt(PostRechargeData.TRNSTATUS);
                    if (ClientStatus == 2 || ClientStatus == 3 || ClientStatus == 5) {
                        TransactionStatus = 5;//Refunded
                    } else {
                        TransactionStatus = ClientStatus;
                    }
                    let query = {
                        RechargeTransactionID: RechargeData.RechargeTransactionID
                    };
                    let changes = {
                        $set: {
                            TransactionStatus: TransactionStatus,
                            TransactionStatusDescription: (TransactionStatus == 5) ? "Refunded" : PostRechargeData.TRNSTATUSDESC,
                            OPRID: PostRechargeData.OPRID,
                            updated_at: new Date()
                        }
                    };
                    let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
                    resolve("Processed Successfully");
                    if (TransactionStatus == 5) {
                        let Amount = RechargeData.Amount;
                        let LData = {
                            LogID: uuid.v4(),
                            USERID: RechargeData.USERID,
                            Type: 15,
                            Amount: Amount,
                            Data: {
                                Amount: Amount,
                                RechargeData: RechargeData
                            },
                            Time: new Date()
                        };
                        let LSaveResult = await User_Wallet_Logs(LData).save();
                        let Rquery = {
                            USERID: RechargeData.USERID
                        };
                        let Rchanges = {
                            $set: {
                                updated_at: new Date()
                            },
                            $inc: {
                                "User_Amounts.Available_Amount": Amount,
                                "User_Amounts.Total_Amount": Amount
                            }
                        };
                        let RupdatedStatus = await Users.updateOne(Rquery, Rchanges).lean();
                    }
                } else if (RechargeData.TransactionStatus == 1) {
                    //Amount Already Refunded
                    let query = {
                        RechargeTransactionID: RechargeData.RechargeTransactionID
                    };
                    let changes = {
                        $set: {
                            TransactionStatusDescription: PostRechargeData.TRNSTATUSDESC,
                            OPRID: PostRechargeData.OPRID,
                            updated_at: new Date()
                        }
                    };
                    let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
                    resolve("Processed Successfully");
                } else if (RechargeData.TransactionStatus == 5) {
                    //Amount Already Refunded
                    let query = {
                        RechargeTransactionID: RechargeData.RechargeTransactionID
                    };
                    let changes = {
                        $set: {
                            OPRID: PostRechargeData.OPRID,
                            updated_at: new Date()
                        }
                    };
                    let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
                    resolve("Processed Successfully");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution = () => {
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
                };
                let TrimmerWalletData = await Trimmer_Wallet.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Trimmer_Available_Amount = TrimmerWalletData.Available_Amount;
                if (Trimmer_Available_Amount > 0) {
                    let query = {
                        SNo: 1
                    }
                    let SubResult = await Subscription.findOne(query).lean();
                    //console.log('1 ==>' + SubResult)
                    let DistributionProcessing = await CronController.Trimming_Amount_Distribution_Date_Distribution(Trimmer_Available_Amount);
                    //console.log('2 ==>' )
                    let Company_Accounts_Amount = parseFloat((Trimmer_Available_Amount * config.Trimmer_Company_Accounts_Share_Distribution) / 100); //45%
                    //console.log('3 ==>' + Company_Accounts_Amount)
                    //let Yellow_Blue_Status_Amount = parseFloat((Trimmer_Available_Amount * config.Trimmer_Yellow_Blue_Share_Distribution) / 100);
                    //let Yellow_Green_Royalty_Amount = parseFloat((Trimmer_Available_Amount * config.Trimmer_Yellow_Green_Share_Distribution) / 100);
                    let Company_Distribution_Amount = parseFloat((Trimmer_Available_Amount * config.Trimmer_Company_Share_Distribution) / 100); //10%
                    //console.log('4 ==>' + Company_Distribution_Amount)
                    let Day_Share_Distribution_Amount = parseFloat((Trimmer_Available_Amount * config.Day_Share_Distribution) / 100); //45%
                    //console.log('5 ==>' + Day_Share_Distribution_Amount)
                    //console.log(parseFloat(SubResult.Subscription_Amount));
                    //console.log(SubResult);
                    let remainder_amount = (Company_Accounts_Amount % parseFloat(SubResult.Subscription_Amount));
                    //console.log(Trimmer_Available_Amount);
                    //console.log('6 ==>' + remainder_amount);
                    Trimmer_Available_Amount -= remainder_amount;
                    //console.log('7 ==>' + Trimmer_Available_Amount);
                    Company_Accounts_Amount -= remainder_amount;
                    //console.log('8 ==>' + Company_Accounts_Amount);

                    let No_of_Company_Account = parseInt(Company_Accounts_Amount / SubResult.Subscription_Amount);
                    //console.log('9 ==>' + No_of_Company_Account);                    

                    let TrimmerLogProcessing = await CronController.Trimming_Amount_Distribution_Trimmer_Distribution_Deduction_Processing(Trimmer_Available_Amount);
                    //console.log('10 ==>' + TrimmerLogProcessing);                    

                    let CompanyAccountProcessing = await CronController.Trimming_Amount_Distribution_Company_Account_Processing(No_of_Company_Account);
                    //console.log('11 ==>' + CompanyAccountProcessing);                    

                    let CompanyProcessing = await CronController.Trimming_Amount_Distribution_Company_Credit_Processing(Company_Distribution_Amount);
                    //console.log('12 ==>' + CompanyProcessing);                    

                    let DayUserTrimmingAmountProcessing = await CronController.Trimming_Amount_Distribution_User_Account_Processing(Day_Share_Distribution_Amount);
                    //console.log('13 ==>' + DayUserTrimmingAmountProcessing);                    

                    //let YellowBlueStatusProcessing = await CronController.Trimming_Amount_Distribution_Yellow_Blue(Yellow_Blue_Status_Amount);
                    //let YellowGreenRoyalProcessing = await CronController.Yellow_Green_Account_Trimmer_Royalty_Share_Distribution(Yellow_Green_Royalty_Amount);
                    resolve("Completed Processing Completed");

                } else {
                    resolve("Completed Processing Completed");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_User_Account_Processing = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let queryQ = {
                    Status: true,
                    Whether_Company_Account: false,
                    Whether_Subscribed: true,
                    No_of_Referrals: { $gte: 10 }
                }
                let queryNQ = {
                    Status: true,
                    Whether_Company_Account: false,
                    Whether_Subscribed: true,
                    No_of_Referrals: { $lt: 10 }
                }
                let QualifiedUsers = await Users_Referrals.find(queryQ).select('-_id USERID').lean();
                let NonQualifiedUsers = await Users_Referrals.find(queryNQ).select('-_id USERID').lean();
                let Total_QualifiedUsers = QualifiedUsers.length;
                let Total_NonQualifiedUsers = NonQualifiedUsers.length;
                let Total_Users = Total_NonQualifiedUsers + Total_QualifiedUsers;
                let Amount_Per_User = parseFloat(Amount / Total_Users);
                let Amount_Per_Qualified_User = parseFloat(Amount / Total_QualifiedUsers);
                // adding amount to expire wallet for non qualified users
                if (Total_NonQualifiedUsers > 0) {
                    async.eachSeries(NonQualifiedUsers, async (UserData, callback) => {
                        try {
                            let ExpireProcessing = await CronController.Trimming_Amount_Distribution_For_Individual_User_Account_Processing_Expiring(UserData, Amount_Per_Qualified_User);
                            callback();
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                    });
                }
                // end
                // adding amount to wallet for qualified users
                if (Total_QualifiedUsers > 0) {
                    async.eachSeries(QualifiedUsers, async (UserData, callback) => {
                        try {
                            let WalletAddingProcessing = await CronController.Trimming_Amount_Distribution_For_Individual_User_Account_Processing(UserData, Amount_Per_Qualified_User);
                            callback();
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                    });
                } else {
                    let TrimmerShareProcessing = await CronController.No_Royalty_Accounts_Available_Credit_Back_To_Trimmer(Amount);
                }
                resolve('Processing Successfully')
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_For_Individual_User_Account_Processing_Expiring = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let EData = {
                    UserData: UserData,
                    Amount: Amount
                };
                let EUData = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 16,
                    Amount: Amount,
                    Data: EData,
                    Time: new Date()
                };
                let EUSaveResult = await User_Wallet_Logs(EUData).save();
                let EUfndupdquery = {
                    USERID: UserData.USERID
                };
                let EUfndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Expired_Amount": Amount
                    }
                };
                let EUfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                }
                let EUfindupdateData = await Users.findOneAndUpdate(EUfndupdquery, EUfndupdchanges, EUfndupdoptions).select('-_id -__v').lean();
                resolve("Processing Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_For_Individual_User_Account_Processing = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    USERID: UserData.USERID
                }
                let Result = await Users.findOne(query).lean();
                let SubscriptionData = Result.Subscription_Data;
                let User_Amount = parseFloat((Amount)); // * SubscriptionData.Subscription_Limits.User_Subscription_Share) / 100); 
                // let Company_Amount = parseFloat((Amount * SubscriptionData.Subscription_Limits.Company_Subscription_Share) / 100);
                // let Trimmer_Amount = parseFloat((Amount * SubscriptionData.Subscription_Limits.Trimmer_Subscription_Share) / 100);
                let M_Amount = parseFloat((SubscriptionData.Subscription_Amount * SubscriptionData.Subscription_Limits.Max_Reward) / 100);
                let Max_Wallet_Limit = parseFloat(SubscriptionData.Subscription_Limits.Max_Wallet_Limit);
                let Max_Amount;
                let Excess_Amount = 0;
                if (M_Amount < User_Amount) {
                    Max_Amount = parseFloat(User_Amount);
                    //code for max reward (remove comments if needed)
                    //Max_Amount = M_Amount;
                    //Excess_Amount = parseFloat(User_Amount - M_Amount);
                } else {
                    Max_Amount = parseFloat(User_Amount);
                }
                ////////////
                if (Result.User_Amounts.Total_Amount < Max_Wallet_Limit) {
                    if (parseFloat(Result.User_Amounts.Total_Amount + Max_Amount) < Max_Wallet_Limit) {
                        Max_Amount = Max_Amount;
                    } else {
                        let RemAmount = parseFloat(Max_Wallet_Limit - Result.User_Amounts.Total_Amount);
                        let ExtraAmount = parseFloat(Amount - RemAmount);
                        Max_Amount = RemAmount;
                        // transfer extra amount to triming wallet
                        let Data2 = {
                            UserData: Result,
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
                        let UfindupdateData1 = await Users.findOneAndUpdate(query, Ufndupdchanges1, Ufndupdoptions1).select('-_id -__v').lean();
                        let Dataxt = {
                            UserData: Result,
                            Amount: ExtraAmount
                        };
                        let UDataxt = {
                            LogID: uuid.v4(),
                            USERID: Result.USERID,
                            Type: 29, // Amount Expired Due to Total Wallet Limit Exceed
                            Amount: ExtraAmount,
                            Data: Dataxt,
                            Time: new Date()
                        };
                        let USaveResultxt = await User_Wallet_Logs(UDataxt).save();
                    }
                    let Data = {
                        Total_Amount: Max_Amount,
                        no_of_account: 1
                    };
                    let UData = {
                        LogID: uuid.v4(),
                        USERID: Result.USERID,
                        Type: 8,
                        Amount: Max_Amount,
                        Data: Data,
                        Time: new Date()
                    };
                    let USaveResult = await User_Wallet_Logs(UData).save();
                    let Roylprocess = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Royality_Sharing', Max_Amount);
                    
                    let Ufndupdchanges = {
                        $set: {
                            updated_at: new Date()
                        },
                        $inc: {
                            "User_Amounts.Available_Amount": Max_Amount,
                            "User_Amounts.Royalty_Amount": Max_Amount,
                            "User_Amounts.Total_Amount": Max_Amount,
                        }
                    };
                    let Ufndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let UfindupdateData = await Users.findOneAndUpdate(query, Ufndupdchanges, Ufndupdoptions).select('-_id -__v').lean();
                } else {
                    // transfer amount to trimming wallet
                    let Data3 = {
                        UserData: Result,
                        Amount: Max_Amount
                    };
                    let TData = {
                        LogID: uuid.v4(),
                        Type: 14,
                        Amount: Max_Amount,
                        Data: Data3,
                        Time: new Date()
                    };
                    let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                    let Tfndupdquery = {

                    };
                    let Tfndupdchanges = {
                        $inc: {
                            Available_Amount: Max_Amount,
                            Total_Amount: Max_Amount
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
                            "User_Amounts.Expired_Amount": Max_Amount
                        }
                    };
                    let Ufndupdoptions1 = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    }
                    let UfindupdateData1 = await Users.findOneAndUpdate(query, Ufndupdchanges1, Ufndupdoptions1).select('-_id -__v').lean();
                    let Dataxt1 = {
                        UserData: Result,
                        Amount: Max_Amount
                    };
                    let UDataxt1 = {
                        LogID: uuid.v4(),
                        USERID: Result.USERID,
                        Type: 29, // Amount Expired Due to Total Wallet Limit Exceed 
                        Amount: Max_Amount,
                        Data: Dataxt1,
                        Time: new Date()
                    };
                    let USaveResultxt1 = await User_Wallet_Logs(UDataxt1).save();
                }
                /// sharing amount to company and triming wallet based on percentage
                // /////////////
                // let Data1 = {
                //     UserData: Result,
                //     Subscription_Logs: Result.Subscription_Data,
                //     Amount: Company_Amount
                // };
                // let CData = {
                //     LogID: uuid.v4(),
                //     Type: 1,
                //     Amount: Company_Amount,
                //     Data: Data1,
                //     Time: new Date()
                // };
                // let CSaveResult = await Company_Wallet_Logs(CData).save();
                // let Cfndupdquery = {

                // };
                // let Cfndupdchanges = {
                //     $inc: {
                //         Available_Amount: Company_Amount,
                //         Total_Amount: Company_Amount
                //     }
                // };
                // let Cfndupdoptions = {
                //     upsert: true,
                //     setDefaultsOnInsert: true,
                //     new: true
                // }
                // let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                // let Data2 = {
                //     UserData: Result,
                //     Subscription_Logs: Result.Subscription_Data,
                //     Amount: Trimmer_Amount
                // };
                // let TData = {
                //     LogID: uuid.v4(),
                //     Type: 1,
                //     Amount: Trimmer_Amount,
                //     Data: Data2,
                //     Time: new Date()
                // };
                // //console.log(4);

                // let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                // let Tfndupdquery = {

                // };
                // let Tfndupdchanges = {
                //     $inc: {
                //         Available_Amount: Trimmer_Amount,
                //         Total_Amount: Trimmer_Amount
                //     }
                // };
                // let Tfndupdoptions = {
                //     upsert: true,
                //     setDefaultsOnInsert: true,
                //     new: true
                // }
                // let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                // if (Excess_Amount != 0) {
                //     let EData = {
                //         UserData: Result,
                //         Subscription_Logs: Result.Subscription_Data,
                //         Amount: Excess_Amount
                //     };
                //     let EUData = {
                //         LogID: uuid.v4(),
                //         USERID: Result.USERID,
                //         Type: 30,
                //         Amount: Excess_Amount,
                //         Data: EData,
                //         Time: new Date()
                //     };
                //     let EUSaveResult = await User_Wallet_Logs(EUData).save();
                //     let EUfndupdquery = {
                //         USERID: Result.USERID
                //     };
                //     let EUfndupdchanges = {
                //         $set: {
                //             updated_at: new Date()
                //         },
                //         $inc: {
                //             "User_Amounts.Expired_Amount": Excess_Amount
                //         }
                //     };
                //     let EUfndupdoptions = {
                //         upsert: true,
                //         setDefaultsOnInsert: true,
                //         new: true
                //     }
                //     let EUfindupdateData = await Users.findOneAndUpdate(EUfndupdquery, EUfndupdchanges, EUfndupdoptions).select('-_id -__v').lean();
                // }
                resolve("Processing Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Date_Distribution = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = await CommonController.Common_Start_Date();
                let Trimmer_DateID = date.toISOString();
                let fndupdquery = {
                    Date: date
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        Trimmer_DateID: Trimmer_DateID
                    },
                    $inc: {
                        UnDistributed_Amount: Amount,
                        Trimmer_Amount: Amount
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();

                resolve("Amount Updated Successfully")
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Yellow_Green_Account_Trimmer_Royalty_Share_Distribution = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let All_Users_Data = await Users.find({ User_Account_Status: { $in: [2, 4] }, Status: true }).lean();
                let no_of_accounts = All_Users_Data.length;
                let Each_User_Amount = (no_of_accounts > 0) ? (Amount / no_of_accounts) : 0;
                if (no_of_accounts > 0) {
                    async.eachSeries(All_Users_Data, async (UserData, callback) => {
                        try {
                            let RoyaltyProcessing = await CronController.Trimming_Amount_Distribution_Company_Credit_Royalty_Amount_Processing(UserData, no_of_accounts, Each_User_Amount, Amount);
                            callback();
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                        resolve("Processed Successfully")
                        let DistributionProcessing = await CronController.Yellow_Green_Account_Trimmer_Royalty_Share_Distribution_Log_Processing(no_of_accounts, Amount);
                    });
                } else {
                    let TrimmerShareProcessing = await CronController.No_Royalty_Accounts_Available_Credit_Back_To_Trimmer(Amount);
                    resolve("Processed Successfully")
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Yellow_Green_Account_Trimmer_Royalty_Share_Distribution_Log_Processing = (no_of_accounts, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = await CommonController.Common_Start_Date();
                let Trimmer_DateID = date.toISOString();
                let fndupdquery = {
                    Date: date
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        Trimmer_DateID: Trimmer_DateID
                    },
                    $inc: {
                        Distributed_Amount: Amount,
                        UnDistributed_Amount: (Amount * -1)
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Data = {
                    LogID: uuid.v4(),
                    Trimmer_DateID: TrimmerDistributionData.Trimmer_DateID,
                    Type: 4,//Royalty Share in yellow and green accounts
                    Amount: Amount,
                    Data: {
                        no_of_accounts, no_of_accounts,
                        Amount: Amount
                    },
                    Time: new Date()
                };
                let SaveResult = await Trimmer_Distribution_Logs(Data).save();
                resolve("Processed Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Credit_Royalty_Amount_Processing = (UserData, no_of_accounts, Amount, Total_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 8,
                    Amount: Amount,
                    Data: {
                        Total_Amount: Total_Amount,
                        no_of_accounts: no_of_accounts
                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Available_Amount": Amount,
                        "User_Amounts.Total_Amount": Amount,
                        "User_Amounts.Royalty_Amount": Amount,
                    }
                };
                let fndupdoptions = {
                    new: true
                }
                UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve("Processing Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.No_Royalty_Accounts_Available_Credit_Back_To_Trimmer = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Trimmer_Amount = Amount;
                let Data = {

                };
                let TData = {
                    LogID: uuid.v4(),
                    Type: 8,
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                //console.log(3);
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
                };
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Yellow_Blue = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let All_Users_Data = await Users.find({ User_Account_Status: { $in: [2, 3] }, Status: true }).lean();
                let no_of_accounts = All_Users_Data.length;
                let Each_User_Amount = (no_of_accounts > 0) ? (Amount / no_of_accounts) : 0;
                if (no_of_accounts > 0) {
                    async.eachSeries(All_Users_Data, async (UserData, callback) => {
                        try {
                            UserData = await CronController.Trimming_Amount_Distribution_Company_Credit_Processing_User_Trimmer_Amount_Increment(UserData, no_of_accounts, Each_User_Amount, Amount);
                            let Trimming_Amount = UserData.User_Amounts.Trimming_Amount;
                            if (Trimming_Amount >= config.YELLOW_BLUE_CONVERSION_TO_GREEN_PURPLE_STATUS_AMOUNT_LIMIT) {
                                let UserStatusProcessing = await CronController.Yellow_Blue_Account_Conversion_To_Green_Purple(UserData, Trimming_Amount);
                                let TrimmerAmountProcessing = await UserController.Yellow_Blue_User_Account_Status_Change_Amount_Sharing(UserData, Trimming_Amount);
                                callback();
                            } else {
                                callback();
                            }
                        } catch (error) {
                            callback(error);
                        }
                    }, async (err) => {
                        if (err) reject(err);
                        resolve("Processing Successfully");
                        let DistributionProcessing = await CronController.Trimming_Amount_Distribution_Yellow_Blue_Distribution_Log_Processing(no_of_accounts, Amount);
                    });
                } else {
                    let TrimmerShareProcessing = await CronController.No_Yellow_Blue_Account_Available_for_Trimmer_Share_Available_Credit_Back_To_Trimmer(Amount);
                    resolve("Processed Successfully")
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Yellow_Blue_Distribution_Log_Processing = (no_of_accounts, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = await CommonController.Common_Start_Date();
                let Trimmer_DateID = date.toISOString();
                let fndupdquery = {
                    Date: date
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        Trimmer_DateID: Trimmer_DateID
                    },
                    $inc: {
                        Distributed_Amount: Amount,
                        UnDistributed_Amount: (Amount * -1)
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Data = {
                    LogID: uuid.v4(),
                    Trimmer_DateID: TrimmerDistributionData.Trimmer_DateID,
                    Type: 3,//Trimmer Share in yellow and blue accounts
                    Amount: Amount,
                    Data: {
                        no_of_accounts, no_of_accounts,
                        Amount: Amount
                    },
                    Time: new Date()
                };
                let SaveResult = await Trimmer_Distribution_Logs(Data).save();
                resolve("Processed Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.No_Yellow_Blue_Account_Available_for_Trimmer_Share_Available_Credit_Back_To_Trimmer = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Trimmer_Amount = Amount;
                let Data = {

                };
                let TData = {
                    LogID: uuid.v4(),
                    Type: 7,
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                //console.log(2);
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
                };
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Yellow_Blue_Account_Conversion_To_Green_Purple = (UserData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Old_User_Account_Status = UserData.User_Account_Status;
                let New_User_Account_Status = (Old_User_Account_Status == 2) ? 4 : 5;
                let User_Account_Status_Logs = {
                    User_Account_Status: New_User_Account_Status,
                    Comment: COMMON_SYSTEM_MESSAGES.YELLOW_BLUE_ACCOUNT_CONVERSION_GREEN_PURPLE,
                    Time: new Date()
                }
                let Data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 6,
                    Amount: Amount,
                    Data: {
                        Old_User_Account_Status: Old_User_Account_Status,
                        New_User_Account_Status: New_User_Account_Status
                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $set: {
                        User_Account_Status: New_User_Account_Status,
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Trimming_Amount": Amount * -1
                    },
                    $push: {
                        User_Account_Status_Logs: User_Account_Status_Logs
                    }
                };
                let fndupdoptions = {
                    new: true
                }
                UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve("Processed Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Credit_Processing_User_Trimmer_Amount_Increment = (UserData, no_of_accounts, Amount, Total_Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 5,
                    Amount: Amount,
                    Data: {
                        Total_Amount: Total_Amount,
                        no_of_accounts: no_of_accounts
                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $set: {
                        updated_at: new Date()
                    },
                    $inc: {
                        "User_Amounts.Trimming_Amount": Amount
                    }
                };
                let fndupdoptions = {
                    new: true
                }
                UserData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                resolve(UserData);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Credit_Processing = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Data = {

                };
                let CData = {
                    LogID: uuid.v4(),
                    Type: 2,//Company Trimmer Amount Credited
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
                };
                let CfindupdateData = await Company_Wallet.findOneAndUpdate(Cfndupdquery, Cfndupdchanges, Cfndupdoptions).select('-_id -__v').lean();
                let refprocessz = await CommonController.Daily_Sharing_Amount_Processing_For_Log('Company_Sharing', Amount);
                resolve("Share Processing Completed");
                let DistributionProcessing = await CronController.Trimming_Amount_Distribution_Company_Credit_Processing_Distribution_Log_Processing(Amount);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Credit_Processing_Distribution_Log_Processing = Amount => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let date = await CommonController.Common_Start_Date();
                let Trimmer_DateID = date.toISOString();
                //console.log('4.1')
                //console.log(Amount)
                let fndupdquery = {
                    Date: date
                };
                let fndupdchanges = {
                    $setOnInsert: {
                        Trimmer_DateID: Trimmer_DateID
                    },
                    $inc: {
                        Distributed_Amount: Amount,
                        UnDistributed_Amount: (Amount * -1)
                    }
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let Data = {
                    LogID: uuid.v4(),
                    Trimmer_DateID: TrimmerDistributionData.Trimmer_DateID,
                    Type: 2,//Company Share in Company Account
                    Amount: Amount,
                    Data: {
                        Amount: Amount
                    },
                    Time: new Date()
                };
                let SaveResult = await Trimmer_Distribution_Logs(Data).save();
                resolve("Processed Successfully");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Trimmer_Distribution_Deduction_Processing = (Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Trimmer_Amount = Amount;
                let Data = {

                };
                let TData = {
                    LogID: uuid.v4(),
                    Type: 4,//Trimmer Amount Distribution at end of day
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                //console.log(1);
                let TSaveResult = await Trimmer_Wallet_Logs(TData).save();
                let Tfndupdquery = {

                };
                let Tfndupdchanges = {
                    $inc: {
                        Withdrawn_Amount: Trimmer_Amount,
                        Available_Amount: (Trimmer_Amount * -1)
                    }
                };
                let Tfndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Account_Processing = (No_of_Company_Account) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                async.timesSeries(No_of_Company_Account, async (index, callback) => {
                    try {
                        let CompanyAccountCreation = await CronController.Trimming_Amount_Distribution_Company_Individual_Account_Processing();
                        callback();
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Processed Successfully");
                    let Date1 = moment().format('YYYY-MM-DD');
                    let fndupdquerylog = {
                        Date: Date1
                    };
                    let fndupdchangeslog = {
                        $inc: {
                            'Created_Pins.AutoID': No_of_Company_Account,
                            'Total_Pins.AutoID': No_of_Company_Account,
                        }
                    };
                    let fndupdoptionslog = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let findupdateDatalog = await Day_Pins_Log.findOneAndUpdate(fndupdquerylog, fndupdchangeslog, fndupdoptionslog).select('-_id -__v').lean();

                    let DistributionProcessing = await CronController.Trimming_Amount_Distribution_Company_Account_Processing_Distribution_Log_Processing(No_of_Company_Account);
                });

            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Account_Processing_Distribution_Log_Processing = No_of_Company_Account => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                if (No_of_Company_Account > 0) {
                    let query = {
                        SNo: 1
                    }
                    let SubResult = await Subscription.findOne(query).lean();
                    let New_Subscription_Amount = SubResult.Subscription_Amount;
                    let Total_Company_Account_Subscription_Amount = No_of_Company_Account * New_Subscription_Amount;
                    let Amount = Total_Company_Account_Subscription_Amount;
                    let date = await CommonController.Common_Start_Date();
                    let Trimmer_DateID = date.toISOString();
                    let fndupdquery = {
                        Date: date
                    };
                    let fndupdchanges = {
                        $setOnInsert: {
                            Trimmer_DateID: Trimmer_DateID
                        },
                        $inc: {
                            Distributed_Amount: Amount,
                            UnDistributed_Amount: (Amount * -1)
                        }
                    };
                    let fndupdoptions = {
                        upsert: true,
                        setDefaultsOnInsert: true,
                        new: true
                    };
                    let TrimmerDistributionData = await Trimmer_Distribution.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                    let Data = {
                        LogID: uuid.v4(),
                        Trimmer_DateID: TrimmerDistributionData.Trimmer_DateID,
                        Type: 1,//Company Account Distribution
                        Amount: Amount,
                        Data: {
                            No_of_Company_Account: No_of_Company_Account,
                            New_Subscription_Amount: New_Subscription_Amount,
                            Total_Company_Account_Subscription_Amount: Total_Company_Account_Subscription_Amount
                        },
                        Time: new Date()
                    };
                    let SaveResult = await Trimmer_Distribution_Logs(Data).save();
                    resolve("Processed Successfully");
                } else {
                    resolve("Processed Successfully");
                }
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Trimming_Amount_Distribution_Company_Individual_Account_Processing = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let query = {
                    SNo: 1
                }
                let SubResult = await Subscription.findOne(query).lean();
                let User_Account_Status = 7;//Company Account
                let User_Account_Status_Logs = {
                    User_Account_Status: User_Account_Status,
                    Comment: COMMON_SYSTEM_MESSAGES.COMPANY_ACCOUNT_CREATION,
                    Time: new Date()
                };
                let Amount = SubResult.Subscription_Amount; //config.New_Subscription_Amount;
                let Subscription_Type = 3;
                let Subscription_Expiry_Date = moment().add(100, 'year').subtract(1, 'ms').toDate();
                let Subscription_Data = {
                    SubscriptionID: SubResult.SubscriptionID,
                    Version: SubResult.Current_Version,
                    Subscription_Amount: Amount,
                    Subscription_Limits: SubResult.Subscription_Type,
                    Subscription_Expiry_Date: Subscription_Expiry_Date,
                    Subscription_Name: SubResult.Subscription_Name,
                    Time: new Date()
                };

                let USERID = uuid.v4();
                let UData = {
                    USERID: USERID,
                    Name: "Company Trimmer Account",
                    User_Basic_Information_Available: true,
                    Whether_Company_Account: true,
                    Whether_Subscribed: true,
                    Subscription_Type: Subscription_Type,
                    Subscription_Expiry_Date: Subscription_Expiry_Date,
                    Subscription_Logs: Subscription_Data,
                    Subscription_Data: Subscription_Data,
                    User_Account_Status: User_Account_Status,
                    User_Account_Status_Logs: User_Account_Status_Logs,
                    User_Account_Registered_Date: new Date(),
                    created_at: new Date(),
                    updated_at: new Date()
                };
                let UserData = await Users(UData).save();
                UserData = await JSON.parse(JSON.stringify(UserData));
                let URData = UserData;
                let UserReferralData = await Users_Referrals(URData).save();
                UserReferralData = await JSON.parse(JSON.stringify(UserReferralData));
                let ReferralData = {
                    USERID: "",
                    Name: "",
                    CountryCode: "",
                    PhoneNumber: "",
                    EmailID: ""
                }
                resolve("Created Successfully")
                let NetworkProcessing = await UserController.User_Network_Processing(UserData, UserData, ReferralData);
                let AmountProcessing = await UserController.Subscription_Amount_Sharing(UserData, UserData, Subscription_Data);
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Expired_Pending_Referral_Account_Deducting_From_User_Account = (UserData, UserReferralData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Royalty_Amount = parseFloat(UserData.User_Amounts.Royalty_Amount);
                let Referral_Amount = parseFloat(UserData.User_Amounts.Referral_Amount);
                let Amount = parseFloat(Royalty_Amount + Referral_Amount);
                if(Amount > UserData.User_Amounts.Available_Amount){
                    Amount = UserData.User_Amounts.Available_Amount
                }
                
                let User_Account_Status_Logs = {
                    User_Account_Status: UserData.User_Account_Status,
                    Comment: COMMON_SYSTEM_MESSAGES.BLACK_STATUS_PENDING_REFERRAL,
                    Time: new Date()
                }
                let Data = {
                    LogID: uuid.v4(),
                    USERID: UserData.USERID,
                    Type: 4, //Account Black Status Moved to Trimmer
                    Amount: Amount,
                    Data: {

                    },
                    Time: new Date()
                };
                let SaveResult = await User_Wallet_Logs(Data).save();
                let fndupdquery = {
                    USERID: UserData.USERID
                };
                let fndupdchanges = {
                    $inc: {
                        "User_Amounts.Royalty_Amount": (Royalty_Amount * -1),
                        "User_Amounts.Referral_Amount": (Referral_Amount * -1),
                        "User_Amounts.Available_Amount": (Amount * -1)
                    },
                };
                let fndupdoptions = {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                };
                let findupdateData = await Users.findOneAndUpdate(fndupdquery, fndupdchanges, fndupdoptions).select('-_id -__v').lean();
                let TrimmerUserAccountProcessing = await CronController.Expired_Pending_Referral_Account_Crediting_to_Trimmer_From_User_Account(UserData, UserReferralData, Amount);
                resolve("Debitting Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Expired_Pending_Referral_Account_Crediting_to_Trimmer_From_User_Account = (UserData, UserReferralData, Amount) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let Trimmer_Amount = Amount;
                let Data = {
                    UserData: UserData,
                    UserReferralData: UserReferralData
                };
                let TData = {
                    LogID: uuid.v4(),
                    Type: 3,//Trimmer Black Account Status Amount
                    Amount: Trimmer_Amount,
                    Data: Data,
                    Time: new Date()
                };
                //console.log(0);
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
                };
                let TfindupdateData = await Trimmer_Wallet.findOneAndUpdate(Tfndupdquery, Tfndupdchanges, Tfndupdoptions).select('-_id -__v').lean();
                resolve("Share Processing Completed");
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}

CronController.Expired_Pending_Referral_Account = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let USERID_Arary = await Users.distinct('USERID', { User_Account_Status: 1, User_Account_Registered_Date: { $ne: null }, Whether_Company_Account: false }).lean();
                async.eachSeries(USERID_Arary, async (USERID, callback) => {
                    try {
                        let UserData = await Users.findOne({ USERID: USERID }).lean();
                        let UserReferralData = await Users_Referrals.findOne({ USERID: USERID }).lean();
                        if (UserReferralData.No_of_Referrals < config.max_referral_account_setting) {
                            let now = moment();
                            let date = moment(UserData.User_Account_Registered_Date);
                            var diff = now.diff(date, "days");
                            diff = Math.abs(diff);
                            if (diff > config.max_referral_account_difference_days) {
                                //Exceeded Setting days
                                //let Amount = UserData.User_Amounts.Available_Amount;
                                let UserAccountProcessing = await CronController.Expired_Pending_Referral_Account_Deducting_From_User_Account(UserData, UserReferralData);
                                
                                callback();
                            } else {
                                //Doesn't Exceeded the days
                                callback();
                            }
                        } else {
                            //More than required referralls
                            callback();
                        }
                    } catch (error) {
                        callback(error);
                    }
                }, async (err) => {
                    if (err) reject(err);
                    resolve("Processing Successfully");
                });
            } catch (error) {
                reject(await CommonController.Common_Error_Handler(error));
            }
        });
    });
}


// CronController.Expired_Pending_Referral_Account = () => {
//     return new Promise((resolve, reject) => {
//         setImmediate(async () => {
//             try {
//                 let USERID_Arary = await Users.distinct('USERID', { User_Account_Status: 1, User_Account_Registered_Date: { $ne: null }, Whether_Company_Account: false }).lean();
//                 async.eachSeries(USERID_Arary, async (USERID, callback) => {
//                     try {
//                         let query = {
//                             USERID: USERID
//                         }
//                         let UserData = await Users.findOne(query).lean();
//                         let UserReferralData = await Users_Referrals.findOne(query).lean();
//                         if (UserReferralData.No_of_Referrals < config.max_referral_account_setting) {
//                             let now = moment();
//                             let date = moment(UserData.User_Account_Registered_Date);
//                             var diff = now.diff(date, "days");
//                             diff = Math.abs(diff);
//                             if (diff > config.max_referral_account_difference_days) {
                               
//                                 let User_Account_Status_Logs = {
//                                     User_Account_Status: User_Account_Status,
//                                     Comment: COMMON_SYSTEM_MESSAGES.BLACK_STATUS_PENDING_REFERRAL,
//                                     Time: new Date()
//                                 }
//                                 let changes = {
//                                     $set:{

//                                     }
//                                 };
//                                 let fndupdoptions = {
//                                     upsert: true,
//                                     setDefaultsOnInsert: true,
//                                     new: true
//                                 };
//                                 let findupdateData = await Users.findOneAndUpdate(fndupdquery, changes, fndupdoptions).select('-_id -__v').lean();
//                                 resolve("Debitting Processing Completed");
//                                 callback();
//                             } else {
//                                 //Doesn't Exceeded the days
//                                 callback();
//                             }
//                         } else {
//                             //More than required referralls
//                             callback();
//                         }
//                     } catch (error) {
//                         callback(error);
//                     }
//                 }, async (err) => {
//                     if (err) reject(err);
//                     resolve("Processing Successfully");
//                 });
//             } catch (error) {
//                 reject(await CommonController.Common_Error_Handler(error));
//             }
//         });
//     });
// }

/***************************************************************************************
 * 
 *                      Cron Jobs Below
 * 
 ***************************************************************************************/
let Pending_Bank_Transfer_Update_Statuses_processing = new cron.CronJob('40 1 * * *', async () => {
    try {
        if (config.Whether_Production_Settings) {
            //Production
            let Request_Body = {
                "SECRETCODE": config.SECRETCODE
            };
            let Request_Options = {
                method: 'post',
                url: '/cron/Pending_Bank_Transfer_Update_Statuses',
                baseURL: config.host,
                data: Request_Body
            };
            let Response = await axios(Request_Options);
            let ResponseData = await Response.data;
        }
    } catch (error) {
        console.error("Some Cron Error--------->", error);
    }
}, null, true, 'Asia/Kolkata');
Pending_Bank_Transfer_Update_Statuses_processing.start();

let Pending_Recharge_Update_Statuses_processing = new cron.CronJob('30 1 * * *', async () => {
    try {
        if (config.Whether_Production_Settings) {
            //Production
            let Request_Body = {
                "SECRETCODE": config.SECRETCODE
            };
            let Request_Options = {
                method: 'post',
                url: '/cron/Pending_Recharge_Update_Statuses',
                baseURL: config.host,
                data: Request_Body
            };
            let Response = await axios(Request_Options);
            let ResponseData = await Response.data;
        }
    } catch (error) {
        console.error("Some Cron Error--------->", error);
    }
}, null, true, 'Asia/Kolkata');
Pending_Recharge_Update_Statuses_processing.start();

let Expired_Pending_Referral_Account_processing = new cron.CronJob('5 1 * * *', async () => {
    try {
        if (config.Whether_Production_Settings) {
            //Production
            let Request_Body = {
                "SECRETCODE": config.SECRETCODE
            };
            let Request_Options = {
                method: 'post',
                url: '/cron/Expired_Pending_Referral_Account',
                baseURL: config.host,
                data: Request_Body
            };
            let Response = await axios(Request_Options);
            let ResponseData = await Response.data;
        }
    } catch (error) {
        console.error("Some Cron Error--------->", error);
    }
}, null, true, 'Asia/Kolkata');
Expired_Pending_Referral_Account_processing.start();


let Trimming_Amount_Distribution_processing = new cron.CronJob('25 1 * * *', async () => {
    try {
        if (config.Whether_Production_Settings) {
            //Production
            let Request_Body = {
                "SECRETCODE": config.SECRETCODE
            };
            let Request_Options = {
                method: 'post',
                url: '/cron/Trimming_Amount_Distribution',
                baseURL: config.host,
                data: Request_Body
            };
            let Response = await axios(Request_Options);
            let ResponseData = await Response.data;
        }
    } catch (error) {
        console.error("Some Cron Error--------->", error);
    }
}, null, true, 'Asia/Kolkata');
Trimming_Amount_Distribution_processing.start();

export default CronController;