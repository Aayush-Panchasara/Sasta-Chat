import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { io, getReceiverSocketId } from "../socket.js";

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const OtherUsers = await User.find({ _id: { $ne: userId } });

    return res.status(201).json({
      error: false,
      users: OtherUsers,
      message: "",
    });
  } catch (error) {
    console.log("Error", error.message);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

const getMessages = asyncHandler(async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    });

    return res.status(201).json({
      error: false,
      messages,
      message: "",
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { id: receiverId } = req.params;
  const { text, image } = req.body;
  const senderId = req.user._id;

  try {
    let imageUrl;
    if (image) {
      const responce = await uploadOnCloudinary(image);
      imageUrl = responce.secure_url;
    }

    const newmessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newmessage.save();

    //Todo -------------------
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newmessage", newmessage);
    }

    return res.status(201).json({
      error: false,
      newmessage,
      message: "",
    });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

export { getAllUsers, getMessages, sendMessage };
