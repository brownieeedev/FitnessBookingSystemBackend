import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
//Extending userType
import { UserType } from "./userModel";

export type AvailableTime = {
  day: string;
  times: string[];
};

type Links = {
  name: string;
  link: string;
  icon: string;
};

export type TrainerType = UserType & {
  available: AvailableTime[];
  title?: string;
  sex?: "Male" | "Female";
  introduction: string;
  profilePicture?: string;
  introVideo?: string;
  trainingTypes?: string[];
  places: string[];
  links: Links[];
};

const trainerSchema = new Schema<TrainerType>({
  firstname: { type: String },
  lastname: { type: String },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "The email is not valid!"],
    required: true,
  },
  pass: {
    type: String,
    minlength: [8, "Password has to be atleast 8 chars long!"],
    required: true,
    select: false,
  },
  address: { type: String },
  title: { type: String, default: "Personal Trainer" },
  phone: { type: String },
  dateOfBirth: { type: Date },
  registrationDate: { type: Date, required: true, default: Date.now() },
  passwordChangedAt: { type: Date },
  role: {
    type: String,
    enum: ["user", "trainer", "admin"],
    default: "trainer",
  },
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
  available: {
    type: [
      {
        day: { type: String, unique: true },
        times: [{ type: String, unique: true }],
      },
    ],
    default: [],
  },
  introduction: { type: String },
  profilePicture: { type: String },
  introVideo: { type: String },
  trainingTypes: [{ type: String }],
  sex: { type: String },
  places: [{ type: String }],
  links: [
    {
      name: { type: String },
      link: { type: String },
    },
  ],
});

//password validation for login
trainerSchema.methods.correctPassword = async function (
  Password: string,
  userPassword: string
) {
  return await bcrypt.compare(Password, userPassword);
};

//password encryiption
trainerSchema.pre("save", async function (this: any, next) {
  if (!this.isModified("pass")) return next();
  this.pass = await bcrypt.hash(this.pass, 12);
  next();
});

//set password changed date
trainerSchema.pre("save", function (this: any, next) {
  if (!this.isModified("jelszo") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 3000;
  next();
});

//only list active users
trainerSchema.pre(/^find/, function (this: any, next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

trainerSchema.methods.changedPasswordAfter = function (
  this: any,
  JWTTimeStamp: number
) {
  if (this.passwordChangedAt) {
    const passwordChangedAt =
      parseInt(this.passwordChangedAt.getTime(), 10) / 1000;
    //console.log(passwordChangedAt, JWTTimeStamp);
    return JWTTimeStamp < passwordChangedAt;
  }
  //False == nem lett megváltoztatva még a jelszó soha
  return false;
};

export const Trainer = model<TrainerType>("Trainers", trainerSchema);
