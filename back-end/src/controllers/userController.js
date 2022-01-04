import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserSchema } from "../models/user";

const User = mongoose.model("User", UserSchema);

export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized User" });
  }
};

export const signUp = (req, res) => {
  const newUser = new User(req.body);
  newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);
  newUser.save((err, user) => {
    if (err) {
      return res.status(400).send({
        message: err,
      });
    } else {
      user.hashPassword = undefined;
      return res.json(user);
    }
  });
};

export const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(401).json({ message: "No user found." });
    } else if (user) {
      if (!user.comparePassword(req.body.password, user.hashPassword)) {
        res.status(401).json({ message: "Incorrect password." });
      } else {
        return res.json({
          user,
          token: jwt.sign(
            {
              email: user.email,
              first_name: user.first_name,
              last_name: user.last_name,
              _id: user.id,
            },
            "KidSpaceRocks"
          ),
        });
      }
    }
  });
};

export const getUsers = (req, res) => {
  User.find({}, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

export const getUserByID = (req, res) => {
  User.findById(req.params.userID, (err, user) => {
    if (err) res.send(err);
    res.json(user);
  });
};

export const updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) res.send(err);
      res.json(user);
    }
  );
};

export const deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userID }, (err, user) => {
    if (err) res.send(err);
    res.json({ message: "User deleted." });
  });
};
