import mongoose from "mongoose";
import { KidSchema } from "../models/kid";
import { unlinkSync } from "fs";

const Kid = mongoose.model("Kid", KidSchema);

export const getKids = (req, res) => {
  Kid.find({}, (err, kid) => {
    if (err) res.send(err);
    res.json(kid);
  });
};

export const getKidByID = (req, res) => {
  Kid.findById(req.params.kidID, (err, kid) => {
    if (err) res.send(err);
    res.json(kid);
  });
};

export const addKid = (req, res) => {
  let newKid = new Kid(req.body);
  newKid.save((err, kid) => {
    if (err) res.send(err);
    res.json(kid);
  });
};

export const updateKid = (req, res) => {
  Kid.findOneAndUpdate(
    { _id: req.params.kidID },
    req.body,
    { new: true, useFindAndModify: false },
    (err, kid) => {
      if (err) res.send(err);
      res.json(kid);
    }
  );
};

export const deleteKid = (req, res) => {
  Kid.deleteOne({ _id: req.params.kidID }, (err, kid) => {
    let imageArray = req.body.image.split("images/");
    try {
      unlinkSync(`public/images/${imageArray[1]}`);
    } catch (err) {}
    if (err) res.send(err);
    res.json({ message: "Kid deleted." });
  });
};

export const deleteDocument = (req, res) => {
  let docArray = req.body.doc.split("documents/");
  try {
    unlinkSync(`public/documents/${docArray[1]}`);
  } catch (err) {}
};
