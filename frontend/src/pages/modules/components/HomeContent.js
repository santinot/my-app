import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeMessage from "./HomeMessage";
import HomeThread from "./HomeThread";
import HomeContactThread from "./HomeContactThread";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import io from "socket.io-client";
let uniqueKey = 0;
const socket = io.connect("http://localhost:3001");

socket.on("connect", () => {
  console.log("sono connesso");
});

export default function HomeContent(props) {
  const { user } = props;
  const [messages, setMessages] = useState([]);
  const [flag, setFlag] = useState(0);

  //Consente l'aggiornamento del component quando viene ricevuto o inviato un nuovo messaggio
  // socket.on("newMessage", () => {
  //   setFlag(!flag);
  // });

  useEffect(() => {
    fetch("http://localhost:3001/api/message/getMessages/" + user, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setMessages(data);
        console.log(data);
      });
    });
  }, [flag, user]);

  return (
    <Paper sx={{ maxWidth: 936, margin: "auto", overflow: "hidden" }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: "block" }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by email address, phone number, or user UID"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: "default" },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Tooltip title="Reload">
                <IconButton onClick={() => setFlag(!flag)}>
                  <RefreshIcon color="inherit" sx={{ display: "block" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {messages.length === 0 ? (
        <Box sx={{ width: "100%", mt: 1 }}>
          <LinearProgress sx={{ height: "10px" }} />
        </Box>
      ) : (
        messages.map((message) => {
          if (Array.isArray(message)) {
            return <HomeThread key={uniqueKey++} threads={message} />;
          } else if (typeof message.values !== "undefined") {
            return <HomeContactThread key={uniqueKey++} threads={message} />;
          } else {
            return <HomeMessage key={message.id} message={message} />;
          }
        })
      )}
    </Paper>
  );
}
