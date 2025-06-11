import mongoose from "mongoose";

export interface UserDocument extends Document {
  email: string;
  fullName: string;
  password: string;
  profilePicture?: string;
}
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // lastMessage:{
    //   type:mongoose.Schema.Types.ObjectId,
    //   ref:"Message",
    //   defailt:"No massage Found"
    // }
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
