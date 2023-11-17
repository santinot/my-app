import * as React from "react";
import {
  Avatar,
  Grid,
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import QRCode from "react-qr-code";
import Cookies from "js-cookie";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "330px",
  height: "400px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function SignInPage(props) {
  const { socket } = props;
  const [userId, setUserId] = React.useState("");

  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [userFlag, setUserFlag] = React.useState(false);
  const [whatsappFlag, setWhatsappFlag] = React.useState(false);
  const [gmailFlag, setGmailFlag] = React.useState(false);
  const [loadingFlag, setLoadingFlag] = React.useState(false);

  const [qrCode, setQrCode] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  socket.on("clientReady", () => {
    setOpen(false);
    setLoadingFlag(false);
    setWhatsappFlag(true);
  });

  socket.on("qrCode", (qr) => {
    setQrCode(qr);
    setOpen(true);
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "username":
        setUsername(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleUserLogin = () => {
    if (username === "" || password === "") {
      alert("Inserisci un username e una password validi.");
      return;
    } else {
      fetch("http://localhost:3001/api/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }).then((response) => {
        console.log(response);
        response.json().then((data) => {
          if (data.acknowledged === true) {
            setUserFlag(true);
            setUserId(data.userId);
            alert("Accesso effettuato.");
          } else {
            alert("Errore nel login, riprova.");
          }
        });
      });
    }
  };

  const handleWhatsAppLogin = () => {
    if (userFlag === false) {
      alert("Inserisci prima le credenziali di accesso.");
      return;
    } else {
      setLoadingFlag(true);
      fetch("http://localhost:3001/api/whatsapp/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        console.log(response);
      });
    }
  };

  const handleGmailLogin = () => {
    if (userFlag === false) {
      alert("Inserisci prima le credenziali di accesso.");
      return;
    } else {
      fetch("http://localhost:3001/api/email/me/getProfile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => {
        response.json().then((data) => {
          if (data.emailAddress) {
            setGmailFlag(true);
            console.log(data);
          } else if (data.error) {
            alert("Accesso scaduto, riprova.");
          }
        });
      });
    }
  };

  const handleUserSignUp = () => {
    if (username === "" || password === "") {
      alert("Inserisci un username e una password validi.");
      return;
    } else {
      fetch("http://localhost:3001/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      }).then((response) => {
        response.json().then((data) => {
          if (data.acknowledged === true) {
            alert("Account creato con successo.");
          } else {
            alert("Username già in uso, riprova.");
          }
        });
      });
    }
  };

  React.useEffect(() => {
    if (userFlag && whatsappFlag && gmailFlag) {
      if (Cookies.set("userId", userId)) window.location.href = "/home";
      else alert("Errore nel login, riprova.");
    }
  }, [userFlag, whatsappFlag, gmailFlag, userId]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        padding: "16px",
        //background: "#081627",
        background: "#e3e7f2",
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
        name="username"
        label="Username"
        variant="filled"
        style={{
          marginBottom: "16px",
          width: "300px",
          backgroundColor: "#e3e7f2",
          borderRadius: "4px",
        }}
        onChange={handleInputChange}
      />
      <TextField
        name="password"
        label="Password"
        variant="filled"
        type="password"
        style={{
          marginBottom: "16px",
          width: "300px",
          backgroundColor: "#e3e7f2",
          borderRadius: "4px",
        }}
        onChange={handleInputChange}
      />
      <Button
        variant="contained"
        size="large"
        sx={{
          borderRadius: "20px",
          backgroundColor: "#7792BC",
          minWidth: "300px",
        }}
        onClick={handleUserLogin}
      >
        <Typography align="center" style={{textTransform: "none", color: "black", fontSize: "20px" }}>
          Accedi come Utente
        </Typography>
      </Button>
      <Typography align="center" style={{ color: "black", fontSize: "20px" }}>
        oppure
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          marginBottom: "40px",
          borderRadius: "20px",
          backgroundColor: "#7792BC",
          minWidth: "300px",
        }}
        onClick={handleUserSignUp}
      >
        <Typography align="center" style={{textTransform: "none", color: "black", fontSize: "20px" }}>
          Registrati
        </Typography>
      </Button>
      <Button
        variant="contained"
        size="medium"
        style={{
          minWidth: "400px",
          borderRadius: "20px",
          backgroundColor: "#007830",
        }}
        onClick={handleWhatsAppLogin}
      >
        <Avatar
          aria-label="whatsapp"
          src={"img/whatsappIcon.png"}
          variant="square"
          sx={{ width: 40, height: 40, marginRight: "10px" }}
        />
        <Typography align="center" style={{ textTransform: "none", color: "white", fontSize: "25px" }}>
          Accedi con WhatsApp
        </Typography>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography align="center" sx={{ mb: "20px" }}>
            Scannerizza il QR Code con WhatsApp
          </Typography>
          <QRCode value={qrCode} />
        </Box>
      </Modal>

      <Typography align="center" style={{ color: "black", fontSize: "20px" }}>
        e
      </Typography>
      <Button
        variant="contained"
        size="medium"
        style={{
          marginBottom: "16px",
          minWidth: "400px",
          borderRadius: "20px",
          backgroundColor: "#B43A35",
        }}
        onClick={handleGmailLogin}
      >
        <Avatar
          aria-label="gmail"
          src={"img/google.png"}
          variant="square"
          sx={{ width: 40, height: 40, marginRight: "10px" }}
        />
        <Typography align="center" style={{textTransform: "none", color: "white", fontSize: "25px" }}>
          Accedi con Google
        </Typography>
      </Button>
      <FormGroup sx={{ color: "black", mt: "12px" }}>
        <FormControlLabel
          control={
            <Avatar
              aria-label="gmail"
              src={"img/" + (userFlag ? "check-mark" : "available") + ".png"}
              variant="square"
              sx={{ width: 40, height: 40, marginRight: "10px" }}
            />
          }
          label="Accesso Utente"
          sx={{ mb: "12px" }}
        />
        <FormControlLabel
          control={
            <Avatar
              aria-label="gmail"
              src={`img/${whatsappFlag ? 'check-mark' : (loadingFlag ? 'loading' : 'available')}.png`}
              variant="square"
              sx={{ width: 40, height: 40, marginRight: "10px" }}
            />
          }
          label="Accesso WhatsApp"
          sx={{ mb: "12px" }}
        />
        <FormControlLabel
          control={
            <Avatar
              aria-label="gmail"
              src={"img/" + (gmailFlag ? "check-mark" : "available") + ".png"}
              variant="square"
              sx={{ width: 40, height: 40, marginRight: "10px" }}
            />
          }
          label="Accesso Gmail"
          sx={{ mb: "12px" }}
        />
      </FormGroup>
    </div>
  );
}
