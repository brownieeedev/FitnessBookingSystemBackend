import { Request as Req, Response as Res } from "express";

export const bookTraining = async (req: Req, res: Res) => {
  console.log("book training");
  return res.status(201).json({
    status: "success",
    message: "Successfully booked training!",
  });
};
