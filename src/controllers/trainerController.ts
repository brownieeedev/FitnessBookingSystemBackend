import { Request as Req, Response as Res } from "express";
import dayjs from "dayjs";
//Types
import { AvailableTime } from "../models/trainerModel";
//Model
import { Trainer } from "../models/trainerModel";
import { Booking } from "../models/bookingModel";

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

export const getBookingsToTrainer = async (req: Req, res: Res) => {
  console.log("getBookingsToTrainer");
  //get todays string
  const today = dayjs(new Date()).format("YYYY.MM.DD");
  try {
    const bookings = await Booking.find({ trainer: (req as any).user.id });
    const bookingsToday = bookings.filter((booking) => booking.date === today);

    console.log(bookingsToday);
    console.log(bookings);

    return res.status(200).json({
      status: "success",
      statusCode: 200,
      message: "Successfully fetched bookings!",
      data: {
        bookings,
        bookingsToday,
        bookingsLength: bookings.length,
        bookingsTodayLength: bookingsToday.length,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong! Could not fetch your bookings!",
    });
  }
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

  console.log(availability);

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

  let dayFound = false;

  newAvailableArray = newAvailableArray.map((obj) => {
    if (obj.day === availability.day) {
      dayFound = true;
      const combinedArray = obj.times.concat(availability.times);
      const uniqueArray = [...new Set(combinedArray)];

      return {
        day: obj.day,
        times: uniqueArray,
      };
    }
    return obj;
  });

  if (!dayFound) {
    //in this case the day is not in the array yet
    newAvailableArray = [...newAvailableArray, availability];
    // newAvailableArray.push(availability);
  }

  try {
    //Save to trainers introduction field the introduction
    // console.log("inside try");
    // console.log(newAvailableArray);
    await Trainer.findByIdAndUpdate((req as any).user.id, {
      available: newAvailableArray,
    });
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Successfully edited availability!",
    });
  } catch (err) {
    return res.status(400).json({
      status: "fail",
      message: "Something went wrong! Could not update your availability!",
    });
  }
};
