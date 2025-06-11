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
exports.sendMessage = exports.getMessages = exports.getUsersForSidebar = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const catchErrors_1 = require("../utils/catchErrors");
const http_1 = require("../constant/http");
const appAssert_1 = __importDefault(require("../utils/appAssert"));
const socket_1 = require("../lib/socket");
const mongoose_1 = __importDefault(require("mongoose"));
exports.getUsersForSidebar = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const loggedInUserId = req.user._id;
    // 1. Find all messages involving the logged-in user
    const messages = yield message_model_1.default.find({
        $or: [
            { senderId: loggedInUserId },
            { receiverId: loggedInUserId },
        ],
    }).sort({ createdAt: -1 });
    // 2. Get unique user IDs who have chatted with the logged-in user
    const userIdsSet = new Set();
    messages.forEach(msg => {
        if (msg.senderId.toString() !== loggedInUserId.toString()) {
            userIdsSet.add(msg.senderId.toString());
        }
        if (msg.receiverId.toString() !== loggedInUserId.toString()) {
            userIdsSet.add(msg.receiverId.toString());
        }
    });
    const userIds = Array.from(userIdsSet);
    // 3. Aggregate users with their last message
    const users = yield user_model_1.default.aggregate([
        {
            $match: { _id: { $in: userIds.map(id => new mongoose_1.default.Types.ObjectId(id)) } },
        },
        {
            $lookup: {
                from: "messages",
                let: { otherUserId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: ["$senderId", loggedInUserId] },
                                            { $eq: ["$receiverId", "$$otherUserId"] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $eq: ["$senderId", "$$otherUserId"] },
                                            { $eq: ["$receiverId", loggedInUserId] },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                ],
                as: "lastMessage",
            },
        },
        {
            $addFields: {
                lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
            },
        },
        {
            $sort: {
                "lastMessage.createdAt": -1,
            },
        },
        {
            $project: {
                password: 0,
            },
        },
    ]);
    res.status(http_1.OK).json(users);
}));
exports.getMessages = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userToChatId } = req.params;
    (0, appAssert_1.default)(userToChatId, http_1.BAD_REQUEST, "User ID to chat with is required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    const myId = req.user._id;
    const messages = yield message_model_1.default.find({
        $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
        ],
    });
    res.status(http_1.OK).json(messages);
}));
exports.sendMessage = (0, catchErrors_1.catchErrors)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, image } = req.body;
    (0, appAssert_1.default)(text || image, http_1.BAD_REQUEST, "Text or image is required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    const { id: receiverId } = req.params;
    (0, appAssert_1.default)(receiverId, http_1.BAD_REQUEST, "Receiver ID is required", "MISSING_FIELD" /* AppErrorCode.MissingField */);
    const senderId = req.user._id;
    let imageUrl;
    if (image) {
        // Upload base64 image to cloudinary
        const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new message_model_1.default({
        senderId: senderId,
        receiverId,
        text: text,
        image: imageUrl,
    });
    //Last massage save of each user
    // const senderUser = await User.findOne(senderId);
    // const receiverUser = await User.findOne(receiverId);
    yield newMessage.save();
    // Emit the new message to the receiver's socket
    const receiverSocketId = (0, socket_1.getSocketIdByUserId)(receiverId);
    socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
    socket_1.io.to(receiverSocketId).emit("refreshSidebar");
    res.status(http_1.CREATED).json(newMessage);
}));
