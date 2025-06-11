"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOULDINARY_CLOUD_NAME,
    api_key: process.env.CLOULDINARY_API_KEY,
    api_secret: process.env.CLOULDINARY_API_SECRET,
});
exports.default = cloudinary_1.v2;
