import mongoose from 'mongoose';
const Day_Sharing_Log = mongoose.Schema({
    Refferal_Amount: {type: Number, default: 0},
    Level_Amount: {type: Number, default: 0},
    Royality_Amount: {type: Number, default: 0},
    Company_Amount: {type: Number, default: 0},
    Total_Amount: {type: Number, default: 0}, // Refferal+Level+Royality+Company
    Date: { type: Date, default: null }
}, { collection: "Day_Sharing_Log" });
export default mongoose.model('Day_Sharing_Log', Day_Sharing_Log);