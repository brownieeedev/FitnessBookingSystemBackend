import express from "express";
const videoRouter = express.Router();

//Controllers
import { protectTrainer } from "../controllers/authController";
import { postVideo } from "../controllers/videoController";

//Protected routes
videoRouter.post("/uploadvideo", protectTrainer, postVideo);

export default videoRouter;
