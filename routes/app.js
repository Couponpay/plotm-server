import express from "express";
import DeviceMediator from "../mediators/DeviceMediator";
import UserMediator from "../mediators/UserMediator";
import UserController from "../controllers/UserController";
const router = express.Router();

/*********
 * 
 * Common for mobile applications and web order dashboard
 * 
 */

router.post('/Generate_Device_ID', DeviceMediator.Generate_Device_ID);

router.post('/Splash_Screen', DeviceMediator.Splash_Screen);

router.post('/Generate_User_OTP', UserMediator.Generate_User_OTP);

router.post('/Validate_User_OTP', UserMediator.Validate_User_OTP);

router.post('/Validate_User_Password', UserMediator.Validate_User_Password);

router.post('/User_Add_Amount_From_Razorpay_To_Wallet', UserMediator.User_Add_Amount_From_Razorpay_To_Wallet);

router.post('/Validate_Referral_Phone_Number', UserMediator.Validate_Referral_Phone_Number);

router.post('/Register_User_With_Subscription', UserMediator.Register_User_With_Subscription); //edited this is direct referal process

router.post('/User_Home_Screen_Details', UserMediator.User_Home_Screen_Details); //edited

//router.post('/User_Purchase_Pins', UserMediator.User_Purchase_Pins);

router.post('/List_all_Available_Pins', UserMediator.List_all_Available_Pins); //edited

router.post('/List_all_Used_Pins', UserMediator.List_all_Used_Pins); //edited

router.post('/Validate_User_Pin_Add_Money_To_Wallet', UserMediator.Validate_User_Pin_Add_Money_To_Wallet);

router.post('/User_Network_Heirarchy', UserMediator.User_Network_Heirarchy);

router.post('/Fetch_User_Wallet_Information', UserMediator.Fetch_User_Wallet_Information);

router.post('/List_All_User_Wallet_Logs', UserMediator.List_All_User_Wallet_Logs);

router.post('/Fetch_Phone_Number', UserMediator.Fetch_Phone_Number);

router.post('/Transfer_Amount_To_Friend', UserMediator.Transfer_Amount_To_Friend);

router.post('/List_All_Friend_Money_Transfers', UserMediator.List_All_Friend_Money_Transfers);

router.post('/Validate_IFSC_Code', UserMediator.Validate_IFSC_Code);

router.post('/User_Add_Beneficiary_Account', UserMediator.User_Add_Beneficiary_Account_for_Bank_Account);

router.post('/Validate_UPI_ID', UserMediator.Validate_UPI_ID);

router.post('/User_Add_Beneficiary_Account_for_UPI_ID', UserMediator.User_Add_Beneficiary_Account_for_UPI_ID);

router.post('/List_All_Beneficiary_Accounts', UserMediator.List_All_Beneficiary_Accounts);

router.post('/User_Amount_Transfer_To_Bank', UserMediator.User_Amount_Transfer_To_Bank);

router.post('/List_All_Bank_Transfers', UserMediator.List_All_Bank_Transfers);

router.post('/User_Recharge_Mobile', UserMediator.User_Recharge_Mobile);

router.post('/List_All_Recharges', UserMediator.List_All_Recharges);

router.get('/buytm.pdf', UserMediator.Get_PDF_Tutorial);

router.post('/List_All_Guidelines', UserMediator.List_All_Guidelines);

router.post('/List_All_News', UserMediator.List_All_News);

router.post('/List_All_App_Image_Resource', UserMediator.List_All_App_Image_Resource);

router.post('/User_Purchase_Shop_Pins', UserMediator.User_Purchase_Shop_Pins);

router.post('/List_all_Available_Shop_Pins', UserMediator.List_all_Available_Shop_Pins);

router.post('/List_all_Used_Shop_Pins', UserMediator.List_all_Used_Shop_Pins);

router.post('/Validate_Shop_Pin_Add_Money_To_Wallet', UserMediator.Validate_Shop_Pin_Add_Money_To_Wallet);

router.post('/Register_Shop_with_Subscription', UserMediator.Register_Shop_with_Subscription); // edited

router.post('/Update_Shop_Information', UserMediator.Update_Shop_Information); // edited

////pj edit

router.post('/Pincode', UserMediator.Pincode);

router.post('/List_All_Subscriptions', UserMediator.List_All_Subscriptions);

router.post('/User_Pins_Request', UserMediator.User_Pins_Request);

router.post('/User_Pins_Purchase', UserMediator.User_Pins_Purchase);

router.post('/Register_User', UserMediator.Register_User);

router.post('/User_Subscription', UserMediator.User_Subscription);

router.post('/List_All_Active_Plots', UserMediator.List_All_Active_Plots);

router.post('/Fetch_Single_Plot', UserMediator.Fetch_Single_Plot);

router.post('/Fetch_YouTube_Ad', UserMediator.Fetch_YouTube_Ad);

router.post('/List_All_Shops', UserMediator.List_All_Shops);

router.post('/Shop_Upgrade', UserMediator.Shop_Upgrade);

router.post('/List_User_Expired_Amount_Log', UserMediator.List_User_Expired_Amount_Log);

router.post('/Validate_Direct_Ref_OTP', UserMediator.Validate_Direct_Ref_OTP);

router.post('/User_Amount_Transfer_To_Shop', UserMediator.User_Amount_Transfer_To_Shop);

router.post('/Search_For_Shop_With_PhoneNumber', UserMediator.Search_For_Shop_With_PhoneNumber);

router.post('/List_All_Generated_Bills', UserMediator.List_All_Generated_Bills);

router.post('/Create_User_Password', UserMediator.Create_User_Password);

router.post('/Update_User_Password', UserMediator.Update_User_Password);

router.post('/Reset_User_Password', UserMediator.Reset_User_Password);

router.post('/Inactive_Address', UserMediator.Inactive_Address);

router.post('/Add_Address', UserMediator.Add_Address);

router.post('/Edit_Address', UserMediator.Edit_Address);

router.post('/List_Address', UserMediator.List_Address);

router.post('/Place_Order', UserMediator.Place_Order);

router.post('/List_Products', UserMediator.List_Products);

router.post('/Add_Advertisement', UserMediator.Add_Advertisement);

router.post('/Orders_History', UserMediator.Orders_History);

router.post('/Advertisements_History', UserMediator.Advertisements_History);

router.post('/List_Gift_Meter', UserMediator.List_Gift_Meter);

router.post('/Fetch_User_Royality_Information', UserMediator.Fetch_User_Royality_Information);

router.post('/Withdraw_gift_meter', UserMediator.Withdraw_gift_meter);

router.post('/Withdraw_Roaylty_Amt', UserMediator.Withdraw_Roaylty_Amt);

router.post('/List_Subscription_Productgg', UserMediator.List_Subscription_Product);

router.post('/Transfer_Wallet',UserMediator.Transfer_Wallet);

router.post('/Validate_Transfer_OTP', UserMediator.Validate_Transfer_OTP);




// router.post('/Edit_Advertisement', UserMediator.Edit_Advertisement);



export default router;