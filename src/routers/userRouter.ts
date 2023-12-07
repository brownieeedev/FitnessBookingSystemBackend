import express from "express";
const userRouter = express.Router();

//Auth controller
import { login, signup } from "../controllers/authController";

//Unprotected routes
userRouter.post("/login", login);
userRouter.post("/signup", signup);

export default userRouter;
