import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import withRoot from "./pages/modules/withRoot";
import AppAppBar from "./pages/modules/views/AppAppBar";
import io from "socket.io-client";
import Button from "@mui/material/Button";

const socket = io.connect("http://localhost:3001");

socket.on("connect", () => {
  console.log("sono connesso");
});

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Connected to WhatsApp.");
  }, [count]);

  function handleClick() {
    setCount(count + 1);

    fetch("http://localhost:3001/api/whatsapp/login")
      .then((response) => {
        if (response.ok) {
          console.log("API request successful");
        } else {
          console.error("API request failed");
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  }

  return (
    <div className="App">
      <AppAppBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Web Application Index</p>
        <div>
          <Button variant="contained" onClick={handleClick}>
            Accedi a Whatsapp
          </Button>
        </div>
      </header>
    </div>
  );
}

export default withRoot(App);
