import AppErrorCode from "../constant/appErrorCode";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constant/http";
import User from "../models/user.model";
import appAssert from "../utils/appAssert";
import { catchErrors } from "../utils/catchErrors";
import bcryptjs from "bcryptjs";
import { genarateToken } from "../utils/jwtToken";
import cloudinary from "../lib/cloudinary";

export const signUpController = catchErrors(async (req, res) => {
  const { email, fullName, password } = req.body;

  appAssert(
    email && fullName && password,
    BAD_REQUEST,
    "All field are required",
    AppErrorCode.MissingField
  );
  appAssert(
    password.length >= 6,
    BAD_REQUEST,
    "Password must be at least 6 characters",
    AppErrorCode.InvalidPassword
  );

  const user = await User.findOne({ email });
  appAssert(
    !user,
    BAD_REQUEST,
    "User already exists",
    AppErrorCode.UserAlreadyExists
  );
  const hashedPassword = await bcryptjs.hash(password, 10);
  const newUser = new User({
    email,
    fullName,
    password: hashedPassword,
  });

  //Genarate jwt token
  genarateToken(newUser._id.toString(), res);
  await newUser.save();
  res
    .status(CREATED)
    .json({ message: "Sign In successful", success: true, user: newUser });
});

export const signInController = catchErrors(async (req, res) => {
  const { email, password } = req.body;
  appAssert(
    email && password,
    BAD_REQUEST,
    "All field are required",
    AppErrorCode.MissingField
  );
  const user = await User.findOne({ email });
  appAssert(user, NOT_FOUND, "User does not exist", AppErrorCode.UserNotFound);
  const isPasswordMatch = await bcryptjs.compare(password, user.password);
  appAssert(
    isPasswordMatch,
    BAD_REQUEST,
    "Password is incorrect",
    AppErrorCode.PasswordMismatch
  );

  //Genarate jwt token
  genarateToken(user._id.toString(), res);
  res.status(OK).json({ message: "Sign In successful", success: true, user });
});

export const signOutController = catchErrors(async (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(OK).json({ message: "Sign out successful", success: true });
});

export const updateProfileController = catchErrors(async (req, res) => {
  const { profilePicture } = req.body;
  appAssert(
    profilePicture,
    BAD_REQUEST,
    "Profile picture is required",
    AppErrorCode.MissingField
  );

  const uploadedResponse = await cloudinary.uploader.upload(profilePicture);
  appAssert(
    uploadedResponse && uploadedResponse.secure_url,
    BAD_REQUEST,
    "Failed to upload profile picture",
    AppErrorCode.UploadFailed
  );

  const userId = req.user?._id;
  const user = await User.findByIdAndUpdate(
    userId,
    { profilePicture: uploadedResponse.secure_url },
    { new: true, runValidators: true }
  );
  res.status(OK).json({ message: "Profile updated successfully", success: true, user });
});

export const checkAuth = catchErrors(async (req, res) => {
  const user = req.user;
  appAssert(
    user,
    NOT_FOUND,
    "User not found",
    AppErrorCode.UserNotFound
  );
  res.status(OK).json({ message: "User is authenticated", success: true, user });
});
