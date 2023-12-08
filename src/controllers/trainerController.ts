import { Request as Req, Response as Res } from "express";

//Model
import { Trainer } from "../models/trainerModel";

export const getAllTrainers = async (req: Req, res: Res) => {
  console.log("getAllTrainers");
  const trainers = await Trainer.find();
  return res.status(200).json({
    status: "success",
    message: "Successfully fetched all trainers!",
    data: trainers,
  });
};
