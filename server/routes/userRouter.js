import express from "express";
import {
  getUserById,
  getUserResumes,
  loginUser,
  registerUser,
  googleLogin
} from "../controllers/userController.js";

import protect from "../middlewares/authMiddleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/google-login", googleLogin);

userRouter.get("/data", protect, getUserById);
userRouter.get("/resumes", protect, getUserResumes);

export default userRouter; 