import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeMessage from "./HomeMessage";
import HomeThread from "./HomeThread";
import HomeContactThread from "./HomeContactThread";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
let uniqueKey = 0;

export default function HomeContent(props) {
  const { user, socket } = props;
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
    <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Elenco Messaggi
          </Typography>
          <Grid item>
              <Tooltip title="Reload">
                <IconButton onClick={() => setFlag(!flag)}>
                  <RefreshIcon sx={{ display: "block", color:"white" }} />
                </IconButton>
              </Tooltip>
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
