import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";
import withRoot from "./pages/modules/withRoot";
import AppAppBar from "./pages/modules/views/AppAppBar";
import Message from "./pages/modules/components/Message";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

socket.on("connect", () => {
  console.log("sono connesso");
});
socket.on("test", (data) => {
  console.log(data);
});

function App() {
  // Hooks
  const [x, setMessage] = useState("");
  useEffect(() => {
    fetch("http://localhost:3001/api/test", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((response) => {
      response.json().then((data) => {
        setMessage(data.message); 
        console.log(data) // Printed twice for the strict mode
      })
    })
      // .then((response) => response.json())
      // .then((data) => setMessage(data.message));
  }, []);

  const [count, setCount] = useState(0);

  function click() {
    setCount(count + 1);
    setMessage("Hai cliccato " + (count+1) + " volte");
  }

  return (
    <div className="App">
      <AppAppBar />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
      <Message />
          Index dell'applicazione web
        </p>
        <div>{x}</div>
        <div>
          <Button count={count} onClick={click} />
          <Button count={count} onClick={click} />
        </div>
      </header>
    </div>
  );
}

function Button({count, onClick}) {
  return <button onClick={onClick}>{count}</button>;
}

export default withRoot(App);
