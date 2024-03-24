import jwt, { decode } from "jsonwebtoken";
import { ApiError } from "../Errors/customErrorClass.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const options = {
  httpOnly: true,
  secure: true,
};
const validationError = (name) => {
  throw new ApiError(400, `${name} is required`);
};
const generateAccessTokenAndRefreshToken = async (user) => {
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  // get data:text and files
  const { username, email, password, fullname } = req.body;
  // console.log(username, email, password, fullname);
  const avatar = req.file?.path;
  // console.log(avatar);
  // validate the data
  if (!username) validationError("username");
  if (!email) validationError("email");
  if (!password) validationError("password");
  if (!fullname) validationError("fullname");
  if (!avatar) validationError("avatar");
  // check if the user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser)
    throw new ApiError(400, "user with email or username already exists..!");
  console.log("existing user", existedUser);
  // upload images on cloudinary;
  const cloudAvatar = await uploadOnCloudinary(avatar);
  console.log(cloudAvatar.url);
  // create the user entry in db;
  const newUser = await User.create({
    email,
    username,
    password,
    fullname,
    avatar: cloudAvatar.url,
  });

  // remove passoword
  const user = await User.findById(newUser._id).select(
    "-password -refreshToken"
  );
  console.log("hello move on");
  console.log(user);
  // send response
  return res.status(201).json({ msg: "user created successfully", data: user });
});

// login
const loginUser = asyncHandler(async (req, res) => {
  // get data from req.body
  const { email, username, password } = req.body;
  // validate the data
  if (!password) validationError("password");
  if (!username && !email) validationError("username or email");
  // find user
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) throw new ApiError(404, "user with email or email doesn't exist");
  // console.log(user);
  // check if the password is correct
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(400, "password is incorrect");

  // generate access and refresh token
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user);
  console.log(refreshToken);
  user.refreshToken = refreshToken;
  const loggedInUser = await User.findOneAndUpdate(user._id, {
    refreshToken,
  }).select("-password -refreshToken");
  // send response refresh and access token in secure cookies

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json({
      msg: "logged in successfully..!",
      data: { user: loggedInUser, accessToken, refreshToken },
    });
});

// logout
const logout = asyncHandler(async (req, res) => {
  console.log(req.cookies);
  const { accessToken } = req.cookies;

  if (!accessToken) throw new ApiError(401, "unauthorized request");
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decoded) throw new ApiError(401, "invalid access token");
  const user = await User.findById(decoded._id);
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
  console.log(res);
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      msg: "logged out successfully..!",
    });
});

// refresh access and refresh token

const refreshAccessAndRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;
  if (!incomingRefreshToken) throw new ApiError(401, "invalid refresh token");
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );
  if (!user) throw new ApiError(401, "invalid or expired refresh Token");
  if (user.refreshToken != incomingRefreshToken)
    throw new ApiError(401, "invalid refresh token");

  const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken();
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      msg: "all went right here are your new tokens",
      accessToken,
      refreshToken,
    });
});
export { registerUser, loginUser, logout, refreshAccessAndRefreshToken };
