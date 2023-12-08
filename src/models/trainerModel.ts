import { Schema, model } from "mongoose";
import validator from "validator";

//Extending userType
import { UserType } from "./userModel";

export type AvailableTime = {
  day: string;
  times: string[];
};

type Links = {
  name: string;
  link: string;
};

export type TrainerType = UserType & {
  available: AvailableTime[];
  introduction: string;
  profilePicture?: string;
  introVideo?: string;
  trainingTypes?: string[];
  places: string[];
  links: Links[];
};

const trainerSchema = new Schema<TrainerType>({
  //   firstname: { type: String },
  //   lastname: { type: String },
  //   email: {
  //     type: String,
  //     unique: true,
  //     lowercase: true,
  //     validate: [validator.isEmail, "The email is not valid!"],
  //     required: true,
  //   },
  //   pass: {
  //     type: String,
  //     minlength: [8, "Password has to be atleast 8 chars long!"],
  //     required: true,
  //     select: false,
  //   },
  //   address: { type: String },
  //   phone: { type: String },
  //   registrationDate: { type: Date, required: true, default: Date.now() },
  //   passwordChangedAt: { type: Date },
  //   role: {
  //     type: String,
  //     enum: ["user", "trainer", "admin"],
  //     default: "trainer",
  //   },
  //   passwordResetToken: { type: String },
  //   passwordResetTokenExpires: { type: Date },
  available: [
    {
      day: { type: String },
      times: [{ type: String }],
    },
  ],
  introduction: { type: String },
  profilePicture: { type: String },
  introVideo: { type: String },
  trainingTypes: [{ type: String }],
  places: [{ type: String }],
  links: [
    {
      name: { type: String },
      link: { type: String },
    },
  ],
});

export const Trainer = model<TrainerType>("Trainers", trainerSchema);
