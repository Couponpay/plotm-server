let config = function () { };

//Common App Settings
config.Min_Advertisement_Amount = 100; //minimum Ad Amount
config.Adv_View_Cost = 1;  //1 view == Rs1
config.New_Purchase_Pin_Amount = 10;
config.New_Subscription_Amount = 10;
config.Renewal_Subscription_Amount = 10;
config.max_referral_account_setting = 10;
config.max_referral_account_difference_days = 20;
config.max_user_network_heirarchy = 100;
config.no_of_user_subscription_share = 11; //first index user will be removed
config.User_Subscription_Share = 70;//70%
config.Company_Subscription_Share = 20;//20%
config.Trimmer_Subscription_Share = 10;//10%

config.Trimmer_Company_Accounts_Share_Distribution = 40//40% donot delete this
config.Trimmer_Yellow_Blue_Share_Distribution = 30//30% (2,3)status
config.Trimmer_Yellow_Green_Share_Distribution = 30//30% (2,4)status
config.Trimmer_Company_Share_Distribution = 30//30% donot delete this 
config.Day_Share_Distribution = 30//30% donot delete this 
config.YELLOW_BLUE_CONVERSION_TO_GREEN_PURPLE_STATUS_AMOUNT_LIMIT = 100;
config.no_of_user_yellow_blue_conversion_trimmer_share = 11; //first index user will be removed
config.User_Trimmer_Share = 70;//70%
config.Company_Trimmer_Share = 20;//20%
config.Trimmer_Trimmer_Share = 10;//10%
config.min_bank_transfer_amount = 1000; //Rs.1000
config.max_bank_transfer_amount = 50000; //Rs.50000
config.Friend_Money_Transfer_After_Commissioned = 80; //80%
config.MAX_HOURS_FOR_EDITING_PHONE_NUMBER = 120;
config.NEWS_LIMIT = 10;
config.News_Title_Length = 160;
config.News_Description_Length = 260;
config.Subscription_Title_Length = 10;
config.Subscription_Description_Length = 60;
config.SMALL_BANNERS_LIMIT = 10;
config.BIG_BANNERS_LIMIT = 10;
config.SMALL_ICONS_LIMIT = 10;
config.UPI_REGEX_FORMAT = /^\w+@\w+$/;
config.Transfer_Amount_From_User_To_Shop_Company_Bonus = 2; //2%

//Shop
config.New_Purchase_Shop_Pin_Amount = 2000;
config.New_Shop_Subscription_Amount = 2000;
config.Shop_GST_Percentage = 18; // not using
config.Referral_Bonus_Amount = 25; // 25%
config.Users_Distribution_Amount = 5; // 5%
config.Company_Share_Amount = 20; // 20%



//Body Parser Limit
config.BodyParserLimit = '2mb';

//User OTP Tries and OTP Request
config.OTP_COUNT = 4;
config.OTP_TRIES_COUNT = 4;
config.PIN_TRIES_COUNT = 10;
config.OTP_COUNT_TIME_IN_MINUTES = 30
config.OTP_TRIES_COUNT_TIME_IN_MINUTES = 30
config.PURCHASE_PIN_TRIES_COUNT_TIME_IN_MINUTES = 30

//Date Time Format
config.Take_Date_Time_Format = 'DD-MM-YYYY HH:mm:ss';
config.Take_Date_Format = 'DD-MM-YYYY';

config.Common_Date_Time_Format = 'DD-MM-YYYY, HH:mm:ss A';
config.Common_Date_Format = 'DD-MM-YYYY';
config.Common_Time_Format = 'HH:mm:ss';

//Upload Limit Size
config.Image_Size = 5 * 1024 * 1024;

//File Size
config.File_Size = 5 * 1024 * 1024;

config.firebase = {
    serverkey: "AAAAZRfSKDA:APA91bHmpxFoeqJBCjUm5wzMEkDTqRHPJC-6T7Dd5s-LOkyY1MW7nunBqeuYB_ShXCSS9Oa33K1OAY3gdYx1QlkNL5Rf6nU0Qs10vEAv4ueYM1P_1ZJnIqTjDpF60MeRmXkKrlVfE6Xp"
};

//GoogleCredential

config.Google = {
    "key": "AIzaSyAXJQ218iBxDg8jQf8iUVnXP95FbfDIzQE", //Octopus
    "reverse_geocode_url": "https://maps.googleapis.com/maps/api/geocode/json?",
    "text_search_url": "https://maps.googleapis.com/maps/api/place/textsearch/json?"
}


//AWS Credentials
config.S3Region = "ap-south-1";
config.S3AccessKey = "AKIATQR42DYPEDH5DQFX";
config.S3Secret = "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";
config.S3Bucket = "cbsagiam";
config.S3URL = "https://cbsagiam.s3.ap-south-1.amazonaws.com/"

config.AWS = {
    S3Region: "ap-south-1",
    S3AccessKey: "AKIATQR42DYPEDH5DQFX",  // Studentx
    S3Secret: "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",
    S3Bucket: "cbsagiam",
    S3URL: "https://cbsagiam.s3.ap-south-1.amazonaws.com/"
};


