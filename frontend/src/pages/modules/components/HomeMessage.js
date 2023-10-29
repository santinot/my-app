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
import GmailBtn from "./GmailBtn";
import WhatsappBtn from "./WhatsappBtn";


export default function HomeMessage(props) {
  const handleClick = (e) => {
    // Evita che l'evento clic si propaghi all'elemento Accordion
    e.stopPropagation();
  };

  const { message, splitBtn } = props;
  if (!message) {
    return null;
  }
  const title = message.from;
  const subheader = message.subject + " - " + message.date;
  const subject = message.subject;
  const body = message.snippet;
  const attachments = Array.isArray(message.type) ? message.type[1] : [];
  const type = Array.isArray(message.type) ? message.type[0] : message.type;
  const id = type === "whatsapp" ? message.chatId : message.id;
  return (
    <Card
      sx={{ textAlign: "left", margin: 1, minWidth: "890px" }}
      id={id}
      onClick={handleClick}
    >
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
            {splitBtn ? (
              <HomeSplitButton info={{ id, title, subject, body, type }} />
            ) : null}
            {splitBtn === undefined && type === "gmail" ? (
              <GmailBtn info={{ id, title, subject, body, type }} />
            ) : null}
            {splitBtn === undefined && type === "whatsapp" ? (
              <WhatsappBtn info={{ id, title, subject, body, type }} />
            ) : null}
          </div>
        }
      />
      <GmailAttachments attachments={attachments} messageId={id} />
      <CardContent>
        <Typography variant="subtitle1" color="text.primary" sx={{ my: -1 }}>
          {body === "" ? null : body}
        </Typography>
      </CardContent>
    </Card>
  );
}
