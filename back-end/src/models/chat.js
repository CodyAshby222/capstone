import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ChatSchema = new Schema({
  uniqueId: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});
