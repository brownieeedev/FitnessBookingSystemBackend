import express from "express";
const bookingRouter = express.Router();

//Controllers
import { protect } from "../controllers/authController";
import { bookTraining } from "../controllers/bookingController";

//Protected routes
bookingRouter.post("/book", protect, bookTraining);

export default bookingRouter;
