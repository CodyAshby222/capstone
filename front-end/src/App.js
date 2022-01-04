import "./styles/main.css";
import "./styles/buttons.css";
import "./styles/navbar.css";
import "./styles/images.css";
import "./styles/margin.css";
import "./styles/padding.css";
import "./styles/text.css";
import "./styles/card.css";
import "./styles/data.css";
import "./styles/theme.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/navbar";
import Switches from "./components/switch";
import { KidContext, TokenContext, UserContext } from "./components/context";
import React, { useState, useEffect } from "react";

export default function App() {
  const [user, setUser] = useState();
  const [token, setToken] = useState();
  const [kids, setKids] = useState([]);

  useEffect(() => {
    let retrieveUser = localStorage.getItem("User");
    setUser(JSON.parse(retrieveUser));
    let retrieveToken = localStorage.getItem("Token");
    setToken(JSON.parse(retrieveToken));
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      <TokenContext.Provider value={[token, setToken]}>
        <KidContext.Provider value={[kids, setKids]}>
          <Router>
            <Navbar />
            <Switches />
          </Router>
        </KidContext.Provider>
      </TokenContext.Provider>
    </UserContext.Provider>
  );
}
