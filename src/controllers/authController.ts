import { Request as Req, Response as Res } from "express";
import jwt from "jsonwebtoken";
//Model
import { User } from "../models/userModel";
import { UserType } from "../models/userModel";

type Login = {
  email: string;
  pass: string;
};

const createSendToken = (user: UserType, statusCode: number, res: Res) => {
  console.log("Reached createSendToken");
  const token = signToken(user._id);

  //Sending COOKIE
  // const cookieOptions = {
  //   expires: new Date(
  //     Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  //   ),
  //   httpOnly: true,
  // };
  // if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // res.cookie("jwt", token, cookieOptions);

  //Remove password from output
  user.pass = undefined;

  res.status(statusCode).json({
    status: "success",
    message: "Successfully logged in!",
    token,
    navigateTo: "/",
  });
};

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const login = async (req: Req, res: Res) => {
  console.log("login");
  const loginData: Login = req.body;
  const email: string = loginData.email;
  const pass: string = loginData.pass;

  if (!email || !pass) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide email and password!",
    });
  }
  const user: UserType = await User.findOne({ email }).select("+pass");

  console.log(email);
  console.log(pass);
  console.log(user);

  //check if user exists and password is correct
  if (!user || !(await user.correctPassword(pass, user.pass!))) {
    return res.status(401).json({ message: "Incorrect email or password!" });
  }

  createSendToken(user, 200, res);
};

export const signup = async (req: Req, res: Res) => {
  console.log("signup");
  const signupData: Login = req.body;
  const email: string = signupData.email;
  const pass: string = signupData.pass;

  //is there already a user with this email?
  const user = await User.findOne({ email });
  if (user) {
    return res.status(401).json({
      status: "fail",
      message: "Email is already in use!",
    });
  }

  if (pass.length <= 7) {
    return res.status(401).json({
      status: "fail",
      message: "The password must be at least 8 characters long!",
    });
  }

  const newUser = await User.create({
    email: email,
    pass: pass,
  });

  return res.status(201).json({
    status: "success",
    message: "Successfully signed up! Login to continue!",
    navigateTo: "/login",
  });
};
