import mongoose from 'mongoose';
const Installed_Devices = mongoose.Schema({
    DeviceID: { type: String, default: "" },
    DeviceType: { type: Number, default: 1 },//1. Android 2.IOS 3. Web
    DeviceName: { type: String, default: "" },
    AppVersion: { type: Number, default: 0 },
    IPAddress: { type: String, default: "" },
    InstallTime: { type: Date, default: Date.now() },
    Interval: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() }
}, { collection: "Installed_Devices" });
export default mongoose.model('Installed_Devices', Installed_Devices);