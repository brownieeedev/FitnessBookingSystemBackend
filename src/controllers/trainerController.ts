import { Request as Req, Response as Res } from "express";

//Types
import { AvailableTime } from "../models/trainerModel";
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

export const updateAvailability = async (req: Req, res: Res) => {
  console.log("updateAvailability");
  const availability: AvailableTime = req.body;

  if (!availability) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide availability!",
    });
  }

  //if for some reason trainer would not have an id
  if (!(req as any).user.id) {
    return res.status(401).json({
      status: "fail",
      message: "Please log in!",
    });
  }

  const trainerAvailableFromDb = await Trainer.findById(
    (req as any).user.id
  ).select("available");

  if (!trainerAvailableFromDb) {
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong!",
    });
  }

  //this algorithm checks if the day is already in the array and updates times
  let newAvailableArray: AvailableTime[] = [
    ...trainerAvailableFromDb.available,
  ];

  let index: number = 0;
  let updatedObj: AvailableTime;
  trainerAvailableFromDb?.available.forEach((obj) => {
    if (obj.day === availability.day) {
      const combinedArray = obj.times.concat(availability.times);
      const uniqueArray = [...new Set(combinedArray)];

      console.log("uniqueArray", uniqueArray);

      updatedObj = {
        day: obj.day,
        times: uniqueArray,
      };
      return;
      //add updatedObj to newObj
    }
    index++;
  });

  //CONTINUE HERE

  // newAvailableArray[index] = updatedObj;

  try {
    //Save to trainers introduction field the introduction
    // console.log(availability);
    await Trainer.findByIdAndUpdate((req as any).user.id, {
      available: newAvailableArray,
    });
    return res.status(200).json({
      status: "success",
      message: "Successfully edited availability!",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong! Could not update your availability!",
    });
  }
};
