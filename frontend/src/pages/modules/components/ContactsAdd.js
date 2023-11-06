import * as React from "react";
import {
  Grid,
  Avatar,
  CardHeader,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { validationEmail, validationName } from "../form/validation";

const style = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  height: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ContactsAdd(props) {
  const { contacts, user } = props;
  const [contactName, setContactName] = React.useState("");
  const [contactEmail, setContactEmail] = React.useState("");
  const [contactWhatsapp, setContactWhatsapp] = React.useState("");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "contactName":
        setContactName(value);
        break;
      case "contactEmail":
        setContactEmail(value);
        break;
      case "contactWhatsapp":
        setContactWhatsapp(value);
        break;
      default:
        break;
    }
  };

  const addContact = () => {
    if (contactName === "" || contactEmail === "" || contactWhatsapp === "") {
      return alert("Riempire tutti i campi");
    }
    if (
      !validationName(contactName, contacts) &&
      validationEmail(contactEmail) &&
      !isNaN(contactWhatsapp)
    ) {
      fetch("http://localhost:3001/api/contact/addContact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          label: contactName,
          email: contactEmail,
          whatsapp: contactWhatsapp,
        }),
      }).then((response) => {
        response.status === 200
          ? window.location.reload()
          : alert("Errore nell'inserimento del contatto, riprova");
      });
    } else {
      return alert(
        "Contatto già presente o email non valida o numero di cellulare non valido"
      );
    }
  };

  return (
    <Card sx={style}>
      <CardHeader
        sx={{ bgcolor: "#009be5", height: "30px" }}
        title={
          <Typography variant="h6" component="div" sx={{ color: "white" }}>
            Inserisci le informazioni del contatto
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={3} align="center">
            <Avatar
              src="/img/addcontact.png"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              name="contactName"
              label="Nome Contatto"
              type="search"
              variant="filled"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="contactEmail"
              label="Indirizzo Email"
              type="search"
              variant="filled"
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="contactWhatsapp"
              label="Numero di Cellulare"
              type="search"
              variant="filled"
              placeholder="+39 "
              inputProps={{ maxLength: 10 }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              key={"addContact"}
              size="large"
              variant="contained"
              sx={{ mt: -1 }}
              onClick={addContact}
            >
              Aggiungi
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
