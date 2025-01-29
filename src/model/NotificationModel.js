import mongoose from "mongoose";
const NotificationSchema=new mongoose.Schema({
    message:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type: { type: String, enum: ["critical", "non-critical"], required: true ,default:"non-critical"},
    status:{
        type:String,
        required:true,
        enum:["delivered","pending"],
        default:"pending"
    },
    sent:{
        type:String,
        required:true
    },
    received:{
        type:String
    }
    

});
export const NotificationModel=mongoose.model("Notification",NotificationSchema);