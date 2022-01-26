import mongoose from 'mongoose';
const Product = mongoose.Schema({
    Product_ID: { type: String, default: "" },
    S_NO: { type: Number, default: 0 },
    Product_Name: {type:String, default: ""},
    Product_Price: {type: Number, default: 0},
    Product_Image_Available: { type: Boolean, default: false },
    Product_Image_Data: {
        ImageID: { type: String, default: "" },
        Image50: { type: String, default: "" },
        Image100: { type: String, default: "" },
        Image250: { type: String, default: "" },
        Image550: { type: String, default: "" },
        Image900: { type: String, default: "" },
        ImageOriginal: { type: String, default: "" }
    },
    Description : { type: String, default: "" },
    
    Status: { type: Boolean, default: true },
    created_at: { type: Date, default: null },
    updated_at: { type: Date, default: null }
}, { collection: "Product" });
export default mongoose.model('Product', Product);