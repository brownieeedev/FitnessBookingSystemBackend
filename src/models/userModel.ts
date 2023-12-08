import { Schema, model } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
// import crypto from "crypto";

export type UserType = {
  _id: string;
  firstname?: string;
  lastname?: string;
  email: string;
  pass: string | undefined;
  address?: string;
  phone?: string;
  registrationDate?: Date;
  passwordChangedAt?: Date;
  role?: "user" | "trainer" | "admin";
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;

  correctPassword: (Password: string, userPassword: string) => Promise<boolean>;
  changedPasswordAfter: (JWTTimeStamp: number) => boolean;
};

const userSchema = new Schema<UserType>({
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
  phone: { type: String },
  registrationDate: { type: Date, required: true, default: Date.now() },
  passwordChangedAt: { type: Date },
  role: { type: String, enum: ["user", "trainer", "admin"], default: "user" },
  passwordResetToken: { type: String },
  passwordResetTokenExpires: { type: Date },
});

//password validation for login
userSchema.methods.correctPassword = async function (
  Password: string,
  userPassword: string
) {
  return await bcrypt.compare(Password, userPassword);
};

//password encryiption
userSchema.pre("save", async function (this: any, next) {
  if (!this.isModified("pass")) return next();
  this.pass = await bcrypt.hash(this.pass, 12);
  next();
});

//set password changed date
userSchema.pre("save", function (this: any, next) {
  if (!this.isModified("jelszo") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 3000;
  next();
});

//only list active users
userSchema.pre(/^find/, function (this: any, next) {
  //this points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.changedPasswordAfter = function (
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

export const User = model<UserType>("User", userSchema);
