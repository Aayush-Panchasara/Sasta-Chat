import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(400).json({ error: true, message: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Unauthorized" });
    }

    req.user = user

    next()

  } catch (error) {
    console.log("Error", error.message);
    return res.status(400).json({ error: true, message: error.message });
  }
});

export {verifyJwt}