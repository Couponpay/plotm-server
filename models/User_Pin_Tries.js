import mongoose from 'mongoose';
const User_Pin_Tries = mongoose.Schema({
    USERID: { type: String, default: "" },
    Time: { type: Date, default: null }
}, { collection: "User_Pin_Tries" })
export default mongoose.model('User_Pin_Tries', User_Pin_Tries);