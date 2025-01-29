import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },
      password: {
        type: String,
        required: true,
      },
      role:{
        type:String,
        required:true,
        default:"user",
        enum:["user","admin"]
      },
      mobileNumber: {
        type: String,
        required: false,
      },
      bio: {
        type: String,
        required: false,
      },
      availabilityTime: [
        {
          from: {
            type: String, 
            required: true,
          },
          to: {
            type: String, 
            required: true,
          },
        },
      ],
},{timestamps:true});
export const UserModel=mongoose.model("User",userSchema)