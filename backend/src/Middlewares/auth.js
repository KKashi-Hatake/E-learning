import { User } from "../Models/user.model.js";
import { asyncHandler } from "../Utils/asynHandler.js";
import ErrorHandler from "../Utils/ErrorHandler.js";
import jwt from "jsonwebtoken";


export const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new ErrorHandler(401, "Login first to access this resource");
    }
    const decoded_data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded_data._id);
    if (!user) {
      throw new ErrorHandler(401, "Invalid Acess Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ErrorHandler(401, error?.message || "Invalid Access Token");
  }
});
