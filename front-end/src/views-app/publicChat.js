import React, { useRef, useState, useEffect, useContext } from "react";

import usePublicRoom from "./usePublicRoom";
import { RiSendPlaneFill } from "react-icons/ri";
import { UserContext } from "../components/context";

const BASE_URL = "http://localhost:8080/";

const PublicRoom = ({ setPublicChat }) => {
  const [user] = useContext(UserContext);
  const { messages, sendMessage } = usePublicRoom();
  const [newMessage, setNewMessage] = useState("");
  const messageRef = useRef();
  const [allChat, setAllChat] = useState();
  const [disable, setDisable] = useState(true);
  const Filter = require("bad-words");
  const [hideMessage, setHideMessage] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}api/chat`)
      .then((res) => res.json())
      .then((data) => {
        if (data.length < 11) {
          setAllChat(data);
        } else {
          let maxData = data.slice(-10);
          setAllChat(maxData);
        }
      });
  }, []);

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
    if (newMessage.trim() !== "") {
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
      if (newMessage.trim() !== "") {
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
    fetch(`${BASE_URL}api/chat/${chat.uniqueId}`, {
      method: "DELETE",
      //JWT TOKEN
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        fetch(`${BASE_URL}api/chat`)
          .then((res) => res.json())
          .then((data) => {
            if (data.length < 11) {
              setAllChat(data);
            } else {
              let maxData = data.slice(-10);
              setAllChat(maxData);
            }
          });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() =>
    messageRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
  );

  return (
    <div className="white-background sm-padding">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
        className="x-close"
        onClick={() => setPublicChat(false)}
      >
        X
      </div>
      <h6 className="text-center bottom-md-margin width-400">
        A Chat Room To Share Your Stories, Give Tips, Ask Questions and Many
        More!
      </h6>

      <div className="public-chatbox">
        <div>
          {allChat?.map((message, i) => {
            let messageArr = message.created_date.split("T");
            let messageDate = messageArr[0].split("-");
            let correctDay = parseInt(messageDate[2]) - 1;
            let day = correctDay.toString().padStart(2, "0");
            let fullDate = `${messageDate[1]}/${day}/${messageDate[0]}`;
            return (
              <div
                key={`AllChat_${i}`}
                className={`${message.theme}-message message right-sm-margin`}
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
                    <div className="source right-sm-margin">{fullDate}</div>
                    {user._id === message.userId ? (
                      <div
                        onClick={() => deleteMessage(message)}
                        className="error right-sm-margin"
                      >
                        X
                      </div>
                    ) : (
                      <div className="error right-sm-margin">&nbsp;&nbsp;</div>
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
                  key={`NewChat_${i}`}
                  className={`${message.theme}-message message right-sm-margin`}
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
      <div className="row-plain top-sm-margin">
        <input
          label="Message"
          style={{ width: 400 }}
          placeholder="Share Your Thoughts"
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

export default PublicRoom;
