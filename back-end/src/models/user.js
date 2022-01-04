import mongoose from "mongoose";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  company_name: {
    type: String,
  },
  is_daycare: {
    type: Boolean,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  theme: {
    type: String,
  },
  created_date: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.methods.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};
