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

  const [emails, setEmails] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/email/me/getEmails/inbox", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      response.json().then((data) => {
        setEmails(data);
      });
    });
  }, []);
  console.log(emails);

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
            Elenco Email
          </Typography>
        </Toolbar>
      </AppBar>
      {emails.length === 0 ? (
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
                  <strong>Nessuna Email Ricevuta</strong>
                </AlertTitle>
              </Alert>
            </div>
          )}
        </Box>
      ) : (
        emails.map((email) => (
          <Grid item key={uniquekey++}>
            <HomeMessage key={uniquekey++} message={email} />
          </Grid>
        ))
      )}
    </Paper>
  );
}
