import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import HomeMessage from "./HomeMessage";
import LinearProgress from "@mui/material/LinearProgress";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
let uniquekey = 0;

export default function GmailContent() {
  const [showProgress, setShowProgress] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/whatsapp/chats", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setMessages(data);
      });
    });
  }, []);
  console.log(messages);

  return (
    <Paper sx={{ margin: "auto", overflow: "hidden", maxWidth: "900px" }}>
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
            Elenco WhatsApp-Messages
          </Typography>
        </Toolbar>
      </AppBar>

      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {messages.length === 0 ? (
            <Box sx={{ width: "100%", mt: 1 }}>
              {showProgress ? (
                <LinearProgress sx={{ height: "10px", marginTop: "10px" }} />
              ) : (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Alert
                    severity="info"
                    sx={{ marginTop: "20px", width: "30%", textAlign: "left" }}
                  >
                    <AlertTitle>
                      <strong>Nessun WhatsApp-Message Ricevuto</strong>
                    </AlertTitle>
                  </Alert>
                </div>
              )}
            </Box>
          ) : (
            messages.map((message) => (
              <Grid item key={uniquekey++}>
                <HomeMessage key={uniquekey++} message={message} />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Paper>
  );
}
