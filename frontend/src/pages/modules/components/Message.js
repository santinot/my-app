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
        <Typography variant="body2" color="text.secondary" sx={{ my: -1 }}>
          {body}
        </Typography>
      </CardContent>
    );
  }
}

function Message(props) {
  const { message } = props;
  const id = message.id;
  const title = message.from;
  const subheader = message.subject + " - " + message.date;
  const body = message.snippet;
  const attachments = Array.isArray(message.type) ? message.type[1] : [];
  return (
    <Card sx={{ textAlign: "left", margin: 1, minWidth:"890px" }} id={id}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
            SM
          </Avatar>
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
