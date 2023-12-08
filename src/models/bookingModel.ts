import { InferSchemaType, Schema, model } from "mongoose";

//Model
import { User } from "./userModel";
import { Trainer } from "./trainerModel";

const bookingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: User, required: true },
  trainer: { type: Schema.Types.ObjectId, ref: Trainer, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  trainingType: { type: String, required: true },
  trainingPrice: { type: Number },
});

export type BookingType = InferSchemaType<typeof bookingSchema>;

export const Booking = model("Booking", bookingSchema);
