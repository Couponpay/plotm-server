import express from "express";
import AdminMediator from "../mediators/AdminMediator";
const router = express.Router();

router.post('/Login', AdminMediator.Login);

router.post('/Create_Admin_User', AdminMediator.Create_Admin_User);

router.post('/List_All_Admin_User', AdminMediator.List_All_Admin_User);

router.post('/Update_Password', AdminMediator.Update_Password);

router.post('/List_All_Users', AdminMediator.List_All_Users);

router.post('/List_All_Users_with_Filters', AdminMediator.List_All_Users_with_Filters);

router.post('/Edit_User_Name', AdminMediator.Edit_User_Name);

router.post('/Edit_User_Phone_Number', AdminMediator.Edit_User_Phone_Number);

router.post('/Search_All_Users_By_Name', AdminMediator.Search_All_Users_By_Name);

router.post('/Search_All_Users_By_Phone_Number', AdminMediator.Search_All_Users_By_Phone_Number);

router.post('/User_Network_Heirarchy', AdminMediator.User_Network_Heirarchy);

router.post('/List_All_User_Wallet_Logs', AdminMediator.List_All_User_Wallet_Logs);

router.post('/List_All_Company_Wallet_Logs', AdminMediator.List_All_Company_Wallet_Logs);

router.post('/List_All_Trimmer_Wallet_Logs', AdminMediator.List_All_Trimmer_Wallet_Logs);

router.post('/List_All_Failed_Recharges', AdminMediator.List_All_Failed_Recharges);

router.post('/List_All_User_Friend_Transfers', AdminMediator.List_All_User_Friend_Transfers);

router.post('/List_All_User_Bank_Beneficiary_Accounts', AdminMediator.List_All_User_Bank_Beneficiary_Accounts);

router.post('/List_All_Recharges', AdminMediator.List_All_Recharges);

router.post('/List_All_User_Recharges', AdminMediator.List_All_User_Recharges);

router.post('/List_All_User_Bank_Transfers', AdminMediator.List_All_User_Bank_Transfers);

router.post('/List_All_Bank_Transfers', AdminMediator.List_All_Bank_Transfers);

router.post('/List_All_User_Purchase_Pins', AdminMediator.List_All_User_Purchase_Pins);

router.post('/List_All_User_Failed_Recharges', AdminMediator.List_All_User_Failed_Recharges);

// router.post('/Update_Bank_Transfer_Amount_Transferred', AdminMediator.Update_Bank_Transfer_Amount_Transferred);

// router.post('/Update_Bank_Transfer_Amount_Issue', AdminMediator.Update_Bank_Transfer_Amount_Issue);


router.post('/List_all_Total_Trimmer_Distributions', AdminMediator.List_all_Total_Trimmer_Distributions);

router.post('/List_All_Trimmer_Distribution_Logs_By_Date', AdminMediator.List_All_Trimmer_Distribution_Logs_By_Date);

router.post('/List_All_Trimmer_Distribution_Company_Account_By_Date', AdminMediator.List_All_Trimmer_Distribution_Company_Account_By_Date);

router.post('/List_All_Trimmer_Distribution_Yellow_Blue_Trimming_Share_By_Date', AdminMediator.List_All_Trimmer_Distribution_Yellow_Blue_Trimming_Share_By_Date);

router.post('/List_All_Trimmer_Distribution_Yellow_Green_Royalty_Share_By_Date', AdminMediator.List_All_Trimmer_Distribution_Yellow_Green_Royalty_Share_By_Date);

router.post('/Get_MSG91_BALANCE', AdminMediator.Get_MSG91_BALANCE);

router.post('/Get_RECHARGE_DADDY_BALANCE', AdminMediator.Get_RECHARGE_DADDY_BALANCE);

router.post('/Create_Guideline', AdminMediator.Create_Guideline);

router.post('/List_All_Guidelines', AdminMediator.List_All_Guidelines);

router.post('/Edit_Guideline_Details', AdminMediator.Edit_Guideline_Details);

router.post('/Remove_Guideline_Image', AdminMediator.Remove_Guideline_Image);

router.post('/Add_Guideline_Image', AdminMediator.Add_Guideline_Image);

router.post('/Fetch_App_Version_Settings', AdminMediator.Fetch_App_Version_Settings);

router.post('/Update_App_Version_Settings', AdminMediator.Update_App_Version_Settings);

