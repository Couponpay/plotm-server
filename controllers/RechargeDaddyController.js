let RechargeDaddyController = function () { };
import axios from "axios";
import querystring from "querystring";
import ApiMessages from "../config/ApiMessages";
import config from "../config/config";
import CommonController from "./CommonController";
import User_Recharges from "../models/User_Recharges";
import User_Wallet_Logs from "../models/User_Wallet_Logs";
import Users from "../models/Users";
import uuid from "uuid";
import moment from "moment";

RechargeDaddyController.CallbackFunctionality = async (req, res) => {
    try {
        let values = JSON.parse(JSON.stringify(req.body));
        res.status(200).send("Callback Completed Successfully");
        let RechargeData = await User_Recharges.findOne({ RechargeTransactionID: values.ClientRefNo }).lean();
        if (RechargeData == null) {
            console.error("Invalid Callback Recharge Transaction");
        } else {
            let OPRID = "";
            if (values.OprID != null && values.OprID != undefined && values.OprID != "") {
                OPRID = values.OprID;
            }
            if (RechargeData.TransactionStatus == 0 || RechargeData.TransactionStatus == 4 || RechargeData.TransactionStatus == 6) {
                //On Process or Hold or Request Processing
                let TransactionStatus = 0;
                let ClientStatus = parseInt(values.Status);
                if (ClientStatus == 2 || ClientStatus == 3 || ClientStatus == 5) {
                    TransactionStatus = 5;//Refunded
                } else {
                    TransactionStatus = ClientStatus;
                }
                let query = {
                    RechargeTransactionID: values.ClientRefNo
                };
                let changes = {
                    $set: {
                        TransactionStatus: TransactionStatus,
                        TransactionStatusDescription: (TransactionStatus == 5) ? "Refunded" : values.StatusMsg,
                        OPRID: OPRID,
                        DP: values.DP,
                        DR: values.DR,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
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
                //Already Success
                let query = {
                    RechargeTransactionID: values.ClientRefNo
                };
                let changes = {
                    $set: {
                        TransactionStatusDescription: values.StatusMsg,
                        OPRID: OPRID,
                        DP: values.DP,
                        DR: values.DR,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
            } else if (RechargeData.TransactionStatus == 5) {
                //Amount Already Refunded
                let query = {
                    RechargeTransactionID: values.ClientRefNo
                };
                let changes = {
                    $set: {
                        OPRID: OPRID,
                        DP: values.DP,
                        DR: values.DR,
                        updated_at: new Date()
                    }
                };
                let UpdatedStatus = await User_Recharges.updateOne(query, changes).lean();
            }
        }
    } catch (error) {
        console.error("Something Recharge Callback error-->", error)
        if (!res.headersSent) {
            res.status(200).send("Callback Completed Successfully");
        }
    }
}

RechargeDaddyController.Check_for_Balance = () => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let url = config.RechargeDaddy.host;
                let request_options = {
                    method: 'post',
                    url: url,
                    data: querystring.stringify({
                        MobileNo: config.RechargeDaddy.MobileNo,
                        APIKey: config.RechargeDaddy.APIKey,
                        REQTYPE: 'BAL',
                        RESPTYPE: config.RechargeDaddy.RESPTYPE
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    let Data = Response.data;
                    if (parseInt(Data.STATUSCODE) == 0) {
                        resolve(Data);
                    } else {
                        console.error("RECHARGE_DADDY_ERROR After Success------->", Data);
                        reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                    }
                } else if (Response.status == 400) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                } else if (Response.status == 401) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                }
            } catch (error) {
                console.error("Recharge Daddy Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
            }
        });
    });
}

RechargeDaddyController.Recharge_Mobile = (RechargeData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let url = config.RechargeDaddy.host;
                let request_options = {
                    method: 'post',
                    url: url,
                    data: querystring.stringify({
                        MobileNo: config.RechargeDaddy.MobileNo,
                        APIKey: config.RechargeDaddy.APIKey,
                        REQTYPE: 'RECH',
                        REFNO: RechargeData.RechargeTransactionID,
                        SERCODE: RechargeData.ServiceCode,
                        CUSTNO: RechargeData.RechargePhoneNumber,
                        AMT: RechargeData.Amount,
                        STV: RechargeData.ServiceType,
                        RESPTYPE: config.RechargeDaddy.RESPTYPE
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    let Data = Response.data;
                    resolve(Data);
                } else if (Response.status == 400) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                } else if (Response.status == 401) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                }
            } catch (error) {
                console.error("Recharge Daddy Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
            }
        });
    });
}

RechargeDaddyController.Check_Recharge_Status = (RechargeData) => {
    return new Promise((resolve, reject) => {
        setImmediate(async () => {
            try {
                let url = config.RechargeDaddy.host;
                let request_options = {
                    method: 'post',
                    url: url,
                    data: querystring.stringify({
                        MobileNo: config.RechargeDaddy.MobileNo,
                        APIKey: config.RechargeDaddy.APIKey,
                        REQTYPE: 'STATUS',
                        REFNO: RechargeData.RechargeTransactionID,
                        RESPTYPE: config.RechargeDaddy.RESPTYPE
                    }),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                };
                let Response = await axios(request_options);
                if (Response.status == 200) {
                    let Data = Response.data;
                    resolve(Data);
                } else if (Response.status == 400) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                } else if (Response.status == 401) {
                    console.error("RECHARGE_DADDY_ERROR------->", Response);
                    reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
                }
            } catch (error) {
                console.error("Recharge Daddy Error-->", error);
                reject({ success: false, extras: { msg: ApiMessages.RECHARGE_DADDY_ERROR } });
            }
        });
    });
}

export default RechargeDaddyController;