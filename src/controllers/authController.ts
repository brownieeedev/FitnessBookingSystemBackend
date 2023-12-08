import { Request as Req, Response as Res } from "express";
import jwt, { Secret, VerifyCallback } from "jsonwebtoken";
import { promisify } from "util";
//Model
import { User } from "../models/userModel";
import { UserType } from "../models/userModel";

type Login = {
  email: string;
  pass: string;
};

const signToken = (id: string) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET as string, {
    expiresIn: parseInt(process.env.JWT_EXPIRES_IN as string, 10),
  });
};

const createSendToken = (user: UserType, statusCode: number, res: Res) => {
  // console.log("Reached createSendToken");
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

export const login = async (req: Req, res: Res) => {
  // console.log("login");
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

  // console.log(email);
  // console.log(pass);
  // console.log(user);

  //check if user exists and password is correct
  if (!user || !(await user.correctPassword(pass, user.pass!))) {
    return res.status(401).json({ message: "Incorrect email or password!" });
  }

  createSendToken(user, 200, res);
};

export const signup = async (req: Req, res: Res) => {
  // console.log("signup");
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

export const protect = async (req: Req, res: Res, next: any) => {
  //1) Getting token and check if it exists
  // console.log("protect");
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // console.log(token);
  if (!token) {
    return res
      .status(401)
      .send("You are not logged in please login to get access");
  }
  //2) Validate token
  const verifyAsync = promisify(jwt.verify) as (
    token: string,
    secret: Secret
  ) => Promise<any>;

  const decoded = await verifyAsync(token, process.env.JWT_SECRET as string);
  // console.log("decoded ", decoded);
  //3)Check if user still exists
  const currentUser: UserType | null = await User.findById((decoded as any).id);
  // console.log(currentUser);
  if (!currentUser) {
    return res.status(401).send("The user to the token does not exist!");
  }
  //4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter((decoded as any).iat as number)) {
    return res
      .status(401)
      .send("Recently changed password, please login again!");
  }

  //Next middleware can be accessed
  (req as any).user = currentUser;
  res.locals.user = currentUser;
  next();
};
