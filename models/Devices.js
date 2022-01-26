import mongoose from 'mongoose';
const Devices = mongoose.Schema({
    ApiKey: { type: String, default: "" },
    DeviceID: { type: String, default: "" },
    DeviceType: { type: Number, default: 1 },//1. Android 2.IOS 3. WEB
    DeviceName: { type: String, default: "" },
    AppVersion: { type: Number, default: 0 },
    IPAddress: { type: String, default: "" },
    FCM_Token: { type: String, default: "" },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "Devices" });
export default mongoose.model('Devices', Devices);