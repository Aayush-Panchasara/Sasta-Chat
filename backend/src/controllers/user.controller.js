import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  // const profilepicLOCAL = req.file?.path;

  if (!fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All field are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      error: true,
      message: "Password length must be greater than or equal to 8",
    });
  }

  // if (!profilepicLOCAL) {
  //   return res.status(400).json({
  //     error: true,
  //     message: "ProfilePic is required",
  //   });
  // }
  const options = {
    maxAge: 7 * 24 * 60 * 60 * 1000, //In ms
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };

  const isPresent = await User.findOne({ email });
  if (isPresent) {
    return res
      .status(400)
      .json({ error: true, message: "Email already exist" });
  }

  // let profilepic;
  // try {
  //   profilepic = await uploadOnCloudinary(profilepicLOCAL);
  //   console.log("Uploaded profilepic", profilepic);
  // } catch (error) {
  //   console.log("Error in uploading profilepic ", error.message);
  //   return res.status(400).json({
  //     error: true,
  //     message: error.message,
  //   });
  // }

  try {
    const user = await User.create({
      fullname,
      email,
      password,
      // profileImg: profilepic.secure_url,
    });

    user.save();
    const createdUSer = await User.findById(user._id).select("-password");
    const accessToken = await user.generateAccessToken();

    return res.status(201).cookie("accessToken", accessToken, options).json({
      error: false,
      createdUSer,
      message: "Account created successfully",
    });
  } catch (error) {
    console.log("Error: ", error.message);

    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All field are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid Crendentials" });
    }

    const accessToken = await user.generateAccessToken();

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
      maxAge: 7 * 24 * 60 * 60 * 1000, //In ms
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    };
    return res.status(201).cookie("accessToken", accessToken, options).json({
      error: false,
      loggedInUser,
      message: "Login successful",
    });
  } catch (error) {
    console.log("Error: ", error.message);

    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
});
const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
  };
  return res
    .status(201)
    .clearCookie("accessToken", options)
    .json({ error: false, message: "User logged out successfully" });
});

const updateProfileImg = asyncHandler(async (req, res) => {
  const {profilepic} = req.body;
  const userId = req.user._id;

  if (!profilepic) {
    return res.status(400).json({
      error: true,
      message: "Profilepic is required",
    });
  }

  const responce = await uploadOnCloudinary(profilepic);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          profileImg: responce.secure_url,
        },
      },
      { new: true }
    );
  
    return res
          .status(201)
          .json({
          error: true,
          user:updatedUser,
          message: "ProfilePic updated successfully",
    });
  } catch (error) {
    console.log("Errro: ",error.message);
    return res.status(500).json({
      error: true,
      message: error.message
    });
    
  }
});

const getCurrentUser = asyncHandler(async(req,res) => {
    const userId = req.user._id

    const user = await User.findById(userId).select("-password")

    if(!user){
        return res.status(400).json({
          error: true,
          message: "User not found",
        });
    }

    return res
        .status(201)
        .json({
            error:false,
            user,
            message:"Current user details"
        })
}) 

export { registerUser, loginUser, logoutUser, updateProfileImg, getCurrentUser };
