import { User } from "../Models/user.model.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import { asyncHandler } from "../Utils/asynHandler.js";
import uploadOnCloudinary from "../Utils/cloudinary.js";

// Http options used while setting cookies
const options = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
};

//Post route to register new user
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log('from register route',req.body.avatar)

  if (!(name && email && password)) {
    throw new ErrorHandler(400, "All fields are mandatory");
  }
  let user = await User.findOne({ email });
  if (user) {
    throw new ErrorHandler(400, "Email is already registered. Please login");
  }
  const avatarLocalPath = req?.file?.path;
  if (!avatarLocalPath) {
    throw new ErrorHandler(400, "Avatar File is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ErrorHandler(
      500,
      "Something went wrong while uploading avatar on cloudinary"
    );
  }
  user = await User.create({
    name,
    email,
    password,
    avatar: avatar?.url,
  });
  const token = await user.generateToken();

  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "User registered Successfully",
    user,
  });
});

//Post route to login
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new ErrorHandler(400, "All fields are mandatory");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new ErrorHandler(404, "User does not exists");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ErrorHandler(404, "Invalid credentials");
  }
  const token = await user.generateToken();
  user.password = "Aisi baatein batayi nahi jati 👀 lag jati hai";
  res.status(200).cookie("token", token, options).json({
    success: true,
    message: "Login successful",
    user,
  });
});

//Get route to logout
export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged out",
  });
});

// Get route  for isLoggedIn
export const isLoggedIn = asyncHandler(async(req, res)=>{
  res.status(200).json({
    success:true,
    message:'User logged in',
    isLoggedIn:true
  })
})
