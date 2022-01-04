import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UserContext } from "../components/context";
import { useParams } from "react-router-dom";

// this is the same event name as our server. This will allow communication between the server and client possible.
const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:8080";
const BASE_URL = "http://localhost:8080/";

const useChatPrivateRoom = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const [user] = useContext(UserContext);
  let { kidID } = useParams();
  const [currentKid, setCurrentKid] = useState();

  useEffect(() => {
    fetch(`${BASE_URL}api/kids/${kidID}`)
      .then((res) => res.json())
      .then((data) => {
        setCurrentKid(data);
        setMessages(data.private_chat);
      });
  }, [kidID]);

  useEffect(() => {
    if (currentKid && messages.length > 0) {
      fetch(`${BASE_URL}api/kids/${kidID}`, {
        method: "POST",
        body: JSON.stringify({
          ...currentKid,
          private_chat: messages,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    }
  }, [messages, currentKid, kidID]);

  useEffect(() => {
    // create a new client with our server url
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // listen for incoming message
    socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        //Change to names, and images
        uniqueId: Math.floor(Math.random() * Date.now()),
        userId: user._id,
        name: `${user.first_name} ${user.last_name}`,
        image: user.image,
        theme: user.theme,
      };
      // send the new message to the others in the same room.
      setMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [user.first_name, user.last_name, user.image, user.theme, user._id]);

  // send the messagee along with a sender id. The sender id would allow us to style the UI just like a message app like iOS.
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_MESSAGE_EVENT, {
      message: messageBody,
      senderId: socketRef.current.id,
    });
  };

  return { messages, sendMessage };
};

export default useChatPrivateRoom;
