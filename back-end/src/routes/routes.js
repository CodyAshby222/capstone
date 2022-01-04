import {
  getAllChat,
  getChatByID,
  addChat,
  updateChat,
  deleteChat,
} from "../controllers/chatController";
import {
  getKids,
  getKidByID,
  addKid,
  updateKid,
  deleteKid,
  deleteDocument,
} from "../controllers/kidController";
import {
  login,
  signUp,
  loginRequired,
  getUsers,
  updateUser,
  deleteUser,
  getUserByID,
} from "../controllers/userController";

export default function routes(app) {
  //User
  app.route("/api/signup").post(signUp);
  app.route("/api/login").post(login);
  app.route("/api/users").get(getUsers);
  app
    .route("/api/users/:userID")
    .get(getUserByID)
    .post(updateUser)
    .delete(deleteUser);

  //Child
  app.route("/api/kids").get(getKids).post(addKid);
  app
    .route("/api/kids/:kidID")
    .get(getKidByID)
    .post(updateKid)
    .delete(deleteKid);

  //Document Delete
  app.route("/api/delete-document").post(deleteDocument);

  //Chat
  app.route("/api/chat").get(getAllChat).post(addChat);
  app
    .route("/api/chat/:chatID")
    .get(getChatByID)
    .post(updateChat)
    .delete(deleteChat);
}
