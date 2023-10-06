import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import Message from "./Message";

export default function Content() {
  const [emails, setEmails] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/email/me/getEmails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setEmails(data);
        console.log(data); // Printed twice for the strict mode
      });
    });
  }, []);

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/api/whatsapp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setMessages(data);
        console.log(data); // Printed twice for the strict mode
      });
    });
  }, []);

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
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: "block" }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      {emails.map((email) => (
        <Message
          key={email[0]}
          id={email[0]}
          title={email[1]}
          subheader={email[2]}
          body={email[3]}
        />
      ))}
      {messages.map((message) => (
        <Message 
          key={message[0]}
          id={message[0]}
          title={message[1]}
          subheader={message[2]}
          body={message[3]}
        />
      ))}
    </Paper>
  );
}
