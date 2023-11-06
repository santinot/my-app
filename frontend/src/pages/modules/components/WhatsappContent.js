import * as React from "react";
import {
  AppBar,
  Toolbar,
  Paper,
  IconButton,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Alert,
  AlertTitle,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeMessage from "./HomeMessage";
let uniquekey = 0;

export default function WhatsappContent() {
  const [showProgress, setShowProgress] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowProgress(false);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
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
            Elenco WhatsApp-Messages
          </Typography>
        </Toolbar>
      </AppBar>
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
    </Paper>
  );
}
