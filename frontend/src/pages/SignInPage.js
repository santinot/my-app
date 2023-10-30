import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { Avatar, Grid } from "@mui/material";

export default function Login() {
  const handleWhatsAppLogin = () => {
    // Gestisci l'accesso a WhatsApp qui
  };

  const handleGmailLogin = () => {
    // Gestisci l'accesso a Gmail qui
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: 'center',
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        background: "#081627",
        height: "100vh",
      }}
    >
      <Paper
        elevation={2}
        style={{
          marginBottom: "16px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#0068ad",
          borderRadius: "20px",
        }}
      >
      <Grid container alignItems="center">
      <Avatar
          aria-label="whatsapp"
          src={"img/network.png"}
          variant="square"
          sx={{ width: 70, height: 70, mr: 2 }}
        />

        <Typography variant="h3" align="center" style={{ color: "white" }}>
        MessageHub Application
        </Typography>

        </Grid>
      </Paper>
      <TextField
        label="Username"
        variant="filled"
        style={{
          marginBottom: "16px",
          width: "300px",
          backgroundColor: "#e3e7f2",
          borderRadius: "4px",
        }}
      />
      <Button
        variant="contained"
        size="large"
        style={{ marginBottom: "16px", minWidth:"500px", borderRadius:"20px", backgroundColor: "#2eb161" }}
        onClick={handleWhatsAppLogin}
      >
        <Avatar
          aria-label="whatsapp"
          src={"img/whatsappIcon.png"}
          variant="square"
          sx={{ width: 40, height: 40, marginRight: "10px" }}
        />
        <Typography  align="center" style={{ color: "black", fontSize:"30px" }}>
          Accedi con WhatsApp
        </Typography>
      </Button>

      <Button
        variant="contained"
        size="large"
        style={{ marginBottom: "16px", minWidth:"500px", borderRadius:"20px", backgroundColor: "#f05042" }}
        onClick={handleGmailLogin}
      >
        <Avatar
          aria-label="gmail"
          src={"img/google.png"}
          variant="square"
          sx={{ width: 40, height: 40, marginRight: "10px" }}
        />
        <Typography  align="center" style={{ color: "black", fontSize:"30px" }}>
          Accedi con Gmail
        </Typography>
      </Button>
    </div>
  );
}
