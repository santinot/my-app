import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
} from "@mui/material";
import * as React from "react";

export default function ContactsInfoBox(props) {
  const { info } = props;
  if (!info) {
    return null;
  }
  const id = info._id;
  const name = info.label;
  const email = info.email;
  const whatsapp = info.whatsapp;
  return (
    <Card sx={{ textAlign: "left", margin: 1, minWidth: "250px" }} id={id}>
      <CardHeader
        avatar={
          <Avatar aria-label="user" src="img/user.png" variant="square" sx={{ width: 45, height: 45 }} />
        }
        title={
          <Typography variant="h6" gutterBottom>
            <Typography variant="button" gutterBottom>
              Nome Contatto: <br />
            </Typography>
            {name}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 0, mb: -2 }}>
        <Typography variant="h6" gutterBottom>
          <Typography variant="button" gutterBottom>
            Indirizzo Email: <br />
          </Typography>
          {email}
        </Typography>
        <Typography variant="h6" gutterBottom>
          <Typography variant="button" gutterBottom>
            Numero di Cellulare: <br />
          </Typography>
          +39 {whatsapp}
        </Typography>
      </CardContent>
    </Card>
  );
}