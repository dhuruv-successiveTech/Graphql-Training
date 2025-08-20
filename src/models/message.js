import { UniqueTypeNamesRule } from "graphql";
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogUser",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);
export default Message;
