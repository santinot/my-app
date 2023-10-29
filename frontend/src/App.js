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
socket.on("test", (data) => {
  console.log(data);
});

function App() {
  const [count, setCount] = useState(0);
  // Hooks
  useEffect(() => {
    console.log("sono nel useEffect");
  }, [count]);
  
  // fetch("http://localhost:3001/api/whatsapp/login", {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // })
  // .then((response) => {
  //   console.log(response);
  // })

  function handleClick() {
    setCount(count + 1);
    console.log("mi sto connettendo..")
  }

  return (
    <div className="App">
      <AppAppBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Index dell'applicazione web
        </p>
        <div>
        <Button variant="contained" onClick={handleClick}>Accedi a Whatsapp</Button>
        </div>
      </header>
    </div>
  );
}

export default withRoot(App);
