import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const KidSchema = new Schema({
  all_id: [],
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  birth_date: {
    type: Date,
    required: true,
  },
  image: {
    type: String,
  },
  theme: {
    type: String,
  },
  diaper: [],
  sleep: [],
  feeding: [],
  behavior: [],
  pending: [],
  private_chat: [],
  document: [],
});
