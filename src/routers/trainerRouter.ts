import express from "express";
const trainerRouter = express.Router();

//Controllers
import {
  getAllTrainers,
  updateIntroduction,
  getMe,
  updateAvailability,
} from "../controllers/trainerController";
import { protectTrainer, trainerLogin } from "../controllers/authController";

//Unprotected
trainerRouter.post("/login", trainerLogin);
trainerRouter.get("/alltrainers", getAllTrainers);

//Protected
trainerRouter.patch("/updateIntroduction", protectTrainer, updateIntroduction);
trainerRouter.get("/me", protectTrainer, getMe);
trainerRouter.patch("/updateAvailability", protectTrainer, updateAvailability);

export default trainerRouter;
