import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
} from "@mui/material";
import * as React from "react";
import GmailAttachments from "./GmailAttachments";
import HomeSplitButton from "./HomeSplitButton";

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

export default function HomeMessage(props) {
  const { message, splitBtn } = props;
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
    <Card sx={{ textAlign: "left", margin: 1, minWidth: "890px" }} id={id}>
      <CardHeader
        avatar={
          <Avatar
            aria-label="user"
            src={"img/" + type + ".png"}
            variant="square"
          />
        }
        title={title}
        subheader={subheader}
        action={
          <div style={{ display: "flex", flexDirection: "column" }}>
            {splitBtn ? <HomeSplitButton info={{id, title, subheader, body, type}}/> : null}
          </div>
        }
      />
      <GmailAttachments attachments={attachments} messageId={id} />
      {cardContent(body)}
    </Card>
  );
}
