import React, { useRef, useState, useEffect, useContext } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { UserContext } from "../components/context";
import usePrivateChatRoom from "./useChatRoom";

const BASE_URL = "http://localhost:8080/";

const PrivateRoom = ({ kidData }) => {
  const [user] = useContext(UserContext);
  const { messages, sendMessage } = usePrivateChatRoom();
  const [newMessage, setNewMessage] = useState("");
  const messageRef = useRef();
  const [disable, setDisable] = useState(true);
  const [hideMessage, setHideMessage] = useState([]);
  const Filter = require("bad-words");

  const handleNewMessageChange = (event) => {
    if (event.target.value.trim() === "") {
      setDisable(true);
      setNewMessage(event.target.value);
    } else {
      setDisable(false);
      setNewMessage(event.target.value);
    }
  };

  const handleSendMessage = () => {
    if (newMessage !== "") {
      let filter = new Filter({ placeHolder: `.` });
      let updateMessage = newMessage;
      let cleanMessage = filter.clean(updateMessage);
      sendMessage(cleanMessage);
      setNewMessage("");
      setDisable(true);
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "Enter") {
      if (newMessage !== "") {
        let filter = new Filter({ placeHolder: `.` });
        let updateMessage = newMessage;
        let cleanMessage = filter.clean(updateMessage);
        sendMessage(cleanMessage);
        setNewMessage("");
        setDisable(true);
      }
    }
  };

  const deleteMessage = (chat) => {
    let newPrivateChat = kidData.private_chat.filter(
      (message) => message.uniqueId !== chat.uniqueId
    );
    fetch(`${BASE_URL}api/kids/${kidData._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kidData,
        private_chat: newPrivateChat,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
  };

  useEffect(() => messageRef.current.scrollIntoView({ behavior: "smooth" }));

  return (
    <div className="grey-background">
      <h5 className="light-opacity top-sm-padding left-sm-padding">
        Private Chat
      </h5>
      <div className="private-chatbox sm-margin">
        <div>
          {messages
            .filter((message) => !hideMessage.includes(message.uniqueId))
            .map((message, i) => {
              let dateObj = new Date();
              let currentMonth = (dateObj.getMonth() + 1)
                .toString()
                .padStart(2, "0");
              let currentDay = dateObj.getDate().toString().padStart(2, "0");
              let currentYear = dateObj.getFullYear().toString();
              let currentDate = `${currentMonth}/${currentDay}/${currentYear}`;
              return (
                <div
                  key={`Messengers_${i}`}
                  className={`${message.theme}-message message left-sm-margin right-sm-margin`}
                >
                  <div className="row-space-between">
                    <div className="row-plain">
                      <img
                        className={`sm-profile-img sm-${message.theme}-border`}
                        src={message.image}
                        alt="profile-pic"
                      />
                      <h6 style={{ marginLeft: 7, marginBottom: 3 }}>
                        {message.name}
                      </h6>
                    </div>
                    <div className="row-plain  bottom-sm-margin">
                      <div className="source right-sm-margin">
                        {currentDate}
                      </div>
                      {user._id === message.userId ? (
                        <div
                          onClick={() => {
                            deleteMessage(message);
                            setHideMessage((prev) => [
                              ...prev,
                              message.uniqueId,
                            ]);
                          }}
                          className="error right-sm-margin"
                        >
                          X
                        </div>
                      ) : (
                        <div className="error right-sm-margin">
                          &nbsp;&nbsp;
                        </div>
                      )}
                    </div>
                  </div>

                  <div
                    style={{ marginBottom: 5 }}
                    className="top-sm-margin left-sm-margin right-sm-margin"
                  >
                    {message.message}
                  </div>
                </div>
              );
            })}
        </div>
        <div ref={messageRef}></div>
      </div>
      <div className="row-plain bottom-sm-padding left-sm-padding right-sm-padding">
        <input
          style={{ width: 325 }}
          label="Message"
          placeholder="Enter Message"
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyUp={handleKeyUp}
        />
        <div
          className={`send-msg-btn disabled-${disable} left-sm-margin`}
          onClick={handleSendMessage}
        >
          <div className="send-msg-icon">
            <RiSendPlaneFill />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateRoom;
