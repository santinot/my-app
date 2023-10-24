import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
} from "@mui/material";
import * as React from "react";

function cardContent(body) {
  if (body === "") {
    return null;
  } else {
    return (
      <CardContent sx={{ paddingTop: "0px" }}>
        <Typography variant="subtitle2" color="text.primary" gutterBottom sx={{ my: -1, mb:1 }}>
          Ultimo Messaggio:
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ my: -1 }} >
          {body}
        </Typography>
      </CardContent>
    );
  }
}

export default function HomeContactCard(props) {
  const { message, label } = props;
  if (!message) {
    return null;
  }
  const id = message.id;
  const title = label;
  const body = message.snippet;
  return (
    <Card sx={{ textAlign: "left", margin: 1, minWidth: "890px" }} id={id}>
      <CardHeader
        avatar={
          <Avatar aria-label="user" src="img/contacts.png" variant="square" />
        }
        title={
          <Typography variant="h6" gutterBottom>
            <Typography variant="button" gutterBottom>
              Contatto in Rubrica: <br />
            </Typography>
            {title}
          </Typography>
        }
      />
      {cardContent(body)}
    </Card>
  );
}
