import { Card, CardContent, CardHeader, Avatar } from "@mui/material";
import * as React from "react";
import Typography from "./Typography";

function cardContent(body) {
  if (body === "") {
    return null;
  } else {
    return (
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" sx={{ my: -1 }}>
        <Typography variant="subtitle2" color="text.primary" gutterBottom>
              Ultimo Messaggio:
            </Typography>
          {body}
        </Typography>
      </CardContent>
    );
  }
}

function Message(props) {
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
          <Avatar aria-label="user" src="contacts.png" variant="square" />
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

export default Message;
