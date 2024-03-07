import express from "express";
import {
  isLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "../Controllers/user.controller.js";
import { isAuthenticatedUser } from "../Middlewares/auth.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post((req,res, next)=>{console.log(req.file, req.body); next()},upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(isAuthenticatedUser, logoutUser);
router.route("/isloggedin").get(isAuthenticatedUser, isLoggedIn);

export default router;
