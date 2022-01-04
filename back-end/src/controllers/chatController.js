import mongoose from "mongoose";
import { ChatSchema } from "../models/chat";

const Chat = mongoose.model("Chat", ChatSchema);

export const getAllChat = (req, res) => {
  Chat.find({}, (err, chat) => {
    if (err) res.send(err);
    res.json(chat);
  });
};

export const getChatByID = (req, res) => {
  Chat.findById(req.params.chatID, (err, chat) => {
    if (err) res.send(err);
    res.json(chat);
  });
};

export const addChat = (req, res) => {
  let newChat = new Chat(req.body);
  newChat.save((err, chat) => {
    if (err) res.send(err);
    res.json(chat);
  });
};

export const updateChat = (req, res) => {
  Chat.findOneAndUpdate(
    { _id: req.params.chatID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, chat) => {
      if (err) res.send(err);
      res.json(chat);
    }
  );
};

export const deleteChat = (req, res) => {
  Chat.deleteOne({ uniqueId: req.params.chatID }, (err, chat) => {
    if (err) {
      res.send(err);
    } else {
      res.json({ message: "Message deleted." });
    }
  });
};
