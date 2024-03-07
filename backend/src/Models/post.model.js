import mongoose, { mongo } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      tri: true,
    },
    sharedResource: {
      type: String,
    },
    likes:{
      type:Number,
      default:0
    },
    comments:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Post", postSchema);
