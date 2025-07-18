import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { catchErrors } from "../utils/catchErrors";
import { BAD_REQUEST, CREATED, OK } from "../constant/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constant/appErrorCode";
import { getSocketIdByUserId, io, registerSocket } from "../lib/socket";
import mongoose from "mongoose";

export const getAllUsers = catchErrors(async (req: Request, res: Response) => {
  const searchQuery = req.query.search as string;
  appAssert(
    searchQuery,
    BAD_REQUEST,
    "Search query is required",
    AppErrorCode.MissingField
  );

  const regex = new RegExp(searchQuery, "i");

  const users = await User.find({
    $and: [
      {
        $or: [{ fullName: regex }, { email: regex }],
      },
      { _id: { $ne: req.user?._id } },
    ],
  })
    .select("_id fullName profilePicture")
    .select("-password")
    .limit(20);

  res.status(200).json(users);
});

export const getUsersForSidebar = catchErrors(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user?._id;

    // 1. Find all messages involving the logged-in user
    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    }).sort({ createdAt: -1 });

    // 2. Get unique user IDs who have chatted with the logged-in user
    const userIdsSet = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderId.toString() !== loggedInUserId?.toString()) {
        userIdsSet.add(msg.senderId.toString());
      }
      if (msg.receiverId.toString() !== loggedInUserId?.toString()) {
        userIdsSet.add(msg.receiverId.toString());
      }
    });
    const userIds = Array.from(userIdsSet);

    // 3. Aggregate users with their last message
    const users = await User.aggregate([
      {
        $match: {
          _id: { $in: userIds.map((id) => new mongoose.Types.ObjectId(id)) },
        },
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

    res.status(OK).json(users);
  }
);

export const getMessages = catchErrors(async (req: Request, res: Response) => {
  const { id: userToChatId } = req.params;
  appAssert(
    userToChatId,
    BAD_REQUEST,
    "User ID to chat with is required",
    AppErrorCode.MissingField
  );
  const myId = req.user?._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  res.status(OK).json(messages);
});

export const sendMessage = catchErrors(async (req: Request, res: Response) => {
  const { text, image } = req.body;
  appAssert(
    text || image,
    BAD_REQUEST,
    "Text or image is required",
    AppErrorCode.MissingField
  );
  const { id: receiverId } = req.params;
  appAssert(
    receiverId,
    BAD_REQUEST,
    "Receiver ID is required",
    AppErrorCode.MissingField
  );
  const senderId = req.user?._id;

  let imageUrl;
  if (image) {
    // Upload base64 image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId: senderId,
    receiverId,
    text: text,
    image: imageUrl,
  });

  //Last massage save of each user

  // const senderUser = await User.findOne(senderId);
  // const receiverUser = await User.findOne(receiverId);

  await newMessage.save();

  // Emit the new message to the receiver's socket
  const receiverSocketId = getSocketIdByUserId(receiverId);
  io.to(receiverSocketId as string).emit("newMessage", newMessage);
  io.to(receiverSocketId as string).emit("refreshSidebar");
  res.status(CREATED).json(newMessage);
});
