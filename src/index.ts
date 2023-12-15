import express, { Request as Req, Response as Res } from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import compression from "compression";
//security
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
//Routers
import userRouter from "./routers/userRouter";
import trainerRouter from "./routers/trainerRouter";
import bookingRouter from "./routers/bookingRouter";
import videoRouter from "./routers/videoRouter";

const app = express();
const port = 5001;

//Middlewares
app.use(cors());
app.use(express.json());
app.use(compression());
//Security middlewares
app.use(mongoSanitize());

const limiter = rateLimit({
  max: 500, //for testing it is 500, in production it should be 100
  windowMs: 30 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

//Connecting to ATLAS cluster (to MongoDB's cloud db)
mongoose
  .connect(process.env.DB_CON_STRING as string)
  .then((con) => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

//Use routers
app.use("/api/users", userRouter);
app.use("/api/trainers", trainerRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/video", videoRouter);

//Server
app.listen(process.env.PORT || 5001, () => {
  console.log(`Server is running on port ${port}`);
});
