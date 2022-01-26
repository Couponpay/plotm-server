import mongoose from 'mongoose';
const Day_Bank_log = mongoose.Schema({
    Day_Credit_Amount: { type: Number, default: 0 },
    Day_Withdrawn_Amount: { type: Number, default: 0 },
    Day_Total_Amount: { type: Number, default: 0 },  //day total amount =  Day_Credit_Amount - Day_Withdrawn_Amount
    Total_Amount: { type: Number, default: 0 }, //Total amount from starting
    Date: { type: Date, default: null }
}, { collection: "Day_Bank_log" });
export default mongoose.model('Day_Bank_log', Day_Bank_log);