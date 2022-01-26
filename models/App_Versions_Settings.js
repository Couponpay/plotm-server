import mongoose from 'mongoose';
const App_Versions_Settings = mongoose.Schema({
    Android_Version: { type: Number, default: 1 },
    IOS_Version: { type: Number, default: 1 }
}, { collection: "App_Versions_Settings" });
export default mongoose.model('App_Versions_Settings', App_Versions_Settings);