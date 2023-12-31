import * as React from "react";
import {
  Grid,
  CardHeader,
  Alert,
  Snackbar,
  CardContent,
  Card,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { validationEmail } from "../form/validation";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function GmailSend(props) {
  const { info, closeModal, gmailContact } = props;
  const id = info.id;
  console.log(info)
  const [to, setTo] = React.useState(info.title.match(/<([^>]+)>/)?.[1] ? info.title.match(/<([^>]+)>/)?.[1] : gmailContact );
  const [subject, setSubject] = React.useState("Re:" + info.subject);
  const [body, setBody] = React.useState("");

  //???
  // React.useEffect(() => {
  //   fetch("http://localhost:3001/api/email/me/singleEmail/" + id, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   }).then((response) => {
  //     response.json().then((data) => {
  //       console.log(data);
  //     });
  //   });
  // }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "to":
        setTo(value);
        break;
      case "subject":
        setSubject(value);
        break;
      case "body":
        setBody(value);
        break;
      default:
        break;
    }
  };
  //Snackbar
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    closeModal();
  };

  const sendEmail = () => {
    if (to === "" || subject === "" || body === "") {
      return alert("Riempire tutti i campi");
    }
    if (validationEmail(to) && body !== "") {
      fetch("http://localhost:3001/api/email/me/sendEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          To: to,
          Subject: subject,
          Message: body,
        }),
      })
        .then((response) => {
          response.status === 200
            ? handleClick()
            : alert("Errore nell'invio dell'email, riprova");
        })
        .catch((error) => {
          console.error("Errore nella richiesta:", error);
        });
    } else {
      return alert("Indirizzo non valido o corpo dell'email vuoto");
    }
  };

  return (
    <Card sx={style}>
      <CardHeader
        sx={{ bgcolor: "#009be5", height: "30px" }}
        title={
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Scrivi una nuova Email
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              name="to"
              label="Indirizzo Destinatario"
              type="search"
              variant="filled"
              value={to}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="subject"
              label="Oggetto dell'email"
              type="search"
              variant="filled"
              value={subject}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>

          {/* Box email del mittente?? */}
          {/* <Grid item xs={12}>
            <TextField
              name="body"
              label="Email del mittente"
              type="search"
              variant="filled"
              placeholder="Scrivi qui..."
              multiline
              rows={5}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid> */}

          <Grid item xs={12}>
            <TextField
              name="body"
              label="Corpo dell'email"
              type="search"
              variant="filled"
              placeholder="Scrivi qui..."
              multiline
              rows={15}
              onChange={handleInputChange}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              key={id}
              size="large"
              variant="contained"
              sx={{ mt: -1 }}
              onClick={sendEmail}
            >
              Invia
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Email Inviata Correttamente!
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
}
