import { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { UserContext } from "../components/context";

// this is the same event name as our server. This will allow communication between the server and client possible.
const NEW_MESSAGE_EVENT = "new-message-event";
const SOCKET_SERVER_URL = "http://localhost:8080";
const BASE_URL = "http://localhost:8080/";

const usePublicRoom = () => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();
  const [user] = useContext(UserContext);

  useEffect(() => {
    // create a new client with our server url
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    // listen for incoming message
    socketRef.current.on(NEW_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        //ADD CURRENT DATE
        uniqueId: Math.floor(Math.random() * Date.now()),
        userId: user._id,
        name: `${user.first_name} ${user.last_name}`,
        image: user.image,
        theme: user.theme,
      };
      fetch(`${BASE_URL}api/chat`, {
        method: "POST",
        body: JSON.stringify(incomingMessage),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

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

export default usePublicRoom;
