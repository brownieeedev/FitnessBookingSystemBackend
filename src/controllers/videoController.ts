import { Request as Req, Response as Res } from "express";

//Types
import { VideoType } from "../models/videoModel";

//Model
import { Video } from "../models/videoModel";

export const postVideo = async (req: Req, res: Res) => {
  console.log("postVideo");

  const body: VideoType = req.body;

  const videoObj: VideoType = {
    trainer: (req as any).user._id,
    introduction: body.introduction === "Introduction Video" ? true : false,
    videoTitle: body.videoTitle,
    trainingTypes: body.trainingTypes,
  };

  if (!videoObj) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide all the required fields!",
    });
  }

  try {
    await Video.create(videoObj);
    return res.status(201).json({
      status: "success",
      statusCode: 201,
      message: "Successfully posted video!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Something went wrong!",
    });
  }
};
