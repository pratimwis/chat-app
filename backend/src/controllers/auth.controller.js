"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.updateProfileController = exports.signOutController = exports.signInController = exports.signUpController = void 0;
const http_1 = require("../constant/http");
const user_model_1 = __importDefault(require("../models/user.model"));
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const catchErrors_1 = require("../utils/catchErrors");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwtToken_1 = require("../utils/jwtToken");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
exports.signUpController = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, fullName, password } = req.body;
    (0, appAssert_1.default)(email && fullName && password, http_1.BAD_REQUEST, "All field are required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    (0, appAssert_1.default)(password.length >= 6, http_1.BAD_REQUEST, "Password must be at least 6 characters", "INVALID_PASSWORD" /* AppErrorCode.InvalidPassword */);
    const user = yield user_model_1.default.findOne({ email });
    (0, appAssert_1.default)(!user, http_1.BAD_REQUEST, "User already exists", "USER_ALREADY_EXISTS" /* AppErrorCode.UserAlreadyExists */);
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = new user_model_1.default({
        email,
        fullName,
        password: hashedPassword,
    });
    //Genarate jwt token
    (0, jwtToken_1.genarateToken)(newUser._id.toString(), res);
    yield newUser.save();
    res
        .status(http_1.CREATED)
        .json({ message: "Sign In successful", success: true, user: newUser });
}));
exports.signInController = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    (0, appAssert_1.default)(email && password, http_1.BAD_REQUEST, "All field are required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    const user = yield user_model_1.default.findOne({ email });
    (0, appAssert_1.default)(user, http_1.NOT_FOUND, "User does not exist", "USER_NOT_FOUND" /* AppErrorCode.UserNotFound */);
    const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
    (0, appAssert_1.default)(isPasswordMatch, http_1.BAD_REQUEST, "Password is incorrect", "PASSWORD_MISMATCH" /* AppErrorCode.PasswordMismatch */);
    //Genarate jwt token
    (0, jwtToken_1.genarateToken)(user._id.toString(), res);
    res.status(http_1.OK).json({ message: "Sign In successful", success: true, user });
}));
exports.signOutController = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(http_1.OK).json({ message: "Sign out successful", success: true });
}));
exports.updateProfileController = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { profilePicture } = req.body;
    (0, appAssert_1.default)(profilePicture, http_1.BAD_REQUEST, "Profile picture is required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    const uploadedResponse = yield cloudinary_1.default.uploader.upload(profilePicture);
    (0, appAssert_1.default)(uploadedResponse && uploadedResponse.secure_url, http_1.BAD_REQUEST, "Failed to upload profile picture", "UPLOAD_FAILED" /* AppErrorCode.UploadFailed */);
    const userId = req.user._id;
    const user = yield user_model_1.default.findByIdAndUpdate(userId, { profilePicture: uploadedResponse.secure_url }, { new: true, runValidators: true });
    res.status(http_1.OK).json({ message: "Profile updated successfully", success: true, user });
}));
exports.checkAuth = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    (0, appAssert_1.default)(user, http_1.NOT_FOUND, "User not found", "USER_NOT_FOUND" /* AppErrorCode.UserNotFound */);
    res.status(http_1.OK).json({ message: "User is authenticated", success: true, user });
}));
