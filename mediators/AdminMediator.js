let AdminMediator = function () { };
import ApiMessages from "../config/ApiMessages";
import AdminController from "../controllers/AdminController";
import CommonController from "../controllers/CommonController";
import { isBoolean, Boolify } from "node-boolify";
import UserController from "../controllers/UserController";
import MSG91Controller from "../controllers/MSG91Controller";
import RechargeDaddyController from "../controllers/RechargeDaddyController";



//Check for Product SNO
AdminMediator.Active_Inactive_Gift_Meter = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Gift_Meter_ID != null && req.body.Gift_Meter_ID != ""
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Active_Inactive_Gift_Meter(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }

    } catch (error) {
        if (!res.headersSent) {
            res.json(await CommonController.Common_Error_Handler(error));
        }
    }
}




//Check for Product SNO
AdminMediator.Active_Inactive_Product = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Product_ID != null && req.body.Product_ID != ""
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Active_Inactive_Product(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }

    } catch (error) {
        if (!res.headersSent) {
            res.json(await CommonController.Common_Error_Handler(error));
        }
    }
}



//Check for Product SNO
AdminMediator.Check_For_Prod_SNo_Available = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.S_NO != null && isFinite(req.body.S_NO) && !isNaN(req.body.S_NO)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Check_For_Prod_SNo_Available(req.body);
            res.json({ success: true, extras: { Status: Result } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }

    } catch (error) {
        if (!res.headersSent) {
            res.json(await CommonController.Common_Error_Handler(error));
        }
    }
}


//Check for GiftMeter SNO
AdminMediator.Check_For_GM_SNo_Available = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.S_NO != null && isFinite(req.body.S_NO) && !isNaN(req.body.S_NO)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Check_For_GM_SNo_Available(req.body);
            res.json({ success: true, extras: { Status: Result } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }

    } catch (error) {
        if (!res.headersSent) {
            res.json(await CommonController.Common_Error_Handler(error));
        }
    }
}

//Approve or Reject Ad
AdminMediator.Apr_Rej_Adverstisement = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            // let Check_Order = await CommonController.Check_for_Order(req.body);
            let Result = await AdminController.Apr_Rej_Adverstisement(req.body);
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



AdminMediator.Change_Order_Status = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Check_Order = await CommonController.Check_for_Order(req.body);
            let Result = await AdminController.Change_Order_Status(req.body);
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


AdminMediator.List_Orders = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_Orders(req.body);
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


AdminMediator.List_Products = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
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

