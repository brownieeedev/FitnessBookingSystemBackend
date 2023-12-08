import express from "express";
const trainerRouter = express.Router();

//Controllers
import { getAllTrainers } from "../controllers/trainerController";

//Unprotected
trainerRouter.get("/alltrainers", getAllTrainers);

export default trainerRouter;