router.post('/Add_News', AdminMediator.Add_News);

router.post('/List_All_News', AdminMediator.List_All_News);

router.post('/Update_News', AdminMediator.Update_News);

router.post('/Add_App_Image_Resource', AdminMediator.Add_App_Image_Resource);

router.post('/Edit_App_Image_Resource', AdminMediator.Edit_App_Image_Resource);

router.post('/List_All_App_Image_Resource', AdminMediator.List_All_App_Image_Resource);

//////////////////pj code below

router.post('/Create_Subscriptions', AdminMediator.Create_Subscriptions);

router.post('/Update_Subscriptions', AdminMediator.Update_Subscriptions);

router.post('/List_Subscriptions', AdminMediator.List_Subscriptions);

router.post('/List_Subscriptions_Lite', AdminMediator.List_Subscriptions_Lite);

router.post('/List_Subscriptions_Log', AdminMediator.List_Subscriptions_Log);

router.post('/Create_Plot', AdminMediator.Create_Plot);

router.post('/Activate_Inactivate_Plot', AdminMediator.Activate_Inactivate_Plot);

router.post('/List_All_Plots', AdminMediator.List_All_Plot);

router.post('/Create_YouTube_Add', AdminMediator.Create_YouTube_Add);

router.post('/Activate_Inactivate_YouTube_Add', AdminMediator.Activate_Inactivate_YouTube_Add);

router.post('/List_All_YouTube_Add', AdminMediator.List_All_YouTube_Add);

router.post('/Edit_Plot', AdminMediator.Edit_Plot);

router.post('/Edit_YouTube_Add', AdminMediator.Edit_YouTube_Add);

router.post('/Activate_Inactivate_Subscription', AdminMediator.Activate_Inactivate_Subscriptions);

router.post('/Activate_Inactivate_News', AdminMediator.Activate_Inactivate_News);

router.post('/Remove_Plot_Image', AdminMediator.Remove_Plot_Image);

router.post('/Remove_Resource_Image', AdminMediator.Remove_Resource_Image);

router.post('/Generate_Free_Pins', AdminMediator.Generate_Free_Pins);

router.post('/List_All_Free_Pins', AdminMediator.List_All_Free_Pins);

router.post('/Pins_Day_Report', AdminMediator.Pins_Day_Report);

router.post('/Bank_Day_Report', AdminMediator.Bank_Day_Report);

router.post('/Sharing_Day_Report', AdminMediator.Sharing_Day_Report);

router.post('/User_Level_Report', AdminMediator.User_Level_Report);

router.post('/Clear_User_Data', AdminMediator.Clear_User_Data);

router.post('/Refund_For_Black_Accounts', AdminMediator.Refund_For_Black_Accounts);

router.post('/All_Users_Wallet_Balance', AdminMediator.All_Users_Wallet_Balance);

//new API added Raj
router.post('/Create_Gift_Meter', AdminMediator.Create_Gift_Meter);

router.post('/Edit_Gift_Meter', AdminMediator.Edit_Gift_Meter);

router.post('/List_Gift_Meter', AdminMediator.List_Gift_Meter);

router.post('/Add_Product', AdminMediator.Add_Product);

router.post('/Edit_Product', AdminMediator.Edit_Product);

router.post('/List_Products', AdminMediator.List_Products);

router.post('/List_Orders', AdminMediator.List_Orders);

router.post('/Change_Order_Status', AdminMediator.Change_Order_Status);  //Accepted Delivered Canceled

router.post('/Apr_Rej_Adverstisement', AdminMediator.Apr_Rej_Adverstisement); 

router.post('/Check_For_GM_SNo_Available', AdminMediator.Check_For_GM_SNo_Available);

router.post('/Check_For_Prod_SNo_Available', AdminMediator.Check_For_Prod_SNo_Available);

router.post('/Active_Inactive_Product', AdminMediator.Active_Inactive_Product);

router.post('/Active_Inactive_Gift_Meter', AdminMediator.Active_Inactive_Gift_Meter);


//States Section
router.post('/Add_State', AdminMediator.Add_State);

router.post('/Edit_State', AdminMediator.Edit_State);

router.post('/List_States', AdminMediator.List_States);

router.post('/Activate_Inactivate_State', AdminMediator.Activate_Inactivate_State);

export default router;