import mongoose from 'mongoose';
const Day_Pins_Log = mongoose.Schema({
    Created_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 },
        AutoID: { type: Number, default: 0 }
    },
    Used_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 }
    },
    Balance_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 }
    },
    Total_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 },
        AutoID: { type: Number, default: 0 }
    },
    Total_Balance_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 }
    },
    Total_Used_Pins: {
        Pin10: { type: Number, default: 0 },
        Pin100: { type: Number, default: 0 },
        Pin1000: { type: Number, default: 0 },
        Pin10000: { type: Number, default: 0 },
        PinFree: { type: Number, default: 0 },
        PinShop: { type: Number, default: 0 }
    },
    // Total_OverAll_Pins: {
    //     Pin10: { type: Number, default: 0 },
    //     Pin100: { type: Number, default: 0 },
    //     Pin1000: { type: Number, default: 0 },
    //     Pin10000: { type: Number, default: 0 },
    //     PinFree: { type: Number, default: 0 },
    //     PinShop: { type: Number, default: 0 }
    // },
    Date: { type: Date, default: null }
}, { collection: "Day_Pins_Log" });
export default mongoose.model('Day_Pins_Log', Day_Pins_Log);