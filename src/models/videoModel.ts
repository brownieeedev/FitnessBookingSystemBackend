import { InferSchemaType, Schema, model } from "mongoose";

//Model
import { Trainer } from "./trainerModel";

export type VideoType = {
  trainer: string;
  introduction: boolean | string;
  trainingTypes: string[];
  videoTitle: string;
  videoUrl?: string | null | undefined;
};

const videoSchema = new Schema({
  trainer: { type: Schema.Types.ObjectId, ref: Trainer, required: true },
  videoUrl: { type: String }, //should be required: true
  introduction: { type: Boolean, required: true },
  inReview: { type: Boolean, default: true, required: true },
  videoTitle: { type: String, required: true },
  trainingTypes: { type: [String], required: true },
});

export const Video = model("Video", videoSchema);
