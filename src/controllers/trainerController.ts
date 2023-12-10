import { Request as Req, Response as Res } from "express";

//Model
import { Trainer } from "../models/trainerModel";

//GET
export const getAllTrainers = async (req: Req, res: Res) => {
  console.log("getAllTrainers");
  const trainers = await Trainer.find();
  return res.status(200).json({
    status: "success",
    message: "Successfully fetched all trainers!",
    data: trainers,
  });
};

export const getMe = async (req: Req, res: Res) => {
  console.log("getMe");
  const trainer = await Trainer.findById((req as any).user.id);

  if (!trainer) {
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong! Could not fetch your data!",
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Successfully fetched trainer!",
    data: trainer,
  });
};

//POST

//PATCH
export const updateIntroduction = async (req: Req, res: Res) => {
  console.log("editIntroduction");

  const introduction: string = req.body.textarea;

  if (!introduction) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide introduction!",
    });
  }

  //if for some reason trainer would not have an id
  if (!(req as any).user.id) {
    return res.status(401).json({
      status: "fail",
      message: "Please log in!",
    });
  }

  try {
    //Save to trainers introduction field the introduction
    await Trainer.findByIdAndUpdate((req as any).user.id, {
      introduction,
    });
    return res.status(200).json({
      status: "success",
      message: "Successfully edited introduction!",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong! Could not update your introduction!",
    });
  }
};
