import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { catchErrors } from "../utils/catchErrors";
import { BAD_REQUEST, CREATED, OK } from "../constant/http";
import appAssert from "../utils/appAssert";
import AppErrorCode from "../constant/appErrorCode";
import { getSocketIdByUserId, io, registerSocket } from "../lib/socket";

export const getUsersForSidebar = catchErrors(
  async (req: Request, res: Response) => {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(OK).json(filteredUsers);
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
  const myId = req.user._id;

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
  const senderId = req.user._id;

  let imageUrl;
  if (image) {
    // Upload base64 image to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
  }

  const newMessage = new Message({
    senderId:senderId,
    receiverId,
    text:text,
    image: imageUrl,
  });

  await newMessage.save();

  // Emit the new message to the receiver's socket
  const receiverSocketId = getSocketIdByUserId(receiverId);
  console.log("Receiver Socket ID:", receiverSocketId);
  io.to(receiverSocketId as string).emit("newMessage", newMessage);
  res.status(CREATED).json(newMessage);
});
