let UserMediator = function () { };
import ApiMessages from "../config/ApiMessages";
import DeviceController from "../controllers/DeviceController";
import CommonController from "../controllers/CommonController";
import UserController from "../controllers/UserController";
import RazorpayController from "../controllers/RazorpayController";
import { isBoolean, Boolify } from "node-boolify";
import RechargeDaddyController from "../controllers/RechargeDaddyController";
import path from "path";
import fs from "fs";
import AdminController from "../controllers/AdminController";



UserMediator.List_Subscription_Product = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            console.log("23--->" +JSON.stringify( req.body))
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_Subscription_Product(req.body);
            console.log("23--->" +JSON.stringify(Result))
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Withdraw_Roaylty_Amt = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Withdraw_Roaylty_Amt(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Withdraw_gift_meter = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Withdraw_gift_meter(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}




UserMediator.Fetch_User_Royality_Information = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Fetch_User_Royality_Information(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_Gift_Meter = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            // let Result = await AdminController.List_Gift_Meter(req.body);
            let Result = await UserController.List_Gift_Meter(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Inactive_Address = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Inactive_Address(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Transfer_Wallet = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null && req.body.PhoneNumber != null && req.body.PhoneNumber != '' && req.body.Amount != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let CheckWallet = await CommonController.Check_Valid_Wallet(req.body,UserData);
            let PhoneNumber = await CommonController.Check_Phone_Number_Coupon_Bazaar(req.body);
            
           //let Result = await UserController.Transfer_Wallet(req.body);
            res.json(PhoneNumber);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Advertisements_History = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null

        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Advertisements_History(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Orders_History = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null

        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Orders_History(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Edit_Advertisement = async (req, res) => {
    try {
        if (req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && ((req.body.ImageID != null && req.body.ImageID != "") || (req.body.YouTube_Link != null && req.body.YouTube_Link != '')) && req.body.Advertisement_Type != null && req.body.YouTubeID != null) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ImageData = "";
            if (req.body.ImageID != null && req.body.ImageID != "") {
                ImageData = await CommonController.Check_for_Image(req.body);
            }
            let Result = await UserController.Edit_Advertisement(req.body, ImageData);

            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Add_Advertisement = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && ((req.body.ImageID != null && req.body.ImageID != "") || (req.body.YouTube_Link != null && req.body.YouTube_Link != '')) && req.body.Advertisement_Type != null && req.body.Ad_Amount != null) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ImageData = "";
            if (req.body.ImageID != null && req.body.ImageID != "") {
                ImageData = await CommonController.Check_for_Image(req.body);
            }
            let Result = await UserController.Add_Advertisement(req.body, UserData, ImageData);

            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.List_Products = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null

        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await AdminController.List_Products(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Place_Order = async (req, res) => {
    console.log(req.body)
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Product_ID != null && req.body.Product_ID != ''
            && req.body.Address_ID != null && req.body.Address_ID != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            // console.log(UserData)
            let ProductData = await CommonController.Product_Details(req.body);

            let Address_Data = await CommonController.Check_for_User_Address(req.body);

            let Result = await UserController.Place_Order(req.body, UserData, ProductData, Address_Data);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}



UserMediator.List_Address = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_Address(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Edit_Address = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Edit_Address(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Add_Address = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Add_Address(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Reset_User_Password = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            && req.body.OTP != null && isFinite(req.body.OTP)
            && req.body.New_Password != null && req.body.New_Password != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ValidityStatus = await UserController.Check_for_User_OTP_Tries_Count(req.body);
            ValidityStatus = await UserController.Validate_User_OTP(req.body);
            let ResultX = await UserController.Reset_User_Password(req.body);
            let Result = await UserController.Add_Fetch_User_Profile_Information(req.body, DeviceData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Update_User_Password = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Old_Password != null && req.body.Old_Password != ''
            && req.body.New_Password != null && req.body.New_Password != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            if (UserData.Password_Available == true) {
                let ValidateOldPassword = await CommonController.Check_Old_Password(req.body, UserData);
                let validateNewPassword = await CommonController.Check_Old_And_New_Password(req.body, UserData)
                let Result = await UserController.Update_User_Password(req.body);
                res.json(Result);
            } else {
                throw { success: false, extras: { msg: ApiMessages.PASSWORD_NOT_AVAILABLE } };
            }
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Create_User_Password = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Password != null && req.body.Password != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Create_User_Password(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Generated_Bills = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Latest != null && isBoolean(req.body.Latest)
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Generated_Bills(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Search_For_Shop_With_PhoneNumber = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Search_For_Shop_With_PhoneNumber(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Amount_Transfer_To_Shop = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Amount != null && isFinite(req.body.Amount)
            && req.body.ShopUSERID != null && req.body.ShopUSERID != ''
            && req.body.Description != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ShopData = await CommonController.Check_for_Shop(req.body, UserData);
            let Result = await UserController.User_Amount_Transfer_To_Shop(req.body, UserData, ShopData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_User_Expired_Amount_Log = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_User_Expired_Amount_Log(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Shop_Upgrade = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Shop_Upgrade(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Shops = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Latitude != null
            && req.body.Longitude != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Shops(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Fetch_YouTube_Ad = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            //let UserData = await CommonController.Check_for_User_and_Session_with_Active_Account(req.body); // for persons who completed 10 ref
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Fetch_YouTube_Ad(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Fetch_Single_Plot = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.PlotID != null && req.body.PlotID != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            //let UserData = await CommonController.Check_for_User_and_Session_with_Active_Account(req.body); // for persons who completed 10 ref
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Fetch_Single_Plot(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Active_Plots = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            //let UserData = await CommonController.Check_for_User_and_Session(req.body); // for persons who completed 10 ref
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Active_Plots(req.body, req.body.skip, req.body.limit);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Subscriptions = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Wether_Pin_Purchase != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            if (req.body.Wether_Pin_Purchase == 'true') {
                let Result = await UserController.List_All_Subscriptions(req.body);
                res.json(Result);
            } else {
                let Result = await UserController.List_Subscriptions(req.body);
                res.json(Result);
            }

        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Pincode = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null // && req.body.USERID != null && req.body.SessionID != null           
            && req.body.PinCode != null && isFinite(req.body.PinCode)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            //let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Pincode(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Update_Shop_Information = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Shop_Name != null && req.body.Shop_Name != ''
            && req.body.Shop_Address != null && req.body.Shop_Address != ''
            && req.body.lat != null && isFinite(req.body.lat)
            && req.body.lng != null && isFinite(req.body.lng)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Shop_Permission(UserData);
            let Result = await UserController.Update_Shop_Information(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Register_Shop_with_Subscription = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            && req.body.EmailID != null
            && req.body.Whether_Referral_Signup != null && isBoolean(req.body.Whether_Referral_Signup)
            && req.body.PhoneNumber != null
            && req.body.Subscription_Type != null && isFinite(req.body.Subscription_Type)
            && req.body.USER_PIN_CODE != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ReferralData = await UserController.Register_User_With_Subscription_Validate_Referral_Phone_Number(req.body, UserData);
            let ValidityStatus = await UserController.Check_Whether_Shop_Subscription_Amount_Available(UserData);
            ValidityStatus = await CommonController.Common_Email_Validation(req.body.EmailID);
            let RegisterSubscriptionProcess = await UserController.Register_Shop_with_Subscription(req.body, UserData, ReferralData);
            UserData = await CommonController.Check_Only_User(req.body);
            let Result = await RegisterSubscriptionProcess[0];
            let Subscription_Logs = await RegisterSubscriptionProcess[1];
            res.json(Result);
            let NetworkProcessing = await UserController.User_Network_Processing(req.body, UserData, ReferralData);
            let AmountProcessing = await UserController.Shop_Subscription_Amount_Sharing(UserData);
            let RegisterUpdateRazorpayUser = await UserController.Create_and_Update_User_RazorpayX_Contact(UserData);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_UPI_ID = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.UPI != null && req.body.UPI != ''
        ) {
            req.body = JSON.parse(JSON.stringify(req.body));
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await CommonController.Common_UPI_Validation(req.body.UPI);
            let Result = await UserController.User_Add_Beneficiary_Account_for_UPI_ID_Already_Exist(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Validate_Shop_Pin_Add_Money_To_Wallet = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.USER_PIN_CODE != null && req.body.USER_PIN_CODE != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await UserController.Validate_User_Pin_Tries(req.body);
            let UserPinCodeData = await CommonController.Check_for_Shop_PIN_CODE(req.body);
            let Result = await UserController.Validate_Shop_Pin_Add_Money_To_Wallet(req.body, UserData, UserPinCodeData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_all_Used_Shop_Pins = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_all_Used_Shop_Pins(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_all_Available_Shop_Pins = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_all_Available_Shop_Pins(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Purchase_Shop_Pins = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.no_of_pins != null && isFinite(req.body.no_of_pins)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await UserController.User_Purchase_Shop_Pins_Validate_Amount(req.body, UserData);
            let Result = await UserController.User_Purchase_Shop_Pins(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Get_PDF_Tutorial = async (req, res) => {
    var data = fs.readFileSync(path.join(__dirname, '../config/buytm.pdf'));
    res.contentType("application/pdf");
    res.send(data);
}

UserMediator.List_All_App_Image_Resource = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.ResourceType != null && isFinite(req.body.ResourceType)
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_App_Image_Resource(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_News = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_News(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_News = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_News(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Guidelines = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Guidelines(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.List_All_Recharges = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Recharges(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Recharge_Mobile = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Amount != null && isFinite(req.body.Amount)
            && req.body.ServiceType != null && isFinite(req.body.ServiceType)
            && req.body.RechargePhoneNumber != null && req.body.RechargePhoneNumber != ""
            && req.body.ServiceCode != null && req.body.ServiceCode != ""
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let BalanceData = await RechargeDaddyController.Check_for_Balance();
            let ValidityStatus = await UserController.User_Recharge_Mobile_Validate_Completely(req.body, UserData, BalanceData);
            let Result = await UserController.User_Recharge_Mobile(req.body, UserData, BalanceData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Bank_Transfers = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Bank_Transfers(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Amount_Transfer_To_Bank = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.BeneficiaryID != null
            && req.body.Amount != null && isFinite(req.body.Amount)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let BeneficiaryData = await CommonController.Check_for_Beneficiary(req.body);
            let Result = await UserController.User_Amount_Transfer_To_Bank(req.body, UserData, BeneficiaryData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Beneficiary_Accounts = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Beneficiary_Accounts(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Add_Beneficiary_Account_for_UPI_ID = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            && req.body.UPI != null && req.body.UPI != ''
        ) {
            req.body = JSON.parse(JSON.stringify(req.body));
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await CommonController.Common_UPI_Validation(req.body.UPI);
            ValidityStatus = await UserController.User_Add_Beneficiary_Account_for_UPI_ID_Already_Exist(req.body);
            let Result = await UserController.User_Add_Beneficiary_Account_for_UPI_ID(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Add_Beneficiary_Account_for_Bank_Account = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            && req.body.Account_Number != null && req.body.Account_Number != ''
            && req.body.IFSC != null && req.body.IFSC != ''
        ) {
            req.body = JSON.parse(JSON.stringify(req.body));
            req.body.IFSC = req.body.IFSC.toUpperCase();
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let BankData = await UserController.Validate_IFSC_Code(req.body);
            let ValidityStatus = await UserController.User_Add_Beneficiary_Account_Check_Whether_Account_Number_Already_Exist(req.body);
            let Result = await UserController.User_Add_Beneficiary_Account_for_Bank_Account(req.body, BankData, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_IFSC_Code = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.IFSC != null && req.body.IFSC != ''
        ) {
            req.body = JSON.parse(JSON.stringify(req.body));
            req.body.IFSC = req.body.IFSC.toUpperCase();
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let BankData = await UserController.Validate_IFSC_Code(req.body);
            res.json({ success: true, extras: { Data: BankData } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_Friend_Money_Transfers = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_Friend_Money_Transfers(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Fetch_Phone_Number = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let FriendData = await UserController.Validate_Fetch_Phone_Number(req.body, UserData);
            res.json({ success: true, extras: { Data: FriendData } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}


UserMediator.Transfer_Amount_To_Friend = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Amount != null && isFinite(req.body.Amount)
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let FriendData = await UserController.Validate_Fetch_Phone_Number(req.body, UserData);
            let Result = await UserController.Transfer_Amount_To_Friend(req.body, UserData, FriendData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_All_User_Wallet_Logs = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_All_User_Wallet_Logs(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Fetch_User_Wallet_Information = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            
            if(UserData.User_Amounts.Available_Withdrawn_Gift_Amount == undefined || UserData.User_Amounts.Available_Withdrawn_Gift_Amount == null ){
                UserData.User_Amounts.Available_Withdrawn_Gift_Amount = 0;
            }
            if(UserData.User_Amounts.Available_Withdrawn_Trimming_Amount == undefined || UserData.User_Amounts.Available_Withdrawn_Trimming_Amount == null ){
                UserData.User_Amounts.Available_Withdrawn_Trimming_Amount = 0;
            }
            if(UserData.User_Amounts.Gift_Amount == undefined || UserData.User_Amounts.Gift_Amount == null ){
                UserData.User_Amounts.Gift_Amount = 0;
            }
            if(UserData.User_Amounts.Level_One_Amount == undefined || UserData.User_Amounts.Level_One_Amount == null ){
                UserData.User_Amounts.Level_One_Amount = 0;
            }
            if(UserData.User_Amounts.Level_Two_Amount == undefined || UserData.User_Amounts.Level_Two_Amount == null ){
                UserData.User_Amounts.Level_Two_Amount = 0;
            }
            res.json({ success: true, extras: { Data: UserData.User_Amounts } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Network_Heirarchy = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Network_USERID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let NetworkUserData = await UserController.User_Network_Heirarchy_Validate_Network_USERID(req.body);
            let Result = await UserController.User_Network_Heirarchy(req.body, NetworkUserData, 1);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_User_Pin_Add_Money_To_Wallet = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.USER_PIN_CODE != null && req.body.USER_PIN_CODE != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ValidityStatus = await UserController.Validate_User_Pin_Tries(req.body);
            let UserPinCodeData = await CommonController.Check_for_USER_PIN_CODE(req.body);
            let Result = await UserController.Validate_User_Pin_Add_Money_To_Wallet(req.body, UserData, UserPinCodeData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_all_Used_Pins = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_all_Used_Pins(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.List_all_Available_Pins = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.List_all_Available_Pins(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Pins_Purchase = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.SubscriptionID != null
            && req.body.Version != null
            && req.body.Total_Amount != null
            && req.body.Amount_Used_From_Wallet != null
            && req.body.Use_From_Wallet != null
            && req.body.Amount_Online != null
            && req.body.Total_Wallet_Amount != null
            && req.body.no_of_pins != null && isFinite(req.body.no_of_pins)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            //let ValidityStatus = await UserController.User_Purchase_Pins_Validate_Amount(req.body, UserData);
            let Result = await UserController.User_Pins_Purchase(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Pins_Request = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.SubscriptionID != null
            && req.body.Version != null
            && req.body.no_of_pins != null && isFinite(req.body.no_of_pins)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            //let ValidityStatus = await UserController.User_Purchase_Pins_Validate_Amount(req.body, UserData);
            let Result = await UserController.User_Pins_Request(req.body, UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Home_Screen_Details = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.User_Home_Screen_Details(UserData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Register_User_With_Subscription = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            //&& req.body.EmailID != null
            && req.body.Whether_Referral_Signup != null && isBoolean(req.body.Whether_Referral_Signup)
            && req.body.PhoneNumber != null
            && req.body.CountryCode != null
            //&& req.body.Subscription_Type != null && isFinite(req.body.Subscription_Type)
            && req.body.USER_PIN_CODE != null
            && req.body.State != null
            && req.body.City != null
            && req.body.Area != null
            && req.body.Postal_Code != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ReferralData = await CommonController.Check_for_User_and_Session(req.body);
            let Result = await UserController.Check_Or_Create_User_PhoneNumber(req.body, ReferralData);//check for phone number already in use else creat new
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Subscription = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);

            if (req.body.USER_PIN_CODE != null && req.body.USER_PIN_CODE != '') {
                let Result = await UserController.User_Subscription_With_PIN(req.body, UserData);
                console.log(Result)
                res.json(Result);
            } else if (req.body.SubscriptionID != null && req.body.SubscriptionID != '') {
                let Result = await UserController.User_Subscription_With_ID(req.body, UserData);
                console.log(Result)
                res.json(Result);
            } else {
                throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
            }
            let RegisterUpdateRazorpayUser = await UserController.Create_and_Update_User_RazorpayX_Contact(UserData);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        console.log(error)
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Register_User = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            //&& req.body.EmailID != null
            && req.body.Whether_Referral_Signup != null && isBoolean(req.body.Whether_Referral_Signup)
            && req.body.PhoneNumber != null
            && req.body.State != null
            && req.body.City != null
            && req.body.Area != null
            && req.body.Postal_Code != null
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ReferralData = await UserController.Register_User_With_Subscription_Validate_Referral_Phone_Number(req.body, UserData);
            let RegisterSubscriptionProcess = await UserController.Register_User(req.body, UserData, ReferralData);
            UserData = await CommonController.Check_Only_User(req.body);
            res.json(RegisterSubscriptionProcess);
            //res.json(Result);
            //let NetworkProcessing = await UserController.User_Network_Processing(req.body, UserData, ReferralData);
            //let AmountProcessing = await UserController.Subscription_Amount_Sharing(req.body, UserData, Subscription_Logs);
            //let RegisterUpdateRazorpayUser = await UserController.Create_and_Update_User_RazorpayX_Contact(UserData);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_Referral_Phone_Number = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            let ReferralData = await UserController.Validate_Referral_Phone_Number(req.body, UserData);
            res.json({ success: true, extras: { Status: "Referral Available" } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.User_Add_Amount_From_Razorpay_To_Wallet = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null && req.body.USERID != null && req.body.SessionID != null
            && req.body.PaymentID != null && req.body.PaymentID != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let UserData = await CommonController.Check_for_User_and_Session(req.body);
            if (UserData.User_Amounts.Total_Amount < UserData.Subscription_Data.Subscription_Limits.Max_Wallet_Limit) {
                let PaymentData = await RazorpayController.Check_Razorpay_Payment(req.body.PaymentID);
                PaymentData = await RazorpayController.Capture_Razorpay_Payment(req.body.PaymentID, PaymentData.amount);
                let Result = await UserController.User_Add_Amount_From_Razorpay_To_Wallet(req.body, PaymentData);
                res.json(Result);
            } else {
                throw { success: false, extras: { msg: ApiMessages.WALLET_LIMIT_EXCEEDED } };
            }

        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_Direct_Ref_OTP = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            && req.body.OTP != null && isFinite(req.body.OTP)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ValidityStatus = await UserController.Check_for_User_OTP_Tries_Count(req.body);
            ValidityStatus = await UserController.Validate_Direct_Ref_OTP(req.body);
            // let Result = await UserController.Add_Fetch_User_Profile_Information(req.body, DeviceData);
            res.json(ValidityStatus);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_User_Password = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            && req.body.Password != null && req.body.Password != ''
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ValidityStatus = await UserController.Validate_User_Password(req.body);
            let Result = await UserController.Add_Fetch_User_Profile_Information(req.body, DeviceData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        console.log(error)
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Validate_User_OTP = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            && req.body.OTP != null && isFinite(req.body.OTP)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ValidityStatus = await UserController.Check_for_User_OTP_Tries_Count(req.body);
            ValidityStatus = await UserController.Validate_User_OTP(req.body);
            let Result = await UserController.Add_Fetch_User_Profile_Information(req.body, DeviceData);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

UserMediator.Generate_User_OTP = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
            //&& req.body.Password_Reset != null && isBoolean(req.body.Password_Reset)
        ) {
            console.log(req.body)
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let ValidityStatus = await UserController.Check_for_OTP_Count(req.body);
            let Result = await UserController.Generate_User_OTP_Send_Message(req.body);
            console.log("Responce")
            console.log(Result)
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
};


UserMediator.Validate_Transfer_OTP = async (req, res) => {
    try {
        if (
            req.body.ApiKey != null
           && req.body.CountryCode != null && req.body.CountryCode != ''
           && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
           && req.body.OTP != null && isFinite(req.body.OTP)
        ) {
            let DeviceData = await CommonController.Check_for_Api_Key(req.body);
            let PhoneNumber = await CommonController.Check_Phone_Number_Coupon_Bazaar(req.body);
            let ValidityStatus = await UserController.Check_for_Transfer_OTP_Tries_Count(req.body);
            ValidityStatus = await UserController.Validate_Transfer_OTP(req.body);
            let AddAmount = await UserController.Transfer_Amount_To_CBWallet(req.body,PhoneNumber);
           // let Result = await UserController.Add_Fetch_User_Profile_Information(req.body, DeviceData);
            res.json(AddAmount);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}
export default UserMediator;