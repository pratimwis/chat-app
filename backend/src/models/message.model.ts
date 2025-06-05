import mongoose from "mongoose";
import { text } from "stream/consumers";

const messageSchema = new mongoose.Schema({
    serderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "",    
    },
},{timestamps: true});