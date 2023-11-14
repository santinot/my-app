import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Grid,
} from "@mui/material";
import GmailAttachments from "./GmailAttachments";
import HomeSplitButton from "./HomeSplitButton";
import GmailBtn from "./GmailBtn";
import WhatsappBtn from "./WhatsappBtn";

export default function HomeMessage(props) {
  // Prevent the click event from propagating to the Accordion element
  const handleClick = (e) => {
    e.stopPropagation();
  };

  const { message, contact } = props;
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
          <>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                {message.sentiment ? (
                  <Avatar
                    aria-label="sentiment"
                    src={"img/" + message.sentiment + ".png"}
                    variant="square"
                    sx={{ display: "flex", justifyContent: "center" }}
                  />
                ) : null}
              </Grid>
              <Grid item xs={message.sentiment ? 10 : 0}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {contact ? (
                    <HomeSplitButton
                      info={{ id, title, subject, body, type, contact }}
                    />
                  ) : null}
                  {contact === undefined && type === "gmail" ? (
                    <GmailBtn info={{ id, title, subject, body, type }} />
                  ) : null}
                  {contact === undefined && type === "whatsapp" ? (
                    <WhatsappBtn info={{ id, title, subject, body, type }} />
                  ) : null}
                </div>
              </Grid>
            </Grid>
          </>
        }
      />

      <GmailAttachments attachments={attachments} messageId={id} />
      {body === "" ? null : (
        <CardContent>
          <Typography variant="subtitle1" color="text.primary" sx={{ my: -1 }}>
            {body}
          </Typography>
        </CardContent>
      )}
    </Card>
  );
}
