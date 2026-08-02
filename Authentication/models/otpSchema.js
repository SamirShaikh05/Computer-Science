import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    otpHash:{
        type:String,
        required:true
    }
}, {timestamps:true})

const otpModel = mongoose.model("otps", otpSchema);

export default otpModel;