AdminMediator.Edit_Product = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.S_NO != null && req.body.S_NO != ""
            && req.body.Product_ID != null

        ) {
            let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Edit_Product(req.body, ImageData);
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

AdminMediator.Add_Product = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.S_NO != null && req.body.S_NO != ""
            && req.body.Product_Price != null
            && req.body.ImageID != null
            && req.body.Description != null && req.body.Description != ""
        ) {
            let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Product_SNO = await AdminController.Check_For_Prod_SNo_Available(req.body);
            let Result = await AdminController.Add_Product(req.body, ImageData);
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

AdminMediator.List_Gift_Meter = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            // && req.body.Status != null && req.body.Status != ""
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_Gift_Meter(req.body);
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


AdminMediator.Edit_Gift_Meter = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.S_NO != null && req.body.S_NO != ""
            && req.body.ImageID != null
            && req.body.Amount != null
            && req.body.Is_Root != null
            // && req.body.Gift_Meter_Level_ID != null && req.body.Gift_Meter_Level_ID != ""
        ) {
            let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Edit_Gift_Meter(req.body, ImageData);
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

AdminMediator.Create_Gift_Meter = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.S_NO != null && req.body.S_NO != ""
            && req.body.ImageID != null
            && req.body.Amount != null
            && req.body.Is_Root != null
            // && req.body.Gift_Meter_Level_ID != null && req.body.Gift_Meter_Level_ID != ""
        ) {
            let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Check_SNO = await AdminController.Check_For_GM_SNo_Available(req.body);
            
            let Result = await AdminController.Create_Gift_Meter(req.body, ImageData);
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

AdminMediator.All_Users_Wallet_Balance = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.All_Users_Wallet_Balance(req.body);
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

AdminMediator.Refund_For_Black_Accounts = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Refund_For_Black_Accounts(req.body);
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

AdminMediator.Clear_User_Data = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Clear_User_Data(req.body);
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

AdminMediator.User_Level_Report = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let NetworkUserData = await UserController.User_Network_Heirarchy_Validate_Network_USERID(req.body);
            let Result = await AdminController.User_Level_Report(req.body, NetworkUserData);
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

AdminMediator.Sharing_Day_Report = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Sharing_Day_Report(req.body);
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

AdminMediator.Bank_Day_Report = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Bank_Day_Report(req.body);
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

AdminMediator.Pins_Day_Report = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Pins_Day_Report(req.body);
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

AdminMediator.List_All_Free_Pins = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_Free_Pins(req.body);
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

AdminMediator.Generate_Free_Pins = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.SubscriptionID != null && req.body.SubscriptionID != ''
            && req.body.Quantity != null && req.body.Quantity != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Generate_Free_Pins(req.body);
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

AdminMediator.Remove_Resource_Image = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.ResourceID != null
            && req.body.ImageID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let PlotData = await CommonController.Check_for_Resource(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let Result = await AdminController.Remove_Resource_Image(req.body, ImageData);
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

AdminMediator.Remove_Plot_Image = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.PlotID != null
            && req.body.ImageID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let PlotData = await CommonController.Check_for_Plot(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let Result = await AdminController.Remove_Plot_Image(req.body, ImageData);
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

AdminMediator.Activate_Inactivate_News = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.NewsID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Activate_Inactivate_News(req.body);
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

AdminMediator.Activate_Inactivate_Subscriptions = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.SubscriptionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Activate_Inactivate_Subscriptions(req.body);
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

AdminMediator.Edit_YouTube_Add = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.YouTubeID != null && req.body.YouTubeID != ''
            && req.body.YouTube_Link_Name != null && req.body.YouTube_Link_Name != ''
            && req.body.YouTube_Link != null && req.body.YouTube_Link != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.AreaCode_Array != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Edit_YouTube_Add(req.body);
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

AdminMediator.Edit_Plot = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.All_ImageID_Array //&& typeof (req.body.All_ImageID_Array) == "object"
            && req.body.FileID != null
            && req.body.Plot_Name != null && req.body.Plot_Name != ''
            && req.body.Company_Name != null && req.body.Company_Name != ''
            && req.body.ImageID != null
            && req.body.Address != null
            && req.body.Description != null && req.body.Description != ''
            && req.body.Latitude != null && req.body.Latitude != ''
            && req.body.Longitude != null && req.body.Longitude != ''
            && req.body.PlotID != null && req.body.PlotID != ''
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let All_Images_Data = await AdminController.Image_Data_From_ImageID_Array(req.body);
            let File_Data = await AdminController.Check_File_Data_From_FileID(req.body.FileID);
            let Result = await AdminController.Edit_Plot(req.body, All_Images_Data, File_Data, ImageData);
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

AdminMediator.List_All_YouTube_Add = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
            && req.body.User_Type != null 
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_YouTube_Add(req.body);
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

AdminMediator.Activate_Inactivate_YouTube_Add = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.YouTubeID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Activate_Inactivate_YouTube_Add(req.body);
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

AdminMediator.Create_YouTube_Add = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.YouTube_Link_Name != null && req.body.YouTube_Link_Name != ''
            && req.body.YouTube_Link != null && req.body.YouTube_Link != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.AreaCode_Array != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Create_YouTube_Add(req.body);
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

AdminMediator.List_All_Plot = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_Plot(req.body);
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

AdminMediator.Activate_Inactivate_Plot = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.PlotID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Activate_Inactivate_Plot(req.body);
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

AdminMediator.Create_Plot = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.All_ImageID_Array //&& typeof (req.body.All_ImageID_Array) == "object"
            && req.body.FileID != null
            && req.body.Plot_Name != null && req.body.Plot_Name != ''
            && req.body.Company_Name != null && req.body.Company_Name != ''
            && req.body.ImageID != null
            && req.body.Address != null
            && req.body.SNo != null && isFinite(req.body.SNo)
            && req.body.Description != null && req.body.Description != ''
            && req.body.Latitude != null && req.body.Latitude != ''
            && req.body.Longitude != null && req.body.Longitude != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let All_Images_Data = await AdminController.Image_Data_From_ImageID_Array(req.body);
            let File_Data = await AdminController.Check_File_Data_From_FileID(req.body.FileID);
            let Result = await AdminController.Create_Plot(req.body, All_Images_Data, File_Data, ImageData);
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

AdminMediator.List_Subscriptions_Log = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_Subscriptions_Log(req.body);
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

AdminMediator.List_Subscriptions_Lite = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_Subscriptions_Lite(req.body);
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

AdminMediator.List_Subscriptions = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_Subscriptions(req.body);
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

AdminMediator.Update_Subscriptions = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Duration != null && req.body.Duration != ''
            && req.body.SubscriptionID != null && req.body.SubscriptionID != ''
            && req.body.Subscription_Amount != null && req.body.Subscription_Amount != ''
            && req.body.User_Subscription_Share != null && req.body.User_Subscription_Share != ''
            && req.body.Company_Subscription_Share != null && req.body.Company_Subscription_Share != ''
            && req.body.Trimmer_Subscription_Share != null && req.body.Trimmer_Subscription_Share != ''
            && req.body.Max_Receivers != null && req.body.Max_Receivers != ''
            && req.body.Max_Reward != null && req.body.Max_Reward != ''
            && req.body.Max_Wallet_Limit != null && req.body.Max_Wallet_Limit != ''
            && req.body.Subscription_Name != null && req.body.Subscription_Name != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && req.body.SNo != ''
            && req.body.DF_Ref != null && req.body.DF_Ref != ''
            && req.body.New_Pin != null
            && req.body.Delivery_Compulsory != null
            && req.body.Gift_Share != null && req.body.Gift_Share != ''
            && req.body.Level_One_Share != null && req.body.Level_One_Share != ''
            && req.body.Level_Two_Share != null && req.body.Level_Two_Share != ''
        ) {
            let Prodcut_Data = ""
            if (req.body.Delivery_Compulsory) {
                Prodcut_Data = await AdminController.Product_Details(req.body);
            }
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await AdminController.Add_Subscriptions_Validate_All(req.body);
            let Result = await AdminController.Update_Subscriptions(req.body, Prodcut_Data);
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

AdminMediator.Create_Subscriptions = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Duration != null && req.body.Duration != ''
            && req.body.Subscription_Amount != null && req.body.Subscription_Amount != ''
            && req.body.User_Subscription_Share != null && req.body.User_Subscription_Share != ''
            && req.body.Company_Subscription_Share != null && req.body.Company_Subscription_Share != ''
            && req.body.Trimmer_Subscription_Share != null && req.body.Trimmer_Subscription_Share != ''
            && req.body.Max_Receivers != null && req.body.Max_Receivers != ''
            && req.body.Max_Reward != null && req.body.Max_Reward != ''
            && req.body.Max_Wallet_Limit != null && req.body.Max_Wallet_Limit != ''
            && req.body.Subscription_Name != null && req.body.Subscription_Name != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && req.body.SNo != ''
            && req.body.DF_Ref != null && req.body.DF_Ref != ''
            // && req.body.New_Pin != null
            // && req.body.Delivery_Compulsory != null
            // && req.body.Gift_Share != null && req.body.Gift_Share != ''
            // && req.body.Level_One_Share != null && req.body.Level_One_Share != ''
            // && req.body.Level_Two_Share != null && req.body.Level_Two_Share != ''
        ) {
            let Prodcut_Data = ""
            if (req.body.Delivery_Compulsory) {
                Prodcut_Data = await AdminController.Product_Details(req.body);
            }
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await AdminController.Add_Subscriptions_Validate_All(req.body);

            let Result = await AdminController.Create_Subscriptions(req.body, Prodcut_Data);
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

AdminMediator.List_All_App_Image_Resource = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.ResourceType != null && isFinite(req.body.ResourceType)
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_App_Image_Resource(req.body);
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

AdminMediator.Edit_App_Image_Resource = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.ImageID != null
            && req.body.ResourceID != null
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let Result = await AdminController.Edit_App_Image_Resource(req.body, ImageData);
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

AdminMediator.Add_App_Image_Resource = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.ImageID != null
            && req.body.ResourceType != null && isFinite(req.body.ResourceType)
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let ValidityStatus = await AdminController.Add_App_Image_Resource_Validate_All(req.body);
            let Result = await AdminController.Add_App_Image_Resource(req.body, ImageData);
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

AdminMediator.Update_News = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null && req.body.NewsID != null
            && req.body.NewsID != null
            && req.body.Title != null && req.body.Title != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let NewsData = await CommonController.Check_for_News(req.body);
            let ValidityStatus = await AdminController.Update_News_Validate_All(req.body);
            let Result = await AdminController.Update_News(req.body);
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

AdminMediator.List_All_News = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_News(req.body);
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

AdminMediator.Add_News = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Title != null && req.body.Title != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await AdminController.Add_News_Validate_All(req.body);
            let Result = await AdminController.Add_News(req.body);
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

AdminMediator.Update_App_Version_Settings = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Android_Version != null && isFinite(req.body.Android_Version)
            && req.body.IOS_Version != null && isFinite(req.body.IOS_Version)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Update_App_Version_Settings(req.body);
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

AdminMediator.Fetch_App_Version_Settings = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Fetch_App_Version_Settings();
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


AdminMediator.Add_Guideline_Image = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.GuideLineID != null
            && req.body.ImageID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let GuideLineData = await CommonController.Check_for_GuideLine(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let Result = await AdminController.Add_Guideline_Image(req.body, ImageData);
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

AdminMediator.Remove_Guideline_Image = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.GuideLineID != null
            && req.body.ImageID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let GuideLineData = await CommonController.Check_for_GuideLine(req.body);
            let ImageData = await CommonController.Check_for_Image(req.body);
            let Result = await AdminController.Remove_Guideline_Image(req.body, ImageData);
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

AdminMediator.Edit_Guideline_Details = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.GuideLineID != null
            && req.body.Title != null && req.body.Title != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && isFinite(req.body.SNo)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let GuideLineData = await CommonController.Check_for_GuideLine(req.body);
            let Result = await AdminController.Edit_Guideline_Details(req.body);
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


AdminMediator.List_All_Guidelines = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_Guidelines(req.body);
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


AdminMediator.Create_Guideline = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Title != null && req.body.Title != ''
            && req.body.Description != null && req.body.Description != ''
            && req.body.SNo != null && isFinite(req.body.SNo)
            && req.body.All_ImageID_Array && typeof (req.body.All_ImageID_Array) == "object"
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let All_Images_Data = await AdminController.Create_Guideline_Validate_All_Params(req.body);
            let Result = await AdminController.Create_Guideline(req.body, All_Images_Data);
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

AdminMediator.Get_RECHARGE_DADDY_BALANCE = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let BalanceData = await RechargeDaddyController.Check_for_Balance();
            res.json({ success: true, extras: { Balance: BalanceData.BALANCE } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

AdminMediator.Get_MSG91_BALANCE = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let BalanceData = await MSG91Controller.Get_MSG91_BALANCE();
            res.json({ success: true, extras: { Balance: BalanceData } });
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }
}

AdminMediator.Edit_User_Phone_Number = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.CountryCode != null && req.body.CountryCode != ''
            && req.body.PhoneNumber != null && req.body.PhoneNumber != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await AdminController.Edit_User_Phone_Number_Validate_Registration_Date(req.body, UserData);
            ValidityStatus = await AdminController.Edit_User_Phone_Number_Validate_Phone_Number_Already_Exist(req.body);
            let Result = await AdminController.Edit_User_Phone_Number(req.body);
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

AdminMediator.Edit_User_Name = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Name != null && req.body.Name != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let Result = await AdminController.Edit_User_Name(req.body);
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

AdminMediator.List_All_Trimmer_Distribution_Yellow_Green_Royalty_Share_By_Date = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null && req.body.Date != ''
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Date_Validation(req.body.Date);
            let Result = await AdminController.List_All_Trimmer_Distribution_Yellow_Green_Royalty_Share_By_Date(req.body);
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

AdminMediator.List_All_Trimmer_Distribution_Yellow_Blue_Trimming_Share_By_Date = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null && req.body.Date != ''
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Date_Validation(req.body.Date);
            let Result = await AdminController.List_All_Trimmer_Distribution_Yellow_Blue_Trimming_Share_By_Date(req.body);
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

AdminMediator.List_All_Trimmer_Distribution_Company_Account_By_Date = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null && req.body.Date != ''
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Date_Validation(req.body.Date);
            let Result = await AdminController.List_All_Trimmer_Distribution_Company_Account_By_Date(req.body);
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

AdminMediator.List_All_Trimmer_Distribution_Logs_By_Date = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Date != null && req.body.Date != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Date_Validation(req.body.Date);
            let Result = await AdminController.List_All_Trimmer_Distribution_Logs_By_Date(req.body);
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

AdminMediator.List_all_Total_Trimmer_Distributions = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_all_Total_Trimmer_Distributions(req.body);
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

AdminMediator.Update_Bank_Transfer_Amount_Issue = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.TransactionID != null
            && req.body.Comment != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let TransactionData = await CommonController.Check_for_Bank_Transfer_Transaction(req.body);
            if (TransactionData.Transaction_Status == 1 || TransactionData.Transaction_Status == 3) {
                let Result = await UserController.Update_Bank_Transfer_Amount_Issue(req.body);
                res.json(Result);
            } else {
                throw { success: false, extras: { msg: ApiMessages.BANK_TRANSFER_TRANSACTION_ALREADY_TRANSFERRED } };
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

AdminMediator.Update_Bank_Transfer_Amount_Transferred = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.TransactionID != null
            && req.body.Transaction_Reference_ID != null
            && req.body.Comment != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let TransactionData = await CommonController.Check_for_Bank_Transfer_Transaction(req.body);
            if (TransactionData.Transaction_Status == 1 || TransactionData.Transaction_Status == 3) {
                let Result = await UserController.Update_Bank_Transfer_Amount_Transferred(req.body);
                res.json(Result);
            } else {
                throw { success: false, extras: { msg: ApiMessages.BANK_TRANSFER_TRANSACTION_ALREADY_TRANSFERRED } };
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

AdminMediator.List_All_User_Purchase_Pins = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Purchase_Pins(req.body);
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

AdminMediator.List_All_Bank_Transfers = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_Bank_Transfers(req.body);
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

AdminMediator.List_All_User_Bank_Transfers = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Bank_Transfers(req.body);
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

AdminMediator.List_All_User_Recharges = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Recharges(req.body);
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

AdminMediator.List_All_User_Failed_Recharges = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Failed_Recharges(req.body);
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

AdminMediator.List_All_User_Bank_Beneficiary_Accounts = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Bank_Beneficiary_Accounts(req.body);
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


AdminMediator.List_All_User_Friend_Transfers = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Friend_Transfers(req.body);
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

AdminMediator.List_All_Recharges = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_Recharges(req.body);
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

AdminMediator.List_All_Failed_Recharges = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_Failed_Recharges(req.body);
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

AdminMediator.List_All_Trimmer_Wallet_Logs = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_Trimmer_Wallet_Logs(req.body);
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

AdminMediator.List_All_Company_Wallet_Logs = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_Company_Wallet_Logs(req.body);
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

AdminMediator.List_All_User_Wallet_Logs = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.USERID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let UserData = await CommonController.Check_Only_User(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            let Result = await AdminController.List_All_User_Wallet_Logs(req.body);
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


AdminMediator.User_Network_Heirarchy = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Network_USERID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let NetworkUserData = await AdminController.User_Network_Heirarchy_Validate_Network_USERID(req.body);
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

AdminMediator.Search_All_Users_By_Phone_Number = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.SearchValue != null && req.body.SearchValue != ""
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Search_All_Users_By_Phone_Number(req.body);
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

AdminMediator.Search_All_Users_By_Name = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.SearchValue != null && req.body.SearchValue != ""
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Search_All_Users_By_Name(req.body);
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

AdminMediator.List_All_Users_with_Filters = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Whether_Date_Filter != null && isBoolean(req.body.Whether_Date_Filter)
            && req.body.Start_Date != null
            && req.body.End_Date != null
            && req.body.Whether_Status_Filter != null && isBoolean(req.body.Whether_Status_Filter)
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Validate_Dates_Filters(req.body);
            ValidityStatus = await AdminController.List_All_Users_with_Filters_Validate_Statuses(req.body);
            let Result = await AdminController.List_All_Users_with_Filters(req.body);
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

AdminMediator.List_All_Users = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_Users(req.body);
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

AdminMediator.Update_Password = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Old_Password != null && req.body.Old_Password != ''
            && req.body.New_Password != null && req.body.New_Password != ''
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Update_Password(req.body, AdminData);
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

AdminMediator.List_All_Admin_User = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.skip != null && isFinite(req.body.skip)
            && req.body.limit != null && isFinite(req.body.limit)
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_All_Admin_User(req.body);
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

AdminMediator.Create_Admin_User = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.Name != null && req.body.Name != ''
            && req.body.EmailID != null && req.body.EmailID != ''
            && req.body.Password != null && req.body.Password != ''
            && req.body.Admin_Section_Permision != null && isBoolean(req.body.Admin_Section_Permision)
        ) {
            let AdminData ='';
            // let AdminData = await CommonController.Check_for_Admin(req.body);
            let ValidityStatus = await CommonController.Common_Email_Validation(req.body.EmailID);
            ValidityStatus = await AdminController.Check_Whether_Admin_Email_Already_Exist(req.body);
            let Result = await AdminController.Create_Admin_User(req.body, AdminData);
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

AdminMediator.Login = async (req, res) => {
    try {
        if (
            req.body.EmailID != null && req.body.EmailID != ''
            && req.body.Password != null && req.body.Password != ''
        ) {
            let ValidityStatus = CommonController.Common_Email_Validation(req.body.EmailID);
            let AdminData = await AdminController.Check_Whether_Admin_Email_Registered(req.body);
            let Result = await AdminController.Login(req.body, AdminData);
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

AdminMediator.List_States = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
        ) {
            // let ImageData = await CommonController.Check_for_Image(req.body);
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.List_States(req.body);
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

AdminMediator.Edit_State = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.SNo != null && req.body.SNo != "" 
            && req.body.State_Name != null && req.body.State_Name !=""
            && req.body.StateID != null

        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let State_SNO = await AdminController.Check_For_State_SNo_Available(req.body);
            let Result = await AdminController.Edit_State(req.body);
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

AdminMediator.Add_State = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null,
            req.body.SNo != null && req.body.SNo != "" 
            && req.body.State_Name != null && req.body.State_Name !=""
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let State_SNO = await AdminController.Check_For_State_SNo_Available(req.body);
            let Result = await AdminController.Add_State(req.body);
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

AdminMediator.Activate_Inactivate_State = async (req, res) => {
    try {
        if (
            req.body.AdminID != null && req.body.SessionID != null
            && req.body.StateID != null
        ) {
            let AdminData = await CommonController.Check_for_Admin(req.body);
            let Result = await AdminController.Activate_Inactivate_State(req.body);
            res.json(Result);
        } else {
            throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
        }
    } catch (error) {
        if (!res.headersSent) {
            res.json(error);
        }
    }

    AdminMediator.Check_For_State_SNo_Available = async (req, res) => {
        try {
            if (
                req.body.AdminID != null && req.body.SessionID != null
                && req.body.SNo != null && isFinite(req.body.SNo) && !isNaN(req.body.SNo)
            ) {
                let AdminData = await CommonController.Check_for_Admin(req.body);
                let Result = await AdminController.Check_For_State_SNo_Available(req.body);
                res.json({ success: true, extras: { Status: Result } });
            } else {
                throw { success: false, extras: { msg: ApiMessages.ENTER_ALL_TAGS } };
            }
    
        } catch (error) {
            if (!res.headersSent) {
                res.json(await CommonController.Common_Error_Handler(error));
            }
        }
    }
}

export default AdminMediator;