//MSG91 Credentials
config.msg91 = {
    "host": "http://control.msg91.com/api/",
    "authkey": "353785AdboEgarbV602151f6P1",
    "sender_id": "ONEMOR",
    "route_no": "4",
    "otp_template_id": "606afba78f0f9f7d9968673a",
    "baseURL": 'https://api.msg91.com/api'

}

//Admin Dashboard Config
config.AdminID = 'ADMIN123456789-0123456789-ADMIN123456789';
config.SessionID = 'SESSION123456789-0123456789-SESSION123456789';

//Application Secret Credentials
config.SECRETCODE = "EDFGJS-DHSHAJ-DASHJDJH-DHJSGAJH";
config.SECRET_OTP_CODE = '9039';
config.SECRET_SESSIONID = 'TESTING123';

//RechargeDaddy
config.RechargeDaddy = {
    host: "https://www.rechargedaddy.in/RDRechargeAPI/RechargeAPI.aspx",
    MobileNo: "6300542977",
    APIKey: "QAJDgHvJ2sbGfZ0V4N6c0MJuqWkqvA3dUAr",
    RESPTYPE: "JSON"
};

//QuickRecharge
config.QuickRecharge = {
    host: 'https://www.quickrecharge.in/Money_newApi',
    api_key: 'UUgyZUh1NGtsSmlPYStOc3VaVVB0d3ZFdkVlODhVTFZFaS91c2NYclRIQT0=',
    Customer_Mobile: "6300542977",
    Customer_Password: "6300542977",
    Customer_Pin: "33148"
}

//RazorpayX Transaction Statuses
config.Razorpay_Transaction_Data = [
    {
        Transaction_Status: 1,
        Comment: "transaction queued",
        status: "queued"
    },
    {
        Transaction_Status: 2,
        Comment: "transaction processed",
        status: "processed"
    },
    {
        Transaction_Status: 3,
        Comment: "transaction issued",
        status: "issued"
    },
    {
        Transaction_Status: 4,
        Comment: "transaction initiated",
        status: "processing"
    },
    {
        Transaction_Status: 5,
        Comment: "transaction reversed",
        status: "reversed"
    },
    {
        Transaction_Status: 6,
        Comment: "transaction created",
        status: "processing"
    },
    {
        Transaction_Status: 7,
        Comment: "transaction cancelled",
        status: "cancelled"
    }
];


/***************************
 * 
 * Server Setting for Production and Development
 * 
 * **********************************************************/

config.Whether_Production_Settings = false;
if (config.Whether_Production_Settings) {
    //Production Settings
    config.host = 'https://apidh.mobilerechargeapp.net/';
    config.for_req_coupon_bazaar = 'https://apicb.mobilerechargeapp.net/';


    
    //ports
    config.api_port = 8001;
    config.admin_port = 8002;
    config.web_port = 8003;
    config.MongoURL = `mongodb+srv://newdb:newdb@cluster0.yo4d2.mongodb.net/dreamhouse?retryWrites=true&w=majority`;
    // config.razorpay = {
    //     host: "api.razorpay.com/v1",
    //     baseURL: "https://api.razorpay.com/v1",
    //     merchant_id: "90ry5yGtvC1t87",
    //     key_id: "rzp_test_9l3EqlOTuUOOlq",
    //     key_secret: "sX9qF0nQ1KkjCccogUdKLLDj",
    //     razorpayx_account_number: "7878780043771557",
    //     webhook_secret: "indian153"
    // }

    config.razorpay = {
        host: "api.razorpay.com/v1",
        baseURL: "https://api.razorpay.com/v1",
        merchant_id: "90ry5yGtvC1t87",
        key_id: "rzp_live_KMjigiMmgv0osg",
        key_secret: "zYnbxYaHJs582SVnERIxSuZ7",
        razorpayx_account_number: "7878780043771557",
        webhook_secret: "indian153"
    }
    // config.razorpay = {
    //     host: "api.razorpay.com/v1",
    //     baseURL: "https://api.razorpay.com/v1",
    //     merchant_id: "90ry5yGtvC1t87",
    //     key_id: "rzp_test_AuTnPHfpr3fGwU",
    //     key_secret: "3bEP7iulA8cvddFnXypmK7Sx",
    //     razorpayx_account_number: "7878780043771557",
    //     webhook_secret: "indian153"
    // }
} else {
    //Testing Settings
    config.host = 'https://xapidh.mobilerechargeapp.net';
    //ports
    config.api_port = 6001;
    config.admin_port = 6002;
    config.web_port = 6003;
    config.MongoURL = `mongodb+srv://newdb:newdb@cluster0.yo4d2.mongodb.net/dreamhouse?retryWrites=true&w=majority`;
    config.razorpay = {
        host: "api.razorpay.com/v1",
        baseURL: "https://api.razorpay.com/v1",
        merchant_id: "90ry5yGtvC1t87",
        key_id: "rzp_test_AuTnPHfpr3fGwU",
        key_secret: "3bEP7iulA8cvddFnXypmK7Sx",
        razorpayx_account_number: "7878780043771557",
        webhook_secret: "indian153"
    }
}

export default config;