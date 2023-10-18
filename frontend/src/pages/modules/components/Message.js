import { Card, CardContent, CardHeader, Avatar } from "@mui/material";
import { red } from "@mui/material/colors";
import * as React from "react";
import Typography from "./Typography";
import Attachments from "./Attachments";

function cardContent(body) {
  if (body === "") {
    return null;
  } else {
    return (
      <CardContent>
        <Typography variant="subtitle1" color="text.primary" sx={{ my: -1 }}>
          {body}
        </Typography>
      </CardContent>
    );
  }
}

function Message(props) {
  const { message } = props;
  if (!message) {
    return null;
  }
  const id = message.id;
  const title = message.from;
  const subheader = message.subject + " - " + message.date;
  const body = message.snippet;
  const attachments = Array.isArray(message.type) ? message.type[1] : [];
  const type = Array.isArray(message.type) ? message.type[0] : message.type;
  return (
    <Card sx={{ textAlign: "left", margin: 1, minWidth:"890px" }} id={id}>
      <CardHeader
        avatar={
          <Avatar aria-label="user" src={type + ".png"} variant="square"/>
        }
        title={title}
        subheader={subheader}
      />
      <Attachments attachments={attachments} messageId={id} />
      {cardContent(body)}
    </Card>
  );
}

export default Message;
