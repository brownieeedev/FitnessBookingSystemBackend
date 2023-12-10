import { Request as Req, Response as Res } from "express";
import dayjs from "dayjs";

//Models
import { Trainer } from "../models/trainerModel";
import { Booking } from "../models/bookingModel";

//Types
import { BookingType } from "../models/bookingModel";
import { TrainerType } from "../models/trainerModel";
import { AvailableTime } from "../models/trainerModel";

export const bookTraining = async (req: Req, res: Res) => {
  // console.log("book training");
  const bookingData: BookingType = req.body;

  //check if time is still available
  const trainerDoc = await Trainer.findById(bookingData.trainer);
  const available = trainerDoc?.get("available") as AvailableTime[];

  // console.log(available);
  const availableObj = available.find(
    (el) => el.day === dayjs(bookingData.date).format("YYYY.MM.DD")
  );

  if (!availableObj) {
    return res.status(400).json({
      status: "fail",
      message: "It seems that this date  has already been booked!",
    });
  }

  const timeIndex = availableObj.times.findIndex(
    (el) => el === bookingData.time
  );

  if (timeIndex === -1) {
    return res.status(400).json({
      status: "fail",
      message: "It seems that the date has already been booked!",
    });
  }

  //create booking
  try {
    const newBooking = await Booking.create({
      ...bookingData,
      date: dayjs(bookingData.date).format("YYYY.MM.DD"),
      user: (req as any).user,
    });

    //IF SUCCESS REMOVE BOOKED TIME FROM TRAINER AVAILABILITY IMMEDIATELY

    // Remove booked time from available times
    availableObj.times.splice(timeIndex, 1); //with this line of code available Array gets changed as well so this can be the object to replace with mongoose $set

    // If times array is empty, remove the day object
    if (availableObj.times.length === 0) {
      available.splice(available.indexOf(availableObj), 1);
    }

    // Update the Trainer document with the modified available field
    await Trainer.findByIdAndUpdate(
      bookingData.trainer,
      { $set: { available } },
      { new: true }
    );
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      status: "fail",
      message: "Could not create booking! Please try again!",
    });
  }

  return res.status(201).json({
    status: "success",
    message: "Successfully booked training!",
  });
};
