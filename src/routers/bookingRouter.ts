import express from "express";
const bookingRouter = express.Router();

//Controllers
import { bookTraining } from "../controllers/bookingController";

bookingRouter.post("/book", bookTraining);

export default bookingRouter;
