import express from "express";
import routes from "./src/routes/routes";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";
import cors from "cors";
import multer from "multer";

const app = express();
const http = require("http").createServer(app);
const PORT = 8080;
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const NEW_MESSAGE_EVENT = "new-message-event";

mongoose.Promise = global.Promise;
//ADD MONGOOSE CONNECT

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jsonwebtoken.verify(
      req.headers.authorization.split(" ")[1],
      "KidSpaceRocks",
      (err, decode) => {
        if (err) req.user = undefined;
        req.user = decode;
        next();
      }
    );
  } else {
    req.user = undefined;
    next();
  }
});

routes(app);

// SET STORAGE - IMAGES
var storage = multer.diskStorage({
  destination: "./public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {},
});

var upload = multer({ storage: storage }).single("image");

app.post("/api/images", (req, res) => {
  upload(req, res, (err) => {
    if (err) res.send(err);
    res.json({
      filename: req.file.filename,
    });
  });
});

//SET STORAGE - DOCUMENTS
var storageDoc = multer.diskStorage({
  destination: "./public/documents",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var uploadDoc = multer({
  storage: storageDoc,
  fileFilter: (req, file, cb) => {},
});

var uploadDoc = multer({ storage: storageDoc }).single("document");

app.post("/api/documents", (req, res) => {
  uploadDoc(req, res, (err) => {
    if (err) res.send(err);
    res.json({
      file: req.file.filename,
    });
  });
});

///

app.use(express.static("public"));

const room = "general";

io.on("connection", (socket) => {
  socket.join(room);
  socket.on(NEW_MESSAGE_EVENT, (data) => {
    io.in(room).emit(NEW_MESSAGE_EVENT, data);
  });

  socket.on("disconnect", () => {
    socket.leave(room);
  });
});

http.listen(PORT, () => {
  console.log(`Server Running on ${PORT} 🚀`);
});
