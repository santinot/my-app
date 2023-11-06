import * as React from "react";
import {
  Grid,
  Avatar,
  CardHeader,
  TextField,
  Typography,
  Button,
  CardContent,
  Card,
} from "@mui/material";
import { validationEmail } from "../form/validation";

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

export default function ContactsPut(props) {
  const { info, user } = props;
  const [name, setName] = React.useState(info.name);
  const [email, setEmail] = React.useState(info.email);
  const [whatsapp, setWhatsapp] = React.useState(info.whatsapp);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name":
        setName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "whatsapp":
        setWhatsapp(value);
        break;
      default:
        break;
    }
  };

  const updateContact = () => {
    if (email === "" || whatsapp === "") {
      return alert("Riempire tutti i campi");
    }
    if (validationEmail(email) && !isNaN(whatsapp)) {
      fetch("http://localhost:3001/api/contact/updateContact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user,
          id: info.id,
          email: email,
          whatsapp: whatsapp,
        }),
      }).then((response) => {
        response.status === 200
          ? window.location.reload()
          : alert("Errore nella modifica del contatto, riprova");
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
            Modifica le informazioni del contatto
          </Typography>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={3} align="center">
            <Avatar
              src="/img/form.png"
              variant="square"
              sx={{ width: 56, height: 56 }}
            />
          </Grid>
          <Grid item xs={9}>
            <TextField
              name="name"
              label="Nome Contatto"
              type="search"
              variant="filled"
              value={name}
              onChange={handleInputChange}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="email"
              label="Indirizzo Email"
              type="search"
              variant="filled"
              value={email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="whatsapp"
              label="Numero di Cellulare"
              type="search"
              variant="filled"
              placeholder="+39 "
              value={whatsapp}
              inputProps={{ maxLength: 10 }}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} align="right">
            <Button
              key={info.id}
              size="large"
              variant="contained"
              sx={{ mt: -1 }}
              onClick={updateContact}
            >
              Modifica
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
